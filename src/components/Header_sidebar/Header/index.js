import React, { Component } from "react";
import { Link } from "react-router-dom";
import API, {USER_ME} from '../../../repository/api';
import Storage from '../../../repository/storage';

class Header extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      user: "Anonymous",
      level: "Member",
      avatar: "/assets/images/user/avatar-1.jpg",
      logo: '/assets/images/component/logo-icademy.png'
    };
  }

  componentDidMount() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if(res.status === 200){
        if(res.data.error) {
          localStorage.clear();
          window.location.reload();
        }

        Storage.set('user', {data: { 
          logo: res.data.result.logo,
          user_id: res.data.result.user_id, 
          email: res.data.result.email,
          user: res.data.result.name,
          level: res.data.result.level,
          avatar: res.data.result.avatar
            ? res.data.result.avatar
            : "/assets/images/user/avatar-1.jpg"
        }});
        this.setState({
          logo: res.data.result.logo,
          user: res.data.result.name,
          level: res.data.result.level,
          avatar: res.data.result.avatar
            ? res.data.result.avatar
            : "/assets/images/user/avatar-1.jpg"
        });
      }
    })
  }

  render() {
    let levelUser = Storage.get('user').data.level;
    let menuClients = [
      { iconOn: 'dashboardon.png', iconOff: 'dashboardoff.png', label: 'Dashboard', link: '/' },
      { iconOn: 'aktivitason.png', iconOff: 'aktivitasoff.png', label: 'Aktivitas', link: '/aktivitas' },
      { iconOn: 'materion.png', iconOff: 'materioff.png', label: 'Kursus & Materi', link: '/kursus' },
      { iconOn: 'diskusion.png', iconOff: 'diskusioff.png', label: 'Forum', link: '/forum' },
      { iconOn: 'kelason.png', iconOff: 'kelasoff.png', label: 'Group Meeting', link: '/liveclass' },
      { iconOn: 'profileon.png', iconOff: 'profileoff.png', label: 'Profile', link: '/profile' },
      { iconOn: 'pengaturanon.png', iconOff: 'pengaturanoff.png', label: 'Pengaturan', link: '/pengaturan' },
    ];

    let menuAdmins = [
      { iconOn: 'dashboardon.png', iconOff: 'dashboardoff.png', label: 'Dashboard', link: '/' },
      { iconOn: 'mycompanyon.png', iconOff: 'mycompanyoff.png', label: 'My Company', link: '/my-company' },
      { iconOn: 'materion.png', iconOff: 'materioff.png', label: 'Kursus & Materi', link: '/kursus-materi' },
      { iconOn: 'userson.png', iconOff: 'usersoff.png', label: 'Users', link: '/user-company' },
      { iconOn: 'accesson.png', iconOff: 'accessoff.png', label: 'Access', link: '/user-access' },
      { iconOn: 'profileon.png', iconOff: 'profileoff.png', label: 'Profile', link: '/profile' },
      { iconOn: 'pengaturanon.png', iconOff: 'pengaturanoff.png', label: 'Pengaturan', link: '/pengaturan' },
    ];

    let menuSuperAdmins = [
      { iconOn: 'dashboardon.png', iconOff: 'dashboardoff.png', label: 'Dashboard', link: '/' },
      { iconOn: 'foron.png', iconOff: 'foroff.png', label: 'Forum', link: '/forum' },
      { iconOn: 'kelason.png', iconOff: 'kelasoff.png', label: 'Kelas', link: '/liveclass' },
      { iconOn: 'userson.png', iconOff: 'usersoff.png', label: 'Users', link: '/user' },
      { iconOn: 'companyon.png', iconOff: 'companyoff.png', label: 'Company', link: '/company' },
      { iconOn: 'accesson.png', iconOff: 'accessoff.png', label: 'Access', link: '/user-access' },
      { iconOn: 'profileon.png', iconOff: 'profileoff.png', label: 'Profile', link: '/profile' },
      { iconOn: 'pengaturanon.png', iconOff: 'pengaturanoff.png', label: 'Pengaturan', link: '/pengaturan' },
    ];
  
    let menuContent = [];
    const { user, level } = this.state;
    return (
      <header className="navbar pcoded-header navbar-expand-lg navbar-light">
        <div className="m-header">
          {/* <a className="mobile-menu" id="mobile-collapse1" href="javascript:">
            <span />
          </a> */}
          <a href="/" className="b-brand">
            <div className="b-bg">
              <img
                src="assets/images/component/logo-mobile.png"
                className="logo-sidebar"
                style={{maxHeight:35}}
                alt=""
              />
            </div>
            <span className="b-title">ICADEMY</span>
          </a>
        </div>
        
        <a className="mobile-menu" id="mobile-header" href="javascript:">
          <i className="feather icon-more-horizontal" />
        </a>

        <div className="collapse navbar-collapse">
          <ul className="navbar-nav mr-auto">
            <li className="nav-item dropdown">
              <Link to="/Profile">
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
                      <small className="d-block  mt-2 text-c-grey" style={{textTransform: 'capitalize'}}>{level}</small>
                    </h6>
                  </div>
                </div>
              </Link>
            </li>
            <li className="nav-item dropdown">
                <div className="media">
                  <img
                    alt="Media"
                    style={{ height: 40 }}
                    src={this.state.logo}
                  />
                </div>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <li>
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
                  <ul className="noti-body">
                    <li className="n-title">
                      <p className="m-b-0">NEW</p>
                    </li>
                    <li className="notification">
                      <div className="media">
                        <img
                          className="img-radius"
                          src="assets/images/user/avatar-1.jpg"
                          alt="Generic placeholder image"
                        />
                        <div className="media-body">
                          <p>
                            <strong>John Doe</strong>
                            <span className="n-time text-muted">
                              <i className="icon feather icon-clock m-r-10" />
                              30 min
                            </span>
                          </p>
                          <p>New ticket Added</p>
                        </div>
                      </div>
                    </li>
                    <li className="n-title">
                      <p className="m-b-0">EARLIER</p>
                    </li>
                    <li className="notification">
                      <div className="media">
                        <img
                          className="img-radius"
                          src="assets/images/user/avatar-2.jpg"
                          alt="Generic placeholder image"
                        />
                        <div className="media-body">
                          <p>
                            <strong>Joseph William</strong>
                            <span className="n-time text-muted">
                              <i className="icon feather icon-clock m-r-10" />
                              30 min
                            </span>
                          </p>
                          <p>Prchace New Theme and make payment</p>
                        </div>
                      </div>
                    </li>
                    <li className="notification">
                      <div className="media">
                        <img
                          className="img-radius"
                          src="assets/images/user/avatar-3.jpg"
                          alt="Generic placeholder image"
                        />
                        <div className="media-body">
                          <p>
                            <strong>Sara Soudein</strong>
                            <span className="n-time text-muted">
                              <i className="icon feather icon-clock m-r-10" />
                              30 min
                            </span>
                          </p>
                          <p>currently login</p>
                        </div>
                      </div>
                    </li>
                  </ul>
                  <div className="noti-footer">
                    <a href="javascript:">show all</a>
                  </div>
                </div>
              </div>
            </li>
            
          </ul>
        </div>
      </header>
    );
  }
}

export default Header;
