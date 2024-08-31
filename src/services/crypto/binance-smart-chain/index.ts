import axios from "axios";
import BigNumber from "bignumber.js";
import { CalculateFeeResult } from "../interfaces";
import { convertWeiToBNB } from "../utils";

const currency = 'BNB';

export async function fetchGasPrice() {
    return axios.post('https://bsc.publicnode.com/', { "method": "eth_maxPriorityFeePerGas", "params": [], "id": 1, "jsonrpc": "2.0" })
        .then(({ data }) => Number(data?.result))
}

export async function calculateFee(gasLimit = 55000): Promise<CalculateFeeResult> {
    const gasPrice = await fetchGasPrice();
    const estimatedFee = gasLimit * convertWeiToBNB(gasPrice);

    return {
        currency,
        value: BigNumber(estimatedFee)
    }
}

