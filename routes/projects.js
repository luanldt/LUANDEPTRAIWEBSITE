var express = require('express');
var router = new express.Router();
var formidable = require('formidable');
var fs = require('fs');
var path = require('path');

var Projects = require('../models/Projects');

router.get('/', function(req, res) {
    Projects.count(10, function(count) {
        Projects.find(10, req.query.page, function(data) {
            res.render('Admin/projects', {
                title: 'Projects',
                data: data,
                // count: count == 0 ? 1 : count,
                // currentPage: !req.query.page ? 1 : req.query.page,
                active: 'Projects',
                user: req.user
            });
        });
    });
});

router.get('/edit/:id', function(req, res) {
    Projects.findOne(req.params.id, function(data) {
        res.send(data);
    });
});

router.post('/', function(req, res, next) {
    // thuc hien viec nap du lieu va upload hinh

    var project = [];
    var form = formidable.IncomingForm();
    var using = [];
    var oldFiled = "";
    var images = [];

    form.on('field', function(field, value) {
        if (oldFiled !== field) {
            oldFiled = field;
        }
        if (value) {
            if (oldFiled === 'duration') {
                var duration = value.split('-');
                project[oldFiled] = duration;
            } else if (oldFiled === 'using') {
                using.push(value);
                project[oldFiled] = using;
            } else {
                project[oldFiled] = value;
            }
        }
    });

    form.on('file', function(name, file) {
        form.multiples = true;
        form.uploadDir = path.join(__dirname, '../images');
        if (file) {
            images.push(project["name"] + '_' + file.name);
            project[name] = images;
            fs.rename(file.path, path.join(form.uploadDir, project.name + '_' + file.name));
        }
    });

    form.on('end', function() {
        var p = {
            Name: project['name'],
            Duration: project['duration'],
            Position: project['position'],
            Using: project['using'],
            Description: project['description'],
            Images: project['images'],
            Show: project['show']
        };
        if (Projects.create(p)) {
            res.end("Success!!!");
        } else {
            res.end("Fail!!!");
        }
    });

    form.parse(req);

});

router.delete('/', function(req, res) {
    Projects.delete(req.body.id, function(result) {
        var files = result.Images;
        var pathf = path.join(__dirname, '../images');
        files.forEach((fileName) => {
            if(fs.existsSync(pathf + '/' + fileName))
                fs.unlink(pathf + '/' + fileName);
        })
        res.send(result);
    });
});

router.post('/update', function(req, res) {
    // thuc hien viec nap du lieu va upload hinh

    var project = [];
    var form = formidable.IncomingForm();
    var using = [];
    var oldFiled = "";
    var images = [];

    form.on('field', function(field, value) {
        if (oldFiled !== field) {
            oldFiled = field;
        }
        if (value) {
            if (field === 'duration') {
                var duration = value.split('-');
                project[oldFiled] = duration;
            } else if (oldFiled === 'using') {
                using.push(value);
                project[oldFiled] = using;
            } else {
                project[oldFiled] = value;
            }
        }
    });

    form.on('file', function(name, file) {
        form.multiples = true;
        form.uploadDir = path.join(__dirname, '../images');
        if (file.name != '') {
            images.push(project["name"] + '_' + file.name);
            project[name] = images;
            fs.rename(file.path, path.join(form.uploadDir, project.name + '_' + file.name));
        }
    });

    form.on('end', function() {
        var p = {
            Name: project['name'],
            Duration: project['duration'],
            Position: project['position'],
            Using: project['using'],
            Description: project['description'],
            Show: project['show']
        };
        if (project['images']) {
            p.Images = project['images'];
        }
        console.log(project);
        console.log(p);
        Projects.update(project['id'], p, function(result) {
            res.send(result);
        });
    });

    form.parse(req);
});

module.exports = router;