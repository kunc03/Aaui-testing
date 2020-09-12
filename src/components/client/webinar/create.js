import React, { Component } from 'react';
import { Modal, Card, InputGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { toast } from "react-toastify";

import { MultiSelect } from 'react-sm-select';

export default class WebinarCreate extends Component {

	state = {
    companyId: Storage.get('user').data.company_id,
    projectId: this.props.match.params.projectId,

    roles: [],
    optionNames: [],
    valueNames: [],

    isStep1: true,
    isStep2: false,

    folder: [
      {id: 1, name: 'Folder 1'},
      {id: 2, name: 'Folder 2'}
    ],
    files: [
      {location: 'https://google.com', type: 'pdf', name: 'bahan.pdf'},
      {location: 'https://google.com', type: 'txt', name: 'mom.txt'},
    ],

    selectFolder: false,
    folderId: 0,
    prevFolderId: 0,

    navigation: ['Home'],

    userRoles: [
      {userId: [], roleId: ''},
      {userId: [], roleId: ''},
      {userId: [], roleId: ''},
      {userId: [], roleId: ''},
      {userId: [], roleId: ''}
    ],

    isModalDokumen: false
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

  handleModal = () => {
    this.setState({
      isModalDokumen: false,
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
    API.get(`${API_SERVER}v2/webinar/role/${this.state.companyId}/${this.state.projectId}`).then(res => {
      if(res.data.error) toast.warning('Gagal fetch API');
      
      this.setState({ roles: res.data.result })
      
      API.get(`${API_SERVER}v1/user/company/${this.state.companyId}`).then(response => {
        response.data.result.map(item => {
          this.state.optionNames.push({value: item.user_id, label: item.name});
        });
      })

    })
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

	render() {

    const TabelPembicara = ({items}) => (
      <table className="table table-striped mb-4">
        <thead>
          <tr>
            <th><input type="checkbox" value={this.state.allChecked} checked={this.state.allChecked} onChange={this.handleAllCheck} /></th>
            <th>Nama</th>
            <th>Email</th>
            <th>Telepon</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            items.map((item,i) => (
              <tr key={i}>
                <td>
                  <input type="checkbox" checked={item.checked} value={item.email} onClick={this.handleOneCheck} />
                </td>
                <td>{item.nama}</td>
                <td>{item.email}</td>
                <td>{item.telepon}</td>
                <td>{item.status ? 'Sudah Dikirim' : 'Belum Dikirim'}</td>
                <td>
                  <i className="fa fa-trash" style={{cursor: 'pointer'}}></i>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );

    const TabelPeserta = ({items}) => (
      <table className="table table-striped mb-4">
        <thead>
          <tr>
            <th><input type="checkbox" value={this.state.allChecked} checked={this.state.allChecked} onChange={this.handleAllCheck} /></th>
            <th>Nama</th>
            <th>Email</th>
            <th>Telepon</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            items.map((item,i) => (
              <tr key={i}>
                <td>
                  <input type="checkbox" checked={item.checked} value={item.email} onClick={this.handleOneCheck} />
                </td>
                <td>{item.nama}</td>
                <td>{item.email}</td>
                <td>{item.telepon}</td>
                <td>{item.status ? 'Sudah Dikirim' : 'Belum Dikirim'}</td>
                <td>
                  <i className="fa fa-trash" style={{cursor: 'pointer'}}></i>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );

    const TabelTamu = ({items}) => (
      <table className="table table-striped mb-4">
        <thead>
          <tr>
            <th><input type="checkbox" value={this.state.allChecked} checked={this.state.allChecked} onChange={this.handleAllCheck} /></th>
            <th>Nama</th>
            <th>Email</th>
            <th>Telepon</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            items.map((item,i) => (
              <tr key={i}>
                <td>
                  <input type="checkbox" checked={item.checked} value={item.email} onClick={this.handleOneCheck} />
                </td>
                <td>{item.nama}</td>
                <td>{item.email}</td>
                <td>{item.telepon}</td>
                <td>{item.status ? 'Sudah Dikirim' : 'Belum Dikirim'}</td>
                <td>
                  <i className="fa fa-trash" style={{cursor: 'pointer'}}></i>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );

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
                        <input type="text" className="form-control" />
                        <small className="form-text text-muted">Judul tidak boleh menggunakan karakter spesial.</small>
                      </div>

                      <h4>Pilih Roles</h4>
                      {
                        this.state.userRoles.map((item,i) => (
                          <div className="form-group row">
                            <div className="col-sm-6">
                              <label className="bold">Nama</label>
                              <MultiSelect
                                  id={`userId${i}`}
                                  options={this.state.optionNames}
                                  value={this.state.userRoles[i].userId}
                                  onChange={e => this.handleDynamicMulti(e, i)}
                                  mode="single"
                                  enableSearch={true}
                                  resetable={true}
                                  valuePlaceholder="Silahkan Pilih User"
                                  allSelectedLabel="Silahkan Pilih User"
                                />
                            </div>
                            <div className="col-sm-6">
                              <label className="bold">Role</label>
                              <select name="roleId" onChange={e => this.handleDynamicInput(e, i)} value={this.state.userRoles[i].roleId} className="form-control">
                                <option value="">Pilih Role User</option>
                                {
                                  this.state.roles.map(item => (
                                    <option value={item.id}>{item.name}</option>
                                  ))
                                }
                              </select>
                            </div>
                          </div>    
                        ))
                      }

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

                      <button onClick={e => this.setState({ isModalDokumen: true })} className="mr-2 btn btn-sm btn-primary btn-v2">
                        <i className="fa fa-plus"></i> Tambah Folder Dokumen
                      </button>

                      <button onClick={e => this.setState({ isModalDokumen: true })} className="mr-2 btn btn-sm btn-primary btn-v2">
                        <i className="fa fa-download"></i> Download Semua Folder
                      </button>

                      <button onClick={e => this.setState({ isModalDokumen: true })} className="mr-2 float-right btn btn-sm btn-primary btn-v2">
                        <i className="fa fa-check"></i> Selesai
                      </button>

                      <div className="row" style={{background:'#FFF', borderRadius:4, padding:'10px 20px', marginBottom:10, marginTop:10}}>
                        {
                          this.state.navigation.map(item =>
                            item + ' > '
                          )
                        }
                      </div>
                      
                      
                      {
                        this.state.folder.length == 0 && this.state.files.length == 0 &&
                        <div className="form-group text-center">
                          <img src='/newasset/folder-kosong.svg' />

                          <h4 className="mt-3">Belum ada folder dokumen</h4>
                        </div>
                      }

                      {
                        this.state.folder.length &&
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

                          {
                            this.state.folder.map(item =>
                              <div className="folder" onDoubleClick={this.selectFolder.bind(this, item.id, item.name)}>
                                  <img
                                    src='assets/images/component/folder.png'
                                    className="folder-icon"
                                  />
                                  <div className="filename">
                                    {item.name}
                                  </div>
                              </div>
                            )
                          }

                          {
                            this.state.files.map(item =>
                              
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
                        </div>
                      }

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
                  Tambah Folder Dokumen
                </h5>

                <div style={{ marginTop: "20px" }} className="form-group">
                  <div className="form-group">
                    <input type="text" placeHolder="Nama Folder Dokumen" className="form-control" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Hak Akses</label>
                  <br/>
                  {
                    this.state.roles.map((item,i) => (
                      <label key={i} className="checkbox-inline" style={{margin: ".5rem"}}>
                        <input className="mr-2" type="checkbox" value={item.id} /> {item.name}
                      </label>
                    ))
                  }
                </div>
                
                <button
                  type="button"
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
          </div>
        }
      </div>
		);
	}
}