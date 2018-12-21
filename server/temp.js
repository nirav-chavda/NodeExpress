const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const fs = require('fs');
const path = require('path');
var opn = require('opn');

require('dotenv').config();

var {exitConnection} = require('./db/mongoose');
var {ObjectID} = require('mongodb');
var {User} = require('./models/User');
var dirname = __dirname.replace('\\server','');

var port = process.env.PORT || 3000;
var app = express();

app.use(bodyParser.json()); 
app.set('view engine','hbs');
app.set('views',path.join(dirname,'/resources/views'));
app.use(express.static(dirname+'/public'));

/* Routes */

app.get('/',(req,res) => {
    res.render('index');
});

app.get('/add',(req,res) => {

    var user = new User({
        'name': "Ram",
        'email': "ndc@gmail.com",
        'password': "123456"
    });
    
    //It will saves the document and returns the saved document 
    user.save().then((doc) => {
        console.log(doc);
        exitConnection();
        res.send(doc);
    },(err) => {
        console.log(err);
        res.status(400).send(err.stack);
    });
});

var server = app.listen(port, () => {
    var data = `${ new Date().toString() } : Server Started at ${server.address().address} : ${port}`;
    writeLog(data);
    console.log(`Server Started at ${server.address().address} : ${port}`);
    opn(`${process.env.HOST}`,{app: 'chrome'});
});

function writeLog(data) {  
    fs.appendFile(dirname+'/logcat.log' , data+"\n" , (err) => {
        if(err) {
            return console.log('Error while writing log \n',err);
        }
    });
}
