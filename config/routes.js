// Draw routes.  Locomotive's router provides expressive syntax for drawing
// routes, including support for resourceful routes, namespaces, and nesting.
// MVC routes can be mapped to controllers using convenient
// `controller#action` shorthand.  Standard middleware in the form of
// `function(req, res, next)` is also fully supported.  Consult the Locomotive
// Guide on [routing](http://locomotivejs.org/guide/routing.html) for additional
// information.

var authentication = require(__dirname + '/../app/services/authentication');

module.exports = function routes() {
    var auth = authentication.getInstance(this);

    this.root('public#index');
    this.match('index/:e?', 'public#index');
    this.match('support', 'public#support');
    this.match('account', 'public#account');
    this.match('register', 'public#register', {via: 'POST'});
    this.match('login', auth.authenticate(), {via: 'POST'});
    this.match('logout', 'public#logout');

    this.match('user/:q?', 'user#index'); // il parametro q seguito dal punto interrogativo indica che esso è opzionale
    this.match('addfile', 'user#addfile');
    this.match('upload', 'user#upload', {via: 'POST'});
    this.match('delete/:id', { controller: 'user', action: 'delete' });
}