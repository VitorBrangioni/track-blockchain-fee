import axios from "axios";
import { BigNumber } from "bignumber.js";
import { CalculateFeeResult } from "../interfaces";
import { logger } from "../../report-fee";

const currency = 'BTC';
type NextBlocksInMinutes = '30' | '60' | '120' | '180' | '360' | '720' | '1440'

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
    return BigNumber(satoshi * (1e-8));
}

export async function fetchFeeRateInSatoshi(nextBlocksInMinutes: NextBlocksInMinutes = '30'): Promise<number> {
    try {
        const data = await axios.get('https://bitcoiner.live/api/fees/estimates/latest')
            .then(({ data }) => data);

        const p2wpkhInSatoshi = data?.estimates[nextBlocksInMinutes]?.total?.p2wpkh?.satoshi;

        if (!p2wpkhInSatoshi)
            throw Error('Error to get p2wpkh value');

        return p2wpkhInSatoshi;

    } catch (error) {
        throw error;
    }
}
