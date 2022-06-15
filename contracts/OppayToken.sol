// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <8.10.0;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract OppayToken is ERC20 {
  constructor() ERC20("Oppay Token", "OTK") {
    _mint(msg.sender, 1000*10**18);
  }

  function tap(uint256 level) public {
    _mint(msg.sender, (1 * level)*10**18);
  }
}
