import React from 'react';


function App() {
  return (
   <div>
     <div>
  {/* [ Pre-loader ] start */}
  <div className="loader-bg">
    <div className="loader-track">
      <div className="loader-fill" />
    </div>
  </div>
  {/* [ Pre-loader ] End */} 
  {/* [ navigation menu ] start */}
  {/* <nav class="pcoded-navbar"> */}
  <nav className="pcoded-navbar">
    {/* <nav class="pcoded-navbar navbar-collapsed"> */}
    <div className="navbar-wrapper">
      <div className="navbar-brand header-logo">
        <a href="index.html" className="b-brand">
          <div className="b-bg">
            {/* <i class="feather icon-trending-up"></i> */}
            {/* OKE */}
            {/* <div class="t">SIP</div> */}
            <span className="pcoded-micon"><img src="assets/images/component/Logo Ideku.png" className="logo-sidebar" alt /></span>
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
  {/* [ navigation menu ] end */}
  {/* [ Header ] start */}
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
        {/* <li>
                  <div class="dropdown drp-user">
                      <a href="javascript:" class="dropdown-toggle" data-toggle="dropdown">
                          <i class="icon feather icon-settings"></i>
                      </a>
                      <div class="dropdown-menu dropdown-menu-right profile-notification">
                          <div class="pro-head">
                              <img src="assets/images/user/avatar-1.jpg" class="img-radius" alt="User-Profile-Image">
                              <span>John Doe</span>
                              <a href="auth-signin.html" class="dud-logout" title="Logout">
                                  <i class="feather icon-log-out"></i>
                              </a>
                          </div>
                          <ul class="pro-body">
                              <li><a href="javascript:" class="dropdown-item"><i class="feather icon-settings"></i> Settings</a></li>
                              <li><a href="javascript:" class="dropdown-item"><i class="feather icon-user"></i> Profile</a></li>
                              <li><a href="message.html" class="dropdown-item"><i class="feather icon-mail"></i> My Messages</a></li>
                              <li><a href="auth-signin.html" class="dropdown-item"><i class="feather icon-lock"></i> Lock Screen</a></li>
                          </ul>
                      </div>
                  </div>
              </li> */}
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
  {/* [ Header ] end */}
  {/* [ Main Content ] start */}
  <div className="pcoded-main-container">
    <div className="pcoded-wrapper">
      <div className="pcoded-content">
        <div className="pcoded-inner-content">
          {/* [ breadcrumb ] start */}
          {/* [ breadcrumb ] end */}
          <div className="main-body">
            <div className="page-wrapper">
              {/* [ Main Content ] start */}
              <div className="row">
                {/*[ selamat datang section ] start*/}
                <div className="col-md-12 col-xl-12">
                  <div className="page-header-title mb-2">
                    <h3 className="f-w-900 ">Selamat datang, Rakaal!</h3>
                    <h6 className="top mt-5 f-w-900 text-cc-grey">Yuk, kita belajar untuk hari ini...</h6>
                  </div>
                </div>
                {/*[ selamat datang section ] end*/}
                {/*[ tanggal bergabung section ] start*/}
                <div className="col-md-4 col-xl-4">
                  <div className="card">
                    <div className="card-block card-profile">
                      <div className="row align-items-center justify-content-center">
                        <div className="col-auto">
                          <i className="fa fa-calendar f-30 circle-icon-green" />
                        </div>
                        <div className="col">
                          <small className="f-w-900">Tanggal Bergabung</small>
                          <h5 className="f-w-900">23/08/2019</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/*[ tanggal bergabung section ] end*/}
                {/*[ tanggal bergabung section ] start*/}
                <div className="col-md-4 col-xl-4">
                  <div className="card">
                    <div className="card-block card-profile">
                      <div className="row align-items-center justify-content-center">
                        <div className="col-auto">
                          <i className="fa fa-image f-30 circle-icon-orange" />
                        </div>
                        <div className="col">
                          <small className="f-w-900">Tanggal Kursus</small>
                          <h5 className="f-w-900">200</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/*[ tanggal bergabung section ] end*/}
                {/*[ tanggal bergabung section ] start*/}
                <div className="col-md-4 col-xl-4">
                  <div className="card">
                    <div className="card-block card-profile">
                      <div className="row align-items-center justify-content-center">
                        <div className="col-auto">
                          <i className="fa fa-clock f-30 circle-icon-pink" />
                        </div>
                        <div className="col">
                          <small className="f-w-900">Jumlah Waktu</small>
                          <h5 className="f-w-900">24</h5>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {/*[ tanggal bergabung section ] end*/}
                {/*[ daily sales section ] start*/}
                <div className="col-md-12 col-xl-12 mb-3">
                  <div className="row d-flex align-items-center">
                    <div className="col-6">
                      <h3 className="f-w-900 f-24">Pilihan Kursus</h3>
                    </div>
                    <div className="col-5 text-right">
                      <p className="m-b-0">
                        <i className="fa fa-filter" />
                        <select className="mr-4" name id>
                          <option value>Filter</option>
                        </select>
                        <span className="f-w-600 f-16">See All</span> 
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-12 mb-3">
                  <div className="carousel" data-flickity="{ &quot;freeScroll&quot;: true, &quot;contain&quot;: true,&quot;cellAlign&quot;: &quot;left&quot;, &quot;prevNextButtons&quot;: false, &quot;pageDots&quot;: false }">
                    <div className="carousel-cell">
                      <div className="card">
                        <img className="img-fluid img-kursus radius-top-l-r-5" src="assets/images/component/p5.jpg" alt="dashboard-user" />
                        <div className="card-carousel ">
                          <div className="title-head f-w-900 f-16">TEKNOLOGI</div>
                          <small className="mr-3">12 Videos</small>
                          <small>24 Hours</small>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-cell">
                      <div className="card">
                        <img className="img-fluid img-kursus radius-top-l-r-5" src="assets/images/component/p5.jpg" alt="dashboard-user" />
                        <div className="card-carousel ">
                          <div className="title-head f-w-900 f-16">TEKNOLOGI</div>
                          <small className="mr-3">12 Videos</small>
                          <small>24 Hours</small>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-cell">
                      <div className="card">
                        <img className="img-fluid img-kursus radius-top-l-r-5" src="assets/images/component/p5.jpg" alt="dashboard-user" />
                        <div className="card-carousel ">
                          <div className="title-head f-w-900 f-16">TEKNOLOGI</div>
                          <small className="mr-3">12 Videos</small>
                          <small>24 Hours</small>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-cell">
                      <div className="card">
                        <img className="img-fluid img-kursus radius-top-l-r-5" src="assets/images/component/p5.jpg" alt="dashboard-user" />
                        <div className="card-carousel ">
                          <div className="title-head f-w-900 f-16">TEKNOLOGI</div>
                          <small className="mr-3">12 Videos</small>
                          <small>24 Hours</small>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-cell">
                      <div className="card">
                        <img className="img-fluid img-kursus radius-top-l-r-5" src="assets/images/component/p5.jpg" alt="dashboard-user" />
                        <div className="card-carousel ">
                          <div className="title-head">Teknologi</div>
                          <small className="mr-3">12 Videos</small>
                          <small>24 Hours</small>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {/*[ tanggal bergabung section ] end*/}
                {/*[ daily sales section ] start*/}
                <div className="col-md-12 col-xl-12 mb-3">
                  <div className="row d-flex align-items-center">
                    <div className="col-6">
                      <h3 className="f-w-900 f-24">Kursus yang harus diikuti</h3>
                    </div>
                    <div className="col-5 text-right">
                      <p className="m-b-0">
                        <span className="f-w-600 f-16">See All</span> 
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-xl-12 mb-3">
                  <div className="carousel" data-flickity="{ &quot;freeScroll&quot;: true, &quot;contain&quot;: true,&quot;cellAlign&quot;: &quot;left&quot;, &quot;prevNextButtons&quot;: false, &quot;pageDots&quot;: false }">
                    <div className="carousel-cell">
                      <div className="card">
                        <div className="box-image">
                          <img className="img-kursus-diikuti" src="assets/images/component/Pattern Geometric-01.png" alt="dashboard-user" />
                          <div className="card-text-title">DESAIN</div>
                        </div>
                        <div className="card-carousel">
                          <div className="title-head f-16">Cara Membuat Design Dengan Menggunakan Adobe</div>
                          <div className="row m-t-50">
                            <div className="col-6">
                              <small className="f-w-600 m-b-10">Mentor</small>
                              <h6><small className="f-w-600">Muhammad Abail</small></h6>
                            </div>
                            <div className="col-6">
                              <div className="progress m-b-10">
                                <div className="progress-bar progress-c-yellow" role="progressbar" style={{width: '40%', height: 6}} aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} />
                              </div>
                              <small className="f-w-600">Proses (20%)</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-cell">
                      <div className="card">
                        <div className="box-image">
                          <img className="img-kursus-diikuti" src="assets/images/component/Pattern Geometric-02.png" alt="dashboard-user" />
                          <div className="card-text-title">MARKETING</div>
                        </div>
                        <div className="card-carousel">
                          <div className="title-head f-16">Cara Membuat Design Dengan Menggunakan Adobe</div>
                          <div className="row m-t-50">
                            <div className="col-6">
                              <small className="f-w-600 m-b-10">Mentor</small>
                              <h6><small className="f-w-600">Muhammad Abail</small></h6>
                            </div>
                            <div className="col-6">
                              <div className="progress m-b-10">
                                <div className="progress-bar progress-c-purple" role="progressbar" style={{width: '40%', height: 6}} aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} />
                              </div>
                              <small className="f-w-600">Proses (20%)</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-cell">
                      <div className="card">
                        <div className="box-image">
                          <img className="img-kursus-diikuti" src="assets/images/component/Pattern Geometric-01.png" alt="dashboard-user" />
                          <div className="card-text-title">TEKNOLOGI</div>
                        </div>
                        <div className="card-carousel">
                          <div className="title-head f-16">Cara Membuat Design Dengan Menggunakan Adobe</div>
                          <div className="row m-t-50">
                            <div className="col-6">
                              <small className="f-w-600 m-b-10">Mentor</small>
                              <h6><small className="f-w-600">Muhammad Abail</small></h6>
                            </div>
                            <div className="col-6">
                              <div className="progress m-b-10">
                                <div className="progress-bar progress-c-yellow" role="progressbar" style={{width: '40%', height: 6}} aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} />
                              </div>
                              <small className="f-w-600">Proses (20%)</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="carousel-cell">
                      <div className="card">
                        <div className="box-image">
                          <img className="img-kursus-diikuti" src="assets/images/component/Pattern Geometric-01.png" alt="dashboard-user" />
                          <div className="card-text-title">BISNIS</div>
                        </div>
                        <div className="card-carousel">
                          <div className="title-head f-16">Cara Membuat Design Dengan Menggunakan Adobe</div>
                          <div className="row m-t-50">
                            <div className="col-6">
                              <small className="f-w-600 m-b-10">Mentor</small>
                              <h6><small className="f-w-600">Muhammad Abail</small></h6>
                            </div>
                            <div className="col-6">
                              <div className="progress m-b-10">
                                <div className="progress-bar progress-c-yellow" role="progressbar" style={{width: '40%', height: 6}} aria-valuenow={60} aria-valuemin={0} aria-valuemax={100} />
                              </div>
                              <small className="f-w-600">Proses (20%)</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {/*[ selamat datang section ] start*/}
                <div className="col-md-12 col-xl-12">
                  <div className="card" style={{position: 'relative', overflow: 'hidden'}}>
                    <img src="assets/images/component/Ilustrasi.png" style={{position: 'absolute', right: '5%', bottom: '-115px', width: 394, height: 366, opacity: '0.1'}} alt />
                    <div className="row">
                      <div className="col-xl-2 text-center">
                        <img className="img-radius p-1" style={{width: 136, height: 136}} src="assets/images/component/Ilustrasi.png" />
                      </div>
                      <div className="col-xl-7">
                        <div className="media-body p-t-30 p-l-10 p-b-10 p-r-10">
                          <h5 className="chat-header f-w-800 f-24">Yuk, Coba Test Kemampuan Kamu Sekarang ! </h5>
                          <div style={{width: '50%'}}>
                            <small className="d-block text-c-grey f-w-600 f-16">Yuk, Coba Test Kemampuan Kamu Sudah Sesuai Atau Belum !</small>
                          </div>
                        </div>
                        {/* <h5 class="chat-header f-w-800 f-24">Yuk, Coba Test Kemampuan Mu Sekarang !
                                              <small class="d-block  mt-2 text-c-grey">Member</small>
                                          </h5> */}
                      </div>
                      <div className="col-md-12 col-xl-3">
                        <div className="media-body p-t-50 p-l-10 p-b-10 p-r-10 text-center">
                          <button type="button" className="btn f-w-600 f-14 text-c-white bg-c-purple-ideku shadow-box" title="btn btn-primary" data-toggle="tooltip">
                            Mulai Sekarang
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                {/*[ tanggal bergabung section ] end*/}
                {/*[ daily sales section ] start*/}
                <div className="col-md-12 col-xl-12 mb-3">
                  <div className="row d-flex align-items-center">
                    <div className="col-6">
                      <h3 className="f-w-900 f-24">Aktivitas Terakhir</h3>
                    </div>
                    <div className="col-5 text-right">
                      <p className="m-b-0">
                        <span className="f-w-600 f-16">See All</span> 
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-12 col-xl-5">
                  <div className="card">
                    <ol className="p-l-40 p-t-30 p-r-40 p-b-30 ">
                      <li className="f-16 f-w-800 text-c-black">Design</li>
                      <table style={{width: '100%'}}>
                        <tbody><tr className>
                            <th className> Chapter 1 - Judul Materi 1</th>
                            <th className="text-right"> 00:30:00</th>
                          </tr>
                          <tr>
                            <th> Chapter 1 - Judul Materi 1</th>
                            <th className="text-right"> 00:30:00</th>
                          </tr>
                          <tr>
                            <th> Chapter 1 - Judul Materi 1</th>
                            <th className="text-right"> 00:30:00</th>
                          </tr>
                          <tr>
                            <th> Chapter 1 - Judul Materi 1</th>
                            <th className="text-right"> 00:30:00</th>
                          </tr>
                          <tr>
                            <th> Chapter 1 - Judul Materi 1</th>
                            <th className="text-right"> 00:30:00</th>
                          </tr>
                        </tbody></table>
                      <li className="f-16 f-w-800 text-c-black m-t-5">Teknologi</li>
                      <table style={{padding: '50px !important', width: '100%'}}>
                        <tbody><tr className>
                            <th className> Chapter 1 - Judul Materi 1</th>
                            <th className="text-right"> 00:30:00</th>
                          </tr>
                          <tr>
                            <th> Chapter 1 - Judul Materi 1</th>
                            <th className="text-right"> 00:30:00</th>
                          </tr>
                          <tr>
                            <th> Chapter 1 - Judul Materi 1</th>
                            <th className="text-right"> 00:30:00</th>
                          </tr>
                          <tr>
                            <th> Chapter 1 - Judul Materi 1</th>
                            <th className="text-right"> 00:30:00</th>
                          </tr>
                          <tr>
                            <th> Chapter 1 - Judul Materi 1</th>
                            <th className="text-right"> 00:30:00</th>
                          </tr>
                        </tbody></table>
                    </ol> 
                  </div>
                </div>
                <div className="col-md-12 col-xl-7">
                  <div className="card p-35">
                    <div className="chart-container" style={{position: 'relative'}}>
                      <select name id style={{position: 'absolute', right: 0}}>
                        <option value="november">November 2019</option>
                        <option value="november">Desember 2019</option>
                        <option value="november">Januari 2020</option>
                        <option value="november">Febriari 2020</option>
                      </select>
                      <canvas id="canvas" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

   </div>
  );
}

export default App;
