var express = require('express');
var router = express.Router();


router.get('/', function(req, res) {
    res.render('Admin/profile', {
        title: 'Profle',
        active: 'Profle',
        user: req.user
    });
});


module.exports = router;