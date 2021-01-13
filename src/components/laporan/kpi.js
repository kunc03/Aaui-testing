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
    tempFile: Math.random().toString(36)
  }

  clearForm() {
    this.setState({
      id: '',
      name: '',
      file: '',
      tempFile: Math.random().toString(36)
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

  componentDidMount() {
    this.fetchFormatKpi()
  }

  fetchFormatKpi() {
    API.get(`${API_SERVER}v2/learning-kpi/company/${Storage.get('user').data.company_id}`).then(res => {
      this.setState({ formatKpi: res.data.result.reverse() })
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
      </div>
    );
  }

}

export default Kpi;
