// migrations/2_deploy_jtoken.js

const JToken = artifacts.require("JToken");

module.exports = function(deployer) {
  const initialSupply = 10001001; // 1,000,000 JTK
  const shardPrimes = [2, 3, 5, 7, 11]; // Example prime numbers for shards
  deployer.deploy(JToken, initialSupply, shardPrimes);
};
