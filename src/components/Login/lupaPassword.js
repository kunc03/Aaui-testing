import React, { Component } from "react";
import { Redirect } from 'react-router-dom'
import {Alert, Row} from 'react-bootstrap';
import axios from 'axios';
import API, {USER_LOGIN, API_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';

import { Link } from "react-router-dom";


class ForgotPassword extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    email: '',
    password: '',
    toggle_alert: false,
    isVoucher: false,
    voucher: '',
    alertMessage : '',
    tabIndex : 1,
    showPass : false,
    showResendPass : false,
    email: "",
};

    onChange(state, e) {
        const stateCopy = this.state;
        stateCopy[state] = e.target.value;
        this.setState(stateCopy);
    }

  kirimEMail = e => {
    console.log('kirim'); 
    this.setState({showResendPass : true});

    API.get(`${API_SERVER}v1/user/forgot-password/${this.state.email}`).then((res) => {
        if (res.status === 200 && !res.data.error) {
            alert(res.data.result.message);
            this.props.history.push(`/OTP/${res.data.result.id}`)
        } else {
            alert(res.data.result)
        }
    });
  }

  lupaPassword(){
    this.setState({showResendPass : false})
  }

  render() {
    const { toggle_alert, isVoucher,showResendPass } = this.state;
    return (
      <div style={{background:"#fff", margin: 0}}>
  
            <div className={showResendPass ? 'row' : 'hidden'}> 
                <div className="col-sm-12">
                    <img
                        src="newasset/resend.svg"
                        style={{ paddingTop: 18 }}
                        alt=""
                        />
                </div>
                <div className="col-sm-12">
                    <p className="fs-24"><b style={{color: '#00478C'}}>Kami telah mengirimkan Link ke email Anda</b></p>
                    <p className="fs-16"><b>Silahkan periksa email Anda untuk proses selanjutnya</b></p>
                </div>
                <div className="col-sm-12">
                    <p className="mt-5">
                        <a style={{cursor: 'pointer', color: '#00478C'}} onClick={this.lupaPassword.bind(this)}>Resend</a>
                    </p>
                </div>
            </div>

            <div className={showResendPass ? 'hidden' : 'row'}>
                <div className="col-sm-3"></div>
                <img
                    src="newasset/back.svg"
                    style={{ paddingTop: 18 }}
                    alt=""
                />
                <div className="col-sm-12 mb-3"><b style={{float: 'left' , color: '#00478C'}}>Silahkan Masukan Email Anda</b></div>
                <div className="col-sm-12">
                    <b style={{float: 'left' , color: 'black'}}>Email</b>
                    <div className="input-group">
                        <input
                        type="text"
                        className="form-control"
                        style={{marginTop:8}}
                        placeholder="Masukan Email Anda"
                        onChange={this.onChange.bind(this, "email")}
                        required
                        />
                    </div>
                    <button className="btn btn-ideku col-12 shadow-2 mt-5 b-r-3 f-16" style={{height:60}} onClick={this.kirimEMail.bind(this)}>
                        Kirim
                    </button>
                </div>
            </div>
        
        
      </div>
    );
  }
}

export default ForgotPassword;
