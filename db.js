'use strict';

// Connect all the models/tables in the database to a db object,
//so everything is accessible via one object
const db = {};

//Models/tables
db.books = require("./models").books;
db.loans = require("./models").loans;
db.patrons = require("./models").patrons;
db.sequelize = require("./models/index.js").sequelize;

//Relations
db.books.hasMany(db.loans);
db.loans.belongsTo(db.books);

db.patrons.hasMany(db.loans);
db.loans.belongsTo(db.patrons);

module.exports = db;
