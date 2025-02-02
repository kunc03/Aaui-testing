import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Card } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../repository/api';
import Storage from '../../repository/storage';
import ReactPlayer from 'react-player';

import Viewer, { Worker, SpecialZoomLevel } from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';

export default class DetailKursus extends Component {

  state = {
    quiz: [],
    examId: '',
    courseId: this.props.match.params.course_id,
    activeCard: this.props.match.params.course_id,
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
    idResultQuiz: '',
    // statChapter: 0,

  }

  pilihChapterTampil = e => {
    e.preventDefault();

    // cek apakah sudah mengikuti kursus
    if (this.state.isIkutiKursus) {

      const chapterId = e.target.getAttribute('data-id');
      this.setState({ activeCard: chapterId });

      API.get(`${API_SERVER}v1/chapter/${chapterId}`).then(async res => {
        if (res.status === 200) {
          let formData = {
            courseId: this.state.courseId,
            chapterId: chapterId,
            userId: Storage.get('user').data.user_id
          }
          API.post(`${API_SERVER}v1/chapter/course`, formData).then(res => { console.log(res) })

          let getModerator = {};
          if (res.data.result.moderator) {
            getModerator = await API.get(`${API_SERVER}v1/user/${res.data.result.moderator}`);
          } else {
            getModerator = { data: { result: { name: "" } } };
          }

          let courseChapter = {
            image: res.data.result.chapter_video,
            title: res.data.result.chapter_title,
            body: res.data.result.chapter_body,
            attachments: res.data.result.attachment_id,
            thumbnail: res.data.result.thumbnail,
            jenis_pembelajaran: res.data.result.jenis_pembelajaran,
            waktu_mulai: res.data.result.waktu_mulai,
            waktu_selesai: res.data.result.waktu_selesai,
            moderator: getModerator.data.result.name,
            tags_forum: res.data.result.tags_forum ? res.data.result.tags_forum.split(',') : []
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
      if (res.status === 200) {
        this.setState({ chapters: res.data.result });
      }
    })
  }

  fetctDataCourse() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if (res.status === 200) {
        this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id })

        API.get(`${API_SERVER}v1/course/${this.state.courseId}`).then(res => {
          if (res.status === 200) {

            var data = res.data.result
            /*mark api get new history course*/
            let form = {
              user_id: Storage.get('user').data.user_id,
              course_id: data.course_id,
              description: data.title,
              title: data.type
            }

            API.post(`${API_SERVER}v1/api-activity/new-course`, form).then(console.log);


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
          if (res.status === 200) {
            this.setState({
              isIkutiKursus: res.data.result,
              isButtonIkuti: !res.data.result,
              // statChapter: res.data.response.length !== 0 ? parseInt(res.data.response[0].stat_chapter) : 0 
            })
          }
        })

        API.get(`${API_SERVER}v1/user-course/cek/${Storage.get('user').data.user_id}/${this.state.courseId}`).then(res => {
          if (res.status === 200) {
            if (res.data.response.length != 0) {
              this.setState({ isUjian: res.data.response[0].is_exam ? true : false })
              this.setState({ isQuiz: res.data.response[0].is_quiz ? true : false })
            } else {
              this.setState({ isUjian: false, isQuiz: false })
            }
          }
        })

        // cek apakah ada ujian
        API.get(`${API_SERVER}v1/exam/coursepublish/${this.state.courseId}/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id}`).then(res => {
          if (res.status === 200) {
            if (res.data.result.length != 0) {
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
        API.get(`${API_SERVER}v1/quiz/course/${this.state.courseId}/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id}`).then(res => {
          if (res.status === 200) {
            if (res.data.result.length !== 0) {
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
      if (res.status === 200) {
        this.setState({
          isIkutiKursus: !this.state.isIkutiKursus, isButtonIkuti: false,
          // statChapter: 1 
        })
      }
    })
  }

  onClickIkutiExam = e => {
    e.preventDefault();
    API.get(`${API_SERVER}v1/exam/coursepublish/${this.state.courseId}/${this.state.companyId}`).then(res => {
      if (res.status === 200) {
        this.setState({
          isModalQuiz: true, countSoal: res.data.result[0].soal,
          durasiWaktu: res.data.result[0].time_minute, examId: res.data.result[0].exam_id
        })
      }
    })
  }

  onClickQuiz = e => {
    e.preventDefault();
    const quizId = e.target.getAttribute('data-id');
    API.get(`${API_SERVER}v1/exam-answer/submit/${quizId}/${Storage.get('user').data.user_id}`).then(res => {
      if (res.status === 200) {
        if (res.data.result.score == null) {
          API.get(`${API_SERVER}v1/quiz/course/${this.state.courseId}/${this.state.companyId}`).then(res => {
            let filtered = res.data.result.filter(item => item.exam_id == quizId);
            if (res.status === 200) {
              this.setState({
                isModalQuiz: true, countSoal: filtered[0].soal, examId: quizId
              })
            }
          })
        } else {
          let decimal;
          if (res.data.result.score === Math.floor(res.data.result.score)) {
            decimal = true;
          } else {
            decimal = false;
          }
          this.setState({ score: decimal ? res.data.result.score : res.data.result.score.toFixed(2), isShowScore: true, scoreType: 'quiz', idResultQuiz: res.data.result.exam_id });
          console.log('ALVIN', this.state)
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
    this.setState({ activeCard: this.state.courseID })
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

    console.log('RES: ', this.state);

    let refactoryChapters = [...chapters];
    for (let i = 0; i < quiz.length; i++) {
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

    const ListChapter = ({ lists }) => {
      if (lists.length !== 0) {
        return (
          <div>
            {lists.map((item, i) => {
              if (item.quiz) {
                return (
                  <Card
                    onClick={this.onClickQuiz}
                    className={`card-${this.state.isIkutiKursus ? "active" : "nonactive"
                      }`}
                  >
                    <Card.Body data-id={item.exam_id}>
                      <h3
                        className="f-16 f-w-800"
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
                            className={`${this.state.isIkutiKursus ? "" : "fa fa-lock"
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
                    style={Number(this.state.activeCard) === Number(item.chapter_id) ? { backgroundColor: '#dcdcdc' } : {}}
                    onClick={this.pilihChapterTampil}
                    className={`card-${this.state.isIkutiKursus ? "active" : "nonactive"
                      }`}
                    data-id={item.chapter_id}
                    key={item.chapter_id}
                  >
                    <Card.Body data-id={item.chapter_id}>
                      <h3
                        className="f-16 f-w-800"
                        style={{ marginBottom: "0px" }}
                        data-id={item.chapter_id}
                        data-iterasi={i}
                      >
                        <Form.Text data-id={item.chapter_id}>
                          Chapter {item.chapter_number}
                        </Form.Text>
                        <Form.Text style={{ float: 'right' }} data-id={item.chapter_id}>
                          {item.jenis_pembelajaran == "forum" ? "Forum" : item.jenis_pembelajaran == "group meeting" ? "Meeting" : "Media"}
                        </Form.Text>
                        {item.chapter_title}
                        <span
                          style={{
                            position: "absolute",
                            right: "30px",
                            bottom: "36px",
                          }}
                        >
                          <i
                            className={`${this.state.isIkutiKursus ? "" : "fa fa-lock"
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
          <Card style={{ marginTop: '10px' }}>
            <Card.Body>There are no chapters</Card.Body>
          </Card>
        )
      }
    };

    const LinkUjian = ({ isUjian }) => {
      if (isUjian) {
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

    // unutk banner photo, responsive center image
    const CheckMedia = ({ media, thumbnail }) => {
      if (media) {
        let ekSplit = media.split('.');
        let ektension = ekSplit[ekSplit.length - 1];
        if (ektension === "jpg" || ektension === "png" || ektension === "jpeg") {
          return (
            <div>
              <div className="responsive-image-banner" style={{ backgroundImage: `url(${media})` }}></div>
            </div>
          )
        }
        else if (ektension === "pdf") {
          return (
            <div style={{ height: 850 }}>
              <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.3.200/pdf.worker.min.js">
                <Viewer fileUrl={media} defaultScale={SpecialZoomLevel.PageFit} />
              </Worker>
            </div>
          )
        }
        else {
          return (
            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
              <ReactPlayer
                style={{ position: 'absolute', top: '0', left: '0' }}
                url={media}
                volume='1'
                light={thumbnail ? thumbnail : `https://media.istockphoto.com/videos/play-button-blue-video-id472605657?s=640x640`}
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

    const Attachments = ({ media }) => {
      if (media) {
        let pecah = media.split(',');
        return (
          <div>
            {
              pecah.map((item, i) => (
                <a href={item} target="_blank" className="btn btn-ideku" style={{ marginRight: '10px' }}>Attachments {i + 1}</a>
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
                    <div className="col-xl-8" style={{ padding: 0 }}>
                      <div
                        style={{
                          background: '#FFF',
                          borderRadius: 5,
                          boxShadow: '0 1px 20px 0 rgba(69, 90, 100, 0.08)',
                          padding: 20,
                          marginBottom: 20,
                        }}
                      >
                        <h3
                          className="f-24 f-w-800 mb-3"
                          style={{ marginTop: "10px" }}
                        >
                          {course.title}
                        </h3>
                        {course.caption && <p style={{ color: '#6d6d6d' }} class="lead">{course.caption}</p>}
                        {course.category_name && (
                          <Link
                            className="btn btn-ideku"
                            to="#"
                            style={{ fontWeight: "bold", marginTop: "5px" }}
                          >
                            {course.category_name}
                          </Link>
                        )}
                        {course.created_at && (
                          <p>Posted on {dateFormat.toString().slice(0, 21)}</p>
                        )}
                        <CheckMedia media={course.image} thumbnail={course.thumbnail} />

                        {isButtonIkuti && (
                          // <Link
                          //   onClick={this.onClickIkutiKursus}
                          //   to="#"
                          //   className="btn f-18 f-w-bold btn-primary btn-block f-24"
                          //   style={{
                          //     fontWeight: "bold",
                          //     margin: "10px 0px",
                          //     padding: "20px"
                          //   }}
                          // >
                          //   Ikuti Kursus
                          // </Link>
                          <div className="row" style={{ marginTop: 20 }}>
                            <div className="col-md-12 col-xl-12">
                              <div
                                className="card"
                                style={{ position: "relative", overflow: "hidden" }}
                              >
                                <img
                                  src="assets/images/component/Ilustrasi.png"
                                  style={{
                                    position: "absolute",
                                    right: "5%",
                                    bottom: "-115px",
                                    width: 394,
                                    height: 366,
                                    opacity: "0.1"
                                  }}
                                  alt=""
                                />
                                <div className="row">
                                  <div className="col-xl-2 text-center">
                                    <img
                                      alt="Gambar"
                                      className="img-radius p-1"
                                      style={{ width: 136, height: 136 }}
                                      src="assets/images/component/Ilustrasi.png"
                                    />
                                  </div>
                                  <div className="col-xl-7">
                                    <div className="media-body p-t-30 p-l-10 p-b-10 p-r-10">
                                      <h5 className="chat-header f-w-800 f-24">
                                        Yuk, kuasai kursus ini dengan mengikuti materi lengkapnya{" "}
                                      </h5>
                                      <div style={{ width: "90%" }}>
                                        <small className="d-block text-c-grey f-w-600 f-16">
                                          Klik tombol "Ikuti Kursus" untuk melihat materi lengkap.
                                      </small>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-md-12 col-xl-3">
                                    <div className="media-body p-t-50 p-l-10 p-b-10 p-r-10 text-center">
                                      <button
                                        onClick={this.onClickIkutiKursus}
                                        type="button"
                                        className="btn f-w-600 f-14 text-c-white bg-c-purple-ideku shadow-box"
                                        title="Ikuti kursus"
                                        data-toggle="tooltip"
                                      >
                                        Ikuti Kursus
                                    </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* {isIkutiKursus && ( */}
                        <div
                          style={{ paddingTop: 20, paddingBottom: 20, color: '#3c3939' }}
                          dangerouslySetInnerHTML={{ __html: course.body }}
                        />
                        {/* )} */}

                        {course.attachments && (
                          <Attachments media={course.attachments} />
                        )}

                        {
                          // START JIKA JENIS PEMBELAJARAN MEETING
                        }
                        {
                          this.state.course.jenis_pembelajaran == "group meeting" &&
                          <div>
                            <h3>Moderator : {this.state.course.moderator}</h3>
                            <a href="#" target="_blank" style={{ marginTop: '20px' }} className="btn btn-ideku btn-block">Ikuti Group Meeting</a>
                          </div>
                        }
                        {
                          // END JIKA JENIS PEMBELAJARAN MEETING
                        }

                        {
                          // START JIKA JENIS PEMBELAJARAN FORUM
                        }
                        {
                          this.state.course.jenis_pembelajaran == "forum" &&
                          this.state.course.tags_forum.map(item => (
                            <span className="label label-info">{item}</span>
                          ))
                        }
                        {
                          this.state.course.jenis_pembelajaran == "forum" &&
                          <Form style={{ marginTop: "30px" }}>
                            <hr />
                            <Form.Group controlId="formIsi">
                              <Form.Label className="f-w-bold">
                                Berikan Komentar
                            </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows="5"
                                value={this.state.komentar}
                                onChange={this.onChangeInput}
                                name="komentar"
                                placeholder="Berikan Komentar"
                              />
                              <Form.Text className="text-muted">
                                Isi komentar anda dalam forum ini.
                            </Form.Text>
                            </Form.Group>
                            <Form.Group>
                              <input
                                type="file"
                                id="attachment"
                                name="attachment"
                                onChange={this.onChangeInput}
                              />
                              <Form.Text className="text-muted">
                                Pastikan file berformat pdf, png, jpeg, jpg, atau gif.
                            </Form.Text>
                            </Form.Group>

                            <div style={{ marginTop: "20px" }}>
                              <button
                                type="button"
                                onClick={this.onClickSubmitKomentar}
                                className="btn btn-primary f-w-bold"
                              >
                                Beri Komentar
                            </button>
                            </div>
                          </Form>
                        }
                        {
                          // END JIKA JENIS PEMBELAJARAN FORUM
                        }

                      </div>
                    </div>

                    <div className="col-xl-4">
                      {/* <h3 className="f-24 f-w-800 mb-3">List Chapter</h3> */}
                      <Card
                        bg={Number(this.state.activeCard) === Number(this.state.courseID) ? `#dcdcdc` : ``}
                        onClick={this.pilihOverviewChapter}
                        className={`card-active`}
                        data-id={this.state.courseID}
                        key={this.state.courseID}
                        style={{
                          marginTop: 0,
                          backgroundColor: Number(this.state.activeCard) === Number(this.state.courseID) ? '#dcdcdc' : ''
                        }}
                      >
                        <Card.Body>
                          <h3
                            className="f-16 f-w-800"
                            style={{ marginBottom: "0px", }}
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

                      <a
                        href={`/ujian-hasil/${this.state.idResultQuiz}`}
                        style={{ marginTop: "30px" }}
                        type="button"
                        className="btn btn-ideku f-w-bold "
                        onClick={this.handleModalScoreClose}
                      >
                        Lihat Jawaban
                      </a>

                      &nbsp; &nbsp;

                      <button
                        style={{ marginTop: "30px" }}
                        type="button"
                        className="btn f-w-bold "
                        onClick={this.handleModalScoreClose}
                      >
                        Close
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
                      <h3 className="f-24 f-w-800 mb-3 text-center" style={{ marginTop: '20px' }}>
                        {durasiWaktu ? 'Exam' : 'Quiz'}
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
                                  Processing time
                                </span>
                                <h3
                                  style={{ marginLeft: "14px" }}
                                  className="f-18 f-w-800 mb-3"
                                >
                                  {durasiWaktu} Minute
                                </h3>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>

                      <Link
                        style={{ marginTop: "20px" }}
                        to={`/ujian-kursus/${this.state.examId}/${this.state.countSoal
                          }/${this.state.durasiWaktu ? this.state.durasiWaktu : 0
                          }`}
                        className="btn btn-block btn-ideku f-w-bold"
                      >
                        Yes, star now
                      </Link>
                      <button
                        type="button"
                        className="btn btn-block f-w-bold"
                        onClick={this.handleModalQuizClose}
                      >
                        Back
                      </button>
                    </Modal.Body>
                  </Modal>

                  <Modal
                    show={this.state.isUjianBelumAda}
                    onHide={this.handleUjianBelumAda}
                  >
                    <Modal.Body>
                      <h3 className="f-24 f-w-800 mb-3">
                        There are no exams in this course yet.
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