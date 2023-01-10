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
    await queryInterface.bulkDelete('NftTokenDetails')

    await queryInterface.sequelize.query(`ALTER TABLE NftTokenDetails
      CHANGE COLUMN contentUrl contentUrl LONGTEXT NULL AFTER description;`)

    await queryInterface.sequelize.query(`ALTER TABLE NftTokenDetails ADD accessPrice VARCHAR(255);`)
    await queryInterface.sequelize.query(`ALTER TABLE NftTokenDetails ADD accessDuration VARCHAR(255);`)
    await queryInterface.sequelize.query(`ALTER TABLE NftTokenDetails ADD isEncrypted TINYINT(1);`)
    
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
