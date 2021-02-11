const accountType = require('./accountType.js');
var etherscan = require('./etherscan.js');
var binance = require('./binance.js');

class Account {
    /*
     * address : adress of the etereum account 0x..., not mandatory if account is a CEX like Kraken, Binance
     * type : type of account (KRAKEN, ETH, BINANCE, ...)
    */
    constructor(){
        this.tokenList = [];
    }

    addToken(token){
        this.tokenList.push(token);
    }

    setTokenList(tokenlist){
        this.tokenList = tokenlist;
    }

    async init(address, type, currency, contractAdress) {
        this.address = address;
        this.type = type;
        if(accountType.list.indexOf(type)>0){
            //console.log(type);
            switch (type){
                case accountType.ETH:
                    //console.log("call etherscan API for",this.address,currency);
                    //Call API
                    function getPromise(address){
                        return new Promise(function(resolve,reject){
                            resolve(etherscan.loadTransactions(address,currency,contractAdress));
                        });
                    }

                    //Get the result
                    async function getResult(address){
                        let result = await getPromise(address);
                        return result;
                    };
                    //Wait 
                    this.tokenList = await getResult(this.address);
                break;
                case accountType.KRAKEN:
                    console.log("[TODO] call Kraken API for",this.address);
                    //krakenAPI.loadTransactions(this.address);
                break;
                case accountType.BINANCE:
                    //console.log("[TODO] call Kraken API for",this.address);
                    //krakenAPI.loadTransactions(this.address);
                    //Call API
                    function getPromise2(address){
                        return new Promise(function(resolve,reject){
                            resolve(binance.loadTransactions(address,currency,contractAdress));
                        });
                    }

                    //Get the result
                    async function getResult2(address){
                        let result = await getPromise2(address);
                        return result;
                    };
                    //Wait 
                    this.tokenList = await getResult2(this.address);
                break;
            }
            
        }else{
            console.log("Unknown type of account",type);
        }
    }

}


module.exports = Account;

   