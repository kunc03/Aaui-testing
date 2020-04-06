/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/img-redundant-alt */
import React, { Component } from "react";
import { Link } from "react-router-dom";
import API, {USER_ME, API_SERVER} from '../../../repository/api';
import Storage from '../../../repository/storage';
import Moment from "react-moment";

class Header extends Component {
    
  state = {
    user: "Anonymous",
    level: "Member",
    avatar: "/assets/images/user/avatar-1.jpg",
    notificationData : [],

    company: []
  };

  pilihCompany = e => {
    e.preventDefault();
    const id = e.target.getAttribute('data-id');
    localStorage.setItem('companyID', id);
    window.location.reload();
  }

  fetchCompany() {
    let link = `${API_SERVER}v1/company`;
    API.get(link).then(response => {
      this.setState({ company: response.data.result });
    }).catch(function (error) {
      console.log(error);
    });
  }

  goTo = (id) =>{
    let data = this.state.notificationData.find(x=>x.id==id);
    if(typeof data == 'object'){
      API.get('v1/notification/read',{id:id}).then(res=>{
        if(data.destination){
          window.location = data.destination;
        }
      });
    }



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
        if (this.state.level==='client'){
          this.setState({level:'User'})
        }
      }
    });

    API.get(`${API_SERVER}v1/notification/unread/${Storage.get('user').data.user_id}`).then(res=>{
      this.setState({notificationData:res.data.result})
    });

    this.fetchCompany();
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
    const { user, level, company, notificationData } = this.state;


    let NotifBody = ({list}) => {
      let unread = list.filter(x=> x.isread == '0');
      let unclick = list.filter(x=> x.isread == '2');

      return  (
                  <ul className="noti-body">

                  {
                    unread.length 
                    ? (<li className="n-title">
                        <p className="m-b-0">NEW</p>
                      </li>) +

                      unread.map(item=>
                     
                      <li className="notification" onClick={()=>this.goTo(item.id)}>
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
                                {item.created_at}
                              </span>
                            </p>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      </li>
                      )
                    : ''
                  }

                  {
                    unread.length 
                    ? (<li className="n-title">
                        <p className="m-b-0">EARLIER</p>
                      </li>) +

                      unclick.map(item=>
                     
                      <li className="notification" onClick={()=>this.goTo(item.id)}>
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
                                {item.created_at}
                              </span>
                            </p>
                            <p>{item.description}</p>
                          </div>
                        </div>
                      </li>
                      )
                    : ''
                  }

                  </ul>);
    }   


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


                  <NotifBody list={notificationData}/>


                  <div className="noti-footer">
                    <a href="javascript:">show all</a>
                  </div>
                </div>
              </div>
            </li>
            
          </ul>

          {
            level == "superadmin" &&

            <ul className="navbar-nav">
              <li>
                <div className="dropdown">
                  <a href="javascript:;" data-toggle="dropdown">
                    <i className="fa fa-list" />
                  </a>
                  <div className="dropdown-menu dropdown-menu-right notification">
                    <div className="noti-head">
                      <h6 className="d-inline-block m-b-0">Pilih Company</h6>
                    </div>
                    <ul className="noti-body">
                      {
                        company.map((item, i) => (
                          <li className="notification" style={{ cursor: 'pointer' }} onClick={this.pilihCompany} data-id={item.company_id}>
                            <div className="media" data-id={item.company_id}>
                              <img
                                data-id={item.company_id}
                                className="img-radius"
                                src={item.logo}
                                alt="Generic placeholder image"
                              />
                              <div className="media-body" data-id={item.company_id}>
                                <p data-id={item.company_id}>
                                  <b data-id={item.company_id}>{item.company_name}</b>
                                  {/* <span className="n-time text-muted">
                                    <i className="icon feather icon-clock m-r-10" />
                                    <Moment format="DD/MM/YYYY">{item.validity}</Moment>
                                  </span> */}
                                </p>
                                {
                                  localStorage.getItem("companyID") == item.company_id && (
                                    <p data-id={item.company_id} style={{color:'green'}}>{item.status}</p>
                                  )
                                }
                              </div>
                            </div>
                          </li>
                        ))
                      }
                    </ul>
                  </div>
                </div>
              </li>
            </ul>
          
          }
        </div>
      </header>
    );
  }
}

export default Header;
