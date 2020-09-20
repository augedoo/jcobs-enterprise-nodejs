const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('jcobs-enterprise', 'root', 'main0277074805.', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
