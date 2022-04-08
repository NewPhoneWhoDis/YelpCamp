const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('auth/register');
}

module.exports.register = async(req, res, next) => {
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
}

module.exports.renderLogin = (req, res) => {
    res.render('auth/login');
}

module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    // If the user was not logged in, but tried to access something that required him to be logged in, after a successful log in
    // he will be redirected back to what he was trying to access.
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'You have been logged out successfully!');
    res.redirect('/campgrounds');
}
