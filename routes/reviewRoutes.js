// routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const reviewController = require('../controller/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/reviews', authMiddleware,reviewController.createReview);
router.put('/reviews/:userId/:id',authMiddleware, reviewController.updateReview);
router.delete('/reviews/:id',authMiddleware, reviewController.deleteReview);

// router.post('/reviews', reviewController.createReview);
// router.put('/reviews/:userId/:id', reviewController.updateReview);
// router.delete('/reviews/:id', reviewController.deleteReview);



module.exports = router;
