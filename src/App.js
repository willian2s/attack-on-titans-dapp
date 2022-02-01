import React from "react";
import githubLogo from "./assets/github-logo.svg";
import "./App.css";

// Constants
const GITHUB_HANDLE = "willian2s";
const GITHUB_LINK = `https://github.com/${GITHUB_HANDLE}`;

const App = () => {
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">Attack On Titans - Metaverse</p>
          <p className="sub-text">Team up to protect the Metaverse!</p>
          <div className="connect-wallet-container">
            <img src="https://i.gifer.com/68sE.gif" alt="Monty Python Gif" />
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
