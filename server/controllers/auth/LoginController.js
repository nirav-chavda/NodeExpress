var User = require('../../db/models/User');
var {createConnection,exitConnection} = require('../../db/mongoose');

exports.showLoginForm = (req,res) => {
    res.render('auth/login',{});
};

exports.loginUser = (req,res) => {

    var email = req.body.email , password = req.body.password;

    createConnection().then(data => {
        
        User.findOne({email : email}).select('+password').then((user) => {
            if(!user) {
                exitConnection();
                req.session.message='Email does not match our records';
                res.redirect('/login');
            } else {
                User.validatePassword(user.password,password).then((yes) => {
                    exitConnection();
                    if(!user.is_verified) {
                        req.session.message='Account is not verified';
                        res.redirect('/login');
                    }
                    req.session.user = user._id;
                    res.redirect('/dashboard'); 
                },(no) => {
                    exitConnection();
                    req.session.message='Password does not match';
                    res.redirect('/login');   
                });
            }
        },(err) => {
            exitConnection();
            console.log(err.stack);
            res.send(err.stack);
        });
        
    }).catch(err => res.status(400).send(err));
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