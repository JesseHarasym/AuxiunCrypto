//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0 <0.8.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../node_modules/@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Coin is ERC20 {
    //Variables for the name, symbol, totalSupply and decimal of the coin.
    //The decimal states how much the coin can be broken down.
    //Totalsupply is will hold the total value of coins in exsistence
    string private _name = "AuxiunCoin";
    string private _symbol = "AC";
    uint8 private _decimals;
    uint256 private _totalSupply;

    //Will be used to get the balance of a particular user.
    mapping(address => uint256) private _balances;

    //Even will be sent whenever there is a transcation.
    //It tells us the sended, the reciever, and the amount being sent.
    event Sent(address from, address to, uint256 amount);

    //Sets the minter the the sender and ran when the smart contract is created.
    constructor() ERC20(_name, _symbol) {
        _decimals = 18;
    }

    //Gets the name of the coin and returns it.
    function getName() public view returns (string memory) {
        return _name;
    }

    //Gets the symbol of the coin and returns it.
    function getSymbol() public view returns (string memory) {
        return _symbol;
    }

    //Gets the decimals that coin can be broken down to and returns it.
    function getDecimals() public view returns (uint8) {
        return _decimals;
    }

    //Gets the balance of an account based on their address.
    //Calls the OpenZeppelin ERC20 balanceOf function for the return value.
    function getBalance(address account) public view returns (uint256) {
        return balanceOf(account);
    }

    //Gets the total amount of AuxiunCoins in exsistence and return the value.
    //Calls the OpenZeppelin ERC20 totalSupply function for the return value.
    function getTotalSupply() public view returns (uint256) {
        return totalSupply();
    }

    //Sends an amount of newly created coins to an address.
    //Can only be called by the contract creator.
    //Calls the OpenZeppelin ERC20 _mint function to mint and send the coins to the  receiver.
    function mint(address receiver, uint256 amount) public {
        _mint(receiver, amount);
    }

    //Sends an amount of exsisting coins from any caller to address
    //Calls the OpenZeppelin ERC20 _transfer function to send coins from the sender the receiver.
    //Emit is to used to genertate the Sent event, which is then stored on the blockchain in a log.
    function transferTokens(
        address sender,
        address receiver,
        uint256 amount
    ) public {
        _transfer(sender, receiver, amount);
        emit Sent(sender, receiver, amount);
    }
}
