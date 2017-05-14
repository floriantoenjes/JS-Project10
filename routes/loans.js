const express = require("express"),
    moment = require("moment"),
    Book = require("../db.js").books,
    Loan = require("../db.js").loans,
    Patron = require("../db.js").patrons,
    sequelize = require("../db.js").sequelize;

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
    sequelize.query("SELECT books.id, books.title FROM books LEFT OUTER JOIN loans on books.id = loans.book_id WHERE returned_on IS NOT NULL OR loans.id IS NULL;", {
        type: sequelize.QueryTypes.SELECT
    })

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
    Loan.create(req.body).then(function (loan) {
        res.redirect("/loans");
    });
});

router.get("/return_book", function (req, res, next) {
    res.render("return_book", {
        returned_on: moment().format("YYYY-MM-DD")
    });
});

module.exports = router;
