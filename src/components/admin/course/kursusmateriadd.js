import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';

export default class KursusMateriAdd extends Component {

	state = {
		companyId: '',

		kategori: [],
    
    catId: '',
    kategori_name: '',
    kategori_image: '',

		category_id: '',
		type: '',
		title: '',
		caption: '',
		body: '',
		image: '',

		isModalKategori: false
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
      if(res.status === 200) {
        this.fetchData();
        this.setState({ kategori_image: '', kategori_name: '', catId: '' });
      }
    })
  }

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
			if(res.status === 200) {
				this.setState({ companyId: res.data.result.company_id });

				API.get(`${API_SERVER}v1/category/company/${res.data.result.company_id}`).then(res => {
					if(res.status === 200) {
						this.setState({ kategori: res.data.result });
					}
				})
			}
		})
	}

	onChangeInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if(name === 'image' || name === 'kategori_image') {
    	this.setState({ [name]: target.files[0] });
    } else {
    	this.setState({ [name]: value });
    }
  }

  handleClearForm() {
  	this.setState({
  		category_id: '',
			type: '',
			title: '',
			caption: '',
			body: '',
			image: ''
  	})
  }

  handleSimpanKategori = e => {
    e.preventDefault();
    if(this.state.catId === '') {
      let form = new FormData();
      form.append('company_id', this.state.companyId);
      form.append('category_name', this.state.kategori_name);
      form.append('category_image', this.state.kategori_image);
      form.append('category_publish', '1');

      API.post(`${API_SERVER}v1/category`, form).then(res => {
        if(res.status === 200) {
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
        if(res.status === 200) {
          this.fetchData();
          this.setState({ kategori_image: '', kategori_name: '', catId: '' });
        }
      })
    }
  }

  submitForm = e => {
  	e.preventDefault();
  	let form = new FormData();
  	form.append('category_id', this.state.category_id);
  	form.append('type', this.state.type);
  	form.append('title', this.state.title);
  	form.append('caption', this.state.caption);
  	form.append('body', this.state.body);
  	form.append('image', this.state.image);
  	form.append('user_id', Storage.get('user').data.user_id);

  	API.post(`${API_SERVER}v1/course`, form).then(res => {
  		if(res.status === 200) {
  			this.props.history.push('/kursus-materi');
  		}
  	})
  }

  handleModalKategori = e => {
  	this.setState({ isModalKategori: true });
  }

  handleCloseModal = e => {
  	this.setState({ isModalKategori: false, kategori_image: '', kategori_name: '', catId: '' });
  }

	render() {
    const { kategori } = this.state;

		return (
			<div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-xl-12">
                      <h3 className="f-24 f-w-800">Tambah Kursus & Materi</h3>

                      <div className="card">
                        <div className="card-block">

                          <form onSubmit={event => this.submitForm(event)}>
                            <div className="form-group">
                              <label className="label-input">Kategori</label>
                              <div className="input-group mb-3">
	                              <select required className="form-control" name="category_id" onChange={this.onChangeInput}>
	                                <option value="">-- pilih --</option>
	                                {
	                                  this.state.kategori.map(item => (
	                                    <option value={item.category_id}>{item.category_name}</option>
	                                  ))
	                                }
	                              </select>
	                              <div class="input-group-append">
															    <span onClick={this.handleModalKategori} class="input-group-text btn btn-ideku" 
															    	style={{ cursor: 'pointer', backgroundColor: 'rgb(146, 31, 91)'}} id="basic-addon2">
															    	Tambah Kategori
														    	</span>
															  </div>
														  </div>
                            </div>
                            <div className="form-group">
                              <label className="label-input">Tipe</label>
                              <input
                                required
                                type="text"
                                name="type"
                                className="form-control"
                                placeholder="tipe"
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Judul</label>
                              <input
                                required
                                type="text"
                                name="title"
                                className="form-control"
                                placeholder="judul"
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Caption</label>
                              <input
                                required
                                type="text"
                                name="caption"
                                className="form-control"
                                placeholder="caption"
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Konten</label>
                              <textarea
                                required
                                name="body"
                                className="form-control"
                                placeholder="konten"
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <div className="form-group">
                              <label className="label-input">Cover</label>
                              <input
                              	type="file"
                                required
                                name="image"
                                className="form-control"
                                placeholder="konten"
                                onChange={this.onChangeInput}
                              />
                            </div>
                            <button style={{ marginTop: '50px'}} type="submit"
		                          className="btn btn-block btn-ideku f-w-bold">
		                          Simpan Materi & Kursus
		                        </button>
                          </form>
                        </div>
                      </div>

                      <Modal show={this.state.isModalKategori} onHide={this.handleCloseModal}>
	                      <Modal.Body>
	                        <Modal.Title className="text-c-purple3 f-w-bold">Semua Kategori</Modal.Title>
                          <form onSubmit={this.handleSimpanKategori}>
                            <div style={{ marginTop: '20px'}} className="form-group">
                              <label>Cover Kategori</label>
                              <input required className="form-control" type="file" name="kategori_image" onChange={this.onChangeInput} />
                            </div>
                            <div className="form-group">
                              <label>Nama Kategori</label>
                              <div className="input-group mb-3">
                                <input required value={this.state.kategori_name} onChange={this.onChangeInput} className="form-control" type="text" name="kategori_name" placeholder="kategori baru" />
                                <div class="input-group-append">
                                  <span onClick={this.handleSimpanKategori} class="input-group-text btn btn-ideku" 
                                    style={{ cursor: 'pointer', backgroundColor: 'rgb(146, 31, 91)'}} id="basic-addon2">
                                    Simpan
                                  </span>
                                </div>
                              </div>
                            </div>
                          </form>

                          <div style={{ overflowX: "auto" }}>
                            <table className="table-curved" style={{ width: "100%" }}>
                              <thead>
                                <tr><th>No</th><th>Kategori</th><th></th></tr>
                              </thead>
                              <tbody>
                              {
                                kategori.map((item, i) => (
                                  <tr key={item.category_id}>
                                    <th>{i+1}</th>
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
	                        <button style={{ marginTop: '50px'}} type="button"
	                          className="btn btn-block f-w-bold"
	                          onClick={this.handleCloseModal}>
	                          Tutup
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