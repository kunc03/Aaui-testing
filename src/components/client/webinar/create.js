import React, { Component } from 'react';
import { Modal, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import API, { API_SERVER } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { toast } from "react-toastify";
import TableFiles from '../../files/_files';
import { MultiSelect } from 'react-sm-select';

export default class WebinarCreate extends Component {

	state = {
    companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : Storage.get('user').data.company_id,
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

    optionsFolder: [],
    valuesFolder: this.props.match.params.projectId !== '0' ? [Number(this.props.match.params.projectId)] : [],

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

  nextStep(){
    if (this.state.valuesFolder == '' || this.state.judul == '' || this.state.moderatorId == '' || this.state.sekretarisId == '' || this.state.ownerId == '' || this.state.pembicaraId == ''){
      toast.warning('Semua field wajib diisi dengan benar')}
    else{
      this.setState({isStep1: false, isStep2: true})
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
    this.forceUpdate()
  }

  fetchData() {
    let sqlNotFromProject = `${API_SERVER}v1/user/company/${this.state.companyId}`;
    let sqlFromProject = `${API_SERVER}v2/project/user/${this.state.projectId}`;
    API.get(this.props.match.params.projectId != 0 ? sqlFromProject : sqlNotFromProject).then(response => {
      response.data.result.map(item => {
        this.state.optionNames.push({value: item.user_id, label: item.name});
      });
      if (this.state.optionsFolder.length==0){
        API.get(`${API_SERVER}v1/folder/${this.state.companyId}/0`).then(response => {
          response.data.result.map(item => {
            this.state.optionsFolder.push({value: item.id, label: item.name});
          });
        })
        .catch(function(error) {
          console.log(error);
        });
      }
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
      companyId: this.state.companyId,
      judul: this.state.judul,
      moderatorId: this.state.moderatorId[0],
      sekretarisId: this.state.sekretarisId[0],
      pembicaraId: this.state.pembicaraId[0],
      ownerId: this.state.ownerId[0],
      projectId: this.state.valuesFolder,
      dokumenId: this.state.folderId
    }


    API.post(`${API_SERVER}v2/webinar/create`, form).then(res => {
      if(res.data.error) 
        toast.warning("Error fetch API")
      else
        toast.success("Berhasil menambah webinar")
        this.props.history.goBack();
    })
  }

  goback(){
    this.props.history.goBack();
  }

	render() {

    console.log('STATE: ', this.state);

    // let levelUser = 'admin';

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
                    	<Link onClick={this.goback.bind(this)} className="btn btn-sm mr-4" style={{
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
                      <span className="f-16 biru-bold mr-3">1. Tetapkan Role &nbsp;&nbsp;&bull;</span>
                      <span className={`f-16 mr-3`}>2. Atur Folder & File &nbsp;&nbsp;&bull;</span>
                      <span className="f-16">Selesai</span>
                    </p>
                  </div>
                </div>
                <div style={{marginTop: '10px'}}>
                  <div className="row">
                    <div className="col-sm-12">
                      
                    <div className="form-group">
                        <label className="bold">Judul Webinar</label>
                        <input type="text" value={this.state.judul} onChange={e => this.setState({ judul: e.target.value })} className="form-control" />
                        <small className="form-text text-muted">Judul tidak boleh menggunakan karakter spesial.</small>
                      </div>
                      {
                        this.state.projectId == 0 ?
                        <div className="form-group">
                          <label className="bold">Project</label>
                          <MultiSelect
                              id="folder"
                              options={this.state.optionsFolder}
                              value={this.state.valuesFolder}
                              onChange={valuesFolder => this.setState({ valuesFolder })}
                              mode="single"
                              enableSearch={true}
                              resetable={true}
                              valuePlaceholder="Pilih Folder Project"
                            />
                          <small className="form-text text-muted">Pilih project folder.</small>
                        </div>
                        :
                        null
                      }

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

                    </div>
                    <div className="col-sm-12">
                      <button onClick={this.nextStep.bind(this)} className="btn btn-icademy-primary float-right" style={{ padding: "7px 8px !important", marginLeft:14 }}>
                        <i className="fa fa-file"></i> &nbsp; Atur Folder dan File
                      </button>
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
                      <span className="f-16 biru-bold mr-3">1. Tetapkan Role &nbsp;&nbsp;&bull;</span>
                      <span className={`f-16 biru-bold mr-3`}>2. Atur Folder & File &nbsp;&nbsp;&bull;</span>
                      <span className="f-16">Selesai</span>
                    </p>
                  </div>
                </div>
                <div style={{marginTop: '10px'}}>
                  <div className="row">

                    <div className="col-sm-12">
                      <div id="scrollin" style={{height:'492px', marginBottom: '0px', overflowY:'scroll'}}>
                        <TableFiles access_project_admin={true} projectId={this.state.projectId}/>
                      </div>
                    </div>
                    <div className="col-sm-12">
                      <button onClick={this.simpanWebinar} className="btn mt-2 btn-icademy-primary float-right" style={{ padding: "7px 8px !important", marginLeft:14 }}>
                        <i className="fa fa-save"></i> &nbsp; Simpan Webinar
                      </button>
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
          </div>
        }
      </div>
		);
	}
}