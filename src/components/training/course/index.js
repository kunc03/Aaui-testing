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
import moment from 'moment-timezone';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';

class Course extends Component {
  constructor(props) {
    super(props);
    this.state = {
      companyId: '',
      data : [],
      filter:'',
      modalDelete: false,
      deleteId: '',
      modalActivate: false,
      activateId: '',
      dataState: false,
      isLoading: false
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
    API.delete(`${API_SERVER}v2/training/course/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error delete course')
        }
        else{
          this.getUserData();
          this.closeModalDelete();
          toast.success('Course deleted');
        }
    })
  }

  activate (id){
    API.put(`${API_SERVER}v2/training/course-activate/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error activate course')
        }
        else{
          this.closeModalActivate();
          this.getCourseListArchived(this.state.companyId);
          toast.success('Course activated');
        }
    })
  }
  
  filter = (e) => {
    e.preventDefault();
    this.setState({ filter: e.target.value });
  }

  getCourseListArchived(companyId){
    this.setState({isLoading: true, dataState:false});
    API.get(`${API_SERVER}v2/training/course-list-admin-archived/${companyId}`).then(res => {
        if (res.data.error){
            toast.error('Error read course list')
            this.setState({isLoading: false});
        }
        else{
            this.setState({data: res.data.result, isLoading: false})
        }
    })
  }

  getCourseList(companyId){
    this.setState({isLoading: true, dataState:true});
    API.get(`${API_SERVER}v2/training/course-list-admin/${companyId}`).then(res => {
        if (res.data.error){
            toast.error('Error read course list')
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
          this.getCourseList(this.state.companyId);
        }
    })
  }

  componentDidMount(){
    this.getUserData()
  }

  render() {
    const columns = [
      {
        name: 'Thumbnail',
        selector: 'image',
        sortable: true,
        cell: row => <img height="26px" alt={row.name} src={row.image ? row.image : 'assets/images/no-image.png'} />
      },
      {
        cell: row => <Link to={'/training/course/edit/'+row.id}>{row.title}</Link>,
        name: 'Title',
        sortable: true,
        grow: 2,
      },
      {
        cell: row => moment(row.created_at).local().format("DD-MM-YYYY HH:mm"),
        name: 'Publish Date',
        selector: 'created_at',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Total Session',
        selector: 'session_count',
        sortable: true,
        style: {
          color: 'rgba(0,0,0,.54)',
        },
      },
      {
        name: 'Total Time (Minutes)',
        selector: 'total_session_time',
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
                case 1 : this.props.history.push('/training/course/edit/' + row.id);break;
                case 2 : this.onClickHapus(row.id);break;
                case 3 : this.onClickActivate(row.id);break;
                default : this.props.goTo('/training/course');break;
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
                                        <TabMenu title='Training' selected='Course'/>
                                        <div>
                                            <LoadingOverlay
                                              active={this.state.isLoading}
                                              spinner={<BeatLoader size='30' color='#008ae6' />}
                                            >
                                            <div className="card p-20 main-tab-container">
                                                <div className="row">
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Course List</strong>
                                                        <Link
                                                        to={`/training/course/create`}>
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
                                                        <div class={`text-menu ${!this.state.dataState && 'active'}`} style={{clear:'both'}} onClick={this.getCourseListArchived.bind(this, this.state.companyId)}>Deleted</div>
                                                        <div class={`text-menu ${this.state.dataState && 'active'}`} onClick={this.getCourseList.bind(this, this.state.companyId)}>Active</div>
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
              <div>Are you sure want to delete this course ?</div>
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
              <div>Are you sure want to activate this course ?</div>
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

export default Course;
