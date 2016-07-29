var Sequelize = require("sequelize");
var sqlite = require("sqlite3");
var sequelize = null;

var environment = process.env.NODE_ENV || "development";

if(environment === "production"){
    sequelize = new Sequelize(process.env.DATABASE_URL,{
        dialect:"postgres"
    });
}else{
    sequelize = new Sequelize(undefined, undefined, undefined,{
        dialect:"sqlite",
        storage:__dirname + "/data/dev-contacts-manager.sqlite"
    });
}

var db={};
db.Contact = sequelize.import(__dirname+"/models/contact.js");
db.Sequelize = Sequelize;
db.sequelize = sequelize;

module.exports = db;
