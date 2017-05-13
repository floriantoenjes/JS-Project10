const express = require("express");
const Loan = require("../db.js").loans;

const router = express.Router();

router.get("/", function (req, res, next) {
    Loan.findAll().then(function (loans) {
        res.render("all_loans", {
            loans: loans
        });
    });
});

module.exports = router;
