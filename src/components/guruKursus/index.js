import React, { Component } from "react";
import { Link } from 'react-router-dom'
import Storage from '../../repository/storage';

import MataPelajaran from './mataPelajaran';
import LesonTerbaikTerburuk from './lesonTerbaikTerburuk';
import Jadwals from './jadwal';
import Kategoris from "./kategori";
import PemblajaranUser from "./pemblajaranUser";


class GuruKursus extends Component {
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
                      <Link to={`/kursus-new`}>
                      <img
                        src={`newasset/back-button.svg`}
                        alt=""
                        width={90}
                      ></img>
                      </Link>
                    </div>

                    <div className="row">
                      <div className="col-xl-12">
                        <MataPelajaran />
                      </div>
                      <div className="col-xl-12">
                        <LesonTerbaikTerburuk />
                      </div>
                      <div className="col-xl-12">
                        <Jadwals />
                      </div>
                      <div className="col-xl-12">
                        <Kategoris />
                      </div>
                      <div className="col-xl-12">
                        <PemblajaranUser />
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

export default GuruKursus;
