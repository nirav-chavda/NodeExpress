var Guest = (req, res, next) => {
    if (req.session.user && req.cookies.user_sid) {
        res.redirect('back');
    } else {
        next();
    }    
};

var Auth = (req, res, next) => {
    if (!req.session.user) {
        res.redirect('back');
    } else {
        next();
    }    
};

module.exports = {Auth,Guest};