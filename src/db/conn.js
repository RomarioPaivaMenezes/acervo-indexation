const { Sequelize } = require('sequelize')
const sequelize = new Sequelize('acervognlc', 'root', 'root', {
    host: 'localhost', 
    dialect: 'mysql'
})


try {
    sequelize.authenticate()
    console.log('Connected!')
} catch (error) {
    console.log('Unable connecting to the database!')
}

module.exports = sequelize