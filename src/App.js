import { providers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";

import { useState, useEffect } from "react";

//.env file
const YOUR_INFURA_KEY = "17a263b289cb4bf5a802e9a15d3d2008";

function App() {
  const [web3Modal, setWeb3Modal] = useState(null);
  const [address, setAddress] = useState("");
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    const providerOptions = {
      walletconnect: {
        package: WalletConnectProvider,
        options: {
          infuraId: YOUR_INFURA_KEY,
        },
      },
    };

    const newWeb3Modal = new Web3Modal({
      cacheProvider: true, // very important
      network: "mainnet",
      providerOptions,
    });

    setWeb3Modal(newWeb3Modal);
  }, []);

  useEffect(() => {
    // connect automatically and without a popup if user is already connected
    if (web3Modal && web3Modal.cachedProvider) {
      connectWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3Modal]);

  async function connectWallet() {
    const provider = await web3Modal.connect();
    setProvider(provider);
    addListeners(provider);

    const ethersProvider = new providers.Web3Provider(provider);
    const userAddress = await ethersProvider.getSigner().getAddress();
    setAddress(userAddress);
  }

  async function disconnect() {
    await web3Modal.clearCachedProvider();
    if (provider?.disconnect && typeof provider.disconnect === "function") {
      await provider.disconnect();
    }
    setAddress("");
  }

  async function addListeners(web3ModalProvider) {
    web3ModalProvider.on("accountsChanged", (accounts) => {
      window.location.reload();
    });

    // Subscribe to chainId change
    web3ModalProvider.on("chainChanged", (chainId) => {
      window.location.reload();
    });
  }

  return (
    <div>
      <button onClick={connectWallet}>connect wallet</button>
      <p>{address}</p>
      <button onClick={disconnect}>disconnect</button>
    </div>
  );
}

export default App;
