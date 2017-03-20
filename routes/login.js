var express = require('express');
var router = express.Router();
module.exports = function(passport) {
    router.get('/login', function(req, res) {
        res.render('Admin/login', {message: req.flash('loginMessage'), title: 'Login'});
    });

    router.post('/login', passport.authenticate('login', {
        failureRedirect: '/Admin/login',
        failureFlash: true
    }), function(req, res) {
        if(req.body.remember) {
            req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000;
        } else {
            req.session.cookie.expires = false;
        }
        res.redirect('/Admin');
    });

    router.get('/signup', function(req, res) {
        res.render('Admin/signup', {message: req.flash('signupMessage'), title: 'Sign Up'});
    });

    router.post('/signup', passport.authenticate('signup', {
        successRedirect:'/Admin',
        failureRedirect:'/Admin/signup',
        failureFlash:true
    }));

    router.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/Admin/login');
    });

    return router;
};