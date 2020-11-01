import React from 'react';
import { Link } from 'react-router-dom';

import { Modal } from 'react-bootstrap';

import {API_SERVER} from '../../repository/api';

class Evaluasi extends React.Component {
  state = {
    idEvaluasi: "",
    judul: "",
    deskripsi: "",
    tanggal: "",
    penerima: "",
    status: "",

    isModalTambah: false,

    listEvaluasi: [],
    pertanyaan: [],

    formFile: null,
		loading: false,
  }

  onClickTambahPertanyaan = () => {
    let baruPertanyaan = {
      tanya: '',
      a: '',
      b: '',
      c: '',
      d: '',
      e: ''
    };
    this.setState({
      pertanyaan: [...this.state.pertanyaan, baruPertanyaan]
    })
  }

  clearForm() {
    this.setState({
      idEvaluasi: "",
      judul: "",
      tanggal: "",
      penerima: "",
      status: "",

      isModalTambah: false,
    })
  }

  handleDynamicInput = (e, i) => {
    const { value, name } = e.target;
    let newObj = [...this.state.pertanyaan];

    newObj[i][name] = value;
    this.setState({ pertanyaan: newObj });
  }

  onClickHapusPertanyaan = (e) => {
		let dataID = e.target.getAttribute('data-index');
		let kurangi = this.state.pertanyaan.filter((item, i) => i !== parseInt(dataID));
		this.setState({
			pertanyaan: kurangi
		})
  }

  componentDidMount() {
    let listEvaluasi = [
      {id: 1, judul: "Evaluasi Guru Ahamd", tanggal: "11 Sep 2020", penerima: "Murid,Parents", status: false},
      {id: 2, judul: "Evaluasi Guru Ardi", tanggal: "12 Sep 2020", penerima: "Parents", status: false},
      {id: 3, judul: "Evaluasi Guru Ansyah", tanggal: "13 Sep 2020", penerima: "Murid,Parents", status: false},
      {id: 4, judul: "Evaluasi Mapel IPA", tanggal: "15 Sep 2020", penerima: "Murid", status: true},
      {id: 5, judul: "Evaluasi Mapel MTK", tanggal: "15 Sep 2020", penerima: "Murid", status: true},
    ];
    this.setState({ listEvaluasi });
  }

  render() {
    const belum = this.state.listEvaluasi.filter(item => item.status === false);
    const sudah = this.state.listEvaluasi.filter(item => item.status === true);

    return (
      <div className="row mt-3">

        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              Semua Evaluasi
              <button onClick={() => this.setState({ isModalTambah: true})} className="btn btn-v2 btn-primary float-right">
                <i className="fa fa-plus"></i>
                Buat Evaluasi
              </button>
            </div>
          </div>
        </div>


        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              Belum Terkirim
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Judul</th>
                    <th>Tanggal Submit</th>
                    <th>Penerima</th>
                    <th className="text-center">Kirim</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    belum.map((item, i) => (
                      <tr>
                        <td>{i+1}</td>
                        <td>{item.judul}</td>
                        <td>{item.tanggal}</td>
                        <td>{item.penerima}</td>
                        <td className="text-center">
                          <button className="btn btn-sm btn-v2 btn-primary"><i className="fa fa-paper-plane"></i> Kirim</button>
                        </td>
                        <td className="text-center">
                          <i style={{cursor: 'pointer'}} className="fa fa-edit"></i>
                          <i style={{cursor: 'pointer'}} className="fa fa-trash ml-2"></i>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              Terkirim
            </div>
            <div className="card-body">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Judul</th>
                    <th>Tanggal Submit</th>
                    <th>Penerima</th>
                    <th className="text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    sudah.map((item, i) => (
                      <tr>
                        <td>{i+1}</td>
                        <td>{item.judul}</td>
                        <td>{item.tanggal}</td>
                        <td>{item.penerima}</td>
                        <td className="text-center">
                          <Link to={`/learning/evaluasi-detail/${item.id}`} className="btn btn-sm btn-v2 btn-primary"><i className="fa fa-search"></i> Lihat Detail</Link>
                        </td>

                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <Modal
          show={this.state.isModalTambah}
          onHide={() => this.clearForm()}
          dialogClassName="modal-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
              Tambah Evaluasi
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="form-group">
                <label>Judul</label>
                <input value={this.state.judul} onChange={e => this.setState({ judul: e.target.value })} required type="text" className="form-control" placeholder="Enter judul" />
              </div>
              <div className="form-group">
                <label>Deskripsi</label>
                <textarea value={this.state.deskripsi} onChange={e => this.setState({ deskripsi: e.target.value })} rows="3" required type="text" className="form-control" placeholder="Enter deskripsi" />
              </div>
              <div className="form-group">
                <label>Penerima</label><br/>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
                  <label className="form-check-label" for="inlineCheckbox1">Murid</label>
                </div>
                <div className="form-check form-check-inline">
                  <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2" />
                  <label className="form-check-label" for="inlineCheckbox2">Parents</label>
                </div>
              </div>
            </form>
            <hr/>
            <h5>Buat Pertanyaan</h5>
            <form onSubmit={this.submitImport} role="form" className="form-vertical">
              <div className="form-group row">
                <div className="col-sm-3">
                  <label>Template Excel</label>
                  <a href={`${API_SERVER}attachment/template.xlsx`} target="_blank" className="btn btn-primary">Download</a>
                </div>
                <div className="col-sm-6">
                  <label>Import Excel</label>
                  <input required onChange={e => this.setState({ formFile: e.target.files[0] })} className="form-control" type="file" />
                </div>
                <div className="col-sm-3">
                  <button style={{marginTop: '22px'}} className="btn btn-primary" type="submit">
                    <i className="fa fa-save"></i> {this.state.loading ? "Sedang proses..." : "Import" }
                  </button>
                </div>
              </div>
            </form>

            {
              this.state.pertanyaan.map((item,i) => (
                <div className="form-group">
                  <label>Pertanyaan {i+1}</label>
                  <span className="float-right">
                    <i data-index={i} data-id={item.id} onClick={this.onClickHapusPertanyaan} className="fa fa-trash" style={{cursor: 'pointer'}}></i>
                  </span>
                  <textarea onChange={e => this.handleDynamicInput(e, i)} name="tanya" className="form-control" rows="3" value={item.tanya} />

                  <div className="jawaban mt-3 ml-4">
                    <label>Tambahkan Jawaban Kuesioner</label>
                    <tr>
                      <td>
                        A
                      </td>
                      <td>
                        <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="a" value={item.a} className="form-control" style={{width: '460px'}} />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        B
                      </td>
                      <td>
                        <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="b" value={item.b} className="form-control" style={{width: '460px'}} />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        C
                      </td>
                      <td>
                        <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="c" value={item.c} className="form-control" style={{width: '460px'}} />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        D
                      </td>
                      <td>
                        <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="d" value={item.d} className="form-control" style={{width: '460px'}} />
                      </td>
                    </tr>
                    <tr>
                      <td>
                        E
                      </td>
                      <td>
                        <input type="text" onChange={e => this.handleDynamicInput(e, i)} name="e" value={item.e} className="form-control" style={{width: '460px'}} />
                      </td>
                    </tr>
                  </div>
                </div>
              ))
            }

            <button onClick={this.onClickTambahPertanyaan} className="btn btn-v2 btn-icademy-grey" style={{width:'100%'}}><i className="fa fa-plus"></i> Tambah Pertanyaan</button>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btm-icademy-primary btn-icademy-grey"
              onClick={() => this.clearForm()}
            >
              Batal
            </button>
            <button
              className="btn btn-icademy-primary btn-icademy-blue"
              onClick={this.saveRuangan}
            >
              <i className="fa fa-save"></i>
              Simpan
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }

}

export default Evaluasi;
