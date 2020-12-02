import React, { Component } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';

import MataPelajaran from '../daftar_pelajaran/mapel';
import Tugas from '../tugas/index';
import Latihan from '../tugas/latihan';

const KuisComponent = props => <Latihan {...props} tipe="kuis" />;
const UjianComponent = props => <Latihan {...props} tipe="ujian" />;

const titleTabs = [
  {name: 'Mata Pelajaran', link: '/mata-pelajaran', component: MataPelajaran},
  {name: 'Tugas', link: '/tugas', component: Tugas},
  {name: 'Kuis', link: '/kuis', component: KuisComponent},
  {name: 'Ujian', link: '/ujian', component: UjianComponent},
]

const switchTambahan = [
];

export default class LearningMurid extends Component {

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
                              to={`/murid${item.link}`}>
                                <img src="/newasset/webinar.svg" className="mr-2"/>
                                {item.name}
                            </NavLink>
                          </li>
                        ))
                      }
                      </ul>

                    </div>
                  </div>

                  <Switch>
                    <Route path="/murid" exact component={MataPelajaran} />
                    {
                      titleTabs.map(item => (
                        <Route path={`/murid${item.link}`} component={item.component} />
                      ))
                    }

                    {
                      switchTambahan.map(item => (
                        <Route path={`/murid${item.link}`} component={item.component} />
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
