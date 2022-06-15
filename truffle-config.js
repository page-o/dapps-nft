require('dotenv').config();
const HDWalletProvider = require("@truffle/hdwallet-provider")
const path = require("path");
const { INFURA_API_URL, ALCHEMY_API_URL, DATAHUB_API_URL, MNEMONIC, INDEX_OF_YOUR_ADDRESS, AVALANCHE_PRIVATE_KEY } = process.env;

module.exports = {
  contracts_build_directory: path.join(__dirname, "client/src/contracts"),
  networks: {
    develop: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "5777"
    },
    ropsten: {
      provider: () => new HDWalletProvider(MNEMONIC, INFURA_API_URL, INDEX_OF_YOUR_ADDRESS),
      network_id: 3,
      gas: 5500000
    },
    mumbai: {
      provider: () => new HDWalletProvider(MNEMONIC, ALCHEMY_API_URL, INDEX_OF_YOUR_ADDRESS),
      network_id: 80001,
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
      gas: 6000000,
      gasPrice: 10000000000,
    },
    fuji: {
      provider: () => new HDWalletProvider(MNEMONIC, `${DATAHUB_API_URL}/ext/bc/C/rpc`, INDEX_OF_YOUR_ADDRESS),
      network_id: 43113,
      confirmations: 2,
      timeoutBlocks: 200,
      gas: 3000000
    }
  },
  compilers: {
      solc: {
          version: "0.8.13"
      }
  }
};
