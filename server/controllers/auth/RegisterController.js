const fs = require('fs');

var User = require('../../db/models/User');
var AccountVerification = require('../../db/models/AccountVerification');
var {createConnection,exitConnection} = require('../../db/mongoose');
 
exports.showRegisterForm = (req,res) => {
    res.render('auth/register',{});
};

exports.registerUser = (req,res) => {

    var user = {
        'full_name' : req.body.name,
        'email': req.body.email,
        'password': req.body.password
    };

    var user_id;

    var token = Math.random().toString(36);
    
    var mailOption = {
        from : `Nirav Chavda <${process.env.MAIL_USER}>`,
        to :    `niravdchavda@gmail.com`,
        subject : 'Account Verification' ,
        text : 'Click on the below link to verify the account on Web-App',
        html : `<br/><a href="${process.env.HOST}/auth/account/verify/${token}">Click Here</a>`
    };

    User.create(user).then((doc) => {

        user_id = doc._id;
        
        require('../../app/config/mail').transporter.sendMail(mailOption,(err,info) => {
            if(err) {
                res.send(`Something went wrong : ${err}`);
            } else {
                var dirname = __dirname.replace('\\server\\controllers\\auth','');            
                var data = `Accepted : ${info.accepted}\n  Rejected : ${info.rejected}\n  MessageSize : ${info.messageSize}\n  Response : ${info.response}\n`;
                fs.appendFile(dirname+'/logcat.log' , data , (error) => { if(error) { console.log(error) } });   
            }
        });

        var accVerifyObject = {
            'user_id' : user_id,
            'token' : token
        };

        AccountVerification.create(accVerifyObject).then((data) => {
            req.session.message='Account Verification link has been sent . Please Verify your account';
            res.redirect('/login');    
        },(err) => {
            res.status(400).send(err.stack);
        });
        
    },(err) => {
        res.status(400).send(err.stack);
    });
};

exports.markVerified = function(req,res) {
    
    var user_id;

    createConnection().then((data) => {
        
        AccountVerification.findOne({token:req.params.token}).then((doc) => {
            
            user_id = doc.user_id;
            
            User.findOneAndUpdate({_id:user_id},{is_verified:true},{new:true}).then((doc_user)=>{
                
                AccountVerification.findOneAndRemove({user_id:user_id}).then((doc)=>{
                    exitConnection();
                    req.session.message = "Account Verified Successfully";
                    res.redirect('/login');
                },(err)=>{
                    exitConnection();
                    res.status(400).send(err.stack);
                });

            },(err)=>{
                exitConnection();
                res.status(400).send(err.stack);
            });

        },(err) => {
            exitConnection();
            req.session.message = "Invalid Token";
            res.redirect('/login');
        });

    }).catch(err => res.status.send(err));
}