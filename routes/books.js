const express = require("express");
const Book = require("../db.js").books;
const Loan = require("../db.js").loans;

const router = express.Router();

router.get("/", function (req, res, next) {

    if (req.query.filter === "overdue") {

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
        }).then(renderResults);

    } else if (req.query.filter === "checked_out") {

        Loan.findAll({
            where: {
                returned_on: null
            },
            include: [
                {
                    model: Book
                }
            ]
        }).then(renderResults);

    } else {

        Book.findAll().then(function (books) {
            res.render("books", {
                books: books
            });
        });

    }

    function renderResults(results) {
        const books = [];
        for (let result of results) {
            books.push(result.book);
        }

        res.render("books", {
            books: books
        });
    }
});

router.get("/new_book", function (req, res, next) {
    res.render("new_book");
});

module.exports = router;
