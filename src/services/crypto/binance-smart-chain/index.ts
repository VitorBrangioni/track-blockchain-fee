import axios from "axios";
import BigNumber from "bignumber.js";
import { CalculateFeeResult } from "../interfaces";
import { convertWeiToBnbOrEther } from "../utils";

const currency = 'BNB';

export async function fetchGasPrice(): Promise<BigNumber> {
    try {
        const data = await axios.post('https://bsc.publicnode.com/', { "method": "eth_maxPriorityFeePerGas", "params": [], "id": 1, "jsonrpc": "2.0" })
            .then(({ data }) => data);

        const gasPriceInHex = data?.result;
        const gasPriceinNumber = BigNumber(gasPriceInHex);

        if (gasPriceinNumber.isNaN()) {
            throw Error('Error to fetch the gas price');
        }

        return gasPriceinNumber;
        
    } catch (error) {
        throw error;
    }
}

export async function calculateFee(gasLimit = 55000): Promise<CalculateFeeResult> {
    const gasPrice = await fetchGasPrice();
    const estimatedFee = convertWeiToBnbOrEther(gasPrice).multipliedBy(gasLimit);

    return {
        currency,
        value: estimatedFee
    }
}

