import React, { Component } from "react";
import { Link } from "react-router-dom";
import Storage from '../../repository/storage';


class ProjekNew extends Component {
  state = {
    user: {
      name: 'Anonymous',
      registered: '2019-12-09',
      companyId: '',
    },
  }


  render() {
  //  console.log(this.props, 'props evenntttt')
    const lists = this.props.lists;
    return (
      <div className="row">
        {
          lists.map((item, i) => (
            <div className="col-sm-12 mb-1" key={item.course_id}>
              <Link to="">
                <div className="p-10" style={{borderBottom: '1px solid #E6E6E6'}}>
                  <div className="box-project">
                    <div className=" f-w-800 f-16 fc-black">
                      {item.title} 
                      <span className="float-right">
                        <span className={item.meeting === 0 ? "project-info-disabled" : "project-info"}>{item.meeting} Meeting</span>
                        <span className={item.webinar === 0 ? "project-info-disabled" : "project-info"}>{item.webinar} Webinar</span>
                      </span>
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

export default ProjekNew;
