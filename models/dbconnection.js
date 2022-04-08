const mongoose = require('mongoose');
//require('dotenv').config();
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

class MongoDB {
    static getInstance() {
        if(!MongoDB.instance) {
            MongoDB.instance = new MongoDB();
        }
        return MongoDB.instance;
    }

    constructor() {
        const connectionString = 'mongodb+srv://Admin:'+process.env.DATABASE_PASSWORD+'@cluster0.vogks.mongodb.net/Cluster0?retryWrites=true&w=majority';

        mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true});

        this.db = mongoose.connection;
        this.db.on('error', (error) => console.error('Error' + error));
        this.db.once('open', function () {
            console.log("connected to mongodb");
        });
    }

    initialize() {
            console.log("initializing db");
        }
}

module.exports = MongoDB;