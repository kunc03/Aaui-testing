import React, { Component } from "react";
import API, { API_SERVER } from '../../repository/api';
import Storage from '../../repository/storage';

import '@trendmicro/react-dropdown/dist/react-dropdown.css';

import { toast } from "react-toastify";
import { Modal } from 'react-bootstrap';
import { MultiSelect } from 'react-sm-select';
import 'react-sm-select/dist/styles.css';
import TimeLine from "react-gantt-timeline";
import { GithubPicker } from 'react-color'
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
      label: "Task",
      style: {
        backgroundColor: "white",
        color: "black",
      }
    },
    task: {
      style: {
        backgroundColor: "white",
        color: "black",
        fontSize: 11
      }
    },
    verticalSeparator: {
      style: {
        backgroundColor: "#FFF",
        display:'none'
      },
      grip: {
        style: {
          backgroundColor: "#cfcfcd"
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
      showLabel: false,
      style: {
        borderRadius: 60,
        padding:'0px 5px',
        lineHeight:'25px',
        fontSize: 11
      }
    }
  }
};

class GanttChart extends Component {
  constructor(props) {
    super(props);
    let result = {
      data: [],
      links: []
    };
    this.data = result.data;

    this.state = {
      optionsAssigne: [],
      valueAssigne: [],

      projectId: this.props.projectId,
      userId: Storage.get('user').data.user_id,

      itemheight: 20,
      data: [],
      links: result.links,

      isModalTodo: false,
      task: "",
      description: "",
      start: new Date(),
      end: new Date(),
      status: "",
      islock: 0,
      color: '',
      assigne: [],
      subtasks: [],
      attachments: [],

      max: 100,
      val: 0,

      statusTask: ["Open","In Progress","Done","Closed"],

      isModalDetail: false,
      modalDeleteTask: false,
      taskId: "",
      file: "",
      taskDetail: {},
      tagInput: false,
      displayColorPicker: false,
      colorPick: '#CCC',
      tags:[],
      tags_label: 'Untagged',
      tags_color: '#CCC'
    };
  }

  pickColor = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  };
  closePickColor = () => {
    this.setState({ displayColorPicker: false })
  };

  changeColor = (color) => {
    this.setState({ colorPick: color.hex })
    this.closePickColor()
  };


  modalDeleteTask(){
    this.setState({modalDeleteTask: true})
  }

  closeModalDelete = e => {
    this.setState({
      modalDeleteTask: false,
    });
  };

  closeClassModal = e => {
    this.setState({
      isModalTodo: false, task: "", start: new Date(), end: new Date(),
      isModalDetail: false, taskId: "", taskDetail: {}, max: 100, val: 0,
      valueAssigne: [], file: "", status: "", assigne: [], subtask: [], attachments: [],
      tagInput: false
    });
    this.fetchData()
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
    this.fetchDetailTask(e.id);
  };

  deleteTask(){
    API.delete(`${API_SERVER}v2/task/delete/${this.state.taskId}`).then(res => {
      if(res.status === 200) {
        if(res.data.error) {
          toast.error(`Gagal menghapus task`)
        } else {
          toast.success(`Berhasil menghapus task`)
          this.closeModalDelete()
          this.closeClassModal()
        }
      }
    })
  }

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

      if (res.data.result==='locked'){
        toast.error('Tidak dapat mengubah task karena task terkunci')
      }
      else{
        let copyState = [...this.state.data];
        copyState.map((item, i) => {
          if(item.id === e.id) {
            item.name = res.data.result.name;
            item.start = res.data.result.start;
            item.end = res.data.result.end;
          }
        });

        this.setState({ data: copyState });
      }

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
      res.data.result.color = '#bbbbbb';
      copyState.push(res.data.result);
      this.setState({ data: copyState });

      this.closeClassModal();
    })
  };

  removeAttachment = e => {
    e.preventDefault();
    let taskId = e.target.getAttribute('data-taskid');
    let id = e.target.getAttribute('data-id');
    API.delete(`${API_SERVER}v2/task/attachments/${id}`).then(res => {
      if(res.data.error) toast.warning("Gagal hapus attachment");

      this.fetchDetailTask(taskId);
    })
  }

  saveAssigne = e => {
    this.setState({ valueAssigne: e });

    API.delete(`${API_SERVER}v2/task/delete-all/${this.state.taskId}`).then(res => {
      if(res.data.error) toast.warning("Gagal menghapus assigne");

      for(var i=0; i<e.length; i++) {
        API.post(`${API_SERVER}v2/task/assigne`, {taskId: this.state.taskId, userId: e[i]});
      }
    })
  }

  // START ATTACHMENT
  addAttachment = e => {
    e.preventDefault();
    let cp = [...this.state.attachments];
    cp.push({file: ""});
    this.setState({ attachments: cp });
  }

  saveAttachment = e => {
    e.preventDefault();
    let form = new FormData();
    for(var i=0; i<this.state.file.length; i++) {
      form.append('files', this.state.file[i]);
    }
    form.append('taskId', this.state.taskId);

    API.post(`${API_SERVER}v2/task/attachments`, form).then(res => {
      if(res.data.error) toast.warning("Gagal simpan attachment");

      this.fetchDetailTask(this.state.taskId);
    })
  }

  deleteAttachment = e => {
    e.preventDefault();
    let id = e.target.getAttribute('data-id');
    API.delete(`${API_SERVER}v2/task/attachments/${id}`).then(res => {
      if(res.data.error) toast.warning("Gagal menghapus attachment");

      this.fetchDetailTask(this.state.taskId);
    })
  }
  // END ATTACHMENT

  // START SUBTASK
  addSubtask = e => {
    e.preventDefault();
    let cp = [...this.state.subtasks];
    cp.push({title: ""});
    this.setState({ subtasks: cp });
  }

  saveSubtask = e => {
    e.preventDefault();
    if(e.key === "Enter") {
      let form = {
        taskId: this.state.taskId,
        title: e.target.value
      };
      API.post(`${API_SERVER}v2/task/subtask`, form).then(res => {
        if(res.data.error) toast.warning("Gagal create subtask");

        this.fetchDetailTask(form.taskId);
      });
    }
  }

  fetchTags(){
    API.get(`${API_SERVER}v2/project/tags/${this.state.projectId}`).then(res => {
      if(res.data.error) toast.warning("Gagal fetch API");
      this.setState({tags: res.data.result})
    })
  }

  saveTags = e => {
    e.preventDefault();
    if(e.key === "Enter") {
      let form = {
        project_id: this.state.projectId,
        color: this.state.colorPick,
        label: e.target.value
      }
      API.post(`${API_SERVER}v2/project/tags/`, form).then(res => {
        if(res.data.error) toast.warning("Gagal fetch API");
        this.fetchTags()
      })
    }
  }

  setTags(tags_id){
      let form = {
        tags_id: tags_id,
        task_id: this.state.taskId
      }
      API.put(`${API_SERVER}v2/project/set-tags/`, form).then(res => {
        if(res.data.error) toast.warning("Gagal fetch API");
        this.fetchDetailTask(this.state.taskId)
        this.setState({tagInput: false})
      })
  }

  deleteSubtask = e => {
    e.preventDefault();
    let id = e.target.getAttribute('data-id');
    API.delete(`${API_SERVER}v2/task/subtask/${id}`).then(res => {
      if(res.data.error) toast.warning("Gagal hapus subtask");

      this.fetchDetailTask(this.state.taskId);
    })
  }

  doneSubtask = e => {
    e.preventDefault();
    let id = e.target.getAttribute('data-id');
    let status = e.target.getAttribute('data-status');
    let form = {
      title: e.target.getAttribute('data-title'),
      status: status == 1 ? 2 : 1
    };

    API.put(`${API_SERVER}v2/task/subtask/${id}`, form).then(res => {
      if(res.data.error) toast.warning("Gagal update data");

      this.fetchDetailTask(this.state.taskId);
    })
  }
  // END SUBTASK

  simpanStatusTask = e => {
    e.preventDefault();
    this.setState({ status: e.target.value });
    this.updateTaskById(e);
  }

  simpanDeskripsi = e => {
    e.preventDefault();
    // if(e.key === "Enter" && e.shiftKey) {
      this.updateTaskById(e);
    // }
  }
  changeDate = e => {
    if (e.target.name === 'start'){
      this.setState({ start: e.target.value }, function () {
        this.simpanDate();
      })
    }
    else{
      this.setState({ end: e.target.value }, function () {
        this.simpanDate();
      })
    }
  }
  simpanDate = e => {
    let form = {};

      // update start & end date
      form = {
        start: this.convertDateToMysql(this.state.start, true),
        end: this.convertDateToMysql(this.state.end, true)
      };

    API.put(`${API_SERVER}v2/task/update/${this.state.taskId}`, form).then(res => {
      if(res.data.error) toast.warning("Gagal update task");

      let copyState = [...this.state.data];
      copyState.map((item, i) => {
        if(item.id === this.state.taskId) {
          item.name = res.data.result.name;
          item.start = res.data.result.start;
          item.end = res.data.result.end;
        }
      });
      toast.success("Task berhasil di update");

      this.setState({ data: copyState });

    });
  };

  updateTaskById(e) {
    let form = {
      name: this.state.taskDetail.name
    };

    if(e.target.name == 'description') {
      form.description = e.target.value;
    } else {
      form.description = this.state.description;
    }

    if(e.target.name == 'status') {
      form.status = e.target.value;
    } else {
      form.status = this.state.status;
    }

    API.put(`${API_SERVER}v2/task/update/${this.state.taskId}`, form).then(res => {
      if(res.data.error) toast.warning("Gagal update task");

      toast.success("Task berhasil di update");
      this.fetchDetailTask(this.state.taskId);
    })
  }

  lockTask(id, lock) {
    API.put(`${API_SERVER}v2/task/lock/${id}`, {lock}).then(res => {
      if(res.data.error) toast.warning("Gagal fetch API");
      this.fetchDetailTask(id)
    })
  }
  fetchDetailTask(id) {
    API.get(`${API_SERVER}v2/task/id/${id}`).then(res => {
      if(res.data.error) toast.warning("Gagal fetch API");

      let assignePush = [];
      res.data.result.assigne.map(item => assignePush.push(item.user_id))

      this.setState({
        isModalDetail: true,
        taskId: id,
        description: res.data.result.description,
        start: this.convertDateToMysql(res.data.result.start, true),
        end: this.convertDateToMysql(res.data.result.end, true),
        status: res.data.result.status,
        islock: res.data.result.is_lock,
        assigne: assignePush,
        valueAssigne: assignePush,
        subtasks: res.data.result.subtasks,
        attachments: res.data.result.attachments,
        taskDetail: res.data.result,
        color: res.data.result.status === null ? '#bbbbbb' :
              res.data.result.status === 'Open' ? '#000000' :
              res.data.result.status === 'In Progress' ? '#F7B500' :
              res.data.result.status === 'Done' ? '#6DD400' :
              '#32C5FF',

        max: res.data.result.subtasks.length,
        val: res.data.result.subtasks.filter(item => item.status == 2).length,
        tags_color: res.data.result.tags_color ? res.data.result.tags_color : '#CCC',
        tags_label: res.data.result.tags_label ? res.data.result.tags_label : 'Untagged'
      });
      this.fetchTags()
    })
  }

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
        // res.data.result[i].color = this.getRandomColor();
        if (res.data.result[i].status === null) {
          res.data.result[i].color = '#bbbbbb'
        }
        else if (res.data.result[i].status === 'Open') {
          res.data.result[i].color = '#000000'
        }
        else if (res.data.result[i].status === 'In Progress') {
          res.data.result[i].color = '#F7B500'
        }
        else if (res.data.result[i].status === 'Done') {
          res.data.result[i].color = '#6DD400'
        }
        else if (res.data.result[i].status === 'Closed') {
          res.data.result[i].color = '#32C5FF'
        }

        // res.data.result[i].color = res.data.result[i].tags_color ? res.data.result[i].tags_color : res.data.result[i].color;

        // if (new Date(res.data.result[i].end) <= new Date()){
        //   res.data.result[i].border = '1px solid #F00'
        // }
      }

      this.setState({ data: res.data.result, links: [] })
    })

    API.get(`${API_SERVER}v2/project/user/${this.state.projectId}`).then(response => {
      this.setState({optionsAssigne: []})
      response.data.result.map(item => {
        this.state.optionsAssigne.push({value: item.user_id, label: item.name});
      });
    })
  }

  render() {

    return (
        <div className="card p-20">
            <span className="mb-4">
                <strong className="f-w-bold f-18 fc-skyblue ">Timeline Chart</strong>
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
                  itemheight={30}
                  data={this.state.data}
                  links={this.state.links}
                  config={config}
                  onHorizonChange={this.onHorizonChange}
                  onSelectItem={this.onSelectItem}
                  onUpdateTask={this.onUpdateTask}
                  mode='month'
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
                      Save
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
                <Modal.Title className="text-c-purple3 f-w-bold mr-3" style={{color:'#00478C'}}>
                  <button disabled={this.props.access_project_admin ? false : true} onClick={this.lockTask.bind(this, this.state.taskId, this.state.islock ? 0 : 1)} style={{padding: '9.5px 15px'}} className="btn btn-sm btn-primary" style={{border:'none', backgroundColor: this.state.islock ? '#d13939' : '#9b9b9b'}}><i className={this.state.islock ? 'fa fa-lock' : 'fa fa-lock-open'}></i> {this.state.islock ? 'Locked' : "Unlocked"}</button>
                </Modal.Title>
                <Modal.Title className="text-c-purple3 f-w-bold mr-3" style={{color:'#00478C'}}>
                  <button style={{padding: '9.5px 15px'}} className="btn btn-sm btn-primary" style={{border:'none', backgroundColor: this.state.color}}>{this.state.status && this.state.status !== 'null' ? this.state.status : "Status Task"}</button>
                </Modal.Title>

                <div style={{width: '80%'}}>
                  <MultiSelect
                    id="assigne"
                    options={this.state.optionsAssigne}
                    value={this.state.valueAssigne}
                    onChange={this.saveAssigne}
                    mode="tags"
                    removableTags={true}
                    hasSelectAll={true}
                    selectAllLabel="Pilih Semua"
                    enableSearch={true}
                    resetable={true}
                    valuePlaceholder="Assign User"
                    />
                </div>
              </Modal.Header>

              <Modal.Body>
                <h3>{this.state.taskDetail.name}</h3>

                <textarea rows="4" defaultValue={""}
                  name="description"
                  value={this.state.description !== 'null' ? this.state.description : ''}
                  placeholder="Isi deskripsi task..."
                  onChange={e => this.setState({ description: e.target.value })}
                  onBlur={this.simpanDeskripsi} className="form-control mb-3" />

                <div>
                  <button onClick={()=> this.setState({tagInput: !this.state.tagInput})} style={{padding: '9.5px 15px'}} className="btn btn-sm btn-primary" style={{border:'none', backgroundColor: this.state.tags_color}}>{this.state.tags_label}</button>
                  {
                    this.state.tagInput &&
                    <div className='tags-wraper'>
                      {
                        this.state.tags && this.state.tags.map(item=>
                          <div className='tags-row' onClick={this.setTags.bind(this, item.id)}>
                            <div className='tags-color' style={{backgroundColor: item.color}}></div>
                            <div className='tags-label'>{item.label}</div>
                          </div>
                        )
                      }
                      <div className='tags-row'>
                        <div>
                        <div className='tags-color' onClick={this.pickColor} style={{backgroundColor: this.state.colorPick}}></div>
                        { this.state.displayColorPicker ?
                        <div className='color-popover'>
                          <div className='color-cover' onClick={ this.closePickColor }/>
                          <GithubPicker color={this.state.colorPick} onChange={ this.changeColor } />
                        </div> : null
                        }
                        </div>
                        <div className='tags-label'>
                          <input type="text" className='tags-input' name='newTags' placeholder="Add new" onKeyUp={this.saveTags} />
                        </div>
                      </div>
                    </div>
                  }
                </div>
                {/* <span className="mb-4">Gunakan <code>Shift + Enter</code> untuk menyimpan perubahan.</span> */}

                <form className="form-vertical mt-4">
                  <div className="form-group row">
                    <div className="col-sm-6">
                      <label htmlFor="startdate">Start Date</label>
                      <input type="date" disabled={this.state.islock ? true : false}  name="start" onChange={this.changeDate} className="form-control" value={this.state.start} />
                    </div>
                    <div className="col-sm-6">
                      <label htmlFor="enddate">End Date</label>
                      <input type="date" disabled={this.state.islock ? true : false}  name="end" onChange={this.changeDate} className="form-control" value={this.state.end} />
                    </div>
                  </div>
                </form>

                <table className="table table-bordered">
                  <tbody>
                    <tr>
                      <td width="120px">Status</td>
                      <td>
                        <select name="status" style={{ width: "100%" }} onChange={this.simpanStatusTask} value={this.state.status}>
                          <option value="" disabled selected>status task</option>
                          {
                            this.state.statusTask.map(item => (
                              <option value={item}>{item}</option>
                            ))
                          }
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td width="120px">Progress</td>
                      <td>
                        <progress style={{width: '100%'}} id="file" value={this.state.val} max={this.state.max}>{this.state.val}</progress>
                      </td>
                    </tr>
                    {/* <tr>
                      <td colSpan="2">
                        <span style={{cursor: 'pointer'}} className="float-right">+ add or edit fields</span>
                      </td>
                    </tr> */}
                  </tbody>
                </table>

                <h4>Subtasks</h4>
                <span className="mb-4">Gunakan <code>Enter</code> untuk menyimpan perubahan.</span>
                <table className="table">
                  <tbody>
                    {
                      this.state.subtasks.map((item, i) => (
                        <tr key={item.id}>
                          <td width="40px">
                            <input
                              checked={item.status == 2 ? true : false}
                              onClick={this.doneSubtask}
                              data-id={item.id}
                              data-title={item.title}
                              data-status={item.status}
                              style={{ cursor: 'pointer'}} type="checkbox" />
                          </td>
                          <td style={item.status == 2 ? {textDecoration: 'line-through'} : {}}>
                          {
                            item.title ? item.title : <input onKeyUp={this.saveSubtask} type="text" className="form-control" />
                          }
                          </td>
                          <td width="40px">
                            <i style={{cursor: 'pointer'}} onClick={this.deleteSubtask} data-id={item.id} className="fa fa-trash"></i>
                          </td>
                        </tr>
                      ))
                    }
                    <tr>
                      <td colSpan="3">
                        <span onClick={this.addSubtask} style={{cursor: 'pointer', display: this.state.islock ? 'none' : 'block'}} className="float-right">+ add subtask</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <h4>Attachments</h4>
                <table className="table">
                  <tbody id="tblAttachments">
                    {
                      this.state.attachments.map((item, i) => (
                        <tr key={item.id}>
                          <td width="40px">{i+1}</td>
                          <td>
                          {
                            item.file ? item.file.split('/')[item.file.split('/').length-1] :
                            <div className="form-group">
                              <input multiple type="file" onChange={e => this.setState({ file: e.target.files })} />
                              <i onClick={this.saveAttachment} className="fa fa-save float-right" style={{cursor: 'pointer'}}></i>
                            </div>
                          }
                          </td>
                          <td width="80px">
                            <a href={item.file} target="_blank"><i className="fa fa-download mr-3"></i></a>
                            <i onClick={this.removeAttachment} data-taskid={this.state.taskDetail.id} data-id={item.id} className="fa fa-trash"></i>
                          </td>
                        </tr>
                      ))
                    }
                    <tr>
                      <td colSpan="3">
                        <span onClick={this.addAttachment} style={{cursor: 'pointer', display: this.state.islock ? 'none' : 'block'}} className="float-right">+ add attachment</span>
                      </td>
                    </tr>
                  </tbody>
                </table>

              </Modal.Body>
              <Modal.Footer>
                {
                  this.props.access_project_admin &&
                  <button
                          className="btn btn-icademy-primary btn-icademy-red"
                          onClick={this.modalDeleteTask.bind(this)}
                        >
                          <i className="fa fa-trash"></i>
                          Hapus
                  </button>
                }
              </Modal.Footer>
            </Modal>

        <Modal
          show={this.state.modalDeleteTask}
          onHide={this.closeModalDelete}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title className="text-c-purple3 f-w-bold" style={{color:'#00478C'}}>
            Konfirmasi Hapus Task
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>Anda yakin akan menghapus task ini ?</div>
          </Modal.Body>
          <Modal.Footer>
                      <button
                        className="btn btm-icademy-primary btn-icademy-grey"
                        onClick={this.closeModalDelete.bind(this)}
                      >
                        Batal
                      </button>
                      <button
                        className="btn btn-icademy-primary btn-icademy-red"
                        onClick={this.deleteTask.bind(this)}
                      >
                        <i className="fa fa-trash"></i>
                        Hapus
                      </button>
          </Modal.Footer>
        </Modal>
        </div>

    );
  }
}

export default GanttChart;
