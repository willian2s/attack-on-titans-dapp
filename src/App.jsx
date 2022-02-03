import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { SelectCharacter } from "./Components/SelectCharacter";
import { Arena } from "./Components/Arena";
import { LoadingIndicator } from "./Components/LoadingIndicator";
import GithubLogo from "./assets/github-logo.svg";

import AttackOnTitans from "./utils/AttackOnTitans.json";
import { CONTRACT_ADDRESS, transformCharacterData } from "./config/constants";

import "./App.css";

// Constants
const GITHUB_HANDLE = "willian2s";
const GITHUB_LINK = `https://github.com/${GITHUB_HANDLE}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [characterNFT, setCharacterNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const contractABI = AttackOnTitans.abi;

  const { ethereum } = window;

  const checkNetwork = async () => {
    try {
      if (ethereum.networkVersion !== "4") {
        alert("Please connect to Rinkeby!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
        setIsLoading(false);
        return;
      } else {
        console.log("Yo have the ethereum object: ", ethereum);

        const accounts = await ethereum.request({ method: "eth_accounts" });

        if (accounts.length !== 0) {
          const account = accounts[0];
          console.log(`Found authorized account: ${account}`);
          setCurrentAccount(account);
        } else {
          console.log("Not found authorized accouunt!");
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      if (ethereum.networkVersion !== "4") {
        alert("Please connect to Rinkeby!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      console.log(`Connected: ${accounts[0]}`);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchNTFMetadata = async () => {
    console.log(`Checking for character NFT on address: ${currentAccount}`);

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const gameContract = new ethers.Contract(
      CONTRACT_ADDRESS,
      contractABI,
      signer
    );

    const txn = await gameContract.checkIfUserHasNFT();

    if (txn.name) {
      console.log("User has character NFT");
      setCharacterNFT(transformCharacterData(txn));
    } else {
      console.log("No character NFT found");
    }

    setIsLoading(false);
  };

  const renderContent = () => {
    if (isLoading) {
      return <LoadingIndicator />;
    }
    if (!currentAccount) {
      return (
        <div className="connect-wallet-container">
          <img src="https://i.gifer.com/68sE.gif" alt="Attack on Titans Gif" />
          <button
            className="cta-button connect-wallet-button"
            onClick={connectWallet}
          >
            Connect Wallet To Get Started
          </button>
        </div>
      );
    } else if (currentAccount && !characterNFT) {
      return <SelectCharacter setCharacterNFT={setCharacterNFT} />;
    } else if (currentAccount && characterNFT) {
      return (
        <Arena characterNFT={characterNFT} setCharacterNFT={setCharacterNFT} />
      );
    }
  };

  useEffect(() => {
    if (ethereum.networkVersion) {
      checkNetwork();
    }
    setIsLoading(true);
    checkIfWalletIsConnected();
  }, []);

  useEffect(() => {
    if (currentAccount) {
      console.log(`Current Account: ${currentAccount}`);
      fetchNTFMetadata();
    }
  }, [currentAccount]);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Attack On Titans</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          {renderContent()}
        </div>
        <div className="footer-container">
          <img alt="Github Logo" className="github-logo" src={GithubLogo} />
          <a
            className="footer-text"
            href={GITHUB_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built with @${GITHUB_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
