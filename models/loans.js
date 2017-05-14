'use strict';
module.exports = function (sequelize, DataTypes) {
    var loans = sequelize.define('loans', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        book_id: {
            type: DataTypes.INTEGER,
            validate: {
                isInt: {
                    msg: "Book Id is required"
                }
            }
        },
        patron_id: {
            type: DataTypes.INTEGER,
            validate: {
                isInt: {
                    msg: "Patron Id is required"
                }
            }
        },
        loaned_on: {
            type: DataTypes.DATE,
            validate: {
                isDate: {
                    msg: "Date is required"
                }
            }
        },
        return_by: {
            type: DataTypes.DATE,
            validate: {
                isDate: {
                    msg: "Date is required"
                }
            }
        },
        returned_on: DataTypes.DATE
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        },
        timestamps: false,
        underscored: true
    });
    return loans;
};
