import React, { lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import "react-datepicker/dist/react-datepicker.css";
import '@trendmicro/react-buttons/dist/react-buttons.css';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';

// Components
const ThankYou = lazy(()=> import("../components/public/thankyou"));
const Logout = lazy(()=> import("./logout"));
const Home = lazy(()=> import("../components/Home_new/index"));
const Activity = lazy(()=> import("../components/Activity/index"));
const Notification = lazy(()=> import("../components/Notification/index"));
const Pengumuman = lazy(()=> import("../components/Pengumuman/index"));
const Pengaturan = lazy(()=> import("../components/Pengaturan/index"));
const ZoomCallback = lazy(()=> import('../components/zoom/call'));
const ClassBantuan = lazy(()=> import("../components/bantuan/index"));
const Profile = lazy(()=> import("../components/Profile/index"));
const FullCalender = lazy(()=> import("../components/kalender/fullKalender"));
const News = lazy(()=> import("../components/news/index"));
const NewsView = lazy(()=> import("../components/news/view"));
const DetailProject = lazy(()=> import("../components/detail_project/index"));
const GanttReport = lazy(()=> import("../components/Gantt/report"));
const Project = lazy(()=> import("../components/project/index"));
const Meeting = lazy(()=> import("../components/meeting"));
const TrainingReport = lazy(()=> import("../components/training/report"));
const TrainingUser = lazy(()=> import("../components/training/user"));
const TrainingCourse = lazy(()=> import("../components/training/course"));
const TrainingMembership = lazy(()=> import("../components/training/membership"));
const TrainingMembershipForm = lazy(()=> import("../components/training/membership/form"));
const TrainingUserForm = lazy(()=> import("../components/training/user/form"));
const TrainingUserDetail = lazy(()=> import("../components/training/user/detail"));
const MeetingRoom = lazy(()=> import("../components/liveclass/meetingRoom"));
const Webinar = lazy(()=> import("../components/webinar"));
const Kursus = lazy(()=> import("../components/Kursus"));
const WebinarClient = lazy(()=> import('../components/client/webinar/index'));
const LearningGuru = lazy(()=> import('../components/learning/guru'));
const LearningGuruInfo = lazy(()=> import('../components/learning/guruinfo'));
const LearningMurid = lazy(()=> import('../components/learning/murid'));
// ======= const COMPONENT GURU ======== //
const GuruPersonalia = lazy(()=> import('../components/guruPersonalia/index'));
const GuruKurusus = lazy(()=> import('../components/guruKursus/index'));
const GuruUjian = lazy(()=> import('../components/guruUjian/index'));
const GuruJadwal = lazy(()=> import('../components/jadwal_mengajar/guru'));
const InformasiKelas = lazy(()=> import('../components/guruInformasiKelas/index'));
const GuruKPI = lazy(()=> import('../components/guruKPI/index'));
const DetailMurid = lazy(()=> import('../components/detail_murid/index'));
const DetailKelas = lazy(()=> import('../components/detail_kelas/index'));
const DetailRapor = lazy(()=> import('../components/detail_rapor/index'));
const LaporanForGuru = lazy(()=> import('../components/laporan/laporanguru'));
// ======= const COMPONENT MURID ======== //
const MuridLaporanRapor = lazy(()=> import('../components/muridLaporanRapor/index'));
// ======= const COMPONENT PARENT ======== //
const LaporanPembelajaranMurid = lazy(()=> import('../components/parentLearning/index'));
const KurikulumParent = lazy(()=> import('../components/parentLearning/kurikulum'));
const ParentSylabus = lazy(()=> import('../components/parentSilabus/index'));
const ParentRapor = lazy(()=> import('../components/parentRapor/index'));
const PembelajaranPrincipal = lazy(()=> import('../components/principalPembelajaran/index'));
const LaporanPrincipal = lazy(()=> import('../components/principalLaporan/index'));
const LaporanPrincipalMurid = lazy(()=> import('../components/principalLaporan/murid'));
const LaporanKurikulum = lazy(()=> import('../components/principalLaporan/kurikulum'));
const KinerjaPrincipal = lazy(()=> import('../components/principalKpi/index'));
const EvaluasiPrincipal = lazy(()=> import('../components/principalEvaluasi/index'));
// ======= const COMPONENT RUANGAN ======== //
const LearningRuangan = lazy(()=> import('../components/learning/ruangan'));
const Ptc = lazy(()=> import('../components/ptc/index'));
const KursusNew = lazy(()=> import('../components/learning/kursus'));

export default class ClientSwitch extends React.Component {
    render() {
      return (
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/thankyou" component={ThankYou} />
          <Route path="/full-kalender" component={FullCalender} />
  
          <Route path="/zoom/callback" component={ZoomCallback} />
  
          <Route path="/murid" component={LearningMurid} />
          <Route path="/guru" component={LearningGuru} />
          <Route path="/guru-info" component={LearningGuruInfo} />
          <Route path="/webinar" component={WebinarClient} />
  
          <Route path="/ruangan" component={LearningRuangan} />
  
          <Route path="/detail-project/:project_id" component={DetailProject} />
          <Route path="/project" component={Project} />
          <Route path="/gantt/report" component={GanttReport} />
  
          <Route path="/ptc" component={Ptc} />
          <Route path="/kursus-new" component={KursusNew} />
  
          <Route path="/jadwal-mengajar" component={GuruJadwal} />
  
          <Route path="/aktivitas" component={Activity} />
  
          <Route path="/pengumuman" component={Pengumuman} />
          <Route path="/notification" component={Notification} />
  
          {/* Training */}
          <Route path="/training" exact component={Home} />
          <Route path="/training/report" exact component={TrainingReport} />
          <Route path="/training/user" exact component={TrainingUser} />
          <Route path="/training/course" exact component={TrainingCourse} />
          <Route path="/training/user/create/:level/:company" exact component={TrainingUserForm} />
          <Route path="/training/user/edit/:id" exact component={TrainingUserForm} />
          <Route path="/training/user/detail/:id" exact component={TrainingUserDetail} />
          <Route path="/training/membership" exact component={TrainingMembership} />
          <Route path="/training/membership/edit/:id" exact component={TrainingMembershipForm} />
  
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
          <Route path="/bantuan" component={ClassBantuan} />
  
          <Route path="/pengaturan" component={Pengaturan} />
          <Route path="/news" exact component={News} />
          <Route path="/news/:id" exact component={NewsView} />
  
          <Route path="/kursus" component={Kursus} />
  
          <Route path="/profile" component={Profile} />
  
          {/* ROUTE GURU */}
          <Route path='/guru/personalia' component={GuruPersonalia} />
          <Route path='/guru/kursus' component={GuruKurusus} />
          <Route path='/guru/ujian' component={GuruUjian} />
          <Route path='/guru/informasi-kelas' component={InformasiKelas} />
          <Route path='/guru/kpi' component={GuruKPI} />
          <Route path='/detail-murid' component={DetailMurid} />
          <Route path='/detail-kelas' component={DetailKelas} />
          <Route path='/detail-rapor' component={DetailRapor} />
  
  
          {/* ROUTE MURID */}
          <Route path='/rapor' component={MuridLaporanRapor} />
          <Route path="/webinar-murid" component={Webinar} />
          <Route path='/guru-laporan' component={LaporanForGuru} />
  
  
          {/* ROUTE PARENT */}
          <Route path='/parent-learning' component={LaporanPembelajaranMurid} />
          <Route path='/parent-curriculum' component={KurikulumParent} />
          <Route path='/parent-syllabus' component={ParentSylabus} />
          <Route path='/parent-rapor' component={ParentRapor} />
  
          {/* ROUTE PRINCIPAL */}
          <Route path='/principal-syllabus' component={ParentSylabus} />
          <Route path='/principal-pelajaran' component={LaporanKurikulum} />
          <Route path='/principal-rapor' component={LaporanPrincipal} />
          <Route path='/principal-rapor-murid' component={LaporanPrincipalMurid} />
          <Route path='/principal-kinerja' component={KinerjaPrincipal} />
          <Route path='/principal-evaluasi' component={EvaluasiPrincipal} />
  
          {/* ROUTE MANAGEMENT */}
          <Route path='/management-kurikulum' component={LaporanKurikulum} />
          <Route path='/management-pelajaran' component={PembelajaranPrincipal} />
          <Route path='/management-rapor' component={LaporanPrincipal} />
          <Route path='/management-rapor-murid' component={LaporanPrincipalMurid} />
          <Route path='/management-kinerja' component={KinerjaPrincipal} />
          <Route path='/management-evaluasi' component={EvaluasiPrincipal} />
  
          <Route path="/logout" component={Logout} />
        </Switch >
      );
    }
  }
  