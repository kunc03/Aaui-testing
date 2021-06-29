import React, { Component } from "react";
import DataTable from 'react-data-table-component';
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import Dropdown, {
  MenuItem,
} from '@trendmicro/react-dropdown';
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import TabMenu from '../../tab_menu/route';
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import Moment from 'moment-timezone';
import DatePicker from "react-datepicker";
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import { Modal } from 'react-bootstrap';

class Membership extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data : [],
        filter:'',
        training_company_id: '',
        start: null,
        end: null,
        range1: false,
        range2: false,
        isLoading: false,
        modalDelete: false,
        deleteId: '',
        modalActivate: false,
        activateId: '',
        dataState: false
    };
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    this.props.history.goBack();
  }
  
  closeModalDelete = e => {
    this.setState({ modalDelete: false, deleteId: '' })
  }
  closeModalActivate = e => {
    this.setState({ modalActivate: false, activateId: '' })
  }
  onClickHapus(id){
    this.setState({modalDelete: true, deleteId: id})
  }
  onClickActivate(id){
    this.setState({modalActivate: true, activateId: id})
  }
  delete (id){
    API.delete(`${API_SERVER}v2/training/membership/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error delete membership')
        }
        else{
          this.getData(this.state.companyId, true);
          this.closeModalDelete();
          toast.success('Membership deleted');
        }
    })
  }

  activate (id){
    API.put(`${API_SERVER}v2/training/membership-activate/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error activate membership')
        }
        else{
          this.closeModalActivate();
          this.getData(this.state.companyId, false);
          toast.success('Membership activated');
        }
    })
  }

  handleChangeFilter = (name, e) => {
    this.setState({[name]: e}, () => {
        console.log(null)
    })
  }
  changeFilterRange (range){
    if (range === 'range1'){
      this.setState({range1: !this.state.range1, range2: false, start: new Date(), end: new Date(new Date().setMonth(new Date().getMonth()+1))})
    }
    else if (range === 'range2'){
      this.setState({range2: !this.state.range2, range1: false, start: new Date(), end: new Date(new Date().setMonth(new Date().getMonth()+3))})
    }
  }

  getData(companyId, state){
    let level = Storage.get('user').data.level;
    let grupName = Storage.get('user').data.grup_name;
    let sql = '';
    this.setState({isLoading: true, dataState:state});
    if (level.toLowerCase() === 'client' && grupName.toLowerCase() === 'admin training'){
      sql = `${API_SERVER}v2/training/membership-training/${this.state.training_company_id}/${state ? 'Active' : 'Inactive'}`
    }
    else{
      sql = `${API_SERVER}v2/training/membership-company/${companyId}/${state ? 'Active' : 'Inactive'}`
    }
    API.get(sql).then(res => {
        if (res.data.error){
            toast.error('Error read membership list')
            this.setState({isLoading: false});
        }
        else{
            this.setState({data: res.data.result, isLoading: false})
        }
    })
  }

  getUserData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
          this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id, userId: res.data.result.user_id });
          
          if (level.toLowerCase() === 'client' && grupName.toLowerCase() === 'admin training'){
            API.get(`${API_SERVER}v2/training/user/read/user/${Storage.get('user').data.user_id}`).then(res => {
              if (res.status === 200) {
                this.setState({ training_company_id: res.data.result.training_company_id },()=>{
                  this.getData(this.state.companyId, true)
                })
              }
            })
          }
          else{
            this.getData(this.state.companyId, true)
          }
        }
    })
    let level = Storage.get('user').data.level;
    let grupName = Storage.get('user').data.grup_name;
  }

  componentDidMount(){
    this.getUserData()
  }
  
  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }

  render() {
    const columns = [
      {
        name: 'Member Card',
        selector: 'license_card',
        sortable: true,
        cell: row => <a href={row.license_card} target="_blank"><img height="36px" alt='License Card' src={row.license_card ? row.license_card : 'assets/images/no-image.png'} /></a>,
        cellExport: row => row.license_card
      },
      {
        cell: row => <Link to={'/training/membership/edit/'+row.id}>{row.license_number}</Link>,
        name: 'License Number',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
        cellExport: row => row.license_number,
        minWidth: '224px'
      },
      {
        name: 'Name',
        selector: 'name',
        sortable: true,
        grow: 2,
      },
      {
        name: 'Passed',
        selector: 'passed',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
        maxWidth: '180px'
      },
      {
        name: 'Company',
        selector: 'company_name',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        cell: row => Moment.tz(row.expired, 'Asia/Jakarta').format("DD-MM-YYYY"),
        name: 'Expired Date',
        selector: 'expired',
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
              if (eventKey === 1) {
                this.props.history.push('/training/membership/edit/' + row.id);
              }
              else if (eventKey === 2){
                this.onClickHapus(row.id);
              }
              else if (eventKey === 3){
                this.onClickActivate(row.id);
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
              {this.state.dataState? <MenuItem eventKey={2} data-id={row.id}><i className="fa fa-trash" /> Delete</MenuItem> : null}
              {!this.state.dataState? <MenuItem eventKey={3} data-id={row.id}><i className="fa fa-save" /> Activate</MenuItem> : null}
            </Dropdown.Menu>
          </Dropdown>,
        allowOverflow: true,
        button: true,
        width: '56px',
        cellExport: row => ({})
      },
    ];
    const ExpanableComponent = ({data}) =>(
      <table className="expandTable">
        <tr>
          <td rowspan='6'>License Card</td>
          <td rowspan='6'>:</td>
          <td rowspan='6'><a href={data.license_card} target="_blank"><img height="100px" alt={data.license_number} src={data.license_card ? data.license_card : 'assets/images/no-image.png'} /></a></td>
        </tr>
        <tr>
          <td>License Number</td>
          <td>:</td>
          <td>{data.license_number}</td>
        </tr>
        <tr>
          <td>Expired Date</td>
          <td>:</td>
          <td>{Moment.tz(data.expired, 'Asia/Jakarta').format("DD-MM-YYYY")}</td>
        </tr>
        <tr>
          <td>Name</td>
          <td>:</td>
          <td>{data.name}</td>
        </tr>
        <tr>
          <td>Passed</td>
          <td>:</td>
          <td>{data.passed}</td>
        </tr>
        <tr>
          <td>Training Company</td>
          <td>:</td>
          <td>{data.company_name}</td>
        </tr>
      </table>
    );
    let {data, filter, start, end} = this.state;
    if (filter != "") {
      data = data.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filter, "gmi"))
      )
    }
    if (start != null && end != null) {
      data = data.filter(x => Moment.tz(x.expired, 'Asia/Jakarta') >= start && Moment.tz(x.expired, 'Asia/Jakarta') <= end)
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
                                        <TabMenu title='Training' selected='Membership'/>
                                        <div>
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Filter</strong>
                                                        <div className="form-section no-border">
                                                            <div className="row">
                                                                <div className="form-field-top-label">
                                                                    <label for="start">Expired Start Date</label>
                                                                    <DatePicker dateFormat="dd-MM-yyyy" selected={this.state.start} onChange={e => this.handleChangeFilter('start', e)} />
                                                                </div>
                                                                <div className="form-field-top-label">
                                                                    <label for="end">Expired End Date</label>
                                                                    <DatePicker dateFormat="dd-MM-yyyy" selected={this.state.end} onChange={e => this.handleChangeFilter('end', e)} />
                                                                </div>
                                                                <div className="form-field-top-label">
                                                                    <label>&nbsp;</label>
                                                                    <div className={`filter-button ${this.state.range1 && 'filter-button-selected'}`} onClick={this.changeFilterRange.bind(this, 'range1')}>Expires in a month</div>
                                                                </div>
                                                                <div className="form-field-top-label">
                                                                    <label>&nbsp;</label>
                                                                    <div className={`filter-button ${this.state.range2 && 'filter-button-selected'}`} onClick={this.changeFilterRange.bind(this, 'range2')}>Expires in 3 months</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <LoadingOverlay
                                              active={this.state.isLoading}
                                              spinner={<BeatLoader size='30' color='#008ae6' />}
                                            >
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Membership List</strong>
                                                        <div class={`text-menu ${!this.state.dataState && 'active'}`} style={{clear:'both'}} onClick={this.getData.bind(this, this.state.companyId, false)}>Deleted</div>
                                                        <div class={`text-menu ${this.state.dataState && 'active'}`} onClick={this.getData.bind(this, this.state.companyId, true)}>Active</div>
                                                        <DataTableExtensions print={false} export exportHeaders columns={columns} data={data} filterPlaceholder='Filter Data'>
                                                          <DataTable
                                                          columns={columns}
                                                          data={data}
                                                          highlightOnHover
                                                          pagination
                                                          fixedHeader
                                                          expandableRows
                                                          expandableRowsComponent={<ExpanableComponent />}
                                                          />
                                                        </DataTableExtensions>
                                                    </div>
                                                </div>
                                            </div>
                                            </LoadingOverlay>
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
              <div>Are you sure want to delete this membership ?</div>
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
          <Modal show={this.state.modalActivate} onHide={this.closeModalActivate} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Confirmation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>Are you sure want to activate this membership ?</div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalActivate.bind(this)}>
                Cancel
              </button>
              <button className="btn btn-icademy-primary" onClick={this.activate.bind(this, this.state.activateId)}>
                <i className="fa fa-trash"></i> Activate
              </button>
            </Modal.Footer>
          </Modal>
        </div>
    )
  }
}

export default Membership;
