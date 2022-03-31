const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const { title } = require('process');
const { MongoClient } = require('mongodb');
const mongo = require('./models/dbconnection');
//require('dontenv').config();


//app.use(express.static(path.join(__dirname, 'models')))


const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname), 'views');

app.get('/', (req, res) => {
    res.render('home');
})

app.post('/makecampground', async (req, res) => {
    const camp = new Campground({title: 'test', description: "Testing"});
    await camp.save();
    res.send(camp);
})

app.listen(3000, async () => {
    console.log("Serving on port 3000")
    mongo.getInstance().initialize();
    console.log("Server up and connceted to database");
})

