const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const { isReviewAuthor } = require('../middleware/authorizationMiddleware');
const { validateReview } = require('../middleware/campgroundValidation');
const { isLoggedIn } = require('../middleware/authMiddleware');
const reviewsController = require('../controllers/reviews');

// routes for review 
router.post('/', validateReview, isLoggedIn ,catchAsync(reviewsController.createReview));

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewsController.deleteReview));

module.exports = router;