var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/Users');

module.exports = function(passport) {
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    passport.use('signup', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback:true
    }, function(req, email, password, done) {
        process.nextTick(function(){
            User.findOne({'local.Email': email}, function(err, user) {
                if(err) {
                    return done(err);
                }
                if(user) {
                    return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                } else {
                    var newUser = new User();
                    newUser.local.Email = email;
                    newUser.local.Password = newUser.generateHash(password);
                    newUser.Phone = req.body.phone;
                    newUser.Name = req.body.fullName;
                    newUser.save(function(err) {
                        if(err) throw err;
                        return done(null, newUser);
                    })
                }
            })
        });
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
    function(req, email, password, done) {
        console.log(email, password);
        User.findOne({'local.Email': email}, function(err, user) {
            if(err) return done(err);
            if(!user) {
                return done(null, false, req.flash('loginMessage', 'No user found!'));
            }
            if(!user.isValidPassword(password)) {
                return done(null, false, req.flash('loginMessage', 'Wrong password'));
            }
            return done(null, user);
        })
    }))
};