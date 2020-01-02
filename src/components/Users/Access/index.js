import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal } from "react-bootstrap";
import API, { API_SERVER } from '../../../repository/api';

export default class UserAccess extends Component {

	state = {
		access: [],
		users: [],

		user_id: '',
		userAccess: ['user','branch','category','activities','course','enroll_course','quiz','exam','forum','class'],

		isModalTambah: false,

		isModalUbah: false,
		idModalUbah: '',

		isModalHapus: false,
		idModalHapus: ''
	}

	componentDidMount() {
		API.get(`${API_SERVER}v1/access`).then(res => {
			console.log(res.data.result)
			if(res.status === 200) {
				this.setState({ access: res.data.result})
			}
		})
	}

	onClickTambah = e => {
		e.preventDefault();
		console.log('tambah')
		this.setState({ isModalTambah: true })
		API.get(`${API_SERVER}v1/access/user`).then(res => {
			if(res.status === 200) {
				this.setState({ users: res.data.result })
			}
		})
	}

	onClickUbah = e => {
		e.preventDefault();
		console.log('ubah')
		this.setState({ isModalUbah: true })
	}

	onClickHapus = e => {
		e.preventDefault();
		console.log('hapus')
		this.setState({ isModalHapus: true })
	}

	handleModalTambah = e => {
		this.setState({ isModalTambah: false });
	}

	handleModalUbah = e => {
		this.setState({ isModalUbah: false });
	}

	handleModalHapus = e => {
		this.setState({ isModalHapus: false });
	}

	render() {
		const { access, users, userAccess } = this.state;

		console.log('state: ',this.state)

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
									<td><i className={(item.access_activities === 1) ? 'fa fa-check':'fa fa-ban'}></i></td>
									<td><i className={(item.access_course === 'Y') ? 'fa fa-check':'fa fa-ban'}></i></td>
									<td><i className={(item.access_enroll_course === 1) ? 'fa fa-check':'fa fa-ban'}></i></td>
									<td><i className={(item.access_quiz === 'Y') ? 'fa fa-check':'fa fa-ban'}></i></td>
									<td><i className={(item.access_exam === 'Y') ? 'fa fa-check':'fa fa-ban'}></i></td>
									<td><i className={(item.access_forum === 'Y') ? 'fa fa-check':'fa fa-ban'}></i></td>
									<td><i className={(item.access_class === 1) ? 'fa fa-check':'fa fa-ban'}></i></td>
									<td>
										<Link to="#" className="buttonku">
	          					<i onClick={this.onClickUbah} data-action="update" data-id={item.access_id} className="fa fa-edit"></i>
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
                            <th>Exam</th>
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
	                        	<select name="user_id" className="form-control">
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
			                            <input type="checkbox" />
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
	                        	<select name="user_id" className="form-control">
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
			                            <input type="checkbox" />
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
