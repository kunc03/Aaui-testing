import React, { Component } from "react";
import { toast } from "react-toastify";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { Editor } from '@tinymce/tinymce-react';
import { Modal, Row } from 'react-bootstrap';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import ToggleSwitch from "react-switch";
import DatePicker from "react-datepicker";
import moment from 'moment-timezone';
import axios from 'axios';
import { MultiSelect } from 'react-sm-select';

class FormCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
        edited: false,
        initialSession: false,
        selectedLicense:[],
        id: this.props.match.params.id ? this.props.match.params.id : '',
        companyId:'',
        image:'',
        logo:'',
        imagePreview:'assets/images/no-image.png',
        name: '',
        address: '',
        telephone: '',
        fax: '',
        website: '',
        email: '',
        isUploading: false,
        isSaving: false,
        scheduled: false,
        start_time: new Date(),
        end_time: new Date(),

        content:'Loading...',
        title: '',
        time: 0,
        overview: 'Loading...',
        session_title : '',
        file: '',
        selectedSession: '',
        media: [],
        progressUploadMedia: 0,
        modalDelete: false,
        disabledForm: this.props.disabledForm && this.props.id,
        session: [],
        optionsCourse: [],
        optionsLicense: [],
        valueCourse: []
    };
    this.goBack = this.goBack.bind(this);
  }
  
  goBack() {
    if (this.props.goBack){
        this.props.goBack();
    }
    else{
        this.props.history.push('/training/course');
    }
  }

  ToggleSwitchScheduled(checked) {
    this.setState({ scheduled: !this.state.scheduled, edited: true });
  }

  closeModalDelete = e => {
    this.setState({ modalDelete: false, deleteId: '' })
  }

autoSave = (isDrag) =>{
    this.setState({isSaving: true})
    if (!this.state.edited && !isDrag){this.setState({isSaving: false});return;}
    if (!this.state.title || !this.state.overview){
        toast.warning('Some field is required, please check your data.')
        this.setState({isSaving: false})
    }
    else{
        if (this.state.id){
            let form = {
                image: this.state.image,
                title: this.state.title,
                overview: this.state.overview,
                require_course_id: this.state.valueCourse,
                scheduled: this.state.scheduled ? 1 : 0,
                start_time: moment.tz(this.state.start_time, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
                end_time: moment.tz(this.state.end_time, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
                session: this.state.session,
                created_by: Storage.get('user').data.user_id,
                license_type_id: this.state.selectedLicense.length ? this.state.selectedLicense[0] : null
            }

            API.put(`${API_SERVER}v2/training/course/${this.state.id}`, form).then(res => {
                if (res.data.error){
                    toast.error('Error edit course')
                }
                else{
                    if (this.state.image){
                        let formData = new FormData();
                        formData.append("image", this.state.image)
                        API.put(`${API_SERVER}v2/training/course/image/${this.state.id}`, formData).then(res2 => {
                            if (res2.data.error){
                                toast.warning('Course edited but fail to upload image')
                                this.setState({edited: false, isSaving: false})
                            }
                            else{
                                toast.success('Automatic saving')
                                this.setState({edited: false, isSaving: false})
                            }
                        })
                    }
                    else{
                        toast.success('Automatic saving')
                        this.setState({edited: false, isSaving: false})
                    }
                }
            })
        }
    }
}
  save = (e, newSession) =>{
    this.setState({isSaving: true})
    e.preventDefault();
    if (!this.state.edited && !newSession) {this.setState({isSaving: false});return;}
    if (!this.state.title || !this.state.overview){
        toast.warning('Some field is required, please check your data.')
        this.setState({isSaving: false})
    }
    else{
        if (this.state.id){
            let form = {
                image: this.state.image,
                title: this.state.title,
                overview: this.state.overview,
                require_course_id: this.state.valueCourse,
                scheduled: this.state.scheduled ? 1 : 0,
                start_time: moment.tz(this.state.start_time, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
                end_time: moment.tz(this.state.end_time, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
                session: this.state.session,
                created_by: Storage.get('user').data.user_id,
                id_organizer: this.state.selectedLicense.length ? this.state.selectedLicense[0] : null
            }

            API.put(`${API_SERVER}v2/training/course/${this.state.id}`, form).then(res => {
                if (res.data.error){
                    toast.error('Error edit course')
                }
                else{
                    if (this.state.image){
                        let formData = new FormData();
                        formData.append("image", this.state.image)
                        API.put(`${API_SERVER}v2/training/course/image/${this.state.id}`, formData).then(res2 => {
                            if (res2.data.error){
                                toast.warning('Course edited but fail to upload image')
                                this.setState({edited: false, isSaving: false})
                            }
                            else{
                                if (newSession){
                                    this.addNewSession();
                                    toast.success('Automatic saving')
                                    this.setState({edited: false, isSaving: false})
                                }
                                else{
                                    toast.success('Course edited')
                                    this.setState({edited: false, isSaving: false})
                                }
                            }
                        })
                    }
                    else{
                        if (newSession){
                            this.addNewSession();
                            toast.success('Automatic saving')
                            this.setState({edited: false, isSaving: false})
                        }
                        else{
                            toast.success('Course edited')
                            this.setState({edited: false, isSaving: false})
                        }
                    }
                }
            })
        }
        else{
            let form = {
                company_id: this.state.companyId,
                title: this.state.title,
                overview: this.state.overview,
                require_course_id: this.state.valueCourse,
                scheduled: this.state.scheduled ? 1 : 0,
                start_time: moment.tz(this.state.start_time, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
                end_time: moment.tz(this.state.end_time, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
                session: this.state.session,
                created_by: Storage.get('user').data.user_id,
                license_type_id: this.state.selectedLicense.length ? this.state.selectedLicense[0] : null,
            }

            API.post(`${API_SERVER}v2/training/course`, form).then(res => {
                if (res.data.error){
                    toast.error('Error create course')
                }
                else{
                    if (this.state.image){
                        let formData = new FormData();
                        formData.append("image", this.state.image)
                        API.put(`${API_SERVER}v2/training/course/image/${res.data.result.insertId}`, formData).then(res2 => {
                            if (res2.data.error){
                                toast.warning('Course created but fail to upload image')
                                this.setState({edited: false, isSaving: false})
                                this.props.history.push(`/training/course/edit/${res.data.result.insertId}`)
                            }
                            else{
                                this.setState({id: res.data.result.insertId})
                                if (newSession){
                                    this.addNewSession();
                                    toast.success('Automatic saving')
                                    this.setState({edited: false, isSaving: false})
                                }
                                else{
                                    toast.success('Saving course')
                                    this.setState({edited: false, isSaving: false})
                                }
                                this.props.history.push(`/training/course/edit/${res.data.result.insertId}`)
                            }
                        })
                    }
                    else{
                        this.setState({id: res.data.result.insertId})
                        if (newSession){
                            this.addNewSession();
                            toast.success('Automatic saving')
                            this.setState({isSaving: false})
                        }
                        else{
                            toast.success('Saving course')
                            this.setState({isSaving: false})
                        }
                        this.props.history.push(`/training/course/edit/${res.data.result.insertId}`)
                    }
                }
            })
        }
    }
}

handleDynamicInput = (e) => {
    this.setState({ content: e, edited:true });
    let i = this.state.session.indexOf(this.state.session.filter(item=> item.id === this.state.selectedSession)[0]);
    let item = {
        id : this.state.selectedSession,
        title : this.state.session_title,
        content : e,
        sort : i,
        time : this.state.time,
        media : this.state.media
    }
    this.state.session.splice(i, 1, item)
}
handleOverview = (e) => {
    this.setState({ overview: e, edited:true });
}
  handleChange = e => {
    this.setState({edited: true})
      let {name, value} = e.target;
      if (name==='media'){
        if (e.target.files.length){
            if (e.target.files[0].size <= 500000000) {
                // this.setState({isUploading: true})
                let selectedSession = this.state.selectedSession;
                let i = this.state.session.indexOf(this.state.session.filter(item=> item.id === selectedSession)[0]);
                let session = this.state.session;
                session[i].isUploading = true;
                this.setState({session: session})
                let formData = new FormData();
                formData.append("media", e.target.files[0])
                let token = Storage.get('token');
                var config = {
                  onUploadProgress: progressEvent => {
                    // this.setState({progressUploadMedia: Math.round( (progressEvent.loaded * 100) / progressEvent.total )});
                    let session = this.state.session;
                    session[i].progressUploadMedia = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                    this.setState({session: session})
                  },
                  headers: {
                    Authorization: token.data,
                  }
                };
                axios.post(`${API_SERVER}v2/training/course/session/media/${this.state.selectedSession}`, formData, config).then(res => {
                    if (res.data.error){
                        toast.warning('Fail to upload media')
                        // this.setState({isUploading: false, progressUploadMedia: 0})
                        let session = this.state.session;
                        session[i].progressUploadMedia = 0;
                        session[i].isUploading = false;
                        this.setState({session: session})
                    }
                    else{
                        this.state.session[i].media.push({
                            id: res.data.result.id,
                            name: res.data.result.name,
                            url: res.data.result.url
                        })
                        // this.setState({isUploading: false, progressUploadMedia: 0})
                        let session = this.state.session;
                        session[i].progressUploadMedia = 0;
                        session[i].isUploading = false;
                        this.setState({session: session})
                    }
                })
            } else {
              e.target.value = null;
              toast.warning('Image size cannot larger than 5MB and must be an image file')
            }
        }
      }
      else if (name==='image'){
        if (e.target.files.length){
            if (e.target.files[0].size <= 5000000) {
                let image = {
                    image: e.target.files[0],
                    imagePreview: URL.createObjectURL(e.target.files[0])
                }
                this.setState(image)
            } else {
              e.target.value = null;
              toast.warning('Image size cannot larger than 5MB and must be an image file')
            }
        }
      }
      else if (name==='session_title'){
        this.setState({[name]: value})
        let i = this.state.session.indexOf(this.state.session.filter(item=> item.id === this.state.selectedSession)[0]);
        let item = {
            id : this.state.selectedSession,
            title : value,
            content : this.state.content,
            sort : i,
            time : this.state.time,
            media : this.state.media
        }
        this.state.session.splice(i, 1, item)
      }
      else if (name==='time'){
        this.setState({[name]: value})
        let i = this.state.session.indexOf(this.state.session.filter(item=> item.id === this.state.selectedSession)[0]);
        let item = {
            id : this.state.selectedSession,
            title : this.state.session_title,
            content : this.state.content,
            sort : i,
            time : value,
            media : this.state.media
        }
        this.state.session.splice(i, 1, item)
      }
      else{
          this.setState({[name]: value})
      }
  }

  deleteMedia(id){
    API.delete(`${API_SERVER}v2/training/course/session/media/${id}`).then(res => {
        if (res.data.error){
            toast.warning('Fail to delete media')
        }
        else{
            let i = this.state.media.indexOf(this.state.media.filter(item=> item.id === id)[0]);
            let media = this.state.media;
            media.splice(i, 1);
            this.forceUpdate();
        }
    })
  }
  getCourse(id){
    API.get(`${API_SERVER}v2/training/course/read/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error read course')
        }
        else{
            this.setState({
                initialSession: res.data.result.session.length ? true : false,
                id: res.data.result.id,
                title: res.data.result.title,
                overview: res.data.result.overview === null || res.data.result.overview === 'Loading...' ? '' : res.data.result.overview,
                valueCourse: res.data.result.require_course_id === null || res.data.result.require_course_id === 0 ? [] : [Number(res.data.result.require_course_id)],
                scheduled: res.data.result.scheduled ? true : false,
                start_time: res.data.result.start_time ? new Date(res.data.result.start_time) : new Date(),
                end_time: res.data.result.end_time ? new Date(res.data.result.end_time) : new Date(),
                imagePreview: res.data.result.image ? res.data.result.image : this.state.imagePreview,
                session: res.data.result.session,
                selectedSession : res.data.result.session.length ? res.data.result.session[0].id : '',
                selectedLicense : res.data.result.id_organizer ? [res.data.result.id_organizer] : [],
            })
            if (this.state.session.length){
                this.selectSession(this.state.selectedSession);
            }
            this.getLicense(res.data.result.id_organizer)
        }
    })
  }
  getLicense(idLicense){
    API.get(`${API_SERVER}v2/training/settings/organizer/${this.state.companyId}`).then(res => {
        if (res.data.error){
            toast.error(`Error read course list`)
        }else{
            try{
                let optionsLicense = this.state.optionsLicense;
                if(optionsLicense.length){
                    optionsLicense = [];
                }
                let selectedLicense = [];
                res.data.result.map((item)=>{
                    let name = item.name;
                    
                    optionsLicense.push({label: name, value: item.id});
                    if(idLicense === item.id){
                        selectedLicense = [item.id];
                    }
                });
                this.setState({ selectedLicense,optionsLicense });
            }catch(e){
            }
        }
    });
  }
  getUserData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
          this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id },()=>{
            this.getLicense(null);
            API.get(`${API_SERVER}v2/training/course-list/${this.state.companyId}`).then(res => {
                if (res.data.error){
                    toast.error(`Error read course list`)
                }
                else{
                    res.data.result.map((item)=>{
                        this.state.optionsCourse.push({label: item.title, value: item.id})
                    })
                    if (this.props.disabledForm && this.props.id){
                        this.getCourse(this.props.id);
                    }
                    else if (this.props.match.params.id){
                        this.getCourse(this.props.match.params.id);
                    }
                    else{
                        this.setState({overview: ''})
                    }
                }
            })
          });
        }
    })
  }
  componentDidMount(){
    this.getUserData();
  }

  selectSession = (id) => {
      if (this.state.selectedSession !== id){
        this.autoSave();
        this.setState({
          initialSession: true,
          selectedSession : this.state.session.filter(item => item.id === id)[0].id,
          session_title : this.state.session.filter(item => item.id === id)[0].title,
          time : this.state.session.filter(item => item.id === id)[0].time,
          content : this.state.session.filter(item => item.id === id)[0].content,
          media : this.state.session.filter(item => item.id === id)[0].media,
        })
      }
      else{
        this.setState({
          initialSession: true,
          selectedSession : this.state.session.filter(item => item.id === id)[0].id,
          session_title : this.state.session.filter(item => item.id === id)[0].title,
          time : this.state.session.filter(item => item.id === id)[0].time,
          content : this.state.session.filter(item => item.id === id)[0].content,
          media : this.state.session.filter(item => item.id === id)[0].media,
        })
      }
  }

  clearSessionForm(){
    this.setState({
        edited: false,
        selectedSession : '',
        session_title : '',
        time : 0,
        content : '',
        media : []
      })
  }

  deleteSession(){
    API.delete(`${API_SERVER}v2/training/course/session/${this.state.selectedSession}`).then(res => {
        if (res.data.error){
            toast.error('Error delete course')
        }
        else{
            let i = this.state.session.indexOf(this.state.session.filter(item=> item.id === this.state.selectedSession)[0]);
            let form = {
                id : this.state.session[i].id
            }
            let session = this.state.session;
            session.splice(i, 1);
            this.setState({session : session});
            if (session.length){
              this.selectSession(session[0].id);
            }
            else{
              this.setState({initialSession: false})
              this.clearSessionForm();
            }
            this.closeModalDelete();
        }
    })
  }

  addNewSession(){
    if (!this.state.title){
        toast.warning('Some field is required, please check your data.')
        this.setState({isSaving: false})
    }
    else{
        let form = {
          course_id : this.props.match.params.id ? this.props.match.params.id : this.state.id,
          title : "",
          content : "",
          time : 0,
          sort : this.state.session.length,
        };
      API.post(`${API_SERVER}v2/training/course/session`, form).then(res => {
          if (res.data.error){
              toast.error('Error create session')
          }
          else{
              this.setState({initialSession: true}, ()=>{
                  this.session_title.focus();
                  this.state.session.push({
                      id : res.data.result.insertId,
                      title : "",
                      content : "",
                      time : 0,
                      sort : this.state.session.length,
                      media : []
                  })
                  let id = this.state.session[this.state.session.length-1].id;
                  this.setState({
                    initialSession: true,
                    selectedSession : this.state.session.filter(item => item.id === id)[0].id,
                    session_title : this.state.session.filter(item => item.id === id)[0].title,
                    time : this.state.session.filter(item => item.id === id)[0].time,
                    content : this.state.session.filter(item => item.id === id)[0].content,
                    media : this.state.session.filter(item => item.id === id)[0].media,
                  })
                  this.forceUpdate()
              })
          }
      })
    }
  }
  handleOnDragEnd(result){
    if (!result.destination) return;
    const items = Array.from(this.state.session);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    this.setState({session: items},()=>{
        this.autoSave(true)
    })
  }
  render() {
    let {session, media} = this.state;
    let indexSession = this.state.session.indexOf(this.state.session.filter(item=> item.id === this.state.selectedSession)[0]);
    return(
        <div className="pcoded-main-container">
            <div className="pcoded-wrapper">
                <div className="pcoded-content">
                    <div className="pcoded-inner-content">
                        <div className="main-body">
                            <div className="page-wrapper">
                                <div className="floating-back">
                                    <img
                                    src={`newasset/back-button.svg`}
                                    alt=""
                                    width={90}
                                    onClick={this.goBack}
                                    ></img>
                                </div>
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div>
                                            <div className="card p-20">
                                                <div className="row">
                                                    <div className="col-sm-10 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>{this.props.id ? 'Detail' : this.props.match.params.id ? 'Edit' : 'Create New'} Course</strong>
                                                    </div>
                                                    <div className="col-sm-2 m-b-20">
                                                        {
                                                        this.props.disabledForm &&
                                                        <button
                                                        onClick={this.props.goEdit}
                                                        className="btn btn-icademy-primary float-right"
                                                        style={{ padding: "7px 8px !important", marginRight: 30 }}>
                                                            <i className="fa fa-edit"></i>
                                                            Edit
                                                        </button>
                                                        }
                                                    </div>
                                                </div>
                                                <div className="form-section">
                                                    <div className="row">
                                                        <div className="col-sm-12 m-b-20">
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>Course Information</strong>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-field-top-label">
                                                            <label for="image">Thumbnail</label>
                                                            <center>
                                                                <label for='image' style={{cursor:'pointer', borderRadius:'4px', overflow:'hidden'}}>
                                                                    <a href={this.state.imagePreview} target="_blank">
                                                                        <img src={this.state.imagePreview} height="54.8px" />
                                                                    </a>
                                                                </label>
                                                                <label for='image' style={{cursor:'pointer', overflow:'hidden', display: this.state.disabledForm ? 'none' : 'block'}}>
                                                                    <div className="button-bordered-grey" style={{width:'100px'}}>
                                                                        {this.state.image ? this.state.image.name : 'Choose file'}
                                                                    </div>
                                                                </label>
                                                            </center>
                                                            <input type="file" accept="image/*" name="image" id="image" onChange={this.handleChange} disabled={this.state.disabledForm} onClick={e=> e.target.value = null}/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="title">Title<required>*</required></label>
                                                            <input type="text" name="title" size="50" id="name" placeholder="XXXXX XXXXX XXXXX" value={this.state.title} onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                        <div className="form-field-top-label" style={{width:'80%'}}>
                                                                    <label for="overview">Overview<required>*</required></label>
                                                                    <input id={`myFile`} type="file" name={`myFile`} style={{display:"none"}} onChange="" />
                                                                    {
                                                                        this.state.overview !== 'Loading...' ?
                                                                        <Editor
                                                                            name="overview"
                                                                            apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                                                                            initialValue={this.state.overview}
                                                                            value={this.state.overview}
                                                                            init={{
                                                                            height: 200,
                                                                            menubar: false,
                                                                            convert_urls: false,
                                                                            image_class_list: [
                                                                                {title: 'None', value: ''},
                                                                                {title: 'Responsive', value: 'img-responsive'},
                                                                                {title: 'Thumbnail', value: 'img-responsive img-thumbnail'}
                                                                            ],
                                                                            file_browser_callback_types: 'image',
                                                                            file_picker_callback: function (callback, value, meta) {
                                                                                if (meta.filetype == 'image') {
                                                                                var input = document.getElementById(`myFile`);
                                                                                input.click();
                                                                                input.onchange = function () {
        
                                                                                    var dataForm = new FormData();
                                                                                    dataForm.append('file', this.files[0]);
        
                                                                                    window.$.ajax({
                                                                                    url: `${API_SERVER}v2/media/upload`,
                                                                                    type: 'POST',
                                                                                    data: dataForm,
                                                                                    processData: false,
                                                                                    contentType: false,
                                                                                    success: (data)=>{
                                                                                        callback(data.result.url);
                                                                                        this.value = '';
                                                                                    }
                                                                                    })
        
                                                                                };
                                                                                }
                                                                            },
                                                                            plugins: [
                                                                                "advlist autolink lists link image charmap print preview anchor",
                                                                                "searchreplace visualblocks code fullscreen",
                                                                                "insertdatetime media table paste code help wordcount"
                                                                            ],
                                                                            toolbar:
                                                                                // eslint-disable-next-line no-multi-str
                                                                                "undo redo | bold italic backcolor | \
                                                                            alignleft aligncenter alignright alignjustify | image | \
                                                                                bullist numlist outdent indent | removeformat | help"
                                                                            }}
                                                                            onEditorChange={e => this.handleOverview(e)}
                                                                        />
                                                                        :null
                                                                    }
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-section">
                                                    <div className="row">
                                                        <div className="col-sm-12 m-b-20">
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>Course Configuration</strong>
                                                        </div>
                                                    </div>
                                                    <Row>
                                                        <div className="form-field-top-label" style={{width:400}}>
                                                            <label for="valueCourse">Organizer</label>
                                                            <MultiSelect id="valueCourse" options={this.state.optionsLicense} value={this.state.selectedLicense} onChange={(selectedLicense) =>{ console.log(selectedLicense); this.setState({ selectedLicense }) }} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Organizer" />
                                                        </div>
                                                    </Row>
                                                    <div className="row">
                                                        <div className="form-field-top-label" style={{width:400}}>
                                                            <label for="valueCourse">Required Course</label>
                                                            <MultiSelect id="valueCourse" options={this.state.optionsCourse} value={this.state.valueCourse} onChange={valueCourse => this.setState({ valueCourse, edited: true })} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Course" />
                                                            <p className="form-notes">Keep empty if you don't want this course require other course's exam</p>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="scheduled">Scheduled</label>
                                                            <ToggleSwitch className="form-toggle-switch" name="scheduled" onChange={this.ToggleSwitchScheduled.bind(this)} checked={this.state.scheduled} />
                                                            <p className="form-notes">{this.state.scheduled ? 'Course will available for certain schedule' : 'Course always available'}</p>
                                                        </div>
                                                        {
                                                            this.state.scheduled ?
                                                            <div className="form-field-top-label">
                                                                <label for="start_time">Start Date & Time</label>
                                                                <DatePicker showTimeSelect dateFormat="yyyy-MM-dd HH:mm" selected={this.state.start_time} onChange={e => this.setState({ start_time: e, edited: true })} />
                                                            </div>
                                                            : null
                                                        }
                                                        {
                                                            this.state.scheduled ?
                                                            <div className="form-field-top-label">
                                                                <label for="end_time">End Date & Time</label>
                                                                <DatePicker showTimeSelect dateFormat="yyyy-MM-dd HH:mm" selected={this.state.end_time} onChange={e => this.setState({ end_time: e, edited: true })} />
                                                            </div>
                                                            : null
                                                        }
                                                    </div>
                                                </div>
                                                <div className="form-section no-border">
                                                    <div className="row">
                                                        <div className="col-sm-12 m-b-20">
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>Session</strong>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <DragDropContext onDragEnd={this.handleOnDragEnd.bind(this)}>
                                                            <Droppable droppableId="sessions">
                                                                {(provided) => (
                                                        <div className="col-sm-3" style={{marginTop:34}} {...provided.droppableProps} ref={provided.innerRef}>
                                                            {
                                                                session.map((item, index)=>
                                                                    <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                                                                        {(provided) => (
                                                                    <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="training-session-list" onClick={this.selectSession.bind(this, item.id)}>
                                                                        <i className="fa fa-bars icon-draggable"></i>
                                                                        {item.title}
                                                                        {
                                                                            this.state.selectedSession === item.id &&
                                                                            <div className="training-session-list-indicator"><i className="fa fa-chevron-right"></i></div>
                                                                        }
                                                                    </div>
                                                                        )}
                                                                    </Draggable>
                                                                )
                                                            }
                                                            {provided.placeholder}
                                                            <div className="training-new-session" onClick={ e => this.save(e, true)}>
                                                                <i className="fa fa-plus"></i> Add session
                                                            </div>
                                                        </div>
                                                                )}
                                                            </Droppable>
                                                        </DragDropContext>
                                                        {
                                                            this.state.initialSession ?
                                                            <div className="col-sm-9">
                                                                <div className="form-field-top-label">
                                                                    <label for="session_title">Session Title<required>*</required></label>
                                                                    <input type="text" ref={(input) => { this.session_title = input; }} name="session_title" size="50" id="name" placeholder="XXXXX XXXXX XXXXX" onChange={this.handleChange} value={this.state.session_title}/>
                                                                </div>
                                                                <div className="form-field-top-label">
                                                                    <label for="time">Time (Minute)<required>*</required></label>
                                                                    <input type="number" name="time" size="30" id="name" min={0} placeholder="00" onChange={this.handleChange} value={this.state.time}/>
                                                                </div>
                                                                <div className="form-field-top-label" style={{width:'80%'}}>
                                                                    <label for="name">Content</label>
                                                                    <input id={`myFile`} type="file" name={`myFile`} style={{display:"none"}} onChange="" />
                                                                    {
                                                                        this.state.content !== 'Loading...' ?
                                                                        <Editor
                                                                            name="content"
                                                                            apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                                                                            initialValue={this.state.content}
                                                                            value={this.state.content}
                                                                            init={{
                                                                            height: 400,
                                                                            width: "100%",
                                                                            menubar: false,
                                                                            convert_urls: false,
                                                                            image_class_list: [
                                                                                {title: 'None', value: ''},
                                                                                {title: 'Responsive', value: 'img-responsive'},
                                                                                {title: 'Thumbnail', value: 'img-responsive img-thumbnail'}
                                                                            ],
                                                                            file_browser_callback_types: 'image',
                                                                            file_picker_callback: function (callback, value, meta) {
                                                                                if (meta.filetype == 'image') {
                                                                                var input = document.getElementById(`myFile`);
                                                                                input.click();
                                                                                input.onchange = function () {
        
                                                                                    var dataForm = new FormData();
                                                                                    dataForm.append('file', this.files[0]);
        
                                                                                    window.$.ajax({
                                                                                    url: `${API_SERVER}v2/media/upload`,
                                                                                    type: 'POST',
                                                                                    data: dataForm,
                                                                                    processData: false,
                                                                                    contentType: false,
                                                                                    success: (data)=>{
                                                                                        callback(data.result.url);
                                                                                        this.value = '';
                                                                                    }
                                                                                    })
        
                                                                                };
                                                                                }
                                                                            },
                                                                            plugins: [
                                                                                "advlist autolink lists link image charmap print preview anchor",
                                                                                "searchreplace visualblocks code fullscreen",
                                                                                "insertdatetime media table paste code help wordcount"
                                                                            ],
                                                                            toolbar:
                                                                                // eslint-disable-next-line no-multi-str
                                                                                "undo redo | bold italic backcolor | \
                                                                            alignleft aligncenter alignright alignjustify | image | \
                                                                                bullist numlist outdent indent | removeformat | help"
                                                                            }}
                                                                            onEditorChange={e => this.handleDynamicInput(e)}
                                                                        />
                                                                        :null
                                                                    }
                                                                </div>
                                                                <div className="form-field-top-label">
                                                                    <label for="media">Media</label>
                                                                    <div className="training-session-media">
                                                                        {
                                                                            media.map(item => {
                                                                                let icon = 'fa-paperclip'
                                                                                switch (item.type){
                                                                                    case 'PDF' : icon = 'fa-file-pdf'; break;
                                                                                    case 'Word' : icon = 'fa-file-word'; break;
                                                                                    case 'Excel' : icon = 'fa-file-excel'; break;
                                                                                    case 'PowerPoint' : icon = 'fa-file-powerpoint'; break;
                                                                                    case 'Image' : icon = 'fa-image'; break;
                                                                                    case 'Video' : icon = 'fa-file-video'; break;
                                                                                    case 'Audio' : icon = 'fa-file-audio'; break;
                                                                                    default : icon = 'fa-paperclip';
                                                                                }
                                                                                return(
                                                                                <div className="training-session-media-list">
                                                                                    <a href={item.url} target="_blank" style={{color:"#000"}}>
                                                                                        <i className={`fa ${icon}`}></i>&nbsp;
                                                                                        {item.name}
                                                                                    </a>
                                                                                    <i className="fa fa-times" onClick={this.deleteMedia.bind(this, item.id)}></i>
                                                                                </div>
                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                    {
                                                                        this.state.session[indexSession] ?
                                                                        <>
                                                                            <label for="media" className="form-control" disabled={this.state.session[indexSession].progressUploadMedia}>
                                                                                <div className='loading-button' style={{width: this.state.session[indexSession].progressUploadMedia ? this.state.session[indexSession].progressUploadMedia : '0' +'%'}}></div>
                                                                                {this.state.session[indexSession].progressUploadMedia ? null : <i className="fa fa-plus"></i>}&nbsp;
                                                                                {this.state.session[indexSession].progressUploadMedia ? this.state.session[indexSession].progressUploadMedia === 100 ? 'Uploaded. Processing file...' : `Uploading... ${this.state.session[indexSession].progressUploadMedia}%` : 'Add media'}
                                                                            </label>
                                                                            <input type="file" id="media" name="media" disabled={this.state.session[indexSession].progressUploadMedia} class="form-control file-upload-icademy" onChange={this.handleChange} onClick={e=> e.target.value = null} />
                                                                        </>
                                                                        : null
                                                                    }
                                                                </div>
                                                            </div>
                                                            : null
                                                        }
                                                    </div>
                                                </div>
                                                <div className="row" style={{justifyContent:'flex-end'}}>
                                                    {
                                                    !this.props.disabledForm && this.state.initialSession &&
                                                    <button
                                                    onClick={()=>this.setState({modalDelete: true})}
                                                    className="btn btn-icademy-primary btn-icademy-red float-right"
                                                    style={{ padding: "7px 8px !important", margin:0, marginRight: 14 }}>
                                                        <i className="fa fa-trash-alt"></i>
                                                        Delete selected session
                                                    </button>
                                                    }
                                                    {
                                                    !this.props.disabledForm &&
                                                    <button
                                                    disabled={this.state.isSaving || !this.state.edited}
                                                    onClick={this.save}
                                                    className="btn btn-icademy-primary float-right"
                                                    style={{ padding: "7px 8px !important", marginRight: 30 }}>
                                                        <i className="fa fa-save"></i>
                                                        {this.state.isSaving ? 'Saving...' : this.state.edited ? 'Save' : 'No changes to save'}
                                                    </button>
                                                    }
                                                </div>
                                            </div>
          <Modal show={this.state.modalDelete} onHide={this.closeModalDelete} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Confirmation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>Are you sure want to delete this session ?</div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalDelete.bind(this)}>
                Cancel
              </button>
              <button className="btn btn-icademy-primary btn-icademy-red" onClick={this.deleteSession.bind(this)}>
                <i className="fa fa-trash"></i> Delete
              </button>
            </Modal.Footer>
          </Modal>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
  }
}

export default FormCourse;
