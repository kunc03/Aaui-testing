import React, { Component } from "react";
import { Link } from "react-router-dom";
import Storage from '../../../repository/storage';
import Tooltip from '@material-ui/core/Tooltip';
import API, { API_SERVER, USER_ME, APPS_SERVER, BBB_URL, BBB_KEY } from '../../../repository/api';
import SocketContext from '../../../socket';
import { toast } from 'react-toastify'
import moment from 'moment-timezone'

const Msg = ({ id, desc, socket, startTimer }) => {
  const readReminder = (id) => {
    API.put(`${API_SERVER}v1/notification/read`, { id }).then(res => {
      if (res.data.error) console.log('Gagal read')
      socket.emit('send', { companyId: Storage.get('user').data.company_id })
    })
  }

  const snoozeTime = (data, time) => {
    console.log(data, time)
    startTimer(time * 60)
  }

  return (
    <div>
      {desc}
      <br />
      <div>
        <label>Snooze&nbsp;</label>
        <button style={{ marginTop: '8px', cursor: 'pointer' }} onClick={e => snoozeTime({id, desc}, 10)}>10 Minutes</button>
        <button style={{ marginTop: '8px', cursor: 'pointer' }} onClick={e => snoozeTime({id, desc}, 30)}>30 Minutes</button>
        
        <button style={{ marginTop: '8px', cursor: 'pointer', float: 'right' }} onClick={e => readReminder(id)}>Dismiss</button>
      </div>
    </div>
  )
}

class SidebarClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuAktif: '/',
      sideMenu: true,
      sideMenuCollapse: false,
      companyName: '',

      notifUnread: 0,

      time: {},
      seconds: 10
    };

    this.waktu = 10;
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);
  }

  secondsToTime(secs){
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  startTimer(time) {
    this.waktu = time
    this.timer = 0
    if (this.timer === 0 && this.waktu > 0) {
      this.timer = setInterval(this.countDown, 1000);
    }
  }

  countDown() {
    // Remove one second, set state so a re-render happens.
    let seconds = this.waktu - 1;
    this.setState({ time: this.secondsToTime(seconds), seconds: seconds });
    this.waktu = seconds
    
    // Check if we're at zero.
    if (seconds === 0) {
      toast(<Msg id={0} desc={`adsfasdf`} socket={this.props.socket} startTimer={this.startTimer} />, { autoClose: false, type: toast.TYPE.INFO })
      clearInterval(this.timer);
    }
  }

  //   sideMenuCollapse = e =>{
  //     this.setState({sideMenu:!this.state.sideMenu});
  //     console.log('side menu',this.state.sideMenu);
  // }
  componentDidMount() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then((res) => {
      this.setState({companyName: res.data.result.company_name})
    })
    this.setState({ menuAktif: window.location.pathname })

    this.fetchNotif()
    this.fetchReminder()

    let timeLeftVar = this.secondsToTime(this.state.seconds);
    this.setState({ time: timeLeftVar });

    this.props.socket.on('broadcast', data => {
      console.log('broadcast sidebar ', data)
      if (data.companyId === Storage.get('user').data.company_id) {
        this.fetchNotif()
      }
    })
  }

  fetchReminder() {
    API.get(`${API_SERVER}v1/notification/all/${Storage.get('user').data.user_id}`).then((res) => {
      // const Notif = res.data.result[0].filter(item => item.isread === 0 && item.tag === 1);
      
      let now = moment(new Date()).format('YYYY-MM-DD')
      const Remind = res.data.result[0].filter(item => item.isread === 0 && item.tag === 2).filter(item => item.created_at.substring(0, 10) === now);

      Remind.map((item, i) => {
        let dateNow = moment().format('LLL')
        let fromNow = moment(item.created_at).format('LLL')
        if(dateNow === fromNow) {
          toast(<Msg id={item.id} desc={item.description} socket={this.props.socket} startTimer={this.startTimer} />, { autoClose: false, type: toast.TYPE.INFO })
        }
      })
    });
  }

  fetchNotif() {
    API.get(`${API_SERVER}v1/notification/unread/${Storage.get('user').data.user_id}`).then(res => {
      if (res.data.error) console.log('Gagal fetch unread')

      this.setState({ notifUnread: res.data.result[0].length });
    })
  }

  render() {
    let access = Storage.get('access');
    let levelUser = Storage.get('user').data.level;
    let groupUser = Storage.get('user').data.grup_name;
    let companyType = Storage.get('user').data.company_type;

    // console.log('Storage: ', Storage.get('user'));

    let menuClients = {
      murid: {
        submenu: [
          { iconOn: 'info-on.svg', iconOff: 'ujianoff.svg', label: 'My Class', link: '/murid/kelas' },
          { iconOn: 'matapelajaranon.svg', iconOff: 'graduate.svg', label: 'Subjects', link: '/murid/mata-pelajaran' },
          { iconOn: 'tugason.svg', iconOff: 'tugasoff.svg', label: 'Task', link: '/murid/tugas' },
          { iconOn: 'tugason.svg', iconOff: 'tugasoff.svg', label: 'Quiz', link: '/murid/kuis' },
          { iconOn: 'info-on.svg', iconOff: 'ujianoff.svg', label: 'Exam', link: '/murid/ujian' },
          { iconOn: 'laporanraporon.svg', iconOff: 'laporanraporoff.svg', label: 'Report/Raport', link: '/rapor' },
          { iconOn: 'logout.svg', iconOff: 'logout.svg', label: 'Logout', link: '/logout' },
        ]
      },

      guru: {
        submenu: [
          { iconOn: 'tugason.svg', iconOff: 'tugasoff.svg', label: 'Meeting Sekolah', link: '/meeting' },
          { iconOn: 'info-on.svg', iconOff: 'info.svg', label: 'Jadwal Mengajar', link: '/jadwal-mengajar' },
          { iconOn: 'tugason.svg', iconOff: 'tugasoff.svg', label: 'Laporan Murid', link: '/guru-laporan/ratakelas' },
          { iconOn: 'matapelajaranon.svg', iconOff: 'graduate.svg', label: 'Courses', link: '/guru-info/kursus' },
          { iconOn: 'tugason.svg', iconOff: 'tugasoff.svg', label: 'Exercise & Exam', link: '/guru-info/ujian' },
          { iconOn: 'info-on.svg', iconOff: 'info.svg', label: 'Class Information', link: '/guru-info/informasi-kelas' },
          { iconOn: 'instructor-on.svg', iconOff: 'instructor.svg', label: 'KPI Teacher', link: '/guru-info/kpi' },
          { iconOn: 'logout.svg', iconOff: 'logout.svg', label: 'Logout', link: '/logout' },
        ]
      },

      parents: {
        submenu: [
          { iconOn: 'matapelajaranon.svg', iconOff: 'graduate.svg', label: 'Student Learning', link: '/parent-learning' },
          { iconOn: 'matapelajaranon.svg', iconOff: 'graduate.svg', label: 'Curriculum', link: '/parent-curriculum' },
          { iconOn: 'tugason.svg', iconOff: 'tugasoff.svg', label: 'Syllabus', link: '/parent-syllabus' },
          { iconOn: 'laporanraporon.svg', iconOff: 'laporanraporoff.svg', label: 'Report/Raport', link: '/parent-rapor' },
          { iconOn: 'logout.svg', iconOff: 'logout.svg', label: 'Logout', link: '/logout' },
        ]
      },

      principal: {
        submenu: [
          { iconOn: 'kursus.svg', iconOff: 'kursus.svg', label: 'Dashboard', link: '/' },
          { iconOn: 'tugason.svg', iconOff: 'tugasoff.svg', label: 'Meeting Sekolah', link: '/meeting' },
          { iconOn: 'laporanraporon.svg', iconOff: 'laporanraporoff.svg', label: 'Kurikulum', link: '/principal-pelajaran' },
          { iconOn: 'laporanraporon.svg', iconOff: 'laporanraporoff.svg', label: 'Laporan Kelas', link: '/principal-rapor' },
          { iconOn: 'laporanraporon.svg', iconOff: 'laporanraporoff.svg', label: 'Laporan Murid', link: '/principal-rapor-murid' },
          { iconOn: 'laporanraporon.svg', iconOff: 'laporanraporoff.svg', label: 'Kinerja Guru', link: '/principal-kinerja' },
          // { iconOn: 'laporanraporon.svg', iconOff: 'laporanraporoff.svg', label: 'Evaluasi', link: '/principal-evaluasi' },
          { iconOn: 'logout.svg', iconOff: 'logout.svg', label: 'Logout', link: '/logout' },
        ]
      },

      management: {
        submenu: [
          { iconOn: 'kursus.svg', iconOff: 'kursus.svg', label: 'Dashboard', link: '/' },
          { iconOn: 'tugason.svg', iconOff: 'tugasoff.svg', label: 'Meeting Sekolah', link: '/meeting' },
          { iconOn: 'laporanraporon.svg', iconOff: 'laporanraporoff.svg', label: 'Kurikulum', link: '/management-kurikulum' },
          { iconOn: 'laporanraporon.svg', iconOff: 'laporanraporoff.svg', label: 'Laporan Kelas', link: '/management-rapor' },
          { iconOn: 'laporanraporon.svg', iconOff: 'laporanraporoff.svg', label: 'Laporan Murid', link: '/management-rapor-murid' },
          { iconOn: 'laporanraporon.svg', iconOff: 'laporanraporoff.svg', label: 'Kinerja Guru', link: '/management-kinerja' },
          // { iconOn: 'laporanraporon.svg', iconOff: 'laporanraporoff.svg', label: 'Evaluasi ', link: '/management-evaluasi' },
          { iconOn: 'logout.svg', iconOff: 'logout.svg', label: 'Logout', link: '/logout' },
        ]
      },

      other: {
        submenu: [
          // { iconOn: 'files.svg', iconOff: 'files.svg', label: 'Files', link: '/files' },
          { iconOn: 'news-sidebar.svg', iconOff: 'news-sidebar.svg', label: "News", link: '/news' },
          { iconOn: 'files.svg', iconOff: 'files.svg', label: "Project", link: '/project' },
          { iconOn: 'materi.svg', iconOff: 'materi.svg', label: "User's Task Report", link: '/gantt/report' },
          // { iconOn: 'materi.svg', iconOff: 'materi.svg', label: 'Kursus & Materi', link: '/kursus', access: 'course' },
          // { iconOn: 'forum.svg', iconOff: 'forum.svg', label: 'Forum', link: '/forum', access: 'forum' },
          // { iconOn: 'conference.svg', iconOff: 'conference.svg', label: 'Group Meeting', link: '/meeting', access: access.manage_group_meeting ? 'manage_group_meeting' : 'group_meeting' },
          // { iconOn: 'kursus.svg', iconOff: 'kursus.svg', label: 'Manage Courses', link: '/kursus-materi', access: 'manage_course' },
          // { iconOn: 'sertifikat.svg', iconOff: 'sertifikat.svg', label: 'Certificate', link: '/certificate' },
          { iconOn: 'logout-sidebar.svg', iconOff: 'logout-sidebar.svg', label: 'Logout', link: '/logout' },
        ],
      },

      menuAtas: [
        { iconOn: 'notification.svg', iconOff: 'notification.svg', label: 'Notification', link: '/notification', isBadge: true },
        { iconOn: 'mail-2.svg', iconOff: 'mail-2.svg', label: 'Announcement', link: '/pengumuman' },
        // { iconOn: 'calendar-on.svg', iconOff: 'calendar.svg', label: 'Calendar', link: '/calendar' },
      ],
      menuBawah: [
        { iconOn: 'dashboard-on.svg', iconOff: 'dashboard.svg', label: 'Dashboard', link: '/' },
        { iconOn: 'ptcon.svg', iconOff: 'ptcoff.svg', label: 'PTC', link: '/ptc' },
        { iconOn: 'setting-on.svg', iconOff: 'setting.svg', label: 'Settings', link: '/pengaturan' },
        // { iconOn: 'user-on.svg', iconOff: 'user.svg', label: 'Profile', link: '/profile' },
        { iconOn: 'bantuan-on.svg', iconOff: 'bantuan-off.svg', label: 'Support', link: '/bantuan' },
      ],

      submenuTraining: [
        { iconOn: 'news-sidebar.svg', iconOff: 'news-sidebar.svg', label: "News", link: '/news' },
        { iconOn: 'logout.svg', iconOff: 'logout.svg', label: 'Logout', link: '/logout' },
      ],
      menuAtasTraining: [
        { iconOn: 'notification.svg', iconOff: 'notification.svg', label: 'Notification', link: '/notification', isBadge: true },
      ],
      menuBawahTraining: [
        { iconOn: 'dashboard-on.svg', iconOff: 'dashboard.svg', label: 'Dashboard', link: '/' },
        { iconOn: 'setting-on.svg', iconOff: 'setting.svg', label: 'Settings', link: '/pengaturan' },
        { iconOn: 'user-on.svg', iconOff: 'user.svg', label: 'Profile', link: '/profile' },
        { iconOn: 'bantuan-on.svg', iconOff: 'bantuan-off.svg', label: 'Support', link: '/bantuan' },
      ]
    };

    let menuAdmins = {
      submenu: [
        // { iconOn: 'files.svg', iconOff: 'files.svg', label: 'Files', link: '/files' },
        { iconOn: 'news-sidebar.svg', iconOff: 'news-sidebar.svg', label: "News", link: '/news' },
        { iconOn: 'files.svg', iconOff: 'files.svg', label: "Project", link: '/project' },
        { iconOn: 'materi.svg', iconOff: 'materi.svg', label: "User's Task Report", link: '/gantt/report' },
        // { iconOn: 'materi.svg', iconOff: 'materi.svg', label: 'Kursus & Materi', link: '/kursus' },
        // { iconOn: 'forum.svg', iconOff: 'forum.svg', label: 'Forum', link: '/forum' },
        // { iconOn: 'conference.svg', iconOff: 'conference.svg', label: 'Group Meeting', link: '/meeting' },
        // { iconOn: 'kursus.svg', iconOff: 'kursus.svg', label: 'Manage Courses', link: '/kursus-materi' },
        // { iconOn: 'sertifikat.svg', iconOff: 'sertifikat.svg', label: 'Certificate', link: '/certificate' },
        // { iconOn: 'sertifikat.svg', iconOff: 'sertifikat.svg', label: 'Manage Certificates', link: '/certificate-admin' },
        { iconOn: 'company-sidebar.svg', iconOff: 'company-sidebar.svg', label: 'My Company', link: '/my-company' },
        { iconOn: 'user-sidebar.svg', iconOff: 'user-sidebar.svg', label: 'Users', link: '/user-company' },
        // { iconOn: 'kursus.svg', iconOff: 'kursus.svg', label: 'Global Settings', link: '/global-settings' },
        { iconOn: 'logout-sidebar.svg', iconOff: 'logout-sidebar.svg', label: 'Logout', link: '/logout' },
      ],
      submenuPendidikan: [
        { iconOn: 'conference.svg', iconOff: 'conference.svg', label: 'My Company', link: '/my-company' },
        { iconOn: 'conference.svg', iconOff: 'conference.svg', label: 'Users', link: '/user-company' },
        { iconOn: 'kursus.svg', iconOff: 'kursus.svg', label: "Classes", link: '/learning/registrasi' },
        { iconOn: 'materi.svg', iconOff: 'materi.svg', label: 'Lessons', link: '/learning/daftar-pelajaran' },
        { iconOn: 'forum.svg', iconOff: 'forum.svg', label: 'Room', link: '/learning/ruangan-mengajar' },
        { iconOn: 'conference.svg', iconOff: 'conference.svg', label: 'Schedule', link: '/learning/jadwal-mengajar' },
        { iconOn: 'kursus.svg', iconOff: 'kursus.svg', label: 'Personnel', link: '/learning/personalia' },
        { iconOn: 'sertifikat.svg', iconOff: 'sertifikat.svg', label: 'Preference', link: '/learning/kpi' },
        { iconOn: 'sertifikat.svg', iconOff: 'sertifikat.svg', label: 'Report', link: '/learning/laporan' },
        // { iconOn: 'kursus.svg', iconOff: 'kursus.svg', label: 'Global Settings', link: '/global-settings' },
        { iconOn: 'logout.svg', iconOff: 'logout.svg', label: 'Logout', link: '/logout' },
      ],
      menuAtas: [
        { iconOn: 'notification.svg', iconOff: 'notification.svg', label: 'Notification', link: '/notification', isBadge: true },
        { iconOn: 'mail-2.svg', iconOff: 'mail-2.svg', label: 'Announcement', link: '/pengumuman' },
        // { iconOn: 'calendar-on.svg', iconOff: 'calendar.svg', label: 'Calendar', link: '/calendar' },
      ],
      menuBawah: [
        { iconOn: 'dashboard-on.svg', iconOff: 'dashboard.svg', label: 'Dashboard', link: '/' },
        { iconOn: 'ptcon.svg', iconOff: 'ptcoff.svg', label: 'PTC', link: '/ptc' },
        { iconOn: 'setting-on.svg', iconOff: 'setting.svg', label: 'Settings', link: '/pengaturan' },
        // { iconOn: 'user-on.svg', iconOff: 'user.svg', label: 'Profile', link: '/profile' },
        { iconOn: 'bantuan-on.svg', iconOff: 'bantuan-off.svg', label: 'Support', link: '/bantuan' },
      ]
    };

    let menuSuperAdmins = {
      submenu: [
        // { iconOn: 'files.svg', iconOff: 'files.svg', label: 'Files', link: '/files' },
        { iconOn: 'news-sidebar.svg', iconOff: 'news-sidebar.svg', label: "News", link: '/news' },
        { iconOn: 'files.svg', iconOff: 'files.svg', label: "Project", link: '/project' },
        { iconOn: 'info.svg', iconOff: 'info.svg', label: "User's Task Report", link: '/gantt/report' },
        // { iconOn: 'materi.svg', iconOff: 'materi.svg', label: 'Kursus & Materi', link: '/kursus' },
        // { iconOn: 'forum.svg', iconOff: 'forum.svg', label: 'Forum', link: '/forum' },
        // { iconOn: 'conference.svg', iconOff: 'conference.svg', label: 'Group Meeting', link: '/meeting' },
        // { iconOn: 'kursus.svg', iconOff: 'kursus.svg', label: 'Manage Courses', link: '/kursus-materi' },
        // { iconOn: 'sertifikat.svg', iconOff: 'sertifikat.svg', label: 'Certificate', link: '/certificate' },
        // { iconOn: 'sertifikat.svg', iconOff: 'sertifikat.svg', label: 'Manage Certificates', link: '/certificate-admin' },
        { iconOn: 'company-sidebar.svg', iconOff: 'company-sidebar.svg', label: 'Company', link: '/company' },
        { iconOn: 'company-sidebar.svg', iconOff: 'company-sidebar.svg', label: 'My Company', link: '/my-company' },
        { iconOn: 'user-sidebar.svg', iconOff: 'user-sidebar.svg', label: 'Users', link: '/user' },
        { iconOn: 'logout-sidebar.svg', iconOff: 'logout-sidebar.svg', label: 'Logout', link: '/logout' },
      ],
      menuAtas: [
        { iconOn: 'notification.svg', iconOff: 'notification.svg', label: 'Notification', link: '/notification', isBadge: true },
        { iconOn: 'mail-2.svg', iconOff: 'mail-2.svg', label: 'Announcement', link: '/pengumuman' },
        // { iconOn: 'calendar-on.svg', iconOff: 'calendar.svg', label: 'Calendar', link: '/calendar' },
      ],
      menuBawah: [
        { iconOn: 'dashboard-on.svg', iconOff: 'dashboard.svg', label: 'Dashboard', link: '/' },
        { iconOn: 'ptcon.svg', iconOff: 'ptcoff.svg', label: 'PTC', link: '/ptc' },
        { iconOn: 'setting-on.svg', iconOff: 'setting.svg', label: 'Settings', link: '/pengaturan' },
        // { iconOn: 'user-on.svg', iconOff: 'user.svg', label: 'Profile', link: '/profile' },
        { iconOn: 'bantuan-on.svg', iconOff: 'bantuan-off.svg', label: 'Support', link: '/bantuan' },
      ]
    };

    const { menuAktif } = this.state;

    let menuContent = [];
    let menuAtas = [];
    let menuBawah = [];

    let tempAtasSuper = [], tempBawahSuper = [];
    let tempAtasAdmin = [], tempBawahAdmin = [];

    if (companyType === "perusahaan") {
      tempAtasSuper = menuSuperAdmins.menuAtas.filter(item => item.link != "/pengumuman");
      tempBawahSuper = menuSuperAdmins.menuBawah.filter(item => item.link != "/ptc");

      tempAtasAdmin = menuAdmins.menuAtas.filter(item => item.link != "/pengumuman");
      tempBawahAdmin = menuAdmins.menuBawah.filter(item => item.link != "/ptc");
    } else {
      tempAtasSuper = menuSuperAdmins.menuAtas;
      tempBawahSuper = menuSuperAdmins.menuBawah;

      tempAtasAdmin = menuAdmins.menuAtas;
      tempBawahAdmin = menuAdmins.menuBawah;
    }

    if (levelUser === 'superadmin') {
      menuContent = menuSuperAdmins.submenu;
      menuAtas = tempAtasSuper;
      menuBawah = tempBawahSuper;
    } else if (levelUser === 'admin') {
      if (companyType === "pendidikan") {
        menuContent = menuAdmins.submenuPendidikan;
      } else {
        menuContent = menuAdmins.submenu;
      }
      menuAtas = tempAtasAdmin;
      menuBawah = tempBawahAdmin;
    } else {
      let subMenuClient = Storage.get('user').data.grup_name ? Storage.get('user').data.grup_name.toString().toLowerCase() : '';
      if (subMenuClient === "guru"
        || subMenuClient === "murid"
        || subMenuClient === "parents"
        || subMenuClient === "principal"
        || subMenuClient === "management"
      ) {
        menuContent = menuClients[subMenuClient].submenu;
        menuAtas = menuClients.menuAtas;
        menuBawah = menuClients.menuBawah;
      }
      else if (subMenuClient === "user training" || subMenuClient === "admin training") {
        menuContent = menuClients.submenuTraining;
        menuAtas = menuClients.menuAtasTraining;
        menuBawah = menuClients.menuBawahTraining;
      }
      else {
        menuContent = menuClients.other.submenu;
        menuAtas = menuClients.menuAtas;
        menuBawah = menuClients.menuBawah;
      }
    }

    return (
      <nav className="pcoded-navbar navbar-collapsed"> {/** navbar-collapsed */}
        <div className="navbar-wrapper" style={{ borderTopRightRadius: '60px' }}>
          <div className="navbar-brand header-logo">
            <Link to="/" className="b-brand" style={{ width: '100%' }}>
              <img
                src={`assets/images/component/${this.state.sideMenu ? 'logo-mobile-2.png' : 'Logo Ideku.png'}`}
                alt=""
                style={{ width: '100%', height: 'auto', paddingLeft: '5%' }}
              />
              {/* <span className="b-title">IDEKU</span> */}
            </Link>

            {/* <a style={{cursor:'pointer'}} className="mobile-menu" id="mobile-collapse" ><span /></a> */}

          </div>

          {/* scroll-div */}
          <div className="navbar-content" style={{ background: 'none' }}>
            <ul className="nav pcoded-inner-navbar">
              {/* <li className="nav-item pcoded-menu-caption">
                  <label />
                </li> */}

              <li id="mobile-collapse" data-username="Sample Page"
                className={`nav-item`}
                style={this.state.sideMenu ? { width: 59, cursor: 'pointer' } : { marginTop: 12, cursor: 'pointer' }}  >
                <Tooltip title="Menu" arrow placement="right">
                  <div className="nav-link"
                    style={this.state.sideMenu ? { padding: '7px 0px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } : { padding: "7px 20px" }}
                  >
                    <span className="pcoded-micon" style={this.state.sideMenu ? { marginRight: 0, padding: 0, width: 'auto' } : null}>
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
                  if (item.access == undefined || access[item.access]) {
                    return (
                      <li data-username="Sample Page"
                        className={`nav-item`}
                        style={this.state.sideMenu ? { width: 59, cursor: 'pointer' } : { marginTop: 12, cursor: 'pointer' }}  >
                        <Tooltip title={item.label} arrow placement="right">
                          <Link className="nav-link" to={item.link}
                            style={this.state.sideMenu ? { marginTop: 18, padding: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: 'auto' } : { padding: "7px 20px" }}
                          >
                            <span className="pcoded-micon" style={this.state.sideMenu ? { marginRight: 0 } : null}>
                              <img
                                src={`newasset/${menuAktif === item.link ? item.iconOn : item.iconOff}`}
                                alt=""
                                width={25}
                              ></img>
                            </span>
                            {
                              // item.hasOwnProperty('isBadge') ? <span className="badge-notif" style={this.state.notifUnread > 9 ? {padding: '1px 3px'} : {padding: '1px 6px'} }>{this.state.notifUnread}</span> : ''
                              (this.state.notifUnread && item.hasOwnProperty('isBadge')) ? <span className="badge-notif" style={this.state.notifUnread > 9 ? { padding: '1px 3px' } : { padding: '1px 6px' }}>{this.state.notifUnread}</span> : ''
                            }
                          </Link>
                        </Tooltip>
                      </li>
                    )
                  }
                })
              }

            </ul>
            <ul className="nav pcoded-inner-navbar" style={{ position: 'fixed', bottom: 35 }}>

              {
                menuBawah.map((item, i) => {
                  if (item.access == undefined || access[item.access]) {
                    return (
                      <li data-username="Sample Page"
                        className={`nav-item `}
                        style={this.state.sideMenu ? { width: 59 } : { marginTop: 25 }}
                      >
                        <Tooltip title={item.label} arrow placement="right">
                          <Link to={item.link} className="nav-link"
                            style={this.state.sideMenu ? { padding: '7px 0px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } : { padding: "7px 20px" }}
                          >
                            <span className="pcoded-micon" style={this.state.sideMenu ? { marginRight: 0 } : null}>
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
          <h6 className="p-20 mt-5" style={{textAlign:'center'}}><strong>{localStorage.getItem("companyName") ? localStorage.getItem("companyName") : this.state.companyName}</strong></h6>
          <div>
            {
              menuContent.map((item, i) => {
                if (item.access == undefined || access[item.access]) {
                  return (
                    <div>
                      {item.label === 'News' && <div className="side-submenu-groupname">MENU</div>}
                      {item.label === 'Logout' && <div className="side-submenu-groupname">SESSION</div>}
                      {item.label === 'My Company' && <div className="side-submenu-groupname">{localStorage.getItem("companyName") ? localStorage.getItem("companyName").toUpperCase() : this.state.companyName.toUpperCase()}</div>}
                      <Link to={item.link} style={{ color: '#797979' }}>
                        <div className="side-submenu">
                          <img
                            src={`newasset/${menuAktif === item.link ? item.iconOn : item.iconOff}`}
                            style={{ marginRight: 15 }}
                            alt=""
                            height={15}
                            width={15}
                          ></img>
                          {item.label}
                        </div>
                      </Link>
                    </div>
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

const Sidebar = props => (
  <SocketContext.Consumer>
    { socket => <SidebarClass {...props} socket={socket} />}
  </SocketContext.Consumer>
)

export default Sidebar;
