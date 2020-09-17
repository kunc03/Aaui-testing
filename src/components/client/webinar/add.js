import React, { Component } from 'react';
import { Modal, Card, InputGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import API, { API_SERVER, USER_ME, APPS_SERVER } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { toast } from "react-toastify";

import { MultiSelect } from 'react-sm-select';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class WebinarAdd extends Component {

	state = {
    webinarId: this.props.match.params.webinarId,

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

    // form peserta
    userId: [],

    // form tamu
    nama: '',
    email: '',
    telepon: '',
    tamu: [],

    allChecked: false,
    isModalPembicara: false,
    isModalPeserta: false
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

  removeTamu = e => {
    let cpTamu = [...this.state.tamu];
    let filter = cpTamu.filter((item) => item.email != e.target.getAttribute('data-email'));
    this.setState({ tamu: filter });
  }

  handleModal = () => {
    this.setState({
      isModalPembicara: false,
      isModalPeserta: false
    });
  }

  handleAllCheck = e => {
    e.preventDefault();
    let pem = this.state.pembicara;
    pem.forEach(item => item.checked = e.target.checked);
    this.setState({ pembicara: pem, allChecked: e.target.checked });
  }

  handleOneCheck = e => {
    let pem = this.state.pembicara;
    pem.forEach(item => { if (item.email === e.target.value) item.checked = e.target.checked });
    this.setState({ pembicara: pem }); 
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    API.get(`${API_SERVER}v2/webinar/one/${this.state.webinarId}`).then(res => {
      if(res.data.error) toast.warning("Gagal fetch API");
      this.setState({
        id: this.state.webinarId,
        gambar: res.data.result.gambar,
        judul: res.data.result.judul,
        isi: res.data.result.isi,
        tanggal: res.data.result.tanggal,
        jamMulai: res.data.result.jam_mulai,
        jamSelesai: res.data.result.jam_selesai,
        projectId: res.data.result.projectId,
        dokumenId: res.data.result.dokumenId,
        pembicara: res.data.result.pembicara.name
      })
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
      judul: this.state.judul,
      isi: this.state.isi,
      tanggal: tanggal,
      jamMulai: jamMulai,
      jamSelesai: jamSelesai,
      pesertanya: this.state.pesertanya
    };

    console.log(form);
  }

	render() {

    console.log('STATE: ', this.state)

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
            items.map((item,i) => (
              <tr key={i}>
                <td>
                  <input type="checkbox" checked={item.checked} value={item.email} onClick={this.handleOneCheck} />
                </td>
                <td>{item.nama}</td>
                <td>{item.email}</td>
                <td>{item.telepon}</td>
                <td>{item.status ? 'Sudah Dikirim' : 'Belum Dikirim'}</td>
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
                <td>{item.nama}</td>
                <td>{item.email}</td>
                <td>{item.telepon}</td>
                <td>{item.status ? 'Sudah Dikirim' : 'Belum Dikirim'}</td>
                <td>
                  <i className="fa fa-trash" style={{cursor: 'pointer'}}></i>
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
                <td>{item.nama}</td>
                <td>{item.email}</td>
                <td>{item.telepon}</td>
                <td>{item.status ? 'Sudah Dikirim' : 'Belum Dikirim'}</td>
                <td>
                  <i onClick={this.removeTamu} data-email={item.email} className="fa fa-trash" style={{cursor: 'pointer'}}></i>
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
                  	<Link to={`/detail-project/${this.props.match.params.projectId}`} className="btn btn-sm mr-4" style={{
                  		border: '1px solid #e9e9e9',
                  		borderRadius: '50px',
                  	}}>
                  		<i className="fa fa-chevron-left" style={{margin: '0px'}}></i>
                		</Link>
                    Lengkapi Webinar
                  </h3>
                </div>
                <div className="col-sm-6 text-right">
                  <p className="m-b-0">
                    {/* <span className="f-w-600 f-16">Lihat Semua</span> */}
                  </p>
                </div>
              </div>
              <div style={{marginTop: '10px'}}>
                <div className="row">
                  <div className="col-sm-8">
                    <div className="form-group">
                      <label className="bold">Gambar Webinar</label>
                      <div className="row">
                        <div className="col-sm-6">
                          <img className="img-fluid" src={this.state.gambar ? this.state.gambar : `/newasset/imginput.png`} />
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
                        <label className="bold">Tanggal Webinar</label>
                        <DatePicker
                          dateFormat="yyyy-MM-dd"
                          selected={this.state.tanggal}
                          onChange={e => this.setState({ tanggal: e })}
                        />
                      </div>
                      <div className="col-sm-4">
                        <label className="bold">Jam Mulai</label>
                        <DatePicker
                          selected={this.state.jamMulai}
                          onChange={date => this.setState({ jamMulai: date})}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                          />
                      </div>
                      <div className="col-sm-4">
                        <label className="bold">Jam Selesai</label>
                        <DatePicker
                          selected={this.state.jamSelesai}
                          onChange={date => this.setState({ jamSelesai: date})}
                          showTimeSelect
                          showTimeSelectOnly
                          timeIntervals={15}
                          timeCaption="Time"
                          dateFormat="h:mm aa"
                          />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="bold">Pembicara</label>
                        <div class="input-group">
                          <input type="text" value={this.state.pembicara} className="form-control" />
                          <span className="input-group-btn">
                            <button onClick={e => this.setState({ isModalPembicara: true })} className="btn btn-default">
                              <i className="fa fa-plus"></i> Tambah
                            </button>
                          </span>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <label className="bold">Peserta</label>
                        <div class="input-group">
                          <input value={this.state.peserta.length} type="text" className="form-control" />
                          <span className="input-group-btn">
                            <button onClick={e => this.setState({ isModalPeserta: true })} className="btn btn-default">
                              <i className="fa fa-plus"></i> Tambah
                            </button>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-sm-4">
                        <label className="bold">Role Dokumen Tree</label>
                        <a style={{padding: '18px'}} href="#" className="form-control btn-primary"><i className="fa fa-file"></i> Folder Dokumen Tree</a>
                      </div>
                    </div>

                    <div className="form-group row">
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
                    </div>

                    <div className="form-group">
                      <button onClick={this.updateWebinar} className="btn btn-success"><i className="fa fa-save"></i> Simpan</button>
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
                      <button className="btn btn-default">
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
                  <div className="col-sm-4">
                    <label>Email</label>
                    <input type="email" name="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} className="form-control" />
                  </div>
                  <div className="col-sm-3">
                    <label>Telepon</label>
                    <input type="text" name="telepon" value={this.state.telepon} onChange={e => this.setState({ telepon: e.target.value })} className="form-control" />
                  </div>
                  <div className="col-sm-2">
                    <button onClick={this.addTamu} className="btn btn-v2 btn-primary" style={{marginTop: '25px'}}><i className="fa fa-plus"></i> Tambah</button>
                  </div>
                </div>

                <TabelTamu items={this.state.tamu} />
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
        </div>
      </div>
		);
	}
}