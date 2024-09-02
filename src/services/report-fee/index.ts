import { CalculateFeeResult, Currency } from "../../services/crypto/interfaces";
import winston from "winston";
import Redis from "../../services/redis";

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston.transports.File({ filename: 'logs/errors.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/fee-tracks.log' }),
    ],
});

// Fee for Bitcoin at 2023-05-18T15:17:00+00:00: 0.00012 BTC
export async function reportFee(feeResult: CalculateFeeResult) {
    const isSameValue = await isSameValuePreviousOne(feeResult);

    if (isSameValue) return 

    const cryptoName = Currency[feeResult.currency];
    const date = new Date().toISOString().replace('Z', '+00:00');;
    const message = `Fee for ${cryptoName} at ${date}: ${feeResult.value.toString()} ${feeResult.currency}`;

    console.log(message);
    logger.info(message);

    setPreviousValue(feeResult);
}

async function isSameValuePreviousOne(feeResult: CalculateFeeResult): Promise<boolean> {
    const previousValue = await getPreviousValue(feeResult);

    return (previousValue === feeResult.value?.toFixed());
}

async function getPreviousValue(feeResult: CalculateFeeResult): Promise<string> {
    const redis = Redis.getClient();

    return redis.get(`${feeResult.currency}-previousValue`);
}

function setPreviousValue(feeResult: CalculateFeeResult): void {
    const redis = Redis.getClient();
    redis.set(`${feeResult.currency}-previousValue`, feeResult.value.toFixed());
}