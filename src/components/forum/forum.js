import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Card, Button, Row, Col, ListGroup, InputGroup, FormControl } from "react-bootstrap";
import {
	_postLIstAllForum,
	_addforum, 
	_handleKeyPress
} from './_forum';
import Storage from '../../repository/storage';

export default class Forum extends Component {

	state = {
		forums: [],
		isForumAdd: false,

		user_id: Storage.get('user').data.user_id,
		company_id:'',
		title: '',
		tags: '',
		body: '',
		imgFile: '',
		isNotifikasi: false, 
		isiNotifikasi:'',

	}

	openModalForumAdd = e => {
		this.setState({ isForumAdd: true })
	}

	closeModalForumAdd = e => {
		this.setState({ isForumAdd: false })
	}

	componentWillMount() {
		
		_postLIstAllForum.bind(this)();
		// let forums = [
		// 	{judul: 'Judul 1', update: 'Last update 1 days ago 02/02/2020', isi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', komentar: 30},
		// 	{judul: 'Judul 2', update: 'Last update 2 days ago 02/02/2020', isi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', komentar: 20},
		// 	{judul: 'Judul 3', update: 'Last update 3 days ago 02/02/2020', isi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', komentar: 10},
		// ];

		// this.setState({ forums: forums })
	}

	closeNotifikasi = e => {
		this.setState({ isNotifikasi: false, isiNotifikasi: '' })
	}

	handleChange = (e) => {
		console.log(e.target)// 
		if (e.target.files[0].size <= 50000) {
		this.setState({ imgFile: e.target.files[0]  });
		} else {
		e.target.value = null;
		this.setState({ isNotifikasi: true, isiNotifikasi: 'File tidak sesuai dengan format, silahkan cek kembali.' })
		}
	
	}

	showDiscussion(follow){
		return console.log("show", follow);
	}


	// LIST FORUM SEMUA 
	render() {
		const { forums } = this.state;

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
												<img src="/assets/images/component/p5.jpg" className="img-fluid mr-3 forum-gambar" />
											</div>

											<div className="forum-body">
												<h3 className="f-16 f-w-800" style={{marginBottom: '0'}}>{item.title}</h3>
												<span className="f-12" style={{marginBottom: '3px'}}>{item.tags} {item.created_at}</span>

												<p style={{margin: '5px 0'}} className="f-13">
													{item.body}
													</p>
											</div>

											<div className="forum-action">
												<Link to='#'>
													<i className="fa fa-star"></i>

												</Link>
											
												<Link to='#' style={{marginLeft: '10px'}}>
													<i className="fa fa-comments"></i> &nbsp; 99999 Komentar
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
						<Card.Body style={{padding: '16px'}}>
							<div className="forum-media">
								<img src="/assets/images/component/p5.jpg" className="img-fluid mr-3 forum-gambar" />
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
					</Card>
				)
			}
		}

		return(
			<div className="pcoded-main-container">
				<div className="pcoded-wrapper">
				<div className="pcoded-content">
					<div className="pcoded-inner-content">
					<div className="main-body">
						<div className="page-wrapper">

							<Row>
								<Col sm={8}>
								<h3 className="f-20 f-w-800 mb-3">Forum</h3>

								<div className="col-md-12 col-xl-12" style={{marginBottom: '42px', marginLeft: '-16px'}}>
								<InputGroup className="mb-3">
								<InputGroup.Prepend>
									<InputGroup.Text id="basic-addon1">
									<i className="fa fa-search"></i>
									</InputGroup.Text>
								</InputGroup.Prepend>
								<FormControl
									placeholder="Cari Forum Lain"
									aria-label="Username"
									aria-describedby="basic-addon1"
								/>
								<InputGroup.Append style={{cursor: 'pointer'}}>
									<InputGroup.Text id="basic-addon2">Pencarian</InputGroup.Text>
								</InputGroup.Append>
								</InputGroup>

								<Row>
								<div className="col-md-4 col-xl-4 mb-3">
									<Link to={`/`}>
									<div className="kategori">
										<img src="/assets/images/component/kursusoff.png" className="img-fluid" />
										&nbsp;
										Kursus & Materi
									</div>
									</Link>
								</div>

								<div className="col-md-4 col-xl-4 mb-3">
									<Link to={`/forum`}>
									<div className="kategori-aktif">
										<img src="/assets/images/component/forumon.png" className="img-fluid" />
										&nbsp;
										Forum
									</div>
									</Link>
								</div>

								<div className="col-md-4 col-xl-4 mb-3">
									<Link to={`/liveclass`}>
									<div className="kategori">
										<img src="/assets/images/component/liveoff.png" className="img-fluid" />
										&nbsp;
										Live Class
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
												<span className="f-w-600 f-16">Lihat Semua</span>
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
									<Card>
										<Card.Body>
											<Button onClick={this.openModalForumAdd} className="btn-block btn-primary"><i className="fa fa-plus"></i> &nbsp; Membuat Forum</Button>

											<div className="forum-filter">
												<ListGroup>
																<ListGroup.Item onClick={this.showDiscussion.bind(this,"all")}>
																	<i className="fa fa-comments" style={{color:"blue"}}></i> &nbsp; Semua Diskusi Forum
																</ListGroup.Item>
																<ListGroup.Item onClick={this.showDiscussion.bind(this,"following")}>
																	<i className="fa fa-star"></i> &nbsp; Mengikuti
																</ListGroup.Item>
																</ListGroup>	
											</div>

											<hr/>

											<div className="forum-kategori">
											<h3 className="f-16 f-w-800 mb-3">
												Kategori Forum
												</h3>
												<Row>
													<Col sm={6}>
														<ul className="forum-kategori-list">
															<li className="forum-item"><i className="fa fa-comments"></i> &nbsp; Design</li>
															<li className="forum-item"><i className="fa fa-comments"></i> &nbsp; Marketing</li>
															<li className="forum-item"><i className="fa fa-comments"></i> &nbsp; Teknologi</li>
														</ul>
													</Col>
													<Col sm={6}>
														<ul className="forum-kategori-list">
															<li className="forum-item"><i className="fa fa-comments"></i> &nbsp; Sales</li>
															<li className="forum-item"><i className="fa fa-comments"></i> &nbsp; Otomotif</li>
															<li className="forum-item"><i className="fa fa-comments"></i> &nbsp; Arsitektur</li>
														</ul>
													</Col>
												</Row>
											</div>

											<hr/>

										</Card.Body>
									</Card>
								</Col>
							</Row>

							<Modal show={this.state.isNotifikasi} onHide={this.closeNotifikasi}>
								<Modal.Body>
									<Modal.Title className="text-c-purple3 f-w-bold">Notifikasi</Modal.Title>

									<p style={{ color: 'black', margin: '20px 0px' }}>{this.state.isiNotifikasi}</p>

									<button type="button"
									className="btn btn-block f-w-bold"
									onClick={this.closeNotifikasi}>
									Mengerti
									</button>
								</Modal.Body>
							</Modal>

							<Modal show={this.state.isForumAdd} onHide={this.closeModalForumAdd} dialogClassName="modal-lg">
							<Modal.Body>
							<Modal.Title className="text-c-purple3 f-w-bold f-21" style={{marginBottom: '30px'}}>Membuat Forum</Modal.Title>
							
								<Form>
									<Form.Group controlId="formJudul">
										<img src={this.state.imgFile === '' ? "/assets/images/component/placeholder-image.png" : this.state.imgFile} className="img-fluid" style={{width: '200px', height: '160px'}} />
															
										<Form.Label className="f-w-bold ml-4">
											<h4 className="btn-default">Masukkan Gambar</h4>
											<input accept="image/*" className="btn-default" name="avatar" type="file" onChange={this.handleChange} required />
											<Form.Text className="text-muted">
												Ukuran gambar 200x200 piksel.
											</Form.Text>
										</Form.Label>
										
									</Form.Group>

									<Form.Group controlId="formJudul">
									<Form.Label className="f-w-bold">Judul Forum</Form.Label>
									<FormControl
										type='text'
										placeholder="Judul Forum"
										value={this.state.title}
										onKeyPress={(e) => _handleKeyPress(e, this._target)}
										onChange={e => this.setState({title: e.target.value})}/>
									<Form.Text className="text-muted">
										Buat judul yang menarik.
									</Form.Text>
									</Form.Group>

									<Form.Group controlId="formIsi">
									<Form.Label className="f-w-bold">Isi Forum</Form.Label>
									<FormControl
										as="textarea" rows="5" placeholder="Isi Forum"
										value={this.state.body}
										onKeyPress={(e) => _handleKeyPress(e, this._target)}
										onChange={e => this.setState({body: e.target.value})}/>
									<Form.Text className="text-muted">
										Jelaskan isi dari forum, peraturan, atau yang lain.
									</Form.Text>
									</Form.Group>

									<Form.Group controlId="formTag">
									<Form.Label className="f-w-bold">Tag Forum</Form.Label>
									<FormControl
										type="text" placeholder="Teknologi, Arsitektur, dll"
										value={this.state.tags}
										onKeyPress={(e) => _handleKeyPress(e, this._target)}
										onChange={e => this.setState({tags: e.target.value})}/>
									<Form.Text className="text-muted">
										Jika lebih dari 1 hubungkan dengan koma (,)
									</Form.Text>
									</Form.Group>

									<div style={{marginTop: '20px'}}>
										<button type="button" 
											onClick={_addforum.bind(this)}
											className="btn btn-primary f-w-bold">
											Simpan
										</button>
										&nbsp;
										<button type="button"
											className="btn f-w-bold"
											onClick={this.closeModalForumAdd}>
											Tutup
										</button>
									</div>
								</Form>

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
