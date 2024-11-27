const { primeFactorization } = require('../utils/primeUtils');

/**
 * @title Sharding Middleware
 * @dev Middleware to assign data records to shards based on Prime-Based Sharding (PBS) Technique.
 *      It factorizes the recordId and assigns shard indices accordingly.
 *      Shard primes should be predefined and consistent with the smart contract's shard primes.
 */

// Predefined prime numbers assigned to shards (consistent with the smart contract)
const shardPrimes = [
  2,  // Shard 0
  3,  // Shard 1
  5,  // Shard 2
  7,  // Shard 3
  11, // Shard 4
  13, // Shard 5
  // Add more primes as needed for additional shards
];

/**
 * Maps a prime number to its corresponding shard index.
 * @param {number} prime - The prime number representing a shard.
 * @returns {number} - The shard index.
 */
const getShardIndex = (prime) => {
  const index = shardPrimes.indexOf(prime);
  if (index === -1) {
    throw new Error(`Shard prime ${prime} is not recognized.`);
  }
  return index;
};

/**
 * Sharding middleware function.
 * Extracts recordId from request body, performs prime factorization,
 * and assigns shards based on the prime factors.
 * Adds the assigned shard indices to req.shards for downstream use.
 */
const shardingMiddleware = (req, res, next) => {
  try {
    const { recordId } = req.body;

    if (!recordId || typeof recordId !== 'number') {
      return res.status(400).json({ message: 'Invalid or missing recordId' });
    }

    // Perform prime factorization on recordId
    const factors = primeFactorization(recordId);

    // Assign shards based on prime factors
    const shardIndices = factors.map((prime) => {
      try {
        return getShardIndex(prime);
      } catch (error) {
        console.error(error.message);
        // Optionally, handle unrecognized primes differently
        throw error;
      }
    });

    // Remove duplicate shard indices to avoid redundant assignments
    const uniqueShardIndices = [...new Set(shardIndices)];

    // Attach shard indices to request object for downstream handlers
    req.shards = uniqueShardIndices;

    next();
  } catch (error) {
    console.error('Sharding Middleware Error:', error.message);
    res.status(500).json({ message: 'Error during sharding assignment' });
  }
};

module.exports = shardingMiddleware;
