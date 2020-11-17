import React, { Component } from "react";
import { Link } from "react-router-dom";
import Storage from '../../repository/storage';


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
    const lists = this.props.lists;
    let access = Storage.get('access');
    let levelUser = Storage.get('user').data.level;

    let urlLearning = ''
    if ((levelUser !== 'superadmin' && access.manage_course == 1) || (levelUser === 'superadmin')){
      // urlLearning = 'kursus-materi'
      urlLearning = (levelUser === "client" && Storage.get('user').data.grup_name.toLowerCase() === "guru") ? 'kursus-new' : 'learning'
    }
    else{
      urlLearning = 'kursus'
    }

    let urlMeeting = ''
    if ((levelUser !== 'superadmin' && access.manage_group_meeting == 1) || (levelUser === 'superadmin')){
      urlMeeting = 'meeting'
    }
    else{
      urlMeeting = 'meeting'
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
              <Link to={item.title == 'Meeting' ? urlMeeting : item.title == 'Learning' ? urlLearning : 'webinars'}>
                <div className={item.status ? 'border-blue-2 ' : 'box-disabled border-disabled'}>
                  <div className="box-event ">
                    <div className="title-head f-w-900 f-16 fc-skyblue">
                    <img
                      src={item.status ? `${item.title === 'Meeting' ? 'newasset/video-conference.svg' : item.title === 'Learning' ? 'newasset/book 2.svg' : 'newasset/webinar.svg'}` : ''}
                      alt=""
                      width={22}
                    ></img> &nbsp; {item.status ? item.title : ''} <small className="float-right">{item.status ? item.total : ''}</small>
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
