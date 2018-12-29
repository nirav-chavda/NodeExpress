const fs = require('fs');
//var app = require('../../app/server');
var {createConnection,exitConnection} = require('../../db/mongoose');
var User = require('../../db/models/User');

exports.user = function (req) {
    return new Promise((resolve,reject) => {
        if(req.session.user) {
            createConnection();
            User.findOne({_id:req.session.user})
            .then((user)=>{
                    exitConnection();
                    resolve(user);
                },(err) => {
                    exitConnection();
                    console.log(err.stack);
                    writeLog(err);
                    reject(err);            
                }
            ); 
        }
    });
}

function writeLog(err) {
    var data = `${ new Date().toString() } : In AuthHelper :\n${err.stack}`;
    fs.appendFile('../../../logcat.log' , data+"\n" , (err) => {
        if(err) {
            return console.log('Error while writing log \n',err);
        }
    });
}

