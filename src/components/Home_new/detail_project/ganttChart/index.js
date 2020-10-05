import React, { Component } from "react";
import { Link } from "react-router-dom";
import API, { API_SERVER, USER_ME } from '../../../../repository/api';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import ReactDOM from "react-dom";
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
      itemheight: 20,
      data: [],
      links: result.links,
      
      isModalTodo: false,
      task: "",
      start: new Date(),
      end: new Date(),
    };
  }

  closeClassModal = e => {
    this.setState({ isModalTodo: false, task: "", start: new Date(), end: new Date() });
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
  };

  onUpdateTask = (e, f) => {
    console.log('STATE5: ', e);
    console.log('STATE6: ', f);
  };

  onSubmitTask = e => {
    e.preventDefault();
    let copyState = [...this.state.data];
    let form = {
      id: copyState.length+1, 
      start: this.convertDate(this.state.start), 
      end: this.convertDate(this.state.end), 
      name: this.state.task, 
      color: this.getRandomColor()
    };
    copyState.push(form);

    this.setState({ data: copyState });
    this.closeClassModal();
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

  componentDidMount() {
    this.setState({ 
      data: [
        {id: 1, start: new Date(2020, 9, 1), end: new Date(2020, 9, 6), name: "Create Todo List", color: this.getRandomColor()},
        {id: 2, start: new Date(2020, 9, 3), end: new Date(2020, 9, 7), name: "Read Todo List", color: this.getRandomColor()},
        {id: 3, start: new Date(2020, 9, 6), end: new Date(2020, 9, 12), name: "Update Todo List", color: this.getRandomColor()},
        {id: 4, start: new Date(2020, 9, 8), end: new Date(2020, 9, 16), name: "Delete Todo List", color: this.getRandomColor()},
      ],

      links: [
      ]
    });
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

        </div>
                    
    );
  }
}

export default GanttChart;