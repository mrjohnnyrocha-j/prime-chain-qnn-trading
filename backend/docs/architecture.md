# Project Architecture

The backend consists of Python scripts interacting with the blockchain via the Web3.py library. Each script performs a different DeFi-related function, such as adding/removing liquidity, staking tokens, managing cross-chain bridges, and minting new JTokens.

Smart contracts for staking, liquidity management, and token generation are deployed on the blockchain and accessed by the backend through their ABI definitions.
