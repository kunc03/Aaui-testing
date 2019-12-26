import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Form, Card, Col, Row, ButtonGroup, Button, Image } from 'react-bootstrap';
import API, { API_SERVER } from '../../../repository/api';

export default class CompanyDetail extends Component {

	constructor(props) {
		super(props);

		this.state = {
			company: [],
			cabang: [],
			grup: [],
			user: []
		}
	}

	componentDidMount() {
		let linkURL = `${API_SERVER}v1/company/${this.props.match.params.company_id}`;
		API.get(linkURL).then(res => {
			console.log(res.data.result)
			if(res.status === 200) {
				this.setState({ company: res.data.result });

				let linkURLCabang = `${API_SERVER}v1/branch/company/${this.props.match.params.company_id}`;
				API.get(linkURLCabang).then(res => {
					if(res.status === 200) {
						this.setState({ cabang: res.data.result })
					}
				}).catch(err => {
					console.log(err);
				});

				let linkURLGrup = `${API_SERVER}v1/grup/company/${this.props.match.params.company_id}`;
				API.get(linkURLGrup).then(res => {
					if(res.status === 200) {
						this.setState({ grup: res.data.result })
					}
				}).catch(err => {
					console.log(err);
				});

				let linkURLUser = `${API_SERVER}v1/user/company/${this.props.match.params.company_id}`;
				API.get(linkURLUser).then(res => {
					if(res.status === 200) {
						this.setState({ user: res.data.result })
					}
				}).catch(err => {
					console.log(err);
				});
			}
		}).catch(err => {
			console.log(err);
		})
	}

	render() {
		const { company, cabang, grup, user } = this.state;
		const statusCompany = ['active', 'nonactive'];

		const ListCabang = ({items}) => (
			<div>
			{	
				items.map(item => (
					<Card className="cardku" key={item.branch_id}>
          	<Card.Body>
          		<Row>
          			<Col xs={1}>{item.branch_id}</Col>
          			<Col xs={8}>{item.branch_name}</Col>
          			<Col>
          				<Link className="buttonku" to="/"><i className="fa fa-edit"></i></Link>
          				<Link className="buttonku" to="/"><i className="fa fa-trash"></i></Link>
          			</Col>
          		</Row>
          	</Card.Body>
          </Card>
				))
			}
			</div>
		);

		const ListGrup = ({items}) => (
			<div>
			{	
				items.map(item => (
					<Card className="cardku" key={item.grup_id}>
          	<Card.Body>
          		<Row>
          			<Col xs={1}>{item.grup_id}</Col>
          			<Col xs={8}>{item.grup_name}</Col>
          			<Col>
          				<Link className="buttonku" to="/"><i className="fa fa-edit"></i></Link>
          				<Link className="buttonku" to="/"><i className="fa fa-trash"></i></Link>
          			</Col>
          		</Row>
          	</Card.Body>
          </Card>
				))
			}
			</div>
		);

		const ListUser = ({items}) => (
			<tbody>
			{	
				items.map(item => (
					<tr>
            <td className="text-center">{item.user_id}</td>
            <td>{item.name}</td>
            <td>{item.identity}</td>
            <td>{item.branch_name}</td>
            <td>{item.grup_name}</td>
            <td>{item.email}</td>
            <td>{item.phone}</td>
            <td>{item.validity.toString().substring(0,10)}</td>
            <td className="text-center">
              <Link className="buttonku" to="/"><i className="fa fa-edit"></i></Link>
      				<Link className="buttonku" to="/"><i className="fa fa-trash"></i></Link>
            </td>
          </tr>
				))
			}
			</tbody>
		);

		return (
			<div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                  <div className="row">
                    <div className="col-xl-12">
                      
                      <h3 className="f-24 f-w-800 mb-3">Informasi Company</h3>
                      <Card>
                      	<Card.Body>
                      		<Row>
                      			<Col md={2} className="text-center">
	                      			<Image src={company.logo} width="120px" thumbnail />
	                      		</Col>
	                      		<Col md={10}>
				                      <div className="form-group">
				                      	<label>Nama Company</label>
				                      	<Form.Control type="text" placeholder="Nama Company" value={company.company_name} />
				                      </div>
				                      <div className="form-group">
				                      	<label>Validity</label>
				                      	<Form.Control type="text" placeholder="Nama Company" value={company.validity} />
				                      </div>
				                      <div className="form-group">
				                      	<label>Status Company</label>
				                      	<br/>
				                      	{
						                      statusCompany.map(item => {
						                        return (
						                          <Form.Check name='status' inline label={item} checked={company.status === item} type='radio' value={item} />
						                        );
						                      })
						                    }
				                      </div>
	                      		</Col>
                      		</Row>
                      	</Card.Body>
                      </Card>

                  		<Row style={{ marginBottom: '32px'}}>
                  			<Col md={6}>
              						<h3 className="f-24 f-w-800 mb-3">
              							Cabang Company
	            							<Link className="btn btn-sm btn-ideku float-right" to="/">
	            								<i className="fa fa-plus"></i> Tambah Baru
	            							</Link>
	            							<div className="clearfix"></div>
            							</h3>
		                      <ListCabang items={cabang} />
                  			</Col>
                  			<Col md={6}>
              						<h3 className="f-24 f-w-800 mb-3">
              							Grup Company
              							<Link className="btn btn-sm btn-ideku float-right" to="/">
		          								<i className="fa fa-plus"></i> Tambah Baru
		          							</Link>
		          							<div className="clearfix"></div>
            							</h3>
		                      <ListGrup items={grup} />
                  			</Col>
                  		</Row>
                  		
                      <h3 className="f-24 f-w-800 mb-3">User Company</h3>
                      <table
                        className="table-curved"
                        style={{ width: "100%" }}>
                        <thead>
                          <tr>
                            <th className="text-center">No.</th>
                            <th>Nama</th>
                            <th>Identitas</th>
                            <th>Cabang</th>
                            <th>Group</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Validity</th>
                            <th className="text-center">
                              <Link
                                to={"/user-create"}
                                className="btn btn-ideku col-12 f-14"
                                style={{ padding: "7px 8px !important" }}
                              >
                                <img
                                  src="assets/images/component/person_add.png"
                                  className="button-img"
                                  alt=""
                                />
                                Add New
                              </Link>
                            </th>
                          </tr>
                        </thead>
                      	<ListUser items={user} />
                      </table>

                    </div>
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