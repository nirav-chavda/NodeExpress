// var {ObjectID} = require('mongodb');
// var User = require('../models/User');

exports.index = (req,res) => {
    res.render('index');
};

exports.home = (req,res) => {
    res.render('dashboard');
};
