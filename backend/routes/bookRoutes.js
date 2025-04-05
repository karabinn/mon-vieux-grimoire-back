/* eslint-disable no-unused-vars */
const express = require('express');

const router = express.Router();

const bookCtrl = require('../controllers/bookController');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');


router.get('/', bookCtrl.getAllBooks);
router.post('/', auth, multer, bookCtrl.createBook);
router.get('/:id', bookCtrl.getOneBook);
router.put('/:id', bookCtrl.modifyBook);
router.delete('/:id', bookCtrl.deleteBook);

module.exports = router;
