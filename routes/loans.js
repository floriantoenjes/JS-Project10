const express = require("express");
const Book = require("../db.js").books;
const Loan = require("../db.js").loans;
const Patron = require("../db.js").patrons;

const router = express.Router();

router.get("/", function (req, res, next) {

    if (req.query.filter === "overdue") {

        Loan.findAll({
            where: {
                returned_on: null,
                return_by: {
                    $lt: Date()
                }
            },
            include: [
                {
                    model: Book
                },
                {
                    model: Patron
            }
            ]
        }).then(function (results) {
            const loans = [];
            res.render("loans", {
                loans: results
            });
        });

    } else if (req.query.filter === "checked_out") {

        Loan.findAll({
            where: {
                returned_on: null
            },
            include: [
                {
                    model: Book
                },
                {
                    model: Patron
            }
            ]
        }).then(function (results) {
            const loans = [];
            res.render("loans", {
                loans: results
            });
        });

    } else {

        Loan.findAll({
            include: [
                {
                    model: Book
                },
                {
                    model: Patron
            }
            ]
        }).then(function (results) {
            const loans = [];
            res.render("loans", {
                loans: results
            });
        });
    }

});

router.get("/new_loan", function (req, res, next) {
    Book.findAll({
        include: [
            {
                model: Loan
                },
            ]
    }).then(function (books) {
        console.log(books);

        books = filterBooksAvailable(books);

        Patron.findAll().then(function (patrons) {
            res.render("new_loan", {
                books: books,
                patrons: patrons,
                loaned_on: Date()
            });
        });

    });

});


function filterBooksAvailable(books) {
    return books.filter((book) => {
            if (book.loans.length === 0) {
                return book;
            } else {
                for (loan of book.loans) {
                    if (loan.returned_on) {
                        return book;
                    }
                }
            }
        });
}

module.exports = router;
