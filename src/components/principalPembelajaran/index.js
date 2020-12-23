import React, { Component } from "react";
import Storage from '../../repository/storage';

import Pembelajaran from './pembelajaran';
import { Link } from 'react-router-dom'



class PembelajaranPrincipal extends Component {
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
                    <Link to='' >
                      <img
                        src={`newasset/back-button.svg`}
                        alt=""
                        width={90}
                        onClick={this.goBack()}
                      ></img>
                    </Link>
                  </div> */}

                  <div className="row">
                    <div className="col-xl-12">
                      <Pembelajaran />
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

export default PembelajaranPrincipal;
