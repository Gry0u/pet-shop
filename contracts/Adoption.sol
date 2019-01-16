pragma solidity ^0.5.0;

contract Adoption {
/* Solidity statically typed: need to explicitly define data types
unique address type: ETH address stored as 20 byte value */
  address[16] public adopters; // define array of 16 addresses, public var automatically have getter methods

  // adopting  a pet
  function adopt(uint petId) public returns (uint) {
    require(petId >=0 && petId <= 15);
    adopters[petId] = msg.sender;
    return petId;
  }

  function getAdopters() public view returns (address[16] memory) {
    return adopters;
    //memory gives data location of variable
    // view means function will not modify state of the contract
  }
}
