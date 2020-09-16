import React, { Component } from "react";
import TableFiles from '../Home_new/detail_project/files';
import { Link } from 'react-router-dom';
import {Alert, Modal, Form, Card, Button, Row, Col} from 'react-bootstrap';
import API, {USER_ME, USER, API_SERVER, APPS_SERVER} from '../../repository/api';
import Storage from '../../repository/storage';

class Files extends Component {
  state = {
  };

  render() {
    let levelUser = Storage.get('user').data.level;
    let access_project_admin = levelUser == 'admin' || levelUser == 'superadmin' ? true : false;
    return(
        <div className="pcoded-main-container">
          <div className="pcoded-wrapper">
            <div className="pcoded-content">
              <div className="pcoded-inner-content">
                <div className="main-body">
                  <div className="page-wrapper">
                    <div className="row">
                      <div className="col-xl-12">
            <TableFiles access_project_admin={access_project_admin} projectId='0'/>
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

export default Files;
