const Transaction = require('./Transaction.js');
var coingecko = require('./coingecko.js');
const Web3 = require('web3');
const web3 = new Web3();

class Token {
    constructor(name, account,contractAddress,currency) {
        this.name = name;
        this.id = "";
        this.account = "";//Not linked to an account
        if(account != undefined)
            this.account = account.toString().toLowerCase();
        this.txList = [];
        this.balance = 0;
        this.gasUsed = 0;
        this.contractAddress = contractAddress;
        this.currency = currency;
        this.tokenPrice = {};
        this.tokenImage = {};
        this.price_change_percentage_24h = 0;
        this.price_change_percentage_14d = 0;
        this.price_change_percentage_30d = 0;
        this.averagePrice = 0;
        this.lastSellPrice = 0;
    };

    addTransaction(transaction){
        this.txList.push(transaction);
        // Transform to Wei (18 decimals)
        var i=0;
        for(i=transaction.tokenDecimal; i < 18 ; i++){
            transaction.value+="0";
        }
        //console.log("AFTER",transaction.value);

        let currentValue = parseFloat(web3.utils.fromWei(transaction.value));
        //let currentGasUsed = parseFloat(web3.utils.fromWei(transaction.gasUsed));

        if(transaction.tokenPrice != -1){
            this.gasUsed+=transaction.gasPriced;
                //BUY
            if( transaction.to.toString().toLowerCase() == this.account){
                //console.log(this.balance,"+",currentValue,"=",this.balance+currentValue,transaction);
                //console.log("A",this.averagePrice,transaction.tokenPrice,currentValue,this.balance);
                this.balance+=currentValue;
                //Cost average
                if(this.averagePrice == 0){
                    this.averagePrice = transaction.tokenPrice;
                }else{
                    this.averagePrice = (transaction.tokenPrice * currentValue + this.averagePrice * (this.balance - currentValue )) / (this.balance);
                }
                //console.log("B",this.averagePrice,transaction.tokenPrice,currentValue,this.balance);
                
            }else{
                //SELL
                //console.log(balance,"-",currentValue,"=",balance-currentValue,tx,this.averagePrice);
                
                //Cost average
                if(this.balance-currentValue == 0){
                    this.averagePrice = 0;
                }else{
                    this.averagePrice = ((this.averagePrice * this.balance) - transaction.tokenPrice * currentValue ) / (this.balance-currentValue);
                }
                this.lastSellPrice=transaction.tokenPrice;
                this.balance-=currentValue;
            }
        }else{
            console.log("WARNING","TRANSACTION", "Something wrong with this transaction", transaction);
        }
    };

    async getTokenInfo(currency){
        let cCurrency = this.currency;
        if(currency != undefined){
            cCurrency = currency;
        }

        //Call API
        function getPromise(contractAddress){
            return new Promise(function(resolve,reject){
                resolve(coingecko.getTokenInfo(contractAddress));
            });
        }

        //Get the result
        async function getResult(contractAddress){
            let result = await getPromise(contractAddress);
            return result;
        };
        //Wait 
        var t = await getResult(this.contractAddress);
        var tokenInfo={};
        if(t && t.market_data && t.market_data.current_price ){
            tokenInfo.tokenPrice = t.market_data.current_price;
        }
        if(t && t.market_data && t.market_data.market_cap ){
            tokenInfo.market_cap = t.market_data.market_cap;
        }
        if(t && t.market_data && t.market_data.price_change_percentage_24h ){
            tokenInfo.price_change_percentage_24h = t.market_data.price_change_percentage_24h;
        }
        if(t && t.market_data && t.market_data.price_change_percentage_7d ){
            tokenInfo.price_change_percentage_7d = t.market_data.price_change_percentage_7d;
        }
        if(t && t.market_data && t.market_data.price_change_percentage_14d ){
            tokenInfo.price_change_percentage_14d = t.market_data.price_change_percentage_14d;
        }
        if(t && t.market_data && t.market_data.price_change_percentage_30d ){
            tokenInfo.price_change_percentage_30d = t.market_data.price_change_percentage_30d;
        }
        if(t && t.market_data && t.market_data.price_change_percentage_60d ){
            tokenInfo.price_change_percentage_60d = t.market_data.price_change_percentage_60d;
        }
        if(t && t.market_data && t.market_data.price_change_percentage_200d ){
            tokenInfo.price_change_percentage_200d = t.market_data.price_change_percentage_200d;
        }
        if(t && t.market_data && t.market_data.price_change_percentage_1y ){
            tokenInfo.price_change_percentage_1y = t.market_data.price_change_percentage_1y;
        }
        if(t && t.name ){
            tokenInfo.name = t.name;
        }
        if(t && t.id ){
            tokenInfo.id = t.id;
        }
        if(t && t.image ){
            tokenInfo.tokenImage = t.image;
        }

        this.tokenPrice = tokenInfo.tokenPrice;
        this.name = tokenInfo.name;
        this.id = tokenInfo.id;
        this.tokenImage = tokenInfo.tokenImage;
        this.price_change_percentage_24h = tokenInfo.price_change_percentage_24h;
        this.price_change_percentage_14d = tokenInfo.price_change_percentage_14d;
        this.price_change_percentage_30d = tokenInfo.price_change_percentage_30d;
        this.tokenMarketCap = tokenInfo.market_cap;

    };

    /**
     * Deprecated
     */
    calculBalance() {
        //Order by blockNumber
        this.txList.sort((a, b) => {
            return a.blockNumber - b.blockNumber;
        });
        
        let balance = 0;
        let gasUsed = 0;
        this.txList.forEach(tx => {
            //console.log(tx, web3.utils.fromWei(tx.value, 'Ether'));
            let currentValue = parseFloat(web3.utils.fromWei(tx.value));
            let currentGasUsed = parseFloat(web3.utils.fromWei(tx.gasUsed));
            gasUsed+=currentGasUsed;//gasUsed*gasPrice*eth price = price of gas for the transaction
            if( tx.to.toString().toLowerCase() == this.account){
                //console.log(balance,"+",currentValue,"=",balance+currentValue,tx);
                balance+=currentValue;                        
            }else{
                //console.log(balance,"-",currentValue,"=",balance-currentValue,tx);
                balance-=currentValue;
            }
            
        });
        this.balance=balance;
        this.gasUsed=gasUsed;
    }
}



module.exports = Token; 