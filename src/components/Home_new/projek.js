import React, { Component } from "react";
import { Link } from "react-router-dom";
import Storage from '../../repository/storage';
import { toast } from "react-toastify";
import API, {USER_ME, API_SERVER} from '../../repository/api';
import { Card, Modal, Col, Row, InputGroup, Form } from 'react-bootstrap';
import { MultiSelect } from 'react-sm-select';
// const bbb = require('bigbluebutton-js')


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
    project:[],
    modalNewFolder: false,
    folderName: '',
    alert: '',
    modalDelete: false,
    modalEdit: false,

    optionsProjectAdmin: [],
    valueProjectAdmin: []
  }
  
  onChangeInput = e => {
    const target = e.target;
    const name = e.target.name;
    const value = e.target.value;

    if (name === 'attachmentId') {
        this.setState({ [name]: e.target.files });
    } else {
        this.setState({ [name]: value });
    }
}
closeModalProject = e => {
  this.setState({modalNewFolder:false, alert: '', valueProjectAdmin:[]})
}
closeModalEdit = e => {
  this.setState({modalEdit:false, alert: '', folderName:'', valueProjectAdmin:[]})
}
closeModalDelete = e => {
  this.setState({modalDelete:false, deleteProjectName:'', deleteProjectId:'', alert:''})
}
  saveFolder = e => {
    e.preventDefault();
    const formData = {
      name: this.state.folderName,
      company: this.state.companyId,
      mother: 0,
      project_admin: this.state.valueProjectAdmin
    };
  
    API.post(`${API_SERVER}v1/folder`, formData).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          this.setState({alert: res.data.result});
        } else {
          toast.success(`Berhasil menambah project ${this.state.folderName}`)
          this.setState({modalNewFolder:false, alert: '', folderName:'', valueProjectAdmin:[]})
          this.fetchProject();
        }
      }
    })
  }
  fetchProject(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if (res.status === 200) {
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
        API.get(`${API_SERVER}v1/project/${Storage.get('user').data.level}/${Storage.get('user').data.user_id}/${this.state.companyId}`).then(response => {
          this.setState({ project: response.data.result });
        }).catch(function(error) {
          console.log(error);
        });
      }
    })
  }

  dialogDelete(id, name){
    this.setState({
      deleteProjectId: id,
      deleteProjectName: name,
      modalDelete: true
    })
  }

  openModalEdit(id){
    API.get(`${API_SERVER}v1/project-read/${id}`).then(res => {
      if (res.status === 200) {
        this.setState({
          editProjectId: id,
          editProjectName: res.data.result.name,
          valueProjectAdmin: res.data.result.project_admin ? res.data.result.project_admin.split(',').map(Number) : [],
          modalEdit: true
        })
      }
    })
  }

  deleteProject(){
    API.delete(`${API_SERVER}v1/project/${this.state.deleteProjectId}`).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          toast.error(`Gagal menghapus project ${this.state.deleteProjectName}`)
        } else {
          toast.success(`Berhasil menghapus project ${this.state.deleteProjectName}`)
          this.setState({deleteProjectId:'', deleteProjectName: '',modalDelete: false})
          this.fetchProject();
        }
      }
    })
  }
  editProject(){
    let form = {
      name: this.state.editProjectName,
      project_admin: this.state.valueProjectAdmin
    }
    API.put(`${API_SERVER}v1/project/${this.state.editProjectId}`, form).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          toast.error(`Gagal mengubah project ${this.state.editProjectName}`)
        } else {
          toast.success(`Berhasil mengubah project ${this.state.editProjectName}`)
          this.setState({editProjectId:'', editProjectName: '',modalEdit: false, valueProjectAdmin:[]})
          this.fetchProject();
        }
      }
    })
  }

  fetchOtherData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if (res.status === 200) {
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
          if (this.state.optionsProjectAdmin.length==0 || this.state.optionsProjectAdmin.length==0){
            API.get(`${API_SERVER}v1/user/company/${this.state.companyId}`).then(response => {
              response.data.result.map(item => {
                this.state.optionsProjectAdmin.push({value: item.user_id, label: item.name});
              });
            })
            .catch(function(error) {
              console.log(error);
            });
          }
      }
    })
  }
  componentDidMount(){
    this.fetchProject()
    this.fetchOtherData()
  }

  // testbbb(){
  //   toast.warning('test')
  //   let api = bbb.api(
  //     'https://conference.icademy.id/bigbluebutton/', 
  //     'pzHkONB47UvPNFQU2fUXPsifV3HHp4ISgBt9W1C0o'
  //   )
  //   let http = bbb.http
  //   let meetingCreateUrl = api.administration.create('My Meeting', '1', {
  //     duration: 2,
  //     attendeePW: 'secret',
  //     moderatorPW: 'supersecret',
  //     allowModsToUnmuteUsers: true,
  //     // logo: 'https://app.icademy.id/newasset/logo-horizontal.svg'
  //   })
  //   http(meetingCreateUrl).then((result) => {
  //     console.log(result)
     
  //     let moderatorUrl = api.administration.join('moderator', '1', 'supersecret')
  //     let attendeeUrl = api.administration.join('attendee', '1', 'secret')
  //     console.log(`Moderator link: ${moderatorUrl}\nAttendee link: ${attendeeUrl}`)
     
  //     let meetingEndUrl = api.administration.end('1', 'supersecret')
  //     console.log(`End meeting link: ${meetingEndUrl}`)
  //   })
  // }


  render() {
    let access = Storage.get('access');
    let levelUser = Storage.get('user').data.level;
    let accessProjectManager = levelUser == 'client' ? false : true;
  //  console.log(this.props, 'props evenntttt')
    const lists = this.state.project;
    return (
      <div className="row">
        <div className="col-sm-8">
          <div className="row">
          <div style={{padding:'10px 20px'}}>
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
            onClick={e=>this.setState({modalNewFolder:true})}
            >
            <i className="fa fa-plus"></i>
            
            Tambah
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
                <span className="f-w-600 f-16 fc-skyblue">Lihat Semua</span>
              </Link>
          </p>
        </div>
      <div className="col-sm-12" style={{marginTop: '10px'}}>
      <div className="wrap" style={{maxHeight:'420px', overflowY:'scroll', overflowX:'hidden'}}>
        {
          lists.length == 0 ?
            <div className="col-sm-12 mb-1">
              Tidak ada
            </div>
          :
          lists.map((item, i) => (
            <div className="col-sm-12 mb-1">
                <div className="row p-10" style={{borderBottom: '1px solid #E6E6E6'}}>
                <Link to={`detail-project/${item.id}`} className={accessProjectManager ? "col-sm-4" : "col-sm-12"}>
                  <div className="box-project">
                    <div className=" f-w-800 f-16 fc-black">
                      {item.title} 
                    </div>
                  </div>
                </Link>
                <span className="col-sm-7">
                  <span className={item.meeting === 0 ? "project-info-disabled float-right" : "project-info float-right"}>{item.meeting} Meeting</span>
                  <span className={item.webinar === 0 ? "project-info-disabled float-right" : "project-info float-right"}>{item.webinar} Webinar</span>
                </span>
                {
                  accessProjectManager ?
                  <span class="btn-group dropleft col-sm-1">
                    <button style={{padding:'6px 18px', border:'none', marginBottom:0, background:'transparent'}} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                      <i
                        className="fa fa-ellipsis-v"
                        style={{ fontSize: 14, marginRight:0, color:'rgb(148 148 148)' }}
                      />
                    </button>
                    <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{fontSize:14, padding:5, borderRadius:0}}>
                      <button style={{cursor:'pointer'}} class="dropdown-item" type="button" onClick={this.openModalEdit.bind(this, item.id)}>Ubah</button>
                      <button style={{cursor:'pointer'}} class="dropdown-item" type="button" onClick={this.dialogDelete.bind(this, item.id, item.title)}>Hapus</button>
                    </div>
                  </span>
                  :null
                }
                </div>
            </div>
          ))
        }
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
      </div>
      </div>
        <Modal
          show={this.state.modalNewFolder}
          onHide={this.closeModalProject}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
            Tambah Project
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
                <Card className="cardku">
                  <Card.Body>
                    <Row>
                        <Col>
                          <Form.Group controlId="formJudul">
                            <Form.Label className="f-w-bold">
                              Nama Project
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
                            <MultiSelect
                              id="moderator"
                              options={this.state.optionsProjectAdmin}
                              value={this.state.valueProjectAdmin}
                              onChange={valueProjectAdmin => this.setState({ valueProjectAdmin })}
                              mode="tags"
                              enableSearch={true}
                              resetable={true}
                              valuePlaceholder="Pilih Project Admin"
                            />
                            <Form.Text className="text-muted">
                              Project admin dapat mengelola meeting, webinar, dan file.
                            </Form.Text>
                          </Form.Group>
                        </Col>
                    </Row>
                  </Card.Body>
                  <Modal.Footer>
                      <button
                        className="btn btm-icademy-primary btn-icademy-grey"
                        onClick={this.closeModalProject.bind(this)}
                      >
                        Batal
                      </button>
                      <button
                        className="btn btn-icademy-primary"
                        onClick={this.saveFolder.bind(this)}
                      >
                        <i className="fa fa-save"></i>
                        Simpan
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
            <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
            Ubah Nama Project
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
                <Card className="cardku">
                  <Card.Body>
                    <Row>
                        <Col>
                          <Form.Group controlId="formJudul">
                            <Form.Label className="f-w-bold">
                              Nama Project
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
                              <div style={{color:'#F00'}}>{this.state.alert}</div>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                          <Form.Group controlId="formJudul">
                            <Form.Label className="f-w-bold">
                              Project Admin
                            </Form.Label>
                            <MultiSelect
                              id="moderator"
                              options={this.state.optionsProjectAdmin}
                              value={this.state.valueProjectAdmin}
                              onChange={valueProjectAdmin => this.setState({ valueProjectAdmin })}
                              mode="tags"
                              enableSearch={true}
                              resetable={true}
                              valuePlaceholder="Pilih Project Admin"
                            />
                            <Form.Text className="text-muted">
                              Project admin dapat mengelola meeting, webinar, dan file.
                            </Form.Text>
                          </Form.Group>
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
                        Batal
                      </button>
                      <button
                        className="btn btn-icademy-primary"
                        onClick={this.editProject.bind(this)}
                      >
                        <i className="fa fa-save"></i>
                        Simpan
                      </button>
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.modalDelete}
          onHide={this.closeModalDelete}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
            Konfirmasi
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Anda yakin akan menghapus project <b>{this.state.deleteProjectName}</b> ?</div>
          </Modal.Body>
          <Modal.Footer>
                      <button
                        className="btn btm-icademy-primary btn-icademy-grey"
                        onClick={this.closeModalDelete.bind(this)}
                      >
                        Batal
                      </button>
                      <button
                        className="btn btn-icademy-primary btn-icademy-red"
                        onClick={this.deleteProject.bind(this)}
                      >
                        <i className="fa fa-trash"></i>
                        Hapus
                      </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ProjekNew;
