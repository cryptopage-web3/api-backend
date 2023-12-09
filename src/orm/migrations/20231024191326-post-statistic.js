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
      CREATE TABLE IF NOT EXISTS PostStatistics (
        id INT(10) NOT NULL AUTO_INCREMENT,
        chain ENUM('eth','bsc','matic','mumbai','sol','tron','goerli') NULL DEFAULT NULL,
        postId VARCHAR(18) NULL DEFAULT NULL,
        totalCommentsCount INT(10) NULL DEFAULT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        PRIMARY KEY (id) USING BTREE,
        INDEX post_statistics_chain_total_comments_count (chain, totalCommentsCount) USING BTREE
      )
      ENGINE=InnoDB;`)

    await queryInterface.sequelize.query(`
      CREATE TABLE IF NOT EXISTS PostSyncedBlocks (
        id INT(10) NOT NULL AUTO_INCREMENT,
        blockNumber INT(10) NULL DEFAULT NULL,
        chain ENUM('eth','bsc','matic','mumbai','sol','tron','goerli') NULL DEFAULT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        PRIMARY KEY (id) USING BTREE
      )
      ENGINE=InnoDB;`
    )

  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('PostStatistics')
    await queryInterface.dropTable('PostSyncedBlocks')
  }
};
