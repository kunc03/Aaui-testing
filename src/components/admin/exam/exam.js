import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';

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
		examRandom: '',
		examPublish: '',
		timeMinute: '',
		timeStart: '',
		timeFinish: '',

		isModalDelete: false,
		examId: ''
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
				console.log(res.data.result)
				this.setState({ isModalAdd: true, 
					examId: res.data.result.exam_id,
					examTitle: res.data.result.exam_title,
					exampDesc: res.data.result.exam_description,
					examRandom: res.data.result.random,
					examPublish: res.data.result.exam_publish,
					timeMinute: res.data.result.time_minute,
					timeStart: res.data.result.time_start.toString().substring(0,19).replace('T', ' '),
					timeFinish: res.data.result.time_finish.toString().substring(0,19).replace('T', ' '),
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
		this.setState({ 
			isModalAdd: false, isModalDelete: false, 
			examId: '',
			examId: '',
			examTitle: '',
			exampDesc: '',
			examRandom: '',
			examPublish: '',
			timeMinute: '',
			timeStart: '',
			timeFinish: '',
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
				time_start: this.state.timeStart,
				time_finish: this.state.timeFinish,
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
				time_start: this.state.timeStart,
				time_finish: this.state.timeFinish,
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

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200) {
				this.setState({ companyId: res.data.result.company_id });

				API.get(`${API_SERVER}v1/exam/course/${this.state.courseId}/${res.data.result.company_id}`).then(res => {
					if(res.status === 200) {
						console.log(res.data.result)
						this.setState({ exam: res.data.result })
					}
				})
			}
		});
	}

	render() {
		const { courseId, exam } = this.state;
		const statusCompany = ["0", "1"];

		const YesNo = ({value}) => {
			if(value === 1) {
				return (<>Ya</>);
			} else {
				return (<>Tidak</>);
			}
		};

		const Lists = ({lists}) => {
			if(lists.length !== 0) {
				return (
					<ul className="list-cabang">
		        { 
		        	lists.map((item, i) => (
		          	<li key={item.exam_id}>
					        <div className="card">
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
					              <div className="col-xl-4 col-md-12">
					                <div className="row align-items-center justify-content-center">
					                  <div className="col">
					                    <small className="f-w-600 f-16 text-c-grey-t ">
					                      Judul
					                    </small>
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
													<Link to="#" className="buttonku">
				          					<i onClick={this.handleOpenEdit} data-id={item.exam_id} className="fa fa-edit"></i>
				        					</Link>
				          				<Link to="#" className="buttonku">
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
			                      Tidak ada exam
			                    </small>
			                    <h5 className="f-w-bold f-20 text-c-purple3">
			                      Silahkan buat exam Anda
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
                        Exam Course
                      </h3>

                      <a onClick={this.handleOpen} className="btn btn-ideku f-14 float-right mb-3" style={{ padding: "7px 25px !important", color: 'white' }}>
                      	<img
                          src="assets/images/component/person_add.png"
                          className="button-img"
                          alt=""
                        />
                        Tambah Baru
                      </a>
                    </div>

                    <div className="col-xl-12">
                      <div style={{ overflowX: "auto" }}>
                        <Lists lists={exam} />
                      </div>
                    </div>

                    <Modal show={this.state.isModalAdd} onHide={this.handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title className="text-c-purple3 f-w-bold">Form Exam</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <form onSubmit={this.onSubmitFormAdd}>
                        	<div className="form-group">
                        		<label>Judul</label>
                        		<input onChange={this.onChangeInput} value={this.state.examTitle} name="examTitle" required type="text" placeholder="judul exam" className="form-control" />
                        	</div>
                        	<div className="form-group">
                        		<label>Deskripsi</label>
                        		<textarea onChange={this.onChangeInput} value={this.state.exampDesc} name="exampDesc" required type="text" placeholder="deskripsi exam" className="form-control" />
                        	</div>
                        	<div className="form-group" onChange={this.onChangeInput}>
                        		<label>Random Soal</label>
                        		<br/>
                        		{
				                      statusCompany.map(item => {
				                        return (
				                          <Form.Check name='examRandom' inline label={(item === "0") ? "Tidak":"Ya"} checked={String(this.state.examRandom) === item} type='radio' value={item} />
				                        );
				                      })
				                    }
                        	</div>
                        	<div className="form-group" onChange={this.onChangeInput}>
                        		<label>Publish</label>
                        		<br/>
		                      	{
				                      statusCompany.map(item => {
				                        return (
				                          <Form.Check name='examPublish' inline label={(item === "0") ? "Tidak":"Ya"} checked={String(this.state.examPublish) === item} type='radio' value={item} />
				                        );
				                      })
				                    }
                        	</div>
                        	<div className="form-group">
                        		<label>Berapa Menit</label>
                        		<input onChange={this.onChangeInput} value={this.state.timeMinute} name="timeMinute" required type="text" placeholder="berapa menit" className="form-control" />
                        	</div>
                        	<div className="form-group">
                        		<label>Start Jam</label>
                        		<input onChange={this.onChangeInput} value={this.state.timeStart} name="timeStart" required type="text" placeholder="start pada jam" className="form-control" />
                        	</div>
                        	<div className="form-group">
                        		<label>Finish Jam</label>
                        		<input onChange={this.onChangeInput} value={this.state.timeFinish} name="timeFinish" required type="text" placeholder="finish pada jam" className="form-control" />
                        	</div>

	                        <button style={{ marginTop: '30px'}} type="submit"
	                          className="btn btn-block btn-ideku f-w-bold">
	                          Simpan
	                        </button>
                        </form>
                        
                        <button type="button"
                          className="btn btn-block f-w-bold"
                          onClick={this.handleClose}>
                          Tidak
                        </button>
                      </Modal.Body>
                    </Modal>

                    <Modal show={this.state.isModalDelete} onHide={this.handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title className="text-c-purple3 f-w-bold">Konfirmasi</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <p className="f-w-bold">Apakah anda yakin untuk menghapus exam ini ?</p>
                        
                        <button style={{marginTop: '30px'}} type="button"
                          onClick={this.onClickDelete}
                          className="btn btn-block btn-ideku f-w-bold">
                          Hapus
                        </button>
                        <button type="button"
                          className="btn btn-block f-w-bold"
                          onClick={this.handleClose}>
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

