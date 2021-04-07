import React, { Component } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import Storage from '../../../repository/storage';
import API, { API_SERVER } from '../../../repository/api';

export default class WebinarRoles extends Component {

  state = {
    roles: [],

    id: "",
    name: "",
    companyId: Storage.get('user').data.company_id,
    userId: Storage.get('user').data.user_id,
    projectId: parseInt(this.props.match.params.projectId)
  }

  onClickSimpan = e => {
    e.preventDefault();
    if (!this.state.name) {
      toast.warning('Role names cannot be empty');
    }

    if (this.state.id) {
      // update
      let { id, name } = this.state;
      API.put(`${API_SERVER}v2/webinar/role/${id}`, { name }).then(res => {
        if (res.data.error) toast.warning('Gagal fetch API');
        this.fetchData();
      })
    } else {
      // insert
      let { name, projectId, userId, companyId } = this.state;
      let form = { name, projectId, userId, companyId };
      API.post(`${API_SERVER}v2/webinar/role`, form).then(res => {
        if (res.data.error) toast.warning('Gagal fetch API');
        this.fetchData();
      })
    }

    this.setState({ id: "", name: "" });
  }

  onClickHapus = e => {
    e.preventDefault();
    let id = e.target.getAttribute('data-id');
    API.delete(`${API_SERVER}v2/webinar/role/${id}`).then(res => {
      if (res.data.error) toast.warning('Gagal fetch API');
      this.fetchData();
    })
  }

  handleGet = e => {
    e.preventDefault();
    let id = e.target.getAttribute("data-id");
    let name = e.target.getAttribute("data-name");
    this.setState({ id, name });
  }

  handleInput = e => {
    let { name, value } = e.target;
    this.setState({ [name]: value });
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    API.get(`${API_SERVER}v2/webinar/role/${this.state.companyId}/${this.state.projectId}`).then(res => {
      if (res.data.error) console.log('ERROR');

      this.setState({ roles: res.data.result });
    })
  }

  render() {

    //console.log('state: ', this.state);

    return (
      <div className="row">
        <div className="col-sm-12">
          <Card>
            <Card.Body>
              <div className="row">
                <div className="col-sm-6">
                  <h3 className="f-w-900 f-18 fc-blue">
                    <Link to={`/detail-project/${this.props.match.params.projectId}`} className="btn btn-sm mr-4" style={{
                      border: '1px solid #e9e9e9',
                      borderRadius: '50px',
                    }}>
                      <i className="fa fa-chevron-left" style={{ margin: '0px' }}></i>
                    </Link>
                    Atur Role Webinar
                  </h3>
                </div>
                <div className="col-sm-6 text-right">
                  <p className="m-b-0">
                    {/* <span className="f-w-600 f-16">Lihat Semua</span> */}
                  </p>
                </div>
              </div>
              <div style={{ marginTop: '10px' }}>
                <div className="row">
                  <div className="col-sm-4">

                    <div className="form-group">
                      <label className="bold">Nama role</label>
                      <div class="input-group">
                        <input type="text" className="form-control" name="name" onChange={this.handleInput} value={this.state.name} />
                        <span className="input-group-btn">
                          <button onClick={this.onClickSimpan} className="btn btn-default">
                            <i className="fa fa-plus"></i> Simpan
                          </button>
                        </span>
                      </div>
                    </div>

                  </div>

                  <div className="col-sm-8">
                    <table className="table table-striped mb-4">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th> Name </th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        {
                          this.state.roles.map((item, i) => (
                            <tr key={i}>
                              <td>{item.id}</td>
                              <td>{item.name}</td>
                              <td>
                                <i onClick={this.handleGet} data-id={item.id} data-name={item.name} className="fa fa-edit mr-2" style={{ cursor: 'pointer' }}></i>
                                <i onClick={this.onClickHapus} data-id={item.id} className="fa fa-trash" style={{ cursor: 'pointer' }}></i>
                              </td>
                            </tr>
                          ))
                        }
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            </Card.Body>
          </Card>


        </div>
      </div>
    );
  }
}