import React, {Component} from "react";
import { BrowserRouter as Router, Redirect, Switch, Route } from "react-router-dom";

/**
 * New Code For Import Component
 */
import {
  Header,
  SideBar,
  Loader,
  Home,
  Pengaturan,
  Profile,
  Users,
  UserAdd,
  UserEdit,
  UserCabang,
  UserGroup,
  LoginVoucher,
  Login,
  Logout
} from './components'

/**
 * Old Code
 */
// import Header from "./components/Header_sidebar/Header";
// import Sidebar from "./components/Header_sidebar/Sidebar";
// import Loader from "./components/Header_sidebar/Loader";
// import Home from "./components/Home/index";
// import Pengaturan from "./components/Pengaturan/index";
// import Profile from "./components/Profile/index";
// import User from "./components/Users/User/index";
// import UserAdd from "./components/Users/User/add";
// import Cabang from "./components/Users/UserCabang/index";
// import Grup from "./components/Users/UserGroup/index";
// import Login from "./components/Login/index";

export var router = [
  {	path: '/home', 						      component: Home},
  {	path: '/profile', 						  component: Profile},
  {	path: '/setting', 						  component: Pengaturan},
  {	path: '/users', 						    component: Users},
  {	path: '/user-update', 				  component: UserEdit},
  {	path: '/user-create', 				  component: UserAdd},
  {	path: '/user-cabang', 				  component: UserCabang},
  {	path: '/user-group', 						component: UserGroup},
  {	path: '/logout', 						    component: Logout},
];


let userInfo = localStorage.getItem("user");
const PrivateRoute = ({component: Component, ...rest}) => {
	return (
		<Route
			{...rest}
			render={props => 
				userInfo !== null ?
					(<Component {...props}/>)
					:
					(<Redirect to={{
						pathname: '/login',
						state: {from: props.location}
					}}/>)
			}
		/>
	)
}

export class App extends Component {
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

export default App;