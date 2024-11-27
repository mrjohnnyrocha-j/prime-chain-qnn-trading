// migrations/4_deploy_betting.js

const Betting = artifacts.require("Betting");
const JToken = artifacts.require("JToken");
const Oracle = artifacts.require("Oracle"); // Ensure Oracle.sol exists

module.exports = async function(deployer) {
  const jtokenInstance = await JToken.deployed();
  const oracleInstance = await Oracle.deployed();
  
  deployer.deploy(Betting, jtokenInstance.address, oracleInstance.address);
};
