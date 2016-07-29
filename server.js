var express = require("express");
var app = express();
var db = require('./db.js');
var _ = require("underscore");
var bodyParser = require("body-parser");

var PORT = process.env.PORT || 3000;
app.use(bodyParser.json());

app.put('/contacts/:id', function(req, res){
    var id = parseInt(req.params.id);
    var body = _.pick(req.body, "name", "organization", "mobile");

    db.Contact.findById(id).then(function(contact){
        if(contact){
            return contact.update(body);
        }else{
            return new Promise(function(resolve, reject){
                reject("Not Found");
            });
        }
    }).then(function(contact){
        return res.json(contact.toJSON());
    }).catch(function(e){
        return res.status(400).json(e);
    });
});

app.delete('/contacts/:id', function(req, res){
    var id = parseInt(req.params.id);
    var where={};
    where.id = id;

    db.Contact.destroy({
        'where': where
    }).then(function(rowsDeleted){
        if(rowsDeleted == 0){
            return res.status(404).send();
        }
        return res.status(204).send();
    }).catch(function(e){
        return res.status(500).send();
    });
});

app.post('/contacts',function(req, res){
    var body = _.pick(req.body,"name", "organization","mobile");
    db.Contact.create(body).then(function(contact){
        return res.json(contact.toJSON());
    }).catch(function(e){
        return res.status(400).json(e);
    });
});

app.get('/contacts', function(req, res){
    var query = req.query;
    var where = {};

    if(query.hasOwnProperty("name") && !_.isEmpty(query.name)){
        where.name = {
            $like: '%'+query.name+'%'
        };
    }
    if(query.hasOwnProperty("organization") && !_.isEmpty(query.organization)){
        where.organization = {
            $like: '%'+query.organization+'%'
        };
    }
    if(query.hasOwnProperty("mobile") && !_.isEmpty(query.mobile)){
        where.mobile = {
            $like: '%'+query.mobile+'%'
        };
    }

    var contacts = db.Contact.findAll({'where':where}).then(function(contacts){
        return res.json(contacts);
    }).catch(function(e){
        return res.status(500).send();
    });
});

app.get('/', function(req, res){
    return res.send("At root of api!");
});


db.sequelize.sync({force:false}).then(function(){
    app.listen(PORT, function(){
        console.log("Listening on port "+ PORT+"...");
    });
});
