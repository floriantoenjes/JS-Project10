const express = require("express"),
      Book = require("../db.js").books,
      Loan = require("../db.js").loans,
      Patron = require("../db.js").patrons;

const router = express.Router();

router.get("/", function (req, res, next) {
    Patron.findAll().then(function (patrons) {
        res.render("patrons", {
            patrons: patrons
        });
    });
});

router.get("/detail/:id", function (req, res, next) {

    getPatronDetails(req.params.id).then(function (patron, loans) {
        res.render("patron_detail", {
            patron: patron,
            loans: loans
        });
    });
});

router.post("/detail/:id", function (req, res, next) {

    Patron.update(req.body, {
        where: {
            id: req.params.id
        }
    }).then(function (patron) {
        res.redirect("/patrons");
    }).catch(function (err) {
        if (err.name === "SequelizeValidationError") {

            getPatronDetails(req.params.id).then(function (patron, loans) {
                res.render("patron_detail", {
                    patron: Patron.build(req.body),
                    loans: loans,
                    errors: err.errors
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


function getPatronDetails(patronId) {
    return {
        then: function (callback) {
            Patron.findById(patronId).then(function (patron) {
                Loan.findAll({
                    where: {
                        patron_id: patronId
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
                    callback(patron, loans);
                });
            });
        }
    }
}

module.exports = router;
