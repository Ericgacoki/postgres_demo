const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')


class Note extends Model { }

Note.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  important: {
    type: DataTypes.BOOLEAN
  },
}, {
  sequelize,
  underscored: true,
  timestamps: true,
  modelName: 'note'
})

module.exports = Note