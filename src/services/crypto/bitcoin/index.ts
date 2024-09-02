import axios from "axios";
import { BigNumber } from "bignumber.js";
import { CalculateFeeResult } from "../interfaces";
import { logger } from "../../report-fee";

const currency = 'BTC';

export async function calculateFee(transactionSize: number = 140): Promise<CalculateFeeResult> {
    try {
        const estimatedFeeInBTC = await calculateSatPerVbyte(transactionSize); 
    
        return {
            currency,
            value: parseSatoshiToBTC(estimatedFeeInBTC)
        }
    } catch (error) {
        logger.error('Error to calculate fee: ' + error.message);
    }
}

export async function calculateSatPerVbyte(transactionSize: number = 140) {
    const feeRateInSatoshi = await fetchFeeRateInSatoshi();
    const satPerVbyte = feeRateInSatoshi / transactionSize; 

    return satPerVbyte * transactionSize;
}

export function parseSatoshiToBTC(satoshi: number) {
    return BigNumber(satoshi * (10e-9));
}

export async function fetchFeeRateInSatoshi(): Promise<number> {
    try {
        const next3blocks = '30';
        const data = await axios.get('https://bitcoiner.live/api/fees/estimates/latest')
            .then(({ data }) => data);

        const p2wpkhInSatoshi = data?.estimates[next3blocks]?.total?.p2wpkh?.satoshi;

        if (!p2wpkhInSatoshi)
            throw Error('Error to get p2wpkh value');

        return p2wpkhInSatoshi;

    } catch (error) {
        throw error;
    }
}
