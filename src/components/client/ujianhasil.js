import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Card, Button } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../repository/api';
import Storage from '../../repository/storage';

export default class UjianHasil extends Component {

  state = {
    userId: Storage.get('user').data.user_id,
    examId: this.props.match.params.exam_id,
    courseId: '',
    courseTitle: '',
    companyId: '',

    soalUjian: [],

    questionId: '',
    nomorUjian: '',
    pertanyaanUjian: '',
    pilihanUjian: [],
    jawabanBenar: '',
    jawabanKu: '',

    score: 0,
  }

  fetchPertanyaanUjian() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200) {
        this.setState({ companyId: res.data.result.company_id });

        API.get(`${API_SERVER}v1/isquizorexam/${this.state.examId}`).then(res => {
          if(res.status === 200) {
            
            API.get(`${API_SERVER}v1/${res.data.result.quiz ? 'quiz':'exam'}/${this.state.examId}`).then(res => {
              console.log('res0: ', res.data)
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
      }
    })

    API.get(`${API_SERVER}v1/exam-answer/exam/${this.state.examId}/${this.state.userId}`).then(res => {
      if(res.status === 200) {
        let soalUjian = res.data.result;
        this.setState({ 
          soalUjian: soalUjian, 

          questionId: soalUjian[0].question_id,
          nomorUjian: soalUjian[0].number,
          pertanyaanUjian: soalUjian[0].question,
          pilihanUjian: soalUjian[0].options,
          jawabanBenar: soalUjian[0].correct_option,
          jawabanKu: soalUjian[0].answer_option
        })
      }
    })

    API.get(`${API_SERVER}v1/exam-answer/submit/${this.state.examId}/${this.state.userId}`).then(res => {
      if(res.status === 200) {
        this.setState({ score: res.data.result.score });
      }
    })
  }

  componentDidMount() {
    this.fetchPertanyaanUjian()
  }

  pilihPertanyaan = e => {
    e.preventDefault();
    const indexarray = e.target.getAttribute('data-index');
    this.setState({
      questionId: this.state.soalUjian[indexarray].question_id,
      nomorUjian: this.state.soalUjian[indexarray].number,
      pertanyaanUjian: this.state.soalUjian[indexarray].question,
      pilihanUjian: this.state.soalUjian[indexarray].options,
      jawabanBenar: this.state.soalUjian[indexarray].correct_option,
      jawabanKu: this.state.soalUjian[indexarray].answer_option,
    })

    API.get(`${API_SERVER}v1/exam-answer/answer/${this.state.userId}/${this.state.soalUjian[indexarray].question_id}`).then(res => {
      if(res.status === 200) {
        this.setState({ jawabanKu: res.data.result.length !== 0 ? res.data.result.answer_option : '' })
      }
    })
  }

  render() {
    const { soalUjian, jawabanKu, jawabanBenar } = this.state;

    const ListNomor = ({lists}) => (
      <ul class="flex-container" style={{marginTop: '16px'}}>
        {
          lists.map((item, i) => (
            <li key={item.question_id} onClick={this.pilihPertanyaan} 
              data-index={i}
              class={`flex-item ${item.correct_option === item.answer_option ? 'flex-item-green' : 'flex-item-red'}`}>
              {item.number}
            </li>
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

                  <div className="row">
                    <div className="col-sm-12">
                      <Card>
                        <Card.Body className="text-center">
                          <img className="img-fluid" src="/assets/images/component/hasil.png" alt="media" />
                          <h3 style={{position: 'absolute', left: '36%', bottom: '120px', color: 'white'}} 
                            className="f-40 f-w-800 mb-3">Nilai Akhir</h3>
                          <h3 style={{position: 'absolute', left: '36%', bottom: '60px', color: 'white'}} 
                            className="f-50 f-w-800 mb-3">{this.state.score ? this.state.score.toFixed(0) : 0 }</h3>
                        </Card.Body>
                      </Card>
                    </div>
                  </div>
                
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
                                      <h3 className="f-18 f-w-800 mb-3" style={{marginTop: '24px'}}>{this.state.courseTitle}</h3>
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
                              <Link to='/' className="btn btn-block btn-ideku submit-ujian">Selesai</Link>
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
                            this.state.pilihanUjian.map((item, i) => {
                              if(item.exam_option === jawabanBenar) {
                                return (
                                  <Card className={`card-options card-green`} 
                                    key={item.option_id} onClick={this.jawabPertanyaan}>
                                    <Card.Body style={{padding: '16px'}} data-option={item.exam_option}>
                                      {item.exam_option}. {item.description}
                                    </Card.Body>
                                  </Card>
                                );
                              } else if(item.exam_option === jawabanKu) {
                                return (
                                  <Card className={`card-options card-red`} 
                                    key={item.option_id} onClick={this.jawabPertanyaan}>
                                    <Card.Body style={{padding: '16px'}} data-option={item.exam_option}>
                                      {item.exam_option}. {item.description}
                                    </Card.Body>
                                  </Card>
                                );
                              } else {
                                return (  
                                  <Card className={`card-options`} 
                                    key={item.answer_id} onClick={this.jawabPertanyaan}>
                                    <Card.Body style={{padding: '16px'}} data-option={item.exam_option}>
                                      {item.exam_option}. {item.description}
                                    </Card.Body>
                                  </Card>
                                );
                              }
                            })
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