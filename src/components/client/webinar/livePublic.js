import React, { Component } from 'react';
import WebinarLive from './live';

export default class WebinarLivePublic extends Component {

	state = {
  }

	render() {
		return (
            <WebinarLive webinarId={this.props.match.params.webinarId} voucher={this.props.match.params.voucher}/>
		);
	}

}