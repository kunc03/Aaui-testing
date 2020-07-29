import React, { Component } from "react";
import { Link } from 'react-router-dom';
import {Alert, Modal, Form, Card, Button, Row, Col} from 'react-bootstrap';
import API, {USER_ME, USER, API_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';

class Files extends Component {
  state = {
      modalNewFolder : false,
      modalUpload : false,
      attachmentId: [],
      folderName : ''
  };

  componentDidMount() {
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
  render() {
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
                            <Button
                                onClick={e=>this.setState({modalNewFolder:true})}
                                className="btn-block btn-primary"
                                style={{width:250, margin:5}}
                            >
                                <i className="fa fa-plus"></i> &nbsp; Tambah Folder Project
                            </Button>
                            <Button
                                onClick={e=>this.setState({modalUpload:true})}
                                className="btn-block btn-primary"
                                style={{width:150, margin:5}}
                            >
                                <i className="fa fa-upload"></i> &nbsp; Upload File
                            </Button>
                        </div>
                      <div className="row" style={{background:'#FFF', borderRadius:4, padding:20}}>
                            <div className="folder" onDoubleClick={e=>alert('mantap back')}>
                                <img
                                src='assets/images/component/folder-back.png'
                                className="folder-icon"
                                />
                                <div className="filename">
                                    Kembali
                                </div>
                            </div>
                            <div className="folder" onDoubleClick={e=>alert('mantap folder')}>
                                <img
                                src='assets/images/component/folder.png'
                                className="folder-icon"
                                />
                                <div className="filename">
                                    Project ASD
                                </div>
                            </div>
                            <div className="folder" onDoubleClick={e=>alert('mantap file')}>
                                <img
                                src='assets/images/component/file.png'
                                className="folder-icon"
                                />
                                <div className="filename">
                                    Server Evaluation.pdf
                                </div>
                            </div>
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
                        </Col>
                    </Row>
                      <Link onClick={e=>this.setState({modalNewFolder:false})} to="#" className="btn btn-sm btn-ideku" style={{padding: '10px 17px', width:'100%', marginTop:20}}>
                        <i className="fa fa-save"></i>Simpan
                      </Link>
                      <button
                        type="button"
                        className="btn btn-block f-w-bold"
                        onClick={e=> this.setState({modalNewFolder:false})}
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
                              accept="application/pdf"
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
                        </Col>
                    </Row>
                      <Link onClick={e=>this.setState({modalUpload:false})} to="#" className="btn btn-sm btn-ideku" style={{padding: '10px 17px', width:'100%', marginTop:20}}>
                        <i className="fa fa-save"></i>Simpan
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
