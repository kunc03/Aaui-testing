import React, { Component } from "react";
import { toast } from "react-toastify";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { Editor } from '@tinymce/tinymce-react';
import { Modal } from 'react-bootstrap';
import ToggleSwitch from "react-switch";
import { MultiSelect } from 'react-sm-select';
import DatePicker from "react-datepicker";
import Moment from 'moment-timezone';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';

class FormExam extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
        start_date: new Date(),
        edited: false,

        isSaving: false,
        id: this.props.match.params.id ? this.props.match.params.id : '',
        exam: this.props.match.params.type === 'quiz' ? 0 : 1,
        answer: '',
        question_text:'',
        title: '',
        time: 90,
        numberQuestions: 0,
        category: '',
        minScore: '',
        subCategory: '',
        optionsLicensesType: [],
        valueLicensesType: [],
        optionsCourse: [],
        valueCourse: [],
        generate: false,
        scheduled: false,
        generate_membership: false,
        session_title : '',
        file: '',
        selectedQuestion: '',
        media: [],
        modalDelete: false,
        disabledForm: this.props.disabledForm && this.props.id,
        question : [],
        initialQuestion: false,
        isUploading: false
    };
    this.goBack = this.goBack.bind(this);
  }
  
  ToggleSwitch(checked) {
    this.setState({ generate: !this.state.generate, edited: true });
  }
  ToggleSwitchScheduled(checked) {
    this.setState({ scheduled: !this.state.scheduled, edited: true });
  }
  ToggleSwitchMembership(checked) {
    this.setState({ generate_membership: !this.state.generate_membership, edited: true });
  }

  goBack() {
    if (this.props.goBack){
        this.props.goBack();
    }
    else{
        this.props.history.goBack();
    }
  }

  handleChangeFile = e => {
    this.setState({
      file: e.target.files[0]
    });
  }

  closeModalDelete = e => {
    this.setState({ modalDelete: false, deleteId: '' })
  }

  autoSave = (isDrag) =>{
    this.setState({isSaving: true})
    if (!this.state.edited && !isDrag){this.setState({isSaving: false}); return;}
    if (!this.state.title || !this.state.valueLicensesType || !this.state.time || !this.state.minScore){
        toast.warning('Some field is required, please check your data.')
    }
    else{
        if (this.state.id){
            let form = {
                title: this.state.title,
                licenses_type_id: String(this.state.valueLicensesType),
                time_limit: this.state.time,
                minimum_score: this.state.minScore,
                generate_question: this.state.generate ? 1 : 0,
                number_of_question: this.state.numberQuestions,
                category_id: String(this.state.valueCourse),
                scheduled: this.state.scheduled ? 1 : 0,
                generate_membership: this.state.generate_membership ? 1 : 0,
                start_time: Moment.tz(this.state.start_date, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
                question: this.state.question
            }
            API.put(`${API_SERVER}v2/training/exam/${this.state.id}`, form).then(res => {
                if (res.data.error){
                    toast.error('Error edit')
                }
                else{
                    if (this.state.image){
                        let formData = new FormData();
                        formData.append("image", this.state.image)
                        API.put(`${API_SERVER}v2/training/exam/image/${this.props.match.params.id}`, formData).then(res2 => {
                            if (res2.data.error){
                                toast.warning('Edited but fail to upload image')
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

  save = (e, newQuestion) =>{
    e.preventDefault();
    this.setState({isSaving: true})
    if (!this.state.edited && !newQuestion) {this.setState({isSaving: false}); return;}
    if (!this.state.title || !this.state.valueLicensesType || !this.state.time || !this.state.minScore){
        toast.warning('Some field is required, please check your data.')
    }
    else{
        if (this.state.id){
            let form = {
                title: this.state.title,
                licenses_type_id: String(this.state.valueLicensesType),
                time_limit: this.state.time,
                minimum_score: this.state.minScore,
                generate_question: this.state.generate ? 1 : 0,
                number_of_question: this.state.numberQuestions,
                category_id: String(this.state.valueCourse),
                scheduled: this.state.scheduled ? 1 : 0,
                generate_membership: this.state.generate_membership ? 1 : 0,
                start_time: Moment.tz(this.state.start_date, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
                question: this.state.question
            }
            API.put(`${API_SERVER}v2/training/exam/${this.state.id}`, form).then(res => {
                if (res.data.error){
                    toast.error('Error edit')
                }
                else{
                    if (this.state.image){
                        let formData = new FormData();
                        formData.append("image", this.state.image)
                        API.put(`${API_SERVER}v2/training/exam/image/${this.props.match.params.id}`, formData).then(res2 => {
                            if (res2.data.error){
                                toast.warning('Edited but fail to upload image')
                                this.setState({edited: false, isSaving: false})
                            }
                            else{
                                if (newQuestion){
                                    this.addNewQuestion();
                                    toast.success('Automatic saving')
                                    this.setState({edited: false, isSaving: false})
                                }
                                else{
                                    toast.success('Saved')
                                    this.setState({edited: false, isSaving: false})
                                }
                            }
                        })
                    }
                    else{
                        if (newQuestion){
                            this.addNewQuestion();
                            toast.success('Automatic saving')
                            this.setState({edited: false, isSaving: false})
                        }
                        else{
                            toast.success('Saved')
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
                licenses_type_id: String(this.state.valueLicensesType),
                time_limit: this.state.time,
                minimum_score: this.state.minScore,
                generate_question: this.state.generate ? 1 : 0,
                number_of_question: this.state.numberQuestions,
                category_id: String(this.state.valueCourse),
                scheduled: this.state.scheduled ? 1 : 0,
                generate_membership: this.state.generate_membership ? 1 : 0,
                start_time: Moment.tz(this.state.start_date, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
                exam: this.state.exam,
                created_by: Storage.get('user').data.user_id
            }
            API.post(`${API_SERVER}v2/training/exam`, form).then(res => {
                if (res.data.error){
                    toast.error('Error create')
                }
                else{
                    if (this.state.image){
                        let formData = new FormData();
                        formData.append("image", this.state.image)
                        API.put(`${API_SERVER}v2/training/exam/image/${res.data.result.insertId}`, formData).then(res2 => {
                            if (res2.data.error){
                                this.setState({id: res.data.result.insertId})
                                toast.warning(`${this.state.exam ? 'Exam' : 'Quiz'} created but fail to upload image`)
                                this.setState({edited: false, isSaving: false})
                                this.props.history.push(`/training/exam/edit/${res.data.result.insertId}`)
                            }
                            else{
                                this.setState({id: res.data.result.insertId})
                                if (newQuestion){
                                    this.addNewQuestion();
                                    toast.success('Automatic saving')
                                    this.setState({edited: false, isSaving: false})
                                }
                                else{
                                    toast.success('Saved')
                                    this.setState({edited: false, isSaving: false})
                                }
                                this.props.history.push(`/training/exam/edit/${res.data.result.insertId}`)
                            }
                        })
                    }
                    else{
                        this.setState({id: res.data.result.insertId})
                        if (newQuestion){
                            this.addNewQuestion();
                            toast.success('Automatic saving')
                            this.setState({isSaving: false})
                        }
                        else{
                            toast.success('Saved')
                            this.setState({isSaving: false})
                        }
                        this.props.history.push(`/training/exam/edit/${res.data.result.insertId}`)
                    }
                }
            })
        }
    }
}

handleChange = e => {
    this.setState({edited: true})
    let {name, value} = e.target;
    if (name==='media'){
      if (e.target.files.length){
          if (e.target.files[0].size <= 5000000) {
              let i = this.state.data.session.indexOf(this.state.data.session.filter(item=> item.id === this.state.selectedQuestion)[0]);
              let media = this.state.media;
              media.push({
                  id: 0,
                  name: e.target.files[0].name,
              })
              this.setState({media: media})
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
      let i = this.state.data.session.indexOf(this.state.data.session.filter(item=> item.id === this.state.selectedQuestion)[0]);
      let item = {
          id : this.state.selectedQuestion,
          title : value,
          content : this.state.content,
          sort : i+1,
          media : this.state.media
      }
      this.state.data.session.splice(i, 1, item)
    }
    else{
        this.setState({[name]: value})
    }
}
handleChangeOpt = e => {
    let {name, value} = e.target;
      this.setState({[name]: value})
      let i = this.state.question.indexOf(this.state.question.filter(item=> item.id === this.state.selectedQuestion)[0]);
      let item = {
          id : this.state.selectedQuestion,
          question : this.state.question_text.replace(/<\/p>/g,"").replace(/<p>/g, ""),
          category_id : 0,
          answer : this.state.answer,
          sort : i,
          option : [
              {option_label: 'A', option_text: this.state.optionA},
              {option_label: 'B', option_text: this.state.optionB},
              {option_label: 'C', option_text: this.state.optionC},
              {option_label: 'D', option_text: this.state.optionD},
              {option_label: 'E', option_text: this.state.optionE},
          ]
      }
      this.state.question.splice(i, 1, item)
}
handleChangeAnswer = (value) => {
      this.setState({answer: value})
      let i = this.state.question.indexOf(this.state.question.filter(item=> item.id === this.state.selectedQuestion)[0]);
      let item = {
          id : this.state.selectedQuestion,
          question : this.state.question_text.replace(/<\/p>/g,"").replace(/<p>/g, ""),
          category_id : 0,
          answer : value,
          sort : i,
          option : [
              {option_label: 'A', option_text: this.state.optionA},
              {option_label: 'B', option_text: this.state.optionB},
              {option_label: 'C', option_text: this.state.optionC},
              {option_label: 'D', option_text: this.state.optionD},
              {option_label: 'E', option_text: this.state.optionE},
          ]
      }
      this.state.question.splice(i, 1, item)
}
  getData(id){
    API.get(`${API_SERVER}v2/training/exam/read/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error read data')
        }
        else{
            this.setState({
                initialQuestion: res.data.result.question.length ? true : false,
                title: res.data.result.title,
                time: res.data.result.time_limit,
                minScore: res.data.result.minimum_score,
                numberQuestions: res.data.result.number_of_question,
                generate: res.data.result.generate_question ? true : false,
                scheduled: res.data.result.scheduled ? true : false,
                generate_membership: res.data.result.generate_membership ? true : false,
                start_date: new Date(res.data.result.start_time),
                imagePreview: res.data.result.image ? res.data.result.image : this.state.imagePreview,
                valueLicensesType: [Number(res.data.result.licenses_type_id)],
                valueCourse: [Number(res.data.result.category_id)],
                selectedQuestion: res.data.result.question.length ? res.data.result.question[0].id : '',
                question: res.data.result.question
            })
            if (this.state.question.length){
                this.selectQuestion(this.state.selectedQuestion);
            }
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
                    API.get(`${API_SERVER}v2/training/course-list/${this.state.companyId}`).then(res => {
                        if (res.data.error){
                            toast.error(`Error read course list`)
                        }
                        else{
                            res.data.result.map((item)=>{
                                this.state.optionsCourse.push({label: item.title, value: item.id})
                            })
                            if (this.state.id){
                                this.getData(this.state.id);
                            }
                        }
                    })
                }
            })
          });
        }
    })
  }
  handleDynamicInput = (e) => {
    this.setState({ question_text: e, edited:true });
    let i = this.state.question.indexOf(this.state.question.filter(item=> item.id === this.state.selectedQuestion)[0]);
    let item = {
        id : this.state.selectedQuestion,
        question : this.state.question_text,
        category_id : 0,
        answer : this.state.answer,
        sort : i,
        option : [
            {option_label: 'A', option_text: this.state.optionA},
            {option_label: 'B', option_text: this.state.optionB},
            {option_label: 'C', option_text: this.state.optionC},
            {option_label: 'D', option_text: this.state.optionD},
            {option_label: 'E', option_text: this.state.optionE},
        ]
    }
    this.state.question.splice(i, 1, item)
    this.forceUpdate();
  }
  componentDidMount(){
    this.getUserData();
  }

  selectQuestion = (id) => {
      if (this.state.selectedQuestion !== id){
        this.autoSave();
        let selected = this.state.question.filter(item => item.id === id)[0];
        this.setState({
          initialQuestion: true,
          selectedQuestion : selected.id,
          question_text : selected.question,
          category : selected.category,
          subcategory : selected.subcategory,
          answer : selected.answer,
          optionA : selected.option.filter(item => item.option_label === 'A').length ? selected.option.filter(item => item.option_label === 'A')[0].option_text : '',
          optionB : selected.option.filter(item => item.option_label === 'B').length ? selected.option.filter(item => item.option_label === 'B')[0].option_text : '',
          optionC : selected.option.filter(item => item.option_label === 'C').length ? selected.option.filter(item => item.option_label === 'C')[0].option_text : '',
          optionD : selected.option.filter(item => item.option_label === 'D').length ? selected.option.filter(item => item.option_label === 'D')[0].option_text : '',
          optionE : selected.option.filter(item => item.option_label === 'E').length ? selected.option.filter(item => item.option_label === 'E')[0].option_text : ''
        })
      }
      else{
        let selected = this.state.question.filter(item => item.id === id)[0];
        this.setState({
          initialQuestion: true,
          selectedQuestion : selected.id,
          question_text : selected.question,
          category : selected.category,
          subcategory : selected.subcategory,
          answer : selected.answer,
          optionA : selected.option.filter(item => item.option_label === 'A').length ? selected.option.filter(item => item.option_label === 'A')[0].option_text : '',
          optionB : selected.option.filter(item => item.option_label === 'B').length ? selected.option.filter(item => item.option_label === 'B')[0].option_text : '',
          optionC : selected.option.filter(item => item.option_label === 'C').length ? selected.option.filter(item => item.option_label === 'C')[0].option_text : '',
          optionD : selected.option.filter(item => item.option_label === 'D').length ? selected.option.filter(item => item.option_label === 'D')[0].option_text : '',
          optionE : selected.option.filter(item => item.option_label === 'E').length ? selected.option.filter(item => item.option_label === 'E')[0].option_text : ''
        })
      }
  }

  clearQuestionForm(){
    this.setState({
        edited: false,
        selectedQuestion : '',
        question_text : '',
        category : '',
        subcategory : '',
        answer : '',
        optionA : '',
        optionB : '',
        optionC : '',
        optionD : '',
        optionE : ''
      })
  }

  deleteQuestion(){
    API.delete(`${API_SERVER}v2/training/exam/question/${this.state.selectedQuestion}`).then(res => {
        if (res.data.error){
            toast.error('Error delete course')
        }
        else{
            let i = this.state.question.indexOf(this.state.question.filter(item=> item.id === this.state.selectedQuestion)[0]);
            let form = {
                id : this.state.question[i].id
            }
            let question = this.state.question;
            question.splice(i, 1);
            this.setState({question : question});
            if (question.length){
              this.selectQuestion(question[0].id);
            }
            else{
              this.setState({initialQuestion: false})
              this.clearQuestionForm();
            }
            this.closeModalDelete();
        }
    })
  }

  uploadData = e => {
    e.preventDefault();
    if (!this.state.file){
      toast.warning('Choose the file first')
    }
    else{
      this.setState({isUploading: true})
      let form = new FormData();
      form.append('exam_id', this.state.id);
      form.append('file', this.state.file)
      API.post(`${API_SERVER}v2/training/exam/import`, form).then((res) => {
        if (res.status === 200) {
          if (res.data.error) {
            toast.error('Data import failed')
            this.setState({ isUploading: false, file: '' });
          }
          else{
            this.getData(this.state.id)
            toast.success('Data import success')
            this.setState({ isUploading: false, file: '' });
          }
        }
      })
    }
  }

  handleOnDragEnd(result){
    if (!result.destination) return;
    const items = Array.from(this.state.question);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    this.setState({question: items},()=>{
        this.autoSave(true)
    })
  }

  addNewQuestion(){
    if (!this.state.title || !this.state.valueLicensesType || !this.state.time || !this.state.minScore){
        toast.warning('Some field is required, please check your data.')
    }
    else{
        let form = {
          exam_id : this.props.match.params.id ? this.props.match.params.id : this.state.id,
          category_id : 0,
          question : "",
          answer : "",
          sort : this.state.question.length,
        };
      API.post(`${API_SERVER}v2/training/exam/question`, form).then(res => {
          if (res.data.error){
              toast.error('Error create question')
          }
          else{
              this.setState({initialQuestion: true}, ()=>{
                  this.state.question.push({
                      id : res.data.result.insertId,
                      category_id : 0,
                      subcategory_id : 0,
                      question : "",
                      answer : "",
                      sort : this.state.question.length,
                      option : [
                          {option_label: 'A', option_text: ''},
                          {option_label: 'B', option_text: ''},
                          {option_label: 'C', option_text: ''},
                          {option_label: 'D', option_text: ''},
                          {option_label: 'E', option_text: ''},
                      ]
                  })
                  let id = this.state.question[this.state.question.length-1].id;
                  let selected = this.state.question.filter(item => item.id === id)[0];
                  this.setState({
                    initialQuestion: true,
                    selectedQuestion : selected.id,
                    question_text : selected.question,
                    answer : selected.answer,
                    optionA : selected.option.filter(item => item.option_label === 'A').length ? selected.option.filter(item => item.option_label === 'A')[0].option_text : '',
                    optionB : selected.option.filter(item => item.option_label === 'B').length ? selected.option.filter(item => item.option_label === 'B')[0].option_text : '',
                    optionC : selected.option.filter(item => item.option_label === 'C').length ? selected.option.filter(item => item.option_label === 'C')[0].option_text : '',
                    optionD : selected.option.filter(item => item.option_label === 'D').length ? selected.option.filter(item => item.option_label === 'D')[0].option_text : '',
                    optionE : selected.option.filter(item => item.option_label === 'E').length ? selected.option.filter(item => item.option_label === 'E')[0].option_text : ''
                  })
                  this.forceUpdate()
              })
          }
      })
    }
  }
  render() {
    let {question, media} = this.state;
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
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>{this.props.id ? 'Detail' : this.props.match.params.id ? 'Edit' : 'Create New'} {this.state.exam ? 'Exam' : 'Quiz'}</strong>
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
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>{this.state.exam ? 'Exam' : 'Quiz'} Information</strong>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-field-top-label">
                                                            <label for="image">Thumbnail</label>
                                                            <label for="image" style={{cursor:'pointer', borderRadius:'10px', overflow:'hidden'}}>
                                                                <img src={this.state.imagePreview} height="54.8px" />
                                                            </label>
                                                            <input type="file" accept="image/*" name="image" id="image" onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="title">Title<required>*</required></label>
                                                            <input type="text" name="title" size="50" id="title" placeholder="XXXXX XXXXX XXXXX" value={this.state.title} onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-section">
                                                    <div className="row">
                                                        <div className="col-sm-12 m-b-20">
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>{this.state.exam ? 'Exam' : 'Quiz'} Configuration</strong>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-field-top-label" style={{width:400}}>
                                                            <label for="licenses">Licenses Type<required>*</required></label>
                                                            <MultiSelect id="licenses" options={this.state.optionsLicensesType} value={this.state.valueLicensesType} onChange={valueLicensesType => this.setState({ valueLicensesType, edited: true })} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Licenses Type" />
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="time">Time Limit (Minute)<required>*</required></label>
                                                            <input type="number" name="time" style={{width:100}} id="time" placeholder="00" value={this.state.time} onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="minScore">Minimum Score<required>*</required></label>
                                                            <input type="number" name="minScore" style={{width:100}} id="minScore" placeholder="0" value={this.state.minScore} onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="generate">Generate Question</label>
                                                            <ToggleSwitch className="form-toggle-switch" name="generate" onChange={this.ToggleSwitch.bind(this)} checked={this.state.generate} />
                                                            <p className="form-notes">{this.state.generate ? 'Generate questions from question database' : 'Input questions manually'}</p>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="scheduled">Scheduled</label>
                                                            <ToggleSwitch className="form-toggle-switch" name="scheduled" onChange={this.ToggleSwitchScheduled.bind(this)} checked={this.state.scheduled} />
                                                            <p className="form-notes">{this.state.scheduled ? 'Exam will available for certain schedule' : 'Exam always available'}</p>
                                                        </div>
                                                        {
                                                            this.state.scheduled ?
                                                            <div className="form-field-top-label">
                                                                <label for="start_date">Start Date & Time</label>
                                                                <DatePicker showTimeSelect dateFormat="yyyy-MM-dd HH:mm" selected={this.state.start_date} onChange={e => this.setState({ start_date: e, edited: true })} />
                                                            </div>
                                                            : null
                                                        }
                                                        <div className="form-field-top-label">
                                                            <label for="scheduled">Generate Membership</label>
                                                            <ToggleSwitch className="form-toggle-switch" name="scheduled" onChange={this.ToggleSwitchMembership.bind(this)} checked={this.state.generate_membership} />
                                                            <p className="form-notes">{this.state.generate_membership ? 'Users with scores above the minimum will get/renew membership' : 'Users will not get/renew membership'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                {
                                                    this.state.generate ?
                                                    <div>
                                                    <div className="form-section no-border">
                                                        <div className="row">
                                                            <div className="col-sm-12 m-b-20">
                                                                <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>Generate Questions Randomly</strong>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                            <div className="form-field-top-label">
                                                                <label for="numberQuestions">Number of Questions<required>*</required></label>
                                                                <input type="number" name="numberQuestions" size="50" id="numberQuestions" placeholder="0" value={this.state.numberQuestions} onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                            </div>
                                                            <div className="form-field-top-label" style={{width:400}}>
                                                                <label for="valueCourse">Course</label>
                                                                <MultiSelect id="valueCourse" options={this.state.optionsCourse} value={this.state.valueCourse} onChange={valueCourse => this.setState({ valueCourse })} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Course" />
                                                                <p className="form-notes">Keep empty if you want to generate questions by all of course</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row" style={{justifyContent:'flex-end'}}>
                                                        {
                                                        !this.props.disabledForm &&
                                                        <button
                                                        onClick={this.save}
                                                        className="btn btn-icademy-primary float-right"
                                                        style={{ padding: "7px 8px !important", marginRight: 30 }}>
                                                            <i className="fa fa-save"></i>
                                                            Save
                                                        </button>
                                                        }
                                                    </div>
                                                    </div>
                                                    :
                                                    <div>
                                                    <div className="form-section no-border">
                                                        <div className="row">
                                                            <div className="col-sm-12 m-b-20">
                                                                <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>Import Questions</strong>
                                                            </div>
                                                            <div className="col-sm-12 m-b-20">
                                                                <a href={`${API_SERVER}template-excel/template-import-training-exam.xlsx`}>
                                                                <button className="button-bordered">
                                                                    <i
                                                                        className="fa fa-download"
                                                                        style={{ fontSize: 14, marginRight: 10, color: '#0091FF' }}
                                                                    />
                                                                    Download Template
                                                                </button>
                                                                </a>
                                                            </div>
                                                            <div className="col-sm-12">
                                                                <strong className="f-w-bold f-13" style={{color:'#000'}}>Select a file</strong>
                                                            </div>
                                                            <form className="col-sm-12 form-field-top-label m-b-20" onSubmit={this.uploadData}>
                                                                <label for="file-import" style={{cursor:'pointer', overflow:'hidden'}}>
                                                                <div className="button-bordered-grey">
                                                                    {this.state.file ? this.state.file.name : 'Choose'}
                                                                </div>
                                                                </label>
                                                                <input type="file" id="file-import" name="file-import" onChange={this.handleChangeFile} />
                                                                <button type="submit" className="button-gradient-blue" style={{marginLeft:20}}>
                                                                    <i
                                                                        className="fa fa-upload"
                                                                        style={{ fontSize: 12, marginRight: 10, color: '#FFFFFF' }}
                                                                    />
                                                                    {this.state.isUploading ? 'Uploading...' : 'Upload File'}
                                                                </button>
                                                            </form>
                                                        </div>
                                                        <div className="row">
                                                            <div className="col-sm-12 m-b-20">
                                                                <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>Questions</strong>
                                                            </div>
                                                        </div>
                                                        <div className="row">
                                                        <DragDropContext onDragEnd={this.handleOnDragEnd.bind(this)}>
                                                            <Droppable droppableId="question">
                                                                {(provided) => (
                                                        <div className="col-sm-3" style={{marginTop:34}} {...provided.droppableProps} ref={provided.innerRef}>
                                                            {
                                                                question.map((item, index)=>
                                                                    <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                                                                        {(provided) => (
                                                                    <div {...provided.draggableProps} {...provided.dragHandleProps} ref={provided.innerRef} className="training-session-list" onClick={this.selectQuestion.bind(this, item.id)}>
                                                                        <div dangerouslySetInnerHTML={{__html: (index+1 + '. ' + (item.question.length > 25 ? item.question.substring(0, 25) + '...' : item.question))}}></div>
                                                                        {
                                                                            this.state.selectedQuestion === item.id &&
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
                                                                this.state.initialQuestion ?
                                                                <div className="col-sm-9">
                                                                    {/* <div className="form-field-top-label">
                                                                        <label for="category">Category<required>*</required></label>
                                                                        <input type="text" ref={(input) => { this.category = input; }}  name="category" size="50" id="category" placeholder="XXXXX XXXXX XXXXX" onChange={this.handleChange} value={this.state.category}/>
                                                                    </div>
                                                                    <div className="form-field-top-label">
                                                                        <label for="subCategory">Sub-Category<required>*</required></label>
                                                                        <input type="text"  name="subCategory" size="50" id="subCategory" placeholder="XXXXX XXXXX XXXXX" onChange={this.handleChange} value={this.state.subCategory}/>
                                                                    </div> */}
                                                                    <div className="form-field-top-label" style={{width:'80%'}}>
                                                                        <label for="name">Question<required>*</required></label>
                                                                        <input id={`myFile`} type="file" name={`myFile`} style={{display:"none"}} onChange="" />
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
                                                                </div>
                                                                : null
                                                            }
                                                        </div>
                                                    </div>
                                                    <div className="row" style={{justifyContent:'flex-end'}}>
                                                        {
                                                        !this.props.disabledForm && this.state.initialQuestion &&
                                                        <button
                                                        onClick={()=>this.setState({modalDelete: true})}
                                                        className="btn btn-icademy-primary btn-icademy-red float-right"
                                                        style={{ padding: "7px 8px !important", margin:0, marginRight: 14 }}>
                                                            <i className="fa fa-trash-alt"></i>
                                                            Remove selected question
                                                        </button>
                                                        }
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
                                                }
                                            </div>
          <Modal show={this.state.modalDelete} onHide={this.closeModalDelete} centered>
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Confirmation
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>Are you sure want to delete this question ?</div>
            </Modal.Body>
            <Modal.Footer>
              <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalDelete.bind(this)}>
                Cancel
              </button>
              <button className="btn btn-icademy-primary btn-icademy-red" onClick={this.deleteQuestion.bind(this)}>
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

export default FormExam;
