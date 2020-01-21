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

		quiz: [],

		isModalAdd: false,
		examId: '',
		examTitle: '',
		exampDesc: '',
		examRandom: '',
		examPublish: '',

		isModalDelete: false,
		quizId: ''
	}

	handleOpen = e => {
		e.preventDefault();
		this.setState({ isModalAdd: true });
	}

	handleOpenEdit = e => {
		e.preventDefault();
		let quizId = e.target.getAttribute('data-id');
		API.get(`${API_SERVER}v1/quiz/${quizId}`).then(res => {
			if(res.status === 200) {
				console.log(res.data.result)
				this.setState({ isModalAdd: true, 
					examId: res.data.result.exam_id,
					examTitle: res.data.result.exam_title,
					exampDesc: res.data.result.exam_description,
					examRandom: res.data.result.random,
					examPublish: res.data.result.exam_publish 
				});
			}
		})
	}

	handleOpenDelete = e => {
		e.preventDefault();
		let quizId = e.target.getAttribute('data-id');
		this.setState({ isModalDelete: true, quizId: quizId });
	}

	handleClose = e => {
		this.setState({ 
			isModalAdd: false, isModalDelete: false, 
			quizId: '',
			examId: '',
			examTitle: '',
			exampDesc: '',
			examRandom: '',
			examPublish: '',
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
				quiz_title: this.state.examTitle,
				quiz_description: this.state.exampDesc,
				quiz_publish: this.state.examPublish,
				company_id: this.state.companyId,
				course_id: this.state.courseId,
				user_id: this.state.userId
			};

			API.post(`${API_SERVER}v1/quiz`, form).then(res => {
				if(res.status === 200) {
					this.handleClose();
					this.fetchData();
				}
			})
		} else {
			let form = {
				random: this.state.examRandom,
				quiz_title: this.state.examTitle,
				quiz_description: this.state.exampDesc,
				quiz_publish: this.state.examPublish,
			};
			API.put(`${API_SERVER}v1/quiz/${this.state.examId}`, form).then(res => {
				if(res.status === 200) {
					this.handleClose();
					this.fetchData();
				}
			})
		}
	}

	onClickDelete = e => {
		API.delete(`${API_SERVER}v1/quiz/${this.state.quizId}`).then(res => {
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

				API.get(`${API_SERVER}v1/quiz/course/${this.state.courseId}/${res.data.result.company_id}`).then(res => {
					if(res.status === 200) {
						console.log(res.data.result)
						this.setState({ quiz: res.data.result })
					}
				})
			}
		});
	}

	render() {
		const { courseId, quiz } = this.state;
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
			                      Tidak ada quiz
			                    </small>
			                    <h5 className="f-w-bold f-20 text-c-purple3">
			                      Silahkan buat quiz Anda
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
                        Quiz Course
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
                        <Lists lists={quiz} />
                      </div>
                    </div>

                    <Modal show={this.state.isModalAdd} onHide={this.handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title className="text-c-purple3 f-w-bold">Form Quiz</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <form onSubmit={this.onSubmitFormAdd}>
                        	<div className="form-group">
                        		<label>Judul</label>
                        		<input onChange={this.onChangeInput} value={this.state.examTitle} name="examTitle" required type="text" placeholder="judul quiz" className="form-control" />
                        	</div>
                        	<div className="form-group">
                        		<label>Deskripsi</label>
                        		<textarea onChange={this.onChangeInput} value={this.state.exampDesc} name="exampDesc" required type="text" placeholder="deskripsi quiz" className="form-control" />
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
                        <p className="f-w-bold">Apakah anda yakin untuk menghapus quiz ini ?</p>
                        
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

