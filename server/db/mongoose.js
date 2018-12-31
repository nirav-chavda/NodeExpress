const fs =  require('fs');
var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

var createConnection = () => {
    return new Promise((resolve,reject) => {
        mongoose.connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`,{useNewUrlParser:true})
            .then(function () {
                var data = `${ new Date().toString() } : Mongodb Connection : ${process.env.DB_HOST} - ${process.env.DB_NAME}`;
                writeDBLog(data);
                console.log(`Mongodb Connection : ${process.env.DB_HOST} - ${process.env.DB_NAME}`);
                resolve(1);
            })
            .catch(function (err) {
                var data = `${ new Date().toString() } : Mongodb Connection Error :\n ${err.stack}`;
                writeDBLog(data);
                console.log('Error on start: ' + err.stack);
                reject(err.stack);
            }
        );
    });
}

var exitConnection = () => {
    mongoose.connection.close();
    var data = `${ new Date().toString() } : Mongodb Connection Closed`;
    writeDBLog(data);
    console.log("MongoDB Connection Closed");
};

function writeDBLog(data) {
    fs.appendFile('logcat.log' , data+"\n" , (err) => {
        if(err) {
            return console.log('Error while writing log \n',err);
        }
    });
}

module.exports = { createConnection , exitConnection , writeDBLog };