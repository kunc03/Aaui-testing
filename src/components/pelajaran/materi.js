import React from 'react';

import API, {USER_ME, API_SERVER, APPS_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';
import moment from 'moment-timezone';
import { toast } from 'react-toastify';
import { Editor } from '@tinymce/tinymce-react';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Link } from 'react-router-dom';

import { Modal, OverlayTrigger, Tooltip, Tabs, Tab, Button, Spinner, DropdownButton, ButtonGroup } from 'react-bootstrap';
import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import Dropdown, {
  MenuItem
} from '@trendmicro/react-dropdown';

// Be sure to include styles at some point, probably during your bootstraping
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';

import SocketContext from '../../socket';

class Overview extends React.Component {

  state = {
    jadwalId: this.props.match.params.id,
    pelajaranId: '',

    loading: true,
    silabus: [],

    uploading: false,

    materi: Math.random().toString(36),
    files: null,

    tugas: [],
    setTugas: [],

    kuis: [],
    setKuis: [],

    ujian: [],
    setUjian: [],

  };

  componentDidMount() {
    this.fetchOverview();

    this.fetchPenugasan('tugas');
    this.fetchPenugasan('kuis');
    this.fetchPenugasan('ujian');
  }

  fetchOverview() {
    API.get(`${API_SERVER}v2/silabus/jadwal/${this.state.jadwalId}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch jadwal one`)
      console.log('silabus: ', res.data.result);
      this.setState({ silabus: res.data.result, loading: false, });
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

      if (this.state.files) {
        this.setState({ uploading: true })
        this.uplaodFiles(item[0].chapter_id, this.state.files)
      } else {
        toast.success(`Materi berhasil diupdate.`)
        this.fetchOverview()
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
      tanggal: item[0].start_date ? moment(item[0].start_date).format('YYYY-MM-DD HH:mm') : moment(new Date()).format('YYYY-MM-DD HH:mm'),
      silabusId: item[0].id
    }

    console.log('state: ', form)

    API.post(`${API_SERVER}v2/pelajaran/chapter/create`, form).then(res => {
      if (res.data.error) {
        toast.warning(`Error: create chapter`)
      }
      else {
        if (this.state.files) {
          this.setState({ uploading: true })
          this.uplaodFiles(res.data.result.id, this.state.files)
        } else {
          toast.success(`Materi berhasil disimpan.`)
          this.fetchOverview()
        }
      }
    })
  }

  uplaodFiles(id, files) {
    let form = new FormData();
    for (var i = 0; i < files.length; i++) {
      form.append('files', files[i]);
    }

    API.put(`${API_SERVER}v2/pelajaran/chapter/files/${id}`, form).then(res => {
      if (res.data.error) {
        toast.warning(`Error: upload files`)
      } else {
        toast.success(`Materi dan Attachments berhasil di upload.`);
        this.fetchOverview()
        this.setState({ materi: Math.random().toString(36), files: null, uploading: false })
      }
    })
  }

  fetchPenugasan(tipe) {
    API.get(`${API_SERVER}v2/pelajaran/${tipe}/all/${this.state.jadwalId}`).then(res => {
      if(res.data.error) toast.warning(`Error: fetch ${tipe}`)

      let temp = [];
      res.data.result.map((item) => {
        let obj = {value: item.id, label: item.title}
        temp.push(obj)
        return true
      })
      this.setState({ [tipe]: temp })
    })
  }

  addPenugasan(tipe, event, index) {
    let cc = [...this.state.silabus].filter((item, i) => i === index);
    if(cc[0].chapter_id) {
      let form = {
        chapterId: cc[0].chapter_id,
        examId: tipe === 'tugas' ? this.state.setTugas[0] : tipe == 'kuis' ? this.state.setKuis[0] : this.state.setUjian[0]
      };
      API.post(`${API_SERVER}v2/chapter/exam`, form).then(res => {
        if(res.status === 200) {
          this.fetchOverview()
        }
      })
    }
    else {
      toast.info(`Isi form dan klik tombol Simpan terlebih dahulu, setelah itu dapat memilih tugas ataupun kuis.`)
    }
    this.setState({ setTugas: [], setKuis: [], setUjian: [] })
  }

  deletePenugasan(id) {
    API.delete(`${API_SERVER}v2/chapter/exam/${id}`).then(res => {
      if(res.status === 200) {
        this.fetchOverview()
      }
    })
  }

  copySesi(e, row, index) {
    let cc = [...this.state.silabus];
    let item = cc.filter((item, i) => i === index);

    if(item[0].chapter_id) {
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

      API.post(`${API_SERVER}v2/pelajaran/chapter/create`, form).then(res => {
        if (res.data.error) {
          toast.warning(`Error: create chapter`)
        }
        else {
          if (this.state.files) {
            this.uplaodFiles(res.data.result.id, this.state.files)
          } else {
            toast.success(`Materi berhasil disimpan.`)
            this.fetchOverview()
          }
        }
      })
    }
    else {
      toast.info(`Materi belum di upload.`)
    }
  }

  deleteSesi(e, row, index) {
    let cc = [...this.state.silabus];
    let item = cc.filter((item, i) => i === index);

    if(item[0].chapter_id) {
      API.delete(`${API_SERVER}v2/pelajaran/chapter/delete/${item[0].chapter_id}`).then(res => {
        if (res.data.error) {
          toast.warning(`Error: delete chapter`)
        }
        else {
          this.fetchOverview()
        }
      })
    }
    else {
      toast.info(`Tidak ada yang dihapus.`)
    }
  }

  render() {
    console.log('state: ', this.state);

    return (
      <div className="row mt-3">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header">
              <h4 className="f-w-900 f-18 fc-blue">Silabus</h4>
            </div>
            <div className="card-body p-1">

              <table className="table table-bordered" id="myTableSilabus">
                <thead>
                  <tr>
                    <th></th>
                    <th style={{color: 'black'}} className="text-center">Sesi</th>
                    <th style={{color: 'black'}} className="text-center">Topik</th>
                    <th style={{color: 'black'}} className="text-center">Tujuan</th>
                    <th style={{color: 'black'}} className="text-center">Tanggal</th>
                    <th style={{color: 'black'}} className="text-center">Periode</th>
                    <th style={{color: 'black'}} className="text-center">Durasi</th>
                    <th style={{color: 'black'}} className="text-center">Files</th>
                    <th width="50px"></th>
                  </tr>
                </thead>
                <tbody>
                  {
                    this.state.loading &&
                    <tr>
                      <td className="text-center" colSpan="8">fetching data...</td>
                    </tr>
                  }
                  {
                    this.state.silabus.map((item, i) => {
                      if(item.jenis === 0) {
                        return (
                          <>
                            <tr key={i} style={{ cursor: 'pointer' }}>
                              <td className="text-center collapsed"
                                data-toggle="collapse"
                                data-target={`#collapse${i}`}
                                aria-expanded="false"
                                aria-controls={`collapse${i}`}>
                                <i class="fa" aria-hidden="true"></i>
                              </td>
                              <td className="text-center">
                                {item.sesi}
                              </td>
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
                              <td className="text-center">
                                {
                                  item.start_date ?
                                    <>
                                      {moment(item.start_date).format('DD/MM/YYYY HH:mm')}
                                    </>
                                  :
                                    <span className="label label-primary">Upload Materi</span>
                                }
                              </td>
                              <td  className="text-center">{item.periode}</td>
                              <td  className="text-center">{item.durasi} menit</td>
                              <td style={{padding: '12px'}} className="text-center">
                                {
                                  item.files ? <a href={item.files} target="_blank" className="silabus">Open</a> : '-'
                                }
                              </td>
                              <td>
                                <Dropdown>
                                  <Dropdown.Toggle btnStyle="flat" noCaret iconOnly>
                                    <i className="fa fa-ellipsis-h"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <MenuItem onClick={e => this.copySesi(e, item, i)}><i className="fa fa-copy mr-2" title="Copy"></i> Copy</MenuItem>
                                    <MenuItem onClick={e => this.deleteSesi(e, item, i)}><i className="fa fa-trash mr-2" title="Delete"></i> Delete</MenuItem>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                            <tr className="collapse" id={`collapse${i}`}>
                              <td colSpan="9">
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
                                          <label key={this.state.materi} for="attachment" className="form-control"><span className="form-control-upload-label">{this.state.files ? this.state.files.length+' Files' : 'Choose File'}</span></label>
                                          <input required multiple type="file" id="attachment" class="form-control file-upload-icademy" onChange={e => this.setState({ files: e.target.files })}/>
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
                                          <Button onClick={e => { item.chapter_id ? this.editChapter(e, i) : this.saveChapter(e, i) }}>
                                            <Spinner animation="border" /> {this.state.uploading ? 'Uploading...' : 'Simpan'}
                                          </Button>
                                        </div>

                                      </div>
                                    </form>
                                  </Tab>

                                  <Tab eventKey="tugas" title="Tugas" style={{padding: '8px'}}>
                                    <div className="form-group row">
                                      <div className="col-sm-4">
                                        <MultiSelect
                                          mode="single"
                                          id="tugasSingle"
                                          options={this.state.tugas}
                                          value={this.state.setTugas}
                                          onChange={setTugas => this.setState({ setTugas })}
                                        />
                                      </div>
                                      <div className="col-sm-4">
                                        <Button onClick={e => this.addPenugasan('tugas', e, i)} variant="primary" size="sm">Tambah Tugas</Button>
                                        <Link className="btn btn-sm btn-default" to={`/guru/tugas/${this.state.jadwalId}`}>Buat Tugas</Link>
                                      </div>
                                    </div>

                                    <table className="table mt-2 table-bordered">
                                      <tr>
                                        <th>No</th>
                                        <th>Judul</th>
                                        <th>Start</th>
                                        <th>End</th>
                                        <th>Action</th>
                                      </tr>
                                      {
                                        item.tugas.map((row, j) => (
                                          <tr>
                                            <td>{j+1}</td>
                                            <td><Link to={`/guru/detail-tugas/${this.state.jadwalId}/${row.exam_id}`}>{row.exam_title}</Link></td>
                                            <td>{moment(row.time_start).format('DD/MM/YYYY')}</td>
                                            <td>{moment(row.time_finish).format('DD/MM/YYYY')}</td>
                                            <td><i className="fa fa-trash" onClick={e => this.deletePenugasan(row.id)}></i></td>
                                          </tr>
                                        ))
                                      }
                                    </table>
                                  </Tab>

                                  <Tab eventKey="kuis" title="Kuis" style={{padding: '8px'}}>
                                    <div className="form-group row">
                                      <div className="col-sm-4">
                                        <MultiSelect
                                          mode="single"
                                          id="kuisSingle"
                                          options={this.state.kuis}
                                          value={this.state.setKuis}
                                          onChange={setKuis => this.setState({ setKuis })}
                                        />
                                      </div>
                                      <div className="col-sm-4">
                                        <Button onClick={e => this.addPenugasan('kuis', e, i)} variant="primary" size="sm">Tambah Kuis</Button>
                                        <Link className="btn btn-sm btn-default" to={`/guru/kuis/${this.state.jadwalId}`}>Buat Kuis</Link>
                                      </div>
                                    </div>
                                    <table className="table mt-2 table-bordered">
                                      <tr>
                                        <th>No</th>
                                        <th>Judul</th>
                                        <th>Start</th>
                                        <th>End</th>
                                        <th>Action</th>
                                      </tr>
                                      {
                                        item.kuis.map((row, j) => (
                                          <tr>
                                            <td>{j+1}</td>
                                            <td><Link to={`/guru/detail-kuis/${this.state.jadwalId}/${row.exam_id}`}>{row.exam_title}</Link></td>
                                            <td>{moment(row.time_start).format('DD/MM/YYYY')}</td>
                                            <td>{moment(row.time_finish).format('DD/MM/YYYY')}</td>
                                            <td><i className="fa fa-trash" onClick={e => this.deletePenugasan(row.id)}></i></td>
                                          </tr>
                                        ))
                                      }
                                    </table>
                                  </Tab>
                                </Tabs>
                              </td>
                            </tr>
                          </>
                        )
                      }
                      else {
                        return (
                          <>
                            <tr key={i} style={{ cursor: 'pointer' }}>
                              <td className="text-center collapsed"
                                data-toggle="collapse"
                                data-target={`#collapse${i}`}
                                aria-expanded="false"
                                aria-controls={`collapse${i}`}>
                                <i class="fa" aria-hidden="true"></i>
                              </td>
                              <td className="text-center">
                                {item.sesi}
                              </td>
                              <td colSpan="2" className="text-center">{item.jenis == 1 ? 'Kuis':'Ujian'}</td>
                              <td className="text-center">{item.start_date ? moment(item.start_date).format('DD/MM/YYYY HH:mm') : <span className="label label-primary">Pilih {item.jenis == 1 ? 'Kuis':'Ujian'}</span>}</td>
                              <td className="text-center">{item.periode}</td>
                              <td className="text-center">{item.durasi} menit</td>
                              <td className="text-center">
                                {
                                  item.files ? <a href={item.files} target="_blank" className="silabus">Open</a> : '-'
                                }
                              </td>
                              <td>
                                <Dropdown>
                                  <Dropdown.Toggle btnStyle="flat" noCaret iconOnly>
                                    <i className="fa fa-ellipsis-h"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    <MenuItem onClick={e => this.copySesi(e, item, i)}><i className="fa fa-copy mr-2" title="Copy"></i> Copy</MenuItem>
                                    <MenuItem onClick={e => this.deleteSesi(e, item, i)}><i className="fa fa-trash mr-2" title="Delete"></i> Delete</MenuItem>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                            <tr className="collapse" id={`collapse${i}`} data-parent="#myTableSilabus">
                              <td colSpan="9">

                                <form className="row">
                                  <div className="col-sm-6 bordered">
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
                                  <div className="col-sm-6 bordered">
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

                                    <div className="form-group mt-4">
                                      <Button onClick={e => { item.chapter_id ? this.editChapter(e, i) : this.saveChapter(e, i) }}>
                                        <Spinner animation="border" /> Simpan
                                      </Button>
                                    </div>

                                    <h4>{item.jenis === 1 ? 'Kuis' : 'Ujian'}</h4>
                                    <div className="form-group row">
                                      <div className="col-sm-6">
                                        <MultiSelect
                                          mode="single"
                                          id="ujianSingle"
                                          options={item.jenis == 1 ? this.state.kuis : this.state.ujian}
                                          value={item.jenis == 1 ? this.state.setKuis : this.state.setUjian}
                                          onChange={set => this.setState({ [item.jenis === 1 ? 'setKuis' : 'setUjian']: set })}
                                        />
                                      </div>
                                      <div className="col-sm-6">

                                        {
                                          item.jenis == 1 ?
                                          <Button onClick={e => this.addPenugasan('kuis', e, i)} variant="primary" size="sm">Tambah {item.jenis == 1 ? 'Kuis':'Ujian'}</Button>
                                          :
                                          <Button onClick={e => this.addPenugasan('ujian', e, i)} variant="primary" size="sm">Tambah {item.jenis == 1 ? 'Kuis':'Ujian'}</Button>
                                        }
                                        <Link className="btn btn-sm btn-default" to={`/guru/${item.jenis == 1 ? 'kuis':'ujian'}/${this.state.jadwalId}`}>Buat {item.jenis == 1 ? 'Kuis':'Ujian'}</Link>
                                      </div>
                                    </div>
                                    <table className="table mt-2 table-bordered">
                                      <tr>
                                        <th>No</th>
                                        <th>Judul</th>
                                        <th>Start</th>
                                        <th>End</th>
                                        <th>Action</th>
                                      </tr>

                                      {
                                        item.jenis == 1 && item.kuis.map((row, j) => (
                                          <tr>
                                            <td>{j+1}</td>
                                            <td><Link to={`/guru/detail-${item.jenis === 1 ? 'kuis' : 'ujian'}/${this.state.jadwalId}/${row.exam_id}`}>{row.exam_title}</Link></td>
                                            <td>{moment(row.time_start).format('DD/MM/YYYY')}</td>
                                            <td>{moment(row.time_finish).format('DD/MM/YYYY')}</td>
                                            <td><i className="fa fa-trash" onClick={e => this.deletePenugasan(row.id)}></i></td>
                                          </tr>
                                        ))
                                      }

                                      {
                                        item.jenis == 2 && item.ujian.map((row, j) => (
                                          <tr>
                                            <td>{j+1}</td>
                                            <td><Link to={`/guru/detail-${item.jenis === 1 ? 'kuis' : 'ujian'}/${this.state.jadwalId}/${row.exam_id}`}>{row.exam_title}</Link></td>
                                            <td>{moment(row.time_start).format('DD/MM/YYYY')}</td>
                                            <td>{moment(row.time_finish).format('DD/MM/YYYY')}</td>
                                            <td><i className="fa fa-trash" onClick={e => this.deletePenugasan(row.id)}></i></td>
                                          </tr>
                                        ))
                                      }
                                    </table>

                                  </div>
                                </form>

                              </td>
                            </tr>
                          </>
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
