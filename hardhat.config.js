/*
require("@nomiclabs/hardhat-waffle");

module.exports = {
  solidity: "0.8.0",
  networks: {
    rinkeby: {
      url: 'https://eth-rinkeby.alchemyapi.io/v2/bJmicFhD6yic2iejGc8NuD4djCQT91dH',
      accounts: ['81d471480523cb46aad7cbfc3b4a47f1b099ad142f46f87a8a5851405ba3cd20']
    },
  },
};
*/

require('@nomiclabs/hardhat-waffle');
require('dotenv').config();

module.exports = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: process.env.STAGING_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
    mainnet: {
      chainId: 1,
      url: process.env.PROD_ALCHEMY_KEY,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
