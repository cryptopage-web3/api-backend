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
      CREATE TABLE IF NOT EXISTS Users (
        id INTEGER NOT NULL auto_increment ,
        address VARCHAR(128), 
        ip VARCHAR(50), 
        createdAt DATETIME NOT NULL, 
        updatedAt DATETIME NOT NULL, 
        PRIMARY KEY (id)) 
        ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `)

    await queryInterface.sequelize.query(`
      ALTER TABLE Users ADD UNIQUE INDEX users_address (address)
    `)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.sequelize.query(`DROP TABLE IF EXISTS Users`)
  }
};
