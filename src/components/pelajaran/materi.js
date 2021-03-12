import React from 'react';

import API, {USER_ME, API_SERVER, APPS_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Link } from 'react-router-dom';

import { Modal, OverlayTrigger, Tooltip, Tabs, Tab, Button } from 'react-bootstrap';
import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import SocketContext from '../../socket';

class Overview extends React.Component {

  state = {
    jadwalId: this.props.match.params.id,
    pelajaranId: '',

    silabus: []
  };

  componentDidMount() {
    this.fetchOverview();
  }

  fetchOverview() {
    API.get(`${API_SERVER}v2/silabus/jadwal/${this.state.jadwalId}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch jadwal one`)
      console.log('silabus: ', res.data.result);
      this.setState({ silabus: res.data.result });
    })
  }

  handleDynamicInput = (e, i) => {
    let newObj = [...this.state.silabus];
    if(e.hasOwnProperty('target')) {
      const { value, name } = e.target;
      newObj[i][name] = value;
      this.setState({ silabus: newObj });
    } else {
      newObj[i].chapter_body = e;
      this.setState({ silabus: newObj });
    }
  }

  handleDynamicDate = (e, i) => {
    let newObj = [...this.state.silabus];
    newObj[i].start_date = e;
    this.setState({ silabus: newObj });
  }

  editChapter(e, index) {
    let cc = [...this.state.silabus];
    let item = cc.filter((item, i) => i === index);
    console.log('state: ', item)

    let form = {
      number: item[0].sesi,
      title: item[0].chapter_title,
      content: item[0].chapter_body,
      tatapmuka: item[0].tatapmuka,
      tanggal: moment(item[0].start_date).format('YYYY-MM-DD HH:mm'),
    }

    API.put(`${API_SERVER}v2/pelajaran/chapter/update/${item[0].chapter_id}`, form).then(res => {
      if (res.data.error) toast.warning(`Error: create chapter`)

      // if (this.state.files) {
      //   this.uplaodFiles(this.state.id)
      // }

      toast.success(`Materi berhasil diupdate.`)
      this.fetchOverview()
    })
  }

  uplaodFiles(id) {
    let form = new FormData();
    for (var i = 0; i < this.state.files.length; i++) {
      form.append('files', this.state.files[i]);
    }

    API.put(`${API_SERVER}v2/pelajaran/chapter/files/${id}`, form).then(res => {
      if (res.data.error) {
        toast.warning(`Error: upload files`)
      } else {
        toast.success(`Attachments berhasil di upload.`);
        this.setState({ attachments: res.data.result.split(','), materi: Math.random().toString(36), files: null })
      }
    })
  }

  saveChapter(e, index) {
    let cc = [...this.state.silabus];
    let item = cc.filter((item, i) => i === index);
    console.log('state: ', item)

    let form = {
      companyId: Storage.get('user').data.company_id,
      pelajaranId: item[0].pelajaran_id,
      number: item[0].sesi,
      title: item[0].chapter_title,
      content: item[0].chapter_body,
      tatapmuka: item[0].tatapmuka,
      tanggal: moment(item[0].start_date).format('YYYY-MM-DD HH:mm'),
      silabusId: item[0].id
    }

    console.log('state: ', form)

    API.post(`${API_SERVER}v2/pelajaran/chapter/create`, form).then(res => {
      if (res.data.error) toast.warning(`Error: create chapter`)

      // if (this.state.files) {
      //   this.uplaodFiles(res.data.result.id)
      // }
      //
      // this.fetchChapters();
      // this.fetchOneChapter(res.data.result.id)
      toast.success(`Materi berhasil disimpan.`)
      this.fetchOverview()
    })
  }

  render() {
    console.log('state: ', this.state);

    const renderTooltip = (props) => (
      <Tooltip id="button-tooltip" {...props}>
        {props.desc}
      </Tooltip>
    );

    return (
      <div className="row mt-3">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              <h4 className="f-w-900 f-18 fc-blue">Silabus</h4>
            </div>
            <div className="card-body">

              <table className="table table-bordered" id="myTableSilabus">
                <thead>
                  <tr>
                    <th style={{color: 'black'}} className="text-center">Sesi</th>
                    <th style={{color: 'black'}} className="text-center">Topik</th>
                    <th style={{color: 'black'}} className="text-center">Tujuan</th>
                    <th style={{color: 'black'}} className="text-center">Tanggal</th>
                    <th style={{color: 'black'}} className="text-center">Periode</th>
                    <th style={{color: 'black'}} className="text-center">Durasi</th>
                    <th style={{color: 'black'}} className="text-center">Attachment</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.silabus.map((item, i) => {
                      if(item.jenis === 0) {
                        return (
                          <>
                            <tr key={i} style={{ cursor: 'pointer' }} data-toggle="collapse" data-target={`#collapse${i}`} data-parent="#myTableSilabus">
                              <td className="text-center">{item.sesi}</td>
                              <td>
                                <OverlayTrigger
                                  placement="top"
                                  delay={{ show: 250, hide: 400 }}
                                  overlay={<Tooltip>{item.deskripsi}</Tooltip>}
                                >
                                  <a hrerf="#">{item.topik}</a>
                                </OverlayTrigger>
                              </td>
                              <td>{item.tujuan}</td>
                              <td className="text-center">{item.start_date ? moment(item.start_date).format('DD/MM/YYYY HH:mm') : '-'}</td>
                              <td  className="text-center">{item.periode}</td>
                              <td  className="text-center">{item.durasi} menit</td>
                              <td style={{padding: '12px'}} className="text-center">
                                {
                                  item.files ? <a href={item.files} target="_blank" className="silabus">Open</a> : '-'
                                }
                              </td>
                            </tr>
                            <tr className="collapse" id={`collapse${i}`}>
                              <td colSpan="7">
                                <Tabs defaultActiveKey="materi" id="uncontrolled-tab-example">
                                  <Tab eventKey="materi" title="Materi" style={{padding: '8px'}}>
                                    <form className="row">
                                      <div className="col-sm-8 bordered">
                                        <div className="form-group">
                                          <input required value={item.chapter_title} name="chapter_title" onChange={e => this.handleDynamicInput(e, i)} type="text" className="form-control" placeholder="Title" />
                                        </div>
                                        <div className="form-group">
                                          <input id="my-file" type="file" name="my-file" style={{display:"none"}} onChange="" />
                                          <Editor
                                            apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                                            initialValue={item.chapter_body}
                                            value={item.chapter_body}
                                            init={{
                                              height: 460,
                                              menubar: false,
                                              convert_urls: false,
                                              image_class_list: [
                                                {title: 'None', value: ''},
                                                {title: 'Responsive', value: 'img-responsive'},
                                                {title: 'Thumbnail', value: 'img-responsive img-thumbnail'}
                                              ],
                                              file_browser_callback_types: 'image file media',
                                              file_picker_callback: function (callback, value, meta) {
                                                // console.log(meta)
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
                                               alignleft aligncenter alignright alignjustify | image media | \
                                                bullist numlist outdent indent | removeformat | help"
                                            }}
                                            onEditorChange={e => this.handleDynamicInput(e, i)}
                                          />
                                        </div>
                                      </div>
                                      <div className="col-sm-4 bordered">
                                        <div className="form-group">
                                          <label>Date</label><br/>
                                          <DatePicker showTimeSelect dateFormat="yyyy-MM-dd HH:mm" selected={item.start_date ? new Date(moment(item.start_date).format('YYYY-MM-DD HH:mm')) : new Date()} onChange={date => this.handleDynamicDate(date, i)} />
                                        </div>
                                        <div className="form-group">
                                          <label className="mb-3">Webcam</label><br/>
                                          <div class="form-check form-check-inline">
                                            <input checked={item.tatapmuka == "1"} onChange={e => this.handleDynamicInput(e, i)} class="form-check-input" type="radio" name="tatapmuka" value="1" />
                                            <label class="form-check-label" for="inlineRadio1">Yes</label>
                                          </div>
                                          <div class="form-check form-check-inline">
                                            <input checked={item.tatapmuka == "0"} onChange={e => this.handleDynamicInput(e, i)} class="form-check-input" type="radio" name="tatapmuka" value="0" />
                                            <label class="form-check-label" for="inlineRadio2">No</label>
                                          </div>
                                        </div>

                                        <h4>Attachments</h4>
                                        <div className="input-group mb-3">
                                          <input key={this.state.materi} type="file" multiple onChange={e => this.setState({ files: e.target.files })} className="form-control" placeholder="Search" />
                                        </div>

                                        <ul className="list-group">
                                          {
                                            item.attachments && item.attachments.split(',').map(row => (
                                              <li className="list-group-item">
                                                <a href={row} target="_blank">{row}</a>
                                              </li>
                                            ))
                                          }
                                        </ul>

                                        <div className="form-group mt-4">
                                          <button onClick={e => { item.chapter_id ? this.editChapter(e, i) : this.saveChapter(e, i) }} type="button" className="btn btn-v2 btn-success">
                                            <i className="fa fa-save"></i> Simpan
                                          </button>
                                        </div>

                                      </div>
                                    </form>
                                  </Tab>

                                  <Tab eventKey="tugas" title="Tugas" style={{padding: '8px'}}>
                                    <Button variant="primary">Tambah Tugas</Button>
                                    <table className="table mt-2">
                                      <tr>
                                        <th>No</th>
                                        <th>Judul</th>
                                        <th>Start</th>
                                        <th>End</th>
                                        <th>Action</th>
                                      </tr>
                                    </table>
                                  </Tab>

                                  <Tab eventKey="kuis" title="Kuis" style={{padding: '8px'}}>
                                    <Button variant="primary">Tambah Kuis</Button>
                                      <table className="table mt-2">
                                        <tr>
                                          <th>No</th>
                                          <th>Judul</th>
                                          <th>Start</th>
                                          <th>End</th>
                                          <th>Action</th>
                                        </tr>
                                      </table>
                                  </Tab>
                                </Tabs>
                              </td>
                            </tr>
                          </>
                        )
                      } else {
                        return (
                          <tr key={i}>
                            <td className="text-center">{item.sesi}</td>
                            <td colSpan="2" className="text-center">{item.jenis == 1 ? 'Kuis':'Ujian'}</td>
                            <td className="text-center">-</td>
                            <td className="text-center">{item.periode}</td>
                            <td className="text-center">{item.durasi} menit</td>
                            <td className="text-center">-</td>
                          </tr>
                        )
                      }
                    })
                  }
                  </tbody>
                </table>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Overview;
