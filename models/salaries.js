'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class salaries extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  salaries.init({
    employee_id: DataTypes.INTEGER,
    month: DataTypes.STRING,
    year: DataTypes.INTEGER,
    total_working_days: DataTypes.INTEGER,
    total_leaves_taken: DataTypes.INTEGER,
    overtime: DataTypes.INTEGER,
    total_salary_made: DataTypes.INTEGER
  },{
    sequelize,
    modelName: 'salaries',
  });
  return salaries;
};