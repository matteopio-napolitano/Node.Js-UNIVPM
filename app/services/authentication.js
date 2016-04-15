var passport = require('passport')
        , LocalStrategy = require('passport-local').Strategy
        , models  = require(__dirname + '/../models')
        , crypto = require('crypto');

var auth = function (_app) {
    
    var app = _app;
    
    this.load = function () {
        // load passport config
        app.use(passport.initialize());
        app.use(passport.session());

        // Use the LocalStrategy within Passport.
        passport.use(new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        }, function (email, password, done) {
            var hash = crypto.createHash('md5')
                             .update(password)
                             .digest('hex');
            
            models.User.findOne({ where: {
                    email: email,
                    password: hash
                }
            }).then(function(user) {
                if (user !== null) {
                    return done(null, user.id);
                } else {
                    return done(null, false);
                }
            });
        }));

        passport.serializeUser(function (user, done) {
            done(null, user);
        });

        passport.deserializeUser(function (user, done) {
            done(null, user);
        });
    };

    this.authenticate = function () {
        return passport.authenticate('local', {
            successRedirect: 'user',
            failureRedirect: 'index/1'
        });
    };
};

/* ************************************************************************
 SINGLETON CLASS DEFINITION
 ************************************************************************ */
auth.instance = null;

/**
 * Singleton getInstance definition
 * @return singleton class
 */
auth.getInstance = function (app) {
    if (this.instance === null) {
        this.instance = new auth(app);
    }
    return this.instance;
}

module.exports = auth;