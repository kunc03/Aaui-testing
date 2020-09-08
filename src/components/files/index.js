import React, { Component } from "react";
import { Link } from 'react-router-dom';
import {Alert, Modal, Form, Card, Button, Row, Col} from 'react-bootstrap';
import API, {USER_ME, USER, API_SERVER, APPS_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';

class Files extends Component {
  state = {
      modalNewFolder : false,
      modalUpload : false,
      folder: [],
      attachmentId: [],
      mom: [],
      folderName : '',
      alert: '',
      company: '',
      selectFolder: false,
      folderId: 0,
      prevFolderId: 0,
      uploading: false,
      files: [],
      navigation: ['Home'],
      recordedMeeting: []
  };

  componentDidMount() {
    this.fetchData();
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

fetchData(){
  API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
    if (res.status === 200) {
      this.setState({company: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id})
      this.fetchFolder(0);
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
fetchFolder(mother){
  API.get(`${API_SERVER}v1/folder/${this.state.company}/${mother}`).then(res => {
    if (res.status === 200) {
      this.setState({folder: res.data.result})
    }
  })
  API.get(`${API_SERVER}v1/folder/back/${this.state.company}/${mother}`).then(res => {
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

selectFolder(id, name) {
  this.setState({selectFolder: true, folderId: id})
  this.fetchFolder(id)
  this.fetchFile(id)
  this.fetchMOM(id)
  this.fetchRekaman(id)
  if (name == null){
    this.state.navigation.pop()
  }
  else{
    this.state.navigation.push(name)
  }
}

saveFolder = e => {
  e.preventDefault();
  const formData = {
    name: this.state.folderName,
    company: this.state.company,
    mother: this.state.folderId
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
  render() {
    let levelUser = Storage.get('user').data.level;
    console.log('ALVIN', levelUser)
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-xl-12">
                        <div className="row">
                          {
                            (levelUser == 'admin' || levelUser == 'superadmin') &&
                            <Button
                                onClick={e=>this.setState({modalNewFolder:true})}
                                className="btn-block btn-primary"
                                style={{width:250, margin:5}}
                            >
                                <i className="fa fa-plus"></i> &nbsp; Tambah Folder Project
                            </Button>
                          }
                            {
                              this.state.folderId !== 0 &&
                              <Button
                                  onClick={e=>this.setState({modalUpload:true})}
                                  className="btn-block btn-primary"
                                  style={{width:150, margin:5}}
                              >
                                  <i className="fa fa-upload"></i> &nbsp; Upload File
                              </Button>
                            }
                        </div>
                      <div className="row" style={{background:'#FFF', borderRadius:4, padding:'10px 20px', marginBottom:10, marginTop:10}}>
                           {
                              this.state.navigation.map(item =>
                                item + ' > '
                             )
                           }
                      </div>
                      <div className="row" style={{background:'#FFF', borderRadius:4, padding:20}}>
                            {
                              this.state.folderId !== 0 &&
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
                              this.state.selectFolder &&
                              <div className="folder" onDoubleClick={e=>window.open(item.location, 'Downloading files')}>
                                  <img
                                  src={
                                    item.type == 'png' || item.type == 'pdf' || item.type == 'dox' || item.type == 'docx' || item.type == 'ppt' || item.type == 'pptx' || item.type == 'rar' || item.type == 'zip' || item.type == 'jpg'
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
                              this.state.selectFolder &&
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
                                    this.state.selectFolder &&
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
            </div>
          </div>
        </div>
        
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
                                onChange={this.onChangeInput}
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
                              onChange={this.onChangeInput}
                              type="file"
                              multiple
                              placeholder="media chapter"
                              className="form-control"
                            />
                            <label style={{color:'#000', padding:'5px 10px'}}>{ this.state.attachmentId.length } File</label>
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
      
    );
  }
}

export default Files;
