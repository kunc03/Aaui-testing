import React, { Component } from "react";
import { Link } from "react-router-dom";
import Storage from '../../repository/storage';
import API, {API_SERVER} from '../../repository/api';


class EventNew extends Component {
  state = {
    user: {
      name: 'Anonymous',
      registered: '2019-12-09',
      companyId: '',
      dataEvent: []
    },
  }

  fetchData(){
    API.get(`${API_SERVER}v1/event/${localStorage.getItem('companyID')}`).then(response => {
      this.setState({ dataEvent: response.data.result });
    }).catch(function(error) {
      console.log(error);
    });
  }

  componentDidMount(){
    this.fetchData()
  }

  render() {
    const lists = this.props.lists;
    let access = Storage.get('access');
    let levelUser = Storage.get('user').data.level;

    let urlLearning = ''
    if ((levelUser !== 'superadmin' && access.manage_course == 1) || (levelUser === 'superadmin')){
      urlLearning = 'kursus-materi'
    }
    else{
      urlLearning = 'kursus'
    }

    let urlMeeting = ''
    if ((levelUser !== 'superadmin' && access.manage_group_meeting == 1) || (levelUser === 'superadmin')){
      urlMeeting = 'meeting'
    }
    else{
      urlMeeting = 'liveclass'
    }
    return (
      <div className="row">
        {
          lists.length == 0 ?
            <div className="col-sm-12 mb-1">
              Tidak ada
            </div>
          :
          lists.map((item, i) => (
            <div className="col-sm-12 mb-3" key={item.course_id} style={{display: 
              levelUser == 'client' && access.group_meeting == 0 && item.title == 'Meeting' ? 'none' :
              levelUser == 'client' && (access.course == 0 && access.manage_course == 0) && item.title == 'Learning' ? 'none' :
              'block'}}>
              <Link to={item.title == 'Meeting' ? urlMeeting : item.title == 'Learning' ? urlLearning : ''}>
                <div className={item.status ? 'border-blue-2 ' : 'box-disabled border-disabled'}>
                  <div className="box-event ">
                    <div className="title-head f-w-900 f-16 fc-skyblue">
                      {item.status ? item.title : ''} <small className="float-right">{item.status ? item.total : ''}</small>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        }
      </div>
    );
  }
}

export default EventNew;
