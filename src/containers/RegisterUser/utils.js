/* eslint-disable import/prefer-default-export */

export const getOptions = (positionsAvailable = []) => {
  const options = positionsAvailable.map((position) => ({
    label: position.position,
    value: position.position,
  }));
  return options;
};

export const getGuaranteeBalance = (funds, tokenId) => {
  switch (tokenId) {
    case 1:
    case 2:
      return funds?.find((item) => item.name === "cUSD");
    case 3:
    case 4:
      return funds?.find((item) => item.name.includes("USDC"));
    case 5:
      return funds?.find((item) => item.name === "USDT");
    case 7:
      return funds?.find((item) => item.name === "USDC");
    case 8:
    case 9:
      return funds?.find((item) => item.name.includes("XOC"));
    default:
      return { name: "", balance: 0 };
  }
};

export const getTokenName = (tokenId) => {
  switch (tokenId) {
    case 1:
    case 2:
      return "Celo Dollar";
    case 3:
    case 4:
      return "USD Coin";
    case 5:
      return "USDT";
    case 7:
      return "USDC";
    case 8:
    case 9:
      return "XOC";
    default:
      return "";
  }
};
