// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

import "openzeppelin-solidity/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "openzeppelin-solidity/contracts/utils/Counters.sol";

contract OppayNFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;
  mapping(uint256 => string) _tokenUrls;
  mapping(uint256 => string) _tokenNames;
  mapping(uint256 => uint256) _tokenLevels;
  uint256 _randNonce = 123;

  constructor() ERC721("Factory NFT", "FTN") {
  }

  function mint(string memory _tokenURI, string memory _tokenName) public returns (uint256) {
    uint256 newItemId =  _tokenIds.current();
    uint256 _tokenLevel = uint256(keccak256(abi.encodePacked(block.timestamp, msg.sender, _randNonce))) % 10;
    _safeMint(msg.sender, newItemId);
    _setTokenURI(newItemId, _tokenURI);
    _tokenIds.increment();
    _tokenUrls[_tokenIds.current()] = _tokenURI;
    _tokenNames[_tokenIds.current()] = _tokenName;

    _tokenLevels[_tokenIds.current()] = _tokenLevel;

    return newItemId;
  }

  function totalSupply() public view returns (uint256) {
    return _tokenIds.current();
  }

  function tokens(uint256 _token) public view returns (string memory, string memory, uint256) {
    return (_tokenUrls[_token], _tokenNames[_token], _tokenLevels[_token]);
  }

  function tokenLevel(uint256 _token) public view returns (uint256) {
    return _tokenLevels[_token];
  }
}
