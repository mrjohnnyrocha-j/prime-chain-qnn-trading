/**
 * @title Integration Tests for JToken Smart Contract
 * @dev Tests end-to-end interactions between backend and smart contract.
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
 * Main function to perform integration tests.
 */
const main = async () => {
  try {
    const { abi, address } = getContractData();

    // Connect to the Ethereum network
    const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    // Create contract instance
    const contract = new ethers.Contract(address, abi, wallet);

    // Test buying tokens
    console.log('Integration Test: Buying Tokens...');
    const buyAmount = 11; // Must be a prime number
    const tokenPrice = ethers.utils.parseEther('0.01'); // 0.01 ETH per JTK
    const totalCost = tokenPrice.mul(buyAmount);
    const buyTx = await contract.buyTokens({ value: totalCost });
    await buyTx.wait();
    console.log(`Purchased ${buyAmount} JTK for ${ethers.utils.formatEther(totalCost)} ETH`);

    // Fetch balance
    const balance = await contract.balanceOf(wallet.address);
    console.log(`Post-Purchase Token Balance: ${ethers.utils.formatEther(balance)} JTK`);

    // Test transfer with prime amount
    console.log('Integration Test: Transferring Tokens...');
    const recipient = '0xRecipientAddressHere'; // Replace with a valid address
    const transferAmount = 5; // Must be a prime number
    const transferTx = await contract.transfer(recipient, ethers.utils.parseEther(transferAmount.toString()));
    await transferTx.wait();
    console.log(`Transferred ${transferAmount} JTK to ${recipient}`);

    // Fetch updated balance
    const updatedBalance = await contract.balanceOf(wallet.address);
    console.log(`Updated Token Balance: ${ethers.utils.formatEther(updatedBalance)} JTK`);

    // Fetch recipient balance
    const recipientContract = new ethers.Contract(address, abi, provider);
    const recipientBalance = await recipientContract.balanceOf(recipient);
    console.log(`Recipient Token Balance: ${ethers.utils.formatEther(recipientBalance)} JTK`);

    // Test transferring non-prime amount (should fail)
    console.log('Integration Test: Transferring Non-Prime Amount (Should Fail)...');
    const invalidTransferAmount = 4; // Not a prime number
    try {
      const invalidTransferTx = await contract.transfer(recipient, ethers.utils.parseEther(invalidTransferAmount.toString()));
      await invalidTransferTx.wait();
      console.error('Error: Transfer of non-prime amount succeeded unexpectedly.');
    } catch (error) {
      console.log('Expected Failure:', error.message);
    }
  } catch (error) {
    console.error('Integration Test Error:', error);
    process.exit(1);
  }
};

main();
