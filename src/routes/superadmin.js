import React, { lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';

// Components
const ThankYou = lazy(()=> import("../components/public/thankyou"));
const Logout = lazy(()=> import('./logout'));
const Home = lazy(()=> import('../components/Home_new/index'));
const Calendar = lazy(()=> import('../components/Home_new/calendar'));
const Notification = lazy(()=> import('../components/Notification/index'));
const Pengumuman = lazy(()=> import('../components/Pengumuman/index'));
const Pengaturan = lazy(()=> import('../components/Pengaturan/index'));
const ZoomCallback = lazy(()=> import('../components/zoom/call'));
const ClassBantuan = lazy(()=> import('../components/bantuan/indexv2'));
const GlobalSettings = lazy(()=> import('../components/Global_setting/index'));
const Profile = lazy(()=> import('../components/Profile/index'));
const FullCalender = lazy(()=> import('../components/kalender/fullKalender'));
const News = lazy(()=> import('../components/news/index'));
const NewsForm = lazy(()=> import('../components/news/form'));
const NewsView = lazy(()=> import('../components/news/view'));
const DetailProject = lazy(()=> import('../components/detail_project/index'));
const GanttReport = lazy(()=> import('../components/Gantt/report'));

const Project = lazy(() => import("../components/project/index"));

const MeetRoomPub = lazy(()=> import("../components/liveclass/meetRoomPub"));

const User = lazy(()=> import( "../components/Users/User/index"));
const UserAdd = lazy(()=> import( "../components/Users/User/add"));
const UserEdit = lazy(()=> import( "../components/Users/User/Edit"));

const UserCompany = lazy(()=> import( "../components/Users/User/company"));
const FilePicker = lazy(()=> import( "../components/admin/filemanager/file"));

const Cabang = lazy(()=> import( "../components/Users/UserCabang/index"));
const Grup = lazy(()=> import( "../components/Users/UserGroup/index"));
const Company = lazy(()=> import( "../components/Users/UserCompany/index"));
const CompanyDetail = lazy(()=> import( "../components/Users/UserCompany/detail"));
const CompanyDetailSuper = lazy(()=> import( "../components/Users/UserCompany/detailsuper"));
const MobileMeeting = lazy(()=> import( "../components/liveclass/mobileMeeting"));
const Meeting = lazy(()=> import( "../components/meeting"));
const TrainingSettings = lazy(()=> import( "../components/training/settings"));
const Training = lazy(()=> import( "../components/training/company"));
const TrainingReport = lazy(()=> import( "../components/training/report"));
const TrainingQuota = lazy(()=> import( "../components/training/quota"));
const TrainingQuotaDetail = lazy(()=> import( "../components/training/quota/detail"));
const TrainingUser = lazy(()=> import( "../components/training/user"));
const TrainingCourse = lazy(()=> import( "../components/training/course"));
const TrainingCourseForm = lazy(()=> import( "../components/training/course/form"));
const TrainingQuiz = lazy(()=> import( "../components/training/quiz"));
const TrainingExamForm = lazy(()=> import( "../components/training/exam/form"));
const TrainingExam = lazy(()=> import( "../components/training/exam"));
const TrainingPlan = lazy(()=> import("../components/training/plan"));
const TrainingExamAssignment = lazy(()=> import( "../components/training/exam/assignment"));
const TrainingMembership = lazy(()=> import( "../components/training/membership"));
const TrainingMembershipForm = lazy(()=> import( "../components/training/membership/form"));
const TrainingWebinar = lazy(()=> import( "../components/training/webinar"));
const TrainingQuestions = lazy(()=> import( "../components/training/questions"));
const TrainingQuestionsForm = lazy(()=> import( "../components/training/questions/form"));
const TrainingCompanyForm = lazy(()=> import( "../components/training/company/form"));
const TrainingCompanyDetail = lazy(()=> import( "../components/training/company/detail"));
const TrainingUserForm = lazy(()=> import( "../components/training/user/form"));
const TrainingUserDetail = lazy(()=> import( "../components/training/user/detail"));
const MeetingRoom = lazy(()=> import( "../components/liveclass/meetingRoom"));
const Webinar = lazy(()=> import( "../components/webinar"));
const WebinarClient = lazy(()=> import( '../components/client/webinar/index'));

const LearningAdmin = lazy(()=> import( '../components/learning/index'));

const Ptc = lazy(()=> import( '../components/ptc/index'));
export default class SuperAdminSwitch extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/thankyou" component={ThankYou} />
        <Route path="/webinar" component={WebinarClient} />
        <Route path="/learning" component={LearningAdmin} />
        <Route path="/full-kalender" component={FullCalender} />

        <Route path="/zoom/callback" component={ZoomCallback} />

        <Route path="/detail-project/:project_id" component={DetailProject} />
        <Route path="/project" component={Project} />
        <Route path="/gantt/report" component={GanttReport} />
        <Route path="/global-settings" component={GlobalSettings} />

        <Route path="/ptc" component={Ptc} />
        <Route path="/calendar" component={Calendar} />
        {/* Training */}
        <Route path="/training/settings" exact component={TrainingSettings} />
        <Route path="/training/company" exact component={Training} />
        <Route path="/training" exact component={TrainingQuota} />
        <Route path="/training/report" exact component={TrainingReport} />
        <Route path="/training/quota/detail/:id" exact component={TrainingQuotaDetail} />
        <Route path="/training/user" exact component={TrainingUser} />
        <Route path="/training/course" exact component={TrainingCourse} />
        <Route path="/training/course/create" exact component={TrainingCourseForm} />
        <Route path="/training/course/edit/:id" exact component={TrainingCourseForm} />
        <Route path="/training/questions" exact component={TrainingQuestions} />
        <Route path="/training/questions/create" exact component={TrainingQuestionsForm} />
        <Route path="/training/questions/edit/:id" exact component={TrainingQuestionsForm} />
        <Route path="/training/quiz" exact component={TrainingQuiz} />
        <Route path="/training/exam" exact component={TrainingExam} />
        <Route path="/training/plan" exact component={TrainingPlan} />
        <Route path="/training/exam/create/:type" exact component={TrainingExamForm} />
        <Route path="/training/exam/edit/:id" exact component={TrainingExamForm} />
        <Route path="/training/exam/assignment/:id" exact component={TrainingExamAssignment} />
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
        <Route path="/meet/:roomid" exact component={MeetRoomPub} />

        <Route path="/meeting/information/:roomid" exact component={Meeting} />
        <Route path="/mobile-meeting/:url+" exact component={MobileMeeting} />
        <Route path="/meeting-room/:roomid" component={MeetingRoom} />
        <Route path="/webinars" exact component={Webinar} />

        <Route path="/bantuan" component={ClassBantuan} />

        <Route path="/pengaturan" component={Pengaturan} />
        <Route path="/news" exact component={News} />
        <Route path="/news/create" exact component={NewsForm} />
        <Route path="/news/edit/:id" exact component={NewsForm} />
        <Route path="/news/:id" exact component={NewsView} />
        <Route path="/profile" component={Profile} />
        <Route path="/notification" component={Notification} />
        <Route path="/pengumuman" component={Pengumuman} />

        <Route path="/user" component={User} />
        <Route path="/user-create" component={UserAdd} />
        <Route path="/user-edit/:user_id" component={UserEdit} />
        <Route path="/my-company" exact component={CompanyDetail} />
        <Route path="/user-company/:company_id" component={UserCompany} />

        <Route path="/cabang" component={Cabang} />
        <Route path="/company" component={Company} />
        <Route path="/company-detail/:company_id" component={CompanyDetail} />
        <Route path="/company-detail-super/:company_id" component={CompanyDetailSuper} />
        <Route path="/grup" component={Grup} />

        <Route path="/filemanager" exact component={FilePicker} />




        <Route path="/logout" component={Logout} />
      </Switch>
    );
  }
}
