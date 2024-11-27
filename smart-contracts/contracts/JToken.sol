// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title JToken (JTK)
 * @dev ERC20 Token with Access Control, Prime-Based Sharding, and Prime Chain Indexing (PCI) System.
 */
contract JToken is ERC20, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant SHARDER_ROLE = keccak256("SHARDER_ROLE");

    // Prime numbers assigned to shards (for demonstration purposes)
    uint256[] public shardPrimes;

    // Mapping from shard prime to shard index
    mapping(uint256 => uint256) public primeToShardIndex;

    // Event for token purchases
    event TokensPurchased(address indexed purchaser, uint256 amount, uint256 cost);

    /**
     * @dev Constructor that initializes the token, assigns roles, and sets up sharding primes.
     * @param initialSupply Initial token supply.
     * @param _shardPrimes Array of prime numbers representing shards.
     */
    constructor(uint256 initialSupply, uint256[] memory _shardPrimes) ERC20("JToken", "JTK") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(SHARDER_ROLE, msg.sender);

        shardPrimes = _shardPrimes;
        for (uint256 i = 0; i < _shardPrimes.length; i++) {
            primeToShardIndex[_shardPrimes[i]] = i;
        }

        _mint(msg.sender, initialSupply);
    }

    /**
     * @dev Function to mint new tokens. Only accounts with MINTER_ROLE can mint.
     * @param to The address to receive the minted tokens.
     * @param amount The amount of tokens to mint.
     */
    function mint(address to, uint256 amount) external onlyRole(MINTER_ROLE) {
        require(to != address(0), "JToken: mint to the zero address");
        require(amount > 0, "JToken: mint amount must be greater than zero");
        _mint(to, amount);
    }

    /**
     * @dev Function to buy tokens with ETH. Applies Prime Chain Indexing (PCI) during purchase.
     */
    function buyTokens() external payable {
        require(msg.value > 0, "JToken: No ETH sent");

        // Define token price (e.g., 0.01 ETH per JTK)
        uint256 TOKEN_PRICE = 0.01 ether;

        uint256 amount = msg.value / TOKEN_PRICE;
        require(isPrime(amount), "JToken: Purchase amount must be a prime number");

        _mint(msg.sender, amount);
        emit TokensPurchased(msg.sender, amount, msg.value);
    }

    /**
     * @dev Override _beforeTokenTransfer to include PCI checks and Prime-Based Sharding.
     * @param from The address tokens are transferred from.
     * @param to The address tokens are transferred to.
     * @param amount The amount of tokens transferred.
     */
    function _beforeTokenTransfer(address from, address to, uint256 amount) internal override {
        super._beforeTokenTransfer(from, to, amount);

        // Prime Chain Indexing: Ensure that transfer amount is a prime number
        require(isPrime(amount), "JToken: transfer amount must be a prime number");

        // Prime-Based Sharding: Determine shards based on transfer amount's prime factors
        uint256[] memory factors = primeFactorization(amount);
        for (uint256 i = 0; i < factors.length; i++) {
            require(hasRole(SHARDER_ROLE, from) || hasRole(SHARDER_ROLE, to), "JToken: Sharder role required");
            // Implement shard-specific logic here if necessary
        }
    }

    /**
     * @dev Checks if a number is prime using an optimized algorithm.
     * @param num The number to check.
     * @return bool indicating if the number is prime.
     */
    function isPrime(uint256 num) internal pure returns (bool) {
        if (num < 2) return false;
        if (num == 2 || num == 3) return true;
        if (num % 2 == 0 || num % 3 == 0) return false;
        for (uint256 i = 5; i * i <= num; i += 6) {
            if (num % i == 0 || num % (i + 2) == 0) return false;
        }
        return true;
    }

    /**
     * @dev Returns the prime factors of a number.
     * @param num The number to factorize.
     * @return factors An array of prime factors.
     */
    function primeFactorization(uint256 num) internal pure returns (uint256[] memory factors) {
        uint256 temp = num;
        uint256 maxFactors = 100; // Adjust as needed
        uint256[] memory tempFactors = new uint256[](maxFactors);
        uint256 count = 0;

        // Divide by 2
        while (temp % 2 == 0) {
            tempFactors[count++] = 2;
            temp /= 2;
        }

        // Divide by odd numbers
        for (uint256 i = 3; i * i <= temp; i += 2) {
            while (temp % i == 0) {
                tempFactors[count++] = i;
                temp /= i;
            }
        }

        // If remaining number is a prime
        if (temp > 2) {
            tempFactors[count++] = temp;
        }

        // Resize the array to actual number of factors
        factors = new uint256[](count);
        for (uint256 j = 0; j < count; j++) {
            factors[j] = tempFactors[j];
        }
    }
}
