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
import Profile from "../components/Profile/index";
import FullCalender from "../components/kalender/fullKalender"
import News from "../components/news/index";
import NewsView from "../components/news/view";

// Dashboard New Home Detail
import DetailProject from "../components/detail_project/index";

import GanttReport from "../components/Gantt/report"

import Project from "../components/project/index";
import Meeting from "../components/meeting";
import TrainingReport from "../components/training/report";
import TrainingUser from "../components/training/user";
import TrainingCourse from "../components/training/course";
import TrainingMembership from "../components/training/membership";
import TrainingMembershipForm from "../components/training/membership/form";
import TrainingUserForm from "../components/training/user/form";
import TrainingUserDetail from "../components/training/user/detail";
import MeetingRoom from "../components/liveclass/meetingRoom";
import Webinar from "../components/webinar";

import Kursus from "../components/Kursus";
import WebinarClient from '../components/client/webinar/index';

import LearningGuru from '../components/learning/guru';
import LearningGuruInfo from '../components/learning/guruinfo';
import LearningMurid from '../components/learning/murid';

// ======= IMPORT COMPONENT GURU ======== //
import GuruPersonalia from '../components/guruPersonalia/index';
import GuruKurusus from '../components/guruKursus/index';
import GuruUjian from '../components/guruUjian/index';
import GuruJadwal from '../components/jadwal_mengajar/guru';
import InformasiKelas from '../components/guruInformasiKelas/index';
import GuruKPI from '../components/guruKPI/index';
import DetailMurid from '../components/detail_murid/index';
import DetailKelas from '../components/detail_kelas/index';
import DetailRapor from '../components/detail_rapor/index';
import LaporanForGuru from '../components/laporan/laporanguru';


// ======= IMPORT COMPONENT MURID ======== //
import MuridLaporanRapor from '../components/muridLaporanRapor/index';

// ======= IMPORT COMPONENT PARENT ======== //
import LaporanPembelajaranMurid from '../components/parentLearning/index';
import KurikulumParent from '../components/parentLearning/kurikulum';
import ParentSylabus from '../components/parentSilabus/index';
import ParentRapor from '../components/parentRapor/index';


import PembelajaranPrincipal from '../components/principalPembelajaran/index';
import LaporanPrincipal from '../components/principalLaporan/index';
import LaporanPrincipalMurid from '../components/principalLaporan/murid';
import LaporanKurikulum from '../components/principalLaporan/kurikulum';
import KinerjaPrincipal from '../components/principalKpi/index';
import EvaluasiPrincipal from '../components/principalEvaluasi/index';

// ======= IMPORT COMPONENT RUANGAN ======== //
import LearningRuangan from '../components/learning/ruangan';

import Ptc from '../components/ptc/index';
import KursusNew from '../components/learning/kursus';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default class ClientSwitch extends React.Component {
    render() {
      return (
        <Switch>
          <Route path="/" exact component={Home} />
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
  