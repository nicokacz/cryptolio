const express = require('express');
const http = require('http');
const Web3 = require('web3');
var Account = require('./Account');
var Token = require('./Token');

const accountType = require('./accountType.js');

// SERVER CONFIG
const PORT = process.env.PORT || 5000;
const app = express();

const CURRENCY = ["btc","eth","ltc","bch","bnb","eos","xrp","xlm","link","dot","yfi","usd","aed","ars","aud","bdt","bhd","bmd","brl","cad","chf","clp","cny","czk","dkk","eur","gbp","hkd","huf","idr","ils","inr","jpy","krw","kwd","lkr","mmk","mxn","myr","ngn","nok","nzd","php","pkr","pln","rub","sar","sek","sgd","thb","try","twd","uah","vef","vnd","zar","xdr","xag","xau"  ];

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers, authorization");
    //res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    
    next();
  });


app.get('/helloworld', function (request, response) {
    console.log("hello world!");
});


app.param('account', function(req, res, next, account) {
    if(account != null && account != undefined && account != "undefined"){
        req.account = account.toString();
    }
    next();
});

app.param('contractAddress', function(req, res, next, contractAddress) {
    if(contractAddress != null && contractAddress != undefined && contractAddress != "undefined"){
        req.contractAddress = contractAddress.toString();
    }
    next();
});

app.param('currency', function(req, res, next, currency) {
    if(currency != null && currency != undefined && currency != "undefined" && CURRENCY.indexOf(currency.toString().toLowerCase())>-1){
        req.currency = currency.toString();
    }else{
        //default currency
        req.currency = "eur";
    }
    next();
});


/**
 * @api {get} getEthAccount/account Get ERC20 token list.
 * @apiName getAccount
 * @apiGroup Account *
 * 
 * @apiParam {String} [account] Account address
 *
 * @apiSuccess {Object} Acount
 * @apiSuccessExample {json} Success-Response:
 *
 * @apiError {String} error Description of error
 */
app.get('/v1/getEthAccount/:account/:currency?', async (request, response) => {
    let currency = (request.currency != undefined)?request.currency:"eur";
    console.log("RECEIVED","/v1/getEthAccount/",request.account,currency);
    account = new Account();
    await account.init(request.account, accountType.ETH, currency);
    //console.log(account);
    response.json(account);
});

app.get('/v1/getToken/:contractAddress/:currency?', async (request, response) => {
    let currency = (request.currency != undefined)?request.currency:"eur";
    console.log("RECEIVED","/v1/getToken/",request.contractAddress,currency);
    let token = new Token("", "", request.contractAddress,currency);
    await token.getTokenInfo(currency);
    //console.log(token.tokenInfo, request.contractAddress)
    response.json(token);

});

/**
 * @api {get} getTokenInfo/account/contract Get Info for the contract & account.
 * @apiName getAccount
 * @apiGroup Account *
 * 
 * @apiParam {String} [account] Account address
 * @apiParam {String} [contract] Contract address
 *
 * @apiSuccess {Object} Acount
 * @apiSuccessExample {json} Success-Response:
 *
 * @apiError {String} error Description of error
 */
app.get('/v1/getTokenInfo/:account/:contractAddress/:currency?', async (request, response) => {
    let currency = (request.currency != undefined)?request.currency:"eur";
    console.log("RECEIVED","/v1/getTokenInfo/",request.account,request.contractAddress,currency);
    account = new Account();
    await account.init(request.account, accountType.ETH, currency, request.contractAddress);
    response.json(account);

});

const server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${ PORT }`))