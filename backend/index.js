require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const Web3 = require('web3')
const HDWalletProvider = require('@truffle/hdwallet-provider')
const moment = require('moment-timezone')
const numeral = require('numeral')
const _ = require('lodash')
const axios = require('axios')
const fs = require('fs');
var Account = require('./Account');
const global = require('./global.js');
const accountType = require('./accountType.js');

// SERVER CONFIG
const PORT = process.env.PORT || 5000
const app = express();
const server = http.createServer(app).listen(PORT, () => console.log(`Listening on ${ PORT }`))

// WEB3 CONFIG
const web3 = new Web3(process.env.RPC_URL)

async function checkBalances() {
  account = new Account();
  await account.init(process.env.ACCOUNT, accountType.ETH);
  console.log(account.tokenList);

  account2 = new Account();
  await account2.init("0x1e955aa345DB4AF2c9f2187283693fFF4fb541f3", accountType.ETH);
  console.log(account2.tokenList);
  
  // // Check Ether balance swap
  // balance = await web3.eth.getBalance(process.env.ACCOUNT)
  // balance = web3.utils.fromWei(balance, 'Ether')
  // console.log("Ether Balance:", balance)

  // // Check Dai balance swap
  // balance = await daiContract.methods.balanceOf(process.env.ACCOUNT).call()
  // balance = web3.utils.fromWei(balance, 'Ether')
  // console.log("Dai Balance:", balance)

  // balance = await jrtContract.methods.balanceOf(process.env.ACCOUNT).call()
  // balance = web3.utils.fromWei(balance, 'Ether')
  // console.log("JRT Balance:", balance)
  
}

//ERC20 token list = https://api.etherscan.io/api?module=account&action=tokentx&address=0x840647CB127112d0eDB9E6c3ce8E0c083b99516a&startblock=0&endblock=999999999&sort=asc&apikey=6H4Y4QZPMPMG48A9KYIA19EXW53NNH8F2C


async function checkPair(args) {
  const { inputTokenSymbol, inputTokenAddress, outputTokenSymbol, outputTokenAddress, inputAmount } = args

  const exchangeAddress = await uniswapFactoryContract.methods.getExchange(outputTokenAddress).call()
  const exchangeContract = new web3.eth.Contract(UNISWAP_EXCHANGE_ABI, exchangeAddress)

  const uniswapResult = await exchangeContract.methods.getEthToTokenInputPrice(inputAmount).call()
  let kyberResult = await kyberRateContract.methods.getExpectedRate(inputTokenAddress, outputTokenAddress, inputAmount, true).call()

  
  result = [{
    'Input Token': inputTokenSymbol,
    'Output Token': outputTokenSymbol,
    'Input Amount': web3.utils.fromWei(inputAmount, 'Ether'),
    'Uniswap Return': web3.utils.fromWei(uniswapResult, 'Ether'),
    'Kyber Expected Rate': web3.utils.fromWei(kyberResult.expectedRate, 'Ether'),
    'Kyber Min Return': web3.utils.fromWei(kyberResult.slippageRate, 'Ether'),
    'Timestamp': moment().tz('Europe/Luxembourg').format(),
  }]

  // console.table([{
  //   'Input Token': inputTokenSymbol,
  //   'Output Token': outputTokenSymbol,
  //   'Input Amount': web3.utils.fromWei(inputAmount, 'Ether'),
  //   'Uniswap Return': web3.utils.fromWei(uniswapResult, 'Ether'),
  //   'Kyber Expected Rate': web3.utils.fromWei(kyberResult.expectedRate, 'Ether'),
  //   'Kyber Min Return': web3.utils.fromWei(kyberResult.slippageRate, 'Ether'),
  //   'Timestamp': moment().tz('America/Chicago').format(),
  // }])

}

let priceMonitor
let monitoringPrice = false

async function monitorPrice() {
  if(monitoringPrice) {
    return
  }

  console.log("Checking prices...")
  monitoringPrice = true

  try {

    // ADD YOUR CUSTOM TOKEN PAIRS HERE!!!

    // await checkPair({
    //   inputTokenSymbol: 'ETH',
    //   inputTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    //   outputTokenSymbol: 'MKR',
    //   outputTokenAddress: '0x9f8f72aa9304c8b593d555f12ef6589cc3a579a2',
    //   inputAmount: web3.utils.toWei('1', 'ETHER')
    // })

    await checkPair({
      inputTokenSymbol: 'ETH',
      inputTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
      outputTokenSymbol: 'DAI',
      outputTokenAddress: '0x6b175474e89094c44da98b954eedeac495271d0f',
      inputAmount: web3.utils.toWei('1', 'ETHER')
    })

    // await checkPair({
    //   inputTokenSymbol: 'ETH',
    //   inputTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    //   outputTokenSymbol: 'KNC',
    //   outputTokenAddress: '0xdd974d5c2e2928dea5f71b9825b8b646686bd200',
    //   inputAmount: web3.utils.toWei('1', 'ETHER')
    // })

    // await checkPair({
    //   inputTokenSymbol: 'ETH',
    //   inputTokenAddress: '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    //   outputTokenSymbol: 'LINK',
    //   outputTokenAddress: '0x514910771af9ca656af840dff83e8264ecf986ca',
    //   inputAmount: web3.utils.toWei('1', 'ETHER')
    // })

  } catch (error) {
    console.error(error)
    monitoringPrice = false
    clearInterval(priceMonitor)
    return
  }

  monitoringPrice = false
}

checkBalances();
// Check markets every n seconds
const POLLING_INTERVAL = process.env.POLLING_INTERVAL || 3000 // 3 Seconds
priceMonitor = setInterval(async () => { await monitorPrice() }, POLLING_INTERVAL)
