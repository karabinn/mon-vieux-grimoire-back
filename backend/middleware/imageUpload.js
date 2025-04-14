const multer = require('multer');
const sharp = require('sharp');
const path = require('path');

//Stockage en mémoire pour pouvoir redimensionner avec sharp
const storage = multer.memoryStorage();

const upload = multer({ storage });

// Middleware pour redimensionner l’image avant de la sauvegarder dans /images = greencode
const resizeImage = (req, res, next) => {
  if (!req.file) return next(); // Si aucune image n’est envoyée, on passe au middleware suivant

  // Nettoyage du nom du fichier (pas d'espaces)
  const fileName = req.file.originalname.split(' ').join('_').split('.')[0];

  // Format léger pour le green code (webp ou jpeg)
  const extension = 'webp';

  // Création d’un nom de fichier unique avec un timestamp
  const outputFileName = `${fileName}_${Date.now()}.${extension}`;

  // Chemin vers le dossier /images
  const outputPath = path.join(__dirname, '../images', outputFileName);

  // Traitement de l’image avec Sharp : redimensionnement et conversion
  sharp(req.file.buffer)
    .resize(400) // Largeur maximale de 400px
    .toFormat(extension)
    .toFile(outputPath)
    .then(() => {
      // Modification de req.file pour inclure les infos du fichier sauvegardé
      req.file.path = outputPath;
      req.file.filename = outputFileName;
      next();
    })
    .catch((err) => {
      console.error('Erreur lors du traitement de l’image :', err);
      res.status(500).json({ error: "Erreur lors du redimensionnement de l’image" });
    });
};

// Export des middlewares à utiliser dans les routes
module.exports = {
  uploadSingleImage: upload.single('image'),
  resizeImage,
};