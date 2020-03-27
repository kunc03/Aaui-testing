import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Card, Button } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../repository/api';
import Storage from '../../repository/storage';

import Countdown from 'react-countdown-now';
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";

export default class UjianKursus extends Component {

  state = {
    userId: Storage.get('user').data.user_id,
    examId: this.props.match.params.exam_id,
    courseId: '',
    courseTitle: '',
    companyId: '',

    jumlahSoal: this.props.match.params.count_soal,
    durasiWaktu: this.props.match.params.durasi_waktu != 0 ? this.props.match.params.durasi_waktu * (60 * 1000) : 0,
    stateAkhir: this.props.match.params.durasi_waktu != 0 ? Date.now() + this.props.match.params.durasi_waktu * (60 * 1000) : 0,

    soalUjian: [],

    questionId: '',
    nomorUjian: 1,
    pertanyaanUjian: '',
    pilihanUjian: [],
    jawabanKu: '',
    soalTerjawab: 0,

    isModalSubmit: false,

    isLocalSteps: false,
    steps: [
      {
        target: '.pilih-soal',
        content: 'Hal pertama yang harus dilakukan adalah pilih soalnya.',
      },
      {
        target: '.pilih-jawaban',
        content: 'Setelah pilih soalnya silahkan pilih jawaban yang menurut Anda benar.',
      },
      {
        target: '.pilih-selesai',
        content: 'Jika sudah merasa soal sudah terjawab silahkan submit jawaban Anda.',
      },
    ]
  }

  konfirmasiSubmitUjian = e => {
    this.setState({ isModalSubmit: true })
  }

  handleModalSubmit = e => {
    this.setState({ isModalSubmit: false })
  }

  fetchPertanyaanUjian() {
    //start ujian
    API.get(`${API_SERVER}v1/exam-answer/start/${this.state.examId}/${this.state.userId}`).then(res => {
      if(res.status === 200){
        console.log('start: ', res.data.result)
      }
    })

    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200) {
        this.setState({ companyId: res.data.result.company_id });
        
        API.get(`${API_SERVER}v1/isquizorexam/${this.state.examId}`).then(res => {
          if(res.status === 200) {
            this.setState({ courseId: res.data.result.course_id });
            API.get(`${API_SERVER}v1/course/${res.data.result.course_id}`).then(res => {
              if(res.status === 200) {
                this.setState({ courseTitle: res.data.result.title })
              }
            })
          }
        })

      }
    })

    API.get(`${API_SERVER}v1/question/exam/${this.state.examId}`).then(res => {
      if(res.status === 200) {
        let soalUjian = res.data.result;
       
        this.setState({ 
          soalUjian: soalUjian, 
          questionId: soalUjian[0].question_id,
          nomorUjian: soalUjian[0].number,
          pertanyaanUjian: soalUjian[0].question,
          pilihanUjian: soalUjian[0].options
        })
      }
    })
  }

  componentDidMount() {
    if(this.state.durasiWaktu != 0) {
      if(Date.now() < this.state.stateAkhir) {
        if(localStorage.getItem('waktuUjian') === null) {
          localStorage.setItem('waktuUjian', this.state.durasiWaktu);
        } else {
          this.setState({ durasiWaktu: parseInt(localStorage.getItem('waktuUjian')) })
        }
      } else {
        this.resetCountDown()      
      }
    }
    this.fetchPertanyaanUjian()
    let isTourChapter = localStorage.getItem("isTourUjian");
    if (isTourChapter) {
      this.setState({ isLocalSteps: true });
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
      localStorage.setItem('isTourUjian', true);
    }
  };

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
    console.log(indexarray, 'addd');
    this.setState({
      questionId: this.state.soalUjian[indexarray].question_id,
      nomorUjian: this.state.soalUjian[indexarray].number,
      pertanyaanUjian: this.state.soalUjian[indexarray].question,
      pilihanUjian: this.state.soalUjian[indexarray].options,
      durasiWaktu: this.state.durasiWaktu != 0 ? parseInt(localStorage.getItem('waktuUjian')) : 0
    })

    API.get(`${API_SERVER}v1/exam-answer/answer/${this.state.userId}/${this.state.soalUjian[indexarray].question_id}`).then(res => {
      if(res.status === 200) {
        console.log(res.data.result, 'jawab pertanyaaan')
        this.setState({ jawabanKu: res.data.result.length !== 0 ? res.data.result.answer_option : '' })
      }
    })
  }

  buttonNextPrevios(a){
    switch (a){
      case 'next':
        let indexarraynext =  this.state.nomorUjian+1;

        this.setState({
          questionId: this.state.soalUjian[indexarraynext-1].question_id,
          nomorUjian:  indexarraynext,
          pertanyaanUjian: this.state.soalUjian[indexarraynext-1].question,
          pilihanUjian: this.state.soalUjian[indexarraynext-1].options,
          durasiWaktu: this.state.durasiWaktu != 0 ? parseInt(localStorage.getItem('waktuUjian')) : 0,
        })
    
        API.get(`${API_SERVER}v1/exam-answer/answer/${this.state.userId}/${this.state.soalUjian[indexarraynext-1].question_id}`).then(res => {
          if(res.status === 200) {
            //console.log(res.data.result, 'jawab pertanyaaan')
            this.setState({ jawabanKu: res.data.result.length !== 0 ? res.data.result.answer_option : '' })
          }
        })

        break;
      case 'previos':
          //console.log(a, 'previos nih');
          let indexarrayprevios =  this.state.nomorUjian-1;

          this.setState({
            questionId: this.state.soalUjian[indexarrayprevios-1].question_id,
            nomorUjian:  indexarrayprevios,
            pertanyaanUjian: this.state.soalUjian[indexarrayprevios-1].question,
            pilihanUjian: this.state.soalUjian[indexarrayprevios-1].options,
            durasiWaktu: this.state.durasiWaktu != 0 ? parseInt(localStorage.getItem('waktuUjian')) : 0,
          })
      
          API.get(`${API_SERVER}v1/exam-answer/answer/${this.state.userId}/${this.state.soalUjian[indexarrayprevios-1].question_id}`).then(res => {
            if(res.status === 200) {
              //console.log(res.data.result, 'jawab pertanyaaan')
              this.setState({ jawabanKu: res.data.result.length !== 0 ? res.data.result.answer_option : '' })
            }
          })
        break;
    }
  }

  jawabPertanyaan = e => {
    e.preventDefault();
    const answerOption = e.target.getAttribute('data-option');
    let form = {
      user_id: this.state.userId,
      question_id: this.state.questionId,
      answer_number: this.state.nomorUjian,
      answer_option: answerOption
    }

    API.get(`${API_SERVER}v1/exam-answer/answer/${form.user_id}/${form.question_id}`).then(res => {
      if(res.status === 200) {
        if(res.data.result.length === 0) {
          // insert
          API.post(`${API_SERVER}v1/exam-answer`, form)
        } else {
          //update
          API.put(`${API_SERVER}v1/exam-answer/update/${form.user_id}/${form.question_id}`, form)
        }

        let refactoring = this.state.soalUjian.map((item) => {
          if(item.question_id === form.question_id) {
            item.isJawab = true;
          }
          return item;
        })

        this.setState({ 
          jawabanKu: form.answer_option, 
          soalTerjawab: (parseInt(this.state.soalTerjawab) === parseInt(this.state.jumlahSoal)) ? this.state.jumlahSoal : this.state.soalTerjawab+1,
          soalUjian: refactoring
        })
      }
    })
  }

  render() {
    const { durasiWaktu, jumlahSoal, soalUjian, jawabanKu, soalTerjawab, nomorUjian } = this.state;
    const Completionist = () => <span>Waktu Habis !</span>;

    const ListNomor = ({lists}) => (
      <ul class="flex-container" style={{marginTop: '16px'}}>
        {
          lists.map((item, i) => (
            <li key={item.question_id} onClick={this.pilihPertanyaan} data-index={i} className={`flex-item ${item.hasOwnProperty('isJawab') ? 'flex-item-ideku' : ''}`}>{item.number}</li>
          ))
        }
      </ul>
    );

    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  {!this.state.isLocalSteps && (
                    <Joyride
                      callback={this.handleJoyrideCallback}
                      steps={this.state.steps}
                      continuous="true"
                    />
                  )}
                  
                  <div className="row">
                    <div className="col-sm-6">
                      <Card>
                        <Card.Body>
                          <div className="row">
                            <div className="col-sm-3 text-center">
                              <h3 className="f-24 f-w-800 mb-3" style={{marginTop: '24px'}}>SOAL</h3>
                            </div>
                            <div className="col-sm-9">
                              <table>
                                <tbody>
                                  <tr>
                                    <td colSpan="2">
                                      <h3 className="f-18 f-w-800 mb-3" style={{marginTop: '14px'}}>{this.state.courseTitle}</h3>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td>
                                      <img src="/assets/images/component/clockkecil.png" style={{ marginRight: '8px' }} alt="media" /> 
                                      {
                                        (durasiWaktu != 0) && <Countdown
                                          date={Date.now() + durasiWaktu}
                                          onTick={this.onTickCountDown}
                                          onComplete={this.onFinisCountDown}
                                        >
                                          <Completionist />
                                        </Countdown>
                                      }
                                    </td>
                                    <td>
                                      <img src="/assets/images/component/questionkecil.png" style={{marginRight: '8px'}} alt="media" /> 
                                      {soalTerjawab}/{jumlahSoal}
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>

                          <div className="row">
                            <div className="col-sm-12 text-center pilih-soal">
                              <ListNomor lists={soalUjian} />
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
                      <Card className="pilih-jawaban">
                        <Card.Body>
                          <h3 className="f-18 f-w-800 mb-3" style={{marginTop: '14px'}}>
                            {this.state.nomorUjian}. {this.state.pertanyaanUjian}
                          </h3>

                          {
                            this.state.pilihanUjian.map((item, i) => (
                              <Card className={`card-options ${jawabanKu === item.exam_option ? 'card-blue':''}`} key={item.answer_id} onClick={this.jawabPertanyaan}>
                                <Card.Body style={{padding: '16px'}} data-option={item.exam_option}>
                                  {item.exam_option}. {item.description}
                                </Card.Body>
                              </Card>
                            ))
                          }
                        </Card.Body>
                      </Card>

                      {/* fungsi untuk kembali dan next jawaban */}
                      <div className="row">
                        <div className="col-sm-12 "> 
                          {nomorUjian === 1 ?
                            <button  className="btn float-left"><span className=""><i className="fa  fa-angle-double-left"></i> KEMBALI</span></button>
                            :
                            <button className="btn btn-ideku float-left" onClick={this.buttonNextPrevios.bind(this, 'previos')}><span><i className="fa  fa-angle-double-left"></i> KEMBALI</span></button>
                          }

                          {nomorUjian === soalUjian.length ? 
                            <button  className="btn float-right"><span className="">BERIKUTNYA <i className="fa  fa-angle-double-right"></i></span></button>
                          :
                            <button className="btn btn-ideku float-right" onClick={this.buttonNextPrevios.bind(this, 'next')}><span className="">BERIKUTNYA <i className="fa  fa-angle-double-right"></i></span></button>
                          }
                        </div>
                      </div><br />
                      {/* Button Selesai */}
                      <div className="row">
                        <div className="col-sm-12 ">    
                          <button onClick={this.konfirmasiSubmitUjian} className="btn btn-primary float-right">Selesai</button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Modal show={this.state.isModalSubmit} onHide={this.handleModalSubmit}>
                    <Modal.Body style={{padding: '30px'}}>
                      <div className="text-center" style={{marginTop: '20px'}}>
                        <img className="img-fluid" src="/assets/images/component/tes.png" alt="media" />
                      </div>
                     
                      {soalTerjawab == jumlahSoal ? 
                        <span><h3 style={{marginTop: '40px'}} className="f-18 f-w-800 mb-3">Apakah Anda sudah yakin dengan semua jawaban?</h3></span>
                      :
                        <span><h3 style={{marginTop: '40px'}} className="f-18 f-w-800 mb-3">Anda belum menjawab semua soal, apakah anda yakin tidak ingin menyelesaikan semua soal ?</h3></span>
                      }

                      <Link to={`/ujian-hasil/${this.state.examId}`} style={{marginTop: '30px'}}
                        className="btn btn-block f-w-bold btn-ideku">
                        Ya, Saya Yakin
                      </Link>

                      <button type="button"
                        className="btn btn-block f-w-bold"
                        onClick={this.handleModalSubmit}>
                        Batal
                      </button>
                    </Modal.Body>
                  </Modal>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}