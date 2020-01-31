import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Card, Accordion, Badge } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../repository/api';
import Storage from '../../repository/storage';

export default class DetailKursus extends Component {

	state = {
    examId: '',
		courseId: this.props.match.params.course_id,
		companyId: '',
    isIkutiKursus: false,
    isButtonIkuti: true,
    isModalQuiz: false,
    isUjian: false,

    isUjianBelumAda: false,

    countSoal: '0',
    durasiWaktu: '0',

    course: { category_name: 'Memuat...' },
		chapters: []
	}

  handleUjianBelumAda = e => {
    this.setState({ isUjianBelumAda: false })
  }

  fetchDataChapter() {
    API.get(`${API_SERVER}v1/chapter/course/${this.state.courseId}`).then(res => {
      if(res.status === 200) {
        this.setState({ chapters: res.data.result });
      }
    })
  }

  fetctDataCourse() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200) {
        this.setState({ companyId: res.data.result.company_id });

        API.get(`${API_SERVER}v1/course/${this.state.courseId}`).then(res => {
          if(res.status === 200) {
            this.setState({ course: res.data.result })
          }
        })

        API.get(`${API_SERVER}v1/user-course/cek/${Storage.get('user').data.user_id}/${this.state.courseId}`).then(res => {
          if(res.status === 200) {
            this.setState({ isIkutiKursus: res.data.result, isButtonIkuti: !res.data.result })
          }
        })

        API.get(`${API_SERVER}v1/user-course/cek/${Storage.get('user').data.user_id}/${this.state.courseId}`).then(res => {
          if(res.status === 200) {
            if(res.data.response.length !== 0) {
              if(res.data.response[0].is_exam) {
                this.setState({ isUjian: true })
              } else {
                this.setState({ isUjian: false })
              }
            } else {
              this.setState({ isUjian: false })
            }
          }
        })

        API.get(`${API_SERVER}v1/exam/course/${this.state.courseId}/${this.state.companyId}`).then(res => {
          if(res.status === 200) {
            if(res.data.result.length !== 0) {
              this.setState({ examId: res.data.result[0].exam_id })
            } else {
              this.setState({ isUjianBelumAda: true })
            }
          }
        })

      }
    })
  }

	componentDidMount() {
    this.fetchDataChapter()
    this.fetctDataCourse()
	}

  onClickIkutiKursus = e => {
    e.preventDefault();
    let form = {
      user_id: Storage.get('user').data.user_id,
      course_id: this.state.courseId
    }
    API.post(`${API_SERVER}v1/user-course`, form).then(res => {
      if(res.status === 200) {
        this.setState({ isIkutiKursus: !this.state.isIkutiKursus, isButtonIkuti: false })
      }
    })
  }

  onClickIkutiQuiz = e => {
    e.preventDefault();
    API.get(`${API_SERVER}v1/exam/course/${this.state.courseId}/${this.state.companyId}`).then(res => {
      if(res.status === 200) {
        this.setState({ isModalQuiz: true, countSoal: res.data.result[0].soal, 
          durasiWaktu: res.data.result[0].time_minute, examId: res.data.result[0].exam_id })
      }
    })
  }

  handleModalQuizClose = e => {
    this.setState({ isModalQuiz: false })
  }

	render() {
    const { chapters, course, isIkutiKursus, isButtonIkuti, countSoal, durasiWaktu } = this.state;
    const dateFormat = new Date(course.created_at);

    const ListChapter = ({lists}) => {
      if(lists.length !== 0) {
        return (
          <div>
          {
            lists.map((item, i) => (
              <Card className={`card-${this.state.isIkutiKursus ? 'active':'nonactive'}`} key={item.chapter_id}>
                <Card.Body>
                  <h3 className="f-24 f-w-800" style={{marginBottom: '0px'}}>
                    {item.chapter_title} 
                    <span style={{position: 'absolute', right: '30px'}}><i className={`fa fa-${this.state.isIkutiKursus ? 'unlock':'lock'}`}></i></span>
                  </h3>
                </Card.Body>
              </Card>
            ))  
          }
          </div>
        )
      } else {
        return (
          <Card style={{marginTop: '10px'}}>
            <Card.Body>Memuat halaman...</Card.Body>
          </Card>
        )
      }
    };

    const LinkUjian = ({isUjian}) => {
      if(isUjian) {
        return (
          <Link to={`/ujian-hasil/${this.state.examId}`} className="btn btn-block btn-ideku">Lihat Hasil Ujian</Link>
        );
      } else {
        return (
          <div>
          { 
            isIkutiKursus && <Link onClick={this.onClickIkutiQuiz} to="#" className="btn btn-primary btn-block" style={{fontWeight: 'bold', margin: '40px 0px'}}>
              Ikuti Ujian
            </Link> 
          }
          </div>
        );
      }
    }

		return (
			<div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <div className="row">
                    <div className="col-xl-8">
                      <img class="img-fluid rounded" src={course.image} alt="" />
                      
                      <a className="btn btn-ideku" href="#" style={{marginTop: '20px', fontWeight: 'bold'}}>
                        {course.category_name}
                      </a>
                      <h3 className="f-24 f-w-800 mb-3">{course.title}</h3>
                      <p>{dateFormat.toString()}</p>

                      <p class="lead">{course.caption}</p>

                      { isIkutiKursus && <div dangerouslySetInnerHTML={{ __html: course.body }} /> }

                      <LinkUjian isUjian={this.state.isUjian} />

                      { isButtonIkuti && <Link onClick={this.onClickIkutiKursus} to="#" className="btn btn-primary btn-block" style={{fontWeight: 'bold', margin: '40px 0px'}}>
                        Ikuti Kursus
                      </Link>
                      }

                    </div>
                  
                    <div className="col-xl-4">
                      <h3 className="f-24 f-w-800 mb-3">
                        List Chapter
                      </h3>
                      <ListChapter lists={chapters} />
                    </div>
                  </div>

                  <Modal show={this.state.isModalQuiz} onHide={this.handleModalQuizClose}>
                    <Modal.Body style={{padding: '30px'}}>
                      <div className="text-center" style={{marginTop: '20px'}}>
                        <img src="/assets/images/component/exam.png" />
                      </div>
                      <a className="btn btn-ideku" href="#" style={{marginTop: '30px', fontWeight: 'bold'}}>
                        {course.category_name}
                      </a>
                      <h3 className="f-24 f-w-800 mb-3">{course.title}</h3>

                      <table>
                        <tbody>
                          <tr>
                            <td>
                              <img src="/assets/images/component/question.png" />
                            </td>
                            <td>
                              <span style={{marginLeft: '14px'}}>Total Soal</span>
                              <h3 style={{marginLeft: '14px'}} className="f-18 f-w-800 mb-3">{countSoal} Soal</h3>
                            </td>
                          </tr>
                          <tr>
                            <td>
                              <img src="/assets/images/component/clock.png" />
                            </td>
                            <td>
                              <span style={{marginLeft: '14px'}}>Waktu Pengerjaan</span>
                              <h3 style={{marginLeft: '14px'}} className="f-18 f-w-800 mb-3">{durasiWaktu} Menit</h3>
                            </td>
                          </tr>
                        </tbody>
                      </table>

                      <Link style={{marginTop: '20px'}} to={`/ujian-kursus/${this.state.examId}/${this.state.countSoal}/${this.state.durasiWaktu}`} className="btn btn-block btn-ideku f-w-bold">
                        Ya, Mulai Ujian
                      </Link>
                      <button type="button"
                        className="btn btn-block f-w-bold"
                        onClick={this.handleModalQuizClose}>
                        Kembali
                      </button>
                    </Modal.Body>
                  </Modal>

                  <Modal show={this.state.isUjianBelumAda} onHide={this.handleUjianBelumAda}>
                    <Modal.Body>
                      <h3 className="f-24 f-w-800 mb-3">Ujian belum ada pada kursus ini.</h3>
                      
                      <button style={{marginTop: '30px'}} type="button"
                        className="btn btn-block f-w-bold"
                        onClick={this.handleUjianBelumAda}>
                        Mengerti
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