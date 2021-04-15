//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GameAssets is ERC721 {
    //Here we are using to Counters to allow us track and iterate tokenIds, so each tokenId will be unique.
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    string private _name = "Item";
    string private _symbol = "ITM";

    //This event will be called when a new token is created and minted. I will log the address of the owner and the tokenId.
    event Minted(address owner, uint256 tokenId);
    mapping(uint256 => address) private _tokenApprovals;

    constructor() ERC721(_name, _symbol) {}

    //Used to create a new item. It mints the item and sets the owner to the person who has created it.
    function createItem(string memory tokenURI, address creator) public {
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current() + uint256(5000);
        _mint(creator, newItemId);
        _setTokenURI(newItemId, tokenURI);

        approve(msg.sender, newItemId); //Gives account zero the ability to transfer tokens, this way user will not have to pay gas fees.
        emit Minted(creator, newItemId);
    }

    //Returns the amount of tokens owned by a specific address.
    function getBalance(address owner) public view returns (uint256) {
        return balanceOf(owner);
    }

    //Returns the name of the token.
    function getName() public view returns (string memory) {
        return name();
    }

    //Returns the symbol of the token.
    function getSymbol() public view returns (string memory) {
        return symbol();
    }

    //Returns URI associated with a specific token.
    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    //Allows us to transfer a token from one account to another.
    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public virtual override {
        require(
            _exists(tokenId),
            "ERC721: operator query for nonexistent token"
        ); //Checks to make sure the token exists before moving forward.

        address owner = ERC721.ownerOf(tokenId); //Getting the owner of the token.

        require(
            (msg.sender == owner || _tokenApprovals[tokenId] == msg.sender)
        ); //Confirms that the sender is either the owner or an approved account (account zero in our case).
        approve(msg.sender, tokenId); //Gives account zero the ability to transfer tokens, incase the new owner decides to sell the token again.
        _safeTransfer(from, to, tokenId, "");
    }

    //Returns the address of the owner of a specific token.
    function ownerOfToken(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }

    //Gives the an account permission to transfer a token on the owners behalf.
    function approve(address to, uint256 tokenId) public virtual override {
        address owner = ERC721.ownerOf(tokenId);
        require(to != owner, "ERC721: approval to current owner");
        _tokenApprovals[tokenId] = to;
        emit Approval(ERC721.ownerOf(tokenId), to, tokenId);
    }
}
