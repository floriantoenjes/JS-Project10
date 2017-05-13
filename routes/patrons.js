const express = require("express");
const Patron = require("../models").patrons;

const router = express.Router();

router.get("/", function (req, res, next) {
    Patron.findAll().then(function (patrons) {
        res.render("all_patrons", {
            patrons: patrons
        });
    });
});

module.exports = router;
