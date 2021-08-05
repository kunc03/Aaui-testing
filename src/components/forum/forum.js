import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Card, Button, Row, Col, ListGroup, InputGroup, FormControl } from "react-bootstrap";
import {
  _postLIstAllForum,
  _addforum,
  _handleKeyPress
} from './_forum';
import API, { FORUM } from '../../repository/api';
import Storage from '../../repository/storage';
import Moment from 'react-moment';


export default class Forum extends Component {

  state = {
    forumlist: [],
    forumListStar: [],
    isForumAdd: false,
    user: {},
    user_id: Storage.get('user').data.user_id,
    companyId: '',
    title: '',
    tags: '',
    body: '',
    imgFile: '',
    imgPreview: '',

    listTags: [],

    isNotifikasi: false,
    isiNotifikasi: '',

    findForumInput: '',

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
    //_postStarForum.bind(this)();
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
      this.setState({ isNotifikasi: true, isiNotifikasi: 'The file does not match the format, please check again.' })
    }
  }

  showDiscussion(follow) {
    return console.log("show", follow);

  }

  findForum = (e) => {
    e.preventDefault();
    this.setState({ findForumInput: e.target.value });
  }

  StarForum() {
    let marvelHeroes = this.state.forumlist.filter(function (hero) {
      return hero.bookmark !== null;
    });
    let aray = [], starData = [];
    let splitTags;
    for (let a in marvelHeroes) {
      starData.push(marvelHeroes[a]);
      splitTags = marvelHeroes[a].tags.split(",");
      for (let b in splitTags) {
        aray.push({ tags: splitTags[b] })
      }
    }
    this.setState({ forumlist: marvelHeroes, listTags: aray })
    // console.log(aray,'props');
  }

  starAdd(forumId, userId) {
    API.post(`${FORUM}/add/`, { forum_id: forumId, user_id: userId })
      .then(res => {
        console.log(res, 'responseeee add');
        if (res.status === 200) {
          this.fetchData();
        }
        // this.setState({isLockedStatus : res.data.result.kunci},console.log(res.data.result.kunci,"35546456")); 
      })
      .catch(err => console.log("ioOOIAOIs", err))
  }

  deleteStar(forumId, userId) {
    API.delete(`${FORUM}/remove/${forumId}/${userId}`)
      .then(res => {
        console.log(res, 'responseeee delet');
        if (res.status === 200) {
          this.fetchData();
        }
        //this.setState({isLockedStatus : res.data.result.kunci},console.log(res.data.result.kunci,"35546456")); 
      })
      .catch(err => console.log("ioOOIAOIs", err))
  }

  // LIST FORUM SEMUA 
  render() {
    let access = Storage.get('access');
    let levelUser = Storage.get('user').data.level;
    var { forumlist, findForumInput, listTags } = this.state;

    if (findForumInput != "") {

      forumlist = forumlist.filter(x =>
        JSON.stringify(
          Object.values(x)
        ).replace(
          /[^\w ]/g, ''
        ).match(new RegExp(findForumInput, "gmi"))
      );
    }

    const ForumList = ({ lists }) => {
      if (lists.length !== 0) {
        return (
          <div>
            {
              lists.map((item, i) => (
                <Card style={{ marginBottom: '10px' }} key={i}>
                  <Link to={`/forum-detail/${item.forum_id}`} style={{ color: 'rgba(109,114,120,0.8)' }}>
                    <Card.Body style={{ padding: '16px' }}>
                      <div className="forum-media">
                        <div className="responsive-image-forum img-fluid mr-3 forum-gambar" style={{ backgroundImage: `url(${!item.cover ? `/assets/images/component/p5.jpg` : item.cover})` }}></div>
                        {/* <img src={!item.cover ? `/assets/images/component/p5.jpg` : item.cover} alt="media" className="img-fluid mr-3 forum-gambar" style={{marginBottom: '15px'}} /> */}
                      </div>

                      <div className="forum-body">
                        <h3 className="f-16 f-w-800" style={{ marginBottom: '0' }}>{item.title}</h3>
                        <span className="f-12" style={{ marginBottom: '3px' }}>{item.tags} - <Moment format="DD/MM/YYYY">{item.created_at}</Moment></span>

                        <p style={{ margin: '5px 0' }} className="f-13">
                          {item.body}
                        </p>
                      </div>

                      <div className="forum-action">
                        {item.bookmark !== null ?
                          <Link to='#' onClick={this.deleteStar.bind(this, item.forum_id, this.state.user_id)}><i className="fa fa-star"></i></Link>

                          :
                          <Link to='#' onClick={this.starAdd.bind(this, item.forum_id, this.state.user_id)} style={{ color: 'gray' }}><i className="fa fa-star"></i></Link>

                        }

                        <Link to='#' style={{ marginLeft: '10px' }}>
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
        return (
          <Card style={{ marginBottom: '10px' }}>

            {findForumInput != ''
              ? <Card.Body style={{ padding: '16px' }}><span>No forums found {findForumInput}</span></Card.Body>
              : <Card.Body style={{ padding: '16px' }}><span>No forums available</span></Card.Body>
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
                    {
                      levelUser == 'client' && access.course == 0 ?
                        null
                        :
                        <div className="col-md-4 col-xl-4 mb-3">
                          <Link to={`/kursus`}>
                            <div className="kategori title-disabled">
                              <img src="/assets/images/component/kursusoff.png" className="img-fluid" />
                              &nbsp;
                              Kursus & Materi
                            </div>
                          </Link>
                        </div>
                    }

                    {
                      levelUser == 'client' && access.forum == 0 ?
                        null
                        :
                        <div className="col-md-4 col-xl-4 mb-3">
                          <Link to={`/forum`}>
                            <div className="kategori-aktif">
                              <img src="/assets/images/component/forumon.png" className="img-fluid" />
                              &nbsp;
                              Forum
                            </div>
                          </Link>
                        </div>
                    }

                    {
                      levelUser == 'client' && (access.group_meeting == 0 && access.manage_group_meeting == 0) ?
                        null
                        :
                        <div className="col-md-4 col-xl-4 mb-3">
                          <Link to={access.manage_group_meeting ? `/liveclass` : `/liveclass`}>
                            <div className="kategori title-disabled">
                              <img src="/assets/images/component/liveoff.png" className="img-fluid" />
                              &nbsp;
                              Group Meeting
                            </div>
                          </Link>
                        </div>
                    }
                  </Row>
                  <Row>
                    <Col sm={8}>
                      <h3 className="f-20 f-w-800 mb-3">Forum</h3>

                      <div
                        className="col-md-12 col-xl-12"
                        style={{ marginBottom: "42px", marginLeft: "-16px" }}
                      >
                        <InputGroup className="mb-3" style={{ background: '#FFF' }}>
                          <InputGroup.Prepend>
                            <InputGroup.Text id="basic-addon1">
                              <i className="fa fa-search"></i>
                            </InputGroup.Text>
                          </InputGroup.Prepend>
                          <FormControl
                            style={{ background: '#FFF' }}
                            onChange={this.findForum}
                            placeholder="Cari Forum Lain"
                            aria-label="Username"
                            aria-describedby="basic-addon1"
                          />
                          <InputGroup.Append style={{ cursor: "pointer" }}>
                            <InputGroup.Text id="basic-addon2">
                              Search
                            </InputGroup.Text>
                          </InputGroup.Append>
                        </InputGroup>

                        <Row>
                          <div className="col-md-12 col-xl-12 mb-3 mt-2">
                            <div className="row d-flex align-items-center">
                              <div className="col-4">
                                {/* <Form.Control as="select">
                                  <option>Terbaru</option>
                                  <option>Trending</option>
                                </Form.Control> */}
                              </div>
                              {/* <div className="col-8 text-right">
                                <p className="m-b-0">
                                  <span className="f-w-600 f-16">
                                    Lihat Semua
                                  </span>
                                </p>
                              </div> */}
                            </div>
                          </div>
                        </Row>

                        <Row>
                          <Col sm={12} md={12} xl={12}>
                            <ForumList lists={forumlist} />
                          </Col>
                        </Row>
                      </div>
                    </Col>

                    <Col sm={4}>
                      {/* <SideForum lists={forumlist}/> */}
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
                              <Link to="#" onClick={this.StarForum.bind(this, 'star')}>
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
                            Save
                          </button>
                          &nbsp;
                          <button
                            type="button"
                            className="btn f-w-bold"
                            onClick={this.closeModalForumAdd}
                          >
                            Close
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
