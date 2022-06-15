const HDWalletProvider = require("truffle-hdwallet-provider");
const path = require("path");
const { INFURA_API_URL, MNEMONIC } = process.env;

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777"
    },
    ropsten: {
      provider: () => new HDWalletProvider(MNEMONIC, INFURA_API_URL),
      network_id: 3,
      gas: 5500000
    }
  },
  compilers: {
      solc: {
          version: "0.8.13"
      }
  }
};
