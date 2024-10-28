import React, { Component } from 'react';
import { NavLink, Switch, Route } from 'react-router-dom';

import API, { USER_ME, API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

import ProjectAdmin from './projectAdmin';
import Secretary from './secretary';
import Moderator from './moderator';
import Speaker from './speaker';
import Participant from './participant';

import List from './list';

const titleTabs = [
  { name: 'Project Admin', link: '/project-admin', component: ProjectAdmin },
  { name: 'Secretary', link: '/secretary', component: Secretary },
  { name: 'Moderator', link: '/moderator', component: Moderator },
  { name: 'Speaker', link: '/speaker', component: Speaker },
  { name: 'Participant', link: '/participant', component: Participant },
]

export default class GlobalSetting extends Component {

  state = {
    cType: Storage.get('user').data.company_type,
    roles: [],
  }

  componentDidMount() {
    this.fetchRoles()

    if (this.state.cType === 'pendidikan') {
      this.props.history.push('/global-settings/access/0')
    }
  }

  fetchRoles() {
    if (this.state.cType === 'pendidikan') {
      API.get(`${API_SERVER}v1/grup/company/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : Storage.get('user').data.company_id}`).then(res => {
        if (res.status === 200) {
          this.setState({ roles: res.data.result })
        }
      })
    }
    else {
      this.setState({ roles: titleTabs })
    }
  }

  render() {
    const { roles } = this.state;

    return (
      <div className="row">
        <div className="col">


                  <div className="row">
                    <div className="col-sm-3">
                      <h3 className="f-w-bold f-21 fc-blue mb-4">Global Settings</h3>
                    </div>
                    {/*
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
                    */}
                  </div>

                  <div className="row">
                    <div className="col-xl-12">

                      <ul style={{ paddingBottom: '0px' }} className="nav nav-pills">
                        {
                          this.state.cType === 'perusahaan' &&
                          <>
                            {
                              roles.map((item, i) => (
                                <li key={i} className={`nav-item`}>
                                  <NavLink style={{ borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }}
                                    activeClassName='active'
                                    className={`nav-link`}
                                    to={`/global-settings${item.link}`}>
                                    <b>{item.name}</b>
                                  </NavLink>
                                </li>
                              ))
                            }
                          </>
                        }

                        {
                          this.state.cType === 'pendidikan' &&
                          <>
                            <li className={`nav-item`}>
                              <NavLink style={{ borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }}
                                className={`nav-link`}
                                to={`/global-settings/access/0`}>
                                <b>{`Admin`}</b>
                              </NavLink>
                            </li>
                            {
                              roles.map((item, i) => (
                                <li key={i} className={`nav-item`}>
                                  <NavLink style={{ borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }}
                                    className={`nav-link`}
                                    to={`/global-settings/access/${item.grup_id}`}>
                                    <b>{item.grup_name}</b>
                                  </NavLink>
                                </li>
                              ))
                            }
                          </>
                        }

                      </ul>

                    </div>
                  </div>

                  <Switch>
                    {
                      this.state.cType === 'perusahaan' &&
                      <>
                        <Route path={`/global-settings`}  component={ProjectAdmin} />
                        {
                          roles.map(item => (
                            <Route key={item.link} path={`/global-settings${item.link}`} component={item.component} />
                          ))
                        }
                      </>
                    }

                    {
                      this.state.cType === 'pendidikan' &&
                      <Route path={`/global-settings/access/:grup_id`} component={(props) => <List {...props} />} />
                    }
                  </Switch>
      </div>
      </div>





      // <div className="pcoded-main-container" style={{ backgroundColor: "#F6F6FD" }}>
      //   <div className="pcoded-wrapper">
      //     <div className="pcoded-content" style={{ padding: '40px 40px 0 40px' }}>
      //       <div className="pcoded-inner-content">

      //         <div className="main-body">
      //           <div className="page-wrapper">

      //             <div className="row">
      //               <div className="col-sm-3">
      //                 <h3 className="f-w-bold f-21 fc-blue mb-4">Global Settings</h3>
      //               </div>
      //               {/*
      //               <div className="col-sm-2">
      //                 <label class="container">Webinar
      //                 <input type="radio" checked="checked" name="radio"></input>
      //                   <span class="checkmark"></span>
      //                 </label>
      //               </div>
      //               <div className="col-sm-2">
      //                 <label class="container">Meeting
      //                 <input type="radio" name="radio"></input>
      //                   <span class="checkmark"></span>
      //                 </label>
      //               </div>
      //               */}
      //             </div>

      //             <div className="row">
      //               <div className="col-xl-12">

      //                 <ul style={{ paddingBottom: '0px' }} className="nav nav-pills">
      //                   {
      //                     this.state.cType === 'perusahaan' &&
      //                     <>
      //                       {
      //                         roles.map((item, i) => (
      //                           <li key={i} className={`nav-item`}>
      //                             <NavLink style={{ borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }}
      //                               activeClassName='active'
      //                               className={`nav-link`}
      //                               to={`/global-settings${item.link}`}>
      //                               <b>{item.name}</b>
      //                             </NavLink>
      //                           </li>
      //                         ))
      //                       }
      //                     </>
      //                   }

      //                   {
      //                     this.state.cType === 'pendidikan' &&
      //                     <>
      //                       <li className={`nav-item`}>
      //                         <NavLink style={{ borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }}
      //                           className={`nav-link`}
      //                           to={`/global-settings/access/0`}>
      //                           <b>{`Admin`}</b>
      //                         </NavLink>
      //                       </li>
      //                       {
      //                         roles.map((item, i) => (
      //                           <li key={i} className={`nav-item`}>
      //                             <NavLink style={{ borderBottomLeftRadius: '0px', borderBottomRightRadius: '0px' }}
      //                               className={`nav-link`}
      //                               to={`/global-settings/access/${item.grup_id}`}>
      //                               <b>{item.grup_name}</b>
      //                             </NavLink>
      //                           </li>
      //                         ))
      //                       }
      //                     </>
      //                   }

      //                 </ul>

      //               </div>
      //             </div>

      //             <Switch>
      //               {
      //                 this.state.cType === 'perusahaan' &&
      //                 <>
      //                   <Route path={`/global-settings`} exact component={ProjectAdmin} />
      //                   {
      //                     roles.map(item => (
      //                       <Route key={item.link} path={`/global-settings${item.link}`} component={item.component} />
      //                     ))
      //                   }
      //                 </>
      //               }

      //               {
      //                 this.state.cType === 'pendidikan' &&
      //                 <Route path={`/global-settings/access/:grup_id`} component={(props) => <List {...props} />} />
      //               }
      //             </Switch>

      //           </div>

      //         </div>

      //       </div>
      //     </div>
      //   </div>
      // </div>
    );
  }

}