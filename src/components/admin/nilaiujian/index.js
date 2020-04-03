import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Card } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import DetailNilaiQuiz from './nilaiquiz';
import DetailNilaiUjian from './nilaiujian';

const tabs =[
    {title : 'Nilai Quiz' },
    {title : 'Nilai Ujian' },
]

export default class NilaiUjian extends Component {

	state = {
		companyId: '',
		kursus: [],
		isModalHapus: false,
        courseIdHapus: '',
        tabIndex: 1,
        detail : ''
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
					if(res.status === 200) {
                        this.setState({ kursus: res.data.result.users, detail: res.data.result });
					}
				})
			}
		});
	}
    
    tabNilai(a,b){
        this.setState({tabIndex: b+1});
    }

	render() {
		return (
			<div className="pcoded-main-container">
                <div className="pcoded-wrapper">
                    <div className="pcoded-content">
                        <div className="pcoded-inner-content">
                            <div className="main-body">
                                <div className="page-wrapper">
                                    <Card>
                                        <Card.Body>
                                            <h3 className="f-w-900 f-20">{this.state.detail.title}</h3>
                                            <p>{this.state.detail.created_at} &nbsp; {this.state.detail.peserta} Peserta | {this.state.detail.quiz} Quiz | {this.state.detail.ujian} Ujian</p>
                                        </Card.Body>
                                    </Card>

                                    <div className="row">
                                        <div className="col-xl-12">
                                            <div className="row">
                                                {tabs.map((tab, index)=>{
                                                    return (
                                                            <div className="col-xl-4 mb-3">
                                                                <Link onClick={this.tabNilai.bind(this, tab, index)}>
                                                                    <div className={this.state.tabIndex === index+1 ? "kategori-aktif" : "kategori title-disabled"}>
                                                                        {tab.title}
                                                                    </div>
                                                                </Link>
                                                            </div>
                                                        )
                                                })}
                                            </div>
                                            {this.state.tabIndex === 1 ? 
                                                    <DetailNilaiQuiz/>
                                                :
                                                    <DetailNilaiUjian/>
                                            }

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