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
                patron_id: req.params.id
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

router.post("/detail/:id", function (req, res, next) {

    Patron.update(req.body, {
        where: {
            id: req.params.id
        }
    }).then(function (patron) {
        console.log(patron);
        res.redirect("/patrons");
    }).catch(function (err) {
        if (err.name === "SequelizeValidationError") {

            Patron.findById(req.params.id).then(function (patron) {
                Loan.findAll({
                    where: {
                        patron_id: req.params.id
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
                        patron: Patron.build(req.body),
                        loans: loans,
                        errors: err.errors
                    })
                });
            });
        } else {
            throw err;
        }
    });
});

router.get("/new_patron", function (req, res, next) {
    res.render("new_patron", {
        patron: {}
    });
});

router.post("/new_patron", function (req, res, next) {
    Patron.create(req.body).then(function (patron) {
        res.redirect("/patrons");
    }).catch(function (err) {
        if (err.name === "SequelizeValidationError" || err.name === "SequelizeUniqueConstraintError") {
            res.render("new_patron", {
                patron: Patron.build(req.body),
                errors: err.errors
            });
        } else {
            throw err;
        }
    });;
});

module.exports = router;
