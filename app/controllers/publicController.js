var locomotive = require('locomotive')
        , passport = require('passport')
        , Controller = locomotive.Controller
        , models = require(__dirname + '/../models')
        , crypto = require('crypto');

var publicController = new Controller();

publicController.before('*', function (next) {
    // this executes before any action is invoked
    this.req.app.set('layout', 'public-layout');
    this.isLoggedIn = this.req.isAuthenticated();
    this.action = this.req._locomotive.action;
    var lErr = this.param('e', null);
    this.loginError = lErr;
    next();
});

publicController.index = function () {
    this.render();
};

publicController.support = function () {
    this.render();
};

publicController.account = function () {
    var session = this.req.session;
    
    this.status = null;
    this.message = null;
    
    if (session.registrationStatus && session.registrationMessage) {
        // assegna le variabili alla view
        this.status = session.registrationStatus;
        this.message = session.registrationMessage;
        
        // resetta le variabili in sessione
        this.req.session.registrationStatus = null;
        this.req.session.registrationMessage = null;
    }
    
    this.render();
};

publicController.register = function () {
    var self = this;

    var fname = this.param('fname', null);
    var lname = this.param('lname', null);
    var email = this.param('email', null);
    var password = this.param('password', null);
    var r_password = this.param('r_password', null);

    if (fname !== null && lname !== null && email !== null && password !== null && r_password !== null) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(email)) {
            // die happy
            self.req.session.registrationStatus = -1;
            self.req.session.registrationMessage = 'The email format is not correct!';
            self.res.redirect('/account');
        }

        if (password !== r_password) {
            // die happy
            self.req.session.registrationStatus = -1;
            self.req.session.registrationMessage = 'The password fields does not contain equals string!';
            self.res.redirect('/account');
        }

        models.User.findOne({where: {
                email: email
            }
        }).then(function (user) {
            if (user !== null) {
                // die happy
                self.req.session.registrationStatus = -1;
                self.req.session.registrationMessage = 'This account has already been used!';
                self.res.redirect('/account');
            } else {
                // register new user
                var hash = crypto.createHash('md5')
                             .update(password)
                             .digest('hex');
                models.User
                        .build({
                            fname: fname,
                            lname: lname,
                            email: email,
                            password: hash
                        })
                        .save()
                        .then(function (next_) {
                            self.req.session.registrationStatus = 1;
                            self.req.session.registrationMessage = 'Account successfully created!';
                            self.res.redirect('/account');
                        })
                        .catch(function (error_) {
                            self.req.session.registrationStatus = -1;
                            self.req.session.registrationMessage = 'Unable to create your Docus account!';
                            self.res.redirect('/account');
                        });
            }
        });
    } else {
        this.req.session.registrationStatus = -1;
        this.req.session.registrationMessage = 'All fields are required!';
        this.res.redirect('/account');
    }
};

publicController.login = function () {

};

publicController.logout = function () {
    this.req.logOut();
    this.res.redirect('/');
};

module.exports = publicController;