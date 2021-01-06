import React, { Component } from 'react';
import Gantt from './Gantt';

export default class GanttPublic extends Component {

	state = {
  }

	render() {
		return (
            <Gantt projectId={this.props.match.params.projectId}/>
		);
	}

}