import React, { Component } from 'react';
import { Modal, Card, InputGroup, FormControl,	Tab, Tabs } from 'react-bootstrap';
import { NavLink, Link, Switch, Route } from 'react-router-dom';

import Registrasi from '../registrasi/index';
import DaftarPelajaran from '../daftar_pelajaran/index';
import Personalia from '../personalia/index';
import RuanganMengajar from '../ruangan_mengajar/index';
import JadwalMengajar from '../jadwal_mengajar/index';

const Evaluasi = () => {
  return (
    <h2>Evaluasi</h2>
  );
}

const Laporan = () => {
  return (
    <h2>Laporan</h2>
  );
}

const titleTabs = [
  {name: 'Registrasi', link: '/registrasi', component: Registrasi},
  {name: 'Daftar Pelajaran', link: '/daftar-pelajaran', component: DaftarPelajaran},
  {name: 'Ruangan Mengajar', link: '/ruangan-mengajar', component: RuanganMengajar},
  {name: 'Jadwal Mengajar', link: '/jadwal-mengajar', component: JadwalMengajar},
  {name: 'Personalia', link: '/personalian', component: Personalia},
  {name: 'Evaluasi', link: '/evaluasi', component: Evaluasi},
  {name: 'Laporan', link: '/laporan', component: Laporan},
]

export default class LearningAdmin extends Component {

	state = {
  }

	render() {
		return (
			<div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
        <div className="pcoded-wrapper">
          <div className="pcoded-content" style={{padding: '40px 40px 0 40px'}}>
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

                      <ul style={{paddingBottom: '0px'}} className="nav nav-pills">
                      {
                        titleTabs.map((item,i) => (
                          <li key={i} className={`nav-item`}>
                            <NavLink style={{borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px'}}
                              activeClassName='active'
                              className={`nav-link`}
                              to={`/learning${item.link}`}>
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
                        <Route path={`/learning${item.link}`} component={item.component} />
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
