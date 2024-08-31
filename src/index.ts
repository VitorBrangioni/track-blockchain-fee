
import * as bitcoin from "./services/bitcoin";
import * as bsc from "./services/binance-smart-chain";

(() => {
    setInterval(() => {
        const date = new Date();
        
        const baseMessage = `Fee for Bitcoin at ${date}: `;
        bitcoin.calculateFee()
            .then(fee => console.log(baseMessage.concat(`${fee.toFixed()} BTC`)));

        bsc.calculateFee()
            .then(fee => console.log(baseMessage.concat(`${fee} BNB`)));

    }, 10000);

})();