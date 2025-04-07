/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();

const bookCtrl = require('../controllers/bookController');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

router.get('/bestrating', bookCtrl.getBestRatedBooks);

router.get('/', bookCtrl.getAllBooks);
router.post('/', auth, multer, bookCtrl.createBook);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', auth, bookCtrl.modifyBook);
router.delete('/:id', auth, bookCtrl.deleteBook);
router.post('/:id/rating', auth, bookCtrl.rateBook);

module.exports = router;
