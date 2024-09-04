import { CalculateFeeResult, Currency } from "../crypto/interfaces";
import winston, { format } from "winston";
const { combine, timestamp, printf } = format;
const { stringify } = require('flatted');


import Redis from "../../services/redis";

export const formatError = (err) => {
    return stringify({
        message: err.message,
        stack: err.stack,
        name: err.name,
        ...err
    }, null, 2);
};

const infoFilter = format((info) => {
    return info.level === 'info' ? info : false;
});

const errorFilter = format((info) => {
    return info.level === 'error' ? info : false;
});

const formatLog = printf(({ level, message, timestamp }) => {
    return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

export const logger = winston.createLogger({
    defaultMeta: { service: 'track-blockchain-fee' },
    transports: [
        new winston.transports.File({
            filename: '/logs/errors.log', level: 'error', format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                errorFilter(),
                formatLog
            )
        }),
        new winston.transports.File({
            filename: '/logs/fee-tracks.log', level: 'info', format: combine(
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                infoFilter(),
                formatLog
            )
        }),
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