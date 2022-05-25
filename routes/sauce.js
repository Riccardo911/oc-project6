/*************************************************
    sauce routes -
    contains all of our sauce related business logic
 *************************************************/

const express = require("express");
const sauceCtrl = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

const router = express.Router();

//GET
router.get("/", auth, sauceCtrl.getAllSauces);           
router.get("/:id", auth, sauceCtrl.getOneSauce);         
//POST
router.post("/", auth, multer, sauceCtrl.createSauce);   
router.post("/:id/like", auth, sauceCtrl.likeSauce);     
//PUT
router.put("/:id", auth, multer, sauceCtrl.modifySauce); 
//DELETE
router.delete("/:id", auth, sauceCtrl.deleteSauce);


module.exports = router;
