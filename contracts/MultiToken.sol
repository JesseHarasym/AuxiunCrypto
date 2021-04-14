//SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MultiToken is ERC1155 {

    mapping(uint256 => address) private _ownerOfBatch; //Sets and gets the creator of a batch.

    mapping(uint256 => uint256[]) private _batch;//Sets and gets and array of ids to be associated with a batch.
    
    mapping(uint256 => string) private _batchURI; 

    mapping(uint256 => mapping(uint256 => address)) private _ownerOfItemInBatch;//Sets and get an owner of a specfic item in a batch.

    mapping(address => mapping(uint256 => uint256)) private _balanceOfAddress; //Sets and gets the balance of items associated to a address and batch. 

    mapping(uint256 => uint256) private _balanceOfBatch;

    mapping (uint256 => mapping(uint256 => address)) private _tokenApprovals;

    uint256[] public ids;
    uint256[] public batchTokenIds;

    event Minted(address owner, uint256 batchId, uint256 amount);
    event Transferred(uint256 tokenId);

    using Counters for Counters.Counter;
    Counters.Counter private _batchId;

    constructor() ERC1155("https://game.example/api/item/{id}.json"){}

    function createBatch(string memory uri, address creator, uint256 amount) public{
        
        
        _batchId.increment();
        
        for(uint i=1; i<=amount; i++){
            ids.push(i);
            _ownerOfItemInBatch[_batchId.current()][i] = creator;
            approve(msg.sender, _batchId.current(), i);
        }
        
        _batch[_batchId.current()] = ids;

        _balanceOfAddress[creator][_batchId.current()] = amount;

        _ownerOfBatch[_batchId.current()] = creator;

        _balanceOfAddress[creator][_batchId.current()] = amount;

        _updateBatchBalance(_batchId.current(), amount);

        _setURI(_batchId.current(), uri);
        emit Minted(creator, _batchId.current(), amount);

        delete ids;
        
    }

    function _setURI(uint256 batchId, string memory uri) private{
        
        _batchURI[batchId] = uri;
    }

    function getURI(uint256 batchId) public view returns( string memory){
        return _batchURI[batchId];
    }

     function getBalance(uint256 batchId, address owner) public view returns(uint256){
        return _balanceOfAddress[owner][batchId];
    }

    function getBatchBalance(uint256 batchId) public view returns(uint256){
        return _balanceOfBatch[batchId];
    }
    
    function _updateBatchBalance(uint256 batchId, uint256 amount) private{
        _balanceOfBatch[batchId] = amount;
    }
    

       //Allows us to transfer a token from one account to another.
    function transfer(address from, address to, uint256 batchId, uint256 amount) public{
  
        batchTokenIds = _batch[batchId]; 
        uint256 counter = 0;
        for(uint i=1; i<= batchTokenIds.length; i++){
            if(counter == amount){
                break;
            }
            address owner = _ownerOfItemInBatch[batchId][i];      
            if(owner == from){
                 require(msg.sender == owner || _tokenApprovals[batchId][i] == msg.sender);
                _ownerOfItemInBatch[batchId][i] = to;
                approve(msg.sender, batchId, i);
                emit Transferred(i);
                counter++;
            }
        }
            delete batchTokenIds;
        _balanceOfBatch[batchId] -= amount;
        _balanceOfAddress[to][batchId] += amount;
        _balanceOfAddress[ownerOfBatch(batchId)][batchId] -= amount;
    }

    //Returns the address of the owner of a specific token.
    function ownerOfToken(uint256 batchId, uint256 tokenId) public view returns (address) {
        return _ownerOfItemInBatch[batchId][tokenId];
    }

      function ownerOfBatch(uint256 batchId) public view returns (address) {
        return _ownerOfBatch[batchId];
    }

    //Gives the an account permission to transfer a token on the owners behalf.
    function approve(address to, uint256 batchId, uint256 tokenId) private{
        address owner = ownerOfToken(batchId, tokenId);
        require(to != owner, "ERC721: approval to current owner");
        _tokenApprovals[batchId][tokenId] = to;
    }
    
}
