const express = require("express");
const Book = require("../db.js").books;
const Loan = require("../db.js").loans;
const Patron = require("../db.js").patrons;

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

router.get("/detail/:id", function (req, res, next) {
    Book.findById(req.params.id).then(function (book) {

        Loan.findAll({
            where: {
                book_id: req.params.id
            },
            include: [
                {
                    model: Book
                },
                {
                    model: Patron
            }
            ]
        }).then(function (loans) {
            res.render("book_detail", {
                book: book,
                loans: loans
            });
        });

    });
});

router.post("/detail/:id", function (req, res, next) {
    Book.update(req.body, {
        where: {
            id: req.params.id
        }
    }).then(function (book) {
        console.log(book);
        res.redirect("/books");
    });
});

router.get("/new_book", function (req, res, next) {
    res.render("new_book", {book: {}});
});

router.post("/new_book", function (req, res, next) {
    Book.create(req.body).then(function (book) {
        res.redirect("/books")
    }).catch(function (err) {
        if (err.name === "SequelizeValidationError") {
            res.render("new_book", {
                book: Book.build(req.body),
                errors: err.errors
            });
        } else {
            throw err;
        }
    });
});

module.exports = router;
