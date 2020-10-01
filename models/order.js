const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Order = sequelize.define('order', {
  id: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
});

module.exports = Order;
