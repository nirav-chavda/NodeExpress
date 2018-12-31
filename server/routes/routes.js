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
    app.get('/sendMail',(req,res) => {
        var mailOption = {
            from : `Nirav Chavda <${process.env.MAIL_USER}>`,
            to :    `niravdchavda@gmail.com`,
            subject : 'Test' ,
            text : 'Follow Me XD',
            html : '<img src="https://i.ytimg.com/vi/S0ClJ9D1KsI/hqdefault.jpg" width="250" height="250"/><br/><a href="www.instagram.com/___nirav_">crappy coder</a>'
        };

        require('../app/config/mail').transporter.sendMail(mailOption,(err,info) => {
            if(err) {
                res.send(`Something went wrong : ${err}`);
            }  else {
                res.send(`Mail Sent . ${JSON.stringify(info,null,4)}`);            
                var data = `Accepted : ${info.accepted}\n  Rejected : ${info.rejected}\n  MessageSize : ${info.messageSize}\n  Response : ${info.response}\n`;
                fs.appendFile( dirname+'/logcat.log' , data , (error) => { if(error) { console.log(error) } });
            }
        });
    });
    app.get('/video',Auth,HomeController.streamVideo);

    app.use((req,res,next)=>{
        res.status(404).render('error_pages/404',{});
    });

//module.exports = router;
}