import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Card } from "react-bootstrap";
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
        tabIndex: 1
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
                                            <h3 className="f-w-900 f-20">ini judul judul qursus</h3>
                                            <p>19:31331: 2121</p>
                                        </Card.Body>
                                    </Card>

                                    <div className="row">
                                        <div className="col-xl-12">
                                            <div className="row">

                                                {tabs.map((tab, index)=>{
                                                    return (
                                                            <div className="col-xl-4 mb-3">
                                                                <Link onClick={this.tabNilai.bind(this, tab, index)}>
                                                                    <div className={this.state.tabIndex === index+1 ? "kategori-aktif" : "kategori"}>
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