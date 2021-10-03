import './styles/App.css';
import twitterLogo from './assets/twitter-logo.svg';
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import ImakArumworld from "./images/ImakArumworld.png";
import myEpicNft from './utils/MyEpicNFT.json';


// Constants
const TWITTER_HANDLE = '0xBey';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const OPENSEA_LINK = "https://testnets.opensea.io/0xc70f954fa5575dca91ab87f9e3950b7c014ed1ec";
const TOTAL_MINT_COUNT = 50;
const CONTRACT_ADDRESS = "0x6794580daCD8c495685bD21178Be683f0017191A";




const App = () => {
  /*
  * a State var we use to store our user's public wallet
  */
  const [currentAccount, setCurrentAccount] = useState("");

  /*
  * Make sure this is async
  */
  const checkIfWalletIsConnected = async () => {
    /*
    * First make sure we have access to window.ethereum
    */
    const { ethereum } = window;

    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    /* 
  *check if we're authorized to access the user's wallet
  */
    const accounts = await ethereum.request({ method: 'eth_accounts' });

  /*
  * user is able to have multiple accounts, we grab the FIRST one if it is there
  */
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account)
      // A setupEventListener for the case where a user visits the site & ALREADY had their wallet connected/authorized.
      setupEventListener()
    } else {
      console.log("No authorized account found");
    }
  };

  /*
  * connectWallet method
  */
  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      /*
      * Fancy method to request access to account.
      */
      const accounts = await ethereum.request({ method: "eth_requestAccounts" });

      /*
      * Boom! This should print out public address once we authorize Metamask.
      */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]); 
      // A setupEventListener for the case where a user visits the site & ALREADY had their wallet connected/authorized.
      setupEventListener()
    } catch (error) {
      console.log(error)
    }
  }



  
  // setting up eventListener
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`)
        });

        console.log("Setup event listener!")

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const askContractToMintNft = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);

        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait.")
        await nftTxn.wait();
        //console.log(nftTxn);
        console.log('Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}');
        
        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
}
  
  const [minted, setMinted] = useState(0);

  const mintedSoFar = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(CONTRACT_ADDRESS, myEpicNft.abi, signer);
        const mintedSoFar = await connectedContract.mintedSoFar();
        setMinted(mintedSoFar.toNumber());
      }
    } catch (err) {
      console.log(err);
    }
  };


  /*
  * This runs our function when the page loads.
  */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  /*
  * onClick event added here + Render Methods
  */
    
  const renderNotConnectedContainer = () => (
    <button onClick={connectWallet} className="cta-button connect-wallet-button">
      Connect to Wallet
    </button>
  );
  /*
  * We want the "Connect to Wallet" button to dissapear if they've already connected their wallet!
  */
  const renderMintUI = () => (
    <button onClick={askContractToMintNft} className="cta-button connect-wallet-button">
      Mint NFT
    </button>
)

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">0xBey's NFT Collection</p>
          <p className="sub-text">
            Each unique. Each beautiful. Discover your NFT today.
          </p>
          <p className="sub-text">By Beybey</p>
          {currentAccount === "" ? renderNotConnectedContainer() : renderMintUI()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by @${TWITTER_HANDLE}`}</a>
           <button className="opensea-button"
        onClick={event=> window.location.href=OPENSEA_LINK}> 
        View Collection</button>
        </div>
      </div>
    </div>
  );
};

export default App;
