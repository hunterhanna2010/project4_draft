const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Application = require('../models/application');
const Note = require('../models/note')
const Offer = require('../models/offer')

// Get all users
router.get('/', (req, res) => {
    User.find({}, (err, users) => {
        //all users
        res.json(users);
        console.log(`Found ALL users!1!`);
    });
});



// Get All apps at './apps'
router.get('/apps', (req, res) => {
    Application.find({}, (err, application) => {
        res.json(applications);
        console.log(`found ALL applications`);
    });
});

module.exports = router;