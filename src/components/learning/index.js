import React, { Component } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';

import Registrasi from '../registrasi/index';
import DaftarPelajaran from '../daftar_pelajaran/index';

import Personalia from '../personalia/index';
import PersonaliaDetail from '../personalia/detail';

import RuanganMengajar from '../ruangan_mengajar/index';
import JadwalMengajar from '../jadwal_mengajar/index';
import Evaluasi from '../evaluasi/index';
import EvaluasiDetail from '../evaluasi/detail';
import Folder from './folder';
import Laporan from '../laporan/index';

const titleTabs = [
  { name: 'Registration', link: '/registrasi', component: Registrasi },
  { name: 'List of Lessons', link: '/daftar-pelajaran', component: DaftarPelajaran },
  { name: 'Teaching Room', link: '/ruangan-mengajar', component: RuanganMengajar },
  { name: 'Teaching Schedule', link: '/jadwal-mengajar', component: JadwalMengajar },
  { name: 'Personnel', link: '/personalia', component: Personalia },
  { name: 'Evaluation', link: '/evaluasi', component: Evaluasi },
  { name: 'Report', link: '/laporan', component: Laporan },
]

const switchTambahan = [
  { name: 'Evaluation Details', link: '/evaluasi-detail/:id', component: EvaluasiDetail },
  { name: 'Student Details', link: '/personalia-detail/:id', component: PersonaliaDetail },
  { name: 'Folder', link: '/folder', component: Folder },
];

export default class LearningAdmin extends Component {

  state = {
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
                                <img src="/newasset/webinar.svg" className="mr-2" />
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
