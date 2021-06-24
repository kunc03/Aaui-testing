import React, { Component } from "react";
import CalenderNew from '../kalender/kalender';
import API, { USER_ME, API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';
import { Link } from "react-router-dom";


class Calendar extends Component {
  state = {
    kursusTerbaru:[]
  }

  fetchDataKursusTerbaru(companyId) {
    API.get(`${API_SERVER}v1/course/company/${localStorage.getItem('companyID') ? localStorage.getItem('companyID') : companyId}`).then(res => {
      if (res.status === 200) {
        this.setState({ kursusTerbaru: res.data.result.filter(item => { return item.count_chapter > 0 }).slice(0, 3) })
      }
    })
  }

  fetchDataUser() {
    API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
      if (res.status === 200) {
        this.fetchDataKursusTerbaru(
          localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id
        );

        this.setState({ user: res.data.result });
      }
    })
  }
  componentDidMount(){
    this.fetchDataUser();
  }

  render() {
    return (
        <div className="pcoded-main-container">
          <div className="pcoded-wrapper">
            <div className="pcoded-content">
              <div className="pcoded-inner-content">
                <div className="main-body">
                  <div className="page-wrapper">
                  {/* <Link to="#" onClick={() => this.props.history.goBack()} className="floating-back">
                    <img
                      src={`newasset/back-button.svg`}
                      alt=""
                      width={90}
                    ></img>
                  </Link> */}
        <div className="row">
          <div className='col-sm-12 col-xl-12' style={{ paddingLeft: 0, paddingRight: 0 }}>
            <div className="col-sm-12">
              <CalenderNew lists={this.state.kursusTerbaru} height='480px' />
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
}

export default Calendar;
