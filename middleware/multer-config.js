/*************************
    implement file upload
 **************************/

//require multer package to allow users to upload images
const multer = require('multer');

//extension file name
const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png'
};

//set up the destination path and filename for incoming files
const storage = multer.diskStorage({
  //where to save file
  destination: (req, file, callback) => {       
    callback(null, 'images');                   
  },
  //set filename
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

//captures single files of the type passed as an argument 
//and use the set storage method to save it to the server's filesystem
module.exports = multer({storage: storage}).single('image');