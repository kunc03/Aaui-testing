import React, { Component } from "react";
import { Link } from "react-router-dom";
import Storage from '../../repository/storage';
import Tooltip from '@material-ui/core/Tooltip';


class EventNew extends Component {
  state = {
    user: {
      name: 'Anonymous',
      registered: '2019-12-09',
      companyId: '',
      dataEvent: []
    },
  }

  // fetchData(){
  //   API.get(`${USER_ME}${Storage.get('user').data.email}`).then(res => {
  //     if (res.status === 200) {
  //       this.setState({ companyId: localStorage.getItem('companyID') ? localStorage.getItem('companyID') : res.data.result.company_id });
  //       toast.warning(this.state.companyId)
  //       API.get(`${API_SERVER}v1/event/${this.state.companyId}`).then(response => {
  //         this.setState({ dataEvent: response.data.result });
  //       }).catch(function(error) {
  //         console.log(error);
  //       });
  //     }
  //   })
  // }

  // componentDidMount(){
  //   this.fetchData()
  // }

  render() {
    let companyType = Storage.get('user').data.company_type;

    const listEvents = this.props.lists;
    const lists = companyType === "pendidikan" ? listEvents.filter(item => item.title === "Learning") : listEvents;

    let access = Storage.get('access');
    let levelUser = Storage.get('user').data.level;

    let urlLearning = ''
    if ((levelUser !== 'superadmin' && access.manage_course == 1) || (levelUser === 'superadmin')) {
      // urlLearning = 'kursus-materi'
      urlLearning = 'learning';
    } else if(levelUser === "admin") {
      urlLearning = "learning";
    } else {
      urlLearning = 'kursus-new';
      // urlLearning = 'Courses';
    }

    let urlMeeting = ''
    if ((levelUser !== 'superadmin' && access.manage_group_meeting == 1) || (levelUser === 'superadmin')) {
      urlMeeting = 'meeting'
    }
    else {
      urlMeeting = 'meeting'
    }
    return (
      <div className="row">
        {
          listEvents.length == 0 ?
            <div className="col-sm-6 mt-4">
              There is no available event
            </div>
            :
            listEvents.map((item, i) => {
              let url = '#';
              function checkURL(param){
                switch (param){
                  case 'Meeting' : return urlMeeting;
                  case 'Learning' : return urlLearning;
                  case 'Webinar' : return 'webinars';
                  case 'Training' : return 'training';
                  default : return '#';
                }
              }
              if (item.status === false){
                url = '#';
              }
              else{
                url = checkURL(item.title)
              }
              return(
              <div className="col-sm-6 mt-4" key={item.course_id} style={{
                display:
                  levelUser == 'client' && access.group_meeting == 0 && item.title == 'Meeting' ? 'none' :
                    levelUser == 'client' && (access.course == 0 && access.manage_course == 0) && item.title == 'Learning' ? 'none' :
                      'block'
              }}>
                <Link to={url}>
                  <div className={`box-event-${item.title.toLowerCase()}`}>
                    {item.status === false && <Tooltip title="This event is not available" arrow placement="top"><div className="event-disabled"/></Tooltip>}
                    <div className="box-event ">
                      <div className="d-flex justify-content-center">
                          <img
                            src={`newasset/${item.title.toLowerCase()}-new.svg`}
                            alt=""
                            height={50}
                          ></img>
                      </div>
                      <div className="d-flex justify-content-center">
                          <div className={`title-head f-w-900 f-16 color-event-${item.title.toLowerCase()}`} style={{lineHeight:'42px'}}>
                            {item.title}
                          </div>
                      </div>
                        <small className={`float-right color-event-${item.title.toLowerCase()}`} style={{fontSize:'16px', paddingRight:14}}>{item.total}</small>
                    </div>
                  </div>
                </Link>
              </div>
              )
            })
        }
      </div>
    );
  }
}

export default EventNew;
