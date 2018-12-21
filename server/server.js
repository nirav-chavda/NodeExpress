const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const opn = require('opn');
const morgan = require('morgan');
const session = require('express-session');
//const cookieParser = require('cookie-parser');

require('dotenv').config();   // puts .env file variables into process.env

var dirname = __dirname.replace('\\server','');
var port = process.env.PORT || 3000;
var app = express();

app.set('view engine','hbs');
app.set('views',path.join(dirname,'/resources/views'));

/* Middlewares */
app.use(morgan('dev'));     // logger - http logs on console
app.use(bodyParser.json()); 
app.use(express.static(dirname+'/public'));
app.use(require('./routes/routes'));
app.use(session({
    secret : 'NodeLaravel',
    resave : false,
    saveUninitialized : false,
    cookie : {
        secure: true,
        maxAge: 1000*60*5   // 5 minutes
    }
}));

var server = app.listen(port, () => {
    var data = `${ new Date().toString() } : Server Started at ${server.address().address} : ${port}`;
    fs.appendFile(dirname+'/logcat.log' , data+"\n" , (err) => {
        if(err) {
            return console.log('Error while writing log \n',err);
        }
    });
    console.log(`Server Started at ${server.address().address} : ${port}`);
    opn(`${process.env.HOST}`,{app: 'chrome'});
});

