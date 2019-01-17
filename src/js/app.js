let App = {
  web3Provider: null,
  contracts: {},

  init: async function () {
    // Load pets.
    $.getJSON('../pets.json', function (data) {
      const petsRow = $('#petsRow')
      const petTemplate = $('#petTemplate')

      for (let i = 0; i < data.length; i++) {
        petTemplate.find('.panel-title').text(data[i].name)
        petTemplate.find('img').attr('src', data[i].picture)
        petTemplate.find('.pet-breed').text(data[i].breed)
        petTemplate.find('.pet-age').text(data[i].age)
        petTemplate.find('.pet-location').text(data[i].location)
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id)

        petsRow.append(petTemplate.html())
      }
    })

    return App.initWeb3()
  },

  initWeb3: async function () {
    // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable()
      } catch (error) {
        // User denied account access...
        console.error('User denied account access')
      }
    } else if (window.web3) {
      // Legacy dapp browsers...
      App.web3Provider = window.web3.currentProvider
    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545')
    }
    web3 = new Web3(App.web3Provider)
    return App.initContract()
  },

  initContract: function () {
    $.getJSON('Adoption.json', data => {
    // Get the necessary contract artifact file and instantiate it with truffle-contract
      var AdoptionArtifact = data
      App.contracts.Adoption = TruffleContract(AdoptionArtifact)

      // Set the provider for our contract
      App.contracts.Adoption.setProvider(App.web3Provider)

      // Use our contract to retrieve and mark the adopted pets
      return App.markAdopted()
    })

    return App.bindEvents()
  },

  bindEvents: function () {
    $(document).on('click', '.btn-adopt', App.handleAdopt)
  },

  markAdopted: function (adopters, account) {
    var adoptionInstance

    App.contracts.Adoption.deployed().then(instance => {
      adoptionInstance = instance

      return adoptionInstance.getAdopters.call()
    }).then(adopters => {
      for (let i = 0; i < adopters.length; i++) {
        if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
          $('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true)
        }
      }
    }).catch(err => {
      console.log(err.message)
    })
  },

  handleAdopt: function (event) {
    event.preventDefault()

    var petId = parseInt($(event.target).data('id'))

    var adoptionInstance

    web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log(error)
      }

      var account = accounts[0]

      App.contracts.Adoption.deployed().then(instance => {
        adoptionInstance = instance

        // Execute adopt as a transaction by sending account
        return adoptionInstance.adopt(petId, { from: account })
      }).then(result => {
        return App.markAdopted()
      }).catch(err => {
        console.log(err.message)
      })
    })
  }
}

$(function () {
  $(window).load(_ => {
    App.init()
  })
})
