import axios from 'axios';

const ACCOUNT_API_BASE_URL = "http://localhost:5000";
//const ACCOUNT_API_BASE_URL = "http://localhost:5000/api/v1/account";
//getEthAccount/0x840647CB127112d0eDB9E6c3ce8E0c083b99516a/eur
class AccountService {

    getEmployees(){
        return axios.get(ACCOUNT_API_BASE_URL);
    }

    createEmployee(employee){
        return axios.post(ACCOUNT_API_BASE_URL, employee);
    }

    getEmployeeById(employeeId){
        return axios.get(ACCOUNT_API_BASE_URL + '/' + employeeId);
    }

    getEthAccount(ethAddress,currency){
        return axios.get(ACCOUNT_API_BASE_URL + '/getEthAccount/'+ ethAddress + '/' + currency);
    }

    updateEmployee(employee, employeeId){
        return axios.put(ACCOUNT_API_BASE_URL + '/' + employeeId, employee);
    }

    deleteEmployee(employeeId){
        return axios.delete(ACCOUNT_API_BASE_URL + '/' + employeeId);
    }
}

export default new AccountService()