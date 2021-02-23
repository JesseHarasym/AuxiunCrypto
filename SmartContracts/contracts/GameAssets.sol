//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.6.0 <0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract GameAssests is ERC721 {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    event Minted(address owner, uint256 tokenId);

    constructor() ERC721("Item", "ITM") {}

    function getName() public view returns (string memory) {
        return name();
    }

    function getSymbol() public view returns (string memory) {
        return symbol();
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        return tokenURI(tokenId);
    }

    function transferItem(
        address from,
        address to,
        uint256 tokenId
    ) public {
        safeTransferFrom(from, to, tokenId);
    }

    function ownerOfToken(uint256 tokenId) public view returns (address) {
        return ownerOf(tokenId);
    }

    function createItem(string memory tokenURI) public {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenURI);
        emit Minted(msg.sender, newItemId);
    }

    function getBalance(address owner) public view returns (uint256) {
        return balanceOf(owner);
    }
}
