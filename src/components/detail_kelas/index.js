import React, { Component } from "react";
import Storage from '../../repository/storage';

import InfoKelas from './info';
import { Link } from 'react-router-dom'
import TableKelas from "./table";


class DetailKelas extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }
  goBack() {
    this.props.history.goBack();
  }

  render() {
    let levelUser = Storage.get('user').data.level;
    let access_project_admin = levelUser == 'admin' || levelUser == 'superadmin' ? true : false;
    return (
      <div className="pcoded-main-container">
        <div className="pcoded-wrapper">
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              <div className="main-body">
                <div className="page-wrapper">

                  {/* <div className="floating-back">
                      <Link to={`/kursus-new`}>
                      <img
                        src={`newasset/back-button.svg`}
                        alt=""
                        width={90}
                      ></img>
                      </Link>
                    </div> */}
                  <h3 className="f-24 fc-skyblue f-w-800 mb-3 mt-3 p-l-20">
                    Class Details
                  </h3>
                  <div className="row">
                    <div className="col-xl-12">
                      <InfoKelas />
                    </div>
                    <div className="col-xl-12">
                      <TableKelas />
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

export default DetailKelas;
