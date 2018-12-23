var User = require('../../db/models/User');

exports.showRegisterForm = (req,res) => {
    res.render('auth/register',{});
};

exports.registerUser = (req,res) => {

    var user = {
        'full_name' : req.body.name,
        'email': req.body.email,
        'password': req.body.password
    };
     
    User.create(user).then((doc) => {
        req.session.user = doc._id;    
        res.redirect('/dashboard');
    },(err) => {
        //console.log(err);
        res.status(400).send(err.stack);
        //res.redirect('/');
    });
};