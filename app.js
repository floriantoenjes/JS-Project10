"use strict";

const express = require("express");
const Book = require("./models").books;
const Patron = require("./models").patrons;
const Loan = require("./models").loans;
const sequelize = require("./models").sequelize;

const app = express();

app.use('/static', express.static(__dirname + '/public'));

app.set('view engine', 'pug');
app.set('views', __dirname + '/templates');


app.get("/", function (req, res, next) {
    res.render("home");
});

app.get("/all_books", function (req, res, next) {
    Book.findAll().then(function (books) {
        res.render("all_books", {
            books: books
        });
    });
});

app.get("/all_patrons", function (req, res, next) {
    Patron.findAll().then(function (patrons) {
        res.render("all_patrons", {
            patrons: patrons
        });
    });
});

app.get("/all_loans", function (req, res, next) {
    Loan.findAll().then(function (loans) {
        res.render("all_loans", {
            loans: loans
        });
    });
});


sequelize.sync().then(function () {
    app.listen(3000, function () {
        console.log("The frontend server is running on port 3000!");
    });
});
