import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Modal, Form, Card, Button } from "react-bootstrap";
import API, { API_SERVER } from "../../../repository/api";

export default class QuestionQuizCreate extends Component {
  state = {
    companyId: "",
    courseId: this.props.match.params.exam_id.split(".")[1],
    examId: this.props.match.params.exam_id.split(".")[0],

    isQuestionReady: false,

    questionId: "",
    number: "",
    tag: "",
    pertanyaan: "",
    correctOption: "",

    isModalPilihan: false,
    optionId: "",
    pilihan: "",
    jawaban: "",

    pilihans: [],

    isSimpanPertanyaan: false,
    isiSimpanPertanyan: ''
  };

  handleSimpanPertanyaan = e => {
    this.setState({ isSimpanPertanyaan: false, isiSimpanPertanyan: '' });
  };

  onSubmitFormPilihan = e => {
    e.preventDefault();
    let form = {
      question_id: this.state.questionId,
      exam_option: this.state.pilihan,
      description: this.state.jawaban
    };
    API.post(`${API_SERVER}v1/option`, form).then(res => {
      if (res.status === 200) {
        this.setState({ isModalPilihan: false, pilihan: "", jawaban: "" });
        this.fetchDataPilihan();
      }
    });
  };

  fetchDataPilihan() {
    API.get(`${API_SERVER}v1/option/question/${this.state.questionId}`).then(
      res => {
        if (res.status === 200) {
          this.setState({ pilihans: res.data.result });
        }
      }
    );
  }

  onClickAddQuestion = e => {
    e.preventDefault();
    this.setState({ isModalPilihan: true });
  };

  handleClose = e => {
    this.setState({ isModalPilihan: false });
  };

  onSubmitFormAdd = e => {
    e.preventDefault();
    let form = {
      exam_id: this.state.examId,
      tag: this.state.tag,
      number: this.state.number,
      question: this.state.pertanyaan,
      correct_option: this.state.correctOption
    };
    if (this.state.questionId !== "") {
      API.put(`${API_SERVER}v1/question/${this.state.questionId}`, form).then(
        res => {
          if (res.status === 200) {
            this.setState({
              number: res.data.result.number,
              tag: res.data.result.tag,
              pertanyaan: res.data.result.question,
              correctOption: res.data.result.correct_option,
              isSimpanPertanyaan: true,
              isiSimpanPertanyan: 'Pertanyaan berhasil diedit.'
            });
          }
        }
      );
    } else {
      API.post(`${API_SERVER}v1/question`, form).then(res => {
        if (res.status === 200) {
          this.setState({
            isQuestionReady: true,
            questionId: res.data.result.question_id,
            isSimpanPertanyaan: true,
            isiSimpanPertanyan: 'Pertanyaan berhasil disimpan. Selanjutnya silahkan tambahkan pilihan jawaban.'
          });
        }
      });
    }
  };

  onChangeInput = e => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value });
  };

  handleDeleteOption = e => {
    e.preventDefault();
    const optionId = e.target.getAttribute("data-id");
    API.delete(`${API_SERVER}v1/option/${optionId}`).then(res => {
      if (res.status === 200) {
        this.fetchDataPilihan();
      }
    });
  };

  backToQuiz = e => {
    e.preventDefault();
    this.props.history.push(`/question-exam/${this.state.examId}`);
  };

  pilihJawabanBenar = e => {
    const pilihan = e.target.getAttribute("data-option");
    let form = {
      exam_id: this.state.examId,
      tag: this.state.tag,
      number: this.state.number,
      question: this.state.pertanyaan,
      correct_option: pilihan
    };
    API.put(`${API_SERVER}v1/question/${this.state.questionId}`, form).then(
      res => {
        if (res.status === 200) {
          this.setState({
            number: res.data.result.number,
            tag: res.data.result.tag,
            pertanyaan: res.data.result.question,
            correctOption: res.data.result.correct_option
          });
        }
      }
    );
  };

  componentDidMount() {}

  render() {
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-xl-8">
                      <h3 className="f-24 f-w-800 mb-3">
                        <Link
                          onClick={e => {
                            e.preventDefault();
                            this.props.history.push(
                              `/question-quiz/${this.state.examId}.${this.state.courseId}`
                            );
                          }}
                          className="btn btn-ideku btn-circle"
                        >
                          <i
                            className="fa fa-chevron-left"
                            style={{ paddingLeft: "8px" }}
                          ></i>
                        </Link>
                        &nbsp;Buat Pertanyaan
                      </h3>
                      <Card>
                        <Card.Body>
                          <Form onSubmit={this.onSubmitFormAdd}>
                            <Form.Group controlId="formNomor">
                              <Form.Label>Nomor Soal</Form.Label>
                              <Form.Control
                                value={this.state.number}
                                required
                                name="number"
                                onChange={this.onChangeInput}
                                type="text"
                                placeholder="nomor soal"
                              />
                            </Form.Group>
                            <Form.Group controlId="formTag">
                              <Form.Label>Tag Soal</Form.Label>
                              <Form.Control
                                value={this.state.tag}
                                required
                                name="tag"
                                onChange={this.onChangeInput}
                                type="text"
                                placeholder="tag1, tag2, tagN..."
                              />
                            </Form.Group>
                            <Form.Group controlId="formPertanyaan">
                              <Form.Label>Pertanyaan</Form.Label>
                              <Form.Control
                                value={this.state.pertanyaan}
                                required
                                name="pertanyaan"
                                onChange={this.onChangeInput}
                                as="textarea"
                                placeholder="pertanyaan"
                                rows="3"
                              />
                              <Form.Text>Buat pertanyaan Anda.</Form.Text>
                            </Form.Group>

                            <Button variant="ideku" type="submit">
                              Simpan
                            </Button>

                            <Button
                              onClick={this.backToQuiz}
                              variant="ideku"
                              type="button"
                              style={{ marginLeft: "10px" }}
                            >
                              Kembali
                            </Button>
                          </Form>
                        </Card.Body>
                      </Card>
                    </div>

                    <div className="col-xl-4">
                      <h3 className="f-24 f-w-800 mb-3">Buat Pilihan</h3>
                      <Card>
                        <Card.Body>
                          <Button
                            onClick={this.onClickAddQuestion}
                            variant="ideku"
                            type="button"
                            disabled={this.state.isQuestionReady ? "" : "true"}
                          >
                            Tambah Pilihan
                          </Button>
                          <Form.Text>
                            Jangan lupa untuk memilih jawaban benar
                          </Form.Text>

                          <ul
                            style={{
                              marginTop: "10px",
                              marginLeft: "-25px",
                              listStyle: "none"
                            }}
                          >
                            {this.state.pilihans.map((item, i) => {
                              if (
                                item.exam_option === this.state.correctOption
                              ) {
                                return (
                                  <li key={item.option_id}>
                                    <Link
                                      to="#"
                                      className="buttonku"
                                      title="Pilih Sebagai Jawaban Benar"
                                    >
                                      <input
                                        type="radio"
                                        name="site_name"
                                        value={item.exam_option}
                                        checked={
                                          item.exam_option ===
                                          this.state.correctOption
                                        }
                                        name={item.option_id}
                                        onClick={this.pilihJawabanBenar}
                                        data-id={item.option_id}
                                        data-option={item.exam_option}
                                      />
                                    </Link>
                                    &nbsp;
                                    {item.exam_option}. {item.description}{" "}
                                    &nbsp;
                                    <Link
                                      to="#"
                                      className="buttonku"
                                      title="Hapus"
                                    >
                                      <i
                                        onClick={this.handleDeleteOption}
                                        data-id={item.option_id}
                                        className="fa fa-trash"
                                      ></i>
                                    </Link>
                                    <Form.Text style={{ float: "right" }}>
                                      Jawaban Benar
                                    </Form.Text>
                                  </li>
                                );
                              } else {
                                return (
                                  <li key={item.option_id}>
                                    <Link
                                      to="#"
                                      className="buttonku"
                                      title="Pilih Sebagai Jawaban Benar"
                                    >
                                      <input
                                        type="radio"
                                        name="site_name"
                                        value={item.exam_option}
                                        checked={
                                          item.exam_option ===
                                          this.state.correctOption
                                        }
                                        name={item.option_id}
                                        onClick={this.pilihJawabanBenar}
                                        data-id={item.option_id}
                                        data-option={item.exam_option}
                                      />
                                    </Link>
                                    &nbsp;
                                    {item.exam_option}. {item.description}{" "}
                                    &nbsp;
                                    <Link
                                      to="#"
                                      className="buttonku"
                                      title="Hapus"
                                    >
                                      <i
                                        onClick={this.handleDeleteOption}
                                        data-id={item.option_id}
                                        className="fa fa-trash"
                                      ></i>
                                    </Link>
                                  </li>
                                );
                              }
                            })}
                          </ul>
                        </Card.Body>
                      </Card>
                    </div>

                    <Modal
                      show={this.state.isModalPilihan}
                      onHide={this.handleClose}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title className="text-c-purple3 f-w-bold">
                          Pilihan Jawaban
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form onSubmit={this.onSubmitFormPilihan}>
                          <Form.Group controlId="formTag">
                            <Form.Label>Pilihan</Form.Label>
                            <Form.Control
                              required
                              name="pilihan"
                              onChange={this.onChangeInput}
                              type="text"
                              placeholder="A, B, C, D, E..."
                            />
                          </Form.Group>
                          <Form.Group controlId="formPertanyaan">
                            <Form.Label>Jawaban</Form.Label>
                            <Form.Control
                              required
                              name="jawaban"
                              onChange={this.onChangeInput}
                              as="textarea"
                              placeholder="jawaban"
                              rows="3"
                            />
                            <Form.Text>Tuliskan jawabannya.</Form.Text>
                          </Form.Group>
                          <button
                            style={{ marginTop: "30px" }}
                            type="submit"
                            className="btn btn-block btn-ideku f-w-bold"
                          >
                            Simpan
                          </button>
                        </Form>

                        <button
                          type="button"
                          className="btn btn-block f-w-bold"
                          onClick={this.handleClose}
                        >
                          Tidak
                        </button>
                      </Modal.Body>
                    </Modal>

                    <Modal
                      show={this.state.isSimpanPertanyaan}
                      onHide={this.handleSimpanPertanyaan}
                    >
                      <Modal.Body>
                        <h3 className="f-24 f-w-800 mb-3">
                          {this.state.isiSimpanPertanyan}
                        </h3>

                        <button
                          style={{ marginTop: "30px" }}
                          type="button"
                          className="btn btn-block f-w-bold"
                          onClick={this.handleSimpanPertanyaan}
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
      </div>
    );
  }
}
