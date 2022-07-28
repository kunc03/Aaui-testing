import React, { Component } from "react";
import { toast } from "react-toastify";
import API, { API_SERVER,APPS_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { Modal } from 'react-bootstrap';
import ToggleSwitch from 'react-switch';
import { CopyToClipboard } from 'react-copy-to-clipboard';

class FormCompany extends Component {
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
        disabledForm: this.props.disabledForm,
        isSaving: false,
        modalRegist: false,
        registEnable: false,
        urlRegist: `${APPS_SERVER}training/registration/${this.props.id}`,
    };
    this.goBack = this.goBack.bind(this);
  }
  
  goBack() {
    if (this.props.goBack){
        this.props.goBack();
    }
    else{
        this.props.history.push('/training/company');
    }
  }

  save = (e) =>{
    this.setState({isSaving: true});
    e.preventDefault();
    if (!this.state.name || !this.state.address || !this.state.telephone || !this.state.email){
        toast.warning('Some field is required, please check your data.')
        this.setState({isSaving: false});
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
                    this.setState({isSaving: false});
                }
                else{
                    if (this.state.image){
                        let formData = new FormData();
                        formData.append("image", this.state.image)
                        API.put(`${API_SERVER}v2/training/company/image/${this.props.match.params.id}`, formData).then(res2 => {
                            if (res2.data.error){
                                toast.warning('Company edited but fail to upload image')
                                this.setState({isSaving: false});
                            }
                            else{
                                toast.success('Company edited')
                                this.setState({isSaving: false});
                                this.props.history.push(`/training/company/detail/${this.props.match.params.id}`)
                            }
                        })
                    }
                    else{
                        toast.success('Company edited')
                        this.setState({isSaving: false});
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
                    this.setState({isSaving: false});
                }
                else{
                    if (this.state.image){
                        let formData = new FormData();
                        formData.append("image", this.state.image)
                        API.put(`${API_SERVER}v2/training/company/image/${res.data.result.insertId}`, formData).then(res2 => {
                            if (res2.data.error){
                                toast.warning('Company created but fail to upload image')
                                this.setState({isSaving: false});
                            }
                            else{
                                toast.success('New company added')
                                this.setState({isSaving: false});
                                this.props.history.push(`/training/company/detail/${res.data.result.insertId}`)
                            }
                        })
                    }
                    else{
                        toast.success('New company added')
                        this.setState({isSaving: false});
                        this.props.history.push(`/training/company/detail/${res.data.result.insertId}`)
                    }
                }
            })
        }
    }
}

  closeModalRegist = (e) => {
    this.setState({ modalRegist: false });
  };

  ToggleSwitch(checked) {
    this.setState({ registEnable: !this.state.registEnable }, () => {
      let form = {
        enable_registration: this.state.registEnable ? 1 : 0,
      };
      API.put(`${API_SERVER}v2/training/company/enable-registration/${this.props.id}`, form).then((res) => {
        if (res.data.error) {
          toast.error('Error update registration');
        } else {
          toast.info(`Public Registration Form ${this.state.registEnable ? 'Enabled' : 'Disabled'}`);
        }
      });
    });
  }

  handleChange = e => {
      let {name, value} = e.target;
      if (name==='image'){
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
          if (this.props.disabledForm && this.props.id){
              this.getCompany(this.props.id);
          }
          else if (this.props.match.params.id){
              this.getCompany(this.props.match.params.id);
          }
        }
    })
  }
  componentDidMount(){
    this.getUserData();
  }
  render() {
    return(
        <div className="pcoded-main-container">
            <div className="pcoded-wrapper">
                <div className="pcoded-content">
                    <div className="pcoded-inner-content">
                        <div className="main-body">
                            <div className="page-wrapper">
                                {
                                    !this.props.lockEdit &&
                                    <div className="floating-back">
                                        <img
                                        src={`newasset/back-button.svg`}
                                        alt=""
                                        width={90}
                                        onClick={this.goBack}
                                        ></img>
                                    </div>
                                }
                                <div className="row">
                                    <div className="col-xl-12">
                                        <div>
                                            <div className="card p-20">
                                                <div className="row">
                                                    <div className="col-sm-10 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>{this.props.id ? 'Detail' : this.props.match.params.id ? 'Edit' : 'Create New'} Company</strong>
                                                    </div>
                                                    <div className="col-sm-2 m-b-20">
                                                        {
                                                        this.state.disabledForm && !this.props.lockEdit &&
                                                        <button
                                                        onClick={this.props.goEdit}
                                                        className="btn btn-icademy-primary float-right"
                                                        style={{ padding: "7px 8px !important", marginRight: 30 }}>
                                                            <i className="fa fa-edit"></i>
                                                            Edit
                                                        </button>
                                                        }
                                                        {this.state.disabledForm && !this.props.lockEdit && (
                                                            <button
                                                            onClick={() => this.setState({ modalRegist: true })}
                                                            className="btn btn-icademy-primary float-right"
                                                            style={{ padding: '7px 8px !important', marginRight: 30 }}
                                                            >
                                                            <i className="fa fa-list"></i>
                                                            Public Registration Form
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="form-section">
                                                    <div className="row">
                                                        <div className="col-sm-12 m-b-20">
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>Company Information</strong>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-field-top-label">
                                                            <label for="image">Company Logo</label>
                                                            <center>
                                                                <label style={{cursor:'pointer', borderRadius:'10px', overflow:'hidden'}}>
                                                                    <a href={this.state.imagePreview} target="_blank">
                                                                        <img src={this.state.imagePreview} height="54.8px" />
                                                                    </a>
                                                                </label>
                                                                <label for='image' style={{cursor:'pointer', overflow:'hidden', display: this.state.disabledForm ? 'none' : 'block'}}>
                                                                    <div className="button-bordered-grey">
                                                                        {this.state.image ? this.state.image.name : 'Choose file'}
                                                                    </div>
                                                                </label>
                                                            </center>
                                                            <input type="file" accept="image/*" name="image" id="image" onChange={this.handleChange} disabled={this.state.disabledForm} onClick={e=> e.target.value = null}/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="name">Company Name<required>*</required></label>
                                                            <input type="text" name="name" size="50" id="name" placeholder={!this.state.disabledForm && "PT XXX XXX"} value={this.state.name} onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-section">
                                                    <div className="row">
                                                        <div className="col-sm-12 m-b-20">
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>Address</strong>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-field-top-label">
                                                            <label for="address">Address<required>*</required></label>
                                                            <textarea name="address" rows="3" cols="60" id="address" placeholder={!this.state.disabledForm && "Jl.Pahlawan Seribu, BSD City, Tangerang, 15322"} value={this.state.address} onChange={this.handleChange} disabled={this.state.disabledForm}></textarea>
                                                        </div>
                                                        {/* <div className="form-field-top-label">
                                                            <label for="street">Street<required>*</required></label>
                                                            <input type="text" name="street" id="street" placeholder="Jl. Pahlawan Seribu"/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="province">Province<required>*</required></label>
                                                            <input type="text" name="province" id="province" placeholder="Banten"/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="city">City<required>*</required></label>
                                                            <input type="text" name="city" id="city" placeholder="Tangerang"/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="district">District</label>
                                                            <input type="text" name="district" id="district" placeholder="Serpong"/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="subdistrict">Sub-district</label>
                                                            <input type="text" name="subdistrict" id="subdistrict" placeholder="Lengkong Gudang"/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="postal">Postal Code</label>
                                                            <input type="text" name="postal" id="postal" placeholder="15327"/>
                                                        </div> */}
                                                    </div>
                                                </div>
                                                <div className="form-section no-border">
                                                    <div className="row">
                                                        <div className="col-sm-12 m-b-20">
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>Contact</strong>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-field-top-label">
                                                            <label for="telephone">Telephone Number<required>*</required></label>
                                                            <input type="number" name="telephone" id="telephone" placeholder={!this.state.disabledForm && "021231231"} value={this.state.telephone} onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="fax">Fax Number</label>
                                                            <input type="number" name="fax" id="fax" placeholder={!this.state.disabledForm && "021231231"} value={this.state.fax} onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="website">Website</label>
                                                            <input type="text" name="website" id="website" placeholder={!this.state.disabledForm && "domain.com"} value={this.state.website} onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="email">Email<required>*</required></label>
                                                            <input type="text" size="50" name="email" id="email" placeholder={!this.state.disabledForm && "email@host.com"} value={this.state.email} onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row" style={{justifyContent:'flex-end'}}>
                                                    {
                                                    !this.state.disabledForm &&
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
            <Modal show={this.state.modalRegist} onHide={this.closeModalRegist} centered>
            <Modal.Header closeButton>
                <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                Public Registration Form
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="form-field-top-label">
                <label for="amount">Enable</label>
                <ToggleSwitch
                    className="form-toggle-switch"
                    name="registEnable"
                    onChange={this.ToggleSwitch.bind(this)}
                    checked={this.state.registEnable}
                />
                </div>
                {this.state.registEnable ? (
                <div className="form-field-top-label" style={{ width: '100%' }}>
                    <label for="note">URL</label>
                    <input
                    type="text"
                    name="urlRegist"
                    style={{ width: '80%' }}
                    id="urlRegist"
                    value={this.state.urlRegist}
                    />
                </div>
                ) : null}
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btm-icademy-primary btn-icademy-grey" onClick={this.closeModalRegist.bind(this)}>
                Close
                </button>
                {
                    this.state.registEnable && (
                        <CopyToClipboard
                        text={this.state.urlRegist}
                        onCopy={() => {
                            toast.info('Copied to clipboard');
                        }}
                        >
                        <button className="btn btn-icademy-primary">Copy URL To Clipboard</button>
                        </CopyToClipboard>
                    )
                }
            </Modal.Footer>
            </Modal>
        </div>
    )
  }
}

export default FormCompany;
