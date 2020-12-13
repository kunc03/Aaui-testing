import React from 'react';
import API, { USER_ME, API_SERVER, APPS_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import { toast } from 'react-toastify'

import { Link } from 'react-router-dom';
import moment from 'moment-timezone';

import { Modal } from 'react-bootstrap';
import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import { Editor } from '@tinymce/tinymce-react';
import SocketContext from '../../socket';

class Chapter extends React.Component {

  state = {
    pelajaranId: this.props.match.params.id,

    chapters: [],

    id: '',
    number: '',
    title: '',
    content: '',
    tanggal: new Date(),
    waktu: '',
    attachments: [],

    files: null,
    materi: '',
  };

  selectChapter = e => {
    e.preventDefault();
    console.log('selectKelas');
    let id = e.target.getAttribute('data-id');
    this.fetchOneChapter(id);
    this.setState({ materi: Math.random().toString(36) })
  }

  saveChapter = e => {
    let form = {
      companyId: Storage.get('user').data.company_id,
      pelajaranId: this.state.pelajaranId,
      number: this.state.number,
      title: this.state.title,
      content: this.state.content,
      tanggal: this.state.tanggal + ' ' + this.state.waktu
    }

    API.post(`${API_SERVER}v2/pelajaran/chapter/create`, form).then(res => {
      if (res.data.error) toast.warning(`Error: create chapter`)

      if (this.state.files) {
        this.uplaodFiles(res.data.result.id)
      }

      this.fetchChapters();
      this.fetchOneChapter(res.data.result.id)
      toast.success(`Chapter inserted`)
    })
  }

  editChapter = e => {
    e.preventDefault();
    console.log('editChapter');
    let form = {
      number: this.state.number,
      title: this.state.title,
      content: this.state.content,
      tanggal: this.state.tanggal + ' ' + this.state.waktu
    }

    API.put(`${API_SERVER}v2/pelajaran/chapter/update/${this.state.id}`, form).then(res => {
      if (res.data.error) toast.warning(`Error: create chapter`)

      if (this.state.files) {
        this.uplaodFiles(this.state.id)
      }

      this.fetchChapters();
      this.fetchOneChapter(this.state.id)
      toast.success(`Chapter updated`)
    })
  }

  deleteChapter = e => {
    e.preventDefault();
    console.log('deleteChapter');
    API.delete(`${API_SERVER}v2/pelajaran/chapter/delete/${this.state.id}`).then(res => {
      if (res.data.error) toast.warning(`Error: delete chapter`)

      this.fetchChapters()
      this.clearForm()
    })
  }

  clearForm() {
    this.setState({
      id: '',
      number: '',
      title: '',
      content: '',
      tanggal: new Date(),
      waktu: '',
      attachments: [],

      files: null,
      materi: Math.random().toString(36)
    })
  }

  componentDidMount() {
    this.fetchChapters();
  }

  fetchChapters() {
    API.get(`${API_SERVER}v2/pelajaran/chapter/all/${this.state.pelajaranId}`).then(res => {
      if (res.data.error) toast.warning(`Error: fetch chapters`)

      this.setState({ chapters: res.data.result })
    })
  }

  fetchOneChapter(id) {
    API.get(`${API_SERVER}v2/pelajaran/chapter/one/${id}`).then(res => {
      if (res.data.error) toast.warning(`Error: fetch one chapter`)

      this.setState({
        id: res.data.result.id,
        number: res.data.result.number,
        title: res.data.result.title,
        content: res.data.result.content,
        tanggal: moment(res.data.result.tanggal).format('YYYY-MM-DD'),
        waktu: moment(res.data.result.tanggal).format('HH:mm'),
        attachments: res.data.result.attachments
      })
    })
  }

  uploadAttachments = e => {
    e.preventDefault();
    if (this.state.id) {
      if (this.state.files) {
        this.uplaodFiles(this.state.id)
      } else {
        toast.info(`File masih kosong`)
      }
    } else {
      toast.info(`Klik simpan terlebih dahulu`)
    }
  }

  uplaodFiles(id) {
    let form = new FormData();
    for (var i = 0; i < this.state.files.length; i++) {
      form.append('files', this.state.files[i]);
    }

    API.put(`${API_SERVER}v2/pelajaran/chapter/files/${id}`, form).then(res => {
      if (res.data.error) toast.warning(`Error: upload files`)

      toast.success(`Attachments success upload`);
      this.setState({ attachments: res.data.result.split(','), materi: Math.random().toString(36), files: null })
    })
  }

  render() {

    console.log('state: ', this.state)

    var selection = [];
    for (var i = 0; i < 24; i++) {
      var j = zeroFill(i, 2);
      selection.push(j + ":00");
      selection.push(j + ":30");
    }

    function zeroFill(number, width) {
      width -= number.toString().length;
      if (width > 0) {
        return new Array(width + (/\./.test(number) ? 2 : 1)).join('0') + number;
      }
      return number + ""; // always return a string
    }

    return (
      <div className="row mt-3">
        <div className="col-sm-8">
          <div className="card">
            <div className="card-header header-kartu">
              Form
            </div>
            <div className="card-body">
              <form>
                <div className="form-group row">
                  <div className="col-sm-2">
                    <label>No</label>
                    <input required value={this.state.number} name="number" onChange={e => this.setState({ [e.target.name]: e.target.value })} type="number" className="form-control" placeholder="Enter" />
                  </div>
                  <div className="col-sm-10">
                    <label>Nama</label>
                    <input required value={this.state.title} name="title" onChange={e => this.setState({ [e.target.name]: e.target.value })} type="text" className="form-control" placeholder="Enter" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Isi</label>
                  <input id="my-file" type="file" name="my-file" style={{display:"none"}} onChange="" />
                  <Editor
                    apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                    initialValue={this.state.content}
                    value={this.state.content}
                    init={{
                      height: 460,
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
                          var input = document.getElementById('my-file');
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
                        "undo redo | insertfile formatselect | bold italic backcolor | \
                       alignleft aligncenter alignright alignjustify | image | \
                        bullist numlist outdent indent | removeformat | help"
                    }}
                    onEditorChange={e => this.setState({ content: e })}
                  />
                </div>
                <div className="form-group row">
                  <div className="col-sm-4">
                    <label>Date</label>
                    <input value={this.state.tanggal} name="tanggal" onChange={e => this.setState({ [e.target.name]: e.target.value })} type="date" className="form-control" placeholder="Enter" />
                  </div>
                  <div className="col-sm-2">
                    <label> Starting Hours </label>
                    <select required name="waktu" onChange={e => this.setState({ [e.target.name]: e.target.value })} value={this.state.waktu} className="form-control">
                      <option value="" disabled selected>Pilih</option>
                      {
                        selection.map(item => (
                          <option value={item}>{item}</option>
                        ))
                      }
                    </select>
                  </div>
                </div>

                <h4>Materi</h4>
                <div className="input-group mb-3">
                  <input key={this.state.materi} type="file" multiple onChange={e => this.setState({ files: e.target.files })} className="form-control" placeholder="Search" />
                  <div className="input-group-append">
                    <button onClick={this.uploadAttachments} className="btn btn-success" type="submit">Upload</button>
                  </div>
                </div>

                <ul className="list-group">
                  {
                    this.state.attachments && this.state.attachments.map(item => (
                      <li className="list-group-item">
                        <a href={item} target="_blank">{item}</a>
                        { /** <i className="fa fa-trash float-right" style={{cursor: 'pointer'}}></i> */}
                      </li>
                    ))
                  }
                </ul>

                <div className="form-group mt-4">
                  <button onClick={this.state.id ? this.editChapter : this.saveChapter} type="button" className="btn btn-v2 btn-success">
                    <i className="fa fa-save"></i> Simpan
                  </button>
                  {
                    this.state.id &&
                    <button onClick={this.deleteChapter} type="button" className="btn btn-v2 btn-danger float-right">
                      <i className="fa fa-trash"></i> Hapus
                    </button>
                  }
                </div>

              </form>
            </div>
          </div>
        </div>

        <div className="col-sm-4">
          <div className="card">
            <div className="card-header header-kartu">
              List
            </div>
            <div className="card-body" style={{ padding: '5px' }}>
              <div className="list-group list-group-flush">
                {
                  this.state.chapters.map((item, i) => (
                    <Link onClick={this.selectChapter} data-id={item.id} key={i} className="list-group-item list-group-item-action">
                      {item.title}
                    </Link>
                  ))
                }
              </div>

              <div style={{ padding: '12px' }}>
                <button onClick={() => this.clearForm()} type="button" className="btn btn-v2 btn-primary btn-block mt-2">
                  <i className="fa fa-plus"></i> Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Chapter;
