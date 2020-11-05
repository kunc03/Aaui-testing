import React, { Component } from "react";
import Storage from '../../repository/storage';

import UjianAktif from './ujianAktif';
import RincianExercise from "./rincianExercise";
import Peforma from "./peforma";


class GuruUjian extends Component {
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
                 
                    <div className="row">
                      <div className="col-xl-12">
                        <UjianAktif />
                      </div>
                      <div className="col-xl-12">
                        <RincianExercise />
                      </div>
                      <div className="col-xl-12">
                        <Peforma />
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
