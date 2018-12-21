const fs =  require('fs');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var createConnection = () => {
    mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB}`,{useNewUrlParser:true})
        .then(function () {
            var data = `${ new Date().toString() } : Mongodb Connection : ${process.env.DB_HOST} - ${process.env.DB}`;
            writeDBLog(data);
            console.log("DB Started\n");
        })
        .catch(function (err) {
            var data = `${ new Date().toString() } : Mongodb Connection Error :\n ${err.stack}`;
            writeDBLog(data);
            console.log('Error on start: ' + err.stack);
        }
    );
}

var exitConnection = () => {
    mongoose.connection.close();
    var data = `${ new Date().toString() } : Mongodb Connection Closed`;
    writeDBLog(data);
    console.log("\nConnection Closed");
};

function writeDBLog(data) {
    fs.appendFile('logcat.log' , data+"\n" , (err) => {
        if(err) {
            return console.log('Error while writing log \n',err);
        }
    });
}

module.exports = { createConnection , exitConnection , writeDBLog };