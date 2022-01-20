// SPDX-License-Identifier: MIT
// OpenZeppelin Contracts v4.3.2 (token/ERC20/ERC20.sol)
pragma solidity  >=0.4.22 <0.9.0;

contract ERC20 {
    function name() public view virtual  returns (string memory) {}
    function approve(address spender, uint256 amount) public virtual  returns (bool) {}
}