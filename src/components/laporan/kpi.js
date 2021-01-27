import React from 'react';

import { Link } from 'react-router-dom';
import { toast } from "react-toastify";

import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';
import moment from 'moment-timezone'

class Kpi extends React.Component {

  state = {
    formatKpi: [],

    id: '',
    name: '',
    file: '',
    tempFile: Math.random().toString(36),

    rangeNilai: [],
    idNilai: '',
    min: '',
    max: '',
    huruf: ''
  }

  clearForm() {
    this.setState({
      id: '',
      name: '',
      file: '',
      tempFile: Math.random().toString(36)
    })
  }

  clearFormNilai() {
    this.setState({
      idNilai: '',
      min: '',
      max: '',
      huruf: ''
    })
  }

  saveKpi = e => {
    e.preventDefault()
    let form = { companyId: Storage.get('user').data.company_id, name: this.state.name }
    API.post(`${API_SERVER}v2/learning-kpi`, form).then(res => {

      if(this.state.file) {
        let form = new FormData();
        form.append('file', this.state.file)

        API.put(`${API_SERVER}v2/learning-kpi/${res.data.result.id_kpi}`, form).then(res => {
          toast.success('File uploaded.')
          this.clearForm()
          this.fetchFormatKpi()
        })
      }

      toast.success(`Format KPI saved.`)
      this.fetchFormatKpi()
    })
  }

  deleteKpi = e => {
    e.preventDefault()
    API.delete(`${API_SERVER}v2/learning-kpi/${e.target.getAttribute('data-id')}`).then(res => {
      this.fetchFormatKpi()
      this.clearForm()
    })
  }

  saveRangeNilai = e => {
    e.preventDefault()
    let form = {
      id: this.state.idNilai,
      min: this.state.min,
      max: this.state.max,
      huruf: this.state.huruf,
      company_id: Storage.get('user').data.company_id
    };

    if(this.state.idNilai) {
      //action for update
      API.put(`${API_SERVER}v2/range-nilai/update/${form.id}`, form).then(res => {
        this.fetchRangeNilai()
      })
    }
    else {
      //action for insert
      API.post(`${API_SERVER}v2/range-nilai/create`, form).then(res => {
        this.fetchRangeNilai()
      })
    }

    this.clearFormNilai()
  }

  selectNilai = e => {
    e.preventDefault()
    let id = e.target.getAttribute('data-id'), min = e.target.getAttribute('data-min'), max = e.target.getAttribute('data-max'), huruf = e.target.getAttribute('data-huruf');
    this.setState({ idNilai: id, min, max, huruf })
  }

  deleteNilai = e => {
    e.preventDefault()
    let id = e.target.getAttribute('data-id');
    API.delete(`${API_SERVER}v2/range-nilai/delete/${id}`).then(res => {
      this.fetchRangeNilai()
    })
  }

  componentDidMount() {
    this.fetchFormatKpi()
    this.fetchRangeNilai()
  }

  fetchFormatKpi() {
    API.get(`${API_SERVER}v2/learning-kpi/company/${Storage.get('user').data.company_id}`).then(res => {
      this.setState({ formatKpi: res.data.result.reverse() })
    })
  }

  fetchRangeNilai() {
    API.get(`${API_SERVER}v2/range-nilai/company/${Storage.get('user').data.company_id}`).then(res => {
      this.setState({ rangeNilai: res.data.result })
    })
  }

  render() {

    return (
      <div className="row mt-3">

        <div className="col-sm-12">
          <div className="card">
            <div className="card-header header-kartu">
              Upload Format KPI
            </div>

            <div className="card-body">
              <form onSubmit={this.saveKpi}>
                <div className="form-group row">
                  <div className="col-sm-4">
                    <label>Name</label>
                    <input type="text" class="form-control" value={this.state.name} onChange={e => this.setState({ name: e.target.value })} />
                  </div>
                  <div className="col-sm-6">
                    <label>File</label>
                    <input type="file" class="form-control" key={this.state.tempFile} onChange={e => this.setState({ file: e.target.files[0] })} />
                  </div>

                  <div className="col-sm-2">
                    <button className="btn btn-v2 btn-success mt-4">
                      <i className="fa fa-save"></i> Upload
                    </button>
                  </div>
                </div>

              </form>

              <table className="table table-striped mt-4 table-bordered">
                <thead>
                  <tr className="text-center">
                    <td>NO</td>
                    <td>NAME</td>
                    <td>FILE</td>
                    <td>CREATED AT</td>
                    <td>ACTION</td>
                  </tr>
                </thead>

                <tbody>
                  {
                    this.state.formatKpi.map((item, i) => (
                      <tr className="text-center">
                        <td>{i + 1}</td>
                        <td>{item.name}</td>
                        <td>
                          <a href={item.file} target="_blank">Download</a>
                        </td>
                        <td>
                          {moment(item.created_at).format('DD/MM/YYYY HH:mm')}
                        </td>
                        <td>
                          <i onClick={this.deleteKpi} data-id={item.id_kpi} class="fa fa-trash" style={{cursor: 'pointer'}}></i>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

            </div>
          </div>
        </div>

        <div className="col-sm-12">
          <div className="card">
            <div className="card-header header-kartu">
              Setup Range Nilai
            </div>

            <div className="card-body">
              <form onSubmit={this.saveRangeNilai}>
                <div className="form-group row">

                  <div className="col-sm-2">
                    <label>Minimal</label>
                    <input type="number" class="form-control" value={this.state.min} onChange={e => this.setState({ min: e.target.value })} />
                  </div>
                  <div className="col-sm-2">
                    <label>Maksimal</label>
                    <input type="number" class="form-control" value={this.state.max} onChange={e => this.setState({ max: e.target.value })} />
                  </div>
                  <div className="col-sm-2">
                    <label>Nilai dalam huruf</label>
                    <input type="text" class="form-control" value={this.state.huruf} onChange={e => this.setState({ huruf: e.target.value })} />
                  </div>

                  <div className="col-sm-6">
                    <button className="btn btn-v2 btn-success mt-4">
                      <i className="fa fa-save"></i> Simpan
                    </button>
                    <button type="reset" onClick={() => this.clearFormNilai()} className="ml-2 btn btn-v2 btn-default mt-4">
                      Reset
                    </button>
                  </div>
                </div>

              </form>

              <table className="table table-striped mt-4 table-bordered">
                <thead>
                  <tr className="text-center">
                    <td>NO</td>
                    <td>MIN</td>
                    <td>MAX</td>
                    <td>HURUF</td>
                    <td>CREATED AT</td>
                    <td>ACTION</td>
                  </tr>
                </thead>

                <tbody>
                  {
                    this.state.rangeNilai.map((item, i) => (
                      <tr className="text-center">
                        <td>{i + 1}</td>
                        <td>{item.min}</td>
                        <td>{item.max}</td>
                        <td>{item.huruf}</td>
                        <td>
                          {moment(item.created_at).format('DD/MM/YYYY HH:mm')}
                        </td>
                        <td>
                          <i onClick={this.selectNilai} data-id={item.id} data-min={item.min} data-max={item.max} data-huruf={item.huruf} class="fa fa-edit mr-2" style={{cursor: 'pointer'}}></i>
                          <i onClick={this.deleteNilai} data-id={item.id} class="fa fa-trash" style={{cursor: 'pointer'}}></i>
                        </td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>

            </div>
          </div>
        </div>

      </div>
    );
  }

}

export default Kpi;
