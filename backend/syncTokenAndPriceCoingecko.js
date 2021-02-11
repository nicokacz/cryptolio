//Mongoose schema
const Token = require("./TokenSchema.js");

//1. Import coingecko-api
const CoinGecko = require('coingecko-api');

//2. Initiate the CoinGecko API Client
const CoinGeckoClient = new CoinGecko();

// Connexion to mongo
const mongoose = require('mongoose');
mongoose.set('useFindAndModify', false);

mongoose.connect('mongodb://localhost:27017/cryptolio', {useNewUrlParser: true, useUnifiedTopology: true});

db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("connecté à Mongoose")
});

// Create new token
const createToken = async tokenData => {
    const token = await Token.create(tokenData)
    return token
}

// Find token
const findToken = async id => {
    const token = await Token.findOne({id})
    return token
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const updateToken = async (id, token) => {

    Token.findOneAndUpdate({id},token, null, function (err, docs) { 
        if (err){ 
            console.log(err) 
        } 
        else{ 
            //console.log("Original Doc : ",docs); 
        } 
    }); 
}   

waitingList = [];
let sync = async() => { 
    //const res = (await findToken("stellar"))
    let fullList = await CoinGeckoClient.coins.list();
    //console.log(fullList.data.length/50, Math.round(fullList.data.length/50));
    fullListLength = 2;//Math.round(fullList.data.length/50) + 1;
    console.log(fullListLength,"pages to sync");
    for (let index = 1; index < fullListLength; index++) {
        waitingList.push(index);
        console.log("page",index);
        var ms = 1000*(waitingList.length);//getRandomIntInclusive(1,15)*1000;
        //Get the result
        async function getResult(ms){
            let result = await sleep(ms);
            return result;
        };
        var t = await getResult(ms);

        try {        
            data = await CoinGeckoClient.coins.all({page:index});
            result = data.data;
            //console.log(result);
            for (const element in result) {
                //console.log(result[element]);
                t=result[element];
                let res = await findToken(t.id);
                // If token not exists
                if(res == null){
                    // create it
                    console.log("Token created", t.id);
                    createToken(t);
                }else{
                    // otherwise update it
                    updateToken(t.id,t);
                }  
            };
            waitingList.pop(index);
        }
        catch (e) {
            console.log("ERROR",e);
        }
    }
    console.log('SYNC !!')
}

console.log("Start syncing token");
sync();