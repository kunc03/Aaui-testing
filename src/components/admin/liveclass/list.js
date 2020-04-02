import React, { Component } from "react";
import { Link, Switch, Route } from "react-router-dom";

import {
  Form, Card, CardGroup, Col, Row, ButtonGroup, Button, Image,
  InputGroup, FormControl, Modal
} from 'react-bootstrap';

import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';

export default class LiveClassAdmin extends Component {
  state = {
    companyId: '',
    classRooms: [],

    classId: '',
    speaker: '',
    roomName: '',
    cover: '',
    
    isNotifikasi: false,
    isiNotifikasi: '',

    imgPreview: '',

    isClassModal: false,
  }

  closeClassModal = e => {
    this.setState({ isClassModal: false, speaker: '', roomName: '', imgPreview: '', cover: '', classId: '' });
  }

  closeNotifikasi = e => {
    this.setState({ isNotifikasi: false, isiNotifikasi: '' })
  }

  handleChange = e => {
    const name = e.target.name;
    if (e.target.files[0].size <= 500000) {
      this.setState({
        cover: e.target.files[0],
        imgPreview: URL.createObjectURL(e.target.files[0])
      });
    } else {
      e.target.value = null;
      this.setState({ isNotifikasi: true, isiNotifikasi: 'File tidak sesuai dengan format, silahkan cek kembali.' })
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if (res.status === 200) {
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
        API.get(`${API_SERVER}v1/liveclass/company/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id}`).then(res => {
          if (res.status === 200) {
            this.setState({ classRooms: res.data.result.reverse() })
          }
        })
      }
    })
  }

  onSubmitForm = e => {
    e.preventDefault();

    if(this.state.classId) {
      let form = {
        speaker: this.state.speaker,
        room_name: this.state.roomName
      }

      API.put(`${API_SERVER}v1/liveclass/id/${this.state.classId}`, form).then(async res => {
        if (res.status === 200) {
          if (this.state.cover) {
            let formData = new FormData();
            formData.append('cover', this.state.cover);
            await API.put(`${API_SERVER}v1/liveclass/cover/${res.data.result.class_id}`, formData);
          }

          this.fetchData();
          this.closeClassModal();
        }
      })
    } else {
      let form = {
        user_id: Storage.get('user').data.user_id,
        company_id: this.state.companyId,
        speaker: this.state.speaker,
        room_name: this.state.roomName
      }

      API.post(`${API_SERVER}v1/liveclass`, form).then(async res => {
        if (res.status === 200) {
          if (this.state.cover) {
            let formData = new FormData();
            formData.append('cover', this.state.cover);
            await API.put(`${API_SERVER}v1/liveclass/cover/${res.data.result.class_id}`, formData);
          }

          this.fetchData();
          this.closeClassModal();
        }
      })
    }

  }

  onSubmitDelete = e => {
    e.preventDefault();
    const classId = e.target.getAttribute('data-id');
    API.delete(`${API_SERVER}v1/liveclass/delete/${classId}`).then(res => {
      if(res.status === 200) {
        this.fetchData();
      }
    })
  }

  onClickEdit = e => {
    e.preventDefault();
    const classId = e.target.getAttribute('data-id');
    const speaker = e.target.getAttribute('data-speaker');
    const roomName = e.target.getAttribute('data-roomname');
    this.setState({ isClassModal: true, classId: classId, speaker: speaker, roomName: roomName })
  }

  onSubmitLock = e => {
    e.preventDefault();
    const classId = e.target.getAttribute('data-id');
    const isLive = e.target.getAttribute('data-live');
    API.put(`${API_SERVER}v1/liveclass/live/${classId}`, {is_live: isLive == 0 ? '1':'0'}).then(res => {
      if(res.status === 200) {
        this.fetchData();
      }
    })
  }

  render() {

    const { classRooms, isLive } = this.state;

    const ClassRooms = ({ list }) => <Row>
      {list.map(item =>
        <div className="col-sm-4" key={item.class_id}>
          <a target="_blank" href={item.is_live ? `/liveclass-room/${item.class_id}` : '/liveclass'}>
            <div className="card">
              <div className="responsive-image-content radius-top-l-r-5" style={{backgroundImage:`url(${item.cover ? item.cover : 'https://cdn.pixabay.com/photo/2013/07/13/11/45/play-158609_640.png'})`}}></div>
              {/* <img
                className="img-fluid img-kursus radius-top-l-r-5"
                src={item.cover ? item.cover : 'https://cdn.pixabay.com/photo/2013/07/13/11/45/play-158609_640.png'}
                alt="dashboard-user"
              /> */}
              <div className="card-carousel ">
                <div className="title-head f-w-900 f-16">
                  {item.room_name}
                </div>
                <h3 className="f-14 f-w-800">
                  {item.speaker}
                </h3>
                <small className="mr-3">
                  <i className={`fa fa-${item.is_live ? 'video' : 'stop-circle'}`}></i>&nbsp;{item.is_live ? 'LIVE' : 'ENDED'}
                </small>

                <Link className="mr-3" data-id={item.class_id} data-live={item.is_live} onClick={this.onSubmitLock}>{item.is_live ? 'lock' : 'unlock'}</Link>
                <Link className="mr-3" data-id={item.class_id} data-speaker={item.speaker} data-roomname={item.room_name} onClick={this.onClickEdit}>edit</Link>
                <Link className="mr-3" data-id={item.class_id} onClick={this.onSubmitDelete}>hapus</Link>
              </div>
            </div>
          </a>
        </div>
      )}
    </Row>;

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <Row>
                    <div className="col-md-4 col-xl-4 mb-3">
                      <Link to={`/kursus`}>
                        <div className="kategori title-disabled">
                          <img src="/assets/images/component/kursusoff.png" className="img-fluid" alt="media" />
                          &nbsp;
                          Kursus & Materi
                        </div>
                      </Link>
                    </div>

                    <div className="col-md-4 col-xl-4 mb-3">
                      <Link to={`/forum`}>
                        <div className="kategori title-disabled">
                          <img src="/assets/images/component/forumoff.png" className="img-fluid" alt="media" />
                          &nbsp;
                          Forum
                        </div>
                      </Link>
                    </div>

                    <div className="col-md-4 col-xl-4 mb-3">
                      <Link to={`/liveclass`}>
                        <div className="kategori-aktif">
                          <img src="/assets/images/component/liveon.png" className="img-fluid" alt="media" />
                          &nbsp;
                          Group Meeting
								        </div>
                      </Link>
                    </div>
                  </Row>

                  <Row>
                    <div className="col-md-12">
                      <h3 className="f-20 f-w-800">
                        Semua Group Meeting &nbsp;&nbsp;
                        <button className="btn btn-ideku" onClick={e => { this.setState({ isClassModal: true}) }}><i className="fa fa-plus"></i> Buat Group Meeting</button>
                      </h3>
                    </div>
                  </Row>

                  <div>
                    {
                      classRooms.length ?
                        
                        <ClassRooms list={classRooms} />
                        
                        :
                        <div className="col-md-3 col-xl-3 mb-3">
                          No Classroom
                        </div>
                    }
                  </div>

                  <Modal
                    show={this.state.isNotifikasi}
                    onHide={this.closeNotifikasi}
                  >
                    <Modal.Body>
                      <Modal.Title className="text-c-purple3 f-w-bold">
                        Notifikasi
                      </Modal.Title>

                      <p style={{ color: "black", margin: "20px 0px" }}>
                        {this.state.isiNotifikasi}
                      </p>

                      <button
                        type="button"
                        className="btn btn-block f-w-bold"
                        onClick={this.closeNotifikasi}
                      >
                        Mengerti
                      </button>
                    </Modal.Body>
                  </Modal>

                  <Modal
                    show={this.state.isClassModal}
                    onHide={this.closeClassModal}
                    dialogClassName="modal-lg"
                  >
                    <Modal.Body>
                      <Modal.Title
                        className="text-c-purple3 f-w-bold f-21"
                        style={{ marginBottom: "30px" }}
                      >
                        Membuat Group Meeting
                      </Modal.Title>

                      <Form>
                        <Form.Group controlId="formJudul">
                          <img
                            alt="media"
                            src={
                              this.state.cover === ""
                                ? "/assets/images/component/placeholder-image.png"
                                : this.state.imgPreview
                            }
                            className="img-fluid"
                            style={{ width: "200px", height: "160px" }}
                          />

                          <Form.Label className="f-w-bold ml-4">
                            <h4 className="btn-default">Masukkan Gambar</h4>
                            <input
                              accept="image/*"
                              className="btn-default"
                              name="cover"
                              type="file"
                              onChange={this.handleChange}
                            />
                            <Form.Text className="text-muted">
                              Ukuran gambar 200x200 piksel.
                            </Form.Text>
                          </Form.Label>
                        </Form.Group>

                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Judul Class
                          </Form.Label>
                          <FormControl
                            type="text"
                            placeholder="Judul Class"
                            value={this.state.roomName}
                            onChange={e =>
                              this.setState({ roomName: e.target.value })
                            }
                          />
                          <Form.Text className="text-muted">
                            Buat judul yang menarik.
                          </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Pengisi Class
                          </Form.Label>
                          <FormControl
                            type="text"
                            placeholder="Pengisi Class"
                            value={this.state.speaker}
                            onChange={e =>
                              this.setState({ speaker: e.target.value })
                            }
                          />
                          <Form.Text className="text-muted">
                            Nama pengisi kelas atau speaker.
                          </Form.Text>
                        </Form.Group>

                        <div style={{ marginTop: "20px" }}>
                          <button type="button" onClick={this.onSubmitForm} className="btn btn-primary f-w-bold mr-3">
                            Simpan
                          </button>
                          &nbsp;
                          <button
                            type="button"
                            className="btn f-w-bold"
                            onClick={this.closeClassModal}
                          >
                            Tutup
                          </button>
                        </div>
                      </Form>
                    </Modal.Body>
                  </Modal>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}