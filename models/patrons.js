'use strict';
module.exports = function (sequelize, DataTypes) {
    var patrons = sequelize.define('patrons', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true
        },
        first_name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "First name is required"
                }
            }
        },
        last_name: {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Last name is required"
                }
            }
        },
        address:  {
            type: DataTypes.STRING,
            validate: {
                notEmpty: {
                    msg: "Address is required"
                }
            }
        },
        email:   {
            type: DataTypes.STRING,
            validate: {
                isEmail: {
                    msg: "Valid email is required"
                }
            }
        },
        library_id: DataTypes.STRING,
        zip_code: DataTypes.INTEGER
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        },
        timestamps: false,
        underscored: true
    });
    return patrons;
};
