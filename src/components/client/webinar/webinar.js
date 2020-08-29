import React, { Component } from 'react';
import { Card, InputGroup, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default class Webinar extends Component {

	state = {}

  changeLevel = (e) => {
    e.preventDefault();
    this.props.changeLevel("Sekretaris");
  }

	render() {
		return (
			<div className="row">                     
        <div className="col-sm-12">
          <Card>
            <Card.Body>
              <div className="row">
                <div className="col-sm-6">
                  <h3 className="f-w-900 f-18 fc-blue">
                  	<Link to="" className="btn btn-sm mr-4" style={{
                  		border: '1px solid #e9e9e9',
                  		borderRadius: '50px',
                  	}}>
                  		<i className="fa fa-chevron-left" style={{margin: '0px'}}></i>
                		</Link>
                    Webinar
                  </h3>
                </div>
                <div className="col-sm-6 text-right">
                  <p className="m-b-0">
                    <Link to="/webinar/add" className="btn btn-sm btn-primary" style={{borderRadius: '40px', padding: '6px 12px'}}>
                    	<i className="fa fa-plus"></i> Tambah Webinar
                    </Link>
                  </p>
                </div>
              </div>
              <div style={{marginTop: '10px'}}>
                
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
		);
	}
}