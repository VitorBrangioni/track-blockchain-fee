
import * as bsc from "./services/crypto/binance-smart-chain";
import * as btc from "./services/crypto/bitcoin";
import * as eth from "./services/crypto/ethereum";
import { isRunning } from "./services/gracefully-shutdown";
import { formatError, logger, reportFee } from "./services/logger";
import handleGracefullyShutdown from "./services/gracefully-shutdown";

(() => {
    logger.info('RUNNING...');
    console.log('## RUNNING');
    
    handleGracefullyShutdown();

    setInterval(() => {
        isRunning.next(true);
        const promises = Promise.allSettled([
            bsc.calculateFee(),
            btc.calculateFee(),
            eth.calculateFee()
        ]);

        promises.then((results) => {
            results.forEach(res => {
                if (res.status === 'fulfilled')
                    reportFee(res.value);
                else
                    logger.error(formatError(res.reason));
            });
        });

        isRunning.next(false);
    }, 10000);
})();