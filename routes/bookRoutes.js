// routes/bookRoutes.js
const express = require('express');
const router = express.Router();
const bookController = require('../controller/bookController');
const authMiddleware = require('../middleware/authMiddleware');
router.get('/books',bookController.getAllBooks);
router.get('/books/:id', bookController.getSingleBook);
router.post('/books', authMiddleware,bookController.createBook);
router.put('/books/:id', authMiddleware,bookController.updateBook);
router.delete('/books/:id', authMiddleware,bookController.deleteBook);

module.exports = router;
