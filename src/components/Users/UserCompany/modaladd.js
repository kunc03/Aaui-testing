import React, { Component } from "react";
import { Form } from 'react-bootstrap';
import API, { API_SERVER } from '../../../repository/api';

import ToggleSwitch from "react-switch";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class ModalAdd extends Component {

  constructor(props) {
    super(props);

    this.onChangeNama = this.onChangeNama.bind(this);
    this.onChangeStatus = this.onChangeStatus.bind(this);
    this.onChangeLogo = this.onChangeLogo.bind(this);
    this.onClickSimpan = this.onClickSimpan.bind(this);

    this.state = {
      nama: "",
      tipe: "",
      status: "active",
      logo: "",
      notif: "Pastikan file berformat png, jpeg, jpg, atau gif dan ukuran tidak melebihi 500KB",
      unlimited: false,
      validity: new Date()
    };
  }

  handleChangeValidity = date => {
    this.setState({
      validity: date
    });
  };

  toggleSwitch(checked) {
    this.setState({ unlimited: !this.state.unlimited });
  }

  onClickSimpan = e => {
    e.preventDefault();
    const { triggerUpdate } = this.props;

    if (this.state.nama && this.state.logo && this.state.tipe) {
      let unlimited = this.state.unlimited == false ? '1' : '0'
      let formData = new FormData();
      formData.append('company_name', this.state.nama);
      formData.append('company_type', this.state.tipe);
      formData.append('status', this.state.status);
      formData.append('unlimited', unlimited);
      formData.append('logo', this.state.logo);
      formData.append('validity', this.state.validity.toISOString().split('T')[0]);

      let linkURL = `${API_SERVER}v1/company`;
      API.post(linkURL, formData).then(res => {
        triggerUpdate(res.data.result);
        this.setState({ nama: '', status: '', logo: '' });
        window.$('#modalAdd').modal('hide');
        console.log('resss', res.data.result)
        console.log('reqqq', this.state.validate)
      }).catch((err) => {
        console.log(err);
      })
    }
  }

  onChangeNama = e => {
    this.setState({ nama: e.target.value });
  }

  onChangeTipe = e => {
    this.setState({ tipe: e.target.value });
  }

  onChangeStatus = e => {
    this.setState({ status: e.target.value });
  }

  onChangeLogo = e => {
    const target = e.target;
    if (target.files[0].size <= 500000) {
      this.setState({ logo: target.files[0] });
    } else {
      target.value = null;
      this.setState({ notif: "The file does not match the format, please check again." });
    }
  }

  render() {
    // const statusCompany = ['active','nonactive'];
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
                Add Company
              </h5>
            </div>
            <div className="modal-body">
              <Form>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Type Company
                  </label>
                  <select onChange={this.onChangeTipe} className="form-control" style={{ textTransform: "capitalize" }}>
                    <option value="">Pilih tipe company</option>
                    <option value="perusahaan">Perusahaan</option>
                    <option value="pendidikan">Pendidikan</option>
                  </select>
                </div>
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
                    Logo Company
                  </label>
                  <input
                    type="file"
                    onChange={this.onChangeLogo}
                    className="form-control"
                    accept="image/*"
                  />
                  {this.state.notif && <Form.Text className="text-danger">{this.state.notif}</Form.Text>}
                </div>
                <div className="form-group">
                  <label className="label-input" htmlFor>
                    Batasi Waktu
                  </label>
                  <div style={{ width: '100%' }}>
                    <ToggleSwitch checked={false} onChange={this.toggleSwitch.bind(this)} checked={this.state.unlimited} />
                  </div>

                </div>
                {
                  this.state.unlimited &&
                  <div className="form-group">
                    <label className="label-input" htmlFor>
                      Valid Until
                    </label>
                    <div style={{ width: '100%' }}>
                      <DatePicker
                        selected={this.state.validity}
                        onChange={this.handleChangeValidity}
                        showTimeSelect
                        dateFormat="yyyy-MM-dd"
                      />
                    </div>

                  </div>
                }
                {/* <div className="form-group">
                  <label className="label-input" htmlFor>
                    Status Company
                  </label>
                  <br />
                  <div
                    onChange={this.onChangeStatus}
                    style={{ textTransform: "capitalize" }}
                  >
                    {statusCompany.map(item => {
                      return (
                        <Form.Check
                          name="status"
                          inline
                          label={item}
                          type="radio"
                          value={item}
                        />
                      );
                    })}
                  </div>
                </div> */}
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
