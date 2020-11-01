import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Card, FormControl, Badge } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';
import { Editor } from '@tinymce/tinymce-react';
import LoadingOverlay from 'react-loading-overlay';

import ReactPlayer from 'react-player';
import Joyride, { ACTIONS, EVENTS, STATUS } from "react-joyride";

import Viewer, { Worker, SpecialZoomLevel } from '@phuocng/react-pdf-viewer';
import '@phuocng/react-pdf-viewer/cjs/react-pdf-viewer.css';

import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';

import Moment from 'moment-timezone';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import TagsInput from 'react-tagsinput';
import 'react-tagsinput/react-tagsinput.css';

export default class ChapterPreview extends Component {

	state = {
		companyId: '',
    courseId: this.props.match.params.course_id,
    activeCard: this.props.match.params.course_id,
    quiz: [],
    course: {},
    courseID: '',
    courseTitle: '',
		chapters: [],

    currentChapt:'',
		chapterId: '',
		chapterNumber: '',
		chapterTitle: '',
		chapterBody: '',
    chapterVideo: '',
    attachmentId: [],
    thumbnail: '',

    waktuSelesai: new Date(),
    waktuMulai: new Date(),

    isModalChoose: false,
		isModalAdd: false,
    isModalHapus: false,

    isModalForum: false,
    tagsForum: [],

    isModalMeeting: false,
    coverMeeting: "",
    imgPreviewMeeting: "",
    roomName: "",
    optionsModerator: [],
    valueModerator: [],
    scheduled: false,
    startDate: new Date(),
    endDate: new Date(),
    
    isNotifikasi: false,
    isiNotifikasi: '',

		isLocalSteps: false,
		isLoading:false,
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

  toggleSwitchScheduled(checked) {
    this.setState({ scheduled:!this.state.scheduled });
  }

  closeNotifikasiChoose = e => {
    this.setState({ isModalChoose: false })
  }
  
  closeNotifikasi = e => {
    this.setState({ isNotifikasi: false, isiNotifikasi: '' })
  }

	onChangeTinyMce = e => {
    this.setState({ chapterBody: e.target.getContent().replace(/'/g, "\\'") });
  }

	onChangeInput = e => {
    const target = e.target;
		const name = e.target.name;
		const value = e.target.value;

		if(name === 'chapterVideo' || name === 'thumbnail') {
      // if (target.files[0].size <= 20000000) {
      if (target.files[0].size >= 0) {
        this.setState({ [name]: target.files[0] });
      } else {
        target.value = null;
        this.closeNotifikasi()
        this.setState({ isNotifikasi: true, isiNotifikasi: 'File tidak sesuai dengan format, silahkan cek kembali.' })
      }
		} else if (name === 'attachmentId') {
      this.setState({ [name]: e.target.files });
      console.log('ALVIN LAMPIRAN', this.state.attachmentId)
    } else {
			this.setState({ [name]: value });
		}
  }

  /** CLICK CHOOSE */
  handleModalChoose = e => {
    e.preventDefault();
    this.setState({ isModalChoose: true });
  }

  /** CLICK FORUM */
  handleModalForum = e => {
    e.preventDefault();
    this.setState({ isModalForum: true, isModalChoose: false });
  }

  /** CLICK MEETING */
  handleModalMeeting = e => {
    e.preventDefault();
    this.setState({ isModalMeeting: true, isModalChoose: false });
  }

	/** CLICK ADD */
	handleModalAdd = e => {
		e.preventDefault();
		this.setState({ isModalAdd: true, isModalChoose: false });
	}

  handleChangeDateFrom = date => {
    this.setState({
      startDate: date
    });
  }
  
  handleChangeDateEnd = date => {
    this.setState({
      endDate: date
    });
  }

  handleChangeWaktuMulai = d => {
    this.setState({ waktuMulai: d });
  }

  handleChangeWaktuSelesai = d => {
    this.setState({ waktuSelesai: d });
  }

	handleModalClose = e => {
		this.setState({ 
      isModalAdd: false, 
      isModalForum: false, 
      isModalMeeting: false, 
			isModalChoose: true,
			
      chapterId: '',
			chapterNumber: '',
			chapterTitle: '',
			chapterBody: '',
			chapterVideo: '',
			attachmentId: [],

      tagsForum: [],

      coverMeeting: "",
      imgPreviewMeeting: "",
      roomName: "",
      // optionsModerator: [],
      valueModerator: [],
      scheduled: false,
      startDate: new Date(),
      endDate: new Date(),

      waktuMulai: new Date(),
      waktuSelesai: new Date()
    });
	}

  handleChangeTagsForum(grade) {
    this.setState({tagsForum: grade});
  }

  onSubmitChapterMeeting = e => {
    e.preventDefault();
    if(this.state.chapterId !== "") {
      // action for edit
      let sDate = Moment.tz(this.state.startDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss");
      let eDate = Moment.tz(this.state.endDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss");
      let form = {
        course_id: this.state.courseId,
        company_id: this.state.companyId,
        chapter_title: this.state.chapterTitle,
        chapter_body: this.state.chapterBody,
        waktu_mulai: Moment.tz(this.state.waktuMulai, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
        waktu_selesai: Moment.tz(this.state.waktuSelesai, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
        moderator: this.state.valueModerator.length ? this.state.valueModerator[0] : null,
        start_date: this.state.scheduled ? sDate : null,
        end_date: this.state.scheduled ? eDate : null,
      };

      API.put(`${API_SERVER}v1/chapter/meeting/${this.state.chapterId}`, form).then(res => {
        if(res.status === 200){
          this.fetchDataChapter();
          this.handleModalClose();
          this.setState({ isLoading: false});
        }
      })

      if(this.state.chapterVideo !== "") {
        let form = new FormData();
        form.append('chapter_video', this.state.chapterVideo);
        this.setState({ isLoading: true, isModalForum: false, isModalChoose: false});
        this.setState({});
        API.put(`${API_SERVER}v1/chapter/video/${this.state.chapterId}`, form).then(res => {
          if(res.status === 200){
            this.fetchDataChapter();
            this.handleModalClose();
            this.setState({ isLoading: false});
          }
        })        
      }

    } else {
      // action for insert
      if(this.state.chapterVideo !== "") {
        let sDate = Moment.tz(this.state.startDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss");
        let eDate = Moment.tz(this.state.endDate, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss");
        let form = new FormData();
        form.append('course_id', this.state.courseId);
        form.append('company_id', this.state.companyId);
        form.append('chapter_title', this.state.chapterTitle);
        form.append('chapter_body', this.state.chapterBody);
        form.append('waktu_mulai', Moment.tz(this.state.waktuMulai, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"));
        form.append('waktu_selesai', Moment.tz(this.state.waktuSelesai, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"));
        form.append('chapter_video', this.state.chapterVideo);
        form.append('moderator', this.state.valueModerator.length ? this.state.valueModerator[0] : null);
        form.append('start_date', this.state.scheduled ? sDate : null);
        form.append('end_date', this.state.scheduled ? eDate : null);
    
        this.setState({ isModalForum: false, isModalChoose: false, isLoading: true });

        API.post(`${API_SERVER}v1/chapter/meeting`, form).then((res) => {
          if(res.status === 200){
            this.fetchDataChapter();
            this.handleModalClose();
            this.setState({ isLoading: false});
          }
        });
      } else {
        this.setState({ isNotifikasi: true, isiNotifikasi: 'Media chapter tidak boleh kosong, harus diisi.' })
      }
    }
  }

  onSubmitChapterForum = e => {
    e.preventDefault();
    if(this.state.chapterId !== "") {
      // action for edit
      let form = {
        course_id: this.state.courseId,
        company_id: this.state.companyId,
        tags: this.state.tagsForum,
        waktu_mulai: Moment.tz(this.state.waktuMulai, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
        waktu_selesai: Moment.tz(this.state.waktuSelesai, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
        chapter_title: this.state.chapterTitle,
        chapter_body: this.state.chapterBody,
      };

      API.put(`${API_SERVER}v1/chapter/forum/${this.state.chapterId}`, form).then(res => {
        if(res.status === 200){
          this.fetchDataChapter();
          this.handleModalClose();
          this.setState({ isLoading: false});
        }
      })

      if(this.state.chapterVideo !== "") {
        let form = new FormData();
        form.append('chapter_video', this.state.chapterVideo);
        this.setState({ isLoading: true, isModalForum: false, isModalChoose: false});
        this.setState({});
        API.put(`${API_SERVER}v1/chapter/video/${this.state.chapterId}`, form).then(res => {
          if(res.status === 200){
            this.fetchDataChapter();
            this.handleModalClose();
            this.setState({ isLoading: false});
          }
        })        
      }

    } else {
      // action for insert
      if(this.state.chapterVideo !== "") {
        let form = new FormData();
        form.append('course_id', this.state.courseId);
        form.append('company_id', this.state.companyId);
        form.append('waktu_mulai', Moment.tz(this.state.waktuMulai, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"));
        form.append('waktu_selesai', Moment.tz(this.state.waktuSelesai, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"));
        form.append('chapter_title', this.state.chapterTitle);
        form.append('chapter_body', this.state.chapterBody);
        form.append('chapter_video', this.state.chapterVideo);
        form.append('tags', this.state.tagsForum.toString());
    
        this.setState({ isModalForum: false, isModalChoose: false, isLoading: true });

        API.post(`${API_SERVER}v1/chapter/forum`, form).then((res) => {
          if(res.status === 200){
            this.fetchDataChapter();
            this.handleModalClose();
            this.setState({ isLoading: false, isModalForum: false, isModalChoose: true});
          }
        });
      } else {
        this.setState({ isNotifikasi: true, isiNotifikasi: 'Media chapter tidak boleh kosong, harus diisi.' })
      }
    }
  }

	onSubmitChapter = e => {
    e.preventDefault();
    // action for update
		if(this.state.chapterId !== "") {
			let form = {
				course_id: this.state.courseId,
				company_id: this.state.companyId,
				chapter_number: this.state.chapterNumber,
				chapter_title: this.state.chapterTitle,
				chapter_body: this.state.chapterBody,
        waktu_mulai: Moment.tz(this.state.waktuMulai, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
        waktu_selesai: Moment.tz(this.state.waktuSelesai, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"),
			}

			API.put(`${API_SERVER}v1/chapter/${this.state.chapterId}`, form).then(res => {
				if(res.status === 200){
					this.handleModalClose();
					this.fetchDataChapter();
				}
			})

			if(this.state.chapterVideo !== "") {
				let form = new FormData();
				form.append('chapter_video', this.state.chapterVideo);
        this.handleModalClose();
        this.setState({isLoading : true});
				API.put(`${API_SERVER}v1/chapter/video/${this.state.chapterId}`, form).then(res => {
					if(res.status === 200){
						this.fetchDataChapter();
            this.setState({isLoading : false});
					}
				})				
      }

      console.log('jumlah: ', this.state.attachmentId.length);

      if (this.state.attachmentId.length != 0) {
        let formData = new FormData();
        for (let i = 0; i < this.state.attachmentId.length; i++) {
          formData.append('attachment_id', this.state.attachmentId[i]);
        }
        API.put(`${API_SERVER}v1/chapter/attachment/${this.state.chapterId}`, formData).then(res => {
          if (res.status === 200) {
            this.handleModalClose();
            this.fetchDataChapter();
          }
        })
      }

      if (this.state.thumbnail !== "") {
        let form = new FormData();
        form.append("thumbnail", this.state.thumbnail);
        API.put(
          `${API_SERVER}v1/chapter/thumbnail/${this.state.chapterId}`,
          form
        ).then(res => {
          if (res.status === 200) {
            this.handleModalClose();
            this.fetchDataChapter();
          }
        });
      }
      
    // action for insert
		} else {
      if(this.state.chapterVideo !== "") {
        let form = new FormData();
        form.append('course_id', this.state.courseId);
        form.append('company_id', this.state.companyId);
        form.append('chapter_number', this.state.chapterNumber);
        form.append('chapter_title', this.state.chapterTitle);
        form.append('chapter_body', this.state.chapterBody);
        form.append('waktu_mulai', Moment.tz(this.state.waktuMulai, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"));
        form.append('waktu_selesai', Moment.tz(this.state.waktuSelesai, 'Asia/Jakarta').format("YYYY-MM-DD HH:mm:ss"));
        form.append('chapter_video', this.state.chapterVideo);
        form.append('attachment_id', null);

        this.handleModalClose();
        this.setState({isLoading : true});

        API.post(`${API_SERVER}v1/chapter`, form).then((res) => {
          if(res.status === 200){
            
            if (this.state.attachmentId.length != 0) {
              let formData = new FormData();
              for (let i = 0; i < this.state.attachmentId.length; i++) {
                formData.append('attachment_id', this.state.attachmentId[i]);
              }
              API.put(`${API_SERVER}v1/chapter/attachment/${res.data.result.chapter_id}`, formData).then(res => {
                if (res.status === 200) {
                  //nothing
                }
              })
            }

            if (this.state.thumbnail !== "") {
              let form = new FormData();
              form.append("thumbnail", this.state.thumbnail);
              API.put(
                `${API_SERVER}v1/chapter/thumbnail/${res.data.result.chapter_id}`,
                form
              ).then(res => {
                if (res.status === 200) {
                  console.log("res: ");
                }
              });
            }
            this.fetchDataChapter();
            this.setState({ isLoading: false });
          }
        })
      
      } else {
        this.setState({ isNotifikasi: true, isiNotifikasi: 'Media chapter tidak boleh kosong, harus diisi.' })
      }
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
          waktuMulai: Date.parse(res.data.result.waktu_mulai),
          waktuSelesai: Date.parse(res.data.result.waktu_selesai),
					chapterBody: res.data.result.chapter_body
				})
			}
		})
	}
	/** END CLICK EDIT CHAPTER */

  onClickEditChapterForum = e => {
    e.preventDefault();
    let chapterId = e.target.getAttribute('data-id');
    API.get(`${API_SERVER}v1/chapter/${chapterId}`).then(res => {
      if(res.status === 200) {
        this.setState({
          isModalForum: true, 
          chapterId: chapterId,
          chapterNumber: res.data.result.chapter_number,
          chapterTitle: res.data.result.chapter_title,
          chapterBody: res.data.result.chapter_body,
          waktuMulai: Date.parse(res.data.result.waktu_mulai),
          waktuSelesai: Date.parse(res.data.result.waktu_selesai),
          tagsForum: res.data.result.tags_forum.split(',')
        })
      }
    })
  }

  onClickEditChapterMeeting = e => {
    e.preventDefault();
    let chapterId = e.target.getAttribute('data-id');
    API.get(`${API_SERVER}v1/chapter/${chapterId}`).then(res => {
      if(res.status === 200) {
        console.log('RES: ', res.data)
        if(res.data.result.start_date) {
          this.setState({ scheduled: true })
        }

        this.setState({
          isModalMeeting: true, 
          chapterId: chapterId,
          chapterNumber: res.data.result.chapter_number,
          chapterTitle: res.data.result.chapter_title,
          chapterBody: res.data.result.chapter_body,
          waktuMulai: Date.parse(res.data.result.waktu_mulai),
          waktuSelesai: Date.parse(res.data.result.waktu_selesai),
          valueModerator: [res.data.result.moderator],
          startDate: Date.parse(res.data.result.start_date),
          endDate: Date.parse(res.data.result.end_date)
        })
      }
    })
  }

	fetchData() {
		API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200) {
				this.setState({ companyId: res.data.result.company_id });

				API.get(`${API_SERVER}v1/course/${this.state.courseId}`).then(res => {
					if(res.status === 200) {
						this.setState({ course: res.data.result, courseID: res.data.result.course_id, courseTitle: res.data.result.title })
					}
				})

				this.fetchDataChapter();

        if (this.state.optionsModerator.length == 0){

          API.get(`${API_SERVER}v1/user/company/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id}`).then(response => {
            response.data.result.map(item => {
              this.state.optionsModerator.push({value: item.user_id, label: item.name});
            });
          })

        }

			}
		})
  }

	fetchDataChapter() {
		API.get(`${API_SERVER}v1/chapter/course/${this.state.courseId}`).then(res => {
			if(res.status === 200) {
				this.setState({ chapters: res.data.result });
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

	componentDidMount() {
		this.fetchData()
		let isTourChapter = localStorage.getItem("isTourChapter");
    if (isTourChapter) {
      this.setState({ isLocalSteps: true });
    }
  }
  
  pilihChapterTampil = e => {
    e.preventDefault();
    const chapterId = e.target.getAttribute('data-id');
    this.setState({activeCard: chapterId});
    API.get(`${API_SERVER}v1/chapter/${chapterId}`).then(res => {
      if(res.status === 200) {
        let courseChapter = {
          image: res.data.result.chapter_video,
          title: res.data.result.chapter_title,
          body: res.data.result.chapter_body,
          attachments: res.data.result.attachment_id,
          thumbnail: res.data.result.thumbnail
        }
        this.setState({ course: courseChapter })
      }
    })
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
  }

  pilihOverviewChapter = e => {
    e.preventDefault();
    this.setState({activeCard: this.state.courseID});
    API.get(`${API_SERVER}v1/course/${this.state.courseID}`).then(res => {
      if (res.status === 200) {
        this.setState({
          course: res.data.result,
        });
      }
    });
  }

	render() {
    const {chapters, course, quiz} = this.state;
    
    console.log('state: ', this.state);

		const CheckMedia = ({ media, thumbnail }) => {
			if (media) {
				let ekSplit = media.split('.');
				let ektension = ekSplit[ekSplit.length - 1];
				if (ektension === "jpg" || ektension === "png" || ektension === "jpeg") {
					return (
						<img class="img-fluid rounded" src={media} alt="" style={{ marginBottom: '20px', width: '100%' }} />
					)
        }
        else if (ektension === "pdf") {
          return(
            <div style={{height:850}}>
              <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.3.200/pdf.worker.min.js">
                <Viewer fileUrl={media} defaultScale={SpecialZoomLevel.PageFit} />
              </Worker>
            </div>
          )
        }
        else {
					return (
            <div style={{ position: "relative", paddingTop: "56.25%" }}>
              <ReactPlayer
                style={{ position: "absolute", top: "0", left: "0" }}
                url={media}
                light={thumbnail ? thumbnail : `https://media.istockphoto.com/videos/play-button-blue-video-id472605657?s=640x640`}
                volume="1"
                controls
                height="100%"
                width="100%"
              />
            </div>
          );
				}
			}

			return null
		}

		let refactoryChapters = [...chapters];
    for (let i = 0; i < quiz.length; i++) {
      for (let j = 0; j < chapters.length; j++) {
        if (quiz[i].quiz_at === chapters[j].chapter_id) {
          if (j === 0) {
            refactoryChapters.splice(
              chapters.indexOf(chapters[j]) + 1,
              0,
              quiz[i]
            );
          } else {
            refactoryChapters.splice(
              chapters.indexOf(chapters[j]) + 1 + i,
              0,
              quiz[i]
            );
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
                  <Card className={`card-active`}>
                    <Card.Body data-id={item.exam_id}>
                      <h3
                        className="f-18 f-w-800"
                        style={{ marginBottom: "0px" }}
                        data-iterasi={i}
                        data-id={item.exam_id}
                      >
                        <Form.Text>Quiz</Form.Text>
                        {item.exam_title}
                      </h3>
                    </Card.Body>
                  </Card>
                );
              } else {
                return (
                  <Card
                    style={Number(this.state.activeCard) === Number(item.chapter_id) ? {backgroundColor: '#dcdcdc'} : {}}
                    onClick={this.pilihChapterTampil}
                    className={`card-active`}
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
                        <Form.Text style={{float: 'right'}} data-id={item.chapter_id}>
                          {item.jenis_pembelajaran == "forum" ? "Forum" : item.jenis_pembelajaran == "group meeting" ? "Meeting" : "Media"}
                        </Form.Text>
                        {item.chapter_title}
                      </h3>
                      <Link to="#" className="buttonku" title="Edit">
                        <i
                          onClick={item.jenis_pembelajaran == "media" ? this.onClickEditChapter : item.jenis_pembelajaran == "forum" ? this.onClickEditChapterForum : this.onClickEditChapterMeeting}
                          data-id={item.chapter_id}
                          className="fa fa-edit"
                        ></i>
                      </Link>
                      <Link to="#" className="buttonku" title="Hapus">
                        <i
                          onClick={this.onClickHapusChapter}
                          data-id={item.chapter_id}
                          className="fa fa-trash"
                        ></i>
                      </Link>
                    </Card.Body>
                  </Card>
                );
              }
            })}
          </div>
        );
      } else {
        return (
          <Card style={{ marginTop: "10px" }}>
            <Card.Body>Belum ada chapter</Card.Body>
          </Card>
        );
      }
    };

    const Attachments = ({ media }) => {
      if (media) {
        let pecah = media.split(",");
        return (
          <div>
            {pecah.map((item, i) => (
              <a
                href={item}
                target="_blank"
                className="btn btn-ideku"
                style={{ marginRight: "10px" }}
              >
                Attachments {i + 1}
              </a>
            ))}
          </div>
        );
      }
      return null;
    };

		const dateFormat = new Date(course.created_at);

		return (

      <div className="pcoded-main-container">
      <LoadingOverlay
       active={this.state.isLoading}
       spinner
       text='Uploading...'
       >
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <div className="row">
                    <div className="col-xl-12">
                      <Link
                        to={`/kursus-materi-edit/${this.state.courseId}`}
                        className="btn btn-ideku buttonku"
                        title="Quiz"
                      >
                        <i className="fa fa-edit"></i>
                        Kursus
                      </Link>
                      <Link
                        // onClick={this.handleModalAdd}
                        onClick={this.handleModalChoose}
                        className="btn btn-ideku buttonku buat-chapter"
                      >
                        <i className="fa fa-plus"></i>
                        Chapter
                      </Link>
                      <Link
                        to={`/quiz/${this.state.courseId}`}
                        className="btn btn-ideku buttonku buat-quiz"
                        title="Quiz"
                      >
                        <i className="fa fa-plus"></i>
                        Quiz
                      </Link>
                      <Link
                        to={`/exam/${this.state.courseId}`}
                        className="btn btn-ideku buttonku buat-ujian"
                        title="Ujian"
                      >
                        <i className="fa fa-plus"></i>
                        Ujian
                      </Link>
                    </div>
                  </div>

                  <div className="row">
                    {!this.state.isLocalSteps && (
                      <Joyride
                        callback={this.handleJoyrideCallback}
                        steps={this.state.steps}
                        continuous="true"
                      />
                    )}
                    <div className="col-xl-8">
                      <h3
                        className="f-24 f-w-800 mb-3"
                        style={{ marginTop: "20px" }}
                      >
                        {course.title}
                      </h3>

                      {course.type && (
                        <Badge variant="success" style={{ padding: "6px" }}>
                          {course.type}
                        </Badge>
                      )}

                      {course.category_name && (
                        <p class="lead">
                          Kategori&nbsp;
                          <Badge variant="info" style={{ padding: "10px" }}>
                            {course.category_name}
                          </Badge>
                        </p>
                      )}

                      {course.created_at && (
                        <p>Posted on {dateFormat.toString().slice(0, 21)}</p>
                      )}

                      <CheckMedia media={course.image} thumbnail={course.thumbnail} />

                      <br />
                      <br />

                      {course.caption && <p class="lead">{course.caption}</p>}

                      {course.body && (
                        <div
                          dangerouslySetInnerHTML={{ __html: course.body }}
                        />
                      )}

                      {course.attachments && (
                        <div style={{ marginBottom: "30px" }}>
                          <Attachments media={course.attachments} />
                        </div>
                      )}
                    </div>

                    <div className="col-xl-4">
                      <Card
                        style={Number(this.state.activeCard) === Number(this.state.courseID) ? {backgroundColor: '#dcdcdc'} : {}}
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

                  {
                    // Modal For Notifikasi
                    // Notifikasi hapus chapter
                  }
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

                  {
                    // Modal For Forum
                    // Create Media Forum
                  }
                  <Modal
                    show={this.state.isModalForum}
                    onHide={this.handleModalClose}
                    dialogClassName="modal-lg"
                  >
                    <Modal.Body>
                      <Modal.Title className="text-c-purple3 f-w-bold">
                        Forum
                      </Modal.Title>

                      <Form>
                        <Form.Group controlId="formJudul">
                          <label>Cover Forum</label>
                            <input
                              accept="image/*,video/*,application/pdf"
                              name="chapterVideo"
                              id="chapterVideo"
                              onChange={this.onChangeInput}
                              type="file"
                              placeholder="media chapter"
                              className="form-control"
                            />
                            <label style={{color:'#000', padding:'5px 10px'}}>{this.state.chapterVideo.name === null ? 'Pilih File' : this.state.chapterVideo.name }</label>
                            <Form.Text>
                              {!this.state.chapterId && (
                                <span
                                  style={{ color: "red", fontWeight: "bold" }}
                                >
                                  Required &nbsp;
                                </span>
                              )}
                              Pastikan file berformat mp4, png, jpg, jpeg, gif, atau pdf 
                              {/* dan ukuran file tidak melebihi 20MB. */}
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Judul Forum
                          </Form.Label>
                          <FormControl
                            type="text"
                            placeholder="Judul Forum"
                            value={this.state.chapterTitle}
                            onChange={e =>
                              this.setState({ chapterTitle: e.target.value })
                            }
                          />
                          <Form.Text className="text-muted">
                            Buat judul yang menarik.
                          </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formIsi">
                          <Form.Label className="f-w-bold">
                            Isi Forum
                          </Form.Label>

                          <FormControl
                            as="textarea"
                            rows="5"
                            placeholder="Isi Forum"
                            value={this.state.chapterBody}
                            onChange={e =>
                              this.setState({ chapterBody: e.target.value })
                            }
                          />
                          <Form.Text className="text-muted">
                            Jelaskan isi dari forum, peraturan, atau yang lain.
                          </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formTag">
                          <Form.Label className="f-w-bold">
                            Tag Forum
                          </Form.Label>
                          <TagsInput
                            value={this.state.tagsForum}
                            onChange={this.handleChangeTagsForum.bind(this)}
                            addOnPaste={true}
                            inputProps={{placeholder:'Tag Forum'}}
                          />
                          <Form.Text className="text-muted">
                            Jika lebih dari 1 hubungkan dengan [enter]
                          </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Waktu Mulai & Selesai
                          </Form.Label>
                          <div style={{width:'100%'}}>
                          <DatePicker
                            selected={this.state.waktuMulai}
                            onChange={this.handleChangeWaktuMulai}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm"
                          />
                          &nbsp;&mdash;&nbsp;
                          <DatePicker
                            selected={this.state.waktuSelesai}
                            onChange={this.handleChangeWaktuSelesai}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm"
                          />
                          </div>
                          <Form.Text className="text-muted">
                            Pilih waktu mulai dan selesai untuk chapter.
                          </Form.Text>
                        </Form.Group>

                        <div style={{ marginTop: "20px" }}>
                          <button
                            type="button"
                            onClick={this.onSubmitChapterForum}
                            className="btn btn-primary f-w-bold"
                          >
                            Simpan
                          </button>
                          <button
                            type="button"
                            className="btn ml-3 f-w-bold"
                            onClick={this.handleModalClose}
                          >
                            Tutup
                          </button>
                        </div>
                      </Form>
                    </Modal.Body>
                  </Modal>

                  {
                    // Modal For Media
                    // Create Media Chapter
                  }
                  <Modal
                    show={this.state.isModalAdd}
                    onHide={this.handleModalClose}
                    dialogClassName="modal-xlg"
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
                            <Form.Text>
                              <span
                                style={{ color: "red", fontWeight: "bold" }}
                              >
                                Required &nbsp;
                              </span>
                              Isi dengan nomor angka.
                            </Form.Text>
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
                            <Form.Text>
                              <span
                                style={{ color: "red", fontWeight: "bold" }}
                              >
                                Required &nbsp;
                              </span>
                              Isi dengan judul
                            </Form.Text>
                          </div>
                          <div className="form-group">
                            <label>Media Chapter</label>
                            <input
                              accept="image/*,video/*,application/pdf"
                              name="chapterVideo"
                              id="chapterVideo"
                              onChange={this.onChangeInput}
                              type="file"
                              placeholder="media chapter"
                              className="form-control"
                            />
                            <label style={{color:'#000', padding:'5px 10px'}}>{this.state.chapterVideo.name === null ? 'Pilih File' : this.state.chapterVideo.name }</label>
                            <Form.Text>
                              {!this.state.chapterId && (
                                <span
                                  style={{ color: "red", fontWeight: "bold" }}
                                >
                                  Required &nbsp;
                                </span>
                              )}
                              Pastikan file berformat mp4, png, jpg, jpeg, gif, atau pdf 
                              {/* dan ukuran file tidak melebihi 20MB. */}
                            </Form.Text>
                          </div>
                          <div className="form-group">
                            <label>Thumbnail Chapter</label>
                            <input
                              accept="image/*"
                              name="thumbnail"
                              onChange={this.onChangeInput}
                              type="file"
                              placeholder="thumbnail chapter"
                              className="form-control"
                            />
                            <label style={{color:'#000', padding:'5px 10px'}}>{this.state.thumbnail.name === null ? 'Pilih File' : this.state.thumbnail.name }</label>
                            <Form.Text>
                              {!this.state.chapterId && (
                                <span
                                  style={{ color: "red", fontWeight: "bold" }}
                                >
                                  Required &nbsp;
                                </span>
                              )}
                              Pastikan file berformat png, jpg, jpeg, atau gif 
                              {/* dan ukuran file tidak melebihi 20MB. */}
                            </Form.Text>
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
                                  // eslint-disable-next-line no-multi-str
                                  "undo redo | formatselect | bold italic backcolor | \
                                 alignleft aligncenter alignright alignjustify | \
                                  bullist numlist outdent indent | removeformat | help"
                              }}
                              onChange={this.onChangeTinyMce}
                            />
                          </div>
                          <div className="form-group">
                            <label>Lampiran</label>
                            <input
                              accept="application/pdf"
                              name="attachmentId"
                              onChange={this.onChangeInput}
                              type="file"
                              multiple
                              placeholder="media chapter"
                              className="form-control"
                            />
                            <label style={{color:'#000', padding:'5px 10px'}}>{ this.state.attachmentId.length } File</label>
                            <Form.Text>
                              Bisa banyak file, pastikan file berformat pdf 
                              {/* dan ukuran file tidak melebihi 20MB. */}
                            </Form.Text>
                          </div>

                          <Form.Group controlId="formJudul">
                            <Form.Label className="f-w-bold">
                              Waktu Mulai & Selesai
                            </Form.Label>
                            <div style={{width:'100%'}}>
                            <DatePicker
                              selected={this.state.waktuMulai}
                              onChange={this.handleChangeWaktuMulai}
                              showTimeSelect
                              dateFormat="yyyy-MM-dd HH:mm"
                            />
                            &nbsp;&mdash;&nbsp;
                            <DatePicker
                              selected={this.state.waktuSelesai}
                              onChange={this.handleChangeWaktuSelesai}
                              showTimeSelect
                              dateFormat="yyyy-MM-dd HH:mm"
                            />
                            </div>
                            <Form.Text className="text-muted">
                              Pilih waktu mulai dan selesai untuk chapter.
                            </Form.Text>
                          </Form.Group>

                          <button
                            style={{ marginTop: "50px" }}
                            type="submit"
                            className="btn btn-primary f-w-bold"
                          >
                            Simpan
                          </button>
                          <button
                            style={{ marginTop: "50px" }}
                            type="button"
                            className="btn f-w-bold ml-3"
                            onClick={this.handleModalClose}
                          >
                            Tutup
                          </button>
                        </form>
                      </div>
                    </Modal.Body>
                  </Modal>

                  {
                    // Modal For Notifikasi
                    // Any Message
                  }
                  <Modal
                    show={this.state.isNotifikasi}
                    onHide={this.closeNotifikasi}
                  >
                    <Modal.Body>
                      <Modal.Title className="text-c-purple3 f-w-bold">
                        Notifikasi
                      </Modal.Title>

                      <p style={{ color: "black", margin: "20px 0px" }}>
                        {this.state.isiNotifikasi}
                      </p>

                      <button
                        type="button"
                        className="btn btn-block f-w-bold"
                        onClick={this.closeNotifikasi}
                      >
                        Mengerti
                      </button>
                    </Modal.Body>
                  </Modal>

                  {
                    // Modal For Meeting
                    // Create Media Meeting
                  }
                  <Modal
                    show={this.state.isModalMeeting}
                    onHide={this.handleModalClose}
                  >
                    <Modal.Body>
                      <Modal.Title className="text-c-purple3 f-w-bold">
                        Group Meeting
                      </Modal.Title>
                      <Form>
                        <Form.Group controlId="formJudul">
                          <label>Cover Meeting</label>
                          <input
                            accept="image/*,video/*,application/pdf"
                            name="chapterVideo"
                            id="chapterVideo"
                            onChange={this.onChangeInput}
                            type="file"
                            placeholder="media chapter"
                            className="form-control"
                          />
                          <label style={{color:'#000', padding:'5px 10px'}}>{this.state.chapterVideo.name === null ? 'Pilih File' : this.state.chapterVideo.name }</label>
                          <Form.Text>
                            {!this.state.chapterId && (
                              <span
                                style={{ color: "red", fontWeight: "bold" }}
                              >
                                Required &nbsp;
                              </span>
                            )}
                            Pastikan file berformat mp4, png, jpg, jpeg, gif, atau pdf 
                            {/* dan ukuran file tidak melebihi 20MB. */}
                          </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Judul Meeting
                          </Form.Label>
                          <FormControl
                            type="text"
                            placeholder="Judul"
                            value={this.state.chapterTitle}
                            onChange={e =>
                              this.setState({ chapterTitle: e.target.value })
                            }
                          />
                          <Form.Text className="text-muted">
                            Judul tidak boleh menggunakan karakter spesial
                          </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Moderator
                          </Form.Label>
                          <MultiSelect
                            id="moderator"
                            options={this.state.optionsModerator}
                            value={this.state.valueModerator}
                            onChange={valueModerator => this.setState({ valueModerator })}
                            mode="single"
                            enableSearch={true}
                            resetable={true}
                            valuePlaceholder="Pilih Moderator"
                          />
                          <Form.Text className="text-muted">
                            Pengisi kelas, moderator, atau speaker.
                          </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Waktu Mulai & Selesai
                          </Form.Label>
                          <div style={{width:'100%'}}>
                          <DatePicker
                            selected={this.state.waktuMulai}
                            onChange={this.handleChangeWaktuMulai}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm"
                          />
                          &nbsp;&mdash;&nbsp;
                          <DatePicker
                            selected={this.state.waktuSelesai}
                            onChange={this.handleChangeWaktuSelesai}
                            showTimeSelect
                            dateFormat="yyyy-MM-dd HH:mm"
                          />
                          </div>
                          <Form.Text className="text-muted">
                            Pilih waktu mulai dan selesai untuk chapter.
                          </Form.Text>
                        </Form.Group>

                        <div style={{ marginTop: "20px" }}>
                          <button onClick={this.onSubmitChapterMeeting} type="button" className="btn btn-primary f-w-bold mr-3">
                            Simpan
                          </button>
                          &nbsp;
                          <button
                            type="button"
                            className="btn f-w-bold"
                            onClick={this.handleModalClose}
                          >
                            Tutup
                          </button>
                        </div>
                      </Form>
                    </Modal.Body>
                  </Modal>

                  {
                    // Modal For Choose 
                    // Media Pembelajaran
                  }
                  <Modal
                    show={this.state.isModalChoose}
                    onHide={this.closeNotifikasiChoose}
                  >
                    <Modal.Body>
                      <Modal.Title className="text-c-purple3 f-w-bold">
                        Pilih Jenis Pembelajaran
                      </Modal.Title>

                      <button
                        style={{ marginTop: "30px" }}
                        type="button"
                        onClick={this.handleModalAdd}
                        className="btn mr-3 btn-ideku f-w-bold"
                      >
                        Media
                      </button>

                      <button
                        style={{ marginTop: "30px" }}
                        type="button"
                        onClick={this.handleModalForum}
                        className="btn mr-3 btn-ideku f-w-bold"
                      >
                        Forum
                      </button>

                      <button
                        style={{ marginTop: "30px" }}
                        type="button"
                        onClick={this.handleModalMeeting}
                        className="btn btn-ideku f-w-bold"
                      >
                        Group Meeting
                      </button>
                    </Modal.Body>
                  </Modal>
                </div>
              </div>
            </div>
          </div>
        </div>
    </LoadingOverlay>
      </div>
    );
	}

}