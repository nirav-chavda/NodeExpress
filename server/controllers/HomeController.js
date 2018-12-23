// var {ObjectID} = require('mongodb');

exports.index = (req,res) => {
    res.render('index');
};

exports.home = (req,res) => {
    res.render('dashboard');
};
