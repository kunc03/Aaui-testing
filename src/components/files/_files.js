import React, { Component } from "react";
import { Link } from "react-router-dom";
import API, { API_SERVER, APPS_SERVER, USER_ME, BBB_KEY, BBB_URL } from '../../repository/api';
// import '../ganttChart/node_modules/@trendmicro/react-dropdown/dist/react-dropdown.css';
import {Alert, Modal, Form, Card, Button, Row, Col} from 'react-bootstrap';

import Storage from '../../repository/storage';
import { toast } from "react-toastify";
const bbb = require('bigbluebutton-js')


class FilesTable extends Component {
  constructor(props) {
    super(props);

    // this._deleteUser = this._deleteUser.bind(this);

    this.state = {
      users: [],
      role:[],
      dataUser: [],
      selectFolder:false,
      classRooms:[],
      folderId:0,
      companyId: localStorage.getItem('companyID'),
      folder:[],
      files:[],
      mom:[],
      recordedMeeting:[],
      prevFolderId:0,
      folderName : '',
      modalNewFolder : false,
      modalEditFolder: false,
      modalUpload: false,
      isUploading: false,
      isLoading: false,
      attachmentId:[],
      dataRecordings: [],
      editProjectName: '',
      editProjectId: '',
      modalDelete: false,
      deleteProjectName: '',
      deleteProjectId: '',

      modalDeleteFile: false,
      deleteFileName: '',
      deleteFileId: '',

      //access role webinar
      aSekretaris: true,
      aModerator: true,
      aPembicara: true,
      aOwner: true,
      aPeserta: true,
    };
  }

  handleCheck (role) {
    if (role == 'sekretaris'){
      this.setState({ aSekretaris: !this.state.aSekretaris }); 
    }
    else if (role == 'moderator'){
      this.setState({ aModerator: !this.state.aModerator }); 
    }
    else if (role == 'pembicara'){
      this.setState({ aPembicara: !this.state.aPembicara }); 
    }
    else if (role == 'owner'){
      this.setState({ aOwner: !this.state.aOwner }); 
    }
    else if (role == 'peserta'){
      this.setState({ aPeserta: !this.state.aPeserta }); 
    }
  }
  closeModalAdd = e => {
    this.setState({
      folderName: '',
      modalNewFolder:false,
      aSekretaris: true,
      aModerator: true,
      aPembicara: true,
      aOwner: true,
      aPeserta: true,
    })
  }
  closeModalEdit = e => {
    this.setState({
      editProjectName: '',
      modalEditFolder:false,
      aSekretaris: true,
      aModerator: true,
      aPembicara: true,
      aOwner: true,
      aPeserta: true,
    })
  }
  closeModalUpload = e => {
    this.setState({modalUpload:false})
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
            this.setState({uploading: false, attachmentId: []});
            toast.error('Error : '+res.data.result)
          } else {
            this.setState({modalUpload:false, uploading: false, attachmentId: []})
            this.fetchFile(this.state.folderId)
            toast.success('Berhasil upload file')
          }
        }
      })
    }
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
saveFolder = e => {
  e.preventDefault();
  const formData = {
    name: this.state.folderName,
    company: this.state.companyId,
    mother: this.state.folderId,
    aSekretaris: this.state.aSekretaris ? 1 : 0,
    aModerator: this.state.aModerator ? 1 : 0,
    aPembicara: this.state.aPembicara ? 1 : 0,
    aOwner: this.state.aOwner ? 1 : 0,
    aPeserta: this.state.aPeserta ? 1 : 0
  };

  API.post(`${API_SERVER}v1/folder`, formData).then(res => {
    // console.log('ALVIN', res)
    if(res.status === 200) {
      if(res.data.error) {
        toast.error('Error : '+res.data.result)
      } else {
        this.closeModalAdd()
        this.fetchFolder(this.state.folderId);
        toast.success('Berhasil menambah folder baru')
      }
    }
  })
}
openModalEdit(id){
  API.get(`${API_SERVER}v1/project-read/${id}`).then(res => {
    if (res.status === 200) {
      this.setState({
        editProjectId: id,
        editProjectName: res.data.result.name,
        modalEditFolder: true,
        aSekretaris: res.data.result.sekretaris,
        aModerator: res.data.result.moderator,
        aPembicara: res.data.result.pembicara,
        aOwner: res.data.result.owner,
        aPeserta: res.data.result.peserta,
      })
    }
  })
}

editFolder(){
  let form = {
    name: this.state.editProjectName,
    aSekretaris: this.state.aSekretaris ? 1 : 0,
    aModerator: this.state.aModerator ? 1 : 0,
    aPembicara: this.state.aPembicara ? 1 : 0,
    aOwner: this.state.aOwner ? 1 : 0,
    aPeserta: this.state.aPeserta ? 1 : 0
  }
  API.put(`${API_SERVER}v1/project/${this.state.editProjectId}`, form).then(res => {
    if(res.status === 200) {
      if(res.data.error) {
        toast.error(`Gagal mengubah project ${this.state.editProjectName}`)
      } else {
        toast.success(`Berhasil mengubah project ${this.state.editProjectName}`)
        this.setState({editProjectId:'', editProjectName: ''})
        this.fetchFolder(this.state.folderId)
        this.closeModalEdit()
      }
    }
  })
}
  async fetchFolder(mother){
    let userId = Storage.get('user').data.user_id;
    let form = {}
    if (this.props.webinarId)
    {
      let apiUrl = this.props.guest ?
      `${API_SERVER}v2/webinar/tamu/one/${this.props.webinarId}`
      :
      `${API_SERVER}v2/webinar/one/${this.props.webinarId}`
      await API.get(apiUrl).then(res => {
        if(res.data.error) toast.warning("Gagal fetch API");
        form = {
          aSekretaris: userId == res.data.result.sekretaris[0].user_id ? 1 : 0,
          aModerator: userId == res.data.result.moderator[0].user_id ? 1 : 0,
          aPembicara: userId == res.data.result.pembicara[0].user_id ? 1 : 0,
          aOwner: userId == res.data.result.owner[0].user_id ? 1 : 0,
          aPeserta: res.data.result.peserta.filter((item) => item.user_id == userId).length || res.data.result.tamu.filter((item) => item.voucher == this.props.voucherTamu).length ? 1 : 0,
        }
      })
    }
    else
    {
      form = {
        aSekretaris: 1,
        aModerator: 1,
        aPembicara: 1,
        aOwner: 1,
        aPeserta: 1
      }
    }
    this.setState({role: form})
    
    API.get(`${API_SERVER}v1/folder/${this.state.companyId}/${mother}`, this.state.role).then(res => {
      if (res.status === 200) {
        this.setState({folder: res.data.result})
        console.log('ALVIN RES PROJECT', this.state.folder)
      }
    })
    API.get(`${API_SERVER}v1/folder/back/${this.state.companyId}/${mother}`).then(res => {
      if (res.status === 200) {
        this.setState({prevFolderId: res.data.result})
      }
    })
  }
selectFolder(id, name) {
  this.setState({ isLoading: true }, () => {
  this.fetchFolder(id)
  this.fetchFile(id)
  this.fetchMOM(id)
  this.fetchRekaman(id)
  this.fetchRekamanBBB(id)
  this.setState({selectFolder: id == this.props.projectId ? false : true, folderId: id})
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
    this.setState({recordedMeeting:[], isLoading: false})
  }
  else{
    API.get(`${API_SERVER}v1/files-recorded/${folder}`).then(res => {
      if(res.status === 200) {
        this.setState({
          recordedMeeting : res.data.result,
        })
      }
    })
  }
}

fetchRekamanBBB(folder){
  let levelUser = Storage.get('user').data.level;
  let userId = Storage.get('user').data.user_id;
  if (folder == 0){
    this.setState({dataRecordings:[], isLoading: false})
  }
  else{
        API.get(
          `${API_SERVER}v1/liveclass/project/${levelUser}/${userId}/${folder}`
        ).then((res) => {
          if (res.status === 200) {
            let data = res.data.result;
            // BBB GET MEETING RECORD
            let api = bbb.api(BBB_URL, BBB_KEY)
            let http = bbb.http
            if (data.length > 0){
              data.map((item) => {
                let getRecordingsUrl = api.recording.getRecordings({meetingID: item.class_id})
                http(getRecordingsUrl).then((result) => {
                  if (result.returncode='SUCCESS' && result.messageKey!='noRecordings'){
                    this.state.dataRecordings.push(result.recordings)
                    this.forceUpdate()
                  }
                  else{
                    console.log('GAGAL', result)
                  }
                })
              })
            }
            else{
              this.setState({dataRecordings:[]})
              this.forceUpdate()
            }
            // BBB END
            this.setState({
              isLoading: false
            })
          }
        });
  }
}

fetchData(){
  if (this.props.companyId){
    this.setState({companyId: this.props.companyId})
    this.selectFolder(this.props.projectId)
  }
  else{
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if (res.status === 200) {
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
        this.selectFolder(this.props.projectId)
      }
    })
  }
}

dialogDelete(id, name){
  this.setState({
    deleteProjectId: id,
    deleteProjectName: name,
    modalDelete: true
  })
}
dialogDeleteFile(id, name){
  this.setState({
    deleteFileId: id,
    deleteFileName: name,
    modalDeleteFile: true
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
        this.fetchFolder(this.state.folderId);
      }
    }
  })
}
deleteFile(){
  API.delete(`${API_SERVER}v1/project-file/${this.state.deleteFileId}`).then(res => {
    if(res.status === 200) {
      if(res.data.error) {
        toast.error(`Gagal menghapus project ${this.state.deleteProjectName}`)
      } else {
        toast.success(`Berhasil menghapus project ${this.state.deleteProjectName}`)
        this.setState({deleteFileId:'', deleteFileName: '',modalDeleteFile: false})
        this.fetchFile(this.state.folderId);
      }
    }
  })
}
closeModalDelete = e => {
  this.setState({modalDelete:false, deleteProjectName:'', deleteProjectId:'', alert:''})
}
closeModalDeleteFile = e => {
  this.setState({modalDeleteFile:false, deleteFileName:'', deleteFileId:'', alert:''})
}

filesLogs(e) {
  let data = {
    id: e.id,
    filename: e.name,
    folder: e.folder_id,
    url: e.location
  };
  API.post(`${API_SERVER}v1/files-logs`, data)
    .then(res => {console.log(res)});
}

componentDidMount(){
  this.fetchData()
}

  render() {
    const headerTabble = [
      // {title : 'Date', width: null, status: true},
      // {title : 'By', width: null, status: true},
      // {title : 'Size', width: null, status: true},
      {title : '', width: null, status: true},
    ];
    const bodyTabble = this.state.folder;
    const access_project_admin = this.props.access_project_admin;
		let access = Storage.get('access');
		let levelUser = Storage.get('user').data.level;
    return (
            <div className="card p-20">
            <span className="mb-4">
                <strong className="f-w-bold f-18 fc-skyblue ">Files</strong>
                <button
                onClick={e=>this.setState({modalUpload:true})}
                className="btn btn-icademy-primary float-right"
                style={{ padding: "7px 8px !important", marginLeft:14 }}
                >
                <i className="fa fa-upload"></i>
                
                Upload
                </button>

                {access_project_admin == true ? <button
                onClick={e=>this.setState({modalNewFolder:true})}
                className="btn btn-icademy-primary float-right"
                style={{ padding: "7px 8px !important" }}
                >
                <i className="fa fa-plus"></i>
                
                Folder
                </button> : null}
                {/* <input 
                    type="text"
                    placeholder="Search"
                    className="form-control float-right col-sm-3"/> */}
            </span>
            <div className="table-responsive" style={{overflowX: 'hidden', overflowY: this.props.scrollHeight ? 'scroll' : 'auto', height: this.props.scrollHeight ? this.props.scrollHeight : 'auto'}}>
                <table className="table table-hover">
                <thead>
                    <tr style={{borderBottom: '1px solid #C7C7C7'}}>
                    <td>Files</td>
                    {
                        headerTabble.map((item, i) => {
                            return (
                            <td align="center" width={item.width}>{item.title}</td>
                            )
                        })
                    }
                    </tr>
                </thead>
                    {
                        bodyTabble.length == 0 && this.state.files.length == 0 && this.state.mom.length == 0 && this.state.recordedMeeting.length == 0 && (this.props.projectId == this.state.folderId)?
                        <tbody>
                          <tr>
                              <td className="fc-muted f-14 f-w-300 p-t-20" colspan='9'>Tidak ada</td>
                          </tr>
                        </tbody>
                        :
                        this.state.isLoading == true ?
                        <tbody>
                          <tr>
                              <td className="fc-muted f-14 f-w-300 p-t-20" colspan='9'>Loading...</td>
                          </tr>
                        </tbody>
                        :
                        <tbody>
                        {
                              this.state.folderId !== 0 &&
                              this.state.selectFolder &&
                              <tr style={{borderBottom: '1px solid #DDDDDD'}}>
                                  <td colspan='2' className="fc-muted f-14 f-w-300 p-t-20" style={{cursor:'pointer'}} onClick={this.selectFolder.bind(this,this.state.prevFolderId, null)}>
                                      <img src='assets/images/component/folder-back.png' width="32"/> &nbsp;Kembali</td>
                              </tr>
                        }
                        {
                        bodyTabble.map(item =>{
                          if ((item.sekretaris == 1 && item.sekretaris == this.state.role.aSekretaris) ||
                          (item.moderator == 1 && item.moderator == this.state.role.aModerator) ||
                          (item.pembicara == 1 && item.pembicara == this.state.role.aPembicara) ||
                          (item.owner == 1 && item.owner == this.state.role.aOwner) ||
                          (item.peserta == 1 && item.peserta == this.state.role.aPeserta)){
                            return(<tr style={{borderBottom: '1px solid #DDDDDD'}}>
                                <td className="fc-muted f-14 f-w-300 p-t-20" style={{cursor:'pointer'}} onClick={this.selectFolder.bind(this, item.id, item.name)}>
                                    <img src='assets/images/component/folder.png' width="32"/> &nbsp;{item.name}</td>
                                {/* <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.date}</td> */}
                                {/* <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.by}</td> */}
                                {/* <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.size}</td> */}
                                <td className="fc-muted f-14 f-w-300 p-t-10" align="center">
                                    {
                                      access_project_admin ?
                                  <span class="btn-group dropleft col-sm-1">
                                    <button style={{padding:'6px 18px', border:'none', marginBottom:0, background:'transparent'}} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      <i
                                        className="fa fa-ellipsis-v"
                                        style={{ fontSize: 14, marginRight:0, color:'rgb(148 148 148)' }}
                                      />
                                    </button>
                                      <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{fontSize:14, padding:5, borderRadius:0}}>
                                        <button
                                          style={{cursor:'pointer'}}
                                          class="dropdown-item"
                                          type="button"
                                          onClick={this.openModalEdit.bind(this, item.id)}
                                        >
                                            Ubah
                                        </button>
                                        <button style={{cursor:'pointer'}} class="dropdown-item" type="button" onClick={this.dialogDelete.bind(this, item.id, item.name)}>Hapus</button>
                                      </div>
                                  </span>
                                      :
                                      null
                                    }
                                </td>
                            </tr>)
                            }
                            else{
                              return(null)
                            }
                          })
                        }
                        {
                        this.state.files.map(item =>
                            <tr style={{borderBottom: '1px solid #DDDDDD'}}>
                                <td className="fc-muted f-14 f-w-300 p-t-20">
                                    <img src={
                                    item.type == 'png' || item.type == 'pdf' || item.type == 'doc' || item.type == 'docx' || item.type == 'ppt' || item.type == 'pptx' || item.type == 'rar' || item.type == 'zip' || item.type == 'jpg' || item.type == 'csv'
                                    ? `assets/images/files/${item.type}.svg`
                                    : 'assets/images/files/file.svg'
                                  } width="32"/> &nbsp;{item.name}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-10" align="center">
                                  <span class="btn-group dropleft col-sm-1">
                                    <button style={{padding:'6px 18px', border:'none', marginBottom:0, background:'transparent'}} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      <i
                                        className="fa fa-ellipsis-v"
                                        style={{ fontSize: 14, marginRight:0, color:'rgb(148 148 148)' }}
                                      />
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{fontSize:14, padding:5, borderRadius:0}}>
                                      <button
                                        style={{cursor:'pointer'}}
                                        class="dropdown-item"
                                        type="button"
                                        onClick={ e => {
                                          this.filesLogs(item);
                                          window.open(item.location, 'Downloading files');
                                        }}
                                      >
                                          Download
                                      </button>
                                      {
                                        access_project_admin ?
                                        <button style={{cursor:'pointer'}} class="dropdown-item" type="button" onClick={this.dialogDeleteFile.bind(this, item.id, item.name)}>Hapus</button>
                                        :
                                        null
                                      }
                                    </div>
                                  </span>
                                </td>
                            </tr>
                          )
                        }
                        {
                        this.state.mom.map(item =>
                            <tr style={{borderBottom: '1px solid #DDDDDD'}}>
                                <td className="fc-muted f-14 f-w-300 p-t-20">
                                    <img src='assets/images/files/pdf.svg' width="32"/> &nbsp;MOM : {item.title}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-10" align="center">
                                  <span class="btn-group dropleft col-sm-1">
                                    <button style={{padding:'6px 18px', border:'none', marginBottom:0, background:'transparent'}} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      <i
                                        className="fa fa-ellipsis-v"
                                        style={{ fontSize: 14, marginRight:0, color:'rgb(148 148 148)' }}
                                      />
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{fontSize:14, padding:5, borderRadius:0}}>
                                      <button
                                        style={{cursor:'pointer'}}
                                        class="dropdown-item"
                                        type="button"
                                        onClick={e=>window.open(`${APPS_SERVER}mom/?id=${item.id}`, 'Downloading files')}
                                      >
                                          Print PDF
                                      </button>
                                      {/* <button style={{cursor:'pointer'}} class="dropdown-item" type="button" onClick={()=>toast.warning('Coming Soon')}>Hapus</button> */}
                                    </div>
                                  </span>
                                </td>
                            </tr>
                        )
                        }
                        {
                        this.state.recordedMeeting.map(item =>
                          item.record && item.record.split(',').map(item =>
                            <tr style={{borderBottom: '1px solid #DDDDDD'}}>
                                <td className="fc-muted f-14 f-w-300 p-t-20">
                                    <img src='assets/images/files/mp4.svg' width="32"/> &nbsp;{item.substring(40)}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-10" align="center">
                                  <span class="btn-group dropleft col-sm-1">
                                    <button style={{padding:'6px 18px', border:'none', marginBottom:0, background:'transparent'}} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      <i
                                        className="fa fa-ellipsis-v"
                                        style={{ fontSize: 14, marginRight:0, color:'rgb(148 148 148)' }}
                                      />
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{fontSize:14, padding:5, borderRadius:0}}>
                                      <button
                                        style={{cursor:'pointer'}}
                                        class="dropdown-item"
                                        type="button"
                                        onClick={e=>window.open(item, 'Rekaman Meeting')}
                                      >
                                          Download
                                      </button>
                                      {/* <button style={{cursor:'pointer'}} class="dropdown-item" type="button" onClick={()=>toast.warning('Coming Soon')}>Hapus</button> */}
                                    </div>
                                  </span>
                                </td>
                            </tr>
                            )
                        )
                        }
                        {
                        this.state.dataRecordings.map((item) =>
                            item.recording.length ? item.recording.map((item) =>
                            <tr style={{borderBottom: '1px solid #DDDDDD'}}>
                                <td className="fc-muted f-14 f-w-300 p-t-20">
                                    <img src={item.playback.format.preview.images.image[0]} width="32"/> &nbsp;Rekaman : {item.name} {new Date(item.endTime).toISOString().slice(0, 16).replace('T', ' ')}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-10" align="center">
                                  <span class="btn-group dropleft col-sm-1">
                                    <button style={{padding:'6px 18px', border:'none', marginBottom:0, background:'transparent'}} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      <i
                                        className="fa fa-ellipsis-v"
                                        style={{ fontSize: 14, marginRight:0, color:'rgb(148 148 148)' }}
                                      />
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{fontSize:14, padding:5, borderRadius:0}}>
                                      <button
                                        style={{cursor:'pointer'}}
                                        class="dropdown-item"
                                        type="button"
                                        onClick={e=>window.open(item.playback.format.url, 'Rekaman Meeting')}
                                      >
                                          Lihat
                                      </button>
                                      {/* <button style={{cursor:'pointer'}} class="dropdown-item" type="button" onClick={()=>toast.warning('Coming Soon')}>Hapus</button> */}
                                    </div>
                                  </span>
                                </td>
                            </tr>
                            )
                            :
                            <tr style={{borderBottom: '1px solid #DDDDDD'}}>
                                <td className="fc-muted f-14 f-w-300 p-t-20">
                                    <img src={item.recording.playback.format.preview.images.image[0]} width="32"/> &nbsp;Rekaman : {item.recording.name} {new Date(item.recording.endTime).toISOString().slice(0, 16).replace('T', ' ')}</td>
                                <td className="fc-muted f-14 f-w-300 p-t-10" align="center">
                                  <span class="btn-group dropleft col-sm-1">
                                    <button style={{padding:'6px 18px', border:'none', marginBottom:0, background:'transparent'}} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      <i
                                        className="fa fa-ellipsis-v"
                                        style={{ fontSize: 14, marginRight:0, color:'rgb(148 148 148)' }}
                                      />
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{fontSize:14, padding:5, borderRadius:0}}>
                                      <button
                                        style={{cursor:'pointer'}}
                                        class="dropdown-item"
                                        type="button"
                                        onClick={e=>window.open(item.recording.playback.format.url, 'Rekaman Meeting')}
                                      >
                                          Lihat
                                      </button>
                                      {/* <button style={{cursor:'pointer'}} class="dropdown-item" type="button" onClick={()=>toast.warning('Coming Soon')}>Hapus</button> */}
                                    </div>
                                  </span>
                                </td>
                            </tr>

                            
                        )
                        }
                        </tbody>
                    }
                </table>
            </div>
        <Modal
          show={this.state.modalDeleteFile}
          onHide={this.closeModalDeleteFile}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
            Konfirmasi
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Anda yakin akan menghapus file <b>{this.state.deleteFileName}</b> ?</div>
          </Modal.Body>
          <Modal.Footer>
                      <button
                        className="btn btm-icademy-primary btn-icademy-grey"
                        onClick={this.closeModalDeleteFile.bind(this)}
                      >
                        Batal
                      </button>
                      <button
                        className="btn btn-icademy-primary btn-icademy-red"
                        onClick={this.deleteFile.bind(this)}
                      >
                        <i className="fa fa-trash"></i>
                        Hapus
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
        <Modal
          show={this.state.modalNewFolder}
          onHide={this.closeModalAdd}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
            Tambah Folder
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
                                placeholder="Nama Folder"
                                onChange={this.onChangeInput}
                                required
                                />
                            </div>
                        </Col>
                    </Row>
                    {
                      this.state.folderId != 0 ?
                      <div>
                      <Row>
                          <Col>
                              <p>Hak akses role pada webinar</p>
                          </Col>
                      </Row>
                      <Row>
                          <Col xs='auto'>
                            <input type="checkbox" value={this.state.aSekretaris} checked={this.state.aSekretaris} onChange={this.handleCheck.bind(this, 'sekretaris')} />
                            <label>&nbsp; Sekretaris</label>
                          </Col>
                          <Col xs='auto'>
                            <input type="checkbox" value={this.state.aModerator} checked={this.state.aModerator} onChange={this.handleCheck.bind(this, 'moderator')} />
                            <label>&nbsp; Moderator</label>
                          </Col>
                          <Col xs='auto'>
                            <input type="checkbox" value={this.state.aPembicara} checked={this.state.aPembicara} onChange={this.handleCheck.bind(this, 'pembicara')} />
                            <label>&nbsp; Pembicara</label>
                          </Col>
                      </Row>
                      <Row>
                          <Col xs='auto'>
                            <input type="checkbox" value={this.state.aOwner} checked={this.state.aOwner} onChange={this.handleCheck.bind(this, 'owner')} />
                            <label>&nbsp; Owner</label>
                          </Col>
                          <Col xs='auto'>
                            <input type="checkbox" value={this.state.aPeserta} checked={this.state.aPeserta} onChange={this.handleCheck.bind(this, 'peserta')} />
                            <label>&nbsp; Peserta</label>
                          </Col>
                      </Row>
                      </div>
                      :
                      null
                    }
                  </Card.Body>
                  <Modal.Footer>
                      <button
                        className="btn btm-icademy-primary btn-icademy-grey"
                        onClick={this.closeModalAdd.bind(this)}
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
          show={this.state.modalEditFolder}
          onHide={this.closeModalEdit}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
            Ubah Folder
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
                                placeholder="Nama Folder"
                                onChange={this.onChangeInput}
                                required
                                />
                            </div>
                        </Col>
                    </Row>
                    {
                      this.state.folderId != 0 ?
                      <div>
                      <Row>
                          <Col>
                              <p>Hak akses role pada webinar</p>
                          </Col>
                      </Row>
                      <Row>
                          <Col xs='auto'>
                            <input type="checkbox" value={this.state.aSekretaris} checked={this.state.aSekretaris} onChange={this.handleCheck.bind(this, 'sekretaris')} />
                            <label>&nbsp; Sekretaris</label>
                          </Col>
                          <Col xs='auto'>
                            <input type="checkbox" value={this.state.aModerator} checked={this.state.aModerator} onChange={this.handleCheck.bind(this, 'moderator')} />
                            <label>&nbsp; Moderator</label>
                          </Col>
                          <Col xs='auto'>
                            <input type="checkbox" value={this.state.aPembicara} checked={this.state.aPembicara} onChange={this.handleCheck.bind(this, 'pembicara')} />
                            <label>&nbsp; Pembicara</label>
                          </Col>
                      </Row>
                      <Row>
                          <Col xs='auto'>
                            <input type="checkbox" value={this.state.aOwner} checked={this.state.aOwner} onChange={this.handleCheck.bind(this, 'owner')} />
                            <label>&nbsp; Owner</label>
                          </Col>
                          <Col xs='auto'>
                            <input type="checkbox" value={this.state.aPeserta} checked={this.state.aPeserta} onChange={this.handleCheck.bind(this, 'peserta')} />
                            <label>&nbsp; Peserta</label>
                          </Col>
                      </Row>
                      </div>
                      :
                      null
                    }
                  </Card.Body>
                  <Modal.Footer>
                      <button
                        className="btn btm-icademy-primary btn-icademy-grey"
                        onClick={this.closeModalEdit.bind(this)}
                      >
                        Batal
                      </button>
                      <button
                        className="btn btn-icademy-primary"
                        onClick={this.editFolder.bind(this)}
                      >
                        <i className="fa fa-save"></i>
                        Simpan
                      </button>
                  </Modal.Footer>
                </Card>
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.modalUpload}
          onHide={this.closeModalUpload}
          centered
        >
          <Modal.Header closeButton>
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
                        </Col>
                    </Row>
                  </Card.Body>
                </Card>
          </Modal.Body>
                  <Modal.Footer>
                      <button
                        className="btn btm-icademy-primary btn-icademy-grey"
                        onClick={this.closeModalUpload.bind(this)}
                      >
                        Batal
                      </button>
                      <button
                        className="btn btn-icademy-primary"
                        onClick={this.uploadFile.bind(this)}
                      >
                        <i className="fa fa-save"></i>
                        {this.state.uploading ? 'Uploading...' : 'Upload'}
                      </button>
                  </Modal.Footer>
        </Modal>
            </div>
                    
    );
  }
}

export default FilesTable;