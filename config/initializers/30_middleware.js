var express = require('express')
        , poweredBy = require('connect-powered-by')
        , models = require(__dirname + '/../../app/models')
        , authentication = require(__dirname + '/../../app/services/authentication');

module.exports = function () {
    // Use middleware.  Standard [Connect](http://www.senchalabs.org/connect/)
    // middleware is built-in, with additional [third-party](https://github.com/senchalabs/connect/wiki)
    // middleware available as separate modules.
    if ('development' === this.env) {
        this.use(express.logger());
    }

    this.use(poweredBy('Locomotive'));
    this.use(express.favicon());
    this.use(express.static(__dirname + '/../../public'));
    this.use(express.bodyParser());
    this.use(express.methodOverride());
    // this.use(this.router); // vedi nota A1
    this.use(express.errorHandler());

    // Inizializzazione model
    models.sequelize.sync();

    // Inizializzazione Authentication Service
    this.use(express.session({secret: '$$docus_secret_string$$'}));
    authentication.getInstance(this).load();
    this.use(this.router); // vedi nota A1
}

/*
 * Nota A1
 * Utilizzando il modulo di autenticazione Passport, è necessario spostare
 * l'istruzione this.use(this.router) dopo il caricamento e l'inizializzazione
 * di Passport stesso altrimenti non vengono caricati i metodi di autenticazione
 * e il cookie di sessione non viene generato
 * Per altre informazioni, visionare il thread http://stackoverflow.com/a/16781554
 */