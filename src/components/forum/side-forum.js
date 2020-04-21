import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Card, Button, Row, Col, ListGroup, InputGroup, FormControl } from "react-bootstrap";
import {
	_postLIstAllForum,
	_addforum, 
  _handleKeyPress,
  _postStarForum
} from './_forum';
import Storage from '../../repository/storage';
import Moment from 'react-moment';

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

  StarForum(){
    let marvelHeroes =  this.props.lists.filter(function(hero) {
      return hero.status;
    });
    this.setState({})
    console.log(marvelHeroes,'props');
  }

	// LIST FORUM SEMUA 
	render() {
             const { listTags } = this.state;
            //console.log(listTags, 'listegggg');
		return (
            <div>
                <Card>
                    <Card.Body>
                        <Button
                        onClick={this.openModalForumAdd}
                        className="btn-block btn-primary"
                        >
                        <i className="fa fa-plus"></i> &nbsp; Buat Forum
                        </Button>

                        <div className="forum-filter">
                        <ListGroup>
                          <Link to="#" onClick={_postLIstAllForum.bind(this, undefined)}>
                            <ListGroup.Item>
                              <i className="fa fa-comments"></i> &nbsp; Semua Diskusi Forum
                            </ListGroup.Item>
                          </Link>
                          <Link to="#"  onClick={this.StarForum.bind(this, 'star')}>
                            <ListGroup.Item>
                              <i className="fa fa-star"></i> &nbsp; Mengikuti
                            </ListGroup.Item>
                          </Link>
                        </ListGroup>
                        </div>

                        <hr />

                        <div className="forum-kategori">
                        <h3 className="f-16 f-w-800 mb-3">
                            Tags
                        </h3>
                        <span>
                            {
                            listTags.map((item, i) => (
                                <span key={item.i}>
                                    {item.tags}, &nbsp;
                                </span>
                            ))
                            }
                        </span>
                        
                        </div>

                        <hr />
                    </Card.Body>
                </Card>

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

                  <Modal
                    show={this.state.isForumAdd}
                    onHide={this.closeModalForumAdd}
                    dialogClassName="modal-lg"
                  >
                    <Modal.Body>
                      <Modal.Title
                        className="text-c-purple3 f-w-bold f-21"
                        style={{ marginBottom: "30px" }}
                      >
                        Membuat Forum
                      </Modal.Title>

                      <Form>
                        <Form.Group controlId="formJudul">
                          <img
                            alt="media"
                            src={
                              this.state.imgFile === ""
                                ? "/assets/images/component/placeholder-image.png"
                                : this.state.imgPreview
                            }
                            className="img-fluid"
                            style={{ width: "200px", height: "160px" }}
                          />

                          <Form.Label className="f-w-bold ml-4">
                            <h4 className="btn-default">Masukkan Gambar</h4>
                            <input
                              accept="image/*"
                              className="btn-default"
                              name="avatar"
                              type="file"
                              onChange={this.handleChange}
                              required
                            />
                            <Form.Text className="text-muted">
                              Ukuran gambar 200x200 piksel.
                            </Form.Text>
                          </Form.Label>
                        </Form.Group>

                        <Form.Group controlId="formJudul">
                          <Form.Label className="f-w-bold">
                            Judul Forum
                          </Form.Label>
                          <FormControl
                            type="text"
                            placeholder="Judul Forum"
                            value={this.state.title}
                            onKeyPress={e => _handleKeyPress(e, this._target)}
                            onChange={e =>
                              this.setState({ title: e.target.value })
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
                            value={this.state.body}
                            onKeyPress={e => _handleKeyPress(e, this._target)}
                            onChange={e =>
                              this.setState({ body: e.target.value })
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
                          <FormControl
                            type="text"
                            placeholder="Teknologi, Arsitektur, dll"
                            value={this.state.tags}
                            onKeyPress={e => _handleKeyPress(e, this._target)}
                            onChange={e =>
                              this.setState({ tags: e.target.value })
                            }
                          />
                          <Form.Text className="text-muted">
                            Jika lebih dari 1 hubungkan dengan koma (,)
                          </Form.Text>
                        </Form.Group>

                        <div style={{ marginTop: "20px" }}>
                          <button
                            type="button"
                            onClick={_addforum.bind(this)}
                            className="btn btn-primary f-w-bold"
                          >
                            Simpan
                          </button>
                          &nbsp;
                          <button
                            type="button"
                            className="btn f-w-bold"
                            onClick={this.closeModalForumAdd}
                          >
                            Tutup
                          </button>
                        </div>
                      </Form>
                    </Modal.Body>
                  </Modal>
                </div>
    );
	}
}
