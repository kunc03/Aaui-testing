import React from 'react';
import API, { USER_ME, API_SERVER, APPS_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';
import { Modal } from 'react-bootstrap';
import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';
import SocketContext from '../../socket';

class PtcClasses extends React.Component {

  state = {
    ptc: [],
    rapat: [],

    openParticipants: false,
    ptcId: '',
    participants: [],
    getPtc: {},
    optionsName: [],
    pesertaId: [],

  };

  componentDidMount() {
    this.fetchNotif();
    this.fetchOptionNames();
  }

  openParticipants = e => {
    e.preventDefault()
    let dataId = e.target.getAttribute('data-id');
    console.log('ptcId: ', dataId)
    let getPtc = this.state.ptc.filter(item => item.ptc_id === parseInt(dataId));
    this.fetchParticipants(dataId);
    this.setState({ openParticipants: true, ptcId: dataId })
  }

  deletePtc = e => {
    e.preventDefault()
    let idPtc = e.target.getAttribute('data-id');
    API.delete(`${API_SERVER}v1/ptc-room/delete/${idPtc}`).then(res => {
      if (res.data.error) console.log('Error: ', res.data.result);

      this.fetchNotif();
    })
  }

  deleteParticipants = e => {
    e.preventDefault();
    API.delete(`${API_SERVER}v1/ptc-room/peserta/delete/${e.target.getAttribute('data-id')}`).then(res => {
      if (res.data.error) console.log('Error: delete data')

      this.fetchParticipants(this.state.ptcId);
      this.fetchNotif();
    })
  }

  addParticipant = e => {
    e.preventDefault();
    let form = {
      room_id: this.state.ptcId,
      group_id: Storage.get('user').data.grup_id,
      user_id: this.state.pesertaId[0],
      peserta: 0
    };

    console.log('form: ', form)

    API.post(`${API_SERVER}v1/add/ptc-room/peserta`, form).then(res => {
      if (res.data.error) console.log('Error: cannot add participants');

      this.fetchNotif();
      this.fetchParticipants(this.state.ptcId);
      this.setState({ pesertaId: [] })
      this.props.socket.emit('send', { companyId: Storage.get('user').data.company_id })
    })
  }

  fetchParticipants(id) {
    API.get(`${API_SERVER}v1/ptc-room/peserta/${id}`).then(res => {
      if (res.data.error) console.log('Error: fetch peserta')

      this.setState({ participants: res.data.result })
    })
  }

  fetchNotif() {
    API.get(`${API_SERVER}v1/ptc-room/company/${Storage.get('user').data.company_id}`).then(res => {
      if (res.data.error) console.log('Error: ', res.data.result);

      this.setState({ ptc: res.data.result })
    });

    let rapat = [
      { nama_ruangan: 'Rapat T1', peserta: [{ id: 4, name: "Kepala Sekolah" }, { id: 2, name: "Guru" }], status: "Private", waktu: "08:30", tanggal: "20 Oktober 2020", total: 10 },
      { nama_ruangan: 'Rapat T2', peserta: [{ id: 2, name: "Guru" }], status: "Private", waktu: "08:00", tanggal: "16 Oktober 2020", total: 15 },
    ];

    this.setState({ rapat })
  }

  fetchOptionNames() {
    API.get(`${API_SERVER}v1/user/company/${Storage.get('user').data.company_id}`).then(response => {
      response.data.result.map(item => {
        if (item.grup_name.toLowerCase() === "parents") {
          this.state.optionsName.push({
            value: item.user_id,
            label: `${item.name} - ${item.identity} - ${item.email}`
          });
        }
      });
    })
  }

  closeModal() {
    this.setState({
      openParticipants: false,
      ptcId: '',
    })
  }

  render() {
    console.log('state: ', this.state);
    return (
      <>
        <div className="floating-back">
          <Link to={`/`}>
            <img
              src={`newasset/back-button.svg`}
              alt=""
              width={90}
            />
          </Link>
        </div>

        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header header-kartu">
                Parent Teacher Conference (PTC)

              <Link to={`/ptc/create/ptc`} className="btn btn-v2 btn-primary float-right" style={{ margin: 0 }}>
                  <i className="fa fa-plus"></i> Add
              </Link>
              </div>
              <div className="card-body" style={{ padding: 0 }}>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Room Name</th>
                      <th>Moderator</th>
                      <th>Status</th>
                      <th>Time </th>
                      <th> Date </th>
                      <th className="text-center"> Participants </th>
                      <th className="text-center"> Action </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.ptc.map((item, i) => (
                        <tr>
                          <td>{item.nama_ruangan}</td>
                          <td>{item.name}</td>
                          <td>{item.is_private ? "Private" : "Public"}</td>
                          <td>{item.waktu_mulai}</td>
                          <td>{moment(item.tanggal_mulai).format('DD/MM/YYYY')}</td>
                          <td className="text-center">
                            <button data-id={item.ptc_id} onClick={this.openParticipants} className="btn btn-v2 btn-default ml-2">{item.peserta.length} Participants</button>
                          </td>
                          <td className="text-center">
                            {
                              Date.parse(item.tanggal_mulai) >= new Date() &&
                              <button className="btn btn-v2 btn-primary">Masuk</button>
                            }
                            {
                              Date.parse(item.tanggal_mulai) <= new Date() &&
                              <button className="btn btn-v2 btn-default ml-2">Riwayat</button>
                            }
                            <Link to={`/ptc/update/ptc/${item.ptc_id}`}>
                              <i className="fa fa-edit ml-2"></i>
                            </Link>
                            <i onClick={this.deletePtc} data-id={item.ptc_id} className="fa fa-trash ml-2" style={{ cursor: 'pointer' }}></i>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {
            /**
  
          <div className="col-sm-12">
            <div className="card">
              <div className="card-header header-kartu">
                Rapat Reguler Internal
  
                <Link to={`/ptc/create/rapat`} className="btn btn-v2 btn-primary float-right" style={{margin: 0}}>
                  <i className="fa fa-plus"></i> Add
                </Link>
              </div>
              <div className="card-body" style={{padding: 0}}>
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Room Name</th>
                      <th> Participants </th>
                      <th>Status</th>
                      <th>Time </th>
                      <th> Date </th>
                      <th>Total</th>
                      <th className="text-center"> Action </th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      this.state.rapat.map((item, i) => (
                        <tr>
                          <td>{item.nama_ruangan}</td>
                          <td>
                            <ul>
                            {
                              item.peserta.map(item => (
                                <li>{item.name}</li>
                              ))
                            }
                            </ul>
                          </td>
                          <td>{item.status}</td>
                          <td>{item.waktu}</td>
                          <td>{item.tanggal}</td>
                          <td>{item.total}</td>
                          <td className="text-center">
                            <button className="btn btn-v2 btn-primary">Masuk</button>
                            <button className="btn btn-v2 btn-default ml-2">Riwayat</button>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
  
            */
          }
        </div>

        <Modal show={this.state.openParticipants} onHide={() => this.closeModal()} dialogClassName="modal-lg">
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Add Participants
          </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="form-group">
              <label> Find Participants</label>
              <div class="input-group">
                <MultiSelect
                  id={`userId`}
                  options={this.state.optionsName}
                  value={this.state.pesertaId}
                  onChange={pesertaId => this.setState({ pesertaId })}
                  mode="single"
                  enableSearch={true}
                  resetable={true}
                  valuePlaceholder="Select Participants "
                  allSelectedLabel="All"
                />
                <span className="input-group-btn">
                  <button onClick={this.addParticipant} className="btn btn-default">
                    <i className="fa fa-plus"></i> Add
                </button>
                </span>
              </div>
            </div>

            <table className="table table-striped">
              <thead>
                <tr>
                  <th>
                    No
                </th>
                  <th> Name </th>
                  <th>Email</th>
                  <th> Attendance</th>
                  <th> Date </th>
                  <th className="text-center"></th>
                </tr>
              </thead>
              <tbody>
                {
                  this.state.participants.map((item, i) => (
                    <tr key={i}>
                      <td>
                        {i + 1}
                      </td>
                      <td>{item.name}</td>
                      <td>{item.email}</td>
                      <td>{item.is_confirm ? "Sudah Konfirmasi" : "Belum Konfirmasi"}</td>
                      <td>{moment(item.created_at).format('DD/MM/YYYY HH:mm')}</td>
                      <td>
                        <i onClick={this.deleteParticipants} data-id={item.id} className="fa fa-trash ml-2" style={{ cursor: 'pointer' }}></i>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </Modal.Body>
        </Modal>
      </>
    )
  }
}

const PtcClass = props => (
  <SocketContext.Consumer>
    {socket => <PtcClasses {...props} socket={socket} />}
  </SocketContext.Consumer>
)


export default PtcClass;
