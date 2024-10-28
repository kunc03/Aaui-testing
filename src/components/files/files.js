import React, { Component } from "react";
import TableFiles from './_files';
import Storage from '../../repository/storage';

class Files extends Component {
  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
  }
  goBack(){
    this.props.history.goBack();
  }

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
                  <div className="floating-back">
                    <img
                      src={`newasset/back-button.svg`}
                      alt=""
                      width={90}
                      onClick={this.goBack}
                    ></img>
                  </div>
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
