import React, { Component } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';

import Registrasi from '../registrasi/index';
import Curriculum from '../kurikulum/index';
import DaftarPelajaran from '../daftar_pelajaran/index';

import Personalia from '../personalia/index';
import PersonaliaDetail from '../personalia/detail';

import RuanganMengajar from '../ruangan_mengajar/index';
import JadwalMengajar from '../jadwal_mengajar/index';
import Evaluasi from '../evaluasi/index';
import EvaluasiDetail from '../evaluasi/detail';
import Folder from './folder';
import Laporan from '../laporan/index';
import Kpi from '../laporan/kpi';

const titleTabs = [
  { name: 'Lessons', link: '/daftar-pelajaran', component: DaftarPelajaran, icon: 'learning-clipboard-2' },
  { name: 'Curriculum', link: '/kurikulum', component: Curriculum, icon: 'learning-clipboard-2' },
  { name: 'Class', link: '/registrasi', component: Registrasi, icon: 'learning-add-1' },
  { name: 'Room', link: '/ruangan-mengajar', component: RuanganMengajar, icon: 'learning-webinar-1' },
  { name: 'Schedule', link: '/jadwal-mengajar', component: JadwalMengajar, icon: 'learning-calendar-1' },
  { name: 'Personnel', link: '/personalia', component: Personalia, icon: 'learning-teamwork-1' },
  { name: 'Report', link: '/laporan', component: Laporan, icon: 'learning-report-1' },
  { name: 'Preference', link: '/kpi', component: Kpi, icon: 'learning-report-1' },
  // { name: 'Evaluation', link: '/evaluasi', component: Evaluasi, icon: 'learning-clipboard-2' },

]

const switchTambahan = [
  { name: 'Evaluation Details', link: '/evaluasi-detail/:id', component: EvaluasiDetail },
  { name: 'Student Details', link: '/personalia-detail/:id', component: PersonaliaDetail },
  { name: 'Folder', link: '/folder', component: Folder },
];

export default class LearningAdmin extends Component {

  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.state = {
    }
  }

  goBack() {
    this.props.history.goBack();
  }

  render() {
    return (
      <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{ padding: '40px 40px 0 40px' }}>
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

                      <ul style={{ paddingBottom: '0px' }} className="nav nav-pills">
                        {
                          titleTabs.map((item, i) => (
                            <li key={i} className={`nav-item`}>
                              <NavLink style={{ borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }}
                                activeClassName='active'
                                className={`nav-link`}
                                to={`/learning${item.link}`}>
                                <img src={`/newasset/learning/${item.icon}.svg`} className="mr-2" />
                                {item.name}
                              </NavLink>
                            </li>
                          ))
                        }
                      </ul>

                    </div>
                  </div>

                  <Switch>
                    <Route path="/learning" exact component={Registrasi} />
                    {
                      titleTabs.map(item => (
                        <Route key={item.link} path={`/learning${item.link}`} component={item.component} />
                      ))
                    }

                    {
                      switchTambahan.map(item => (
                        <Route key={item.link} path={`/learning${item.link}`} component={item.component} />
                      ))
                    }
                  </Switch>

                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}
