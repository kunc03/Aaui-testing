import React, { Component } from "react";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import DataTable from 'react-data-table-component';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import Dropdown, {
  MenuItem,
} from '@trendmicro/react-dropdown';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Modal } from 'react-bootstrap';

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
        companyId:'',
        data : [],
        filter:'',
        modalDelete:'',
        deleteId:'',
        level:''
    };
    this.goBack = this.goBack.bind(this);
  }
  
  closeModalDelete = e => {
    this.setState({ modalDelete: false, deleteId: '' })
  }
  
  onClickHapus(id){
    this.setState({modalDelete: true, deleteId: id})
  }

  delete (id){
    API.delete(`${API_SERVER}v2/training/user/${id}`).then(res => {
        if (res.data.error){
            toast.error(`Error delete ${this.state.level}`)
        }
        else{
          this.getUserData();
          this.closeModalDelete();
          toast.warning(`${this.state.level} deleted`);
        }
    })
  }

  goBack() {
    this.props.history.goBack();
  }
  
  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }

  getUserData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
          this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
          if (this.props.trainingCompany){
            this.getUserTrainingCompany(this.props.trainingCompany)
          }
          else{
            this.getUser(this.state.companyId)
          }
        }
    })
  }

  getUser(id){
    API.get(`${API_SERVER}v2/training/user/${this.state.level}/${id}`).then(res => {
        if (res.data.error){
            toast.error(`Error read ${this.state.level}`)
        }
        else{
            this.setState({data: res.data.result})
        }
    })
  }

  getUserTrainingCompany(id){
    API.get(`${API_SERVER}v2/training/user/training-company/${this.state.level}/${id}`).then(res => {
        if (res.data.error){
            toast.error(`Error read ${this.state.level}`)
        }
        else{
            this.setState({data: res.data.result})
        }
    })
  }

  componentDidMount(){
    this.getUserData();
    this.setState({level: this.props.level ? this.props.level : 'user'})
  }

  render() {
    const columns = [
      {
        name: 'Image',
        selector: 'image',
        sortable: true,
        cell: row => <img height="36px" alt={row.name} src={row.image ? row.image : 'assets/images/no-profile-picture.jpg'} />
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        grow: 2,
      },
      {
        name: 'Company',
        selector: 'company',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
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
              case 1 : this.props.goTo('/training/user/detail/'+row.id);break;
              case 2 : this.props.goTo('/training/user/edit/'+row.id);break;
              case 3 : this.onClickHapus(row.id);break;
              default : this.props.goTo('/training/user');break;
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
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>{this.state.level === 'admin' ? 'Admins' : 'Users'}</strong>
                                                        <Link
                                                        to={`/training/user/create/${this.state.level}/${this.props.trainingCompany ? this.props.trainingCompany : '0'}`}>
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
          <Modal show={this.state.modalDelete} onHide={this.closeModalDelete} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Confirmation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>Are you sure want to delete this {this.state.level} ?</div>
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

export default User;
