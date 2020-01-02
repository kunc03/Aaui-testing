import React, { Component } from "react";
import { Link } from "react-router-dom";
import { 
	Form, Card, Col, Row, ButtonGroup, Button, Image, 
	InputGroup, FormControl, Modal
} from 'react-bootstrap';
import API, { API_SERVER } from '../../../repository/api';

export default class CompanyDetail extends Component {

	constructor(props) {
		super(props);

		this.state = {
			nama: '',
			status: '',
			validity: '',
			logo: '',
			tempLogo: '',
			cabang: [],
			grup: [],
			user: [],
			isModalCabang: false,
			namacabang: '',
			actioncabang: 'add',
			isModalGrup: false,
			namagrup: '',
			actiongrup: 'add'
		}
	}

	onChangeInput = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if(name === 'logo') {
    	this.setState({ tempLogo: target.files[0] });
    } else {
	    this.setState({
	      [name]: value
	    });
    }
  }

  onClickUpdate = e => {
  	const formData = {
  		company_id: this.props.match.params.company_id,
  		name: this.state.nama,
  		status: this.state.status,
  		validity: this.state.validity,
  	};

  	const linkURL = `${API_SERVER}v1/company/${this.props.match.params.company_id}`;
  	API.put(linkURL, formData).then(res => {
  		if(res.status === 200) {
  			this.setState({ nama: formData.company_name, status: formData.status, validity: formData.validity });
  		}
  	});

  	if(this.state.tempLogo != '') {
  		const formLogo = new FormData();
  		formLogo.append('logo', this.state.tempLogo);

  		const linkURLLogo = `${API_SERVER}v1/company/logo/${this.props.match.params.company_id}`;
  		API.put(linkURLLogo, formLogo).then(res => {
  			if(res.status === 200) {
  				this.setState({ logo: res.data.result });
  			}
  		})
  	}
  }

  onClickModal = e => {
  	const tipe = e.target.getAttribute('data-type');
  	if(tipe === 'cabang') {
  		this.setState({ isModalCabang: true });
  	} else {
  		this.setState({ isModalGrup: true });
  	}
  }

  onClickTambahCabang = e => {
  	e.preventDefault();
  	const formData = {
  		company_id: this.props.match.params.company_id,
  		branch_name: this.state.namacabang
  	}

  	if(this.state.actioncabang === 'add') {
  		// action for insert
	  	API.post(`${API_SERVER}v1/branch`, formData).then(res => {
	  		if(res.status === 200) {
	  			formData.branch_id = res.data.result.insertId;
	  			this.setState({
	  				cabang: [...this.state.cabang, formData ],
	  				isModalCabang: false
	  			})
	  		}
	  	})
	  } else {
	  	const idNya = this.state.actioncabang.split('_')[1];
	  	API.put(`${API_SERVER}v1/branch/${idNya}`, formData).then(res => {
	  		if(res.status === 200) {
	  			let linkURLCabang = `${API_SERVER}v1/branch/company/${this.props.match.params.company_id}`;
					API.get(linkURLCabang).then(res => {
						if(res.status === 200) {
							this.setState({ cabang: res.data.result, isModalCabang: false })
						}
					}).catch(err => {
						console.log(err);
					});
	  		}
	  	})
	  }
  }

  handleCloseCabang = e => {
  	this.setState({ isModalCabang: false, namacabang: '', actioncabang: 'add' });
  }

  onClickTambahGrup = e => {
  	e.preventDefault();
  	const formData = {
  		company_id: this.props.match.params.company_id,
  		grup_name: this.state.namagrup
  	}

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
	  		}
	  	})
  	} else {
  		// action for update
  		const idNya = this.state.actiongrup.split('_')[1];
	  	API.put(`${API_SERVER}v1/grup/${idNya}`, formData).then(res => {
	  		if(res.status === 200) {
	  			let linkURLGrup = `${API_SERVER}v1/grup/company/${this.props.match.params.company_id}`;
					API.get(linkURLGrup).then(res => {
						if(res.status === 200) {
							this.setState({ grup: res.data.result, isModalGrup: false })
						}
					}).catch(err => {
						console.log(err);
					});
	  		}
	  	})
  	}
  }

  handleCloseGrup = e => {
  	this.setState({ isModalGrup: false, namagrup: '', actiongrup: 'add' });
  }

  onClickHapus = e => {
  	e.preventDefault();
  	const tipe = e.target.getAttribute('data-type');
  	const idNya = e.target.getAttribute('data-id');

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
  			} else {
  				this.setState({
	  				grup: this.state.grup.filter(item => { return item.grup_id != idNya })
	  			})
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
		let linkURL = `${API_SERVER}v1/company/${this.props.match.params.company_id}`;
		API.get(linkURL).then(res => {
			if(res.status === 200) {
				this.setState({ 
					nama: res.data.result.company_name, 
					status: res.data.result.status, 
					validity: res.data.result.validity.substring(0,10),
					logo: res.data.result.logo 
				});

				let linkURLCabang = `${API_SERVER}v1/branch/company/${this.props.match.params.company_id}`;
				API.get(linkURLCabang).then(res => {
					if(res.status === 200) {
						this.setState({ cabang: res.data.result })
					}
				}).catch(err => {
					console.log(err);
				});

				let linkURLGrup = `${API_SERVER}v1/grup/company/${this.props.match.params.company_id}`;
				API.get(linkURLGrup).then(res => {
					if(res.status === 200) {
						this.setState({ grup: res.data.result })
					}
				}).catch(err => {
					console.log(err);
				});

				let linkURLUser = `${API_SERVER}v1/user/company/${this.props.match.params.company_id}`;
				API.get(linkURLUser).then(res => {
					console.log('companyUser: ', res.data.result)
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
		})
	}

	render() {
		const { cabang, grup, user } = this.state;
		const statusCompany = ['active', 'nonactive'];

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
		          					<i data-type="cabang" data-id={item.branch_id} onClick={this.onClickHapus} className="fa fa-trash"></i>
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
		          					<i data-type="grup" data-id={item.grup_id} onClick={this.onClickHapus} className="fa fa-trash"></i>
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

		const ListUser = ({items}) => {
			if(items.length === 0) {
				return (
					<tbody>
						<tr>
							<td colSpan='9'>Tidak ada user yang terdaftar</td>
						</tr>
					</tbody>
				)
			} else {
				return (
					<tbody>
					{	
						items.map((item,i) => (
							<tr key={item.user_id}>
		            <td className="text-center">{i+1}</td>
		            <td>{item.name}</td>
		            <td>{item.identity}</td>
		            <td>{item.branch_name}</td>
		            <td>{item.level}</td>
		            <td>{item.email}</td>
		            <td>{item.phone}</td>
		            <td>{item.validity}</td>
		            <td className="text-center">
		              
		            </td>
		          </tr>
						))
					}
					</tbody>
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
	                      			<Image src={this.state.logo} width="120px" thumbnail />
	                      		</Col>
	                      		<Col md={9}>
				                      <div className="form-group">
				                      	<label>Nama Company</label>
				                      	<Form.Control type="text" name="nama" onChange={this.onChangeInput} placeholder="Nama Company" value={this.state.nama} />
				                      </div>
				                      <div className="form-group">
				                      	<label>Validity</label>
				                      	<Form.Control type="text" name="validity" onChange={this.onChangeInput} placeholder="Nama Company" value={this.state.validity} />
				                      </div>
				                      <div className="form-group" onChange={this.onChangeInput}>
				                      	<label>Status Company</label>
				                      	<br/>
				                      	{
						                      statusCompany.map(item => {
						                        return (
						                          <Form.Check name='status' inline label={item} checked={this.state.status === item} type='radio' value={item} />
						                        );
						                      })
						                    }
				                      </div>
				                      <div className="form-group">
				                      	<label>Logo Company</label>
				                      	<Form.Control className="form-control" type="file" onChange={this.onChangeInput} name="logo" placeholder="Nama Company" />
															</div>
				                      <button className="btn btn-sm btn-ideku" onClick={this.onClickUpdate}>
				                      	<i className="fa fa-edit"></i>
				                      	Ubah
			                      	</button>
	                      		</Col>
                      		</Row>
                      	</Card.Body>
                      </Card>

                  		<Row style={{ marginBottom: '32px'}}>
                  			<Col md={6}>
              						<h3 className="f-24 f-w-800 mb-3">
              							Cabang Company
	            							<Button data-type="cabang" onClick={this.onClickModal} className="btn btn-sm btn-ideku float-right">
	            								<i className="fa fa-plus"></i> Tambah Baru
	            							</Button>
	            							<div className="clearfix"></div>
            							</h3>
		                      <ListCabang items={cabang} />
		                      <Modal show={this.state.isModalCabang} onHide={this.handleCloseCabang}>
			                      <Modal.Body>
			                        <Modal.Title className="text-c-purple3 f-w-bold">Tambah Cabang Baru</Modal.Title>
			                        <div style={{marginTop: '20px'}} className="form-group">
			                        	<label>Cabang Baru</label>
			                        	<input value={this.state.namacabang} className="form-control" type="text" name="namacabang" onChange={this.onChangeInput} placeholder="Nama Cabang" />
			                        </div>
			                        <button style={{ marginTop: '50px'}} type="button"
			                        	data-grup={this.state.namacabang}
			                        	onClick={this.onClickTambahCabang}
			                          className="btn btn-block btn-ideku f-w-bold">
			                          Simpan
			                        </button>
			                        <button type="button"
			                          className="btn btn-block f-w-bold"
			                          onClick={this.handleCloseCabang}>
			                          Tidak
			                        </button>
			                      </Modal.Body>
			                    </Modal>
                  			</Col>

                  			<Col md={6}>
              						<h3 className="f-24 f-w-800 mb-3">
              							Grup Company
              							<Button data-type="grup" onClick={this.onClickModal} className="btn btn-sm btn-ideku float-right">
	            								<i className="fa fa-plus"></i> Tambah Baru
	            							</Button>
		          							<div className="clearfix"></div>
            							</h3>
		                      <ListGrup items={grup} />
		                      <Modal show={this.state.isModalGrup} onHide={this.handleCloseGrup}>
			                      <Modal.Body>
			                        <Modal.Title className="text-c-purple3 f-w-bold">Tambah Grup Baru</Modal.Title>
			                        <div style={{marginTop: '20px'}} className="form-group">
			                        	<label>Grup Baru</label>
			                        	<input value={this.state.namagrup} className="form-control" type="text" name="namagrup" onChange={this.onChangeInput} placeholder="Nama Grup" />
			                        </div>
			                        <button style={{marginTop: '50px'}} type="button"
			                        	data-grup={this.state.namagrup}
			                        	onClick={this.onClickTambahGrup}
			                          className="btn btn-block btn-ideku f-w-bold">
			                          Simpan
			                        </button>
			                        <button type="button"
			                          className="btn btn-block f-w-bold"
			                          onClick={this.handleCloseGrup}>
			                          Tidak
			                        </button>
			                      </Modal.Body>
			                    </Modal>
                  			</Col>
                  		</Row>
                  		
                      <h3 className="f-24 f-w-800 mb-3">User Company</h3>
                      <table
                        className="table-curved"
                        style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th className="text-center">No.</th>
                            <th>Nama</th>
                            <th>Identitas</th>
                            <th>Cabang</th>
                            <th>Level</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Validity</th>
                            <th className="text-center">
                              <Link
                                to={"/user-create"}
                                className="btn btn-ideku col-12 f-14"
                                style={{ padding: "7px 8px !important" }}
                              >
                                <img
                                  src="assets/images/component/person_add.png"
                                  className="button-img"
                                  alt=""
                                />
                                Tambah Baru
                              </Link>
                            </th>
                          </tr>
                        </thead>
                      	<ListUser items={user} />
                      </table>

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