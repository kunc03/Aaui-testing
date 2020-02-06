import React from "react";

import { Switch, Route } from "react-router-dom";

import API, { API_SERVER } from './repository/api'; 
import Storage from './repository/storage';

import Header from "./components/Header_sidebar/Header";
import Sidebar from "./components/Header_sidebar/Sidebar";
import Loader from "./components/Header_sidebar/Loader";
import Home from "./components/Home/index";
import Pengaturan from "./components/Pengaturan/index";
import Profile from "./components/Profile/index";

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

import QuizList from "./components/admin/exam/quiz";
import QuestionQuiz from "./components/admin/question/quiz";
import QuestionQuizCreate from "./components/admin/question/quizcreate";
import QuestionQuizEdit from "./components/admin/question/quizedit";

import ExamList from "./components/admin/exam/exam";
import QuestionExam from "./components/admin/question/exam";
import QuestionExamCreate from "./components/admin/question/examcreate";

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

import Forum, { ForumDetail } from "./components/forum/forum";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userLogin: false
    };
  }

  componentDidMount() {
    let userInfo = localStorage.getItem("user");


    // if (userInfo == null) {
    //   this.setState({ userLogin: false });
    // } else {
    //   this.setState({ userLogin: true });
    // }
    
  }

  _privateRoute() {
    // let workSpace = null;
    // if (this.state.userLogin) {
    //   workSpace = <Main />;
    // } else {
    //   workSpace = <Login />;
    // }

    // return <div>{workSpace}</div>;
  }

  render() {
    return (
      <Router>
        <div>
          {userInfo ? 
            <div>
              <Loader />
              <SideBar />
              <Header />
            </div>
          : null }
          
          <Switch>
                <Route
									exact path={'/'}
									render={() => <Redirect to={userInfo !== null ? '/home' : '/login'} />} />
								
								<Route
									path={userInfo !== null ? '/home' :'/login'}
									component={userInfo !== null ? Home : Login} />
                
                <Route
									path={'/login-voucher'}
									component={LoginVoucher} />

                  {router.map((value, index) => {
                      return (
                          <PrivateRoute key={index} path={value.path} component={value.component} />
                        )}
                      ) 
                  }

                  
            {/* <Route path="/" exact component={Home} />
            <Route path="/Pengaturan" exact component={Pengaturan} />
            <Route path="/Profile" exact component={Profile} />
            <Route path="/user" exact component={User} />
            <Route path="/user-create" exact component={UserAdd} />
            <Route path="/cabang" exact component={UserCabang} />
            <Route path="/grup" exact component={UserGrup} />
            <Route path="/logout" component={Logout} /> */}

            {/* <Route path="/login" exact component={Login} /> */}
          </Switch>
        </div>
      </Router>
    );
  }
}

export class AdminSwitch extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/pengaturan" exact component={Pengaturan} />
        <Route path="/profile" exact component={Profile} />
        <Route path="/user-access" component={UserAccess} />

        <Route path="/user" exact component={User} />
        <Route path="/user-create" exact component={UserAdd} />
        <Route path="/user-edit/:user_id"  exactcomponent={UserEdit} />

        <Route path="/user-company" exact component={UserCompany} />
        <Route path="/user-company-create" component={UserCompanyAdd} />
        <Route path="/user-company-edit/:user_id" exact component={UserCompanyEdit} />
        <Route path="/user-access" exactcomponent={UserAccess} />
        <Route path="/my-company" exact component={CompanyDetail} />
        
        <Route path="/kursus-materi" exact component={KursusMateri} />
        <Route path="/kursus-materi-create" exact component={KursusMateriAdd} />
        <Route path="/kursus-materi-edit/:course_id" exact component={KursusMateriEdit} />
        
        <Route path="/chapter/:course_id" exact component={ChapterPreview} />

        <Route path="/quiz/:course_id" exact component={QuizList}  />
        <Route path="/question-quiz/:exam_id" exact component={QuestionQuiz} />
        <Route path="/question-quiz-create/:exam_id" exact component={QuestionQuizCreate} />
        <Route path="/question-quiz-edit/:question_id" exact component={QuestionQuizEdit} />
        
        <Route path="/exam/:course_id" exact component={ExamList}  />
        <Route path="/question-exam/:exam_id" exact component={QuestionExam} />
        <Route path="/question-exam-create/:exam_id" exact component={QuestionExamCreate} />
        
        <Route path="/cabang" exact component={Cabang} />
        <Route path="/company" exact component={Company} />
        <Route path="/grup" exact component={Grup} />

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

        <Route path="/forum" component={Forum} />
        <Route path="/forum-detail/:forum_id" component={ForumDetail} />
        
        <Route path="/aktivitas" component={Home} />
        
        <Route path="/kategori-kursus/:category_id" component={KategoriKursus} />
        <Route path="/detail-kursus/:course_id" component={DetailKursus} />
        <Route path="/ujian-kursus/:exam_id/:count_soal/:durasi_waktu" component={UjianKursus} />
        <Route path="/ujian-hasil/:exam_id" component={UjianHasil} />
        
        <Route path="/pengaturan" component={Pengaturan} />
        <Route path="/profile" component={Profile} />
        
        <Route path="/logout" component={Logout} />
      </Switch>
    );
  }
}
