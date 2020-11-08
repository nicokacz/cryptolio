//1. Import coingecko-api
const CoinGecko = require('coingecko-api');

//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

Date.prototype.addHours= function(h){
    this.setHours(this.getHours()+h);
    return this;
}

var requestArray = [];
var requestPriceArray = [];

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive 
}

async function getCoinPrice(contract, timestampFrom, currency) {
    requestPriceArray.push(contract);
    var ms = 1000*(requestPriceArray.length);//getRandomIntInclusive(1,15)*1000;
    //Get the result
    async function getResult(ms){
        let result = await sleep(ms);
        return result;
    };
    var t = await getResult(ms);
    //console.log("Sleep", ms,requestPriceArray.length);

    console.log("call coingecko API",contract, timestampFrom, requestPriceArray.length, new Date());
    var date = new Date(timestampFrom * 1000);
    var timestampTo = date.addHours(2);
    try {        
        data = await CoinGeckoClient.coins.fetchCoinContractMarketChartRange(contract, 'ethereum', {
            from: timestampFrom,
            to: timestampTo.getTime()/1000,
            vs_currency: currency
        });
        //console.log("coingecko.js i--",i);
    }
    catch (e) {
        console.log("ERROR",contract,e);
    }
    requestPriceArray.pop(contract);
    return data;
}

exports.getCoinPrice = getCoinPrice;

async function getTokenInfo(contract) {
    requestArray.push(contract);
    var ms = 1000*(requestArray.length);//getRandomIntInclusive(1,15)*1000;
    //Get the result
    async function getResult(ms){
        let result = await sleep(ms);
        return result;
    };
    var t = await getResult(ms);
    console.log("call coingecko API 2",contract,requestArray.length, new Date());
    try {
        data = await CoinGeckoClient.coins.fetchCoinContractInfo(contract, 'ethereum');
    }
    catch (e) {
        console.log("ERROR",contract,e);
    }
    //console.log("coingecko.js return", tokenInfo.name);
    requestArray.pop(contract);
    return data.data;
}

exports.getTokenInfo = getTokenInfo;

// module.exports = {
//     //3. Make calls
//     getCoinPrice: async function(contract, timestampFrom) {
//         await sleep(2000);
//         console.log("call coingecko API",contract, timestampFrom, new Date());
//         var date = new Date(timestampFrom * 1000);
//         var timestampTo = date.addHours(2);
//         let data = await CoinGeckoClient.coins.fetchCoinContractMarketChartRange(contract, 'ethereum', {
//             from: timestampFrom,
//             to: timestampTo.getTime()/1000
//         });
//         //console.log("data",data,contract,timestampFrom,timestampTo.getTime()/1000);
//         return data;
//     }
//     // loadCoinList: async function () {

//     //     let data = await CoinGeckoClient.ping();
//     //     console.log(data)
//     //     return data;
//     // }
// }
