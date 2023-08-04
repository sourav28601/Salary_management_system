'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class leave extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  leave.init({
    employee_id: DataTypes.INTEGER,
    date: DataTypes.DATEONLY,
    reason: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'leave',
  });
  return leave;
};