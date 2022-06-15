var OppayToken = artifacts.require("./OppayToken.sol");
var OppayNFT = artifacts.require("./OppayNFT.sol");

module.exports = function(deployer) {
  deployer.deploy(OppayToken);
  deployer.deploy(OppayNFT);
};
