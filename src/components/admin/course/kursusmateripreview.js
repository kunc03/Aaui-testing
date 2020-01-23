import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Button, Card, Badge, Accordion } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';

export default class KursusMateriPreview extends Component {

	state = {
		companyId: '',
		courseId: this.props.match.params.course_id,
		course: {},
		chapters: [],

		isModalAdd: false,
	}

	handleModalAdd = e => {
		e.preventDefault();
		this.setState({ isModalAdd: true });
	}

	handleModalClose = e => {
		this.setState({ isModalAdd: false });
	}

	fetchData() {
		API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200) {
				this.setState({ companyId: res.data.result.company_id });

				API.get(`${API_SERVER}v1/course/${this.state.courseId}`).then(res => {
					if(res.status === 200) {
						this.setState({ course: res.data.result })
					}
				})

				API.get(`${API_SERVER}v1/chapter/course/${this.state.courseId}`).then(res => {
					if(res.status === 200) {
						this.setState({ chapters: res.data.result });
					}
				})

			}
		})
	}

	componentDidMount() {
		this.fetchData()
	}

	render() {
		console.log(this.state)
		const {chapters, course} = this.state;

		const ListChapter = ({lists}) => {
			if(lists.length !== 0) {
				return (
					<Accordion>
					{
						lists.map((item, i) => (
							<Card style={{marginTop: '10px', marginBottom: '10px'}} key={item.chapter_id}>
								<Accordion.Toggle as={Card.Header} className="f-24 f-w-800" eventKey={item.chapter_id}>
					  			<h3 className="f-24 f-w-800" style={{marginBottom: '0px', cursor: 'pointer'}}>{item.chapter_title}</h3>
							  </Accordion.Toggle>
							  <Accordion.Collapse eventKey={item.chapter_id}>
								  <Card.Body style={{padding: '16px'}}>
										<img class="img-fluid rounded" src={item.chapter_video} alt="Media" />
								  	<h3 className="f-24 f-w-800" style={{marginTop: '10px'}}>{item.chapter_body}</h3>
								    
								    <Link to="#" className="buttonku" title="Edit">
			                <i className="fa fa-edit"></i>
			              </Link>
			              <Link to="#" className="buttonku" title="Hapus">
			                <i className="fa fa-trash"></i>
			              </Link>
								  </Card.Body>
							  </Accordion.Collapse>
							</Card>
						))	
					}
					</Accordion>
				)
			} else {
				return (
					<Card style={{marginTop: '10px'}}>
					  <Card.Body>Tidak ada chapter tersedia.</Card.Body>
					</Card>
				)
			}
		};

		const dateFormat = new Date(course.created_at);

		return (
			<div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <div className="row">
                    <div className="col-xl-8">
                      <button className="btn btn-ideku" style={{marginRight: '10px'}}>Buat Quiz</button>
                      <button className="btn btn-ideku" style={{marginRight: '10px'}}>Buat Exam</button>

                      <h3 className="f-24 f-w-800 mb-3" style={{marginTop: '20px'}}>{course.title}</h3>
                      <Badge variant="success">{course.type}</Badge>

							        <p class="lead">
							          Kategori:&nbsp;
							          <a href="#">{course.category_name}</a>
							        </p>
							        <p>Posted on {dateFormat.toString()}</p>
      								<img class="img-fluid rounded" src={course.image} alt="" />
      								<br/>
      								<br/>

      								<p class="lead">{course.caption}</p>

      								<div dangerouslySetInnerHTML={{ __html: course.body }} />

                    </div>

	                	<div className="col-xl-4">
                      <button className="btn btn-ideku" style={{marginRight: '10px'}}>Buat Chapter</button>
                      <ListChapter lists={chapters} />
	                	</div>
                	</div>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
		)
	}

}