import React, { Component } from 'react';
import { toast } from 'react-toastify';
import API, { API_SERVER,APPS_SERVER, USER_ME, DEV_MODE } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { Modal, Row } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import ToggleSwitch from 'react-switch';
import { MultiSelect } from 'react-sm-select';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import axios from 'axios';
import moment from 'moment-timezone';

class FormCourse extends Component {
  constructor(props) {
    super(props);
    this.state = {
      edited: false,
      initialSession: false,
      selectedLicense: [],
      idForm: null,
      companyId: '',
      imagePreview: 'assets/images/no-image.png',
      nameCompany: '',
      isUploading: false,
      isSaving: false,

      content: 'Loading...',
      session_title: '',
      selectedSession: '',
      modalDelete: false,
      disabledForm: this.props.disabledForm && this.props.id,
      session: [],
      optionsCourse: [],
      optionsLicense: [],
      valueCourse: [],

      // Brand New
      titleForm:'',
      minDate: moment(new Date()).format("YYYY-MM-DD"),
      slot:0,
      isPaid:0,
      closeRegistration:null,      
      name:'',
      input:[],
      media: [],
      subname:'',
      progressUploadMedia: 0,
      permanentField:false,
      defaultOption : {
        labelName:'',
        get labelString(){
          let label = this.labelName;
          if(label.length) label = label.replace(/\s/g,"");
          return label;
        } 
      },
      "defaultSession": [
        {
          id:0,
          "name": "Name",
          "subname":"Enter your full name.",
          "permanent":true,
          "type": "text",
          "mandatory": true
        },
        {
          id:1,
          "name": "Email",
          "subname":"Enter your email.",
          "permanent":true,
          "type": "email",
          "mandatory": true
        },
        {
          id:2,
          "name": "Born Date",
          "subname":"Enter your born date.",
          "permanent":true,
          "type": "date",
          "mandatory": true
        },
        {
          id:3,
          "name": "Born Place",
          "subname":"Enter your born place.",
          "permanent":true,
          "type": "text",
          "mandatory": true
        },
        {
          id:4,
          "name": "Identity",
          "subname":"Enter Identity Number.",
          "permanent":true,
          "type": "text",
          "mandatory": true
        },
        {
          id:5,
          "name": "Identity Image",
          "subname":"Enter Identity Card Photo.",
          "permanent":true,
          "type": "file",
          "mandatory": true
        },
        {
          id:6,
          "name": "Gender",
          "subname":"Select your gender.",
          "permanent":true,
          "type": "select",
          "mandatory": true,
          "option": [
            {
              id:0,
              "labelString": "Male",
              "labelName": "Male"
            },
            {
              id:1,
              "labelString": "Female",
              "labelName": "Female"
            }
          ]
        }
      ],
      optionTypeInput: [
        {
          label: 'Text',
          value: 'text',
        },
        {
          label: 'TextArea',
          value: 'textarea',
        },
        {
          label: 'Select',
          value: 'select',
        },
        {
          label: 'Number',
          value: 'number',
        },
        {
          label: 'Checkbox',
          value: 'checkbox',
        },
        {
          label: 'Email',
          value: 'email',
        },
        {
          label: 'Date',
          value: 'date',
        },
        {
          label: 'Multiple File Upload',
          value: 'file',
        },
      ],
      optionFile:[],
      selectedType: null,
      isMandatory: false,
      selectOption : [],
      disabledForm: this.props.disabledForm,
      modalRegist: false,
      registEnable: false,
      description: '',
      urlRegist: `${APPS_SERVER}training/form-registration/${this.props.match.params.id}`,
    };
    this.goBack = this.goBack.bind(this);
  }

  goBack() {
    if (this.props.goBack) {
      this.props.goBack();
    } else {
      let usr = JSON.parse(localStorage.getItem("user"));

      if(usr.data.grup_name.toLowerCase().search('admin') > -1){
        this.props.history.push('/training');
      }else{
        if(localStorage.getItem("user")){
          this.props.history.push('/training/company/detail/'+this.props.match.params.id);
        }
      }
    }
  }

  closeModalDelete = (e) => {
    this.setState({ modalDelete: false, deleteId: '' });
  };

  getCompany(id){
    API.get(`${API_SERVER}v2/training/company/read/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error read company')
        }
        else{
            this.setState({
                name: res.data.result.name,
                registEnable: res.data.result.enable_registration
            })
        }
    })
  }

  getRegistrationForm(id){
    API.get(`${API_SERVER}v2/training/setup-registration-form/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error read company')
        }
        else{
            let templates = [];
            let optionFile = [];
            let title = null;
            let subtitle = null
            let closeRegistration = null;
            let idForm = null;
            let slot = 0;
            let isPaid = 0;

            if(res.data.result.length){
              templates = res.data.result[0].json_data ? JSON.parse(res.data.result[0].json_data) : [];
              title = res.data.result[0].title;
              subtitle = res.data.result[0].subtitle;
              optionFile = res.data.result[0].media ? JSON.parse(res.data.result[0].media) : [];
              idForm = res.data.result[0].id;

              closeRegistration = res.data.result[0].close_registration ? moment(res.data.result[0].close_registration).format("YYYY-MM-DD") : null;
              slot = res.data.result[0].slot ? res.data.result[0].slot : 0;
              isPaid = res.data.result[0].is_paid ? Number (res.data.result[0].is_paid) : 0;
            }
            this.setState({ isPaid, slot, closeRegistration, idForm,titleForm: title, subtitle,session:templates.length ? templates : this.state.defaultSession, selectedSession:0,initialSession:true,optionFile },()=>{
              this.forceUpdate();
              this.selectSession(0);
            });
        }
    })
  }

  async postRegistrationForm(id){
    let { session, titleForm, optionFile, subtitle,closeRegistration,slot,isPaid } = this.state;
    let form = {
      title: String(titleForm).length > 0 ? titleForm : 'Form Registration',
      subtitle:subtitle || '',
      json_data: session,
      training_company_id: id,
      media:optionFile,
      slot,
      closeRegistration,
      isPaid
    }
    let isFormValid = true;
    session.forEach((datasession, index) => {
      if(datasession.name.length === 0 || datasession.type.length === 0) {
        isFormValid = false;
      }
    })

    if(!slot || !closeRegistration){
      isFormValid = false;
    }

    if(isFormValid){
      API.post(`${API_SERVER}v2/training/company/registration-form/${id}`,form).then(res => {
        return res.data.error;
      })
    }else{
      return true;
    }    
  }

  getUserData(){
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
        if (res.status === 200) {
          this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
          this.getCompany(this.props.match.params.id);
          this.getRegistrationForm(this.props.match.params.id);
        }
    })
  }
  componentDidMount() {
    this.getUserData();
  }

  // exp change data
  deleteMedia = (name, detailMedia, index) => {
    API.delete(`${API_SERVER}v2/training/registration-user/media/${detailMedia.id}`).then(res => {
      if (res.data.error){
          toast.warning('Fail to delete media')
      }
      else{
        let media = [...this.state.optionFile];
        media.splice(index, 1);
    
        this.setState({ optionFile: media })
        this.autoSave();
      }
  })

    // let media = [...this.state.optionFile];
    // media.splice(index, 1);

    // this.setState({ optionFile: media });
  }
  handleChangeAttachment = (e) =>{
    if (e.target.files.length) {
        let fileSupport = true;
        let tmp = [];
        
        if (e.target.files[0].size <= 500000000) {

            this.setState({isUploading : true});
            let formData = new FormData();
            formData.append('media', e.target.files[0]);
            let token = Storage.get('token');
            var config = {
                onUploadProgress: (progressEvent) => {
                    this.setState({ progressUploadMedia : Math.round((progressEvent.loaded * 100) / progressEvent.total) });
                },
                headers: {
                    Authorization: token.data,
                },
            };

            axios
            .post(`${API_SERVER}v2/training/registration-user/media`, formData, config)
            .then((res) => {
                let media = this.state.optionFile;
                if (res.data.error) {
                  toast.warning(res.data.result);
                } else {
                  media.push(res.data.result);
                }
                this.setState({isUploading: false, progressUploadMedia: 0, optionFile: media});
                this.autoSave(true);
            });
        } else {
            e.target.value = null;
            toast.warning(`File size cannot larger than 500MB`);
            this.setState({isUploading: false, progressUploadMedia: 0})
        }
    }
  }
  handleChangeSelectOption (childIndex, e) {
    let session = this.state.session;
    const index = session.findIndex(sess => sess.id === this.state.selectedSession);
    let parentIndex = index;
    let selectOption = this.state.selectOption;
    let { name, value } = e.target;

    selectOption[childIndex].labelName = value;
    session[parentIndex].option = selectOption;
    this.setState({selectOption, session});
  };
  handleChangeMultiSelect = (selectedType) => {
    this.setState({ edited: true });
  
    if(selectedType.length){
      let session = this.state.session;
      const index = session.findIndex(sess => sess.id === this.state.selectedSession);
      let selected = index;
      let op = {
        labelName:'',
        get labelString(){
          let label = this.labelName;
          if(label.length) label = label.replace(/\s/g,"");
          return label;
        } 
      };

      let option = [op];
      if(session[selected].option){
        if(session[selected].option.length){
          option = session[selected].option;
        }
      }
      let setState = {};
      selectedType = selectedType[0]
      session[selected].type = selectedType;
      setState = { selectedType };

      if(['select','checkbox','optionbox'].indexOf(selectedType) > -1){
        session[selected].option = option;
        setState.selectOption = option
      }
      setState.session = session;

      this.setState(setState);
    }
  };
  handleChange = (e) => {
    this.setState({ edited: true });
    
    let { name, value, type } = e.target;
    this.setState({ [name]:value })

    if(name !== 'titleForm' && name !== 'slot' && name !== "closeRegistration"){
      let session = this.state.session;
      const index = this.state.session.findIndex(item => item.id === this.state.selectedSession);
      session[index][name] = value;
      let item = {
        ...session[index],
        [name]: value,
      };
  
      if(type === 'checkbox'){
        item = {
          ...this.state.session[index],
          [name]: !this.state.isMandatory
        }
        this.setState({isMandatory: !this.state.isMandatory});
      }
      this.state.session.splice(index, 1, item);
    }

    
    this.forceUpdate();
  };
  handleOnDragEnd(result) {
    if (!result.destination) return;
    const items = Array.from(this.state.session);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    this.setState({ session: items }, () => {
      this.autoSave(true);
    });
  }

  // selected data
  selectSession = (dataSelectedSession) => {
    try {
      let { session, selectedSession } = this.state;
      
      if (selectedSession !== dataSelectedSession) {
        this.autoSave();
      }

      this.setState({ session });
      const index = this.state.session.findIndex(item => item.id === dataSelectedSession);
      if(['name','email','born date','gender'].indexOf(session[index].name.toLowerCase()) > -1){
        session[index].permanent = true;
      }

      this.setState({
        initialSession: true,
        name: session[index].name,
        subname: session[index].subname || '',
        permanentField: session[index].permanent,
        selectedSession: dataSelectedSession,
        selectedType: session[index].type ,
        isMandatory: session[index].mandatory,
        selectOption: session[index].option ? session[index].option : []
      },()=>{
        this.forceUpdate();
      });
      
    } catch (error) {
      //console.log(error,"WOI")
    }
  };
  removeOptionSelect (childIndex) {
    let { session } = this.state;
    const index = session.findIndex(sess => sess.id === this.state.selectedSession);
    const parentIndex = index;
    const childOptionIndex = childIndex;
    let arr = [...this.state.selectOption];

    arr.splice(childOptionIndex, 1)
    let item = {
      ...this.state.session[parentIndex],
      option: arr,
    };

    this.setState({selectOption: arr});
    this.state.session.splice(parentIndex, 1,item);
    this.forceUpdate();
  }
  addNewOptionSelect () {
    let { session, selectOption  } = this.state;
    const index = session.findIndex(sess => sess.id === this.state.selectedSession);
    let defaultOption = {
      labelName:'',
      get labelString(){
        let label = this.labelName;
        if(label.length) label = label.replace(/\s/g,"");
        return label;
      } 
    };

    selectOption.push(defaultOption);
    session[index].option = selectOption;
    this.setState({selectOption, session},()=>{
      this.forceUpdate();
    });
  }

  // create new or save action
  addNewSession() {
    let session = this.state.session;
    const maxValueId = Math.max(...session.map(o => o.id));
    const newID = maxValueId + 1;

    session.push({
      id: newID,
      name: '',
      subname:'',
      stateName:"",
      stateString:"",
      type: '',
      mandatory: false,
      option: []
    });
    
    this.setState({ 
      initialSession: true,
      session, 
      name : '', 
      subname:'',
      selectedType : null, 
      selectOption: [],
      isMandatory:false,
      permanentField: false,
    },()=>{
      this.name.focus();
      this.forceUpdate();
      this.setState({selectedSession: newID});
    });
  }
  autoSave = async (isDrag) => {
    //console.log("AUTO SAVE1");
    let err = await this.postRegistrationForm(this.props.match.params.id);
    // console.log(err,"AUTO SAVE");
    if(!err){
      this.setState({ edited: false, isSaving: false });
      toast.success('Automatic saving');
    }else{
      this.setState({ edited: false, isSaving: false });
      toast.warning("Failed saving form registration. Please Check Input Form Correctly..");
    }
  };

  save = async (e) => {
    e.preventDefault();
    let err = await this.postRegistrationForm(this.props.match.params.id);
    if(!err){
          this.setState({ edited: false, isSaving: false });
      toast.success("Success saving form registration");
    }else{
      this.setState({ edited: false, isSaving: false });
      toast.warning("Failed saving form registration. Please Check Input Form Correctly..");
    }
  };

  // remove
  clearSessionForm() {
    this.setState({
      edited: false,
      selectedSession: '',
      name: '',
      subname:'',
      type: [],
      isMandatory: false,
    });
  }
  deleteSession() {
    let { session } = this.state;
    const index = session.findIndex(sess => sess.id === this.state.selectedSession);
    let id = this.state.selectedSession;
    if(session[index].permanent){
      toast.warning("This field is mandatory, you cannot delete this field.");
    }else{
      session = session.filter(sess => sess.id !== id)
      this.setState({ session: session });
      if (session.length) {
        this.selectSession.bind(this, session[0]);
      } else {
        this.setState({ initialSession: false });
        this.clearSessionForm();
      }
      this.closeModalDelete();
    }
  }

  closeModalRegist = (e) => {
    this.setState({ modalRegist: false });
  };

  ToggleSwitch() {
    if(!this.state.registEnable && !this.state.slot || !this.state.closeRegistration){
      toast.warning('Slot & Period Cannot Be Empty.')
    }else {
      this.autoSave();
      this.setState({ registEnable: !this.state.registEnable }, () => {
        let form = {
          enable_registration: this.state.registEnable ? 1 : 0,
        };
  
        if(form.enable_registration) {
          
        }
  
        API.put(`${API_SERVER}v2/training/company/enable-registration/${this.props.match.params.id}`, form).then((res) => {
          if (res.data.error) {
            toast.error('Error update registration');
          } else {
            toast.info(`Public Registration Form ${this.state.registEnable ? 'Enabled' : 'Disabled'}`);
          }
        });
      });
    };

      
    }
  

  ToggleSwitchPaid() {
    this.setState({ isPaid: !this.state.isPaid }, () => {
      let form = {
        is_paid: this.state.isPaid ? 1 : 0,
      };
      API.put(`${API_SERVER}v2/training/company/enable-paid-registration/${this.state.idForm}`, form).then((res) => {
        if (res.data.error) {
          toast.error('Error update paid registration');
        } else {
          toast.info(`Paid Registration Form ${this.state.isPaid ? 'Enabled' : 'Disabled'}`);
        }
      });
    });
  }

  render() {
    let { session,selectedSession,permanentField } = this.state;
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="floating-back">
                    <img src={`newasset/back-button.svg`} alt="" width={90} onClick={this.goBack}></img>
                  </div>
                  <div className="row">
                    <div className="col-xl-12">
                      <div>
                        <div className="card p-20">
                            
                          <div className="form-section no-border">
                            <div className="row">
                              
                              <div className='col-xs-3' style={{}}>
                                <div className="form-field-top-label m-b-20 p-r-10">
                                  <label for="title">Enable Form</label>
                                  <div class="form-field-top-label" style={{marginTop:20,marginLeft:-10}}>
                                    <ToggleSwitch
                                      name="registEnable"
                                      onChange={this.ToggleSwitch.bind(this)}
                                      checked={this.state.registEnable}
                                    />
                                  </div>
                                </div>
                              </div>  
                              
                                <>
                                {this.state.registEnable ? (
                                    <div className='col-xs-5' style={{}}>
                                      <div className="form-field-top-label m-b-20 p-r-10">
                                        <label for="title">URL Form</label>
                                        <div class="form-field-top-label input-group" style={{paddingLeft:0}}>
                                          <input 
                                            type="text"  
                                            id="inlineFormInputGroup"
                                            name="urlRegist"
                                            size="50"
                                            value={this.state.urlRegist}
                                            style={{borderRadius:"10px 0 0 10px"}}
                                            disabled
                                          />
                                        <CopyToClipboard
                                            text={this.state.urlRegist}
                                            onCopy={() => {
                                                toast.info('Copied to clipboard');
                                            }}
                                            >
                                          <div class="input-group-prepend">
                                            <div class="input-group-text" style={{ cursor:"pointer",borderBottomRightRadius :10,borderTopRightRadius :10 }}>
                                                <i class="fas fa-copy"></i>
                                            </div>
                                          </div>
                                        </CopyToClipboard>
                                        </div>
                                      </div>
                                    </div>
                                    )
                                    : null
                                  }

                                  {
                                    DEV_MODE === 'production' ? null :
                                    <div className='col-xs-1' style={{paddingLeft:15}}>
                                      <div className="form-field-top-label">
                                        <label for="title">
                                            Paid
                                        </label>
                                      </div>
                                      <div className="form-field-top-label p-2">                  
                                        <ToggleSwitch
                                            name="isPaid"
                                            onChange={this.ToggleSwitchPaid.bind(this)}
                                            checked={this.state.isPaid}
                                        />
                                      </div>
                                    </div>
                                  }
                                    
                                    <div className='col-xs-1'>
                                      <div className="form-field-top-label p-r-20">
                                        <label for="title">
                                            Quota<required>*</required>
                                        </label>
                                      </div>
                                      <div className="form-field-top-label">
                                        <input
                                          type="number"
                                          name="slot"
                                          id="slot"
                                          placeholder="0"
                                          style={{width:100, marginBottom:5}}
                                          value={this.state.slot}
                                          onChange={this.handleChange}
                                          disabled={this.state.disabledForm}
                                        />
                                      </div>
                                    </div>

                                    <div className='col-3'>
                                      <div className="form-field-top-label p-r-20">
                                        <label for="title">
                                            Close Date<required>*</required>
                                        </label>
                                      </div>
                                      <div className="form-field-top-label">
                                        <input
                                          type="date"
                                          name="closeRegistration"
                                          min={this.state.minDate}
                                          id="closeRegistration"
                                          style={{marginBottom:5}}
                                          value={this.state.closeRegistration}
                                          onChange={this.handleChange}
                                          disabled={this.state.disabledForm}
                                        />
                                      </div>
                                    </div>
                                    
                                    </>
                                
                              

                            </div>
                            <div className="row">
                              <div className='col-xs'>
                                <div className="form-field-top-label m-b-20">
                                  <label for="title">
                                    Form Title
                                  </label>
                                  <input
                                    type="text"
                                    name="titleForm"
                                    size="50"
                                    id="titleForm"
                                    placeholder="Form Registration"
                                    value={this.state.titleForm}
                                    onChange={this.handleChange}
                                    disabled={this.state.disabledForm}
                                  />
                                </div>
                                
                              </div>
                            </div>
                            <div className='row'>
                              <div className='col-xs'>
                                <div className="form-field-top-label m-b-20">
                                  <label for="name">
                                    Form Description
                                  </label>
                                  <textarea
                                    cols={48}
                                    maxLength={150}
                                    name="subtitle"
                                    id="subtitle"
                                    value={this.state.subtitle ? this.state.subtitle : ''}
                                    onChange={(e)=>{ let state = this.state; state[e.target.name] = e.target.value; this.setState({[e.target.name]:e.target.value}) }}
                                  />
                                </div>                                                
                              </div>
                            </div>
                            <div className='row'>                              
                            <div className='col-xs'>
                                <div className='form-field-top-label m-b-20'>
                                  <label>Images</label>
                                  <input
                                      type="file"
                                      id="media"
                                      name="media"
                                      accept="image/*"
                                      disabled={this.state.progressUploadMedia}
                                      class="form-control"
                                      onChange={this.handleChangeAttachment}
                                      onClick={(e) => (e.target.value = null)}
                                  />
                                  <label
                                      for="media"
                                      className="form-control"
                                      disabled={this.state.progressUploadMedia}
                                  >
                                      <div
                                          className="loading-button"
                                          style={{
                                              width: this.state.progressUploadMedia
                                                  ? this.state.progressUploadMedia + '%'
                                                  : '0' + '%',
                                          }}
                                      ></div>
                                      {this.state.progressUploadMedia ? null : (
                                          <i className="fa fa-plus"></i>
                                      )}
                                      &nbsp;
                                      {this.state.progressUploadMedia
                                          ? this.state.progressUploadMedia === 100
                                              ? 'Uploaded. Processing file...'
                                              : `Uploading... ${this.state.progressUploadMedia}%`
                                          : 'Add Images'}
                                  </label>
                                </div>
                                <div className='form-field-top-label' style={{marginTop:-20, paddingBottom:20}}>
                                  {/* <div className='col-8'> */}
                                    <div style={{overflowY:'auto'}}>
                                      {this.state.optionFile.length ? this.state.optionFile.map((item, index) => {
                                        let icon = 'fa-paperclip';
                                        switch (item.type) {
                                          case 'PDF':
                                            icon = 'fa-file-pdf';
                                            break;
                                          case 'Word':
                                            icon = 'fa-file-word';
                                            break;
                                          case 'Excel':
                                            icon = 'fa-file-excel';
                                            break;
                                          case 'PowerPoint':
                                            icon = 'fa-file-powerpoint';
                                            break;
                                          case 'Image':
                                            icon = 'fa-image';
                                            break;
                                          case 'Video':
                                            icon = 'fa-file-video';
                                            break;
                                          case 'Audio':
                                            icon = 'fa-file-audio';
                                            break;
                                          default:
                                            icon = 'fa-paperclip';
                                        }
                                        return (
                                          
                                          <div className="training-session-media-list" style={{ marginTop:"1%" }}>
                                            <a href={item.url} target="_blank" style={{ color: '#000' }} rel="noopener noreferrer">
                                              <i className={`fa ${icon}`}></i>&nbsp;
                                              {item.name.length > 10 ? `...${item.name.substring(item.name.length-8,item.name.length)}`:item.name}
                                            </a>
                                            <i
                                              className="fa fa-times"
                                              onClick={this.deleteMedia.bind(this, item.name, item, index)}
                                            ></i>
                                          </div>
                                        );
                                      }) : null}
                                    </div>
                                  {/* </div> */}
                                </div>
                              </div>
                            </div>
                            <div className="row m-b-20">
                              <div className="col-sm-12 m-b-20">
                                <strong className="f-w-bold" style={{ color: '#000', fontSize: '15px' }}>
                                  Form Fields
                                </strong>
                              </div>
                            </div>
                            
                            <div className="row">
                              <DragDropContext onDragEnd={this.handleOnDragEnd.bind(this)}>
                                <Droppable droppableId="sessions">
                                  {(provided) => (
                                    <div
                                      className="col-sm-3"
                                      style={{ marginTop: 34 }}
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                    >
                                      {session.map((item, index) => (
                                        <Draggable key={item.id} draggableId={String(item.id)} index={index}>
                                          {(provided) => (
                                            <div
                                              {...provided.draggableProps}
                                              {...provided.dragHandleProps}
                                              ref={provided.innerRef}
                                              className={`training-session-list ${item.permanent && 'grey-item'}`}
                                              onClick={this.selectSession.bind(this, item.id)}
                                            >
                                              <i className="fa fa-bars icon-draggable"></i>
                                              {item.name} 
                                              {
                                                (item.permanent && item.mandatory) ?
                                                  (<i style={{fontSize:10,float:"right"}}>(Required)</i>) :
                                                (item.permanent && !item.mandatory) ?
                                                  (<i style={{fontSize:10,float:"right"}}>(Required)</i>) : 
                                                (item.mandatory) ?
                                                  (<i style={{fontSize:10,float:"right"}}>(Required)</i>) : null
                                              }
                                              {selectedSession === item.id && (
                                                <div className="training-session-list-indicator">
                                                  <i className="fa fa-chevron-right"></i>
                                                </div>
                                              )}
                                            </div>
                                          )}
                                        </Draggable>
                                      ))}
                                      {provided.placeholder}
                                      <div className="training-new-session" onClick={(e) => this.addNewSession(e, true)}>
                                        <i className="fa fa-plus"></i> Add Registration Form
                                      </div>
                                    </div>
                                  )}
                                </Droppable>
                              </DragDropContext>
                              {this.state.initialSession ? (
                                <div className="col-sm-9">
                                  <div className="form-field-top-label">
                                    <label for="name">
                                      Field Label<required>*</required>
                                    </label>
                                    <input
                                      ref={(input) => {
                                        this.name = input;
                                      }}
                                      type="text"
                                      name="name"
                                      size="53"
                                      id="name"
                                      placeholder="Please fill your field name"
                                      value={this.state.name}
                                      onChange={this.handleChange}
                                      disabled={permanentField}
                                    />
                                  </div>
                                  <div className="form-field-top-label" style={{ width: 400 }}>
                                    <label for="selectedType">
                                      Type <required>*</required>
                                    </label>
                                    <MultiSelect
                                      id="selectedType"
                                      options={this.state.optionTypeInput}
                                      value={this.state.selectedType ? [this.state.selectedType] : []}
                                      onChange={this.handleChangeMultiSelect}
                                      mode="single"
                                      enableSearch={true}
                                      resetable={true}
                                      valuePlaceholder="Select Type Input"
                                      disabled={ permanentField ? true : false}
                                    />
                                  </div>
                                  <div className="form-field-top-label">
                                    <label for="name">
                                      Description
                                    </label>
                                    <textarea
                                      cols={51}
                                      maxLength={150}
                                      name="subname"
                                      id="subname"
                                      placeholder="Please fill your description for this field"
                                      value={this.state.subname}
                                      onChange={this.handleChange}
                                    />
                                  </div>
                                  <div className="form-field-top-label">
                                    <label for="title">
                                      Required &nbsp;
                                    </label>
                                    <input
                                      style={{marginTop: 3}}
                                      type="checkbox"
                                      name="mandatory"
                                      id="mandatory"
                                      checked={this.state.isMandatory}
                                      value={this.state.isMandatory}
                                      onChange={this.handleChange}
                                      disabled={permanentField}
                                    />
                                  </div>
                                  {['select','checkbox'].indexOf(this.state.selectedType) > -1 ? 
                                  <div className="form-field-top-label" style={{ width: 400 }}>
                                    <button
                                      onClick={this.addNewOptionSelect.bind(this)}
                                      className="btn btn-icademy-primary float-left"
                                      style={{ padding: '7px 8px !important', marginTop: 10, marginBottom: 10 }}
                                      disabled={permanentField}
                                    >
                                      <i className="fa fa-plus"></i>
                                      Add Option
                                    </button>
                                    {this.state.selectOption.map((item, index) => {
                                      return (
                                        <>
                                          <label for="option-select">
                                            Option Name<required>*</required>
                                          </label>
                                          <input
                                            type="text"
                                            placeholder="XXXXX XXXXX XXXXX"
                                            value={item.labelName}
                                            onChange={this.handleChangeSelectOption.bind(this, index)}
                                            disabled={permanentField}
                                          />

                                    <button
                                      onClick={this.removeOptionSelect.bind(this, index)}
                                      className="btn btn-icademy-red float-left"
                                      style={{ padding: '7px 8px !important', marginTop: 10, }}
                                      disabled={permanentField}
                                    >
                                      X
                                    </button>
                                        </>
                                      )
                                    })}
                                    
                                    
                                  </div> : null }
                                  
                                </div>
                              ) : null}
                            </div>
                          </div>
                          
                          <div className="row" style={{ justifyContent: 'flex-end' }}>
                            {!this.props.disabledForm && this.state.initialSession && (
                              <button
                                onClick={() => this.setState({ modalDelete: true })}
                                className="btn btn-icademy-primary btn-icademy-red float-right"
                                style={{ padding: '7px 8px !important', margin: 0, marginRight: 14 }}
                              >
                                <i className="fa fa-trash-alt"></i>
                                Delete selected form
                              </button>
                            )}
                            {!this.props.disabledForm && (
                              <button
                                disabled={this.state.isSaving || !this.state.edited}
                                onClick={this.save}
                                className="btn btn-icademy-primary float-right"
                                style={{ padding: '7px 8px !important', marginRight: 30 }}
                              >
                                <i className="fa fa-save"></i>
                                {
                                  this.state.session.length ? 'Save' : 'No change to save'
                                }
                                {/* {this.state.isSaving ? 'Saving...' : (this.state.edited && this.state.session.length) ? 'Save' : 'No changes to save'} */}
                              </button>
                            )}
                          </div>
                        </div>

                        <Modal show={this.state.modalDelete} onHide={this.closeModalDelete} centered>
                          <Modal.Header closeButton>
                            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                              Confirmation
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div>Are you sure want to delete this form ?</div>
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
                              onClick={this.deleteSession.bind(this)}
                            >
                              <i className="fa fa-trash"></i> Delete
                            </button>
                          </Modal.Footer>
                        </Modal>

                        <Modal show={this.state.modalAdd} onHide={this.closeModalDelete} centered>
                          <Modal.Header closeButton>
                            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                              Add Registration Form
                            </Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <div className="form-field-top-label">
                              <label for="title">
                                Title Form
                              </label>
                              <input
                                type="text"
                                name="title"
                                size="50"
                                id="title"
                                placeholder="Form Registration"
                                value={this.state.title}
                                onChange={this.handleChange}
                                disabled={this.state.disabledForm}
                              />
                            </div>
                            <div className="form-field-top-label">
                              <label for="title">
                                Name Input<required>*</required>
                              </label>
                              <input
                                type="text"
                                name="name"
                                size="50"
                                id="name"
                                placeholder="XXXXX XXXXX XXXXX"
                                value={this.state.name}
                                onChange={this.handleChange}
                                disabled={this.state.disabledForm}
                              />
                            </div>
                            <div className="form-field-top-label" style={{ width: 400 }}>
                              <label for="valueCourse">
                                Type Input <required>*</required>
                              </label>
                              <MultiSelect
                                id="valueCourse"
                                options={this.state.optionTypeInput}
                                value={this.state.selectedLicense}
                                onChange={(selectedLicense) => {
                                  //console.log(selectedLicense);
                                  this.setState({ selectedLicense });
                                }}
                                mode="single"
                                enableSearch={true}
                                resetable={true}
                                valuePlaceholder="Select Type Input"
                              />
                            </div>
                          </Modal.Body>
                          <Modal.Footer>
                            <button
                              className="btn btm-icademy-primary btn-icademy-grey"
                              onClick={this.closeModalDelete.bind(this)}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn btn-icademy-primary btn-icademy-primary"
                              onClick={this.deleteSession.bind(this)}
                            >
                              <i className="fa fa-save"></i> Save
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
    );
  }
}

export default FormCourse;
