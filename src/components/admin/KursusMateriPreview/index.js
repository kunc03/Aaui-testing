import React, { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import ModalAdd from "./modaladd";
import ModalEdit from "./modaledit";
import { Link } from "react-router-dom";
import Storage from '../../../repository/storage';

import API, { API_SERVER } from '../../../repository/api';

class KursusMateriPreview extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grup: [],
      isOpen: false,
      delete: {
        modal: false,
        id: ''
      },
      idCourse: ''
    };
  }

  toggleModal = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };

  closeModalAdd = e => this.setState({ isOpen: e });

  triggerUpdate = e => this.setState({
    grup: [...this.state.grup, e]
  })

  /* action for delete */

  isToggleDelete = e => {
    this.setState({ delete: { modal: !this.state.delete.modal, id: e.target.getAttribute('data-id') } });
  }
  isToggleEdit(id) {
    console.log(id);
    this.setState({ idCourse: id });
  }

  handleClose = e => {
    this.setState({ delete: { modal: false, id: '' } });
  }

  onClickDelete = e => {
    e.preventDefault();
    let linkURL = `${API_SERVER}v1/chapter/${this.state.delete.id}`;
    API.delete(linkURL).then(res => {
      console.log(res.data);
      this.setState({
        grup: this.state.grup.filter(item => { return item.chapter_id != this.state.delete.id }),
        delete: { modal: false, id: '' }
      });
    }).catch(err => {
      console.log(err);
    });
  }

  componentDidMount() {
    let link = `${API_SERVER}v1/chapter`;
    API.get(link).then(response => {
      console.log(response)
      this.setState({ grup: response.data.result });
    }).catch(function (error) {
      console.log(error);
    });
  }

  render() {
    let { grup } = this.state;

    const Item = ({ item }) => (
      <li>
        <div className="card">
          <div
            className="card-block"
            style={{ padding: "25px 30px !important" }}
          >
            <div className="row d-flex align-items-center">
              <div className="col-xl-2 col-md-12">
                <div className="row align-items-center justify-content-center">
                  <div className="col">
                    <img
                      width="80px"
                      src={item.chapter_video}
                      alt="Logo"
                    />
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-md-12">
                <div className="row align-items-center justify-content-center">
                  <div className="col">
                    <small className="f-w-600 f-16 text-c-grey-t ">
                      Chapter Title
                    </small>

                    <h5 className="f-w-bold f-20 text-c-purple3">
                      {item.chapter_title}
                    </h5>

                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-md-12">
                <div className="row align-items-center justify-content-center">
                  <div className="col">
                    <small className="f-w-600 f-16 text-c-grey-t ">
                      Chapter Body
                    </small>
                    <h5 className="f-w-bold f-20 text-c-purple3">
                      {item.chapter_body}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-md-12">
                <div className="row align-items-center justify-content-center">
                  <div className="col">
                    <small className="f-w-600 f-16 text-c-grey-t ">
                      Chapter Number
                    </small>
                    <h5 className="f-w-bold f-20 text-c-purple3">
                      {item.chapter_number}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-md-12 text-right">
                <p className="m-b-0">
                  <a
                    href="#"
                    data-toggle="modal"
                    data-target="#modalEdit"
                    onClick={this.isToggleEdit.bind(this, item.chapter_id)}
                  >
                    <img
                      src="assets/images/component/Edit-1.png"
                      className="img-icon-edit m-r-10"
                      alt="Edit"
                      data-id={item.chapter_id}

                    />
                  </a>
                  &nbsp; &nbsp;
                  <a
                    href="#"
                    title="Delete"
                    data-toggle="modal"
                    data-target="#modalDelete"
                  >
                    <img
                      src='assets/images/component/Delete-1.png'
                      className="img-icon-delete"
                      data-id={item.chapter_id}
                      onClick={this.isToggleDelete}
                      alt="Delete"
                    />
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </li>
    );

    const Lists = ({ lists }) => (
      <ul className="list-cabang">
        {lists.map(list => (
          <Item key={list.chapter_id} item={list} />
        ))}
      </ul>
    );

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-xl-12">
                      <h3 className="f-24 f-w-800 mb-3">
                        Kursus Materi (Preview)
                      </h3>
                      <a
                        href="#"
                        className="btn btn-ideku f-14 float-right mb-3"
                        style={{ padding: "7px 25px !important" }}
                        data-toggle="modal"
                        data-target="#modalAdd"
                      >
                        <img
                          src="assets/images/component/person_add.png"
                          className="button-img"
                          alt=""
                        />
                        Add New
                      </a>
                    </div>
                    <div className="col-xl-12">
                      <div style={{ overflowX: "auto" }}>
                        <Lists lists={grup} />
                      </div>
                    </div>

                    <ModalAdd
                      show={this.state.isOpen}
                      onClose={this.toggleModal}
                      closeModalAdd={this.closeModalAdd}
                      triggerUpdate={this.triggerUpdate}></ModalAdd>

                    <ModalEdit
                      show={this.state.isOpen}
                      onClose={this.toggleModal}
                      closeModalAdd={this.closeModalAdd}
                      triggerUpdate={this.triggerUpdate}
                      idCourse={this.state.idCourse}></ModalEdit>

                    <Modal show={this.state.delete.modal} onHide={this.handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title className="text-c-purple3 f-w-bold">Hapus Company</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p className="f-w-bold">Apakah anda yakin untuk menghapus company ini ?</p>
                        <button type="button"
                          onClick={this.onClickDelete}
                          className="btn btn-block btn-ideku f-w-bold">
                          Hapus
                        </button>
                        <button type="button"
                          className="btn btn-block f-w-bold"
                          onClick={this.handleClose}>
                          Tidak
                        </button>
                      </Modal.Body>
                    </Modal>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default KursusMateriPreview;
