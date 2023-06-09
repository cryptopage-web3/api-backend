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
    await queryInterface.sequelize.query(`ALTER TABLE NftTokenDetails CHANGE chain chain ENUM('eth', 'bsc', 'matic', 'mumbai', 'sol', 'tron', 'goerli')`)
    await queryInterface.sequelize.query(`ALTER TABLE BlockDetails CHANGE chain chain ENUM('eth', 'bsc', 'matic', 'mumbai', 'sol', 'tron', 'goerli')`)
    await queryInterface.sequelize.query(`ALTER TABLE ContractDetails CHANGE chain chain ENUM('eth', 'bsc', 'matic', 'mumbai', 'sol', 'tron')`)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
