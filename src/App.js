import React from "react";

import { Switch, Route, Redirect } from "react-router-dom";

import API, { API_SERVER } from './repository/api'; 
import Storage from './repository/storage';

import Header from "./components/Header_sidebar/Header";
import Sidebar from "./components/Header_sidebar/Sidebar";
import Loader from "./components/Header_sidebar/Loader";
// import Home from "./components/Home/index";
import Home from "./components/Home_new/index";
import Activity from "./components/Activity/index";
import Notification from "./components/Notification/index";
import Pengaturan from "./components/Pengaturan/index";
import Profile from "./components/Profile/index";
import Files from "./components/files/index";

// Dashboard New Home Detail
import DetailProject from "./components/Home_new/detail_project/index";
import WebinarDetail from "./components/webinar/index";

import Project from "./components/project/index";

import User from "./components/Users/User/index";
import UserAdd from "./components/Users/User/add";
import UserEdit from "./components/Users/User/Edit";

import UserCompany from "./components/Users/User/company";
import UserCompanyAdd from "./components/Users/User/companyadd";
import UserCompanyEdit from "./components/Users/User/companyedit";
import UserAccess from "./components/Users/Access/index";

import KursusMateri from "./components/admin/course/kursusmateri";
import KursusMateriAdd from "./components/admin/course/kursusmateriadd";
import KursusMateriEdit from "./components/admin/course/kursusmateriedit";

import ChapterPreview from "./components/admin/chapter/chapter";
import NilaiUjianPreview from "./components/admin/nilaiujian";

import QuizList from "./components/admin/exam/quiz";
import QuestionQuiz from "./components/admin/question/quiz";
import QuestionQuizCreate from "./components/admin/question/quizcreate";
import QuestionQuizEdit from "./components/admin/question/quizedit";

import ExamList from "./components/admin/exam/exam";
import QuestionExam from "./components/admin/question/exam";
import QuestionExamCreate from "./components/admin/question/examcreate";
import FilePicker from "./components/admin/filemanager/file";

import Cabang from "./components/Users/UserCabang/index";
import Grup from "./components/Users/UserGroup/index";
import Company from "./components/Users/UserCompany/index";
import CompanyDetail from "./components/Users/UserCompany/detail";
import CompanyDetailSuper from "./components/Users/UserCompany/detailsuper";
import Login from "./components/Login/index";

import KategoriKursus from "./components/client/kategorikursus";
import DetailKursus from "./components/client/detailkursus";
import UjianKursus from "./components/client/ujiankursus";
import UjianHasil from "./components/client/ujianhasil";

import Forum from "./components/forum/forum";
import ForumDetail from "./components/forum/forum-detail";

import LiveClass from "./components/liveclass";
import LiveStream from "./components/liveclass/livestream";
import LiveStreamPublic from "./components/liveclass/livestreamPublic";
import MobileMeeting from "./components/liveclass/mobileMeeting";

import LiveClassAdmin from "./components/admin/liveclass/list";
import LiveClassAdminJoin from "./components/admin/liveclass/join";

import Kursus from "./components/Kursus";

import CertificateAdmin from './components/admin/certificate';
import CertificateCreate from './components/admin/certificate/create';
import Certificate from './components/client/certificate';
import PrintCertificate1 from './components/client/certificate/Certificate1'
import PrintCertificate2 from './components/client/certificate/Certificate2'
import PrintCertificate3 from './components/client/certificate/Certificate3'

import ForgotPassword from './components/forgotPassword';
import OTP from './components/OTP';
// import ResetPassword from './components/resetPassword';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userLogin: false
    };
  }

  componentDidMount() {
    let userInfo = localStorage.getItem("user");
    if (userInfo == null) {
      this.setState({ userLogin: false });
    } else {
      this.setState({ userLogin: true });
    }
  }

  render() {
    let workSpace = null;
    if (this.state.userLogin) {
      workSpace = <Main />;
    } else {
      workSpace = <PublicContent />;
    }

    return (
      <div>{workSpace}</div>
    );
  }
}

export class PublicContent extends React.Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/meeting/:roomid" exact component={LiveStreamPublic} />
          <Route path="/mobile-meeting/:roomName/:participantName" exact component={MobileMeeting} />
          <Route path="/redirect/:url+" exact component={RedirectPage} />
          <Route path='/forgot-password' component={ForgotPassword} />
          <Route path='/OTP/:id' component={OTP} />
          <Route path='/reset-password/:id/:key' component={Login} />
          <Route component={Login} />
        </Switch>
      </div>
    );
  }
}


export class RedirectPage extends React.Component {
  render() {
    let userInfo = localStorage.getItem("user");
    if (userInfo){
      return <Redirect to={'/'+this.props.match.params.url} />
    }
    else{
      return <Login redirectUrl={'/'+this.props.match.params.url} />
    }
  }
}

export class Main extends React.Component {
  state = {
    level: Storage.get('user').data.level
  }

  render() {
    let workSpaceSwitch = null;
    if(this.state.level === 'superadmin') {
      workSpaceSwitch = <SuperAdminSwitch />;
    } else if(this.state.level === 'admin') {
      workSpaceSwitch = <AdminSwitch />;
    } else {
      workSpaceSwitch = <ClientSwitch />;
    }

    return (
      <div>
        <Loader />
        <Sidebar />
        <Header />
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          />
        {workSpaceSwitch}
      </div>
    );
  }
}

export class Logout extends React.Component {
  constructor(props) {
    super(props);

    this.onClickLogout = this.onClickLogout.bind(this);
  }

  onClickLogout(e) {
    e.preventDefault();
  }
  
  componentDidMount() {
    const user_id = Storage.get('user').data.user_id;
    API.get(`${API_SERVER}v1/auth/logout/${user_id}`).then((res) => {
      localStorage.clear();
      window.location.href = window.location.origin;
  });
  }

  render() {
    return <div>Loading</div>;
  }
}

export class SuperAdminSwitch extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Home} />

        <Route path="/detail-project/:project_id" component={DetailProject} />
        <Route path="/webinar/:webinar_id" component={WebinarDetail} />
        <Route path="/project" component={Project} /> 
        
        <Route path="/forum" component={Forum} />
        <Route path="/forum-detail/:forum_id" component={ForumDetail} />
        <Route path="/aktivitas" component={Activity} />

        <Route path="/meeting" exact component={LiveClassAdmin} />
        <Route path="/meeting/information/:roomid" exact component={LiveClassAdmin} />
        <Route path="/mobile-meeting/:roomName/:participantName" exact component={MobileMeeting} />
        <Route path="/liveclass-room/:roomid" component={LiveStream} />
        
        <Route path="/pengaturan" component={Pengaturan} />
        <Route path="/profile" component={Profile} />
        <Route path="/files" component={Files} />
        <Route path="/notification" component={Notification} />

        <Route path="/kursus-materi" exact component={KursusMateri} />
        <Route path="/kursus-materi-create" exact component={KursusMateriAdd} />
        <Route path="/kursus-materi-edit/:course_id" exact component={KursusMateriEdit} />

        <Route path="/kursus" component={Kursus} />

        <Route path="/kategori-kursus/:category_id" component={KategoriKursus} />
        <Route path="/detail-kursus/:course_id" component={DetailKursus} />
        <Route path="/ujian-kursus/:exam_id/:count_soal/:durasi_waktu" component={UjianKursus} />
        <Route path="/ujian-hasil/:exam_id" component={UjianHasil} />

        <Route path="/chapter/:course_id" exact component={ChapterPreview} />
        <Route path="/nilaiujian/:course_id" exact component={NilaiUjianPreview} />

        <Route path="/quiz/:course_id" exact component={QuizList} />
        <Route path="/question-quiz/:exam_id" exact component={QuestionQuiz} />
        <Route path="/question-quiz-create/:exam_id" exact component={QuestionQuizCreate} />
        <Route path="/question-quiz-edit/:question_id" exact component={QuestionQuizEdit} />

        <Route path="/exam/:course_id" exact component={ExamList} />
        <Route path="/question-exam/:exam_id" exact component={QuestionExam} />
        <Route path="/question-exam-create/:exam_id" exact component={QuestionExamCreate} />

        <Route path="/user" component={User} />
        <Route path="/user-create" component={UserAdd} />
        <Route path="/user-edit/:user_id" component={UserEdit} />
        
        {/* <Route path="/user-create" component={UserCompanyAdd} />
        <Route path="/user-edit/:user_id" exact component={UserCompanyEdit} /> */}
        
        {/* <Route path="/user-access" component={UserAccess} /> */}
        <Route path="/user-company/:company_id" component={UserCompany} />
        
        <Route path="/cabang" component={Cabang} />
        <Route path="/company" component={Company} />
        <Route path="/company-detail/:company_id" component={CompanyDetail} />
        <Route path="/company-detail-super/:company_id" component={CompanyDetailSuper} />
        <Route path="/grup" component={Grup} />

        <Route path="/filemanager" exact component={FilePicker} />

        <Route path='/certificate-admin' component={CertificateAdmin} />
        <Route path='/certificate-create' component={CertificateCreate} />

        <Route path='/certificate' component={Certificate} />
        <Route path='/print-certificate1' component={PrintCertificate1} />
        <Route path='/print-certificate2' component={PrintCertificate2} />
        <Route path='/print-certificate3' component={PrintCertificate3} />

        <Route path="/logout" component={Logout} />
      </Switch>
    );
  }
}

export class AdminSwitch extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Home} />

        <Route path="/detail-project/:project_id" component={DetailProject} /> 
        <Route path="/project" component={Project} /> 

        <Route path="/forum" component={Forum} />
        <Route path="/forum-detail/:forum_id" component={ForumDetail} />
        <Route path="/aktivitas" component={Activity} />
        
        <Route path="/pengaturan" exact component={Pengaturan} />

        <Route path="/profile" exact component={Profile} />
        {/* <Route path="/user-access" component={UserAccess} /> */}
        <Route path="/files" component={Files} />

        <Route path="/user" exact component={User} />
        <Route path="/user-create" exact component={UserAdd} />
        <Route path="/user-edit/:user_id" exactcomponent={UserEdit} />

        <Route path="/user-company" exact component={UserCompany} />
        <Route path="/user-company-create" component={UserCompanyAdd} />
        <Route path="/user-company-edit/:user_id" exact component={UserCompanyEdit} />
        {/* <Route path="/user-access" exactcomponent={UserAccess} /> */}
        <Route path="/my-company" exact component={CompanyDetail} />

        <Route path="/kursus-materi" exact component={KursusMateri} />
        <Route path="/kursus-materi-create" exact component={KursusMateriAdd} />
        <Route path="/kursus-materi-edit/:course_id" exact component={KursusMateriEdit} />

        <Route path="/kursus" component={Kursus} />

        <Route path="/kategori-kursus/:category_id" component={KategoriKursus} />
        <Route path="/detail-kursus/:course_id" component={DetailKursus} />
        <Route path="/ujian-kursus/:exam_id/:count_soal/:durasi_waktu" component={UjianKursus} />
        <Route path="/ujian-hasil/:exam_id" component={UjianHasil} />

        <Route path="/chapter/:course_id" exact component={ChapterPreview} />
        <Route path="/nilaiujian/:course_id" exact component={NilaiUjianPreview} />

        <Route path="/quiz/:course_id" exact component={QuizList} />
        <Route path="/question-quiz/:exam_id" exact component={QuestionQuiz} />
        <Route path="/question-quiz-create/:exam_id" exact component={QuestionQuizCreate} />
        <Route path="/question-quiz-edit/:question_id" exact component={QuestionQuizEdit} />

        <Route path="/exam/:course_id" exact component={ExamList} />
        <Route path="/question-exam/:exam_id" exact component={QuestionExam} />
        <Route path="/question-exam-create/:exam_id" exact component={QuestionExamCreate} />

        <Route path="/meeting" exact component={LiveClassAdmin} />
        <Route path="/meeting/information/:roomid" exact component={LiveClassAdmin} />
        {/* <Route path="/liveclass-room/:roomid" exact component={LiveClassAdminJoin} /> */}
        <Route path="/liveclass-room/:roomid" exact component={LiveStream} />

        <Route path="/cabang" exact component={Cabang} />
        <Route path="/company" exact component={Company} />
        <Route path="/grup" exact component={Grup} />

        <Route path="/filemanager" exact component={FilePicker} />
        
        <Route path='/certificate-admin' component={CertificateAdmin} />
        <Route path='/certificate-create' component={CertificateCreate} />

        <Route path='/certificate' component={Certificate} />
        <Route path='/print-certificate1' component={PrintCertificate1} />
        <Route path='/print-certificate2' component={PrintCertificate2} />
        <Route path='/print-certificate3' component={PrintCertificate3} />

        <Route path="/logout" exact component={Logout} />
      </Switch>
    );
  }
}

export class ClientSwitch extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Home} />

        <Route path="/detail-project/:project_id" component={DetailProject} /> 
        <Route path="/project" component={Project} /> 

        <Route path="/forum" component={Forum} />
        <Route path="/forum-detail/:forum_id" component={ForumDetail} />
        
        <Route path="/aktivitas" component={Activity} />
        
        <Route path="/kursus-materi" exact component={KursusMateri} />
        <Route path="/kursus-materi-create" exact component={KursusMateriAdd} />
        <Route path="/kursus-materi-edit/:course_id" exact component={KursusMateriEdit} />
        
        <Route path="/kategori-kursus/:category_id" component={KategoriKursus} />
        <Route path="/detail-kursus/:course_id" component={DetailKursus} />
        <Route path="/ujian-kursus/:exam_id/:count_soal/:durasi_waktu" component={UjianKursus} />
        <Route path="/ujian-hasil/:exam_id" component={UjianHasil} />

        {/* <Route path="/liveclass" exact component={LiveClass} /> */}
        {/* <Route path="/liveclass" component={LiveClass} /> */}
        <Route path="/meeting" exact component={LiveClassAdmin} />
        <Route path="/meeting/information/:roomid" exact component={LiveClassAdmin} />
        <Route path="/liveclass-room/:roomid" component={LiveStream} />
        
        <Route path="/pengaturan" component={Pengaturan} />

        <Route path="/kursus" component={Kursus} />

        <Route path="/profile" component={Profile} />
        {/* <Route path="/files" component={Files} /> */}

        <Route path='/certificate' component={Certificate} />
        <Route path='/print-certificate1' component={PrintCertificate1} />
        <Route path='/print-certificate2' component={PrintCertificate2} />
        <Route path='/print-certificate3' component={PrintCertificate3} />
        
        <Route path="/logout" component={Logout} />
      </Switch>
    );
  }
}
