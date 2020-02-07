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
    isMatiJikaTidakAdaUjian: false,
    isNotifUrut: false,

    kategoriCourse: '',
    judulCourse: '',
    countSoal: '0',
    durasiWaktu: '0',

    course: { category_name: 'Memuat...' },
		chapters: [],
    statChapter: 0,
	}

  pilihChapterTampil = e => {
    e.preventDefault();
    const iterasi = e.target.getAttribute('data-iterasi');
    
    // cek stat chapter
    if(iterasi < this.state.statChapter) {

      // cek statChapter == jumlah chapters
      if(this.state.statChapter <= this.state.chapters.length) {

        const chapterVisited = localStorage.getItem(`chapter${iterasi}Visited`);
        
        console.log('chapter: ', chapterVisited)
        console.log('chapter: ', localStorage)

        if(chapterVisited === null) {
          localStorage.setItem(`chapter${iterasi}Visited`, true);
          this.setState({ statChapter: this.state.statChapter+1 })
        
          // update statChapter
          API.put(`${API_SERVER}v1/user-course/chapter/${Storage.get('user').data.user_id}/${this.state.courseId}`, { stat_chapter: this.state.statChapter })
        }
      }
      
      // cek apakah sudah mengikuti kursus
      if(this.state.isIkutiKursus) {
        const chapterId = e.target.getAttribute('data-id');
        API.get(`${API_SERVER}v1/chapter/${chapterId}`).then(res => {
          if(res.status === 200) {
            let courseChapter = {
              image: res.data.result.chapter_video,
              title: res.data.result.chapter_title,
              body: res.data.result.chapter_body
            }
            this.setState({ course: courseChapter })
          }
        })
      }

    } else {
      this.setState({ isNotifUrut: true })
    }
  }

  closeNotifUrut = e => {
    this.setState({ isNotifUrut: false })
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
            this.setState({ course: res.data.result, judulCourse: res.data.result.title, kategoriCourse: res.data.result.category_name })
          }
        })

        API.get(`${API_SERVER}v1/user-course/cek/${Storage.get('user').data.user_id}/${this.state.courseId}`).then(res => {
          if(res.status === 200) {
            console.log('res:', res.data.response)
            this.setState({ 
              isIkutiKursus: res.data.result, 
              isButtonIkuti: !res.data.result, 
              statChapter: parseInt(res.data.response[0].stat_chapter) 
            })
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
              this.setState({ isUjianBelumAda: true, isMatiJikaTidakAdaUjian: true })
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
    const { chapters, course, isIkutiKursus, isButtonIkuti, countSoal, durasiWaktu, isMatiJikaTidakAdaUjian } = this.state;
    const dateFormat = new Date(course.created_at);

    const ListChapter = ({lists}) => {
      if(lists.length !== 0) {
        return (
          <div>
          {
            lists.map((item, i) => {
              if(i < this.state.statChapter) {
                return (
                  <Card onClick={this.pilihChapterTampil} className={`card-${this.state.isIkutiKursus ? 'active':'nonactive'}`} key={item.chapter_id}>
                    <Card.Body>
                      <h3 className="f-18 f-w-800" style={{marginBottom: '0px'}} data-id={item.chapter_id} data-iterasi={i}>
                        {item.chapter_title} 
                        <span style={{position: 'absolute', right: '30px'}}><i className={`fa fa-${this.state.isIkutiKursus ? 'unlock':'lock'}`}></i></span>
                      </h3>
                    </Card.Body>
                  </Card>
                )
              } else {
                return (
                  <Card onClick={this.pilihChapterTampil} className={`card-nonactive`} key={item.chapter_id}>
                    <Card.Body>
                      <h3 className="f-18 f-w-800" style={{marginBottom: '0px'}} data-id={item.chapter_id} data-iterasi={i}>
                        {item.chapter_title} 
                        <span style={{position: 'absolute', right: '30px'}}><i className={`fa fa-${this.state.isIkutiKursus ? 'unlock':'lock'}`}></i></span>
                      </h3>
                    </Card.Body>
                  </Card>
                )
              }
            })  
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
          <Link style={{marginTop: '20px'}} to={`/ujian-hasil/${this.state.examId}`} className="btn btn-block btn-ideku">Lihat Hasil Ujian</Link>
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
                      <img class="img-fluid rounded" src={course.image} alt="" style={{marginBottom: '20px'}} />
                      
                      { course.category_name && <a className="btn btn-ideku" href="#" style={{fontWeight: 'bold'}}>{course.category_name}</a> }
                      
                      <h3 className="f-24 f-w-800 mb-3">{course.title}</h3>
                      
                      { course.created_at && <p>{dateFormat.toString()}</p> }

                      { course.caption && <p class="lead">{course.caption}</p> }

                      { isIkutiKursus && <div dangerouslySetInnerHTML={{ __html: course.body }} /> }

                      <LinkUjian isUjian={this.state.isUjian} />

                      {
                        !isMatiJikaTidakAdaUjian && (<div>
                          { isButtonIkuti && 
                            <Link onClick={this.onClickIkutiKursus} to="#" className="btn btn-primary btn-block" style={{fontWeight: 'bold', margin: '40px 0px'}}>
                              Ikuti Kursus
                            </Link>
                          }
                        </div>)
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
                        {this.state.kategoriCourse}
                      </a>
                      <h3 className="f-24 f-w-800 mb-3">{this.state.judulCourse}</h3>

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
                      <h3 className="f-24 f-w-800 mb-3">Belum ada ujian pada kursus ini.</h3>
                      
                      <button style={{marginTop: '30px'}} type="button"
                        className="btn f-w-bold"
                        onClick={this.handleUjianBelumAda}>
                        Mengerti
                      </button>
                    </Modal.Body>
                  </Modal>

                  <Modal show={this.state.isNotifUrut} onHide={this.closeNotifUrut}>
                    <Modal.Body>
                      <h3 className="f-24 f-w-800 mb-3">Selesaikan chapter sesuai urutannya.</h3>
                      
                      <button style={{marginTop: '30px'}} type="button"
                        className="btn f-w-bold"
                        onClick={this.closeNotifUrut}>
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