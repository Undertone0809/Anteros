// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(
        address recipient,
        uint256 amount
    ) external returns (bool);
    function transferFrom(
        address sender,
        address recipient,
        uint256 amount
    ) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract RippleUsdBetting {
    address public owner;
    IERC20 public rippleUSD;
    uint256 public startTime;
    uint256 public endTime;
    uint256 public targetValue;
    bool public isFinalized;

    struct Bet {
        address user;
        uint256 amount;
        uint256 predictedValue;
    }

    Bet[] public bets;
    mapping(address => bool) public hasBet;

    event BetPlaced(
        address indexed user,
        uint256 amount,
        uint256 predictedValue
    );
    event WinnerDeclared(address indexed winner, uint256 reward);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not contract owner");
        _;
    }

    modifier onlyDuringBetting() {
        require(
            block.timestamp >= startTime && block.timestamp <= endTime,
            "Betting period closed"
        );
        _;
    }

    constructor(
        address _rippleUSD,
        uint256 _startTime,
        uint256 _endTime,
        uint256 _targetValue
    ) {
        require(_startTime < _endTime, "Invalid time range");
        owner = msg.sender;
        rippleUSD = IERC20(_rippleUSD);
        startTime = _startTime;
        endTime = _endTime;
        targetValue = _targetValue;
    }

    function placeBet(
        uint256 _predictedValue,
        uint256 _amount
    ) external onlyDuringBetting {
        require(!hasBet[msg.sender], "Already placed a bet");
        require(_amount > 0, "Bet amount must be greater than zero");

        rippleUSD.transferFrom(msg.sender, address(this), _amount);
        bets.push(Bet(msg.sender, _amount, _predictedValue));
        hasBet[msg.sender] = true;

        emit BetPlaced(msg.sender, _amount, _predictedValue);
    }

    function finalizeBet() external onlyOwner {
        require(block.timestamp > endTime, "Betting period not yet over");
        require(!isFinalized, "Already finalized");
        require(bets.length > 0, "No bets placed");

        uint256 closestDifference = type(uint256).max;
        address winner;
        uint256 totalPool;

        for (uint256 i = 0; i < bets.length; i++) {
            totalPool += bets[i].amount;
            uint256 difference = absDiff(bets[i].predictedValue, targetValue);
            if (difference < closestDifference) {
                closestDifference = difference;
                winner = bets[i].user;
            }
        }

        if (winner != address(0)) {
            rippleUSD.transfer(winner, totalPool);
            emit WinnerDeclared(winner, totalPool);
        }
        isFinalized = true;
    }

    function absDiff(uint256 a, uint256 b) private pure returns (uint256) {
        return a > b ? a - b : b - a;
    }

    function withdrawUnclaimedFunds() external onlyOwner {
        require(isFinalized, "Bet not finalized yet");
        uint256 balance = rippleUSD.balanceOf(address(this));
        require(balance > 0, "No funds to withdraw");
        rippleUSD.transfer(owner, balance);
    }
}
