import React, { Component } from "react";
import { Link } from "react-router-dom";
import API, { API_SERVER, USER_ME } from '../../../../repository/api';
import Storage from '../../../../repository/storage';

import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import ReactDOM from "react-dom";

import { toast } from "react-toastify";
import { Modal } from 'react-bootstrap';

import Generator from "./Generator";
import TimeLine from "react-gantt-timeline";
import "./styles.css";

const config = {
  header: {
    // Style Untuk Nama Bulan
    top: {
      style: {
        backgroundColor: '#F8F8F8',
        borderBottom: '1px solid silver',
        fontSize: 10,
        fontWeight: 'bold',
        color: 'black'
      }
    },
    // Style Untuk Nama Hari
    middle: {
      style: {
        backgroundColor: "#F8F8F8",
        fontSize: 9,
        color: 'black'
      }
    },
    // Style Untuk Tanggal
    bottom: {
      style: {
        background: "#F8F8F8",
        fontSize: 9,
        color: "black"
      },
      selectedStyle: {
        background: "#F8F8F8",
        fontWeight: "bold",
        color: "white"
      }
    }
  },
  
  // Style Untuk Title Header
  taskList: {
    title: {
      label: "Nama",
      style: {
        backgroundColor: "white",
        color: "black"
      }
    },
    task: {
      style: {
        backgroundColor: "white",
        color: "black"
      }
    },
    verticalSeparator: {
      style: {
        backgroundColor: "red",
        display:'none'
      },
      grip: {
        style: {
          backgroundColor: "red"
        }
      }
    }
  },

  // Style Untuk Row 
  dataViewPort: {
    rows: {
      style: {
        backgroundColor: "#F8F8F8",
        borderBottom: "solid 0.5px #e9e9e9"
      }
    },

    // Style Untuk Task 
    task: {
      showLabel: true,
      style: {
        borderRadius: 60,
      }
    }
  }
};

class GanttChart extends Component {
  constructor(props) {
    super(props);
    let result = Generator.generateData();
    this.data = result.data;

    this.state = {
      projectId: this.props.projectId,
      userId: Storage.get('user').data.user_id,

      itemheight: 20,
      data: [],
      links: result.links,
      
      isModalTodo: false,
      task: "",
      start: new Date(),
      end: new Date(),

      isModalDetail: false,
      taskId: "",
      taskDetail: {}
    };
  }

  closeClassModal = e => {
    this.setState({ 
      isModalTodo: false, task: "", start: new Date(), end: new Date(),
      isModalDetail: false, taskId: "", taskDetail: {}
    });
  };

  onHorizonChange = (start, end) => {
    //Return data the is in the range
    let result = this.data.filter(item => {
      return (
        (item.start < start && item.end > end) ||
        (item.start > start && item.start < end) ||
        (item.end > start && item.end < end)
      );
    });
    console.log("Calculating ");
    // this.setState({ data: result });
  };

  onSelectItem = e => {
    console.log('STATE4: ', e);
    API.get(`${API_SERVER}v2/task/id/${e.id}`).then(res => {
      if(res.data.error) toast.warning("Gagal fetch API");

      this.setState({ isModalDetail: true, taskId: e.id, taskDetail: res.data.result });
    })
  };

  onUpdateTask = (e, f) => {
    let form = {};

    if(f.hasOwnProperty('name')) {
      // update name only
      form = { name: f.name };
    } else{
      // update start & end date
      form = {
        start: this.convertDateToMysql(f.start, true), 
        end: this.convertDateToMysql(f.end, true)
      };
    }

    API.put(`${API_SERVER}v2/task/update/${e.id}`, form).then(res => {
      if(res.data.error) toast.warning("Gagal update task");
      
      let copyState = [...this.state.data];
      copyState.map((item, i) => {
        if(item.id === e.id) {
          item.name = res.data.result.name;
          item.start = res.data.result.start;
          item.end = res.data.result.end;
        }
      });

      this.setState({ data: copyState });

    });
  };

  onSubmitTask = e => {
    e.preventDefault();
    let form = {
      name: this.state.task, 
      start: this.convertDateToMysql(this.state.start), 
      end: this.convertDateToMysql(this.state.end), 
      projectId: this.state.projectId,
      userId: this.state.userId
    };
    
    API.post(`${API_SERVER}v2/task/create`, form).then(res => {
      if(res.data.error) toast.warning("Gagal membuat task");

      let copyState = [...this.state.data];
      res.data.result.color = this.getRandomColor();
      copyState.push(res.data.result);
      this.setState({ data: copyState });

      this.closeClassModal();
    })
  };

  getRandomColor() {
    var letters = "0123456789ABCDEF";
    var color = "#";
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  convertDate(date) {
    let split = date.split('-');
    return new Date(split[0], parseInt(split[1])-1, split[2]);
  }

  convertDateToMysql(date, js = false) {
    if(js) {
      let dd = new Date(date);
      return dd.getFullYear() + '-' + ("0" + (dd.getMonth() + 1)).slice(-2) + '-' + ("0" + dd.getDate()).slice(-2);
    } else {
      let split = date.split('-');
      return `${split[0]}-${parseInt(split[1])}-${split[2]}`;
    }
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData() {
    API.get(`${API_SERVER}v2/task/project/${this.state.projectId}`).then(res => {
      if(res.data.error) toast.warning("Gagal fetch API");

      for(var i=0; i<res.data.result.length; i++) {
        res.data.result[i].color = this.getRandomColor();
      }

      this.setState({ data: res.data.result, links: [] })
    })
  }

  render() {
  
    // console.log('STATE2: ', this.state.data);
    // console.log('STATE3: ', this.state.links);
    
    return (
        <div className="card p-20">
            <span className="mb-4">
                <strong className="f-w-bold f-18 fc-skyblue ">Gantt Chart</strong>
                <button
                  onClick={() => this.setState({ isModalTodo: true })}
                  className="btn btn-sm btn-icademy-primary float-right"
                  style={{ padding: "7px 8px !important", marginLeft:14 }}>
                    <i className="fa fa-plus"></i>
                    Tambah
                </button>
            </span>
            <div className="app-container">
              <div className="time-line-container">
                <TimeLine
                  data={this.state.data}
                  links={this.state.links}
                  config={config}
                  onHorizonChange={this.onHorizonChange}
                  onSelectItem={this.onSelectItem}
                  onUpdateTask={this.onUpdateTask}
                />
              </div>
            </div>

            <Modal
              show={this.state.isModalTodo}
              onHide={this.closeClassModal}>
              
              <Modal.Header closeButton>
                <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
                  Tambah Task
                </Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <form onSubmit={this.onSubmitTask} className="form-vertical">
                  <div className="form-group">
                    <input required type="text" value={this.state.task} onChange={e => this.setState({ task: e.target.value })} className="form-control" />
                  </div>
                  <div className="form-group row">
                    <div className="col-sm-6">
                      <label htmlFor="start">Start</label>
                      <input required type="date" value={this.state.start} onChange={e => this.setState({ start: e.target.value })} className="form-control" />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="start">End</label>
                      <input required type="date" value={this.state.end} onChange={e => this.setState({ end: e.target.value })} className="form-control" />
                    </div>
                  </div>
                  <div className="form-group">
                    <button type="submit" className="btn btn-block btn-v2 btn-primary">
                      <i className="fa fa-save"></i>
                      Simpan
                    </button>
                  </div>
                </form>
              </Modal.Body>
            </Modal>

            <Modal
              dialogClassName="modal-lg"
              show={this.state.isModalDetail}
              onHide={this.closeClassModal}>
              
              <Modal.Header closeButton>
                <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
                  <button style={{padding: '4px 6px'}} className="btn btn-sm btn-primary">Dikerjakan</button>

                  <i style={{border: '1px solid #e9e9e9', padding: '3px', margin: '3px 6px', borderRadius: '4px'}} className="fa fa-check"></i>
                  <i style={{border: '1px solid #e9e9e9', padding: '3px', margin: '0px 3px 0px 24px', borderRadius: '4px'}} className="fa fa-users"></i>
                </Modal.Title>
              </Modal.Header>

              <Modal.Body>
                <h3>{this.state.taskDetail.name}</h3>
                <textarea rows="4" value="Deskripsi task" className="form-control mb-3" />

                <form className="form-vertical">
                  <div className="form-group row">
                    <div className="col-sm-6">
                      <label htmlFor="startdate">Start Date</label>
                      <input type="date" className="form-control" value={this.convertDateToMysql(this.state.taskDetail.start, true)} />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="enddate">End Date</label>
                      <input type="date" className="form-control" value={this.convertDateToMysql(this.state.taskDetail.end, true)} />
                    </div>
                  </div>
                </form>

                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td width="120px">Departemen</td>
                      <td>Operations</td>
                    </tr>
                    <tr>
                      <td width="120px">Progress</td>
                      <td>
                        <progress style={{width: '100%'}} id="file" value="32" max="100">32%</progress>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="2">
                        <span style={{cursor: 'pointer'}} className="float-right">+ add or edit fields</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h4>To Do</h4>
                <h6>Subtask</h6>
                <table className="table">
                  <tbody>
                    <tr>
                      <td width="40px">
                        <input type="checkbox" />
                      </td>
                      <td>Task 1</td>
                      <td width="40px">
                        <i className="fa fa-trash"></i>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3">
                        <span style={{cursor: 'pointer'}} className="float-right">+ add checklist</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h4>Attachments</h4>
                <table className="table">
                  <tbody>
                    <tr>
                      <td width="40px">
                        <input type="checkbox" />
                      </td>
                      <td>Task 1</td>
                      <td width="80px">
                        <i className="fa fa-trash mr-3"></i>
                        <i className="fa fa-download"></i>
                      </td>
                    </tr>
                    <tr>
                      <td colSpan="3">
                        <span style={{cursor: 'pointer'}} className="float-right">+ add attachment</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

              </Modal.Body>
            </Modal>

        </div>
                    
    );
  }
}

export default GanttChart;