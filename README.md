# YelpCamp

![YelpCamp](images\YelpCamp.png)

YelpCamp is a web application that allows users to see and rate campgrounds around the world. You can also create an account and create your own campsite.

## Overview

The tools used to build this web application are:

- JavaScript
- node.js
- MongoDB
- Bootstrap
- Cloudinary
- Mapbox

- Frontend:
  I use Bootstrap for the front end of the project and rendering templates with dynamic content using ejs. For the display of the cluster and the default map, I use Mapbox GL JS, an open source JavaScript library that uses Mapbox GL to display interactive maps. For the star animation in the reviews I use starability, which provides access to rating forms with animations. More information can be found here: lunarlogic.github.io/starability/.

- Backend
  For the backend, I use MongoDB Atlas with the help of Mongoose to connect between the database and my Express app. I use joi for schema validation and connect-mongo to create a MongoDB session store. For authentication, I use passport, which does all the work for me.
