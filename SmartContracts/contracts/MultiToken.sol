//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "../node_modules/@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract MultiToken is ERC1155 {
    //hold an array containing each tokens id
    uint256[] public tokenIds;

    //constant set as 0 representing its id as the initial fungible token created
    uint256 public constant Coin = 0;

    //@param: multi token uri with jason data, id representing the different tokens
    constructor() ERC1155("https://game.example/api/item/{id}.json") {
        //create our initial fungible token (coin) for example on initialising on creation..
        createToken(msg.sender, Coin, 10**20, "");
    }

    // SINGLE TOKEN METHODS
    //------------------------------------------

    //creates a token, mints it and adds it to our token array list
    function createToken(
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public {
        //mint the new token
        _mint(to, id, amount, data);

        //add to our id array
        tokenIds.push(id);
    }

    //returns the balance of an address of a token with a specified id
    function getTokenBalance(address owner, uint256 id)
        public
        view
        returns (uint256)
    {
        return balanceOf(owner, id);
    }

    //transfers token from one user to another, token specified by id
    function safeTokenTransfer(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public {
        safeTransferFrom(from, to, id, amount, data);
    }

    // BATCH TOKEN METHODS
    //------------------------------------------

    //same as create token but with multiple tokens
    function createBatchTokens(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public {
        //mint the batch of tokens
        _mintBatch(to, ids, amounts, data);

        //add to our id array
        for (uint256 i = 0; i < ids.length; i++) {
            tokenIds.push(ids[i]);
        }
    }

    //batch balance allows you to check the balance of multiple adresses and ids (must be same)
    function getBatchBalance(address[] memory owners, uint256[] memory ids)
        public
        view
        returns (uint256[] memory balance)
    {
        balance = balanceOfBatch(owners, ids);
        return balance;
    }

    //allows transfer of multiple quantities of multiple tokens to one a single user
    function safeBatchTransfer(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public {
        safeBatchTransfer(from, to, ids, amounts, data);
    }
}
