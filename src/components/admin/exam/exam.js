import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Row, Col } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default class QuizList extends Component {
	
	state = {
		userId: Storage.get('user').data.user_id,
		courseId: this.props.match.params.course_id,
		companyId: '',

		exam: [],

		isModalAdd: false,
		examId: '',
		examTitle: '',
		exampDesc: '',
		examRandom: '0',
		examPublish: '0',
		timeMinute: '',
		timeStart: new Date(),
		timeFinish: new Date(),
    waktuStart: '',
    waktuFinish: '',

		isModalDelete: false,

		isImport: false,
		importId: '',
		importFile: ''
	}

	handleStartDatePicker = date => {
    this.setState({
      waktuStart: this.changeFormatDate(date), timeStart: date,
    })
  }

  handleFinishDatePicker = date => {
    this.setState({
      waktuFinish: this.changeFormatDate(date), timeFinish: date
    })
  }

  changeFormatDate = (value) => {
    let dt = new Date(value)
    return `${dt.getFullYear().toString().padStart(4, '0')}-${(dt.getMonth()+1).toString().padStart(2, '0')}-${dt.getDate().toString().padStart(2, '0')} ${dt.getHours().toString().padStart(2, '0')}:${dt.getMinutes().toString().padStart(2, '0')}:${dt.getSeconds().toString().padStart(2, '0')}`
  }

	handleOpen = e => {
		e.preventDefault();
		this.setState({ isModalAdd: true });
	}

	handleOpenEdit = e => {
		e.preventDefault();
		let examId = e.target.getAttribute('data-id');
		API.get(`${API_SERVER}v1/exam/${examId}`).then(res => {
			if(res.status === 200) {
				this.setState({ isModalAdd: true, 
					examId: res.data.result.exam_id,
					examTitle: res.data.result.exam_title,
					exampDesc: res.data.result.exam_description,
					examRandom: res.data.result.random,
					examPublish: res.data.result.exam_publish,
					timeMinute: res.data.result.time_minute,
					timeStart: new Date(res.data.result.time_start),
					timeFinish: new Date(res.data.result.time_finish),
				});
			}
		})
	}

	handleOpenDelete = e => {
		e.preventDefault();
		let examId = e.target.getAttribute('data-id');
		this.setState({ isModalDelete: true, examId: examId });
	}

	handleClose = e => {
		let waktu = this.changeFormatDate(new Date());
		this.setState({
      isModalAdd: false,
      isModalDelete: false,
      examId: "",
      examTitle: "",
      exampDesc: "",
      examRandom: "",
      examPublish: "",
      timeMinute: "",
      timeStart: new Date(),
      timeFinish: new Date(),
      waktuStart: waktu,
      waktuFinish: waktu
    });
	}

	onChangeInput = e => {
		const name = e.target.name;
		const value = e.target.value;

		this.setState({ [name]: value });
	}

	onSubmitFormAdd = e => {
		e.preventDefault();
		if(this.state.examId === "") {
			let form = {
				random: this.state.examRandom,
				exam_title: this.state.examTitle,
				exam_description: this.state.exampDesc,
				exam_publish: this.state.examPublish,
				company_id: this.state.companyId,
				course_id: this.state.courseId,
				user_id: this.state.userId,
				time_minute: this.state.timeMinute,
				time_start: this.state.waktuStart,
				time_finish: this.state.waktuFinish,
			};

			API.post(`${API_SERVER}v1/exam`, form).then(res => {
				if(res.status === 200) {
					this.handleClose();
					this.fetchData();
				}
			})
		} else {
			let form = {
				random: this.state.examRandom,
				exam_title: this.state.examTitle,
				exam_description: this.state.exampDesc,
				exam_publish: this.state.examPublish,
				time_minute: this.state.timeMinute,
				time_start: this.state.waktuStart,
				time_finish: this.state.waktuFinish,
			};
			API.put(`${API_SERVER}v1/exam/${this.state.examId}`, form).then(res => {
				if(res.status === 200) {
					this.handleClose();
					this.fetchData();
				}
			})
		}
	}

	onClickDelete = e => {
		API.delete(`${API_SERVER}v1/exam/${this.state.examId}`).then(res => {
			if(res.status === 200) {
				this.handleClose();
				this.fetchData();
			}
		})
	}

	importPertanyaan = e => {
		e.preventDefault();
		const examId = e.target.getAttribute('data-id');
		this.setState({ isImport: true, importId: examId })
	}

	closeImportPertanyaan = e => {
		this.setState({ isImport: false, importId: "", importFile: '' });
	}

	onSubmitPertanyaan = e => {
		e.preventDefault();
		let formData = new FormData();
		formData.append('exam_id', this.state.importId);
		formData.append('excel', this.state.importFile);

		API.post(`${API_SERVER}v1/question/import`, formData).then(res => {
			console.log('res: ', res.data)
			if(res.status === 200 && !res.data.error) {
				this.fetchData();
				this.closeImportPertanyaan();
			}
		})
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		let waktu = this.changeFormatDate(new Date());
		API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200) {
		this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });

				API.get(`${API_SERVER}v1/exam/course/${this.state.courseId}/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id}`).then(res => {
					if(res.status === 200) {
						this.setState({ exam: res.data.result, waktuStart: waktu, waktuFinish: waktu })
					}
				})
			}
		});
	}

	onChangeDateTime = e => {
		console.log(e);
	}

	changeToPublish = e => {
		e.preventDefault();
		const examId = e.target.getAttribute('data-id');
		let form = {
			course_id: this.state.courseId,
			company_id: this.state.companyId
		}
		API.put(`${API_SERVER}v1/exam/publish/${examId}`, form).then(res => {
			if(res.status === 200) {
				this.fetchData();
			}
		})
	}

	render() {
		const { courseId, exam } = this.state;
		const statusCompany = ["0", "1"];

		const YesNo = ({value}) => {
			if(value === 1) {
				return (<div>Ya</div>);
			} else {
				return (<div>Tidak</div>);
			}
		};

		const Lists = ({lists}) => {
			if(lists.length !== 0) {
				return (
					<ul className="list-cabang">
		        { 
		        	lists.map((item, i) => (
		          	<li key={item.exam_id}>
					        <div className="card" style={ item.exam_publish == 0 ? {} : {border:'3px solid #932778'}}>
					          <div className="card-block" style={{ padding: "25px 30px !important" }}>
					            <div className="row d-flex align-items-center">

					              <div className="col-xl-1 col-md-12">
					                <div className="row align-items-center justify-content-center">
					                  <div className="col">
					                    <small className="f-w-600 f-16 text-c-grey-t ">
					                      No
					                    </small>
					                    <Link to="#">
					                      <h5 className="f-w-bold f-20 text-c-purple3">
					                        {i+1}
					                      </h5>
					                    </Link>
					                  </div>
					                </div>
					              </div>
					              <div className="col-xl-3 col-md-12">
					                <div className="row align-items-center justify-content-center">
					                  <div className="col">
									  {item.exam_publish == 0 ?
									  	<small className="f-w-600 f-16 text-c-grey-t ">Judul</small>
										:
										<small className="f-w-600 f-16 text-c-grey-t " style={{color:'green'}}>Ujian Aktif</small>}
					                    
					                    <h5 className="f-w-bold f-20 text-c-purple3">
					                      {item.exam_title}
					                    </h5>
					                  </div>
					                </div>
					              </div>
					              <div className="col-xl-2 col-md-12">
					                <div className="row align-items-center justify-content-center">
					                  <div className="col">
					                    <small className="f-w-600 f-16 text-c-grey-t ">
					                      Waktu
					                    </small>
					                    <h5 className="f-w-bold f-20 text-c-purple3">
					                      {item.time_minute} menit
					                    </h5>
					                  </div>
					                </div>
					              </div>
					              <div className="col-xl-1 col-md-12">
					                <div className="row align-items-center justify-content-center">
					                  <div className="col">
					                    <small className="f-w-600 f-16 text-c-grey-t ">
					                      Random
					                    </small>
					                    <h5 className="f-w-bold f-20 text-c-purple3">
					                      <YesNo value={item.random} />
					                    </h5>
					                  </div>
					                </div>
					              </div>
					              <div className="col-xl-1 col-md-12">
					                <div className="row align-items-center justify-content-center">
					                  <div className="col">
					                    <small className="f-w-600 f-16 text-c-grey-t ">
					                      Soal
					                    </small>
					                    <h5 className="f-w-bold f-20 text-c-purple3">
					                      {item.soal}
					                    </h5>
					                  </div>
					                </div>
					              </div>
					              <div className="col-xl-2 col-md-12">
					                <div className="row align-items-center justify-content-center">
					                  <div className="col">
					                    <small className="f-w-600 f-16 text-c-grey-t ">
					                      Created At
					                    </small>
					                    <h5 className="f-w-bold f-20 text-c-purple3">
					                      {item.created_at.toString().substring(0,10)}
					                    </h5>
					                  </div>
					                </div>
					              </div>
					              <div className="col-xl-2 col-md-12 text-right">
											{ item.exam_publish == 0 ?
													<Link to="#" className="buttonku" title="Tetapkan sebagai ujian utama">
														<i onClick={this.changeToPublish} data-id={item.exam_id} className="fa fa-check"></i>
													</Link>
											:<link></link>}
													<Link to="#" className="buttonku" title="Import Pertanyaan">
				          					<i onClick={this.importPertanyaan} data-id={item.exam_id} className="fa fa-download"></i>
				        					</Link>
					              	<Link to={`/question-exam/${item.exam_id}.${this.state.courseId}`} className="buttonku" title="Buat Pertanyaan">
				          					<i data-id={item.exam_id} className="fa fa-plus"></i>
				        					</Link>
													<Link to="#" className="buttonku" title="Edit">
				          					<i onClick={this.handleOpenEdit} data-id={item.exam_id} className="fa fa-edit"></i>
				        					</Link>
				          				<Link to="#" className="buttonku" title="Hapus">
				          					<i onClick={this.handleOpenDelete} data-id={item.exam_id} className="fa fa-trash"></i>
				        					</Link>
					              </div>

					            </div>
					          </div>
					        </div>
					      </li>
			        ))
			      }
		      </ul>		
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
			                      Tidak ada Ujian
			                    </small>
			                    <h5 className="f-w-bold f-20 text-c-purple3">
			                      Tambahkan Ujian{/*"Silahkan buat exam Anda"*/}
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

		const startDate = new Date();

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
                              `/chapter/${this.state.courseId}`
                            );
                          }}
                          className="btn btn-ideku btn-circle"
                        >
                          <i
                            className="fa fa-chevron-left"
                            style={{ paddingLeft: "8px" }}
                          ></i>
                        </Link>
                        &nbsp;Ujian Kursus
                      </h3>

                      <a
                        onClick={this.handleOpen}
                        className="btn btn-ideku f-14 float-right mb-3"
                        style={{
                          padding: "7px 25px !important",
                          color: "white"
                        }}
                      >
                        <i className="fa fa-plus"></i>
                        Tambah Baru
                      </a>

                      <a
                        alt="Link"
                        href={`${API_SERVER}company/format.xlsx`}
                        className="btn btn-ideku f-14 float-right mb-3 mr-3"
                        style={{
                          padding: "7px 25px !important",
                          color: "white"
                        }}
                      >
                        <i className="fa fa-download"></i>
                        Download Format
                      </a>
                    </div>

                    <div className="col-xl-12">
                      <div style={{ overflowX: "auto" }}>
                        <Lists lists={exam} />
                      </div>
                    </div>

                    <Modal
                      show={this.state.isModalAdd}
                      onHide={this.handleClose}
                      dialogClassName="modal-lg"
                    >
                      <Modal.Header closeButton>
                        <Modal.Title className="text-c-purple3 f-w-bold">
                          Form Ujian
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <form onSubmit={this.onSubmitFormAdd}>
                          <div className="form-group">
                            <label>Judul</label>
                            <input
                              onChange={this.onChangeInput}
                              value={this.state.examTitle}
                              name="examTitle"
                              required
                              type="text"
                              placeholder="judul ujian"
                              className="form-control"
                            />
                          </div>
                          <div className="form-group">
                            <label>Deskripsi</label>
                            <textarea
                              onChange={this.onChangeInput}
                              value={this.state.exampDesc}
                              name="exampDesc"
                              required
                              type="text"
                              placeholder="deskripsi ujian"
                              className="form-control"
                            />
                          </div>
                          <div className="form-group">
                            <label>Berapa Menit</label>
                            <input
                              pattern="^-?[0-9]\d*\.?\d*$"
                              onChange={this.onChangeInput}
                              value={this.state.timeMinute}
                              name="timeMinute"
                              required
                              type="number"
                              placeholder="berapa menit"
                              className="form-control"
                            />
                          </div>
                          <div className="form-group">
                            <Row>
                              <Col sm={6}>
                                <label>Start &nbsp;</label>
                                <DatePicker
                                  selected={this.state.timeStart}
                                  onChange={this.handleStartDatePicker}
                                  showTimeSelect
                                  className="form-control"
                                  dateFormat="yyyy-MM-dd HH:mm:ss"
                                />
                              </Col>
                              <Col sm={6}>
                                <label>Finish &nbsp;</label>
                                <DatePicker
                                  selected={this.state.timeFinish}
                                  onChange={this.handleFinishDatePicker}
                                  showTimeSelect
                                  className="form-control"
                                  dateFormat="yyyy-MM-dd HH:mm:ss"
                                />
                              </Col>
                            </Row>
                          </div>

                          <button
                            style={{ marginTop: "30px" }}
                            type="submit"
                            className="btn btn-block btn-ideku f-w-bold"
                          >
                            Simpan
                          </button>
                        </form>

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
                          Apakah anda yakin untuk menghapus ujian ini ?
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

                    <Modal
                      show={this.state.isImport}
                      onHide={this.closeImportPertanyaan}
                    >
                      <Modal.Header closeButton>
                        <Modal.Title className="text-c-purple3 f-w-bold">
                          Upload Pertanyaan
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div className="form-vertical">
                          <div className="form-group">
                            <label style={{ fontWeight: "bold" }}>File</label>
                            <input
                              type="file"
                              className="form-control"
                              name="file"
                              onChange={e => {
                                this.setState({
                                  importFile: e.target.files[0]
                                });
                              }}
                            />
                            <Form.Text>
                              Pastikan format file xls, atau xlsx.
                            </Form.Text>
                          </div>
                        </div>

                        <button
                          style={{ marginTop: "30px" }}
                          type="button"
                          onClick={this.onSubmitPertanyaan}
                          className="btn btn-block btn-ideku f-w-bold"
                        >
                          Submit
                        </button>
                        <button
                          type="button"
                          className="btn btn-block f-w-bold"
                          onClick={this.closeImportPertanyaan}
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

