if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}
const express = require('express');
const path = require('path');
const methodOverried = require('method-override');
const mongo = require('./models/dbconnection');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const campgroundsRoute = require('./routes/campgrounds');
const reviewsRoute = require('./routes/reviews')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const usersRoute = require('./routes/users');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();



app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('/views', path.join(__dirname), 'views');

app.use(express.static(path.join(__dirname, 'public/')))
app.use(express.urlencoded({ extended: true}));
app.use(methodOverried('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Prevents simple Mongo Injection
app.use(mongoSanitize({
    replaceWith: '_'
}));


const sessionConfig = {
    name: 'session',
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        // setting the cookie to expire after a week, 1000 mil sec in a second then 60 sec in a min. 60 min in a hour
        // 24 hours in a day and 7 days in a week
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

// In order to support persistent login sessions, passport needs to know how to serialize and deserialize a user.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.loggedUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/campgrounds', campgroundsRoute)
app.use('/campgrounds/:id/reviews', reviewsRoute)
app.use('/', usersRoute)

app.get('/', (req, res) => {
    res.render('home');
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

// heroku set up
const port = process.env.PORT || 3000;
app.listen(port, catchAsync(async () => {
    console.log("Serving on port 3000")
    mongo.getInstance().initialize();
    console.log(`Serving on port ${port}`);
}))

