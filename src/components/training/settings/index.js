import React, { Component } from "react";
import TabMenu from '../../tab_menu/route';
import DataTable from 'react-data-table-component';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import Dropdown, {
  MenuItem,
} from '@trendmicro/react-dropdown';
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { toast } from "react-toastify";
import { Modal } from 'react-bootstrap';
import Quota from '../quota/detail'

class SettingsTraining extends Component {
  constructor(props) {
    super(props);
    this.state = {
        userId: '',
        companyId: '',
        data: [],
        modalCreate: false,
        modalDelete: false,
        typeName: '',
        typeId:''
    };
  }

  closeModalCreate = e => {
    this.setState({ modalCreate: false, typeName: '', typeId: '' })
  }
  closeModalDelete = e => {
    this.setState({ modalDelete: false, typeId: '' })
  }

  goTo(url) {
    if (url === 'back'){
      this.props.history.goBack();
    }
    else{
      this.props.history.push(url);
    }
  }

  handleChange = e => {
      let {name, value} = e.target;
      this.setState({[name]: value})
  }

  save(){
      if (this.state.typeName === ''){
          toast.warning('Please fill License Type Name')
      }
      else{
          if (this.state.typeId === ''){
            let form = {
                company_id: this.state.companyId,
                name : this.state.typeName
            }
            API.post(`${API_SERVER}v2/training/settings/licenses-type`, form).then(res => {
                if (res.data.error){
                    toast.error(`Error create licenses type`)
                }
                else{
                    toast.success(`New licenses type created`)
                    this.closeModalCreate();
                    this.getLicensesType(this.state.companyId)
                }
            })
          }
          else{
            let form = {
                id: this.state.typeId,
                name : this.state.typeName
            }
            API.put(`${API_SERVER}v2/training/settings/licenses-type`, form).then(res => {
                if (res.data.error){
                    toast.error(`Error edit licenses type`)
                }
                else{
                    toast.success(`Licenses type edited`)
                    this.closeModalCreate();
                    this.getLicensesType(this.state.companyId)
                }
            })
          }
      }
  }
  
  delete(id){
          API.delete(`${API_SERVER}v2/training/settings/licenses-type/${id}`).then(res => {
              if (res.data.error){
                  toast.error(`Error delete licenses type`)
              }
              else{
                  toast.success(`Licenses type deleted`)
                  this.closeModalDelete();
                  this.getLicensesType(this.state.companyId)
              }
          })
}

  getUserData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
            this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id, userId: res.data.result.user_id });
            this.getLicensesType(this.state.companyId)
        }
    })
  }

  getLicensesType(company_id){
    API.get(`${API_SERVER}v2/training/settings/licenses-type/${company_id}`).then(res => {
        if (res.data.error){
            toast.error(`Error read licenses type`)
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
        name: 'Name',
        selector: 'name',
        sortable: true
      },
      {
        cell: row =>
          <Dropdown
            pullRight
            onSelect={(eventKey) => {
              switch (eventKey){
                case 1 : this.setState({modalCreate: true, typeId: row.id, typeName: row.name});break;
                default : this.setState({modalDelete: true, typeId: row.id});break;
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
              <MenuItem eventKey={1} data-id={row.id}><i className="fa fa-edit" /> Edit</MenuItem>
              <MenuItem eventKey={2} data-id={row.id}><i className="fa fa-trash" /> Delete</MenuItem>
            </Dropdown.Menu>
          </Dropdown>,
        allowOverflow: true,
        button: true,
        width: '56px',
      }
    ];
    let {data} = this.state;
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
                                    onClick={this.goTo.bind(this, 'back')}
                                    ></img>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <TabMenu title='Training' selected='Settings'/>
                                        <div className="card p-20 main-tab-container">
                                            <div className="row">
                                                <div className="col-sm-12 m-b-20">
                                                    <strong className="f-w-bold f-18" style={{color:'#000'}}>Licenses Type</strong>
                                                        <button
                                                        onClick={()=> this.setState({modalCreate: true})}
                                                        className="btn btn-icademy-primary float-right"
                                                        style={{ padding: "7px 8px !important", marginLeft: 14 }}>
                                                            <i className="fa fa-plus"></i>
                                                            Create New
                                                        </button>
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
                                                            noDataComponent="There are no licenses type. Please create the licenses type."
                                                        />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {
                                  this.state.companyId &&
                                  <Quota id={this.state.companyId} lockEdit={true}/>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
          <Modal show={this.state.modalCreate} onHide={this.closeModalCreate} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Create New Licenses Type
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-field-top-label">
                    <label for="typeName">Licenses Type Name<required>*</required></label>
                    <input type="text" name="typeName" size="50" id="typeName" placeholder="Example : Main Exam" value={this.state.typeName} onChange={this.handleChange}/>
                </div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalCreate.bind(this)}>
                Cancel
              </button>
              <button className="btn btn-icademy-primary" onClick={this.save.bind(this)}>
                <i className="fa fa-save"></i> Save
              </button>
            </Modal.Footer>
          </Modal>
          <Modal show={this.state.modalDelete} onHide={this.closeModalDelete} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Confirmation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>Are you sure want to delete this licenses type ?</div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalDelete.bind(this)}>
                Cancel
              </button>
              <button className="btn btn-icademy-primary btn-icademy-red" onClick={this.delete.bind(this, this.state.typeId)}>
                <i className="fa fa-trash"></i> Delete
              </button>
            </Modal.Footer>
          </Modal>
        </div>
    )
  }
}

export default SettingsTraining;
