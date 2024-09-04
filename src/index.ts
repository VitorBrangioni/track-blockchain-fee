
import * as bsc from "./services/crypto/binance-smart-chain";
import * as btc from "./services/crypto/bitcoin";
import * as eth from "./services/crypto/ethereum";
import { formatError, logger, reportFee } from "./services/logger";

(() => {
    console.log(`RUNNING...`);
    setInterval(() => {
        const promises = Promise.allSettled([
            btc.calculateFee(),
            bsc.calculateFee(),
            eth.calculateFee()
        ]);

        promises.then((results) => {
            results.forEach(res => {
                if(res.status === 'fulfilled')
                    reportFee(res.value);
                else
                    logger.error(formatError(res.reason));
            });
        });
    }, 10000);
})();