import React, { Component } from "react";
import { toast } from "react-toastify";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';

class FormUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
        image:'',
        imagePreview:'assets/images/no-profile-picture.jpg',
        training_company_id:'',
        name:'',
        born_place:'',
        born_date:'',
        gender:'',
        identity:'',
        tin:'',
        address:'',
        city:'',
        phone:'',
        email:'',
        level: '',
        license_number: '',
        optionCompany:[],
        companyId:'',
        disabledForm: this.props.disabledForm && this.props.id
    };
    this.goBack = this.goBack.bind(this);
  }
  
  goBack() {
    if (this.props.goBack){
        this.props.goBack();
    }
    else{
        this.props.history.push('/training/user');
    }
  }

  save = (e) => {
    e.preventDefault();
    if (!this.state.name || !this.state.born_date || !this.state.gender || !this.state.address || !this.state.city || !this.state.phone || !this.state.email || !this.state.training_company_id){
        toast.warning('Some field is required, please check your data.')
    }
    else{
        if (this.props.match.params.id){
          let form = {
            image: this.state.image,
              training_company_id: this.state.training_company_id,
              name: this.state.name,
              born_place: this.state.born_place,
              born_date: this.state.born_date,
              gender: this.state.gender,
              identity: this.state.identity,
              tin: this.state.tin,
              license_number: this.state.license_number,
              address: this.state.address,
              city: this.state.city,
              phone: this.state.phone,
              email: this.state.email,
              created_by: Storage.get('user').data.user_id
          }
          API.put(`${API_SERVER}v2/training/user/${this.props.match.params.id}`, form).then(res => {
              if (res.data.error){
                  toast.error(`Error edit ${this.state.level} : ${res.data.result}`)
              }
              else{
                if (this.state.image){
                    let formData = new FormData();
                    formData.append("image", this.state.image)
                    API.put(`${API_SERVER}v2/training/user/image/${this.props.match.params.id}`, formData).then(res2 => {
                        if (res2.data.error){
                            toast.warning(`${this.state.level} edited but fail to upload image`)
                        }
                        else{
                            toast.success(`${this.state.level} edited`)
                            this.props.history.push(`/training/user/detail/${this.props.match.params.id}`)
                        }
                    })
                }
                else{
                    toast.success(`${this.state.level} edited`)
                    this.props.history.push(`/training/user/detail/${this.props.match.params.id}`)
                }
              }
          })
        }
        else{
          let form = {
              training_company_id: this.state.training_company_id,
              image: this.state.image,
              name: this.state.name,
              born_place: this.state.born_place,
              born_date: this.state.born_date,
              gender: this.state.gender,
              identity: this.state.identity,
              tin: this.state.tin,
              license_number: this.state.license_number,
              address: this.state.address,
              city: this.state.city,
              phone: this.state.phone,
              email: this.state.email,
              level: this.props.match.params.level,
              created_by: Storage.get('user').data.user_id
          }
          API.post(`${API_SERVER}v2/training/user`, form).then(res => {
              if (res.data.error){
                  toast.error(`Error create ${this.state.level} : ${res.data.result}`)
              }
              else{
                if (this.state.image){
                    let formData = new FormData();
                    formData.append("image", this.state.image)
                    API.put(`${API_SERVER}v2/training/user/image/${res.data.result.insertId}`, formData).then(res2 => {
                        if (res2.data.error){
                            toast.warning(`${this.state.level} created but fail to upload image`)
                            this.props.history.push(`/training/user`)
                        }
                        else{
                            toast.success(`New ${this.state.level} added`)
                            this.props.history.push(`/training/user`)
                        }
                    })
                }
                else{
                    toast.success(`New ${this.state.level} added`)
                    this.props.history.push(`/training/user`)
                }
              }
          })
        }
    }
  }

  handleChange = e => {
      let {name, value} = e.target;
      if (name==='image'){
        if (e.target.files.length){
            if (e.target.files[0].size <= 5000000) {
              this.setState({
                image: e.target.files[0],
                imagePreview: URL.createObjectURL(e.target.files[0])
              });
            } else {
              e.target.value = null;
              toast.warning('Image size cannot larger than 5MB')
            }
        }
      }
      else{
          this.setState({[name]: value})
      }
  }

  getUser(id){
    API.get(`${API_SERVER}v2/training/user/read/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error read user')
        }
        else{
            this.setState({
                training_company_id: res.data.result.training_company_id,
                name: res.data.result.name,
                born_place: res.data.result.born_place,
                born_date: res.data.result.born_date,
                gender: res.data.result.gender,
                identity: res.data.result.identity,
                tin: res.data.result.tin,
                license_number: res.data.result.license_number,
                address: res.data.result.address,
                city: res.data.result.city,
                phone: res.data.result.phone,
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
          this.getCompany(this.state.companyId)
        }
    })
  }

  getCompany(id){
    API.get(`${API_SERVER}v2/training/company/${id}`).then(res => {
        if (res.data.error){
            toast.error('Error read company')
        }
        else{
            this.setState({optionCompany: res.data.result})
        }
    })
  }

  componentDidMount(){
    this.getUserData()
    if (this.props.disabledForm && this.props.id){
        this.getUser(this.props.id);
    }
    else if (this.props.match.params.id){
        this.getUser(this.props.match.params.id);
    }
    this.setState({
        level: this.props.match.params.level ? this.props.match.params.level : 'user',
        training_company_id: this.props.match.params.company !== '0' ? this.props.match.params.company : ''
    })
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
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>{this.props.id ? 'Detail' : this.props.match.params.id ? 'Edit' : 'Create New'} {this.state.level === 'admin' ? 'Admin' : 'User'}</strong>
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
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>Company</strong>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-field-top-label">
                                                            <label for="training_company_id">Company Name<required>*</required></label>
                                                            <select name="training_company_id" value={this.state.training_company_id} id="training_company_id" onChange={this.handleChange} disabled={this.state.disabledForm}>
                                                                <option value="">Select Company</option>
                                                                {
                                                                    this.state.optionCompany.map(item=>
                                                                        <option value={item.id} selected={this.state.training_company_id===item.id}>{item.name}</option>
                                                                    )
                                                                }
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-section">
                                                    <div className="row">
                                                        <div className="col-sm-12 m-b-20">
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>Personal Information</strong>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-field-top-label">
                                                            <label for="image">Profile Picture</label>
                                                            <label for="image" style={{cursor:'pointer', borderRadius:'50px', overflow:'hidden'}}>
                                                                <img src={this.state.imagePreview} style={{objectFit:'cover', width: '54.8px', height: '54.8px'}} />
                                                            </label>
                                                            <input type="file" accept="image/*" name="image" id="image" onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="name">Name<required>*</required></label>
                                                            <input type="text" name="name" id="name" placeholder="XXXX XXXX" value={this.state.name} onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="born_place">Born Place</label>
                                                            <input type="text" name="born_place" id="born_place" placeholder="Jakarta" value={this.state.born_place} onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="born_date">Born Date<required>*</required></label>
                                                            <input type="date" name="born_date" id="born_date" value={this.state.born_date} onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="gender">Gender<required>*</required></label>
                                                            <select name="gender" id="gender" onChange={this.handleChange} disabled={this.state.disabledForm}>
                                                                <option value="">Select Gender</option>
                                                                <option value="Male" selected={this.state.gender==='Male'}>Male</option>
                                                                <option value="Female" selected={this.state.gender==='Female'}>Female</option>
                                                            </select>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="form-section">
                                                    <div className="row">
                                                        <div className="col-sm-12 m-b-20">
                                                            <strong className="f-w-bold" style={{color:'#000', fontSize:'15px'}}>Identification</strong>
                                                        </div>
                                                    </div>
                                                    <div className="row">
                                                        <div className="form-field-top-label">
                                                            <label for="identity">Identity Card Number<required>*</required></label>
                                                            <input type="text" name="identity" id="identity" placeholder="1234567890" value={this.state.identity} onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="tin">Tax Identification Number</label>
                                                            <input type="text" name="tin" id="tin" placeholder="1234567890" value={this.state.tin} onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="license_number">License Number</label>
                                                            <input type="text" name="license_number" id="license_number" placeholder="1234567890" value={this.state.license_number} onChange={this.handleChange} disabled={this.state.disabledForm}/>
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
                                                            <textarea name="address" rows="3" cols="60" id="address" placeholder="Jl.Pahlawan Seribu, BSD City, Tangerang, 15322" value={this.state.address} onChange={this.handleChange} disabled={this.state.disabledForm}></textarea>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="city">City<required>*</required></label>
                                                            <input type="text" name="city" id="city" placeholder="Jakarta" value={this.state.city} onChange={this.handleChange} disabled={this.state.disabledForm}/>
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
                                                            <input type="number" name="phone" id="phone" placeholder="081234567890" value={this.state.phone} onChange={this.handleChange} disabled={this.state.disabledForm}/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="email">Email<required>*</required></label>
                                                            <input type="text" size="50" name="email" id="email" placeholder="email@host.com" value={this.state.email} onChange={this.handleChange} disabled={this.state.disabledForm || this.props.match.params.id}/>
                                                            <label for="phone" style={{marginTop:10}}>By default the password is the same as email<required>*</required></label>
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

export default FormUser;
