// contracts/Staking.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Staking is AccessControl {
    IERC20 public jtoken;

    mapping(address => uint256) public stakedBalance;
    mapping(address => uint256) public rewardBalance;
    mapping(address => uint256) public lastUpdateTime;

    uint256 public rewardRate = 1000; // Adjust as needed

    event Staked(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);
    event RewardClaimed(address indexed user, uint256 amount);

    constructor(IERC20 _jtoken) {
        jtoken = _jtoken;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function stake(uint256 amount) external {
        require(amount > 0, "Cannot stake zero tokens");
        updateReward(msg.sender);
        require(jtoken.transferFrom(msg.sender, address(this), amount), "Token transfer failed");
        stakedBalance[msg.sender] += amount;
        emit Staked(msg.sender, amount);
    }

    function withdraw() external {
        uint256 amount = stakedBalance[msg.sender];
        require(amount > 0, "No tokens to withdraw");
        updateReward(msg.sender);
        stakedBalance[msg.sender] = 0;
        require(jtoken.transfer(msg.sender, amount), "Token transfer failed");
        emit Withdrawn(msg.sender, amount);
    }

    function claimReward() external {
        updateReward(msg.sender);
        uint256 reward = rewardBalance[msg.sender];
        require(reward > 0, "No rewards to claim");
        rewardBalance[msg.sender] = 0;
        require(jtoken.transfer(msg.sender, reward), "Reward transfer failed");
        emit RewardClaimed(msg.sender, reward);
    }

    function updateReward(address account) internal {
        uint256 timeDifference = block.timestamp - lastUpdateTime[account];
        if (timeDifference > 0) {
            rewardBalance[account] += (stakedBalance[account] * rewardRate * timeDifference) / 1e18;
            lastUpdateTime[account] = block.timestamp;
        }
    }
}
