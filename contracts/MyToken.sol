pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyToken is ERC20  {
    constructor(string memory _name, string memory _symbol) ERC20(_name, _symbol) {}
    //test
    function mint(address account, uint256 amount) external{
        _mint(account, amount);
    }

}
