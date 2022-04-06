const express = require('express');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('auth/register');
});

router.post('/register', catchAsync(async(req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to Yelp Camp!');
            res.redirect('/campgrounds');
        });
    } catch(e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}))

router.get('/login', (req, res) => {
    res.render('auth/login');
})

// Can be set to authenticate with different routes in the future. For example google, facebook, twitter etc.
// Also failureFlash and Redirect can be moved into separate middleware, I'm using this for simplicity sake.
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }) ,(req, res) => {
    req.flash('success', 'Welcome back!');
    // If the user was not logged in, but tried to access something that required him to be logged in, after a successful log in
    // he will be redirected back to what he was trying to access.
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'You have been logged out successfully!');
    res.redirect('/campgrounds');
})

module.exports = router;