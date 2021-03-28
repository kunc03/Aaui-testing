import React, { Component } from 'react';
import { NavLink, Switch, Route, Link } from 'react-router-dom';
import API, { API_SERVER, API_SOCKET } from '../../repository/api';
import Storage from '../../repository/storage';

import DetailRapor from '../detail_rapor/index';
import DetailKelas from '../detail_kelas/index';
import DetailMurid from '../detail_murid/index';
import HistoriNilai from '../detail_murid/histori';

const titleTabs = [
  { name: 'Nilai Rata Kelas', link: '/ratakelas', component: DetailRapor },
  { name: 'Nilai Per Kelas', link: '/perkelas', component: DetailKelas },
  { name: 'Nilai Per Murid', link: '/permurid', component: DetailMurid },
  // { name: 'History Nilai', link: '/historinilai', component: HistoriNilai },
]

export default class LearningGuru extends Component {

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
                    <Link to={`/`}>
                      <img
                        src={`newasset/back-button.svg`}
                        alt=""
                        width={90}
                      ></img>
                    </Link>
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
                                to={`/guru-laporan${item.link}`}>
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
                    {
                      titleTabs.map(item => (
                        <Route path={`/guru-laporan${item.link}`} component={item.component} />
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
