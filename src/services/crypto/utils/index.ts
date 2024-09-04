import BigNumber from "bignumber.js";

export const weiInBnbOrEther = new BigNumber(1e-18);

export function convertWeiToBnbOrEther(wei: BigNumber): BigNumber {
    return wei.multipliedBy(weiInBnbOrEther)
}