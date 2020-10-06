const querystring = require('querystring');

// Replace the value below with the your Etherscan token
const TOKEN_API = process.env.ETHERSCAN_API_KEY;
 
// Creating the Etherscan instance
const etherscan = require('etherscan-api').init(TOKEN_API);


// Creating a request for account balance in Ether (default returns in Wei)
module.exports = {
    getEthBalance: function () {
        var balance = etherscan.account.balance(process.env.ACCOUNT);
        balance.then(function(balanceData){
            console.log(balanceData);
        });
    },
    getTransactions: function () {
        //var txlist = api.account.tokentx('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae', null , 1, 'latest', 'asc');
        var txlist = etherscan.account.tokentx(process.env.ACCOUNT, null, 1, 'latest', 1, 100, 'asc');
        txlist.then(function(balanceData){
            console.log(balanceData);
        });

        // const module = 'account';
        // const action = 'tokentx';
        // startblock = 0;
        // endblock = 'latest';
        // page = 1;
        // offset = 100;
        // sort = 'asc';
        // apiKey = process.env.ETHERSCAN_API_KEY;
        // address = process.env.ACCOUNT;
        //   var queryObject = {
        //     module, action, startblock, endblock, page, offset, sort, address, apiKey
        //   };
    
        // //   if (contractaddress) {
        // //     queryObject.contractaddress = contractaddress;
        // //   }
          
        //   console.log(querystring.stringify(queryObject));
    },
    getTokenTx: function () {
        //var txlist = api.account.tokentx('0xde0b295669a9fd93d5f28d9ec85e40f4cb697bae', '0x5F988D968cb76c34C87e6924Cc1Ef1dCd4dE75da', 1, 'latest', 'asc');
        var txlist = etherscan.account.txlist(process.env.ACCOUNT, 1, 'latest', 1, 100, 'asc');
        txlist.then(function(balanceData){
            console.log(balanceData);
        });


        
    }
}