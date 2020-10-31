import React, { Component } from "react";
import API, {API_SERVER} from '../../repository/api';


class ForgotPassword extends Component {
//   constructor(props) {
//     super(props);
//   }

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
    showNewPass : false,
    showResetSuccess : false,
    showResetFailed : false,
    loading: false,
    idUser: null,
    otp: '',
    minutes: 5,
    seconds: 0,
    newPass: '',
    newPass2: '',
    enableResend: false,
    alert: '',
    success: '',
};


toMMSS = (duration) => {
    var seconds = parseInt((duration / 1000) % 60),
        minutes = parseInt((duration / (1000 * 60)) % 60),
        hours = parseInt((duration / (1000 * 60 * 60)) % 24);

    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    seconds = seconds < 10 ? "0" + seconds : seconds;

    return minutes + ":" + seconds;
};

    onChange(state, e) {
        const stateCopy = this.state;
        stateCopy[state] = e.target.value;
        this.setState(stateCopy);
    }

  kirimEMail = e => {
    this.setState({loading:true})

    API.get(`${API_SERVER}v1/user/forgot-password/${this.state.email}`).then((res) => {
        if (res.status === 200 && !res.data.error) {
            this.setState({showResendPass : true, idUser:res.data.result.id});
            this.clearAlert()
            // this.props.history.push(`/OTP/${res.data.result.id}`)
        } else {
            this.setState({alert: res.data.result})
        }
        this.setState({loading:false})
    });
  }

  lupaPassword(){
    this.setState({showResendPass : false})
  }

  componentDidMount() {
    this.timer = setInterval(() => {
      const { seconds, minutes } = this.state
      if (seconds > 0) {
        this.setState(({ seconds }) => ({
          seconds: seconds - 1
        }))
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(this.timer)
          this.setState({enableResend: true})
        } else {
          this.setState(({ minutes }) => ({
            minutes: minutes - 1,
            seconds: 59
          }))
        }
      }
    }, 1000)
    if (this.props.id && this.props.otp){
        this.setState({
            idUser: this.props.id,
            otp: this.props.otp,
            showNewPass: true
        })
    }
  }
  
  submitResetPass = e =>{
      if (this.state.newPass === '' || this.state.newPass2 === ''){
        this.setState({alert: 'Password tidak boleh kosong'})
      }
      else{
        if (this.state.newPass !== this.state.newPass2){
          this.setState({alert: 'Konfirmasi password yang anda masukkan berbeda'})
        }
        else{
            API.get(
                `${API_SERVER}v1/user/reset-password/${this.state.idUser}/${this.state.otp}/${this.state.newPass}/${this.state.newPass2}/${new Date().getTime()}`
            ).then((res) => {
                if (res.status === 200) {
                    if (res.data.error){
                        this.setState({alert: res.data.result, showNewPass: false, showResetFailed: true})
                    }
                    else{
                        this.setState({success: res.data.result, showNewPass: false, showResetSuccess: true})
                    }
                }
            });
        }
      }
  }

  clearAlert(){
      this.setState({
          alert:'',
          success:''
      })
  }

  saveOTP = e => {
    if (this.state.otp === ''){
        this.setState({alert: 'Kode OTP tidak boleh kosong'})
    }
    else{
        this.setState({showNewPass: true, showResendPass: false})
        this.clearAlert()
    }
  }

  render() {
    const { showResendPass, showNewPass, showResetSuccess, showResetFailed } = this.state;
    const { minutes, seconds } = this.state
    return (
      <div style={{background:"#fff", margin: 0}}>
  
            <div className={showResendPass ? 'row' : 'hidden'}> 
                <div className="col-sm-12">
                    <img
                        src="newasset/resend.svg"
                        alt=""
                        />
                </div>
                <div className="col-sm-12">
                    <p className="fs-24"><b style={{color: '#00478C'}}>Kami telah mengirimkan Link dan kode OTP ke email Anda</b></p>
                    <p className="fs-16"><b>Silahkan periksa email Anda untuk proses selanjutnya</b></p>
                </div>
                <div className="col-sm-12">
                    {
                        this.state.alert == ''
                        ? null
                        : <div style={{color:'#F00', marginBottom:20}}>{this.state.alert}</div>
                    }
                    {
                        this.state.success == ''
                        ? null
                        : <div style={{color:'#049404', marginBottom:20}}>{this.state.success}</div>
                    }
                    <div style={{padding:'0px 20px'}}>
                    <b style={{float: 'left' , color: 'black'}}>Kode OTP</b>
                    <div className="input-group mb-4 mt-5">
                        <input
                        type="text"
                        value={this.state.otp}
                        className="form-control"
                        style={{marginTop:8}}
                        placeholder="Masukan kode OTP yang dikirim ke email anda"
                        onChange={this.onChange.bind(this, "otp")}
                        required
                        />
                    </div>
                    <div className="col-sm-12">
                        <p className="mt-5">
                            {
                                this.state.enableResend
                                ? <a style={{cursor: 'pointer', color: '#00478C'}} onClick={this.lupaPassword.bind(this)}>Kirim Ulang Kode OTP</a>
                                : <a style={{cursor: 'context-menu', color: '#888'}}>Kirim Ulang Kode OTP ( { minutes }:{ seconds < 10 ? `0${ seconds }` : seconds } )</a>
                            }
                        </p>
                    </div>
                    <button onClick={this.saveOTP.bind(this)} className="btn btn-ideku col-12 shadow-2 b-r-3 f-16" style={{height:60}}>
                        Lanjut
                    </button>
                    </div>
                </div>
            </div>

            <div className={showResendPass || showNewPass || showResetSuccess || showResetFailed ? 'hidden' : 'row'} style={{padding:'0px 20px'}}>
                <div className="col-sm-3"></div>
                <img
                    src="newasset/back.svg"
                    style={{ paddingTop: 18 }}
                    alt=""
                />
                <div className="col-sm-12 mb-3"><b style={{float: 'left' , color: '#00478C'}}>Silahkan Masukan Email Anda</b></div>
                <div className="col-sm-12">
                    {
                        this.state.alert == ''
                        ? null
                        : <div style={{color:'#F00', marginBottom:20}}>{this.state.alert}</div>
                    }
                    {
                        this.state.success == ''
                        ? null
                        : <div style={{color:'#049404', marginBottom:20}}>{this.state.success}</div>
                    }
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
                    <button disabled={this.state.loading} className="btn btn-ideku col-12 shadow-2 mt-5 b-r-3 f-16" style={{height:60}} onClick={this.kirimEMail.bind(this)}>
                        Kirim
                    </button>
                </div>
            </div>
        
            <div className={showNewPass ? 'row' : 'hidden'} style={{padding:'0px 20px'}}>
                <div className="col-sm-3"></div>
                <div className="col-sm-12 f-18 mb-3"><b style={{float: 'left' , color: '#00478C', marginTop:30}}>Silahkan buat password baru Anda</b></div>
                <div className="col-sm-12">
                    {
                        this.state.alert == ''
                        ? null
                        : <div style={{color:'#F00', marginBottom:20}}>{this.state.alert}</div>
                    }
                    {
                        this.state.success == ''
                        ? null
                        : <div style={{color:'#049404', marginBottom:20}}>{this.state.success}</div>
                    }
                    <b style={{float: 'left' , color: 'black'}}>Password Baru</b>
                    <div className="input-group">
                        <input
                        type="password"
                        className="form-control"
                        style={{marginTop:8}}
                        placeholder="Masukkan password baru Anda"
                        onChange={this.onChange.bind(this, "newPass")}
                        required
                        />
                    </div>
                    <b style={{float: 'left' , color: 'black', marginTop:20}}>Ulangi Password Baru</b>
                    <div className="input-group">
                        <input
                        type="password"
                        className="form-control"
                        style={{marginTop:8}}
                        placeholder="Masukkan kembali password baru Anda"
                        onChange={this.onChange.bind(this, "newPass2")}
                        required
                        />
                    </div>
                    <button disabled={this.state.loading} className="btn btn-ideku col-12 shadow-2 mt-5 b-r-3 f-16" style={{height:60}} onClick={this.submitResetPass.bind(this)}>
                        Perbarui Password
                    </button>
                </div>
            </div>
        
        
            <div className={showResetSuccess ? 'row' : 'hidden'} style={{padding:'0px 20px'}}>
                <div className="col-sm-3"></div>
                <div className="col-sm-12" style={{marginTop:30}}>
                    <p className="fs-24"><b style={{color: '#00478C'}}>Password berhasil diperbarui, silahkan kembali ke halaman login dan masuk dengan password baru Anda.</b></p>
                </div>
            </div>
            <div className={showResetFailed ? 'row' : 'hidden'} style={{padding:'0px 20px'}}>
                <div className="col-sm-3"></div>
                <div className="col-sm-12" style={{marginTop:30}}>
                    <p className="fs-24"><b style={{color: '#d02c2c'}}>Gagal memperbarui password, silahkan setel ulang password kembali dan pastikan Anda memasukkan kode OTP yang dikirim ke email Anda.</b></p>
                </div>
            </div>
      </div>
    );
  }
}

export default ForgotPassword;
