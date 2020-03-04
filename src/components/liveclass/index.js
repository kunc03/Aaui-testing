import React, { Component } from "react";
import { Link, Switch, Route } from "react-router-dom";

import { 
	Form, Card, CardGroup, Col, Row, ButtonGroup, Button, Image, 
	InputGroup, FormControl, Modal
} from 'react-bootstrap';

import API, { API_SERVER, USER_ME } from '../../repository/api';
import Storage from '../../repository/storage';

const ClassRooms = ({list}) => <Row>
	{list.map( props => 
			<div className="col-sm-12 col-md-6 col-lg-4">
				<Card className="card-post card-post--1 card card-small">
					<div style={{
						backgroundImage: `url("${props.img}")`,

						backgroundSize: "cover",
						backgroundPosition: "50%",

						position: "relative",
						minHeight: "10.3125rem",
						borderTopLeftRadius: ".625rem",
						borderTopRightRadius: ".625rem",
						backgroundRepeat: "no-repeat",
					}}>
						<span className={`card-post__category bg-${props.badgeColor} badge badge-primary badge-pill`} style={{
								top: ".9375rem",
								right: ".9375rem",
								position:"absolute",
								textTransform:"uppercase"
						}}>
							{props.type}
						</span>

						<div className="card-post__author d-flex"></div>
					
					</div>
					
					<Card.Body style={{padding : ".25em"}}>
						<a href={(`https://8026.development.carsworld.co.id/${props.title.replace(/\s/g, '')}`)} target="_blank" alt="Link">

							<h3 className="f-16 f-w-800 ml-2 mt-2">
								{props.title}
							</h3>
							<h3 className="f-14 f-w-800 ml-2">
								{props.teacher}
							</h3>
							
							<br/>

							<span style={{
								bottom: "0.5em",
								position: "absolute",
								right: "1em"
							}} className="text-muted">{props.status}</span>
					
						</a>
				
					</Card.Body>
			
				</Card>
		
			</div>

	)}
</Row>;

export default class LiveClass extends Component {
	state = {
		classRooms: [
			{
				id : "1",
				link : "/liveclass-room/",
				img : "/assets/images/component/classsample.jpeg",
				type : "Python",
				badgeColor : "dark",
				title : "Lorem ipsum 1",
				teacher : "Lorem",
				status : "live"
			},
			{
				id : "2",
				link : "/liveclass-room/",
				img : "/assets/images/component/classsample.jpeg",
				type : "java",
				badgeColor : "blue",
				title : "Lorem ipsum 2",
				teacher : "Lorem",
				status : "Last updated 1 mins ago"
			},
			{
				id : "3",
				link : "/liveclass-room/",
				img : "/assets/images/component/classsample.jpeg",
				type : "java script",
				badgeColor : "warning",
				title : "Lorem ipsum 3",
				teacher : "Lorem",
				status : "live"
			},
			{
				id : "4",
				link : "/liveclass-room/",
				img : "/assets/images/component/classsample.jpeg",
				type : "java script",
				badgeColor : "warning",
				title : "Lorem ipsum 4",
				teacher : "Lorem",
				status : "Last updated 3 years ago"
			},
			{
				id : "5",
				link : "/liveclass-room/",
				img : "/assets/images/component/classsample.jpeg",
				type : "Python",
				badgeColor : "dark",
				title : "Lorem ipsum 5",
				teacher : "Lorem",
				status : "live"
			},
			{
				id : "6",
				link : "/liveclass-room/",
				img : "/assets/images/component/classsample.jpeg",
				type : "java script",
				badgeColor : "warning",
				title : "Lorem ipsum 6",
				teacher : "Lorem",
				status : "Last updated 2 decades ago"
			},
			{
				id : "7",
				link : "/liveclass-room/",
				img : "/assets/images/component/classsample.jpeg",
				type : "java",
				badgeColor : "blue",
				title : "Lorem ipsum 7",
				teacher : "Lorem",
				status : "live"
			},
			{
				id : "7",
				link : "/liveclass-room/",
				img : "/assets/images/component/classsample.jpeg",
				type : "java",
				badgeColor : "blue",
				title : "Lorem ipsum 8",
				teacher : "Lorem",
				status : "live"
			},
		],

		isLive: false,
		liveURL: ''
	}

	handleCloseLive = e => {
		this.setState({ isLive: false, liveURL: '' })
	}

	render() {

		const { classRooms, isLive, liveURL} = this.state;

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
											<img src="/assets/images/component/kursusoff.png" className="img-fluid" alt="media" />
											&nbsp;
											Kursus & Materi
											</div>
										</Link>
									</div>

									<div className="col-md-4 col-xl-4 mb-3">
										<Link to={`/forum`}>
											<div className="kategori">
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
											Live Class
											</div>
										</Link>
									</div>
								</Row>

							</div>

							<div>
								{
									classRooms.length ?
										<CardGroup>
											<ClassRooms list={classRooms} />
										</CardGroup>
										:
										<div className="col-md-3 col-xl-3 mb-3">
											No Classroom
										</div>
								}
							</div>
						</Col>

						<Col sm={4}>
							<Card>
								<Card.Body>
									<Button
										onClick={this.openModalForumAdd}
										className="btn-block btn-primary"
									>
										<i className="fa fa-plus"></i> &nbsp; Membuat Live Class
									</Button>
								</Card.Body>
							</Card>
						</Col>

					</Row>

					<Modal
						show={isLive}
						onHide={this.handleCloseLive}
						dialogClassName="modal-xlg"
					>
						<Modal.Body>
							<Modal.Title className="text-c-purple3 f-w-bold">
								Form Chapter
							</Modal.Title>
							<iframe src={liveURL} width="400px" height="600px"></iframe>
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

export class LiveClassRoom extends Component {
	constructor(props){
		super(props);

		this.state = {


		}


	}
	
	render(){
		return <div></div>
	}
}