import React, { Component } from "react";
import { Link } from "react-router-dom";
import Storage from '../../../repository/storage';

class Sidebar extends Component {
  render() {
    let levelUser = Storage.get('user').data.level;
    let menuContent = null;
    if(levelUser === 'superadmin') {
      menuContent = <MenuSuperAdmin />;
    } else if(levelUser === 'admin') {
      menuContent = <MenuAdmin />;
    } else {
      menuContent = <MenuClient />;
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

              {menuContent}

              <li data-username="Sample Page" className="nav-item mt-4  bg-c-purple-dark">
                <Link to="/logout" className="nav-link">
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

export class MenuSuperAdmin extends React.Component {
  render() {
    return (
      <>
      <li data-username="Sample Page" className="nav-item active mt-4">
        <Link to="#" className="nav-link">
          <span className="pcoded-micon">
            <img
              src="assets/images/component/dashboardoff.png"
              alt=""
            ></img>
          </span>
          <span className="pcoded-mtext f-16 f-w-bold">
            Kursus &amp; Materi
          </span>
        </Link>
      </li>
      <li data-username="Sample Page" className="nav-item mt-4">
        <Link to="#" className="nav-link">
          <span className="pcoded-micon">
            <img
              src="assets/images/component/Icon Forum.png"
              alt=""
            ></img>
          </span>
          <span className="pcoded-mtext f-16 f-w-bold">
            Forum diskusi
          </span>
        </Link>
      </li>
      <li data-username="Sample Page" className="nav-item mt-4">
        <Link to="#" className="nav-link">
          <span className="pcoded-micon">
            <img
              src="assets/images/component/Icon Kelas.png"
              alt=""
            ></img>
          </span>
          <span className="pcoded-mtext f-16 f-w-bold">Kelas</span>
        </Link>
      </li>
      <li data-username="Sample Page" className="nav-item mt-4">
        <Link to="#" className="nav-link">
          <span className="pcoded-micon">
            <img
              src="assets/images/component/Icon Aktivitas.png"
              alt=""
              style={{
                paddingLeft: "3px"
              }}
            ></img>
          </span>
          <span className="pcoded-mtext f-16 f-w-bold">Aktivitas</span>
        </Link>
      </li>
      <li data-username="Sample Page" className="nav-item mt-4">
        <Link to="/pengaturan" className="nav-link">
          <span className="pcoded-micon">
            <img
              src="assets/images/component/Icon Pengaturan.png"
              alt=""
              style={{
                paddingLeft: "3px"
              }}
            ></img>
          </span>
          <span className="pcoded-mtext f-16 f-w-bold">Pengaturan</span>
        </Link>
      </li>
      <li data-username="Sample Page" className="nav-item mt-4">
        <Link to="/profile" className="nav-link">
          <span className="pcoded-micon">
            <img
              src="assets/images/component/profileoff.png"
              alt=""
            ></img>
          </span>
          <span className="pcoded-mtext f-16 f-w-bold">Profile</span>
        </Link>
      </li>
      <li data-username="Sample Page" className="nav-item mt-4">
        <Link to="/user" className="nav-link">
          <span className="pcoded-micon">
            <img
              src="assets/images/component/usersoff.png"
              alt=""
            ></img>
          </span>
          <span className="pcoded-mtext f-16 f-w-bold">Users</span>
        </Link>
      </li>
      <li data-username="Sample Page" className="nav-item mt-4">
        <Link to="/company" className="nav-link">
          <span className="pcoded-micon">
            <img
              src="assets/images/component/mycompanyoff.png"
              alt=""
            ></img>
          </span>
          <span className="pcoded-mtext f-16 f-w-bold">Company</span>
        </Link>
      </li>
      <li data-username="Sample Page" className="nav-item mt-4">
        <Link to="/user-access" className="nav-link">
          <span className="pcoded-micon">
            <img
              src="assets/images/component/accessoff.png"
              alt=""
            ></img>
          </span>
          <span className="pcoded-mtext f-16 f-w-bold">Access</span>
        </Link>
      </li>
      </>
    );
  }
}

export class MenuAdmin extends React.Component {
  render() {
    return (
      <>
      <li data-username="Sample Page" className="nav-item active mt-4">
        <Link to="/" className="nav-link">
          <span className="pcoded-micon">
            <img
              src="assets/images/component/dashboardoff.png"
              alt=""
            ></img>
          </span>
          <span className="pcoded-mtext f-16 f-w-bold">
            Dashboard
          </span>
        </Link>
      </li>
      <li data-username="Sample Page" className="nav-item mt-4">
        <Link to={`/my-company`} className="nav-link">
          <span className="pcoded-micon">
            <img
              src="assets/images/component/mycompanyoff.png"
              alt=""
            ></img>
          </span>
          <span className="pcoded-mtext f-16 f-w-bold">My Company</span>
        </Link>
      </li>
      <li data-username="Sample Page" className="nav-item mt-4">
        <Link to={`/kursus-materi`} className="nav-link">
          <span className="pcoded-micon">
            <img
              src="assets/images/component/kursusoff.png"
              alt=""
            ></img>
          </span>
          <span className="pcoded-mtext f-16 f-w-bold">Kursus & Materi</span>
        </Link>
      </li>
      <li data-username="Sample Page" className="nav-item mt-4">
        <Link to={`/user-company`} className="nav-link">
          <span className="pcoded-micon">
            <img
              src="assets/images/component/usersoff.png"
              alt=""
            ></img>
          </span>
          <span className="pcoded-mtext f-16 f-w-bold">Users</span>
        </Link>
      </li>
      <li data-username="Sample Page" className="nav-item mt-4">
        <Link to={`/user-access`} className="nav-link">
          <span className="pcoded-micon">
            <img
              src="assets/images/component/accessoff.png"
              alt=""
            ></img>
          </span>
          <span className="pcoded-mtext f-16 f-w-bold">Access</span>
        </Link>
      </li>
      <li data-username="Sample Page" className="nav-item mt-4">
        <Link to="/profile" className="nav-link">
          <span className="pcoded-micon">
            <img
              src="assets/images/component/profileoff.png"
              alt=""
            ></img>
          </span>
          <span className="pcoded-mtext f-16 f-w-bold">Profile</span>
        </Link>
      </li>
      <li data-username="Sample Page" className="nav-item mt-4">
        <Link to="/pengaturan" className="nav-link">
          <span className="pcoded-micon">
            <img
              src="assets/images/component/Icon Pengaturan.png"
              alt=""
            ></img>
          </span>
          <span className="pcoded-mtext f-16 f-w-bold">Pengaturan</span>
        </Link>
      </li>
      </>
    );
  }
}

export class MenuClient extends React.Component {
  render() {
    return (
      <>
      <li data-username="Sample Page" className="nav-item active mt-4">
        <Link to="/" className="nav-link">
          <span className="pcoded-micon">
            <img
              src="assets/images/component/dashboard.png"
              alt=""
            ></img>
          </span>
          <span className="pcoded-mtext f-16 f-w-bold">
            Dashboard
          </span>
        </Link>
      </li>
      <li data-username="Sample Page" className="nav-item mt-4">
        <Link to="/profile" className="nav-link">
          <span className="pcoded-micon">
            <img
              src="assets/images/component/profileoff.png"
              alt=""
            ></img>
          </span>
          <span className="pcoded-mtext f-16 f-w-bold">Profile</span>
        </Link>
      </li>
      <li data-username="Sample Page" className="nav-item mt-4">
        <Link to="/pengaturan" className="nav-link">
          <span className="pcoded-micon">
            <img
              src="assets/images/component/Icon Pengaturan.png"
              alt=""
            ></img>
          </span>
          <span className="pcoded-mtext f-16 f-w-bold">Pengaturan</span>
        </Link>
      </li>
      </>
    );
  }
}