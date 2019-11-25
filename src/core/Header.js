import React, {Component} from 'react';

export default class Header extends Component {
    render(){
        return (
        <div>
            <div className="loader-bg">
                <div className="loader-track">
                <div className="loader-fill" />
                </div>
            </div>
            <nav className="pcoded-navbar">
                <div className="navbar-wrapper">
                <div className="navbar-brand header-logo">
                    <a href="index.html" className="b-brand">
                    <div className="b-bg">
                        <span className="pcoded-micon"><img src="assets/images/component/Logo Ideku.png" style={{height: '34px !important', width: '34px !important'}} alt /></span>
                    </div>
                    <span className="b-title">IDEKU</span>
                    </a>
                    <a className="mobile-menu" id="mobile-collapse" href="javascript:"><span /></a>
                    {/* <a class="mobile-menu on" id="mobile-collapse" href="javascript:"></a> */}
                </div>
                <div className="navbar-content scroll-div">
                    <ul className="nav pcoded-inner-navbar">
                    <li className="nav-item pcoded-menu-caption">
                        <label />
                    </li>
                    {/* <li data-username="Authentication Sign up Sign in reset password Change password Personal information profile settings map form subscribe" class="nav-item pcoded-hasmenu">
                            <a href="javascript:" class="nav-link "><span class="pcoded-micon"><i class="feather icon-lock"></i></span><span class="pcoded-mtext">Authentication</span></a>
                            <ul class="pcoded-submenu">
                                <li class=""><a href="auth-signup.html" class="" target="_blank">Sign up</a></li>
                                <li class=""><a href="auth-signin.html" class="" target="_blank">Sign in</a></li>
                            </ul>
                        </li> */}
                    <li data-username="Sample Page" className="nav-item active mt-4"><a href="#" className="nav-link"><span className="pcoded-micon"><i className="feather f-30 icon-sidebar" /></span><span className="pcoded-mtext">Kursus &amp; Materi</span></a></li>
                    <li data-username="Sample Page" className="nav-item mt-4"><a href="#" className="nav-link"><span className="pcoded-micon"><i className="feather f-30 icon-users" /></span><span className="pcoded-mtext">Forum diskusi</span></a></li>
                    <li data-username="Sample Page" className="nav-item mt-4"><a href="#" className="nav-link"><span className="pcoded-micon"><i className="feather f-30 icon-monitor" /></span><span className="pcoded-mtext">Kelas</span></a></li>
                    <li data-username="Sample Page" className="nav-item mt-4"><a href="#" className="nav-link"><span className="pcoded-micon"><i className="feather f-30 icon-bar-chart-2" /></span><span className="pcoded-mtext">Aktivitas</span></a></li>
                    <li data-username="Sample Page" className="nav-item mt-4"><a href="#" className="nav-link"><span className="pcoded-micon"><i className="feather f-30 icon-settings" /></span><span className="pcoded-mtext">Pengaturan</span></a></li>
                    </ul>
                    {/* <ul class="nav pcoded-inner-navbar">
                        <li class="nav-item pcoded-menu-caption">
                            <label></label>
                        </li>
                        
                        <li data-username="Sample Page" class="nav-item mt-4"><a href="#" class="nav-link"><span class="pcoded-micon"><i class="feather f-30 icon-settings"></i></span><span class="pcoded-mtext">Pengaturan</span></a></li>
                    </ul> */}
                </div>
                </div>
            </nav>
            <header className="navbar pcoded-header navbar-expand-lg navbar-light">
                <div className="m-header">
                <a className="mobile-menu" id="mobile-collapse1" href="javascript:"><span /></a>
                <a href="index.html" className="b-brand">
                    <div className="b-bg">
                    <i className="feather icon-trending-up" />
                    </div>
                    <span className="b-title">IDEKU</span>
                </a>
                </div>
                <a className="mobile-menu" id="mobile-header" href="javascript:">
                <i className="feather icon-more-horizontal" />
                </a>
                <div className="collapse navbar-collapse">
                {/* <div style="padding: 0 40px"> */}
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item dropdown">
                    <a className href="javascript:">
                        <div className="media">
                        <img alt="iamsanulqi's profile picture" className="img-radius" style={{width: 40, height: 40}} src="assets/images/user/avatar-1.jpg" />
                        <div className="media-body mt-1 ml-1">
                            <h6 className="chat-header f-w-900">Rajaka Kauthar Allam
                            <small className="d-block  mt-2 text-c-grey">Member</small>
                            </h6>
                        </div>
                        </div>
                    </a>
                    </li>
                </ul>
                {/* </div> */}
                <ul className="navbar-nav ml-auto">
                    <li>
                    <div className="dropdown">
                        <a className href="javascript:" data-toggle="dropdown">
                        <i className="icon feather icon-bell f-20 text-c-grey" />
                        <i className="fa fa-circle text-warning notif" style={{fontSize: 11}} />
                        </a>
                        <div className="dropdown-menu dropdown-menu-right notification">
                        <div className="noti-head">
                            <h6 className="d-inline-block m-b-0">Notifications</h6>
                            <div className="float-right">
                            <a href="javascript:" className="m-r-10">mark as read</a>
                            <a href="javascript:">clear all</a>
                            </div>
                        </div>
                        <ul className="noti-body">
                            <li className="n-title">
                            <p className="m-b-0">NEW</p>
                            </li>
                            <li className="notification">
                            <div className="media">
                                <img className="img-radius" src="assets/images/user/avatar-1.jpg" alt="Generic placeholder image" />
                                <div className="media-body">
                                <p><strong>John Doe</strong><span className="n-time text-muted"><i className="icon feather icon-clock m-r-10" />30 min</span></p>
                                <p>New ticket Added</p>
                                </div>
                            </div>
                            </li>
                            <li className="n-title">
                            <p className="m-b-0">EARLIER</p>
                            </li>
                            <li className="notification">
                            <div className="media">
                                <img className="img-radius" src="assets/images/user/avatar-2.jpg" alt="Generic placeholder image" />
                                <div className="media-body">
                                <p><strong>Joseph William</strong><span className="n-time text-muted"><i className="icon feather icon-clock m-r-10" />30 min</span></p>
                                <p>Prchace New Theme and make payment</p>
                                </div>
                            </div>
                            </li>
                            <li className="notification">
                            <div className="media">
                                <img className="img-radius" src="assets/images/user/avatar-3.jpg" alt="Generic placeholder image" />
                                <div className="media-body">
                                <p><strong>Sara Soudein</strong><span className="n-time text-muted"><i className="icon feather icon-clock m-r-10" />30 min</span></p>
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
                   
                    <li className="nav-item">
                    <div className="main-search open">
                        <div className="input-group">
                        <i className="feather icon-search input-group-text mr-1 text-c-grey" />
                        <input type="text" id="m-search" className="form-control" placeholder="Pencarian..." style={{width: 150}} />
                        {/* <a href="javascript:" class="input-group-append search-close">
                                        <i class="feather icon-x input-group-text"></i>
                                    </a> */}
                        </div>
                    </div>
                    </li>
                </ul>
                {/* </div> */}
                </div>
            </header>
        </div>
        )
    }
}