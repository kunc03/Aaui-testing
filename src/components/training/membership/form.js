import React, { Component } from "react";
import { toast } from "react-toastify";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import Moment from 'moment-timezone';

class FormMembership extends Component {
  constructor(props) {
    super(props);
    this.state = {
        companyId:'',
        image:'',
        logo:'',
        imagePreview:'assets/images/no-image.png',
        name: '',
        address: '',
        phone: '',
        fax: '',
        website: '',
        email: '',
        license_number: '',
        expired: '',
        isSaving: false,
        disabledForm: this.props.disabledForm && this.props.id
    };
    this.goBack = this.goBack.bind(this);
  }
  
  goBack() {
    if (this.props.goBack){
        this.props.goBack();
    }
    else{
        this.props.history.goBack();
    }
  }

  save = (e) =>{
    e.preventDefault();
    this.setState({isSaving: true})
    if (this.state.image){
        let formData = new FormData();
        formData.append("photo", this.state.image)
        API.put(`${API_SERVER}v2/training/membership/photo/${this.props.match.params.id}`, formData).then(res2 => {
            if (res2.data.error){
                toast.warning('Fail to upload image')
                this.setState({isSaving: false})
            }
            else{
                toast.success('Membership edited')
                this.setState({isSaving: false})
            }
        })
    }
    else{
        toast.success('Membership edited')
        this.setState({isSaving: false})
    }
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
    API.get(`${API_SERVER}v2/training/membership/read/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error read membership')
        }
        else{
            this.setState({
                name: res.data.result.name,
                address: res.data.result.address,
                phone: res.data.result.phone,
                email: res.data.result.email,
                license_number: res.data.result.license_number,
                expired: Moment.tz(res.data.result.expired, 'Asia/Jakarta').format("DD-MM-YYYY"),
                imagePreview: res.data.result.photo ? res.data.result.photo : this.state.imagePreview
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
  componentDidMount(){
    this.getUserData();
    if (this.props.disabledForm && this.props.id){
        this.getCompany(this.props.id);
    }
    else if (this.props.match.params.id){
        this.getCompany(this.props.match.params.id);
    }
  }
  render() {
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
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>{this.props.id ? 'Detail' : this.props.match.params.id ? 'Edit' : 'Create New'} Membership</strong>
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
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>Membership Information</strong>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-field-top-label">
                                                            <label for="image">Photo</label>
                                                            <label for="image" style={{cursor:'pointer', borderRadius:'10px', overflow:'hidden'}}>
                                                                <img src={this.state.imagePreview} height="54.8px" />
                                                            </label>
                                                            <input type="file" accept="image/*" name="image" id="image" onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="name">Name<required>*</required></label>
                                                            <input type="text" name="name" size="50" id="name" placeholder="PT XXX XXX" value={this.state.name} onChange={this.handleChange} disabled/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="license_number">License Number<required>*</required></label>
                                                            <input type="text" name="license_number" size="50" id="license_number" placeholder="123456" value={this.state.license_number} onChange={this.handleChange} disabled/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="expired">Expired<required>*</required></label>
                                                            <input type="text" name="expired" size="50" id="expired" placeholder="2021-02-02" value={this.state.expired} onChange={this.handleChange} disabled/>
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
                                                            <textarea name="address" rows="3" cols="60" id="address" placeholder="Jl.Pahlawan Seribu, BSD City, Tangerang, 15322" value={this.state.address} onChange={this.handleChange} disabled></textarea>
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
                                                            <label for="phone">Phone Number<required>*</required></label>
                                                            <input type="number" name="phone" id="phone" placeholder="021231231" value={this.state.phone} onChange={this.handleChange} disabled/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="email">Email<required>*</required></label>
                                                            <input type="text" size="50" name="email" id="email" placeholder="email@host.com" value={this.state.email} onChange={this.handleChange} disabled/>
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

export default FormMembership;
