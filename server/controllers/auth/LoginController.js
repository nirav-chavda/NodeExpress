var User = require('../../db/models/User');
var {createConnection,exitConnection} = require('../../db/mongoose');

exports.showLoginForm = (req,res) => {
    res.render('auth/login',{});
};

exports.loginUser = (req,res) => {

    var email = req.body.email , password = req.body.password;

    createConnection();

    User.findOne({email : email}).select('+password').then((user) => {
        if(!user) {
            exitConnection();
            req.session.message='Email does not match our records';
            console.log('User not found');
            res.redirect('/login');
        } else {
            User.validatePassword(user.password,password).then((yes) => {
                req.session.user = user._id;
                exitConnection();
                res.redirect('/dashboard'); 
            },(no) => {
                exitConnection();
                console.log('Password mismatch');
                req.session.message='Password does not match';
                res.redirect('/login');   
            });
        }
    },(err) => {
        exitConnection();
        console.log(err.stack);
        res.send(err.stack);
    });
};

exports.providerFail = (req,res) => {
    req.session.message = `Login for ${req.params.provider} has failed !`;    
    console.log(`Login for ${req.params.provider} has failed !`);
    req.redirect('/login');
};

exports.logoutUser = (req,res) => {
    req.session.user = "";
    res.clearCookie('user_sid');
    req.session.message = `User Logged Out !`;
    res.redirect('/login');
};