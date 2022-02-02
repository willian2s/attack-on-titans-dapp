const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS;

const transformCharacterData = (characterData) => {
  return {
    name: characterData.name,
    imageURI: characterData.imageURI,
    hp: characterData.hp,
    maxHp: characterData.maxHp,
    attackDamage: characterData.attackDamage,
  };
};

export { CONTRACT_ADDRESS, transformCharacterData };
