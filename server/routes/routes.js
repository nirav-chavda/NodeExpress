var express = require('express');
var router = express.Router();
var fs = require('fs');

var UserController = require('../controllers/UserController');

var dirname = __dirname.replace('\\server\\routes','');

router.use((req,res,next) => {
    var data = `${ new Date().toString() } : ${req.method} - ${req.url} - ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`;
    fs.appendFile(dirname+'/logcat.log' , data+"\n" , (err) => {
        if(err) {
            return console.log('Error while writing log \n',err);
        }
    });
    next();
});

router.get('/',UserController.index);
router.get('/add',UserController.add);

router.use((req,res,next)=>{
    res.status(404).send('PAGE NOT FOUND');
});

module.exports = router;