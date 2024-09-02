import { CalculateFeeResult, Currency } from "../../services/crypto/interfaces";
import winston from "winston";

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
export function reportFee(feeResult: CalculateFeeResult) {
    const cryptoName = Currency[feeResult.currency];
    const date = new Date().toISOString().replace('Z', '+00:00');;
    
    const message = `Fee for ${cryptoName} at ${date}: ${feeResult.value.toString()} ${feeResult.currency}`;

    console.log(message);
    logger.info(message);
}