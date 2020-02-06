import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Card, Button, Row, Col, ListGroup, InputGroup, FormControl } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../repository/api';
import Storage from '../../repository/storage';

export default class Forum extends Component {

	state = {
		forums: [],
		isForumAdd: false,
	}

	openModalForumAdd = e => {
		this.setState({ isForumAdd: true })
	}

	closeModalForumAdd = e => {
		this.setState({ isForumAdd: false })
	}

	componentDidMount() {
		let forums = [
			{judul: 'Judul 1', update: 'Last update 1 days ago 02/02/2020', isi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', komentar: 30},
			{judul: 'Judul 2', update: 'Last update 2 days ago 02/02/2020', isi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', komentar: 20},
			{judul: 'Judul 3', update: 'Last update 3 days ago 02/02/2020', isi: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', komentar: 10},
		];

		this.setState({ forums: forums })
	}

	render() {
		const { forums } = this.state

		const ForumList = ({lists}) => {
			if(lists.length !== 0) {
				return(
					<div>
						{
							lists.map((item, i) => (
								<Card style={{marginBottom: '10px'}} key={i}>
									<Link to={`/forum-detail/${i}`} style={{color: 'rgba(109,114,120,0.8)'}}>
				      			<Card.Body style={{padding: '16px'}}>
				      				<div className="forum-media">
				      					<img src="/assets/images/component/p5.jpg" className="img-fluid mr-3 forum-gambar" />
				      				</div>

				      				<div className="forum-body">
				  							<h3 className="f-16 f-w-800" style={{marginBottom: '0'}}>{item.judul}</h3>
				  							<span className="f-12" style={{marginBottom: '3px'}}>{item.update}</span>

				  							<p style={{margin: '5px 0'}} className="f-13">
				  								{item.isi}
												</p>
											</div>

											<div className="forum-action">
												<Link to='#'>
													<i className="fa fa-star"></i>
												</Link>
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
														  <ListGroup.Item>
														  	<i className="fa fa-comments"></i> &nbsp; Semua Diskusi Forum
													  	</ListGroup.Item>
														  <ListGroup.Item>
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

                	<Modal show={this.state.isForumAdd} onHide={this.closeModalForumAdd} dialogClassName="modal-lg">
                    <Modal.Body>
                      <Modal.Title className="text-c-purple3 f-w-bold f-21" style={{marginBottom: '30px'}}>Membuat Forum</Modal.Title>
                      
                      <Form>
                      	<Form.Group controlId="formJudul">
                      		<img src="/assets/images/component/placeholder-image.png" className="img-fluid" style={{width: '200px', height: '160px'}} />
											    
											    <Form.Label className="f-w-bold ml-4">
											    	<Button className="btn-default">Masukkan Gambar</Button>

											    	<Form.Text className="text-muted">
												      Ukuran gambar 200x200 piksel.
												    </Form.Text>
										    	</Form.Label>
											    
											  </Form.Group>

											  <Form.Group controlId="formJudul">
											    <Form.Label className="f-w-bold">Judul Forum</Form.Label>
											    <Form.Control type="text" placeholder="Judul Forum" />
											    <Form.Text className="text-muted">
											      Buat judul yang menarik.
											    </Form.Text>
											  </Form.Group>

											  <Form.Group controlId="formIsi">
											    <Form.Label className="f-w-bold">Isi Forum</Form.Label>
											    <Form.Control as="textarea" rows="5" placeholder="Isi Forum" />
											    <Form.Text className="text-muted">
											      Jelaskan isi dari forum, peraturan, atau yang lain.
											    </Form.Text>
											  </Form.Group>

											  <Form.Group controlId="formTag">
											    <Form.Label className="f-w-bold">Tag Forum</Form.Label>
											    <Form.Control type="text" placeholder="Teknologi, Arsitektur, dll" />
											    <Form.Text className="text-muted">
											      Jika lebih dari 1 hubungkan dengan koma (,)
											    </Form.Text>
											  </Form.Group>

											  <div style={{marginTop: '20px'}}>
		                      <button type="button" 
		                      	onClick={this.onClickHapusChapterYes}
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

export class ForumDetail extends Component {

	state = {
		forumId: this.props.match.params.forum_id
	}

	render() {
		const item = {
			judul: 'Judul 1', 
			update: 'Last update 1 days ago 02/02/2020', 
			isi: '<p>Businesses often become known today through effective marketing. The marketing may be in the form of a regular news item or half column society news in the Sunday newspaper. The marketing may be in the form of a heart to heart talk with Mr. Brown on his prominent local television show. These are all advertising. Businesses cannot get away from the force of advertising. If they want to make their products known in the marketplace they have to use some form of advertisement. Advertising is being more and more known as a reasonable and desirable business force. Let’s say you own a department store. The advertising manager of the store is like the managing editor of a daily newspaper with his group of reporters regularly bringing fresh matter to his desk and the different department heads acts as the reporters.</p><p>Take it on a Thursday or Friday, when the big Sunday advertisements are in process of construction, the scene is remarkably lively, and the man at the head of the advertising department has plenty occasions to exercise his ready cleverness and level-headedness. He must have very clear-cut and definite ideas as to what’s what, and no matter what influence may be brought to bear upon him by the different managers the advertising manager must have a stamina to select what he considers the best and arrange the same as he thinks wise, while at the same time he must have sufficient tact and skill to do these things without hurting the feelings of buyers</p>', 
			komentar: 30
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
                			<Card>
	                			<Card.Body>
		              				<div className="forum-media">
						      					<img src="/assets/images/component/p5.jpg" className="img-fluid mr-3 forum-gambar" />
						      				</div>

						      				<div className="forum-body">
						  							<h3 className="f-24 f-w-800">{item.judul}</h3>
						  							<span className="f-14" style={{marginBottom: '3px'}}>{item.update}</span>
													</div>

													<div className="forum-action" style={{marginTop: '30px'}}>
														<Link to='#'>
															<i className="fa fa-star"></i>
														</Link>
														<Link to='#' style={{marginLeft: '10px'}}>
															<i className="fa fa-comments"></i> &nbsp; {item.komentar} Komentar
														</Link>
													</div>

													<div style={{marginTop: '20px'}} dangerouslySetInnerHTML={{ __html: item.isi }} />

													<hr/>

													<div className="list-komentar">
														
														<div className="komentar-item" style={{marginBottom: '15px'}}>
															<Row>
																<Col xl={2} md={1}>
																	<img src="http://placehold.it/80" class="img-circle img-responsive" alt="" />
																</Col>
																<Col xl={10} md={11}>
																	<h3 className="f-18 f-w-bold f-w-800">
									  								Ahmad Ardiansyah
									  								<span className="f-12" style={{float: 'right', fontWeight: 'normal'}}>02/02/2020 08:30 WIB</span>
								  								</h3>
									  							<p>Successful businesses know the importance of building and maintaining, whether it is with partners, employees, business or trade organizations, the government, media representatives, vendors, consumers, or the community at large.</p>
																</Col>
															</Row>
						  							</div>

						  							<div className="komentar-item">
															<Row>
																<Col xl={2} md={1}>
																	<img src="http://placehold.it/80" class="img-circle img-responsive" alt="" />
																</Col>
																<Col xl={10} md={11}>
																	<h3 className="f-18 f-w-bold f-w-800">
									  								Ahmad Ardiansyah
									  								<span className="f-12" style={{float: 'right', fontWeight: 'normal'}}>02/02/2020 08:30 WIB</span>
								  								</h3>
									  							<p>Successful businesses know the importance of building and maintaining, whether it is with partners, employees, business or trade organizations, the government, media representatives, vendors, consumers, or the community at large.</p>
																</Col>
															</Row>
						  							</div>

													</div>

													<hr/>

													<Form>
													  <Form.Group controlId="formIsi">
													    <Form.Label className="f-w-bold">Berikan Komentar</Form.Label>
													    <Form.Control as="textarea" rows="5" placeholder="Berikan Komentar" />
													    <Form.Text className="text-muted">
													      Jelaskan isi dari forum, peraturan, atau yang lain.
													    </Form.Text>
													  </Form.Group>

													  <div style={{marginTop: '20px'}}>
				                      <button type="button" 
				                      	onClick={this.onClickHapusChapterYes}
				                        className="btn btn-primary f-w-bold">
				                        Simpan
				                      </button>
			                      </div>
													</Form>

	                			</Card.Body>
                			</Card>
                		</Col>

                		<Col sm={4}>
                			<Card>
	                			<Card.Body>
	                				<Button onClick={this.openModalForumAdd} className="btn-block btn-primary"><i className="fa fa-plus"></i> &nbsp; Membuat Forum</Button>

	                				<div className="forum-filter">
	                					<ListGroup>
														  <ListGroup.Item>
														  	<i className="fa fa-comments"></i> &nbsp; Semua Diskusi Forum
													  	</ListGroup.Item>
														  <ListGroup.Item>
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

            		</div>
          		</div>
        		</div>
      		</div>
    		</div>
  		</div>
		)
	}

}
