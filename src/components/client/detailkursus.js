import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Card, Accordion, Badge } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../repository/api';
import Storage from '../../repository/storage';
import ReactPlayer from 'react-player';

export default class DetailKursus extends Component {

	state = {
    quiz: [],
    examId: '',
		courseId: this.props.match.params.course_id,
		companyId: '',
    isIkutiKursus: false,
    isButtonIkuti: true,
    isModalQuiz: false,
    isUjian: false,
    
    isQuiz: false,
    score: 0,
    isShowScore: false,
    scoreType: '',

    isUjianBelumAda: false,
    isMatiJikaTidakAdaUjian: false,
    isNotifUrut: false,

    kategoriCourse: '',
    judulCourse: '',
    countSoal: 0,
    durasiWaktu: '',

    course: { category_name: 'Memuat...' },
    courseID: '',
    courseTitle: '',
		chapters: [],
    // statChapter: 0,
	}

  pilihChapterTampil = e => {
    e.preventDefault();
      
    // cek apakah sudah mengikuti kursus
    if(this.state.isIkutiKursus) {
      
      const chapterId = e.target.getAttribute('data-id');
      API.get(`${API_SERVER}v1/chapter/${chapterId}`).then(res => {
        if(res.status === 200) {
          let courseChapter = {
            image: res.data.result.chapter_video,
            title: res.data.result.chapter_title,
            body: res.data.result.chapter_body,
            attachments: res.data.result.attachment_id
          }
          this.setState({ course: courseChapter })
        }
      })

      // const iterasi = e.target.getAttribute('data-iterasi');
      // // cek stat chapter
      // if(iterasi < this.state.statChapter) {
      //   // cek statChapter == jumlah chapters
      //   if(this.state.statChapter <= this.state.chapters.length) {

      //     const chapterVisited = localStorage.getItem(`chapter${iterasi}Visited`)
          
      //     if(!chapterVisited) {
      //       localStorage.setItem(`chapter${iterasi}Visited`, true)
            // this.setState({ statChapter: this.state.statChapter+1 })
          
      //       // update statChapter
      //       API.put(`${API_SERVER}v1/user-course/chapter/${Storage.get('user').data.user_id}/${this.state.courseId}`, { stat_chapter: this.state.statChapter })
      //     }
      //   }
      // } else {
      //   this.setState({ isNotifUrut: true })
      // }
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
            this.setState({
              course: res.data.result,
              judulCourse: res.data.result.title,
              kategoriCourse: res.data.result.category_name,
              courseID: res.data.result.course_id,
              courseTitle: res.data.result.title
            });
          }
        })

        API.get(`${API_SERVER}v1/user-course/cek/${Storage.get('user').data.user_id}/${this.state.courseId}`).then(res => {
          if(res.status === 200) {
            this.setState({ 
              isIkutiKursus: res.data.result, 
              isButtonIkuti: !res.data.result, 
              // statChapter: res.data.response.length !== 0 ? parseInt(res.data.response[0].stat_chapter) : 0 
            })
          }
        })

        API.get(`${API_SERVER}v1/user-course/cek/${Storage.get('user').data.user_id}/${this.state.courseId}`).then(res => {
          if(res.status === 200) {
            if(res.data.response.length != 0) {
              this.setState({ isUjian: res.data.response[0].is_exam ? true : false })
              this.setState({ isQuiz: res.data.response[0].is_quiz ? true : false })
            } else {
              this.setState({ isUjian: false, isQuiz: false })
            }
          }
        })

        // cek apakah ada ujian
        API.get(`${API_SERVER}v1/exam/coursepublish/${this.state.courseId}/${this.state.companyId}`).then(res => {
          if(res.status === 200) {
            if(res.data.result.length != 0) {
              // pilih ujian index ke 0 => yang terpublish
              this.setState({ examId: res.data.result[0].exam_id })
            } 
            else {
              this.setState({ 
                // isUjianBelumAda: true, 
                isMatiJikaTidakAdaUjian: true 
              })
            }
          }
        })

        // cek apakah ada quiz
        API.get(`${API_SERVER}v1/quiz/course/${this.state.courseId}/${this.state.companyId}`).then(res => {
          if(res.status === 200) {
            if(res.data.result.length !== 0) {
              this.setState({ quiz: res.data.result })
            } 
          }
        })

      }
    })
  }

	async componentDidMount() {
    await this.fetchDataChapter()
    await this.fetctDataCourse()
	}

  onClickIkutiKursus = e => {
    e.preventDefault();
    let form = {
      user_id: Storage.get('user').data.user_id,
      course_id: this.state.courseId
    }
    API.post(`${API_SERVER}v1/user-course`, form).then(res => {
      if(res.status === 200) {
        this.setState({ isIkutiKursus: !this.state.isIkutiKursus, isButtonIkuti: false, 
          // statChapter: 1 
        })
      }
    })
  }

  onClickIkutiExam = e => {
    e.preventDefault();
    API.get(`${API_SERVER}v1/exam/coursepublish/${this.state.courseId}/${this.state.companyId}`).then(res => {
      if(res.status === 200) {
        this.setState({ isModalQuiz: true, countSoal: res.data.result[0].soal, 
          durasiWaktu: res.data.result[0].time_minute, examId: res.data.result[0].exam_id })
      }
    })
  }

  onClickQuiz = e => {
    e.preventDefault();
    const quizId = e.target.getAttribute('data-id');    
    API.get(`${API_SERVER}v1/exam-answer/submit/${quizId}/${Storage.get('user').data.user_id}`).then(res => {
      if (res.status === 200) {
        if(res.data.result.score == null) {
          API.get(`${API_SERVER}v1/quiz/course/${this.state.courseId}/${this.state.companyId}`).then(res => {
            res.data.result.filter(item => item.exam_id == quizId);
            if (res.status === 200) {
              this.setState({
                isModalQuiz: true, countSoal: res.data.result[0].soal, examId: quizId
              })
            }
          })
        } else {
          this.setState({ score: res.data.result.score, isShowScore: true, scoreType: 'quiz' });
        }
      }
    })
  }

  handleModalScoreClose = e => {
    this.setState({ isShowScore: false, score: 0, scoreType: '' })
  }

  handleModalQuizClose = e => {
    this.setState({ isModalQuiz: false, countSoal: 0, durasiWaktu: '' })
  }

  pilihOverviewChapter = e => {
    e.preventDefault();
    API.get(`${API_SERVER}v1/course/${this.state.courseID}`).then(res => {
      if (res.status === 200) {
        this.setState({
          course: res.data.result,
        });
      }
    });
  }

	render() {
    const { quiz, chapters, course, isIkutiKursus, isButtonIkuti, countSoal, durasiWaktu, isMatiJikaTidakAdaUjian } = this.state;
    const dateFormat = new Date(course.created_at);

    let refactoryChapters = [...chapters];
    for(let i=0; i < quiz.length; i++) {
      for (let j = 0; j < chapters.length; j++) {
        if (quiz[i].quiz_at === chapters[j].chapter_id) {
          if (j === 0) {
            refactoryChapters.splice(chapters.indexOf(chapters[j]) + 1, 0, quiz[i]);
          } else {
            refactoryChapters.splice(chapters.indexOf(chapters[j]) + 1 + i, 0, quiz[i]);
          }
        }
      }
    }

    const ListChapter = ({lists}) => {
      if(lists.length !== 0) {
        return (
          <div>
            {lists.map((item, i) => {
              if(item.quiz) {
                return (
                  <Card
                    onClick={this.onClickQuiz}
                    className={`card-${
                      this.state.isIkutiKursus ? "active" : "nonactive"
                    }`}
                  >
                    <Card.Body data-id={item.exam_id}>
                      <h3
                        className="f-18 f-w-800"
                        style={{ marginBottom: "0px" }}
                        data-iterasi={i}
                        data-id={item.exam_id}
                      >
                        <Form.Text>Quiz</Form.Text>
                        {item.exam_title}
                        <span
                          style={{
                            position: "absolute",
                            right: "30px",
                            bottom: "36px"
                          }}
                        >
                          <i
                            className={`fa fa-${
                              this.state.isIkutiKursus ? "unlock" : "lock"
                            }`}
                          ></i>
                        </span>
                      </h3>
                    </Card.Body>
                  </Card>
                );
              } else {
                return (
                  <Card
                    onClick={this.pilihChapterTampil}
                    className={`card-${
                      this.state.isIkutiKursus ? "active" : "nonactive"
                    }`}
                    data-id={item.chapter_id}
                    key={item.chapter_id}
                  >
                    <Card.Body data-id={item.chapter_id}>
                      <h3
                        className="f-18 f-w-800"
                        style={{ marginBottom: "0px" }}
                        data-id={item.chapter_id}
                        data-iterasi={i}
                      >
                        <Form.Text data-id={item.chapter_id}>
                          Chapter {item.chapter_number}
                        </Form.Text>
                        {item.chapter_title}
                        <span
                          style={{
                            position: "absolute",
                            right: "30px",
                            bottom: "36px"
                          }}
                        >
                          <i
                            className={`fa fa-${
                              this.state.isIkutiKursus ? "unlock" : "lock"
                            }`}
                          ></i>
                        </span>
                      </h3>
                    </Card.Body>
                  </Card>
                );
              }
            })}

            <LinkUjian isUjian={this.state.isUjian} />

          </div>
        );
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
          <Link
            style={{ marginTop: "20px", padding: "20px" }}
            to={`/ujian-hasil/${this.state.examId}`}
            className="btn f-18 f-w-bold btn-block btn-ideku"
          >
            Lihat Hasil Ujian
          </Link>
        );
      } else {
        return (
          <div>
            {isIkutiKursus && !isMatiJikaTidakAdaUjian && (
              <Link
                onClick={this.onClickIkutiExam}
                to="#"
                className="btn f-18 f-w-bold btn-primary btn-block"
                style={{
                  fontWeight: "bold",
                  margin: "20px 0px",
                  padding: "20px"
                }}
              >
                Ikuti Ujian
              </Link>
            )}
          </div>
        );
      }
    };

    const CheckMedia = ({media}) => {
      if(media) {
        let ekSplit = media.split('.');
        let ektension = ekSplit[ekSplit.length-1];
        if(ektension === "jpg" || ektension === "png" || ektension === "jpeg") {
          return (
            <img class="img-fluid rounded" src={media} alt="" style={{marginBottom: '20px', width: '100%'}} />
          )
        } else {
          return (
            <div style={{position: 'relative', paddingTop: '56.25%'}}>
              <ReactPlayer 
                style={{position: 'absolute', top: '0', left: '0'}} 
                url={media}
                volume='1'
                controls
                height='100%'
                width='100%'
              />
            </div>
          )
        }
      }

      return null
    };

    const Attachments = ({media}) => {
      if(media) {
        let pecah = media.split(',');
        return (
          <div>
          {
            pecah.map((item, i) => (
              <a href={item} target="_blank" className="btn btn-ideku" style={{marginRight: '10px'}}>Attachments {i+1}</a>
            ))
          }
          </div>
        );
      }
      return null;
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
                      <CheckMedia media={course.image} />

                      {course.category_name && (
                        <Link
                          className="btn btn-ideku"
                          to="#"
                          style={{ fontWeight: "bold", marginTop: "5px" }}
                        >
                          {course.category_name}
                        </Link>
                      )}

                      <h3
                        className="f-24 f-w-800 mb-3"
                        style={{ marginTop: "20px" }}
                      >
                        {course.title}
                      </h3>

                      {course.created_at && (
                        <p>Posted on {dateFormat.toString().slice(0, 21)}</p>
                      )}

                      {course.caption && <p class="lead">{course.caption}</p>}

                      {isIkutiKursus && (
                        <div
                          dangerouslySetInnerHTML={{ __html: course.body }}
                        />
                      )}

                      {course.attachments && (
                        <Attachments media={course.attachments} />
                      )}

                      {isButtonIkuti && (
                        <Link
                          onClick={this.onClickIkutiKursus}
                          to="#"
                          className="btn f-18 f-w-bold btn-primary btn-block f-24"
                          style={{
                            fontWeight: "bold",
                            margin: "10px 0px",
                            padding: "20px"
                          }}
                        >
                          Ikuti Kursus
                        </Link>
                      )}
                    </div>

                    <div className="col-xl-4">
                      <h3 className="f-24 f-w-800 mb-3">List Chapter</h3>
                      <Card
                        onClick={this.pilihOverviewChapter}
                        className={`card-active`}
                        data-id={this.state.courseID}
                        key={this.state.courseID}
                      >
                        <Card.Body>
                          <h3
                            className="f-18 f-w-800"
                            style={{ marginBottom: "0px" }}
                            data-id={this.state.courseID}
                          >
                            <Form.Text data-id={this.state.courseID}>
                              Overview
                            </Form.Text>
                            {this.state.courseTitle}
                          </h3>
                        </Card.Body>
                      </Card>
                      <ListChapter lists={refactoryChapters} />
                    </div>
                  </div>

                  <Modal
                    show={this.state.isShowScore}
                    onHide={this.handleModalScoreClose}
                  >
                    <Modal.Body>
                      <img
                        className="img-fluid"
                        src="/assets/images/component/hasil.png"
                        alt="media"
                      />
                      <h3
                        style={{
                          position: "absolute",
                          left: "18%",
                          bottom: "180px",
                          color: "white"
                        }}
                        className="f-40 f-w-800 mb-3"
                      >
                        Nilai Quiz
                      </h3>
                      <h3
                        style={{
                          position: "absolute",
                          left: "18%",
                          bottom: "120px",
                          color: "white"
                        }}
                        className="f-50 f-w-800 mb-3"
                      >
                        {this.state.score}
                      </h3>

                      <button
                        style={{ marginTop: "30px" }}
                        type="button"
                        className="btn f-w-bold btn-block"
                        onClick={this.handleModalScoreClose}
                      >
                        Mengerti
                      </button>
                    </Modal.Body>
                  </Modal>

                  <Modal
                    show={this.state.isModalQuiz}
                    onHide={this.handleModalQuizClose}
                  >
                    <Modal.Body style={{ padding: "30px" }}>
                      <div
                        className="text-center"
                        style={{ marginTop: "20px" }}
                      >
                        <img
                          src="/assets/images/component/tes.png"
                          alt="media"
                        />
                      </div>
                      <h3 className="f-24 f-w-800 mb-3 text-center" style={{marginTop: '20px'}}>
                        {durasiWaktu ? 'Ujian': 'Quiz'}
                      </h3>
                      <Link
                        className="btn btn-ideku"
                        to="#"
                        style={{ fontWeight: "bold" }}
                      >
                        {this.state.kategoriCourse}
                      </Link>
                      <h3 className="f-24 f-w-800 mb-3">
                        {this.state.judulCourse}
                      </h3>

                      <table>
                        <tbody>
                          <tr>
                            <td>
                              <img
                                src="/assets/images/component/question.png"
                                alt="media"
                              />
                            </td>
                            <td>
                              <span style={{ marginLeft: "14px" }}>
                                Total Soal
                              </span>
                              <h3
                                style={{ marginLeft: "14px" }}
                                className="f-18 f-w-800 mb-3"
                              >
                                {countSoal} Soal
                              </h3>
                            </td>
                          </tr>
                          {durasiWaktu && (
                            <tr>
                              <td>
                                <img
                                  src="/assets/images/component/clock.png"
                                  alt="media"
                                />
                              </td>
                              <td>
                                <span style={{ marginLeft: "14px" }}>
                                  Waktu Pengerjaan
                                </span>
                                <h3
                                  style={{ marginLeft: "14px" }}
                                  className="f-18 f-w-800 mb-3"
                                >
                                  {durasiWaktu} Menit
                                </h3>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      <Link
                        style={{ marginTop: "20px" }}
                        to={`/ujian-kursus/${this.state.examId}/${
                          this.state.countSoal
                        }/${
                          this.state.durasiWaktu ? this.state.durasiWaktu : 0
                        }`}
                        className="btn btn-block btn-ideku f-w-bold"
                      >
                        Ya, Mulai Sekarang
                      </Link>
                      <button
                        type="button"
                        className="btn btn-block f-w-bold"
                        onClick={this.handleModalQuizClose}
                      >
                        Kembali
                      </button>
                    </Modal.Body>
                  </Modal>

                  <Modal
                    show={this.state.isUjianBelumAda}
                    onHide={this.handleUjianBelumAda}
                  >
                    <Modal.Body>
                      <h3 className="f-24 f-w-800 mb-3">
                        Belum ada ujian pada kursus ini.
                      </h3>

                      <button
                        style={{ marginTop: "30px" }}
                        type="button"
                        className="btn f-w-bold"
                        onClick={this.handleUjianBelumAda}
                      >
                        Mengerti
                      </button>
                    </Modal.Body>
                  </Modal>

                  <Modal
                    show={this.state.isNotifUrut}
                    onHide={this.closeNotifUrut}
                  >
                    <Modal.Body>
                      <h3 className="f-24 f-w-800 mb-3">
                        Selesaikan chapter sesuai urutannya.
                      </h3>

                      <button
                        style={{ marginTop: "30px" }}
                        type="button"
                        className="btn f-w-bold"
                        onClick={this.closeNotifUrut}
                      >
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