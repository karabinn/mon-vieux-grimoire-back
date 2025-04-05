const multer = require('multer');

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'images'); // Stocke l'image dans le dossier "images"
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = file.mimetype.split('/')[1];
    callback(null, `${name}_${Date.now()}.${extension}`);
  },
});

const upload = multer({ storage: storage });

module.exports = upload.single('image');
// module.exports = multer({ storage }).single('image'); // Gère 1 seul fichier "image"
