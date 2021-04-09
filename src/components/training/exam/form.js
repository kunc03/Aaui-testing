import React, { Component } from "react";
import { toast } from "react-toastify";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { Editor } from '@tinymce/tinymce-react';
import { Modal } from 'react-bootstrap';
import ToggleSwitch from "react-switch";
import { MultiSelect } from 'react-sm-select';

class FormExam extends Component {
  constructor(props) {
    super(props);
    this.state = {
        companyId:'',
        image:'',
        logo:'',
        imagePreview:'assets/images/no-logo.jpg',
        name: '',
        address: '',
        telephone: '',
        fax: '',
        website: '',
        email: '',

        content:'',
        title: '',
        time: 90,
        numberQuestions: '',
        category: '',
        minScore: '',
        subCategory: '',
        optionsLicensesType: [{
            label: 'Main Exam',
            value: 'Main Exam'
        },
        {
            label: 'Renewal Exam',
            value: 'Renewal Exam'
        }],
        valueLicensesType: [],
        optionsCategory: [{
            label: 'Asuransi',
            value: 'Asuransi'
        },
        {
            label: 'Relationship',
            value: 'Relationship'
        }],
        valueCategory: [],
        generate: false,
        session_title : '',
        file: '',
        selectedSession: '',
        media: [],
        modalDelete: false,
        disabledForm: this.props.disabledForm && this.props.id,

        
        data : {
            thumbnail : null,
            title : "Investasi Reksadana",
            session : [
                {
                    id : 1,
                    title : "Memahami investasi reksa dana Apa blablabalbalabla ?",
                    content : "asdasdas111",
                    sort : 1,
                    media : [
                        {
                            id : 1,
                            name : 'memahami-investasi-reksa-dana.pdf'
                        },
                        {
                            id : 2,
                            name : 'reksa-dana.mp4'
                        }
                    ]
                },
                {
                    id : 2,
                    title : "Mengenal jenis reksadana",
                    content : "asdasdas222",
                    sort : 2,
                    media : [
                        {
                            id : 1,
                            name : 'memahami-investasi-reksa-dfadana.pdf'
                        },
                        {
                            id : 2,
                            name : 'reksa-dandga.mp4'
                        }
                    ]
                },
                {
                    id : 3,
                    title : "Memilih reksadana yang sesuai",
                    content : "asdasdas333",
                    sort : 3,
                    media : [
                        {
                            id : 1,
                            name : 'memahami12312-reksa-dana.pdf'
                        },
                        {
                            id : 2,
                            name : 'reksa-dana.mp4'
                        }
                    ]
                }
            ]
        }
    };
    this.goBack = this.goBack.bind(this);
  }
  
  ToggleSwitch(checked) {
    this.setState({ generate: !this.state.generate });
  }

  goBack() {
    if (this.props.goBack){
        this.props.goBack();
    }
    else{
        this.props.history.push('/training');
    }
  }

  closeModalDelete = e => {
    this.setState({ modalDelete: false, deleteId: '' })
  }

  save = (e) =>{
    e.preventDefault();
    if (!this.state.name || !this.state.address || !this.state.telephone || !this.state.email){
        toast.warning('Some field is required, please check your data.')
    }
    else{
        if (this.props.match.params.id){
            let form = {
                name: this.state.name,
                address: this.state.address,
                telephone: this.state.telephone,
                fax: this.state.fax,
                website: this.state.website,
                email: this.state.email,
                created_by: Storage.get('user').data.user_id
            }
            API.put(`${API_SERVER}v2/training/company/${this.props.match.params.id}`, form).then(res => {
                if (res.data.error){
                    toast.error('Error edit company')
                }
                else{
                    if (this.state.image){
                        let formData = new FormData();
                        formData.append("image", this.state.image)
                        API.put(`${API_SERVER}v2/training/company/image/${this.props.match.params.id}`, formData).then(res2 => {
                            if (res2.data.error){
                                toast.warning('Company edited but fail to upload image')
                            }
                            else{
                                toast.success('Company edited')
                                this.props.history.push(`/training/company/detail/${this.props.match.params.id}`)
                            }
                        })
                    }
                    else{
                        toast.success('Company edited')
                        this.props.history.push(`/training/company/detail/${this.props.match.params.id}`)
                    }
                }
            })
        }
        else{
            let form = {
                company_id: this.state.companyId,
                name: this.state.name,
                address: this.state.address,
                telephone: this.state.telephone,
                fax: this.state.fax,
                website: this.state.website,
                email: this.state.email,
                created_by: Storage.get('user').data.user_id
            }
            API.post(`${API_SERVER}v2/training/company`, form).then(res => {
                if (res.data.error){
                    toast.error('Error create company')
                }
                else{
                    if (this.state.image){
                        let formData = new FormData();
                        formData.append("image", this.state.image)
                        API.put(`${API_SERVER}v2/training/company/image/${res.data.result.insertId}`, formData).then(res2 => {
                            if (res2.data.error){
                                toast.warning('Company created but fail to upload image')
                            }
                            else{
                                toast.success('New company added')
                                this.props.history.push(`/training/company/detail/${res.data.result.insertId}`)
                            }
                        })
                    }
                    else{
                        toast.success('New company added')
                        this.props.history.push(`/training/company/detail/${res.data.result.insertId}`)
                    }
                }
            })
        }
    }
}

  handleChange = e => {
      let {name, value} = e.target;
      if (name==='media'){
        if (e.target.files.length){
            if (e.target.files[0].size <= 5000000) {
                let i = this.state.data.session.indexOf(this.state.data.session.filter(item=> item.id === this.state.selectedSession)[0]);
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
      else if (name==='session_title'){
        this.setState({[name]: value})
        let i = this.state.data.session.indexOf(this.state.data.session.filter(item=> item.id === this.state.selectedSession)[0]);
        let item = {
            id : this.state.selectedSession,
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
  getCompany(id){
    API.get(`${API_SERVER}v2/training/company/read/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error read company')
        }
        else{
            this.setState({
                name: res.data.result.name,
                address: res.data.result.address,
                telephone: res.data.result.telephone,
                fax: res.data.result.fax,
                website: res.data.result.website,
                email: res.data.result.email,
                imagePreview: res.data.result.image ? res.data.result.image : this.state.imagePreview
            })
        }
    })
  }
  getUserData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
          this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
        }
    })
  }
  handleDynamicInput = (e, i) => {
    if(e.hasOwnProperty('target')) {
      const { value, name } = e.target;
      this.setState({ content: value });
    }
  }
  componentDidMount(){
    this.getUserData();
    if (this.props.disabledForm && this.props.id){
        this.getCompany(this.props.id);
    }
    else if (this.props.match.params.id){
        this.getCompany(this.props.match.params.id);
    }

    this.setState({
        selectedSession : this.state.data.session[0].id,
        session_title : this.state.data.session[0].title,
        content : this.state.data.session[0].content,
        media : this.state.data.session[0].media
    })
  }

  selectSession = (id) => {
      if (this.state.selectedSession !== id){
        this.setState({
          selectedSession : this.state.data.session.filter(item => item.id === id)[0].id,
          session_title : this.state.data.session.filter(item => item.id === id)[0].title,
          content : this.state.data.session.filter(item => item.id === id)[0].content,
          media : this.state.data.session.filter(item => item.id === id)[0].media,
        })
      }
  }

  clearSessionForm(){
    this.setState({
        selectedSession : '',
        session_title : '',
        content : '',
        media : []
      })
  }

  deleteSession(){
      let i = this.state.data.session.indexOf(this.state.data.session.filter(item=> item.id === this.state.selectedSession)[0]);
      let data = this.state.data;
      data.session.splice(i, 1);
      this.setState({data : data});
      if (data.session.length){
        this.selectSession(data.session[0].id);
      }
      else{
        this.clearSessionForm();
      }
      this.closeModalDelete();
  }

  addNewSession(){
    this.clearSessionForm();
    this.session_title.focus();
    this.state.data.session.push({
        id : 0,
        title : "",
        content : "",
        media : null,
        sort : this.state.data.session.length+1,
        media : []
    })
  }
  render() {
    let {data, media} = this.state;
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
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>{this.props.id ? 'Detail' : this.props.match.params.id ? 'Edit' : 'Create New'} Exam</strong>
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
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>Exam Information</strong>
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
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>Exam Configuration</strong>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-field-top-label" style={{width:400}}>
                                                            <label for="licenses">Licenses Type<required>*</required></label>
                                                            <MultiSelect id="licenses" options={this.state.optionsLicensesType} value={this.state.valueLicensesType} onChange={valueLicensesType => this.setState({ valueLicensesType })} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Licenses Type" />
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
                                                            <label for="generate">Generate Question<required>*</required></label>
                                                            <ToggleSwitch className="form-toggle-switch" name="generate" onChange={this.ToggleSwitch.bind(this)} checked={this.state.generate} />
                                                            <p className="form-notes">{this.state.generate ? 'Generate questions from question database' : 'Input questions manually'}</p>
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
                                                                <label for="valueCategory">Category</label>
                                                                <MultiSelect id="valueCategory" options={this.state.optionsCategory} value={this.state.valueCategory} onChange={valueCategory => this.setState({ valueCategory })} mode="single" enableSearch={true} resetable={true} valuePlaceholder="Select Category" />
                                                                <p className="form-notes">Keep empty if you want to generate questions by all of category</p>
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
                                                                <a href={`${API_SERVER}template-excel/template-import-training-company.xlsx`}>
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
                                                            <div className="col-sm-3" style={{marginTop:34}}>
                                                                {
                                                                    data.session.map((item)=>
                                                                        <div className="training-session-list" onClick={this.selectSession.bind(this, item.id)}>
                                                                            {item.sort + '. ' + (item.title.length > 25 ? item.title.substring(1, 25) + '...' : item.title)}
                                                                            {
                                                                                this.state.selectedSession === item.id &&
                                                                                <div className="training-session-list-indicator"><i className="fa fa-chevron-right"></i></div>
                                                                            }
                                                                        </div>
                                                                    )
                                                                }
                                                                <div className="training-new-session" onClick={this.addNewSession.bind(this)}>
                                                                    <i className="fa fa-plus"></i> Add question
                                                                </div>
                                                            </div>
                                                            <div className="col-sm-9">
                                                                <div className="form-field-top-label">
                                                                    <label for="category">Category<required>*</required></label>
                                                                    <input type="text" ref={(input) => { this.session_title = input; }}  name="category" size="50" id="category" placeholder="XXXXX XXXXX XXXXX" onChange={this.handleChange} value={this.state.category}/>
                                                                </div>
                                                                <div className="form-field-top-label">
                                                                    <label for="subCategory">Sub-Category<required>*</required></label>
                                                                    <input type="text"  name="subCategory" size="50" id="subCategory" placeholder="XXXXX XXXXX XXXXX" onChange={this.handleChange} value={this.state.subCategory}/>
                                                                </div>
                                                                <div className="form-field-top-label" style={{width:'80%'}}>
                                                                    <label for="name">Question<required>*</required></label>
                                                                    <input id={`myFile`} type="file" name={`myFile`} style={{display:"none"}} onChange="" />
                                                                    <Editor
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
                                                                </div>
                                                                <div className="form-field-top-label">
                                                                    <label for="optionA">Option A</label>
                                                                    <input type="text" name="optionA" size="100" id="optionA" placeholder="Nothing" onChange={this.handleChange} value={this.state.optionA}/>
                                                                </div>
                                                                <div className="form-field-top-label">
                                                                    <label for="optionB">Option B</label>
                                                                    <input type="text" name="optionB" size="100" id="optionB" placeholder="Nothing" onChange={this.handleChange} value={this.state.optionB}/>
                                                                </div>
                                                                <div className="form-field-top-label">
                                                                    <label for="optionC">Option C</label>
                                                                    <input type="text" name="optionC" size="100" id="optionC" placeholder="Nothing" onChange={this.handleChange} value={this.state.optionC}/>
                                                                </div>
                                                                <div className="form-field-top-label">
                                                                    <label for="optionD">Option D</label>
                                                                    <input type="text" name="optionD" size="100" id="optionD" placeholder="Nothing" onChange={this.handleChange} value={this.state.optionD}/>
                                                                </div>
                                                                <div className="form-field-top-label">
                                                                    <label for="optionE">Option E</label>
                                                                    <input type="text" name="optionE" size="100" id="optionE" placeholder="Nothing" onChange={this.handleChange} value={this.state.optionE}/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="row" style={{justifyContent:'flex-end'}}>
                                                        {
                                                        !this.props.disabledForm &&
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
                                                        onClick={this.save}
                                                        className="btn btn-icademy-primary float-right"
                                                        style={{ padding: "7px 8px !important", marginRight: 30 }}>
                                                            <i className="fa fa-save"></i>
                                                            Save
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

export default FormExam;
