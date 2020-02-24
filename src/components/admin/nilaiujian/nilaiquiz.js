import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal,Card } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';

export default class NilaiUjian extends Component {

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
			console.log(res)
			if(res.status === 200) {
				this.setState({ companyId: res.data.result.company_id });
				API.get(`${API_SERVER}v1/course/company/${this.state.companyId}`).then(res => {
					if(res.status === 200) {
						this.setState({ kursus: res.data.result });
					}
				})
			}
		});
	}

	onClickHapus = e => {
		e.preventDefault();
		this.setState({ isModalHapus: true, courseIdHapus: e.target.getAttribute('data-id')});
	}

	handleModalHapus = e => {
		this.setState({ isModalHapus: false, courseIdHapus: ''});
	}

	onClickHapusKursus = e => {
		API.delete(`${API_SERVER}v1/course/${this.state.courseIdHapus}`).then(res => {
			if(res.status === 200) {
				this.fetchData();
				this.handleModalHapus();
			}
		})
    }
    
    tabNilai(a){
        console.log(a)
    }

	render() {
        const { kursus } = this.state;
		return (
            <div className="page-wrapper">
                <div className="row">
                    <div className="col-xl-12">
                    <div className="row">
                        <div className="col-xl-8 mb-3">
                            <h3 className="f-24 f-w-800">Detail Nilai Quiz</h3>
                        </div>
                        <div className="col-xl-4 mb-3">
                                    <Link
                                    to={"/kursus-materi-create"}
                                    className="btn btn-primary float-right"
                                    style={{ padding: "7px 8px !important" }}>
                                        Simpan ke Excel
                                </Link>
                        </div>
                    </div>
                    
                    

                    <div style={{ overflowX: "auto" }}>
                        <table className="table-curved" style={{ width: "100%" }}>
                        <thead>
                            <tr>
                                <th className="text-center">No. </th>
                                <th>Nama</th>
                                <th>Nomor Induk</th>
                                <th>Quiz 1</th>
                                <th>Quiz 2</th>
                                <th>Quiz 3</th>
                                <th>Quiz 4</th>
                                <th>Quiz 5</th>
                            </tr>
                        </thead>
                        {kursus.length === 0 ?
                                <tbody>
                                    <tr>
                                        <td colSpan={8}>Tidak ada data</td>
                                    </tr>
                                </tbody>
                            :
                                <tbody>
                                {
                                    kursus.map((item, i) => (
                                        <tr key={item.course_id}>
                                            <td>{i+1}</td>
                                            <td>
                                                Test
                                            </td>
                                            <td>{item.category_name}</td>
                                            <td><Link to={`/chapter/${item.course_id}`} className="buttonku" title="Detail">{item.title}</Link></td>
                                            <td>{item.created_at.toString().substring(0,10)}</td>
                                            <td><i className={(item.publish === 1) ? 'fa fa-check':'fa fa-ban'}></i></td>
                                            <td>
                                                2.354.5
                                            </td>
                                            <td>
                                                2.354.5
                                            </td>
                                        </tr>
                                    ))
                                }
                                </tbody>
                            }
                        </table>
                    </div>

                    <Modal show={this.state.isModalHapus} onHide={this.handleModalHapus}>
                        <Modal.Body>
                            <Modal.Title className="text-c-purple3 f-w-bold">Hapus Kursus</Modal.Title>
                            <div style={{marginTop: '20px'}} className="form-group">
                                <p className="f-w-bold">Apakah Anda yakin untuk menghapus kursus & materi ini ?</p>
                            </div>
                            <button style={{ marginTop: '50px'}} type="button"
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
                    
		);
	}
}