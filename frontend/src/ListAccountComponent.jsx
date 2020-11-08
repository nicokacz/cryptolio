import React, { Component } from 'react'
import AccountService from '../services/AccountService'

class ListAccountComponent extends Component {
    constructor(props) {
        super(props)

        this.state = {
                Accounts: []
        }
        this.addAccount = this.addAccount.bind(this);
        this.editAccount = this.editAccount.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
    }

    deleteAccount(id){
        AccountService.deleteAccount(id).then( res => {
            this.setState({Accounts: this.state.Accounts.filter(Account => Account.id !== id)});
        });
    }
    viewAccount(id){
        this.props.history.push(`/view-Account/${id}`);
    }
    editAccount(id){
        this.props.history.push(`/add-Account/${id}`);
    }

    componentDidMount(){
        AccountService.getAccounts().then((res) => {
            this.setState({ Accounts: res.data});
        });
    }

    addAccount(){
        this.props.history.push('/add-Account/_add');
    }

    render() {
        return (
            <div>
                 <h2 className="text-center">Accounts List</h2>
                 <div className = "row">
                    <button className="btn btn-primary" onClick={this.addAccount}> Add Account</button>
                 </div>
                 <br></br>
                 <div className = "row">
                        <table className = "table table-striped table-bordered">

                            <thead>
                                <tr>
                                    <th> Account First Name</th>
                                    <th> Account Last Name</th>
                                    <th> Account Email Id</th>
                                    <th> Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    this.state.Accounts.map(
                                        Account => 
                                        <tr key = {Account.id}>
                                             <td> { Account.firstName} </td>   
                                             <td> {Account.lastName}</td>
                                             <td> {Account.emailId}</td>
                                             <td>
                                                 <button onClick={ () => this.editAccount(Account.id)} className="btn btn-info">Update </button>
                                                 <button style={{marginLeft: "10px"}} onClick={ () => this.deleteAccount(Account.id)} className="btn btn-danger">Delete </button>
                                                 <button style={{marginLeft: "10px"}} onClick={ () => this.viewAccount(Account.id)} className="btn btn-info">View </button>
                                             </td>
                                        </tr>
                                    )
                                }
                            </tbody>
                        </table>

                 </div>

            </div>
        )
    }
}

export default ListAccountComponent