const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const User = require('./User')
const Project = require('./Project')

const Baptism = db.define('Baptism', {
    birthDate: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    father: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    mother: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    observacao: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    godparents: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    }

})

Baptism.belongsTo(User)
User.hasMany(Baptism)

module.exports = Baptism