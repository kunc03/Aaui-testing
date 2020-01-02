import React, { Component } from "react";
import Modal from 'react-bootstrap/Modal';
import ModalAdd from "./modaladd";
import { Link } from "react-router-dom";

import API, { API_SERVER } from '../../../repository/api';

class UserCompany extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grup: [],
      isOpen: false,
      delete: {
        modal: false,
        id: ''
      }
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
    this.setState({ delete: { modal: !this.state.delete.modal, id: e.target.getAttribute('data-id') }});
  }

  handleClose = e => {
    this.setState({ delete: { modal: false, id: '' }});
  }

  onClickDelete = e => {
    e.preventDefault();
    let linkURL = `${API_SERVER}v1/company/${this.state.delete.id}`;
    API.delete(linkURL).then(res => {
      console.log(res.data);
      this.setState({ 
        grup: this.state.grup.filter(item => { return item.company_id != this.state.delete.id}),
        delete: { modal: false, id: ''}
      });
    }).catch(err => {
      console.log(err);
    });
  }

  componentDidMount() {
    let link = `${API_SERVER}v1/company`;
    API.get(link).then(response => {
      this.setState({ grup: response.data.result });
    }).catch(function(error) {
      console.log(error);
    });
  }

  render() {
    let { grup } = this.state;
    let statusCompany = ['active', 'nonactive'];

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
                      src={item.logo}
                      alt="Logo"
                    />
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-md-12">
                <div className="row align-items-center justify-content-center">
                  <div className="col">
                    <small className="f-w-600 f-16 text-c-grey-t ">
                      Company
                    </small>
                    <Link to={`/company-detail/${item.company_id}`}>
                      <h5 className="f-w-bold f-20 text-c-purple3">
                        {item.company_name}
                      </h5>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-md-12">
                <div className="row align-items-center justify-content-center">
                  <div className="col">
                    <small className="f-w-600 f-16 text-c-grey-t ">
                      Validity
                    </small>
                    <h5 className="f-w-bold f-20 text-c-purple3">
                      {item.validity.toString().substring(0, 10)}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-md-12">
                <div className="row align-items-center justify-content-center">
                  <div className="col">
                    <small className="f-w-600 f-16 text-c-grey-t ">
                      Status
                    </small>
                    <h5 className="f-w-bold f-20 text-c-purple3">
                      {item.status}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="col-xl-2 col-md-12 text-right">
                <p className="m-b-0">
                  <Link to={`/company-detail/${item.company_id}`}>
                    <img
                      src="assets/images/component/Edit-1.png"
                      className="img-icon-edit m-r-10"
                      alt="Edit"
                    />
                  </Link>
                  <a
                    href="#"
                    title="Delete"
                    data-toggle="modal"
                    data-target="#modalDelete"
                  >
                    <img
                      src='assets/images/component/Delete-1.png'
                      className="img-icon-delete"
                      data-id={item.company_id}
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
          <Item key={list.company_id} item={list} />
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
                        User Management (Company)
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
                        Tambah Baru
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

export default UserCompany;
