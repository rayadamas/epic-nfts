const [currNetwork, setCurrentNetwork] = React.useState("");

const networks = {
  "0x1": "Mainnet",
  "0x3": "Ropsten",
  "0x2a": "Kovan",
  "0x4": "Rinkeby",
  "0x5": "Goerli",
  "0x61": "BSC Testnet",
  "0x38": "BSC Mainnet",
  "0x89": "Matic Mainnet",
  "0xa86a": "AVAX Mainnet",
};


const isWalletConnected = () => {
		try {
			const { ethereum } = window;
			if (!ethereum) {
				console.log("Please install Metamask");
				return false;
			} else {
				console.log("Metamask is installed");
				// Set current network 
				setCurrentNetwork((ethereum.networkVersion === "4" ? "Rinkeby" : "Not Rinkeby"));
				// Set a chainChanged listener to get notified when the user changes chain
				ethereum.on('chainChanged', (chainId) => {
					setCurrentNetwork(networks[chainId]);
					// If the chain is Rinkeby, get NFTs
					if (chainId === "0x4") {
						console.log("Changed to Rinkeby, getting NFTs")
						getAllNFTs();
					}
				});
        return true;
			}
		} catch (err) {
			console.log("Please install Metamask");
			console.error(err);
			return false;
		}
	};


// In your JSX 
<div>Current wallet network = {currNetwork || "Wallet not connected"}</div>


// --------------------------------------------------------------------OPTIONAL
//Check if we're authorized to access the user's wallet
ethereum.request({ method: "eth_accounts" }).then((accounts) => {
  //We could have multiple accounts.
  if (accounts.length !== 0) {
    //Grab the first account we have access to.
    const account = accounts[0];
    console.log("Found an authorized account: ", account);
    // Store the users public wallet address for later!
    setCurrentAccount(account);
    // If not on Rinkeby, alert user
    if (ethereum.networkVersion !== "4") {
      alert("Please connect to the Rinkeby network");
    }
    else {
      getAllNFTs();
    }
    return true

  } else {
    console.log("No authorized account found");
  }
});
// --------------------------------------------------------------------OPTIONAL