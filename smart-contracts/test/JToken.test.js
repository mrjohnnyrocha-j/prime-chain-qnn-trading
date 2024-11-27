// test/JToken.test.js

const JToken = artifacts.require("JToken");
const { expect } = require("chai");

contract("JToken", accounts => {
  const [owner, user1, user2] = accounts;
  const initialSupply = 1000000;
  const shardPrimes = [2, 3, 5, 7, 11];

  let jTokenInstance;

  beforeEach(async () => {
    jTokenInstance = await JToken.new(initialSupply, shardPrimes, { from: owner });
  });

  it("should have correct initial supply", async () => {
    const balance = await jTokenInstance.balanceOf(owner);
    expect(balance.toNumber()).to.equal(initialSupply);
  });

  it("should assign MINTER_ROLE and SHARDER_ROLE to owner", async () => {
    const minterRole = await jTokenInstance.MINTER_ROLE();
    const sharderRole = await jTokenInstance.SHARDER_ROLE();

    const hasMinterRole = await jTokenInstance.hasRole(minterRole, owner);
    const hasSharderRole = await jTokenInstance.hasRole(sharderRole, owner);

    expect(hasMinterRole).to.be.true;
    expect(hasSharderRole).to.be.true;
  });

  it("should allow owner to mint tokens", async () => {
    const mintAmount = 5000;
    await jTokenInstance.mint(user1, mintAmount, { from: owner });

    const balance = await jTokenInstance.balanceOf(user1);
    expect(balance.toNumber()).to.equal(mintAmount);
  });

  it("should prevent non-minters from minting tokens", async () => {
    const mintAmount = 5000;
    try {
      await jTokenInstance.mint(user1, mintAmount, { from: user1 });
      assert.fail("Non-minter was able to mint tokens");
    } catch (error) {
      expect(error.reason).to.equal("AccessControl: account " + user1.toLowerCase() + " is missing role " + await jTokenInstance.MINTER_ROLE());
    }
  });

  it("should allow users to buy tokens with prime amount", async () => {
    const tokenPrice = web3.utils.toWei('0.01', 'ether');
    const ethSent = web3.utils.toWei('0.05', 'ether'); // 5 ETH sent
    const expectedTokens = 5 / 0.01; // 500 tokens

    await jTokenInstance.buyTokens({ from: user1, value: ethSent });

    const balance = await jTokenInstance.balanceOf(user1);
    expect(balance.toNumber()).to.equal(500);
  });

  it("should prevent buying tokens with non-prime amount", async () => {
    const tokenPrice = web3.utils.toWei('0.01', 'ether');
    const ethSent = web3.utils.toWei('0.04', 'ether'); // 4 ETH sent -> 400 tokens (non-prime)

    try {
      await jTokenInstance.buyTokens({ from: user1, value: ethSent });
      assert.fail("Bought tokens with non-prime amount");
    } catch (error) {
      expect(error.reason).to.equal("JToken: Purchase amount must be a prime number");
    }
  });
});
