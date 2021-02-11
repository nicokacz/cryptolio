const express = require('express');
const http = require('http');
const Web3 = require('web3');
var bodyParser = require('body-parser');
var Account = require('./Account');
var Token = require('./Token');

//Mongoose schema
const Token2 = require("./TokenSchema.js");

//Kraken.com
const key          = '3Z+qhcGQ1fQBlnzOmiTt+3/Z6HYk+ai3qqEJBH+MU7Ag4qx2y1PrCWVP'; // API Key
const secret       = 'CZ+lqQoznhSBHyWZ4GrVJAnYjmdcqw0jioPe5MVmaMrYrdvRuvAeHLpmA193KTg/EU6CIneWpATvI2IkKcaCrw=='; // API Private Key
const KrakenClient = require('kraken-api');
const kraken       = new KrakenClient(key, secret);

const accountType = require('./accountType.js');

// Connexion to mongo
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb://localhost:27017/cryptolio', {useNewUrlParser: true, useUnifiedTopology: true});

db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connecté à Mongoose")
});

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

//app.use(bodyParser({limit: '50mb'}));
//app.use(passport.initialize());
app.use(bodyParser.json({limit: '50mb'}));
//app.use(passport.session());

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

app.param('token', function(req, res, next, token) {
    if(token != null && token != undefined && token != "undefined"){
        req.token = token.toString();
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
 * @apiParam {String} [currency] Currency wanted (default is euro)
 * 
 * @apiSuccess {Object} Account
 * @apiSuccessExample {json} Success-Response:
 *  {
 *   "tokenList": {
 *       "account": "0x9cDB5d7ff631155eF06052cf1dca2dEd26516975",
 *       "tokenList": [
 *           {
 *               "name": "DAI",
 *               "id": "",
 *               "account": "0x9cdb5d7ff631155ef06052cf1dca2ded26516975",
 *               "txList": [
 *                   {
 *                       "blockNumber": "11642234", "timeStamp": "1610481823","hash": "0x092c3b4f1ab2ad9858a7def149234d0dafab77832bbdedaf23d6782d3d6e76f1","nonce": "28534","blockHash": "0x005942f2a7473d1fb2238c4c79a7267f0cb61dfcfebf54914f7c27abab7ee356","from": "0x66c57bf505a85a74609d2c83e94aabb26d691e1f","contractAddress": "0x6b175474e89094c44da98b954eedeac495271d0f","to": "0x9cdb5d7ff631155ef06052cf1dca2ded26516975","value": "697500000000000000000","tokenName": "Dai Stablecoin","tokenSymbol": "DAI","tokenDecimal": "18","transactionIndex": "50","gas": "500000","gasPrice": "84360000000","gasUsed": "52018","input": "deprecated","confirmations": "98129","gasPriced": 3.822675793169717,"currency": "eur","ethTokenPrice": 871.1185161408358,"tokenPrice": 0.8223554318361067
 *                   },
 *                   {
 *                       ...
 *                   },
 *                   {
 *                       ...
 *                   },
 *                   {
 *                       ...
 *                   }
 *               ],
 *               "balance": 472.5,
 *               "gasUsed": 39.3637663354861,
 *               "contractAddress": "0x6b175474e89094c44da98b954eedeac495271d0f",
 *               "tokenPrice": {},
 *               "tokenImage": {},
 *               "price_change_percentage_24h": 0,
 *               "price_change_percentage_14d": 0,
 *               "price_change_percentage_30d": 0,
 *               "averagePrice": 0.8225288170409544,
 *               "lastSellPrice": 0.8219913229059266
 *           },
 *           {
 *               "name": "REN",
 *               "id": "",
 *               "account": "0x9cdb5d7ff631155ef06052cf1dca2ded26516975",
 *               "txList": [
 *                   {
 *                       ...
 *                   }
 *               ],
 *               "balance": 133.7766610804776,
 *               "gasUsed": 16.59462777221268,
 *               "contractAddress": "0x408e41876cccdc0f92210600ef50372656052a38",
 *               "tokenPrice": {},
 *               "tokenImage": {},
 *               "price_change_percentage_24h": 0,
 *               "price_change_percentage_14d": 0,
 *               "price_change_percentage_30d": 0,
 *               "averagePrice": 0.3388071068553934,
 *               "lastSellPrice": 0
 *           },
 *           {
 *               "name": "LRC",
 *               "id": "",
 *               "account": "0x9cdb5d7ff631155ef06052cf1dca2ded26516975",
 *               "txList": [
 *                   {
 *                       ...
 *                   }
 *               ],
 *               "balance": 138.4427374301676,
 *               "gasUsed": 15.392739760484263,
 *               "contractAddress": "0xbbbbca6a901c926f240b89eacb641d8aec7aeafd",
 *               "tokenPrice": {},
 *               "tokenImage": {},
 *               "price_change_percentage_24h": 0,
 *               "price_change_percentage_14d": 0,
 *               "price_change_percentage_30d": 0,
 *               "averagePrice": 0.28830616413848215,
 *               "lastSellPrice": 0
 *           }
 *       ],
 *       "tokenSymbolList": [
 *           "DAI",
 *           "REN",
 *           "LRC"
 *       ]
 *   },
 *   "address": "0x9cDB5d7ff631155eF06052cf1dca2dEd26516975",
 *   "type": "ETH"}]
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

/**
 * @api {get} getBinanceAccount/:currency? Get Binance token list.
 * @apiName getBinanceAccount
 * @apiGroup Account *
 * 
 * @apiParam {String} [currency] Currency wanted (default is euro)
 *
 * @apiSuccess {Object} Acount
 * @apiSuccessExample {json} Success-Response:
 *
 * @apiError {String} error Description of error
 */
app.get('/v1/getBinanceAccount/:currency?', async (request, response) => {
    let currency = (request.currency != undefined)?request.currency:"eur";
    console.log("RECEIVED","/v1/getBinanceAccount/",currency);
    let account = new Account();
    await account.init("",accountType.BINANCE, currency);
    //console.log(account);
    response.json(account);
});


/**
 * @api {get} getToken/contractAddress/currency Get token info.
 * @apiName getToken
 * @apiGroup Token *
 * 
 * @apiParam {String} [contractAddress] Contract address
 * @apiParam {String} [currency] Currency wanted (default is euro)
 *
 * @apiSuccess {Object} Account
 * @apiSuccessExample {json} Success-Response:
 *                    { "name":"USD Coin",
 *                      "id":"usd-coin",
 *                      "account":"",
 *                      "txList":[],
 *                      "balance":0,
 *                      "gasUsed":0,
 *                      "contractAddress":"0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
 *                      "currency":"eur",
 *                      "tokenPrice":{"aed":3.67,"ars":86.4,"aud":1.29,"bch":0.00218477,"bdt":84.71,"bhd":0.376558,"bmd":0.998939,"bnb":0.02338948,"brl":5.46,"btc":0.00002923,"cad":1.27,"chf":0.885699,"clp":726.93,"cny":6.47,"czk":21.43,"dkk":6.12,"dot":0.05435322,"eos":0.36403022,"eth":0.00069614,"eur":0.821942,"gbp":0.730101,"hkd":7.74,"huf":293.54,"idr":14008.98,"ils":3.27,"inr":72.85,"jpy":103.66,"krw":1101.75,"kwd":0.302459,"lkr":197.31,"ltc":0.00686591,"mmk":1331.21,"mxn":19.96,"myr":4.04,"ngn":394.37,"nok":8.5,"nzd":1.39,"php":48.04,"pkr":160.7,"pln":3.73,"rub":75.35,"sar":3.75,"sek":8.27,"sgd":1.33,"thb":29.95,"try":7.39,"twd":27.97,"uah":28.12,"usd":0.998939,"vef":0.100024,"vnd":23054,"xag":0.0390211,"xau":0.00053629,"xdr":0.692876,"xlm":3.643281,"xrp":3.60549,"yfi":0.00003114,"zar":15.19,"bits":29.23,"link":0.04042734,"sats":2922.99},"tokenImage":{"thumb":"https://assets.coingecko.com/coins/images/6319/thumb/USD_Coin_icon.png?1547042389","small":"https://assets.coingecko.com/coins/images/6319/small/USD_Coin_icon.png?1547042389","large":"https://assets.coingecko.com/coins/images/6319/large/USD_Coin_icon.png?1547042389"},"price_change_percentage_24h":-0.20298,"price_change_percentage_14d":-0.28304,"price_change_percentage_30d":-0.12865,"averagePrice":0,"lastSellPrice":0,"tokenMarketCap":{"aed":20655165470,"ars":486302287262,"aud":7277982398,"bch":12197540,"bdt":476872803852,"bhd":2119713020,"bmd":5623207413,"bnb":129701708,"brl":30740393589,"btc":164454,"cad":7151550202,"chf":4983500091,"clp":4085822506419,"cny":36424326019,"czk":120636355597,"dkk":34417004045,"dot":303294388,"eos":2035484202,"eth":3871508,"eur":4625762882,"gbp":4109226296,"hkd":43590344734,"huf":1652472483722,"idr":78842596818442,"ils":18376310057,"inr":410094044332,"jpy":583546787289,"krw":6201267956284,"kwd":1702611610,"lkr":1110706820405,"ltc":38473286,"mmk":7493599388350,"mxn":112267336004,"myr":22743062383,"ngn":2219982736958,"nok":47796678198,"nzd":7796149715,"php":270282382759,"pkr":904593151706,"pln":21011783661,"rub":424218141175,"sar":21094658492,"sek":46547195888,"sgd":7460742262,"thb":168563256033,"try":41594364770,"twd":157452613550,"uah":158296932520,"usd":5623207413,"vef":563051758,"vnd":129742973257919,"xag":219185821,"xau":3015782,"xdr":3900324140,"xlm":20238747375,"xrp":20024496608,"yfi":174078,"zar":85484701996,"bits":164454443007,"link":223691478,"sats":16445444300675}
 *                     }
 * @apiError {String} error Description of error
 */
app.get('/v1/getToken/:contractAddress/:currency?', async (request, response) => {
    let currency = (request.currency != undefined)?request.currency:"eur";
    console.log("RECEIVED","/v1/getToken/",request.contractAddress,currency);
    let token = new Token("", "", request.contractAddress,currency);
    await token.getTokenInfo(currency);
    //console.log(token.tokenInfo, request.contractAddress)
    response.json(token);

});

/**
 * @api {get} getTokenInfo/account/contract/currency Get Info for the contract & account.
 * @apiName getAccount
 * @apiGroup Account *
 * 
 * @apiParam {String} [account] Account address
 * @apiParam {String} [contract] Contract address
 * @apiParam {String} [currency] Currency wanted (default is euro)
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


/**
 * @api {get} getTokens/token Search token information.
 * @apiName getToken
 * @apiGroup Token *
 * 
 * @apiParam {String} [token] Token id to search for 
 *
 * @apiSuccess {Object} Token
 * @apiSuccessExample {json} Success-Response:
 * [
 *   {
 *       "market_data": {
 *           "current_price": { "aed": 1133.67, "ars": 25877, ....  },
 *           "price_change_24h": null,
 *           "price_change_percentage_24h": null,
 *           "price_change_percentage_7d": 0,
 *           "price_change_percentage_14d": 0,
 *           "price_change_percentage_30d": 0,
 *           "price_change_percentage_60d": 0,
 *           "price_change_percentage_200d": 0,
 *           "price_change_percentage_1y": 0
 *       },
 *       "_id": "60199045e65777731c8c37a8",
 *       "id": "100-waves-eth-btc-set",
 *       "symbol": "100wratio",
 *       "name": "100 Waves ETH/BTC Set",
 *       "__v": 0
 *   }, ....
 * ]
 *
 * @apiError {String} error Description of error
 */
app.get('/v1/getTokens/:token', async (request, response) => {
    //let currency = (request.currency != undefined)?request.currency:"eur";
    console.log("RECEIVED","/v1/getTokens/",request.token);
    //Token2.where('id').gte(twoWeeksAgo).stream().pipe(writeStream);
    let search = request.token;

    let findQuery = {};
    findQuery.$or = [];

    obj = {};
    var id = "id";
    obj[id]= new RegExp(search, 'i');
    findQuery.$or.push(obj); 

    var name = "name";
    obj[name]= new RegExp(search, 'i');
    findQuery.$or.push(obj); 

    Token2.find(findQuery)
    .sort({id:1})   
    .limit(10)
    .exec( function (err, tokens) {
        //console.log(travels, err);
        if (err) {
            response.json({'error':err});
        }else if (tokens) {
            response.send(tokens);
        }
    });

});


/**
 * @api {post} Add token information.
 * @apiName addToken
 * @apiGroup Token *
 * 
 * @apiParam {String} [token] Token id to search for 
 *
 * @apiSuccess {Object} Token
 * @apiSuccessExample {json} Success-Response:
 * [
 *   
 * ]
 *
 * @apiError {String} error Description of error
 */
app.post('/v1/token/', function (req, res) {
    console.log("ADD","/token/",req.body);
    let t = new Token2(req.body);

    t.save(function(err, newToken) {
        if (err) {
            if(res){
                res.send({ error: err });
            }
        }else{
            if(res){
                res.json({ message: 'Token created', token: newToken });
            }
        }
    });
});


/**
 * @api {delete} Remove token information.
 * @apiName removeToken
 * @apiGroup Token *
 * 
 * @apiParam {String} [token] Token id to remove
 *
 * @apiSuccess {Object} Token
 * @apiSuccessExample {json} Success-Response:
 * [
 *   
 * ]
 *
 * @apiError {String} error Description of error
 */
app.delete('/v1/token/', function (req, res) {
    console.log("DELETE","/token/",req.body);

    if(req.body.id){
        Token2.deleteOne({"id":req.body.id}, function (err) {
            if(err) {
                console.log(err);
                res.json({'error':err});
            }else{
                console.log("Successful deletion");
                res.send({'result':'ok'});
            }
        });
    }else{
        res.json({'error':'id not sent'});
    }
});


/**
 * @api {put} Update token information.
 * @apiName updateToken
 * @apiGroup Token *
 * 
 * @apiParam {String} [id] Token id to update 
 * @apiParam {String} [name] New token name
 *
 * @apiSuccess {Object} Token
 * @apiSuccessExample {json} Success-Response:
 * [
 *   
 * ]
 *
 * @apiError {String} error Description of error
 */
app.put('/v1/token', function (req, res) {
    console.log("UPDATE","/token/",req.body);

    if(req.body.id && req.body.name){
        Token2.findOneAndUpdate({"id":req.body.id},{"name":req.body.name}, function (err) {
            if(err) {
                console.log(err);
                res.json({'error':err});
            }else{
                console.log("Successful update");
                res.send({'result':'ok'});
            }
        });
    }else{
        res.json({'error':'id and name mandatory'});
    }
});


const server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${ PORT }`))