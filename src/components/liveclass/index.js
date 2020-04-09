import React, { Component } from "react";
import { Link, Switch, Route } from "react-router-dom";

import { 
	Form, Card, CardGroup, Col, Row, ButtonGroup, Button, Image, 
	InputGroup, FormControl, Modal
} from 'react-bootstrap';

import API, { API_SERVER, USER_ME } from '../../repository/api';
import Storage from '../../repository/storage';

const ClassRooms = ({list}) => <Row>
	{list.map( item => 
		<div className="col-sm-4" key={item.class_id}>
			<a target="_blank" href={item.is_live ? `/liveclass-room/${item.class_id}` : '/liveclass'}>
				<div className="card">
					<div className="responsive-image-content radius-top-l-r-5" style={{backgroundImage:`url(${item.cover ? item.cover : 'https://cdn.pixabay.com/photo/2013/07/13/11/45/play-158609_640.png'})`}}></div>
					{/* <img
						className="img-fluid img-kursus radius-top-l-r-5"
						src={item.cover ? item.cover : 'https://cdn.pixabay.com/photo/2013/07/13/11/45/play-158609_640.png'}
						alt="dashboard-user"
					/> */}
					<div className="card-carousel ">
						<div className="title-head f-w-900 f-16">
							{item.room_name}
						</div>
						<h3 className="f-14 f-w-800">
							{item.speaker}
						</h3>
						<small className="mr-3">
							<i className={`fa fa-${item.is_live ? 'video' : 'stop-circle'}`}></i>&nbsp;{item.is_live ? 'LIVE' : 'ENDED'}
						</small>
					</div>
				</div>
			</a>
		</div>
	)}
</Row>;

export default class LiveClass extends Component {
	state = {
		companyId: '',
		classRooms: [],
		isLive: false,
		liveURL: ''
	}

	handleCloseLive = e => {
		this.setState({ isLive: false, liveURL: '' })
	}

	componentDidMount() {
		this.fetchData();
	}

	fetchData() {
		let invited = [];
		let not_invited = [];
		API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
			if (res.status === 200) {
				this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
				API.get(`${API_SERVER}v1/liveclass/invite/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id}/${Storage.get('user').data.user_id}`).then(res => {
					if(res.status === 200) {
						not_invited = res.data.not_invited.reverse();
						invited = res.data.invited.reverse();
						this.setState({ classRooms: invited.concat(not_invited) })
					}
				})
			}
		})
	}

	render() {

		const { classRooms, isLive } = this.state;

		return(
			<div className="pcoded-main-container">
			<div className="pcoded-wrapper">
			<div className="pcoded-content">
			<div className="pcoded-inner-content">
			<div className="main-body">
			<div className="page-wrapper">
			
					<Row>
						<div className="col-md-4 col-xl-4 mb-3">
							<Link to={`/kursus`}>
								<div className="kategori title-disabled">
								<img src="/assets/images/component/kursusoff.png" className="img-fluid" alt="media" />
								&nbsp;
								Kursus & Materi
								</div>
							</Link>
						</div>

						<div className="col-md-4 col-xl-4 mb-3">
							<Link to={`/forum`}>
								<div className="kategori title-disabled">
									<img src="/assets/images/component/forumoff.png" className="img-fluid" alt="media" />
								&nbsp;
								Forum
								</div>
							</Link>
						</div>

						<div className="col-md-4 col-xl-4 mb-3">
							<Link to={`/liveclass`}>
								<div className="kategori-aktif">
									<img src="/assets/images/component/liveon.png" className="img-fluid" alt="media" />
								&nbsp;
								Group Meeting
								</div>
							</Link>
						</div>
					</Row>

					<div>
						{
							classRooms.length ?
								<ClassRooms list={classRooms} />
								:
								<div className="col-md-3 col-xl-3 mb-3">
									No Classroom
								</div>
						}
					</div>

			</div>
			</div>
			</div>
			</div>
			</div>
			</div>
		);
	}

}