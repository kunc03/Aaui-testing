import React, { lazy, Suspense } from "react";
import './actions/i18n';

import { Switch, Route, Redirect } from "react-router-dom";

import API, { API_SERVER, API_SOCKET } from './repository/api';
import Storage from './repository/storage';

import io from 'socket.io-client';

import Header from "./components/Header_sidebar/Header";
import Sidebar from "./components/Header_sidebar/Sidebar";
import Loader from "./components/Header_sidebar/Loader";

//gantt public
import Login from "./components/Login/index";

import ForgotPassword from './components/forgotPassword';
import OTP from './components/OTP';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'react-sm-select/dist/styles.css';

import SocketContext from './socket';
const socket = io(`${API_SOCKET}`);
socket.on("connect", () => {
  console.log("Loading App");
});
const ClientSwitch = lazy(()=> import("./routes/client"));
const AdminSwitch = lazy(()=> import("./routes/admin"));
const SuperAdminSwitch = lazy(()=> import("./routes/superadmin"));

const MeetingRoomPublic = lazy(()=> import("./components/liveclass/meetingRoomPublic"));
const GanttPublic = lazy(()=> import("./components/Gantt/GanttPublic"));
const MobileMeeting = lazy(()=> import("./components/liveclass/mobileMeeting"));
const WebinarLivePublic = lazy(()=> import("./components/client/webinar/livePublic"));
const ThankYou = lazy(()=> import("./components/public/thankyou"));
const MeetingRoom = lazy(() => import("./components/liveclass/meetingRoom"));

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
      <Suspense fallback="loading">{workSpace}</Suspense>
    );
  }
}

export class PublicContent extends React.Component {
  render() {
    return (
      <div>
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
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/meeting/:roomid" exact component={MeetingRoomPublic} />
          <Route path="/gantt/:companyId/:projectId/:userId" exact component={GanttPublic} />
          <Route path="/webinar-guest/:webinarId/:voucher" exact component={WebinarLivePublic} />
          <Route path="/mobile-meeting/:url+" exact component={MobileMeeting} />
          <Route path="/redirect/:url+" exact component={RedirectPage} />
          <Route path="/meeting-room/:roomid" exact component={RedirectPageMeeting} />
          <Route path='/forgot-password' component={ForgotPassword} />
          <Route path='/OTP/:id' component={OTP} />
          <Route path='/reset-password/:id/:key' component={Login} />
          <Route path="/thankyou" exact component={ThankYou} />
          <Route component={Login} />
        </Switch>
      </div>
    );
  }
}

export class RedirectPage extends React.Component {
  render() {
    let userInfo = localStorage.getItem("user");
    if (userInfo) {
      return <Redirect to={'/' + this.props.match.params.url} />
    }
    else {
      return <Login redirectUrl={'/' + this.props.match.params.url} />
    }
  }
}

export class RedirectPageMeeting extends React.Component {
  render() {
    let userInfo = localStorage.getItem("user");
    if (!userInfo) {
      return <Login redirectUrl={'/meeting-room/' + this.props.match.params.roomid} />
    }
    else{
      return <Route path="/meeting-room/:roomid" component={MeetingRoom} />
    }
  }
}

export class Main extends React.Component {
  state = {
    level: Storage.get('user').data.level
  }

  render() {
    let workSpaceSwitch = null;
    if (this.state.level === 'superadmin') {
      workSpaceSwitch = <SuperAdminSwitch />;
    } else if (this.state.level === 'admin') {
      workSpaceSwitch = <AdminSwitch />;
    } else {
      workSpaceSwitch = <ClientSwitch />;
    }

    return (
      <SocketContext.Provider value={socket}>
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
      </SocketContext.Provider>
    );
  }
}
