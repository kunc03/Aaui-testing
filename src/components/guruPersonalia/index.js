import React, { Component } from 'react';
import { Link } from 'react-router-dom'

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

                  <div className="floating-back">
                    <Link to={`/kursus-new`}>
                    <img
                      src={`newasset/back-button.svg`}
                      alt=""
                      width={90}
                    ></img>
                    </Link>
                  </div>

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
