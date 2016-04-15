var locomotive = require('locomotive')
        , Controller = locomotive.Controller
        , models = require(__dirname + '/../models')
        , fs = require('fs')
        , crypto = require('crypto');

var userController = new Controller();

userController.before('*', function (next) {
    // this executes before any action is invoked
    if (!this.req.isAuthenticated()) {
        return this.res.redirect('/');
    }
    this.req.app.set('layout', 'user-layout');
    next();
});

userController.index = function () {
    var self = this;
    var user_id = this.req.user;
    var search_query = this.param('q', null);
    var params = null;
    this.q = search_query;
    if (search_query && search_query !== null) {
        params = {
            where: {
                user_id: user_id,
                $or: [
                    {
                        name: {
                            $like: '%' + search_query + '%'
                        }
                    },
                    {
                        description: {
                            $like: '%' + search_query + '%'
                        }
                    }
                ]
            },
            order: [
                ['name', 'ASC']
            ]
        };
    } else {
        params = {
            where: {
                user_id: user_id,
            },
            order: [
                ['name', 'ASC']
            ]
        };
    }
    
    models.Document.findAll(params).then(function (documents) {
        self.documents = documents;
        self.render();
    });
};

userController.addfile = function () {
    this.render();
};

userController.upload = function () {
    var self = this;
    var user_id = this.req.user;
    if (this.req.files && this.req.files.document_file && this.req.files.document_file !== null) {
        console.log('>> new file received!');
        var documentDescription = this.req.body.document_description;
        var originalFilename = self.req.files.document_file.originalFilename;
        fs.readFile(self.req.files.document_file.path, function (err, data) {
            var hash = crypto.createHash('md5')
                    .update(new Date().getTime().toString())
                    .digest('hex');
            var newFileName = hash + '_' + originalFilename;
            var newFilePath = __dirname + '/../../public/uploads/' + newFileName;

            fs.writeFile(newFilePath, data, function (err) {
                models.Document.create({
                    name: originalFilename,
                    description: documentDescription,
                    fs_name: newFileName,
                    user_id: user_id
                }).then(function () {
                    console.log('>> document saved to db');
                    self.res.setHeader('Content-Type', 'application/json');
                    self.res.send(JSON.stringify({response: true}));
                });
            });
        });
    } else {
        console.log('>> no file uploaded!');
        self.res.setHeader('Content-Type', 'application/json');
        self.res.send(JSON.stringify({response: false}));
    }
};

userController.delete = function () {
    var self = this;
    var id = this.param('id', null);
    if (id !== null) {
        models.Document.findOne({where: {
                id: id
            }
        }).then(function (document) {
            if (document !== null) {
                console.log('>> document found');
                models.Document.destroy({
                    where: {
                        id: id
                    }
                }).then(function () {
                    console.log('>> document removed from db');
                    var filePath = __dirname + '/../../public/uploads/' + document.fs_name;
                    fs.exists(filePath, function (exists) {
                        if (exists) {
                            fs.unlinkSync(filePath);
                        }
                        self.res.redirect('/user');
                    });
                });
            } else {
                self.res.redirect('/user');
            }
        });
    } else {
        self.res.redirect('/user');
    }
};

module.exports = userController;