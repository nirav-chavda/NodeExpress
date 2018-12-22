const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const opn = require('opn');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');

require('dotenv').config();   // puts .env file variables into process.env

var dirname = __dirname.replace('\\server','');
var port = process.env.PORT || 3000;
var app = express();

app.set('view engine','hbs');
app.set('views',path.join(dirname,'/resources/views'));

/* Middlewares */
app.use(morgan('dev'));     // logger - http logs on console
app.use(express.static(dirname+'/public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session({
    key: 'user_sid',
    secret : 'NodeLaravel',
    resave : false,
    saveUninitialized : true,
    cookie : {
        //secure: true,
        maxAge: 1000*60*5   // 5 minutes
    }
}));
hbs.localsAsTemplateData(app);
app.use((req,res,next) => {
    if(req.session.user) {
        app.locals.guest = 0;
        app.locals.auth = 1;
    } else {
        app.locals.guest = 1;
        app.locals.auth = 0;
    }
    next();
});
app.use(require('./routes/routes'));

// hbs.registerHelper('guest',{
//     if(Guest) { return 1 }    
// });
// hbs.registerHelper('auth',{
//     if(Auth) { return 1 }    
// });

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

