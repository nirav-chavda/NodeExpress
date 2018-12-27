// var express = require('express');
// var router = express.Router();
var fs = require('fs');
var {Auth,Guest} = require('../middlewares/Authentication');

module.exports = function(app) {

    app.use((req,res,next) => {
        if((!req.session.user) && (req.cookies.user_sid)) {
            res.clearCookie('user_sid');
        }
        next();
    });

    var HomeController = require('../controllers/HomeController');
    var LoginController = require('../controllers/auth/LoginController');
    var RegisterController = require('../controllers/auth/RegisterController');

    var dirname = __dirname.replace('\\server\\routes','');

    app.use((req,res,next) => {

        var data = `${ new Date().toString() } : ${req.method} - ${req.url} - ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`;
        fs.appendFile(dirname+'/logcat.log' , data+"\n" , (err) => {
            if(err) {
                return console.log('Error while writing log \n',err);
            }
        });
        next();
    });

    app.get('/',HomeController.index);
    app.get('/register',Guest,RegisterController.showRegisterForm);
    app.post('/register',Guest,RegisterController.registerUser);
    app.get('/login',Guest,LoginController.showLoginForm)
    app.post('/login',Guest,LoginController.loginUser);
    app.get('/logout',Auth,LoginController.logoutUser);
    app.get('/dashboard',Auth,HomeController.home);
    app.get('/auth/:provider/fail',Guest,LoginController.providerFail);

    app.use((req,res,next)=>{
        res.status(404).render('error_pages/404',{});
    });

//module.exports = router;
}