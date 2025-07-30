const {Sequelize} = require('sequelize')

const sequelize = new Sequelize('pensamentos', 'root', 'victorluiza', {
    host: 'localhost',
    dialect: 'mysql',
})

try {
    console.log('conectamos com sucesso ao banco')
} catch (err) {
    console.log(`nao foi possivel conectar: ${err}`)
}

module.exports = sequelize