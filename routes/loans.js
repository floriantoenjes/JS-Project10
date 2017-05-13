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
        res.send("Hello World!");
    });
});

module.exports = router;
