const express = require('express');
const router = express.Router();

const userCtrl = require('../controllers/userController');

// Route d'inscription
router.post('/signup', userCtrl.signup);
// Route de connexion
router.post('/login', userCtrl.login);

module.exports = router;
