import React from 'react';
import API, { USER_ME, API_SERVER, APPS_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

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

    no: '',
    nama: '',
    isi: '',
    tanggal: new Date(),
    waktu: '',

    materi: '',
  };

  selectChapter = e => {
    e.preventDefault();
    console.log('selectKelas');
  }

  editChapter = e => {
    e.preventDefault();
    console.log('editChapter');
  }

  deleteChapter = e => {
    e.preventDefault();
    console.log('deleteChapter');
  }

  componentDidMount() {
    this.fetchChapters();
  }

  fetchChapters() {
    let chapters = [
      { id: 1, title: "Chapter 1" },
      { id: 2, title: "Chapter 2" },
      { id: 3, title: "Chapter 3" },
    ];

    this.setState({ chapters })
  }

  render() {

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
              Form Chapter
            </div>
            <div className="card-body">
              <form>
                <div className="form-group row">
                  <div className="col-sm-2">
                    <label>No Chapter</label>
                    <input type="number" className="form-control" placeholder="Enter" />
                  </div>
                  <div className="col-sm-10">
                    <label>Nama Chapter</label>
                    <input type="text" className="form-control" placeholder="Enter" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Isi Chapter</label>
                  <Editor
                    apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                    initialValue={this.state.overview}
                    init={{
                      height: 300,
                      menubar: false,
                      plugins: [
                        "advlist autolink lists link image charmap print preview anchor",
                        "searchreplace visualblocks code fullscreen",
                        "insertdatetime media table paste code help wordcount"
                      ],
                      toolbar:
                        // eslint-disable-next-line no-multi-str
                        "undo redo | formatselect | bold italic backcolor | \
                       alignleft aligncenter alignright alignjustify | \
                        bullist numlist outdent indent | removeformat | help"
                    }}
                    onChange={this.handleEditorChange}
                  />
                </div>
                <div className="form-group row">
                  <div className="col-sm-4">
                    <label> Date </label>
                    <input type="date" className="form-control" placeholder="Enter" />
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
                  <input type="file" className="form-control" placeholder="Search" />
                  <div className="input-group-append">
                    <button className="btn btn-success" type="submit">Upload</button>
                  </div>
                </div>

                <ul className="list-group">
                  <li className="list-group-item">
                    <a href="#">Silabus-Semester-1.pdf</a>
                    <i className="fa fa-trash float-right" style={{ cursor: 'pointer' }}></i>
                  </li>
                </ul>

                <div className="form-group mt-4">
                  <button type="button" className="btn btn-v2 btn-success">
                    <i className="fa fa-save"></i> Simpan
                  </button>
                  <button type="button" className="btn btn-v2 btn-danger float-right">
                    <i className="fa fa-trash"></i> Hapus
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>

        <div className="col-sm-4">
          <div className="card">
            <div className="card-header header-kartu">
              List Chapter
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
                <button type="button" className="btn btn-v2 btn-primary btn-block mt-2">
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
