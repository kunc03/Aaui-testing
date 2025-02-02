import React, { Component } from "react";
import { withTranslation } from 'react-i18next';

import { Link } from "react-router-dom";
import Storage from '../../repository/storage';
import { toast } from "react-toastify";
import API, { USER_ME, API_SERVER } from '../../repository/api';
import { Card, Modal, Col, Row, Form } from 'react-bootstrap';
import { MultiSelect } from 'react-sm-select';
import Select from 'react-select';
import ToggleSwitch from "react-switch";
import DataTable from 'react-data-table-component';
import moment from 'moment-timezone';

const customStyles = {
  rows: {
    style: {
      minHeight: '72px', // override the row height
    }
  },
  headCells: {
    style: {
      paddingLeft: '8px', // override the cell padding for head cells
      paddingRight: '8px',
    },
  },
  cells: {
    style: {
      paddingLeft: '8px', // override the cell padding for data cells
      paddingRight: '8px',
    },
  },
};


class ProjekNew extends Component {
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
    projectShareId: '',
    defaultProjectAdmin: [],
    defaultUsers: [],

    gb: []
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
    this.setState({ modalEdit: false, alert: '', folderName: '', valueProjectAdmin: [], limited: false, valueUser: [], defaultProjectAdmin: [], defaultUsers: [] })
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
      aPeserta: 1,
      created_by: Storage.get('user').data.user_id
    };

    API.post(`${API_SERVER}v1/folder`, formData).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          this.setState({ alert: res.data.result });
        } else {
          toast.success(`Berhasil menambah project ${this.state.folderName}`)
          this.setState({ modalNewFolder: false, alert: '', folderName: '', valueProjectAdmin: [], valueUser: [], limited: false, defaultProjectAdmin: [], defaultUsers: [] })
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
          // console.log(response.data.result, 'RESULLTT PROJECT')
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
          limited: res.data.result.is_limit === 0 ? false : true
        })
        let defValPA = res.data.result.project_admin ? res.data.result.project_admin.split(',').map(Number) : [];
        let defValU = res.data.result.user ? res.data.result.user.split(',').map(Number) : [];
        defValPA.map(item=>{
          if (this.state.optionsProjectAdmin.filter((x)=> x.value === item).length){
            this.state.defaultProjectAdmin.push({value: item, label: this.state.optionsProjectAdmin.filter((x)=> x.value === item)[0].label})
          }
        })
        defValU.map(item=>{
          if (this.state.optionsProjectAdmin.filter((x)=> x.value === item).length){
            this.state.defaultUsers.push({value: item, label: this.state.optionsProjectAdmin.filter((x)=> x.value === item)[0].label})
          }
        })
        this.setState({
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
          toast.error(`${this.props.t('failed_delete_project')} ${this.state.deleteProjectName}`)
        } else {
          toast.success(`${this.props.t('success_delete_project')} ${this.state.deleteProjectName}`)
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
          toast.error(`${this.props.t('failed_modify_project')} ${this.state.editProjectName}`)
        } else {
          toast.success(`${this.props.t('success_modify_project')} ${this.state.editProjectName}`)
          this.setState({ editProjectId: '', editProjectName: '', modalEdit: false, valueProjectAdmin: [], valueUser: [], limited: false, defaultProjectAdmin: [], defaultUsers: [] })
          this.fetchProject();
        }
      }
    })
  }

  fetchOtherData() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if (res.status === 200) {
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
        if (this.state.optionsProjectAdmin.length === 0 || this.state.optionsProjectAdmin.length === 0) {
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
    this.fetchCheckAccess(Storage.get('user').data.grup_name && Storage.get('user').data.grup_name.toLowerCase(), Storage.get('user').data.company_id, Storage.get('user').data.level,
      ['CD_PROJECT'])
  }

  fetchCheckAccess(role, company_id, level, param) {
    API.get(`${API_SERVER}v2/global-settings/check-access`, { role, company_id, level, param }).then(res => {
      this.setState({ gb: res.data.result })
    })
  }


  render() {
    const { t } = this.props

    let levelUser = Storage.get('user').data.level;
    let accessProjectManager = levelUser === 'client' ? false : true;
    let cdProject = '';
    if (levelUser === 'admin' || levelUser === 'superadmin') {
      cdProject = this.state.gb.length && this.state.gb.filter(item => item.code === 'CD_PROJECT')[0].status;
    }
    console.log(cdProject, 'kk')
    const location = window.location.href.split('/')[3] === 'project' ? true : false;

    const lists = this.state.project;
    console.log(lists, 'projekckkakkr');

    const columns = [
      {
        name: 'Name',
        selector: 'title',
        width: '30%',
        sortable: true,
        cell: row =>
          <Link to={`detail-project/${row.id}`}>
            <div className="box-project">
              <div className=" f-w-800 fc-black">
                {row.title}
              </div>
              {row.share_from && <span class="badge badge-pill badge-secondary" style={{ fontSize: 8, backgroundColor: '#007bff' }}>{row.share_from}</span>}
            </div>
          </Link>,
      },
      {
        name: 'Last Activity',
        selector: 'recent_project',
        width: '20%',
        sortable: true,
        cell: row =>
          <div className="f-10">{moment.tz(row.recent_project, moment.tz.guess(true)).format('DD-MM-YYYY HH:mm')}</div>,
      },
      {
        name: 'Information',
        width: '34%',
        cell: row =>
          <span style={{ inlineSize: '-webkit-fill-available' }}>
            <Link className="float-right" to={`detail-project/${row.id}`}><span className={row.meeting === 0 ? "project-info-disabled float-right" : "project-info float-right"}>{row.meeting} Meeting</span></Link>
            <Link className="float-right" to={`detail-project/${row.id}`}><span className={row.webinar === 0 ? "project-info-disabled float-right" : "project-info float-right"}>{row.webinar} Webinar</span></Link>
          </span>,
        center: true,
      },
      {
        name: '',
        width: '10%',
        cell: row =>
          accessProjectManager ?
            <span className="btn-group dropleft col-sm-1">
              <button style={{ padding: '6px 18px', border: 'none', marginBottom: 0, background: 'transparent' }} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <i
                  className="fa fa-ellipsis-v"
                  style={{ fontSize: 14, marginRight: 0, color: 'rgb(148 148 148)' }}
                />
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{ fontSize: 14, padding: 5, borderRadius: 0 }}>
                <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={this.openModalEdit.bind(this, row.id)}>Edit</button>
                <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={this.openModalSharing.bind(this, row.id)}>Sharing</button>
                {
                  cdProject &&
                  <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={this.dialogDelete.bind(this, row.id, row.title)}>Delete</button>
                }
              </div>
            </span>
            : null
        ,
      },
    ]


    return (
      <div className="row">
        <div className='col-sm-8'>
          <div className="row">
            <div style={{ padding: '10px 20px' }}>
              <h3 className="f-w-900 f-18 fc-blue">
                {t('project')}
            </h3>
            </div>

            {
              cdProject ?

              <div>
                {
                  accessProjectManager ?
                    <button
                      className="btn btn-icademy-primary float-left"
                      style={{ padding: "7px 8px !important" }}
                      onClick={e => this.setState({ modalNewFolder: true })}
                    >
                      <i className="fa fa-plus"></i> {t('add')}
                    </button>
                    :
                    null
                }
              </div>
              :null
            }


          </div>
        </div>
        <div className="col-sm-4 text-right">
          <p className="m-b-0">
            <Link to={"project"}>
              <span className=" f-12 fc-skyblue">Maximize</span>
            </Link>
          </p>
        </div>
        <div className="col-sm-12" style={{ marginTop: '-20px' }}>

        <DataTable
                style={{ marginTop: 20 }} columns={columns} data={lists} striped={false} noHeader={true} customStyles={customStyles}
                noDataComponent="There are no project to display"
                pagination
                fixedHeader
                paginationPerPage = {5}
                paginationRowsPerPageOptions = {[5, 10, 15, 20, 25, 30]}
              />
          {/* <div className="col-sm-12 mb-1">
            <div className="p-10" style={{borderBottom: '1px solid #E6E6E6'}}>
              <div className="box-project">
                <div className="f-16 fc-black" className="shadowFieldCont">
                  <input type="text" placeholder="Tambah Project Baru ..." className="shadowField col-sm-10" />
                  <span className="float-right col-sm-2">
                    <button
                    to='/user-create'
                    className="btn btn-icademy-primary-small float-right"
                    style={{ padding: "7px 8px !important" }}
                    >
                    Save
                    </button>
                  </span>
                </div>
              </div>
            </div>
        </div> */}
          {/* </div> */}
        </div>
        <Modal
          show={this.state.modalNewFolder}
          onHide={this.closeModalProject}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Create Project
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="cardku">
              <Card.Body>
                <Row>
                  <Col>
                    <Form.Group controlId="formJudul">
                      <Form.Label className="f-w-bold">
                        Project Name
                            </Form.Label>
                      <div className="input-group mb-4">
                        <input
                          type="text"
                          name="folderName"
                          value={this.state.folderName}
                          className="form-control"
                          placeholder="Nama Project"
                          onChange={this.onChangeInput}
                          required
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="formJudul">
                      <Form.Label className="f-w-bold">
                        Project Admin
                            </Form.Label>
                      <Select
                        options={this.state.optionsProjectAdmin}
                        isMulti
                        closeMenuOnSelect={false}
                        onChange={valueProjectAdmin => { let arr = []; valueProjectAdmin.map((item) => arr.push(item.value)); this.setState({ valueProjectAdmin: arr })}}
                      />
                      <Form.Text className="text-muted">
                        Project admins can manage meetings, webinars, and files.
                            </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formJudul">
                      <Form.Label className="f-w-bold">
                        Limit Users
                            </Form.Label>
                      <div style={{ width: '100%' }}>
                        <ToggleSwitch checked={false} onChange={this.toggleSwitch.bind(this)} checked={this.state.limited} />
                      </div>
                      <Form.Text className="text-muted">
                        {
                          this.state.limited ? 'Only people who are registered as participants can access the project.'
                            :
                            'The meeting room is open. All users can join.'
                        }
                      </Form.Text>
                    </Form.Group>
                    {
                      this.state.limited &&
                      <Form.Group controlId="formJudul">
                        <Form.Label className="f-w-bold">
                          Users
                          </Form.Label>
                        <Select
                          options={this.state.optionsProjectAdmin}
                          isMulti
                          closeMenuOnSelect={false}
                          onChange={valueUser => { let arr = []; valueUser.map((item) => arr.push(item.value)); this.setState({ valueUser: arr })}}
                        />
                      </Form.Group>
                    }
                  </Col>
                </Row>
              </Card.Body>
              <Modal.Footer>
                <button
                  className="btn btm-icademy-primary btn-icademy-grey"
                  onClick={this.closeModalProject.bind(this)}
                >
                  Close
                      </button>
                <button
                  className="btn btn-icademy-primary"
                  onClick={this.saveFolder.bind(this)}
                >
                  <i className="fa fa-save"></i>
                        Save
                      </button>
              </Modal.Footer>
            </Card>
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.modalEdit}
          onHide={this.closeModalEdit}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Edit Project
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="cardku">
              <Card.Body>
                <Row>
                  <Col>
                    <Form.Group controlId="formJudul">
                      <Form.Label className="f-w-bold">
                        Project Name
                            </Form.Label>
                      <div className="input-group mb-4">
                        <input
                          type="text"
                          name="editProjectName"
                          value={this.state.editProjectName}
                          className="form-control"
                          placeholder="Nama Project"
                          onChange={this.onChangeInput}
                          required
                        />
                      </div>
                      <div style={{ color: '#F00' }}>{this.state.alert}</div>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group controlId="formJudul">
                      <Form.Label className="f-w-bold">
                        Project Admin
                            </Form.Label>
                      <Select
                        options={this.state.optionsProjectAdmin}
                        isMulti
                        closeMenuOnSelect={false}
                        onChange={valueProjectAdmin => { let arr = []; valueProjectAdmin.map((item) => arr.push(item.value)); this.setState({ valueProjectAdmin: arr })}}
                        defaultValue={this.state.defaultProjectAdmin}
                      />
                      <Form.Text className="text-muted">
                        Project admins can manage meetings, webinars, and files.
                            </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="formJudul">
                      <Form.Label className="f-w-bold">
                        Limit Users
                            </Form.Label>
                      <div style={{ width: '100%' }}>
                        <ToggleSwitch checked={false} onChange={this.toggleSwitch.bind(this)} checked={this.state.limited} />
                      </div>
                      <Form.Text className="text-muted">
                        {
                          this.state.limited ? 'Only people who are registered as participants can access the project.'
                            :
                            'The meeting room is open. All users can join.'
                        }
                      </Form.Text>
                    </Form.Group>
                    {
                      this.state.limited &&
                      <Form.Group controlId="formJudul">
                        <Form.Label className="f-w-bold">
                          User
                          </Form.Label>
                        <Select
                          options={this.state.optionsProjectAdmin}
                          isMulti
                          closeMenuOnSelect={false}
                          onChange={valueUser => { let arr = []; valueUser.map((item) => arr.push(item.value)); this.setState({ valueUser: arr })}}
                          defaultValue={this.state.defaultUsers}
                        />
                      </Form.Group>
                    }
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btm-icademy-primary btn-icademy-grey"
              onClick={this.closeModalEdit.bind(this)}
            >
              Close
                      </button>
            <button
              className="btn btn-icademy-primary"
              onClick={this.editProject.bind(this)}
            >
              <i className="fa fa-save"></i>
                        Save
                      </button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.modalDelete}
          onHide={this.closeModalDelete}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Confirmation
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>You're sure you want to delete the project <b>{this.state.deleteProjectName}</b> ?</div>
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
              onClick={this.deleteProject.bind(this)}
            >
              <i className="fa fa-trash"></i>
                        Delete
                      </button>
          </Modal.Footer>
        </Modal>
        <Modal
          dialogClassName="modal-lg"
          show={this.state.modalSharing}
          onHide={this.closeModalSharing}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Sharing
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="cardku">
              <Card.Body>
                <Row>
                  <Col>
                    <div class="row">
                      <div className="col-sm-8">
                        <Form.Label className="f-w-bold">
                          Email
                              </Form.Label>
                        <input
                          type="email"
                          required
                          name="email"
                          value={this.state.email}
                          className="form-control"
                          placeholder="emailtujuan@domain.com"
                          onChange={this.onChangeInput}
                        />
                        <Form.Text className="text-muted">
                          The destination email must be registered as an ICADEMY user                              </Form.Text>
                      </div>
                      <div className="col-sm-4">
                        <button
                          className="btn btn-icademy-primary"
                          style={{ marginTop: 25 }}
                          onClick={this.share.bind(this)}
                        >
                          <i className="fa fa-share-alt"></i>
                                  Share
                                </button>
                      </div>
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.state.share.length > 0 ? this.state.share.map(item =>
                            <tr>
                              <td>{item.name}</td>
                              <td>{item.email}</td>
                              <td><i onClick={this.deleteShare.bind(this, item.id)} style={{ cursor: 'pointer' }} className="fa fa-trash"></i></td>
                            </tr>
                          )
                            :
                            <tr>
                              <td colspan='3'>No data sharing</td>
                            </tr>
                        }
                      </tbody>
                    </table>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

const ProjectWithTranslation = withTranslation('common')(ProjekNew)

export default ProjectWithTranslation;
