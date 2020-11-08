var coingecko = require('./coingecko.js');
const ETH_CONTRACT_ADDR = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
const Web3 = require('web3');
const web3 = new Web3();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

class Transaction {
    constructor() {
    };

    async init(blockNumber,timeStamp,hash,nonce,blockHash,from,contractAddress,to,value,tokenName,tokenSymbol,tokenDecimal,transactionIndex,gas,gasPrice,gasUsed,cumulativeGasUse,input,confirmations,currency) {
        this.blockNumber = blockNumber;
        this.timeStamp = timeStamp;
        this.hash = hash;
        this.nonce = nonce;
        this.blockHash = blockHash;
        this.from = from;
        this.contractAddress = contractAddress
        this.to = to;
        this.value = value;
        this.tokenName = tokenName;
        this.tokenSymbol = tokenSymbol;
        this.tokenDecimal = tokenDecimal
        this.transactionIndex= transactionIndex;
        this.gas = gas;
        this.gasPrice = gasPrice;
        this.gasUsed = gasUsed;
        this.cumulativeGasUse =  cumulativeGasUse;
        this.input = input;
        this.confirmations = confirmations;
        this.gasPriced = 0;
        this.currency=currency;

        // console.log(this.blockNumber,1,new Date());
        await sleep(2000);
        // console.log(this.blockNumber,2,new Date());
        coingecko.requestArray = [];
        coingecko.requestPriceArray = [];
        //Get ethereum price at the time, to calculate gas price
        var ethTokenPrice = await coingecko.getCoinPrice(ETH_CONTRACT_ADDR, this.timeStamp, this.currency);
        this.ethTokenPrice = -1;
        if(ethTokenPrice.data && ethTokenPrice.data.prices && ethTokenPrice.data.prices.length ){
            //console.log(tempTokenPrice.data.prices);
            this.ethTokenPrice = ethTokenPrice.data.prices[0][1];
            let currentGasUsed = parseFloat(web3.utils.fromWei(this.gasUsed));
            this.gasPriced = currentGasUsed*this.gasPrice*this.ethTokenPrice
        }
        await sleep(2000);
        
        //get token price at the date of transaction
        var tempTokenPrice = await coingecko.getCoinPrice(this.contractAddress, this.timeStamp, this.currency);
        this.tokenPrice = -1;
        
        if(tempTokenPrice.data && tempTokenPrice.data.prices && tempTokenPrice.data.prices.length ){
            //console.log(tempTokenPrice.data.prices);
            this.tokenPrice = tempTokenPrice.data.prices[0][1];
        }
    }
};


module.exports = Transaction;

   