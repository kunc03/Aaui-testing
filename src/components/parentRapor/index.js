import React, { Component } from "react";
import Storage from '../../repository/storage';

import { Card, Modal, Form, FormControl } from 'react-bootstrap';
import { Link } from 'react-router-dom'
import ParentRapor from "./parentRapor";
import LaporanPembelajaranMurid from '../Home_new/laporanPembelajaranMurid';

class GuruUjian extends Component {

  state = {
    project: [],
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

                  <div className="floating-back">
                    <Link to={`/`}>
                      <img
                        src={`newasset/back-button.svg`}
                        alt=""
                        width={90}
                      />
                    </Link>
                  </div>

                  <div className="row">
                    <div className="col-xl-12">
                      <Card>
                        <Card.Body>
                          <LaporanPembelajaranMurid lists={this.state.project} />
                        </Card.Body>
                      </Card>
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

export default GuruUjian;
