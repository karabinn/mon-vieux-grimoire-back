const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Permet les requêtes CORS depuis le frontend
app.use(express.json()); // Permet de gérer les corps de requêtes en JSON

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connecté'))
  .catch((err) => console.log('Erreur de connexion MongoDB:', err));

// Routes
const bookRoutes = require('./routes/bookRoutes');
const userRoutes = require('./routes/userRoutes');

// Usage des routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);

module.exports = app;