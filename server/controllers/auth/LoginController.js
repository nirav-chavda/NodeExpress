var User = require('../../models/User');
var {createConnection,exitConnection} = require('../../db/mongoose');

exports.showLoginForm = (req,res) => {
    res.render('auth/login',{});
};

exports.loginUser = (req,res) => {

    var email = req.body.email , password = req.body.password;

    createConnection();

    User.findOne({email : email}).then((user) => {
        exitConnection();
        if(!user) {
            console.log('User not found');
            res.send(user);
        } else {
            User.validatePassword(password).then((yes) => {
                req.session.user = user._id;
                res.redirect('/dashboard');
            },(no) => {
                console.log('Password mismatch');
                //res.redirect('/login');
                res.send(user);   
            });
        } 
    },(err) => {
        exitConnection();
        console.log(err.stack);
        res.send(err.stack);
    });
};

exports.logoutUser = (req,res) => {
    req.session.destroy();
    res.clearCookie('user_sid');
    res.redirect('/login');
};