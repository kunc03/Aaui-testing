import React, { Component } from 'react';
import { gantt } from 'dhtmlx-gantt';
import 'dhtmlx-gantt/codebase/dhtmlxgantt.css';
import './Gantt.css';
 
export default class Gantt extends Component {
    componentDidMount() {
        
        gantt.config.columns = [
            {name: "text", tree: true, width: "*", min_width: 120, resize: true},
            {name: "owner", align: "center", width: 75, label: "Owner", template: function (task) {
                if (task.type == gantt.config.types.project) {
                    return "";
                }
    
                var result = "";
                var store = gantt.getDatastore("resource");
                var owners = task[gantt.config.resource_property];
    
                if (!owners || !owners.length) {
                    return "Unassigned";
                }
    
                if(owners.length == 1){
                    return store.getItem(owners[0]).text;
                }
    
                owners.forEach(function(ownerId) {
                    var owner = store.getItem(ownerId);
                    if (!owner)
                        return;
                    result += "<div class='owner-label' title='" + owner.text + "'>" + owner.text.substr(0, 1) + "</div>";
    
                });
    
                return result;
                }, resize: true
            },
            {name: "add", width: 44}
        ];
        
        
        gantt.config.keep_grid_width = false;
        gantt.config.grid_resize = true;
        gantt.config.min_column_width = 40;
        gantt.config.smart_scales = false;
        gantt.config.scale_height = 90;
        gantt.locale.labels.section_owner = "Owner";
        gantt.locale.labels.section_period = "Time period";
        gantt.locale.labels.section_progress = "Status";
        gantt.config.resource_store = "resource";
        gantt.config.resource_property = "owner_id";
        gantt.config.order_branch = true;
        gantt.config.open_tree_initially = true;
        gantt.config.lightbox.sections = [
            {name: "description", height: 38, map_to: "text", type: "textarea", focus: true},
            // {name:"owner",height:38, type:"multiselect", options:gantt.serverList("people"), map_to:"owner_id", unassigned_value:0 },
            {name: "owner", height: 22, map_to: "owner_id", type: "select", options: gantt.serverList("people")},
            {
                name: "progress", height: 38, map_to: "progress", type: "select", options: [
                    {key: "0", label: "Open"},
                    {key: "1", label: "In Progress"},
                    {key: "2", label: "Done"},
                    {key: "3", label: "Closed"}
                ]
            },
            {name: "period", type: "time", map_to: "auto"}
        ];
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
    
        
        gantt.plugins({
            tooltip: true,
            marker: true
        });
        gantt.attachEvent("onGanttReady", function(){
            var tooltips = gantt.ext.tooltips;
            tooltips.tooltip.setViewport(gantt.$task_data);
        });
        const { tasks } = this.props;
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

	resourcesStore.parse([
		{id: 1, text: "QA", parent:null},
		{id: 2, text: "Development", parent:null},
		{id: 3, text: "Sales", parent:null},
		{id: 4, text: "Other", parent:null},
		{id: 5, text: "Unassigned", parent:4},
		{id: 6, text: "John", parent:1},
		{id: 7, text: "Mike", parent:2},
		{id: 8, text: "Anna", parent:2},
		{id: 9, text: "Bill", parent:3},
		{id: 10, text: "Floe", parent:3}
	]);
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

        gantt.init(this.ganttContainer);
        gantt.parse(tasks);
    }

    render() {
       return (
        <div className="card p-20">
        <div className="app-container">
          <div className="time-line-container">
           <div
                ref={ (input) => { this.ganttContainer = input } }
                style={ { width: '100%', height: '100%' } }
            ></div>
            </div>
        </div>
        </div>
       );
    }
}