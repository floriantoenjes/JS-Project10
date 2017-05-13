"use strict";

const express = require("express");
const Book = require("./models").books;
const sequelize = require("./models").sequelize;

const app = express();

app.use('/static', express.static(__dirname + '/public'));

app.set('view engine', 'pug');
app.set('views', __dirname + '/templates');


app.get("/", function (req, res, next) {
    res.render("home");
});

app.get("/all_books", function (req, res, next) {
    Book.findAll().then(function(books) {
        res.render("all_books", {books: books});
    });
});


sequelize.sync().then(function () {
  app.listen(3000, function () {
    console.log("The frontend server is running on port 3000!");
  });
});
