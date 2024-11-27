// backend/config.js

const NETWORKS = {
    mainnet: {
      name: 'mainnet',
      rpcUrl: 'https://mainnet.infura.io/v3/5ab9620d592d4760a51ee42cac54bf95',
    },
    goerli: {
      name: 'goerli',
      rpcUrl: 'https://goerli.infura.io/v3/5ab9620d592d4760a51ee42cac54bf95',
    },
    // Add other networks as needed
  };
  
  module.exports = { NETWORKS };
  