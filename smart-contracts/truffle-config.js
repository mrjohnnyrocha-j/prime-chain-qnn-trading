const path = require("path");

module.exports = {
  contracts_build_directory: path.join(__dirname, "build/contracts"),
  
  networks: {
    development: {
      host: "127.0.0.1",     // Localhost
      port: 8545,            // Ganache CLI default port
      network_id: "5777",    // Standard Ganache network ID
      gas: 6721975,          // Gas limit - adjust as needed
      gasPrice: 20000000000, // 20 Gwei - adjust as needed
    },
    
    // Other networks (e.g., rinkeby)...
  },

  compilers: {
    solc: {
      version: "0.8.20",      // Specify the exact compiler version
      settings: {            
        optimizer: {
          enabled: true,
          runs: 200
        },
      },
    },
  },
};
