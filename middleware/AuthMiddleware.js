module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must have an account in order to perform such action!');
        return res.redirect('/login');
    }
    next();
}

// checks if the user is Authenticated


