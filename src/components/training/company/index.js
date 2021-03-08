import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import Dropdown, {
  MenuItem,
} from '@trendmicro/react-dropdown';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import TabMenu from '../../tab_menu/route';
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { Modal } from 'react-bootstrap';

class Company extends Component {
  constructor(props) {
    super(props);
    this.state = {
        companyId: '',
        data : [],
        filter:'',
        modalDelete: false,
        deleteId: ''
    };
    this.goBack = this.goBack.bind(this);
  }

  closeModalDelete = e => {
    this.setState({ modalDelete: false, deleteId: '' })
  }

  goBack() {
    this.props.history.goBack();
  }

  onClickHapus(id){
    this.setState({modalDelete: true, deleteId: id})
  }

  delete (id){
    API.delete(`${API_SERVER}v2/training/company/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error delete company')
        }
        else{
          this.getUserData();
          this.closeModalDelete();
          toast.warning('Company deleted');
        }
    })
  }
  
  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }

  getUserData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
          this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
          this.getCompany(this.state.companyId)
        }
    })
  }

  getCompany(id){
    API.get(`${API_SERVER}v2/training/company/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error read company')
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
        name: 'Logo',
        selector: 'image',
        sortable: true,
        cell: row => <img height="26px" alt={row.name} src={row.image ? row.image : 'assets/images/no-logo.jpg'} />
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        grow: 2,
      },
      {
        name: 'Registration Number',
        selector: 'id',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Website',
        selector: 'website',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Telephone',
        selector: 'telephone',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Status',
        selector: 'status',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        cell: row =>
          <Dropdown
            pullRight
            onSelect={(eventKey) => {
              switch (eventKey){
                case 1 : this.props.history.push('/training/company/detail/'+row.id);break;
                case 2 : this.props.history.push('/training/company/edit/'+row.id);break;
                case 3 : this.onClickHapus(row.id);break;
                default : this.props.history.push('/training');break;
              }
            }}
          >
            <Dropdown.Toggle
              btnStyle="flat"
              noCaret
              iconOnly
            >
              <i className="fa fa-ellipsis-h"></i>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <MenuItem eventKey={1} data-id={row.id}><i className="fa fa-edit" /> Detail</MenuItem>
              <MenuItem eventKey={2} data-id={row.id}><i className="fa fa-edit" /> Edit</MenuItem>
              <MenuItem eventKey={3} data-id={row.id}><i className="fa fa-trash" /> Delete</MenuItem>
            </Dropdown.Menu>
          </Dropdown>,
        allowOverflow: true,
        button: true,
        width: '56px',
      },
    ];
    let {data, filter} = this.state;
    if (filter != "") {
      data = data.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filter, "gmi"))
      )
    }
    return(
        <div className="pcoded-main-container">
            <div className="pcoded-wrapper">
                <div className="pcoded-content">
                    <div className="pcoded-inner-content">
                        <div className="main-body">
                            <div className="page-wrapper">
                                <div className="floating-back">
                                    <img
                                    src={`newasset/back-button.svg`}
                                    alt=""
                                    width={90}
                                    onClick={this.goBack}
                                    ></img>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <TabMenu title='Training' selected='Company'/>
                                        <div>
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Import Company</strong>
                                                    </div>
                                                    <div className="col-sm-12 m-b-20">
                                                        <button className="button-bordered">
                                                            <i
                                                                className="fa fa-download"
                                                                style={{ fontSize: 14, marginRight: 10, color: '#0091FF' }}
                                                            />
                                                            Download Template
                                                        </button>
                                                    </div>
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-13" style={{color:'#000'}}>Select a file</strong>
                                                    </div>
                                                    <div className="col-sm-12">
                                                        <button className="button-bordered-grey">
                                                            Choose
                                                        </button>
                                                        <button className="button-gradient-blue" style={{marginLeft:20}}>
                                                            <i
                                                                className="fa fa-upload"
                                                                style={{ fontSize: 12, marginRight: 10, color: '#FFFFFF' }}
                                                            />
                                                            Upload File
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Company List</strong>
                                                        <Link
                                                        to={`/training/company/create`}>
                                                            <button
                                                            className="btn btn-icademy-primary float-right"
                                                            style={{ padding: "7px 8px !important", marginLeft: 14 }}>
                                                                <i className="fa fa-plus"></i>
                                                                Create New
                                                            </button>
                                                        </Link>
                                                        <input
                                                            type="text"
                                                            placeholder="Search"
                                                            onChange={this.filter}
                                                            className="form-control float-right col-sm-3"/>
                                                        <DataTable
                                                        columns={columns}
                                                        data={data}
                                                        highlightOnHover
                                                        defaultSortField="name"
                                                        pagination
                                                        fixedHeader
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          <Modal show={this.state.modalDelete} onHide={this.closeModalDelete} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Confirmation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>Are you sure want to delete this company ?</div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalDelete.bind(this)}>
                Cancel
              </button>
              <button className="btn btn-icademy-primary btn-icademy-red" onClick={this.delete.bind(this, this.state.deleteId)}>
                <i className="fa fa-trash"></i> Delete
              </button>
            </Modal.Footer>
          </Modal>
        </div>
    )
  }
}

export default Company;
