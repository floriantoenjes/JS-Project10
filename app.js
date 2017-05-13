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
    if (req.query.filter === "overdue") {
        const books = [];

        Loan.findAll({
            where: {
                return_by: {
                    $lt: Date()
                },
                returned_on: null
            }
        }).then(function (loans) {
            const promises = [];
            for (let loan of loans) {
                promises.push(new Promise(function (resolve, reject) {
                    Book.findOne({
                        where: {
                            id: loan.book_id
                        }
                    }).then(function (book) {
                        books.push(book);
                        resolve(true);
                    });
                }));

            }
            Promise.all(promises).then(function () {
                res.render("all_books", {
                    books: books
                });
            });

        });

    } else if (req.query.filter === "checked_out") {
        const books = [];

        Loan.findAll({
            where: {
                returned_on: null
            }
        }).then(function (loans) {
            const promises = [];

            for (let loan of loans) {
                promises.push(new Promise(function (resolve, reject) {
                    Book.findOne({
                        where: {
                            id: loan.book_id
                        }
                    }).then(function (book) {
                        books.push(book);
                        resolve(true);
                    });
                }));
            }

            Promise.all(promises).then(function () {
                res.render("all_books", {
                    books: books
                });
            })
        });

    } else {
        Book.findAll().then(function (books) {
            console.log(books);
            res.render("all_books", {
                books: books
            });
        });
    }
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
