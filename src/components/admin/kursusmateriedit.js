import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../repository/api';
import Storage from '../../repository/storage';

export default class KursusMateriEdit extends Component {

  state = {
    companyId: '',

    kategori: [],
    courseId: this.props.location.search.split('?')[1],

    kategori_image: '', kategori_name: '', catId: '',

    category_id: '',
    type: '',
    title: '',
    caption: '',
    body: '',
    image: '',

    isModalKategori: false
  }

  onChangeInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === 'image' || name === 'kategori_image') {
      this.setState({ [name]: target.files[0] });
    } else {
      this.setState({ [name]: value });
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  handleModalKategori = e => {
    this.setState({ isModalKategori: true });
  }

  handleCloseModal = e => {
    this.setState({ isModalKategori: false, kategori_image: '', kategori_name: '', catId: '' });
  }

  handleSimpanKategori = e => {
    e.preventDefault();
    if (this.state.catId === '') {
      let form = new FormData();
      form.append('company_id', this.state.companyId);
      form.append('category_name', this.state.kategori_name);
      form.append('category_image', this.state.kategori_image);
      form.append('category_publish', '1');

      API.post(`${API_SERVER}v1/category`, form).then(res => {
        if (res.status === 200) {
          this.fetchData();
          this.handleCloseModal();
        }
      })
    } else {
      let form = {
        company_id: this.state.companyId,
        category_name: this.state.kategori_name,
        category_publish: '1'
      };
      API.put(`${API_SERVER}v1/category/${this.state.catId}`, form).then(res => {
        if (res.status === 200) {
          this.fetchData();
          this.setState({ kategori_image: '', kategori_name: '', catId: '' });
        }
      })
    }
  }

  fetchData() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if (res.status === 200) {
        this.setState({ companyId: res.data.result.company_id });

        API.get(`${API_SERVER}v1/category/company/${res.data.result.company_id}`).then(res => {
          if (res.status === 200) {
            this.setState({ kategori: res.data.result });
          }
        })

        API.get(`${API_SERVER}v1/course/${this.state.courseId}`).then(res => {
          //console.log(res)
          if (res.status === 200) {
            this.setState({
              category_id: res.data.result.category_id,
              type: res.data.result.type,
              title: res.data.result.title,
              caption: res.data.result.caption,
              body: res.data.result.body,
            })
          }
        })
      }
    })
  }

  submitForm = e => {
    e.preventDefault();
    let form = {
      category_id: this.state.category_id,
      type: this.state.type,
      title: this.state.title,
      caption: this.state.caption,
      body: this.state.body,
      publish: '1'
    };

    API.put(`${API_SERVER}v1/course/${this.state.courseId}`, form).then(res => {
      if (res.status === 200) {
        this.props.history.push('/kursus-materi');
      }
    })

    if (this.state.image !== '') {
      let formData = new FormData();
      formData.append('image', this.state.image);
      API.put(`${API_SERVER}v1/course/image/${this.state.courseId}`, formData);
    }
  }

  onClickUbahKategori = e => {
    e.preventDefault();
    const catId = e.target.getAttribute('data-id');
    const catName = e.target.getAttribute('data-name');

    this.setState({ kategori_name: catName, catId: catId });
  }

  onClickHapusKategori = e => {
    e.preventDefault();
    API.delete(`${API_SERVER}v1/category/${e.target.getAttribute('data-id')}`).then(res => {
      if (res.status === 200) {
        this.fetchData();
        this.setState({ kategori_image: '', kategori_name: '', catId: '' });
      }
    })
  }

  render() {
    const { courseId, kategori } = this.state;

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-xl-12">
                      <h3 className="f-24 f-w-800">Edit Kursus & Materi</h3>

                      <div className="card">
                        <div className="card-block">

                          <form onSubmit={event => this.submitForm(event)}>
                            <div className="form-group">
                              <label className="label-input"> Category </label>
                              <div className="input-group mb-3">
                                <select required className="form-control" name="category_id" onChange={this.onChangeInput}>
                                  <option value="">-- Select --</option>
                                  {
                                    this.state.kategori.map(item => (
                                      <option value={item.category_id} selected={(item.category_id === this.state.category_id) ? 'selected' : ''}>{item.category_name}</option>
                                    ))
                                  }
                                </select>
                                <div class="input-group-append">
                                  <span onClick={this.handleModalKategori} class="input-group-text btn btn-ideku"
                                    style={{ cursor: 'pointer', backgroundColor: 'rgb(146, 31, 91)' }} id="basic-addon2">
                                    Add Category
														    	</span>
                                </div>
                              </div>
                            </div>
                            <div className="form-group">
                              <label className="label-input"> Type </label>
                              <input
                                required
                                type="text"
                                value={this.state.type}
                                name="type"
                                className="form-control"
                                placeholder="tipe"
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input"> Title </label>
                              <input
                                required
                                type="text"
                                value={this.state.title}
                                name="title"
                                className="form-control"
                                placeholder="Title"
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Caption</label>
                              <input
                                required
                                type="text"
                                value={this.state.caption}
                                name="caption"
                                className="form-control"
                                placeholder="caption"
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input"> Content </label>
                              <textarea
                                required
                                name="body"
                                value={this.state.body}
                                className="form-control"
                                placeholder="konten"
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Cover</label>
                              <input
                                type="file"
                                name="image"
                                className="form-control"
                                placeholder="konten"
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <button style={{ marginTop: '50px' }} type="submit"
                              className="btn btn-block btn-ideku f-w-bold">
                              Save Materi & Kursus
		                        </button>
                          </form>
                        </div>
                      </div>

                      <Modal show={this.state.isModalKategori} onHide={this.handleCloseModal}>
                        <Modal.Body>
                          <Modal.Title className="text-c-purple3 f-w-bold"> All Categories </Modal.Title>
                          <div style={{ marginTop: '20px' }} className="form-group">
                            <label> Cover Category</label>
                            <input className="form-control" type="file" name="kategori_image" onChange={this.onChangeInput} />
                          </div>
                          <div className="form-group">
                            <label> Category Name</label>
                            <div className="input-group mb-3">
                              <input value={this.state.kategori_name} onChange={this.onChangeInput} className="form-control" type="text" name="kategori_name" placeholder="kategori baru" />
                              <div class="input-group-append">
                                <span onClick={this.handleSimpanKategori} class="input-group-text btn btn-ideku"
                                  style={{ cursor: 'pointer', backgroundColor: 'rgb(146, 31, 91)' }} id="basic-addon2">
                                  Save
                                 </span>
                              </div>
                            </div>
                          </div>
                          <div style={{ overflowX: "auto" }}>
                            <table className="table-curved" style={{ width: "100%" }}>
                              <thead>
                                <tr><th>No</th><th> Category </th><th></th></tr>
                              </thead>
                              <tbody>
                                {
                                  kategori.map((item, i) => (
                                    <tr>
                                      <th>{i + 1}</th>
                                      <th>{item.category_name}</th>
                                      <th>
                                        <Link to="#" className="buttonku">
                                          <i onClick={this.onClickUbahKategori} data-id={item.category_id} data-name={item.category_name} className="fa fa-edit"></i>
                                        </Link>
                                        <Link to="#" className="buttonku">
                                          <i onClick={this.onClickHapusKategori} data-id={item.category_id} className="fa fa-trash"></i>
                                        </Link>
                                      </th>
                                    </tr>
                                  ))
                                }
                              </tbody>
                            </table>
                          </div>
                          <button style={{ marginTop: '50px' }} type="button"
                            className="btn btn-block f-w-bold"
                            onClick={this.handleCloseModal}>
                            Close
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
      </div>
    );
  }
}