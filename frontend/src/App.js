import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import PropTypes from 'prop-types';
import SplitButton from 'react-bootstrap/SplitButton';
import Dropdown from 'react-bootstrap/Dropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';


import MyModalComponent from './ModalComponent';

const axios = require("axios");
var lastestSort = "";
const walletAdress = ["0x840647CB127112d0eDB9E6c3ce8E0c083b99516a","0x1e955aa345DB4AF2c9f2187283693fFF4fb541f3"];
const portfolio = ["Raw","Free","Minted","Stable","Unfollowed"];
const selectedPortfolio = "Raw";

class App extends React.Component {
  // Transaction MODAL
  handleShow = (tx) => {
    this.setState({
      show: true,
      title: 'Group People',
      body: 'Hi, find my group details',
      data: tx
    });
  };

  handleClose = (fromModal) => {
    this.setState({
      show: false
    });
  };
  
  async componentWillMount() {
    //await this.getData()
    await this.getData2(walletAdress[0])
  }

  
  async getData2(walletAdress, force){
    if(force === undefined){
      force = false;
    }
    this.setState({ loading: true });
    
    var result = localStorage.getItem("rawData");
    let ptf = JSON.parse(localStorage.getItem("portfolioTokenList"));

    if(ptf !== null){    
      this.setState({ portfolioTokenList : ptf });
    }
    //console.log(result);
    if(result !== null && !force){
      console.log("Load storage");
      result = JSON.parse(result);
    }else{
      //let i = 0;
      let result = [];
      if(this.state.rawData && this.state.rawData.length > 0 ){
        result = this.state.rawData;
        // Clean rawData
        result = result.filter(token => token.account !== walletAdress);
        console.log(result);
      }
  
      let response = await axios.get('http://127.0.0.1:5000/v1/getEthAccount/' + walletAdress + '/eur');
      let resultAll = response.data;

      var result2 = await this.loadToken(resultAll.tokenList.tokenList, false);
      result = result.concat(result2);

      localStorage.setItem("rawData",JSON.stringify(result));
      
    }
    console.log(result);
    this.setState({ rawData : result });

    console.log(this.state.selectedPortfolio);
    if(this.state.selectedPortfolio !== undefined){
      this.selectPortfolio(this.state.selectedPortfolio);
    }

    //this.setSortedField("totalValue",result);
    
    this.setState({ loading: false })

  };

  async hardRefresh(){
    localStorage.removeItem("rawData");
    let res1 = await this.getData2(walletAdress[0], true);
    let res2 = await this.getData2(walletAdress[1], true);
  }

  async loadToken(result, refresh){
    this.setState({ loading: true });
    console.log("loadToken",result, refresh)
    result = result.filter(t => t.balance > 0);
   
    var tokenList = [];
    var i = 0;
    var tmpTotalValue = 0;
    while(i<result.length){
      var token = result[i];

      let tpTokenName = token.name;
      // If token has no portfolio select, set default one
      if(this.state.portfolioTokenList && this.state.portfolioTokenList.findIndex(p => p.tokenName === tpTokenName) === -1){
        //result[i].portfolio = this.state.portfolio[0]; 
        let tokenName = result[i].name;
        let portfolio = "Raw";
        this.state.portfolioTokenList.push({tokenName,portfolio});
        //console.log("portfolio not set",token.name, this.state.portfolioTokenList);
        localStorage.setItem("portfolioTokenList",JSON.stringify(this.state.portfolioTokenList));
        
      }//else Token already move to a portfolio

      const response = await this.getToken(token.contractAddress);
      tokenList[token.contractAddress] = response.data;
      result[i].tokenInfo = response.data
      if(result[i].averagePrice>0){
        result[i].costPrice = result[i].balance * result[i].averagePrice;
      }else {
        result[i].averagePrice = 0;
        result[i].costPrice = 0;
      }
      
      if(result[i].tokenInfo.tokenPrice){
        result[i].totalValue = result[i].balance * result[i].tokenInfo.tokenPrice.eur;
      }else{
        result[i].totalValue = 0;
      }

      result[i].roi = result[i].totalValue - result[i].costPrice;
      
      
      if(result[i].costPrice !== 0 && result[i].costPrice > 0){
        result[i].roiPercent = result[i].roi / result[i].costPrice * 100;
      }else{
        result[i].costPrice = result[i].balance * (result[i].lastSellPrice * 2);
        result[i].roiPercent = result[i].roi / result[i].costPrice * 100;
        
      }

      //console.log(result[i].tokenInfo.price_change_percentage_24h,!result[i].tokenInfo.price_change_percentage_24h);
      if(!result[i].tokenInfo.price_change_percentage_24h){
        result[i].tokenInfo.price_change_percentage_24h = 0;
      }

      if(!result[i].tokenInfo.price_change_percentage_14d){
        result[i].tokenInfo.price_change_percentage_14d = 0;
      }

      if(!result[i].tokenInfo.price_change_percentage_30d){
        result[i].tokenInfo.price_change_percentage_30d = 0;
      }

      tmpTotalValue += result[i].totalValue;
      i++;
    }
    
    if(refresh && result.length === this.state.ccData.length){
      this.setState({
        totalValue : tmpTotalValue
      })
    }else{
      this.setState({
        rawData : result
      })
    }
    
    this.setState({ loading: false })
    return result;
  }

  async getToken(contractAddress){
    return axios.get("http://127.0.0.1:5000/v1/getToken/"+contractAddress)
  };

  selectPortfolio(portfolio){
    //console.log(portfolio, this.state.portfolioTokenList,this.state.rawData);
    let result = this.state.rawData;
    console.log(result);
    let filteredPortfoloList = this.state.portfolioTokenList.filter(p => (p.portfolio === portfolio));
    //console.log(filteredPortfoloList);
    //let index
    let tmpTotalValue = 0;

    result = result.filter(t => {
                                  let ind = filteredPortfoloList.findIndex(p => (p.tokenName === t.name));
                                  //console.log(ind, t.name);
                                  if(ind === -1){
                                    return false;
                                  }
                                  //console.log(filteredPortfoloList[ind], portfolio);
                                  tmpTotalValue += t.totalValue;
                                  return filteredPortfoloList[ind].portfolio === portfolio;
                                });
    console.log(result);
    this.setState({ totalValue : tmpTotalValue });
    this.setState({ selectedPortfolio : portfolio });
    this.setState({ ccData : result });
  }

  // Move a token to a portfolio
  moveToPortfolio(portfolio, tokenName){
    console.log(portfolio, tokenName,this.state.portfolioTokenList);
    let indPortfolio = this.state.portfolioTokenList.findIndex(p => (p.tokenName === tokenName) );
    console.log(indPortfolio);
    if( indPortfolio > -1){
      //console.log("find");
      let ptf = this.state.portfolioTokenList;
      ptf[indPortfolio].portfolio = portfolio;
      this.setState({ portfolioTokenList : ptf });
      localStorage.setItem("portfolioTokenList",JSON.stringify(this.state.portfolioTokenList));
    } else {
      this.state.portfolioTokenList.push({tokenName,portfolio});
    }
    console.log(this.state.portfolioTokenList);

    this.selectPortfolio(this.state.selectedPortfolio);
  };

  setSortedField(field, pResult){
    let result;
    if(pResult !== undefined){
      result = pResult;
    }else{
      result = this.state.ccData;
    }

    if(lastestSort === field){
      // Reverse the sorting
      result.reverse();
    }else{
      
      result.sort((a,b) => {
        let afield;
        let bfield;
        try{
          afield = eval("a."+field);
        } catch {
          afield = 0;
        }
        
        try{
          bfield = eval("b."+field);
        } catch {
          bfield = 0;
        }

        if (afield > bfield) {
          return -1;
        }
        if (afield < bfield) {
          return 1;
        }
        return 0;
      });
    }
    lastestSort = field;
    
    this.setState({
      lastestSort : lastestSort
    });

    //console.log(result);
    this.setState({
      ccData : result
    })
  }

  ///v1/getTokenInfo/:account/:contractAddress/:currency?
  async getTokenInfo(walletAdress, contractAddress, currency) {
    //console.log("getTokenInfo",walletAdress, contractAddress, currency);
    let response = await axios.get('http://127.0.0.1:5000/v1/getTokenInfo/' + walletAdress + '/' + contractAddress + '/eur');
    if(response.data && response.data.tokenList && response.data.tokenList.tokenList){
      let newToken = response.data.tokenList.tokenList[0];
      console.log(newToken);
      let rawData = this.state.rawData;
      let ind = rawData.findIndex(t => (t.contractAddress === contractAddress));
      if(ind > -1){
        let token = rawData[ind];
        token.balance = newToken.balance;
        token.txList = newToken.txList;
        token.lastSellPrice = newToken.lastSellPrice;
        token.gasUsed = newToken.gasUsed;
        token.averagePrice = newToken.averagePrice;

        let tpToken = await this.loadToken([token], true);
        rawData[ind] = tpToken[0];
        console.log(rawData[ind]);
        this.saveRawData(rawData);

      }else{
        console.log("token not found ?!")
      }
    }
    return 1;
  }

  saveRawData(rawData){
    this.setState({
      rawData : rawData
    });
    localStorage.setItem("rawData",JSON.stringify(rawData));
  }
  

  static contextTypes = {
    web3: PropTypes.object
  };

  constructor(props) {
    super(props)
    this.state = {
      ccData: [],
      rawData: [],
      portfolioTokenList: [],
      ccGlobalMcap: '',
      loading: true,
      totalValue: 0,
      walletAdress: walletAdress,
      portfolio: portfolio,
      selectedPortfolio: selectedPortfolio,
      lastestSort: lastestSort,
      //Ytansactions Modal
      data: []

    }
    //const web3Context = context.web3;
    //console.log(web3Context);
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow text-monospace text-white">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="http://www.google.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            Crypt0li0
          </a>
                   

          {this.state.loading ? <div id="loader" className="nav-item text-nowrap d-none d-sm-none d-sm-block">Loading...</div> :
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small>{this.state.selectedPortfolio} total: {(this.state.totalValue).toLocaleString("fr-CH")}€</small>&nbsp;
              <small>({this.state.rawData.length} tokens)</small>
            </li>
          }
          <div>
            {[SplitButton].map((DropdownType, idx) => (
              <DropdownType
                as={ButtonGroup}
                key={idx}
                id={`dropdown-button-drop-${idx}`}
                size="sm"
                variant="secondary"
                title={this.state.selectedPortfolio}
              >
                <Dropdown.Item eventKey="4">All portfolios?</Dropdown.Item>
                { this.state.portfolio.map((data, key) => {
                  return(
                    <Dropdown.Item  onClick={() => {this.selectPortfolio(data)}} eventKey={key}>{data}</Dropdown.Item>
                  )
                })}
              </DropdownType>
            ))}
          </div>

          <div>
            {[SplitButton].map((DropdownType, idx) => (
              <DropdownType
                as={ButtonGroup}
                key={idx}
                id={`dropdown-button2-drop-${idx}`}
                size="sm"
                variant="secondary"
                title="Options"
              >
                <Dropdown.Item eventKey="1" onClick={() => {this.loadToken(this.state.rawData,true)}}>Refresh Price</Dropdown.Item>
                <Dropdown.Item eventKey="2" onClick={() => {this.hardRefresh()}}>Reload all</Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item eventKey="4">All wallets</Dropdown.Item>
                { this.state.walletAdress.map((data, key) => {
                  return(
                    <Dropdown.Item eventKey={key} onClick={() => {this.getData2(data,true)}}>Reload {data}</Dropdown.Item>
                  )
                })}
                <Dropdown.Item eventKey="5" onClick={() => {this.hardRefresh()}}>Add wallet/account</Dropdown.Item>
              </DropdownType>
            ))}
          </div>
        </nav>
        &nbsp;
        
          <div className="container-fluid mt-5 w-40 p-3">
            <div className="row">
              <main role="main" className="col-lg-12 d-flex text-center">
                  <table className="table table-striped table-hover table-fixed table-bordered text-monospace">
                    <caption>Data Source: 
                      <a target="_blank" rel="noopener noreferrer" href="https://coingecko.com/">coingecko</a>
                    </caption>
                    <thead className="thead-dark">
                      <tr>
                        <th scope="col">24h</th>
                        <th scope="col">14d</th>
                        <th scope="col">30d</th>
                        <th scope="col" class={this.state.lastestSort === 'name' ? "table-success" : "" }><a href="/#" onClick={() => this.setSortedField('name')}>Name</a></th>
                        <th scope="col"><a href="/#" onClick={() => this.setSortedField('balance')}>Balance</a></th>
                        <th scope="col"><a href="/#" onClick={() => this.setSortedField('tokenInfo.tokenPrice.eur')}>Price</a></th>
                        <th scope="col"><a href="/#" onClick={() => this.setSortedField('totalValue')}>Value</a></th>
                        <th scope="col"><a href="/#" onClick={() => this.setSortedField('costPrice')}>Cost</a></th>
                        <th scope="col"><a href="/#" onClick={() => this.setSortedField('roi')}>ROI</a></th>
                        <th scope="col"><a href="/#" onClick={() => this.setSortedField('roiPercent')}>ROI%</a></th>
                        <th scope="col"><a href="/#" onClick={() => this.setSortedField('averagePrice')}>AVG Cost</a></th>
                        <th scope="col"><a href="/#" onClick={() => this.setSortedField('tokenInfo.tokenMarketCap.eur')}>MCap</a></th>
                        <th scope="col">TP</th>
                        <th scope="col"></th>
                      </tr>
                    </thead>
                      <tbody>
                        { this.state.ccData.map((data, key) => {
                          //console.log(data);
                          return(
                              <tr key={key}>
                              <td class={data.tokenInfo && data.tokenInfo.price_change_percentage_24h > 0 ? "table-success" : "table-danger"}>
                                {data.tokenInfo.price_change_percentage_24h.toFixed(1)}%
                              </td>
                              <td class={data.tokenInfo && data.tokenInfo.price_change_percentage_14d > 0 ? "table-success" : "table-danger"}>
                                {data.tokenInfo.price_change_percentage_14d.toFixed(1)}%
                              </td>
                              <td class={data.tokenInfo && data.tokenInfo.price_change_percentage_30d > 0 ? "table-success" : "table-danger"}>
                                {data.tokenInfo.price_change_percentage_30d.toFixed(1)}%
                              </td>
                              <td class={data.averagePrice === 0 ? "table-dark" : "" }>
                                <img src={(data.tokenInfo !== undefined && data.tokenInfo.tokenImage !== undefined && data.tokenInfo.tokenImage.thumb !== undefined) && data.tokenInfo.tokenImage.thumb} width="25" height="25" className="d-inline-block align-top" alt="" />
                                &nbsp;<a target="_blank" rel="noopener noreferrer" href={"https://www.coingecko.com/en/coins/" + data.tokenInfo.id}>{data.name}</a>
                              </td>
                              <td>{(data.balance).toFixed(2)}</td>
                              <td>{(data.tokenInfo !== undefined && data.tokenInfo.tokenPrice !== undefined && eval("data.tokenInfo.tokenPrice.eur") !== undefined) && eval("data.tokenInfo.tokenPrice.eur").toLocaleString(undefined, {maximumFractionDigits:3})}€</td>
                              <td>{(data.totalValue).toFixed(2)}€</td>
                              <td>{(data.costPrice).toFixed(2)}€</td>
                              <td class={data.roi > 0 ? "table-success" : "table-danger"}>{(data.roi).toFixed(2)}€</td>
                              <td class={data.roi > 0 ? "table-success" : "table-danger"}>{(data.roiPercent).toFixed(2)}%</td>
                              <td>{data.averagePrice.toFixed(4)}€</td>
                              <td>{(data.tokenInfo !== undefined && data.tokenInfo.tokenMarketCap !== undefined && eval("data.tokenInfo.tokenMarketCap.eur") !== undefined) && eval("data.tokenInfo.tokenMarketCap.eur").toLocaleString(undefined, {maximumFractionDigits:3})}€</td>
                              <td>
                                    <a title="If green, you reach 50% ROI" class={data.roi > 50 ? "badge badge-success" : "badge badge-danger"} href={"https://app.uniswap.org/#/swap?exactField=input&exactAmount=" + (data.balance/2).toFixed(2) + "&inputCurrency=" + data.contractAddress}>TP50</a>&nbsp;<a title="If green, you reach 100% ROI" class={data.roi > 100 ? "badge badge-success" : "badge badge-danger"} href={"https://app.uniswap.org/#/swap?exactField=input&exactAmount=" + (data.balance/2).toFixed(2) + "&inputCurrency=" + data.contractAddress}>TP100</a>
                              </td>
                              <td > 
                               <div>
                                  {[SplitButton].map((DropdownType, idx) => (
                                    <DropdownType
                                      as={ButtonGroup}
                                      key={idx}
                                      id={`dropdown-button-drop-${idx}`}
                                      size="sm"
                                      variant="secondary"
                                      title="A?"
                                    >
                                      <Dropdown.Item eventKey="0">Wallet: {data.account}</Dropdown.Item>
                                      <Dropdown.Item eventKey="0" onClick={() => {this.getTokenInfo(data.account,data.contractAddress,'eur')}}>Refresh data of {data.name}</Dropdown.Item>
                                      <Dropdown.Item eventKey="0" onClick={() => {this.handleShow(data.txList)}}>See tx</Dropdown.Item>

                                      <Dropdown.Divider />
                                      <Dropdown.Item eventKey="0">Move to wallet</Dropdown.Item>
                                      { this.state.portfolio.map((dataP, keyP) => {
                                        return(
                                          <Dropdown.Item onClick={() => {this.moveToPortfolio(dataP,data.name)}} eventKey={keyP}>{dataP}</Dropdown.Item>
                                        )
                                      })}
                                    </DropdownType>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                  </table>
                  
              </main>
            </div>
          </div>
          <div>

            <MyModalComponent
              show={this.state.show}
              title={this.state.title}
              body={this.state.body}
              data={this.state.data}
              onClick={this.handleClose}
              onHide={this.handleClose} />

          </div>
      </div>
      
    );
  }
}



export default App;
