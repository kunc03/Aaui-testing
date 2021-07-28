import React, { Component } from "react";
import API, { API_SERVER, API_SOCKET, APPS_SERVER, USER_ME, BBB_KEY, BBB_URL, BBB_SERVER_LIST } from '../../repository/api';
// import '../ganttChart/node_modules/@trendmicro/react-dropdown/dist/react-dropdown.css';
import { Modal, Form, Card, Row, Col } from 'react-bootstrap';

import Storage from '../../repository/storage';
import { toast } from "react-toastify";
import { MultiSelect } from 'react-sm-select';
import ToggleSwitch from "react-switch";
import SocketContext from '../../socket';
import moment from 'moment-timezone';
import io from 'socket.io-client';
const socket = io(`${API_SOCKET}`);
socket.on("connect", () => {
  //console.log("connect ganihhhhhhh");
});

const bbb = require('bigbluebutton-js')

class FilesTableClass extends Component {
  constructor(props) {
    super(props);

    // this._deleteUser = this._deleteUser.bind(this);

    this.state = {
      users: [],
      role: [],
      dataUser: [],
      selectFolder: false,
      classRooms: [],
      folderId: 0,
      companyId: localStorage.getItem('companyID'),
      folder: [],
      files: [],
      mom: [],
      recordedMeeting: [],
      prevFolderId: 0,
      folderName: '',
      modalNewFolder: false,
      modalEditFolder: false,
      modalUpload: false,
      isUploading: false,
      isLoading: false,
      attachmentId: [],
      dataRecordings: [],
      editProjectName: '',
      editProjectId: '',
      modalDelete: false,
      deleteProjectName: '',
      deleteProjectId: '',

      modalDeleteFile: false,
      deleteFileName: '',
      deleteFileId: '',

      modalRename: false,
      renameFileId: '',
      renameFileName: '',
      renameFileNameNew: '',
      renameMode: '',

      //access role webinar
      aSekretaris: true,
      aModerator: true,
      aPembicara: true,
      aOwner: true,
      aPeserta: true,
      optionsUser: [],
      valueUser: [],
      limited: false,

      filterFile: '',
      searchFile: '',
      filterFolder: true,
      filterFiles: true,
      filterMOM: true,
      filterRecord: true,
      gb : [],
    };
  }

  rename (id, name, mode){
    this.setState({modalRename : true, renameFileId: id, renameFileName: name, renameFileNameNew: name, renameMode: mode})
  }

  changeFilter = e => {
    this.setState({filterFile: e.target.value})
  }

  searchFile = (e) => {
    e.preventDefault();
    this.setState({ searchFile: e.target.value });
  }

  toggleSwitch(checked) {
    this.setState({ limited: !this.state.limited });
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
  closeModalRename = e => {
    this.setState({
      modalRename: false,
      renameFileName: '',
      renameFileId: '',
      renameFileNameNew: ''
    })
  }
  closeModalAdd = e => {
    this.setState({
      folderName: '',
      modalNewFolder: false,
      aSekretaris: true,
      aModerator: true,
      aPembicara: true,
      aOwner: true,
      aPeserta: true,
      limited: false,
      valueUser: []
    })
  }
  closeModalEdit = e => {
    this.setState({
      editProjectName: '',
      modalEditFolder: false,
      aSekretaris: true,
      aModerator: true,
      aPembicara: true,
      aOwner: true,
      aPeserta: true,
      limited: false,
      valueUser: []
    })
  }
  closeModalUpload = e => {
    this.setState({ modalUpload: false })
  }
  uploadFile = async e => {
    e.preventDefault();
    this.setState({ uploading: true })

    for (let i = 0; i <= this.state.attachmentId.length - 1; i++) {
      let form = new FormData();
      form.append('folder', this.state.folderId);
      form.append('file', this.state.attachmentId[i]);
      form.append('created_by', Storage.get('user').data.user_id);
      await API.post(`${API_SERVER}v1/folder/files`, form).then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            this.setState({ uploading: false, attachmentId: [] });
            toast.error('Error : ' + res.data.result)
          }
        }
      })
    }

    let msg = `${Storage.get('user').data.user} successfully added ${this.state.attachmentId.length} ${this.state.attachmentId.length > 1 ? 'files' : 'file'}`;
    this.sendNotifToAll(msg);

    this.setState({ modalUpload: false, uploading: false, attachmentId: [] })
    socket.emit('send', { socketAction: 'newFileUploaded', folderId: this.state.folderId })
    this.fetchFile(this.state.folderId)
  }

  sendNotifToAll(msg) {
    API.get(`${API_SERVER}v1/user/company/${Storage.get('user').data.company_id}`).then(response => {
      response.data.result.map(item => {
        let notif = {
          user_id: item.user_id,
          type: 6,
          activity_id: this.state.folderId,
          desc: msg,
          dest: `${APPS_SERVER}detail-project/${this.props.projectId}`
        }
        API.post(`${API_SERVER}v1/notification/broadcast`, notif);
      });
    })
    this.props.socket.emit('send', { companyId: Storage.get('user').data.company_id })
  }
  onChangeInput = e => {
    // const target = e.target;
    const name = e.target.name;
    const value = e.target.value;

    if (name === 'attachmentId') {
      this.setState({ [name]: e.target.files });
    } else {
      this.setState({ [name]: value });
    }
  }
  renameFile = e => {
    if (this.state.renameMode === 'file'){
      let form = {
        name: this.state.renameFileNameNew
      }
      API.put(`${API_SERVER}v1/project-file/${this.state.renameFileId}`, form).then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            toast.error(`Failed to modify the file ${this.state.renameFileName} to ${this.state.renameFileNameNew}`)
          } else {
            let msg = `${Storage.get('user').data.user} change the file name ${this.state.renameFileName} to ${this.state.renameFileNameNew}`;
            this.sendNotifToAll(msg);
  
            toast.success(`Successfully modified file ${this.state.renameFileName} to ${this.state.renameFileNameNew}`);
            this.setState({ renameFileId: '', renameFileName: '', renameFileNameNew:'' });
            this.fetchFile(this.state.folderId);
            socket.emit('send', { socketAction: 'newFileUploaded', folderId: this.state.folderId })
            this.closeModalRename();
          }
        }
      })
    }
    else if (this.state.renameMode === 'mom'){
      let form = {
        title: this.state.renameFileNameNew
      }
      API.put(`${API_SERVER}v1/liveclass/title-mom/${this.state.renameFileId}`, form).then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            toast.error(`Failed to modify the MOM name ${this.state.renameFileName} to ${this.state.renameFileNameNew}`)
          } else {
            let msg = `${Storage.get('user').data.user} change the MOM name ${this.state.renameFileName} to ${this.state.renameFileNameNew}`;
            this.sendNotifToAll(msg);
  
            toast.success(`Successfully modified MOM name ${this.state.renameFileName} to ${this.state.renameFileNameNew}`);
            this.setState({ renameFileId: '', renameFileName: '', renameFileNameNew:'', renameMode: '' });
            this.fetchMOM(this.state.folderId);
            this.closeModalRename();
          }
        }
      })
    }
    else if (this.state.renameMode === 'record'){
      let form = {
        name: this.state.renameFileNameNew,
        project_id: this.state.folderId
      }
      API.put(`${API_SERVER}v1/record/${this.state.renameFileId}`, form).then(res => {
        if (res.status === 200) {
          if (res.data.error) {
            toast.error(`Failed to modify the record name ${this.state.renameFileName} to ${this.state.renameFileNameNew}`)
          } else {
            let msg = `${Storage.get('user').data.user} change the record name ${this.state.renameFileName} to ${this.state.renameFileNameNew}`;
            this.sendNotifToAll(msg);
  
            toast.success(`Successfully modified record name ${this.state.renameFileName} to ${this.state.renameFileNameNew}`);
            this.setState({ renameFileId: '', renameFileName: '', renameFileNameNew:'', renameMode: '' });
            this.fetchRekamanBBB(this.state.folderId);
            this.fetchRekaman(this.state.folderId);
            this.closeModalRename();
          }
        }
      })
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
      aPeserta: this.state.aPeserta ? 1 : 0,
      is_limit: this.state.limited ? 1 : 0,
      user: this.state.valueUser,
      created_by: Storage.get('user').data.user_id
    };

    API.post(`${API_SERVER}v1/folder`, formData).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error('Error : ' + res.data.result)
        } else {
          let msg = `${Storage.get('user').data.user} successfully to added a new folder with the name "${formData.name}"`;
          this.sendNotifToAll(msg);

          this.closeModalAdd()
          this.fetchFolder(this.state.folderId);
          socket.emit('send', { socketAction: 'newFileUploaded', folderId: this.state.folderId })
          toast.success('New folder added')
        }
      }
    })
  }
  openModalEdit(id) {
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
          valueUser: res.data.result.user ? res.data.result.user.split(',').map(Number) : [],
          limited: res.data.result.is_limit === 0 ? false : true
        })
      }
    })
  }

  editFolder() {
    let form = {
      name: this.state.editProjectName,
      aSekretaris: this.state.aSekretaris ? 1 : 0,
      aModerator: this.state.aModerator ? 1 : 0,
      aPembicara: this.state.aPembicara ? 1 : 0,
      aOwner: this.state.aOwner ? 1 : 0,
      aPeserta: this.state.aPeserta ? 1 : 0,
      is_limit: this.state.limited ? 1 : 0,
      user: this.state.valueUser
    }
    API.put(`${API_SERVER}v1/project/${this.state.editProjectId}`, form).then(res => {
      console.log(res.data)
      if (res.status === 200) {
        if (res.data.error) {
          toast.error(`Failed to modify the project ${this.state.editProjectName}`)
        } else {
          let msg = `${Storage.get('user').data.user} change the project name ${this.state.editProjectName}`;
          this.sendNotifToAll(msg);

          toast.success(`Successfully modified project ${this.state.editProjectName}`)
          this.setState({ editProjectId: '', editProjectName: '' })
          this.fetchFolder(this.state.folderId)
          this.closeModalEdit()
        }
      }
    })
  }
  async fetchFolder(mother) {
    let userId = Storage.get('user').data.user_id;
    let form = {}
    if (this.props.webinarId) {
      let apiUrl = this.props.guest ?
        `${API_SERVER}v2/webinar/tamu/one/${this.props.webinarId}`
        :
        `${API_SERVER}v2/webinar/one/${this.props.webinarId}`
      await API.get(apiUrl).then(res => {
        if (res.data.error) toast.warning("Gagal fetch API");
        form = {
          aSekretaris: res.data.result.sekretaris.filter((item) => item.user_id == userId).length >= 1 ? 1 : 0,
          aModerator: res.data.result.moderator.filter((item) => item.user_id == userId).length >= 1 ? 1 : 0,
          aPembicara: res.data.result.pembicara.filter((item) => item.user_id == userId).length >= 1 ? 1 : 0,
          aOwner: res.data.result.owner.filter((item) => item.user_id == userId).length >= 1 ? 1 : 0,
          aPeserta: res.data.result.peserta.filter((item) => item.user_id == userId).length || res.data.result.tamu.filter((item) => item.voucher == this.props.voucherTamu).length ? 1 : 0,
        }
      })
    }
    else {
      form = {
        aSekretaris: 1,
        aModerator: 1,
        aPembicara: 1,
        aOwner: 1,
        aPeserta: 1
      }
    }
    this.setState({ role: form })

    API.get(`${API_SERVER}v1/folder-by-user/${this.state.companyId}/${mother}/${Storage.get('user').data.user_id}/${this.props.guest ? 1 : 0}`, this.state.role).then(res => {
      if (res.status === 200) {
        this.setState({ folder: res.data.result })
      }
    })
    API.get(`${API_SERVER}v1/folder/back/${this.state.companyId}/${mother}`).then(res => {
      if (res.status === 200) {
        this.setState({ prevFolderId: res.data.result })
      }
    })
  }
  selectFolder(id, name) {
    this.setState({ isLoading: true }, () => {
      this.fetchFolder(id)
      this.fetchFile(id)
      this.fetchMOM(id)
      this.fetchRekamanBBB(id)
      this.fetchRekaman(id)
      this.setState({ selectFolder: id == this.props.projectId ? false : true, folderId: id })
    })
    if (this.props.selectedFolder){
      this.props.selectedFolder(id)
    }
  }
  fetchFile(folder) {
    API.get(`${API_SERVER}v1/files/${folder}`).then(res => {
      if (res.status === 200) {
        this.setState({ files: res.data.result })
      }
    })
  }
  fetchMOM(folder) {
    if (folder == 0 || this.props.webinarId) {
      this.setState({ mom: [] })
    }
    else {
      API.get(`${API_SERVER}v1/files-mom/${folder}`).then(res => {
        if (res.status === 200) {
          this.setState({
            mom: res.data.result
          })
        }
      })
    }
  }
  fetchRekaman(folder) {
    if (folder == 0 || this.props.webinarId) {
      this.setState({ recordedMeeting: [], isLoading: false })
    }
    else {
      API.get(`${API_SERVER}v1/files-recorded/${folder}`).then(res => {
        if (res.status === 200) {
          this.setState({
            recordedMeeting: res.data.result,
          })
        }
      })
    }
  }

fetchRekamanBBB(folder){
  let userId = Storage.get('user').data.user_id;
  if (folder == 0 || this.props.webinarId){
    this.setState({dataRecordings:[], isLoading: false})
  }
  else{
    API.get(`${API_SERVER}v2/bbb/record/${userId}/${folder}`).then(res => {
      if (res.status === 200) {
        this.setState({ dataRecordings: res.data.result, isLoading: false })
      }
    })
  }
}

  fetchData() {
    let initialFolder = this.props.initialFolder ? this.props.initialFolder : this.props.projectId;
    if (this.props.companyId) {
      this.setState({ companyId: this.props.companyId })
      this.selectFolder(initialFolder)
    }
    else {
      API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
          this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
          this.selectFolder(initialFolder)
        }
      })
    }
    API.get(`${API_SERVER}v2/project/user/${this.props.projectId}`).then(response => {
      this.setState({ optionsUser: [] })
      response.data.result.map(item => {
        this.state.optionsUser.push({ value: item.user_id, label: item.name });
      });
    })
  }

  dialogDelete(id, name) {
    this.setState({
      deleteProjectId: id,
      deleteProjectName: name,
      modalDelete: true
    })
  }
  dialogDeleteFile(id, name) {
    this.setState({
      deleteFileId: id,
      deleteFileName: name,
      modalDeleteFile: true
    })
  }
  deleteProject() {
    API.delete(`${API_SERVER}v1/project/${this.state.deleteProjectId}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error(`Failed to delete project ${this.state.deleteProjectName}`)
        } else {
          let msg = `${Storage.get('user').data.user} deleted the ${this.state.deleteProjectName} project`;
          this.sendNotifToAll(msg);

          toast.success(`Project deleted ${this.state.deleteProjectName}`)
          this.setState({ deleteProjectId: '', deleteProjectName: '', modalDelete: false })
          this.fetchFolder(this.state.folderId);
        }
      }
    })
  }
  deleteFile() {
    API.delete(`${API_SERVER}v1/project-file/${this.state.deleteFileId}`).then(res => {
      if (res.status === 200) {
        if (res.data.error) {
          toast.error(`Failed to delete project ${this.state.deleteProjectName}`)
        } else {
          let msg = `${Storage.get('user').data.user} deleted the file`;
          this.sendNotifToAll(msg);

          toast.success(`Project deleted ${this.state.deleteProjectName}`)
          this.setState({ deleteFileId: '', deleteFileName: '', modalDeleteFile: false })
          this.fetchFile(this.state.folderId);
        }
      }
    })
  }
  closeModalDelete = e => {
    this.setState({ modalDelete: false, deleteProjectName: '', deleteProjectId: '', alert: '' })
  }
  closeModalDeleteFile = e => {
    this.setState({ modalDeleteFile: false, deleteFileName: '', deleteFileId: '', alert: '' })
  }

  selectFileShow = (type, val) => {
    if (this.props.selectedFileShow){
      if (type === 'pdf' || type==='png' || type==='jpg' || type==='jpeg' || type==='doc' || type==='docx' || type==='xls' || type==='xlsx'){
        this.props.selectedFileShow(val)
      }
      else{
        toast.warning('Sorry, this file type not support yet to show')
      }
    }
  }

  filesLogs(e) {
    let data = {
      id: e.id,
      filename: e.name,
      folder: e.folder_id,
      url: e.location
    };
    API.post(`${API_SERVER}v1/files-logs`, data)
      .then(res => { console.log(res) });
  }

  componentDidMount() {
    this.fetchData()
    socket.on("broadcast", data => {
      if (data.socketAction == 'newFileUploaded' && data.folderId === this.state.folderId) {
        this.selectFolder(data.folderId);
      }
    });

    if (!this.props.guest){
      this.fetchCheckAccess(Storage.get('user').data.grup_name.toLowerCase(), Storage.get('user').data.company_id, Storage.get('user').data.level, ['CD_FILE_FOLDER'
    ,'R_FILES_FOLDER','U_FILES'])
    }
    else{
      this.setState({
        gb: [
          {
            code: 'CD_FILE_FOLDER',
            status: false
          },
          {
            code: 'R_FILES_FOLDER',
            status: true
          },
          {
            code: 'U_FILES',
            status: false
          },
        ]
      })
    }

  }

  handleChangeFilter = (filter) => {
    this.setState({
      [filter]: !this.state[filter]
    });
  }

  fetchCheckAccess(role, company_id, level, param) {
    API.get(`${API_SERVER}v2/global-settings/check-access`, {role, company_id, level, param}).then(res => {
      if(res.status === 200) {
        this.setState({ gb: res.data.result })
      }
    })
  }

  render() {
    // * GLOBAL SETTINGS * //

    let cdFile = this.state.gb.length && this.state.gb.filter(item => item.code === 'CD_FILE_FOLDER')[0].status;
    let read_file = this.state.gb.length && this.state.gb.filter(item => item.code === 'R_FILES_FOLDER')[0].status;
    let upload_file = this.state.gb.length && this.state.gb.filter(item => item.code === 'U_FILES')[0].status;

    const notify = () => toast.warning('Access denied')

    const headerTabble = [
      // {title : 'Date', width: null, status: true},
      // {title : 'By', width: null, status: true},
      // {title : 'Size', width: null, status: true},
      { title: 'Created at', width: null, status: true },
      { title: 'By', width: null, status: true },
      { title: '', width: null, status: true },
    ];
    const access_project_admin = this.props.access_project_admin;
    // let access = Storage.get('access');
    // let levelUser = Storage.get('user').data.level;

    let { searchFile, folder, mom, files, recordedMeeting, dataRecordings } = this.state;
    if (searchFile != "") {
      folder = folder.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(searchFile, "gmi"))
      )
      files = files.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(searchFile, "gmi"))
      )
      mom = mom.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(searchFile, "gmi"))
      )
      recordedMeeting = recordedMeeting.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(searchFile, "gmi"))
      )
      dataRecordings = dataRecordings.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(searchFile, "gmi"))
      )
    }
    
    return (
      <div className="card p-20">
        <span className="mb-4">
          <strong className="f-w-bold f-18 fc-skyblue ">Files</strong>
          {
            this.props.guest === false || !this.props.guest ?
            <button
              onClick={upload_file ? e => this.setState({ modalUpload: true }) : notify}
              className="btn btn-icademy-primary float-right"
              style={{ padding: "7px 8px !important", marginLeft: 14 }}
            >
              <i className="fa fa-upload"></i>

                  Upload
                  </button>:null
          }
          { access_project_admin == true ? <button
            onClick={cdFile ? e => this.setState({ modalNewFolder: true }) : notify}
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
          
          <div className='tag-filter-container'>
            <div className={`tag-filter ${this.state.filterFolder && 'tag-filter-selected'}`} onClick={this.handleChangeFilter.bind(this,'filterFolder')}>{this.state.filterFolder ? <font style={{color: '#0F0'}}>&#10003;</font> : <font style={{color: '#F00'}}>&#10005;</font> } Folder</div>
            <div className={`tag-filter ${this.state.filterFiles && 'tag-filter-selected'}`} onClick={this.handleChangeFilter.bind(this,'filterFiles')}>{this.state.filterFiles ? <font style={{color: '#0F0'}}>&#10003;</font> : <font style={{color: '#F00'}}>&#10005;</font> } File</div>
            <div className={`tag-filter ${this.state.filterMOM && 'tag-filter-selected'}`} onClick={this.handleChangeFilter.bind(this,'filterMOM')}>{this.state.filterMOM ? <font style={{color: '#0F0'}}>&#10003;</font> : <font style={{color: '#F00'}}>&#10005;</font> } MOM</div>
            <div className={`tag-filter ${this.state.filterRecord && 'tag-filter-selected'}`} onClick={this.handleChangeFilter.bind(this,'filterRecord')}>{this.state.filterRecord ? <font style={{color: '#0F0'}}>&#10003;</font> : <font style={{color: '#F00'}}>&#10005;</font> } Record</div>
          </div>

          {/* <select value={this.state.filterFile} onChange={this.changeFilter} style={{float:'right', marginBottom: 10, width:200, height:40, paddingLeft:10, marginRight: 10, border: '1px solid #ced4da', borderRadius:'.25rem', color:'#949ca6'}}>
            <option value='all'>All</option>
            <option value='folder'>Folder</option>
            <option value='files'>Files Uploaded</option>
            <option value='mom'>MOM</option>
            <option value='recorded'>Recorded Meeting</option>
          </select> */}
          
          <input
                type="text"
                placeholder="Search"
                onChange={this.searchFile}
                style={{marginRight: 10}}
                className="form-control float-right col-sm-3"/>
        </span>
        <div className="table-responsive" style={{ overflowX: 'hidden', overflowY: this.props.scrollHeight ? 'scroll' : 'auto', height: this.props.scrollHeight ? this.props.scrollHeight : 'auto' }}>
          <table className="table table-hover">
            <thead>
              <tr style={{ borderBottom: '1px solid #C7C7C7' }}>
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
              folder.length == 0 && this.state.files.length == 0 && this.state.mom.length == 0 && this.state.recordedMeeting.length == 0 && (this.props.projectId == this.state.folderId) ?
                <tbody>
                  <tr>
                    <td className="fc-muted f-14 f-w-300 p-t-20" colspan='9'>There is no files</td>
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
                  read_file ?
                  <tbody>
                    {
                      this.state.folderId !== 0 &&
                      this.state.selectFolder &&
                      <tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                        <td colspan='4' className="fc-muted f-14 f-w-300 p-t-20" style={{ cursor: 'pointer' }} onClick={this.selectFolder.bind(this, this.state.prevFolderId, null)}>
                          <img src='assets/images/component/folder-back.png' width="32" /> &nbsp;Back</td>
                      </tr>
                    }
                    {
                      folder.map(item => {
                        if (((item.sekretaris == 1 && item.sekretaris == this.state.role.aSekretaris) ||
                          (item.moderator == 1 && item.moderator == this.state.role.aModerator) ||
                          (item.pembicara == 1 && item.pembicara == this.state.role.aPembicara) ||
                          (item.owner == 1 && item.owner == this.state.role.aOwner) ||
                          (item.peserta == 1 && item.peserta == this.state.role.aPeserta)) &&
                          (this.state.filterFile === 'all' || this.state.filterFile === 'folder' || this.state.filterFolder === true)) {
                          return (<tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                            <td className="fc-muted f-14 f-w-300 p-t-20" style={{ cursor: 'pointer' }} onClick={this.selectFolder.bind(this, item.id, item.name)}>
                              <img src='assets/images/component/folder.png' width="32" /> &nbsp;{item.name}</td>
                            {/* <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.date}</td> */}
                            {/* <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.by}</td> */}
                            {/* <td className="fc-muted f-14 f-w-300 p-t-20" align="center">{item.size}</td> */}
                          <td className="fc-muted f-12 f-w-300 p-t-20 l-h-30" align="center">
                            {moment.tz(item.created_at, moment.tz.guess(true)).format('DD-MM-YYYY')}
                          </td>
                          <td className="fc-muted f-12 f-w-300 p-t-20 l-h-30" align="center">
                            {item.creator ? item.creator : '-'}
                          </td>
                            <td className="fc-muted f-14 f-w-300 p-t-10" align="center">
                              {
                                access_project_admin ?
                                  <span class="btn-group dropleft col-sm-1">
                                    <button style={{ padding: '6px 18px', border: 'none', marginBottom: 0, background: 'transparent' }} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      <i
                                        className="fa fa-ellipsis-v"
                                        style={{ fontSize: 14, marginRight: 0, color: 'rgb(148 148 148)' }}
                                      />
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{ fontSize: 14, padding: 5, borderRadius: 0 }}>
                                      <button
                                        style={{ cursor: 'pointer' }}
                                        class="dropdown-item"
                                        type="button"
                                        onClick={this.openModalEdit.bind(this, item.id)}
                                      >
                                        Edit
                                        </button>
                                        {
                                          cdFile &&
                                      <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={this.dialogDelete.bind(this, item.id, item.name)}> Delete </button>
                                        }
                                    </div>
                                  </span>
                                  :
                                  null
                              }
                            </td>
                          </tr>)
                        }
                        else {
                          return (null)
                        }
                      })
                    }
                    {
                      (this.state.filterFile === 'all' || this.state.filterFile === 'files' || this.state.filterFiles === true) && files.map(item =>
                        <tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                          <td className="fc-muted f-14 f-w-300 p-t-20" style={{cursor:'pointer'}} onClick={this.selectFileShow.bind(this, item.type, item.location)}>
                            <img src={
                              item.type == 'png' || item.type == 'pdf' || item.type == 'doc' || item.type == 'docx' || item.type == 'ppt' || item.type == 'pptx' || item.type == 'rar' || item.type == 'zip' || item.type == 'jpg' || item.type == 'csv'
                                ? `assets/images/files/${item.type}.svg`
                                : 'assets/images/files/file.svg'
                            } width="32" /> &nbsp;{item.name}</td>
                          <td className="fc-muted f-12 f-w-300 p-t-20 l-h-30" align="center">
                            {moment.tz(item.created_at, moment.tz.guess(true)).format('DD-MM-YYYY')}
                          </td>
                          <td className="fc-muted f-12 f-w-300 p-t-20 l-h-30" align="center">
                            {item.creator ? item.creator : '-'}
                          </td>
                          <td className="fc-muted f-14 f-w-300 p-t-10" align="center">
                            <span class="btn-group dropleft col-sm-1 m-t-10">
                              <button style={{ padding: '6px 18px', border: 'none', marginBottom: 0, background: 'transparent' }} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i
                                  className="fa fa-ellipsis-v"
                                  style={{ fontSize: 14, marginRight: 0, color: 'rgb(148 148 148)' }}
                                />
                              </button>
                              <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{ fontSize: 14, padding: 5, borderRadius: 0 }}>
                                <button
                                  style={{ cursor: 'pointer' }}
                                  class="dropdown-item"
                                  type="button"
                                  onClick={e => {
                                    this.filesLogs(item);
                                    window.open(item.location, 'Downloading files');
                                  }}
                                >
                                  Download
                                      </button>
                                {
                                  access_project_admin ?
                                    <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={()=> this.setState({modalRename : true, renameFileId: item.id, renameFileName: item.name, renameFileNameNew: item.name})}> Rename </button>
                                    :
                                    null
                                }
                                {
                                  access_project_admin ?
                                    <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={this.dialogDeleteFile.bind(this, item.id, item.name)}> Delete </button>
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
                      (this.state.filterFile === 'all' || this.state.filterFile === 'mom' || this.state.filterMOM === true) && mom.map(item =>
                        <tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                          <td className="fc-muted f-14 f-w-300 p-t-20">
                            <img src='assets/images/files/pdf.svg' width="32" /> &nbsp;MOM : {item.title}</td>
                          <td className="fc-muted f-12 f-w-300 p-t-20 l-h-30" align="center">
                            {moment.tz(item.time, moment.tz.guess(true)).format('DD-MM-YYYY')}
                          </td>
                          <td className="fc-muted f-12 f-w-300 p-t-20 l-h-30" align="center">
                            {item.creator ? item.creator : '-'}
                          </td>
                          <td className="fc-muted f-14 f-w-300 p-t-10" align="center">
                            <span class="btn-group dropleft col-sm-1 m-t-10">
                              <button style={{ padding: '6px 18px', border: 'none', marginBottom: 0, background: 'transparent' }} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                <i
                                  className="fa fa-ellipsis-v"
                                  style={{ fontSize: 14, marginRight: 0, color: 'rgb(148 148 148)' }}
                                />
                              </button>
                              <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{ fontSize: 14, padding: 5, borderRadius: 0 }}>
                                {
                                  access_project_admin ?
                                    <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={this.rename.bind(this, item.id, item.title, 'mom')}> Rename </button>
                                    :
                                    null
                                }
                                <button
                                  style={{ cursor: 'pointer' }}
                                  class="dropdown-item"
                                  type="button"
                                  onClick={e => window.open(`${APPS_SERVER}mom/?id=${item.id}`, 'Downloading files')}
                                >
                                  Print PDF
                                      </button>
                                {/* <button style={{cursor:'pointer'}} class="dropdown-item" type="button" onClick={()=>toast.warning('Coming Soon')}> Delete </button> */}
                              </div>
                            </span>
                          </td>
                        </tr>
                      )
                    }
                    {
                      (this.state.selectFolder === false && (this.state.filterFile === 'all' || this.state.filterFile === 'recorded' || this.state.filterRecord === true)) &&
                      recordedMeeting.map(item =>
                        item.record && item.record.split(',').map(item =>
                          <tr style={{ borderBottom: '1px solid #DDDDDD' }}>
                            <td className="fc-muted f-14 f-w-300 p-t-20">
                              <img src='assets/images/files/mp4.svg' width="32" /> &nbsp;Rekaman : {item.substring(40).replace(/%2520/g, " ")}</td>
                            <td className="fc-muted f-14 f-w-300 p-t-10" align="center"></td>
                            <td className="fc-muted f-14 f-w-300 p-t-10" align="center"></td>
                            <td className="fc-muted f-14 f-w-300 p-t-10" align="center">
                              <span class="btn-group dropleft col-sm-1 m-t-10">
                                <button style={{ padding: '6px 18px', border: 'none', marginBottom: 0, background: 'transparent' }} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                  <i
                                    className="fa fa-ellipsis-v"
                                    style={{ fontSize: 14, marginRight: 0, color: 'rgb(148 148 148)' }}
                                  />
                                </button>
                                <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{ fontSize: 14, padding: 5, borderRadius: 0 }}>
                                  <button
                                    style={{ cursor: 'pointer' }}
                                    class="dropdown-item"
                                    type="button"
                                    onClick={e => window.open(item, 'Rekaman Meeting')}
                                  >
                                    Open
                                      </button>
                                  {/* <button style={{cursor:'pointer'}} class="dropdown-item" type="button" onClick={()=>toast.warning('Coming Soon')}> Delete </button> */}
                                </div>
                              </span>
                            </td>
                          </tr>
                        )
                        )
                        }
                        {
                        this.state.selectFolder === false && (this.state.filterFile === 'all' || this.state.filterFile === 'recorded' || this.state.filterRecord === true) &&
                        dataRecordings.map((item) =>
                            <tr style={{borderBottom: '1px solid #DDDDDD'}}>
                                <td className="fc-muted f-14 f-w-300 p-t-20">
                                    <img src='assets/images/files/mp4.svg' width="32"/> &nbsp;Record : {item.name} <i style={{color:'#da9700', fontSize:'12px'}}>{item.state !== 'published' ? 'Processing' : ''}</i></td>
                                <td className="fc-muted f-12 f-w-300 p-t-20 l-h-30" align="center">
                                  {item.date}
                                </td>
                                <td className="fc-muted f-12 f-w-300 p-t-20 l-h-30" align="center">
                                  {item.creator ? item.creator : '-'}
                                </td>
                                <td className="fc-muted f-14 f-w-300 p-t-10" align="center">
                                  <span class="btn-group dropleft col-sm-1 m-t-10">
                                    <button style={{padding:'6px 18px', border:'none', marginBottom:0, background:'transparent'}} class="btn btn-secondary btn-sm" type="button" id="dropdownMenu" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                      <i
                                        className="fa fa-ellipsis-v"
                                        style={{ fontSize: 14, marginRight:0, color:'rgb(148 148 148)' }}
                                      />
                                    </button>
                                    <div class="dropdown-menu" aria-labelledby="dropdownMenu" style={{fontSize:14, padding:5, borderRadius:0}}>
                                      {
                                        access_project_admin ?
                                          <button style={{ cursor: 'pointer' }} class="dropdown-item" type="button" onClick={this.rename.bind(this, item.id, item.name, 'record')}> Rename </button>
                                          :
                                          null
                                      }
                                      <button
                                        style={{cursor:'pointer'}}
                                        class="dropdown-item"
                                        type="button"
                                        onClick={e=>window.open(item.link, 'Rekaman Meeting')}
                                      >
                                          Open
                                      </button>
                                  {/* <button style={{cursor:'pointer'}} class="dropdown-item" type="button" onClick={()=>toast.warning('Coming Soon')}> Delete </button> */}
                                </div>
                              </span>
                            </td>
                          </tr>
                      )
                    }
                  </tbody>
                  :
                  <span>access denied</span>
            }
          </table>
        </div>
        <Modal
          show={this.state.modalDeleteFile}
          onHide={this.closeModalDeleteFile}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Konfirmasi
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Are you sure you want to delete the file <b>{this.state.deleteFileName}</b> ?</div>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btm-icademy-primary btn-icademy-grey"
              onClick={this.closeModalDeleteFile.bind(this)}
            >
              Cancel
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
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Konfirmasi
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Are you sure you want to delete the project <b>{this.state.deleteProjectName}</b> ?</div>
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
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Add Folder
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
                        placeholder="Folder Name"
                        onChange={this.onChangeInput}
                        required
                      />
                    </div>
                  </Col>
                </Row>
                {
                  Storage.get('user').data.company_type !== "pendidikan" && this.state.folderId != 0 ?
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
                      <Row>
                        <Col>
                          <Form.Group controlId="formJudul">
                            <Form.Label className="f-w-bold">
                              Limit Users
                            </Form.Label>
                            <div style={{ width: '100%' }}>
                              <ToggleSwitch checked={false} onChange={this.toggleSwitch.bind(this)} checked={this.state.limited} />
                            </div>
                            <Form.Text className="text-muted">
                              {
                                this.state.limited ? 'Only people registered as participants can access the folder.'
                                  :
                                  'Folders are open. All users can access.'
                              }
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>
                      {
                        this.state.limited &&
                        <Row>
                          <Col>
                            <MultiSelect
                              id="user"
                              options={this.state.optionsUser}
                              value={this.state.valueUser}
                              onChange={valueUser => this.setState({ valueUser })}
                              mode="tags"
                              required
                              enableSearch={true}
                              resetable={true}
                              valuePlaceholder="Pilih User"
                              hasSelectAll={true}
                              selectAllLabel="Select All"
                            />
                          </Col>
                        </Row>
                      }
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
                  Cancel
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
          show={this.state.modalEditFolder}
          onHide={this.closeModalEdit}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Edit Folder
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
                        placeholder="Folder Name"
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
                      <Row>
                        <Col>
                          <Form.Group controlId="formJudul">
                            <Form.Label className="f-w-bold">
                              Limit Users
                            </Form.Label>
                            <div style={{ width: '100%' }}>
                              <ToggleSwitch checked={false} onChange={this.toggleSwitch.bind(this)} checked={this.state.limited} />
                            </div>
                            <Form.Text className="text-muted">
                              {
                                this.state.limited ? 'Only people registered as participants can access the folder.'
                                  :
                                  'Folders are open. All users can access.'
                              }
                            </Form.Text>
                          </Form.Group>
                        </Col>
                      </Row>
                      {
                        this.state.limited &&
                        <Row>
                          <Col>
                            <MultiSelect
                              id="user"
                              options={this.state.optionsUser}
                              value={this.state.valueUser}
                              onChange={valueUser => this.setState({ valueUser })}
                              mode="tags"
                              required
                              enableSearch={true}
                              resetable={true}
                              valuePlaceholder="Pilih User"
                              hasSelectAll={true}
                              selectAllLabel="Select All"
                            />
                          </Col>
                        </Row>
                      }
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
                  Cancel
                      </button>
                <button
                  className="btn btn-icademy-primary"
                  onClick={this.editFolder.bind(this)}
                >
                  <i className="fa fa-save"></i>
                        Save
                      </button>
              </Modal.Footer>
            </Card>
          </Modal.Body>
        </Modal>
        <Modal
          show={this.state.modalRename}
          onHide={this.closeModalRename}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Rename File
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
                        name="renameFileNameNew"
                        value={this.state.renameFileNameNew}
                        className="form-control"
                        placeholder="Nama File"
                        onChange={this.onChangeInput}
                        required
                      />
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Modal.Footer>
                <button
                  className="btn btm-icademy-primary btn-icademy-grey"
                  onClick={this.closeModalRename.bind(this)}
                >
                  Cancel
                      </button>
                <button
                  className="btn btn-icademy-primary"
                  onClick={this.renameFile.bind(this)}
                >
                  <i className="fa fa-save"></i>
                        Save
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
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Upload File
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="cardku">
              <Card.Body>
                <Row>
                  <Col>
                    <div className="form-group">
                      <label>Attachment</label>
                      {this.state.attachmentId.length ? <label for="attachmentId" className="label-upload-icademy"> : {this.state.attachmentId.length} File</label> :null}
                      <input
                        accept="all"
                        id="attachmentId"
                        name="attachmentId"
                        onChange={this.onChangeInput}
                        type="file"
                        multiple
                        placeholder="media chapter"
                        className="form-control file-upload-icademy"
                      />
                      <Form.Text>
                        Support multiple files (make sure all the files does not exceed 500MB)
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
              Cancel
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

const FilesTable = props => (
  <SocketContext.Consumer>
    {
      socket => <FilesTableClass {...props} socket={socket} />
    }
  </SocketContext.Consumer>
)

export default FilesTable;
