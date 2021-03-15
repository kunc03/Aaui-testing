import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import { toast } from "react-toastify";
import { Modal } from 'react-bootstrap';
import Storage from '../../../repository/storage';

class Allocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
        userId: '',
        companyId: '',
        data : [],
        dataLicenses : [],
        filter:'',
        filterHistroy:'',
        licensesId: '',
        licensesTypeId: '',
        modalAllocation: false,
        amount: '',
        mode: ''
    };
  }
  
  closeModalAllocation = e => {
    this.setState({ modalAllocation: false, amount: '', licensesId: '', mode: '' })
  }

  handleChange = e => {
      let {name, value} = e.target;
      this.setState({[name]: value})
  }

  
  save(){
    if (this.state.amount === '' || this.state.amount === '0'){
        toast.warning('Please fill amount')
    }
    else{
          let form = {
              training_company_id: this.props.trainingCompany,
              licenses_type_id: this.state.licensesTypeId,
              licenses_allocation_id: this.state.licensesId,
              amount : this.state.amount,
              type : this.state.mode,
              created_by : this.state.userId,
          }
          API.post(`${API_SERVER}v2/training/licenses-allocation-transaction`, form).then(res => {
              if (res.data.error){
                  toast.error(`Error add licenses allocation`)
              }
              else{
                  toast.success(`Success for licenses allocation ${this.state.mode}`)
                  this.closeModalAllocation();
                  this.getAllocation();
                  this.getHistory();
              }
          })
    }
  }

  getUserData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
            this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id, userId: res.data.result.user_id });
            this.getAllocation();
            this.getHistory();
        }
    })
  }

  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }

  filterHistroy = (e) => {
    e.preventDefault();
    this.setState({ filterHistory: e.target.value });
  }

  getAllocation(){
    API.get(`${API_SERVER}v2/training/licenses-allocation/${this.props.trainingCompany}`).then(res => {
        if (res.data.error){
            toast.error(`Error read licenses allocation`)
        }
        else{
            this.setState({dataLicenses: res.data.result})
        }
    })
  }

  getHistory(){
    API.get(`${API_SERVER}v2/training/licenses-allocation-transaction-history/${this.props.trainingCompany}`).then(res => {
        if (res.data.error){
            toast.error(`Error read licenses allocation`)
        }
        else{
            this.setState({data: res.data.result})
        }
    })
  }

  componentDidMount(){
      this.getUserData();
  }


  render() {
    const columns = [
      {
        name: 'Time',
        selector: 'created_at',
        sortable: true
      },
      {
        name: 'Amount',
        selector: 'amount',
        sortable: true
      },
      {
        name: 'Licenses Type',
        selector: 'type',
        sortable: true
      },
      {
        name: 'Created By',
        selector: 'created_by',
        sortable: true
      },
    ];
    const columnsLicenses = [
      {
        name: 'Type',
        selector: 'type',
        sortable: true,
        grow: 2
      },
      {
        name: 'Remaining Allocation',
        selector: 'remaining_allocation',
        sortable: true
      },
      {
        name: 'Action',
        cell: row =>
        <div>
            <button onClick={()=> this.setState({modalAllocation: true, licensesId: row.id, licensesTypeId: row.licenses_type_id, mode: 'addition'})} className="button-table-plus">+</button>
            <button onClick={()=> this.setState({modalAllocation: true, licensesId: row.id, licensesTypeId: row.licenses_type_id, mode: 'reduction'})} className="button-table-min">-</button>
        </div>
      }
    ];
    let {data, dataLicenses, filter, filterHistory} = this.state;
    if (filter != "") {
        dataLicenses = dataLicenses.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filter, "gmi"))
      )
    }
    if (filterHistory != "") {
      data = data.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filter, "gmi"))
      )
    }
    return(
        <div>
            <div className="card p-20 main-tab-container">
                <div className="row">
                    <div className="col-sm-12 m-b-20">
                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Licenses</strong>
                        <input
                            type="text"
                            placeholder="Search"
                            onChange={this.filter}
                            className="form-control float-right col-sm-3"/>
                            <DataTable
                            columns={columnsLicenses}
                            data={dataLicenses}
                            highlightOnHover
                            defaultSortField="type"
                            pagination
                            fixedHeader
                            />
                    </div>
                </div>
            </div>
            <div className="card p-20 main-tab-container">
                <div className="row">
                    <div className="col-sm-12 m-b-20">
                        <strong className="f-w-bold f-18" style={{color:'#000'}}>License Allocation History</strong>
                        <input
                            type="text"
                            placeholder="Search"
                            onChange={this.filterHistory}
                            className="form-control float-right col-sm-3"/>
                            <DataTable
                            columns={columns}
                            data={data}
                            highlightOnHover
                            pagination
                            fixedHeader
                            />
                    </div>
                </div>
            </div>
          <Modal show={this.state.modalAllocation} onHide={this.closeModalAllocation} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                {this.state.mode === 'addition' ? 'Add' : 'Reduce'} Licenses Allocation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-field-top-label">
                    <label for="amount">Amount of {this.state.mode === 'addition' ? 'Addition' : 'Reduction'}<required>*</required></label>
                    <input type="number" name="amount" size="50" id="amount" placeholder="0" value={this.state.amount} onChange={this.handleChange}/>
                </div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalAllocation.bind(this)}>
                Cancel
              </button>
              <button className="btn btn-icademy-primary" onClick={this.save.bind(this)}>
                <i className={`fa fa-${this.state.mode === 'addition' ? 'plus' : 'minus'}`}></i> {this.state.mode === 'addition' ? 'Add' : 'Reduce'}
              </button>
            </Modal.Footer>
          </Modal>
        </div>
    )
  }
}

export default Allocation;
