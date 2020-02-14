import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Card, Badge, Accordion } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { Editor } from '@tinymce/tinymce-react';

import ReactPlayer from 'react-player';
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";

export default class ChapterPreview extends Component {

	state = {
		companyId: '',
		courseId: this.props.match.params.course_id,
		course: {},
		chapters: [],

		chapterId: '',
		chapterNumber: '',
		chapterTitle: '',
		chapterBody: '',
		chapterVideo: '',

		isModalAdd: false,
		isModalHapus: false,

		isLocalSteps: false,
		steps: [
			{
				target: '.buat-chapter',
				content: 'Hal pertama yang harus dilakukan adalah menambah chapter pada kursus ini.',
			},
			{
				target: '.buat-quiz',
				content: 'Setelah chapter sudah di buat, bisa membuat quiz yang nantinya akan di ikutin oleh peserta.',
			},
			{
				target: '.buat-ujian',
				content: 'Tahap terakhir adalah membuat ujian akhir dari kursus ini.',
			},
		]
	}

	onChangeTinyMce = e => {
    this.setState({ chapterBody: e.target.getContent().replace(/'/g, "\\'") });
  }

	onChangeInput = e => {
		const name = e.target.name;
		const value = e.target.value;

		if(name === 'chapterVideo') {
			this.setState({ [name]: e.target.files[0] });
		} else {
			this.setState({ [name]: value });
		}
	}

	/** CLICK ADD */
	handleModalAdd = e => {
		e.preventDefault();
		this.setState({ isModalAdd: true });
	}

	handleModalClose = e => {
		this.setState({ 
			isModalAdd: false, 
			chapterId: '',
			chapterNumber: '',
			chapterTitle: '',
			chapterBody: '',
			chapterVideo: ''
		});
	}

	onSubmitChapter = e => {
		e.preventDefault();
		if(this.state.chapterId !== "") {
			let form = {
				course_id: this.state.courseId,
				company_id: this.state.companyId,
				chapter_number: this.state.chapterNumber,
				chapter_title: this.state.chapterTitle,
				chapter_body: this.state.chapterBody,
				attachment_id: '1'
			}

			API.put(`${API_SERVER}v1/chapter/${this.state.chapterId}`, form).then(res => {
				if(res.status == 200){
					this.handleModalClose();
					this.fetchDataChapter();
				}
			})

			if(this.state.chapterVideo !== "") {
				let form = new FormData();
				form.append('chapter_video', this.state.chapterVideo);
				API.put(`${API_SERVER}v1/chapter/video/${this.state.chapterId}`, form).then(res => {
					if(res.status == 200){
						this.handleModalClose();
						this.fetchDataChapter();
					}
				})				
			}
		} else {
			let form = new FormData();
			form.append('course_id', this.state.courseId);
			form.append('company_id', this.state.companyId);
			form.append('chapter_number', this.state.chapterNumber);
			form.append('chapter_title', this.state.chapterTitle);
			form.append('chapter_body', this.state.chapterBody);
			form.append('chapter_video', this.state.chapterVideo);
			form.append('attachment_id', '1');

			API.post(`${API_SERVER}v1/chapter`, form).then(res => {
				if(res.status === 200){
					this.handleModalClose()
					this.fetchDataChapter()
				}
			})
		}
	}
	/** END CLICK ADD */

	/** CLICK ADD CHAPTER */
	onClickHapusChapter = e => {
		e.preventDefault();
		let chapterId = e.target.getAttribute('data-id');
		this.setState({ isModalHapus: true, chapterId: chapterId })
	}

	handleModalHapus = e => {
		this.setState({ isModalHapus: false, chapterId: '' });
	}

	onClickHapusChapterYes = e => {
		API.delete(`${API_SERVER}v1/chapter/${this.state.chapterId}`).then(res => {
			if(res.status === 200){
				this.handleModalHapus();
				this.fetchDataChapter();
			}
		})
	}
	/** END CLICK ADD CHAPTER */

	/** CLICK EDIT CHAPTER */
	onClickEditChapter = e => {
		e.preventDefault();
		let chapterId = e.target.getAttribute('data-id');
		API.get(`${API_SERVER}v1/chapter/${chapterId}`).then(res => {
			if(res.status === 200) {
				this.setState({
					isModalAdd: true, 
					chapterId: chapterId,
					chapterNumber: res.data.result.chapter_number,
					chapterTitle: res.data.result.chapter_title,
					chapterBody: res.data.result.chapter_body
				})
			}
		})
	}
	/** END CLICK EDIT CHAPTER */

	fetchData() {
		API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200) {
				this.setState({ companyId: res.data.result.company_id });

				API.get(`${API_SERVER}v1/course/${this.state.courseId}`).then(res => {
					if(res.status === 200) {
						this.setState({ course: res.data.result })
					}
				})

				this.fetchDataChapter();

			}
		})
	}

	fetchDataChapter() {
		API.get(`${API_SERVER}v1/chapter/course/${this.state.courseId}`).then(res => {
			if(res.status === 200) {
				this.setState({ chapters: res.data.result });
			}
		})				
	}

	componentDidMount() {
		this.fetchData()
		let isTourChapter = localStorage.getItem("isTourChapter");
    if (isTourChapter) {
      this.setState({ isLocalSteps: true });
    }
	}

	handleJoyrideCallback = data => {
    const { action, index, status, type } = data;

    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      // Update state to advance the tour
      this.setState({ stepIndex: index + (action === ACTIONS.PREV ? -1 : 1) });
    }
    else if ([STATUS.FINISHED].includes(status)) {
      // Need to set our running state to false, so we can restart if we click start again.
			this.setState({ isLocalSteps: true });
			localStorage.setItem('isTourChapter', true);
    }

    console.groupCollapsed(type);
    console.log(data); //eslint-disable-line no-console
    console.groupEnd();
  };

	render() {
		console.log(this.state)
		const {chapters, course} = this.state;

		const CheckMedia = ({ media }) => {
			if (media) {
				let ekSplit = media.split('.');
				let ektension = ekSplit[ekSplit.length - 1];
				if (ektension === "jpg" || ektension === "png" || ektension === "jpeg") {
					return (
						<img class="img-fluid rounded" src={media} alt="" style={{ marginBottom: '20px' }} />
					)
				} else {
					return (
						<div style={{ position: 'relative', paddingTop: '56.25%' }}>
							<ReactPlayer
								style={{ position: 'absolute', top: '0', left: '0' }}
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
		}

		const ListChapter = ({lists}) => {
			if(lists.length !== 0) {
				return (
					<Accordion>
					{
						lists.map((item, i) => (
							<Card style={{marginTop: '10px', marginBottom: '10px'}} key={item.chapter_id}>
								<Accordion.Toggle as={Card.Header} className="f-24 f-w-800" eventKey={item.chapter_id}>
									<Form.Text className="f-14">Chapter {i+1}</Form.Text>
					  			<h3 className="f-20 f-w-800" style={{marginBottom: '0px', cursor: 'pointer'}}>{item.chapter_title}</h3>
							  </Accordion.Toggle>
							  <Accordion.Collapse eventKey={item.chapter_id}>
								  <Card.Body style={{padding: '16px'}}>
										<CheckMedia media={item.chapter_video} />

										<div style={{marginTop: '10px'}} dangerouslySetInnerHTML={{ __html: item.chapter_body }} />
								    
								    <Link to="#" className="buttonku" title="Edit">
			                <i onClick={this.onClickEditChapter} data-id={item.chapter_id} className="fa fa-edit"></i>
			              </Link>
			              <Link to="#" className="buttonku" title="Hapus">
			                <i onClick={this.onClickHapusChapter} data-id={item.chapter_id} className="fa fa-trash"></i>
			              </Link>
								  </Card.Body>
							  </Accordion.Collapse>
							</Card>
						))	
					}
					</Accordion>
				)
			} else {
				return (
					<Card style={{marginTop: '10px'}}>
					  <Card.Body>Tidak ada chapter tersedia.</Card.Body>
					</Card>
				)
			}
		};

		const dateFormat = new Date(course.created_at);

		return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    {!this.state.isLocalSteps && (
                      <Joyride
                        callback={this.handleJoyrideCallback}
                        steps={this.state.steps}
                        continuous="true"
                      />
                    )}
                    <div className="col-xl-8">
                      <Link
                        to={`/kursus-materi-edit/${this.state.courseId}`}
                        className="btn btn-ideku buttonku"
                        title="Quiz"
                      >
                        Edit Course
                      </Link>
                      <Link
                        onClick={this.handleModalAdd}
                        className="btn btn-ideku buttonku buat-chapter"
                      >
                        Buat Chapter
                      </Link>
                      <Link
                        to={`/quiz/${this.state.courseId}`}
                        className="btn btn-ideku buttonku buat-quiz"
                        title="Quiz"
                      >
                        Buat Quiz
                      </Link>
                      <Link
                        to={`/exam/${this.state.courseId}`}
                        className="btn btn-ideku buttonku buat-ujian"
                        title="Exam"
                      >
                        Buat Exam
                      </Link>

                      <h3
                        className="f-24 f-w-800 mb-3"
                        style={{ marginTop: "20px" }}
                      >
                        {course.title}
                      </h3>
                      <Badge variant="success" style={{ padding: "6px" }}>
                        {course.type}
                      </Badge>

                      <p class="lead">
                        Kategori&nbsp;
                        <Badge variant="info" style={{ padding: "10px" }}>
                          {course.category_name}
                        </Badge>
                      </p>
                      <p>Posted on {dateFormat.toString().slice(0, 21)}</p>

                      <CheckMedia media={course.image} />

                      <br />
                      <br />

                      <p class="lead">{course.caption}</p>

                      <div dangerouslySetInnerHTML={{ __html: course.body }} />
                    </div>

                    <div className="col-xl-4">
                      <ListChapter lists={chapters} />
                    </div>
                  </div>

                  <Modal
                    show={this.state.isModalHapus}
                    onHide={this.handleModalHapus}
                  >
                    <Modal.Body>
                      <Modal.Title className="text-c-purple3 f-w-bold">
                        Konfirmasi
                      </Modal.Title>
                      <div style={{ marginTop: "20px" }} className="form-group">
                        <p className="f-w-bold">
                          Apakah Anda yakin untuk menghapus chapter ini ?
                        </p>
                      </div>
                      <button
                        style={{ marginTop: "50px" }}
                        type="button"
                        onClick={this.onClickHapusChapterYes}
                        className="btn btn-block btn-ideku f-w-bold"
                      >
                        Ya, Hapus
                      </button>
                      <button
                        type="button"
                        className="btn btn-block f-w-bold"
                        onClick={this.handleModalHapus}
                      >
                        Tidak
                      </button>
                    </Modal.Body>
                  </Modal>

                  <Modal
                    show={this.state.isModalAdd}
                    onHide={this.handleModalClose}
                    dialogClassName="modal-lg"
                  >
                    <Modal.Body>
                      <Modal.Title className="text-c-purple3 f-w-bold">
                        Form Chapter
                      </Modal.Title>
                      <div style={{ marginTop: "20px" }} className="form-group">
                        <form onSubmit={this.onSubmitChapter}>
                          <div className="form-group">
                            <label>Nomor Chapter</label>
                            <input
                              value={this.state.chapterNumber}
                              name="chapterNumber"
                              onChange={this.onChangeInput}
                              type="text"
                              required
                              placeholder="nomor chapter"
                              className="form-control"
                            />
                            <Form.Text>Isi dengan nomor angka</Form.Text>
                          </div>
                          <div className="form-group">
                            <label>Judul Chapter</label>
                            <input
                              value={this.state.chapterTitle}
                              name="chapterTitle"
                              onChange={this.onChangeInput}
                              type="text"
                              required
                              placeholder="judul chapter"
                              className="form-control"
                            />
                          </div>
                          <div className="form-group">
                            <Editor
                              apiKey="j18ccoizrbdzpcunfqk7dugx72d7u9kfwls7xlpxg7m21mb5"
                              initialValue={this.state.chapterBody}
                              init={{
                                height: 400,
                                menubar: false,
                                plugins: [
                                  "advlist autolink lists link image charmap print preview anchor",
                                  "searchreplace visualblocks code fullscreen",
                                  "insertdatetime media table paste code help wordcount"
                                ],
                                toolbar:
                                  "undo redo | formatselect | bold italic backcolor | \
                                 alignleft aligncenter alignright alignjustify | \
                                  bullist numlist outdent indent | removeformat | help"
                              }}
                              onChange={this.onChangeTinyMce}
                            />
                          </div>
                          <div className="form-group">
                            <label>Media Chapter</label>
                            <input
                              accept="image/*,video/*"
                              name="chapterVideo"
                              onChange={this.onChangeInput}
                              type="file"
                              placeholder="media chapter"
                              className="form-control"
                            />
                            <Form.Text>
                              Pastikan file berformat mp4, png, jpg, jpeg, atau
                              gif.
                            </Form.Text>
                          </div>

                          <button
                            style={{ marginTop: "50px" }}
                            type="submit"
                            className="btn btn-block btn-ideku f-w-bold"
                          >
                            Simpan
                          </button>
                        </form>
                      </div>
                      <button
                        type="button"
                        className="btn btn-block f-w-bold"
                        onClick={this.handleModalClose}
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
    );
	}

}