var {exitConnection} = require('../db/mongoose');
var {ObjectID} = require('mongodb');

var {User} = require('../models/User');

exports.add = (req,res) => {

    var user = new User({
        'name': "Ram",
        'email': "ndc@gmail.com",
        'password': "123456"
    });
    
    //It will saves the document and returns the saved document 
    user.save().then((doc) => {
        console.log(doc);
        exitConnection();
        res.redirect('/');
    },(err) => {
        console.log(err);
        res.status(400).send(err.stack);
    });
};

exports.index = (req,res) => {
    res.render('index');
};