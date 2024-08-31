
import * as bitcoin from "./services/crypto/bitcoin";
import * as bsc from "./services/crypto/binance-smart-chain";
import { reportFee  } from "./services/report-fee";


(() => {
    setInterval(() => {
        const promises = Promise.allSettled([
            bitcoin.calculateFee(),
            bsc.calculateFee()
        ]);
``
        promises.then((results) => {
            results.forEach(res => {
                if(res.status === 'fulfilled')
                    reportFee(res.value);
            });
        })
    }, 10000);
})();