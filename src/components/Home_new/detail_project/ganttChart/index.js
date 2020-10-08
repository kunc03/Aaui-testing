import React, { Component } from "react";
import { Link } from "react-router-dom";
import API, { API_SERVER, USER_ME } from '../../../../repository/api';
import '@trendmicro/react-dropdown/dist/react-dropdown.css';
import ReactDOM from "react-dom";
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
        borderBottom: "solid 0.5px transparent"
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
      links: result.links
      
    };
  }

  onHorizonChange = (start, end) => {
    //Return data the is in the range
    let result = this.data.filter(item => {
      return (
        (item.start < start && item.end > end) ||
        (item.start > start && item.start < end) ||
        (item.end > start && item.end < end)
      );
    });
    console.log("Calculating Ghntchart", JSON.stringify(result));
    this.setState({ data: result });
  };

  render() {
  
    return (
        <div className="card p-20">
            <span className="mb-4">
                <strong className="f-w-bold f-18 fc-skyblue ">Gantt Chart</strong>
            </span>
            <div className="app-container">
              <div className="time-line-container">
                <TimeLine
                  data={this.state.data}
                  links={this.state.links}
                  config={config}
                  onHorizonChange={this.onHorizonChange}
                />
              </div>
            </div>
        </div>
                    
    );
  }
}

export default GanttChart;