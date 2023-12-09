'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS FrontErrors (
        id INTEGER NOT NULL auto_increment ,
        message VARCHAR(2000) NOT NULL, 
        callStack TEXT NOT NULL, 
        ip VARCHAR(50), 
        context JSON, 
        createdAt DATETIME NOT NULL, 
        updatedAt DATETIME NOT NULL, 
        PRIMARY KEY (id)) 
        ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.query(
      `DROP TABLE IF EXISTS FrontErrors`
    )
  }
};
