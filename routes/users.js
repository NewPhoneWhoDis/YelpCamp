const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');
const usersController = require('../controllers/usersAuth');

router.route('/register')
    .get(usersController.renderRegister)
    .post(catchAsync(usersController.register));

// Can be set to authenticate with different routes in the future. For example google, facebook, twitter etc.
// Also failureFlash and Redirect can be moved into separate middleware, I'm using this for simplicity sake.
router.route('/login')
    .get(usersController.renderLogin)
    .post(passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), usersController.login);

router.get('/logout', usersController.logout);

module.exports = router;