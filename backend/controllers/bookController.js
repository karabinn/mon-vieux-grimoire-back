const Book = require('../models/Book');
const fs = require('fs');
const path = require('path');

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
  console.log('Modification du livre avec ID:', req.params.id);

  Book.findOne({ _id: req.params.id })
    .then((book) => {
        if (!book) {
        return res.status(404).json({ message: 'Livre non trouvé' });
        }
        if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: 'Requête non autorisée' });
        }
    // Supprimer _id s'il est présent dans req.body
    delete req.body._id;
    
    Book.updateOne({ _id: req.params.id }, { ...req.body, _id: req.params.id })
      .then(() => {
        console.log('Livre modifié');
        res.status(200).json({ message: 'Livre modifié !' });
      })
      .catch((error) => {
        console.error('Erreur lors de la mise à jour:', error);
        res.status(400).json({ error });
      });
    })
    .catch((error) => {
        console.error('Erreur serveur lors de la recherche du livre:', error);
        res.status(500).json({ error });
    });
};

// Supprimer un livre
exports.deleteBook = (req, res) => {
  Book.findOne({ _id: req.params.id })
    .then((book) => {
        if (!book) {
            return res.status(404).json({ message: 'Livre non trouvé' });
        }
        if (book.userId !== req.auth.userId) {
        return res.status(403).json({ message: 'Requête non autorisée'});
        }
        const filename = book.imageUrl.split('/images/')[1];

        fs.unlink(path.join('images', filename), (err) => {
          if (err) {
            console.error('Erreur lors de la suppression de l’image :', err);
            return res.status(500).json({ message: 'Erreur lors de la suppression du fichier' });
          }    

  Book.deleteOne({ _id: req.params.id })
    .then(() => res.status(200).json({ message: 'Livre supprimé !' }))
    .catch((error) => res.status(400).json({ error }));
    })
  });
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

exports.rateBook = (req,res) => {
    const { userId, rating } = req.body;
    if (rating < 0 || rating > 5) {
        return res.status(400).json({ error: 'La note doit être en 0 et 5.' });
    }

    Book.findOne({ _id: req.params.id})
    .then(book => {
        const alreadyRated = book.ratings.some((rating) => rating.userId.toString() === userId);
    if (alreadyRated) {
          return res.status(403).json({ message: 'Vous avez déjà noté ce livre.' });
    }
        
    // Ajouter la note dans le tableau "ratings"
    book.ratings.push({ userId, grade: rating });

    // Calculer la nouvelle note moyenne
    const totalRatings = book.ratings.reduce((sum, rating) => sum + rating.grade, 0);
    book.averageRating = totalRatings / book.ratings.length;

    // Sauvegarder le livre mis à jour
    book.save()
    .then(() => res.status(200).json(book))
    .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(404).json({ message: 'Livre non trouvé.', error }));
};