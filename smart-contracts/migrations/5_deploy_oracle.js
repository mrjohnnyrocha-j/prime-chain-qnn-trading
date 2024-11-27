// Example: migrations/5_deploy_oracle.js

const Oracle = artifacts.require("Oracle");
const oracleScript = require("../scripts/oracle.js"); // Adjusted path

module.exports = function(deployer) {
  deployer.deploy(Oracle).then(() => {
    // Initialize Oracle if needed
  });
};
