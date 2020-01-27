import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Card, Accordion, Badge } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../repository/api';
import Storage from '../../repository/storage';

export default class DetailKursus extends Component {

	state = {
		courseId: this.props.match.params.course_id,
		companyId: '',
    isIkutiKursus: false,
    isButtonIkuti: true,
    isModalQuiz: false,

    countSoal: '40',
    durasiWaktu: '120',

    course: { category_name: 'Memuat...' },
		chapters: []
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
        console.log('res: ', res.data.result)
        this.setState({ isIkutiKursus: !this.state.isIkutiKursus, isButtonIkuti: false })
      }
    })
  }

  onClickIkutiQuiz = e => {
    e.preventDefault();
    this.setState({ isModalQuiz: true })
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
          <Accordion>
          {
            lists.map((item, i) => (
              <Card style={{marginTop: '10px', marginBottom: '10px'}} key={item.chapter_id}>
                <Accordion.Toggle as={Card.Header} className="f-24 f-w-800" eventKey={item.chapter_id}>
                  <h3 className="f-24 f-w-800" style={{marginBottom: '0px', cursor: 'pointer'}}>{item.chapter_title}</h3>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={item.chapter_id}>
                  <Card.Body style={{padding: '16px'}}>
                    <img class="img-fluid rounded" src={item.chapter_video} alt="Media" />
                    <h3 className="f-24 f-w-800" style={{marginTop: '10px'}}>{item.chapter_body}</h3>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            ))  
          }
          </Accordion>
        )
      } else {
        return (
          <Card style={{marginTop: '10px'}}>
            <Card.Body>Memuat halaman...</Card.Body>
          </Card>
        )
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
                    <div className="col-xl-8">
                      <img class="img-fluid rounded" src={course.image} alt="" />
                      
                      <a className="btn btn-ideku" href="#" style={{marginTop: '20px', fontWeight: 'bold'}}>
                        {course.category_name}
                      </a>
                      <h3 className="f-24 f-w-800 mb-3">{course.title}</h3>
                      <p>{dateFormat.toString()}</p>

                      <p class="lead">{course.caption}...</p>

                      { isIkutiKursus && <div dangerouslySetInnerHTML={{ __html: course.body }} /> }

                      { isIkutiKursus && <Link onClick={this.onClickIkutiQuiz} to="#" className="btn btn-primary btn-block" style={{fontWeight: 'bold', margin: '40px 0px'}}>
                        Ikuti Quiz
                      </Link> }

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
                      </table>

                      <Link style={{marginTop: '20px'}} to={`/ujian-kursus`} className="btn btn-block btn-ideku f-w-bold">
                        Ya, Mulai Quiz
                      </Link>
                      <button type="button"
                        className="btn btn-block f-w-bold"
                        onClick={this.handleModalQuizClose}>
                        Kembali
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