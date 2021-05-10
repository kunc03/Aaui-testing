import React, { Component } from "react";
import { toast } from "react-toastify";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { Editor } from '@tinymce/tinymce-react';
import { MultiSelect } from 'react-sm-select';

class FormQuestions extends Component {
  constructor(props) {
    super(props);
    this.state = {
        edited: false,
        initialSession: false,
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

        explanation: 'Loading...',
        optionA:'',
        optionB:'',
        optionC:'',
        optionD:'',
        optionE:'',
        optionsLicensesType: [],
        valueLicensesType: [],
        optionsCourse: [],
        valueCourse: [],
        answer: '',
        question_text: 'Loading...',
        content:'Loading...',
        title: '',
        overview: 'Loading...',
        session_title : '',
        file: '',
        selectedSession: '',
        media: [],
        modalDelete: false,
        disabledForm: this.props.disabledForm && this.props.id,
        session: []
    };
    this.goBack = this.goBack.bind(this);
  }
  
  goBack() {
    if (this.props.goBack){
        this.props.goBack();
    }
    else{
        this.props.history.push('/training/questions');
    }
  }

  closeModalDelete = e => {
    this.setState({ modalDelete: false, deleteId: '' })
  }

autoSave = (isDrag) =>{
    this.setState({isSaving: true})
    if (!this.state.edited && !isDrag){this.setState({isSaving: false}); return;}
    if (!this.state.title || !this.state.overview){
        toast.warning('Some field is required, please check your data.')
    }
    else{
        if (this.state.id){
            let form = {
                image: this.state.image,
                title: this.state.title,
                overview: this.state.overview,
                session: this.state.session,
                created_by: Storage.get('user').data.user_id
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
    if (!this.state.valueLicensesType.length || !this.state.valueCourse.length){
        toast.warning('Some field is required, please check your data.')
    }
    else{
        if (this.state.id){
            let form = {
                training_course_id: String(this.state.valueCourse),
                licenses_type_id: String(this.state.valueLicensesType),
                question: this.state.question_text,
                answer: this.state.answer,
                explanation: this.state.explanation,
                options : [
                    {option_label: 'A', option_text: this.state.optionA},
                    {option_label: 'B', option_text: this.state.optionB},
                    {option_label: 'C', option_text: this.state.optionC},
                    {option_label: 'D', option_text: this.state.optionD},
                    {option_label: 'E', option_text: this.state.optionE},
                ]
            }
            API.put(`${API_SERVER}v2/training/questions/${this.state.id}`, form).then(res => {
                if (res.data.error){
                    toast.error('Error edit questions')
                }
                else{
                    toast.success('Question edited')
                    this.props.history.push(`/training/questions`)
                }
            })
        }
        else{
            let form = {
                training_course_id: String(this.state.valueCourse),
                licenses_type_id: String(this.state.valueLicensesType),
                question: this.state.question_text,
                answer: this.state.answer,
                explanation: this.state.explanation,
                options : [
                    {option_label: 'A', option_text: this.state.optionA},
                    {option_label: 'B', option_text: this.state.optionB},
                    {option_label: 'C', option_text: this.state.optionC},
                    {option_label: 'D', option_text: this.state.optionD},
                    {option_label: 'E', option_text: this.state.optionE},
                ]
            }
            API.post(`${API_SERVER}v2/training/questions`, form).then(res => {
                if (res.data.error){
                    toast.error('Error create questions')
                }
                else{
                    toast.success('New questions added')
                    this.props.history.push(`/training/questions`)
                }
            })
        }
    }
}

handleChangeOpt = e => {
    let {name, value} = e.target;
      this.setState({[name]: value})
}
handleChangeAnswer = (value) => {
    this.setState({answer: value})
}
handleDynamicInput = (e) => {
    this.setState({ question_text: e });
}
handleDynamicInput2 = (e) => {
    this.setState({ explanation: e });
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
                this.setState({isUploading: true})
                let formData = new FormData();
                formData.append("media", e.target.files[0])
                API.post(`${API_SERVER}v2/training/course/session/media/${this.state.selectedSession}`, formData).then(res => {
                    if (res.data.error){
                        toast.warning('Fail to upload image')
                        this.setState({isUploading: false})
                    }
                    else{
                        let i = this.state.session.indexOf(this.state.session.filter(item=> item.id === this.state.selectedSession)[0]);
                        let media = this.state.media;
                        media.push({
                            id: res.data.result.id,
                            name: res.data.result.name,
                            url: res.data.result.url
                        })
                        this.setState({media: media, isUploading: false})
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
            media : this.state.media
        }
        this.state.session.splice(i, 1, item)
      }
      else{
          this.setState({[name]: value})
      }
  }
  getData(id){
    API.get(`${API_SERVER}v2/training/questions/read/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error read questions')
        }
        else{
            this.setState({
                id: res.data.result.id,
                question_text: res.data.result.question,
                explanation: res.data.result.explanation,
                answer: res.data.result.answer,
                valueCourse: [res.data.result.training_course_id],
                valueLicensesType: [res.data.result.licenses_type_id],
                optionA: res.data.result.options.filter(item => item.option_label === 'A').length ? res.data.result.options.filter(item=> item.option_label === 'A')[0].option_text : '',
                optionB: res.data.result.options.filter(item => item.option_label === 'B').length ?res.data.result.options.filter(item=> item.option_label === 'B')[0].option_text : '',
                optionC: res.data.result.options.filter(item => item.option_label === 'C').length ?res.data.result.options.filter(item=> item.option_label === 'C')[0].option_text : '',
                optionD: res.data.result.options.filter(item => item.option_label === 'D').length ?res.data.result.options.filter(item=> item.option_label === 'D')[0].option_text : '',
                optionE: res.data.result.options.filter(item => item.option_label === 'E').length ?res.data.result.options.filter(item=> item.option_label === 'E')[0].option_text : '',
            })
        }
    })
  }
  getUserData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
          this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id },()=>{
            API.get(`${API_SERVER}v2/training/settings/licenses-type/${this.state.companyId}`).then(res => {
                if (res.data.error){
                    toast.error(`Error read licenses type`)
                }
                else{
                    res.data.result.map((item)=>{
                        this.state.optionsLicensesType.push({label: item.name, value: item.id})
                    })
                }
            })
            API.get(`${API_SERVER}v2/training/course-list-admin/${this.state.companyId}`).then(res => {
                if (res.data.error){
                    toast.error(`Error read course list`)
                }
                else{
                    res.data.result.map((item)=>{
                        this.state.optionsCourse.push({label: item.title, value: item.id})
                    })
                    if (this.props.disabledForm && this.props.id){
                        this.getData(this.props.id);
                    }
                    else if (this.props.match.params.id){
                        this.getData(this.props.match.params.id);
                    }
                    else{
                        this.setState({
                            question_text: '',
                            explanation: '',
                        })
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
          content : this.state.session.filter(item => item.id === id)[0].content,
          media : this.state.session.filter(item => item.id === id)[0].media,
        })
      }
      else{
        this.setState({
          initialSession: true,
          selectedSession : this.state.session.filter(item => item.id === id)[0].id,
          session_title : this.state.session.filter(item => item.id === id)[0].title,
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
    }
    else{
        let form = {
          course_id : this.props.match.params.id ? this.props.match.params.id : this.state.id,
          title : "",
          content : "",
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
                      sort : this.state.session.length,
                      media : []
                  })
                  let id = this.state.session[this.state.session.length-1].id;
                  this.setState({
                    initialSession: true,
                    selectedSession : this.state.session.filter(item => item.id === id)[0].id,
                    session_title : this.state.session.filter(item => item.id === id)[0].title,
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
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>{this.props.id ? 'Detail' : this.props.match.params.id ? 'Edit' : 'Create New'} Questions</strong>
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
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>Questions Configuration</strong>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-field-top-label" style={{width:400}}>
                                                            <label for="licenses">Licenses Type<required>*</required></label>
                                                            <MultiSelect id="licenses" options={this.state.optionsLicensesType} value={this.state.valueLicensesType} onChange={valueLicensesType => this.setState({ valueLicensesType })} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Licenses Type" />
                                                        </div>
                                                        <div className="form-field-top-label" style={{width:400}}>
                                                            <label for="course">Course<required>*</required></label>
                                                            <MultiSelect id="course" options={this.state.optionsCourse} value={this.state.valueCourse} onChange={valueCourse => this.setState({ valueCourse })} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Course" />
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-section no-border">
                                                    <div className="row">
                                                        <div className="col-sm-12 m-b-20">
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>Questions & Answers</strong>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                                    <div className="form-field-top-label" style={{width:'80%'}}>
                                                                        <label for="name">Question<required>*</required></label>
                                                                        <input id={`myFile`} type="file" name={`myFile`} style={{display:"none"}} onChange="" />
                                                                        {
                                                                            this.state.question_text !== 'Loading...' ?
                                                                            <Editor
                                                                                apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                                                                                initialValue={this.state.question_text}
                                                                                value={this.state.question_text}
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
                                                                    <div className={`form-field-top-label exam-option ${this.state.answer === 'A' && ' answer'}`}>
                                                                        <label for="optionA">Option A</label>
                                                                        <input type="text" name="optionA" id="optionA" placeholder="Nothing" onChange={this.handleChangeOpt} value={this.state.optionA}/>
                                                                        <i className="fa fa-check-circle" onClick={this.handleChangeAnswer.bind(this, 'A')}></i>
                                                                        <p>This is the correct answer</p>
                                                                    </div>
                                                                    <div className={`form-field-top-label exam-option ${this.state.answer === 'B' && ' answer'}`}>
                                                                        <label for="optionB">Option B</label>
                                                                        <input type="text" name="optionB" id="optionB" placeholder="Nothing" onChange={this.handleChangeOpt} value={this.state.optionB}/>
                                                                        <i className="fa fa-check-circle" onClick={this.handleChangeAnswer.bind(this, 'B')}></i>
                                                                        <p>This is the correct answer</p>
                                                                    </div>
                                                                    <div className={`form-field-top-label exam-option ${this.state.answer === 'C' && ' answer'}`}>
                                                                        <label for="optionC">Option C</label>
                                                                        <input type="text" name="optionC" id="optionC" placeholder="Nothing" onChange={this.handleChangeOpt} value={this.state.optionC}/>
                                                                        <i className="fa fa-check-circle" onClick={this.handleChangeAnswer.bind(this, 'C')}></i>
                                                                        <p>This is the correct answer</p>
                                                                    </div>
                                                                    <div className={`form-field-top-label exam-option ${this.state.answer === 'D' && ' answer'}`}>
                                                                        <label for="optionD">Option D</label>
                                                                        <input type="text" name="optionD" id="optionD" placeholder="Nothing" onChange={this.handleChangeOpt} value={this.state.optionD}/>
                                                                        <i className="fa fa-check-circle" onClick={this.handleChangeAnswer.bind(this, 'D')}></i>
                                                                        <p>This is the correct answer</p>
                                                                    </div>
                                                                    <div className={`form-field-top-label exam-option ${this.state.answer === 'E' && ' answer'}`}>
                                                                        <label for="optionE">Option E</label>
                                                                        <input type="text" name="optionE" id="optionE" placeholder="Nothing" onChange={this.handleChangeOpt} value={this.state.optionE}/>
                                                                        <i className="fa fa-check-circle" onClick={this.handleChangeAnswer.bind(this, 'E')}></i>
                                                                        <p>This is the correct answer</p>
                                                                    </div>
                                                                    <div className="form-field-top-label" style={{width:'80%'}}>
                                                                        <label for="name">Explanation</label>
                                                                        <input id={`myFile`} type="file" name={`myFile`} style={{display:"none"}} onChange="" />
                                                                        {
                                                                            this.state.explanation !== 'Loading...' ?
                                                                            <Editor
                                                                                apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                                                                                initialValue={this.state.explanation}
                                                                                value={this.state.explanation}
                                                                                init={{
                                                                                height: 240,
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
                                                                                onEditorChange={e => this.handleDynamicInput2(e)}
                                                                            />
                                                                            :null
                                                                        }
                                                                    </div>
                                                    </div>
                                                </div>
                                                <div className="row" style={{justifyContent:'flex-end'}}>
                                                    {
                                                    !this.props.disabledForm &&
                                                    <button
                                                    disabled={this.state.isSaving}
                                                    onClick={this.save}
                                                    className="btn btn-icademy-primary float-right"
                                                    style={{ padding: "7px 8px !important", marginRight: 30 }}>
                                                        <i className="fa fa-save"></i>
                                                        {this.state.isSaving ? 'Saving...' : 'Save'}
                                                    </button>
                                                    }
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
        </div>
    )
  }
}

export default FormQuestions;
