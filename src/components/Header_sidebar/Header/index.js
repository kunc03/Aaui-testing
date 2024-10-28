/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import API, { USER_ME, API_SERVER } from '../../../repository/api';
import Storage from '../../../repository/storage';
import moment from 'moment-timezone';

class Header extends Component {
  state = {
    user: '',
    level: '',
    avatar: '/assets/images/user/avatar-1.png',
    notificationData: [],

    company: [],
    company_id: '',
    myCompanyName: '',

    menuAktif: '/',
    sideMenu: false,
    sideMenuCollapse: false,
    dateNow: Date.now(),
    logo: '',
    logoMulti: ''
  };

  pilihCompany = (e) => {
    e.preventDefault();
    const id = e.target.getAttribute('data-id');
    const logo = e.target.getAttribute('data-logo');
    const name = e.target.getAttribute('data-name');
    localStorage.setItem('companyID', id);
    localStorage.setItem('companyName', name);
    localStorage.setItem('logo', logo);
    let href = window.location.href;
    if (href.search("detail-project") > -1) {
      window.location.replace("/");
    } else {
      window.location.reload();
    }
  };

  fetchCompany() {
    this.setState({ menuAktif: window.location.pathname });
    let link =
      Storage.get('user').data.level == 'superadmin'
        ? `${API_SERVER}v1/company`
        : `${API_SERVER}v1/user/assign/${Storage.get('user').data.user_id}`;
    API.get(link)
      .then((response) => {
        if (Storage.get('user').data.level == 'superadmin') {
          this.setState({ company: response.data.result });
        } else {
          this.setState({ company: response.data.result.company });
        }
        this.setState({ logoMulti: this.state.company.filter((item) => item.company_id == localStorage.getItem('companyID'))[0].logo })

        let comp = Storage.get('user').data
        let idx = this.state.company.findIndex((str) => { return str.company_id == comp.company_id })
        if (idx == -1) {
          this.state.company.push(comp)
        } else {
          if (typeof parseInt(localStorage.getItem('companyID')) !== 'number') {
            this.state.company.pop(idx)
          }
        }
        console.log(idx, this.state.company, "TEST")
        console.log(this.state.company, 9090);
      })
      .catch(function (error) {});
  }

  goTo = (id) => {
    let data = this.state.notificationData.find((x) => x.id == id);
    if (typeof data == 'object') {
      API.get('v1/notification/read', { id: id }).then((res) => {
        if (data.destination) {
          window.location = data.destination;
        }
      });
    }
  };

  mobileMenuClicked() {
    this.setState({ sideMenu: false });
  }

  async componentDidMount() {
    await API.get(`${USER_ME}${Storage.get('user').data.email}`).then((res) => {
      if (res.status === 200) {

        if (res.data.error) {
          localStorage.clear();
          window.location.reload();
        }

        let userStorage = Storage.get('user').data;
        let addStorage = {
          ...userStorage,
          logo: res.data.result.logo,
          company_id: res.data.result.company_id,
          company_name: res.data.result.company_name,
          company_type: res.data.result.company_type,
          grup_id: res.data.result.grup_id,
          grup_name: res.data.result.grup_name,
          user: res.data.result.name,
          avatar: res.data.result.avatar ? res.data.result.avatar : '/assets/images/user/avatar-1.png'
        };

        Storage.set('user', { data: addStorage });

        this.setState({
          logo: res.data.result.logo,
          myCompanyName: res.data.result.company_name,
          company_id: res.data.result.company_id,
          user: res.data.result.name,
          role: res.data.result.grup_name,
          level: res.data.result.level,
          avatar: res.data.result.avatar
            ? res.data.result.avatar
            : '/assets/images/user/avatar-1.png',
        });

        if (this.state.level === 'client') {
          this.setState({ level: 'User' });
        }
      }
    });

    API.get(
      `${API_SERVER}v1/notification/unread/${Storage.get('user').data.user_id}`
    ).then((res) => {
      this.setState({ notificationData: res.data.result });
    });

    this.fetchCompany();
  }

  render() {
    const { user, role, level, company/* , notificationData */ } = this.state;

    // console.table(company);

    // let NotifBody = ({ list }) => {
    //   let unread = Object.values(list).filter((x) => x.isread == '0');
    //   let unclick = Object.values(list).filter((x) => x.isread == '2');

    //   console.log(unread, unclick);
    //   return (
    //     <ul className="noti-body" style={{maxHeight:400, overflowY:'scroll', overflowX:'hidden'}}>
    //       {unread.length ? (
    //         <li className="n-title">{/* <p className="m-b-0">NEW</p> */}</li>
    //       ) : null}

    //       {unread.map((item) => (
    //         <li className="notification" onClick={() => this.goTo(item.id)}>
    //           <div className="media">
    //             {/* <img
    //               className="img-radius"
    //               src="assets/images/user/avatar-1.png"
    //               alt="Generic placeholder image"
    //             /> */}
    //             <div className="media-body">
    //               <p>
    //                 {/* <strong>John Doe</strong> */}
    //                 <span className="n-time text-muted">
    //                   <i className="icon feather icon-clock m-r-10" />
    //                   {moment(item.created_at)
    //                     .tz(moment.tz.guess(true))
    //                     .format('DD MMMM YYYY')}
    //                 </span>
    //               </p>
    //               <p>
    //                 {/* {item.type === 1
    //                   ? 'Course'
    //                   : item.type === 2
    //                   ? 'Forum'
    //                   : 'Meeting'}{' '} */}
    //                 {item.description}
    //               </p>
    //             </div>
    //           </div>
    //         </li>
    //       ))}

    //       {unclick.length ? (
    //         <li className="n-title">
    //           <p className="m-b-0">EARLIER</p>
    //         </li>
    //       ) : null}

    //       {unclick.map((item) => (
    //         <li className="notification" onClick={() => this.goTo(item.id)}>
    //           <div className="media">
    //             <img
    //               className="img-radius"
    //               src="assets/images/user/avatar-1.jpg"
    //               alt="Generic placeholder image"
    //             />
    //             <div className="media-body">
    //               <p>
    //                 <strong>John Doe</strong>
    //                 <span className="n-time text-muted">
    //                   <i className="icon feather icon-clock m-r-10" />
    //                   {moment(item.created_at)
    //                     .tz(moment.tz.guess(true))
    //                     .format('DD MMMM YYYY')}
    //                 </span>
    //               </p>
    //               <p>
    //                 {item.type === 1
    //                   ? 'Course'
    //                   : item.type === 2
    //                   ? 'Forum'
    //                   : 'Meeting'}{' '}
    //                 {item.description}
    //               </p>
    //             </div>
    //           </div>
    //         </li>
    //       ))}
    //     </ul>
    //   );
    // };

    let access = Storage.get('access');
    let levelUser = Storage.get('user').data.level;
    let menuClients = [
      {
        iconOn: 'dashboardon.png',
        iconOff: 'dashboardoff.png',
        label: 'Dashboard',
        link: '/',
      },
      {
        iconOn: 'aktivitason.png',
        iconOff: 'aktivitasoff.png',
        label: 'Activity',
        link: '/aktivitas',
        access: 'activity',
      },
      // {
      //   iconOn: 'files-on.png',
      //   iconOff: 'files-off.png',
      //   label: 'Files',
      //   link: '/files',
      // },
      {
        iconOn: 'materion.png',
        iconOff: 'materioff.png',
        label: 'Kursus & Materi',
        link: '/kursus',
        access: 'course',
      },
      {
        iconOn: 'diskusion.png',
        iconOff: 'diskusioff.png',
        label: 'Forum',
        link: '/forum',
        access: 'forum',
      },
      {
        iconOn: 'kelason.png',
        iconOff: 'kelasoff.png',
        label: 'Group Meeting',
        link: '/meeting',
        access: access.manage_group_meeting
          ? 'manage_group_meeting'
          : 'group_meeting',
      },
      {
        iconOn: 'kelola-kursus-on.png',
        iconOff: 'kelola-kursus-off.png',
        label: 'Kelola Kursus',
        link: '/kursus-materi',
        access: 'manage_course',
      },
      {
        iconOn: 'profileon.png',
        iconOff: 'profileoff.png',
        label: 'Profile',
        link: '/profile',
      },
      {
        iconOn: 'pengaturanon.png',
        iconOff: 'pengaturanoff.png',
        label: 'Settings',
        link: '/pengaturan',
      },
    ];

    let menuAdmins = [
      {
        iconOn: 'dashboardon.png',
        iconOff: 'dashboardoff.png',
        label: 'Dashboard',
        link: '/',
      },
      {
        iconOn: 'aktivitason.png',
        iconOff: 'aktivitasoff.png',
        label: 'Activity',
        link: '/aktivitas',
      },
      {
        iconOn: 'files-on.png',
        iconOff: 'files-off.png',
        label: 'Files',
        link: '/files',
      },
      {
        iconOn: 'mycompanyon.png',
        iconOff: 'mycompanyoff.png',
        label: 'My Company',
        link: '/my-company',
      },
      {
        iconOn: 'materion.png',
        iconOff: 'materioff.png',
        label: 'Kursus & Materi',
        link: '/kursus',
      },
      {
        iconOn: 'kelason.png',
        iconOff: 'kelasoff.png',
        label: 'Group Meeting',
        link: '/meeting',
      },
      {
        iconOn: 'kelola-kursus-on.png',
        iconOff: 'kelola-kursus-off.png',
        label: 'Kelola Kursus',
        link: '/kursus-materi',
      },
      {
        iconOn: 'userson.png',
        iconOff: 'usersoff.png',
        label: 'Users',
        link: '/user-company',
      },
      // { iconOn: 'accesson.png', iconOff: 'accessoff.png', label: 'Access', link: '/user-access' },
      {
        iconOn: 'profileon.png',
        iconOff: 'profileoff.png',
        label: 'Profile',
        link: '/profile',
      },
      {
        iconOn: 'pengaturanon.png',
        iconOff: 'pengaturanoff.png',
        label: 'Settings',
        link: '/pengaturan',
      },
    ];

    let menuSuperAdmins = [
      {
        iconOn: 'dashboardon.png',
        iconOff: 'dashboardoff.png',
        label: 'Dashboard',
        link: '/',
      },
      {
        iconOn: 'aktivitason.png',
        iconOff: 'aktivitasoff.png',
        label: 'Activity',
        link: '/aktivitas',
      },
      {
        iconOn: 'files-on.png',
        iconOff: 'files-off.png',
        label: 'Files',
        link: '/files',
      },
      {
        iconOn: 'materion.png',
        iconOff: 'materioff.png',
        label: 'Kursus & Materi',
        link: '/kursus',
      },
      {
        iconOn: 'foron.png',
        iconOff: 'foroff.png',
        label: 'Forum',
        link: '/forum',
      },
      {
        iconOn: 'kelason.png',
        iconOff: 'kelasoff.png',
        label: 'Group Meeting',
        link: '/meeting',
      },
      {
        iconOn: 'kelola-kursus-on.png',
        iconOff: 'kelola-kursus-off.png',
        label: 'Kelola Kursus',
        link: '/kursus-materi',
      },
      {
        iconOn: 'kelola-kursus-on.png',
        iconOff: 'kelola-kursus-off.png',
        label: 'Manage Certificates',
        link: '/certificate-admin',
      },
      {
        iconOn: 'kelola-kursus-on.png',
        iconOff: 'kelola-kursus-off.png',
        label: 'Certificate',
        link: '/certificate',
      },
      {
        iconOn: 'companyon.png',
        iconOff: 'companyoff.png',
        label: 'Company',
        link: '/company',
      },
      {
        iconOn: 'userson.png',
        iconOff: 'usersoff.png',
        label: 'Users',
        link: '/user',
      },
      // { iconOn: 'accesson.png', iconOff: 'accessoff.png', label: 'Access', link: '/user-access' },
      {
        iconOn: 'profileon.png',
        iconOff: 'profileoff.png',
        label: 'Profile',
        link: '/profile',
      },
      {
        iconOn: 'pengaturanon.png',
        iconOff: 'pengaturanoff.png',
        label: 'Settings',
        link: '/pengaturan',
      },
    ];

    const { menuAktif } = this.state;

    let menuContent = [];
    if (levelUser === 'superadmin') {
      menuContent = menuSuperAdmins;
    } else if (levelUser === 'admin') {
      menuContent = menuAdmins;
    } else {
      menuContent = menuClients;
    }

    return (
      <header className="navbar pcoded-header navbar-expand-lg navbar-light" style={{ marginBottom: -1, background: '#FFF' }}>
        <div className="m-header">
          <a
            className="mobile-menu"
            id="mobile-collapse"
            href="javascript:"
            onClick={(a) => {
              this.setState({
                sideMenu:
                  a.currentTarget.className.split(' ')[1] === 'on'
                    ? true
                    : false,
              });
            }}
          >
            <span />
          </a>
          <a href="/" className="b-brand">
            <div className="b-bg">
              <img
                src="assets/images/component/logo-mobile.png"
                className="logo-sidebar"
                style={{ maxHeight: 35 }}
                alt=""
              />
            </div>
            <span className="b-title">ICADEMY</span>
          </a>
        </div>

        <a className="mobile-menu" id="mobile-header" href="javascript:">
          <i className="feather icon-more-horizontal" />
        </a>

        <div
          className={
            this.state.sideMenu
              ? 'collapse navbar-collapse side-mobile-custom'
              : 'hidden'
          }
          style={{ width: '100%' }}
        >
          <ul className="navbar-nav mr-auto">
            <div>
              {menuContent.map((item, i) => {
                if (item.access == undefined || access[item.access]) {
                  return (
                    <li
                      data-username="Sample Page"
                      className={`nav-item mt-4 ${menuAktif === item.link ? 'active' : ''
                        }`}
                    >
                      <Link
                        to={item.link}
                        className="nav-link"
                        onClick={this.mobileMenuClicked.bind(this)}
                      >
                        <span className="pcoded-micon">
                          <img
                            src={`assets/images/component/${menuAktif === item.link
                              ? item.iconOn
                              : item.iconOff
                              }`}
                            alt=""
                          ></img>
                        </span>
                        <span
                          className="pcoded-mtext f-16 f-w-bold"
                          style={{
                            color: `${menuAktif == item.link ? '#fff' : '#945A86'
                              }`,
                          }}
                        >
                          &nbsp;{item.label}
                        </span>
                      </Link>
                    </li>
                  );
                }
              })}
              <li data-username="Sample Page" className="nav-item mt-4">
                <Link
                  to="/logout"
                  className="nav-link"
                  style={{ marginBottom: '8px' }}
                >
                  <span className="pcoded-micon">
                    <img
                      src="assets/images/component/Icon Logout.png"
                      style={{
                        paddingLeft: '3px',
                      }}
                      alt=""
                    ></img>
                  </span>
                  <span
                    className="pcoded-mtext f-16 f-w-bold"
                    style={{ color: '#945A86' }}
                  >
                    &nbsp;Logout
                  </span>
                </Link>
              </li>
            </div>
          </ul>
        </div>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item dropdown">
              <Link to="/pengaturan">
                <div className="media">
                  <img
                    alt="Media"
                    className="img-radius"
                    style={{ width: 40, height: 40 }}
                    src={this.state.avatar}
                  />
                  <div className="media-body mt-1 ml-1">
                    <h6 className="chat-header f-w-900">
                      {user}
                      <small
                        className="d-block  mt-2 text-c-grey"
                        style={{ textTransform: 'capitalize' }}
                      >
                        {role}
                      </small>
                    </h6>
                  </div>
                </div>
              </Link>
            </li>

          </ul>

          <ul className="navbar-nav ml-auto">

            <span className="fc-muted">{moment().local().format('DD MMMM YYYY')} (GMT{moment(this.state.dateNow).local().format('Z')} {moment.tz.guess(true)})</span>
            {/* <li>
              <div className="dropdown">
                <a className href="javascript:" data-toggle="dropdown">
                  <i className="icon feather icon-bell f-20 text-c-grey" />
                  <i
                    className="fa fa-circle text-warning notif"
                    style={{ fontSize: 11 }}
                  />
                </a>
                <div className="dropdown-menu dropdown-menu-right notification">
                  <div className="noti-head">
                    <h6 className="d-inline-block m-b-0">Notifications</h6>
                    <div className="float-right">
                      <a href="javascript:" className="m-r-10">
                        mark as read
                      </a>
                      <a href="javascript:">clear all</a>
                    </div>
                  </div>

                  <NotifBody list={notificationData} />

                  <div className="noti-footer">
                    <a href="javascript:">show all</a>
                  </div>
                </div>
              </div>
            </li> */}
          </ul>

          <ul className="navbar-nav">
            <li className="nav-item dropdown">
              <div className="media">
                <img
                  alt="Media"
                  style={{ height: 26 }}
                  alt=""
                  src={
                    localStorage.getItem('companyID')
                      ? this.state.logoMulti
                      : this.state.logo
                  }
                />
              </div>
            </li>
          </ul>


          {/* {(level == 'superadmin' || level == 'admin') && ( */}
          <ul className="navbar-nav">
            <li>
              <div className="dropdown">
                <a href="javascript:;" data-toggle="dropdown">
                  <img
                    src={`newasset/company.svg`}
                    alt=""
                    width={25}
                  ></img>
                </a>
                <div className="dropdown-menu dropdown-menu-right notification">
                  <div className="noti-head">
                    <h6 className="d-inline-block m-b-0">
                      <b>{this.state.company.length > 0
                        ? 'Select Company'
                        : 'Not multiple company'}
                      </b>
                    </h6>
                  </div>
                  <ul className="noti-body" style={{ maxHeight: 400, overflowY: 'scroll', overflowX: 'hidden' }}>
                    { //(level == 'admin' || level == 'client') && (
                      // <li
                      //   className="notification"
                      //   style={{ cursor: 'pointer' }}
                      //   onClick={this.pilihCompany}
                      //   data-id={this.state.company_id}
                      //   data-logo={this.state.logo}
                      // >
                      //   <div
                      //     className="media"
                      //     data-id={this.state.company_id}
                      //     data-logo={this.state.logo}
                      //   >
                      //     <img
                      //       data-id={this.state.company_id}
                      //       data-logo={this.state.logo}
                      //       className="img-radius"
                      //       src={this.state.logo}
                      //       alt=""
                      //     />
                      //     <div
                      //       className="media-body"
                      //       data-id={this.state.company_id}
                      //       data-logo={this.state.logo}
                      //     >
                      //       <p
                      //         data-id={this.state.company_id}
                      //         data-logo={this.state.logo}
                      //       >
                      //         <b
                      //           data-id={this.state.company_id}
                      //           data-logo={this.state.logo}
                      //         >
                      //           {this.state.myCompanyName}
                      //         </b>
                      //       </p>
                      //       {localStorage.getItem('companyID') ==
                      //         this.state.company_id && (
                      //           <p
                      //             data-id={this.state.company_id}
                      //             data-logo={this.state.logo}
                      //             style={{ color: 'green' }}
                      //           >
                      //             active
                      //           </p>
                      //         )}
                      //     </div>
                      //   </div>
                      // </li>
                      //)
                    }
                    {company.map((item, i) => (

                      <li
                        className="notification"
                        style={{ cursor: 'pointer' }}
                        onClick={this.pilihCompany}
                        data-id={item.company_id}
                        data-logo={item.logo}
                        data-name={item.company_name}
                      >
                        <div
                          className="media"
                          data-id={item.company_id}
                          data-logo={item.logo}
                          data-name={item.company_name}
                        >
                          <img
                            data-id={item.company_id}
                            data-logo={item.logo}
                            data-name={item.company_name}
                            className="img-radius"
                            src={item.logo}
                            alt=""
                          />
                          <div
                            className="media-body"
                            data-id={item.company_id}
                            data-logo={item.logo}
                            data-name={item.company_name}
                          >
                            <p
                              data-id={item.company_id}
                              data-logo={item.logo}
                              data-name={item.company_name}
                            >
                              <b
                                data-id={item.company_id}
                                data-logo={item.logo}
                                data-name={item.company_name}
                              >
                                {item.company_name}
                              </b>

                              <span style={{ color: item.company_id == localStorage.getItem('companyID') ? 'green' : 'red', float: 'right' }}>{item.company_id == localStorage.getItem('companyID') ? 'Active' : null}</span>
                            </p>

                            {/* {parseInt(localStorage.getItem('companyID')) ==
                                item.company_id && (
                                <p
                                  data-id={item.company_id}
                                  style={{ color: 'green' }}
                                >
                                  {item.status}
                                </p>
                              )} */}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          </ul>
          {/* )} */}
        </div>
      </header>
    );
  }
}

export default Header;
