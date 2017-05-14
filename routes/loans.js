const express = require("express");
const Book = require("../db.js").books;
const Loan = require("../db.js").loans;
const Patron = require("../db.js").patrons;
const sequelize = require("../models/index.js").sequelize;
const moment = require("moment");

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
   sequelize.query("SELECT books.id, books.title FROM books LEFT OUTER JOIN loans on books.id = loans.book_id WHERE returned_on IS NOT NULL OR loans.id IS NULL;",
                   { type: sequelize.QueryTypes.SELECT})

  .then(function (books) {

        Patron.findAll().then(function (patrons) {
            res.render("new_loan", {
                books: books,
                patrons: patrons,
                loaned_on: moment().format("YYYY-MM-DD"),
                return_by: moment().add(7, "days").format("YYYY-MM-DD")
            });
        });

    });

});

router.post("/new_loan", function (req, res, next) {
    console.log(req.body);
//    Loan.create(req.body).then(function (loan) {
//        res.redirect("/loans");
//    });
    res.send("Hello");
});

module.exports = router;
