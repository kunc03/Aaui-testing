import React, { Component } from "react";
import { Link } from "react-router-dom";
// import '../ganttChart/node_modules/@trendmicro/react-dropdown/dist/react-dropdown.css';

import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import moment from 'moment-timezone';
import { toast } from "react-toastify";
import {
  Modal
} from 'react-bootstrap';
import { withTranslation } from "react-i18next";

const LINK_ZOOM = 'https://zoom.us/j/4912503275?pwd=Ujd5QW1seVhIcmU4ZGV3bmRxUUV3UT09'

class WebinarTable extends Component {
  constructor(props) {
    super(props);

    // this._deleteUser = this._deleteUser.bind(this);

    this.state = {
      userId: Storage.get('user').data.user_id,
      users: [],
      dataUser: [],
      webinars: [],
      isLoading: [],
      deleteWebinarId: '',
      modalDelete: false,
      limitCompany: [],
      gb: [],
      companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : Storage.get('user').data.company_id,
      headerWebinars: [
        { title: 'Speaker', width: null, status: true },
        { title: 'Moderator', width: null, status: true },
        { title: 'Status', width: null, status: true },
        { title: 'Start Time', width: null, status: true },
        { title: 'Duration', width: null, status: true },
        { title: 'Participants', width: null, status: true },
        // {title : 'File Project', width: null, status: true},
      ],

      checkZoom: []
    };
  }

  fetchSyncZoom(userId) {
    API.get(`${API_SERVER}v3/zoom/user/${userId}`).then(res => {
      if (res.status === 200) {
        this.setState({ checkZoom: res.data.result })
      }
    })
  }

  checkLimitCompany(){
    API.get(`${API_SERVER}v2/company-limit/${this.state.companyId}`).then(res => {
      if (res.status === 200) {
        if (!res.data.error) {
          this.setState({limitCompany: res.data.result});
        } else {
          toast.error("Error, gagal check limit company")
        }
      }
    })
  }
  componentDidMount() {
    this.fetchData();
    this.checkLimitCompany();
    this.fetchCheckAccess(Storage.get('user').data.grup_name.toLowerCase(), Storage.get('user').data.company_id, Storage.get('user').data.level, ['CD_WEBINAR'])
    this.fetchSyncZoom(Storage.get('user').data.user_id)
  }

  fetchData() {
    this.setState({ isLoading: true })
    API.get(
      this.props.projectId ? `${API_SERVER}v2/webinar/list/${this.props.projectId}` :
      this.props.training ? `${API_SERVER}v2/webinar/list-by-training/${this.state.companyId}`
        : `${API_SERVER}v2/webinar/list-by-company/${this.state.companyId}`
    ).then(res => {
      if (res.data.error) {
        this.setState({ isLoading: false });
        // toast.warning("Error fetch API");
      }
      else {
        this.setState({ webinars: res.data.result, isLoading: false });
      }
    })
  }
  updateStatus(id, status) {
    let form = {
      id: id,
      status: status,
    };
    API.put(`${API_SERVER}v2/webinar/status`, form).then(async res => {
      if (res.data.error)
        toast.warning("Error fetch API")
      else
        toast.success('The webinar starts, please press the join button for entering ')
      this.fetchData()
    })
  }
  deleteWebinar() {
    API.delete(`${API_SERVER}v2/webinar/unpublish/${this.state.deleteWebinarId}`).then(async res => {
      if (res.data.error)
        toast.warning("Error fetch API")
      else
        toast.success('Webinar deleted')
      this.closeModalDelete()
      this.fetchData()
    })
  }
  closeModalDelete = e => {
    this.setState({ modalDelete: false, deleteWebinarId: '' })
  }
  dialogDelete(id) {
    this.setState({
      deleteWebinarId: id,
      modalDelete: true
    })
  }

  fetchCheckAccess(role, company_id, level, param) {
    API.get(`${API_SERVER}v2/global-settings/check-access`, {role, company_id, level, param}).then(res => {
      if(res.status === 200) {
        this.setState({ gb: res.data.result })
      }
    })
  }

  render() {
    const {t} = this.props
    // ** GLOBAL SETTINGS ** //

    let cdWEBINAR = this.state.gb.length && this.state.gb.filter(item => item.code === 'CD_WEBINAR')[0].status;
    const headerTabble = this.state.headerWebinars;
    const bodyTabble = this.state.webinars;
    const access_project_admin = this.props.access_project_admin;

    const StatusBadge = ({ value }) => {
      if (value == 0) {
        return (
          <span class="badge badge-pill badge-warning">Need {this.props.training ? 'live Class' : 'webinar'} data fulfillment</span>
        )
      } else if (value == 1) {
        return (
          <span class="badge badge-pill badge-primary">Not started yet</span>
        )
      } else if (value == 2) {
        return (
          <span class="badge badge-pill badge-success">On going</span>
        )
      } else if (value == 3) {
        return (
          <span class="badge badge-pill badge-secondary">Finished</span>
        )
      }
    }

    return (
      <div className="card p-20">
        <span className="mb-4">
          {
          this.props.titleColor && this.props.titleColor === 'black' ?
          <strong className="f-w-bold f-18" style={{color:'#000'}}>Live Class List</strong>
          :
          <strong className="f-w-bold f-18 fc-skyblue ">Webinar</strong>
          }


          {cdWEBINAR && access_project_admin == true && this.state.limitCompany.webinar ?
            <Link
              to={`/webinar/create/${this.props.projectId ? this.props.projectId : 0}/${this.props.training ? 'by-training' : 'default'}`}
            >
              <button
                className="btn btn-icademy-primary float-right"
                style={{ padding: "7px 8px !important", marginLeft: 14 }}
              >
                <i className="fa fa-plus"></i>

                {t('create_new')}
              </button>
            </Link>
            : null
          }
          {/* <Link
                to={`/webinar/roles/${this.props.projectId}`}
                className="btn btn-v2 btn-primary float-right mr-2"
                // onClick={()=>toast.warning('Webinar sedang dalam pembangunan')}
                >
                    <i className="fa fa-cog"></i>
                    Roles
                </Link> */}
            </span>
            {
              this.state.limitCompany.webinar === false &&
              <span>
                You cannot create a new webinar because you have reached the limit.
              </span>
            }
            <div className="table-responsive">
                <table className="table table-hover">
                <thead>
                    <tr style={{borderBottom: '1px solid #C7C7C7'}}>
                    <td>{this.props.training ? 'Live Class' : 'Webinar'} Name</td>
                    {
                        headerTabble.map((item, i) => {
                            return (
                            <td align="center" width={item.width}>{item.title}</td>
                            )
                        })
                    }
                    <td align="center"></td>
                    <td align="center">Action</td>
                    </tr>
                </thead>
                <tbody>
                  {this.state.isLoading === true &&
                        <tr>
                            <td className="fc-muted f-14 f-w-300 p-t-20" colspan='8'>Loading...</td>
                        </tr>}
                    {
                        bodyTabble.length == 0 && this.state.isLoading === false ?
                        <tr>
                            <td className="fc-muted f-14 f-w-300 p-t-20" colspan='8'>Tidak ada</td>
                        </tr>
                        :
                        bodyTabble.map((item, i) => {
                            let levelUser = Storage.get('user').data.level;
                            let jamMl = new Date(item.start_time);
                            let jamSl = new Date(item.end_time);
                            let diff = Math.abs(jamSl - jamMl);
                            let diffHour = Math.floor((diff % 86400000) / 3600000);
                            let diffMin = Math.round(((diff % 86400000) % 3600000) / 60000);
                            let durasi = item.start_time && item.end_time ? diffHour.toString().padStart(2, "0") + ':' + diffMin.toString().padStart(2, "0") : '-';
                            let owner = [];
                            if (item.owner.hasOwnProperty('name')) {
                              owner = item.owner.user_id;
                            }else{
                              owner = item.owner;
                            }
                            return (
                            <tr style={{borderBottom: '1px solid #DDDDDD'}}>
                                <td className="fc-muted f-14 f-w-300 p-t-20">
                                          <Link to={`/webinar/edit/${item.project_id}/${item.id}/${this.props.training ? 'by-training' : 'default'}`} style={{cursor:'pointer'}} type="button">
                                          {item.judul}
                                          </Link>
                                </td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.pembicara.map((x, i)=> { return(x.name + (item.pembicara.length-1 === i ? '' : ', '))})}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.moderator.map((x, i)=> { return(x.name + (item.moderator.length-1 === i ? '' : ', '))})}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">
                                    <StatusBadge value={item.status} />
                                </td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.start_time ? moment.tz(item.start_time, moment.tz.guess(true)).format("DD-MM-YYYY HH:mm") : null}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{durasi}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.peserta.length+item.tamu.length}</td>
                                {/* <td className="fc-muted f-14 f-w-300" align="center" style={{borderRight: '1px solid #DDDDDD'}}>
                                    <button className="btn btn-icademy-file" >
                                        <i className="fa fa-download fc-skyblue"></i> Download File
                                    </button>
                                </td> */}
                                <td className="fc-muted f-14 f-w-300" align="center">
                                    <span class="btn-group dropleft">
                                      <button style={{padding:'6px 18px', border:'none', marginBottom:0, background:'transparent'}} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <i
                                          className="fa fa-ellipsis-v"
                                          style={{ fontSize: 14, marginRight:0, color:'rgb(148 148 148)' }}
                                        />
                                      </button>
                                      <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{fontSize:14, padding:5, borderRadius:0}}>
                                        {
                                          (access_project_admin && item.status != 3) &&
                                          <Link to={`/webinar/add/${item.project_id}/${item.id}/${this.props.training ? 'by-training' : 'default'}`} style={{cursor:'pointer'}} class="dropdown-item" type="button">
                                            Detail
                                          </Link>
                                        }
                                        {
                                          (access_project_admin && item.status !=3) &&
                                          <Link to={`/webinar/edit/${item.project_id}/${item.id}/${this.props.training ? 'by-training' : 'default'}`} style={{cursor:'pointer'}} class="dropdown-item" type="button">
                                            Edit
                                          </Link>
                                        }
                                        {
                                          cdWEBINAR && access_project_admin ?
                                          <Link onClick={this.dialogDelete.bind(this, item.id)} style={{cursor:'pointer'}} class="dropdown-item" type="button">
                                            Delete
                                          </Link>
                                          : null
                                        }

                                      </div>
                                    </span>
                                </td>
                                <td className="fc-muted f-14 f-w-300 " align="center">
                                    {
                                        ((item.sekretaris.filter((item) => item.user_id == this.state.userId).length >= 1 || owner.filter((item) => item.user_id == this.state.userId).length >= 1) && item.status == 3) &&
                                        <Link to={`/webinar/riwayat/${item.id}`}><button className="btn btn-icademy-primary btn-icademy-grey">{t('history')}</button></Link>
                                    }
                                    {
                                        ((levelUser != 'client' || item.moderator.filter((item) => item.user_id == this.state.userId).length >= 1 || item.sekretaris.filter((item) => item.user_id == this.state.userId).length >= 1 || item.pembicara.filter((item) => item.user_id == this.state.userId).length >= 1 || owner.filter((item) => item.user_id == this.state.userId).length >= 1 || item.peserta.filter((item) => item.user_id == this.state.userId).length >= 1) && item.status == 2) &&
                                    <a href={(item.engine === 'zoom') ? (this.state.checkZoom.length ? this.state.checkZoom[0].link : '') : `/webinar/live/${item.id}`} target='_blank'><button className="btn btn-icademy-primary btn-icademy-warning">{t('join')}</button></a>
                                    }
                                    {
                                        (item.moderator.filter((item) => item.user_id == this.state.userId).length >= 1 && item.status == 1) &&
                                    <Link onClick={this.updateStatus.bind(this, item.id, 2)} className="btn btn-v2 btn-warning">{t('start')}</Link>
                                    }
                                </td>
                            </tr>
                            )
                        })
                    }

                </tbody>
                </table>
            </div>
              <Modal
                show={this.state.modalDelete}
                onHide={this.closeModalDelete}
                centered
              >
                <Modal.Header closeButton>
                  <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
                  Confirmation
                  </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Are you sure you want to delete this {this.props.training ? 'Live Class' : 'Webinar'} ?</div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btm-icademy-primary btn-icademy-grey"
              onClick={this.closeModalDelete.bind(this)}
            >
              Cancel
                            </button>
            <button
              className="btn btn-icademy-primary btn-icademy-red"
              onClick={this.deleteWebinar.bind(this, this.state.deleteWebinarId)}
            >
              <i className="fa fa-trash"></i>
                              Delete
                            </button>
          </Modal.Footer>
        </Modal>
      </div>

    );
  }
}

const WebinarTableWithTranslation = withTranslation('common')(WebinarTable)

export default WebinarTableWithTranslation;
