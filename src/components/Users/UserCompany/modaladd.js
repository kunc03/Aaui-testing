import React, { Component } from "react";
import { Form } from 'react-bootstrap';
import API, { API_SERVER } from '../../../repository/api';

class ModalAdd extends Component {

  constructor(props) {
    super(props);

    this.onChangeNama = this.onChangeNama.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeLogo = this.onChangeLogo.bind(this);
    this.onClickSimpan = this.onClickSimpan.bind(this);

    this.state = {
      nama: '',
      status: '',
      logo: ''
    }
  }

  onClickSimpan = e => {
    e.preventDefault();
    const { triggerUpdate } = this.props;
    let dateNow = new Date();

    let formData = new FormData();
    formData.append('company_name', this.state.nama);
    formData.append('status', this.state.status);
    formData.append('logo', this.state.logo);
    formData.append('validity', dateNow.toISOString().split('T')[0]);

    let linkURL = `${API_SERVER}v1/company`;
    API.post(linkURL, formData).then(res => {
      console.log(res)
      API.get(`${linkURL}/${res.data.result.insertId}`).then(res => {
        triggerUpdate(res.data.result);
        this.setState({ nama: '', status: '', logo: ''});
      });
    }).catch((err) => {
      console.log(err);
    })
  }

  onChangeNama = e => {
    this.setState({ nama: e.target.value });
  }

  onChangeStatus = e => {
    this.setState({ status: e.target.value });
  }

  onChangeLogo = e => {
    this.setState({ logo: e.target.files[0] });
  }

  render() {
    const statusCompany = ['active','nonactive'];
    return (
      <div
        id="modalAdd"
        className="modal fade"
        tabIndex={-1}
        role="dialog"
        aria-labelledby="editModal"
        aria-hidden="true"
      >
        <div
          className="modal-dialog modal-dialog-centered modal-lg"
          role="document"
        >
          <div
            className="modal-content b-r-15"
            style={{ padding: "30px 50px" }}
          >
            <div
              className="modal-header p-b-0"
              style={{ borderBottom: "0 !important" }}
            >
              <h5
                className="modal-title p-t-0 f-21 f-w-bold text-c-black"
                id="exampleModalCenterTitle"
              >
                Tambah Company
              </h5>
            </div>
            <div className="modal-body">
              <Form>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Nama Company
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="nama company"
                    onChange={this.onChangeNama}
                    value={this.state.nama}
                  />
                </div>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Status Company
                  </label>
                  <br/>
                  <div onChange={this.onChangeStatus}>
                    {
                      statusCompany.map(item => {
                        return (
                          <Form.Check name='status' inline label={item} type='radio' value={item} />
                        );
                      })
                    }
                  </div>
                </div>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Logo Company
                  </label>
                  <input
                    type="file"
                    onChange={this.onChangeLogo}
                    className="form-control"
                    accept="image/*"
                  />
                </div>
              </Form>
            </div>
            <div
              className="modal-footer p-b-0"
              style={{ borderTop: "0 !important" }}
            >
              <button
                type="button"
                onClick={this.onClickSimpan}
                className="btn btn-primary btn-block f-18 f-w-bold openalertedit"
              >
                Simpan
              </button>
            
              <button
                type="button"
                className="btn btn-block bg-c-white text-c-grey3 f-18 f-w-bold"
                data-dismiss="modal"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ModalAdd;
