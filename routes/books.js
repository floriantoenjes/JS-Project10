const express = require("express");
const Book = require("../db.js").books;
const Loan = require("../db.js").loans;

const router = express.Router();

router.get("/", function (req, res, next) {
    if (req.query.filter === "overdue") {
        const books = [];

        Loan.findAll({
            where: {
                return_by: {
                    $lt: Date()
                },
                returned_on: null
            },
            include: [
                {
                    model: Book
                }
            ]
        }).then(function (results) {
            for (let result of results) {
                books.push(result.book);
            }

            console.log(books);
            res.render("all_books", {
                books: books
            });
        });

    } else if (req.query.filter === "checked_out") {
        const books = [];

        Loan.findAll({
            where: {
                returned_on: null
            },
            include: [
                {
                    model: Book
                }
            ]
        }).then(function (results) {
            for (let result of results) {
                books.push(result.book);
            }

            console.log(books);
            res.render("all_books", {
                books: books
            });
        });

    } else {

        Book.findAll().then(function (books) {
            res.render("all_books", {
                books: books
            });
        });

    }
});

module.exports = router;
