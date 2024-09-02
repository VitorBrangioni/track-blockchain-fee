
import * as bsc from "./services/crypto/binance-smart-chain";
import * as btc from "./services/crypto/bitcoin";
import * as eth from "./services/crypto/ethereum";
import { reportFee } from "./services/report-fee";

(() => {
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

            });
        });
    }, 10000);
})();