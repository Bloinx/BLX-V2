const getTurnHeader = (turn, realTurn, groupSize) => {
  if (groupSize < realTurn) {
    return groupSize;
  }
  return realTurn;
};
export default getTurnHeader;
