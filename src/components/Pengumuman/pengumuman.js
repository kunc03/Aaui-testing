import React, { Component } from "react";

import { Link } from "react-router-dom";
import Storage from '../../repository/storage';
import {
   Modal, FormControl, Form
} from 'react-bootstrap';
import API, { API_SERVER } from '../../repository/api';

class PengumumanTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      grup: [],
      isCreateModal: false,
      delete: {
        modal: false,
        id: ''
      }
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
    this.setState({ delete: { modal: !this.state.delete.modal, id: e.target.getAttribute('data-id') }});
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

  createModalPengumuman() {
    this.setState({ isCreateModal: true});
  };

  closeClassModal = e => {
    this.setState({ isCreateModal: false});
  }

  render() {
    let { grup } = this.state;
    let statusCompany = ['active', 'nonactive'];

    let linkCompany = '';
    if(Storage.get('user').data.level === 'superadmin') {
      linkCompany = '/company-detail-super';
    } else {
      linkCompany = '/company-detail';
    }

    const Item = ({ item }) => (
      <li>
        <div className="card" style={{marginBottom:10}}>
          <div
            className="card-block"
            style={{ padding: "10px 25px" }}
          >
            <div className="row d-flex align-items-center">
              <div className="col-sm-1">
                    <input type="checkbox"/> &nbsp; &nbsp; 
                    <img
                      src='newasset/flag-active.svg'
                    />
              </div>
              <div className="col-sm-2">
                    <small className="f-w-600 f-16 text-c-grey2 ">
                      Ethel Bharet
                    </small>
                    <Link to={`${linkCompany}/${item.company_id}`}>
                    </Link>
              </div>
              <div className="col-sm-3">
                    <small className="f-w-600 f-14 text-c-grey2 ">
                    PERHATIAN! Untuk semua Guru! - 
                    </small>
              </div>
              <div className="col-sm-3">
                    <small className="f-w-600 f-14 text-c-grey-t ">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt...
                    </small>
              </div>
              <div className="col-sm-2 text-right">
              10:47 AM &nbsp; 11/24/2020 &nbsp;
              </div>
              <div className="col-sm-1 text-right">
                <p className="m-b-0">
                
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
      
      
        <div className="row">
          <div className="col-sm-12">
            <h3 className="f-24 fc-skyblue f-w-800 mb-3">
              Pengumuman Sekolah
            </h3>
          </div>

          <div className="col-sm-12 mb-3 mt-2">
            
              <button
                  className="btn btn-icademy-primary"
                  style={{ padding: "7px 8px !important", marginLeft:14 }}
                  onClick={this.createModalPengumuman.bind(this)}
                  >
                  <i className="fa fa-plus"></i>
                  
                  Buat Pengumuman
              </button>

              <button className="btn btn-transparent"> Belum di baca </button>
              <button className="btn btn-transparent-disabled"> Belum dibaca </button>
              <button className="btn btn-transparent-disabled"> Semua pesan </button>
              <button className="btn btn-transparent-disabled"> Flagging </button>


              <span className="float-right">5 Pesan Belum dibaca</span>
            
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
              <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
                Buat Pengumuman Baru
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="formJudul">
                  <Form.Label className="f-w-bold">
                    Judul Pengumuman
                  </Form.Label>
                  <FormControl
                    type="text"
                    placeholder="Tulis Judul Disini"
                  />
                </Form.Group>

                <Form.Group controlId="formisi">
                  <Form.Label className="f-w-bold">
                    isi Pengumuman
                  </Form.Label>
                  <textarea class="form-control" id="exampleFormControlTextarea1" rows="8"></textarea>
                </Form.Group>

                <Form.Group controlId="formisi">
                  <Form.Label className="fc-skyblue f-w-bold">
                    Penerima
                  </Form.Label><br/>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
                    <label className="form-check-label" for="inlineCheckbox1">Principal</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2" />
                    <label className="form-check-label" for="inlineCheckbox2">Guru</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" id="inlineCheckbox1" value="option1" />
                    <label className="form-check-label" for="inlineCheckbox1">Parents</label>
                  </div>
                  <div className="form-check form-check-inline">
                    <input className="form-check-input" type="checkbox" id="inlineCheckbox2" value="option2" />
                    <label className="form-check-label" for="inlineCheckbox2">Murid</label>
                  </div>
                </Form.Group>
              </Form>
              
            </Modal.Body>
            <Modal.Footer>
              
              <button
                className="btn project-info"
                onClick={this.onSubmitForm}
              >
                <i className="fa fa-paper-plane"></i>
                Kirim Pengumuman
              </button>
            </Modal.Footer>
          </Modal>

        </div>
      
    
    );
  }
}

export default PengumumanTable;
