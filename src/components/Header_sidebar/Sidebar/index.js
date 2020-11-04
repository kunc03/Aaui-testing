import React, { Component } from "react";
import { Link } from "react-router-dom";
import Storage from '../../../repository/storage';
import Tooltip from '@material-ui/core/Tooltip';

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuAktif: '/',
      sideMenu: true,
      sideMenuCollapse:false,
    }
  }

//   sideMenuCollapse = e =>{
//     this.setState({sideMenu:!this.state.sideMenu});
//     console.log('side menu',this.state.sideMenu);
// }
  componentDidMount() {
    this.setState({ menuAktif: window.location.pathname })
  }


  render() {
    let access = Storage.get('access');
    let levelUser = Storage.get('user').data.level;

    console.log('Storage: ', Storage.get('user'));

    let menuClients = {
      murid: {
        submenu: [
          { iconOn: 'matapelajaranon.svg', iconOff: 'matapelajaranon.svg', label: 'Mata Pelajaran', link: '/murid/mata-pelajaran' },
          { iconOn: 'tugason.svg', iconOff: 'tugasoff.svg', label: 'Tugas', link: '/murid/tugas' },
          { iconOn: 'ujianoff.svg', iconOff: 'ujianoff.svg', label: 'Ujian', link: '/murid/ujian' },
          { iconOn: 'laporanraporon.svg', iconOff: 'laporanraporoff.svg', label: 'Laporan/Rapor', link: '/murid/rapor' },
          { iconOn: 'liveclasswebinaroff.svg', iconOff: 'liveclasswebinaroff.svg', label: 'Liveclass/Webinar', link: '/murid/liveclass' },
          { iconOn: 'logout.svg', iconOff: 'logout.svg', label: 'Logout', link: '/logout' },
        ]
      },

      guru: {
        submenu: [
          { iconOn: 'people-on.svg', iconOff: 'people.svg', label: 'Personalia', link: '/guru/personalia' },
          { iconOn: 'matapelajaranon.svg', iconOff: 'graduate.svg', label: 'Kursus', link: '/guru/kursus' },
          { iconOn: 'tugason.svg', iconOff: 'tugasoff.svg', label: 'Exercise & Ujian', link: '/guru/ujian' },
          { iconOn: 'info-on.svg', iconOff: 'info.svg', label: 'Informasi Kelas', link: '/guru/informasi-kelas' },
          { iconOn: 'instructor-on.svg', iconOff: 'instructor.svg', label: 'KPI Guru', link: '/guru/kpi' },
          { iconOn: 'logout.svg', iconOff: 'logout.svg', label: 'Logout', link: '/logout' },
        ]
      },

      other: {
        submenu : [
          // { iconOn: 'files.svg', iconOff: 'files.svg', label: 'Files', link: '/files' },
          { iconOn: 'materi.svg', iconOff: 'materi.svg', label: 'Kursus & Materi', link: '/kursus', access: 'course' },
          { iconOn: 'forum.svg', iconOff: 'forum.svg', label: 'Forum', link: '/forum', access: 'forum' },
          { iconOn: 'conference.svg', iconOff: 'conference.svg', label: 'Group Meeting', link: '/meeting', access: access.manage_group_meeting ? 'manage_group_meeting' : 'group_meeting' },
          { iconOn: 'kursus.svg', iconOff: 'kursus.svg', label: 'Kelola Kursus', link: '/kursus-materi', access: 'manage_course' },
          { iconOn: 'sertifikat.svg', iconOff: 'sertifikat.svg', label: 'Sertifikat', link: '/certificate' },
          { iconOn: 'logout.svg', iconOff: 'logout.svg', label: 'Logout', link: '/logout' },
        ],
      },

      menuAtas : [
        { iconOn: 'notification.svg', iconOff: 'notification.svg', label: 'Notification', link: '/notification' },
        { iconOn: 'mail-2.svg', iconOff: 'mail-2.svg', label: 'Pengumuman', link: '/pengumuman' },
        { iconOn: 'calendar-on.svg', iconOff: 'calendar.svg', label: 'Aktivitas', link: '/aktivitas' },
      ],
      menuBawah : [
        { iconOn: 'dashboard-on.svg', iconOff: 'dashboard.svg', label: 'Dashboard', link: '/' },
        { iconOn: 'setting-on.svg', iconOff: 'setting.svg', label: 'Pengaturan', link: '/pengaturan' },
        { iconOn: 'user-on.svg', iconOff: 'user.svg', label: 'Profile', link: '/profile' },
      ]
    };

    let menuAdmins = {
      submenu : [
        { iconOn: 'files.svg', iconOff: 'files.svg', label: 'Files', link: '/files' },
        { iconOn: 'materi.svg', iconOff: 'materi.svg', label: 'Kursus & Materi', link: '/kursus' },
        { iconOn: 'forum.svg', iconOff: 'forum.svg', label: 'Forum', link: '/forum' },
        { iconOn: 'conference.svg', iconOff: 'conference.svg', label: 'Group Meeting', link: '/meeting' },
        { iconOn: 'kursus.svg', iconOff: 'kursus.svg', label: 'Kelola Kursus', link: '/kursus-materi' },
        { iconOn: 'sertifikat.svg', iconOff: 'sertifikat.svg', label: 'Sertifikat', link: '/certificate' },
        { iconOn: 'sertifikat.svg', iconOff: 'sertifikat.svg', label: 'Kelola Sertifikat', link: '/certificate-admin' },
        { iconOn: 'conference.svg', iconOff: 'conference.svg', label: 'My Company', link: '/my-company' },
        { iconOn: 'conference.svg', iconOff: 'conference.svg', label: 'Users', link: '/user-company' },
        { iconOn: 'logout.svg', iconOff: 'logout.svg', label: 'Logout', link: '/logout' },
      ],
      menuAtas : [
        { iconOn: 'notification.svg', iconOff: 'notification.svg', label: 'Notification', link: '/notification' },
        { iconOn: 'mail-2.svg', iconOff: 'mail-2.svg', label: 'Pengumuman', link: '/pengumuman' },
        { iconOn: 'calendar-on.svg', iconOff: 'calendar.svg', label: 'Aktivitas', link: '/aktivitas' },
      ],
      menuBawah : [
        { iconOn: 'dashboard-on.svg', iconOff: 'dashboard.svg', label: 'Dashboard', link: '/' },
        { iconOn: 'setting-on.svg', iconOff: 'setting.svg', label: 'Pengaturan', link: '/pengaturan' },
        { iconOn: 'user-on.svg', iconOff: 'user.svg', label: 'Profile', link: '/profile' },
      ]
    };

    let menuSuperAdmins = {
      submenu : [
        { iconOn: 'files.svg', iconOff: 'files.svg', label: 'Files', link: '/files' },
        { iconOn: 'materi.svg', iconOff: 'materi.svg', label: 'Kursus & Materi', link: '/kursus' },
        { iconOn: 'forum.svg', iconOff: 'forum.svg', label: 'Forum', link: '/forum' },
        { iconOn: 'conference.svg', iconOff: 'conference.svg', label: 'Group Meeting', link: '/meeting' },
        { iconOn: 'kursus.svg', iconOff: 'kursus.svg', label: 'Kelola Kursus', link: '/kursus-materi' },
        { iconOn: 'sertifikat.svg', iconOff: 'sertifikat.svg', label: 'Sertifikat', link: '/certificate' },
        { iconOn: 'sertifikat.svg', iconOff: 'sertifikat.svg', label: 'Kelola Sertifikat', link: '/certificate-admin' },
        { iconOn: 'conference.svg', iconOff: 'conference.svg', label: 'Company', link: '/company' },
        { iconOn: 'conference.svg', iconOff: 'conference.svg', label: 'Users', link: '/user' },
        { iconOn: 'logout.svg', iconOff: 'logout.svg', label: 'Logout', link: '/logout' },
      ],
      menuAtas : [
        { iconOn: 'notification.svg', iconOff: 'notification.svg', label: 'Notification', link: '/notification' },
        { iconOn: 'mail-2.svg', iconOff: 'mail-2.svg', label: 'Pengumuman', link: '/pengumuman' },
        { iconOn: 'calendar-on.svg', iconOff: 'calendar.svg', label: 'Aktivitas', link: '/aktivitas' },
      ],
      menuBawah : [
        { iconOn: 'dashboard-on.svg', iconOff: 'dashboard.svg', label: 'Dashboard', link: '/' },
        { iconOn: 'setting-on.svg', iconOff: 'setting.svg', label: 'Pengaturan', link: '/pengaturan' },
        { iconOn: 'user-on.svg', iconOff: 'user.svg', label: 'Profile', link: '/profile' },
      ]
    };

    const { menuAktif } = this.state;

    let menuContent = [];
    let menuAtas = [];
    let menuBawah = [];
    if(levelUser === 'superadmin') {
      menuContent = menuSuperAdmins.submenu;
      menuAtas = menuSuperAdmins.menuAtas;
      menuBawah = menuSuperAdmins.menuBawah;
    } else if(levelUser === 'admin') {
      menuContent = menuAdmins.submenu;
      menuAtas = menuAdmins.menuAtas;
      menuBawah = menuAdmins.menuBawah;
    } else {
      let subMenuClient = Storage.get('user').data.grup_name.toString().toLowerCase();
      menuContent = menuClients[subMenuClient].submenu;
      // menuAtas = menuClients.guru.submenu;
      menuAtas = menuClients.menuAtas;
      menuBawah = menuClients.menuBawah;
    }

    return (
        <nav className="pcoded-navbar navbar-collapsed"> {/** navbar-collapsed */}
          <div className="navbar-wrapper" style={{borderTopRightRadius: '60px'}}>
            <div className="navbar-brand header-logo">
              <Link to="/" className="b-brand" style={{width:'100%'}}>
                    <img
                      src={`assets/images/component/${this.state.sideMenu ? 'logo-mobile.png':'Logo Ideku.png'}`}
                      alt=""
                      style={{width:'90%', height:'auto',paddingLeft:'5%'}}
                    />
                {/* <span className="b-title">IDEKU</span> */}
              </Link>

                {/* <a style={{cursor:'pointer'}} className="mobile-menu" id="mobile-collapse" ><span /></a> */}

            </div>

            {/* scroll-div */}
            <div className="navbar-content" style={{background:'none'}}>
              <ul className="nav pcoded-inner-navbar">
                {/* <li className="nav-item pcoded-menu-caption">
                  <label />
                </li> */}

                <li id="mobile-collapse" data-username="Sample Page"
                    className={`nav-item`}
                    style={this.state.sideMenu ? {width:59, cursor: 'pointer'} : {marginTop:25, cursor: 'pointer'}}  >
                      <Tooltip title="Menu" arrow placement="right">
                      <div className="nav-link"
                        style={this.state.sideMenu ? {padding:'7px 0px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' } : {padding:"7px 20px"}}
                      >
                        <span className="pcoded-micon" style={this.state.sideMenu ? {marginRight: 0, padding:0, width:'auto'} : null}>
                          <img
                            src={`newasset/burger-menu.svg`}
                            alt=""
                            width={25}
                          ></img>
                        </span>
                      </div>
                      </Tooltip>
                </li>

                {
                  menuAtas.map((item, i) => {
                    if(item.access == undefined || access[item.access]) {
                      return (
                <li data-username="Sample Page"
                    className={`nav-item`}
                    style={this.state.sideMenu ? {width:59, cursor: 'pointer'} : {marginTop:25, cursor: 'pointer'}}  >
                      <Tooltip title={item.label} arrow placement="right">
                      <Link className="nav-link" to={item.link}
                        style={this.state.sideMenu ? {marginTop:35, padding:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', width:'auto' } : {padding:"7px 20px"}}
                      >
                        <span className="pcoded-micon" style={this.state.sideMenu ? {marginRight: 0} : null}>
                          <img
                            src={`newasset/${menuAktif === item.link ? item.iconOn : item.iconOff}`}
                            alt=""
                            width={25}
                          ></img>
                        </span>
                      </Link>
                      </Tooltip>
                </li>
                      )
                    }
                  })
                }

              </ul>
              <ul className="nav pcoded-inner-navbar" style={{position:'fixed', bottom:35}}>

              {
                  menuBawah.map((item, i) => {
                    if(item.access == undefined || access[item.access]) {
                      return (
                        <li data-username="Sample Page"
                            className={`nav-item mt-4 `}
                            style={this.state.sideMenu ? {width:59} : {marginTop:25}}
                          >
                            <Tooltip title={item.label} arrow placement="right">
                            <Link to={item.link} className="nav-link"
                              style={this.state.sideMenu ? {padding:'7px 0px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' } : {padding:"7px 20px"}}
                            >
                              <span className="pcoded-micon" style={this.state.sideMenu ? {marginRight: 0} : null}>
                                <img
                                  src={`newasset/${menuAktif === item.link ? item.iconOn : item.iconOff}`}
                                  alt=""
                                  width={25}
                                ></img>
                              </span>
                            </Link>
                            </Tooltip>
                          </li>
                      )
                    }
                  })
                }
                {/* <li data-username="Sample Page"
                  className={`nav-item mt-4 `}
                  style={this.state.sideMenu ? {width:59} : {marginTop:25}}
                >
                  <Link to="/logout" className="nav-link"
                    style={this.state.sideMenu ? {padding:'7px 0px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' } : {padding:"7px 20px"}}
                  >
                    <span className="pcoded-micon" style={this.state.sideMenu ? {marginRight: 0} : null}>
                      <img
                        src={`assets/images/component/Icon Logout.png`}
                        alt=""
                        width={20}
                        height={20}
                      ></img>
                    </span>
                  </Link>
                </li> */}
              </ul>
            </div>
          </div>

          <div className="custom-side-bar">
            <h4 className="p-20 mt-5" style={{borderBottom: '1px solid #E6E6E6'}}><strong> Menu </strong></h4>
            <div>
                {
                  menuContent.map((item, i) => {
                    if(item.access == undefined || access[item.access]) {
                      return (
                        <Link to={item.link} style={{color: '#797979'}}>
                          <div className="p-10" style={{borderBottom: '1px solid #E6E6E6', paddingLeft:28}}>
                            <img
                              src={`newasset/${menuAktif === item.link ? item.iconOn : item.iconOff}`}
                              style={{marginRight:15}}
                              alt=""
                              height={15}
                            ></img>
                              {item.label}
                          </div>
                        </Link>
                      )
                    }
                  })
                }
              </div>



          </div>
        </nav>
    );
  }
}

export default Sidebar;
