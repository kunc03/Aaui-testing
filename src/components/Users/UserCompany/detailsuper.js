import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form, Card, Col, Row, Button, Image, Modal } from 'react-bootstrap';
import API, { API_SERVER } from '../../../repository/api';

import UsersSuper from "./userssuper";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ToggleSwitch from "react-switch";

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'

export default class CompanyDetail extends Component {

	state = {
    // companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : this.props.match.params.company_id,
    companyId: this.props.match.params.company_id,
    nama: "",
		tipe: "",
		grade: [],
		status: "",
		validity: '',
		dateValidity: new Date(),
    unlimited:false,
		logo: "",
		tempLogo: "",

    "menukiri": "group",

		cabang: [],
		grup: [],
    user: [],
    semester: [],
    access: {
      activity: 0,
      course: 0,
      manage_course: 0,
      forum: 0,
      group_meeting: 0,
      manage_group_meeting: 0
    },
		
		isModalCabang: false,
		namacabang: "",
		actioncabang: "add",

		isModalSemester: false,
		namasemester: "",
		actionsemester: "add",
		
		isModalGrup: false,
		namagrup: "",
		actiongrup: "add",

		isNotifikasi: false,
		isiNotifikasi: "",

		isKonfirmasi: false,
		jenisKonfirmasi: "",
		idKonfirmasi: ""
	}

  toggleSwitch(checked) {
    this.setState({ unlimited:!this.state.unlimited });
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
			if (target.files[0].size <= 500000) {
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
    
    let unlimited = this.state.unlimited == false ? '1' : '0'
  	let formData = {
  		company_id: this.state.companyId,
      name: this.state.nama,
  		type: this.state.tipe,
  		grade: this.state.grade.toString(),
  		status: this.state.status,
  		validity: this.state.validity.split('T')[0],
  		unlimited: unlimited,
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
  	} else if(tipe === 'semester') {
  		this.setState({ isModalSemester: true });
  	} else {
      let access = this.state.access;
      access['activity'] = 0;
      access['course'] = 0;
      access['manage_course'] = 0;
      access['forum'] = 0;
      access['group_meeting'] = 0;
      access['manage_group_meeting'] = 0;

      this.setState({ isModalGrup: true });
      this.setState(access);
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
            if (res.data.result==='double data'){
              this.handleCloseCabang()
              this.setState({ isNotifikasi: true, isiNotifikasi: 'Data sudah ada. Nama group tidak boleh sama.' })
            }
            else{
              formData.branch_id = res.data.result.branch_id;
              this.setState({
                cabang: [...this.state.cabang, formData ],
                isModalCabang: false
              })
              this.handleCloseCabang();
            }
					}
				})
			} else {
				const idNya = this.state.actioncabang.split('_')[1];
				API.put(`${API_SERVER}v1/branch/${idNya}`, formData).then(res => {
					if(res.status === 200) {
						let linkURLCabang = `${API_SERVER}v1/branch/company/${this.state.companyId}`;
						API.get(linkURLCabang).then(res => {
							if(res.status === 200) {
								this.setState({ cabang: res.data.result[0], isModalCabang: false })
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

  onClickTambahSemester = e => {
  	e.preventDefault();
  	const formData = {
  		company_id: this.state.companyId,
  		semester_name: this.state.namasemester
		}
		
		if(formData.semester_name) {
			if(this.state.actionsemester === 'add') {
				// action for insert
				API.post(`${API_SERVER}v1/semester`, formData).then(res => {
					if(res.status === 200) {
            if (res.data.result==='double data'){
              this.handleCloseSemester()
              this.setState({ isNotifikasi: true, isiNotifikasi: 'Data sudah ada. Nama group tidak boleh sama.' })
            }
            else{
              formData.semester_id = res.data.result.semester_id;
              this.setState({
                semester: [...this.state.semester, formData ],
                isModalSemester: false
              })
              this.handleCloseSemester();
            }
					}
				})
			} else {
				const idNya = this.state.actionsemester.split('_')[1];
				API.put(`${API_SERVER}v1/semester/${idNya}`, formData).then(res => {
					if(res.status === 200) {
						let linkURLSemester = `${API_SERVER}v1/semester/company/${this.state.companyId}`;
						API.get(linkURLSemester).then(res => {
							if(res.status === 200) {
								this.setState({ semester: res.data.result, isModalSemester: false })
								this.handleCloseSemester();
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

  handleCloseSemester = e => {
  	this.setState({ isModalSemester: false, namasemester: '', actionsemester: 'add' });
  }

  onClickTambahGrup = e => {
    e.preventDefault();
  	const formData = {
      company_id: this.state.companyId,
  		grup_name: this.state.namagrup
    }
    /**
     * concat object with state access
     */
    Object.assign(formData, this.state.access);
		
		if(formData.grup_name) {
			if(this.state.actiongrup === 'add') {
				// action for insert
				API.post(`${API_SERVER}v1/grup`, formData).then(res => {
					console.log(res);
					if(res.status === 200) {
            if (res.data.result==='double data'){
              this.handleCloseGrup()
              this.setState({ isNotifikasi: true, isiNotifikasi: 'Data sudah ada. Nama role tidak boleh sama.' })
            }
            else{
              formData.grup_id = res.data.result.insertId;
              this.setState({
                grup: [...this.state.grup, formData ],
                isModalGrup: false
              })
              this.handleCloseGrup();				
            }	
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
  	} else if (tipe === 'semester') {
  		linkURL += `/semester/${idNya}`;
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
  			} else if(tipe === 'semester') {
  				this.setState({
	  				semester: this.state.semester.filter(item => { return item.semester_id != idNya })
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
  	} else if(tipe === 'semester') {
  		this.setState({ isModalSemester: true, namasemester: e.target.getAttribute('data-nama'), actionsemester: `action_${idNya}`});
  	} else {  		
      const parsing = JSON.parse(e.target.getAttribute('data-access'));
      let access = this.state.access;
      access['activity'] = parsing.activity;
      access['course'] = parsing.course;
      access['manage_course'] = parsing.manage_course;
      access['forum'] = parsing.forum;
      access['group_meeting'] = parsing.group_meeting;
      access['manage_group_meeting'] = parsing.manage_group_meeting;
      
  		this.setState({ 
        isModalGrup: true, 
        namagrup: e.target.getAttribute('data-nama'), 
        actiongrup: `action_${idNya}`
      });
      this.setState(access);
  	}
  }

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
    let linkURL = `${API_SERVER}v1/company/${this.state.companyId}`;
    
		API.get(linkURL).then(res => {
			if(res.status === 200) {
        let unlimited = res.data.result.unlimited == 0 ? true : false;
				this.setState({ 
          nama: res.data.result.company_name, 
					tipe: res.data.result.company_type, 
					grade: res.data.result.company_grade == null ? [] : res.data.result.company_grade.split(','), 
					status: res.data.result.status, 
					validity: res.data.result.validity,
          logo: res.data.result.logo,
          unlimited: unlimited
        });

        let linkURLCabang = `${API_SERVER}v1/branch/company/${this.state.companyId}`;
				API.get(linkURLCabang).then(res => {
					if(res.status === 200) {
						this.setState({ cabang: res.data.result[0] })
					}
				}).catch(err => {
					console.log(err);
				});

				let linkURLSemester = `${API_SERVER}v1/semester/company/${this.state.companyId}`;
				API.get(linkURLSemester).then(res => {
					if(res.status === 200) {
						this.setState({ semester: res.data.result })
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
  
  /**
   * update checkbox
   * set state access true or false
   */
  handleChangeAccess = e => {
		const name = e.target.name;
		const checked = e.target.checked;

    let access = this.state.access;
    access[name] = checked ? 1 : 0;
    
    this.setState(access);
	}

  onClickMenuKiri = e => {
    this.setState({ menukiri: e.target.getAttribute('menu') });
  }

  handleChangeGrade(grade) {
    this.setState({grade: grade});
  }

	render() {

		const { cabang, grup, user, access } = this.state;
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
	          			<Col>Tidak ada data</Col>
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

		const ListSemester = ({items}) => {
			if(items.length == 0) {
				return (
					<div>
						<Card className="cardku" >
	          	<Card.Body>
	          		<Row>
	          			<Col>Tidak ada data</Col>
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
							<Card className="cardku" key={item.semester_id}>
		          	<Card.Body>
		          		<Row>
		          			<Col xs={2}>{i+1}</Col>
		          			<Col xs={8}>{item.semester_name}</Col>
		          			<Col>
		          				<Link to="#" className="buttonku">
		          					<i data-type="semester" data-action="update" data-id={item.semester_id} data-nama={item.semester_name} onClick={this.onClickUbah} className="fa fa-edit"></i>
	          					</Link>
		          				<Link to="#" className="buttonku">
		          					<i data-type="semester" data-id={item.semester_id} onClick={this.openKonfirmasi} className="fa fa-trash"></i>
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
	          			<Col>Tidak ada data</Col>
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
		          					<i data-type="grup" data-action="update" data-id={item.grup_id} data-nama={item.grup_name} data-access={JSON.stringify(item)} onClick={this.onClickUbah} className="fa fa-edit"></i>
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
                                <label>Tipe Company</label>
                                <select onChange={this.onChangeInput} name="tipe" className="form-control" style={{textTransform: 'capitalize'}}>
                                  <option value="">Pilih tipe company</option>
                                  <option value="perusahaan" selected={this.state.tipe == 'perusahaan'? 'selected' : ''}>Perusahaan</option>
                                  <option value="pendidikan" selected={this.state.tipe == 'pendidikan'? 'selected' : ''}>Pendidikan</option>
                                </select>
                              </div>
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
                                <label className="label-input" htmlFor>
                                  Batasi Waktu
                                </label>
                                <div style={{width:'100%'}}>
                                <ToggleSwitch checked={false} onChange={this.toggleSwitch.bind(this)} checked={this.state.unlimited} />
                                </div>

                              </div>
                              {
                                this.state.unlimited &&
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
                              }
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

                      <Card>
                        <Card.Body>
                          <Row style={{ marginBottom: "32px" }}>
                            <Col md={2}>
                              <ul className="list-group list-group-flush" style={{fontWeight: 'bold'}}>
                                <li onClick={this.onClickMenuKiri} menu="group" style={{cursor: 'pointer'}} className={`list-group-item ${this.state.menukiri == 'group' ? 'back-active' : ''}`}>{this.state.tipe == 'pendidikan' ? 'Major' : 'Group'}</li>
                                <li onClick={this.onClickMenuKiri} menu="role" style={{cursor: 'pointer'}} className={`list-group-item ${this.state.menukiri == 'role' ? 'back-active' : ''}`}>Role</li>
                              
                              	{this.state.tipe == 'pendidikan' &&  
                              		<div style={{marginTop: '1px'}}>
		                                <li onClick={this.onClickMenuKiri} menu="grade" style={{cursor: 'pointer'}} className={`list-group-item ${this.state.menukiri == 'grade' ? 'back-active' : ''}`}>Grade</li>
		                                <li onClick={this.onClickMenuKiri} menu="semester" style={{cursor: 'pointer'}} className={`list-group-item ${this.state.menukiri == 'semester' ? 'back-active' : ''}`}>Semester</li>
	                                </div>
                              	}
                              </ul>
                            </Col>
                            
                            <Col md={10}>
                              
                              {this.state.menukiri == 'group' && 
                                <div id="gorup">
                                  <h3 className="f-24 f-w-800 mb-3">
                                    {this.state.tipe == 'pendidikan' ? 'Major' : 'Group'}
                                    <Button
                                      data-type="cabang"
                                      onClick={this.onClickModal}
                                      className="btn btn-sm btn-ideku float-right tambah-cabang"
                                    >
                                      <i className="fa fa-plus"></i> Tambah
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
                                        {this.state.tipe == 'pendidikan' ? 'Major' : 'Group'}
                                      </Modal.Title>
                                      <div
                                        style={{ marginTop: "20px" }}
                                        className="form-group"
                                      >
                                        <label>Nama {this.state.tipe == 'pendidikan' ? 'Major' : 'Group'}</label>
                                        <input
                                          value={this.state.namacabang}
                                          className="form-control"
                                          type="text"
                                          name="namacabang"
                                          onChange={this.onChangeInput}
                                          placeholder="Nama"
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
                                </div>
                              }

                              {this.state.menukiri == 'role' && 
                                <div id="role">
                                  <h3 className="f-24 f-w-800 mb-3">
                                    Role
                                    <Button
                                      data-type="grup"
                                      onClick={this.onClickModal}
                                      className="btn btn-sm btn-ideku float-right tambah-grup"
                                    >
                                      <i className="fa fa-plus"></i> Tambah
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
                                        Role Baru
                                      </Modal.Title>
                                      <div
                                        style={{ marginTop: "20px" }}
                                        className="form-group"
                                      >
                                        <label>Nama Role</label>
                                        <input
                                          value={this.state.namagrup}
                                          className="form-control"
                                          type="text"
                                          name="namagrup"
                                          onChange={this.onChangeInput}
                                          placeholder="Nama Role"
                                        />

                                        <table
                                          className="table-curved"
                                          style={{ width: "100%" }}>
                                            <tr>
                                              <td>Aktivitas</td>
                                              <td><input checked={(access.activity)} onChange={this.handleChangeAccess} type="checkbox" name="activity" /></td>
                                            </tr>
                                            <tr>
                                              <td>Kursus & Materi</td>
                                              <td><input checked={(access.course)} onChange={this.handleChangeAccess} type="checkbox" name="course" /></td>
                                            </tr>
                                            <tr>
                                              <td>Kelola Kursus</td>
                                              <td><input checked={(access.manage_course)} onChange={this.handleChangeAccess} type="checkbox" name="manage_course" /></td>
                                            </tr>
                                            <tr>
                                              <td>Forum</td>
                                              <td><input checked={(access.forum)} onChange={this.handleChangeAccess} type="checkbox" name="forum" /></td>
                                            </tr>
                                            <tr>
                                              <td>Group Meeting</td>
                                              <td><input checked={(access.group_meeting)} onChange={this.handleChangeAccess} type="checkbox" name="group_meeting" /></td>
                                            </tr>
                                            <tr>
                                              <td>Kelola Group Meeting</td>
                                              <td><input checked={(access.manage_group_meeting)} onChange={this.handleChangeAccess} type="checkbox" name="manage_group_meeting" /></td>
                                            </tr>
                                        </table>
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
                                </div>
                              }

                              {this.state.tipe == 'pendidikan' &&  
                              	<div>
		                              {this.state.menukiri == 'grade' && 
		                                <div id="grade">
		                                  <h3 className="f-24 f-w-800 mb-3">
		                                    Grade
		                                    <div className="clearfix"></div>
		                                  </h3>
		                                  <div className="form-group">
		                                  	<label>Company Grade</label>
		                                  	<TagsInput
												                  value={this.state.grade}
												                  onChange={this.handleChangeGrade.bind(this)}
												                  addOnPaste={true}
												                  inputProps={{placeholder:'Company Grade'}}
												                />
		                                  </div>
		                                  <button
				                                className="btn btn-sm btn-ideku"
				                                onClick={this.onClickUpdate}
				                              >
				                                <i className="fa fa-save"></i>
				                                Simpan
				                              </button>
		                                </div>
		                              }

		                              {this.state.menukiri == 'semester' && 
		                                <div id="semester">
		                                  <h3 className="f-24 f-w-800 mb-3">
		                                    Semester
		                                    <Button
		                                      data-type="semester"
		                                      onClick={this.onClickModal}
		                                      className="btn btn-sm btn-ideku float-right tambah-semester"
		                                    >
		                                      <i className="fa fa-plus"></i> Tambah
		                                    </Button>
		                                    <div className="clearfix"></div>
		                                  </h3>
		                                  <ListSemester items={this.state.semester} />
		                                  <Modal
		                                    show={this.state.isModalSemester}
		                                    onHide={this.handleCloseSemester}
		                                  >
		                                    <Modal.Body>
		                                      <Modal.Title className="text-c-purple3 f-w-bold">
		                                        Semester
		                                      </Modal.Title>
		                                      <div
		                                        style={{ marginTop: "20px" }}
		                                        className="form-group"
		                                      >
		                                        <label>Nama Semester</label>
		                                        <input
		                                          value={this.state.namasemester}
		                                          className="form-control"
		                                          type="text"
		                                          name="namasemester"
		                                          onChange={this.onChangeInput}
		                                          placeholder="Nama Semester"
		                                        />
		                                      </div>
		                                      <button
		                                        style={{ marginTop: "50px" }}
		                                        type="button"
		                                        data-grup={this.state.namasemester}
		                                        onClick={this.onClickTambahSemester}
		                                        className="btn btn-block btn-ideku f-w-bold"
		                                      >
		                                        Simpan
		                                      </button>
		                                      <button
		                                        type="button"
		                                        className="btn btn-block f-w-bold"
		                                        onClick={this.handleCloseSemester}
		                                      >
		                                        Tidak
		                                      </button>
		                                    </Modal.Body>
		                                  </Modal>
		                                </div>
		                              }
	                              </div>
                            	}

                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>

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