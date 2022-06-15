import React, { Component } from "react";
import OppayTokenContract from "./contracts/OppayToken.json";
import OppayNFTContract from "./contracts/OppayNFT.json";
import getWeb3 from "./getWeb3";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardActions from '@material-ui/core/CardActions';
import Grid from '@material-ui/core/Grid';

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, token: null, accountId: '', otk: 0, balance: 0, totalSupply: 0, nfts: [], factory: null, url: '', name: '' , select: null };
  componentWillMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const oppayTokenDeployedNetwork = OppayTokenContract.networks[networkId];
      const oppayNFTDeployedNetwork = OppayNFTContract.networks[networkId];
      const oppayToken = new web3.eth.Contract(
        OppayTokenContract.abi,
        oppayTokenDeployedNetwork && oppayTokenDeployedNetwork.address,
      );
      const oppayNFT = new web3.eth.Contract(
        OppayNFTContract.abi,
        oppayNFTDeployedNetwork && oppayNFTDeployedNetwork.address,
      );
      const tokenBalance = await oppayToken.methods.balanceOf(accounts[0]).call();
      const totalSupply = await oppayNFT.methods.totalSupply().call();

      console.log(totalSupply)

      for (var i = 1; i <= totalSupply; i++) {
        console.log("fuga")
        const result = await oppayNFT.methods.tokens(i).call();
        console.log(result[0])
        console.log(result[1])
        console.log(result[2])
        this.setState({
          nfts: [...this.state.nfts, {tokenUrl: result[0], tokenName: result[1], tokenLevel: result[2]}],
        });
        console.log(this.state.nfts);
      }

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3,
        accounts,
        totalSupply,
        token: oppayToken,
        factory: oppayNFT,
        balance: tokenBalance/(10*10**17)
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  hadnleChangeInputAccoundId = (e) => {
    this.setState({accountId: e.target.value});
  }

  hadnleChangeInputOtk = (e) => {
    this.setState({otk: e.target.value});
  }

  hadnleChangeInputUrl = (e) => {
    this.setState({url: e.target.value});
  }

  hadnleChangeInputName = (e) => {
    this.setState({name: e.target.value});
  }

  handleChangeSelect = (e) => {
    this.setState({select: e.target.value});
  }

  onClickSendButton = async () => {
    const { accounts, token, accountId, otk } = this.state;
    console.log(accountId)
    console.log(otk)
    await token.methods.transfer(accountId, (otk*10**18).toString()).send({ from: accounts[0] });
  }

  onClickTapButton = async () => {
    const { accounts, token, select } = this.state;
    await token.methods.tap(select.tokenLevel).send({ from: accounts[0] });
    const tokenBalance = await token.methods.balanceOf(accounts[0]).call();
    this.setState({balance: tokenBalance/(10*10**17)});
  }

  onClickMintButton = async () => {
    const { accounts, factory, url, name } = this.state;
    await factory.methods.mint(url, name).send({ from: accounts[0] })
    const totalSupply = await factory.methods.totalSupply().call();
    const tokenLevel = await factory.methods.tokenLevel(totalSupply).call();
    this.setState({
      nfts: [...this.state.nfts, {tokenUrl: url, tokenName: name, tokenLevel}],
      url: '',
      name: ''
    });
  }

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and token...</div>;
    }
    return (
      <div className="App">
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h3" component="div" sx={{ flexGrow: 1 }}>
              Tap To Earn
            </Typography>
            <Button color="inherit" style={{marginLeft: "auto", marginRight: "unset"}}>Account ID: {this.state.accounts[0]}</Button>
          </Toolbar>
        </AppBar>
        <Grid container spacing={3}>
          <Grid item xs={1}></Grid>
          <Grid item xs={6}>
            <h3>Balance Of Your Oppay Token(OTK):
              <br/>
              <h2>{this.state.balance}</h2>
            </h3>
            <br/>
            <p>Create Your Own <strong>Oppay NFT</strong></p>
            <TextField
              label="URL"
              placeholder="URL"
              value={this.state.url}
              onChange={this.hadnleChangeInputUrl}
              required
            />
            <br/>
            <TextField
              label="Name"
              placeholder="Name"
              value={this.state.name}
              onChange={this.hadnleChangeInputName}
              required
            />
            <br/>
            <br/>
            <Button
              variant="contained"
              color="primary"
              size="medium"
              onClick={this.onClickMintButton}
            >Create Oppay NFT</Button>
          </Grid>
          <Grid item xs={4}>
            <p>Select Your Own <strong>Oppay NFT</strong></p>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={this.state.select}
              onChange={this.handleChangeSelect}
            >
              {this.state.nfts.map((nft, key) => {
                return (
                  <MenuItem value={nft}>{nft.tokenName}</MenuItem>
                );
              })}
            </Select>
            <br />
            <hr />
            {this.state.select && 
              <Card sx={{ maxWidth: "300px", maxHeight: "300px" }}>
                <CardMedia
                  component="img"
                  height="300px"
                  image={this.state.select.tokenUrl}
                  alt={this.state.select.tokenName}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                  {this.state.select.tokenName}
                  </Typography>
                  <Typography variant="h6" color="secondary">
                    level: {this.state.select.tokenLevel}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    variant="contained"
                    color="primary"
                    size="medium"
                    onClick={this.onClickTapButton}
                  >Tap Oppay</Button>
                </CardActions>
              </Card>
            }
          </Grid>
          <Grid item xs={1}></Grid>
        </Grid>
      </div>
    );
  }
}

export default App;
