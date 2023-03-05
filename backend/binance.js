const querystring = require('querystring');
const Web3 = require('web3');
const Token = require('./Token.js');
const Transaction = require('./Transaction.js');
const depracatedContract = ['0xFE2786D7D1cCAb8B015f6Ef7392F67d778f8d8D7']; //0xFE2786D7D1cCAb8B015f6Ef7392F67d778f8d8D7 = PRQ

//Binance.com
const Binance = require('node-binance-api');
const binance = new Binance().options({
  APIKEY: '***',
  APISECRET: '***'
});

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Creating a request for account balance in Ether (default returns in Wei)
module.exports = {
    getEthBalance: function () {
        var balance = etherscan.account.balance(process.env.ACCOUNT);
        balance.then(function(balanceData){
            console.log(balanceData);
        });
    },
    loadTransactions: function (account, currency, contractAddress) {
        if(contractAddress === undefined){
            contractAddress = null;
        }
        //var txlist = api.account.tokentx('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae', null , 1, 'latest', 'asc');
        //var txlist = etherscan.account.tokentx(account, contractAddress, 1, 'latest', 1, 100, 'asc');
        var p = null;
        binance.balance((error, balances) => {
                if ( error ) return console.error(error);
                //console.info("balances()", balances);
                let accountList = {};
                accountList.account = account;
                accountList.tokenList = [];
                Object.keys(balances).forEach(function(k){
                    if(balances[k].available > 0)
                        console.log(k + ' - ' + balances[k].available);
                });
                //console.info("tokenList", balances.BTC);
                //balances
            //     console.info("ETH balance: ", balances.ETH.available);

        });

        // //console.log("API call", txlist);
        // var p = new Promise(function(resolve, reject){
        //     txlist.then(async function(balanceData){
        //         //console.log(balanceData);
        //         let res = balanceData;
        //         let arrayResult = balanceData.result;
                
        //         let accountList = {};
        //         accountList.account = account;
        //         accountList.tokenList = [];

        //         //Get all token from the account
        //         //let tokenList = [...new Set(arrayResult.map((tx) => tx.tokenSymbol))];
        //         accountList.tokenSymbolList = [];
        //         //List of all transactions of the account
        //         transactionList = [];
        //         //console.log(tokenList);
                
                
        //         //console.log(accountList.tokenList)
        //         //Send back the result
        //         resolve(accountList);
        //     }).catch((error) => {
        //         console.error("Error",error);
        //         reject();
        //       });
        // });
        
        //Return the promise
        return p;
    },
    getTokenTx: function () {
        //var txlist = api.account.tokentx('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae', '0x5F988D968cb76c34C87e6924Cc1Ef1dCd4dE75da', 1, 'latest', 'asc');
        var txlist = etherscan.account.txlist(process.env.ACCOUNT, 1, 'latest', 1, 100, 'asc');
        txlist.then(function(balanceData){
            console.log(balanceData);
        });


        
    }
}
