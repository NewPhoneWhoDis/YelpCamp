const mongoose = require('mongoose');
const Schema = new mongoose.Schema;

const CampgroundSchema = new mongoose.Schema({
    title: String,
    price: Number,
    image: String,
    description: String,
    location: String
});

module.exports = mongoose.model('Campground', CampgroundSchema);