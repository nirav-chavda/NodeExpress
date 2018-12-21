var {ObjectID} = require('mongodb');

var User = require('../models/User');

exports.add = (req,res) => {

    var user = {
        'full_name' : "Ram Lakhan",
        'email': `${Math.random().toString(36).substring(7)}@${Math.random().toString(36).substring(7)}.com`,
        'password': "123456"
    };
    
    //It will saves the document and returns the saved document 
    User.create(user).then((doc) => {
        res.send(doc);    
        //res.redirect('/');
    },(err) => {
        console.log(err);
        res.status(400).send(err.stack);
    });
};

exports.index = (req,res) => {
    res.render('index');
};