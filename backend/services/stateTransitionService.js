const { primeFactorization } = require('../utils/primeUtils');

/**
 * @title StateTransitionService
 * @dev Handles state transitions using Prime Factorization-Based State Transitions (PFBST) mechanism.
 */

/**
 * Applies state transitions based on prime factors.
 * @param {number} currentState - The current state represented as a product of prime numbers.
 * @param {number[]} operations - Array of operation primes to apply.
 * @returns {number} - The new state after applying transitions.
 */
const applyStateTransition = (currentState, operations) => {
  let newState = currentState;
  operations.forEach((prime) => {
    newState *= prime;
  });
  return newState;
};

/**
 * Verifies the state transition by factorizing the new state.
 * @param {number} newState - The new state to verify.
 * @param {number[]} expectedOperations - Array of operation primes expected to be applied.
 * @returns {boolean} - True if transition is valid, else false.
 */
const verifyStateTransition = (newState, expectedOperations) => {
  const factors = primeFactorization(newState);
  // Check if all expected operations are present in the factors
  return expectedOperations.every((op) => factors.includes(op));
};

module.exports = { applyStateTransition, verifyStateTransition };
