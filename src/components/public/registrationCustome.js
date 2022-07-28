import React, { Component } from 'react';
import API, { API_SERVER, DEV_MODE } from '../../repository/api';
import { toast } from 'react-toastify';
import axios from 'axios';
import Iframe from 'react-iframe';
import moment from 'moment-timezone';


class registrationCustome extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor(props) {
    super(props);
  }
  dataTemplate = {
    "titleForm": "Form Registration Form",
    "input": [
      {
        id:0,
        "name": "Name",
        "type": "text",
        "mandatory": true
      },
      {
        id:2,
        "name": "Email",
        "type": "email",
        "mandatory": true
      },
      {
        id:3,
        "name": "Born Date",
        "type": "date",
        "mandatory": true
      },
      {
        id:4,
        "name": "Gender",
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
      },
      // {
      //     "name":"Attachments",
      //     "type":"attachments",
      //     "mandatory":false,
      //     "option":[   
      //       {
      //           "id": 11,
      //           "name": "UTML01-2.jpg",
      //           "url": "https://icademys.s3.amazonaws.com/staging/training/user/registration-user/1657096209533-UTML01-2.jpg"
      //       },
      //       {
      //           "id": 12,
      //           "name": "training_registration_list.sql",
      //           "url": "https://icademys.s3.ap-southeast-1.amazonaws.com/staging/training/user/registration-user/1657096243701-training_registration_list.sql"
      //       }
      //     ]
      // }
    ]
  };
  stateProps = {};

  default = {
    load:true,
    template: this.dataTemplate,
    media:[],
    input: {},
    id: this.props.match.params.id,
    idForm: "1",
    titleForm:"Form Registration",
    nameCompany:'',
    ...this.stateProps,
    // name: '',
    // born_date: new Date(),
    // gender: '',
    // identity: '',
    // address: '',
    // city: '',
    // phone: '',
    // email: '',
    isSubmit: false,
    submitText: 'Submit',
    enableRegist: false,
    loading: false,
    period: null,
    isPaidRegister: false,
    isRegistrationClosed: false
    // media: []
  };

  state = this.default;

  deleteMedia = (name, detailMedia, index) => {
    API.delete(`${API_SERVER}v2/training/registration-user/media/${detailMedia.id}`).then(res => {
      if (res.data.error){
          toast.warning('Fail to delete media')
      }
      else{
        let media = [...this.state[name]];
        media.splice(index, 1);
    
        this.setState({ [name]: media })
      }
  })

    let media = [...this.state[name]];
    media.splice(index, 1);

    this.setState({ [name]: media })
  }

  initialForm (data) {
    let listData = data;
    //console.log(data,'initial data?')

    listData.map((input) => {
      if (input.type === 'file') {
        this.setState({
          [input.name]: []
        })
      } else if (input.type == 'attachments') {
        if(input.option) {
          this.setState({
            [input.name]: input.option
          })
        }else{
          this.setState({
            [input.name]: []
          })
        }
      }else if(input.type === 'checkbox') {
        this.setState({
          [input.name]: input.option.map(opt => ({...opt, check: false}))
        })
      }else {
        this.setState({
          [input.name]: ''
        })
      }
    })
  }

  getRegistrationForm(id){
    API.get(`${API_SERVER}v2/training/setup-registration-form/${id}?mode=public`).then(res => {
        if (res.data.error){
            toast.error('Error read form')
        }
        else{
            let template = this.state.template;
            let media = this.state.media;
            let subtitle=null;
            if(res.data.result.length){
              template = { 
                    input: res.data.result[0].json_data ? JSON.parse(res.data.result[0].json_data) : [],
                    titleForm: res.data.result[0].title || '',
                    subtitle:res.data.result[0].subtitle || '',
                };
                media = res.data.result[0].media ? JSON.parse(res.data.result[0].media) : []
                this.setState({isRegistrationClosed: res.data.result[0].isRegistrationClosed, idForm: res.data.result[0].id, period: res.data.result[0].close_registration ? moment(res.data.result[0].close_registration).format('YYYY-MM-DD') : null, isPaidRegister: res.data.result[0].is_paid == '1'? true: false})
            }
            this.initialForm(template.input);

            this.setState({ template, media },()=>{
              this.forceUpdate();
            });
        }
    })
  }

  handleChange = (e) => {
    const name = e.target.name;
    if (e.target.files.length) {
      if (e.target.files[0].size <= 500000000) {
        // let media = this.state[name];
        // media.push(e.target.files[0])
        // this.setState({
        //   [name]: media
        // })
        this.setState({isUploading: true})
        let selectedSession = this.state[name];
        selectedSession.isUploading = true;
        this.setState({ [name]: selectedSession });
        let formData = new FormData();
        formData.append('media', e.target.files[0]);
        // let token = Storage.get('token');
        var config = {
          onUploadProgress: (progressEvent) => {
            // this.setState({progressUploadMedia: Math.round( (progressEvent.loaded * 100) / progressEvent.total )});
            let session = this.state[name];
            session.progressUploadMedia = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            this.setState({ [name]: session });
          },
          headers: {
            // Authorization: token.data,
          },
        };
        axios
          .post(`${API_SERVER}v2/training/registration-user/media`, formData, config)
          .then((res) => {
            if (res.data.error) {
              toast.warning(res.data.result);
              // this.setState({isUploading: false, progressUploadMedia: 0})
              let session = this.state[name];
              session.progressUploadMedia = 0;
              session.isUploading = false;
              this.setState({ [name]: session });
            } else {
              let media = this.state[name];
              media.push({id: res.data.result.id,
                name: res.data.result.name,
                url: res.data.result.url})
              // this.setState({isUploading: false, progressUploadMedia: 0})
              let session = this.state[name];
              session.progressUploadMedia = 0;
              session.isUploading = false;
              this.setState({ [name]: session });
            }
          });
      } else {
        e.target.value = null;
        toast.warning(`File size cannot larger than 500MB`);
      }
    }
  }

  checkTypeInput = (input, stateName, stateString) => {
    let io = null;
    let type = input.type.toLowerCase();
    const inputName = input.name;
    // let stateInput = this.state.input;
    // let stateName = stateInput[stateString]

    if (['text', 'date', 'email', 'number'].indexOf(type) > -1) {
      return (
        <>
          <label className="form-label" for={input.name}>
            {input.name}<required>{input.mandatory ? '*' : ''}</required>
          </label>
          <input
            type={type}
            name={stateName}
            id={stateString}
            className="form-control form-control-lg"
            value={this.state[inputName]}
            style={{ position: 'relative', width: '100%', opacity: 1 }}
            onChange={(e) => this.onChange(e, inputName)} 
          />
          {
            input.subname &&(
              <small className="form-text" style={{color:"#333"}} for={input.subname}>
                <i>
                  {input.subname}
                </i>
              </small>
            )
          }
        </>
      );
    }
    else if (type === 'checkbox') {
      return (
        <>
          <div className='form-group'>
            <label className="form-label" for={input.name}>
              {input.name}<required>{input.mandatory ? '*' : ''}</required>
            </label>
          </div>
            {
              input.option.map((op, index) => {
                return (
                  <div className='form-group row'>
                    <div className='col-sm-1'>
                      <input
                        type={type}
                        name={stateName}
                        id={stateString}
                        className="form-control"
                        value={op.labelName}
                        checked={op.check}
                        style={{ position: 'relative', width: '100%', opacity: 1, marginTop:"-2px", minHeight: 20 }}
                        onChange={(e) => this.checkboxChange(e, op, input, index)}
                      />
                    </div>       
                    <div className='col-sm'>
                      <label className="form-check-label" style={{color:"#333", marginLeft:-30, fontSize:14}} for={op.labelString}>
                        {op.labelName}
                      </label>
                    </div>  
                  </div>
                )
              })
            }
            {
            input.subname &&(
              <small className="form-text" style={{color:"#333"}} for={input.subname}>
                <i>
                  {input.subname}
                </i>
              </small>
            )
          }
        </>
      );
    }else if (type === 'select') {
      return (
        <>
          <label className="form-label" for={input.name}>
            {input.name}<required>{input.mandatory ? '*' : ''}</required>
          </label>
          <select
            name={stateName}
            id={stateString}
            onChange={(e) => this.onChange(e, inputName)}
            className="form-control form-control-lg">
            <option value="0">Select {input.name}</option>
            {
              input.option.map((op) => {
                return (
                  <option value={op.labelString} selected={stateName === op.labelName}>
                    {op.labelName}
                  </option>
                )
              })
            }
          </select>
          {
            input.subname &&(
              <small className="form-text" style={{color:"#333"}} for={input.subname}>
                <i>
                  {input.subname}
                </i>
              </small>
            )
          }
        </>
      );
    } else if (type === 'textarea') {
      let optionData = [];
      return (
        <>
          <label className="form-label" for={input.name}>
            {input.name}<required>{input.mandatory ? '*' : ''}</required>
          </label>
          <textarea
            name={stateString}
            rows="3"
            id={stateString}
            className="form-control form-control-lg"
            value={this.state[inputName]}
            onChange={(e) => this.onChange(e, inputName)}
          ></textarea>
          {
            input.subname &&(
              <small className="form-text" style={{color:"#333"}} for={input.subname}>
                <i>
                  {input.subname}
                </i>
              </small>
            )
          }
        </>
      );
    } else if (type === 'file') {
      return (
        <>
        <div className='form-label'>
          <label for="media" className="form-label">{input.name}<required>{input.mandatory ? '*' : ''}</required></label>
        </div>
        <div className="form-field-top-label" style={{marginLeft:-10}}>
          <>
            <label
              for={inputName}
              className="form-control"
            >
              <div className='loading-button' style={{width: this.state[inputName].progressUploadMedia ? this.state[inputName].progressUploadMedia : '0' +'%'}}></div>
                {this.state[inputName].progressUploadMedia ? null : <i className="fa fa-plus"></i>}&nbsp;
                {this.state[inputName].progressUploadMedia ? this.state[inputName].progressUploadMedia === 100 ? 'Uploaded. Processing file...' : `Uploading... ${this.state[inputName].progressUploadMedia}%` : 'Add media'}
            </label>
            <input
              type={type}
              id={inputName}
              name={inputName}
              className="form-control file-upload-icademy"
              onChange={this.handleChange}
              onClick={(e) => (e.target.value = null)}
            />
            <div className="training-session-media">
            {this.state[input.name].length ? this.state[input.name].map((item, index) => {
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
                    
                    <div className="training-session-media-list">
                    <a href={item.url} target="_blank" style={{ color: '#000' }} rel="noopener noreferrer">
                        <i className={`fa ${icon}`}></i>&nbsp;
                        {item.name}
                    </a>
                    <i
                        className="fa fa-times"
                        onClick={this.deleteMedia.bind(this, input.name, item, index)}
                    ></i>
                    </div>
                );
                }) : null}
            </div>
          </>
        </div>

        {
          input.subname &&(
            <div className="form-field-top-label" style={{marginLeft:-10}}>
              <small className="form-text" style={{color:"#333"}} for={input.subname}>
                <i>{input.subname}</i>
              </small>
            </div>
          )
        }
        </>
      )
    } else if (type === 'attachments') {
      return (
        <div className="form-field-top-label">
          <label for="media">{input.name}</label>
          <div className="training-session-media">
            {this.state[input.name].length ? this.state[input.name].map((item, index) => {
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
                
                <div className="training-session-media-list">
                  <a href={item.url} target="_blank" style={{ color: '#000' }} rel="noopener noreferrer">
                    <i className={`fa ${icon}`}></i>&nbsp;
                    {item.name}
                  </a>
                </div>
              );
            }) : null}
          </div>
        </div>
      )
    }
  }

  prepareDataTemplate = () => {
    let objectInput = {};
    let template = this.state.template;
    template.input.forEach((input, index) => {
      let removeWhiteSpace = input.name.replace(/\s/g, '');
      objectInput[removeWhiteSpace] = null;
      template.input[index].stateString = removeWhiteSpace;
    });
    this.setState({ input: objectInput, template })
  }

  checkboxChange = (e, op, input, index) => {
    let optionCheck = input.option[index];
    optionCheck.check = !optionCheck.check;
    const allOption = input.option;

    this.setState({[input.name]: allOption})
  }

  onChange = (e, input) => {
    let tmp = { [input]: e.target.value };
    this.setState(tmp);
  };

  getCompany(id) {
    API.get(`${API_SERVER}v2/training/company/read-public/${id}`).then((res) => {
      if (res.data.error) {
        toast.error('Error read company');
      } else {
        let load = res.data.result.enable_registration == 1 ? true : false;
        this.setState({
          load,
          enableRegist: load,
          loading: false,
          nameCompany:res.data.result.name
        });
      }
    });
  }

  componentDidMount() {
    this.getRegistrationForm(this.props.match.params.id);
    setTimeout(()=>{
      this.prepareDataTemplate();
      this.getCompany(this.props.match.params.id);
    },1000)
  }

  goBack() {

    //console.log(localStorage.getItem("user"),"888888")
    // let usr = JSON.parse(localStorage.getItem("user"));
    // if(usr.data.grup_name.toLowerCase().search('admin') > -1){
        
    //     this.props.history.push('/training');
    // }else{
    //     if(localStorage.getItem("token")){
    //         this.props.history.push('/training/company/detail/'+this.props.match.params.id);
    //     }
    // }
    
  }

  submitForm = (e) => {
    let objSubmit = {};
    let isFormAllFilled = true;
    const inputAllForm = this.state.template.input;
    for (let i = 0; i < inputAllForm.length; i++) {
      //console.log(this.state[inputAllForm[i].name], '???')
      if (inputAllForm[i].mandatory && (!this.state[inputAllForm[i].name] || !this.state[inputAllForm[i].name].length)) {
        isFormAllFilled = false;
        break;
      }else{
        objSubmit[inputAllForm[i].name.toLowerCase()] = this.state[inputAllForm[i].name];
      }
    }
    // Form Ada Yang Tidak Terisi

    if (!isFormAllFilled) {
      toast.warning('Please fill the required field');
    } else {
      const form = {
        idTrainingCompany: this.state.id,
        idForm: this.state.idForm,
        data: JSON.stringify(objSubmit)
      };
      this.setState({ isSubmit: true });
      API.post(`${API_SERVER}v2/training/user-registration-form`, form).then((res) => {
        if (res.data.error) {
          toast.error(`Error submit form : ${res.data.result}`);
          this.setState({ isSubmit: false });
        } else {
          toast.success(
            'Successfully submit data, you will receive account information in your email when admin has activated your account.',
          );
          // this.setState(this.default);
          this.getRegistrationForm(this.props.match.params.id); // Reset Form
          this.setState({ loading: false, isSubmit: false, enableRegist: true });
          if(this.state.isPaidRegister && DEV_MODE !== 'production') {
            window.location.href="https://buy.stripe.com/test_3cs6pw1IraMT2wocMM";
          }
        }
      });
    }
  };

  backtoHome() {
    window.location.replace(`/`);
  }

  render() {
    const images = 'Group-14.png';
    const bg = 'bg1.png'
    const template = this.state.template;
    
    return (

      <section className="h-100 bg-white">
        {this.state.isRegistrationClosed ? 
        <div className="container" style={{ justifyContent: 'center', cursor:"default", textAlign:'center' }}>
          <h4>Registration Already Closed... Please Contact Administrator.</h4> <br/>
          <h5 style={{ cursor: 'pointer' }} onClick={() => this.backtoHome()}>
            <u>Back to Homepage</u>
          </h5>
        </div> 
        : 
        this.state.enableRegist && !this.state.loading ? (
          <div className="container" style={{ display: 'flex', justifyContent: 'center', cursor:"default" }}>
            <div className="row d-flex justify-content-center align-items-center h-100" style={{width:"100%"}}>
              <div className="col" style={{marginTop:"10px"}}>
                    {
                        // localStorage.getItem("token") && (
                        //     <div className="floating-back" style={{marginLeft:"-50px"}}>
                        //         <img src={`newasset/back-button.svg`} alt="" width={90} onClick={this.goBack}></img>
                        //     </div>
                        // )
                    }
                <div className="card card-registration my-4">
                    <div className="row g-0">
                        <div className="col">
                            <div className="p-md-3 text-black">
                                <div className="mb-5 form-group">
                                    <center>
                                        <h3 className="text-uppercase">{ this.state.template.titleForm }</h3>
                                    </center>
                                    <div className='form-field-top-label' style={{marginLeft:-10}}>
                                      {
                                        this.state.template.subtitle &&(
                                          <>
                                          <small className="form-text" style={{color:"#333", marginLeft:15}} for={'subtitle'}>
                                            <i>
                                              {this.state.template.subtitle}
                                            </i>
                                          </small>
                                          <br />
                                          </>
                                        )
                                      }
                                    </div>
                                </div>
                                
                                <div className='row' style={{display: 'contents'}}>
                                        <div className='col' style={{float:'left'}}>
                                          <div className='form-field-top-label'>
                                              <label className="form-label"></label>
                                              <input
                                              type={'text'}
                                              name={'nameCompany'}
                                              id={'nameCompany'}
                                              className="form-control form-control-lg"
                                              value={this.state.nameCompany}
                                              size="50"
                                              style={{ width: '100%', opacity: 1, cursor:"none", marginLeft:-10, color: 'black' }}
                                              disabled={true}
                                              />
                                              <br />
                                          </div>
                                        </div>
                                    
                                </div>
                                {
                                  this.state.media.length > 0 ? 
                                    this.state.media.map((item, index) => {
                                      return(
                                        <>
                                          <div className='row'>
                                              <div className='col'>
                                                <div className="form-input p-20">
                                                  <div className="training-session-media-list" style={{fontSize:10,display:"inline-block"}}>
                                                    <img src={item.url} alt={item.name} style={{maxWidth: '100%'}} />
                                                  </div>
                                                </div>
                                              </div>
                                          </div>
                                        </>
                                      ) 
                                    })
                                  :null    
                                }
                                { 
                                  // this.state.media.length > 0 && (
                                  //   <div className='row'>

                                  //     <div className='col'>
                                  //         <center>
                                  //         <div className="form-input p-20">
                                  //             <label for="media"></label>
                                  //             <div className="training-session-media">
                                  //                 {
                                  //                 this.state.media.map((item, index) => {
                                  //                 let icon = 'fa-paperclip';
                                  //                 switch (item.type) {
                                  //                     case 'PDF':
                                  //                     icon = 'fa-file-pdf';
                                  //                     break;
                                  //                     case 'Word':
                                  //                     icon = 'fa-file-word';
                                  //                     break;
                                  //                     case 'Excel':
                                  //                     icon = 'fa-file-excel';
                                  //                     break;
                                  //                     case 'PowerPoint':
                                  //                     icon = 'fa-file-powerpoint';
                                  //                     break;
                                  //                     case 'Image':
                                  //                     icon = 'fa-image';
                                  //                     break;
                                  //                     case 'Video':
                                  //                     icon = 'fa-file-video';
                                  //                     break;
                                  //                     case 'Audio':
                                  //                     icon = 'fa-file-audio';
                                  //                     break;
                                  //                     default:
                                  //                     icon = 'fa-paperclip';
                                  //                 }
                                  //                 return (
                                                      
                                  //                     <div className="training-session-media-list" style={{fontSize:10,display:"inline-block"}}>
                                  //                       <center>
                                  //                         <img src={item.url} alt={item.name} />
                                  //                       </center>
                                  //                     {/* <a href={item.url} target="_blank" style={{ color: '#000' }} rel="noopener noreferrer">
                                  //                         <i className={`fa ${icon}`}></i>&nbsp;
                                  //                         {item.name}
                                  //                     </a> */}
                                  //                     </div>
                                  //                 );
                                  //                 })}
                                  //             </div>
                                  //         </div>
                                  //         </center>
                                  //     </div>
                                  //   </div>
                                  // )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row g-0">
                        <div className='col'><hr /></div>
                    </div>
                  <div className="row g-0">
                    {/* <div className="col-xl-6 d-none d-xl-block">
                        <img
                          src={images}
                          alt="Icademy"
                          className="img-fluid"
                          style={{
                            borderTopLeftRadius: '.25rem',
                            borderBottomLeftRadius: '.25rem',
                            width: '80%',
                            marginLeft: '100px',
                            marginTop:"15%",
                          }}
                        />
                      </div> */}
                    <div className="col">
                      <div className="card-body p-md-3 text-black">
                        <div className="mb-2 form-group" style={{ marginTop:-25, paddingBottom:20}}>
                          <small className="form-text" style={{color:"#333"}}>
                            <i>
                              Please fill in your information
                            </i>
                          </small>
                        </div>
                        {
                          template.input.map((input) => {
                            return (
                              <>
                                <div className="row">
                                  <div className={"col mb-4"}>
                                    {
                                      this.checkTypeInput(input, this.state.input[input.stateString], input.stateString)
                                    }
                                  </div>
                                </div>
                              </>
                            )
                          })
                        } 

                        <div className="d-flex justify-content-start pt-3">
                          <button
                            type="button"
                            className="btn btn-warning btn-lg"
                            onClick={() => this.submitForm()}
                            disabled={this.state.isSubmit}
                          >
                            {this.state.submitText}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : this.state.loading ? (
          <div className="row">
            <div className="col-sm-12">
              <div className="p-20">Loading...</div>
            </div>
          </div>
        ) : (

                !this.state.load && (
                    <div className="row">
                    <div className="col-sm-12">
                        <div className="col-xl d-xl-block" style={{justifyContent:"center"}}>
                        <center>
                            <img
                                src="newasset/Page_Not_Found_Icademy.png"
                                alt="Icademy"
                                className="img-fluid"
                                style={{
                                borderTopLeftRadius: '.25rem',
                                borderBottomLeftRadius: '.25rem',
                                width: '80%',
                                marginTop:"1%",
                                }}
                            />
                        </center>
                        </div>
                    </div>
                    </div>
                )
            
        )}
      </section>

    );
  }
}
export default registrationCustome;
