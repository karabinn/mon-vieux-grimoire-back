const Book = require('../models/Book');

// Créer un livre
exports.createBook = async (req, res) => {
  console.log('Requête reçue !');
  console.log('req.body:', req.body);
  console.log('req.body.book:', req.body.book);
  console.log('req.file:', req.file);

  // Vérification si le champ book est présent
  if (!req.body.book) {
    console.error('Erreur : le champ book est manquant.');
    return res.status(400).json({ message: 'Le livre est requis !' });
  }

  try {
    const bookData = JSON.parse(req.body.book); // On parse les données JSON
    console.log('bookData:', bookData);

    // Vérification si le fichier image est présent
    if (!req.file) {
      console.error('Erreur : fichier image manquant.');
      return res.status(400).json({ message: 'L’image est requise !' });
    }

    // Création d'une nouvelle instance du livre
    const book = new Book({
      ...bookData,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    });

    // Sauvegarde du livre dans la base de données
    await book.save();
    res.status(201).json({ message: 'Livre enregistré avec succès !' });
  } catch (error) {
    console.error('Erreur serveur:', error);
    res.status(400).json({ error });
  }
};

// Modifier un livre
exports.modifyBook = (req, res) => {
  Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre modifié !' }))
    .catch((error) => res.status(400).json({ error }));
};

// Supprimer un livre
exports.deleteBook = (req, res) => {
  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
    .catch((error) => res.status(400).json({ error }));
};

// Récupérer un seul livre
exports.getOneBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => res.status(200).json(book))
    .catch((error) => res.status(404).json({ error }));
};

// Récupérer tous les livres
exports.getAllBooks = (req, res) => {
  Book.find()
    .then((books) => res.status(200).json(books))
    .catch((error) => res.status(500).json({ error }));
};

exports.getBestRatedBooks = (req, res) => {
    Book.find()
    .sort({ averageRating: -1 }) // tri décroissant
    .limit(3) // top 3
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};