// src/components/bootstrap-carousel.component.js
import React, { Component } from "react";

import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

class MyModalComponent extends Component {

    render() {

        return (
            <div>
                <Modal size="lg" show={this.props.show} onHide={() => this.props.onHide({ msg: 'Cross Icon Clicked!' })}>

                    <Modal.Header closeButton>
                        <Modal.Title>
                            {this.props.title}
                        </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        {/* {this.props.data} */}

                        <ul>
                            {this.props.data.map(item => (
                                <li >ethTokenPrice: {item.ethTokenPrice.toFixed(2)} |
                                    timeStamp : {new Intl.DateTimeFormat('fr-FR', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit'}).format((item.timeStamp * 1000))} |
                                    tokenPrice: {item.tokenPrice.toFixed(2)} |
                                    value: {item.value} |
                                    <a href={"https://etherscan.io/tx/" + item.ethTokenPrice}>etherscan</a> 
                                </li>
                                
                                
//                                 blockHash: "0x7042550297ac62b2987d3699c67c87229bb230ad0c7728792ca97f944d8858c7"
// blockNumber: "11108034"
// confirmations: "111818"
// contractAddress: "0xb4efd85c19999d84251304bda99e90b92300bd93"
// currency: "eur"
// ethTokenPrice: 354.2407969481744
// from: "0x1e955aa345db4af2c9f2187283693fff4fb541f3"
// gas: "167820"
// gasPrice: "24000000000"
// gasPriced: 1.082123450811781
// gasUsed: "127282"
// hash: "0x6e7a7d9feaa692aee8c7f7edf3169f1fc5b0fde8531709bb16af38deca5603ec"
// input: "deprecated"
// nonce: "30"
// timeStamp: "1603396110"
// to: "0x70ea56e46266f0137bac6b75710e3546f47c855d"
// tokenDecimal: "18"
// tokenName: "Rocket Pool"
// tokenPrice: 3.296051574526894
// tokenSymbol: "RPL"
// transactionIndex: "74"
// value: "15000000000000000000"
                            ))}

                        </ul>

                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => this.props.onClick({ msg: 'Modal Closed!' })} >Close</Button>
                        <Button variant="primary" onClick={() => this.props.onClick({ msg: 'Modal Submitted!' })}  >Submit</Button>
                    </Modal.Footer>

                </Modal>
            </div>
        )
    };
}

export default MyModalComponent;