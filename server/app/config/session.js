module.exports = {
    key: 'user_sid',
    secret : 'NodeLaravel',
    resave : false,
    saveUninitialized : true,
    cookie : {
        //secure: true,
        maxAge: 1000*60*10   // 10 minutes
    }
};