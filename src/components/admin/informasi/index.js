import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import { Editor } from '@tinymce/tinymce-react';
import Storage from '../../../repository/storage';
import Moment from "react-moment";

class InformasiAdmin extends Component {

  state = {
    companyId: '',
    informasiId: '',
    informasi: [],

    isModalAdd: false,
    judul: '',
    deskripsi: '',
    files: '',

    isModalRemove: false,

    isNotifikasi: false,
    isiNotifikasi: ''
  }

  onChangeInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === 'files') {
      if (target.files[0].size >= 0) {
        this.setState({ [name]: target.files });
      } else {
        target.value = null;
        this.handleCloseModal()
        this.setState({ isNotifikasi: true, isiNotifikasi: 'The file does not match the format, please check again.' })
      }
    } else {
      this.setState({ [name]: value });
    }
  }

  onChangeTinyMce = e => {
    this.setState({ deskripsi: e.target.getContent().replace(/'/g, "\\'") })
  }

  closeModal = e => {
    this.setState({
      isModalAdd: false,
      informasiId: '',
      judul: '',
      deskripsi: '',
      files: '',
      isModalRemove: false,
      isNotifikasi: false,
      isiNotifikasi: ''
    });
  }

  openModalAdd = e => {
    this.setState({ isModalAdd: true });
  }

  openModalEdit = e => {
    let informasiId = e.target.getAttribute('data-id');
    API.get(`${API_SERVER}v1/informasi/${informasiId}`).then(res => {
      if (res.status === 200) {
        this.setState({
          isModalAdd: true,
          informasiId: informasiId,
          company_id: res.data.result[0].company_id,
          judul: res.data.result[0].informasi_judul,
          deskripsi: res.data.result[0].informasi_deskripsi
        });
      }
    })
  }

  openModalRemove = e => {
    this.setState({ isModalRemove: true, informasiId: e.target.getAttribute('data-id') });
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if (res.status === 200) {
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });

        API.get(`${API_SERVER}v1/informasi/company/${res.data.result.company_id}`).then(res => {
          if (res.status === 200) {
            this.setState({ informasi: res.data.result });
          }
        });

      }
    });
  }

  onClickSubmitHapus = e => {
    e.preventDefault();
    API.delete(`${API_SERVER}v1/informasi/${e.target.getAttribute('data-id')}`).then(res => {
      if (res.status === 200) {
        this.closeModal();
        this.fetchData();
      }
    })
  }

  onClickSubmitSave = e => {
    e.preventDefault();

    if (this.state.informasiId == "") {
      // ACTION SAVE
      let form = {
        judul: this.state.judul,
        company: this.state.companyId,
        deskripsi: this.state.deskripsi
      };

      API.post(`${API_SERVER}v1/informasi`, form).then(res => {
        if (res.status === 200) {
          console.log('STATE: ', res.data)
          if (this.state.files.length != 0) {
            let formData = new FormData();
            for (let i = 0; i < this.state.files.length; i++) {
              formData.append('files', this.state.files[i]);
            }

            API.put(`${API_SERVER}v1/informasi/file/${res.data.result.informasi_id}`, formData).then(res => {
              if (res.status === 200) {
                console.log('Saved');
                this.fetchData();
              }
            });
          }

          this.fetchData();
          this.closeModal();
        }
      })
    }
    else {
      // ACTION EDIT
      let form = {
        judul: this.state.judul,
        company: this.state.companyId,
        deskripsi: this.state.deskripsi
      };

      API.put(`${API_SERVER}v1/informasi/${this.state.informasiId}`, form).then(res => {
        if (res.status === 200) {
          if (this.state.files.length != 0) {
            let formData = new FormData();
            for (let i = 0; i < this.state.files.length; i++) {
              formData.append('files', this.state.files[i]);
            }

            API.put(`${API_SERVER}v1/informasi/file/${this.state.informasiId}`, formData).then(res => {
              if (res.status === 200) {
                console.log('Saved');
                this.fetchData();
              }
            });

          }

          this.fetchData();
          this.closeModal();
        }
      })
    }

  }

  render() {

    //console.log('state: ', this.state);

    const Attachments = ({ lists }) => {
      let pecahFile = lists.split(',');
      if (pecahFile.length > 0) {
        if (pecahFile[0] == "null") {
          return (
            <div>No File</div>
          );
        } else {
          return (
            <div class="list-group">
              {
                pecahFile.map((item, i) => (
                  <a key={item} href={item} target="_blank" className="list-group-item list-group-item-action">File {i + 1}</a>
                ))
              }
            </div>
          );
        }
      } else {
        return (
          <div>No File</div>
        );
      }
    }

    const ListKursus = ({ lists }) => {
      if (lists.length === 0) {
        return (
          <tbody>
            <tr>
              <td colSpan={5}>No data available</td>
            </tr>
          </tbody>
        );
      } else {
        return (
          <tbody>
            {
              lists.map((item, i) => (
                <tr key={item.informasi_id}>
                  <td>{i + 1}</td>
                  <td>{item.informasi_judul}</td>
                  <td><Attachments lists={item.informasi_files} /></td>
                  <td><Moment format="DD/MM/YYYY">{item.created_at}</Moment></td>
                  <td>
                    <Link to="#" className="buttonku ml-2" title="Edit">
                      <i onClick={this.openModalEdit} data-id={item.informasi_id} className="fa fa-edit"></i>
                    </Link>
                    <Link to="#" className="buttonku ml-2" title="Hapus">
                      <i onClick={this.openModalRemove} data-id={item.informasi_id} className="fa fa-trash"></i>
                    </Link>
                  </td>
                </tr>
              ))
            }
          </tbody>
        );
      }
    };

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-xl-12">
                      <h3 className="f-24 f-w-800">Information</h3>

                      <div style={{ overflowX: "auto" }}>
                        <table className="table-curved" style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th className="text-center">NO</th>
                              <th> Title </th>
                              <th>Files</th>
                              <th>Created At</th>
                              <th className="text-center">
                                <Link
                                  onClick={this.openModalAdd}
                                  className="btn btn-ideku col-12 f-14"
                                  style={{ padding: "7px 8px !important" }}>
                                  <img
                                    src="assets/images/component/person_add.png"
                                    className="button-img"
                                    alt=""
                                  />
                                  Add New
                                </Link>
                              </th>
                            </tr>
                          </thead>

                          <ListKursus lists={this.state.informasi} />

                        </table>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Modal show={this.state.isModalAdd} onHide={this.closeModal}>
          <Modal.Body>
            <Modal.Title style={{ marginBottom: '20px' }} className="text-c-purple3 f-w-bold">Form Data</Modal.Title>

            <form className="form-vertical">
              <div className="form-group">
                <input type="text" onChange={this.onChangeInput} className="form-control" name="judul" value={this.state.judul} placeholder="Title Information" />
              </div>
              <div className="form-group">
                <Editor
                  apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                  initialValue={this.state.deskripsi}
                  init={{
                    height: 300,
                    menubar: false,
                    plugins: [
                      "advlist autolink lists link image charmap print preview anchor",
                      "searchreplace visualblocks code fullscreen",
                      "insertdatetime media table paste code help wordcount"
                    ],
                    toolbar:
                      "undo redo | formatselect | bold italic backcolor | \
                     alignleft aligncenter alignright alignjustify | \
                      bullist numlist outdent indent | removeformat | help"
                  }}
                  onChange={this.onChangeTinyMce}
                />
              </div>
              <div className="form-group">
                <label>Attachments</label>
                <input name="files" onChange={this.onChangeInput} className="form-control" type="file" multiple />
                <span>Bisa lebih dari satu file.</span>
              </div>
            </form>

            <button style={{ marginTop: '30px' }} type="button"
              onClick={this.onClickSubmitSave}
              className="btn btn-block btn-ideku f-w-bold">
              Simpan
            </button>
            <button type="button"
              className="btn btn-block f-w-bold"
              onClick={this.closeModal}>
              Tidak
            </button>
          </Modal.Body>
        </Modal>

        <Modal show={this.state.isModalRemove} onHide={this.closeModal}>
          <Modal.Body>
            <Modal.Title className="text-c-purple3 f-w-bold">Delete Information</Modal.Title>
            <p className="f-w-bold"> Are you sure you want to delete this information ?</p>

            <button style={{ marginTop: '50px' }} type="button"
              data-id={this.state.informasiId}
              onClick={this.onClickSubmitHapus}
              className="btn btn-block btn-ideku f-w-bold">
              Delete
            </button>
            <button type="button"
              className="btn btn-block f-w-bold"
              onClick={this.closeModal}>
              No
            </button>
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.isNotifikasi}
          onHide={this.closeModal}
        >
          <Modal.Body>
            <Modal.Title className="text-c-purple3 f-w-bold">
              Notification
            </Modal.Title>

            <p style={{ color: "black", margin: "20px 0px" }}>
              {this.state.isiNotifikasi}
            </p>

            <button
              type="button"
              className="btn btn-block f-w-bold"
              onClick={this.closeModal}
            >
              Understand
            </button>
          </Modal.Body>
        </Modal>

      </div>
    );
  }

}

export default InformasiAdmin;