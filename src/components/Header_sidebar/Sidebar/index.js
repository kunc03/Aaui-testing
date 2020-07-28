import React, { Component } from "react";
import { Link } from "react-router-dom";
import Storage from '../../../repository/storage';

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
    let menuClients = [
      { iconOn: 'dashboardon.png', iconOff: 'dashboardoff.png', label: 'Dashboard', link: '/' },
      { iconOn: 'aktivitason.png', iconOff: 'aktivitasoff.png', label: 'Aktivitas', link: '/aktivitas', access: 'activity' },
      { iconOn: 'materion.png', iconOff: 'materioff.png', label: 'Kursus & Materi', link: '/kursus', access: 'course' },
      { iconOn: 'diskusion.png', iconOff: 'diskusioff.png', label: 'Forum', link: '/forum', access: 'forum' },
      { iconOn: 'kelason.png', iconOff: 'kelasoff.png', label: 'Group Meeting', link: access.manage_group_meeting ? '/meeting' : '/liveclass', access: access.manage_group_meeting ? 'manage_group_meeting' : 'group_meeting' },
      { iconOn: 'kelola-kursus-on.png', iconOff: 'kelola-kursus-off.png', label: 'Kelola Kursus', link: '/kursus-materi', access: 'manage_course' },
      { iconOn: 'certificateon.png', iconOff: 'certificate.png', label: 'Sertifikat', link: '/certificate' },
      { iconOn: 'profileon.png', iconOff: 'profileoff.png', label: 'Profile', link: '/profile' },
      { iconOn: 'pengaturanon.png', iconOff: 'pengaturanoff.png', label: 'Pengaturan', link: '/pengaturan' },
    ];

    let menuAdmins = [
      { iconOn: 'dashboardon.png', iconOff: 'dashboardoff.png', label: 'Dashboard', link: '/' },
      { iconOn: 'aktivitason.png', iconOff: 'aktivitasoff.png', label: 'Aktivitas', link: '/aktivitas' },
      { iconOn: 'mycompanyon.png', iconOff: 'mycompanyoff.png', label: 'My Company', link: '/my-company' },
      { iconOn: 'materion.png', iconOff: 'materioff.png', label: 'Kursus & Materi', link: '/kursus' },
      { iconOn: 'kelason.png', iconOff: 'kelasoff.png', label: 'Group Meeting', link: '/liveclass' },
      { iconOn: 'kelola-kursus-on.png', iconOff: 'kelola-kursus-off.png', label: 'Kelola Kursus', link: '/kursus-materi' },
      { iconOn: 'certificateon.png', iconOff: 'certificate.png', label: 'Sertifikat', link: '/certificate' },
      { iconOn: 'kelolacertificateon.png', iconOff: 'kelolacertificate.png', label: 'Kelola Sertifikat', link: '/certificate-admin' },
      { iconOn: 'userson.png', iconOff: 'usersoff.png', label: 'Users', link: '/user-company' },
      // { iconOn: 'accesson.png', iconOff: 'accessoff.png', label: 'Access', link: '/user-access' },
      { iconOn: 'profileon.png', iconOff: 'profileoff.png', label: 'Profile', link: '/profile' },
      { iconOn: 'pengaturanon.png', iconOff: 'pengaturanoff.png', label: 'Pengaturan', link: '/pengaturan' },
    ];

    let menuSuperAdmins = [
      { iconOn: 'dashboardon.png', iconOff: 'dashboardoff.png', label: 'Dashboard', link: '/' },
      { iconOn: 'aktivitason.png', iconOff: 'aktivitasoff.png', label: 'Aktivitas', link: '/aktivitas' },
      { iconOn: 'materion.png', iconOff: 'materioff.png', label: 'Kursus & Materi', link: '/kursus' },
      { iconOn: 'foron.png', iconOff: 'foroff.png', label: 'Forum', link: '/forum' },
      { iconOn: 'kelason.png', iconOff: 'kelasoff.png', label: 'Group Meeting', link: '/liveclass' },
      { iconOn: 'kelola-kursus-on.png', iconOff: 'kelola-kursus-off.png', label: 'Kelola Kursus', link: '/kursus-materi' },
      { iconOn: 'certificateon.png', iconOff: 'certificate.png', label: 'Sertifikat', link: '/certificate' },
      { iconOn: 'kelolacertificateon.png', iconOff: 'kelolacertificate.png', label: 'Kelola Sertifikat', link: '/certificate-admin' },
      { iconOn: 'companyon.png', iconOff: 'companyoff.png', label: 'Company', link: '/company' },
      { iconOn: 'userson.png', iconOff: 'usersoff.png', label: 'Users', link: '/user' },
      // { iconOn: 'accesson.png', iconOff: 'accessoff.png', label: 'Access', link: '/user-access' },
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
      
        <nav className="pcoded-navbar navbar-collapsed" onMouseOver={e => this.setState({sideMenu:false})} onMouseOut={e => this.setState({sideMenu:true})}>
          <div className="navbar-wrapper">
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

            <div className="navbar-content scroll-div">
              <ul className="nav pcoded-inner-navbar">
                <li className="nav-item pcoded-menu-caption">
                  <label />
                </li>

                <div>
                {
                  menuContent.map((item, i) => {
                    if(item.access == undefined || access[item.access]) {
                      return (
                        <li data-username="Sample Page"
                          className={`nav-item ${menuAktif === item.link ? 'active':''}`}
                          style={this.state.sideMenu ? {width:80} : {marginTop:25}}  
                        >
                          <Link to={item.link} className="nav-link"
                            style={this.state.sideMenu ? {padding:'7px 0px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' } : {padding:"7px 20px"}}
                          >
                            <span className="pcoded-micon" style={this.state.sideMenu ? {marginRight: 0} : null}>
                              <img
                                src={`assets/images/component/${menuAktif === item.link ? item.iconOn : item.iconOff}`}
                                alt=""
                                width={20}
                                height={20}
                              ></img>
                            </span>
                            <span
                              className={ this.state.sideMenu ? "pcoded-mtext f-12" : "pcoded-mtext f-14 f-w-bold"}
                              style={this.state.sideMenu ? {position: 'relative', textAlign:'center', padding:2, color: `${menuAktif == item.link ? '#fff':'#945A86'}`} : {color: `${menuAktif == item.link ? '#fff':'#945A86'}`}}>
                              {item.label}
                            </span>
                          </Link>
                        </li>
                      )
                    }
                  })
                }
                </div>

                <li data-username="Sample Page" className="nav-item mt-4  bg-c-purple-dark">
                  <Link to="/logout" className="nav-link" style={{marginBottom: '8px', padding:"7px 20px"}} >
                    <span className="pcoded-micon">
                      <img
                        src="assets/images/component/Icon Logout.png"
                        width={20}
                        height={20}
                        style={{
                          paddingLeft: "3px"
                        }}
                        alt=""
                      ></img>
                    </span>
                    <span className="pcoded-mtext f-14 f-w-bold">Logout</span>
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