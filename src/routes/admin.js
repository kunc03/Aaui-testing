import React from "react";
import Logout from "./logout";

import { Switch, Route, Redirect } from "react-router-dom";

// import Home from "../components/Home/index";
import Home from "../components/Home_new/index";
import Activity from "../components/Activity/index";
import Notification from "../components/Notification/index";
import Pengumuman from "../components/Pengumuman/index";
import Pengaturan from "../components/Pengaturan/index";

import ZoomCallback from '../components/zoom/call'

import ClassBantuan from "../components/bantuan/index";
import GlobalSettings from "../components/Global_setting/index";
import NotificationAlert from "../components/Global_setting/notification";
import Profile from "../components/Profile/index";
import FullCalender from "../components/kalender/fullKalender"
import News from "../components/news/index";
import NewsForm from "../components/news/form";
import NewsView from "../components/news/view";

// Dashboard New Home Detail
import DetailProject from "../components/detail_project/index";

import GanttReport from "../components/Gantt/report"

import Project from "../components/project/index";

import User from "../components/Users/User/index";
import UserAdd from "../components/Users/User/add";
import UserEdit from "../components/Users/User/Edit";

import UserCompany from "../components/Users/User/company";
import UserCompanyAdd from "../components/Users/User/companyadd";
import UserCompanyEdit from "../components/Users/User/companyedit";
import FilePicker from "../components/admin/filemanager/file";

import Cabang from "../components/Users/UserCabang/index";
import Grup from "../components/Users/UserGroup/index";
import Company from "../components/Users/UserCompany/index";
import CompanyDetail from "../components/Users/UserCompany/detail";
import InformasiAdmin from "../components/admin/informasi";
import MobileMeeting from "../components/liveclass/mobileMeeting";
import Meeting from "../components/meeting";
import TrainingSettings from "../components/training/settings";
import Training from "../components/training/company";
import TrainingReport from "../components/training/report";
import TrainingUser from "../components/training/user";
import TrainingCourse from "../components/training/course";
import TrainingCourseForm from "../components/training/course/form";
import TrainingQuiz from "../components/training/quiz";
import TrainingExamForm from "../components/training/exam/form";
import TrainingExam from "../components/training/exam";
import TrainingMembership from "../components/training/membership";
import TrainingMembershipForm from "../components/training/membership/form";
import TrainingWebinar from "../components/training/webinar";
import TrainingQuestions from "../components/training/questions";
import TrainingQuestionsForm from "../components/training/questions/form";
import TrainingCompanyForm from "../components/training/company/form";
import TrainingCompanyDetail from "../components/training/company/detail";
import TrainingUserForm from "../components/training/user/form";
import TrainingUserDetail from "../components/training/user/detail";
import MeetingRoom from "../components/liveclass/meetingRoom";
import Webinar from "../components/webinar";

import Kursus from "../components/Kursus";
import WebinarClient from '../components/client/webinar/index';

import LearningAdmin from '../components/learning/index';

import Ptc from '../components/ptc/index';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class AdminSwitch extends React.Component {
    render() {
      return (
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/full-kalender" component={FullCalender} />
  
          <Route path="/zoom/callback" component={ZoomCallback} />
  
          <Route path="/informasi" component={InformasiAdmin} />
          <Route path="/webinar" component={WebinarClient} />
          <Route path="/learning" component={LearningAdmin} />
  
          <Route path="/detail-project/:project_id" component={DetailProject} />
          <Route path="/project" component={Project} />
          <Route path="/gantt/report" component={GanttReport} />
  
          <Route path="/ptc" component={Ptc} />
          <Route path="/aktivitas" component={Activity} />
          <Route path="/mobile-meeting/:url+" exact component={MobileMeeting} />
          <Route path="/bantuan" component={ClassBantuan} />
  
          <Route path="/pengaturan" exact component={Pengaturan} />
          <Route path="/news" exact component={News} />
          <Route path="/news/create" exact component={NewsForm} />
          <Route path="/news/edit/:id" exact component={NewsForm} />
          <Route path="/news/:id" exact component={NewsView} />
          <Route path="/global-settings" component={GlobalSettings} />
          <Route path="/notification-alert" component={NotificationAlert} />
  
          <Route path="/profile" exact component={Profile} />
  
          <Route path="/user" exact component={User} />
          <Route path="/user-create" exact component={UserAdd} />
          <Route path="/user-edit/:user_id" exactcomponent={UserEdit} />
  
          <Route path="/user-company" exact component={UserCompany} />
          <Route path="/user-company-create" component={UserCompanyAdd} />
          <Route path="/user-company-edit/:user_id" exact component={UserCompanyEdit} />
          <Route path="/my-company" exact component={CompanyDetail} />
  
          <Route path="/kursus" component={Kursus} />
  
          <Route path="/pengumuman" component={Pengumuman} />
          <Route path="/notification" component={Notification} />
          <Route path="/training/settings" exact component={TrainingSettings} />
          <Route path="/training" exact component={Training} />
          <Route path="/training/report" exact component={TrainingReport} />
          <Route path="/training/user" exact component={TrainingUser} />
          <Route path="/training/course" exact component={TrainingCourse} />
          <Route path="/training/course/create" exact component={TrainingCourseForm} />
          <Route path="/training/course/edit/:id" exact component={TrainingCourseForm} />
          <Route path="/training/questions" exact component={TrainingQuestions} />
          <Route path="/training/questions/create" exact component={TrainingQuestionsForm} />
          <Route path="/training/questions/edit/:id" exact component={TrainingQuestionsForm} />
          <Route path="/training/quiz" exact component={TrainingQuiz} />
          <Route path="/training/exam" exact component={TrainingExam} />
          <Route path="/training/exam/create/:type" exact component={TrainingExamForm} />
          <Route path="/training/exam/edit/:id" exact component={TrainingExamForm} />
          <Route path="/training/membership" exact component={TrainingMembership} />
          <Route path="/training/membership/edit/:id" exact component={TrainingMembershipForm} />
          <Route path="/training/webinar" exact component={TrainingWebinar} />
          <Route path="/training/company/create" exact component={TrainingCompanyForm} />
          <Route path="/training/company/edit/:id" exact component={TrainingCompanyForm} />
          <Route path="/training/company/detail/:id" exact component={TrainingCompanyDetail} />
          <Route path="/training/user/create/:level/:company" exact component={TrainingUserForm} />
          <Route path="/training/user/edit/:id" exact component={TrainingUserForm} />
          <Route path="/training/user/detail/:id" exact component={TrainingUserDetail} />
  
          <Route path="/meeting" exact component={Meeting} />
          <Route
            exact
            path="/meeting/:roomid"
            render={props => (
              <Redirect to={`/meeting-room/${props.match.params.roomid}`} />
            )}
          />
          <Route path="/meeting/information/:roomid" exact component={Meeting} />
          <Route path="/meeting-room/:roomid" component={MeetingRoom} />
          <Route path="/webinars" exact component={Webinar} />
  
          <Route path="/cabang" exact component={Cabang} />
          <Route path="/company" exact component={Company} />
          <Route path="/grup" exact component={Grup} />
  
          <Route path="/filemanager" exact component={FilePicker} />
  
  
          <Route path="/logout" exact component={Logout} />
        </Switch>
      );
    }
  }