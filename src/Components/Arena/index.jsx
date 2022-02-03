import React, { useEffect, useState } from "react";
import { ethers } from "ethers";

import AttackOnTitans from "../../utils/AttackOnTitans.json";
import {
  CONTRACT_ADDRESS,
  transformCharacterData,
} from "../../config/constants";

import "./Arena.css";
import { LoadingIndicator } from "../LoadingIndicator";

export const Arena = ({ characterNFT, setCharacterNFT }) => {
  const [boss, setBoss] = useState(null);
  const [gameContract, setGameContract] = useState(null);
  const [attackState, setAttackState] = useState("");
  const [showToast, setShowToast] = useState(false);

  const contractABI = AttackOnTitans.abi;

  const { ethereum } = window;

  const fetchBoss = async () => {
    const bossTxn = await gameContract.getBigBoss();
    console.log("Boss: ", bossTxn);
    setBoss(transformCharacterData(bossTxn));
  };

  const attackAction = async () => {
    try {
      if (gameContract) {
        setAttackState("attacking");
        console.log("Attacking boss...");
        const attackTxn = await gameContract.attackBoss();
        await attackTxn.wait();
        console.log("attackTxn:", attackTxn);
        setAttackState("hit");

        setShowToast(true);
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }
    } catch (error) {
      console.error("Error attacking boss:", error);
      setAttackState("");
    }
  };

  const onAttackComplete = (newBossHp, newPlayerHp) => {
    const bossHp = newBossHp.toNumber();
    const playerHp = newPlayerHp.toNumber();

    console.log(`AttackComplete: Boss Hp: ${bossHp} Player Hp: ${playerHp}`);

    setBoss((prevState) => {
      return { ...prevState, hp: bossHp };
    });

    setCharacterNFT((prevState) => {
      return { ...prevState, hp: playerHp };
    });
  };

  useEffect(() => {
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const gameContract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractABI,
        signer
      );
      setGameContract(gameContract);
    } else {
      console.log("Ethereum object not found");
    }
  }, []);

  useEffect(() => {
    if (gameContract) {
      fetchBoss();
      gameContract.on("AttackComplete", onAttackComplete);
    }
    return () => {
      if (gameContract) {
        gameContract.off("AttackComplete", onAttackComplete);
      }
    };
  }, [gameContract]);

  return (
    <div className="arena-container">
      {boss && characterNFT && (
        <div id="toast" className={showToast ? "show" : ""}>
          <div id="desc">{`💥 ${boss.name} was hit for ${characterNFT.attackDamage}!`}</div>
        </div>
      )}
      {boss && (
        <div className="boss-container">
          <div className={`boss-content ${attackState}`}>
            <h2>{boss.name}</h2>
            <div className="image-content">
              <img
                src={`https://cloudflare-ipfs.com/ipfs/${boss.imageURI}`}
                alt={`Boss ${boss.name}`}
              />
              <div className="health-bar">
                <progress value={boss.hp} max={boss.maxHp} />
                <p>{`${boss.hp} / ${boss.maxHp} HP`}</p>
              </div>
            </div>
          </div>
          <div className="attack-container">
            <button className="cta-button" onClick={() => attackAction()}>
              {`Attack ${boss.name}`}
            </button>
          </div>
          {attackState === "attacking" && (
            <div className="loading-indicator">
              <LoadingIndicator />
              <p>Attacking</p>
            </div>
          )}
        </div>
      )}

      {characterNFT && (
        <div className="players-container">
          <div className="player-container">
            <h2>Your Character</h2>
            <div className="player">
              <div className="image-content">
                <h2>{characterNFT.name}</h2>
                <img
                  src={`https://cloudflare-ipfs.com/ipfs/${characterNFT.imageURI}`}
                  alt={`Character ${characterNFT.name}`}
                />
                <div className="health-bar">
                  <progress value={characterNFT.hp} max={characterNFT.maxHp} />
                  <p>{`${characterNFT.hp} / ${characterNFT.maxHp} HP`}</p>
                </div>
              </div>
              <div className="stats">
                <h4>{`Attack Damage: ${characterNFT.attackDamage}`}</h4>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
