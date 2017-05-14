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
    const loans = Loan.findAll({
        where: {
            $or: [{
                    returned_on: {
                        $ne: null
                    }
           },
                {
                    loaned_on: null
                 }]
        },
        include: [
            {
                model: Book
                }
            ]
    }).then(function (loans) {
        console.log(loans);
        res.render("new_loan", {
            loans: loans
        });
    });

});

module.exports = router;
