import React, { Component } from "react";
import { Link } from "react-router-dom";
import Storage from '../../repository/storage';
import { toast } from "react-toastify";
import API, { USER_ME, API_SERVER } from '../../repository/api';
import { Card, Modal, Col, Row, Form } from 'react-bootstrap';
import { MultiSelect } from 'react-sm-select';
import ToggleSwitch from "react-switch";


class LaporanPembelajaranMurid extends Component {
  state = {
    user: {
      name: 'Anonymous',
      registered: '2019-12-09',
      companyId: ''
    },
    deleteProjectName: '',
    deleteProjectId: '',
    editProjectName: '',
    editProjectId: '',
    project: [],
    modalNewFolder: false,
    folderName: '',
    alert: '',
    modalDelete: false,
    modalEdit: false,
    modalSharing: false,
    limited: false,

    optionsProjectAdmin: [],
    valueProjectAdmin: [],
    valueUser: [],
    share: [],
    projectShareId: ''
  }

  onChangeInput = e => {
    const name = e.target.name;
    const value = e.target.value;

    if (name === 'attachmentId') {
      this.setState({ [name]: e.target.files });
    } else {
      this.setState({ [name]: value });
    }
  }

  toggleSwitch(checked) {
    this.setState({ limited: !this.state.limited });
  }

  closeModalProject = e => {
    this.setState({ modalNewFolder: false, alert: '', valueProjectAdmin: [], limited: false, valueUser: [] })
  }
  closeModalEdit = e => {
    this.setState({ modalEdit: false, alert: '', folderName: '', valueProjectAdmin: [], valueProjectAdmin: [], limited: false, valueUser: [] })
  }
  closeModalSharing = e => {
    this.setState({ modalSharing: false, projectShareId: '' })
  }
  closeModalDelete = e => {
    this.setState({ modalDelete: false, deleteProjectName: '', deleteProjectId: '', alert: '' })
  }
  saveFolder = e => {
    e.preventDefault();
    const formData = {
      name: this.state.folderName,
      company: this.state.companyId,
      mother: 0,
      project_admin: this.state.valueProjectAdmin,
      is_limit: this.state.limited ? 1 : 0,
      user: this.state.valueUser,
      aSekretaris: 1,
      aModerator: 1,
      aPembicara: 1,
      aOwner: 1,
      aPeserta: 1
    };

    API.post(`${API_SERVER}v1/folder`, formData).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          this.setState({ alert: res.data.result });
        } else {
          toast.success(`Berhasil menambah project ${this.state.folderName}`)
          this.setState({ modalNewFolder: false, alert: '', folderName: '', valueProjectAdmin: [], valueUser: [], limited: false })
          this.fetchProject();
        }
      }
    })
  }
  fetchProject() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if (res.status === 200) {
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
        API.get(`${API_SERVER}v1/project/${Storage.get('user').data.level}/${Storage.get('user').data.user_id}/${this.state.companyId}`).then(response => {
          this.setState({ project: response.data.result });
        }).catch(function (error) {
          console.log(error);
        });
      }
    })
  }

  dialogDelete(id, name) {
    this.setState({
      deleteProjectId: id,
      deleteProjectName: name,
      modalDelete: true
    })
  }

  openModalEdit(id) {
    API.get(`${API_SERVER}v1/project-read/${id}`).then(res => {
      if (res.status === 200) {
        this.setState({
          editProjectId: id,
          editProjectName: res.data.result.name,
          valueProjectAdmin: res.data.result.project_admin ? res.data.result.project_admin.split(',').map(Number) : [],
          valueUser: res.data.result.user ? res.data.result.user.split(',').map(Number) : [],
          limited: res.data.result.is_limit === 0 ? false : true,
          modalEdit: true
        })
      }
    })
  }
  fetchShare(id) {
    API.get(`${API_SERVER}v2/project/share/${id}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error(`Gagal fetch data share`)
        } else {
          this.setState({
            share: res.data.result,
          })
        }
      }
    })
  }
  share() {
    let form = {
      project_id: this.state.projectShareId,
      email: this.state.email
    }
    API.post(`${API_SERVER}v2/project/share`, form).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error(`Gagal share project ${this.state.editProjectName}`)
        } else {
          if (res.data.result === 'success') {
            this.setState({ email: '' })
            this.fetchShare(this.state.projectShareId)
            toast.success(`Sharing project to ${form.email}`)
          }
          else {
            toast.warning(`Email ${form.email} not registered in ICADEMY`)
          }
        }
      }
    })
  }
  deleteShare(id) {
    API.delete(`${API_SERVER}v2/project/share/${id}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error(`Gagal delete data share`)
        } else {
          this.fetchShare(this.state.projectShareId)
        }
      }
    })
  }
  openModalSharing(id) {
    this.setState({ modalSharing: true, projectShareId: id })
    this.fetchShare(id)
  }

  deleteProject() {
    API.delete(`${API_SERVER}v1/project/${this.state.deleteProjectId}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error(`Gagal menghapus project ${this.state.deleteProjectName}`)
        } else {
          toast.success(`Berhasil menghapus project ${this.state.deleteProjectName}`)
          this.setState({ deleteProjectId: '', deleteProjectName: '', modalDelete: false })
          this.fetchProject();
        }
      }
    })
  }
  editProject() {
    let form = {
      name: this.state.editProjectName,
      project_admin: this.state.valueProjectAdmin,
      is_limit: this.state.limited ? 1 : 0,
      user: this.state.valueUser
    }
    API.put(`${API_SERVER}v1/project/${this.state.editProjectId}`, form).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error(`Failed to modify the project ${this.state.editProjectName}`)
        } else {
          toast.success(`Successfully modified project ${this.state.editProjectName}`)
          this.setState({ editProjectId: '', editProjectName: '', modalEdit: false, valueProjectAdmin: [], valueUser: [], limited: false })
          this.fetchProject();
        }
      }
    })
  }

  fetchOtherData() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if (res.status === 200) {
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
        if (this.state.optionsProjectAdmin.length == 0 || this.state.optionsProjectAdmin.length == 0) {
          API.get(`${API_SERVER}v1/user/company/${this.state.companyId}`).then(response => {
            response.data.result.map(item => {
              this.state.optionsProjectAdmin.push({ value: item.user_id, label: item.name });
            });
          })
            .catch(function (error) {
              console.log(error);
            });
        }
      }
    })
  }
  componentDidMount() {
    this.fetchProject()
    this.fetchOtherData()
  }


  render() {
    // let access = Storage.get('access');
    let levelUser = Storage.get('user').data.level;
    let accessProjectManager = levelUser == 'client' ? false : true;
    //  console.log(this.props, 'props evenntttt')
    const lists = this.state.project;
    return (
      <div className="row">
        <div className="col-sm-8">
          <div className="row">
            <div style={{ padding: '10px 20px' }}>
              <h3 className="f-w-900 f-18 fc-blue">
                Project
            </h3>
            </div>
            <div>
              {
                accessProjectManager ?
                  <button
                    className="btn btn-icademy-primary float-left"
                    style={{ padding: "7px 8px !important" }}
                    onClick={e => this.setState({ modalNewFolder: true })}
                  >
                    <i className="fa fa-plus"></i>

            Add
            </button>
                  :
                  null
              }
            </div>
          </div>
        </div>
        <div className="col-sm-4 text-right">
          <p className="m-b-0">
            <Link to={"project"}>
              <span className=" f-12 fc-skyblue">See all</span>
            </Link>
          </p>
          <b className="f-24 f-w-800">  . . . </b>
        </div>
        <div className="col-sm-12" style={{ marginTop: '10px' }}>
          <div className="wrap" style={{ height: '305px', overflowY: 'scroll', overflowX: 'hidden' }}>
            {
              lists.length == 0 ?
                <div className="col-sm-12 mb-1">
                  Not available
                </div>
                :
                lists.map((item, i) => (
                  <div className="col-sm-12 mb-1">
                    <div className="row p-10 p-t-15 p-b-15" style={{ borderBottom: '1px solid #E6E6E6' }}>
                      <Link to={`detail-project/${item.id}`} className={accessProjectManager ? "col-sm-4" : "col-sm-5"}>
                        <div className="box-project">
                          <div className=" f-w-800 f-16 fc-black">
                            {item.title}
                          </div>
                          {item.share_from && <span class="badge badge-pill badge-secondary" style={{ fontSize: 8, backgroundColor: '#007bff' }}>{item.share_from}</span>}
                        </div>
                      </Link>
                      <span className="col-sm-7">
                        <Link to={`detail-project/${item.id}`}><span className={item.meeting === 0 ? "project-info-disabled float-right" : "project-info float-right"}>{item.meeting} Meeting</span></Link>
                        <Link to={`detail-project/${item.id}`}><span className={item.webinar === 0 ? "project-info-disabled float-right" : "project-info float-right"}>{item.webinar} Webinar</span></Link>
                      </span>

                      {
                        accessProjectManager ?
                          <span class="btn-group dropleft col-sm-1">
                            <button style={{ padding: '6px 18px', border: 'none', marginBottom: 0, background: 'transparent' }} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                              <i
                                className="fa fa-ellipsis-v"
                                style={{ fontSize: 14, marginRight: 0, color: 'rgb(148 148 148)' }}
                              />
                            </button>
                            <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{ fontSize: 14, padding: 5, borderRadius: 0 }}>
                              <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={this.openModalEdit.bind(this, item.id)}>Edit</button>
                              <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={this.openModalSharing.bind(this, item.id)}>Sharing</button>
                              <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={this.dialogDelete.bind(this, item.id, item.title)}>Delete</button>
                            </div>
                          </span>
                          : null
                      }

                    </div>
                  </div>
                ))
            }

          </div>
        </div>

      </div>
    );
  }
}

export default LaporanPembelajaranMurid;
