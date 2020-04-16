import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Accordion, Card, Button, Row } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';

export default class QuestionExam extends Component {

  state = {
    companyId: '',
    courseId: this.props.match.params.exam_id.split('.')[1],
    examId: this.props.match.params.exam_id.split('.')[0],
    isLoading:true,

    question: [],
    questionChecked:[],
    cekAll : false,

    isModalDelete: false,
    questionId: '',
  }

  handleOpenDelete = e => {
    e.preventDefault();
    let quizId = e.target.getAttribute('data-id');
    this.setState({ isModalDelete: true, questionId: quizId });
  }

  onClickDelete = e => {
    e.preventDefault();
    API.delete(`${API_SERVER}v1/question/${this.state.questionId}`).then(res => {
      if(res.status === 200) {
        this.handleClose();
        this.fetchData();
      }
    })
  }
  
	bulkDelete = e => {
		e.preventDefault();
		API.delete(`${API_SERVER}v1/question/bulk/${this.state.questionChecked.join()}`).then(res => {
			if(res.status === 200) {
        this.fetchData();
        console.log('RESSS',res)
			}
		})
	}

  handleClose = e => {
    this.setState({ isModalDelete: false, questionId: '' });
  }

  fetchData() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200) {
        this.setState({ companyId: res.data.result.company_id });

        API.get(`${API_SERVER}v1/question/exam/${this.state.examId}`).then(res => {
          if(res.status === 200) {
            for(let a in res.data.result){
              res.data.result[a].check = false;
            }
            this.setState({ question: res.data.result, isLoading:false })
          }
        })
      }
    })
  }

  componentDidMount() {
    this.fetchData()
  }

  onChangeCheckbox(e) {
    //console.log(document.getElementById("ceked").checked,'cek semuaa');
    let value = document.getElementById("ceked").checked;
    
    for(let a in this.state.question){
      //return console.log(this.state.question[a])
      if (value){
        this.state.question[a].check = true;
        this.setState({question: this.state.question});
        var index = this.state.questionChecked.indexOf(this.state.question[a].question_id);
        if (index !== -1) this.state.questionChecked.splice(index, 1);
        this.state.questionChecked.push(this.state.question[a].question_id);
      } else {
        this.state.question[a].check = false;
        this.setState({question: this.state.question});
        var index = this.state.questionChecked.indexOf(this.state.question[a].question_id);
        if (index !== -1) this.state.questionChecked.splice(index, 1);
      }
    }
  }

  handleChecked = e => {
    const checkboxId = Number(e.target.id);
    let value = document.getElementById(checkboxId).checked;
    console.log(value);

    for(let a in this.state.question){
      //console.log(this.state.question[a].question_id, checkboxId);
      if(value) {
        if(this.state.question[a].question_id === checkboxId){
          this.state.question[a].check = true;
          this.state.questionChecked.push(this.state.question[a].question_id);
        }
      }else{
        if(this.state.question[a].question_id === checkboxId){
          this.state.question[a].check = false;
          var index = this.state.questionChecked.indexOf(this.state.question[a].question_id);
          if (index !== -1) this.state.questionChecked.splice(index, 1);
        }
      }
    }
    this.setState({
      question: this.state.question
    });
    //console.log(this.state.question);
  };

  onChangeDelete(){
    let questionDuplicateCek = [];
    for(let a in this.state.question){
      if(this.state.question[a].check){
        questionDuplicateCek.push({question_id : this.state.question[a].question_id})
      }
    }
    API.delete(`${API_SERVER}v1/question/bulk/`,questionDuplicateCek).then(res => {
      console.log(res, 'hapiuusuus');
      if(res.status === 200) {
        this.fetchData();
      }
    })
  }

  render() {
    const {question} = this.state;

    const QuestionList = ({lists}) => {
      if(lists.length !== 0) {
        return (
          <Accordion>
            {
              lists.map((item, i) => (
                <Card style={{marginBottom: '10px'}} key={item.question_id}>
                  <Accordion.Toggle as={Card.Header} variant="link" eventKey={item.question_id}>
                    <div className="row">
                      <div className="col-sm-1">
                          <label class="container">
                            <input type="checkbox" id={item.question_id} onChange={this.handleChecked} checked={item.check}/>
                            <span class="checkmark"></span>
                          </label>
                      </div>
                      <div className="col-sm-1">
                        <h3 className="f-w-bold f-20 text-c-purple3">{item.number}</h3>
                      </div>
                      <div className="col-sm-9">
                        <p className="f-w-bold f-18 text-c-purple3">{item.question.toString().substring(0, 60)}</p>
                      </div>
                      <div className="col-sm-1">
                        <Link to={`/question-quiz-edit/${item.question_id}`} className="buttonku" title="Edit">
                          <i data-id={item.question_id} className="fa fa-edit"></i>
                        </Link>
                        <Link to="#" className="buttonku" title="Hapus">
                          <i onClick={this.handleOpenDelete} data-id={item.question_id} className="fa fa-trash"></i>
                        </Link>
                      </div>
                    </div>
                  </Accordion.Toggle>
                  <Accordion.Collapse eventKey={item.question_id}>
                    <Card.Body>
                      {
                        item.options.map((item, i) => (
                          <h5 className="f-20 text-c-purple3" key={item.option_id}>
                            {item.exam_option}. {item.description}
                          </h5>
                        ))
                      }
                    </Card.Body>
                  </Accordion.Collapse>
                </Card>
              ))
            }
          </Accordion>
        );
      } else {
        return (
          <ul className="list-cabang">
            <li>
              <div className="card">
                <div className="card-block" style={{ padding: "25px 30px !important" }}>
                  <div className="row d-flex align-items-center">
                    <div className="col-xl-12 col-md-12">
                      <div className="row align-items-center justify-content-center">
                        <div className="col">
                          <small className="f-w-600 f-16 text-c-grey-t ">
                            { this.state.isLoading ? 'Loading...' : 'Tidak ada pertanyaan'}
                          </small>
                          <h5 className="f-w-bold f-20 text-c-purple3">
                            { this.state.isLoading ? 'Sedang memuat data soal...' : 'Silahkan buat pertanyaan Anda'}
                          </h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        );
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
                    <div className="col-xl-12">
                      <h3 className="f-24 f-w-800 mb-3">
                        <Link
                          onClick={e => {
                            e.preventDefault();
                            this.props.history.push(
                              `/exam/${this.state.courseId}`
                            );
                          }}
                          className="btn btn-ideku btn-circle"
                        >
                          <i
                            className="fa fa-chevron-left"
                            style={{ paddingLeft: "8px" }}
                          ></i>
                        </Link>
                        &nbsp;Pertanyaan Ujian
                      </h3>

                    </div>
                    <div className="col-sm-6">
                      <div style={{padding: '10px',margin: '10px 0px 0px 15px'}}>
                        <label class="container"> &nbsp; <small>Pilih Semua</small>
                          <input id="ceked" type="checkbox" onChange={this.onChangeCheckbox.bind(this)} value={false}/>
                          <span class="checkmark"></span>
                        </label>
                      </div>
                    </div>
                    <div className="col-sm-6">
                    
                      <a
                        href={`/question-exam-create/${this.state.examId}.${this.state.courseId}`}
                        className="btn btn-ideku f-14 float-right mb-3"
                        style={{
                          padding: "7px 25px !important",
                          color: "white"
                        }}
                      >
                        <img
                          src="assets/images/component/person_add.png"
                          className="button-img"
                          alt=""
                        />
                        Tambah Baru
                      </a>  
                      <a
                        href='javascript:'
                        onClick={this.bulkDelete}
                        className="btn btn-ideku f-14 float-right mb-3 m-r-5"
                        style={{
                          padding: "7px 25px !important",
                          color: "white"
                        }}
                        onClick={this.onChangeDelete.bind(this)}
                      >
                        Bulk Delete
                      </a>  
                    </div>

                    <div className="col-xl-12">
                      <QuestionList lists={question} />
                    </div>

                    <Modal
                      show={this.state.isModalDelete}
                      onHide={this.handleClose}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title className="text-c-purple3 f-w-bold">
                          Konfirmasi
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p className="f-w-bold">
                          Apakah anda yakin untuk menghapus pertanyaan ini ?
                        </p>

                        <button
                          style={{ marginTop: "30px" }}
                          type="button"
                          onClick={this.onClickDelete}
                          className="btn btn-block btn-ideku f-w-bold"
                        >
                          Hapus
                        </button>
                        <button
                          type="button"
                          className="btn btn-block f-w-bold"
                          onClick={this.handleClose}
                        >
                          Tidak
                        </button>
                      </Modal.Body>
                    </Modal>
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