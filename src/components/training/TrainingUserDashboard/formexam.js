import React, { Component } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import API, { API_SERVER, USER_ME, APPS_SERVER } from '../../../repository/api';
import { toast } from 'react-toastify';
import Storage from '../../../repository/storage';
import moment, { months } from 'moment-timezone';
import { Modal } from 'react-bootstrap';
import './traininguserdashboard.css';
import { Link } from 'react-router-dom';
import SocketContext from '../../../socket';
class TrainingUserHistoryExam extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPrint: true,
      index: -1,
      prevResult: false,
      nextResult: false,
      modalActivate: false,
      infoUser: {},
      feedbackSock: null,
      time: {
        h: 0,
        m: 0,
        s: 0,
      },
      idMembership: null,
      isSaving: false,
      updateMembership: false,
      image: '',
      imagePreview: 'assets/images/no-image.png',
      seconds: localStorage.getItem('timerExam') || 90 * 60,
      userId: this.props.match.params.idTrainingUser,
      userData: Storage.get('user'),
      resultId: this.props.match.params.resultId,
      id: '',
      msgSuccesSubmit: 'Your exam has been successfully submitted',
      msgErrorSubmit: 'Session time has expired',
      disableSubmit: false,
      currentResult: {
        assigneeId: 0,
        resultId: 0,
        startTime: '00:00:00',
        submissionTime: '00:00:00',
        availableResult: true,
        courseId: 0,
        courseTitle: '',
        duration: '',
        examTitle: '',
        minScore: 0,
        score: 0,
        timeLimit: 0,
        type: null,
      },
      finalScore: '-',
      correctAnswer: 0,
      totalQuestion: 0,
      progress: 0,
      companyId: '',
      data: [],
      unassigned: [],
      filter: '',
      modalDelete: false,
      deleteId: '',
      activateId: '',
      dataState: false,
      isLoading: false,
      optionsCourse: [],
      optionsScheduled: [
        { label: 'Yes', value: '1' },
        { label: 'No', value: '0' },
      ],
      start_time: new Date(),
      end_time: new Date(),
      lengthExam: [1, 2, 3],
      detailDataExam: {
        question: [],
      },
      selectedNumber: 0,
      selectedViewDetail: 0,
      status: false,
      idHistoryAssignee: 0,
    };

    this.countDown = this.countDown.bind(this);
  }

  closeModalMembership = (e) => {
    window.location.href = `/training/userhistory/${this.state.userId}/${this.state.idHistoryAssignee}`;
    this.setState({ updateMembership: !this.state.updateMembership });
  };

  closeModalActivate = (e) => {
    window.location.href = `/training/userhistory/${this.state.userId}/${this.state.idHistoryAssignee}`;
    this.setState({ modalActivate: !this.state.modalActivate });
  };

  toHHMMSS(arg) {
    if (arg === 0) {
      return '00:00:00';
    } else {
      var sec_num = parseInt(arg, 10); // don't forget the second param
      var hours = Math.floor(sec_num / 3600);
      var minutes = Math.floor((sec_num - hours * 3600) / 60);
      var seconds = sec_num - hours * 3600 - minutes * 60;

      if (hours < 10) {
        hours = '0' + hours;
      }
      if (minutes < 10) {
        minutes = '0' + minutes;
      }
      if (seconds < 10) {
        seconds = '0' + seconds;
      }
      return hours + ':' + minutes + ':' + seconds;
    }
  }

  changeResult(type, index) {
    let list = this.state.listResult;
    if (type === 'prevResult') {
      index--;
    } else {
      index++;
    }
    if (index > -1 && list[index]) {
      if (type === 'prevResult') {
        this.setState({ prevResult: list[index].resultId });
      } else {
        this.setState({ nextResult: list[index].resultId });
      }
    } else {
      if (type === 'prevResult') {
        this.setState({ prevResult: false });
      } else {
        this.setState({ nextResult: false });
      }
    }
    //console.log(this.state.prevResult, this.state.nextResult, "PREV | NEXT")
  }

  getUserData() {
    this.setState({ isLoading: true, dataState: true });
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then((res) => {
      if (res.status === 200) {
        this.setState({
          companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id,
          //userId: res.data.result.user_id,
        });

        API.get(`${API_SERVER}v2/training/exam/read-user/${this.state.resultId}?web=1`).then((res) => {
          if (res.data.error) {
            toast.error('Data not found');
            this.setState({ isLoading: false });
          } else {
            let result = res.data.result;
            result.question = result.question.map((detail, idx) => {
              if (detail.type === 2) {
                const regExp = /{ANSWER}/g;
                let countMatchDot = detail.question.match(regExp);
                detail.question_origin = detail.question;
                for (let i = 65; i < 65 + countMatchDot.length; i++) {
                  detail.question = detail.question.replace(
                    '{ANSWER}',
                    `<b style='color:red;'>(${String.fromCharCode(i)})____</b>`,
                  );
                }
              }
              return { ...detail, open: false };
            });
            if (result.questionAnswer) {
              try {
                result.questionAnswer = result.questionAnswer.map((detail, idx) => {
                  if (detail.type === 2) {
                    const regExp = /{ANSWER}/g;
                    let countMatchDot = detail.question.match(regExp);
                    detail.question_origin = detail.question;
                    for (let i = 65; i < 65 + countMatchDot.length; i++) {
                      detail.question = detail.question.replace(
                        '{ANSWER}',
                        `<b style='color:red;'>(${String.fromCharCode(i)})____</b>`,
                      );
                    }
                  }
                  return { ...detail, open: false };
                });
              } catch (e) {}
            }
            let dateNow = moment(result.submission_start);
            let dateEnd = moment(result.submission_end);
            let second = dateEnd.diff(dateNow, 'seconds');
            let formExam = localStorage.getItem(this.state.resultId);
            let totalAnswer = 0;

            if (result.questionAnswer) {
              result.questionAnswer.forEach((item) => {
                if (item.userAnswer) {
                  totalAnswer++;
                }
              });
              if (formExam) formExam = JSON.parse(formExam);
            } else {
              if (formExam) {
                formExam = JSON.parse(formExam);
                formExam.questionAnswer.forEach((item) => {
                  if (item.userAnswer) {
                    totalAnswer++;
                  }
                });
              }
            }

            if (formExam) {
              if (result.warning === 'time expired') {
                second = 0;
                localStorage.removeItem(this.state.resultId);
                clearInterval(this.timer);

                this.setState(
                  {
                    correctAnswer: totalAnswer,
                    msgSuccesSubmit: 'Session time has expired.',
                    detailDataExam: result,
                    isLoading: false,
                    totalQuestion: result.question.length,
                    disableSubmit: true,
                    second: 0,
                  },
                  () => {
                    console.log('RUN time expired', '???');
                    this.submitFormExam.bind(this)();
                  },
                );
              } else {
                if (result.questionAnswer) {
                  formExam.questionAnswer = result.questionAnswer;
                  localStorage.setItem(this.state.resultId, JSON.stringify(formExam));
                }
                result.question = formExam.questionAnswer;
                this.setState({
                  correctAnswer: totalAnswer,
                  detailDataExam: result,
                  msgSuccesSubmit: `Your ${result.exam === 1 ? 'exam' : 'quiz'} has been successfully submitted`,
                  selectedNumber: formExam.selectedNumber,
                  selectedViewDetail: formExam.selectedViewDetail,
                  isLoading: false,
                  totalQuestion: result.question.length,
                  seconds: second /*Number(result.time_limit) * 60*/,
                });
                this.timer = setInterval(this.countDown, 1000);
              }
            } else {
              if (!result.warning) {
                if (result.questionAnswer) {
                  result.question = result.questionAnswer;
                  localStorage.setItem(this.state.resultId, JSON.stringify({ questionAnswer: result.questionAnswer }));
                }
                this.setState({
                  correctAnswer: totalAnswer,
                  detailDataExam: result,
                  msgSuccesSubmit: `Your ${result.exam === 1 ? 'exam' : 'quiz'} has been successfully submitted`,
                  isLoading: false,
                  totalQuestion: result.question.length,
                  seconds: second /*Number(result.time_limit) * 60*/,
                });
                this.timer = setInterval(this.countDown, 1000);
              } else {
                clearInterval(this.timer);
                localStorage.removeItem(this.state.resultId);
                this.setState(
                  {
                    correctAnswer: totalAnswer,
                    msgSuccesSubmit: 'Session time has expired.',
                    detailDataExam: result,
                    isLoading: false,
                    disableSubmit: true,
                    second: 0,
                  },
                  () => {
                    this.forceUpdate();
                    console.log('RUN time expired - no local', '?????');
                    this.submitFormExam.bind(this)();
                  },
                );
              }
            }
          }
          //return;
        });
      }
    });
  }

  // Things to do before unloading/closing the tab
  doSomethingBeforeUnload = (ev) => {
    // Do something
    return (ev.returnValue = 'Are you sure you want to close?');
  };

  // Setup the `beforeunload` event listener
  setupBeforeUnloadListener = () => {
    window.addEventListener('beforeunload', (ev) => {
      // ev.preventDefault();

      return this.doSomethingBeforeUnload(ev);
    });
  };

  getUserDetail(id) {
    API.get(`${API_SERVER}v2/training/user/read/${id}`).then((res) => {
      if (res.data.error) {
        toast.error('Error read user');
      } else {
        this.setState({ infoUser: res.data.result });
      }
    });
  }

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      h: hours > 9 ? hours : '0' + hours,
      m: minutes > 9 ? minutes : '0' + minutes,
      s: seconds > 9 ? seconds : '0' + seconds,
    };
    return obj;
  }

  save = (e) => {
    e.preventDefault();
    this.setState({ isSaving: true });
    if (this.state.image) {
      let formData = new FormData();
      formData.append('photo', this.state.image);
      API.put(`${API_SERVER}v2/training/membership/photo/${this.state.idMembership}`, formData).then((res2) => {
        if (res2.data.error) {
          toast.warning('Fail to upload image. Please Try Again.');
          this.setState({ isSaving: false });
          // this.closeModalMembership.bind(this)()
        } else {
          toast.success('Membership edited');
          this.setState({ isSaving: false });
          this.closeModalMembership.bind(this)();
        }
      });
    } else {
      toast.success('Membership edited');
      this.setState({ isSaving: false });
      this.closeModalMembership.bind(this)();
    }
  };

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds == 0 ? 0 : this.state.seconds - 1;
    localStorage.setItem('timerExam', seconds);
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });


    // Check if we're at zero.
    if (seconds === 0 || parseInt(seconds) < 0) {
      localStorage.removeItem(this.state.resultId);
      clearInterval(this.timer);
      this.submitFormExam.bind(this)();
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.status !== this.state.status) {
      console.log(prevState.status, this.state.status, '????');
      window.removeEventListener('beforeunload', (ev) => {
        ev.preventDefault();

        return this.doSomethingBeforeUnload(ev);
      });
    }
  }

  componentDidMount() {
    const queryParams = new URLSearchParams(window.location.search);
    const feedbackSock = queryParams.get('area');
    this.setState({ feedbackSock });
    this.getUserDetail(this.props.match.params.idTrainingUser);
    this.getUserData();
    //this.setupBeforeUnloadListener();
  }

  pagination(conditional, e) {
    e.preventDefault();
    const prevNum = this.state.selectedNumber - 1;
    const nextNum = this.state.selectedNumber + 1;

    if (conditional === 'prev') {
      if (this.state.selectedNumber === 0) return;
      this.setState({ selectedNumber: prevNum });
      document.getElementById(prevNum + 'divAnswerOption').scrollIntoView({ behavior: 'smooth' });
    }

    if (conditional === 'next') {
      if (this.state.selectedNumber === this.state.detailDataExam.question.length - 1) return;
      this.setState({ selectedNumber: nextNum });
      document.getElementById(nextNum + 'divAnswerOption').scrollIntoView({ behavior: 'smooth' });
    }
  }

  backToScrollView(id, e) {
    e.preventDefault();
    this.setState({ selectedNumber: id });
    document.getElementById(id + 'divAnswerOption').scrollIntoView({ behavior: 'smooth' });
  }

  selectedAnswer(index, option, detailDataExam) {
    let a = detailDataExam.question;
    a[index].userAnswer = option.option_label;
    a[index].option_label = a[index].userAnswer;
    let totalAnswer = 0;
    a.forEach((item) => {
      if (item.userAnswer) {
        totalAnswer++;
      }
    });

    this.setState({
      detailDataExam: { ...detailDataExam, question: a },
      selectedNumber: index,
      selectedViewDetail: index,
      correctAnswer: totalAnswer,
    });
    localStorage.setItem(
      this.state.resultId,
      JSON.stringify({
        questionAnswer: a,
        selectedNumber: index,
        selectedViewDetail: index,
        assigneeId: this.state.resultId,
      }),
    );

    let dtoSubmit = {
      training_exam_id: this.state.detailDataExam.id,
      training_assignee_id: this.state.resultId,
      submission_condition: 'Normal',
      questionAnswer: this.state.detailDataExam.question,
    };

    API.post(`${API_SERVER}v2/training/exam/temporary-submit`, dtoSubmit).then((res) => {
      if (res.data.error) {
        toast.warning(res.data.result);
      }
    });
  }

  handleChange = (e) => {
    let { name, value } = e.target;
    if (name === 'image') {
      if (e.target.files.length) {
        if (e.target.files[0].size <= 5000000) {
          let image = {
            image: e.target.files[0],
            imagePreview: URL.createObjectURL(e.target.files[0]),
          };
          this.setState(image);
        } else {
          e.target.value = null;
          toast.warning('Image size cannot larger than 5MB and must be an image file');
        }
      }
    } else {
      this.setState({ [name]: value });
    }
  };

  setOptionShortAnswer(e, indexQuestion, indexOption, option, detailDataExam, short_answer) {
    let tmp = this.state.detailDataExam;
    tmp.question[indexQuestion].option[indexOption].option_text = e.target.value;
    //console.log(tmp.question[indexQuestion].option[indexOption],"?????")
    this.setState({ detailDataExam: tmp }, () => {
      this.forceUpdate();
      this.selectedAnswer(indexQuestion, option, detailDataExam, short_answer);
    });
  }

  getTrainingExamResult(resultid) {
    API.get(`${API_SERVER}v2/training/exam/result/${resultid}`).then((res) => {
      if (res.data.error) {
        toast.warning('Error Get Result. Please wait a moment.');
      } else {
        const scoreExam = res.data.result.score;
        this.setState({ finalScore: scoreExam });
      }
    });
  }

  submitFormExam() {
    this.setState({ isLoading: true });
    let userdata = this.state.userData;
    const idCompany = Storage.get('user').data.company_id;
    const idTrainingUser = Storage.get('user').data.training_user_id;
    let dtoSubmit = {};
    try {
      dtoSubmit = {
        exam_id: this.state.detailDataExam.id,
        training_user_id: userdata.data.training_user_id,
        assignee_id: this.state.resultId,
        submission_condition: 'Normal',
        answer: [], //this.state.detailDataExam.question.map(question => ({ question_id: question.id, option_label: question.userAnswer || "" }))
      };
    } catch (error) {
      this.setState({ isLoading: false });
      return toast.warning('Submit is failed');
    }

    // manipulasi answer sesuai type short answer / multiple
    let detail = this.state.detailDataExam.question;
    let tmpAnswer = [];
    detail.forEach((item) => {
      if (item.short_answer) {
        let op = item.option.map((op) => ({ option_label: op.option_label, option_text: op.option_text }));
        tmpAnswer.push({ question_id: item.id, option: op, type: 2 });
      } else {
        tmpAnswer.push({ question_id: item.id, option_label: item.userAnswer || '', type: 1 });
      }
    });

    dtoSubmit.answer = tmpAnswer;

    //return console.log(dtoSubmit,"???")
    API.post(`${API_SERVER}v2/training/exam/submit-web`, dtoSubmit).then((res) => {
      if (res.data.error) {
        toast.warning('Error Submit Form. Please wait a moment.');
      } else {
        this.props.socket.emit('APP::read_training_user_dashboard', {
          data: { user_id: idTrainingUser, company_id: idCompany, assignee_id: this.state.resultId, action: 'Exam' },
          feedbackSock: this.state.feedbackSock,
        });
        const isTakePhoto = res.data.result.take_photo;
        this.getTrainingExamResult.bind(this, this.state.resultId);
        localStorage.removeItem(this.state.resultId);
        toast.success('Success Submit Form!.');
        this.setState({
          modalActivate: !isTakePhoto,
          updateMembership: isTakePhoto,
          idHistoryAssignee: res.data.result.result_id,
          isLoading: false,
          idMembership: res.data.result.idMembership,
          takePhoto: res.data.result.take_photo,
        });
      }
    });
  }

  render() {
    const { infoUser, detailDataExam } = this.state;
    const { state } = this.props.location;
    // console.log(detailDataExam, this.state, state, '??')
    try {
      return (
        <div className="pcoded-main-container">
          <div className="pcoded-wrapper">
            <div className="pcoded-content">
              <div className="pcoded-inner-content">
                <div className="main-body">
                  <div className="page-wrapper">
                    {/* <div className="floating-back">
                        <Link to={'/'}>
                        <img src={`newasset/back-button.svg`} alt="" width={90} ></img>
                      </Link>
                    </div> */}
                    <div className="row">
                      <div className="col-xl-12">
                        <div>
                          <LoadingOverlay
                            active={this.state.isLoading}
                            spinner={<BeatLoader size="30" color="#008ae6" />}
                          >
                            <div className="card p-20 main-tab-container">
                              <div className="row">
                                <div className="col-sm-3 m-b-20">
                                  <table style={{ float: 'left' }}>
                                    <tr>
                                      <td>Name</td>
                                      <td>:</td>
                                      <td>{infoUser.name}</td>
                                    </tr>
                                    <tr>
                                      <td>Company</td>
                                      <td>:</td>
                                      <td>{infoUser.training_company_name}</td>
                                    </tr>
                                    <tr>
                                      <td>Email</td>
                                      <td>:</td>
                                      <td>{infoUser.email}</td>
                                    </tr>
                                    <tr>
                                      <td>Identity</td>
                                      <td>:</td>
                                      <td>{infoUser.identity}</td>
                                    </tr>
                                    <tr>
                                      <td>License Number</td>
                                      <td>:</td>
                                      <td>{infoUser.license_number}</td>
                                    </tr>
                                  </table>
                                </div>
                                <div className="col-sm-3 m-b-20">
                                  <div className="buttonExamOrange fontWhite m-b-10 m-t-25" style={{lineHeight: '18px'}}>{this.state.detailDataExam.exam === 1 ? 'Exam' : 'Quiz'}</div>
                                  <div className="liUserTabFont">{detailDataExam.title}</div>
                                  <div>
                                    <p className="card-text fontDefault">
                                      {' '}
                                      <img alt="exam-clock" src={`newasset/clock.png`} style={{ marginTop: -3 }} />{' '}
                                      {detailDataExam.time_limit ? parseInt(detailDataExam.time_limit) : '-'} Minutes
                                    </p>
                                  </div>
                                </div>
                                <div className="col-sm-3 m-b-20">
                                  {/* hide karena exam dapat di mix multiple dan short answer 
                                  <div class="col-sm m-t-25">
                                    <h5 className={`card-title}`} style={{ cursor: 'pointer' }} onClick={() => this.setState({ modalActive: true })}>{'Multiple Choice'}</h5>
                                  </div> */}
                                  <div className="d-flex">
                                    <div class="col-sm m-t-25">
                                      <span className="fontDefaultGrey">
                                        Start Time
                                        <br />
                                      </span>
                                      {detailDataExam.submission_start ? (
                                        <>
                                          <span className="fontDefaulBold">
                                            {moment(detailDataExam.submission_start).local().format('HH:mm')} <br />
                                          </span>
                                          <span className="fontDefaulBold">
                                            {moment(detailDataExam.submission_start).local().format('DD/MM/YYYY')}
                                          </span>
                                        </>
                                      ) : (
                                        '--:--'
                                      )}
                                    </div>
                                    <div class="col-sm m-t-25">
                                      <span className="fontDefaultGrey">
                                        End Time
                                        <br />
                                      </span>
                                      {detailDataExam.submission_end ? (
                                        <>
                                          <span className="fontDefaulBold">
                                            {moment(detailDataExam.submission_end).local().format('HH:mm')} <br />
                                          </span>
                                          <span className="fontDefaulBold">
                                            {moment(detailDataExam.submission_end).local().format('DD/MM/YYYY')}
                                          </span>
                                        </>
                                      ) : (
                                        '--:--'
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-3 m-b-20">
                                  <div
                                    className="detailResultScoreHeader"
                                    style={{ width: 100, background: '#CF4D4E', color: 'white' }}
                                  >
                                    Score
                                  </div>
                                  <div
                                    className="detailResultScoreBody"
                                    style={{ width: 100, background: '#FC7373', color: 'white' }}
                                  >
                                    {this.state.finalScore}
                                  </div>
                                  <div
                                    className="detailResultMinBody"
                                    style={{ width: 100, background: '#FC7373', color: 'white' }}
                                  >
                                    Min. Score {detailDataExam.minimum_score}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {!this.state.isLoading && (
                              <div className="card p-20 main-tab-container" style={{ background: '#fff' }}>
                                <div className="row">
                                  <div className="col-sm-2 m-b-20">
                                    <div style={{ width: '50%', margin: '0 auto' }}>
                                      <div
                                        className={`cursorPointer divLeftListExam ${
                                          this.state.selectedNumber === 0 ? '' : 'backgroundIconPagination'
                                        }`}
                                        onClick={this.pagination.bind(this, 'prev')}
                                      >
                                        <i className="fa fa-caret-up" style={{ color: 'white' }} />
                                      </div>
                                      {this.state.detailDataExam
                                        ? detailDataExam.question.map((exam, index) => {
                                            return (
                                              <div
                                                onClick={this.backToScrollView.bind(this, index)}
                                                className={`cursorPointer divBox ${
                                                  index === this.state.selectedNumber ? 'examDefault' : 'examWhite'
                                                } ${index === this.state.selectedNumber ? 'divActiveSelected' : ''}`}
                                              >
                                                {index + 1}
                                              </div>
                                            );
                                          })
                                        : null}
                                      <div
                                        className={`cursorPointer divLeftListExam ${
                                          this.state.selectedNumber === this.state.detailDataExam.question.length - 1
                                            ? ''
                                            : 'backgroundIconPagination'
                                        }`}
                                        onClick={this.pagination.bind(this, 'next')}
                                        style={{ visibility: this.state.showPrint }}
                                      >
                                        <i className="fa fa-caret-down" style={{ color: 'white' }} />
                                      </div>
                                    </div>
                                  </div>

                                  <div className="col-sm-8 m-b-20 divQuestionBox">
                                    <div className="fontTitleAnswer"> {this.state.currentResult.examTitle}</div>
                                    <div className="row backgroundDefault">
                                      <div className="col-sm-3 fontTitleAnswer"></div>
                                      <div className="col-sm-5 fontTitleAnswer" style={{ fontSize: 12, padding: 0 }}>
                                        {' '}
                                        <img
                                          src="/assets/new_ui/archive.svg"
                                          alt="img"
                                          style={{ marginRight: 5 }}
                                        />{' '}
                                        <span>{this.state.correctAnswer}</span> / {this.state.totalQuestion} Question
                                      </div>
                                      <div className="col-sm-4 fontTitleAnswer" style={{ fontSize: 12, padding: 0 }}>
                                        {' '}
                                        <img src="/assets/new_ui/jam-weker.svg" alt="img" style={{ marginRight: 5 }} />
                                        {detailDataExam.submission_end ? (
                                          <>
                                            <span className="fontAnswerGreen"></span>
                                            <span style={{ color: 'red' }}>
                                              {moment(new Date()).local().format('HH:mm:ss')}
                                            </span>{' '}
                                            / {moment(detailDataExam.submission_end).local().format('HH:mm:ss')}
                                          </>
                                        ) : (
                                          <>
                                            <span className="fontAnswerGreen"></span>--:--:-- / --:--:--
                                          </>
                                        )}
                                      </div>
                                    </div>

                                    {detailDataExam.question.map((dataexam, index) => {
                                      return (
                                        <div
                                          className="divAnswerOption row"
                                          id={index + 'divAnswerOption'}
                                          style={{ background: '#FFF', width: '85%' }}
                                        >
                                          {!dataexam.open ? (
                                            <div
                                              className="col-sm-12 fontTitleAnswer"
                                              style={{ borderRadius: 10, height: 'inherit' }}
                                            >
                                              Question
                                            </div>
                                          ) : null}

                                          {!dataexam.open ? (
                                            <div
                                              className="col-sm-1 divAnswerNumber backgroundOption"
                                              style={{ borderRadius: 10, height: 'inherit' }}
                                            >
                                              {index + 1}
                                            </div>
                                          ) : (
                                            <div
                                              className="col-sm-1 divAnswerNumber backgroundOption"
                                              style={{ borderRadius: 10, height: '56px', marginTop: '42px' }}
                                            >
                                              {index + 1}
                                            </div>
                                          )}
                                          <div
                                            className="col-sm-10"
                                            style={{ padding: 0, borderRadius: 10, background: '#FFF' }}
                                          >
                                            {!dataexam.open && (
                                              <div>
                                                <div className={'divAnswerDefault m-l-10'}>
                                                  <div
                                                    className="p-15 divAnswerOption"
                                                    style={{ width: '100%', marginBottom: 0 }}
                                                    dangerouslySetInnerHTML={{ __html: dataexam.question }}
                                                  ></div>
                                                </div>
                                              </div>
                                            )}

                                            {dataexam.open && (
                                              <div className="col-sm-10" style={{ background: '#FFF' }}>
                                                <div
                                                  id={index + 'divAnswerOption'}
                                                  className="divQuestionBox"
                                                  style={{ background: '#FFF', width: '126%', marginLeft: '-3%' }}
                                                >
                                                  <div className="fontTitleAnswer">Question</div>
                                                  <div className="divAnswerOption row">
                                                    <div
                                                      className="col-sm-11"
                                                      style={{ padding: 20, borderRadius: 10 }}
                                                    >
                                                      <div
                                                        dangerouslySetInnerHTML={{ __html: dataexam.question }}
                                                      ></div>
                                                    </div>
                                                  </div>
                                                  <div className="fontTitleAnswer">Answer</div>
                                                  {dataexam.option.map((option, i) => {
                                                    let className = 'divAnswerDefault pointer';
                                                    let divBox = 'divBox examDefault pointer';
                                                    if (option.option_label === dataexam.userAnswer) {
                                                      className = 'divAnswerBlue pointer';
                                                      divBox = 'divBox examBlue pointer';
                                                    }

                                                    return (
                                                      <div className="divAnswerOption row">
                                                        <div
                                                          className="col-sm-12"
                                                          style={{ padding: 0, borderRadius: 10 }}
                                                        >
                                                          {dataexam.short_answer ? (
                                                            <>
                                                              <div className={className}>
                                                                <div className={divBox} style={{ marginBottom: 0 }}>
                                                                  {' '}
                                                                  {option.option_label}{' '}
                                                                </div>
                                                                <div
                                                                  class="input-group"
                                                                  style={{
                                                                    width: '90%',
                                                                    height: '90%',
                                                                    marginLeft: 10,
                                                                  }}
                                                                >
                                                                  <textarea
                                                                    class="form-control"
                                                                    style={{ border: 'none', paddingRight: 0 }}
                                                                    aria-label="With textarea"
                                                                    value={option.option_text}
                                                                    onClick={() => {
                                                                      let a = this.state.detailDataExam;
                                                                      a.question[index].userAnswer =
                                                                        option.option_label;
                                                                      this.setState({ detailDataExam: a });
                                                                    }}
                                                                    onChange={(e) => {
                                                                      this.setOptionShortAnswer(
                                                                        e,
                                                                        index,
                                                                        i,
                                                                        option,
                                                                        detailDataExam,
                                                                        dataexam.short_answer,
                                                                      );
                                                                    }}
                                                                  ></textarea>
                                                                </div>
                                                              </div>
                                                            </>
                                                          ) : (
                                                            <div
                                                              className={className}
                                                              onClick={() => {
                                                                this.selectedAnswer(
                                                                  index,
                                                                  option,
                                                                  detailDataExam,
                                                                  dataexam.short_answer,
                                                                );
                                                              }}
                                                            >
                                                              <div className={divBox} style={{ marginBottom: 0 }}>
                                                                {' '}
                                                                {option.option_label}{' '}
                                                              </div>
                                                              <div className="p-15" style={{ width: '100%' }}>
                                                                <div
                                                                  dangerouslySetInnerHTML={{
                                                                    __html: option.option_text,
                                                                  }}
                                                                ></div>
                                                              </div>
                                                            </div>
                                                          )}
                                                        </div>
                                                      </div>
                                                    );
                                                  })}
                                                </div>
                                              </div>
                                            )}
                                          </div>

                                          <div
                                            className="col-sm-1"
                                            style={{ height: 'inherit', background: '#FFFFFF' }}
                                          >
                                            {dataexam.open ? (
                                              <div
                                                className="iconDetailAnswer cursorPointer"
                                                style={{ marginTop: '43px' }}
                                                onClick={() => {
                                                  let a = detailDataExam.question;
                                                  if (a[index].open) {
                                                    a[index].open = false;
                                                  } else {
                                                    a[index].open = true;
                                                  }
                                                  this.setState({
                                                    detailDataExam: { ...detailDataExam, question: a },
                                                    detailOpen: true,
                                                    selectedNumber: index,
                                                    selectedViewDetail: index,
                                                  });
                                                }}
                                              >
                                                <i className={'fa fa-caret-up'} />
                                              </div>
                                            ) : (
                                              <div
                                                className="iconDetailAnswer cursorPointer"
                                                onClick={() => {
                                                  let a = detailDataExam.question;
                                                  if (a[index].open) {
                                                    a[index].open = false;
                                                  } else {
                                                    a[index].open = true;
                                                  }
                                                  this.setState({
                                                    detailDataExam: { ...detailDataExam, question: a },
                                                    detailOpen: true,
                                                    selectedNumber: index,
                                                    selectedViewDetail: index,
                                                  });
                                                }}
                                              >
                                                <i className={'fa fa-caret-down'} />
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>

                                  <div className="col-sm-2 m-b-20 positionFixed">
                                    {/* <div> */}
                                    <center>
                                      If you have finished working, please click submit to send your answers <br />
                                      {detailDataExam.submission_end ? (
                                        <b style={{ visibility: 'hidden' }}>
                                          Time Left: {this.state.time.h}:{this.state.time.m}:{this.state.time.s}
                                        </b>
                                      ) : null}{' '}
                                      <br />
                                      <button
                                        className="buttonSubmitBlue fontWhite"
                                        onClick={this.submitFormExam.bind(this)}
                                        disabled={this.state.disableSubmit}
                                      >
                                        Submit
                                      </button>
                                    </center>
                                    {/* </div> */}
                                  </div>
                                </div>
                              </div>
                            )}
                          </LoadingOverlay>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Modal show={this.state.updateMembership} onHide={this.closeModalMembership} centered>
            <Modal.Header>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="imageFormExamPreview" style={{ width: 500 }}>
                <center>
                  <div className="fontDefaulBold" for="image">
                    Member's Photo
                  </div>
                  <br />
                  <label style={{ cursor: 'pointer', borderRadius: '10px', overflow: 'hidden' }}>
                    <a href={this.state.imagePreview} target="_blank">
                      <img src={this.state.imagePreview} height="54.8px" />
                    </a>
                  </label>
                  <label
                    for="image"
                    style={{
                      cursor: 'pointer',
                      overflow: 'hidden',
                      display: this.state.disabledForm ? 'none' : 'block',
                    }}
                  >
                    <div className="button-bordered-grey" style={{ width: '30%' }}>
                      {this.state.image ? this.state.image.name : 'Choose file'}
                    </div>
                  </label>
                </center>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  id="image"
                  style={{display: 'none'}}
                  onChange={this.handleChange}
                  disabled={this.state.disabledForm}
                />
              </div>
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: 'center' }}>
              {/* <button className="btn btn-icademy-primary width200" onClick={() => {
                      window.location.href = `/training/userhistory/${this.state.userId}/${this.state.idHistoryAssignee}`;
                    }}>
                      Next
                    </button> */}
              <button
                disabled={this.state.isSaving}
                onClick={this.save}
                className="btn btn-icademy-primary float-right"
                style={{ padding: '7px 8px !important' }}
              >
                <i className="fa fa-save"></i>
                {this.state.isSaving ? 'Saving...' : 'Save'}
              </button>
            </Modal.Footer>
          </Modal>

          <Modal show={this.state.modalActivate} onHide={this.closeModalActivate} centered>
            <Modal.Header>
              <Modal.Title className="text-c-purple3 f-w-bold" style={{ color: '#00478C' }}></Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="fontDefaulBold" style={{ fontSize: 20, textAlign: 'center' }}>
                {' '}
                <img className="m-b-25" src={`newasset/green-checklist.png`} alt="" width={90} /> <br />
                {this.state.msgSuccesSubmit}
              </div>
            </Modal.Body>
            <Modal.Footer style={{ justifyContent: 'center' }}>
              <button
                className="btn btn-icademy-primary width200"
                onClick={() => {
                  window.location.href = `/training/userhistory/${this.state.userId}/${this.state.idHistoryAssignee}`;
                }}
              >
                Next
              </button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    } catch (e) {
      console.log(e);
    }
  }
}

const TrainingUserHistoryExam_view = (props) => (
  <SocketContext.Consumer>{(socket) => <TrainingUserHistoryExam {...props} socket={socket} />}</SocketContext.Consumer>
);
export default TrainingUserHistoryExam_view;
