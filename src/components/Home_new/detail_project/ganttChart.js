import React, { Component } from "react";
import { Link } from "react-router-dom";
import API, { API_SERVER, USER_ME } from '../../../repository/api';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import ReactDOM from "react-dom";


import Storage from '../../../repository/storage';



class GanttChart extends Component {
  constructor(props) {
    super(props);

    // this._deleteUser = this._deleteUser.bind(this);

    this.state = {
      users: [],
      dataUser: [],
      
    };
  }

  
  render() {
    const tasks = this.props.tasks;
    const options = this.props.options;
    return (
        <div className="card p-20">
            <span className="mb-4">
                <strong className="f-w-bold f-18 fc-skyblue ">Gantt Chart</strong>
                {/* <button
                to='/user-create'
                className="btn btn-icademy-primary float-right"
                style={{ padding: "7px 8px !important" }}
                >
                <i className="fa fa-plus"></i>
                
                Add New
                </button> */}
            </span>
            {/* <GanttElastic
                tasks={tasks}
                options={options}
                style={{
                height: "100%"
                }}
            ></GanttElastic> */}
        </div>
                    
    );
  }
}

export default GanttChart;