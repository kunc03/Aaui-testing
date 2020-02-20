import React, { Component } from "react";
import { Link } from "react-router-dom";
import Storage from '../../../repository/storage';

class Sidebar extends Component {
  state = {
    menuAktif: '/'
  }

  componentDidMount() {
    this.setState({ menuAktif: window.location.pathname })
  }

  render() {
    let levelUser = Storage.get('user').data.level;
    let menuClients = [
      { iconOn: 'dashboardon.png', iconOff: 'dashboardoff.png', label: 'Dashboard', link: '/' },
      { iconOn: 'aktivitason.png', iconOff: 'aktivitasoff.png', label: 'Aktivitas', link: '/aktivitas' },
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

    const { menuAktif } = this.state;
  
    let menuContent = [];
    if(levelUser === 'superadmin') {
      menuContent = menuSuperAdmins;
    } else if(levelUser === 'admin') {
      menuContent = menuAdmins;
    } else {
      menuContent = menuClients;
    }

    return (
      <nav className="pcoded-navbar">
        <div className="navbar-wrapper">
          <div className="navbar-brand header-logo">
            <Link to="/" className="b-brand">
              <div className="b-bg">  
                <span className="pcoded-micon">
                  <img
                    src="assets/images/component/Logo Ideku.png"
                    className="logo-sidebar"
                    alt=""
                  />
                </span>
              </div>
              <span className="b-title">IDEKU</span>
            </Link>
            <a href="javascript:" className="mobile-menu" id="mobile-collapse">
              <span />
            </a>
          </div>

          <div className="navbar-content scroll-div">
            <ul className="nav pcoded-inner-navbar">
              <li className="nav-item pcoded-menu-caption">
                <label />
              </li>

              <div>
              {
                menuContent.map((item, i) => (
                  <li data-username="Sample Page" className={`nav-item mt-4 ${menuAktif === item.link ? 'active':''}`}>
                    <Link to={item.link} className="nav-link">
                      <span className="pcoded-micon">
                        <img
                          src={`assets/images/component/${menuAktif === item.link ? item.iconOn : item.iconOff}`}
                          alt=""
                        ></img>
                      </span>
                      <span className="pcoded-mtext f-16 f-w-bold" style={{ color: `${menuAktif == item.link ? '#fff':'#945A86'}` }}>
                        {item.label}
                      </span>
                    </Link>
                  </li>
                ))
              }
              </div>

              <li data-username="Sample Page" className="nav-item mt-4  bg-c-purple-dark">
                <Link to="/logout" className="nav-link" style={{marginBottom: '8px'}}>
                  <span className="pcoded-micon">
                    <img
                      src="assets/images/component/Icon Logout.png"
                      style={{
                        paddingLeft: "3px"
                      }}
                      alt=""
                    ></img>
                  </span>
                  <span className="pcoded-mtext f-16 f-w-bold">Logout</span>
                </Link>
              </li>

            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default Sidebar;