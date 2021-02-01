import React, { Component } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';

import ProjectAdmin from './projectAdmin';
import Secretary from './secretary';
import Moderator from './moderator';
import Speaker from './speaker';
import Participant from './participant';

import Pengaturan from '../Pengaturan/index';
import NotificationSetting from './notification';


const titleTabs = [
  { name: 'Project Admin', link: '/project-admin', component: ProjectAdmin },
  { name: 'Secretary', link: '/secretary', component: Secretary },
  { name: 'Moderator', link: '/moderator', component: Moderator },
  { name: 'Speaker', link: '/speaker', component: Speaker },
  { name: 'Participant', link: '/participant', component: Participant },
]

export default class GlobalSetting extends Component {

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
                  <div className="row">
                    <div className="col-sm-3">
                      <h3 className="f-w-bold f-18 fc-blue mb-4">Global Settings</h3>
                    </div>
                    <div className="col-sm-2">
                      <label class="container">Webinar
                      <input type="radio" checked="checked" name="radio"></input>
                        <span class="checkmark"></span>
                      </label>
                    </div>
                    <div className="col-sm-2">
                      <label class="container">Meeting
                      <input type="radio" name="radio"></input>
                        <span class="checkmark"></span>
                      </label>
                    </div>
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
                                to={`/pengaturan${item.link}`}>
                                <b>{item.name}</b>
                              </NavLink>
                            </li>
                          ))
                        }
                      </ul>

                    </div>
                  </div>

                  <Switch>
                    <Route path="/pengaturan" exact component={ProjectAdmin} />
                    {
                      titleTabs.map(item => (
                        <Route key={item.link} path={`/pengaturan${item.link}`} component={item.component} />
                      ))
                    }
                  </Switch>

                </div>
              </div>

              <NotificationSetting />
              <Pengaturan />

            </div>
          </div>
        </div>
      </div>
    );
  }

}
