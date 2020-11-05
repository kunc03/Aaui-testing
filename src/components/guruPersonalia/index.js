import React, { Component } from 'react';

import AllChart from './allChart';
import RincianAbsensi from './rincianAbsensi';


class GuruPersonalia extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabIndex: 1,

      companyName: '',
      branchName: '',
      groupName: '',
      chartData: '',
      classRooms: [],

    };

  }


  render() {
    console.log('user: ', this.state.user);
    var { recentClass, recentCourse, recentForum, recentLogin } = this.state;
    console.log(
      { recentClass, recentCourse, recentForum, recentLogin },
      '2342'
    );

    return (
      <div
        className="pcoded-main-container"
        style={{ backgroundColor: '#F6F6FD' }}
      >
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  <AllChart/>

                  <RincianAbsensi/>
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GuruPersonalia;
