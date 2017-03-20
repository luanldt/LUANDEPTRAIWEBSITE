var express = require('express');
var router = express.Router();

router.get('/',isLoggedIn, (req, res) => {
    res.render('Admin/index', {
        title: 'Index',
        active: 'Dashboard',
        user: req.user
    });
});


function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/Admin/login');
}


module.exports = router;