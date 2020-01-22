import React, { Component } from "react";
import { Link } from 'react-router-dom';
import { Modal, Button } from "react-bootstrap";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import Storage from '../../../repository/storage';

export default class KursusMateriPreview extends Component {

	state = {
		companyId: '',
		courseId: this.props.match.params.course_id,
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
		const {chapters} = this.state;

		const ListChapter = ({lists}) => {
			if(lists.length !== 0) {
				return (
					<tbody>
						{
							lists.map((item, i) => (
								<tr key={item.chapter_id}>
									<td>{item.chapter_id}</td>
									<td>
										<img className="img-thumbnail" src={item.chapter_video} width="200px" alth="Cover" />
									</td>
									<td>{item.chapter_number}</td>
									<td>{item.chapter_title}</td>
									<td className="text-right">
										<Link to="#" className="buttonku" title="Edit">
	          					<i onClick={this.handleOpenEdit} data-id={item.exam_id} className="fa fa-edit"></i>
	        					</Link>
	          				<Link to="#" className="buttonku" title="Hapus">
	          					<i onClick={this.handleOpenDelete} data-id={item.exam_id} className="fa fa-trash"></i>
	        					</Link>
									</td>
								</tr>
							))	
						}
					</tbody>
				)
			} else {
				return (
					<tbody>
						<tr>
							<td colSpan='5'>Tidak ada data</td>
						</tr>
					</tbody>
				)
			}
		};

		return (
			<div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <div className="row">
                    <div className="col-xl-12">
                      <h3 className="f-24 f-w-800 mb-3">
                        Detail Kursus
                      </h3>
                      <button className="btn btn-ideku" style={{marginRight: '10px'}}>Buat Quiz</button>
                      <button className="btn btn-ideku" style={{marginRight: '10px'}}>Buat Exam</button>
                    </div>
                  </div>

	                <div className="row" style={{marginTop: '32px'}}>
	                	<div className="col-xl-12">
	                		<h3 className="f-24 f-w-800 mb-3">
                        Chapter Course
                      </h3>

                      <div style={{ overflowX: "auto" }}>
                        <table className="table-curved" style={{ width: "100%" }}>
                          <thead>
                            <tr>
                              <th className="text-center">ID</th>
                              <th>Media</th>
                              <th>Nomor</th>
                              <th>Judul</th>
                              <th className="text-center">
                                <Link onClick={this.handleModalAdd} to="#" className="btn btn-ideku col-12 f-14" style={{ padding: "7px 8px !important" }}>
                                  <img src="assets/images/component/person_add.png" className="button-img" alt="" />
                                  Buat Baru
                                </Link>
                              </th>
                            </tr>
                          </thead>
                          <ListChapter lists={chapters} />
                        </table>
                      </div>

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