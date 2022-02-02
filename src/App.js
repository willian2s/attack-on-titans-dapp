import React, { useEffect, useState } from "react";
import githubLogo from "./assets/github-logo.svg";
import "./App.css";

// Constants
const GITHUB_HANDLE = "willian2s";
const GITHUB_LINK = `https://github.com/${GITHUB_HANDLE}`;

const App = () => {
  const [currentAccount, setCurrentAccount] = useState(null);
  const { ethereum } = window;

  const checkIfWalletIsConnected = async () => {
    try {
      if (!ethereum) {
        console.log("Make sure you have MetaMask!");
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
  };

  const connectWallet = async () => {
    try {
      if (!ethereum) {
        alert("Get MetaMask!");
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

  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Attack On Titans - Metaverse</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          <div className="connect-wallet-container">
            <img
              src="https://i.gifer.com/68sE.gif"
              alt="Attack on Titans Gif"
            />
            {!currentAccount && (
              <button
                className="cta-button connect-wallet-button"
                onClick={connectWallet}
              >
                Connect Wallet To Get Started
              </button>
            )}
          </div>
        </div>
        <div className="footer-container">
          <img alt="Github Logo" className="github-logo" src={githubLogo} />
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
