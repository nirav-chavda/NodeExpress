var express = require('express');
var router = express.Router();
var fs = require('fs');
var {Auth,Guest} = require('../middlewares/Authentication');

router.use((req,res,next) => {
    if((!req.session.user) && (req.cookies.user_sid)) {
        res.clearCookie('user_sid');
    }
    next();
});

var HomeController = require('../controllers/HomeController');
var LoginController = require('../controllers/auth/LoginController');
var RegisterController = require('../controllers/auth/RegisterController');

var dirname = __dirname.replace('\\server\\routes','');

router.use((req,res,next) => {

    var data = `${ new Date().toString() } : ${req.method} - ${req.url} - ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`;
    fs.appendFile(dirname+'/logcat.log' , data+"\n" , (err) => {
        if(err) {
            return console.log('Error while writing log \n',err);
        }
    });
    next();
});

router.get('/',HomeController.index);
router.get('/register',Guest,RegisterController.showRegisterForm);
router.post('/register',Guest,RegisterController.registerUser);
router.get('/login',Guest,LoginController.showLoginForm)
router.post('/login',Guest,LoginController.loginUser);
router.get('/logout',Auth,LoginController.logoutUser);
router.get('/dashboard',Auth,HomeController.home);

router.use((req,res,next)=>{
    res.status(404).render('error_pages/404',{});
});

module.exports = router;