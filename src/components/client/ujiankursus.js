import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Card, Button } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../repository/api';
import Storage from '../../repository/storage';

import Countdown from 'react-countdown-now';

export default class UjianKursus extends Component {

	state = {
    examId: '',
    durasiWaktu: 10 * (60 * 1000),
    stateAkhir: Date.now() + 10 * (60 * 1000),
    jumlahSoal: 15,

    soalUjian: [],

    nomorUjian: '',
    pertanyaanUjian: '',
    pilihanUjian: [],
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

    let soalUjian = [
      {
            "question_id": 36,
            "exam_id": 26,
            "tag": "MTK",
            "number": 1,
            "question": "Hasil dari 20+20?",
            "image": null,
            "correct_option": "A",
            "options": [
                {
                    "option_id": 126,
                    "question_id": 36,
                    "exam_option": "A",
                    "description": "40"
                },
                {
                    "option_id": 127,
                    "question_id": 36,
                    "exam_option": "B",
                    "description": "30"
                },
                {
                    "option_id": 128,
                    "question_id": 36,
                    "exam_option": "C",
                    "description": "20"
                },
                {
                    "option_id": 129,
                    "question_id": 36,
                    "exam_option": "D",
                    "description": "10"
                }
            ]
      },
      {
          "question_id": 37,
          "exam_id": 26,
          "tag": "MTK",
          "number": 2,
          "question": "Hasil dari 100-80",
          "image": null,
          "correct_option": "C",
          "options": [
              {
                  "option_id": 131,
                  "question_id": 37,
                  "exam_option": "A",
                  "description": "30"
              },
              {
                  "option_id": 132,
                  "question_id": 37,
                  "exam_option": "B",
                  "description": "10"
              },
              {
                  "option_id": 130,
                  "question_id": 37,
                  "exam_option": "C",
                  "description": "20"
              },
              {
                  "option_id": 133,
                  "question_id": 37,
                  "exam_option": "D",
                  "description": "50"
              }
          ]
      },
      {
          "question_id": 38,
          "exam_id": 26,
          "tag": "MTK",
          "number": 3,
          "question": "Hasil dari 100/50?",
          "image": null,
          "correct_option": "D",
          "options": [
              {
                  "option_id": 135,
                  "question_id": 38,
                  "exam_option": "A",
                  "description": "10"
              },
              {
                  "option_id": 136,
                  "question_id": 38,
                  "exam_option": "B",
                  "description": "30"
              },
              {
                  "option_id": 137,
                  "question_id": 38,
                  "exam_option": "C",
                  "description": "40"
              },
              {
                  "option_id": 134,
                  "question_id": 38,
                  "exam_option": "D",
                  "description": "20"
              }
          ]
      },
      {
          "question_id": 39,
          "exam_id": 26,
          "tag": "MTK",
          "number": 4,
          "question": "Hasil dari 60-40",
          "image": null,
          "correct_option": "C",
          "options": [
              {
                  "option_id": 139,
                  "question_id": 39,
                  "exam_option": "A",
                  "description": "10"
              },
              {
                  "option_id": 140,
                  "question_id": 39,
                  "exam_option": "B",
                  "description": "15"
              },
              {
                  "option_id": 138,
                  "question_id": 39,
                  "exam_option": "C",
                  "description": "20"
              },
              {
                  "option_id": 141,
                  "question_id": 39,
                  "exam_option": "D",
                  "description": "25"
              }
          ]
      },
      {
          "question_id": 40,
          "exam_id": 26,
          "tag": "MTK",
          "number": 5,
          "question": "Hasil dari 50+10?",
          "image": null,
          "correct_option": "D",
          "options": [
              {
                  "option_id": 143,
                  "question_id": 40,
                  "exam_option": "A",
                  "description": "40"
              },
              {
                  "option_id": 144,
                  "question_id": 40,
                  "exam_option": "B",
                  "description": "45"
              },
              {
                  "option_id": 145,
                  "question_id": 40,
                  "exam_option": "C",
                  "description": "50"
              },
              {
                  "option_id": 142,
                  "question_id": 40,
                  "exam_option": "D",
                  "description": "60"
              }
          ]
      }
    ]
    this.setState({ 
      soalUjian: soalUjian, 
      nomorUjian: soalUjian[0].number,
      pertanyaanUjian: soalUjian[0].question,
      pilihanUjian: soalUjian[0].options
    })
  }

  checkLocalStorage = e => {
    console.log('cek: ', localStorage.getItem('waktuUjian'))
  }

  resetCountDown = e => {
    localStorage.removeItem('waktuUjian')
    console.log('reset: ', localStorage.getItem('waktuUjian'))
  }

  onTickCountDown = e => {
    localStorage.setItem('waktuUjian', e.total);
    console.log(localStorage.getItem('waktuUjian'))
  }

  onFinisCountDown = e => {
    this.resetCountDown();
  }

  pilihPertanyaan = e => {
    e.preventDefault();
    const indexarray = e.target.getAttribute('data-index');
    this.setState({
      nomorUjian: this.state.soalUjian[indexarray].number,
      pertanyaanUjian: this.state.soalUjian[indexarray].question,
      pilihanUjian: this.state.soalUjian[indexarray].options,
      durasiWaktu: parseInt(localStorage.getItem('waktuUjian'))
    })
  }

  render() {
    const { durasiWaktu, jumlahSoal, soalUjian } = this.state;
    const Completionist = () => <span>You are good to go!</span>;

    const ListNomor = ({lists}) => (
      <ul class="flex-container" style={{marginTop: '16px'}}>
        {
          lists.map((item, i) => (
            <li key={item.question_id} onClick={this.pilihPertanyaan} data-index={i} class="flex-item">{item.number}</li>
          ))
        }
      </ul>
    );

    console.log('state: ', this.state.nomorUjian);
    console.log('state: ', this.state.pertanyaanUjian);
    console.log('state: ', this.state.pilihanUjian);

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
                                <tbody>
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
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-sm-12 text-center">
                              <ListNomor lists={soalUjian} />
                            </div>
                          </div>

                          <div className="row" style={{marginTop: '20px'}}>
                            <div className="col-sm-12 text-center">    
                              <Button className="btn btn-block btn-primary">Submit</Button>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </div>

                    <div className="col-sm-6">
                      <Card>
                        <Card.Body>
                          <h3 className="f-18 f-w-800 mb-3" style={{marginTop: '14px'}}>
                            {this.state.nomorUjian}. {this.state.pertanyaanUjian}
                          </h3>

                          {
                            this.state.pilihanUjian.map((item, i) => (
                              <Card className="card-options" key={item.answer_id}>
                                <Card.Body style={{padding: '16px'}}>
                                  {item.exam_option}. {item.description}
                                </Card.Body>
                              </Card>
                            ))
                          }

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