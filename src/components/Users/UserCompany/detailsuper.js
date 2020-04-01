import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form, Card, Col, Row, Button, Image, Modal } from 'react-bootstrap';
import API, { API_SERVER } from '../../../repository/api';

import UsersSuper from "./userssuper";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class CompanyDetail extends Component {

	state = {
    companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : this.props.match.params.company_id,
    // companyId: this.props.match.params.company_id,
		nama: "",
		status: "",
		validity: "",
		logo: "",
		tempLogo: "",
		
		cabang: [],
		grup: [],
		user: [],
		
		isModalCabang: false,
		namacabang: "",
		actioncabang: "add",
		
		isModalGrup: false,
		namagrup: "",
		actiongrup: "add",

		isNotifikasi: false,
		isiNotifikasi: "",

		isKonfirmasi: false,
		jenisKonfirmasi: "",
		idKonfirmasi: ""
	}

	closeNotifikasi = e => {
		this.setState({ isNotifikasi: false, isiNotifikasi: '' })
	}

	closeKonfirmasi = e => {
		this.setState({ isKonfirmasi: false, jenisKonfirmasi: '', idKonfirmasi: '' })
	}

	handleValidityDatePicker = date => {
    this.setState({
      validity: this.changeFormatDate(date), dateValidity: date,
    })
	}

	changeFormatDate = (value) => {
		let dt = new Date(value)
		return `${dt.getFullYear().toString().padStart(4, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`
	}

	onChangeInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if(name === 'logo') {
			if (target.files[0].size <= 50000) {
        this.setState({ tempLogo: target.files[0] });
      } else {
        target.value = null;
        this.setState({
          isNotifikasi: true,
          isiNotifikasi:
            "File tidak sesuai dengan format, silahkan cek kembali."
        });
      }
    } else {
	    this.setState({
	      [name]: value
	    });
    }
  }

  onClickUpdate = e => {
  	const formData = {
  		company_id: this.state.companyId,
  		name: this.state.nama,
  		status: this.state.status,
  		validity: this.state.validity,
  	};

  	const linkURL = `${API_SERVER}v1/company/${this.state.companyId}`;
  	API.put(linkURL, formData).then(res => {
  		if(res.status === 200) {
  			this.setState({ nama: formData.company_name, status: formData.status, validity: formData.validity });
  		}
  	});

  	if(this.state.tempLogo != '') {
  		const formLogo = new FormData();
  		formLogo.append('logo', this.state.tempLogo);

  		const linkURLLogo = `${API_SERVER}v1/company/logo/${this.state.companyId}`;
  		API.put(linkURLLogo, formLogo).then(res => {
  			if(res.status === 200) {
  				this.setState({ logo: res.data.result });
  			}
  		})
		}
		
		this.setState({
      isNotifikasi: true,
      isiNotifikasi: "Informasi company berhasil di ubah."
    });

  }

  onClickModal = e => {
  	const tipe = e.target.getAttribute('data-type');
  	if(tipe === 'cabang') {
  		this.setState({ isModalCabang: true });
  	} else {
  		this.setState({ isModalGrup: true });
  	}
	}
	
	openKonfirmasi = e => {
		this.setState({ isKonfirmasi: true, jenisKonfirmasi: e.target.getAttribute('data-type'), idKonfirmasi: e.target.getAttribute('data-id') })
	}

  onClickTambahCabang = e => {
  	e.preventDefault();
  	const formData = {
  		company_id: this.state.companyId,
  		branch_name: this.state.namacabang
		}
		
		if(formData.branch_name) {
			if(this.state.actioncabang === 'add') {
				// action for insert
				API.post(`${API_SERVER}v1/branch`, formData).then(res => {
					if(res.status === 200) {
						formData.branch_id = res.data.result.insertId;
						this.setState({
							cabang: [...this.state.cabang, formData ],
							isModalCabang: false
						})
						this.handleCloseCabang();
					}
				})
			} else {
				const idNya = this.state.actioncabang.split('_')[1];
				API.put(`${API_SERVER}v1/branch/${idNya}`, formData).then(res => {
					if(res.status === 200) {
						let linkURLCabang = `${API_SERVER}v1/branch/company/${this.state.companyId}`;
						API.get(linkURLCabang).then(res => {
							if(res.status === 200) {
								this.setState({ cabang: res.data.result, isModalCabang: false })
								this.handleCloseCabang();
							}
						}).catch(err => {
							console.log(err);
						});
					}
				})
			}
		}

  }

  handleCloseCabang = e => {
  	this.setState({ isModalCabang: false, namacabang: '', actioncabang: 'add' });
  }

  onClickTambahGrup = e => {
  	e.preventDefault();
  	const formData = {
  		company_id: this.state.companyId,
  		grup_name: this.state.namagrup
		}
		
		if(formData.grup_name) {
			if(this.state.actiongrup === 'add') {
				// action for insert
				API.post(`${API_SERVER}v1/grup`, formData).then(res => {
					console.log(res);
					if(res.status === 200) {
						formData.grup_id = res.data.result.insertId;
						this.setState({
							grup: [...this.state.grup, formData ],
							isModalGrup: false
						})
						this.handleCloseGrup();					
					}
				})
			} else {
				// action for update
				const idNya = this.state.actiongrup.split('_')[1];
				API.put(`${API_SERVER}v1/grup/${idNya}`, formData).then(res => {
					if(res.status === 200) {
						let linkURLGrup = `${API_SERVER}v1/grup/company/${this.state.companyId}`;
						API.get(linkURLGrup).then(res => {
							if(res.status === 200) {
								this.setState({ grup: res.data.result, isModalGrup: false })
								this.handleCloseGrup();
							}
						}).catch(err => {
							console.log(err);
						});
					}
				})
			}
		}

  }

  handleCloseGrup = e => {
  	this.setState({ isModalGrup: false, namagrup: '', actiongrup: 'add' });
  }

  onClickHapus = e => {
  	e.preventDefault();
  	const tipe = this.state.jenisKonfirmasi;
  	const idNya = this.state.idKonfirmasi;

  	let linkURL = `${API_SERVER}v1`;

  	if(tipe === 'cabang') {
  		linkURL += `/branch/${idNya}`;
  	} else {
  		linkURL += `/grup/${idNya}`;
  	}

  	API.delete(linkURL).then(res => {
  		if(res.status === 200) {
  			if(tipe === 'cabang') {
	  			this.setState({
	  				cabang: this.state.cabang.filter(item => { return item.branch_id != idNya })
					})
					this.closeKonfirmasi();					
  			} else {
  				this.setState({
	  				grup: this.state.grup.filter(item => { return item.grup_id != idNya })
					})
					this.closeKonfirmasi();					
  			}
  		}
  	})
  }

  onClickUbah = e => {
  	const tipe = e.target.getAttribute('data-type');
  	const action = e.target.getAttribute('data-action');
  	const idNya = e.target.getAttribute('data-id');
  	if(tipe === 'cabang') {
  		this.setState({ isModalCabang: true, namacabang: e.target.getAttribute('data-nama'), actioncabang: `action_${idNya}`});
  	} else {  		
  		this.setState({ isModalGrup: true, namagrup: e.target.getAttribute('data-nama'), actiongrup: `action_${idNya}` });
  	}
  }

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		let linkURL = `${API_SERVER}v1/company/${this.state.companyId}`;
		API.get(linkURL).then(res => {
			if(res.status === 200) {
				this.setState({ 
					nama: res.data.result.company_name, 
					status: res.data.result.status, 
					validity: res.data.result.validity.substring(0,10),
					logo: res.data.result.logo 
				});

				let linkURLCabang = `${API_SERVER}v1/branch/company/${this.state.companyId}`;
				API.get(linkURLCabang).then(res => {
					if(res.status === 200) {
						this.setState({ cabang: res.data.result[0] })
					}
				}).catch(err => {
					console.log(err);
				});

				let linkURLGrup = `${API_SERVER}v1/grup/company/${this.state.companyId}`;
				API.get(linkURLGrup).then(res => {
					if(res.status === 200) {
						this.setState({ grup: res.data.result })
					}
				}).catch(err => {
					console.log(err);
				});

				let linkURLUser = `${API_SERVER}v1/user/company/${this.state.companyId}`;
				API.get(linkURLUser).then(res => {
					if(res.status === 200) {
						res.data.result.map(item => {
							let temp = item;
							if(temp.validity != null ) {
								temp.validity = item.validity.toString().substring(0,10);
								return temp;
							}
						})
						this.setState({ user: res.data.result })
					}
				}).catch(err => {
					console.log(err);
				});
			}
		}).catch(err => {
			console.log(err);
		});
	}

	render() {
    console.log('companyID: ', localStorage.getItem('companyID'));
    console.log('companyID: ', this.state.companyId);

		const { cabang, grup, user } = this.state;
		const statusCompany = ['active', 'nonactive'];
    
    let validityCompany = "";
    if (this.state.validity !== "") {
      validityCompany = new Date(this.state.validity);
    }

		const ListCabang = ({items}) => {
			if(items.length == 0) {
				return (
					<div>
						<Card className="cardku" >
	          	<Card.Body>
	          		<Row>
	          			<Col>Tidak ada cabang</Col>
	          		</Row>
	          	</Card.Body>
	          </Card>
					</div>
				)
			} else {
				return (
					<div>
					{	
						items.map((item, i) => (
							<Card className="cardku" key={item.branch_id}>
		          	<Card.Body>
		          		<Row>
		          			<Col xs={2}>{i+1}</Col>
		          			<Col xs={8}>{item.branch_name}</Col>
		          			<Col>
		          				<Link to="#" className="buttonku">
		          					<i data-type="cabang" data-action="update" data-id={item.branch_id} data-nama={item.branch_name} onClick={this.onClickUbah} className="fa fa-edit"></i>
	          					</Link>
		          				<Link to="#" className="buttonku">
		          					<i data-type="cabang" data-id={item.branch_id} onClick={this.openKonfirmasi} className="fa fa-trash"></i>
	          					</Link>
		          			</Col>
		          		</Row>
		          	</Card.Body>
		          </Card>
						))
					}
					</div>
				)
			}
		};

		const ListGrup = ({items}) => {
			if(items.length == 0) {
				return (
					<div>
						<Card className="cardku" >
	          	<Card.Body>
	          		<Row>
	          			<Col>Tidak ada grup</Col>
	          		</Row>
	          	</Card.Body>
	          </Card>
					</div>
				);
			} else {
				return (
					<div>
					{	
						items.map((item,i) => (
							<Card className="cardku" key={item.grup_id}>
		          	<Card.Body>
		          		<Row>
		          			<Col xs={2}>{i+1}</Col>
		          			<Col xs={8}>{item.grup_name}</Col>
		          			<Col>
		          				<Link to="#" className="buttonku">
		          					<i data-type="grup" data-action="update" data-id={item.grup_id} data-nama={item.grup_name} onClick={this.onClickUbah} className="fa fa-edit"></i>
		          					</Link>
		          				<Link to="#" className="buttonku">
		          					<i data-type="grup" data-id={item.grup_id} onClick={this.openKonfirmasi} className="fa fa-trash"></i>
	          					</Link>
		          			</Col>
		          		</Row>
		          	</Card.Body>
		          </Card>
						))
					}
					</div>
				)
			}
		}

		return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-xl-12">
                      <h3 className="f-24 f-w-800 mb-3">Informasi Company</h3>
                      <Card>
                        <Card.Body>
                          <Row>
                            <Col md={3} className="text-center">
                              <Image
                                src={this.state.logo}
                                width="120px"
                                thumbnail
                              />
                            </Col>
                            <Col md={9}>
                              <div className="form-group">
                                <label>Nama Company</label>
                                <Form.Control
                                  type="text"
                                  name="nama"
                                  onChange={this.onChangeInput}
                                  placeholder="Nama Company"
                                  value={this.state.nama}
                                />
                              </div>
                              <div className="form-group">
                                <label>Validity</label>
                                <br />
                                <DatePicker
                                  selected={validityCompany}
                                  onChange={this.handleValidityDatePicker}
                                  showTimeSelect
                                  className="form-control"
                                  dateFormat="yyyy-MM-dd"
                                />
                              </div>
                              <div
                                className="form-group"
                                onChange={this.onChangeInput}
                              >
                                <label>Status Company</label>
                                <br />
                                {statusCompany.map(item => {
                                  return (
                                    <div
                                      className="pretty p-default p-round p-thick m-b-35"
                                      style={{ marginBottom: "5px" }}
                                    >
                                      <input
                                        onChange={this.onChangeInput}
                                        name="status"
                                        checked={this.state.status === item}
                                        value={item}
                                        type="radio"
                                      />
                                      <div className="state p-success-o">
                                        <label
                                          className="f-18"
                                          style={{
                                            whiteSpace: "normal !important"
                                          }}
                                        >
                                          <small
                                            className="f-w-bold f-18 text-c-black small-text"
                                            style={{
                                              textTransform: "capitalize"
                                            }}
                                          >
                                            {item}
                                          </small>
                                        </label>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="form-group">
                                <label>Logo Company</label>
                                <Form.Control
                                  accept="image/*"
                                  className="form-control"
                                  type="file"
                                  onChange={this.onChangeInput}
                                  name="logo"
                                  placeholder="Nama Company"
                                />
                                <Form.Text>
                                  Pastikan file berformat png, jpg, jpeg, atau
                                  gif dan ukuran tidak melebihi 500KB
                                </Form.Text>
                              </div>
                              <button
                                className="btn btn-sm btn-ideku"
                                onClick={this.onClickUpdate}
                              >
                                <i className="fa fa-edit"></i>
                                Ubah
                              </button>
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>

                      <Row style={{ marginBottom: "32px" }}>
                        <Col md={6}>
                          <h3 className="f-24 f-w-800 mb-3">
                            Cabang Company
                            <Button
                              data-type="cabang"
                              onClick={this.onClickModal}
                              className="btn btn-sm btn-ideku float-right"
                            >
                              <i className="fa fa-plus"></i> Tambah Baru
                            </Button>
                            <div className="clearfix"></div>
                          </h3>
                          <ListCabang items={cabang} />
                          <Modal
                            show={this.state.isModalCabang}
                            onHide={this.handleCloseCabang}
                          >
                            <Modal.Body>
                              <Modal.Title className="text-c-purple3 f-w-bold">
                                Form Cabang
                              </Modal.Title>
                              <div
                                style={{ marginTop: "20px" }}
                                className="form-group"
                              >
                                <label>Cabang Baru</label>
                                <input
                                  value={this.state.namacabang}
                                  className="form-control"
                                  type="text"
                                  name="namacabang"
                                  onChange={this.onChangeInput}
                                  placeholder="Nama Cabang"
                                />
                              </div>
                              <button
                                style={{ marginTop: "50px" }}
                                type="button"
                                data-grup={this.state.namacabang}
                                onClick={this.onClickTambahCabang}
                                className="btn btn-block btn-ideku f-w-bold"
                              >
                                Simpan
                              </button>
                              <button
                                type="button"
                                className="btn btn-block f-w-bold"
                                onClick={this.handleCloseCabang}
                              >
                                Tidak
                              </button>
                            </Modal.Body>
                          </Modal>
                        </Col>

                        <Col md={6}>
                          <h3 className="f-24 f-w-800 mb-3">
                            Grup Company
                            <Button
                              data-type="grup"
                              onClick={this.onClickModal}
                              className="btn btn-sm btn-ideku float-right"
                            >
                              <i className="fa fa-plus"></i> Tambah Baru
                            </Button>
                            <div className="clearfix"></div>
                          </h3>
                          <ListGrup items={grup} />
                          <Modal
                            show={this.state.isModalGrup}
                            onHide={this.handleCloseGrup}
                          >
                            <Modal.Body>
                              <Modal.Title className="text-c-purple3 f-w-bold">
                                Grup Company
                              </Modal.Title>
                              <div
                                style={{ marginTop: "20px" }}
                                className="form-group"
                              >
                                <label>Nama Grup</label>
                                <input
                                  value={this.state.namagrup}
                                  className="form-control"
                                  type="text"
                                  name="namagrup"
                                  onChange={this.onChangeInput}
                                  placeholder="Nama Grup"
                                />
                              </div>
                              <button
                                style={{ marginTop: "50px" }}
                                type="button"
                                data-grup={this.state.namagrup}
                                onClick={this.onClickTambahGrup}
                                className="btn btn-block btn-ideku f-w-bold"
                              >
                                Simpan
                              </button>
                              <button
                                type="button"
                                className="btn btn-block f-w-bold"
                                onClick={this.handleCloseGrup}
                              >
                                Tidak
                              </button>
                            </Modal.Body>
                          </Modal>
                        </Col>
                      </Row>

                      <UsersSuper companyId={this.state.companyId} />

                      <Modal
                        show={this.state.isNotifikasi}
                        onHide={this.closeNotifikasi}
                      >
                        <Modal.Body>
                          <Modal.Title className="text-c-purple3 f-w-bold">
                            Notifikasi
                          </Modal.Title>

                          <p style={{ color: "black", margin: "20px 0px" }}>
                            {this.state.isiNotifikasi}
                          </p>

                          <button
                            type="button"
                            className="btn btn-block f-w-bold"
                            onClick={this.closeNotifikasi}
                          >
                            Mengerti
                          </button>
                        </Modal.Body>
                      </Modal>

                      <Modal
                        show={this.state.isKonfirmasi}
                        onHide={this.closeKonfirmasi}
                      >
                        <Modal.Body>
                          <Modal.Title className="text-c-purple3 f-w-bold">
                            Notifikasi
                          </Modal.Title>

                          <p style={{ color: "black", margin: "20px 0px" }}>
                            Apakah Anda yakin akan menghapus data ini ?
                          </p>

                          <button
                            type="button"
                            className="btn btn-block btn-ideku f-w-bold"
                            onClick={this.onClickHapus}
                          >
                            Ya, Hapus
                          </button>
                          <button
                            type="button"
                            className="btn btn-block f-w-bold"
                            onClick={this.closeKonfirmasi}
                          >
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
      </div>
    );
	}
}