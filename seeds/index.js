const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const dbCon = require('../models/dbconnection');
const places = require('./seedHelpers');
const descriptors = require('./seedHelpers');

dbCon.getInstance().initialize();

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 30; i++) {
        const randomNum = Math.floor(Math.random() * 1000);
        const camp = new Campground ({
            location:`´${cities[randomNum].city}, ${cities[randomNum].state}`,
            title: `${sample(descriptors)} ${sample(places)}`
        })
        await camp.save();
    }
    
}

seedDB().then(() => {
    mongoose.connection.close();
})