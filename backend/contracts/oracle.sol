// oracle.js

const Web3 = require('web3');
const BettingABI = require('../contracts/abi_definitions/BettingABI.json');
const { PrimeChainRNGWithQRNG } = require('./PrimeChainRNGWithQRNG');

const ORACLE_PRIVATE_KEY = 'YOUR_ORACLE_PRIVATE_KEY';
const BETTING_CONTRACT_ADDRESS = 'YOUR_BETTING_CONTRACT_ADDRESS';
const web3 = new Web3('https://your.ethereum.node'); // Replace with your node

const bettingContract = new web3.eth.Contract(BettingABI, BETTING_CONTRACT_ADDRESS);
const oracleAccount = web3.eth.accounts.privateKeyToAccount(ORACLE_PRIVATE_KEY);
web3.eth.accounts.wallet.add(oracleAccount);

bettingContract.events.BetPlaced({}, async (error, event) => {
  if (error) {
    console.error('Error in BetPlaced event:', error);
    return;
  }

  const betId = event.returnValues.betId;

  // Generate random number using QRNG
  const rng = new PrimeChainRNGWithQRNG();
  const randomNumber = await rng.hybridRandomInRange(1, 100);

  // Call fulfillRandomness on the contract
  await bettingContract.methods
    .fulfillRandomness(betId, randomNumber)
    .send({ from: oracleAccount.address, gas: 500000 });

  console.log(`Bet ${betId} resolved with random number ${randomNumber}`);
});
