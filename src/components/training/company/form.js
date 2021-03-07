import React, { Component } from "react";
import { toast } from "react-toastify";

class FormCompany extends Component {
  constructor(props) {
    super(props);
    this.state = {
        image:[],
        imagePreview:'assets/images/no-logo.jpg'
    };
    this.goBack = this.goBack.bind(this);
  }
  
  goBack() {
    if (this.props.goBack){
        this.props.goBack();
    }
    else{
        this.props.history.push('/training');
    }
  }

  save(){
    if (this.props.match.params.id){
      toast.success('Company edited')
    }
    else{
      toast.success('New company added')
    }
    this.props.history.push(`/training`)
}

  handleChange = e => {
      let {name, value} = e.target;
      if (name==='image'){
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
  componentDidMount(){
    if (this.props.disabledForm){
        var inputs = document.getElementsByTagName("input");
        for (var i = 0; i < inputs.length; i++) {
            inputs[i].disabled = true;
        }
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
                                                    <div className="col-sm-12 m-b-20">
                                                        <strong className="f-w-bold f-18" style={{color:'#000'}}>Create New Company</strong>
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
                                                            <label for="image" style={{cursor:'pointer', borderRadius:'10px', overflow:'hidden'}}>
                                                                <img src={this.state.imagePreview} height="54.8px" />
                                                            </label>
                                                            <input type="file" accept="image/*" name="image" id="image" onChange={this.handleChange}/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="name">Company Name<required>*</required></label>
                                                            <input type="text" name="name" id="name" placeholder="PT XXX XXX"/>
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
                                                            <label for="subdistrict">Sub-istrict</label>
                                                            <input type="text" name="subdistrict" id="subdistrict" placeholder="Lengkong Gudang"/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="postal">Postal Code</label>
                                                            <input type="text" name="postal" id="postal" placeholder="15327"/>
                                                        </div>
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
                                                            <input type="text" name="telephone" id="telephone" placeholder="021231231"/>
                                                        </div>
                                                        <div className="form-field-top-label">
                                                            <label for="email">Email<required>*</required></label>
                                                            <input type="text" name="email" id="email" placeholder="email@host.com"/>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="row" style={{justifyContent:'flex-end'}}>
                                                    {
                                                    !this.props.disabledForm &&
                                                    <button
                                                    onClick={this.save.bind(this)}
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

export default FormCompany;
