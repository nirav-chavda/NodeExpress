var app = require('../../app/server');

module.exports = {

    message: function () {
        var value = app.locals.message;
        app.locals.message = "";
        console.log("2"); 
        return value;
    }
};