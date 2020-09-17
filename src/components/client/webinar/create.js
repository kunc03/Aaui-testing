import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Modal, Card, InputGroup, FormControl, Button, Row, Col, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import API, { API_SERVER, USER_ME, APPS_SERVER } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { toast } from "react-toastify";

import { MultiSelect } from 'react-sm-select';

export default class WebinarCreate extends Component {

	state = {
    companyId: Storage.get('user').data.company_id,
    projectId: parseInt(this.props.match.params.projectId),

    optionNames: [],

    isStep1: true,
    judul: "",
    moderatorId: [],
    sekretarisId: [],
    pembicaraId: [],
    ownerId: [],

    isStep2: false,
    accessPembicara: false,
    accessModerator: false,
    accessSekretaris: false,
    accessPeserta: false,
    nameFile: "",
    folder: [],
    files: [],
    mom: [],
    recordedMeeting: [],

    //form upload folder
    folderName: "",
    attachmentId: [],

    selectFolder: false,
    folderId: 0,
    prevFolderId: 0,

    navigation: ['Home'],

    // isModalDokumen: false,
    // isModalFile: false,
    modalNewFolder: false,
    modalUpload: false,
    alert: '',
    uploading: false,
  }

  saveFolder = e => {
    e.preventDefault();
    const formData = {
      name: this.state.folderName,
      company: this.state.companyId,
      mother: this.state.folderId,
      project_admin: []
    };

    API.post(`${API_SERVER}v1/folder`, formData).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          this.setState({alert: res.data.result});
        } else {
          this.setState({modalNewFolder:false, alert: ''})
          this.fetchFolder(this.state.folderId);
        }
      }
    })
  }

  uploadFile = e => {
    e.preventDefault();
    this.setState({uploading: true})
    for (let i=0; i<=this.state.attachmentId.length-1; i++){
      let form = new FormData();
      form.append('folder', this.state.folderId);
      form.append('file', this.state.attachmentId[i]);
      API.post(`${API_SERVER}v1/folder/files`, form).then(res => {
        if(res.status === 200) {
          if(res.data.error) {
            this.setState({alert: res.data.result, uploading: false, attachmentId: []});
          } else {
            this.setState({modalUpload:false, alert: '', uploading: false, attachmentId: []})
            this.fetchFolder(this.state.folderId);
            this.fetchFile(this.state.folderId)
          }
        }
      })
    }
  }

  selectFolder(id, name) {
    this.setState({selectFolder: id == this.state.projectId ? false : true, folderId: id})
    this.fetchFolder(id)
    this.fetchFile(id)
    this.fetchMOM(id)
    this.fetchRekaman(id)
  }

  fetchFolder(mother){
    API.get(`${API_SERVER}v1/folder/${this.state.companyId}/${mother}`).then(res => {
      if (res.status === 200) {
        this.setState({folder: res.data.result})
      }
    })
    API.get(`${API_SERVER}v1/folder/back/${this.state.companyId}/${mother}`).then(res => {
      if (res.status === 200) {
        this.setState({prevFolderId: res.data.result})
      }
    })
  }

  fetchFile(folder){
    API.get(`${API_SERVER}v1/files/${folder}`).then(res => {
      if (res.status === 200) {
        this.setState({files: res.data.result})
      }
    })
  }

  fetchMOM(folder){
    if (folder == 0){
      this.setState({mom:[]})
    }
    else{
      API.get(`${API_SERVER}v1/files-mom/${folder}`).then(res => {
        if(res.status === 200) {
          this.setState({
            mom : res.data.result
          })
        }
      })
    }
  }

  fetchRekaman(folder){
    if (folder == 0){
      this.setState({recordedMeeting:[]})
    }
    else{
      API.get(`${API_SERVER}v1/files-recorded/${folder}`).then(res => {
        if(res.status === 200) {
          this.setState({
            recordedMeeting : res.data.result
          })
        }
      })
    }
  }

  handleModal = () => {
    this.setState({
      isModalDokumen: false,
      isModalFile: false,
      accessPembicara: false,
      accessModerator: false,
      accessSekretaris: false,
      accessPeserta: false,
      nameFile: "",
    });
  }

  handleAllCheck = e => {
    e.preventDefault();
    let pem = this.state.pembicara;
    pem.forEach(item => item.checked = e.target.checked);
    this.setState({ pembicara: pem, allChecked: e.target.checked });
  }

  handleOneCheck = e => {
    let pem = this.state.pembicara;
    pem.forEach(item => { if (item.email === e.target.value) item.checked = e.target.checked });
    this.setState({ pembicara: pem }); 
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    API.get(`${API_SERVER}v1/user/company/${this.state.companyId}`).then(response => {
      response.data.result.map(item => {
        this.state.optionNames.push({value: item.user_id, label: item.name});
      });
    })

  
    this.selectFolder(this.state.projectId)
  }

  handleDynamicInput = (e, i) => {
    const { value, name } = e.target;
    let newObj = [...this.state.userRoles];

    newObj[i][name] = value;
    this.setState({ pertanyaan: newObj });
  }

  handleDynamicMulti = (e, i) => {
    let newObj = [...this.state.userRoles];

    newObj[i].userId = e;
    this.setState({ pertanyaan: newObj });
  }

  handleCheckbox = e => {
    let { checked, name } = e.target;
    this.setState({ [name]: checked })
  }

  handleFile = e => {
    this.setState({ nameFile: e.target.files[0] });
  }

  onChangeInputFile = e => {
    const name = e.target.name;
    const value = e.target.value;
    if(name == 'attachmentId') {
      this.setState({ [name]: e.target.files });
    } else {
      this.setState({ [name]: value });
    }
  }

  simpanWebinar = e => {
    e.preventDefault();
    let form = {
      judul: this.state.judul,
      moderatorId: this.state.moderatorId[0],
      sekretarisId: this.state.sekretarisId[0],
      pembicaraId: this.state.pembicaraId[0],
      ownerId: this.state.ownerId[0],
      projectId: this.state.projectId,
      dokumenId: this.state.folderId
    }


    API.post(`${API_SERVER}v2/webinar/create`, form).then(res => {
      if(res.data.error) 
        toast.warning("Error fetch API")
      else
        window.location.href = `/detail-project/${this.state.projectId}`;
    })
  }

	render() {

    console.log('STATE: ', this.state);

    let levelUser = 'admin';

		return (
			<div className="row">
        {/** STEP 1 */}
        {
          this.state.isStep1 &&
          <div className="col-sm-12">
            <Card>
              <Card.Body>
                <div className="row">
                  <div className="col-sm-6">
                    <h3 className="f-w-900 f-18 fc-blue">
                    	<Link to={`/detail-project/${this.props.match.params.projectId}`} className="btn btn-sm mr-4" style={{
                    		border: '1px solid #e9e9e9',
                    		borderRadius: '50px',
                    	}}>
                    		<i className="fa fa-chevron-left" style={{margin: '0px'}}></i>
                  		</Link>
                      Buat Webinar
                    </h3>
                  </div>
                  <div className="col-sm-6 text-right">
                    <p className="m-b-0">
                      <span className="f-16 biru-bold mr-3">Step 1 &nbsp;&nbsp;&bull;</span>
                      <span className={`f-16 mr-3`}>Step 2 &nbsp;&nbsp;&bull;</span>
                      <span className="f-16">Selesai</span>
                    </p>
                  </div>
                </div>
                <div style={{marginTop: '10px'}}>
                  <div className="row">
                    <div className="col-sm-8">
                      
                      <div className="form-group">
                        <label className="bold">Judul Webinar</label>
                        <input type="text" value={this.state.judul} onChange={e => this.setState({ judul: e.target.value })} className="form-control" />
                        <small className="form-text text-muted">Judul tidak boleh menggunakan karakter spesial.</small>
                      </div>

                      <h4>Pilih Roles</h4>
                      <div className="form-group row">
                        <div className="col-sm-3">
                          <label className="bold">Role</label>
                          <input type="text" className="form-control" value="Sekretaris" disabled="disabled" />
                        </div>
                        <div className="col-sm-9">
                          <label className="bold">Nama</label>
                          <MultiSelect
                              id={`sekretarisId`}
                              options={this.state.optionNames}
                              value={this.state.sekretarisId}
                              onChange={sekretarisId => this.setState({ sekretarisId })}
                              mode="single"
                              enableSearch={true}
                              resetable={true}
                              valuePlaceholder="Silahkan Pilih User"
                              allSelectedLabel="Silahkan Pilih User"
                            />
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col-sm-3">
                          <label className="bold">Role</label>
                          <input type="text" className="form-control" value="Moderator" disabled="disabled" />
                        </div>
                        <div className="col-sm-9">
                          <label className="bold">Nama</label>
                          <MultiSelect
                              id={`moderatorId`}
                              options={this.state.optionNames}
                              value={this.state.moderatorId}
                              onChange={moderatorId => this.setState({ moderatorId })}
                              mode="single"
                              enableSearch={true}
                              resetable={true}
                              valuePlaceholder="Silahkan Pilih User"
                              allSelectedLabel="Silahkan Pilih User"
                            />
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col-sm-3">
                          <label className="bold">Role</label>
                          <input type="text" className="form-control" value="Pembicara" disabled="disabled" />
                        </div>
                        <div className="col-sm-9">
                          <label className="bold">Nama</label>
                          <MultiSelect
                              id={`pembicaraId`}
                              options={this.state.optionNames}
                              value={this.state.pembicaraId}
                              onChange={pembicaraId => this.setState({ pembicaraId })}
                              mode="single"
                              enableSearch={true}
                              resetable={true}
                              valuePlaceholder="Silahkan Pilih User"
                              allSelectedLabel="Silahkan Pilih User"
                            />
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col-sm-3">
                          <label className="bold">Role</label>
                          <input type="text" className="form-control" value="Owner" disabled="disabled" />
                        </div>
                        <div className="col-sm-9">
                          <label className="bold">Nama</label>
                          <MultiSelect
                              id={`ownerId`}
                              options={this.state.optionNames}
                              value={this.state.ownerId}
                              onChange={ownerId => this.setState({ ownerId })}
                              mode="single"
                              enableSearch={true}
                              resetable={true}
                              valuePlaceholder="Silahkan Pilih User"
                              allSelectedLabel="Silahkan Pilih User"
                            />
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col-sm-4">
                          <label className="bold">Role Dokumen Tree</label>
                          <button onClick={e => this.setState({isStep1: false, isStep2: true})} style={{padding: '18px', cursor: 'pointer'}} className="form-control btn-primary">
                            <i className="fa fa-file"></i> &nbsp; Folder Dokumen Tree
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                  
                </div>
              </Card.Body>
            </Card>
          </div>
        }

        {/** STEP 2 */}
        {
          this.state.isStep2 && 
          <div className="col-sm-12">
            <Card>
              <Card.Body>
                <div className="row">
                  <div className="col-sm-6">
                    <h3 className="f-w-900 f-18 fc-blue">
                      <a onClick={e => { e.preventDefault(); this.setState({isStep1: true, isStep2: false}) }} className="btn btn-sm mr-4" style={{
                        border: '1px solid #e9e9e9',
                        borderRadius: '50px',
                      }}>
                        <i className="fa fa-chevron-left" style={{margin: '0px'}}></i>
                      </a>
                      Folder Dokumen
                    </h3>
                  </div>
                  <div className="col-sm-6 text-right">
                    <p className="m-b-0">
                      <span className="f-16 biru-bold mr-3">Step 1 &nbsp;&nbsp;&bull;</span>
                      <span className={`f-16 biru-bold mr-3`}>Step 2 &nbsp;&nbsp;&bull;</span>
                      <span className="f-16">Selesai</span>
                    </p>
                  </div>
                </div>
                <div style={{marginTop: '10px'}}>
                  <div className="row">

                    <div className="col-sm-12">
                      <div id="scrollin" style={{height:'492px', marginBottom: '0px'}}>

                        <div className="row" style={{marginLeft:0, marginRight:0}}>
                          {
                            ((levelUser == 'admin' || levelUser == 'superadmin') && this.state.projectId !==0) &&
                            <Button
                                onClick={e=>this.setState({modalNewFolder:true})}
                                className="btn-v2 btn-primary"
                                style={{width:250, margin:5}}
                            >
                                <i className="fa fa-plus"></i> &nbsp; Tambah Folder Project
                            </Button>
                          }
                          {
                            (this.state.selectFolder !== 0 && this.state.projectId !==0) &&
                            <Button
                                onClick={e=>this.setState({modalUpload:true})}
                                className="btn-v2 btn-primary"
                                style={{width:150, margin:5}}
                            >
                                <i className="fa fa-upload"></i> &nbsp; Upload File
                            </Button>
                          }

                          <Button onClick={this.simpanWebinar} className="btn btn-v2 btn-primary" style={{width:150, margin:5, position: 'absolute', right: '15px'}}>
                            <i className="fa fa-save"></i> Simpan
                          </Button>
                        </div>

                        <div className='row' style={{marginLeft:0, marginRight:0, marginTop: '10px', height:440, overflowY: 'scroll'}}>
                                {
                                  this.state.folderId !== 0 &&
                                  this.state.selectFolder &&
                                  <div className="folder" onDoubleClick={this.selectFolder.bind(this,this.state.prevFolderId, null)}>
                                      <img
                                      src='assets/images/component/folder-back.png'
                                      className="folder-icon"
                                      />
                                      <div className="filename">
                                          Kembali
                                      </div>
                                  </div>
                                }
                                {this.state.folder.map(item =>
                                <div className="folder" onDoubleClick={this.selectFolder.bind(this, item.id, item.name)}>
                                    <img
                                    src='assets/images/component/folder.png'
                                    className="folder-icon"
                                    />
                                    <div className="filename">
                                        {item.name}
                                    </div>
                                </div>
                                )}
                                {
                                  this.state.files.map(item =>
                                  <div className="folder" onDoubleClick={e=>window.open(item.location, 'Downloading files')}>
                                      <img
                                      src={
                                        item.type == 'pdf' || item.type == 'dox' || item.type == 'docx' || item.type == 'ppt' || item.type == 'pptx' || item.type == 'rar' || item.type == 'zip' || item.type == 'jpg'
                                        ? `assets/images/component/${item.type}.png`
                                        : 'assets/images/component/file.png'
                                      }
                                      className="folder-icon"
                                      />
                                      <div className="filename">
                                        {item.name}
                                      </div>
                                  </div>
                                  )
                                }
                                {
                                  this.state.mom.map(item =>
                                  <div className="folder" onDoubleClick={e=>window.open(`${APPS_SERVER}mom/?id=${item.id}`, 'Downloading files')}>
                                      <img
                                      src='assets/images/component/file.png'
                                      className="folder-icon"
                                      />
                                      <div className="filename">
                                        MOM-{item.title}
                                      </div>
                                  </div>
                                  )
                                }
                                {
                                  this.state.recordedMeeting.map(item =>
                                    item.record && item.record.split(',').map(item =>
                                      <div className="folder" onDoubleClick={e=>window.open(item, 'Rekaman Meeting')}>
                                          <img
                                          src='assets/images/component/mp4.png'
                                          className="folder-icon"
                                          />
                                          <div className="filename">
                                            {item.substring(40)}
                                          </div>
                                      </div>
                                    )
                                  )
                                }
                        </div>
                        </div>
                    </div>
                  </div>
                  
                </div>
              </Card.Body>
            </Card>

            <Modal
              show={this.state.isModalDokumen}
              onHide={this.handleModal}
            >
              <Modal.Body>
                <h5>
                  Tambah File Dokumen
                </h5>

                {
                  !this.state.isModalFile &&
                  <div style={{ marginTop: "20px" }} className="form-group">
                    <div className="form-group">
                      <input onChange={e => this.setState({ nameFile: e.target.value })} type="text" placeHolder="Nama Folder Dokumen" className="form-control" />
                    </div>
                  </div>
                }

                {
                  this.state.isModalFile &&
                  <div style={{ marginTop: "20px" }} className="form-group">
                    <div className="form-group">
                      <input onChange={this.handleFile} type="file" placeHolder="Nama Folder Dokumen" className="form-control" />
                    </div>
                  </div>
                }

                <div className="form-group">
                  <label>Hak Akses</label>
                  <br/>
                  <label className="checkbox-inline" style={{margin: ".5rem"}}>
                    <input className="mr-2" onChange={this.handleCheckbox} name="accessSekretaris" type="checkbox" value="Sekretaris" /> Sekretaris
                  </label>
                  <label className="checkbox-inline" style={{margin: ".5rem"}}>
                    <input className="mr-2" onChange={this.handleCheckbox} name="accessModerator" type="checkbox" value="Moderator" /> Moderator
                  </label>
                  <label className="checkbox-inline" style={{margin: ".5rem"}}>
                    <input className="mr-2" onChange={this.handleCheckbox} name="accessPembicara" type="checkbox" value="Pembicara" /> Pembicara
                  </label>
                  <label className="checkbox-inline" style={{margin: ".5rem"}}>
                    <input className="mr-2" onChange={this.handleCheckbox} name="accessPeserta" type="checkbox" value="Peserta" /> Peserta
                  </label>
                </div>
                
                <button
                  type="button"
                  onClick={this.onClickFile}
                  className="btn btn-v2 btn-primary f-w-bold mr-2"
                >
                  <i className="fa fa-save"></i>
                  Simpan
                </button>
                <button
                  type="button"
                  className="btn btn-v2 f-w-bold"
                  onClick={this.handleModal}
                >
                  Tutup
                </button>
              </Modal.Body>
            </Modal>

            <Modal
              show={this.state.modalNewFolder}
            >
              <Modal.Header>
                <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
                Tambah Folder Project
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
                                    placeholder="Nama Folder Project"
                                    onChange={this.onChangeInputFile}
                                    required
                                    />
                                </div>
                                <div style={{color:'#F00'}}>{this.state.alert}</div>
                            </Col>
                        </Row>
                          <Link onClick={this.saveFolder.bind(this)} to="#" className="btn btn-sm btn-ideku" style={{padding: '10px 17px', width:'100%', marginTop:20}}>
                            <i className="fa fa-save"></i>Simpan
                          </Link>
                          <button
                            type="button"
                            className="btn btn-block f-w-bold"
                            onClick={e=> this.setState({modalNewFolder:false, alert: ''})}
                          >
                            Batal
                          </button>
                      </Card.Body>
                    </Card>
              </Modal.Body>
            </Modal>
            <Modal
              show={this.state.modalUpload}
            >
              <Modal.Header>
                <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
                Upload File
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                    <Card className="cardku">
                      <Card.Body>
                        <Row>
                            <Col>
                              <div className="form-group">
                                <label>Lampiran</label>
                                <input
                                  accept="all"
                                  name="attachmentId"
                                  onChange={this.onChangeInputFile}
                                  type="file"
                                  multiple
                                  placeholder="media chapter"
                                  className="form-control"
                                />
                                <label style={{color:'#000', padding:'5px 10px'}}>Jumlah File : { this.state.attachmentId.length }</label>
                                <Form.Text>
                                  Bisa banyak file, pastikan file tidak melebihi 500MB  
                                  {/* dan ukuran file tidak melebihi 20MB. */}
                                </Form.Text>
                              </div>
                              <div style={{color:'#F00'}}>{this.state.alert}</div>
                            </Col>
                        </Row>
                          <Link disabled={this.state.uploading} onClick={this.uploadFile.bind(this)} to="#" className="btn btn-sm btn-ideku" style={{padding: '10px 17px', width:'100%', marginTop:20}}>
                            <i className="fa fa-upload"></i>{this.state.uploading ? 'Uploading...' : 'Upload'}
                          </Link>
                          <button
                            type="button"
                            className="btn btn-block f-w-bold"
                            onClick={e=> this.setState({modalUpload:false})}
                          >
                            Batal
                          </button>
                      </Card.Body>
                    </Card>
              </Modal.Body>
            </Modal>
          </div>
        }
      </div>
		);
	}
}