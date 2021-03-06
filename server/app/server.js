const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
//const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
const opn = require('opn');
const morgan = require('morgan');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const figlet = require('figlet');
const colors = require('colors');

require('dotenv').config();   // puts .env file variables into process.env

var dirname = __dirname.replace('\\server\\app','');
var port = process.env.PORT || 3000;
var app = module.exports = express();

app.set('views',path.join(dirname,'/resources/views'));
app.engine('hbs',hbs({
    extname:'hbs',
    defaultLayout:'home',
    helpers: require('../controllers/helpers/helpers'),
    layoutsDir: dirname+'/resources/views/layouts'
}));
app.set('view engine','hbs');

/* Middlewares */           // Do maintain the order
app.use(morgan('dev'));     // logger - http logs on console
app.use(express.static(dirname+'/public'));
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(session(require('../app/config/session')));
//hbs.localsAsTemplateData(app);
app.use((req,res,next) => {
    if(req.session.user) {
        res.locals.guest = 0;
        res.locals.auth = 1;
    } else {
        res.locals.guest = 1;
        res.locals.auth = 0;
    }
    next();
});
app.use((req,res,next)=>{
    if(req.session.message) {
        app.locals.message = req.session.message;
        req.session.message = "";
    } 
    next();   
});

require('../routes/routes')(app);   // includes routes
require('../app/config/social-login')(app);

var server = app.listen(port, () => {

    console.log(`Magic happens at ${server.address().address} : ${port}`);

    var data = `${ new Date().toString() } : Server Started at ${server.address().address} : ${port}`;
    fs.appendFile(dirname+'/logcat.log' , data+"\n" , (err) => {
        if(err) {
            return console.log('Error while writing log \n',err);
        }
    });

    if(process.env.APP_ENV == "DEV") {
        opn(`${process.env.HOST}`,{app: 'chrome'});
    }
});

