import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css?v=7.0.13';
// import 'dhtmlx-gantt/codebase/skins/dhtmlxgantt_material.css?v=7.0.10';
import './Gantt.css';
import API, { API_SERVER } from '../../repository/api';
import equal from 'fast-deep-equal';
import Storage from '../../repository/storage';
import {Modal} from 'react-bootstrap';
import moment from 'moment-timezone';
 
export default class Gantt extends Component {
    constructor(props) {
      super(props);
  
      this.state = {
        users:[],
        companies:[],
        countOpen: 0,
        countProgress: 0,
        countDone: 0,
        countClosed: 0,
        zoomLevel: 1,
        startDate: null,
        endDate: null,
        statusOpen: true,
        statusProgress: true,
        statusDone: true,
        statusClosed: true,
        modalHistory: false,
        history: [],
        // tasks: {
        //     tasks : [],
        //     links : []
        // }
      };
      this.fetchGanttData = this.fetchGanttData.bind(this)
      this.renderGantt = this.renderGantt.bind(this)
    }

    closeModalHistory = e => {
        this.setState({modalHistory: false})
    }

    renderGantt(){
        var editors = {
            text: {type: "text", map_to: "text"},
            start_date: {type: "date", map_to: "start_date", min: new Date(2020, 1, 1), max: new Date(2030, 30, 12)},
		    owner: {type: "select", map_to: "owner_id", options:gantt.serverList("people")}
        };
        function byId(list, id) {
            for (var i = 0; i < list.length; i++) {
                if (list[i].key == id)
                    return list[i].label || "";
            }
            return "";
        }
        // gantt.templates.leftside_text=function(start,end,task){
        //     return byId(gantt.serverList('people'), task.owner_id);
        // };
        gantt.templates.rightside_text=function(start,end,task){
            if (end) {
                if (new Date() > end.valueOf() && task.status != 'Done' && task.status != 'Closed') {
                    var overdue = Math.ceil(Math.abs((new Date() - end.getTime()) / (24 * 60 * 60 * 1000)));
                    var text = "<b>Overdue: " + overdue + " days</b>";
                    return task.text+" - "+text;
                }
                else{
                    return task.text;
                }
            }
        };
        function hashCode(str) {
            var hash = 0;
            for (var i = 0; i < str.length; i++) {
               hash = str.charCodeAt(i) + ((hash << 5) - hash);
            }
            return hash;
        } 
        
        function intToRGB(i){
            var c = (i & 0x00FFFFFF)
                .toString(16)
                .toUpperCase();
        
            return "00000".substring(0, 6 - c.length) + c;
        }
        var companies = this.state.companies;
        gantt.templates.leftside_text=function(start,end,task){
            if (task.company != '' && task.company != null && task.company != 'undefined') {
                var selectedCompany = companies.filter((item) => item.key == task.company)[0].label;
                var company = "<b style='color: #"+intToRGB(hashCode(selectedCompany))+"'>"+selectedCompany+"</b>";
                return company
            }
        };
        gantt.templates.task_text=function(start,end,task){
            return "";
        };
        gantt.templates.progress_text=function(start,end,task){
            let done = '';
            if (task.status==='Done'){
                done = task.done_time !== null ? ' - Done : '+moment.tz(task.done_time, moment.tz.guess(true)).format("DD/MM/YYYY HH:mm") : '';
            }
            return Math.round(task.progress*100)+"%"+done;
        };
        gantt.config.columns = [
            {
                name: "overdue", label: "", width: 38, template: function (obj) {
                    if (obj.end_date) {
                        var deadline = gantt.date.parseDate(obj.end_date, "xml_date");
                        if (deadline && new Date() > deadline && obj.status!='Done' && obj.status!='Closed' && obj.type!='project') {
                            return '<div class="overdue-indicator">!</div>';
                        }
                        else if (obj.status==='Done'){
                            return '<div class="done-indicator">&check;</div>';
                        }
                    }
                    return '<div></div>';
                }
            },
            {name: "text", tree: true, width: "*", min_width: 120, editor: editors.text, resize: true},
            {name: "owner", width: 60, align: "center", label: "Assignee", editor: editors.owner, template: function (item) {
                    if (!item.owner_id)
                        return;
                    var result = "<div class='owner-label' title='" + byId(gantt.serverList('people'), item.owner_id) + "'>" + byId(gantt.serverList('people'), item.owner_id).substr(0, 1) + "</div>";
                    return result}},
            {name: "add", width: 44}
        ];
        
	gantt.attachEvent("onTaskCreated", function(task){
		if(task.type == gantt.config.types.placeholder){
			task.text = "Create a new task";
		}
		return true;
    });
    // var statusOpen = this.state.statusOpen;
    // var statusProgress = this.state.statusProgress;
    // var statusDone = this.state.statusDone;
    // var statusClosed = this.state.statusClosed;
    // gantt.attachEvent("onBeforeTaskDisplay", function(id, task){
    //     console.log('ALVIN OPEN', ( statusOpen && task.type !== 'project' && (task.status === "Open" || task.status === "")))
    //     if ( statusOpen && task.type !== 'project' && (task.status === "Open" || task.status === "")){
    //         return true;
    //     }
    //     // else if ( statusProgress && task.type !== 'project' && task.status === "In Progress"){
    //     //     return true;
    //     // }
    //     // else if ( statusDone && task.type !== 'project' && task.status === "Done"){
    //     //     return true;
    //     // }
    //     // else if ( statusClosed && task.type !== 'project' && task.status === "Closed"){
    //     //     return true;
    //     // }
    //     return false;
    // });
    let editable = this.props.access_project_admin;
    let taskType = '';
    gantt.attachEvent("onBeforeLightbox", function(id){
        var task = gantt.getTask(id);
        taskType = task.type;
        if (editable === false && task.lock_data === 'Locked'){
            for (let i = 0; i < 9; i++){
                gantt.getLightboxSection("period").node.children[i].disabled = true;
            }
            gantt.getLightboxSection("owner").node.children[0].disabled = true;
            gantt.getLightboxSection("visibility").node.children[0].disabled = true;
            gantt.getLightboxSection("company").node.children[0].disabled = true;
        }
        gantt.getLightboxSection("lock_data").node.children[0].disabled = !editable;
        return true;
    });
    gantt.attachEvent("onAfterLightbox", function (){
        if (taskType !== 'project' && taskType !== 'milestone'){
            for (let i = 0; i < 9; i++){
                gantt.getLightboxSection("period").node.children[i].disabled = false;
            }
            gantt.getLightboxSection("owner").node.children[0].disabled = false;
            gantt.getLightboxSection("visibility").node.children[0].disabled = false;
            gantt.getLightboxSection("company").node.children[0].disabled = false;
            gantt.getLightboxSection("lock_data").node.children[0].disabled = false;
        }
    });
    gantt.attachEvent("onBeforeTaskDrag", function(id, mode, e){
        if (mode === 'resize' || mode === 'move' || mode === 'ignore'){
            var task = gantt.getTask(id);
            return editable || task.lock_data === 'Unlocked';
        }
        else{
            return true;
        }
    })
    gantt.attachEvent("onLightboxSave", function(id, task, is_new){
        if (task.status==='Done'){
            task.progress=1;
        }
        let d = task.end_date
        let time = d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds();
        if (time === '0:0:0'){
            let new_end_date = d.setHours(23, 0, 0);
            task.end_date = new Date(new_end_date);
        }
        return true;
    })
    gantt.attachEvent("onAfterTaskDrag", function(id, mode, e){
        if (mode === 'progress'){
            if (gantt.getTask(id).progress === 1){
                gantt.getTask(id).status = 'Done';
                gantt.getTask(id).done_time = new Date();
                gantt.updateTask(id);
            }
            else if (gantt.getTask(id).progress !== 1){
                gantt.getTask(id).status = 'In Progress';
                gantt.updateTask(id);
            }
        }
        
        else if (mode === 'resize' || mode === 'move'){
            let d = gantt.getTask(id).end_date;
            d = new Date(d.setDate(d.getDate()-1));
            gantt.getTask(id).end_date = new Date(d.setHours(23,0,0));
            gantt.updateTask(id);
        }
        return;
    });
    gantt.attachEvent("onAfterTaskUpdate", function(id,item){
		if (item.parent == 0) {
			return;
		}
		
		var parentTask = gantt.getTask(item.parent); //console.log(parent.id);return;
		
		var childs = gantt.getChildren(parentTask.id);
		var totProgress = 0;
		
		var tempTask;
		for (var i = 0; i < childs.length; i++) { //console.log(childs[i]);
			tempTask = gantt.getTask(childs[i]);
			totProgress += parseFloat(tempTask.progress);
		}
		//console.log(totProgress);
		
		parentTask.progress = (totProgress / childs.length).toFixed(2);
		gantt.updateTask(parentTask.id);
	});

	gantt.ext.inlineEditors.attachEvent("onSave", function(state){
		var col = state.columnName;
		if(gantt.autoSchedule && (col == "start_date" || col == "end_date" || col == "duration")){
			gantt.autoSchedule();
		}
    });
    
	gantt.plugins({
		multiselect: true,
		auto_scheduling: true,
		quick_info: true,
		keyboard_navigation: true
    });

    gantt.templates.task_class  = function(start, end, task){
        switch (task.status){
            case "Open":
                return "open";
                break;
            case "In Progress":
                return "progress";
                break;
            case "Done":
                return "done";
                break;
            case "Closed":
                return "closed";
                break;
            default:
                return "open"
        }
    };

    // custom lightbox
    // var taskId = null;
 
    // gantt.showLightbox = function(id) {
    //     taskId = id;
    //     var task = gantt.getTask(id);
    
    //     var form = getForm();
    //     var input = form.querySelector("[name='description']");
    //     input.focus();
    //     input.value = task.text;
    
    //     form.style.display = "block";
    
    //     form.querySelector("[name='save']").onclick = save;
    //     form.querySelector("[name='close']").onclick = cancel;
    //     form.querySelector("[name='delete']").onclick = remove;
    // };
    
    // gantt.hideLightbox = function(){
    //     getForm().style.display = "";
    //     taskId = null;
    // }
    
    
    // function getForm() {
    //     return document.getElementById("my-form");
    // };
    
    // function save() {
    //     var task = gantt.getTask(taskId);
    
    //     task.text = getForm().querySelector("[name='description']").value;
    
    //     if(task.$new){
    //         delete task.$new;
    //         gantt.addTask(task,task.parent);
    //     }else{
    //         gantt.updateTask(task.id);
    //     }
    
    //     gantt.hideLightbox();
    // }
    
    // function cancel() {
    //     var task = gantt.getTask(taskId);
    //     if(typeof task.$new != 'undefined')
    //     gantt.deleteTask(task.id);
    //     gantt.hideLightbox();
    // }
    
    // function remove() {
    //     gantt.deleteTask(taskId);
    //     gantt.hideLightbox();
    // }
    gantt.config.drag_project = true;
    gantt.config.initial_scroll = false
    gantt.config.scroll_size = 12;
    gantt.config.min_grid_column_width = 200;
	gantt.config.sort = true;  
	gantt.config.keyboard_navigation_cells = true;
	gantt.config.auto_scheduling = true;
	gantt.config.auto_scheduling_strict = true;
	gantt.config.show_unscheduled = true;
	gantt.config.placeholder_task = true;
	gantt.config.auto_types = true;
	gantt.config.row_height = 28;
        gantt.config.min_column_width = 40;
        gantt.config.smart_scales = false;
        gantt.config.scale_height = 90;
        gantt.locale.labels.section_owner = "Assignee";
        gantt.locale.labels.section_description = "Task";
        gantt.locale.labels.section_detail = "Description";
        gantt.locale.labels.section_company = "Company";
        gantt.locale.labels.section_period = "Time period";
        gantt.locale.labels.section_status = "Status";
        gantt.locale.labels.section_visibility = "Visibility";
        gantt.locale.labels.section_lock_data = "Lock Data";
        gantt.locale.labels["logs_button"] = "History";
        gantt.config.resource_store = "resource";
        gantt.config.resource_property = "owner_id";
        gantt.config.order_branch = "marker";
        gantt.config.order_branch_free = true;
        gantt.config.open_tree_initially = true;
        gantt.config.lightbox.sections = [
            {name: "description", height: 38, map_to: "text", type: "textarea", focus: true},
            {name: "detail", height: 100, map_to: "description", type: "textarea"},
            {name: "owner", height: 38, map_to: "owner_id", type: "select", options: gantt.serverList("people"), unassigned_value:0},
            {
                name: "status", height: 38, map_to: "status", type: "select", options: [
                    {key: "Open", label: "Open"},
                    {key: "In Progress", label: "In Progress"},
                    {key: "Done", label: "Done"},
                    {key: "Closed", label: "Closed"}
                ]
            },
            {
                name:"company", height:38, map_to:"company",type:"select",
                options: this.state.companies
            },
            {name: "period", type: "time", map_to: "auto", time_format:["%d","%m","%Y","%H:%i"]},
            {
                name: "visibility", height: 38, map_to: "visibility", type: "select", options: [
                    {key: "Public", label: "Public"},
                    {key: "Private", label: "Private"}
                ]
            },
            {
                name: "lock_data", height: 38, map_to: "lock_data", type: "select", options: [
                    {key: "Unlocked", label: "Unlocked"},
                    {key: "Locked", label: "Locked"}
                ]
            }
        ];
        gantt.config.lightbox.project_sections = [
            {name: "description", height: 38, map_to: "text", type: "textarea", focus: true},
            {name: "type", height: 38, map_to: "text", type: "text"},
            {name: "period", type: "time", map_to: "auto", time_format:["%d","%m","%Y","%H:%i"]},
            {
                name: "lock_data", height: 38, map_to: "lock_data", type: "select", options: [
                    {key: "Unlocked", label: "Unlocked"},
                    {key: "Locked", label: "Locked"}
                ]
            }
        ];
        gantt.config.lightbox.milestone_sections = [
            {name: "description", height: 38, map_to: "text", type: "textarea", focus: true},
            {name: "type", height: 38, map_to: "text", type: "text"},
            {name: "period", type: "time", map_to: "auto", time_format:["%d","%m","%Y","%H:%i"]},
            {
                name: "lock_data", height: 38, map_to: "lock_data", type: "select", options: [
                    {key: "Unlocked", label: "Unlocked"},
                    {key: "Locked", label: "Locked"}
                ]
            }
        ];
        gantt.templates.time_picker = function(date){
            return gantt.date.date_to_str(gantt.config.time_picker)(date);
        };
        var weekScaleTemplate = function (date) {
            var dateToStr = gantt.date.date_to_str("%d %M");
            var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
            return dateToStr(date) + " - " + dateToStr(endDate);
        };
        var daysStyle = function(date){
            if(date.getDay() === 0 || date.getDay() === 6){
                return "weekend";
            }
            return "";
        };
        gantt.config.scales = [
            {unit: "month", step: 1, format: "%F, %Y"},
            {unit: "week", step: 1, format: weekScaleTemplate},
            {unit: "day", step:1, format: "%d", css:daysStyle }
        ];
    
	var hourToStr = gantt.date.date_to_str("%H:%i");
	var hourRangeFormat = function(step){
		return function(date){
			var intervalEnd = new Date(gantt.date.add(date, step, "hour") - 1)
			return hourToStr(date) + " - " + hourToStr(intervalEnd);
		};
	};
	var zoomConfig = {
		minColumnWidth: 40,
        maxColumnWidth: 100,
        activeLevelIndex: 1,
		levels: [
			[
				{ unit: "year", format: "%Y", step: 1},
				{ unit: "month", format: "%M", step: 1}
			],
            [
                {unit: "month", step: 1, format: "%F, %Y"},
                {unit: "week", step: 1, format: weekScaleTemplate},
                {unit: "day", step:1, format: "%d", css:daysStyle }
            ],
			[
				{ unit: "month", format: "%M %Y", step: 1},
				{ unit: "day", format: "%d", step: 1}
			],
			[
				{ unit: "day", format: "%d %M", step: 1},
				{ unit: "hour", format: hourRangeFormat(12), step: 12}
			],
			[
				{unit: "day", format: "%d %M",step: 1},
				{unit: "hour",format: hourRangeFormat(6),step: 6}
			],
			[
				{ unit: "day", format: "%d %M", step: 1 },
				{ unit: "hour", format: "%H:%i", step: 1}
			]
		],
		useKey: "ctrlKey",
		trigger: "wheel",
		element: function(){
			return gantt.$root.querySelector(".gantt_task");
		}
	}

	gantt.ext.zoom.init(zoomConfig);
        
        gantt.plugins({
            tooltip: true,
            marker: true
        });
        gantt.attachEvent("onGanttReady", function(){
            var tooltips = gantt.ext.tooltips;
            tooltips.tooltip.setViewport(gantt.$task_data);
            gantt.config.buttons_left = ["gantt_save_btn","gantt_cancel_btn","logs_button"];   
            gantt.config.buttons_right = ["gantt_delete_btn"];
        });
        gantt.attachEvent("onLightboxButton", function(button_id, node, e){
            if(button_id == "logs_button"){
                var id = gantt.getState().lightbox;
                this.getHistory(id)
            }
        }.bind(this));
        const { tasks } = this.state;
        // today
        
        var dateToStr = gantt.date.date_to_str(gantt.config.task_date);
        var today = new Date();
        gantt.addMarker({
            start_date: today,
            css: "today",
            text: "Today",
            title: "Today: " + dateToStr(today)
        });
        
	var resourcesStore = gantt.createDatastore({
		name: gantt.config.resource_store,
		type: "treeDatastore",
		initItem: function (item) {
			item.parent = item.parent || gantt.config.root_id;
			item[gantt.config.resource_property] = item.parent;
			item.open = true;
			return item;
		}
    });
    
	resourcesStore.attachEvent("onParse", function(){
		var people = [];
		resourcesStore.eachItem(function(res){
			if(!resourcesStore.hasChild(res.id)){
				var copy = gantt.copy(res);
				copy.key = res.id;
				copy.label = res.text;
				people.push(copy);
			}
		});
		gantt.updateCollection("people", people);
	});

    resourcesStore.parse(this.state.users);

        gantt.init(this.ganttContainer);
        let api =
        this.props.userId && this.props.projectId ?
            `${API_SERVER}v2/gantt-user/${this.props.projectId}/${this.props.userId}/${this.props.visibility}`
        :
        this.props.userId && !this.props.projectId ?
            `${API_SERVER}v2/gantt-user/0/${this.props.userId}/${this.props.visibility}`
        :
        `${API_SERVER}v2/gantt/${this.props.projectId}/${this.props.visibility}`;
        gantt.load(api)
        var dp = new gantt.dataProcessor(`${API_SERVER}v2/gantt/${Storage.get("user").data.user_id}/${this.props.projectId ? this.props.projectId : '0'}`);
        dp.init(gantt);
        dp.setTransactionMode("REST");

        
		gantt.sort("start_date", true);
        gantt.showDate(new Date())
    }

    countTaskStatus(){
        let api =
        this.props.userId && this.props.projectId ?
            `${API_SERVER}v2/gantt-user/${this.props.projectId}/${this.props.userId}/${this.props.visibility}`
        :
        this.props.userId && !this.props.projectId ?
            `${API_SERVER}v2/gantt-user/0/${this.props.userId}/${this.props.visibility}`
        :
        `${API_SERVER}v2/gantt/${this.props.projectId}/${this.props.visibility}`;
        API.get(api).then(res => {
            if(res.data.error) console.log('Gagal fetch data task di project');
            this.setState({
              countOpen: res.data.tasks.filter((item) => (item.type === 'task' || item.type === '' || item.type === null) && (item.status === 'Open' || item.status === '' || item.status === null)).length,
              countProgress: res.data.tasks.filter((item) => (item.type === 'task' || item.type === '') && item.status === 'In Progress').length,
              countDone: res.data.tasks.filter((item) => (item.type === 'task' || item.type === '') && item.status === 'Done').length,
              countClosed: res.data.tasks.filter((item) => (item.type === 'task' || item.type === '') && item.status === 'Closed').length,
            })
        })
    }

    fetchGanttData(){
        let by = this.props.userId ? 'gantt-user' : 'gantt';
        let val = this.props.userId ? this.props.userId : this.props.projectId;
        API.get(`${API_SERVER}v2/project/${by}/user/${val}`).then(res => {
            if(res.data.error) console.log('Gagal fetch data user di project');
            this.setState({users: res.data.result}, () => {
                this.state.users.unshift({id: '', text: ''});
                API.get(`${API_SERVER}v2/project/${by}/company/${val}`).then(res => {
                    if(res.data.error) console.log('Gagal fetch data company di project');
                    this.setState({companies: res.data.result}, () => {
                        this.state.companies.unshift({id: '', text: ''});
                        this.renderGantt();
                        this.countTaskStatus();
                    })
                })
            })
        })
    }
    componentDidMount() {
        this.fetchGanttData()
    }

    componentDidUpdate(prevProps) {
        if((this.props.projectId && !equal(this.props.projectId, prevProps.projectId)) || ((this.props.userId && !equal(this.props.userId, prevProps.userId))) || ((this.props.visibility && !equal(this.props.visibility, prevProps.visibility))))
        {
            gantt.clearAll()
            this.fetchGanttData();
        }
    } 

    collapseAll(){
        gantt.eachTask(function(task){
          task.$open = false;
        });
        gantt.render();
    }
    expandAll(){
        gantt.eachTask(function(task){
          task.$open = true;
        });
        gantt.render();
    }

    zoomIn(){
        gantt.ext.zoom.zoomOut();
        this.setState({zoomLevel: gantt.ext.zoom.getCurrentLevel()})
    }
    zoomOut(){
        gantt.ext.zoom.zoomIn();
        this.setState({zoomLevel: gantt.ext.zoom.getCurrentLevel()})
    }

    zoomLevel = e => {
        gantt.ext.zoom.setLevel(e.target.value);
        this.setState({zoomLevel: gantt.ext.zoom.getCurrentLevel()})
    }

    changeDate = e => {
      if (e.target.name === 'startDate'){
        this.setState({ startDate: e.target.value }, function () {
            if (this.state.startDate && this.state.endDate){
                gantt.config.start_date = this.state.startDate;
                gantt.config.end_date = this.state.endDate;
                gantt.render()
            }
        })
      }
      else{
        this.setState({ endDate: e.target.value }, function () {
            if (this.state.startDate && this.state.endDate){
                gantt.config.start_date = this.state.startDate;
                gantt.config.end_date = this.state.endDate;
                gantt.render()
            }
        })
      }
    }

    getHistory(id){        
        API.get(`${API_SERVER}v2/gantt-history/${id}`).then(res => {
            if (res.status === 200) {
                this.setState({
                    history: res.data.result,
                    modalHistory: true
                })
                gantt.hideLightbox();
            }
        })
    }

    // filterOpen(){
    //     this.setState({statusOpen: !this.state.statusOpen}, function() {
    //         gantt.refreshData();
    //         this.renderGantt();
    //     })
    // }

    render() {
       return (
        <div className="card p-20" style={{width:'100%'}}>
        <div className="app-container">
          <div className="time-line-container">
          <div className="m-t-10 m-b-10" style={{alignSelf:'flex-start'}}>
            <span>
                <span className="p-r-5" style={{ color: '#f0e66e' }}>
                <i className="fa fa-square"></i>
                </span>
                Main Task
            </span>
            {/* <span className="gantt-status-legend" style={{textDecoration : this.state.statusOpen ? 'inherit' : 'line-through'}} onClick={this.filterOpen.bind(this)}> */}
            <span className="gantt-status-legend">
                <span className="p-r-5" style={{ color: '#3185ED', marginLeft:15 }}>
                <i className="fa fa-square"></i>
                </span>
                Open ({this.state.countOpen})
            </span>
            <span className="gantt-status-legend">
                <span className="p-r-5" style={{ color: '#ff7800', marginLeft:15 }}>
                <i className="fa fa-square"></i>
                </span>
                In Progress ({this.state.countProgress})
            </span>
            <span className="gantt-status-legend">
                <span className="p-r-5" style={{ color: '#67cb48', marginLeft:15 }}>
                <i className="fa fa-square"></i>
                </span>
                Done ({this.state.countDone})
            </span>
            <span className="gantt-status-legend">
                <span className="p-r-5" style={{ color: '#c0c0c0', marginLeft:15 }}>
                <i className="fa fa-square"></i>
                </span>
                Closed ({this.state.countClosed})
            </span>
          </div>
          <div className="toolbar row">
              <div className="toolbar-left col-sm-12">
                <input type="button" value="Expand All" onClick={this.expandAll.bind(this)} />
                <input type="button" value="Collapse All" onClick={this.collapseAll.bind(this)} />

                <input type="button" value="Go to Today" onClick={()=> gantt.showDate(new Date())} />
                
                <input type="button" value="Zoom In" onClick={this.zoomIn.bind(this)} />
                <input type="button" value="Zoom Out" onClick={this.zoomOut.bind(this)} />

                <input type="radio" id="scale1" className="gantt_radio" name="scale" value="0" onClick={this.zoomLevel} checked={this.state.zoomLevel === 0} />
                <label for="scale1">Month</label>

                <input type="radio" id="scale2" className="gantt_radio" name="scale" value="1" onClick={this.zoomLevel} checked={this.state.zoomLevel === 1} />
                <label for="scale2">Week</label>

                <input type="radio" id="scale3" className="gantt_radio" name="scale" value="2" onClick={this.zoomLevel} checked={this.state.zoomLevel === 2} />
                <label for="scale3">Day</label>

                <input type="radio" id="scale4" className="gantt_radio" name="scale" value="3" onClick={this.zoomLevel} checked={this.state.zoomLevel === 3} />
                <label for="scale4">12 Hours</label>

                <input type="radio" id="scale5" className="gantt_radio" name="scale" value="4" onClick={this.zoomLevel} checked={this.state.zoomLevel === 4} />
                <label for="scale5">6 Hours</label>

                <input type="radio" id="scale6" class="gantt_radio" name="scale" value="5" onClick={this.zoomLevel} checked={this.state.zoomLevel === 5} />
                <label for="scale6">Hour</label>

                <input type="date" name="startDate" value={this.state.startDate} onChange={this.changeDate} />
                <label for="startdate">To</label>
                <input type="date" name="endDate" value={this.state.endDate} onChange={this.changeDate} />
              </div>
          </div>
           <div
                ref={ (input) => { this.ganttContainer = input } }
                style={ { width: '100%', height: '100%' } }
            ></div>
            {/* <div id="my-form" style={{display:'none'}}>
                <label for="description">Task text
                    <input type="text" name="description" />
                </label>
                <br/>
                <input type="button" name="save" value="Save"/>
                <input type="button" name="close" value="Close"/>
                <input type="button" name="delete" value="Delete"/>
            </div> */}
            </div>    
        <Modal show={this.state.modalHistory} onHide={this.closeModalHistory} dialogClassName='modal-lg'>
            <Modal.Header closeButton>
                <Modal.Title className="text-c-purple3 f-w-bold" style={{color: '#00478C'}}>
                    History
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    {
                        this.state.history.map(item =>
                            <div>
                                <div>{moment.tz(item.time, moment.tz.guess(true)).format("DD-MM-YYYY HH:mm")} - {item.description} by {item.name}</div>
                            </div>    
                        )
                    }
                </div>
            </Modal.Body>
        </Modal>
        </div>
        </div>
       );
    }
}