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

    await queryInterface.sequelize.query(`CREATE TABLE BlockDetails (
        id INT(10) NOT NULL AUTO_INCREMENT,
        blockNumber INT(10) NULL DEFAULT NULL,
        blockDate DATETIME NULL DEFAULT NULL,
        chain ENUM('eth','bsc','matic','sol','tron','goerli') NULL DEFAULT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        PRIMARY KEY (id) USING BTREE
    )
    ENGINE=InnoDB;`)

    await queryInterface.sequelize.query(`CREATE TABLE ContractDetails (
        id INT(10) NOT NULL AUTO_INCREMENT,
        contractAddress VARCHAR(400) NULL DEFAULT NULL,
        symbol VARCHAR(25) NULL DEFAULT NULL,
        name VARCHAR(255) NULL DEFAULT NULL,
        description VARCHAR(2000) NULL DEFAULT NULL,
        chain ENUM('eth','bsc','matic','sol','tron') NULL DEFAULT NULL,
        url VARCHAR(400) NULL DEFAULT NULL ,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        PRIMARY KEY (id) USING BTREE
    )
    ENGINE=InnoDB;`)
    await queryInterface.sequelize.query(`CREATE TABLE ErrorLogs (
        id INT(10) NOT NULL AUTO_INCREMENT,
        \`key\` VARCHAR(255) NULL DEFAULT NULL,
        descr VARCHAR(400) NULL DEFAULT NULL,
        context VARCHAR(255) NULL DEFAULT NULL,
        isSummarized TINYINT(1) NULL DEFAULT '0',
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        PRIMARY KEY (id) USING BTREE,
        INDEX error_logs_is_summarized (isSummarized) USING BTREE
    )
    ENGINE=InnoDB;`)

    await queryInterface.sequelize.query(`CREATE TABLE NftCollections (
        id INT(10) NOT NULL AUTO_INCREMENT,
        collectionId VARCHAR(255) NULL DEFAULT NULL,
        name VARCHAR(255) NULL DEFAULT NULL,
        takePriceUsd DECIMAL(20,2) NULL DEFAULT NULL,
        type VARCHAR(25) NULL DEFAULT NULL,
        symbol VARCHAR(355) NULL DEFAULT NULL,
        blockchain VARCHAR(25) NULL DEFAULT NULL,
        contract VARCHAR(128) NULL DEFAULT NULL,
        imageUrl VARCHAR(300) NULL DEFAULT NULL,
        hasBid TINYINT(1) NOT NULL,
        hasSell TINYINT(1) NOT NULL,
        isEnabled TINYINT(1) NOT NULL DEFAULT '1',
        lastReadFromApi DATETIME NULL DEFAULT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        PRIMARY KEY (id) USING BTREE,
        INDEX nft_collections_symbol (symbol) USING BTREE,
        INDEX nft_collections_collection_id (collectionId) USING BTREE,
        INDEX nft_collections_is_enabled (isEnabled) USING BTREE
    )
    ENGINE=InnoDB;`)

    await queryInterface.sequelize.query(`CREATE TABLE NftItems (
        id INT(10) NOT NULL AUTO_INCREMENT,
        itemId VARCHAR(300) NULL DEFAULT NULL,
        metaName VARCHAR(128) NULL DEFAULT NULL,
        metaDescr VARCHAR(2000) NULL DEFAULT NULL,
        bestSellMakePriceUsd DECIMAL(20,2) NULL DEFAULT NULL,
        bestSellMakePrice DECIMAL(30,8) NULL DEFAULT NULL,
        bestSellDate DATETIME NULL DEFAULT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        collectionId INT(10) NULL DEFAULT NULL,
        PRIMARY KEY (id) USING BTREE,
        INDEX nft_items_item_id (itemId) USING BTREE,
        INDEX nft_items_best_sell_date (bestSellDate) USING BTREE,
        INDEX nft_items_best_sell_make_price_usd (bestSellMakePriceUsd) USING BTREE,
        INDEX collectionId (collectionId) USING BTREE,
        CONSTRAINT NftItems_ibfk_1 FOREIGN KEY (collectionId) REFERENCES NftCollections (id) ON UPDATE CASCADE ON DELETE SET NULL
    )
    ENGINE=InnoDB;`)

    await queryInterface.sequelize.query(`CREATE TABLE MetaContents (
        id INT(10) NOT NULL AUTO_INCREMENT,
        url VARCHAR(400) NULL DEFAULT NULL,
        type VARCHAR(15) NULL DEFAULT NULL,
        representation VARCHAR(10) NULL DEFAULT NULL,
        mimeType VARCHAR(50) NULL DEFAULT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        nftId INT(10) NULL DEFAULT NULL,
        PRIMARY KEY (id) USING BTREE,
        INDEX nftId (nftId) USING BTREE,
        CONSTRAINT MetaContents_ibfk_1 FOREIGN KEY (nftId) REFERENCES NftItems (id) ON UPDATE CASCADE ON DELETE SET NULL
    )
    ENGINE=InnoDB;`)

    await queryInterface.sequelize.query(`CREATE TABLE NftTokenDetails (
        id INT(10) NOT NULL AUTO_INCREMENT,
        tokenId VARCHAR(255) NULL DEFAULT NULL,
        chain ENUM('eth','bsc','matic','sol','tron','goerli') NULL DEFAULT NULL,
        contractAddress VARCHAR(255) NULL DEFAULT NULL,
        name VARCHAR(255) NULL DEFAULT NULL,
        description VARCHAR(2000) NULL DEFAULT NULL,
        contentUrl LONGTEXT NULL DEFAULT NULL,
        attributes JSON NULL DEFAULT NULL,
        createdAt DATETIME NOT NULL,
        updatedAt DATETIME NOT NULL,
        accessPrice VARCHAR(255) NULL DEFAULT NULL,
        accessDuration VARCHAR(255) NULL DEFAULT NULL,
        isEncrypted TINYINT(1) NULL DEFAULT NULL,
        PRIMARY KEY (id) USING BTREE
    )
    ENGINE=InnoDB;`)
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable('BlockDetails')
    await queryInterface.dropTable('ContractDetails')
    await queryInterface.dropTable('ErrorLogs')
    await queryInterface.dropTable('MetaContents')
    await queryInterface.dropTable('NftItems')
    await queryInterface.dropTable('NftCollections')
    await queryInterface.dropTable('NftTokenDetails')
  }
};
