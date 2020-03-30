import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Card, Button, Row, Col, ListGroup, InputGroup, FormControl } from "react-bootstrap";
import {
	_postLIstAllForum,
	_addforum, 
	_handleKeyPress
} from './_forum';
import Storage from '../../repository/storage';
import Moment from 'react-moment';
import SideForum from './side-forum';

export default class Forum extends Component {

	state = {
		forums: [],
		isForumAdd: false,
		user : {},
		user_id: Storage.get('user').data.user_id,
		companyId:'',
		title: '',
		tags: '',
		body: '',
		imgFile: '',
    imgPreview: '',

    listTags : [],
    
		isNotifikasi: false, 
    isiNotifikasi:'',
    
    findForumInput: ''
	}

	openModalForumAdd = e => {
		this.setState({ isForumAdd: true })
	}

	closeModalForumAdd = e => {
		this.setState({ isForumAdd: false, imgFile: '', imgPreview: '' })
	}

	componentWillMount() {
		this.fetchData();
		// let forums = [
		// 	{judul: 'Judul 1', update: 'Last update 1 days ago 02/02/2020', isi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', komentar: 30},
		// 	{judul: 'Judul 2', update: 'Last update 2 days ago 02/02/2020', isi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', komentar: 20},
		// 	{judul: 'Judul 3', update: 'Last update 3 days ago 02/02/2020', isi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', komentar: 10},
		// ];

		// this.setState({ forums: forums })
  }
  
  fetchData() {
    _postLIstAllForum.bind(this)();
  }

	closeNotifikasi = e => {
		this.setState({ isNotifikasi: false, isiNotifikasi: '' })
	}

	handleChange = (e) => {
		console.log(e.target)// 
		if (e.target.files[0].size <= 50000) {
			this.setState({
        imgFile: e.target.files[0],
        imgPreview: URL.createObjectURL(e.target.files[0])
      });
		} else {
			e.target.value = null;
			this.setState({ isNotifikasi: true, isiNotifikasi: 'File tidak sesuai dengan format, silahkan cek kembali.' })
		}
	}

	showDiscussion(follow){
		return console.log("show", follow);

  }
  
  findForum = (e) => {
    e.preventDefault();
    this.setState({findForumInput : e.target.value});
  }


	// LIST FORUM SEMUA 
	render() {
    var { forums, findForumInput } = this.state;
    
    if(findForumInput != ""){

      forums = forums.filter(x=>
        JSON.stringify(
          Object.values(x)
        ).replace(
          /[^\w ]/g,''
        ).match(new RegExp(findForumInput,"gmi"))
      );
      console.log(forums)
    }

		const ForumList = ({lists}) => {
			if(lists.length !== 0) {
				return(
					<div>
						{
							lists.map((item, i) => (
								<Card style={{marginBottom: '10px'}} key={i}>
									<Link to={`/forum-detail/${item.forum_id}`} style={{color: 'rgba(109,114,120,0.8)'}}>
										<Card.Body style={{padding: '16px'}}>
											<div className="forum-media">
												<img src={!item.cover ? `/assets/images/component/p5.jpg` : item.cover} alt="media" className="img-fluid mr-3 forum-gambar" style={{marginBottom: '15px'}} />
											</div>

											<div className="forum-body">
												<h3 className="f-16 f-w-800" style={{marginBottom: '0'}}>{item.title}</h3>
												<span className="f-12" style={{marginBottom: '3px'}}>{item.tags} - <Moment format="DD/MM/YYYY">{item.created_at}</Moment></span>

												<p style={{margin: '5px 0'}} className="f-13">
													{item.body}
													</p>
											</div>

											<div className="forum-action">
                        {item.kunci === 0 ? 
                          <i className="fa fa-star"></i>
                          :
                          <Link to='#'><i className="fa fa-star"></i></Link>
                        }
											
												<Link to='#' style={{marginLeft: '10px'}}>
													<i className="fa fa-comments"></i> &nbsp; {item.komentar} Komentar
												</Link>

											</div>
										</Card.Body>
									</Link>
								</Card>
							))
						}
					</div>
				)
			} else {
				return(
					<Card style={{marginBottom: '10px'}}>

            {findForumInput != '' 
              ? <Card.Body style={{padding: '16px'}}><span>Tidak ditemukan forum {findForumInput}</span></Card.Body>
              :  <Card.Body style={{padding: '16px'}}>
                  <div className="forum-media">
                    <img src="/assets/images/component/p5.jpg" className="img-fluid mr-3 forum-gambar" alt="media" />
                  </div>

                  <div className="forum-body">
                      <h3 className="f-16 f-w-800" style={{marginBottom: '0'}}>Tidak Ada Forum</h3>
                      <span className="f-12" style={{marginBottom: '3px'}}>Undefined</span>

                      <p style={{margin: '5px 0'}} className="f-13">
                        Undefined
                        </p>
                      </div>

                      <div className="forum-action">
                        <Link to='#'>
                          <i className="fa fa-star"></i>
                        </Link>
                        <Link to='#' style={{marginLeft: '10px'}}>
                          <i className="fa fa-comments"></i> &nbsp; 0 Komentar
                        </Link>
                      </div>
                </Card.Body>
            }
					</Card>
				)
			}
		}

		return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <Row>
                    <Col sm={8}>
                      <h3 className="f-20 f-w-800 mb-3">Forum</h3>

                      <div
                        className="col-md-12 col-xl-12"
                        style={{ marginBottom: "42px", marginLeft: "-16px" }}
                      >
                        <InputGroup className="mb-3">
                          <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">
                              <i className="fa fa-search"></i>
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                          <FormControl
                            onChange={this.findForum}
                            placeholder="Cari Forum Lain"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                          />
                          <InputGroup.Append style={{ cursor: "pointer" }}>
                            <InputGroup.Text id="basic-addon2">
                              Pencarian
                            </InputGroup.Text>
                          </InputGroup.Append>
                        </InputGroup>

                        <Row>
                          <div className="col-md-4 col-xl-4 mb-3">
                            <Link to={`/`}>
                              <div className="kategori title-disabled">
                                <img
                                  src="/assets/images/component/kursusoff.png"
                                  className="img-fluid"
                                  alt="media"
                                />
                                &nbsp; Kursus & Materi
                              </div>
                            </Link>
                          </div>

                          <div className="col-md-4 col-xl-4 mb-3">
                            <Link to={`/forum`}>
                              <div className="kategori-aktif">
                                <img
                                  src="/assets/images/component/forumon.png"
                                  className="img-fluid"
                                  alt="media"
                                />
                                &nbsp; Forum
                              </div>
                            </Link>
                          </div>

                          <div className="col-md-4 col-xl-4 mb-3">
                            <Link to={`/liveclass`}>
                              <div className="kategori title-disabled">
                                <img
                                  src="/assets/images/component/liveoff.png"
                                  className="img-fluid"
                                  alt="media"
                                />
                                &nbsp; Group Meeting
                              </div>
                            </Link>
                          </div>
                        </Row>

                        <Row>
                          <div className="col-md-12 col-xl-12 mb-3 mt-2">
                            <div className="row d-flex align-items-center">
                              <div className="col-4">
                                <Form.Control as="select">
                                  <option>Terbaru</option>
                                  <option>Trending</option>
                                </Form.Control>
                              </div>
                              <div className="col-8 text-right">
                                <p className="m-b-0">
                                  <span className="f-w-600 f-16">
                                    Lihat Semua
                                  </span>
                                </p>
                              </div>
                            </div>
                          </div>
                        </Row>

                        <Row>
                          <Col sm={12} md={12} xl={12}>
                            <ForumList lists={forums} />
                          </Col>
                        </Row>
                      </div>
                    </Col>

                    <Col sm={4}>
                      <SideForum/>
                    </Col>
                  </Row>

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

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
	}
}
