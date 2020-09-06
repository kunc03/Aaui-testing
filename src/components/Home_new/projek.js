import React, { Component } from "react";
import { Link } from "react-router-dom";
import Storage from '../../repository/storage';
import { toast } from "react-toastify";
import API, {USER_ME, API_SERVER} from '../../repository/api';
import { Card, Modal, Col, Row, InputGroup, FormControl } from 'react-bootstrap';


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
    modalEdit: false
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
  this.setState({modalNewFolder:false, alert: ''})
}
closeModalEdit = e => {
  this.setState({modalEdit:false, alert: '', folderName:''})
}
closeModalDelete = e => {
  this.setState({modalDelete:false, deleteProjectName:'', deleteProjectId:'', alert:''})
}
  saveFolder = e => {
    e.preventDefault();
    const formData = {
      name: this.state.folderName,
      company: localStorage.getItem('companyID'),
      mother: 0
    };
  
    API.post(`${API_SERVER}v1/folder`, formData).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          this.setState({alert: res.data.result});
        } else {
          toast.success(`Berhasil menambah project ${this.state.folderName}`)
          this.setState({modalNewFolder:false, alert: '', folderName:''})
          this.fetchProject();
        }
      }
    })
  }
  fetchProject(){
    API.get(`${API_SERVER}v1/project/${Storage.get('user').data.level}/${Storage.get('user').data.user_id}/${localStorage.getItem('companyID')}`).then(response => {
      this.setState({ project: response.data.result });
    }).catch(function(error) {
      console.log(error);
    });
  }

  dialogDelete(id, name){
    this.setState({
      deleteProjectId: id,
      deleteProjectName: name,
      modalDelete: true
    })
  }

  openModalEdit(id, name){
    this.setState({
      editProjectId: id,
      editProjectName: name,
      modalEdit: true
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
    }
    API.put(`${API_SERVER}v1/project/${this.state.editProjectId}`, form).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          toast.error(`Gagal mengubah nama project ${this.state.editProjectName}`)
        } else {
          toast.success(`Berhasil mengubah nama project ${this.state.editProjectName}`)
          this.setState({editProjectId:'', editProjectName: '',modalEdit: false})
          this.fetchProject();
        }
      }
    })
  }

  componentDidMount(){
    this.fetchProject()
  }


  render() {
    let access = Storage.get('access');
    let accessProjectManager = true;
    let levelUser = Storage.get('user').data.level;
  //  console.log(this.props, 'props evenntttt')
    const lists = this.state.project;
    return (
      <div className="row">
        <div className="col-sm-8">
          <div className="row">
          <div style={{padding:'10px 20px'}} className="col-sm-4">
            <h3 className="f-w-900 f-18 fc-blue">
              Project
            </h3>
          </div>
          <div className="col-sm-8">
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
            {
              levelUser == 'client' ?
              null
              :
              <Link to={"files"}>
                <span className="f-w-600 f-16 fc-skyblue">Lihat Semua</span>
              </Link>
            }
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
                <Link to={`detail-project/${item.id}`} className={accessProjectManager ? "col-sm-11" : "col-sm-12"}>
                  <div className="box-project">
                    <div className=" f-w-800 f-16 fc-black">
                      {item.title} 
                      <span className="float-right">
                        <span className={item.meeting === 0 ? "project-info-disabled" : "project-info"}>{item.meeting} Meeting</span>
                        <span className={item.webinar === 0 ? "project-info-disabled" : "project-info"}>{item.webinar} Webinar</span>
                      </span>
                    </div>
                  </div>
                </Link>
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
                            <button style={{cursor:'pointer'}} class="dropdown-item" type="button" onClick={this.openModalEdit.bind(this, item.id, item.title)}>Ubah Nama</button>
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
                            <div style={{color:'#F00'}}>{this.state.alert}</div>
                        </Col>
                    </Row>
                      <button
                        to='/user-create'
                        className="btn btn-icademy-primary"
                        style={{ padding: "7px 8px !important", width:'100%' }}
                        onClick={this.saveFolder.bind(this)}
                      >
                        <i className="fa fa-save"></i>
                        Simpan
                      </button>
                      <button
                        className="btn btn-icademy-grey"
                        style={{ padding: "7px 8px !important", width:'100%' }}
                        onClick={this.closeModalProject.bind(this)}
                      >
                        Batal
                      </button>
                  </Card.Body>
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
                        className="btn btn-icademy-primary btn-icademy-red"
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
