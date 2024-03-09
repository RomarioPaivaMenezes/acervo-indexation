const {DataTypes} = require('sequelize')
const db = require('../db/conn')

const User = require('./User')
const Baptism = require('./Baptism')

const Project = db.define('Project', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true
    },
    owner: {
        type: DataTypes.INTEGER,
    }
})

Project.belongsToMany(User, { through: 'UserProject' });
User.belongsToMany(Project, { through: 'UserProject' });

Project.hasMany(Baptism)
Baptism.belongsToMany(Project, { through: 'ProjectBaptism' })

module.exports = Project

