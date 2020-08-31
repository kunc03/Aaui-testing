import React, { Component } from 'react';
import { Modal, Card, InputGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class WebinarAdd extends Component {

	state = {
    pembicara: [
      {nama: 'John Mayers', email: 'ardiansyah3ber@gmail.com', telepon: '082334093822', status: false, checked: false},
      {nama: 'Marco Elive', email: 'marco.elive@gmail.com', telepon: '087757386772', status: false, checked: false},
      {nama: 'Smity Jensen', email: 'smity.jensen@gmail.com', telepon: '089123876345', status: true, checked: false},
    ],
    peserta: [
      {nama: 'Alvin Kamal', email: 'ardiansyah3ber@gmail.com', telepon: '082334093822', status: false, checked: false},
      {nama: 'Joe Sandy', email: 'marco.elive@gmail.com', telepon: '087757386772', status: false, checked: false},
      {nama: 'Aprillia Sundah', email: 'smity.jensen@gmail.com', telepon: '089123876345', status: true, checked: false},
      {nama: 'Dimas Andri Dwi', email: 'smity.jensen@gmail.com', telepon: '089123876345', status: true, checked: false},
    ],
    tamu: [
      {nama: 'M. Wahyu Izzudin', email: 'smity.jensen@gmail.com', telepon: '089123876345', status: true, checked: false},
    ],

    cari: [
      {value: 'Ahmad', label: 'Ahmad'},
      {value: 'Ardi', label: 'Ardi'},
      {value: 'Ansyah', label: 'Ansyah'},
    ],

    allChecked: false,
    isModalPembicara: false,
    isModalPeserta: false
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

	render() {

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
                  <i className="fa fa-trash" style={{cursor: 'pointer'}}></i>
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
                  	<Link to="/webinar" className="btn btn-sm mr-4" style={{
                  		border: '1px solid #e9e9e9',
                  		borderRadius: '50px',
                  	}}>
                  		<i className="fa fa-chevron-left" style={{margin: '0px'}}></i>
                		</Link>
                    Buat Webinar
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
                        <div className="col-sm-4">
                          <img src="/newasset/imginput.png" width="300px" />
                        </div>
                        <div className="col-sm-2">
                          <input type="file" className="ml-5 btn btn-sm btn-default" />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label className="bold">Judul Webinar</label>
                      <input type="text" className="form-control" />
                    </div>

                    <div className="form-group">
                      <label className="bold">Isi Webinar</label>
                      <textarea rows="6" className="form-control"></textarea>
                    </div>

                    <div className="form-group row">
                      <div className="col-sm-4">
                        <label className="bold">Tanggal Webinar</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="col-sm-4">
                        <label className="bold">Jam Mulai</label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="col-sm-4">
                        <label className="bold">Jam Selesai</label>
                        <input type="text" className="form-control" />
                      </div>
                    </div>

                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label className="bold">Pembicara</label>
                        <div class="input-group">
                          <input type="text" className="form-control" />
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
                          <input type="text" className="form-control" />
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
                      <button className="btn btn-success"><i className="fa fa-save"></i> Simpan</button>
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
                    <datalist id="pembicara">
                      {
                        this.state.cari.map(item => (
                          <option value={item.value} />
                        ))
                      }
                    </datalist>
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
                    { <input type="text" list="pembicara" className="form-control" /> }
                    <span className="input-group-btn">
                      <button className="btn btn-default">
                        <i className="fa fa-search"></i> Cari
                      </button>
                    </span>
                    <datalist id="pembicara">
                      {
                        this.state.cari.map(item => (
                          <option value={item.value} />
                        ))
                      }
                    </datalist>
                  </div>
                </div>

                <TabelPeserta items={this.state.peserta} />
              </div>

              <h5>Tamu</h5>
              <div style={{ marginTop: "20px" }} className="form-group">
                <div className="form-group row">
                  <div className="col-sm-3">
                    <label>Nama</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="col-sm-4">
                    <label>Email</label>
                    <input type="email" className="form-control" />
                  </div>
                  <div className="col-sm-3">
                    <label>Telepon</label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="col-sm-2">
                    <button className="btn btn-v2 btn-primary" style={{marginTop: '25px'}}><i className="fa fa-plus"></i> Tambah</button>
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