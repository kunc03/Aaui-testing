import React, { lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';

// Component
const ThankYou = lazy(() => import("../components/public/thankyou"));
const Logout = lazy(() => import("./logout"));
const Home = lazy(() => import("../components/Home_new/index"));
const Calendar = lazy(() => import("../components/Home_new/calendar"));
const Notification = lazy(() => import("../components/Notification/index"));
const Pengumuman = lazy(() => import("../components/Pengumuman/index"));
const Pengaturan = lazy(() => import("../components/Pengaturan/index"));

const ZoomCallback = lazy(() => import('../components/zoom/call'));
const ClassBantuan = lazy(() => import("../components/bantuan/indexv2"));
const GlobalSettings = lazy(() => import("../components/Global_setting/index"));
const NotificationAlert = lazy(() => import("../components/Global_setting/notification"));
const Profile = lazy(() => import("../components/Profile/index"));
const FullCalender = lazy(() => import("../components/kalender/fullKalender"));
const News = lazy(() => import("../components/news/index"));
const NewsForm = lazy(() => import("../components/news/form"));
const NewsView = lazy(() => import("../components/news/view"));

// Dashboard New Home Detail
const DetailProject = lazy(() => import("../components/detail_project/index"));

const GanttReport = lazy(() => import("../components/Gantt/report"));

const Project = lazy(() => import("../components/project/index"));

const User = lazy(() => import("../components/Users/User/index"));
const UserAdd = lazy(() => import("../components/Users/User/add"));
const UserEdit = lazy(() => import("../components/Users/User/Edit"));

const UserCompany = lazy(() => import("../components/Users/User/company"));
const UserCompanyAdd = lazy(() => import("../components/Users/User/companyadd"));
const UserCompanyEdit = lazy(() => import("../components/Users/User/companyedit"));
const FilePicker = lazy(() => import("../components/admin/filemanager/file"));

const MeetRoomPub = lazy(() => import("../components/liveclass/meetRoomPub"));

const Cabang = lazy(() => import("../components/Users/UserCabang/index"));
const Grup = lazy(() => import("../components/Users/UserGroup/index"));
const Company = lazy(() => import("../components/Users/UserCompany/index"));
const CompanyDetail = lazy(() => import("../components/Users/UserCompany/detail"));
const InformasiAdmin = lazy(() => import("../components/admin/informasi"));
const MobileMeeting = lazy(() => import("../components/liveclass/mobileMeeting"));
const Meeting = lazy(() => import("../components/meeting"));
const TrainingSettings = lazy(() => import("../components/training/settings"));
const Training = lazy(() => import("../components/training/company"));
const TrainingReport = lazy(() => import("../components/training/report"));
const TrainingReportMembership = lazy(() => import("../components/training/report/ReportMembership"));
const TrainingUser = lazy(() => import("../components/training/user"));
const TrainingCourse = lazy(() => import("../components/training/course"));
const TrainingCourseForm = lazy(() => import("../components/training/course/form"));
const TrainingQuiz = lazy(() => import("../components/training/quiz"));
const TrainingExamForm = lazy(() => import("../components/training/exam/form"));
const TrainingExam = lazy(() => import("../components/training/exam"));
const TrainingPlan = lazy(() => import("../components/training/plan"));
const TrainingPlanUser = lazy(() => import("../components/training/plan/userProgression"));
const TrainingPlanUserDetail = lazy(() => import("../components/training/plan/userProgressionDetail"));
const TrainingExamAssignment = lazy(() => import("../components/training/exam/assignment"));
const TrainingMembership = lazy(() => import("../components/training/membership"));
const TrainingMembershipForm = lazy(() => import("../components/training/membership/form"));
const TrainingWebinar = lazy(() => import("../components/training/webinar"));
const TrainingQuestions = lazy(() => import("../components/training/questions"));
const TrainingQuestionsForm = lazy(() => import("../components/training/questions/form"));
const TrainingCompanyForm = lazy(() => import("../components/training/company/form"));
const TrainingCompanyDetail = lazy(() => import("../components/training/company/detail"));
const TrainingUserForm = lazy(() => import("../components/training/user/form"));
const TrainingUserDetail = lazy(() => import("../components/training/user/detail"));
const MeetingRoom = lazy(() => import("../components/liveclass/meetingRoom"));
const Webinar = lazy(() => import("../components/webinar"));

const Kursus = lazy(() => import("../components/Kursus"));
const WebinarClient = lazy(() => import('../components/client/webinar/index'));

const LearningAdmin = lazy(() => import('../components/learning/index'));
const WebinarLivePublic = lazy(() => import("../components/client/webinar/livePublic"));

const Ptc = lazy(() => import('../components/ptc/index'));
const RegistrationCustomeAdmin = lazy(() => import('../components/training/company/registrationCustome'));
const RegistrationCustomePublic = lazy(() => import('../components/public/registrationCustome'));
const TrainingUserRegistration = lazy(() => import('../components/training/RegistrationUser/index'));
export default class AdminSwitch extends React.Component {
  render() {
    return (
      <Switch>
        <Route path="/training/list-registration-user" exact component={TrainingUserRegistration} />
        <Route path="/training/company/registration-form/:id" component={RegistrationCustomeAdmin} />
        <Route path="/training/form-registration/:id" component={RegistrationCustomePublic} />
        <Route path="/" exact component={Home} />
        <Route path="/thankyou" component={ThankYou} />
        <Route path="/full-kalender" component={FullCalender} />

        <Route path="/zoom/callback" component={ZoomCallback} />

        <Route path="/informasi" component={InformasiAdmin} />
        <Route path="/webinar" component={WebinarClient} />
        <Route path="/learning" component={LearningAdmin} />

        <Route path="/detail-project/:project_id" component={DetailProject} />
        <Route path="/project" component={Project} />
        <Route path="/gantt/report" component={GanttReport} />

        <Route path="/ptc" component={Ptc} />
        <Route path="/calendar" component={Calendar} />
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
        <Route path="/training/report/membership" exact component={TrainingReportMembership} />
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
        <Route path="/training/plan-user" exact component={TrainingPlanUser} />
        <Route path="/training/plan-user/:id" exact component={TrainingPlanUserDetail} />
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
        <Route path="/webinar-guest/:webinarId/:voucher" exact component={WebinarLivePublic} />

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