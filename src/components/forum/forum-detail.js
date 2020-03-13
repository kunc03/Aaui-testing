import React, { Component } from "react";
import API, { FORUM, API_SERVER, USER_ME } from "../../repository/api";
import { Link } from 'react-router-dom';
import { Modal, Form, Card, Button, Row, Col, ListGroup, InputGroup, FormControl } from "react-bootstrap";
import {
    _getDetailForumList,
    _komentarPost
} from './_forum';
import Storage from '../../repository/storage';
import Moment from "react-moment";

export default class ForumDetail extends Component {
    
    state = {
        user_id: Storage.get('user').data.user_id,
        forumId: Number(this.props.match.params.forum_id),
        listDetail : '',
        listKomentar : [],

        konten: '',
        attachment: '',

        isNotifikasi: false, 
		isiNotifikasi:'',
    }
    
    componentWillMount(){
        this.fetchData();
    }

    async fetchData() {
        await _getDetailForumList.bind(this, this.props.match.params.forum_id)();
        await API.get(`${FORUM}/id/${this.props.match.params.forum_id}`).then(res => {
            if (res.status === 200) {
              if (!res.data.error) {
                console.log('res: ', res.data)
                this.setState({
                  listKomentar: res.data.result[0].komentar
                });
              }
            }
          })
          .catch(err => {
            console.log(err);
          });
    }

    closeNotifikasi = e => {
		this.setState({ isNotifikasi: false, isiNotifikasi: '' })
	}
    
    onClickSubmitKomentar = e => {
        const form = {
            konten: this.state.konten,
            user_id: Storage.get('user').data.user_id,
            forum_id: this.state.forumId
        }

        console.log("state: ", form)

        if(this.state.konten) {
            API.post(`${API_SERVER}v1/forum-post`, form).then(async res => {
                if(res.status === 200) {
                    if(!res.data.error) {
                        if(this.state.attachment) {
                            const formData = new FormData();
                            formData.append('attachment_id', this.state.attachment);
                            await API.put(`${API_SERVER}v1/forum-post/attachment/${res.data.result.post_id}`, formData)
                        }

                        this.setState({ konten: "", attachment: "" })
                        document.getElementById('attachment').value = ''

                        this.fetchData()
                    }
                }
            })
        } else {
            this.setState({ isNotifikasi: true, isiNotifikasi: "Pesan harus terisi terlebih dahulu." });
        }
    }

    onChangeInput = (e) => {
        const name = e.target.name;

        if(name === 'attachment') {
            if (e.target.files[0].size <= 500000) {
                this.setState({ [name]: e.target.files[0] });
            } else {
                e.target.value = null;
                this.setState({ isNotifikasi: true, isiNotifikasi: 'File tidak sesuai dengan format, silahkan cek kembali.' })
            }
        } else {
            this.setState({ [name]: e.target.value })
        }
	}

	render() {
        const item = {
			judul: 'Judul 1', 
			update: 'Last update 1 days ago 02/02/2020', 
			isi: '<p>Businesses often become known today through effective marketing. The marketing may be in the form of a regular news item or half column society news in the Sunday newspaper. The marketing may be in the form of a heart to heart talk with Mr. Brown on his prominent local television show. These are all advertising. Businesses cannot get away from the force of advertising. If they want to make their products known in the marketplace they have to use some form of advertisement. Advertising is being more and more known as a reasonable and desirable business force. Let’s say you own a department store. The advertising manager of the store is like the managing editor of a daily newspaper with his group of reporters regularly bringing fresh matter to his desk and the different department heads acts as the reporters.</p><p>Take it on a Thursday or Friday, when the big Sunday advertisements are in process of construction, the scene is remarkably lively, and the man at the head of the advertising department has plenty occasions to exercise his ready cleverness and level-headedness. He must have very clear-cut and definite ideas as to what’s what, and no matter what influence may be brought to bear upon him by the different managers the advertising manager must have a stamina to select what he considers the best and arrange the same as he thinks wise, while at the same time he must have sufficient tact and skill to do these things without hurting the feelings of buyers</p>', 
			komentar: 30
        }

        const dataList = this.state.listDetail[0] === undefined ? '' : this.state.listDetail[0] ;
        // console.log(dataList)
        // console.log(this.state.listKomentar)

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
                            <img
                              src={
                                dataList.cover
                                  ? dataList.cover
                                  : "/assets/images/component/p5.jpg"
                              }
                              className="img-fluid mr-3 forum-gambar"
                              alt="media"
                            />
                          </div>

                          <div className="forum-body">
                            <h3 className="f-24 f-w-800">{dataList.title}</h3>
                            <Moment
                              format="DD/MM/YYYY"
                              style={{ marginBottom: "3px" }}
                            >
                              {dataList.created_at}
                            </Moment>
                          </div>

                          <div
                            className="forum-action"
                            style={{ marginTop: "30px" }}
                          >
                            <Link to="#">
                              <i className="fa fa-star"></i>
                            </Link>
                            <Link to="#" style={{ marginLeft: "10px" }}>
                              <i className="fa fa-comments"></i> &nbsp;{" "}
                              {this.state.listKomentar.length} Komentar
                            </Link>
                          </div>

                          <div
                            style={{ marginTop: "20px" }}
                            dangerouslySetInnerHTML={{ __html: dataList.body }}
                          />

                          <div
                            className="list-komentar"
                            style={{ marginTop: "30px" }}
                          >
                            {this.state.listKomentar.map((content, index) => {
                              return (
                                <div
                                  className="komentar-item"
                                  style={{ marginBottom: "15px" }}
                                >
                                  <Row>
                                    <Col xl={2} md={1}>
                                      <img
                                        src={content.avatar}
                                        class="img-circle img-responsive"
                                        alt=""
                                        style={{ width: "80px" }}
                                      />
                                    </Col>
                                    <Col xl={10} md={11}>
                                      <h3 className="f-18 f-w-bold f-w-800">
                                        {content.name}
                                        <Moment
                                          format="DD/MM/YYYY"
                                          className="f-12"
                                          style={{
                                            float: "right",
                                            fontWeight: "normal"
                                          }}
                                        >
                                          {content.created_at}
                                        </Moment>
                                      </h3>
                                      <p>{content.konten}</p>

                                      {content.attachment_id && (
                                        <a
                                          href={content.attachment_id}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="btn btn-ideku"
                                        >
                                          Attachment
                                        </a>
                                      )}
                                    </Col>
                                  </Row>
                                </div>
                              );
                            })}
                          </div>

                          <Form style={{ marginTop: "30px" }}>
                            <Form.Group controlId="formIsi">
                              <Form.Label className="f-w-bold">
                                Berikan Komentar
                              </Form.Label>
                              <Form.Control
                                as="textarea"
                                rows="5"
                                value={this.state.konten}
                                onChange={this.onChangeInput}
                                name="konten"
                                placeholder="Berikan Komentar"
                              />
                              <Form.Text className="text-muted">
                                Jelaskan isi dari forum, peraturan, atau yang
                                lain.
                              </Form.Text>
                            </Form.Group>
                            <Form.Group>
                              <input
                                type="file"
                                id="attachment"
                                name="attachment"
                                onChange={this.onChangeInput}
                              />
                              <Form.Text className="text-muted">
                                Pastikan file berformat png, jpeg, jpg, atau gif.
                              </Form.Text>
                            </Form.Group>

                            <div style={{ marginTop: "20px" }}>
                              <button
                                type="button"
                                onClick={this.onClickSubmitKomentar}
                                className="btn btn-primary f-w-bold"
                              >
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
                          <Button
                            onClick={this.openModalForumAdd}
                            className="btn-block btn-primary"
                          >
                            <i className="fa fa-plus"></i> &nbsp; Membuat Forum
                          </Button>

                          <div className="forum-filter">
                            <ListGroup>
                              <ListGroup.Item>
                                <i className="fa fa-comments"></i> &nbsp; Semua
                                Diskusi Forum
                              </ListGroup.Item>
                              <ListGroup.Item>
                                <i className="fa fa-star"></i> &nbsp; Mengikuti
                              </ListGroup.Item>
                            </ListGroup>
                          </div>

                          <hr />

                          <div className="forum-kategori">
                            <h3 className="f-16 f-w-800 mb-3">
                              Kategori Forum
                            </h3>
                            <Row>
                              <Col sm={6}>
                                <ul className="forum-kategori-list">
                                  <li className="forum-item">
                                    <i className="fa fa-comments"></i> &nbsp;
                                    Design
                                  </li>
                                  <li className="forum-item">
                                    <i className="fa fa-comments"></i> &nbsp;
                                    Marketing
                                  </li>
                                  <li className="forum-item">
                                    <i className="fa fa-comments"></i> &nbsp;
                                    Teknologi
                                  </li>
                                </ul>
                              </Col>
                              <Col sm={6}>
                                <ul className="forum-kategori-list">
                                  <li className="forum-item">
                                    <i className="fa fa-comments"></i> &nbsp;
                                    Sales
                                  </li>
                                  <li className="forum-item">
                                    <i className="fa fa-comments"></i> &nbsp;
                                    Otomotif
                                  </li>
                                  <li className="forum-item">
                                    <i className="fa fa-comments"></i> &nbsp;
                                    Arsitektur
                                  </li>
                                </ul>
                              </Col>
                            </Row>
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
	}

}