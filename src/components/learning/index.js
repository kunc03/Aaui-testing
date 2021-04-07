import React, { Component } from 'react';
import { NavLink, Switch, Route, Link } from 'react-router-dom';

import Registrasi from '../registrasi/index';
import Curriculum from '../kurikulum/index';
import DaftarPelajaran from '../daftar_pelajaran/index';

import Personalia from '../personalia/index';
import PersonaliaDetail from '../personalia/detail';

import RuanganMengajar from '../ruangan_mengajar/index';
import JadwalMengajar from '../jadwal_mengajar/index';
import TabMenu from '../tab_menu/hash';
import EvaluasiDetail from '../evaluasi/detail';
import Folder from './folder';
import Laporan from '../laporan/index';
import Histori from '../laporan/histori';
import Kpi from '../laporan/kpi';

const titleTabs = [
  { label: 'Lessons', link: '/daftar-pelajaran', component: DaftarPelajaran, icon: 'learning-clipboard-2.svg', iconActive: 'learning-clipboard-1.svg', },
  { label: 'Curriculum', link: '/kurikulum', component: Curriculum, icon: 'learning-clipboard-2.svg', iconActive: 'learning-clipboard-1.svg', },
  { label: 'Class', link: '/registrasi', component: Registrasi, icon: 'learning-add-1.svg', iconActive: 'learning-add.svg', },
  { label: 'Room', link: '/ruangan-mengajar', component: RuanganMengajar, icon: 'learning-webinar-1.svg', iconActive: 'users-active.svg', },
  { label: 'Schedule', link: '/jadwal-mengajar', component: JadwalMengajar, icon: 'learning-calendar-1.svg', iconActive: 'users-active.svg', },
  { label: 'Personnel', link: '/personalia', component: Personalia, icon: 'learning-teamwork-1.svg', iconActive: 'users-active.svg', },
  { label: 'Report', link: '/laporan', component: Laporan, icon: 'learning-report-1.svg', iconActive: 'users-active.svg', },
  { label: 'History', link: '/histori', component: Histori, icon: 'learning-report-1.svg', iconActive: 'users-active.svg', },
  { label: 'Preference', link: '/kpi', component: Kpi, icon: 'learning-report-1.svg', iconActive: 'users-active.svg', },
  // { label: 'Evaluation', link: '/evaluasi', component: Evaluasi, icon: 'learning-clipboard-2' },

]

const switchTambahan = [
  { label: 'Evaluation Details', link: '/evaluasi-detail/:id', component: EvaluasiDetail },
  { label: 'Student Details', link: '/personalia-detail/:id', component: PersonaliaDetail },
  { label: 'Folder', link: '/folder', component: Folder },
];

export default class LearningAdmin extends Component {

  constructor(props) {
    super(props);
    this.goBack = this.goBack.bind(this);
    this.state = {
      menu: titleTabs,
      selected: 'Lessons'
    }
  }

  selectMenu(label) {
    this.setState({
      selected: label
    })
    // console.log(link, 'location');
    // window.location.href = `learning${link}`;
  }

  renderContent(param) {
    console.log(param, 'render');

    switch (param) {
      case 'Lessons': return <DaftarPelajaran />;
      default: return null;
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
                      <div className="card main-tab-container" style={{ padding: '0px 20px' }}>
                        <div className="row" style={{ height: '100%' }}>
                          <div className="col-sm-2" style={{ display: 'flex', alignItems: 'center' }}>
                            <strong className="f-w-bold f-18" style={{ color: '#000' }}>Learning | {this.state.selected}</strong>
                          </div>
                          <div className="col-sm-10">
                            <div style={{ overflowX: 'auto', whiteSpace: 'nowrap' }}>
                              <ul className="tab-menu" style={{ width: '100%' }}>
                                {
                                  titleTabs.map(item =>
                                    <Link to={`/learning${item.link}`}>
                                      <li className={this.state.selected === item.label && 'active'} onClick={this.selectMenu.bind(this, item.label)}>

                                        <img
                                          src={`newasset/${this.state.selected === item.label ? item.iconActive : item.icon}`}
                                          alt=""
                                          height={26}
                                          width={26}
                                          style={{ marginRight: 8 }}
                                        ></img>
                                        {item.label}

                                      </li>
                                    </Link>
                                  )
                                }
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* <div className="col-xl-12">

                      <ul style={{ paddingBottom: '0px' }} className="nav nav-pills tab-menu">
                        {
                          titleTabs.map((item, i) => (
                            <li key={i} className={this.state.selected === item.label && 'active nav-item'} onClick={this.selectMenu.bind(this, item.label)}>
                              <NavLink style={{ borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }}
                                activeClassName='active'
                                className={`nav-link`}
                                to={`/learning${item.link}`}>
                                <img src={`/newasset/learning/${item.icon}`} className="mr-2" />
                                {item.label}
                              </NavLink>
                            </li>
                          ))
                        }
                      </ul>

                    </div> */}
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
