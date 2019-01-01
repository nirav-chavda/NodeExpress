const fs = require('fs');
const bcrypt = require('bcrypt');

var User = require('../../db/models/User');
var PasswordReset = require('../../db/models/PasswordReset');
var {createConnection,exitConnection} = require('../../db/mongoose');

var salt = bcrypt.genSaltSync();

exports.showEmailForm = (req,res) => {
    res.render('auth/password-reset/EmailForm',{});
};

exports.showPasswordForm = (req,res) => {
    res.render('auth/password-reset/PasswordForm');
};

exports.checkAndMail = (req,res) => {

    var email = req.body.email;

    createConnection().then(data => {

        User.findOne({email:email}).then(user => {
            if(!user) {
                req.session.message="Email Address doen not match our records";
                res.redirect('/auth/reset/password');
            }

            var token = Math.random().toString(36);
    
            var mailOption = {
                from : `Nirav Chavda <${process.env.MAIL_USER}>`,
                to :    `niravdchavda@gmail.com`,
                subject : 'Password Reset',
                text : 'Click on the below link to reset the password on Web-App',
                html : `<br/><a href="${process.env.HOST}/auth/reset/password/${token}">Click Here</a>`
            };

            require('../../app/config/mail').transporter.sendMail(mailOption,(err,info) => {
                if(err) {
                    res.send(`Something went wrong : ${err}`);
                } else {
                    var dirname = __dirname.replace('\\server\\controllers\\auth','');            
                    var data = `Accepted : ${info.accepted}\n  Rejected : ${info.rejected}\n  MessageSize : ${info.messageSize}\n  Response : ${info.response}\n`;
                    fs.appendFile(dirname+'/logcat.log' , data , (error) => { if(error) { console.log(error) } });   
                }
            });

            var dataObj = {
                'user_id' : user._id,
                'token' : token
            };
    
            PasswordReset.create(dataObj).then((data) => {
                req.session.message='Password Reset link has been sent . Please check your mail';
                req.session.reset_user=data.user_id;
                res.redirect('/login');    
            },(err) => {
                res.status(400).send(err.stack);
            });

        },(err) => {
            res.status(400).send(err.stack);
        });

    }).catch(err => res.send(err.stack));
};

exports.checkToken = (req,res) => {

    console.log(req.params.token);

    createConnection().then((data) => {
        
        PasswordReset.findOne({token:req.params.token}).then((doc) => {
            
            console.log('here');
            console.log(doc);
            
            if(!doc) {
                console.log(1);
                exitConnection();
                req.session.message = "Invalid Token";
                res.redirect('/login');    
            } else if(!req.session.reset_user) {
                console.log(2);
                PasswordReset.findOneAndRemove({token:req.params.token}).then(data => {
                    exitConnection();
                }).catch(err => {
                    exitConnection();
                    res.send(err.stack);
                });         
                req.session.message = "Token Expired !";
                res.redirect('/login');
            } else {
                console.log(3);
                PasswordReset.findOneAndRemove({token:req.params.token}).then(data => {
                    exitConnection();
                    req.session.message = "Account Verified Successfully";
                    res.redirect('/auth/password/reset');
                }).catch(err => {
                    exitConnection();
                    res.send(err.stack);
                });   
            }

        },(err) => {
            exitConnection();
            res.send(err.stack);
        });

    }).catch(err => res.status.send(err));
};

exports.reset = (req,res) => {
    
    console.log(req.session.reset_user);

    req.session.reset_user="5c2ae5759e5a8c4310c0dddf";

    if(!req.session.reset_user) {
        req.session.message = "Something Went Wrong ! Please Try Again !";
        res.redirect('/auth/reset/password');
    } else {
        
        var user_id = req.session.reset_user;
        req.session.reset_user="";

        createConnection().then(data => {
            User.findOne({_id:user_id}).then(doc => {
                User.findOneAndUpdate({_id:user_id},{password:bcrypt.hashSync(req.body.password, salt)},{new:true}).then(data => {
                    exitConnection();
                    console.log(data);
                }).catch(err => {
                    exitConnection();
                    res.send(err.stack);
                });
                req.session.message = "Password has been successfully resetd";
                res.redirect('/login');
            },(err) => {
                res.status(400).send(err.stack);
            });
        }).catch(err => res.send(err));
    }
};