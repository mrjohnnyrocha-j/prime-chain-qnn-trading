// test/Migrations.test.js

const Migrations = artifacts.require("Migrations");

contract("Migrations", accounts => {
  it("should set the correct owner upon deployment", async () => {
    const migrations = await Migrations.deployed();
    const owner = await migrations.owner();
    assert.equal(owner, accounts[0], "Owner is not the deployer");
  });

  it("should allow owner to set completed migration", async () => {
    const migrations = await Migrations.deployed();
    await migrations.setCompleted(1, { from: accounts[0] });
    const lastCompleted = await migrations.last_completed_migration();
    assert.equal(lastCompleted.toNumber(), 1, "Last completed migration not set correctly");
  });

  it("should prevent non-owner from setting completed migration", async () => {
    const migrations = await Migrations.deployed();
    try {
      await migrations.setCompleted(2, { from: accounts[1] });
      assert.fail("Non-owner was able to set completed migration");
    } catch (error) {
      assert(error.message.includes("revert"), "Expected revert error");
    }
  });
});
