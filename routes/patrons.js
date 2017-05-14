const express = require("express");
const Book = require("../db.js").books;
const Loan = require("../db.js").loans;
const Patron = require("../db.js").patrons;

const router = express.Router();

router.get("/", function (req, res, next) {
    Patron.findAll().then(function (patrons) {
        res.render("patrons", {
            patrons: patrons
        });
    });
});

router.get("/detail/:id", function (req, res, next) {
    Patron.findById(req.params.id).then(function (patron) {

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
            res.render("patron_detail", {
                patron: patron,
                loans: loans
            });
        });

    });
});

router.get("/new_patron", function (req, res, next) {
    res.render("new_patron");
});

router.post("/new_patron", function (req, res, next) {
    Patron.create(req.body).then(function (patron) {
        res.redirect("/patrons");
    });
});

module.exports = router;
