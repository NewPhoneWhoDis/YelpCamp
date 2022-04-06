const express = require('express');
const path = require('path');
const methodOverried = require('method-override');
const mongo = require('./models/dbconnection');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews')
const session = require('express-session');
const flash = require('connect-flash');

const app = express();

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if(error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    }
}

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('/views', path.join(__dirname), 'views');

app.use(express.urlencoded({ extended: true}));
app.use(methodOverried('_method'));
app.use(express.static(path.join(__dirname, 'public')));

const sessionConfig = {
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // setting to cookie to expire after a week, 1000 mil sec in a second then 60 sec in a min. 60 min in a hour
        // 24 hours in a day and 7 days in a week
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/campgrounds', campgrounds)
app.use('/campgrounds/:id/reviews', reviews)

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

app.listen(3000, catchAsync(async () => {
    console.log("Serving on port 3000")
    mongo.getInstance().initialize();
    console.log("Server up and connceted to database");
}))

