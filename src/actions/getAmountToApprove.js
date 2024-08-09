import Decimal from "decimal.js";

export const getAmountToApprove = (amount, groupsize, turn) => {
  const multiplier = groupsize - turn + 1;

  const totalAmount = new Decimal(amount).mul(multiplier);

  const totalAmountString = totalAmount.toFixed(2);
  return totalAmountString;
};
export const getAmountToApproveWithDecimals = (
  amount,
  groupsize,
  turn,
  decimals
) => {
  return (amount * (groupsize - turn + 1))
    .toFixed(decimals)
    .replace(".", "")
    .toString();
};
