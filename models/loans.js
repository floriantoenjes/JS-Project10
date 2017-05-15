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
                    msg: "Loaned on is required"
                }
            }
        },
        return_by: {
            type: DataTypes.DATE
        },
        returned_on: {
            type: DataTypes.DATE,
            validate: {
                isDate: {
                    msg: "Return on date is required"
                }
            }
        },
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
