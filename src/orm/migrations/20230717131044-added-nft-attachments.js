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

    await queryInterface.sequelize.query(`ALTER TABLE NftTokenDetails ADD attachments JSON;`)
    await queryInterface.sequelize.query(`ALTER TABLE NftTokenDetails ADD payAmount VARCHAR(255);`)
    await queryInterface.sequelize.query(`ALTER TABLE NftTokenDetails ADD paymentType INTEGER;`)
    await queryInterface.sequelize.query(`ALTER TABLE NftTokenDetails DROP accessDuration;`)
    
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.sequelize.query(`ALTER TABLE NftTokenDetails DROP COLUMN attachments;`)
    await queryInterface.sequelize.query(`ALTER TABLE NftTokenDetails ADD accessDuration VARCHAR(255);`)
    await queryInterface.sequelize.query(`ALTER TABLE NftTokenDetails DROP payAmount;`)
    await queryInterface.sequelize.query(`ALTER TABLE NftTokenDetails DROP paymentType;`)
  }
};
