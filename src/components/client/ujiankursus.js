import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Card, Button } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../repository/api';
import Storage from '../../repository/storage';

import Countdown from 'react-countdown-now';

export default class UjianKursus extends Component {

	state = {
    durasiWaktu: 10 * (60 * 1000),
    jumlahSoal: 15,
    isOpenModal: false,

    stateAkhir: Date.now() + 10 * (60 * 1000),
	}

	componentDidMount() {
    if(Date.now() < this.state.stateAkhir) {
      if(localStorage.getItem('waktuUjian') === null) {
        localStorage.setItem('waktuUjian', this.state.durasiWaktu);
        console.log('awal: ', parseInt(localStorage.getItem('waktuUjian')) );
      } else {
        this.setState({ durasiWaktu: parseInt(localStorage.getItem('waktuUjian')) })
        console.log('exist: ', parseInt(localStorage.getItem('waktuUjian')) );
      }
    } else {
      this.resetCountDown()      
    }
  }

  checkLocalStorage = e => {
    console.log('cek: ', localStorage.getItem('key: DOMString'))
  }

  resetCountDown = e => {
    localStorage.removeItem('waktuUjian')
    console.log('reset: ', localStorage.getItem('waktuUjian'))
  }

  onTickCountDown = e => {
    localStorage.setItem('waktuUjian', e.total);
  }

  onFinisCountDown = e => {
    this.resetCountDown();
  }

  submitModalConfirm(){
    this.setState({
      isOpenModal : true
    })
  }

  closeModalConfirm = e => {
    this.setState({ isOpenModal: false })
  }

  render() {
    const { durasiWaktu, jumlahSoal } = this.state;
    const Completionist = () => <span>You are good to go!</span>;

		return (
			<div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  
                  <div className="row">
                    <div className="col-sm-6">
                      <Card>
                        <Card.Body>
                          <div className="row">
                            <div className="col-sm-3 text-center">
                              <h3 className="f-24 f-w-800 mb-3" style={{marginTop: '24px'}}>UJIAN</h3>
                            </div>
                            <div className="col-sm-9">
                              <table>
                                <tr>
                                  <td colSpan="2">
                                    <h3 className="f-18 f-w-800 mb-3" style={{marginTop: '14px'}}>Bagaimana menjadi seorang Developer?</h3>
                                  </td>
                                </tr>
                                <tr>
                                  <td>
                                    <img src="/assets/images/component/clockkecil.png" style={{marginRight: '8px'}} /> 
                                    <Countdown 
                                      date={Date.now() + durasiWaktu}
                                      autoStart="false"
                                      onTick={this.onTickCountDown}
                                      onComplete={this.onFinisCountDown}
                                      >
                                      <Completionist />
                                    </Countdown>
                                  </td>
                                  <td>
                                    <img src="/assets/images/component/questionkecil.png" style={{marginRight: '8px'}} /> 
                                    0/{jumlahSoal}
                                  </td>
                                </tr>
                              </table>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-sm-12 text-center">
                              <ul class="flex-container" style={{marginTop: '16px'}}>
                                <li class="flex-item">1</li>
                                <li class="flex-item">2</li>
                                <li class="flex-item">3</li>
                                <li class="flex-item">4</li>
                                <li class="flex-item">5</li>
                                <li class="flex-item">6</li>
                                <li class="flex-item">7</li>
                                <li class="flex-item">8</li>
                                <li class="flex-item">9</li>
                                <li class="flex-item">10</li>
                                <li class="flex-item">11</li>
                                <li class="flex-item">12</li>
                                <li class="flex-item">13</li>
                                <li class="flex-item">14</li>
                                <li class="flex-item">15</li>
                              </ul>
                            </div>
                          </div>

                          <div className="row" style={{marginTop: '20px'}}>
                            <div className="col-sm-12 text-center">    
                              <Button className="btn btn-block btn-primary" onClick={this.submitModalConfirm.bind(this)}>Submit</Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>

                    {/* MODAL CONFIRM */}
                    <Modal show={this.state.isOpenModal} onHide={this.closeModalConfirm}>
                    <Modal.Body style={{padding: '30px'}}>
                      
                      <h4 style={{marginTop: '30px', fontWeight: 'bold', color:'pink'}}>
                        SUBMIT UJIAN
                      </h4>
                      <h5 className=" f-w-800 mb-3">Apakah Anda Yakin Untuk Submit Ujian Ini ?</h5>

                      <Link style={{marginTop: '20px'}} to={`/hasil-ujian-kursus`} className="btn btn-block btn-ideku f-w-bold">
                        Iya
                      </Link>
                      <button type="button"
                        className="btn btn-block f-w-bold"
                        onClick={this.closeModalConfirm}>
                        Tidak
                      </button>
                    </Modal.Body>
                  </Modal>

                    <div className="col-sm-6">
                      <Card>
                        <Card.Body>
                          <h3 className="f-18 f-w-800 mb-3" style={{marginTop: '14px'}}>
                            1. Bagaimana menjadi seorang Developer, Bagaimana menjadi seorang Developer, Bagaimana menjadi seorang Developer?
                          </h3>

                          <Card className="card-options">
                            <Card.Body style={{padding: '16px'}}>
                              A. Jawaban A
                            </Card.Body>
                          </Card>

                          <Card className="card-options">
                            <Card.Body style={{padding: '16px'}}>
                              A. Jawaban A
                            </Card.Body>
                          </Card>

                          <Card className="card-options">
                            <Card.Body style={{padding: '16px'}}>
                              A. Jawaban A
                            </Card.Body>
                          </Card>

                          <Card className="card-options">
                            <Card.Body style={{padding: '16px'}}>
                              A. Jawaban A
                            </Card.Body>
                          </Card>

                        </Card.Body>
                      </Card>
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