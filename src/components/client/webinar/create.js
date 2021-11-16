import React, { Component } from 'react';
import { Modal, Card, Form } from 'react-bootstrap';
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
    orientation: 'landscape',
    imagePreview: 'assets/images/no-image.png',
    image:'',
    isSaving: false,

    isStep1: true,
    judul: "",
    moderatorId: [],
    sekretarisId: [],
    pembicaraId: [],
    ownerId: [],

    engine: 'bbb',
    mode: 'web',

    isStep2: false,
    isStep3: false,
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
    valuesFolder: [],

    //form upload folder
    folderName: "",
    attachmentId: [],

    selectFolder: false,
    folderId: 0,
    prevFolderId: 0,

    checkZoom: [],

    navigation: ['Home'],

    // isModalDokumen: false,
    // isModalFile: false,
    modalNewFolder: false,
    modalUpload: false,
    alert: '',
    uploading: false,
    gb: [],

    // training
    optionsCourse: [],
    valueCourse: []
  }

  nextStep = e => {
    if (this.state.judul == '' || this.state.moderatorId == '' || this.state.sekretarisId == '' || this.state.ownerId == '' || this.state.pembicaraId == '' || (this.props.match.params.training === 'by-training' && this.state.valueCourse == '') || (this.props.match.params.training === 'default' && this.state.valuesFolder == '')) {
      toast.warning('Some field is required')
    }
    else {
      if (this.props.match.params.training === 'by-training'){
        this.setState({ isStep1: false, isStep2: false, isStep3: true })
      }
      else{
        this.setState({ isStep1: false, isStep2: true, isStep3: false })
      }
    }
  }
  nextStep2 = e => {
    this.setState({ isStep1: false, isStep2: false, isStep3: true })
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
    this.forceUpdate();
    this.fetchCheckAccess(Storage.get('user').data.grup_name.toLowerCase(), Storage.get('user').data.company_id, Storage.get('user').data.level, ['CRUD_ROLES'])
    this.fetchSyncZoom(Storage.get('user').data.user_id)
  }

  fetchSyncZoom(userId) {
    API.get(`${API_SERVER}v3/zoom/user/${userId}`).then(res => {
      if (res.status === 200) {
        this.setState({ checkZoom: res.data.result })
      }
    })
  }

  handleEngine(e) {
    if (e.target.value === 'zoom') {
      if (this.state.checkZoom.length !== 1) {
        toast.warning(`Silahkan konek dan sinkronisasi akun zoom Anda pada menu Pengaturan.`)
      }
      else {
        this.setState({ engine: e.target.value })
      }
    } else {
      this.setState({ engine: e.target.value })
    }
  }

  fetchData() {
    let sqlNotFromProject = `${API_SERVER}v1/user/company/${this.state.companyId}`;
    let sqlFromProject = `${API_SERVER}v2/project/user/${this.state.projectId}`;
    API.get(this.props.match.params.projectId != 0 ? sqlFromProject : sqlNotFromProject).then(response => {
      response.data.result.map(item => {
        this.state.optionNames.push({ value: item.user_id, label: item.name });
      });
      if (this.state.optionsFolder.length == 0) {
        API.get(`${API_SERVER}v1/folder/${this.state.companyId}/0`).then(response => {
          let optionsFolder = this.state.optionsFolder;
          response.data.result.map(item => {
            optionsFolder.push({ value: item.id, label: item.name });
          });
          this.setState({optionsFolder: optionsFolder},()=>{
            this.setState({valuesFolder: [Number(this.props.match.params.projectId)]})
            console.log('ALVIN',this.state.valuesFolder)
          })
        })
          .catch(function (error) {
            console.log(error);
          });
      }
    })

    if (this.props.match.params.training === 'by-training'){
      API.get(`${API_SERVER}v2/training/course-list-admin/${this.state.companyId}`).then(res => {
          if (res.data.error){
              toast.error(`Error read course list`)
          }
          else{
              res.data.result.map((item)=>{
                  this.state.optionsCourse.push({label: item.title, value: item.id})
              })
          }
      })
    }
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
    if (name == 'attachmentId') {
      this.setState({ [name]: e.target.files });
    } else {
      this.setState({ [name]: value });
    }
  }

  simpanWebinar = e => {
    e.preventDefault();
    this.setState({isSaving: true});
    let form = {
      companyId: this.state.companyId,
      judul: this.state.judul,
      moderatorId: this.state.moderatorId,
      sekretarisId: this.state.sekretarisId,
      pembicaraId: this.state.pembicaraId,
      ownerId: this.state.ownerId,
      projectId: this.state.valuesFolder,
      dokumenId: this.state.folderId,
      course_id: String(this.state.valueCourse),
      certificate_orientation: this.state.orientation,
      certificate_background: this.state.image,

      engine: this.state.engine,
      mode: this.state.mode
    }

    API.post(`${API_SERVER}v2/webinar/create`, form).then(res => {
      if (res.data.error){
        toast.warning("Error fetch API");
        this.setState({isSaving: false});
      }
      else{
        if (this.state.image){
          let formData = new FormData();
          formData.append("image", this.state.image)
          API.put(`${API_SERVER}v2/webinar/image/${res.data.result.id}`, formData).then(res2 => {
              if (res2.data.error){
                  toast.warning(`${this.state.level} created but fail to upload certificate background`);
                  this.setState({isSaving: false});
              }
              else{
                toast.success("Webinar created");
                this.setState({isSaving: false});
                this.props.history.goBack();
              }
          })
        }
        else{
          toast.success("Webinar created");
          this.setState({isSaving: false});
          this.props.history.goBack();
        }
      }
    })
  }

  selectedFolder = (val) => {
    this.setState({ folderId: val });
  }


  handleChange = e => {
    let {name, value} = e.target;
    if (name==='image'){
      if (e.target.files.length){
          if (e.target.files[0].size <= 5000000) {
            this.setState({
              image: e.target.files[0],
              imagePreview: URL.createObjectURL(e.target.files[0])
            });
          } else {
            e.target.value = null;
            toast.warning('Image size cannot larger than 5MB')
          }
      }
    }
}
  fetchCheckAccess(role, company_id, level, param) {
    API.get(`${API_SERVER}v2/global-settings/check-access`, { role, company_id, level, param }).then(res => {
      if (res.status === 200) {
        this.setState({ gb: res.data.result })
      }
    })
  }

  goback() {
    this.props.history.goBack();
  }

  render() {

    let crudRoles = this.state.gb.length && this.state.gb.filter(item => item.code === 'CRUD_ROLES')[0].status;

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
                        <i className="fa fa-chevron-left" style={{ margin: '0px' }}></i>
                      </Link>
                      Create a {this.props.match.params.training === 'by-training' ? 'Live Class' : 'Webinar'}
                    </h3>
                  </div>
                  <div className="col-sm-6 text-right">
                    <p className="m-b-0">
                      <span className="f-16 biru-bold mr-3">1. Set a Role&nbsp;&nbsp;&rang;</span>
                      {
                      this.props.match.params.training === 'by-training' ?
                      null
                      :
                      <span className={`f-16 mr-3`}>2. Organize Folders & Files &nbsp;&nbsp;&rang;</span>
                      }
                      {
                      this.props.match.params.training === 'by-training' ?
                      <span className={`f-16 mr-3`}>2. Certification &nbsp;&nbsp;&rang;</span>
                      :
                      <span className={`f-16 mr-3`}>3. Certification &nbsp;&nbsp;&rang;</span>
                      }
                      <span className="f-16"> Done </span>
                    </p>
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <div className="row">
                    <div className="col-sm-12">

                      <div className="form-group">
                        <label className="bold">Title<required>*</required></label>
                        <input type="text" value={this.state.judul} onChange={e => this.setState({ judul: e.target.value })} className="form-control" />
                        <small className="form-text text-muted">Do not use special character for Webinar Title</small>
                      </div>
                      {
                        this.props.match.params.training !== 'by-training' ?
                          <div className="form-group">
                            <label className="bold">Project{this.props.match.params.training === 'default' ? <required>*</required> : null}</label>
                            <MultiSelect
                              id="folder"
                              options={this.state.optionsFolder}
                              value={this.state.valuesFolder}
                              onChange={valuesFolder => this.setState({ valuesFolder })}
                              mode="single"
                              enableSearch={true}
                              resetable={true}
                              valuePlaceholder="Select project folder"
                            />
                            <small className="form-text text-muted">Pilih project folder.</small>
                          </div>
                          :
                          null
                      }

                      {/* <Form.Group className="row" controlId="formJudul">
                        <div className="col-sm-6">
                          <Form.Label className="f-w-bold">Engine</Form.Label>
                          <select value={this.state.engine} onChange={e => this.handleEngine(e)} name="engine" className="form-control">
                            <option value="bbb">ICADEMY</option>
                            <option value="zoom">Zoom</option>
                          </select>
                          <Form.Text className="text-muted">
                            Choose meeting engine
                          </Form.Text>
                        </div>
                      </Form.Group> */}

                      <h4>Roles</h4>
                      <div className="form-group row">
                        <div className="col-sm-3">
                          <label className="bold">Role</label>
                          <input type="text" className="form-control" value="Secretary" disabled="disabled" />
                        </div>
                        <div className="col-sm-9">
                          <label className="bold">Secretary<required>*</required></label>
                          {
                            crudRoles ?
                              <MultiSelect
                                id={`sekretarisId`}
                                options={this.state.optionNames}
                                value={this.state.sekretarisId}
                                onChange={sekretarisId => this.setState({ sekretarisId })}
                                mode="tags"
                                enableSearch={true}
                                resetable={true}
                                valuePlaceholder="Select User"
                                allSelectedLabel="Select User"
                              />
                              :
                              <small className="form-text text-muted">Sorry. access denied</small>
                          }
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col-sm-3">
                          <label className="bold">Role</label>
                          <input type="text" className="form-control" value="Moderator" disabled="disabled" />
                        </div>
                        <div className="col-sm-9">
                          <label className="bold">Moderator<required>*</required></label>
                          {
                            crudRoles ?
                              <MultiSelect
                                id={`moderatorId`}
                                options={this.state.optionNames}
                                value={this.state.moderatorId}
                                onChange={moderatorId => this.setState({ moderatorId })}
                                mode="tags"
                                enableSearch={true}
                                resetable={true}
                                valuePlaceholder="Select User"
                                allSelectedLabel="Select User"
                              />
                              :
                              <small className="form-text text-muted">Sorry. access denied</small>
                          }
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col-sm-3">
                          <label className="bold">Role</label>
                          <input type="text" className="form-control" value="Speaker" disabled="disabled" />
                        </div>
                        <div className="col-sm-9">
                          <label className="bold">Speaker<required>*</required></label>
                          {
                            crudRoles ?
                              <MultiSelect
                                id={`pembicaraId`}
                                options={this.state.optionNames}
                                value={this.state.pembicaraId}
                                onChange={pembicaraId => this.setState({ pembicaraId })}
                                mode="tags"
                                enableSearch={true}
                                resetable={true}
                                valuePlaceholder="Select User"
                                allSelectedLabel="Select User"
                              />
                              :
                              <small className="form-text text-muted">Sorry. access denied</small>
                          }
                        </div>
                      </div>

                      <div className="form-group row">
                        <div className="col-sm-3">
                          <label className="bold">Role</label>
                          <input type="text" className="form-control" value="Owner" disabled="disabled" />
                        </div>
                        <div className="col-sm-9">
                          <label className="bold">Owner<required>*</required></label>
                          {
                            crudRoles ?
                              <MultiSelect
                                id={`ownerId`}
                                options={this.state.optionNames}
                                value={this.state.ownerId}
                                onChange={ownerId => this.setState({ ownerId })}
                                mode="tags"
                                enableSearch={true}
                                resetable={true}
                                valuePlaceholder="Select User"
                                allSelectedLabel="Select User"
                              />
                              :
                              <small className="form-text text-muted">Sorry. access denied</small>
                          }
                        </div>
                      </div>
                      {
                        this.props.match.params.training === 'by-training' &&
                        <div className="form-section no-border">
                          <div className="row">
                            <div className="col-sm-12 m-b-20">
                              <strong className="f-w-bold" style={{ color: '#000', fontSize: '15px' }}>Assign to Course</strong>
                            </div>
                          </div>
                          <div className="row">
                            <div className="form-field-top-label" style={{ width: 400 }}>
                              <label for="valueCourse">Course<required>*</required></label>
                              <MultiSelect id="valueCourse" options={this.state.optionsCourse} value={this.state.valueCourse} onChange={valueCourse => this.setState({ valueCourse })} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Course" />
                              <p className="form-notes">Keep empty if you don't want to assign to course</p>
                            </div>
                          </div>
                        </div>
                      }

                    </div>
                    <div className="col-sm-12">
                      <button onClick={e => this.nextStep(e)} className="btn btn-icademy-primary float-right" style={{ padding: "7px 8px !important", marginLeft: 14 }}>
                        Continue
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
                      <a onClick={e => { e.preventDefault(); this.setState({ isStep1: true, isStep2: false, isStep3: false }) }} className="btn btn-sm mr-4" style={{
                        border: '1px solid #e9e9e9',
                        borderRadius: '50px',
                      }}>
                        <i className="fa fa-chevron-left" style={{ margin: '0px' }}></i>
                      </a>
                      Document & Folder
                    </h3>
                  </div>
                  <div className="col-sm-6 text-right">
                    <p className="m-b-0">
                      <span className="f-16 biru-bold mr-3">1. Set a Role&nbsp;&nbsp;&rang;</span>
                      <span className={`f-16 biru-bold mr-3`}>2. Organize Folders & Files &nbsp;&nbsp;&rang;</span>
                      <span className={`f-16 mr-3`}>3. Certification &nbsp;&nbsp;&rang;</span>
                      <span className="f-16"> Done </span>
                    </p>
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <div className="row">

                    <div className="col-sm-12">
                      <div id="scrollin" style={{ height: '492px', marginBottom: '0px', overflowY: 'scroll' }}>
                        <TableFiles access_project_admin={true} projectId={this.state.projectId} selectedFolder={this.selectedFolder} />
                      </div>
                    </div>
                    <div className="col-sm-12">
                      <button onClick={e => this.nextStep2(e)} className="btn mt-2 btn-icademy-primary float-right" style={{ padding: "7px 8px !important", marginLeft: 14 }}>
                        Continue
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
                  Add Document File
                </h5>

                {
                  !this.state.isModalFile &&
                  <div style={{ marginTop: "20px" }} className="form-group">
                    <div className="form-group">
                      <input onChange={e => this.setState({ nameFile: e.target.value })} type="text" placeHolder="Name" className="form-control" />
                    </div>
                  </div>
                }

                {
                  this.state.isModalFile &&
                  <div style={{ marginTop: "20px" }} className="form-group">
                    <div className="form-group">
                      <input onChange={this.handleFile} type="file" placeHolder="Name" className="form-control" />
                    </div>
                  </div>
                }

                <div className="form-group">
                  <label>Hak Akses</label>
                  <br />
                  <label className="checkbox-inline" style={{ margin: ".5rem" }}>
                    <input className="mr-2" onChange={this.handleCheckbox} name="accessSekretaris" type="checkbox" value="Sekretaris" /> Sekretaris
                  </label>
                  <label className="checkbox-inline" style={{ margin: ".5rem" }}>
                    <input className="mr-2" onChange={this.handleCheckbox} name="accessModerator" type="checkbox" value="Moderator" /> Moderator
                  </label>
                  <label className="checkbox-inline" style={{ margin: ".5rem" }}>
                    <input className="mr-2" onChange={this.handleCheckbox} name="accessPembicara" type="checkbox" value="Pembicara" /> Pembicara
                  </label>
                  <label className="checkbox-inline" style={{ margin: ".5rem" }}>
                    <input className="mr-2" onChange={this.handleCheckbox} name="accessPeserta" type="checkbox" value="Peserta" /> Peserta
                  </label>
                </div>

                <button
                  type="button"
                  onClick={this.onClickFile}
                  className="btn btn-v2 btn-primary f-w-bold mr-2"
                >
                  <i className="fa fa-save"></i>
                  Save
                </button>
                <button
                  type="button"
                  className="btn btn-v2 f-w-bold"
                  onClick={this.handleModal}
                >
                  Close
                </button>
              </Modal.Body>
            </Modal>
          </div>
        }
        {/** STEP 3 */}
        {
          this.state.isStep3 &&
          <div className="col-sm-12">
            <Card>
              <Card.Body>
                <div className="row">
                  <div className="col-sm-6">
                    <h3 className="f-w-900 f-18 fc-blue">
                      <a onClick={e => { e.preventDefault(); this.setState({ isStep1: false, isStep2: true, isStep3: false }) }} className="btn btn-sm mr-4" style={{
                        border: '1px solid #e9e9e9',
                        borderRadius: '50px',
                      }}>
                        <i className="fa fa-chevron-left" style={{ margin: '0px' }}></i>
                      </a>
                      Certification
                    </h3>
                  </div>
                  <div className="col-sm-6 text-right">
                    <p className="m-b-0">
                      <span className="f-16 biru-bold mr-3">1. Set a Role&nbsp;&nbsp;&rang;</span>
                      {
                      this.props.match.params.training === 'by-training' ?
                      null
                      :
                      <span className={`f-16 biru-bold mr-3`}>2. Organize Folders & Files &nbsp;&nbsp;&rang;</span>
                      }
                      {
                      this.props.match.params.training === 'by-training' ?
                      <span className={`f-16 biru-bold mr-3`}>2. Certification &nbsp;&nbsp;&rang;</span>
                      :
                      <span className={`f-16 biru-bold mr-3`}>3. Certification &nbsp;&nbsp;&rang;</span>
                      }
                      <span className="f-16"> Done </span>
                    </p>
                  </div>
                </div>
                <div style={{ marginTop: '10px' }}>
                  <div className="row">

                    <div className="col-sm-12">
                      <div id="scrollin" style={{ height: '492px', marginBottom: '0px', overflowY: 'scroll' }}>
                        <div className="form-field-top-label">
                          <label for="training_company_id">Paper Orientation</label>
                          <div className="paper-orientation">
                            <div className={`paper-select ${this.state.orientation === 'landscape' && 'selected'}`} onClick={()=> this.setState({orientation: 'landscape'})}>
                              <div className="paper-landscape">
                                Landscape
                              </div>
                            </div>
                            <div className={`paper-select ${this.state.orientation === 'portrait' && 'selected'}`} onClick={()=> this.setState({orientation: 'portrait'})}>
                              <div className="paper-portrait">
                                Portrait
                              </div>
                            </div>
                          </div>
                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="image">Certificate Background</label>
                                                            <center>
                                                                <label style={{cursor:'pointer', borderRadius:'4px', overflow:'hidden'}}>
                                                                    <a href={this.state.imagePreview} target="_blank">
                                                                        <img src={this.state.imagePreview} style={{objectFit:'cover', width: '54.8px', height: '54.8px'}} />
                                                                    </a>
                                                                </label>
                                                                <label for='image' style={{cursor:'pointer', overflow:'hidden', display: 'block'}}>
                                                                    <div className="button-bordered-grey">
                                                                        {this.state.image ? this.state.image.name : 'Choose file'}
                                                                    </div>
                                                                </label>
                                                            </center>
                                                            <input type="file" accept="image/*" name="image" id="image" onChange={this.handleChange}/>
                                                        </div>
                      </div>
                    </div>
                    <div className="col-sm-12">
                      <button disabled={this.state.isSaving} onClick={this.simpanWebinar} className="btn mt-2 btn-icademy-primary float-right" style={{ padding: "7px 8px !important", marginLeft: 14 }}>
                        <i className="fa fa-save"></i> &nbsp; {this.state.isSaving ? 'Saving...' : 'Save'}
                      </button>
                    </div>
                  </div>

                </div>
              </Card.Body>
            </Card>
          </div>
        }
      </div>
    );
  }
}
