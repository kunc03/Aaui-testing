import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form, Card, Col, Row, Modal, Image, Button } from 'react-bootstrap';
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';

import Users from './users';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';
import TagsInput from 'react-tagsinput'
import 'react-tagsinput/react-tagsinput.css'


import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";

export default class CompanyDetail extends Component {

	state = {
		companyId: '',
		tipe: '',
		grade: [],
		nama: '',
		status: '',
		validity: '',
		unlimited: '',
		dateValidity: new Date(),
		logo: '',
		tempLogo: '',

		menukiri: 'role',

		cabang: [],
		grup: [],
		user: [],
		access: {
			activity: 0,
			course: 0,
			manage_course: 0,
			forum: 0,
			group_meeting: 0,
			manage_group_meeting: 0
		},

		isModalCabang: false,
		namacabang: '',
		actioncabang: 'add',

		isModalSemester: false,
		namasemester: "",
		actionsemester: "add",

		isModalGrup: false,
		namagrup: '',
		actiongrup: 'add',

		isNotifikasi: false,
		isiNotifikasi: '',

		isKonfirmasi: false,
		jenisKonfirmasi: '',
		idKonfirmasi: '',

		isLocalSteps: false,
		steps: [
			{
				target: '.tambah-cabang',
				content: 'Pertama tambah data cabang terlebih dahulu.',
			},
			{
				target: '.tambah-grup',
				content: 'Kedua tambahkan data grup.',
			},
			{
				target: '.tambah-user',
				content: 'Baru yang terakhir Anda bisa membuat usernya.',
			},
		]
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

	handleCloseSemester = e => {
		this.setState({ isModalSemester: false, namasemester: '', actionsemester: 'add' });
	}

	onClickTambahSemester = e => {
		e.preventDefault();
		const formData = {
			company_id: this.state.companyId,
			semester_name: this.state.namasemester
		}

		if (formData.semester_name) {
			if (this.state.actionsemester === 'add') {
				// action for insert
				API.post(`${API_SERVER}v1/semester`, formData).then(res => {
					if (res.status === 200) {
						if (res.data.result === 'double data') {
							this.handleCloseSemester()
							this.setState({ isNotifikasi: true, isiNotifikasi: 'The data already exists. Group names cannot be the same.' })
						}
						else {
							formData.semester_id = res.data.result.semester_id;
							this.setState({
								semester: [...this.state.semester, formData],
								isModalSemester: false
							})
							this.handleCloseSemester();
						}
					}
				})
			} else {
				const idNya = this.state.actionsemester.split('_')[1];
				API.put(`${API_SERVER}v1/semester/${idNya}`, formData).then(res => {
					if (res.status === 200) {
						let linkURLSemester = `${API_SERVER}v1/semester/company/${this.state.companyId}`;
						API.get(linkURLSemester).then(res => {
							if (res.status === 200) {
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

	changeFormatDate = (value) => {
		let dt = new Date(value)
		return `${dt.getFullYear().toString().padStart(4, '0')}-${(dt.getMonth() + 1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`
	}

	onChangeInput = (event) => {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		if (name === 'logo') {
			if (target.files[0].size <= 500000) {
				this.setState({ tempLogo: target.files[0] });
			} else {
				target.value = null;
				this.setState({ isNotifikasi: true, isiNotifikasi: 'The file does not match the format, please check again.' })
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
			if (res.status === 200) {
				this.setState({ nama: formData.name, status: formData.status, validity: formData.validity });
			}
		});

		if (this.state.tempLogo != '') {
			const formLogo = new FormData();
			formLogo.append('logo', this.state.tempLogo);

			const linkURLLogo = `${API_SERVER}v1/company/logo/${this.state.companyId}`;
			API.put(linkURLLogo, formLogo).then(res => {
				if (res.status === 200) {
					this.setState({ logo: res.data.result });
				}
			})
		}

		this.setState({
			isNotifikasi: true,
			isiNotifikasi: "Company information has been changed successfully."
		});

	}

	onClickModal = e => {
		const tipe = e.target.getAttribute('data-type');

		if (tipe === 'cabang') {
			this.setState({ isModalCabang: true });
		} else if (tipe === 'semester') {
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

	onClickTambahCabang = e => {
		e.preventDefault();
		const formData = {
			company_id: this.state.companyId,
			branch_name: this.state.namacabang
		}

		if (formData.branch_name) {
			if (this.state.actioncabang === 'add') {
				// action for insert
				API.post(`${API_SERVER}v1/branch`, formData).then(res => {
					if (res.status === 200) {
						if (res.data.result === 'double data') {
							this.handleCloseCabang()
							this.setState({ isNotifikasi: true, isiNotifikasi: 'The data already exists. Group names cannot be the same.' })
						}
						else {
							formData.branch_id = res.data.result.branch_id;
							this.setState({
								cabang: [...this.state.cabang, formData],
								isModalCabang: false
							})
							this.handleCloseCabang()
						}
					}
				})
			} else {
				const idNya = this.state.actioncabang.split('_')[1];
				API.put(`${API_SERVER}v1/branch/${idNya}`, formData).then(res => {
					if (res.status === 200) {
						let linkURLCabang = `${API_SERVER}v1/branch/company/${this.state.companyId}`;
						API.get(linkURLCabang).then(res => {
							if (res.status === 200) {
								this.setState({ cabang: res.data.result[0], isModalCabang: false })
								this.handleCloseCabang()
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

	/* crud grup */

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

		if (this.state.actiongrup === 'add') {
			// action for insert
			API.post(`${API_SERVER}v1/grup`, formData).then(res => {
				console.log(res);
				if (res.status === 200) {
					if (res.data.result === 'double data') {
						this.handleCloseGrup()
						this.setState({ isNotifikasi: true, isiNotifikasi: 'The data already exists. Role names cannot be the same.' })
					}
					else {
						formData.grup_id = res.data.result.insertId;
						this.setState({
							grup: [...this.state.grup, formData],
							isModalGrup: false
						})
						this.handleCloseGrup()
					}
				}
			})
		} else {
			// action for update
			const idNya = this.state.actiongrup.split('_')[1];
			API.put(`${API_SERVER}v1/grup/${idNya}`, formData).then(res => {
				if (res.status === 200) {
					let linkURLGrup = `${API_SERVER}v1/grup/company/${this.state.companyId}`;
					API.get(linkURLGrup).then(res => {
						if (res.status === 200) {
							this.setState({ grup: res.data.result, isModalGrup: false })
							this.handleCloseGrup()
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

	/* end crud grup */

	openKonfirmasi = e => {
		this.setState({ isKonfirmasi: true, jenisKonfirmasi: e.target.getAttribute('data-type'), idKonfirmasi: e.target.getAttribute('data-id') })
	}

	onClickHapus = e => {
		e.preventDefault();
		const tipe = this.state.jenisKonfirmasi;
		const idNya = this.state.idKonfirmasi;

		let linkURL = `${API_SERVER}v1`;

		if (tipe === 'cabang') {
			linkURL += `/branch/${idNya}`;
		} else if (tipe === 'semester') {
			linkURL += `/semester/${idNya}`;
		} else {
			linkURL += `/grup/${idNya}`;
		}

		API.delete(linkURL).then(res => {
			if (res.status === 200) {
				if (tipe === 'cabang') {
					this.setState({
						cabang: this.state.cabang.filter(item => { return item.branch_id != idNya })
					})
					this.closeKonfirmasi();
				} else if (tipe === 'semester') {
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
		// const action = e.target.getAttribute('data-action');
		const idNya = e.target.getAttribute('data-id');
		if (tipe === 'cabang') {
			this.setState({ isModalCabang: true, namacabang: e.target.getAttribute('data-nama'), actioncabang: `action_${idNya}` });
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
		let isTour = localStorage.getItem('isTour');
		if (isTour) {
			this.setState({ isLocalSteps: true })
		}
	}

	handleJoyrideCallback = data => {
		const { action, index, status, type } = data;

		if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
			// Update state to advance the tour
			this.setState({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
		}
		else if ([STATUS.FINISHED].includes(status)) {
			// Need to set our running state to false, so we can restart if we click start again.
			this.setState({ isLocalSteps: true });
			localStorage.setItem('isTour', true);
		}

		console.groupCollapsed(type);
		console.log(data); //eslint-disable-line no-console
		console.groupEnd();
	};

	onClickMenuKiri = e => {
		this.setState({ menukiri: e.target.getAttribute('menu') });
	}

	handleChangeGrade(grade) {
		this.setState({ grade: grade });
	}

	fetchData() {
		API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
			if (res.status === 200) {
				this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });

				let linkURL = `${API_SERVER}v1/company/${this.state.companyId}`;
				API.get(linkURL).then(res => {
					if (res.status === 200) {
						this.setState({
							tipe: res.data.result.company_type,
							grade: res.data.result.company_grade == null ? [] : res.data.result.company_grade.split(','),
							nama: res.data.result.company_name,
							status: res.data.result.status,
							validity: res.data.result.validity.substring(0, 10),
							logo: res.data.result.logo,
							unlimited: res.data.result.unlimited
						});

						let linkURLSemester = `${API_SERVER}v1/semester/company/${this.state.companyId}`;
						API.get(linkURLSemester).then(res => {
							if (res.status === 200) {
								this.setState({ semester: res.data.result })
							}
						}).catch(err => {
							console.log(err);
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
							if (res.status === 200) {
								this.setState({ grup: res.data.result })
							}
						}).catch(err => {
							console.log(err);
						});

						let linkURLUser = `${API_SERVER}v1/user/company/${this.state.companyId}`;
						API.get(linkURLUser).then(res => {
							console.log('companyUser: ', res.data.result)
							if (res.status === 200) {
								res.data.result.map(item => {
									let temp = item;
									if (temp.validity != null) {
										temp.validity = item.validity.toString().substring(0, 10);
										return temp;
									}
								})
								this.setState({ user: res.data.result.reverse() })
							}
						}).catch(err => {
							console.log(err);
						});
					}
				}).catch(err => {
					console.log(err);
				})
			}
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

	render() {
		const { cabang, grup, access } = this.state;
		const statusCompany = ['active', 'nonactive'];
		let validityCompany = '';
		if (this.state.validity !== '') { validityCompany = new Date(this.state.validity); }

		const ListCabang = ({ items }) => {
			if (items.length == 0) {
				return (
					<div>
						<Card className="cardku" >
							<Card.Body>
								<Row>
									<Col>There are no branches</Col>
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
											<Col xs={2}>{i + 1}</Col>
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
		}

		const ListGrup = ({ items }) => {
			if (items.length === 0) {
				return (
					<div>
						<Card className="cardku" >
							<Card.Body>
								<Row>
									<Col>No groups</Col>
								</Row>
							</Card.Body>
						</Card>
					</div>
				);
			} else {
				return (
					<div>
						{
							items.map((item, i) => (
								<Card className="cardku" key={item.grup_id}>
									<Card.Body>
										<Row>
											<Col xs={2}>{i + 1}</Col>
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

		const ListSemester = ({ items }) => {
			if (items.length == 0) {
				return (
					<div>
						<Card className="cardku" >
							<Card.Body>
								<Row>
									<Col>No data available</Col>
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
											<Col xs={2}>{i + 1}</Col>
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
		const levelUser = Storage.get('user').data.level;
		return (
			<div className="pcoded-main-container">
				<div className="pcoded-wrapper">
					<div className="pcoded-content">
						<div className="pcoded-inner-content">
							<div className="main-body">
								<div className="page-wrapper">
									<div className="row">
										<div className="col-xl-12">
											{!this.state.isLocalSteps && (
												<Joyride
													callback={this.handleJoyrideCallback}
													steps={this.state.steps}
													continuous="true"
												/>
											)}

											<h3 className="f-24 f-w-800 mb-3">Company Information</h3>
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
																<label>Company Name</label>
																<Form.Control
																	type="text"
																	name="nama"
																	onChange={this.onChangeInput}
																	placeholder="Company Name"
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
																	disabled={levelUser !== 'superadmin'}
																/>
															</div>
															{
																levelUser === 'superadmin' &&
																<div className="form-group">
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
																					disabled={levelUser !== 'superadmin'}
																				/>
																				<div className="state p-success-o">
																					<label
																						className="f-18"
																						style={{
																							whiteSpace: "normal !important"
																						}}
																					>
																						<small
																							style={{
																								textTransform: "capitalize"
																							}}
																							className="f-w-bold f-18 text-c-black small-text"
																						>
																							{item}
																						</small>
																					</label>
																				</div>
																			</div>
																		);
																	})}
																</div>
															}
															<div className="form-group">
																<label>Logo Company</label>
																<Form.Control
																	accept="image/x-png,image/gif,image/jpeg,image/jpg"
																	className="form-control"
																	type="file"
																	onChange={this.onChangeInput}
																	name="logo"
																	placeholder="Company Name"
																/>
																<Form.Text className="text-muted">
																Make sure the file is in png, jpg, jpeg, or gif format and does not exceed 500KB
                                </Form.Text>
															</div>
															<button
																className="btn btn-sm btn-ideku"
																onClick={this.onClickUpdate}
															>
																<i className="fa fa-save"></i>
                                Save
                              </button>
														</Col>
													</Row>
												</Card.Body>
											</Card>

											<Card>
												<Card.Body>
													<Row style={{ marginBottom: "32px" }}>
														<Col md={2}>
															{
                                this.state.tipe === 'pendidikan' ?
                                  <ul className="list-group list-group-flush" style={{ fontWeight: 'bold' }}>
                                    <li onClick={this.onClickMenuKiri} menu="role" style={{ cursor: 'pointer' }} className={`list-group-item ${this.state.menukiri == 'role' ? 'back-active' : ''}`}>Role</li>
                                    <li onClick={this.onClickMenuKiri} menu="semester" style={{ cursor: 'pointer' }} className={`list-group-item ${this.state.menukiri == 'semester' ? 'back-active' : ''}`}>Semester</li>
                                  </ul>
                                :
                                  <ul className="list-group list-group-flush" style={{ fontWeight: 'bold' }}>
                                    <li onClick={this.onClickMenuKiri} menu="group" style={{ cursor: 'pointer' }} className={`list-group-item ${this.state.menukiri == 'group' ? 'back-active' : ''}`}>{this.state.tipe == 'pendidikan' ? 'Major' : 'Group'}</li>
                                    <li onClick={this.onClickMenuKiri} menu="role" style={{ cursor: 'pointer' }} className={`list-group-item ${this.state.menukiri == 'role' ? 'back-active' : ''}`}>Role</li>
                                  </ul>
                              }
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
																			<i className="fa fa-plus"></i> Add
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
																				<label>{this.state.tipe == 'pendidikan' ? 'Major' : 'Group'} Name</label>
																				<input
																					value={this.state.namacabang}
																					className="form-control"
																					type="text"
																					name="namacabang"
																					onChange={this.onChangeInput}
																					placeholder="Fill the name here"
																				/>
																			</div>
																			<button
																				style={{ marginTop: "50px" }}
																				type="button"
																				data-grup={this.state.namacabang}
																				onClick={this.onClickTambahCabang}
																				className="btn btn-block btn-ideku f-w-bold"
																			>
																				Save
                                      </button>
																			<button
																				type="button"
																				className="btn btn-block f-w-bold"
																				onClick={this.handleCloseCabang}
																			>
																				Cancel
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
																			<i className="fa fa-plus"></i> Add
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
																				New Role
                                      </Modal.Title>
																			<div
																				style={{ marginTop: "20px" }}
																				className="form-group"
																			>
																				<label>Role Name</label>
																				<input
																					value={this.state.namagrup}
																					className="form-control"
																					type="text"
																					name="namagrup"
																					onChange={this.onChangeInput}
																					placeholder="Type Role Name Here"
																				/>

																				{/* <table
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
																				</table> */}
																			</div>
																			<button
																				style={{ marginTop: "50px" }}
																				type="button"
																				data-grup={this.state.namagrup}
																				onClick={this.onClickTambahGrup}
																				className="btn btn-block btn-ideku f-w-bold"
																			>
																				Save
                                      </button>
																			<button
																				type="button"
																				className="btn btn-block f-w-bold"
																				onClick={this.handleCloseGrup}
																			>
																				Cancel
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
																					inputProps={{ placeholder: 'Company Grade' }}
																				/>
																			</div>
																			<button
																				className="btn btn-sm btn-ideku"
																				onClick={this.onClickUpdate}
																			>
																				<i className="fa fa-save"></i>
				                                Save
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
																					<i className="fa fa-plus"></i> Add
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
																						<label>Semester Name</label>
																						<input
																							value={this.state.namasemester}
																							className="form-control"
																							type="text"
																							name="namasemester"
																							onChange={this.onChangeInput}
																							placeholder="Fill semester name here"
																						/>
																					</div>
																					<button
																						style={{ marginTop: "50px" }}
																						type="button"
																						data-grup={this.state.namasemester}
																						onClick={this.onClickTambahSemester}
																						className="btn btn-block btn-ideku f-w-bold"
																					>
																						Save
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

											<Users
												match={{ params: { company_id: this.state.companyId } }}
											/>

											<Modal
												show={this.state.isNotifikasi}
												onHide={this.closeNotifikasi}
											>
												<Modal.Body>
													<Modal.Title className="text-c-purple3 f-w-bold">
														Alert
                          </Modal.Title>

													<p style={{ color: "black", margin: "20px 0px" }}>
														{this.state.isiNotifikasi}
													</p>

													<button
														type="button"
														className="btn btn-block f-w-bold"
														onClick={this.closeNotifikasi}
													>
														Yes
                          </button>
												</Modal.Body>
											</Modal>

											<Modal
												show={this.state.isKonfirmasi}
												onHide={this.closeKonfirmasi}
											>
												<Modal.Body>
													<Modal.Title className="text-c-purple3 f-w-bold">
														Alert
                          </Modal.Title>

													<p style={{ color: "black", margin: "20px 0px" }}>
														Are you sure want to delete this data ?
                          </p>

													<button
														type="button"
														className="btn btn-block btn-ideku f-w-bold"
														onClick={this.onClickHapus}
													>
														Yes, Delete
                          </button>
													<button
														type="button"
														className="btn btn-block f-w-bold"
														onClick={this.closeKonfirmasi}
													>
														No
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
