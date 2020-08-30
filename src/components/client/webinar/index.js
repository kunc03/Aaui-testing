import React, { Component } from 'react';
import { Card, InputGroup, FormControl } from 'react-bootstrap';
import { Link, Switch, Route } from 'react-router-dom';

import Webinar from './webinar';
import WebinarAdd from './add';
import WebinarLive from './live';
import WebinarRiwayat from './riwayat';

export default class WebinarClient extends Component {

	state = {}

	render() {
		return (
			<div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{padding: '40px 40px 0 40px'}}>
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                	<Switch>
						        <Route path="/webinar" exact component={() => <Webinar changeLevel={this.props.changeLevel} />} />
                    <Route path="/webinar/add" component={WebinarAdd} />
                    <Route path="/webinar/live" component={WebinarLive} />
						        <Route path="/webinar/riwayat" component={WebinarRiwayat} />
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