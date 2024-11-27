// contracts/Betting.sol

// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Betting is AccessControl {
    IERC20 public jtoken;
    address public oracle;

    enum BetStatus { Placed, Resolved }
    enum Outcome { Pending, Won, Lost }

    struct Bet {
        uint256 amount;
        address payable bettor;
        string eventName;
        BetStatus status;
        Outcome outcome;
        uint256 odds;
    }

    mapping(uint256 => Bet) public bets;
    uint256 public betCounter;

    event BetPlaced(uint256 indexed betId, address indexed bettor, uint256 amount, string eventName);
    event BetResolved(uint256 indexed betId, bool won, uint256 payout);
    event OracleResponse(uint256 indexed betId, uint256 randomNumber);

    modifier onlyOracle() {
        require(msg.sender == oracle, "Only oracle can call this function");
        _;
    }

    constructor(IERC20 _jtoken, address _oracle) {
        jtoken = _jtoken;
        oracle = _oracle;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function placeBet(uint256 amount, string calldata eventName) external {
        require(amount > 0, "Bet amount must be greater than zero");
        require(jtoken.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        bets[betCounter] = Bet({
            amount: amount,
            bettor: payable(msg.sender),
            eventName: eventName,
            status: BetStatus.Placed,
            outcome: Outcome.Pending,
            odds: 0
        });

        emit BetPlaced(betCounter, msg.sender, amount, eventName);

        // Off-chain oracle should process this bet and call fulfillRandomness()
        betCounter++;
    }

    // Called by the oracle with the random number
    function fulfillRandomness(uint256 betId, uint256 randomNumber) external onlyOracle {
        require(bets[betId].status == BetStatus.Placed, "Bet is already resolved");

        Bet storage bet = bets[betId];
        bet.status = BetStatus.Resolved;
        bet.odds = randomNumber % 100;
        bet.outcome = bet.odds > 50 ? Outcome.Won : Outcome.Lost;

        uint256 payout = 0;
        if (bet.outcome == Outcome.Won) {
            payout = bet.amount * 2;
            require(jtoken.transfer(bet.bettor, payout), "Payout transfer failed");
        }

        emit BetResolved(betId, bet.outcome == Outcome.Won, payout);
        emit OracleResponse(betId, randomNumber);
    }

    // Update oracle address
    function updateOracle(address _oracle) external onlyRole(DEFAULT_ADMIN_ROLE) {
        oracle = _oracle;
    }
}
