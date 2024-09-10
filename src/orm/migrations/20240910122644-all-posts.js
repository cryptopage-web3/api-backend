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
    await queryInterface.sequelize.query(`ALTER TABLE PostSyncedBlocks ADD \`event\` ENUM('WriteComment', 'WritePost', 'BurnPost') AFTER chain;`)
    await queryInterface.sequelize.query('DELETE FROM PostStatistics')
    await queryInterface.sequelize.query('DELETE FROM PostSyncedBlocks')
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.sequelize.query(`ALTER TABLE PostSyncedBlocks DROP COLUMN \`event\`;`)
  }
};
