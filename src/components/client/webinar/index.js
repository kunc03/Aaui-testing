import React, { Component } from 'react';
import { Modal, Card, InputGroup, FormControl } from 'react-bootstrap';
import { Link, Switch, Route } from 'react-router-dom';

import Webinar from './webinar';
import WebinarAdd from './add';
import WebinarLive from './live';
import WebinarRiwayat from './riwayat';
import WebinarKuesioner from './kuesioner';
import WebinarKuesionerAdd from './kuesioneradd';

import WebinarRoles from './roles';
import WebinarCreate from './create';
import WebinarEdit from './edit';

export default class WebinarClient extends Component {

	state = {
  }

	render() {
		return (
			<div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{padding: '40px 40px 0 40px'}}>
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">
                	<Switch>
                    <Route path="/webinar" exact component={Webinar} />
						        <Route path="/webinar/detail/:webinar" component={Webinar} />
                    <Route path="/webinar/edit/:webinar" component={WebinarEdit} />
                    <Route path="/webinar/kuesioner-add" component={WebinarKuesionerAdd} />
                    
                    <Route path="/webinar/add/:projectId/:webinarId" component={WebinarAdd} />
                    <Route path="/webinar/roles/:projectId" component={WebinarRoles} />
                    <Route path="/webinar/create/:projectId" component={WebinarCreate} />
                    <Route path="/webinar/live/:webinarId" component={WebinarLive} />
                    <Route path="/webinar/riwayat/:projectId" component={WebinarRiwayat} />
                    <Route path="/webinar/kuesioner/:projectId" component={WebinarKuesioner} />

					        </Switch>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
		);
	}

}