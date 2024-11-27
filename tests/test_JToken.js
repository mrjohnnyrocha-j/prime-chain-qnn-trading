/**
 * @title Test JToken Smart Contract
 * @dev Script to test basic functionalities of the JToken.sol contract.
 */

const fs = require('fs');
const path = require('path');
const { ethers } = require('ethers');
require('dotenv').config();

/**
 * Reads the contract ABI and address from the frontend artifacts.
 * @returns {Object} - The contract's ABI and address.
 */
const getContractData = () => {
  const abiPath = path.resolve(__dirname, '../../frontend/src/contracts/abi_definitions/JTokenABI.json');
  const addressPath = path.resolve(__dirname, '../../frontend/src/contracts/abi_definitions/contractAddress.json');

  const abi = JSON.parse(fs.readFileSync(abiPath, 'utf8'));
  const { address } = JSON.parse(fs.readFileSync(addressPath, 'utf8'));

  return { abi, address };
};

/**
 * Main function to perform tests.
 */
const main = async () => {
  try {
    const { abi, address } = getContractData();

    // Connect to the Ethereum network
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Create contract instance
    const contract = new ethers.Contract(address, abi, wallet);

    // Test minting tokens (assuming the deployer has MINTER_ROLE)
    console.log('Testing mint function...');
    const mintAmount = ethers.utils.parseEther('1000'); // 1,000 JTK
    const mintTx = await contract.mint(wallet.address, mintAmount);
    await mintTx.wait();
    console.log(`Minted ${ethers.utils.formatEther(mintAmount)} JTK to ${wallet.address}`);

    // Test balance
    console.log('Checking token balance...');
    const balance = await contract.balanceOf(wallet.address);
    console.log(`Token Balance: ${ethers.utils.formatEther(balance)} JTK`);

    // Test buyTokens function
    console.log('Testing buyTokens function...');
    const buyAmount = 7; // Must be a prime number
    const tokenPrice = ethers.utils.parseEther('0.01'); // 0.01 ETH per JTK
    const totalCost = tokenPrice.mul(buyAmount);
    const buyTx = await contract.buyTokens({ value: totalCost });
    await buyTx.wait();
    console.log(`Purchased ${buyAmount} JTK for ${ethers.utils.formatEther(totalCost)} ETH`);

    // Check updated balance
    const updatedBalance = await contract.balanceOf(wallet.address);
    console.log(`Updated Token Balance: ${ethers.utils.formatEther(updatedBalance)} JTK`);
  } catch (error) {
    console.error('Test Error:', error);
    process.exit(1);
  }
};

main();
