/**
 * @title Prime Utils
 * @dev Utility functions for working with prime numbers, including prime checking and prime factorization.
 */

/**
 * Checks if a given number is prime.
 * @param {number} num - The number to check.
 * @returns {boolean} - True if the number is prime, otherwise false.
 */
const isPrime = (num) => {
  if (num < 2) return false;
  if (num === 2 || num === 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
};

/**
 * Performs prime factorization on a given number.
 * @param {number} num - The number to factorize.
 * @returns {number[]} - An array of prime factors.
 */
const primeFactorization = (num) => {
  const factors = [];
  let divisor = 2;

  while (num >= 2) {
    if (num % divisor === 0) {
      factors.push(divisor);
      num = num / divisor;
    } else {
      divisor++;
      // Early termination for efficiency
      if (divisor * divisor > num && num > 1) {
        factors.push(num);
        break;
      }
    }
  }

  return factors;
};

/**
 * Generates an array of prime numbers up to a specified limit using the Sieve of Eratosthenes.
 * @param {number} limit - The upper bound to generate prime numbers.
 * @returns {number[]} - An array of prime numbers up to the limit.
 */
const generatePrimes = (limit) => {
  const sieve = new Array(limit + 1).fill(true);
  sieve[0] = sieve[1] = false;

  for (let p = 2; p * p <= limit; p++) {
    if (sieve[p]) {
      for (let i = p * p; i <= limit; i += p) {
        sieve[i] = false;
      }
    }
  }

  const primes = [];
  for (let i = 2; i <= limit; i++) {
    if (sieve[i]) primes.push(i);
  }

  return primes;
};

module.exports = {
  isPrime,
  primeFactorization,
  generatePrimes,
};
