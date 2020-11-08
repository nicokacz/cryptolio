const querystring = require('querystring');
const Web3 = require('web3');
const Token = require('./Token.js');
const Transaction = require('./Transaction.js');
const depracatedContract = ['0xFE2786D7D1cCAb8B015f6Ef7392F67d778f8d8D7']; //0xFE2786D7D1cCAb8B015f6Ef7392F67d778f8d8D7 = PRQ

// Replace the value below with the your Etherscan token
const TOKEN_API = process.env.ETHERSCAN_API_KEY;
 
// Creating the Etherscan instance
const etherscan = require('etherscan-api').init(TOKEN_API);

// WEB3 CONFIG
const web3 = new Web3();

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
        var txlist = etherscan.account.tokentx(account, contractAddress, 1, 'latest', 1, 100, 'asc');

        //console.log("API call", txlist);
        var p = new Promise(function(resolve, reject){
            txlist.then(async function(balanceData){
                //console.log(balanceData);
                let res = balanceData;
                let arrayResult = balanceData.result;
                
                let accountList = {};
                accountList.account = account;
                accountList.tokenList = [];

                //Get all token from the account
                //let tokenList = [...new Set(arrayResult.map((tx) => tx.tokenSymbol))];
                accountList.tokenSymbolList = [];
                //List of all transactions of the account
                transactionList = [];
                //console.log(tokenList);
                await Promise.all(arrayResult.map(async (tx) => {
                    //Create Transaction object
                    var transaction = new Transaction();
                    await transaction.init(tx.blockNumber,tx.timeStamp,tx.hash,tx.nonce,tx.blockHash,tx.from,tx.contractAddress,tx.to,tx.value,tx.tokenName,tx.tokenSymbol,tx.tokenDecimal,tx.transactionIndex,tx.gas,tx.gasPrice,tx.gasUsed,tx.cumulativeGasUse,tx.input,tx.confirmations,currency);
                    //transactionList.push(transaction);
                    // check deprecated contract
                    if (depracatedContract.findIndex(p => (p.toLocaleLowerCase() === tx.contractAddress)) === -1){
                        //Create token if not existing
                        if(accountList.tokenSymbolList.indexOf(tx.tokenSymbol)> -1){
                            //Token exist, get object from the list
                            //accountList.tokenList
                            t = await accountList.tokenList.filter(trx => trx.name == tx.tokenSymbol);
                            //console.log(t);
                            //add the transaction to the list
                            t[0].addTransaction(transaction);
                        }else{
                            //Token doesn't exist, add it to the list
                            accountList.tokenSymbolList.push(tx.tokenSymbol);
                            //Create Token object
                            let t = new Token(tx.tokenSymbol,account,tx.contractAddress,tx.currency);
                            //add the Transaction Object to the Token
                            t.addTransaction(transaction);
                            //Add the Token object to the list
                            accountList.tokenList.push(t);
                        }
                    }
                }));
                
                //console.log(accountList.tokenList)
                //Send back the result
                resolve(accountList);
            }).catch((error) => {
                console.error("Error",error);
                reject();
              });
        });
        
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