import axios from "axios";
import BigNumber from "bignumber.js";
import { convertWeiToBnbOrEther } from "../utils";
import { CalculateFeeResult } from "../interfaces";

const currency = 'ETH';

export async function fetchGasPrice() : Promise<number> {
    try {
        const data = await axios.post('https://ethereum.publicnode.com/', { "method": "eth_gasPrice", "params": [], "id": 1, "jsonrpc": "2.0" })
            .then(({ data }) => data);

        const gasPriceInHex = data?.result;
        const gasPriceinNumber = Number(gasPriceInHex);

        if (!gasPriceinNumber) {
            throw Error('Error to fetch the gas price');
        }

        return gasPriceinNumber;
        
    } catch (error) {
        throw error;
    }

}

export async function calculateFee(gasLimit = 55000, tip = 0): Promise<CalculateFeeResult> {
    const gasPrice = await fetchGasPrice();
    const estimatedFee = gasLimit * (convertWeiToBnbOrEther(gasPrice) + tip);

    return {
        currency,
        value: BigNumber(estimatedFee)
    }
    
}