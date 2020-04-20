import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal,Card } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import DownloadFile from 'js-file-download';
import ReactHTMLTableToExcel from 'react-html-table-to-excel';

export default class DetailNilaiQuiz extends Component {

	state = {
		companyId: '',
		kursus: [],
		isModalHapus: false,
        courseIdHapus: '',
        detail : []
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
        let url = window.location.pathname;
        let courseID = url.split('/')[2];
		API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
			if(res.status === 200) {
                this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
				API.get(`${API_SERVER}v1/hasilkursus/${res.data.result.user_id}/${courseID}`).then(res => {
                    console.log('states',this.state)
                    console.log('states RES',res.data.result)

					if(res.status === 200) {
                        this.setState({ kursus: res.data.result.users, detail: res.data.result });
					}
				})
			}
		});
	}

	onClickHapus = e => {
		e.preventDefault();
		this.setState({ isModalHapus: true, courseIdHapus: e.target.getAttribute('data-id')});
	}

	exportToExcel(){
        let url = window.location.pathname;
        let courseID = url.split('/')[2];
		API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
			if(res.status === 200) {
                this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
				API.get(`${API_SERVER}v1/hasilkursus/${res.data.result.user_id}/${courseID}`).then(res => {
					if(res.status === 200) {
						const buffer = Buffer.from(res.data.result.users, 'base64');

                        console.log(buffer, buffer.length);
                        DownloadFile(buffer, 'export.xlsx')
					}
				})
			}
		});
	}

	render() {
        const { kursus } = this.state;
        console.log('ALVINS',kursus)
		return (
            <div className="page-wrapper">
                <div className="row">
                    <div className="col-xl-12">
                            <div className="row">
                                <div className="col-xl-8 mb-3">
                                    <h3 className="f-24 f-w-800">Detail Nilai Quiz</h3>
                                </div>
                                <div className="col-xl-4 mb-3">
                                        <ReactHTMLTableToExcel
                                            id="test-table-xls-button"
                                            className="btn btn-primary float-right"
                                            style={{ padding: "7px 8px !important" }}
                                            table="table-to-xls"
                                            filename="nilai-quiz"
                                            sheet="quiz"
                                            buttonText="Simpan ke Excel"/>
                                </div>
                            </div>
                            
                            

                            <div style={{ overflowX: "auto" }}>
                                <table id='table-to-xls' className="table-curved" style={{ width: "100%" }}>
                                <thead>
                                    <tr>
                                        <th className="text-center">No. </th>
                                        <th>Nama</th>
                                        <th>Nomor Induk</th>
                                        {
                                            this.state.kursus.length === 0 ? null 
                                            :
                                            
                                                    kursus[0].quiz.map((item, i) => (
                                                        
                                                            
                                                                <th>Quiz {i+1}</th>    
                                                            
                                                    ))
                                                

                                        }
                                        {/* <th>Quiz 1</th>
                                        <th>Quiz 2</th>
                                        <th>Quiz 3</th>
                                        <th>Quiz 4</th>
                                        <th>Quiz 5</th> */}
                                    </tr>
                                </thead>
                                {this.state.detail.length === 0 ?
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
                                                        {item.name}
                                                    </td>
                                                    <td>{item.identity}</td>
                                                    {item.quiz.map((a, i) =>(
                                                        <td>
                                                        {
                                                        a.map((arr, x)=>(
                                                            arr.score
                                                        ))
                                                        }
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))
                                        }
                                        </tbody>
                                    }
                                </table>
                            </div>

                    </div>
                </div>
            </div>
                    
		);
	}
}