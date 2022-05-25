//import sauce schema
const Sauce = require("../models/sauce");
//Node.js File System Module
const fs = require("fs");

exports.createSauce = (req, res, next) => {
  // Parse request sent by "multer-config" middleware
  const sauceObject = JSON.parse(req.body.sauce);
  // Remove ID from request (_id will be set automatically by MongoDB)
  delete sauceObject._id;
  // new istance 
  const sauce = new Sauce({
    // Get all fiels from object
    ...sauceObject,
    // Set image URL
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  // Create new sauce document in MongoDB
  sauce.save().then(() => res.status(201).json({ message: "Sauce saved successfully!" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  // Get "sauce" document (filter : "id" from URL)
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllSauces = (req, res, next) => {
  // Get all sauce documents
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

exports.modifySauce = (req, res, next) => {
  // Get one "sauce" document by id
  Sauce.findOne({ _id: req.params.id }).then((sauce) => {
      // Check if "sauce" document exists
      if (!sauce) {
        return res.status(404).json({
          error: new Error("Sauce not found!"),
        });
      }
      // Check if user ID from PUT request = user ID from "oc-hotTakes" MongoDB
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({
          error: new Error("403: unauthorized request"),
        });
      }
      // Remove file if a new image has been uploaded
      if (req.file) {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, (error) => {
          if (error) {
            throw error;
          }
        });
      }
      // Check if image was modified by user
      const sauceObject = req.file ? {
            // Parse request sent by "multer-config" middleware
            ...JSON.parse(req.body.sauce),
            // Set new image URL
            imageUrl: `${req.protocol}://${req.get("host")}/images/${
              req.file.filename
            }`,
          } : { ...req.body };
      // Modify sauce document
      Sauce.updateOne({ _id: req.params.id },{ ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce modified!" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

exports.likeSauce = (req, res, next) => {
  // Get 'like' and 'ID' from request
  const like = req.body.like;
  const idSauce = req.params.id;
  // Get sauce document
  Sauce.findOne({ _id: idSauce }).then((sauce) => {
    const idIncluded = !sauce.usersLiked.includes(req.body.userId) && !sauce.usersDisliked.includes(req.body.userId);
    if (like === 1 && idIncluded) {
      // Modify sauce document
      Sauce.updateOne({ _id: idSauce }, 
        {
          $push: { usersLiked: req.body.userId },
          $inc: { likes: +1 },
        })
        .then(() => res.status(200).json({ message: "like added!" }))
        .catch((error) => res.status(400).json({ error }));
    } else if (like === -1 && idIncluded) {
      // Modify sauce document
      Sauce.updateOne(
        { _id: idSauce },
        {
          $push: { usersDisliked: req.body.userId },
          $inc: { dislikes: +1 },
        })
        .then(() => res.status(200).json({ message: "dislike added!" }))
        .catch((error) => res.status(400).json({ error }));
    } else {
      if (sauce.usersLiked.includes(req.body.userId)) {
        // Modify sauce document
        Sauce.updateOne({ _id: idSauce },
          {
            $pull: { usersLiked: req.body.userId },
            $inc: { likes: -1 },
          })
          .then(() => res.status(200).json({ message: "like removed!" }))
          .catch((error) => res.status(400).json({ error }));
      } else if (sauce.usersDisliked.includes(req.body.userId)) {
        // Modify sauce document
        Sauce.updateOne(
          { _id: idSauce },
          {
            $pull: { usersDisliked: req.body.userId },
            $inc: { dislikes: -1 },
          })
          .then(() => res.status(200).json({ message: "dislike removed!" }))
          .catch((error) => res.status(400).json({ error }));
      }
    }
  });
};

exports.deleteSauce = (req, res, next) => {
  // Get sauce document
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (!sauce) {
        // Check if sauce document exists
        return res.status(404).json({
          error: new Error("Sauce not found!"),
        });
      }
      // Check if user ID from DELETE request = user ID from "oc-hotTakes" MongoDB
      if (sauce.userId !== req.auth.userId) {
        return res.status(403).json({
          error: new Error("403: unauthorized request"),
        });
      }
      // Remove file from "images" folder
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        // Delete sauce document from MongoDB
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ sauces }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};
