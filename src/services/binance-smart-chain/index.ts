import axios from "axios";

export async function fetchGasPrice() {
    return axios.post('https://bsc.publicnode.com/', { "method": "eth_maxPriorityFeePerGas", "params": [], "id": 1, "jsonrpc": "2.0" })
        .then(({ data }) => Number(data?.result))
        .catch(err => {
            throw err;
        });
}

export async function calculateFee(gasLimit = 55000) {
    const gasPrice = await fetchGasPrice();
    const estimatedFee = gasLimit * convertWeiToBNB(gasPrice);

    return estimatedFee;
}

export function parseHexToNumber(hex: string) {
    return Number(hex);
}

export function convertWeiToBNB(wei: number) {
    const weiToBnb = 10e-18;
    return wei * weiToBnb;
}