const express = require('express');
const router = express.Router({mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const Review = require('../models/review');
const Campground = require('../models/campground');
const { isReviewAuthor } = require('../middleware/authorizationMiddleware');
const { validateReview } = require('../middleware/campgroundValidation');
const { isLoggedIn } = require('../middleware/authMiddleware');


router.post('/', validateReview, isLoggedIn ,catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    campground.reviews.push(review);
    await review.save();
    await campground.save();
    req.flash('success', 'Thanks for your review!');
    res.redirect(`/campgrounds/${campground._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review successfully deleted!')
    res.redirect(`/campgrounds/${id}`);
}))

module.exports = router;