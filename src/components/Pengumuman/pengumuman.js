import React, { Component } from "react";

import { Link } from "react-router-dom";
import Storage from '../../repository/storage';
import SocketContext from '../../socket';
import {
  Modal, FormControl, Form
} from 'react-bootstrap';
import API, { API_SERVER, API_SOCKET } from '../../repository/api';

import { toast } from 'react-toastify';
import moment from 'moment-timezone';

class PengumumanTableClass extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grup: [],
      isCreateModal: false,
      isAdd: true,
      delete: {
        modal: false,
        id: ''
      },

      companyId: Storage.get('user').data.company_id,
      judul: '',
      isi: '',
      penerima: [],
      attachments: [],

      files: null,

      roles: [],

      level: Storage.get('user').data.level
    };
  }

  toggleModal = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  closeModalAdd = e => { console.log(e); this.setState({ isOpen: e }) };

  triggerUpdate = e => this.setState({
    grup: [...this.state.grup, e]
  })

  /* action for delete */

  isToggleDelete = e => {
    this.setState({ delete: { modal: !this.state.delete.modal, id: e.target.getAttribute('data-id') } });
  }

  fetchPengumuman() {
    let url = null;
    if (this.state.level === "admin" || this.state.level === "superadmin") {
      url = `${API_SERVER}v1/pengumuman/company/${this.state.companyId}`;
    } else {
      url = `${API_SERVER}v1/pengumuman/role/${Storage.get('user').data.grup_id}`;
    }

    API.get(url).then(response => {
      console.log('RES: ', response.data)
      this.setState({ grup: response.data.result.reverse() });
    }).catch(function (error) {
      console.log(error);
    });
  }

  fetchRole() {
    API.get(`${API_SERVER}v1/grup/company/${this.state.companyId}`).then(res => {
      if (res.data.error) {
        toast.warning("Error, fetch data role")
      }
      res.data.result.map(item => item.isChecked = false);
      this.setState({ roles: res.data.result })
    })
  }

  onClickDelete = e => {
    e.preventDefault();
    API.delete(`${API_SERVER}v1/pengumuman/delete/${e.target.getAttribute('data-id')}`).then(res => {
      if (res.data.error) toast.danger("Gagal hapus pengumuman");

      this.fetchPengumuman();
    })
  }

  componentDidMount() {
    this.fetchPengumuman();
    this.fetchRole();

    this.props.socket.on('broadcast', data => {
      if (data.companyId == Storage.get('user').data.company_id) {
        this.fetchPengumuman();
      }
    })
  }

  closeClassModal = e => {
    this.setState({ isAdd: true, isCreateModal: false, judul: '', isi: '', penerima: [], attachments: [] });
    this.fetchRole();
  }

  onSubmitForm = e => {
    e.preventDefault();
    let form = {
      companyId: this.state.companyId,
      title: this.state.judul,
      isi: this.state.isi,
      penerima: this.state.penerima.toString()
    }

    API.post(`${API_SERVER}v1/pengumuman/create`, form).then(res => {
      if (res.data.error) {
        toast.warning("Failed to fetch the announcement")
      }

      if (this.state.files) {
        let formdata = new FormData();
        for (var i = 0; i < this.state.files.length; i++) {
          formdata.append('files', this.state.files[i]);
        }

        API.put(`${API_SERVER}v1/pengumuman/files/${res.data.result.id_pengumuman}`, formdata).then(res => {
          if (res.data.error) console.log("Error: upload files");
        })
      }

      this.props.socket.emit('send', { companyId: Storage.get('user').data.company_id })

      this.fetchPengumuman();
      this.setState({ isAdd: true, isCreateModal: false, judul: '', isi: '', penerima: [], attachments: [] });
      this.fetchRole();
    })
  }

  handleCheckBox = e => {
    let value = e.target.value;
    let checked = e.target.checked;

    let copyRoles = [...this.state.roles];
    let dataPenerima = [...this.state.penerima];

    copyRoles.forEach(item => {
      if (parseInt(item.grup_id) == parseInt(value)) {
        item.isChecked = checked;
        if (checked) {
          dataPenerima.push(value);
        }
        else {
          let cc = dataPenerima.filter(e => e != value)
          dataPenerima = cc;
        }

      }
    })
    this.setState({ roles: copyRoles, penerima: dataPenerima })
  }

  createModalPengumuman() {
    this.setState({ isCreateModal: true });
  };

  selectPengumuman = e => {
    e.preventDefault();
    let id = e.target.getAttribute('data-id');
    API.get(`${API_SERVER}v1/pengumuman/${id}`).then(res => {
      if (res.data.error) console.log("Error: fetch pengumuman");

      let attachments = res.data.result.attachments ? res.data.result.attachments.split(',') : [];
      let getRoles = [...this.state.roles];
      let getPenerima = res.data.result.penerima.split(",").map(x => parseInt(x));

      let filtered = getRoles.filter(item => getPenerima.includes(item.grup_id));
      filtered.map(item => item.isChecked = true)

      this.setState({
        isCreateModal: true,
        isAdd: false,
        judul: res.data.result.title,
        isi: res.data.result.isi,
        penerima: res.data.result.penerima,
        attachments: attachments,
        roles: filtered
      })
    })
  }

  render() {
    console.log('state: ', this.state);

    let { grup, roles } = this.state;
    let statusCompany = ['active', 'nonactive'];

    let linkCompany = '';
    if (Storage.get('user').data.level === 'superadmin') {
      linkCompany = '/company-detail-super';
    } else {
      linkCompany = '/company-detail';
    }

    const Item = ({ item }) => (
      <li>
        <div className="card" style={{ marginBottom: 10 }}>
          <div
            className="card-block"
            style={{ padding: "10px 25px" }}
          >
            <div className="row d-flex align-items-center">
              <div className="col-sm-2">
                <small className="f-w-600 f-16 text-c-grey2 ">
                  <ul>
                    {item.penerima.map(item => (
                      <li>{item.grup_name}</li>
                    ))}
                  </ul>
                </small>
              </div>
              <div className="col-sm-3">
                <small className="f-w-600 f-14 text-c-grey2 ">
                  {item.title}
                </small>
              </div>
              <div className="col-sm-3">
                <small className="f-w-600 f-14 text-c-grey-t ">
                  {item.isi}
                </small>
              </div>
              <div className="col-sm-2 text-right">
                {moment(item.created_at).tz('Asia/Jakarta').format('hh:mm A')} &nbsp;
              {moment(item.created_at).tz('Asia/Jakarta').format('DD/MM/YYYY')}
              </div>
              <div className="col-sm-1 text-right">
                {
                  <i data-id={item.id_pengumuman}
                    onClick={this.selectPengumuman} style={{ cursor: 'pointer' }} className="fa fa-search mr-2"></i>
                }
                {
                  (this.state.level === "admin" || this.state.level === "superadmin") &&
                  <i
                    style={{ cursor: 'pointer' }}
                    className="fa fa-trash"
                    data-id={item.id_pengumuman}
                    onClick={this.onClickDelete}
                  ></i>
                }
              </div>
            </div>
          </div>
        </div>
      </li>
    );

    const Lists = ({ lists }) => (
      <ul className="list-cabang">
        <li>
          <div className="card" style={{ marginBottom: 10 }}>
            <div
              className="card-block"
              style={{ padding: "10px 25px" }}
            >
              <div className="row d-flex align-items-center">
                <div className="col-sm-2">
                  <small className="f-w-600 f-16 text-c-grey2 ">
                    Penerima
                  </small>
                </div>
                <div className="col-sm-3">
                  <small className="f-w-600 f-14 text-c-grey2 ">
                    Judul
                  </small>
                </div>
                <div className="col-sm-3">
                  <small className="f-w-600 f-14 text-c-grey-t ">
                    Deskripsi
                  </small>
                </div>
                <div className="col-sm-2 text-right">
                  Tanggal
                </div>
                <div className="col-sm-1 text-right">

                </div>
              </div>
            </div>
          </div>
        </li>
        {lists.map(list => (
          <Item key={list.pengumuman_id} item={list} />
        ))}
      </ul>
    );

    const levelUser = ["admin","superadmin"];
    const grupUser = ["principal", "management"];

    return (

      <div className="row">
        <div className="col-sm-12">
          <h3 className="f-24 fc-skyblue f-w-800 mb-3">
            School Announcement
            </h3>
        </div>

        <div className="col-sm-12 mb-3 mt-2">

          {
            (levelUser.includes(this.state.level) || grupUser.includes(Storage.get('user').data.grup_name ? Storage.get('user').data.grup_name.toLowerCase() : 'admin')) &&
            <button
              className="btn btn-icademy-primary"
              style={{ padding: "7px 8px !important", marginLeft: 14 }}
              onClick={this.createModalPengumuman.bind(this)}
            >
              <i className="fa fa-plus"></i>
              Make Announcement
            </button>
          }

          <span className="float-right">{this.state.grup.length} Announcement</span>

        </div>

        <div className="col-sm-12">
          <div style={{ overflowX: "auto" }}>
            <Lists lists={grup} />
          </div>
        </div>

        <Modal
          show={this.state.isCreateModal}
          onHide={this.closeClassModal}
          dialogClassName="modal-lg"
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}>
              Make a New Announcement
              </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formJudul">
                <Form.Label className="fc-skyblue f-w-bold">
                  Title
                  </Form.Label>
                <FormControl
                  type="text"
                  name="judul"
                  required
                  value={this.state.judul}
                  disabled={!this.state.isAdd ? 'disabled' : ''}
                  onChange={e => this.setState({ [e.target.name]: e.target.value })}
                  placeholder="Tulis Judul Disini"
                />
              </Form.Group>

              <Form.Group controlId="formisi">
                <Form.Label className="fc-skyblue f-w-bold">
                  Contents

                  </Form.Label>
                <textarea
                  className="form-control" id="exampleFormControlTextarea1" rows="8"
                  name="isi"
                  value={this.state.isi}
                  required
                  disabled={!this.state.isAdd ? 'disabled' : ''}
                  onChange={e => this.setState({ [e.target.name]: e.target.value })} />
              </Form.Group>

              <Form.Group controlId="formisi">
                <Form.Label className="fc-skyblue f-w-bold">
                  Receiver
                  </Form.Label><br />

                {
                  this.state.roles.map(item => (
                    <div className="form-check form-check-inline" key={item.grup_id}>
                      <input checked={item.isChecked} className="form-check-input" type="checkbox" onChange={this.handleCheckBox} value={item.grup_id} />
                      <label className="form-check-label" for="inlineCheckbox1">{item.grup_name}</label>
                    </div>
                  ))
                }

              </Form.Group>

              {
                this.state.isAdd &&
                <Form.Group>
                  <Form.Label className="fc-skyblue f-w-bold">Attachments</Form.Label>
                  <input type="file" multiple className="form-control" onChange={e => this.setState({ files: e.target.files })} />
                </Form.Group>
              }

              {
                !this.state.isAdd &&
                <Form.Group>
                  <Form.Label>Attachments</Form.Label>
                  <ul className="list-group">
                    {
                      this.state.attachments.length === 0 &&
                      <li className="list-group-item">
                        <a href="#">Tidak ada file attachments</a>
                      </li>
                    }
                    {
                      this.state.attachments && this.state.attachments.map(item => (
                        <li className="list-group-item">
                          <a href={item} target="_blank">{item}</a>
                          { /** <i className="fa fa-trash float-right" style={{cursor: 'pointer'}}></i> */}
                        </li>
                      ))
                    }
                  </ul>
                </Form.Group>
              }

            </Form>

          </Modal.Body>
          <Modal.Footer>

            {
              this.state.isAdd &&
              <button
                className="btn project-info"
                onClick={this.onSubmitForm}
              >
                <i className="fa fa-paper-plane"></i>
                Send Announcement
              </button>
            }
          </Modal.Footer>
        </Modal>

      </div>


    );
  }
}

const PengumumanTable = props => (
  <SocketContext.Consumer>
    {socket => <PengumumanTableClass {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default PengumumanTable;
