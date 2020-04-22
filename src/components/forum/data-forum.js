import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Form, Card, Button, Row, Col, ListGroup, InputGroup, FormControl } from "react-bootstrap";
import {
	_postLIstAllForum,
	_addforum, 
    _handleKeyPress,
    _addStarForum,
    _deleteStarForum
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
    
    sides : '',

	}

	openModalForumAdd = e => {
		this.setState({ isForumAdd: true })
	}

	closeModalForumAdd = e => {
		this.setState({ isForumAdd: false, imgFile: '', imgPreview: '' })
	}

	componentWillMount() {
		//this.fetchData();
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
    
	// LIST FORUM SEMUA 
	render() {   
        const listForum = this.props.lists;
        //console.log(this.props.lists, 88999);
        ///console.log( 'proppss');    
		return (
            <div>
                
               {
                   listForum.length !== 0 ?
                            listForum.map((item, i) => (
                            <Card style={{marginBottom: '10px'}} key={i}>
                                <Link to={`/forum-detail/${item.forum_id}`} style={{color: 'rgba(109,114,120,0.8)'}}>
                                    <Card.Body style={{padding: '16px'}}>
                                        <div className="forum-media">
                                        <div className="responsive-image-forum img-fluid mr-3 forum-gambar" style={{backgroundImage:`url(${!item.cover ? `/assets/images/component/p5.jpg` : item.cover})`}}></div>
                                    
                                        </div>

                                        <div className="forum-body">
                                            <h3 className="f-16 f-w-800" style={{marginBottom: '0'}}>{item.title}</h3>
                                            <span className="f-12" style={{marginBottom: '3px'}}>{item.tags} - <Moment format="DD/MM/YYYY">{item.created_at}</Moment></span>

                                            <p style={{margin: '5px 0'}} className="f-13">
                                                {item.body}
                                                </p>
                                        </div>

                                        <div className="forum-action">
                                            {item.follow ? 
                                                <Link to='#' onClick={_deleteStarForum.bind(this, item.forum_id, item.user_id)}><i className="fa fa-star"></i></Link>
                                            
                                            : 
                                                <Link to='#'  onClick={_addStarForum.bind(this, item.forum_id, item.user_id)} style={{color: 'gray'}}><i className="fa fa-star"></i></Link>
                                            
                                            }

                                        
                                            <Link to='#' style={{marginLeft: '10px'}}>
                                                <i className="fa fa-comments"></i> &nbsp; {item.komentar} Komentar
                                            </Link>

                                        </div>
                                    </Card.Body>
                                </Link>
                            </Card>
                        ))
                    :
                    <Card style={{marginBottom: '10px'}}>
                           <Card.Body style={{padding: '16px'}}><span>Tidak ada forum tersedia</span></Card.Body>
					</Card>
                }
            </div>
    );
	}
}
