// var {ObjectID} = require('mongodb');
var Auth = require('./helpers/Auth');

exports.index = (req,res) => {
    res.render('index');
};

exports.home = (req,res) => {
    Auth.user(req).then((user) => {
        res.render('dashboard',{'user':user});
    },(err) => {
        res.send(err.stack);
    });
};
