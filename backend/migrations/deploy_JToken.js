/**
 * @title Deploy JToken Smart Contract
 * @dev Script to compile and deploy the JToken.sol smart contract without using Hardhat or Truffle.
 *      Utilizes ethers.js and solc for compilation and deployment.
 */

const fs = require('fs');
const path = require('path');
const solc = require('solc');
const { ethers } = require('ethers');
require('dotenv').config();

/**
 * Resolves the path for imported Solidity files.
 * @param {string} importPath - The path specified in the Solidity import statement.
 * @returns {Object} - Object containing the contents of the imported file.
 */
const findImports = (importPath) => {
  try {
    // Adjust the base path according to your project structure
    const basePath = path.resolve(__dirname, '../contracts');
    const fullPath = path.resolve(basePath, importPath.replace('./', ''));
    const contents = fs.readFileSync(fullPath, 'utf8');
    return { contents };
  } catch (error) {
    console.error(`Error importing ${importPath}: ${error.message}`);
    return { error: 'File not found' };
  }
};

/**
 * Reads and compiles the Solidity contract.
 * @param {string} contractName - The name of the contract file (e.g., 'JToken.sol').
 * @returns {Object} - The compiled contract's ABI and bytecode.
 */
const compileContract = (contractName) => {
  const contractPath = path.resolve(__dirname, '../contracts', contractName);
  const source = fs.readFileSync(contractPath, 'utf8');

  // Configure solc input
  const input = {
    language: 'Solidity',
    sources: {
      [contractName]: {
        content: source,
      },
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      outputSelection: {
        '*': {
          '*': ['abi', 'evm.bytecode'],
        },
      },
    },
  };

  // Compile the contract with the import callback
  const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

  // Check for compilation errors
  if (output.errors) {
    const errors = output.errors.filter((error) => error.severity === 'error');
    if (errors.length > 0) {
      errors.forEach((error) => console.error(error.formattedMessage));
      throw new Error('Compilation failed with errors');
    }
  }

  // Extract ABI and bytecode
  const contractData = output.contracts[contractName]['JToken'];
  const abi = contractData.abi;
  const bytecode = contractData.evm.bytecode.object;

  return { abi, bytecode };
};

/**
 * Deploys the compiled contract to the blockchain.
 * @param {Object} compiledContract - The compiled contract's ABI and bytecode.
 * @param {number[]} shardPrimes - Array of prime numbers representing shards.
 * @returns {string} - The deployed contract address.
 */
const deployContract = async (compiledContract, shardPrimes) => {
  // Connect to the Ethereum network
  const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  console.log(`Deploying contract with account: ${wallet.address}`);

  // Create a ContractFactory
  const factory = new ethers.ContractFactory(compiledContract.abi, compiledContract.bytecode, wallet);

  // Deploy the contract with constructor arguments
  const initialSupply = ethers.utils.parseEther('1000000'); // 1,000,000 JTK
  const contract = await factory.deploy(initialSupply, shardPrimes);

  console.log('Awaiting confirmations...');
  await contract.deployed();

  console.log(`Contract deployed at address: ${contract.address}`);

  return contract.address;
};

/**
 * Main function to compile and deploy the contract.
 */
const main = async () => {
  try {
    const contractName = 'JToken.sol';
    console.log(`Compiling contract: ${contractName}`);
    const compiledContract = compileContract(contractName);

    // Define shard primes (should match the backend sharding middleware)
    const shardPrimes = [2, 3, 5, 7, 11, 13]; // Example primes for shards 0-5

    console.log(`Deploying contract with shard primes: ${shardPrimes}`);
    const contractAddress = await deployContract(compiledContract, shardPrimes);

    // Save the ABI and contract address for frontend use
    const artifactsPath = path.resolve(__dirname, '../frontend/src/contracts/abi_definitions');
    if (!fs.existsSync(artifactsPath)) {
      fs.mkdirSync(artifactsPath, { recursive: true });
    }

    fs.writeFileSync(
      path.join(artifactsPath, 'JTokenABI.json'),
      JSON.stringify(compiledContract.abi, null, 2),
      'utf8'
    );

    fs.writeFileSync(
      path.join(artifactsPath, 'contractAddress.json'),
      JSON.stringify({ address: contractAddress }, null, 2),
      'utf8'
    );

    console.log('ABI and contract address saved for frontend.');
  } catch (error) {
    console.error('Deployment Error:', error);
    process.exit(1);
  }
};

main();
