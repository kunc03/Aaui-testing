import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import Moment from "react-moment";

export default class KursusMateri extends Component {

	state = {
		companyId: '',
		kursus: [],
		isModalHapus: false,
		courseIdHapus: '',
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
			if (res.status === 200) {
				this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
				if (Storage.get('user').data.level === 'superadmin') {
					API.get(`${API_SERVER}v1/course/company/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id}`).then(res => {
						console.log('count: ', res.data.result.length)
						if (res.status === 200) {
							this.setState({ kursus: res.data.result.reverse() });
						}
					})
				}
				else {
					API.get(`${API_SERVER}v1/mycourse/${Storage.get('user').data.user_id}/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id}`).then(res => {
						console.log('count: ', res.data.result.length)
						if (res.status === 200) {
							this.setState({ kursus: res.data.result.reverse() });
						}
					})
				}
			}
		});

	}

	onClickHapus = e => {
		e.preventDefault();
		this.setState({ isModalHapus: true, courseIdHapus: e.target.getAttribute('data-id') });
	}

	handleModalHapus = e => {
		this.setState({ isModalHapus: false, courseIdHapus: '' });
	}

	onClickHapusKursus = e => {
		API.put(`${API_SERVER}v1/course/delete/${this.state.courseIdHapus}`).then(res => {
			if (res.status === 200) {
				console.log('resss', res)
				this.fetchData();
				this.handleModalHapus();
			}
		})
	}

	render() {
		const { kursus } = this.state;

		const CheckMedia = ({ media }) => {
			if (media) {
				let ekSplit = media.split(".");
				let ektension = ekSplit[ekSplit.length - 1];
				if (ektension === "jpg" || ektension === "png" || ektension === "jpeg") {
					return (
						<img
							className="img-thumbnail"
							src={media}
							width="200px"
							style={{ height: "100px" }}
							alt="Cover"
						/>
					)
				} else {
					return (
						<img
							className="img-thumbnail"
							src={`https://media.istockphoto.com/videos/play-button-blue-video-id472605657?s=640x640`}
							width="200px"
							style={{ height: "100px" }}
							alt="Cover"
						/>
					)
				}
			}
			return null
		}

		const ListKursus = ({ lists }) => {
			if (lists.length === 0) {
				return (
					<tbody>
						<tr>
							<td colSpan={8}>No data available</td>
						</tr>
					</tbody>
				);
			} else {
				return (
					<tbody>
						{
							lists.map((item, i) => (
								<tr key={item.course_id}>
									<td>{i + 1}</td>
									<td>
										<CheckMedia media={item.thumbnail ? item.thumbnail : item.image} />
									</td>
									<td>{item.category_name}</td>
									<td><Link to={`/chapter/${item.course_id}`} className="buttonku" title="Detail">{item.title}</Link></td>

									<td><Moment format="DD/MM/YYYY">{item.created_at}</Moment></td>
									<td><i className={(item.publish === 1) ? 'fa fa-check' : 'fa fa-ban'}></i></td>
									<td>
										<Link to={`/nilaiujian/${item.course_id}`} className="buttonku ml-2" title="Nilai Ujian">
											<i data-id={item.course_id} className="fa fa-graduation-cap"></i>
										</Link>
										<Link to={`/chapter/${item.course_id}`} className="buttonku ml-2" title="Detail">
											<i data-id={item.course_id} className="fa fa-search"></i>
										</Link>
										<Link to={`/kursus-materi-edit/${item.course_id}`} className="buttonku ml-2" title="Edit">
											<i data-id={item.course_id} className="fa fa-edit"></i>
										</Link>
										<Link to="#" className="buttonku ml-2" title="Hapus">
											<i onClick={this.onClickHapus} data-id={item.course_id} className="fa fa-trash"></i>
										</Link>
									</td>
								</tr>
							))
						}
					</tbody>
				);
			}
		};

		return (
			<div className="pcoded-main-container">
				<div className="pcoded-wrapper">
					<div className="pcoded-content">
						<div className="pcoded-inner-content">
							<div className="main-body">
								<div className="page-wrapper">
									<div className="row">
										<div className="col-xl-12">
											<h3 className="f-24 f-w-800">Kursus & Materi</h3>

											<div style={{ overflowX: "auto" }}>
												<table className="table-curved" style={{ width: "100%" }}>
													<thead>
														<tr>
															<th className="text-center">ID</th>
															<th>Cover</th>
															<th> Category </th>
															<th> Title </th>
															<th> Date </th>
															<th>Publish</th>
															<th className="text-center">
																<Link
																	to={"/kursus-materi-create"}
																	className="btn btn-ideku col-12 f-14"
																	style={{ padding: "7px 8px !important" }}>
																	<img
																		src="assets/images/component/person_add.png"
																		className="button-img"
																		alt=""
																	/>
                                  Add New
                                </Link>
															</th>
														</tr>
													</thead>
													<ListKursus lists={kursus} />
												</table>
											</div>

											<Modal show={this.state.isModalHapus} onHide={this.handleModalHapus}>
												<Modal.Body>
													<Modal.Title className="text-c-purple3 f-w-bold">Hapus Kursus</Modal.Title>
													<div style={{ marginTop: '20px' }} className="form-group">
														<p className="f-w-bold">Apakah Anda yakin untuk menghapus kursus & materi ini ?</p>
													</div>
													<button style={{ marginTop: '50px' }} type="button"
														onClick={this.onClickHapusKursus}
														className="btn btn-block btn-ideku f-w-bold">
														Ya, Hapus
	                        </button>
													<button type="button"
														className="btn btn-block f-w-bold"
														onClick={this.handleModalHapus}>
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