const axios = require('axios');

const info = { coins: {} };

async function setCoinsToCache() {
    try {
        const { data } = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=ethereum%2Cbinancecoin%2Cmatic-network%2Csolana%2Ctron&vs_currencies=usd');
        info.coins = data;
    } catch { }
    if (process.env.NODE_ENV !== 'test') {
        setTimeout(() => {
            setCoinsToCache();
        }, 60 * 1000);
    }
}

setCoinsToCache();

function getCoinPrice(id) {
    return info.coins[id]?.usd || 0;
}

module.exports = { getCoinPrice };