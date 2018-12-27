module.exports = function (hbs,app) {
    
    hbs.registerHelper('message',function () {
        var value = app.locals.message;
        app.locals.message = "";
        return value;
    });
};