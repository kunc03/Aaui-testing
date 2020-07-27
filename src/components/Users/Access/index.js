import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';

export default class UserAccess extends Component {

	state = {
		companyId: '',
		access: [],
		users: [],

		userAccess: ['user','branch','category','activities','course','enroll_course','quiz','exam','forum','class'],

		userId: '',
		userNama: '',
		
		user_id: '',
		access_user: '',
		access_branch: '',
		access_category: '',
		access_activities: '',
		access_course: '',
		access_enroll_course: '',
		access_quiz: '',
		access_exam: '',
		access_forum: '',
		access_class: '',

		isModalTambah: false,

		isModalUbah: false,
		idModalUbah: '',

		isModalHapus: false,
		idModalHapus: ''
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200) {
				this.setState({ companyId: res.data.result.company_id });

        API.get(`${API_SERVER}v1/access/company/${this.state.companyId}`).then(res => {
					if(res.status === 200) {
						this.setState({ access: res.data.result });
					}
				})

				API.get(`${API_SERVER}v1/access/user/${this.state.companyId}`).then(res => {
					if(res.status === 200) {
						this.setState({ users: res.data.result })
					}
				})
      }
    })
	}

	handleChangeInput = e => {
		const name = e.target.name;
		const value = e.target.value;
		const checked = e.target.checked;

		if(name === 'user_id') {
			this.setState({ [name]: value });
		} else {
			this.setState({ [name]: (checked) ? 'Y' : '' })
		}
	}

	onClickTambah = e => {
		e.preventDefault();
		this.setState({ isModalTambah: true })
		this.fetchData();
	}

	onClickTambahAkses = e => {
		e.preventDefault();
		let formData = {
			user_id: this.state.user_id,
			access_user: this.state.access_user,
			access_branch: this.state.access_branch,
			access_category: this.state.access_category,
			access_activities: this.state.access_activities,
			access_course: this.state.access_course,
			access_enroll_course: this.state.access_enroll_course,
			access_quiz: this.state.access_quiz,
			access_exam: this.state.access_exam,
			access_forum: this.state.access_forum,
			access_class: this.state.access_class
		};

		API.post(`${API_SERVER}v1/access`, formData).then(res => {
			if(res.status === 200) {
				this.fetchData();
				this.handleModalTambah();
			}
		})
	}

	onClickUbah = e => {
		e.preventDefault();
		const userId = e.target.getAttribute('data-id');
		const userNama = e.target.getAttribute('data-nama');
		API.get(`${API_SERVER}v1/access/id/${userId}`).then(res => {
			if(res.status === 200) {
				this.setState({ isModalUbah: true, userId: userId, userNama: userNama,
					access_user: res.data.result.access_user,
					access_branch: res.data.result.access_branch,
					access_category: res.data.result.access_category,
					access_activities: res.data.result.access_activities,
					access_course: res.data.result.access_course,
					access_enroll_course: res.data.result.access_enroll_course,
					access_quiz: res.data.result.access_quiz,
					access_exam: res.data.result.access_exam,
					access_forum: res.data.result.access_forum,
					access_class: res.data.result.access_class,
				});
			}
		})
	}

	onClickUbahAkses = e => {
		e.preventDefault();
		let formData = {
			user_id: this.state.userId,
			access_user: this.state.access_user,
			access_branch: this.state.access_branch,
			access_category: this.state.access_category,
			access_activities: this.state.access_activities,
			access_course: this.state.access_course,
			access_enroll_course: this.state.access_enroll_course,
			access_quiz: this.state.access_quiz,
			access_exam: this.state.access_exam,
			access_forum: this.state.access_forum,
			access_class: this.state.access_class
		};

		API.put(`${API_SERVER}v1/access/id/${this.state.userId}`, formData).then(res => {
			if(res.status === 200) {
				this.fetchData();
				this.handleModalUbah();
			}
		})
	}

	onClickHapus = e => {
		e.preventDefault();
		const userId = e.target.getAttribute('data-id');
		this.setState({ isModalHapus: true, userId: userId })
	}

	onClickHapusAkses = e => {
		e.preventDefault();
		API.delete(`${API_SERVER}v1/access/id/${this.state.userId}`).then(res => {
			if(res.status === 200) {
				this.fetchData();
				this.handleModalHapus();
			}
		})
	}

	handleModalTambah = e => {
		this.setState({ isModalTambah: false,
			access_user: '',
			access_branch: '',
			access_category: '',
			access_activities: '',
			access_course: '',
			access_enroll_course: '',
			access_quiz: '',
			access_exam: '',
			access_forum: '',
			access_class: ''
		});
	}

	handleModalUbah = e => {
		this.setState({ isModalUbah: false,
			access_user: '',
			access_branch: '',
			access_category: '',
			access_activities: '',
			access_course: '',
			access_enroll_course: '',
			access_quiz: '',
			access_exam: '',
			access_forum: '',
			access_class: ''
		});
	}

	handleModalHapus = e => {
		this.setState({ isModalHapus: false });
	}

	render() {
		const { access, users, userAccess } = this.state;

		const ListAccess = ({items}) => {
			if(items.length === 0) {
				return (
					<tbody>
						<tr>
							<td colSpan="13">Tidak ada data akses user</td>
						</tr>
					</tbody>
				);
			} else {
				return (
					<tbody>
						{
							items.map((item, i) => (
								<tr key={item.access_id}>
									<td>{i+1}</td>
									<td>{item.name}</td>
									<td><i className={(item.access_user === 'Y') ? 'fa fa-check':'fa fa-ban'}></i></td>
									<td><i className={(item.access_branch === 'Y') ? 'fa fa-check':'fa fa-ban'}></i></td>
									<td><i className={(item.access_category === 'Y') ? 'fa fa-check':'fa fa-ban'}></i></td>
									<td><i className={(item.access_activities === 'Y') ? 'fa fa-check':'fa fa-ban'}></i></td>
									<td><i className={(item.access_course === 'Y') ? 'fa fa-check':'fa fa-ban'}></i></td>
									<td><i className={(item.access_enroll_course === 'Y') ? 'fa fa-check':'fa fa-ban'}></i></td>
									<td><i className={(item.access_quiz === 'Y') ? 'fa fa-check':'fa fa-ban'}></i></td>
									<td><i className={(item.access_exam === 'Y') ? 'fa fa-check':'fa fa-ban'}></i></td>
									<td><i className={(item.access_forum === 'Y') ? 'fa fa-check':'fa fa-ban'}></i></td>
									<td><i className={(item.access_class === 'Y') ? 'fa fa-check':'fa fa-ban'}></i></td>
									<td>
										<Link to="#" className="buttonku">
	          					<i onClick={this.onClickUbah} data-id={item.access_id} data-nama={item.name} className="fa fa-edit"></i>
          					</Link>
	          				<Link to="#" className="buttonku">
	          					<i onClick={this.onClickHapus} data-id={item.access_id} className="fa fa-trash"></i>
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
                      
                      <h3 className="f-24 f-w-800 mb-3">Access User</h3>

                      <table
                        className="table-curved"
                        style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th className="text-center">ID</th>
                            <th>Nama</th>
                            <th>User</th>
                            <th>Cabang</th>
                            <th>Kategori</th>
                            <th>Aktivitas</th>
                            <th>Kursus</th>
                            <th>Enroll</th>
                            <th>Quiz</th>
                            <th>Ujian</th>
                            <th>Forum</th>
                            <th>Kelas</th>
                            <th className="text-center">
                              <Link
                                to="#"
                                className="btn btn-ideku col-12 f-14"
                                style={{ padding: "7px 8px !important" }}
                                onClick={this.onClickTambah}
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
                      	<ListAccess items={access} />
                      </table>

                      <Modal show={this.state.isModalTambah} onHide={this.handleModalTambah}>
	                      <Modal.Body>
	                        <Modal.Title className="text-c-purple3 f-w-bold">Tambah Akses User</Modal.Title>
	                        <div style={{marginTop: '20px'}} className="form-group">
	                        	<label>Nama User</label>
	                        	<select name="user_id" className="form-control" onChange={this.handleChangeInput}>
	                        		<option value="">-- pilih --</option>
	                        		{
	                        			users.map(item => (
	                        				<option key={item.user_id} value={item.user_id}>{item.name}</option>
	                        			))
	                        		}
	                        	</select>
	                        </div>
	                        <div className="form-group">
	                        	<label>Akses User</label>
	                        	<br/>
	                        	{
	                        		userAccess.map(item => (
	                        			<div className="pretty p-default p-round p-thick m-b-35">
			                            <input onChange={this.handleChangeInput} value="Y" name={`access_${item}`} type="checkbox" />
			                            <div className="state p-success-o">
			                              <label className="f-18" style={{ whiteSpace: "normal !important" }}>
			                                <small className="f-w-bold f-18 text-c-black small-text">
			                                  {item}
			                                </small>
			                              </label>
			                            </div>
			                          </div>
	                        		))
	                        	}
                          </div>
	                        <button style={{ marginTop: '50px'}} type="button"
	                        	onClick={this.onClickTambahAkses}
	                          className="btn btn-block btn-ideku f-w-bold">
	                          Simpan
	                        </button>
	                        <button type="button"
	                          className="btn btn-block f-w-bold"
	                          onClick={this.handleModalTambah}>
	                          Tidak
	                        </button>
	                      </Modal.Body>
	                    </Modal>

	                    <Modal show={this.state.isModalUbah} onHide={this.handleModalUbah}>
	                      <Modal.Body>
	                        <Modal.Title className="text-c-purple3 f-w-bold">Ubah Akses User</Modal.Title>
	                        <div style={{marginTop: '20px'}} className="form-group">
	                        	<label>Nama User</label>
	                        	<input type="text" disabled className="form-control" value={this.state.userNama} />
	                        </div>
	                        <div className="form-group">
	                        	<label>Akses User</label>
	                        	<br/>
	                        	{
	                        		userAccess.map(item => (
	                        			<div className="pretty p-default p-round p-thick m-b-35">
			                            <input checked={(this.state[`access_${item}`] === 'Y')} onChange={this.handleChangeInput} type="checkbox" name={`access_${item}`} />
			                            <div className="state p-success-o">
			                              <label className="f-18" style={{ whiteSpace: "normal !important" }}>
			                                <small className="f-w-bold f-18 text-c-black small-text">
			                                  {item}
			                                </small>
			                              </label>
			                            </div>
			                          </div>
	                        		))
	                        	}
                          </div>
	                        <button style={{ marginTop: '50px'}} type="button"
	                        	onClick={this.onClickUbahAkses}
	                          className="btn btn-block btn-ideku f-w-bold">
	                          Simpan
	                        </button>
	                        <button type="button"
	                          className="btn btn-block f-w-bold"
	                          onClick={this.handleModalUbah}>
	                          Tidak
	                        </button>
	                      </Modal.Body>
	                    </Modal>

	                    <Modal show={this.state.isModalHapus} onHide={this.handleModalHapus}>
	                      <Modal.Body>
	                        <Modal.Title className="text-c-purple3 f-w-bold">Hapus Akses User</Modal.Title>
	                        <div style={{marginTop: '20px'}} className="form-group">
	                        	<p className="f-w-bold">Apakah Anda yakin untuk menghapus akses user ini ?</p>
	                        </div>
	                        <button style={{ marginTop: '50px'}} type="button"
	                        	onClick={this.onClickHapusAkses}
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
