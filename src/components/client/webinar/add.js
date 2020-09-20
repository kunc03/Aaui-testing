import React, { Component } from 'react';
import { Modal, Card, InputGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Moment from 'moment-timezone';

import API, { API_SERVER, USER_ME, APPS_SERVER } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { toast } from "react-toastify";

import { MultiSelect } from 'react-sm-select';
import TableFiles from '../../Home_new/detail_project/files';
import TableMeetings from '../../Home_new/detail_project/meeting';
import WebinarKuesionerAdd from './kuesioneradd';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class WebinarAdd extends Component {

	state = {
    webinarId: this.props.match.params.webinarId,
    isSending: false,
    role:[],
    access_project_admin: false,

    pembicara: [
      {nama: 'John Mayers', email: 'ardiansyah3ber@gmail.com', telepon: '082334093822', status: false, checked: false},
      {nama: 'Marco Elive', email: 'marco.elive@gmail.com', telepon: '087757386772', status: false, checked: false},
      {nama: 'Smity Jensen', email: 'smity.jensen@gmail.com', telepon: '089123876345', status: true, checked: false},
    ],
    optionsName: [],

    // form webinar
    id: '',
    gambar: '',
    judul: '',
    isi: '',
    tanggal: '',
    jamMulai: '',
    jamSelesai: '',
    projectId: '',
    dokumenId: '',
    peserta: [],
    kirimEmailPeserta: [],
    kirimEmailTamu: [],

    // form peserta
    userId: [],

    // form tamu
    nama: '',
    email: '',
    telepon: '',
    tamu: [],

    allChecked: false,
    allCheckedTamu: false,
    isModalPembicara: false,
    isModalPeserta: false,

    //kuesioner
    modalKuesioner: false,
  }

  addTamu = e => {
    e.preventDefault();
    if(!this.state.nama && !this.state.email && !this.state.telepon) {
      toast.warning("Semua kolom harus terisi. (nama, email, & telepon).")
    } else {
      let form = {
        nama: this.state.nama,
        email: this.state.email,
        telepon: this.state.telepon,
        status: false,
        checked: false
      };
      this.setState({ tamu: [...this.state.tamu, form], nama: '', email: '', telepon: ''});
    }

  }

  deleteTamu (id) {
    // let cpTamu = [...this.state.tamu];
    // let filter = cpTamu.filter((item) => item.email != e.target.getAttribute('data-email'));
    // this.setState({ tamu: filter });
    
    API.delete(`${API_SERVER}v2/webinar/tamu/${id}`).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          toast.error('Gagal menghapus tamu')
        } else {
          toast.success(`Berhasil menghapus tamu`)
          this.fetchData();
        }
      }
    })
  }

  handleModal = () => {
    this.setState({
      isModalPembicara: false,
      isModalPeserta: false,
      modalKuesioner: false,
    });
  }

  handleAllCheck = e => {
    e.preventDefault();
    let pem = this.state.peserta;
    pem.forEach(item => item.checked = e.target.checked);
    this.setState({ peserta: pem, allChecked: e.target.checked });
  }

  handleOneCheck = e => {
    let pem = this.state.peserta;
    pem.forEach(item => { if (item.email === e.target.value) item.checked = e.target.checked });
    this.setState({ peserta: pem }); 
  }
  handleAllCheckTamu = e => {
    e.preventDefault();
    let pem = this.state.tamu;
    pem.forEach(item => item.checked = e.target.checked);
    this.setState({ tamu: pem, allCheckedTamu: e.target.checked });
  }

  handleOneCheckTamu = e => {
    let pem = this.state.tamu;
    pem.forEach(item => { if (item.email === e.target.value) item.checked = e.target.checked });
    this.setState({ tamu: pem }); 
  }

  kirimEmail () {
    this.setState({kirimEmailPeserta: [], kirimEmailTamu: [], isSending: true})
    this.state.peserta.map(item=>{
      if (item.checked){
        this.state.kirimEmailPeserta.push(item.id)
      }
    })
    this.state.tamu.map(item=>{
      if (item.checked){
        this.state.kirimEmailTamu.push(item.id)
      }
    })
    let form = {
      id: this.state.webinarId,
      pengguna: this.state.kirimEmailPeserta,
      tamu: this.state.kirimEmailTamu
    };
    
    API.post(`${API_SERVER}v2/webinar/send_email`, form).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          toast.error('Error sending email')
          this.setState({isSending: false})
        } else {
          toast.success(`Berhasil mengirim email undangan`)
          this.setState({isSending: false})
          this.fetchData();
        }
      }
    })
  }

  checkProjectAccess(projectId){
    API.get(`${API_SERVER}v1/project-access/${projectId}/${Storage.get('user').data.user_id}`).then(res => {
      if (res.status === 200) {
        let levelUser = Storage.get('user').data.level;
        if ((levelUser == 'client' && res.data.result == 'Project Admin') || levelUser != 'client' ){
          this.setState({
            access_project_admin: true,
          })
        }
        else{
          this.setState({
            access_project_admin: false,
          })
        }
      }
    })
  }
  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    let userId = Storage.get('user').data.user_id
    API.get(`${API_SERVER}v2/webinar/one/${this.state.webinarId}`).then(res => {
      if(res.data.error) toast.warning("Gagal fetch API");
      const tanggal = res.data.result.tanggal ? new Date(res.data.result.tanggal) : '';
      const jam_mulai = res.data.result.jam_mulai ? new Date('2020-09-19 ' + res.data.result.jam_mulai) : ''
      const jam_selesai = res.data.result.jam_selesai ? new Date('2020-09-19 ' + res.data.result.jam_selesai) : ''
      this.setState({
        id: this.state.webinarId,
        gambar: res.data.result.gambar,
        judul: res.data.result.judul,
        isi: res.data.result.isi,
        tanggal: tanggal,
        jamMulai: jam_mulai,
        jamSelesai: jam_selesai,
        projectId: res.data.result.projectId,
        dokumenId: res.data.result.dokumenId,
        pembicara: res.data.result.pembicara.name,
        sekretarisId: res.data.result.sekretaris.user_id,
        peserta: res.data.result.peserta,
        tamu: res.data.result.tamu,
        status: res.data.result.status
      })
      this.checkProjectAccess(this.state.projectId)
    })

    console.log(`${API_SERVER}v1/user/company/${Storage.get('user').data.company_id}`);
    API.get(`${API_SERVER}v1/user/company/${Storage.get('user').data.company_id}`).then(response => {
      response.data.result.map(item => {
        this.state.optionsName.push({
          value: item.user_id, 
          label: `${item.name} - ${item.email} - ${item.phone}`
        });
      });
    })
  }

  updateWebinar = e => {
    e.preventDefault();
    
    let dd = new Date(this.state.tanggal);
    let tanggal = dd.getFullYear()+'-'+('0' + (dd.getMonth()+1)).slice(-2)+'-'+('0' + dd.getDate()).slice(-2);
    
    let jamMl = new Date(this.state.jamMulai);
    let jamMulai = ('0' + jamMl.getHours()).slice(-2)+':'+('0' + jamMl.getMinutes()).slice(-2);
    
    let jamSl = new Date(this.state.jamSelesai);
    let jamSelesai = ('0' + jamSl.getHours()).slice(-2)+':'+('0' + jamSl.getMinutes()).slice(-2);
    
    let form = {
      id: this.state.webinarId,
      judul: this.state.judul,
      isi: this.state.isi,
      tanggal: tanggal,
      jam_mulai: jamMulai,
      jam_selesai: jamSelesai,
      status: this.state.status
      // pesertanya: this.state.pesertanya
    };
    API.put(`${API_SERVER}v2/webinar/detail`, form).then(async res => {
      if(res.data.error) 
        toast.warning("Error fetch API")
      else
        if (this.state.gambar) {
          let formData = new FormData();
          formData.append('gambar', this.state.gambar);
          await API.put(`${API_SERVER}v2/webinar/cover/${form.id}`, formData);
        }
        toast.success("Mengubah informasi webinar")
        this.props.history.goBack();
    })

    console.log(form);
  }

  backButton(){
    this.props.history.goBack();
  }

  addPeserta = e => {
    e.preventDefault();
    const formData = {
      webinarId: this.state.webinarId,
      userId: this.state.userId.toString(),
    };
    formData.userId ?
    API.post(`${API_SERVER}v2/webinar/peserta`, formData).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          toast.error('Gagal menambah peserta')
        } else {
          toast.success(`Berhasil menambah peserta`)
          this.setState({userId:[]})
          this.fetchData();
        }
      }
    })
    :
    toast.warning('Silahkan pilih peserta terlebih dahulu')
  }

  deletePeserta (id) {
    API.delete(`${API_SERVER}v2/webinar/peserta/${id}`).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          toast.error('Gagal menghapus peserta')
        } else {
          toast.success(`Berhasil menghapus peserta`)
          this.fetchData();
        }
      }
    })
  }

  addTamu = e => {
    e.preventDefault();
    const formData = {
      webinarId: this.state.webinarId,
      name: this.state.nama,
      email: this.state.email,
      phone: this.state.telepon,
    };
    formData.email || formData.name || formData.phone ?
    API.post(`${API_SERVER}v2/webinar/tamu`, formData).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          toast.error('Gagal menambah tamu')
        } else {
          toast.success(`Berhasil menambah tamu`)
          this.setState({nama: '', email:'', telepon:''})
          this.fetchData();
        }
      }
    })
    :
    toast.warning('Silahkan masukkan data tamu terlebih dahulu')
  }

	render() {

    const role = this.state.role
    let levelUser = Storage.get('user').data.level;

    const TabelPembicara = ({items}) => (
      <table className="table table-striped mb-4">
        <thead>
          <tr>
            <th><input type="checkbox" value={this.state.allChecked} checked={this.state.allChecked} onChange={this.handleAllCheck} /></th>
            <th>Nama</th>
            <th>Email</th>
            <th>Telepon</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            items.length && items.map((item,i) => (
              <tr key={i}>
                <td>
                  <input type="checkbox" checked={item.checked} value={item.email} onClick={this.handleOneCheck} />
                </td>
                <td>{item.nama}</td>
                <td>{item.email}</td>
                <td>{item.telepon}</td>
                <td>{item.status == 1 ? 'Terkirim' : item.status == 2 ? 'Hadir' : item.status == 3 ? 'Tidak Hadir' : 'Belum Dikirim'}</td>
                <td>
                  <i className="fa fa-trash" style={{cursor: 'pointer'}}></i>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );

    const TabelPeserta = ({items}) => (
      <table className="table table-striped mb-4">
        <thead>
          <tr>
            <th><input type="checkbox" value={this.state.allChecked} checked={this.state.allChecked} onChange={this.handleAllCheck} /></th>
            <th>Nama</th>
            <th>Email</th>
            <th>Telepon</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            items.map((item,i) => (
              <tr key={i}>
                <td>
                  <input type="checkbox" checked={item.checked} value={item.email} onClick={this.handleOneCheck} />
                </td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.status == 1 ? 'Terkirim' : item.status == 2 ? 'Hadir' : item.status == 3 ? 'Tidak Hadir' : 'Belum Dikirim'}</td>
                <td>
                  <i onClick={this.deletePeserta.bind(this, item.id)} className="fa fa-trash" style={{cursor: 'pointer'}}></i>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );

    const TabelTamu = ({items}) => (
      <table className="table table-striped mb-4">
        <thead>
          <tr>
            <th><input type="checkbox" value={this.state.allCheckedTamu} checked={this.state.allCheckedTamu} onChange={this.handleAllCheckTamu} /></th>
            <th>Nama</th>
            <th>Email</th>
            <th>Telepon</th>
            <th>Status</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {
            items.map((item,i) => (
              <tr key={i}>
                <td>
                  <input type="checkbox" checked={item.checked} value={item.email} onClick={this.handleOneCheckTamu} />
                </td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.phone}</td>
                <td>{item.status == 1 ? 'Terkirim' : item.status == 2 ? 'Hadir' : item.status == 3 ? 'Tidak Hadir' : 'Belum Dikirim'}</td>
                <td>
                  <i onClick={this.deleteTamu.bind(this, item.id)} data-email={item.email} className="fa fa-trash" style={{cursor: 'pointer'}}></i>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    );

		return (
			<div className="row">                     
        <div className="col-sm-12">
          <Card>
            <Card.Body>
              <div className="row">
                <div className="col-sm-6">
                  <h3 className="f-w-900 f-18 fc-blue">
                  	<Link onClick={this.backButton.bind(this)} className="btn btn-sm mr-4" style={{
                  		border: '1px solid #e9e9e9',
                  		borderRadius: '50px',
                  	}}>
                  		<i className="fa fa-chevron-left" style={{margin: '0px'}}></i>
                		</Link>
                    Detail Webinar
                  </h3>
                </div>
                <div className="col-sm-6 text-right">
                  <div className="form-group">
                    {
                      (levelUser !='client' || this.state.userId == this.state.sekretarisId) &&
                      <button onClick={()=>this.setState({modalKuesioner: true})} className="btn btn-icademy-primary float-right"><i className="fa fa-plus"></i> Buat Kuesioner</button>
                    }
                  </div>
                  <p className="m-b-0">
                    {/* <span className="f-w-600 f-16">Lihat Semua</span> */}
                  </p>
                </div>
              </div>
              <div style={{marginTop: '10px'}}>
                <div className="row">
                  <div className="col-sm-12">
                    <div className="form-group">
                      <label className="bold">Gambar Webinar</label>
                      <div className="row">
                        <div className="col-sm-3">
                          <img className="img-fluid" src={this.state.gambar == '' || this.state.gambar == null ? `/newasset/imginput.png` : typeof this.state.gambar === 'object' && this.state.gambar !== null ? URL.createObjectURL(this.state.gambar) : this.state.gambar } />
                        </div>
                        <div className="col-sm-2">
                          <input type="file" name="gambar" onChange={e => this.setState({ gambar: e.target.files[0] })} className="ml-5 btn btn-sm btn-default" />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="bold">Judul Webinar</label>
                      <input type="text" className="form-control" name="judul" onChange={e => this.setState({ judul: e.target.value })} value={this.state.judul} />
                    </div>

                    <div className="form-group">
                      <label className="bold">Isi Webinar</label>
                      <textarea rows="6" className="form-control" value={this.state.isi} onChange={e => this.setState({ isi: e.target.value })} />
                    </div>

                    <div className="form-group row">
                      <div className="col-sm-4">
                        <label className="bold col-sm-12">Tanggal Webinar</label>
                        <DatePicker
                          dateFormat="yyyy-MM-dd"
                          selected={this.state.tanggal}
                          onChange={e => this.setState({ tanggal: e })}
                        />
                      </div>
                      <div className="col-sm-4">
                        <label className="bold col-sm-12">Jam Mulai</label>
                        <DatePicker
                          selected={this.state.jamMulai}
                          onChange={date => this.setState({ jamMulai: date})}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={30}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                          />
                      </div>
                      <div className="col-sm-4">
                        <label className="bold col-sm-12">Jam Selesai</label>
                        <DatePicker
                          selected={this.state.jamSelesai}
                          onChange={date => this.setState({ jamSelesai: date})}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={30}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                          />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="bold">Pembicara</label>
                        <div class="input-group">
                          <input disabled type="text" value={this.state.pembicara} className="form-control" />
                          {/* <span className="input-group-btn">
                            <button onClick={e => this.setState({ isModalPembicara: true })} className="btn btn-default">
                              <i className="fa fa-plus"></i> Tambah
                            </button>
                          </span> */}
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <label className="bold">Peserta</label>
                        <div class="input-group">
                          <input value={this.state.peserta.length+this.state.tamu.length} type="text" className="form-control" />
                          <span className="input-group-btn">
                            <button onClick={e => {this.setState({ isModalPeserta: true }); this.fetchData()}} className="btn btn-default">
                              <i className="fa fa-plus"></i> Tambah
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-sm-12">
                        <label className="bold">Folder & File</label>
                        <div className="col-sm-12">
                          <div id="scrollin" style={{height:'300px', marginBottom: '0px', overflowY:'scroll', border:'1px solid #CCC'}}>
                            <TableFiles access_project_admin={this.state.access_project_admin} projectId={this.props.match.params.projectId} webinarId={this.state.webinarId}/>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-12">
                        <label className="bold">Ruang Meeting</label>
                        <div className="col-sm-12">
                          <div id="scrollin" style={{height:'300px', marginBottom: '0px', overflowY:'scroll', border:'1px solid #CCC'}}>
                            <TableMeetings webinarId={this.state.webinarId} access_project_admin={this.state.access_project_admin} projectId={this.props.match.params.project_id}/>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <div className="form-group row">
                      <div className="col-sm-8">
                        <label className="bold">Ruangan Webinar</label>
                        <div className="jumbotron text-center">
                          <h2>
                            <img src="/newasset/vid.jpg" width="200px" />
                          </h2>
                          <Link to="" className="btn btn-sm btn-info btn-v2 mr-2">Masuk</Link>
                          <Link to="" className="btn btn-sm btn-warning btn-v2">Langsung Masuk</Link>
                        </div>
                      </div>
                      <div className="col-sm-4">
                        <label className="bold">Meeting Internal</label>
                        <div className="jumbotron text-center">
                          <h2>
                            <img src="/newasset/vid.jpg" width="80px" />
                          </h2>
                          <Link to="" className="btn btn-sm btn-warning btn-v2">Masuk</Link>
                        </div>
                      </div>
                    </div> */}

                    <div className="form-group">
                      <button onClick={this.updateWebinar} className="btn btn-icademy-primary float-right"><i className="fa fa-save"></i> Simpan</button>
                    </div>

                  </div>
                </div>
                
              </div>
            </Card.Body>
          </Card>

          <Modal
            show={this.state.isModalPembicara}
            onHide={this.handleModal}
            dialogClassName="modal-lg"
          >
            <Modal.Body>
              <h5>
                Pembicara
              </h5>

              <div style={{ marginTop: "20px" }} className="form-group">
                <div className="form-group">
                  <label>Cari Pembicara</label>
                  <div class="input-group">
                    { <input type="text" list="pembicara" className="form-control" /> }
                    <span className="input-group-btn">
                      <button className="btn btn-default">
                        <i className="fa fa-search"></i> Cari
                      </button>
                    </span>
                  </div>
                </div>

                <TabelPembicara items={this.state.pembicara} />
              </div>
              
              <button
                type="button"
                className="btn btn-v2 btn-primary f-w-bold mr-2"
              >
                <i className="fa fa-envelope"></i>
                Kirim email
              </button>
              <button
                type="button"
                className="btn btn-v2 btn-success f-w-bold mr-2"
              >
                <i className="fa fa-save"></i>
                Simpan
              </button>
              <button
                type="button"
                className="btn btn-v2 f-w-bold"
                onClick={this.handleModal}
              >
                Tutup
              </button>
            </Modal.Body>
          </Modal>

          <Modal
            show={this.state.isModalPeserta}
            onHide={this.handleModal}
            dialogClassName="modal-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
                Peserta Webinar
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h5>Peserta</h5>
              <div style={{ marginTop: "20px" }} className="form-group">
                <div className="form-group">
                  <label>Cari Peserta</label>
                  <div class="input-group">
                    <MultiSelect
                        id={`userId`}
                        options={this.state.optionsName}
                        value={this.state.userId}
                        onChange={userId => this.setState({ userId })}
                        mode="single"
                        enableSearch={true}
                        resetable={true}
                        valuePlaceholder="Silahkan Pilih User"
                        allSelectedLabel="Silahkan Pilih User"
                      />
                    <span className="input-group-btn">
                      <button className="btn btn-default" onClick={this.addPeserta.bind(this)}>
                        <i className="fa fa-plus"></i> Tambah
                      </button>
                    </span>
                  </div>
                </div>

                <TabelPeserta items={this.state.peserta} />
              </div>

              <h5>Tamu</h5>
              <div style={{ marginTop: "20px" }} className="form-group">
                <div className="form-group row">
                  <div className="col-sm-3">
                    <label>Nama</label>
                    <input type="text" name="nama" value={this.state.nama} onChange={e => this.setState({ nama: e.target.value })} className="form-control" />
                  </div>
                  <div className="col-sm-3">
                    <label>Email</label>
                    <input type="email" name="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} className="form-control" />
                  </div>
                  <div className="col-sm-3">
                    <label>Telepon</label>
                    <input type="text" name="telepon" value={this.state.telepon} onChange={e => this.setState({ telepon: e.target.value })} className="form-control" />
                  </div>
                  <div className="col-sm-3">
                    <button onClick={this.addTamu} className="btn btn-default" style={{marginTop: '25px'}}><i className="fa fa-plus"></i> Tambah</button>
                  </div>
                </div>

                <TabelTamu items={this.state.tamu} />
              </div>
              
              <button
                type="button"
                className="btn btn-icademy-warning m-2"
                onClick={this.kirimEmail.bind(this)}
              >
                <i className="fa fa-envelope"></i>
                {this.state.isSending ? 'Mengirim Undangan...' : 'Kirim Email'}
              </button>
              <button
                type="button"
                className="btn btn-icademy-primary m-2"
                onClick={this.handleModal}
              >
                <i className="fa fa-save"></i>
                Tutup
              </button>
              {/* <button
                type="button"
                className="btn btn-icademy-grey m-2"
                onClick={this.handleModal}
              >
                Tutup
              </button> */}
            </Modal.Body>
          </Modal>
          <Modal
            show={this.state.modalKuesioner}
            onHide={this.handleModal}
            dialogClassName="modal-lg"
          >
            <Modal.Header closeButton>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
                Kuesioner
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div style={{ marginTop: "20px" }} className="form-group">
                <WebinarKuesionerAdd webinarId={this.state.webinarId} closeModal={this.handleModal} />
              </div>
            </Modal.Body>
          </Modal>
        </div>
      </div>
		);
	}
}