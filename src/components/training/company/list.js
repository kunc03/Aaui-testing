import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import Dropdown, {
  MenuItem,
} from '@trendmicro/react-dropdown';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { Modal } from 'react-bootstrap';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';

class Company extends Component {
  constructor(props) {
    super(props);
    this.state = {
        userId: '',
        companyId: '',
        data : [],
        filter:'',
        modalDelete: false,
        deleteId: '',
        file:'',
        isUploading: false,
        isLoading: false
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
          toast.success('Company deleted');
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
          this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id, userId: res.data.result.user_id });
          this.getCompany(this.state.companyId)
        }
    })
  }

  getCompany(id){
    this.setState({isLoading: true});
    API.get(`${API_SERVER}v2/training/company/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error read company');
            this.setState({isLoading: false});
        }
        else{
            this.setState({data: res.data.result, isLoading: false})
        }
    })
  }

  componentDidMount(){
    this.getUserData();
  }

  handleChangeFile = e => {
    this.setState({
      file: e.target.files[0]
    });
  }

  uploadData = e => {
    e.preventDefault();
    if (!this.state.file){
      toast.warning('Choose the file first')
    }
    else{
      this.setState({isUploading: true})
      let form = new FormData();
      form.append('company_id', this.state.companyId);
      form.append('created_by', this.state.userId);
      form.append('file', this.state.file)
      API.post(`${API_SERVER}v2/training/company/import`, form).then((res) => {
        if (res.status === 200) {
          if (res.data.error) {
            toast.error('Data import failed')
            this.setState({ isUploading: false, file: '' });
          }
          else{
            this.getCompany(this.state.companyId)
            toast.success('Data import success')
            this.setState({ isUploading: false, file: '' });
          }
        }
      })
    }
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
        cell: row => <Link to={'/training/company/detail/'+row.id}>{row.name}</Link>,
        name: 'Company Name',
        sortable: true,
        grow: 2,
      },
      // {
      //   name: 'Registration Number',
      //   selector: 'id',
      //   sortable: true,
      //   style: {
      //     color: 'rgba(0,0,0,.54)',
      //   },
      // },
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
      // {
      //   name: 'Status',
      //   selector: 'status',
      //   sortable: true,
      //   style: {
      //     color: 'rgba(0,0,0,.54)',
      //   },
      // },
      {
        cell: row =>
          <Dropdown
            pullRight
            onSelect={(eventKey) => {
              switch (eventKey){
                case 1 : this.props.goTo('/training/company/detail/'+row.id);break;
                case 2 : this.props.goTo('/training/company/edit/'+row.id);break;
                case 3 : this.onClickHapus(row.id);break;
                default : this.props.goTo('/training');break;
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
        <div>
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Import Company</strong>
                                                    </div>
                                                    <div className="col-sm-12 m-b-20">
                                                        <a href={`${API_SERVER}template-excel/template-import-training-company.xlsx`}>
                                                          <button className="button-bordered">
                                                              <i
                                                                  className="fa fa-download"
                                                                  style={{ fontSize: 14, marginRight: 10, color: '#0091FF' }}
                                                              />
                                                              Download Template
                                                          </button>
                                                        </a>
                                                    </div>
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-13" style={{color:'#000'}}>Select a file</strong>
                                                    </div>
                                                    <form className="col-sm-12 form-field-top-label" onSubmit={this.uploadData}>
                                                        <label for="file-import" style={{cursor:'pointer', overflow:'hidden'}}>
                                                          <div className="button-bordered-grey">
                                                              {this.state.file ? this.state.file.name : 'Choose'}
                                                          </div>
                                                        </label>
                                                        <input type="file" id="file-import" name="file-import" onChange={this.handleChangeFile} />
                                                        <button type="submit" className="button-gradient-blue" style={{marginLeft:20}}>
                                                            <i
                                                                className="fa fa-upload"
                                                                style={{ fontSize: 12, marginRight: 10, color: '#FFFFFF' }}
                                                            />
                                                            {this.state.isUploading ? 'Uploading...' : 'Upload File'}
                                                        </button>
                                                    </form>
                                                </div>
                                            </div>
                                            <LoadingOverlay
                                              active={this.state.isLoading}
                                              spinner={<BeatLoader size='30' color='#008ae6' />}
                                            >
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
                                          </LoadingOverlay>
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
