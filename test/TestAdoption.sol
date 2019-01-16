pragma solidity ^0.5.0;

import 'truffle/Assert.sol'; // gives various assertions to use in the test
import 'truffle/DeployedAddresses.sol'; //When running tests, Truffle will deploy a fresh instance of the contract being tested to the blockchain. This smart contract gets the address of the deployed contract.
import '../contracts/Adoption.sol';

contract TestAdoption {
  // Address of the adoption contract to be tested
  Adoption adoption = Adoption (DeployedAddresses.Adoption());

  // testing adopt() function
  function testUserCanAdoptPet() public {
    uint returnedId = adoption.adopt(expectedPetId);
    Assert.equal(returnedId, expectedPetId, 'Adoption of the expected pet should match what is returned.');
  }

  // testing retrieval of a single pet's owner
  function testGetAdopterAddressByPetId() public {
    address adopter = adoption.adopters(expectedPetId);
    Assert.equal(adopter, expectedAdopter, 'Owner of the expected pet should be this contract.');
  }

  // testing retrieval of all pet owners
  function testGetAdopterAddressByPetIdInArray() public {
    // store adopters in memory rather than contracts' storage
    address[16] memory adopters = adoption.getAdopters();
    Assert.equal(adopters[expectedPetId], expectedAdopter, 'Owner of the expected pet should be this contract.');
  }
  // id of pet used for testing
  uint expectedPetId = 8;
  // expected owner of the adopted pet is this contract
  address expectedAdopter = address(this);
}
