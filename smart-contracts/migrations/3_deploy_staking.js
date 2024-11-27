// migrations/3_deploy_staking.js

const Staking = artifacts.require("Staking");

module.exports = function(deployer, network, accounts) {
  const rewardRate = 100; // Example reward rate
  const stakingDuration = 30; // Example staking duration in days
  deployer.deploy(Staking, rewardRate, stakingDuration);
};
