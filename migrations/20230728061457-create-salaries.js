'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('salaries', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      employee_id: {
        type: Sequelize.INTEGER
      },
      month: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.INTEGER
      },
      total_working_days: {
        type: Sequelize.INTEGER
      },
      total_leaves_taken: {
        type: Sequelize.INTEGER
      },
      overtime: {
        type: Sequelize.INTEGER
      },
      total_salary_made: {
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('salaries');
  }
};