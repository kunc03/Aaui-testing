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
					<div className="responsive-image-content radius-top-l-r-5" style={{backgroundImage:`url(${item.cover ? item.cover : '/assets/images/component/meeting-default.jpg'})`}}></div>
					{/* <img
						className="img-fluid img-kursus radius-top-l-r-5"
						src={item.cover ? item.cover : 'https://cdn.pixabay.com/photo/2013/07/13/11/45/play-158609_640.png'}
						alt="dashboard-user"
					/> */}
					<div className="card-carousel ">
						<div className="title-head f-w-900 f-16">
							{item.room_name}
						</div>
						<h3 className="f-14">
							{item.name}
						</h3>
						<small className="mr-3">
							<i className={`fa fa-${item.is_live ? 'video' : 'stop-circle'}`}></i>&nbsp;{item.is_live ? 'LIVE' : 'ENDED'}
						</small>
						{
						item.record &&
						<small className="mr-3">
							<a target='_blank' href={item.record}>
							<i className='fa fa-compact-disc'></i> REKAMAN
							</a>
						</small>
						}
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
		liveURL: '',
		filterMeeting: ''
	}

	filterMeeting =  (e) => {
		e.preventDefault();
		this.setState({filterMeeting : e.target.value});
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
					console.log('RESSS',res)
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

		let access = Storage.get('access');
		let levelUser = Storage.get('user').data.level;
		let { classRooms, isLive } = this.state;
		let { filterMeeting } = this.state;
		if(filterMeeting != ""){
		  classRooms = classRooms.filter(x=>
			JSON.stringify(
			  Object.values(x)
			).match(new RegExp(filterMeeting,"gmi"))
		  )
		}

		return(
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
                            <div className="kategori title-disabled">
                              <img src="/assets/images/component/forumoff.png" className="img-fluid" />
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
                          <Link to={access.manage_group_meeting ? `/meeting` : `/liveclass`}>
                            <div className="kategori-aktif">
                              <img src="/assets/images/component/liveon.png" className="img-fluid" />
                              &nbsp;
                              Group Meeting
                            </div>
                          </Link>
                        </div>
                        }
					</Row>
                      <div className="col-md-12 col-xl-12" style={{marginBottom: '10px'}}>
                          <InputGroup className="mb-3" style={{background:'#FFF'}}>
                            <InputGroup.Prepend>
                              <InputGroup.Text id="basic-addon1">
                                <i className="fa fa-search"></i>
                              </InputGroup.Text>
                            </InputGroup.Prepend>
                            <FormControl
                              style={{background:'#FFF'}}
                              onChange={this.filterMeeting}
                              placeholder="Filter"
                              aria-describedby="basic-addon1"
                            />
                            <InputGroup.Append style={{cursor: 'pointer'}}>
                              <InputGroup.Text id="basic-addon2">Pencarian</InputGroup.Text>
                            </InputGroup.Append>
                          </InputGroup>
                      </div>

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