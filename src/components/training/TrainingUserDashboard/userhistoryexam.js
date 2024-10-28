import React, { Component } from 'react';
import LoadingOverlay from 'react-loading-overlay';
import BeatLoader from 'react-spinners/BeatLoader';
import API, { API_SERVER, USER_ME,APPS_SERVER } from '../../../repository/api';
import { toast } from 'react-toastify';
import Storage from '../../../repository/storage';
import moment from 'moment-timezone';
import "./traininguserdashboard.css"
import { Link } from 'react-router-dom';

class TrainingUserHistoryExam extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showPrint: true,
      index: -1,
      prevResult: false,
      nextResult: false,
      infoUser: {},
      viewAnswer: 0,
      detailInfo:null,
      userId: this.props.match.params.idTrainingUser,
      resultId: this.props.match.params.resultId,
      id: '',
      currentResult: {
        assigneeId: 0,
        resultId: 0,
        startTime: "00:00:00",
        submissionTime: "00:00:00",
        availableResult: true,
        courseId: 0,
        courseTitle: "",
        duration: "",
        examTitle: "",
        minScore: 0,
        score: 0,
        timeLimit: 0,
        type: null,
      },
      correctAnswer: 0,
      totalQuestion: 0,
      progress: 0,
      companyId: '',
      data: [],
      unassigned: [],
      filter: '',
      modalDelete: false,
      deleteId: '',
      modalActivate: false,
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
      detailDataExam: [],
      selectedNumber: 0,
      selectedViewDetail: 0,
    };

  }

  toHHMMSS(arg) {
    var sec_num = parseInt(arg, 10); // don't forget the second param
    var hours = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours; }
    if (minutes < 10) { minutes = "0" + minutes; }
    if (seconds < 10) { seconds = "0" + seconds; }
    return hours + ':' + minutes + ':' + seconds;
  }

  changeResult(type, index) {
    let list = this.state.listResult
    if (type === 'prevResult') {
      index--;
    } else {
      index++;
    }
    if (index > -1 && list[index]) {
      if (type === 'prevResult') {
        this.setState({ prevResult: list[index].resultId })
      } else {
        this.setState({ nextResult: list[index].resultId })
      }
    } else {
      if (type === 'prevResult') {
        this.setState({ prevResult: false })
      } else {
        this.setState({ nextResult: false })
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

        API.get(`${API_SERVER}v2/training/plan-user-result/${this.state.userId}/${this.state.resultId}`)
          .then((res) => {
            if (res.data.error) {
              toast.error('Data not found');
              this.setState({ isLoading: false });
            } else {

              let result = res.data.result;
              let list = result.list.map(detail => {
                if(detail.type === 2){
                  const regExp = /\..../g;
                  let countMatchDot  = detail.question.match(regExp);

                  for(let i=65;i<65+countMatchDot.length;i++){
                      detail.question = detail.question.replace( '....', `<b style='color:red;'>(${String.fromCharCode(i)})____</b>`);
                  }
                }

                return {...detail, open:false};
              });
              //console.log(result.detailInfo.see_correct_answer,"9999")
              this.setState({ detailInfo: result.detailInfo,viewAnswer:result.detailInfo.see_correct_answer,detailDataExam: list, isLoading: false, correctAnswer: result.correct_answer, totalQuestion: result.total_question });
            }
            return;
          });
      }
    });
  }

  getUserDetail(id) {
    API.get(`${API_SERVER}v2/training/user/read/${id}`).then((res) => {
      if (res.data.error) {
        toast.error('Error read user');
      } else {
        this.setState({ infoUser: res.data.result });
      }
    });
  }

  componentDidMount() {
    this.getUserDetail(this.props.match.params.idTrainingUser);
    this.getUserData();
  }


  pagination(conditional, e) {
    e.preventDefault();
    const prevNum = this.state.selectedNumber - 1;
    const nextNum = this.state.selectedNumber + 1;

    if (conditional === 'prev') {
      if (this.state.selectedNumber === 0) return;
      this.setState({ selectedNumber: prevNum })
      document.getElementById(prevNum + 'divAnswerOption').scrollIntoView({ behavior: 'smooth' });
    }

    if (conditional === 'next') {
      if (this.state.selectedNumber === this.state.detailDataExam.length - 1) return;
      this.setState({ selectedNumber: nextNum })
      document.getElementById(nextNum + 'divAnswerOption').scrollIntoView({ behavior: 'smooth' });
    }

  }

  backToScrollView(id, e) {
    e.preventDefault();
    this.setState({ selectedNumber: id })
    document.getElementById(id + 'divAnswerOption').scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    const { infoUser } = this.state;
    try {

      return (
        <div className="pcoded-main-container">
          <div className="pcoded-wrapper">
            <div className="pcoded-content">
              <div className="pcoded-inner-content">
                <div className="main-body">
                  <div className="page-wrapper">
                    <div className="floating-back">
                      <Link to={'/'}>
                        <img src={`newasset/back-button.svg`} alt="" width={90} ></img>
                      </Link>
                    </div>
                    <div className="row">
                      <div className="col-xl-12">
                        <div>
                          <LoadingOverlay
                            active={this.state.isLoading}
                            spinner={<BeatLoader size="30" color="#008ae6" />}
                          >
                            <div className="card p-20 main-tab-container" >
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
                                  <div className="buttonExamOrange fontWhite m-b-10 m-t-25" style={{lineHeight: '18px'}}>{this.state.detailInfo && this.state.detailInfo.exam === 1 ? 'Exam' : 'Quiz'}</div>
                                  <div className='liUserTabFont'>{this.state.detailInfo ? this.state.detailInfo.title : ''}</div>
                                  <div><p className="card-text fontDefault"> <img alt="exam-clock" src={`newasset/clock.png`} style={{ marginTop: -3 }} /> {this.state.detailInfo ? parseInt(this.state.detailInfo.time_limit) : '-'} Minutes</p></div>
                                </div>
                                <div className="col-sm-3 m-b-20">
                                  <div className='d-flex'>
                                    <div class="col-sm m-t-25">
                                      <span className="fontDefaultGrey">Start Time<br /></span>
                                      {
                                        this.state.detailInfo ? 
                                        <>
                                          <span className="fontDefaulBold">{moment(this.state.detailInfo.start_time).local().format("HH:mm")} <br /></span>
                                          <span className="fontDefaulBold">{moment(this.state.detailInfo.start_time).local().format("DD/MM/YYYY")}</span>
                                        </>
                                        :
                                        <>
                                          <span className="fontDefaulBold">--:--</span>
                                        </>
                                      }
                                    </div>
                                    <div class="col-sm m-t-25">
                                      <span className="fontDefaultGrey">End Time<br /></span>
                                      {
                                        this.state.detailInfo ? 
                                        <>
                                          <span className="fontDefaulBold">{moment(this.state.detailInfo.end_time).local().format("HH:mm")} <br /></span>
                                          <span className="fontDefaulBold">{moment(this.state.detailInfo.end_time).local().format("DD/MM/YYYY")}</span>
                                        </>
                                        :
                                        <>
                                          <span className="fontDefaulBold">--:--</span>
                                        </>
                                      }
                                    </div>
                                  </div>
                                </div>
                                <div className="col-sm-3 m-b-20" >
                                  <div className="detailResultScoreHeader" style={{ width: 100, background: this.state.detailInfo ? this.state.detailInfo.pass ? '' : '#CF4D4E' : '', color: this.state.detailInfo ? this.state.detailInfo.pass ? '' : 'white':'' }}>Score</div>
                                  <div className="detailResultScoreBody" style={{ width: 100, background: this.state.detailInfo ? this.state.detailInfo.pass ? '' : '#FC7373':'', color: this.state.detailInfo ? this.state.detailInfo.pass ? '' : 'white' :''}}>{this.state.detailInfo ? this.state.detailInfo.score : '-'}</div>
                                  <div className="detailResultMinBody" style={{ width: 100, background: this.state.detailInfo ? this.state.detailInfo.pass ? '' : '#FC7373' : '', color: this.state.detailInfo ? this.state.detailInfo.pass ? '' : 'white' : '' }}>Min. Score {this.state.detailInfo ? this.state.detailInfo.minimum_score : '-'}</div>
                                </div>
                              </div>
                            </div>
                            {
                              (this.state.viewAnswer > 0) && (
                                <div className="card p-20 main-tab-container" style={{ background: "#fff" }}>
                                  <div className="row">
                                    <div className="col-sm-2 m-b-20">
                                      <div style={{ width: '50%', margin: '0 auto' }}>
                                        <div className={`cursorPointer divLeftListExam ${this.state.selectedNumber === 0 ? '' : 'backgroundIconPagination'}`} onClick={this.pagination.bind(this, 'prev')} >
                                          <i className="fa fa-caret-up" style={{ color: 'white' }} />
                                        </div>
                                        {this.state.detailDataExam ?
                                          this.state.detailDataExam.map((exam, index) => {
                                            return (
                                              <div onClick={this.backToScrollView.bind(this, index)} className={`cursorPointer divBox ${exam.pass ? '' : 'examRed'} ${index === this.state.selectedNumber ? 'divActiveSelected' : ''}`} >{index + 1}</div>
                                            )
                                          })
                                          : null}
                                        <div className={`cursorPointer divLeftListExam ${this.state.selectedNumber === this.state.detailDataExam.length - 1 ? '' : 'backgroundIconPagination'}`} onClick={this.pagination.bind(this, 'next')} style={{ visibility: this.state.showPrint }}>
                                          <i className="fa fa-caret-down" style={{ color: 'white' }} />
                                        </div>
                                      </div>
                                    </div>

                                    <div className="col-sm-10 m-b-20 divQuestionBox">
                                      <div className='fontTitleAnswer' style={{marginLeft:"-30px"}}> {this.state.detailInfo ? this.state.detailInfo.title : ''}</div>
                                      <div className="row backgroundDefault">
                                        <div className="col-sm-3 fontTitleAnswer" style={{ fontSize: 12, padding: 0}}></div>
                                        <div className="col-sm-3 fontTitleAnswer" style={{ fontSize: 12, padding: 0}}>
                                          {' '}
                                          <img src="/assets/new_ui/archive.svg" alt="img" style={{ marginRight: 5 }} /> <span className="fontAnswerGreen">{this.state.correctAnswer} Correct Answer</span> / {this.state.totalQuestion} Question
                                        </div>
                                        <div className="col-sm-4 fontTitleAnswer" style={{ fontSize: 12, padding: 0 }}>
                                          {' '}
                                          <img src="/assets/new_ui/jam-weker.svg" alt="img" style={{ marginRight: 5 }} />
                                          <span className="fontAnswerGreen"></span>
                                            {
                                              this.state.detailInfo ?
                                              `${moment(this.state.detailInfo.work_start_time).local().format("HH:mm:ss")} / ${moment(this.state.detailInfo.submission_time).local().format("HH:mm:ss")}`
                                              : '--:--:-- / --:--:--'
                                            }
                                        </div>
                                      </div>

                                      {this.state.detailDataExam.map((dataexam, index) => {
                                        return (
                                          
                                          <>
                                            <div style={{paddingBottom:30}}>
                                            <div className={"fontTitleAnswer"} style={{marginLeft:"-30px"}}>Question</div>
                    
                                            <div className='row' id={index + 'divAnswerOption'} style={{marginBottom:"0px",marginRight: "0px !important", borderRadius: 10,background: "#FFF", width: "85%" }} >
                                              
                                                <div className='col-sm-10' style={{ padding: 0, borderRadius: 10, background: "#FFF" }}>
                                                  <div className="row">
                                                    <div className="col-sm-1 divAnswerNumber backgroundOption" style={{ borderRadius: 10, height: 'inherit' }}>
                                                      {index + 1}
                                                    </div>
                                                    <div className="col-sm-10" style={{background: "rgba(199, 223, 255, 0.5)",marginLeft:"10px",marginBottom:"0px !important", padding: 20, borderRadius: 10 }}>
                                                      <div dangerouslySetInnerHTML={{ __html: dataexam.question }}></div>
                                                    </div>
                                                  </div>
                                                </div>
                                                

                                              <div className="col-sm-1" style={{ height: 'inherit', background: '#FFFFFF' }}>
                                                {
                                                  dataexam.open ?
                                                    <div className="iconDetailAnswer cursorPointer" style={{}} onClick={() => { let a = this.state.detailDataExam; if (a[index].open) { a[index].open = false; } else { a[index].open = true; } this.setState({ detailDataExam: a, detailOpen: true, selectedNumber: index, selectedViewDetail: index }) }}>
                                                      <i className={"fa fa-caret-up"} />
                                                    </div> :
                                                    <div className="iconDetailAnswer cursorPointer" onClick={() => { let a = this.state.detailDataExam; if (a[index].open) { a[index].open = false; } else { a[index].open = true; } this.setState({ detailDataExam: a, detailOpen: true, selectedNumber: index, selectedViewDetail: index }) }}>
                                                      <i className={"fa fa-caret-down"} />
                                                    </div>
                                                }
                                              </div>

                                            </div>

                                            {
                                              dataexam.open &&
                                              (
                                              <>
                                                <div className={"fontTitleAnswer"} style={{marginLeft:"-30px", paddingBottom:5,paddingTop:5}}>Answer</div>
                                                {
                                                  dataexam.type === 2 ?
                                                  dataexam.displayedOptionDetail.map(option => {
                                                    let className = null;
                                                    let icons = null;
                                                    let divBox = "divBox ";
                                                    if (option.type === 'clear') {
                                                      className = "divAnswerGreen";
                                                      divBox += "examGreen"
                                                      icons = "fa fa-check-circle iconGreenChecklist";
                                                    } else if (option.type === 'wrong') {
                                                      className = "divAnswerRed";
                                                      divBox += "examRed"
                                                      icons = "fa fa-times-circle iconRedChecklist";
                                                    } else {
                                                      divBox += "examDefault";
                                                      className = "divAnswerDefault";
                                                    }
                                                    return (
                                                      <div className='row' style={{marginLeft:"-30px", borderRadius: "10px",marginBottom: "20px", marginRight:"0px !important", maxWidth:"68%"}}>
                                                        <div className="col-sm-12" style={{ padding: 0, borderRadius: 10, }}>
                                                          <div className={option.option_label === dataexam.answer.keyAnswer.option_label ? "divAnswerGreen" : className}>
                                                            <div className={option.option_label === dataexam.answer.keyAnswer.option_label ? "divBox examGreen" : divBox} style={{ marginBottom: 0 }}> {option.option_label} </div>
                                                            <div className='p-15' style={{ width: '100%' }}>
                                                              <div dangerouslySetInnerHTML={{ __html: option.option_text }}></div> 
                                                              {(option.option_label === dataexam.answer.keyAnswer.option_label) ? <i className={'fa fa-check-circle iconGreenChecklist'} /> : icons && <i className={icons} />}</div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    )
                                                  }) 
                                                  :
                                                  dataexam.option.map(option => {
                                                    let className = null;
                                                    let icons = null;
                                                    let divBox = "divBox ";
                                                    if (option.type === 'clear') {
                                                      className = "divAnswerGreen";
                                                      divBox += "examGreen"
                                                      icons = "fa fa-check-circle iconGreenChecklist";
                                                    } else if (option.type === 'wrong') {
                                                      className = "divAnswerRed";
                                                      divBox += "examRed"
                                                      icons = "fa fa-times-circle iconRedChecklist";
                                                    } else {
                                                      divBox += "examDefault";
                                                      className = "divAnswerDefault";
                                                    }
                                                    return (
                                                      <div className='row' style={{marginLeft:"-30px", borderRadius: "10px",marginBottom: "20px", marginRight:"0px !important", maxWidth:"68%"}}>
                                                        <div className="col-sm-12" style={{ padding: 0, borderRadius: 10, }}>
                                                          <div className={option.option_label === dataexam.answer.keyAnswer.option_label ? "divAnswerGreen" : className}>
                                                            {/* ubah pakai Inject innerHtml */}
                                                            <div className={option.option_label === dataexam.answer.keyAnswer.option_label ? "divBox examGreen" : divBox} style={{ marginBottom: 0 }}> {option.option_label} </div>
                                                            <div className='p-15' style={{ width: '100%' }}>
                                                              <div dangerouslySetInnerHTML={{ __html: option.option_text }}></div> 
                                                              {(option.option_label === dataexam.answer.keyAnswer.option_label) ? <i className={'fa fa-check-circle iconGreenChecklist'} /> : icons && <i className={icons} />}</div>
                                                          </div>
                                                        </div>
                                                      </div>
                                                    )
                                                  })
                                                }
                                              </>
                                              )
                                            }
                                            </div>
                                          </>
                                        )

                                      })}
                                    </div>
                                  </div>
                                </div>
                              )
                            }
                          </LoadingOverlay>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <table className='table table-hover' id="tableResult" hidden={this.state.showPrint} style={{ color: "#0E0" }}>
                  <thead>
                    <tr>
                      <th style={{ width: "15px" }}>No</th>
                      <th style={{ width: "30%" }}>Question</th>
                      <th style={{ width: "20px" }}>Correct Answer</th>
                      <th style={{ width: "20px" }}>User Answer</th>
                      <th style={{ width: "20px" }}>Pass</th>
                      <th style={{ width: "10%" }}>Option A</th>
                      <th style={{ width: "10%" }}>Option B</th>
                      <th style={{ width: "10%" }}>Option C</th>
                      <th style={{ width: "10%" }}>Option D</th>
                      <th style={{ width: "10%" }}>Option E</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      //console.log(this.state.detailDataExam,"???")
                    }
                    {

                      this.state.detailDataExam.length &&
                      this.state.detailDataExam.map((str, i) => {
                        return (
                          <tr>
                            <td>{i + 1}</td>
                            <td><div dangerouslySetInnerHTML={{ __html: str.question }}></div></td>
                            <td>
                              {
                                str.type === 2 ?
                                  str.answer.keyAnswer.map((x, i) => (i + 1 + '. ' + x.option_text + ' '))
                                  :
                                  str.answer.keyAnswer.option_label
                              }
                            </td>
                            <td>
                              {
                                str.type === 2 ?
                                  str.answer.yourAnswer.map((x, i) => (i + 1 + '. ' + x.option_text + ' '))
                                  :
                                  str.answer.yourAnswer.option_label
                              }
                            </td>
                            <td>{str.pass ? 'PASS' : 'WRONG'}</td>
                            {
                              str.type === 2 ?
                                null
                                :
                                str.option.map((str2) => {
                                  return (
                                    <td>{str2.option_text}</td>
                                  )
                                })
                            }
                          </tr>
                        )
                      })

                    }
                  </tbody>
                </table>

              </div>
            </div>
          </div >
        </div >
      );
    } catch (e) {
      //console.log(e)
    }
  }
}

export default TrainingUserHistoryExam;
