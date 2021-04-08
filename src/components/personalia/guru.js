import React from 'react';
import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

import { toast } from "react-toastify";
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

class Guru extends React.Component {

  state = {
    userId: '',
    noInduk: '',
    nama: '',
    tempatLahir: '',
    tanggalLahir: '',
    jenisKelamin: '',
    email: '',
    file:'',

    action: "tambah",

    isModalTambah: false,

    dataMurid: [],

    userGuru: [],
    exists: false,

    excel: '',
    fileExcel: Math.random().toString(36)
  }

  fetchGuru() {
    API.get(`${API_SERVER}v1/user/company/${Storage.get('user').data.company_id}`).then(response => {
      let idGuru = this.state.dataMurid.map(item => { return item.user_id })

      const guru = response.data.result
                    .filter(item => (item.grup_name ? item.grup_name : "-").toLowerCase() === "guru")
                    .filter(item => !idGuru.includes(item.user_id));

      this.setState({ userGuru: guru })
    })
    .catch(function (error) {
      console.log(error);
    });
  }

  saveMurid = e => {
    e.preventDefault()
    if (this.state.action === "tambah") {
      // action for create
      let form = {
        companyId: Storage.get('user').data.company_id,
        nama: this.state.nama, noInduk: this.state.noInduk, tempatLahir: this.state.tempatLahir,
        tanggalLahir: this.state.tanggalLahir, jenisKelamin: this.state.jenisKelamin, email: this.state.email,
        userId: this.state.userId
      };

      let url = '';
      if(this.state.exists) {
        url = `${API_SERVER}v2/guru/create?exists=true`
      }
      else {
        url = `${API_SERVER}v2/guru/create`;
      }

      API.post(url, form).then(res => {
        if (res.data.error) toast.warning("Error create guru");

        toast.success("Guru baru berhasil disimpan")
        this.fetchMurid();
      })
    } else {
      // action for update
    }

    this.clearForm();
  }

  deleteMurid = e => {
    e.preventDefault();
    API.delete(`${API_SERVER}v2/guru/one/${e.target.getAttribute('data-id')}`).then(res => {
      if (res.data.error) toast.warning("Error hapus murid")

      this.fetchMurid();
    })
  }

  clearForm() {
    this.setState({
      userId: '',
      noInduk: '',
      nama: '',
      tempatLahir: '',
      tanggalLahir: '',
      jenisKelamin: '',
      email: '',

      action: "tambah",

      excel: '',
      fileExcel: Math.random().toString(36)
    })
  }

  closeModal() {
    this.setState({
      isModalTambah: false,
    })
  }

  componentDidMount() {
    this.fetchMurid();
  }

  fetchMurid() {
    API.get(`${API_SERVER}v2/guru/company/${Storage.get('user').data.company_id}`).then(res => {
      if (res.data.error) toast.warning("Error fetch murid");

      this.setState({ dataMurid: res.data.result })
      this.fetchGuru()
    })
  }

  showName = e => {
    let copy = [...this.state.userGuru];
    let getName = copy.filter(item => item.user_id == e.target.value)
    this.setState({
      userId: getName.length ? getName[0].user_id : '',
      noInduk: getName.length ? getName[0].identity : '',
      nama: getName.length ? getName[0].name : '',
      tempatLahir: '',
      tanggalLahir: '',
      jenisKelamin: '',
      email: getName.length ? getName[0].email : '',
      exists: getName.length ? true : false
    })
  }

  importMurid = e => {
    e.preventDefault()
    let form = new FormData();
    form.append('companyId', Storage.get('user').data.company_id);
    form.append('excel', this.state.excel);
    API.post(`${API_SERVER}v2/guru/import`, form).then(res => {
      if(res.status === 200) {
        toast.success('Import guru berhasil semua.')
        this.fetchMurid()
      }
    })
  }

  filterType = e => {
    const { files } = e.target;
    let split = files[0].name.split('.');
    let eks = split[split.length-1];
    if(['xlsx', 'xls'].includes(eks)) {
      this.setState({ excel: e.target.files[0] })
    }
    else {
      toast.info(`Format tidak sesuai`);
      this.setState({ fileExcel: Math.random().toString(36) })
    }
  }

  cekEmail = (email) => {
    API.get(`${API_SERVER}v1/user/cek/email/${email}`).then(res => {
      if(res.data.error) {
        toast.warning(res.data.result.charAt(0).toUpperCase() + res.data.result.slice(1))
        this.setState({ email: '' })
      }
      else {
        toast.info(res.data.result.charAt(0).toUpperCase() + res.data.result.slice(1))
      }
    })
  }

  render() {
    console.log('state', this.state);

    return (
      <>
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">Import Data Guru</div>
            <div className="card-body" style={{ padding: '5px' }}>
              <form onSubmit={this.importMurid}>
                <div className="form-group row" style={{ padding: '20px' }}>
                  <div className="col-sm-3">
                    <label>Template Excel</label><br />
                    <a href={`${API_SERVER}template-excel/guru.xlsx`} className="btn btn-v2 btn-primary">Download File</a>
                  </div>
                  <div className="col-sm-6">
                    <label>Pilih File</label>
                    <label for="attachment" className="form-control"><span className="form-control-upload-label">{this.state.excel ? this.state.excel.name : 'Choose File'}</span></label>
                    <input type="file" id="attachment" class="form-control file-upload-icademy" key={this.state.fileExcel} onChange={this.filterType}/>
                  </div>
                  <div className="col-sm-3">
                    <button style={{ marginTop: '28px' }} className="btn btn-v2 btn-success" type="submit">Submit</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              List of School Teachers
              <button onClick={() => this.setState({ isModalTambah: true })} className="btn btn-v2 btn-primary float-right">
                <i className="fa fa-plus"></i>
                Add Teacher
              </button>
            </div>
            <div className="card-body">

              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No</th>
                    <th> Name </th>
                    <th>No. Induk</th>
                    <th> Place of Birth </th>
                    <th> Date of Birth</th>
                    <th> Gender</th>
                    <th> Action </th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.dataMurid.map((item, i) => (
                      <tr>
                        <td>{i + 1}</td>
                        <td>{item.nama}</td>
                        <td>{item.no_induk}</td>
                        <td>{item.tempat_lahir}</td>
                        <td>{item.tanggal_lahir}</td>
                        <td>{item.jenis_kelamin}</td>
                        <td>
                          <Link to={`/learning/personalia-detail/guru|${item.no_induk}`}>
                            <i className="fa fa-search"></i>
                          </Link>
                          <i style={{ cursor: 'pointer' }} onClick={this.deleteMurid} data-id={item.id} className="fa fa-trash ml-2"></i>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

              <Modal
                show={this.state.isModalTambah}
                onHide={() => this.closeModal()}
                dialogClassName="modal-lg"
              >
                <Modal.Header closeButton>
                  <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
                    Add Teacher
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <form onSubmit={this.saveMurid}>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <select onChange={this.showName} class="form-control">
                          <option value="" selected disabled>Find teacher if user exists</option>
                          {
                            this.state.userGuru.map((item,i) => (
                              <option value={item.user_id}>{item.name}</option>
                            ))
                          }
                          <option value="tambah">Add new</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label>Nama Guru</label>
                        <input value={this.state.nama} onChange={e => this.setState({ nama: e.target.value })} required type="text" className="form-control" placeholder="Enter" />
                      </div>
                      <div className="col-sm-6">
                        <label>No Induk</label>
                        <input value={this.state.noInduk} onChange={e => this.setState({ noInduk: e.target.value })} required type="text" className="form-control" placeholder="Enter" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-6">
                        <label> Place of Birth </label>
                        <input value={this.state.tempatLahir} onChange={e => this.setState({ tempatLahir: e.target.value })} required type="text" className="form-control" placeholder="Enter" />
                      </div>
                      <div className="col-sm-6">
                        <label> Date of Birth</label>
                        <input value={this.state.tanggalLahir} onChange={e => this.setState({ tanggalLahir: e.target.value })} required type="date" className="form-control" placeholder="Enter" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-3">
                        <label> Gender</label>
                        <select value={this.state.jenisKelamin} onChange={e => this.setState({ jenisKelamin: e.target.value })} required className="form-control" placeholder="Enter">
                          <option value="" disabled selected>Pilih</option>
                          <option value="Laki-laki">Laki-laki</option>
                          <option value="Perempuan">Perempuan</option>
                        </select>
                      </div>
                      <div className="col-sm-6">
                        <label>Email</label>
                        <input onBlur={e => this.cekEmail(e.target.value)} value={this.state.email} onChange={e => this.setState({ email: e.target.value })} required type="email" className="form-control" placeholder="Enter" />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-sm-12">
                        <button type="submit" className="btn btn-v2 btn-success">
                          <i className="fa fa-save"></i> Simpan
                        </button>
                        <button onClick={() => this.clearForm()} type="button" className="btn btn-v2 btn-primary ml-2">
                          <i className="fa fa-history"></i> Reset
                        </button>
                      </div>
                    </div>
                  </form>
                </Modal.Body>
              </Modal>

            </div>
          </div>
        </div>
      </>
    );
  }
}

export default Guru;
