import React, { Component } from "react";
import { Link, Switch, Route } from "react-router-dom";

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';
// import moment from "react-moment";
import Moment from 'moment-timezone';

import ToggleSwitch from "react-switch";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import {
  Form, Card, CardGroup, Col, Row, ButtonGroup, Button, Image,
  InputGroup, FormControl, Modal
} from 'react-bootstrap';

import API, { API_JITSI, API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';

export default class LiveClassAdmin extends Component {
  state = {
    companyId: '',
    classRooms: [],
    classRoomsActive: [],

    classId: '',
    speaker: '',
    roomName: '',
    cover: '',
    
    isNotifikasi: false,
    isiNotifikasi: '',
    filterMeeting: '',

    imgPreview: '',

    isClassModal: false,

    //single select moderator
    optionsModerator: [],
    valueModerator: [],

    //multi select peserta
    optionsPeserta: [],
    valuePeserta: [],
    //Toggle Switch
    private: false,
    scheduled: false,
    startDate: new Date(),
    endDate: new Date(),
  }
  
  filterMeeting =  (e) => {
    e.preventDefault();
    this.setState({filterMeeting : e.target.value});
  }

  handleCreateMeeting() {
    this.setState({ isClassModal: true});
  };
  handleChangeDateFrom = date => {
    this.setState({
      startDate: date
    });
  };
  handleChangeDateEnd = date => {
    this.setState({
      endDate: date
    });
  };

  toggleSwitch(checked) {
    this.setState({ private:!this.state.private });
  }

  toggleSwitchScheduled(checked) {
    this.setState({ scheduled:!this.state.scheduled });
  }

  closeClassModal = e => {
    this.setState({ isClassModal: false, speaker: '', roomName: '', imgPreview: '', cover: '', classId: '', valueModerator:[], valuePeserta:[], startDate: new Date(), endDate: new Date() });
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
            let dataClass = res.data.result
            this.setState({
              classRooms: dataClass.filter((item) => item.active_participants <= 0).reverse(),
              classRoomsActive: dataClass.filter((item) => item.active_participants >= 1).reverse()
            })
          }
        });
        if (this.state.optionsModerator.length==0 || this.state.optionsPeserta.length==0){
          API.get(`${API_SERVER}v1/user/company/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id}`).then(response => {
            response.data.result.map(item => {
              this.state.optionsModerator.push({value: item.user_id, label: item.name});
              this.state.optionsPeserta.push({value: item.user_id, label: item.name});
            });
          })
          .catch(function(error) {
            console.log(error);
          });
        }
      }
    })
  }

  onSubmitForm = e => {
    e.preventDefault();

    if(this.state.classId) {
      let isPrivate = this.state.private == true ? 1 : 0;
      let isScheduled = this.state.scheduled == true ? 1 : 0;
      let startDateJkt = Moment.tz(this.state.startDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
      let endDateJkt = Moment.tz(this.state.endDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
      let form = {
        room_name: this.state.roomName,
        moderator: this.state.valueModerator,
        is_private: isPrivate,
        is_scheduled: isScheduled,
        schedule_start: startDateJkt,
        schedule_end: endDateJkt,
        peserta: this.state.valuePeserta
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
      let isPrivate = this.state.private == true ? 1 : 0;
      let isScheduled = this.state.scheduled == true ? 1 : 0;
      let startDateJkt = Moment.tz(this.state.startDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
      let endDateJkt = Moment.tz(this.state.endDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss")
      let form = {
        user_id: Storage.get('user').data.user_id,
        company_id: this.state.companyId,
        speaker: this.state.speaker,
        room_name: this.state.roomName,
        moderator: this.state.valueModerator,
        is_private: isPrivate,
        is_scheduled: isScheduled,
        schedule_start: startDateJkt,
        schedule_end: endDateJkt,
        peserta: this.state.valuePeserta
      }

      API.post(`${API_SERVER}v1/liveclass`, form).then(async res => {
        if (res.status === 200) {
          console.log('RESS',res)
          if (this.state.cover) {
            let formData = new FormData();
            formData.append('cover', this.state.cover);
            await API.put(`${API_SERVER}v1/liveclass/cover/${res.data.result.class_id}`, formData);
          }
          if (res.data.result.is_private == 1){
            let start = new Date(res.data.result.schedule_start);
            let end = new Date(res.data.result.schedule_end);
            let form = {
              user: Storage.get('user').data.user,
              email: [],
              room_name: res.data.result.room_name,
              is_private: res.data.result.is_private,
              is_scheduled: res.data.result.is_scheduled,
              schedule_start: start.toISOString().slice(0, 16).replace('T', ' '),
              schedule_end: end.toISOString().slice(0, 16).replace('T', ' '),
              userInvite: this.state.valuePeserta.concat(this.state.valueModerator),
              //url
              message: 'https://app.icademy.id/liveclass-room/'+res.data.result.class_id,
              messageNonStaff: 'https://'+API_JITSI+'/'+res.data.result.room_name
            }
            API.post(`${API_SERVER}v1/liveclass/share`, form).then(res => {
              if(res.status === 200) {
                if(!res.data.error) {
                  console.log('RESS SUKSES',res)
                } else {
                  console.log('RESS GAGAL',res)
                }
              }
            })
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
    const cover = e.target.getAttribute('data-cover');
    const speaker = e.target.getAttribute('data-speaker');
    const roomName = e.target.getAttribute('data-roomname');
    const valueModerator = [Number(e.target.getAttribute('data-moderator'))];
    const isprivate = e.target.getAttribute('data-isprivate');
    const participant = e.target.getAttribute('data-participant') ? e.target.getAttribute('data-participant').split(',').map(Number): [];
    const isscheduled = e.target.getAttribute('data-isscheduled');
    const schedule_start = new Date(e.target.getAttribute('data-start'));
    const schedule_end = new Date(e.target.getAttribute('data-end'));
    this.setState({
      isClassModal: true,
      classId: classId,
      cover: cover,
      speaker: speaker,
      roomName: roomName,
      valueModerator: valueModerator,
      private: isprivate == 1 ? true : false,
      valuePeserta: participant,
      scheduled: isscheduled == 1 ? true : false,
      startDate: schedule_start,
      endDate: schedule_end
    })
    console.log('ALVIN TEST',this.state)
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

		let access = Storage.get('access');
		let levelUser = Storage.get('user').data.level;
    let { classRooms, classRoomsActive, isLive } = this.state;

    let { filterMeeting } = this.state;
    if(filterMeeting != ""){
      classRooms = classRooms.filter(x=>
        JSON.stringify(
          Object.values(x)
        ).match(new RegExp(filterMeeting,"gmi"))
      )
    }
    const ClassRooms = ({ list }) => <Row>
      {list.map(item =>
        <div className="col-sm-4" key={item.class_id}>
          <a target="_blank" href={item.is_live ? `/liveclass-room/${item.class_id}` : '/liveclass'}>
            <div className="card">
              <div className="responsive-image-content radius-top-l-r-5" style={{backgroundImage:`url(${item.cover ? item.cover : '/assets/images/component/meeting-default.jpg'})`}}></div>
              {/* <img
                className="img-fluid img-kursus radius-top-l-r-5"
                src={item.cover ? item.cover : 'https://cdn.pixabay.com/photo/2013/07/13/11/45/play-158609_640.png'}
                alt="dashboard-user"
              /> */}
              <div className="card-carousel ">
                <div className="title-head f-w-900 f-16">
                  {item.room_name}
                </div>
                <h3 className="f-14">
                  {item.name}
                </h3>
                {
                  item.active_participants > 0 ?
                  <medium className="mr-3" style={{position:'absolute', top:20, left:20, background:'#FFF', borderRadius:'5px', padding:'5px 10px'}}>
                    <i className='fa fa-video'></i> AKTIF
                  </medium>
                  :
                  null
                }
                {/* <small className="mr-3">
                  <i className={`fa fa-${item.is_live ? 'video' : 'stop-circle'}`}></i>&nbsp;{item.is_live ? 'LIVE' : 'ENDED'}
                </small> */}

                <small className="mr-3">
                  <Link data-id={item.class_id} data-live={item.is_live} onClick={this.onSubmitLock}>
                    <i className={`fa fa-${item.is_live ? 'lock' : 'lock-open'}`}></i> {item.is_live ? 'LOCK' : 'UNLOCK'}
                  </Link>
                </small>
                <small className="mr-3">
                  <Link
                    data-id={item.class_id}
                    data-cover={item.cover}
                    data-speaker={item.speaker}
                    data-roomname={item.room_name}
                    data-moderator={item.moderator} 
                    data-isprivate={item.is_private} 
                    data-participant={item.participant} 
                    data-isscheduled={item.is_scheduled} 
                    data-start={item.schedule_start} 
                    data-end={item.schedule_end} 
                    onClick={this.onClickEdit}>
                      <i className='fa fa-edit'></i> UBAH
                  </Link>
                </small>
                <small className="mr-3">
                  <Link data-id={item.class_id} onClick={this.onSubmitDelete}>
                    <i className='fa fa-trash'></i> HAPUS
                  </Link>
                </small><br />
                {
                  item.record &&
                  <small className="mr-3">
                    <a target='_blank' href={item.record}>
                      <i className='fa fa-compact-disc'></i> REKAMAN
                    </a>
                  </small>
                }
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
                        {
                        levelUser == 'client' && access.course == 0 ?
                        null
                        :
                        <div className="col-md-4 col-xl-4 mb-3">
                          <Link to={`/kursus`}>
                            <div className="kategori title-disabled">
                              <img src="/assets/images/component/kursusoff.png" className="img-fluid" />
                              &nbsp;
                              Kursus & Materi
                            </div>
                          </Link>
                        </div>
                        }

                        {
                        levelUser == 'client' && access.forum == 0 ?
                        null
                        :
                        <div className="col-md-4 col-xl-4 mb-3">
                          <Link to={`/forum`}>
                            <div className="kategori title-disabled">
                              <img src="/assets/images/component/forumoff.png" className="img-fluid" />
                              &nbsp;
                              Forum
                            </div>
                          </Link>
                        </div>
                        }

                        {
                        levelUser == 'client' && (access.group_meeting == 0 && access.manage_group_meeting == 0) ?
                        null
                        :
                        <div className="col-md-4 col-xl-4 mb-3">
                          <Link to={access.manage_group_meeting ? `/meeting` : `/liveclass`}>
                            <div className="kategori-aktif">
                              <img src="/assets/images/component/liveon.png" className="img-fluid" />
                              &nbsp;
                              Group Meeting
                            </div>
                          </Link>
                        </div>
                        }
                  </Row>

                      <div className="col-md-12 col-xl-12" style={{marginBottom: '10px'}}>
                          <InputGroup className="mb-3" style={{background:'#FFF'}}>
                            <InputGroup.Prepend>
                              <InputGroup.Text id="basic-addon1">
                                <i className="fa fa-search"></i>
                              </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                              style={{background:'#FFF'}}
                              onChange={this.filterMeeting}
                              placeholder="Filter"
                              aria-describedby="basic-addon1"
                            />
                            <InputGroup.Append style={{cursor: 'pointer'}}>
                              <InputGroup.Text id="basic-addon2">Pencarian</InputGroup.Text>
                            </InputGroup.Append>
                          </InputGroup>
                      </div>

                  <Row>
                    <div className="col-md-12">
                        <button className="btn btn-ideku" onClick={this.handleCreateMeeting.bind(this)}><i className="fa fa-plus"></i> Buat Group Meeting</button>
                    </div>
                  </Row>
                  <Row>
                    <div className="col-md-12">
                      <h3 className="f-20 f-w-800">
                        Meeting Aktif
                      </h3>
                    </div>
                  </Row>
                  <div>
                    {
                      classRoomsActive.length ?
                        
                        <ClassRooms list={classRoomsActive} />
                        
                        :
                        <div className="col-md-3 col-xl-3 mb-3">
                          Tidak ada meeting aktif
                        </div>
                    }
                  </div>
                  <Row>
                    <div className="col-md-12">
                      <h3 className="f-20 f-w-800">
                        Meeting Tidak Aktif
                      </h3>
                    </div>
                  </Row>
                  <div>
                    {
                      classRooms.length ?
                        
                        <ClassRooms list={classRooms} />
                        
                        :
                        <div className="col-md-3 col-xl-3 mb-3">
                          Tidak ada meeting
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
                        {this.state.classId ? 'Ubah Group Meeting' : 'Membuat Group Meeting'}
                      </Modal.Title>

                      <Form>
                        <Form.Group controlId="formJudul">
                          <img
                            alt="media"
                            src={
                              this.state.cover == null || this.state.cover == ''
                                ? "/assets/images/component/placeholder-image.png"
                                :
                                this.state.imgPreview
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
                            Judul Meeting
                          </Form.Label>
                          <FormControl
                            type="text"
                            placeholder="Judul"
                            value={this.state.roomName}
                            onChange={e =>
                              this.setState({ roomName: e.target.value })
                            }
                          />
                          <Form.Text className="text-muted">
                            Judul tidak boleh menggunakan karakter spesial
                          </Form.Text>
                        </Form.Group>

                        {/* <Form.Group controlId="formJudul">
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
                        </Form.Group> */}

                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Moderator
                          </Form.Label>
                          <MultiSelect
                            id="moderator"
                            options={this.state.optionsModerator}
                            value={this.state.valueModerator}
                            onChange={valueModerator => this.setState({ valueModerator })}
                            mode="single"
                            enableSearch={true}
                            resetable={true}
                            valuePlaceholder="Pilih Moderator"
                          />
                          <Form.Text className="text-muted">
                            Pengisi kelas, moderator, atau speaker.
                          </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Private Meeting
                          </Form.Label>
                          <div style={{width:'100%'}}>
                           <ToggleSwitch checked={false} onChange={this.toggleSwitch.bind(this)} checked={this.state.private} />
                          </div>
                          <Form.Text className="text-muted">
                            {
                              this.state.private ? 'Hanya orang yang didaftarkan sebagai peserta yang bisa bergabung pada meeting.'
                              :
                              'Meeting room bersifat terbuka. Semua user dapat bergabung.'
                            }
                          </Form.Text>
                        </Form.Group>
                        {
                        this.state.private &&
                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Peserta
                          </Form.Label>
                          <MultiSelect
                            id="peserta"
                            options={this.state.optionsPeserta}
                            value={this.state.valuePeserta}
                            onChange={valuePeserta => this.setState({ valuePeserta })}
                            mode="tags"
                            removableTags={true}
                            hasSelectAll={true}
                            selectAllLabel="Pilih Semua"
                            enableSearch={true}
                            resetable={true}
                            valuePlaceholder="Pilih Peserta"
                          />
                          <Form.Text className="text-muted">
                            Pilih peserta untuk private meeting.
                          </Form.Text>
                        </Form.Group>
                        }

                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Scheduled Meeting
                          </Form.Label>
                          <div style={{width:'100%'}}>
                           <ToggleSwitch checked={false} onChange={this.toggleSwitchScheduled.bind(this)} checked={this.state.scheduled} />
                          </div>
                          <Form.Text className="text-muted">
                            {
                              this.state.scheduled ? 'Meeting terjadwal.'
                              :
                              'Meeting tidak terjadwal. Selalu dapat diakses.'
                            }
                          </Form.Text>
                        </Form.Group>
                        {
                          this.state.scheduled &&
                          <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Waktu
                          </Form.Label>
                          <div style={{width:'100%'}}>
                          <DatePicker
                            selected={this.state.startDate}
                            onChange={this.handleChangeDateFrom}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm"
                          />
                          &nbsp;&mdash;&nbsp;
                          <DatePicker
                            selected={this.state.endDate}
                            onChange={this.handleChangeDateEnd}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm"
                          />
                          </div>
                          <Form.Text className="text-muted">
                            Pilih waktu meeting akan berlangsung.
                          </Form.Text>
                        </Form.Group>
                        }

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