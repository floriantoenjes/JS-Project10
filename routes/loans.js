const express = require("express");
const Book = require("../db.js").books;
const Loan = require("../db.js").loans;
const Patron = require("../db.js").patrons;

const router = express.Router();

router.get("/", function (req, res, next) {
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
        for (let result of results) {
            const loan = {
                book_title: result.book.title,
                patron_first_name: result.patron.first_name,
                patron_last_name: result.patron.last_name,
                loaned_on: result.loaned_on,
                return_by: result.return_by,
                returned_on: result.returned_on
            };
            loans.push(loan);
        }
        res.render("loans", {loans: loans});
    });
});

module.exports = router;
