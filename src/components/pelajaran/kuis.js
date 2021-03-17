import React from 'react';
import API, {USER_ME, API_SERVER, APPS_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';
import { Editor } from '@tinymce/tinymce-react';

import { toast } from 'react-toastify';

import { Link } from 'react-router-dom';
import moment from 'moment-timezone';

import { Modal } from 'react-bootstrap';
import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import SocketContext from '../../socket';

class Tugas extends React.Component {

  state = {
    tipe: this.props.tipe,
    pelajaranId: this.props.match.params.id,

    kuis: [],

    examId: '',
    title: '',
    quizAt: '0',
    tatapmuka: '1',
    tanggalMulai: moment(new Date()).format('YYYY-MM-DD'),
    tanggalAkhir: moment((new Date()).setDate(new Date().getDate() + 7)).format('YYYY-MM-DD'),

    chapters: [],

    pertanyaan: [],

    mengumpulkan: [],

    formFile: null,
    loading: false,
    fileExcel: Math.random().toString(36),

    formAdd: false,
  };

  onClickTambahPertanyaan = () => {
    if(this.state.examId) {
      let baruPertanyaan = {
        id: '',
        jawaban: '',
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
    } else {
      toast.info(`Pilih ${this.state.tipe} terlebih dahulu`)
    }
  }

  handleDynamicInput = (e, i) => {
    let newObj = [...this.state.pertanyaan];
    if(e.hasOwnProperty('target')) {
      const { value, name } = e.target;
      newObj[i][name] = value;
      this.setState({ pertanyaan: newObj });
    } else {
      newObj[i].tanya = e;
      this.setState({ pertanyaan: newObj });
    }
  }

  clearForm() {
    this.setState({
      formAdd: false,

      examId: '',
      title: '',
      quizAt: '',
      tatapmuka: '1',
      tanggalMulai: moment(new Date()).format('YYYY-MM-DD'),
      tanggalAkhir: moment((new Date()).setDate(new Date().getDate() + 7)).format('YYYY-MM-DD'),

      mengumpulkan: [],

      fileExcel: Math.random().toString(36)
    })
  }

  fetchPertanyaan(id) {
    API.get(`${API_SERVER}v2/pelajaran/pertanyaan/semua/${id}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch pertanyaan`)

      console.log('state: ', res.data.result)

      this.setState({ pertanyaan: res.data.result, fileExcel: Math.random().toString(36) })
    })
  }

  fetchMengumpulkan(id) {
    this.setState({
      mengumpulkan: [
        {id: 1, nama: 'Agus', nilai: 76, submission: true},
        {id: 2, nama: 'Muhammad', nilai: 88, submission: true},
        {id: 3, nama: 'Sulton', nilai: 98, submission: true},
        {id: 4, nama: 'Bella', nilai: 0, submission: false},
        {id: 5, nama: 'Deby', nilai: 0, submission: false},
      ]
    })
  }

  selectOne(examId) {
    API.get(`${API_SERVER}v2/pelajaran/${this.state.tipe}/one/${examId}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch ${this.state.tipe}`)

      this.setState({
        formAdd: true,

        examId: examId,
        title: res.data.result.title,
        quizAt: res.data.result.quiz_at,
        tatapmuka: res.data.result.tatapmuka,
        tanggalMulai: moment(res.data.result.time_start).format('YYYY-MM-DD'),
        tanggalAkhir: moment(res.data.result.time_finish).format('YYYY-MM-DD'),

        fileExcel: Math.random().toString(36)
      })

      this.fetchPertanyaan(examId);

      this.fetchMengumpulkan(examId);
    })
  }

  selectKuis = e => {
    e.preventDefault();
    let examId = e.target.getAttribute('data-id');
    this.selectOne(examId);
  }

  componentDidMount() {
    this.fetchKuis();
    this.fetchChapters();
  }

  fetchChapters() {
    API.get(`${API_SERVER}v2/pelajaran/chapter/all/${this.state.pelajaranId}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch chapters`)

      this.setState({ chapters: res.data.result })
    })
  }

  fetchKuis() {
    API.get(`${API_SERVER}v2/pelajaran/${this.state.tipe}/all/${this.state.pelajaranId}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch ${this.state.tipe}`)

      this.setState({ kuis: res.data.result })
    })
  }

  saveKuis = e => {
    e.preventDefault();
    if(this.state.examId) {
      let form = {
        title: this.state.title,
        quizAt: this.state.quizAt,
        tatapmuka: this.state.tatapmuka,
        tanggalMulai: this.state.tanggalMulai,
        tanggalAkhir: this.state.tanggalAkhir
      }

      API.put(`${API_SERVER}v2/pelajaran/${this.state.tipe}/update/${this.state.examId}`, form).then(res => {
        if(res.data.error) toast.warning(`Error: update ${this.state.tipe}`)

        toast.success(`Sukses mengubah ${this.state.tipe}`)
        this.fetchKuis();
        this.selectOne(this.state.examId)
      })
    } else {
      let form = {
        companyId: Storage.get('user').data.company_id,
        pelajaranId: this.state.pelajaranId,

        title: this.state.title,
        tatapmuka: this.state.tatapmuka,
        quizAt: this.state.quizAt,
        tanggalMulai: this.state.tanggalMulai,
        tanggalAkhir: this.state.tanggalAkhir
      }

      API.post(`${API_SERVER}v2/pelajaran/${this.state.tipe}/create`, form).then(res => {
        if(res.data.error) toast.warning(`Error: create ${this.state.tipe}`)

        toast.success(`Sukses menyimpan ${this.state.tipe}`)
        this.fetchKuis();
        this.selectOne(res.data.result.id)
        this.clearForm();
      })
    }
  }

  deleteKuis = e => {
    e.preventDefault();
    API.delete(`${API_SERVER}v2/pelajaran/${this.state.tipe}/delete/${this.state.examId}`).then(res => {
      if(res.data.error) toast.warning(`Error: delete ${this.state.tipe}`)

      this.fetchKuis();
      this.clearForm();
    })
  }

  onClickHapusPertanyaan = (e) => {
		let dataIndex = e.target.getAttribute('data-id');
		let dataID = e.target.getAttribute('data-index');
		API.delete(`${API_SERVER}v2/pelajaran/pertanyaan/hapus/${dataIndex}`).then(res => {
			if(res.data.error) toast.warning("Gagal menghapus data");

			toast.success("Data pertanyaan terhapus")
      this.fetchPertanyaan(this.state.examId)
		})
  }

  saveKuesioner(){
    if(this.state.examId) {
      let form = {
        examId: this.state.examId,
        pertanyaan: this.state.pertanyaan,
      };

      API.post(`${API_SERVER}v2/pelajaran/pertanyaan/buat`, form).then(res => {

        console.log('state: ', res.data.result)

        if(res.status === 200) {
          if(res.data.error) {
            toast.error('Error post data')
          } else {
            this.fetchKuis();
            this.fetchPertanyaan(this.state.examId);
            toast.success(`Menyimpan pertanyaan`)
          }
        }
      })
    } else {
      toast.info(`Pilih ${this.state.tipe} terlebih dahulu`)
    }
  }

  submitImport = e => {
		e.preventDefault();
    if(this.state.examId) {
  		this.setState({ loading: true });
  		let form = new FormData();
  		form.append('examId', this.state.examId);
  		form.append('files', this.state.formFile);

  		API.post(`${API_SERVER}v2/pelajaran/pertanyaan/import`, form).then(res => {
  			if(res.data.error) toast.warning("Error import data");

  			toast.success("Berhasil import pertanyaan")
  			this.setState({ loading: false })
  			this.fetchPertanyaan(this.state.examId);
  		})
    } else {
      toast.info(`Pilih ${this.state.tipe} terlebih dahulu`)
    }
	}

  render() {

    console.log('state: ', this.state)

    return (
      <div className="row mt-3">

        <div className="col-sm-6">
          <div className="card">
            <div className="card-header header-kartu">
              Semua {this.state.tipe}
            </div>
            <div className="card-body" style={{padding: '5px'}}>
              <div className="list-group list-group-flush">
                {
                  this.state.kuis.map((item, i) => (
                    <Link onClick={this.selectKuis} data-id={item.id} key={i} className="list-group-item list-group-item-action">
                      {item.title}
                      <Link className="float-right" to={`/guru/detail-${this.state.tipe}/${this.state.pelajaranId}/${item.id}`}>Detail</Link>
                    </Link>
                  ))
                }
              </div>

              <div style={{padding: '12px'}}>
                <button onClick={() => { this.clearForm(); this.setState({ formAdd: true })}} type="button" className="btn btn-v2 btn-primary btn-block mt-2">
                  <i className="fa fa-plus"></i> Tambah
                </button>
              </div>
            </div>
          </div>
        </div>

        {
          this.state.formAdd &&

          <div className="col-sm-6">
            <div className="row">

              <div className="col-sm-12">
                <div className="card">
                  <div className="card-header header-kartu">
                    1. Informasi {this.state.tipe}
                  </div>
                  <div className="card-body">
                    <form>
                      <div className="form-group">
                        <label>Nama {this.state.tipe}</label>
                        <input className="form-control" type="text" value={this.state.title} name="title" onChange={e => this.setState({ [e.target.name]: e.target.value })} required placeholder="Enter" />
                      </div>
                      <div className="form-group row">
                        <div className="col-sm-6">
                          <label>Tanggal Mulai</label>
                          <input className="form-control" type="date" value={this.state.tanggalMulai} name="tanggalMulai" onChange={e => this.setState({ [e.target.name]: e.target.value })} required placeholder="Enter" />
                        </div>
                        <div className="col-sm-6">
                          <label>Tanggal Akhir</label>
                          <input className="form-control" type="date" value={this.state.tanggalAkhir} name="tanggalAkhir" onChange={e => this.setState({ [e.target.name]: e.target.value })} required placeholder="Enter" />
                        </div>
                      </div>

                      <div className="form-group mt-4">
                        <button onClick={this.saveKuis} type="button" className="btn btn-v2 btn-success">
                          <i className="fa fa-save"></i> Simpan
                        </button>
                        {
                          this.state.examId &&
                          <button onClick={this.deleteKuis} type="button" className="btn btn-v2 btn-danger float-right">
                            <i className="fa fa-trash"></i> Hapus
                          </button>
                        }

                        {
                          this.state.formAdd &&
                          <button onClick={e => this.setState({ formAdd: false })} type="button" className="mr-2 btn btn-v2 btn-info float-right">
                            Batal
                          </button>
                        }
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-sm-12">
                <div className="card">
                  <div className="card-header header-kartu">
                    2. Import Pertanyaan
                  </div>
                  <div className="card-body">
                    <form onSubmit={this.submitImport} role="form" className="form-vertical">
                      <div className="form-group row">
                        <div className="col-sm-3">
                          <label>Template Excel</label>
                          <a href={`${API_SERVER}attachment/pertanyaan.xlsx`} target="_blank" className="btn btn-v2 btn-primary">
                            <i className="fa fa-download"></i>
                            Download
                          </a>
                        </div>
                        <div className="col-sm-6">
                          <label>Import Excel</label>
                          <input key={this.state.fileExcel} required onChange={e => this.setState({ formFile: e.target.files[0] })} className="form-control" type="file" />
                        </div>
                        <div className="col-sm-3">
                          <button style={{marginTop: '28px'}} className="btn btn-v2 btn-primary" type="submit">
                            <i className="fa fa-save"></i> {this.state.loading ? "Sedang proses..." : "Simpan" }
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>

              <div className="col-sm-12">
                <div className="card">
                  <div className="card-header header-kartu">
                    3. Semua Pertanyaan
                  </div>
                  <div className="card-body">
                    {
                      this.state.pertanyaan.map((item,i) => (
                        <div className="form-group">
                          <label>Pertanyaan <b>{i+1}</b></label>
                          <span className="float-right">
                            <i data-index={i} data-id={item.id} onClick={this.onClickHapusPertanyaan} className="fa fa-trash" style={{cursor: 'pointer'}}></i>
                          </span>
                          <input id={`myFile${i}`} type="file" name={`myFile${i}`} style={{display:"none"}} onChange="" />
                          <Editor
                            apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                            initialValue={item.tanya}
                            value={item.tanya}
                            init={{
                              height: 200,
                              menubar: false,
                              convert_urls: false,
                              image_class_list: [
                                {title: 'None', value: ''},
                                {title: 'Responsive', value: 'img-responsive'},
                                {title: 'Thumbnail', value: 'img-responsive img-thumbnail'}
                              ],
                              file_browser_callback_types: 'image',
                              file_picker_callback: function (callback, value, meta) {
                                if (meta.filetype == 'image') {
                                  var input = document.getElementById(`myFile${i}`);
                                  input.click();
                                  input.onchange = function () {

                                    var dataForm = new FormData();
                                    dataForm.append('file', this.files[0]);

                                    window.$.ajax({
                                      url: `${API_SERVER}v2/media/upload`,
                                      type: 'POST',
                                      data: dataForm,
                                      processData: false,
                                      contentType: false,
                                      success: (data)=>{
                                        callback(data.result.url);
                                        this.value = '';
                                      }
                                    })

                                  };
                                }
                              },
                              plugins: [
                                "advlist autolink lists link image charmap print preview anchor",
                                "searchreplace visualblocks code fullscreen",
                                "insertdatetime media table paste code help wordcount"
                              ],
                              toolbar:
                                // eslint-disable-next-line no-multi-str
                                "undo redo | bold italic backcolor | \
                               alignleft aligncenter alignright alignjustify | image | \
                                bullist numlist outdent indent | removeformat | help"
                            }}
                            onEditorChange={e => this.handleDynamicInput(e, i)}
                          />

                          <div className="jawaban mt-3 ml-4">
                            <label>Jawaban Pertanyaan</label>
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

                          <div className="jawaban mt-3 ml-4">
                            <div className="form-group">
                              <label>Jawaban Benar</label>
                              <select onChange={e => this.handleDynamicInput(e, i)} name="jawaban" value={item.jawaban} className="form-control col-sm-3">
                                <option value="" disabled selected>Pilih</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      ))
                    }

                    <button onClick={this.onClickTambahPertanyaan} className="btn btn-v2 btn-icademy-grey" style={{width:'100%'}}><i className="fa fa-plus"></i> Tambah Pertanyaan</button>

                    <button
                      type="button"
                      style={{width: '100%'}}
                      className="btn btn-icademy-primary mt-2"
                      onClick={this.saveKuesioner.bind(this)}
                    >
                      <i className="fa fa-save"></i>
                      Simpan
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>

        }
      </div>
    )
  }
}

export default Tugas;
