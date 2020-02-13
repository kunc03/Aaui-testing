import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Card, Button, Row, Col, ListGroup, InputGroup, FormControl } from "react-bootstrap";
import {
    _getDetailForumList,
    _komentarPost
} from './_forum';
import Storage from '../../repository/storage';


export default class ForumDetail extends Component {
    
    state = {
        user_id: Storage.get('user').data.user_id,
        forumId: Number(this.props.match.params.forum_id),
        listDetail : '',
        listKomentar : [],
        kontent : ''
    }
    
    componentWillMount(){
        _getDetailForumList.bind(this, this.props.match.params.forum_id)();
    }

    komentarPost(){
        //console.log('fuxk')
        _komentarPost.bind(this)();
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
                                                        <img src="/assets/images/component/p5.jpg" className="img-fluid mr-3 forum-gambar" />
                                                    </div>

                                                    <div className="forum-body">
                                                        <h3 className="f-24 f-w-800">{dataList.title}</h3>
                                                        <span className="f-14" style={{marginBottom: '3px'}}>{dataList.created_at}</span>
                                                    </div>

                                                    <div className="forum-action" style={{marginTop: '30px'}}>
                                                        <Link to='#'>
                                                            <i className="fa fa-star"></i>
                                                        </Link>
                                                        <Link to='#' style={{marginLeft: '10px'}}>
                                                            <i className="fa fa-comments"></i> &nbsp; {this.state.listKomentar.length} Komentar
                                                        </Link>
                                                    </div>

                                                    <div style={{marginTop: '20px'}} dangerouslySetInnerHTML={{ __html: dataList.body }} />

                                                    <hr/>

                                                    <div className="list-komentar">
                                                        {this.state.listKomentar.map((content, index) => {
                                                            return (
                                                                <div className="komentar-item" style={{marginBottom: '15px'}}>
                                                                    <Row>
                                                                        <Col xl={2} md={1}>
                                                                            <img src={content.avatar} class="img-circle img-responsive" alt="" style={{width:'80px'}}/>
                                                                        </Col>
                                                                        <Col xl={10} md={11}>
                                                                            <h3 className="f-18 f-w-bold f-w-800">
                                                                            {content.name}
                                                                            <span className="f-12" style={{float: 'right', fontWeight: 'normal'}}>{content.created_at}</span>
                                                                        </h3>
                                                                        <p>{content.konten}</p>
                                                                        </Col>
                                                                    </Row>
                                                                </div>
                                                                
                                                            )
                                                        })} 

                                                    </div>

                                                                    <hr/>

                                                    <Form>
                                                        <Form.Group controlId="formIsi">
                                                        <Form.Label className="f-w-bold">Berikan Komentar</Form.Label>
                                                        <Form.Control as="textarea" rows="5" placeholder="Berikan Komentar" onChange={e => this.setState({kontent: e.target.value})}/>
                                                        <Form.Text className="text-muted">
                                                            Jelaskan isi dari forum, peraturan, atau yang lain.
                                                        </Form.Text>
                                                        </Form.Group>

                                                        <div style={{marginTop: '20px'}}>
                                                            <button type="button" 
                                                                onClick={this.komentarPost.bind(this)}
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