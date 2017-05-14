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

    Book.findAll({
            include: [
                {
                    model: Loan
                }
            ]
        })
        .then(function (books) {
            const filteredBooks = books.filter( (book) => {
                if (book.loans.length === 0) {
                    return true;
                } else if (book.loans.every( (loan) => {
                    return loan.returned_on;
                })) {
                    return true;
                }
            });
            Patron.findAll().then(function (patrons) {
                res.render("new_loan", {
                    books: filteredBooks,
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
    }).catch(function (err) {
        if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {

            sequelize.query("SELECT DISTINCT books.id, books.title FROM books LEFT OUTER JOIN loans on books.id = loans.book_id WHERE returned_on IS NOT NULL OR loans.id IS NULL;", {
                type: sequelize.QueryTypes.SELECT
            })

            .then(function (books) {
                Patron.findAll().then(function (patrons) {
                    res.render("new_loan", {
                        loan: Loan.build(req.body),
                        books: books,
                        patrons: patrons,
                        loaned_on: moment().format("YYYY-MM-DD"),
                        return_by: moment().add(7, "days").format("YYYY-MM-DD"),
                        errors: err.errors
                    });
                });
            });
        } else {
            throw err;
        }
    });;
});

router.get("/return_book", function (req, res, next) {
    Loan.findOne({
        where: {
            id: req.query.loan_id
        },
        include: [
            {
                model: Book
                },
            {
                model: Patron
            }
            ]
    }).then(function (loan) {
        res.render("return_book", {
            loan: loan,
            returned_on: moment().format("YYYY-MM-DD")
        });
    });

});

router.post("/return_book", function (req, res, next) {
    Loan.update({
        returned_on: req.body.returned_on
    }, {
        where: {
            id: req.query.loan_id
        }
    }).then(function (result) {
        res.redirect("/loans");
    });

});

module.exports = router;
