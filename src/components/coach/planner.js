import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import LeftSidebar from './left-sidebar';
import RightSidebar from './right-sidebar';
import PlannerBarPrograms from './planner-bar-programs';
import PlannerBarGraph from './planner-bar-graph';
import { getPlannerBySlug, getProgramSessions, plannerAddProgram, plannerUpdateProgram, getProgramsGraphDetail, updatePlannerProgramSessions, duplicateProgram, removeProgram, getSessionDescriptionById } from '../../utils/api.js';
import loading from "../../assets/loading.svg";
import sessionPrintIcon from '../../assets/print-icon.png';
import programGraphIcon from '../../assets/icon-graph1.png';
import programSaveIcon from '../../assets/icon-save.png';
import plannerAssignmentIcon from '../../assets/icon-3.png';
import { render } from 'react-dom';
import {selectedPopulateSession,showStrengthSession, showAddSession, showSessionDescription, viewSessions, editSessionTime, ShowEditProgram, loadProgram, showPlannerAssignment } from '../../actions';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
//import * as API from '../../utils/api.js';
import $ from 'jquery';

const monthNamesShort = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
let weekSessionDrag = '', weekSessionDrag1 = '', monthSessionDrag = '', monthSessionDrag1 = '';
function cm_weekly_options(calendar_no){
	if ($('#' + calendar_no + ' .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-bg tr td:nth-child(1) .cm-week-options').length === 0){
        $('#' + calendar_no + ' .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-bg tr td:nth-child(1)').append('<div class="cm-week-options"><div class="hover-stip-panel"><a href="" class="cm-copy-week-sessions" data-calendar="' + calendar_no + '" data-copyweek="yes" title="Drag this week sessions"><i class="fa fa-arrows" aria-hidden="true"></i></a><a href="" class="cm-delt-week-sessions" data-calendar="' + calendar_no + '" title="Delete this week sessions"><i class="fa fa-trash" aria-hidden="true"></i></a></div></div>');
		let weekSessionEl = document.getElementById(calendar_no);
		if(weekSessionEl !== null){
			if(calendar_no === "calendar"){
				if(weekSessionDrag !== ''){
					weekSessionDrag.destroy();
				}
				weekSessionDrag = new Draggable(weekSessionEl, {
					itemSelector: ".cm-copy-week-sessions",
					eventData: function (eventEl) {
						return {
							id: eventEl.getAttribute("data-calendar"),
							create: false
						};
					}
				});
			}
			else{
				if(weekSessionDrag1 !== ''){
					weekSessionDrag1.destroy();
				}
				weekSessionDrag1 = new Draggable(weekSessionEl, {
					itemSelector: ".cm-copy-week-sessions",
					eventData: function (eventEl) {
						return {
							id: eventEl.getAttribute("data-calendar"),
							create: false
						};
					}
				});
			}
		}
	}
}

function add_month_drag_for_calendar(calendar_no) {
	if ($('#' + calendar_no + ' .fc-toolbar .copy-month-sessions').length === 0) {
		$('#' + calendar_no + ' .fc-toolbar').prepend('<a href="" class="copy-month-sessions" data-calendar="' + calendar_no + '" data-copymonth="yes" title="Drag current month all weeks sessions"><i class="fa fa-arrows" aria-hidden="true"></i></a>');
		let monthSessionEl = document.getElementById(calendar_no);
		if(monthSessionEl !== null){
			if(calendar_no === "calendar"){
				if(monthSessionDrag !== ''){
					monthSessionDrag.destroy();
				}
				monthSessionDrag = new Draggable(monthSessionEl, {
					itemSelector: ".copy-month-sessions",
					eventData: function (eventEl) {
						return {
							id: eventEl.getAttribute("data-calendar"),
							create: false
						};
					}
				});
			}
			else{
				if(monthSessionDrag1 !== ''){
					monthSessionDrag1.destroy();
				}
				monthSessionDrag1 = new Draggable(monthSessionEl, {
					itemSelector: ".copy-month-sessions",
					eventData: function (eventEl) {
						return {
							id: eventEl.getAttribute("data-calendar"),
							create: false
						};
					}
				});
			}
		}
	}
}

class Planner extends Component {
	constructor(props) {
		super(props);
		this.state = {
			calendarNo: 1,
			leftSidebarDisplay: true,
			rightSidebarDisplay: true,
			club: '',
			planner: '',
			plannerBar: '',
			plannerBarShow: true,
			plannerBarShowGraph: false,
			plannerBarGraphType: 'time',
			weeksContWidth: 0,
			plannerBarPosition: { x: 0, y: 0 },
			graphBarPosition: { x: 0, y: 0 },
			programs: null,
			plannerProgram: { programId: '', startDate: new Date() },
			
			programSessions: [],
			selectedSSessions: [],
			saveProgramSessions: [],
			addProgramSessions: [],
			splitProgram: { programId: '', startDate: new Date(), title: '' },
			programSessionsRight: [],
			saveProgramSessionsRight: [],
			addProgramSessionsRight: [],
			loading: true,
			programDrag: {layer: '', startDate: ''},
			plannerGraphData: {maxVal: 0, programArr: []},
			programMenu: {show: false, x: 0, y: 0, id: ''},
			duplicateProgram: {programId: '', title: ''}
		}
		this.calendarRef = React.createRef();
		this.calendarRef1 = React.createRef();
		this.plannerBarCont = React.createRef();
		this.graphBarCont = React.createRef();
		this.graph_weekbar_html = [];
		this.handlePlannerDrag = this.handlePlannerDrag.bind(this);
		this.handleGraphDrag = this.handleGraphDrag.bind(this);
		this.selectPlannerProgram = this.selectPlannerProgram.bind(this);
		this.leftSidebarChange = this.leftSidebarChange.bind(this);
		this.rightSidebarChange = this.rightSidebarChange.bind(this);
		this.closeProgramMenu = this.closeProgramMenu.bind(this);
		this.plannerSplitDisplay = this.plannerSplitDisplay.bind(this);
		this.deleteWeekSessions = this.deleteWeekSessions.bind(this); 
		this.handleSelectedSession = this.handleSelectedSession.bind(this);  

	}

	componentDidMount() {
		window.addEventListener('click', this.closeProgramMenu);
		getPlannerBySlug(this.props.plannerSlug, this.props.clubSlug, this.props.user._id)
			.then(result => {
				if (result.club === null) {
					this.setState({ club: null });
				}
				else if (result.planner === null) {
					this.setState({ planner: null });
				}
				else {
					this.setPlannerData(result, false);
					$('body').on("click", "#calendar button.fc-prev-button, button.fc-next-button", function(){ cm_weekly_options('calendar'); });
					$('body').on("click", "#calendar1 button.fc-prev-button, button.fc-next-button", function(){ cm_weekly_options('calendar1'); });
					$("#calendar .fc-today-button").click(function(){ cm_weekly_options('calendar'); });
					$("#calendar1 .fc-today-button").click(function(){ cm_weekly_options('calendar1'); });
					$('body').on("click", "#calendar .cm-delt-week-sessions", (e) => this.deleteWeekSessions(e));
					$('body').on("click", "#calendar1 .cm-delt-week-sessions", (e) => this.deleteWeekSessions(e));
					$(document).on("click", ".fc-widget-content td", (e) => this.handleSelectedSession(e));		
				}
			});
				// var highligh = [];
				// $(document).on('click','.fc-widget-content td',function(){ 
				// 	handleSelectedSession($(this));
					
				// });
	}
	
	componentDidUpdate(prevProps, prevState) {
		//if(prevState.programSessions !== this.state.programSessions){
			setTimeout(function(){
				cm_weekly_options('calendar');
				cm_weekly_options('calendar1');
				add_month_drag_for_calendar('calendar');
				add_month_drag_for_calendar('calendar1');
			}, 100);
			//cm_weekly_summary();
		//}
	}
	
	componentWillUnmount(){
		window.removeEventListener('click', this.closeProgramMenu);
	}
	
	UNSAFE_componentWillReceiveProps(nextProps) {
		
		if (nextProps.selectedProgramId) {
			getProgramSessions(nextProps.selectedProgramId)
			.then(result => {
				if (result.success === true) {
					this.setSplitProgram(nextProps.selectedProgramId, result, true);
				}
				else {	
					alert(result.msg);
				}
			});
		}
		if (nextProps.sessData) {
			let addProgramSessions = [...this.state.addProgramSessions];
			let saveProgramSessions = [...this.state.saveProgramSessions];
			let sessData = nextProps.sessData;
			
			let calendarApi = this.calendarRef.current.getApi();
			let evt = calendarApi.getEventById(sessData.eventId);
			let ddate = ("0" + evt.start.getDate()).slice(-2);
			let dmonth = ("0" + (evt.start.getMonth() + 1)).slice(-2);
			let dhours = ("0" + sessData.str_session_hours).slice(-2);
			let dmins = ("0" + sessData.str_session_minuts).slice(-2);
			
			evt.setExtendedProp('sessionTime', (sessData.str_session_hours * 60) + sessData.str_session_minuts);
			evt.setExtendedProp('sessionURL', sessData.session_url);
			let start = evt.start.getFullYear()+'-'+dmonth+'-04'+'T'+dhours+':'+dmins+':00Z';
			//evt.setProp('start', new Date(2020, 3, 4));
			//evt.setStart('2020-03-05');
			//evt.start.hours(sessData.str_session_hours);
			//evt.start.minutes(sessData.str_session_minuts);
			//console.log(evt);
			//console.log(sessData.eventId);
			
			for(let i = 0; i < addProgramSessions.length; i++){
				if(sessData.eventId === addProgramSessions[i]._id){
					addProgramSessions[i].sessionTime = (sessData.str_session_hours * 60) + sessData.str_session_minuts;
					addProgramSessions[i].sessionURL = sessData.session_url;
				}
			}
			for(let i = 0; i < saveProgramSessions.length; i++){
				if(sessData.id_session === saveProgramSessions[i]._id){
					saveProgramSessions[i].sessionTime = (sessData.str_session_hours * 60) + sessData.str_session_minuts;
					saveProgramSessions[i].sessionURL = sessData.session_url;
				}
			}
			this.setState({ saveProgramSessions, addProgramSessions });
		}
		if(nextProps.selected_populated_session){
			let programSessions = [...this.state.programSessions];
			let addProgramSessions = [...this.state.addProgramSessions];
			let sSessions=this.state.selectedSSessions;
			let sessiondata=nextProps.selected_populated_session;
			let programDate = this.state.plannerProgram.startDate+' 00:00:00';
			for(let i = 0; i <sSessions.length; i++){
			 var obj = {};
			 let val=sSessions[i]+' 00:00:00'
			
			 let daysDiff = 0;

			 var msDiff = new Date(val).getTime() - new Date(programDate).getTime();
			 if(msDiff > 0)
			 	 daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));
			 obj["title"] = sessiondata.title;
			 obj["start"] = val;
			 obj["durationEditable"] = false;
			 obj["startEditable"] = true;
			 obj["extendedProps"] = { 
				 sessAssId:sessiondata._id,
				sessionId:sessiondata._id,
				hours:sessiondata.hours,
				minutes:sessiondata.minutes,
				sessTime:sessiondata.sessTime,
				unit:sessiondata.unit,
				distance:sessiondata.distance,
				rpeLoad:sessiondata.rpeLoad,
				activityType:sessiondata.activityType.value,
				icon:sessiondata.activityType.imgUrl,
				color: sessiondata.activityType.color,
				order:sessiondata.order,
				sessionType: sessiondata.sessionType,
				exercisesTotal:sessiondata.exercises.length,
				sessionTime:sessiondata.sessTime,
				sessionURL: sessiondata.sessionURL,
			};
			let newSession = {
				_id: this.state.calendarNo,
				sessionId: sessiondata._id,
				title: sessiondata.title,
				unit: sessiondata.unit,
				distance: sessiondata.distance.$numberDecimal,
				hours: sessiondata.hours,
				minutes: sessiondata.minutes,
				sessTime: sessiondata.sessTime,
				rpeLoad: sessiondata.rpeLoad,
				sessionType:sessiondata.sessionType,
				activityType: sessiondata.activityType.value,
				color: sessiondata.activityType.color,
				icon: sessiondata.activityType.imgUrl,
				//exercises:sessiondata.exercises,
				exercisesTotal: sessiondata.exercises.length,
				days: daysDiff,
				order: 1,
				sessionTime: 0,
				sessionURL: ''
			};

			programSessions.push(obj);
			 addProgramSessions.push(newSession);
		}
		this.setState({programSessions});
		this.setState({addProgramSessions}); 
		this.props.selectedPopulateSession('');
		$(".fc-widget-content td").removeClass('selectedDate');
		this.setState({ selectedSSessions: [] });
		
		$('.ss_session.active .ntes-per-btns').hide();
		$('.ss_session.active .note-ad-mbt').hide();
			$("#strength-session-events li").removeClass('active');
	}

	}
	
	setPlannerData(result, isUpdate){
		let planner_bar = { curr_month_no: 0, curr_week_no: -1, max_comp_week_no: 0, tc_start_week: -1 };
		let weekFirstDay = 1;
		let week_counter = 1;
		let tc_count = -1;
		let maxCompDate = 0, maxProgramWeek = 0, maxCompTime = 0, tc_cycle_start_time = 0;
		let weekarr = [], recovery_days = [];
		let next_start_week = '';
		let cur_time = new Date();
		let planner = result.planner;

		let start_date = planner.startingDate.split('T')[0];
		let start_date_parts = start_date.split('-');
		start_date = new Date(start_date_parts[0], start_date_parts[1] - 1, 1);
		let end_date = new Date(start_date);
		end_date.setMonth(end_date.getMonth() + planner.endInterval);
		if (planner.tcStartDate !== null)
			tc_cycle_start_time = new Date(planner.tcStartDate.split('T')[0]);

		planner_bar.start_month = start_date.toLocaleString('default', { month: 'short' })
		planner_bar.start_year = start_date.getFullYear();
		planner_bar.end_year = end_date.getFullYear();

		if (planner.competitions) {
			planner.competitions.forEach((item, ind) => {
				let comp_date = new Date(item.compDate.split('T')[0]);
				if (maxCompDate === 0)
					maxCompDate = comp_date;
				if (comp_date > maxCompDate)
					maxCompDate = comp_date;
			});
		}

		if (planner.programs) {
			planner.programs.forEach((item, ind) => {
				let prog_date = new Date(item.startDate.split('T')[0]);
				prog_date.setDate(prog_date.getDate() + (item.weeks * 7));
				if (maxProgramWeek === 0)
					maxProgramWeek = prog_date;
				if (prog_date > maxProgramWeek)
					maxProgramWeek = prog_date;
			});
		}

		if (maxCompDate !== 0)
			maxCompTime = maxCompDate;
		else
			maxCompTime = maxProgramWeek;

		let start_week = this.nthWeekdayOfMonth(weekFirstDay, 1, start_date);
		planner_bar.startWeek = start_week.getFullYear() + '-' + (start_week.getMonth()+1) + '-' + start_week.getDate()+' 00:00:00';
		while (start_week < end_date) {
			let ddate = ("0" + start_week.getDate()).slice(-2);
			let dmonth = ("0" + (start_week.getMonth() + 1)).slice(-2);
			//weekarr.push(("0" + start_week.getDate() + '-' + start_week.toLocaleString('default', { month: 'short' }) + '-' + start_week.getFullYear());
			weekarr.push(start_week.getFullYear() + '-' + dmonth + '-' + ddate);
			next_start_week = new Date(start_week);
			next_start_week.setDate(next_start_week.getDate() + 7);

			if (start_week <= cur_time && next_start_week > cur_time)
				planner_bar.curr_week_no = week_counter - 1;

			if (maxCompTime !== 0 && maxCompTime >= start_week && maxCompTime < next_start_week)
				planner_bar.max_comp_week_no = week_counter;

			if (tc_count > planner.tcInterval && planner_bar.max_comp_week_no === 0) {
				tc_count = 0;
				recovery_days.push(start_week.getFullYear() + '-' + (start_week.getMonth() + 1) + '-' + start_week.getDate());
				let next_recovery_days = new Date(start_week);
				for (let j = 1; j < 7; j++) {
					next_recovery_days.setDate(next_recovery_days.getDate() + 1);
					recovery_days.push(next_recovery_days.getFullYear() + '-' + (next_recovery_days.getMonth() + 1) + '-' + next_recovery_days.getDate());
				}
			}

			if (tc_cycle_start_time >= start_week && tc_cycle_start_time < next_start_week) {
				planner_bar.tc_start_week = week_counter - 1;
				tc_count = 0
				recovery_days.push(start_week.getFullYear() + '-' + (start_week.getMonth() + 1) + '-' + start_week.getDate());
				let next_recovery_days = new Date(start_week);
				for (let j = 1; j < 7; j++) {
					next_recovery_days.setDate(next_recovery_days.getDate() + 1);
					recovery_days.push(next_recovery_days.getFullYear() + '-' + (next_recovery_days.getMonth() + 1) + '-' + next_recovery_days.getDate());
				}
			}

			if (planner.competitions) {
				planner.competitions.forEach((item, ind) => {
					let comp_date = new Date(item.compDate.split('T')[0]);
					if (comp_date >= start_week && comp_date < next_start_week)
						result.planner.competitions[ind].weekNo = week_counter - 1;
				});
			}

			start_week = next_start_week;
			++week_counter;
			if (tc_count !== -1)
				tc_count++;
			if (week_counter > 110)
				break;
		}
		planner_bar.weekarr = weekarr;
		planner_bar.recovery_days = recovery_days;
		
		let weeksContWidth = weekarr.length * 21;

		if(isUpdate)
			this.setState({ planner: result.planner, plannerBar: planner_bar, weeksContWidth, programDrag: {layer: '', startDate: ''}, duplicateProgram: {programId: '', title: ''} });
		else
			this.setState({ club: result.club, planner: result.planner, plannerBar: planner_bar, weeksContWidth, loading: false, programs: result.programs });
	}
	
	onDragStart = (e, id, title, color, weeks) => {
		e.dataTransfer.setData('id', id);
		e.dataTransfer.setData('title', title);
		e.dataTransfer.setData('color', color);
		e.dataTransfer.setData('weeks', weeks);
		e.dataTransfer.setData('status', 'old');
	}
	
	onDragOver = (e) => {
		e.preventDefault();
	}
	
	onDragEnter = (e, layer, startDate) => {
		e.preventDefault();
		this.setState({programDrag: {layer, startDate}});
	}
	
	onDragLeave = (e, layer, startDate) => {
		e.preventDefault();
		if(this.state.programDrag.layer === layer && this.state.programDrag.startDate === startDate)
			this.setState({programDrag: {layer: '', startDate: ''}});
	}
	
	onDrop = (e, layer, startDate) => {
		e.preventDefault();
		e.stopPropagation();
		let plannerId = this.state.planner._id;
		let programData = {
			programId: e.dataTransfer.getData('id'),
			title: e.dataTransfer.getData('title'),
			color: e.dataTransfer.getData('color'),
			weeks: e.dataTransfer.getData('weeks'),
			layer,
			startDate
		}
		if(e.dataTransfer.getData('status') === 'new'){
			plannerAddProgram(plannerId, programData)
				.then(result => {
					if(result.success === true){
						this.setPlannerData(result, true);
					}
					else{
						this.setState({programDrag: {layer: '', startDate: ''}});
						alert(result.msg);
					}
				});
		}
		else if(e.dataTransfer.getData('status') === 'old'){
			plannerUpdateProgram(plannerId, programData)
				.then(result => {
					if(result.success === true){
						this.setPlannerData(result, true);
					}
					else{
						this.setState({programDrag: {layer: '', startDate: ''}});
						alert(result.msg);
					}
				});
		}
	}
	
	displayPlannerBar() {
		let weekbar_html = new Array();
		this.graph_weekbar_html = new Array();
		let time = new Date().getTime();

		let planner = this.state.planner;
		let plannerBar = this.state.plannerBar;
		let programDrag = this.state.programDrag;
		let prev_year = plannerBar.start_year, prev_week_day = 0, tc_count = -1, week_no = 1;
		if (planner.reverseCountdown === 'yes')
			week_no = plannerBar.max_comp_week_no;

		plannerBar.weekarr.forEach((item, ind) => {
			let datearr = item.split('-');
			let week_text = <span className="default-view">&nbsp;</span>, recovery_week_dot = '', month_box = '', comp_html = [], program_html = [];
			if (planner.displayCountdown === 'yes' && ((planner.reverseCountdown === 'yes' && week_no > 0) || (planner.reverseCountdown === 'no' && week_no <= plannerBar.max_comp_week_no)))
				week_text = <span className="default-view">{week_no}</span>;
			if (plannerBar.tc_start_week === ind && plannerBar.tc_start_week !== -1 && ((planner.reverseCountdown === 'yes' && week_no > 0) || (planner.reverseCountdown === 'no' && week_no <= plannerBar.max_comp_week_no))) {
				tc_count = 0;
				recovery_week_dot = <span className="green-circle-week" data-week-no={week_no}></span>;
			}
			if (tc_count > planner.tcInterval && ((planner.reverseCountdown === 'yes' && week_no > 0) || (planner.reverseCountdown === 'no' && week_no <= plannerBar.max_comp_week_no))) {
				tc_count = 0;
				recovery_week_dot = <span className="green-circle-week" data-week-no={week_no}></span>;
			}
			if (ind === 0)
				month_box = <div className="month-show"><span className="month-show-box">{monthNamesShort[parseInt(datearr[1])]}</span><span className="year-show">{datearr[0]}</span></div>;
			if (datearr[2] < prev_week_day) {
				let left = '-' + ((datearr[2] - 1) * 3) + 'px';
				let year_box = '';
				if (datearr[0] > prev_year) {
					year_box = <span className="year-show">{datearr[0]}</span>;
					prev_year = datearr[0];
				}
				month_box = <div className="month-show" style={{ left }}><span className="month-show-box">{monthNamesShort[parseInt(datearr[1])]}</span>{year_box}</div>;
			}

			planner.competitions.forEach((item1, ind1) => {
				if (item1.weekNo === ind) {
					let comp_date_parts = item1.compDate.split('T')[0].split('-');
					if (item1.type === 'a')
						comp_html.push(<div key={'planner-competition-'+item1._id} className="flag-option redflag" title={item1.title + ' : ' + comp_date_parts[2] + '-' + comp_date_parts[1] + '-' + comp_date_parts[0]}><img src={"/uploads/images/red-flag.png"} alt="" /></div>);
					else if (item1.type === 'b')
						comp_html.push(<div key={'planner-competition-'+item1._id} className="flag-option orangeflag" title={item1.title + ' : ' + comp_date_parts[2] + '-' + comp_date_parts[1] + '-' + comp_date_parts[0]}><img src={"/uploads/images/orange-flag.png"} alt="" /></div>);
					else if (item1.type === 'c')
						comp_html.push(<div key={'planner-competition-'+item1._id} className="flag-option yellowflag" title={item1.title + ' : ' + comp_date_parts[2] + '-' + comp_date_parts[1] + '-' + comp_date_parts[0]}><img src={"/uploads/images/yellow-flag.png"} alt="" /></div>)
				}
			});

			if (planner.programs) {
				planner.programs.forEach((item2, ind2) => {
					let prog_date = item2.startDate.split('T')[0];
					let prog_width = item2.weeks * 21;
					let margin_top = 25;
					if (item2.layer === 2)
						margin_top = 45;
					else if (item2.layer === 3)
						margin_top = 65;
					else if (item2.layer === 4)
						margin_top = 85;

					if (item === prog_date) {
						
						program_html.push(<div key={'planner-program-'+item2.programId} draggable className="dragable-srip resizable program-drag" onDragStart={(e) => this.onDragStart(e, item2.programId, item2.title, item2.color, item2.weeks)} onContextMenu={(e) => this.programMenu(e, item2.programId)} title={item2.title} style={{ backgroundColor: item2.color, marginTop: margin_top + 'px', width: prog_width + 'px' }}></div>);
					}
				});
			}

			weekbar_html.push(<div key={'programs-week-box-' + item} className="week-box" title={item}><div className={"droppable week-box-layer week-box-layer1"+(programDrag.layer === 1 && programDrag.startDate === item ? " drag-highlight" : "")} data-layer="1" onDragOver={(e) => this.onDragOver(e)} onDragEnter={(e) => this.onDragEnter(e, 1, item)}  onDragLeave={(e) => this.onDragLeave(e, 1, item)} onDrop={(e) => this.onDrop(e, 1, item)}></div><div className={"droppable week-box-layer week-box-layer2"+(programDrag.layer === 2 && programDrag.startDate === item ? " drag-highlight" : "")} data-layer="2" onDragOver={(e) => this.onDragOver(e)} onDragEnter={(e) => this.onDragEnter(e, 2, item)} onDragLeave={(e) => this.onDragLeave(e, 2, item)} onDrop={(e) => this.onDrop(e, 2, item)}></div><div className={"droppable week-box-layer week-box-layer3"+(programDrag.layer === 3 && programDrag.startDate === item ? " drag-highlight" : "")} data-layer="3" onDragOver={(e) => this.onDragOver(e)} onDragEnter={(e) => this.onDragEnter(e, 3, item)} onDragLeave={(e) => this.onDragLeave(e, 3, item)} onDrop={(e) => this.onDrop(e, 3, item)}></div><div className="week-counter">{week_text}</div>{plannerBar.curr_week_no === ind && plannerBar.curr_week_no !== -1 && <span className="current-week-mbt"></span>}{recovery_week_dot}{comp_html}{month_box}{program_html}</div>);
			this.graph_weekbar_html.push(<div key={'graph-week-box-' + item} className="week-box" title={item}><div className="week-counter">{week_text}</div>{plannerBar.curr_week_no === ind && plannerBar.curr_week_no !== -1 && <span className="current-week-mbt"></span>}{recovery_week_dot}{comp_html}{month_box}</div>);

			prev_week_day = parseInt(datearr[2]);
			if (tc_count !== -1)
				tc_count = tc_count + 1;
			if (planner.reverseCountdown === 'yes')
				week_no = week_no - 1;
			else
				week_no = week_no + 1;
		});

		return (<PlannerBarPrograms position={this.state.plannerBarPosition} onDrag={this.handlePlannerDrag} weekbarHtml={weekbar_html} />);
	}
	
	displayPlannerGraph() {
		let plannerGraphData = this.state.plannerGraphData.programArr;
		let maxVal = this.state.plannerGraphData.maxVal;
		let weekWidth = 21;
		let graphdata_html = new Array();
		
		plannerGraphData.forEach((item1, ind1) => {
			item1.weeksArr.forEach((item2, ind2) => {
				if(parseInt(item2) !== 0){
					let graphHeight = (item2 / maxVal) * 100;
					let graphLeft = (parseInt(item1.programStartWeek) + parseInt(ind2)) * weekWidth;
					graphdata_html.push(<div key={"planner-graph-"+ind1+"-"+ind2} className="graph-view-bar" style={{ backgroundColor: item1.color, width: weekWidth+'px', height: graphHeight+'%', left: graphLeft+'px' }}></div>);
				}
			});
		});
		return (<div className="graph-view-container-inner">{graphdata_html}</div>);
	}

	handlePlannerDrag = (e, ui) => {
		let x = ui.x;
		if (ui.x > 0)
			x = 0;
		else if (ui.x < (this.plannerBarCont.current.clientWidth - this.state.weeksContWidth - 21))
			x = this.plannerBarCont.current.clientWidth - this.state.weeksContWidth - 21;

		this.setState({ plannerBarPosition: { x, y: 0 } });
	}
	handleDateClick = (info) => { // bind with an arrow function
	//alert(arg.dateStr)
	// if ($('.session-drag').hasClass('active')) {

	// var days = document.querySelectorAll(".selectedDate");
	// days.forEach(function(day) {
	//   day.classList.remove("selectedDate");
	// });
	// info.dayEl.classList.add("selectedDate");
	  }

	handleGraphDrag = (e, ui) => {
		let x = ui.x;
		if (ui.x > 0)
			x = 0;
		else if (ui.x < (this.graphBarCont.current.clientWidth - this.state.weeksContWidth))
			x = this.graphBarCont.current.clientWidth - this.state.weeksContWidth;

		this.setState({ graphBarPosition: { x, y: 0 } });
	}
	
	selectPlannerProgram = (e) => {
		if(e.target.value === ''){
			let plannerProgram = {
				programId: '',
				startDate: new Date()
			};
			this.setState({programSessions: [], plannerProgram, saveProgramSessions: []});
		}
		else{
			let plannerProgram = {
				programId: e.target.value,
				startDate: e.target.options[e.target.options.selectedIndex].attributes.getNamedItem('data-start-date').value
			};
	
			let calendarApi = this.calendarRef.current.getApi();
			calendarApi.setOption('validRange', {start: plannerProgram.startDate});
			calendarApi.gotoDate(plannerProgram.startDate);
			
			
			getProgramSessions(plannerProgram.programId)
				.then(result => {
					if (result.success === true) {
						//this.setState({ programSessions: result.sessions, plannerProgram });
						let session_events = [];
						let calendarNo = this.state.calendarNo;
						result.sessions.forEach((item, ind) => {
							let session_date = new Date(plannerProgram.startDate);
							session_date.setDate(session_date.getDate() + item.days);
							let sdate = ("0" + session_date.getDate()).slice(-2);
							let smonth = ("0" + (session_date.getMonth() + 1)).slice(-2);
							
							let obj = {
								id: calendarNo,
								title: item.title,
								start: session_date.getFullYear() + '-' + smonth + '-' + sdate + ' 00:00:00',
								durationEditable: false,
								startEditable: true,
								extendedProps: {
									sessAssId: item._id,
									sessionId: item.sessionId,
									hours: item.hours,
									minutes: item.minutes,
									sessTime: item.sessTime,
									unit: item.unit,
									distance: item.distance == undefined ? 0 : item.distance.$numberDecimal,
									rpeLoad: item.rpeLoad,
									activityType: item.activityType,
									icon: item.icon,
									color: item.color,
									order: item.order,
									sessionType: item.sessionType,
									exercisesTotal: item.exercisesTotal,
									sessionTime: item.sessionTime,
									sessionURL: item.sessionURL
								}
							}
							session_events.push(obj);
							++calendarNo;
						});
						this.setState({programSessions: session_events, plannerProgram, saveProgramSessions: result.sessions, calendarNo});
					}
					else {
						alert(result.msg);
					}
				});
		}
	}

	handleEventRender = (info) => {
		let sessInfo = info.event.extendedProps;
		let time = new Date().getTime();
		//let sess_date = info.event.start.toISOString().split('T');
		//let dstring = sess_date[0];
		let ddate = ("0" + info.event.start.getDate()).slice(-2);
		let dmonth = ("0" + (info.event.start.getMonth() + 1)).slice(-2);
		let dstring = info.event.start.getFullYear() + '-' + dmonth + '-' + ddate;
		
		render(
			<div className="fc-content" style={{ backgroundColor: sessInfo.color }}>
				<ContextMenu id={time+sessInfo.sessAssId}>
					{
						(sessInfo.sessionType === 'normal') ?
							<MenuItem onClick={() => this.viewSession(sessInfo.sessionId)}>View</MenuItem> : <MenuItem onClick={() => this.showSSession(sessInfo.sessionId, this.state.plannerProgram.programId, this.state.plannerProgram.startDate)}>View</MenuItem>
					}
					{/*<MenuItem onClick={() => this.updateTimeAndUrl(sessInfo.sessAssId, info.event.id, 0, sessInfo.sessionTime, sessInfo.sessionURL)}>Edit Time & URL</MenuItem>
					<MenuItem divider />
					<MenuItem onClick={() => this.duplicateSession(sessInfo.sessAssId)}>Duplicate</MenuItem>
					<MenuItem divider />*/}
					{
						(sessInfo.sessionType === 'normal')
							? <MenuItem onClick={() => this.editSession(sessInfo.sessionId)}>Edit</MenuItem>
							: <MenuItem onClick={() => window.open('/team/' + this.state.club.slug + '/edit-session/' + sessInfo.sessionId, "_blank")}>Edit</MenuItem>
					}
					<MenuItem onClick={() => this.removeSession(sessInfo.sessAssId, info.event.id)}>Remove</MenuItem>
					{/*
						(sessInfo.sessionType === 'normal') ?
							<MenuItem onClick={() => this.showWarning()}>Print</MenuItem> : <MenuItem onClick={() => this.showSSession(sessInfo.sessionId, this.state.plannerProgram.programId, this.state.plannerProgram.startDate)}>Print</MenuItem>
					*/}
					{/*<MenuItem onClick={this.handleClick}>Move Up</MenuItem>
					<MenuItem onClick={this.handleClick}>Move Down</MenuItem>*/}
				</ContextMenu>
				<ContextMenuTrigger id={time+sessInfo.sessAssId}>
					<span style={{ width: '100%', backgroundColor: sessInfo.color }} className="fc-title snbx sn-run">
						<div className="media snbx sn-run" style={{ backgroundColor: sessInfo.color, display: 'none' }}></div>
							<input type="hidden" className="e-id" value={info.event.id} />
							<input type="hidden" className="sess-ass-id" value={sessInfo.sessAssId} />
							<input type="hidden" className="box-date" value={dstring} />
							<div className="media-left"><img src={'/uploads/images/' + sessInfo.icon} alt="" /></div>
							<div className="media-body"><h4 className="media-heading">{info.event.title}</h4></div>
							{
								(sessInfo.sessionType === 'normal') ?
									<p>{sessInfo.distance + sessInfo.unit + ' ' + sessInfo.hours + ':' + sessInfo.minutes + ',' + sessInfo.rpeLoad + ' Load'}</p> :
									<p>{sessInfo.exercisesTotal + ' Exercises'}</p>
							}
							<div className="sess-desc-icon" onClick={() => this.ShowSessionDesc(sessInfo.sessionId)} ><img src="/uploads/images/desc-icon2.png" alt="" /></div>
					</span>
				</ContextMenuTrigger>
			</div>,
			info.el,
		);
		return info.el;
		
		/*let fc_content = document.createElement('div');
		fc_content.className = "fc-content";
		if(sessInfo.sessionType === 'normal')
			fc_content.innerHTML = '<div style="width: 100%" class="' + sessInfo.sessionType + '"><div class="media snbx sn-run" style="background-color:' + sessInfo.color + '"><div class="media-left"><img src="/uploads/images/' + sessInfo.icon + '" alt="" /></div><div class="media-body"><h4 class="media-heading">' + info.event.title + '</h4></div><p>' + sessInfo.distance + sessInfo.unit + ',  ' + sessInfo.hours + ':' + sessInfo.minutes + ', ' + sessInfo.rpeLoad + ' Load</p><div class="sess-desc-icon"><img src="/uploads/images/desc-icon2.png" alt="" /></div></div></div>';
		else
			fc_content.innerHTML = '<div style="width: 100%" class="' + sessInfo.sessionType + '"><div class="media snbx sn-run" style="background-color:' + sessInfo.color + '"><div class="media-left"><img src="/uploads/images/' + sessInfo.icon + '" alt="" /></div><div class="media-body"><h4 class="media-heading">' + info.event.title + '</h4></div><p>' + sessInfo.exercisesTotal + ' Exercises</p><div class="sess-desc-icon"><img src="/uploads/images/desc-icon2.png" alt="" /></div></div></div>';
		return fc_content;*/
		
		
		/*let d = new Date(event.start);
		let ddate = ("0" + d.getDate()).slice(-2);
		let dmonth = ("0" + (d.getMonth() + 1)).slice(-2);
		let dstring = d.getFullYear() + '-' + dmonth + '-' + ddate;
		if (event.sessionType == 'normal') {
			
		}
		else{
			
		}*/
	}
	
	handleEventRenderRight = (info) => {
		let sessInfo = info.event.extendedProps;
		let time = new Date().getTime();
		//let sess_date = info.event.start.toISOString().split('T');
		//let dstring = sess_date[0];
		let ddate = ("0" + info.event.start.getDate()).slice(-2);
		let dmonth = ("0" + (info.event.start.getMonth() + 1)).slice(-2);
		let dstring = info.event.start.getFullYear() + '-' + dmonth + '-' + ddate;
		
		render(
			<div className="fc-content" style={{ backgroundColor: sessInfo.color }}>
				<ContextMenu id={time+'-right-'+sessInfo.sessAssId}>
					{
						(sessInfo.sessionType === 'normal') ?
							<MenuItem onClick={() => this.viewSession(sessInfo.sessionId)}>View</MenuItem> : <MenuItem onClick={() => this.showSSession(sessInfo.sessionId, this.state.splitProgram.programId, this.state.splitProgram.startDate)}>View</MenuItem>
					}
					{/*<MenuItem onClick={() => this.updateTimeAndUrl(sessInfo.sessAssId, info.event.id, 0, sessInfo.sessionTime, sessInfo.sessionURL)}>Edit Time & URL</MenuItem>
					<MenuItem divider />
					<MenuItem onClick={() => this.duplicateSessionRight(sessInfo.sessAssId)}>Duplicate</MenuItem>
					<MenuItem divider />*/}
					{
						(sessInfo.sessionType === 'normal')
							? <MenuItem onClick={() => this.editSession(sessInfo.sessionId)}>Edit</MenuItem>
							: <MenuItem onClick={() => window.open('/team/' + this.state.club.slug + '/edit-session/' + sessInfo.sessionId, "_blank")}>Edit</MenuItem>
					}
					<MenuItem onClick={() => this.removeSessionRight(sessInfo.sessAssId, info.event.id)}>Remove</MenuItem>
					{/*
						(sessInfo.sessionType === 'normal') ?
							<MenuItem onClick={() => this.showWarning()}>Print</MenuItem> : <MenuItem onClick={() => this.showSSession(sessInfo.sessionId, this.state.splitProgram.programId, this.state.splitProgram.startDate)}>Print</MenuItem>
					*/}
					{/*<MenuItem onClick={this.handleClick}>Move Up</MenuItem>
					<MenuItem onClick={this.handleClick}>Move Down</MenuItem>*/}
				</ContextMenu>
				<ContextMenuTrigger id={time+'-right-'+sessInfo.sessAssId}>
					<span style={{ width: '100%', backgroundColor: sessInfo.color }} className="fc-title snbx sn-run">
						<div className="media snbx sn-run" style={{ backgroundColor: sessInfo.color, display: 'none' }}></div>
							<input type="hidden" className="e-id" value={info.event.id} />
							<input type="hidden" className="sess-ass-id" value={sessInfo.sessAssId} />
							<input type="hidden" className="box-date" value={dstring} />
							<div className="media-left"><img src={'/uploads/images/' + sessInfo.icon} alt="" /></div>
							<div className="media-body"><h4 className="media-heading">{info.event.title}</h4></div>
							{
								(sessInfo.sessionType === 'normal') ?
									<p>{sessInfo.distance + sessInfo.unit + ' ' + sessInfo.hours + ':' + sessInfo.minutes + ',' + sessInfo.rpeLoad + ' Load'}</p> :
									<p>{sessInfo.exercisesTotal + ' Exercises'}</p>
							}
							<div className="sess-desc-icon" onClick={() => this.ShowSessionDesc(sessInfo.sessionId)} ><img src="/uploads/images/desc-icon2.png" alt="" /></div>
					</span>
				</ContextMenuTrigger>
			</div>,
			info.el,
		);
		return info.el;
	}

	nthWeekdayOfMonth(weekday, n, date) {
		let newDate = new Date(date.getFullYear(), date.getMonth(), 1);
		let add = (weekday - newDate.getDay() + 7) % 7 + (n - 1) * 7;
		newDate.setDate(1 + add);
		return newDate;
	}
	
	leftSidebarChange(){
		this.setState({leftSidebarDisplay: !this.state.leftSidebarDisplay});
	}
	
	rightSidebarChange(){
		this.setState({rightSidebarDisplay: !this.state.rightSidebarDisplay});
	}
	
	viewSession(id) {
		this.props.viewSessions(id);
	}
	
	showSSession(id, programId, programStartDate) {
		let valObj = {};
		valObj['session_id'] = id;
		valObj['program_id'] = programId;
		valObj['program_start_date'] = programStartDate;
		this.props.showStrengthSession(valObj);
	}
	
	ShowSessionDesc(id) {
		getSessionDescriptionById(id).then(sessDess => {
			this.props.showSessionDescription(sessDess.description);
		})
	}
	
	updateTimeAndUrl(id, eventId, calendar, sessionTime, sessionURL) {
		this.props.editSessionTime(id, eventId, calendar, sessionTime, sessionURL);
	}
	
	duplicateSession(id) {
		/*let saveProgramSession = [...this.state.saveProgramSessions];
		for (var i = 0; i < saveProgramSession.length; i++) {
			if (id === saveProgramSession[i]._id) {
				saveProgramSession.push(saveProgramSession[i]);
			}
			this.setState({ saveProgramSessions: saveProgramSession });
		}*/
	}
	
	duplicateSessionRight(id) {
		/*let saveProgramSession = [...this.state.saveProgramSessions];
		for (var i = 0; i < saveProgramSession.length; i++) {
			if (id === saveProgramSession[i]._id) {
				saveProgramSession.push(saveProgramSession[i]);
			}
			this.setState({ saveProgramSessions: saveProgramSession });
		}*/
	}
	
	editSession(id) {
		this.props.showAddSession(id);
	}
	
	removeSession(id, eventId) {
		if (window.confirm('Are you sure you want to remove this session?')) {
			//let calendarApi = this.calendarRef.current.getApi();
			//let evt = calendarApi.getEventById(eventId);
			//evt.remove();
			
			let programSessions = [...this.state.programSessions];
			let saveProgramSessions = [...this.state.saveProgramSessions];
			let addProgramSessions = [...this.state.addProgramSessions];
			for (let i = 0; i < programSessions.length; i++) {
				if (parseInt(eventId) === programSessions[i].id) {
					programSessions.splice(i, 1);
				}
			}
			for (let i = 0; i < saveProgramSessions.length; i++) {
				if (id === saveProgramSessions[i]._id) {
					saveProgramSessions.splice(i, 1);
				}
			}
			for (let i = 0; i < addProgramSessions.length; i++) {
				if (id === addProgramSessions[i]._id) {
					addProgramSessions.splice(i, 1);
				}
			}
			this.setState({ programSessions, saveProgramSessions, addProgramSessions });
		} else {
			return false;
		}
	}
	
	removeSessionRight(id, eventId) {
		if (window.confirm('Are you sure you want to remove this session?')) {
			//let calendarApi1 = this.calendarRef1.current.getApi();
			//let evt = calendarApi1.getEventById(eventId);
			//evt.remove();
			
			let programSessionsRight = [...this.state.programSessionsRight];
			let saveProgramSessionsRight = [...this.state.saveProgramSessionsRight];
			let addProgramSessionsRight = [...this.state.addProgramSessionsRight];
			for (let i = 0; i < programSessionsRight.length; i++) {
				if (parseInt(eventId) === programSessionsRight[i].id) {
					programSessionsRight.splice(i, 1);
				}
			}
			for (let i = 0; i < saveProgramSessionsRight.length; i++) {
				if (id === saveProgramSessionsRight[i]._id) {
					saveProgramSessionsRight.splice(i, 1);
				}
			}
			for (let i = 0; i < addProgramSessionsRight.length; i++) {
				if (id === addProgramSessionsRight[i]._id) {
					addProgramSessionsRight.splice(i, 1);
				}
			}
			this.setState({ programSessionsRight, saveProgramSessionsRight, addProgramSessionsRight });
		} else {
			return false;
		}
	}
	
	showWarning() {
		alert('Only Strength Session can be printed');
	}
	
	loadPrograms = (e) => {
		e.preventDefault();
		this.props.loadProgram();
	}
	
	saveProgram = (e) => {
		e.preventDefault();
		let SessionObj = {};
		let calendarApi = this.calendarRef.current.getApi();
		SessionObj['program_id'] = this.state.plannerProgram.programId;
		SessionObj['program_start_date'] = this.state.plannerProgram.startDate;
		SessionObj['program_sessions'] = this.state.saveProgramSessions;
		SessionObj['add_sessions'] = this.state.addProgramSessions;
		
		updatePlannerProgramSessions(SessionObj).then(res => {
			if(res.success === true){
				let calendarApi = this.calendarRef.current.getApi();
				let sources = calendarApi.getEventSources();
				sources.forEach((source) => {
					source.remove();
				});
				let events = calendarApi.getEvents();
				events.forEach((event1) => {
					event1.remove();
				});
				
				let session_events = [];
				let calendarNo = this.state.calendarNo;
				res.sessions.forEach((item, ind) => {
					let session_date = new Date(this.state.plannerProgram.startDate);
					session_date.setDate(session_date.getDate() + item.days);
					let sdate = ("0" + session_date.getDate()).slice(-2);
					let smonth = ("0" + (session_date.getMonth() + 1)).slice(-2);
					
					let obj = {
						id: calendarNo,
						title: item.title,
						start: session_date.getFullYear() + '-' + smonth + '-' + sdate + ' 00:00:00',
						durationEditable: false,
						startEditable: true,
						extendedProps: {
							sessAssId: item._id,
							sessionId: item.sessionId,
							hours: item.hours,
							minutes: item.minutes,
							sessTime: item.sessTime,
							unit: item.unit,
							distance: item.distance == undefined ? 0 : item.distance.$numberDecimal,
							rpeLoad: item.rpeLoad,
							icon: item.icon,
							activityType: item.activityType,
							color: item.color,
							order: item.order,
							sessionType: item.sessionType,
							exercisesTotal: item.exercisesTotal,
							sessionTime: item.sessionTime,
							sessionURL: item.sessionURL
						}
					}
					session_events.push(obj);
					++calendarNo;
				});
				this.setState({programSessions: session_events, saveProgramSessions: res.sessions, addProgramSessions: [], calendarNo});
				alert(res.msg);
			}
			else{
				alert(res.msg);
			}
		});
		/*let Program = {};
		Program['program_id'] = this.state.programId;
		API.getProgramSess(Program).then(programData => {
			this.setState({ programSessions: programData.program_session, saveprogramSessions: programData.program_session, programStartDate: "2020-06-01" });
		});*/
	}
	
	saveProgramSplit = (e) => {
		e.preventDefault();
		if(this.state.plannerProgram.programId){
			let SessionObj = {};
			let calendarApi = this.calendarRef.current.getApi();
			SessionObj['program_id'] = this.state.plannerProgram.programId;
			SessionObj['program_start_date'] = this.state.plannerProgram.startDate;
			SessionObj['program_sessions'] = this.state.saveProgramSessions;
			SessionObj['add_sessions'] = this.state.addProgramSessions;
			
			updatePlannerProgramSessions(SessionObj).then(res => {
				if(res.success === true){
					let calendarApi = this.calendarRef.current.getApi();
					let sources = calendarApi.getEventSources();
					sources.forEach((source) => {
						source.remove();
					});
					let events = calendarApi.getEvents();
					events.forEach((event1) => {
						event1.remove();
					});
					
					let session_events = [];
					let calendarNo = this.state.calendarNo;
					res.sessions.forEach((item, ind) => {
						let session_date = new Date(this.state.plannerProgram.startDate);
						session_date.setDate(session_date.getDate() + item.days);
						let sdate = ("0" + session_date.getDate()).slice(-2);
						let smonth = ("0" + (session_date.getMonth() + 1)).slice(-2);
						
						let obj = {
							id: calendarNo,
							title: item.title,
							start: session_date.getFullYear() + '-' + smonth + '-' + sdate + ' 00:00:00',
							durationEditable: false,
							startEditable: true,
							extendedProps: {
								sessAssId: item._id,
								sessionId: item.sessionId,
								hours: item.hours,
								minutes: item.minutes,
								sessTime: item.sessTime,
								unit: item.unit,
								distance: item.distance == undefined ? 0 : item.distance.$numberDecimal,
								rpeLoad: item.rpeLoad,
								icon: item.icon,
								activityType: item.activityType,
								color: item.color,
								order: item.order,
								sessionType: item.sessionType,
								exercisesTotal: item.exercisesTotal,
								sessionTime: item.sessionTime,
								sessionURL: item.sessionURL
							}
						}
						session_events.push(obj);
						++calendarNo;
					});
					this.setState({programSessions: session_events, saveProgramSessions: res.sessions, addProgramSessions: [], calendarNo, programSessionsRight: [], splitProgram: { programId: '', startDate: new Date(), title: '' }, saveProgramSessionsRight: [], leftSidebarDisplay: true, rightSidebarDisplay: true, plannerBarShow: true});
					alert(res.msg);
				}
				else{
					alert(res.msg);
				}
			});
		}
		else{
			this.setState({programSessionsRight: [], splitProgram: { programId: '', startDate: new Date(), title: '' }, saveProgramSessionsRight: [], leftSidebarDisplay: true, rightSidebarDisplay: true, plannerBarShow: true});
		}
	}
	
	saveProgramRight = (e) => {
		e.preventDefault();
		let SessionObj = {};
		let calendarApi1 = this.calendarRef1.current.getApi();
		SessionObj['program_id'] = this.state.splitProgram.programId;
		SessionObj['program_start_date'] = this.state.splitProgram.startDate;
		SessionObj['program_sessions'] = this.state.saveProgramSessionsRight;
		SessionObj['add_sessions'] = this.state.addProgramSessionsRight;
		
		updatePlannerProgramSessions(SessionObj).then(res => {
			if(res.success === true){
				let calendarApi1 = this.calendarRef1.current.getApi();
				let sources = calendarApi1.getEventSources();
				sources.forEach((source) => {
					source.remove();
				});
				let events = calendarApi1.getEvents();
				events.forEach((event1) => {
					event1.remove();
				});
				
				let session_events = [];
				let calendarNo = this.state.calendarNo;
				res.sessions.forEach((item, ind) => {
					let session_date = new Date(this.state.splitProgram.startDate);
					session_date.setDate(session_date.getDate() + item.days);
					let sdate = ("0" + session_date.getDate()).slice(-2);
					let smonth = ("0" + (session_date.getMonth() + 1)).slice(-2);
					
					let obj = {
						id: calendarNo,
						title: item.title,
						start: session_date.getFullYear() + '-' + smonth + '-' + sdate + ' 00:00:00',
						durationEditable: false,
						startEditable: true,
						extendedProps: {
							sessAssId: item._id,
							sessionId: item.sessionId,
							hours: item.hours,
							minutes: item.minutes,
							sessTime: item.sessTime,
							unit: item.unit,
							distance: item.distance == undefined ? 0 : item.distance.$numberDecimal,
							rpeLoad: item.rpeLoad,
							icon: item.icon,
							activityType: item.activityType,
							color: item.color,
							order: item.order,
							sessionType: item.sessionType,
							exercisesTotal: item.exercisesTotal,
							sessionTime: item.sessionTime,
							sessionURL: item.sessionURL
						}
					}
					session_events.push(obj);
					++calendarNo;
				});
				this.setState({programSessionsRight: session_events, saveProgramSessionsRight: res.sessions, addProgramSessionsRight: [], calendarNo});
				alert(res.msg);
			}
			else{
				alert(res.msg);
			}
		});
	}
	
	handleEventReceive = (info) => {
		if(this.state.plannerProgram.programId === ''){
			alert('Please select a program');
		}
		else{
			//let programSessions = [...this.state.programSessions];
			let addProgramSessions = [...this.state.addProgramSessions];
			let programSessionsRight = [...this.state.programSessionsRight];
			let calendarNo = this.state.calendarNo;
			let sessInfo = info.event.extendedProps;
			
			let eventId = parseInt(info.event.id);
			let newEvent = '';
			for (let i = 0; i < programSessionsRight.length; i++) {
				if (eventId === programSessionsRight[i].id) {
					newEvent = {
						id: calendarNo,
						title: info.event.title,
						start: programSessionsRight[i].start,
						durationEditable: false,
						startEditable: true,
						extendedProps: {
							sessAssId: sessInfo.sessAssId,
							sessionId: sessInfo.sessionId,
							hours: sessInfo.hours,
							minutes: sessInfo.minutes,
							sessTime: sessInfo.sessTime,
							unit: sessInfo.unit,
							distance: sessInfo.distance,
							rpeLoad: sessInfo.rpeLoad,
							activityType: sessInfo.activityType,
							icon: sessInfo.icon,
							color: sessInfo.color,
							order: sessInfo.order,
							sessionType: sessInfo.sessionType,
							exercisesTotal: sessInfo.exercisesTotal,
							sessionTime: sessInfo.sessionTime,
							sessionURL: sessInfo.sessionURL
						}
					};
					programSessionsRight.splice(i, 1);
					++calendarNo;
				}
			}
			if(newEvent !== '')
				programSessionsRight.push(newEvent);
			
			/*let newEvent1 = {
				id: calendarNo,
				title: info.event.title,
				start: info.event.start,
				durationEditable: false,
				startEditable: true,
				extendedProps: {
					sessAssId: calendarNo+'',
					sessionId: sessInfo.sessionId,
					hours: sessInfo.hours,
					minutes: sessInfo.minutes,
					sessTime: sessInfo.sessTime,
					unit: sessInfo.unit,
					distance: sessInfo.distance,
					rpeLoad: sessInfo.rpeLoad,
					activityType: sessInfo.activityType,
					icon: sessInfo.icon,
					color: sessInfo.color,
					order: 1,
					sessionType: sessInfo.sessionType,
					exercisesTotal: sessInfo.exercisesTotal,
					sessionTime: 0,
					sessionURL: '',
					isNew: 'yes'
				}
			};
			programSessions.push(newEvent1);
			++calendarNo;*/
			
			let programDate = new Date(this.state.plannerProgram.startDate+' 00:00:00');
			let timeDiff = info.event.start - programDate;
			let daysDiff = 0;
			if(timeDiff > 0)
				daysDiff = timeDiff / (1000 * 60 * 60 * 24);
			
			let newSession = {
				_id: calendarNo,
				sessionId: sessInfo.sessionId,
				title: info.event.title,
				unit: sessInfo.unit,
				distance: sessInfo.distance,
				hours: sessInfo.hours,
				minutes: sessInfo.minutes,
				sessTime: sessInfo.sessTime,
				rpeLoad: sessInfo.rpeLoad,
				sessionType: sessInfo.sessionType,
				activityType: sessInfo.activityType,
				color: sessInfo.color,
				icon: sessInfo.icon,
				exercisesTotal: sessInfo.exercisesTotal,
				days: daysDiff,
				order: 1,
				sessionTime: 0,
				sessionURL: ''
			};
			addProgramSessions.push(newSession);
			
			//let calendarApi = this.calendarRef.current.getApi();
			//let evt = calendarApi.getEventById(eventId);
			//evt.remove();
			
			++calendarNo;
			//this.setState({programSessions, addProgramSessions, calendarNo});
			this.setState({addProgramSessions, calendarNo, programSessionsRight});
		}
	}
	
	handleEventReceiveRight = (info) => {
		let addProgramSessionsRight = [...this.state.addProgramSessionsRight];
		let programSessions = [...this.state.programSessions];
		let calendarNo = this.state.calendarNo;
		let sessInfo = info.event.extendedProps;
		
		let eventId = parseInt(info.event.id);
		let newEvent = '';
		for (let i = 0; i < programSessions.length; i++) {
			if (eventId === programSessions[i].id) {
				newEvent = {
					id: calendarNo,
					title: info.event.title,
					start: programSessions[i].start,
					durationEditable: false,
					startEditable: true,
					extendedProps: {
						sessAssId: sessInfo.sessAssId,
						sessionId: sessInfo.sessionId,
						hours: sessInfo.hours,
						minutes: sessInfo.minutes,
						sessTime: sessInfo.sessTime,
						unit: sessInfo.unit,
						distance: sessInfo.distance,
						rpeLoad: sessInfo.rpeLoad,
						activityType: sessInfo.activityType,
						icon: sessInfo.icon,
						color: sessInfo.color,
						order: sessInfo.order,
						sessionType: sessInfo.sessionType,
						exercisesTotal: sessInfo.exercisesTotal,
						sessionTime: sessInfo.sessionTime,
						sessionURL: sessInfo.sessionURL
					}
				};
				programSessions.splice(i, 1);
				++calendarNo;
			}
		}
		if(newEvent !== '')
			programSessions.push(newEvent);
		
		let programDate = new Date(this.state.splitProgram.startDate+' 00:00:00');
		let timeDiff = info.event.start - programDate;
		let daysDiff = 0;
		if(timeDiff > 0)
			daysDiff = timeDiff / (1000 * 60 * 60 * 24);
		
		let newSession = {
			_id: calendarNo,
			sessionId: sessInfo.sessionId,
			title: info.event.title,
			unit: sessInfo.unit,
			distance: sessInfo.distance,
			hours: sessInfo.hours,
			minutes: sessInfo.minutes,
			sessTime: sessInfo.sessTime,
			rpeLoad: sessInfo.rpeLoad,
			sessionType: sessInfo.sessionType,
			activityType: sessInfo.activityType,
			color: sessInfo.color,
			icon: sessInfo.icon,
			exercisesTotal: sessInfo.exercisesTotal,
			days: daysDiff,
			order: 1,
			sessionTime: 0,
			sessionURL: ''
		};
		addProgramSessionsRight.push(newSession);
		
		++calendarNo;
		this.setState({addProgramSessionsRight, calendarNo, programSessions});
	}
	
	handleEventDrop = (info) => {
		let programSessions = [...this.state.programSessions];
		let addProgramSessions = [...this.state.addProgramSessions];
		let saveProgramSessions = [...this.state.saveProgramSessions];
		let programDate = new Date(this.state.plannerProgram.startDate+' 00:00:00');
		let eventId = parseInt(info.event.id);
		let timeDiff = info.event.start - programDate;
		let daysDiff = 0;
		if(timeDiff > 0)
			daysDiff = timeDiff / (1000 * 60 * 60 * 24);
		
		for(let i = 0; i < programSessions.length; i++){
			if(eventId === programSessions[i].id){
				programSessions[i].start = info.event.start;
			}
		}
		for(let i = 0; i < addProgramSessions.length; i++){
			if(info.event.id === addProgramSessions[i]._id){
				addProgramSessions[i].days = daysDiff;
			}
		}
		for(let i = 0; i < saveProgramSessions.length; i++){
			if(info.event.extendedProps.sessAssId === saveProgramSessions[i]._id){
				saveProgramSessions[i].days = daysDiff;
			}
		}
		this.setState({ programSessions, saveProgramSessions, addProgramSessions });
	}
	
	handleEventDropRight = (info) => {
		let programSessionsRight = [...this.state.programSessionsRight];
		let addProgramSessionsRight = [...this.state.addProgramSessionsRight];
		let saveProgramSessionsRight = [...this.state.saveProgramSessionsRight];
		let programDate = new Date(this.state.splitProgram.startDate+' 00:00:00');
		let eventId = parseInt(info.event.id);
		let timeDiff = info.event.start - programDate;
		let daysDiff = 0;

		if(timeDiff > 0)
			daysDiff = timeDiff / (1000 * 60 * 60 * 24);
		
		for(let i = 0; i < programSessionsRight.length; i++){
			if(eventId === programSessionsRight[i].id){
				programSessionsRight[i].start = info.event.start;
			}
		}
		for(let i = 0; i < addProgramSessionsRight.length; i++){
			if(info.event.id === addProgramSessionsRight[i]._id){
				addProgramSessionsRight[i].days = daysDiff;
			}
		}
		for(let i = 0; i < saveProgramSessionsRight.length; i++){
			if(info.event.extendedProps.sessAssId === saveProgramSessionsRight[i]._id){
				saveProgramSessionsRight[i].days = daysDiff;
			}
		}
		this.setState({ programSessionsRight, saveProgramSessionsRight, addProgramSessionsRight });
	}
	
	handleDrop = (arg) => {
		if(this.state.plannerProgram.programId === ''){
			alert('Please select a program');
		}
		else if(arg.draggedEl.dataset.sessid !== undefined){
			let programSessions = [...this.state.programSessions];
			let addProgramSessions = [...this.state.addProgramSessions];
			let calendarNo = this.state.calendarNo;
			
			let newEvent = {
				id: calendarNo,
				title: arg.draggedEl.title,
				start: arg.date,
				durationEditable: false,
				startEditable: true,
				extendedProps: {
					sessAssId: calendarNo+'',
					sessionId: arg.draggedEl.dataset.sessid,
					hours: arg.draggedEl.dataset.hours,
					minutes: arg.draggedEl.dataset.minutes,
					sessTime: arg.draggedEl.dataset.sesstime,
					unit: arg.draggedEl.dataset.unit,
					distance: arg.draggedEl.dataset.distance,
					rpeLoad: arg.draggedEl.dataset.rpeload,
					activityType: arg.draggedEl.dataset.activitytype,
					icon: arg.draggedEl.dataset.imgurl,
					color: arg.draggedEl.dataset.color,
					order: 1,
					sessionType: arg.draggedEl.dataset.sesstype,
					exercisesTotal: arg.draggedEl.dataset.exercisestotal,
					sessionTime: 0,
					sessionURL: '',
					isNew: 'yes'
				}
			};
			programSessions.push(newEvent);
			
			let programDate = new Date(this.state.plannerProgram.startDate+' 00:00:00');
			let timeDiff = arg.date - programDate;
			let daysDiff = 0;
			if(timeDiff > 0)
				daysDiff = timeDiff / (1000 * 60 * 60 * 24);
			let newSession = {
				_id: calendarNo,
				sessionId: arg.draggedEl.dataset.sessid,
				title: arg.draggedEl.title,
				unit: arg.draggedEl.dataset.unit,
				distance: arg.draggedEl.dataset.distance,
				hours: arg.draggedEl.dataset.hours,
				minutes: arg.draggedEl.dataset.minutes,
				sessTime: arg.draggedEl.dataset.sesstime,
				rpeLoad: arg.draggedEl.dataset.rpeload,
				sessionType: arg.draggedEl.dataset.sesstype,
				activityType: arg.draggedEl.dataset.activitytype,
				color: arg.draggedEl.dataset.color,
				icon: arg.draggedEl.dataset.imgurl,
				exercisesTotal: arg.draggedEl.dataset.exercisestotal,
				days: daysDiff,
				order: 1,
				sessionTime: 0,
				sessionURL: ''
			};
			addProgramSessions.push(newSession);
			
			//let calendarApi = this.calendarRef.current.getApi();
			//calendarApi.addEvent(newEvent);
			++calendarNo;
			this.setState({programSessions, addProgramSessions, calendarNo});
		}
		else if(arg.draggedEl.dataset.copymonth !== undefined && arg.draggedEl.dataset.calendar === 'calendar1'){
			let programSessions = [...this.state.programSessions];
			let addProgramSessions = [...this.state.addProgramSessions];
			let calendarNo = this.state.calendarNo;
			
			let calendarApi = this.calendarRef1.current.getApi();
			let programDate = new Date(this.state.plannerProgram.startDate+' 00:00:00');
			$("#calendar1 .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-day-grid .fc-row.fc-week").each(function (ind) {
				for (let i = 1; i <= 7; i++) {
					let events_date = $('.fc-bg .fc-day.fc-widget-content:nth-child(' + i + ')', this).data('date');
					let events_new_date = $('#calendar .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-day-grid .fc-row.fc-week:nth-child(' + (ind + 1) + ') .fc-bg .fc-day.fc-widget-content:nth-child(' + i + ')').data('date');
					let events_new_date_obj = new Date(events_new_date+' 00:00:00');
					
					if (events_new_date_obj.getTime() >= programDate.getTime()) {
						$('.fc-content-skeleton table tbody input.box-date[value="' + events_date + '"]', this).each(function () {
							let ele = $(this).parent();
							let evt = calendarApi.getEventById(ele.find('.e-id').val());
							let sessInfo = evt.extendedProps;
							
							let newEvent = {
								id: calendarNo,
								title: evt.title,
								start: events_new_date+' 00:00:00',
								durationEditable: false,
								startEditable: true,
								extendedProps: {
									sessAssId: calendarNo+'',
									sessionId: sessInfo.sessionId,
									hours: sessInfo.hours,
									minutes: sessInfo.minutes,
									sessTime: sessInfo.sessTime,
									unit: sessInfo.unit,
									distance: sessInfo.distance,
									rpeLoad: sessInfo.rpeLoad,
									activityType: sessInfo.activityType,
									icon: sessInfo.icon,
									color: sessInfo.color,
									order: 1,
									sessionType: sessInfo.sessionType,
									exercisesTotal: sessInfo.exercisesTotal,
									sessionTime: 0,
									sessionURL: ''
								}
							};
							programSessions.push(newEvent);
							
							let timeDiff = events_new_date_obj - programDate;
							let daysDiff = 0;
							if(timeDiff > 0)
								daysDiff = timeDiff / (1000 * 60 * 60 * 24);
							let newSession = {
								_id: calendarNo,
								sessionId: sessInfo.sessionId,
								title: evt.title,
								unit: sessInfo.unit,
								distance: sessInfo.distance,
								hours: sessInfo.hours,
								minutes: sessInfo.minutes,
								sessTime: sessInfo.sessTime,
								rpeLoad: sessInfo.rpeLoad,
								sessionType: sessInfo.sessionType,
								activityType: sessInfo.activityType,
								color: sessInfo.color,
								icon: sessInfo.icon,
								exercisesTotal: sessInfo.exercisesTotal,
								days: daysDiff,
								order: 1,
								sessionTime: 0,
								sessionURL: ''
							};
							addProgramSessions.push(newSession);
							++calendarNo;
						});
					}
				}
			});
			this.setState({programSessions, addProgramSessions, calendarNo});
		}
		else if(arg.draggedEl.dataset.copyweek !== undefined){
			let programSessions = [...this.state.programSessions];
			let addProgramSessions = [...this.state.addProgramSessions];
			let saveProgramSessions = [...this.state.saveProgramSessions];
			let copySessions = [];
			let addCopySessions = [];
			let saveCopySessions = [];
			let calendarNo = this.state.calendarNo;
			
			if(arg.draggedEl.dataset.calendar === 'calendar'){
				copySessions = [...this.state.programSessions];
				addCopySessions = [...this.state.addProgramSessions];
				saveCopySessions = [...this.state.saveProgramSessions];
			}
			else{
				copySessions = [...this.state.programSessionsRight];
				addCopySessions = [...this.state.addProgramSessionsRight];
				saveCopySessions = [...this.state.saveProgramSessionsRight];
			}
			
			let paste_sessions = [], paste_sessions_ass = [], paste_sessions_id = [];
			$(arg.draggedEl).parents('.fc-row.fc-week.fc-widget-content').find('.fc-event-container .e-id').each(function (ind, ele) {
				paste_sessions.push(parseInt($(ele).val()));
				paste_sessions_ass.push($(ele).parent().children('.sess-ass-id')[0].value);
			});
			let week_start_paste = $(arg.draggedEl).parents('.fc-day.fc-widget-content').data('date');
			if (week_start_paste === undefined) {
				week_start_paste = $(arg.draggedEl).parents('.fc-day.fc-widget-content').parent();
				week_start_paste = $('td:last-child', week_start_paste).data('date');
				if (week_start_paste != undefined) {
					week_start_paste = new Date(week_start_paste+' 00:00:00');
					week_start_paste = new Date(week_start_paste.setDate(week_start_paste.getDate() - 6));
				}
			} else
				week_start_paste = new Date(week_start_paste+' 00:00:00');
			
			if (paste_sessions.length > 0 && week_start_paste != undefined) {
				let calendarApi = {};
				if(arg.draggedEl.dataset.calendar === 'calendar')
					calendarApi = this.calendarRef.current.getApi();
				else
					calendarApi = this.calendarRef1.current.getApi();
				let mbtGetDateDay = new Date(arg.date);
				let mbtday = mbtGetDateDay.getDay();
				let mbtdiff = mbtGetDateDay.getDate() - mbtday + (mbtday == 0 ? -6 : 1);
				let week_start = new Date(mbtGetDateDay.setDate(mbtdiff));
				let programDate = new Date(this.state.plannerProgram.startDate+' 00:00:00');
				
				for(let i = 0; i < addCopySessions.length; i++){
					if ($.inArray(addCopySessions[i]._id, paste_sessions) > -1) {
						let evt = calendarApi.getEventById(addCopySessions[i]._id);
						let sess_start = evt.start;
						let timeDiff = Math.abs(sess_start.getTime() - week_start_paste.getTime());
						let new_date = new Date(Math.abs(week_start.getTime() + timeDiff));
						let ddate = ("0" + new_date.getDate()).slice(-2);
						let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
						if (new_date.getTime() >= programDate.getTime()) {
							let sessInfo = evt.extendedProps;
							let timeDiff = new_date - programDate;
							let daysDiff = 0;
							if(timeDiff > 0)
								daysDiff = timeDiff / (1000 * 60 * 60 * 24);
							if(arg.draggedEl.dataset.calendar === 'calendar' && !arg.jsEvent.altKey){
								addProgramSessions[i].days = daysDiff;
							}
							else{
								let newSession = {
									_id: calendarNo,
									sessionId: sessInfo.sessionId,
									title: evt.title,
									unit: sessInfo.unit,
									distance: sessInfo.distance,
									hours: sessInfo.hours,
									minutes: sessInfo.minutes,
									sessTime: sessInfo.sessTime,
									rpeLoad: sessInfo.rpeLoad,
									sessionType: sessInfo.sessionType,
									activityType: sessInfo.activityType,
									color: sessInfo.color,
									icon: sessInfo.icon,
									exercisesTotal: sessInfo.exercisesTotal,
									days: daysDiff,
									order: 1,
									sessionTime: 0,
									sessionURL: ''
								};
								addProgramSessions.push(newSession);
								for(let j = 0; j < paste_sessions.length; j++){
									if(addCopySessions[i]._id === paste_sessions[j]){
										paste_sessions_id[j] = calendarNo;
									}
								}
								++calendarNo;
							}
						}
					}
				}
				
				for(let i = 0; i < saveCopySessions.length; i++){
					if ($.inArray(saveCopySessions[i]._id, paste_sessions_ass) > -1) {
						let calendar_no = 0;
						for(let j = 0; j < paste_sessions_ass.length; j++){
							if(saveCopySessions[i]._id === paste_sessions_ass[j]){
								paste_sessions_id[j] = calendarNo;
								calendar_no = paste_sessions[j];
							}
						}
						let evt = calendarApi.getEventById(calendar_no);
						let sess_start = evt.start;
						let timeDiff = Math.abs(sess_start.getTime() - week_start_paste.getTime());
						let new_date = new Date(Math.abs(week_start.getTime() + timeDiff));
						let ddate = ("0" + new_date.getDate()).slice(-2);
						let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
						if (new_date.getTime() >= programDate.getTime()) {
							let sessInfo = evt.extendedProps;
							let timeDiff = new_date - programDate;
							let daysDiff = 0;
							if(timeDiff > 0)
								daysDiff = timeDiff / (1000 * 60 * 60 * 24);
							if(arg.draggedEl.dataset.calendar === 'calendar' && !arg.jsEvent.altKey){
								saveProgramSessions[i].days = daysDiff;
							}
							else{
								let newSession = {
									_id: calendarNo,
									sessionId: sessInfo.sessionId,
									title: evt.title,
									unit: sessInfo.unit,
									distance: sessInfo.distance,
									hours: sessInfo.hours,
									minutes: sessInfo.minutes,
									sessTime: sessInfo.sessTime,
									rpeLoad: sessInfo.rpeLoad,
									sessionType: sessInfo.sessionType,
									activityType: sessInfo.activityType,
									color: sessInfo.color,
									icon: sessInfo.icon,
									exercisesTotal: sessInfo.exercisesTotal,
									days: daysDiff,
									order: 1,
									sessionTime: 0,
									sessionURL: ''
								};
								addProgramSessions.push(newSession);
								
								++calendarNo;
							}
						}
					}
				}
				
				for(let i = 0; i < copySessions.length; i++){
					if ($.inArray(copySessions[i].id, paste_sessions) > -1) {
						let evt = calendarApi.getEventById(copySessions[i].id);
						let sess_start = evt.start;
						let timeDiff = Math.abs(sess_start.getTime() - week_start_paste.getTime());
						let new_date = new Date(Math.abs(week_start.getTime() + timeDiff));
						let ddate = ("0" + new_date.getDate()).slice(-2);
						let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
						if (new_date.getTime() >= programDate.getTime()) {
							let sessInfo = evt.extendedProps;
							if(arg.draggedEl.dataset.calendar === 'calendar' && !arg.jsEvent.altKey){
								let newEvent = {
									id: programSessions[i].id,
									title: evt.title,
									start: new_date.getFullYear() + '-' + dmonth + '-' + ddate + ' 00:00:00',
									durationEditable: false,
									startEditable: true,
									extendedProps: {
										sessAssId: sessInfo.sessAssId,
										sessionId: sessInfo.sessionId,
										hours: sessInfo.hours,
										minutes: sessInfo.minutes,
										sessTime: sessInfo.sessTime,
										unit: sessInfo.unit,
										distance: sessInfo.distance,
										rpeLoad: sessInfo.rpeLoad,
										activityType: sessInfo.activityType,
										icon: sessInfo.icon,
										color: sessInfo.color,
										order: sessInfo.order,
										sessionType: sessInfo.sessionType,
										exercisesTotal: sessInfo.exercisesTotal,
										sessionTime: sessInfo.sessionTime,
										sessionURL: sessInfo.sessionURL
									}
								};
								programSessions[i] = newEvent;
							}
							else{
								let calendar_no = 0;
								for(let j = 0; j < paste_sessions.length; j++){
									if(copySessions[i].id === paste_sessions[j]){
										calendar_no = paste_sessions_id[j];
									}
								}
								let newEvent = {
									id: calendar_no,
									title: evt.title,
									start: new_date.getFullYear() + '-' + dmonth + '-' + ddate + ' 00:00:00',
									durationEditable: false,
									startEditable: true,
									extendedProps: {
										sessAssId: calendar_no+'',
										sessionId: sessInfo.sessionId,
										hours: sessInfo.hours,
										minutes: sessInfo.minutes,
										sessTime: sessInfo.sessTime,
										unit: sessInfo.unit,
										distance: sessInfo.distance,
										rpeLoad: sessInfo.rpeLoad,
										activityType: sessInfo.activityType,
										icon: sessInfo.icon,
										color: sessInfo.color,
										order: 1,
										sessionType: sessInfo.sessionType,
										exercisesTotal: sessInfo.exercisesTotal,
										sessionTime: 0,
										sessionURL: ''
									}
								};
								programSessions.push(newEvent);
							}
						}
					}
				}
			}
			this.setState({ programSessions, saveProgramSessions, addProgramSessions, calendarNo });
		} 
		else if (arg.draggedEl.dataset.copysingleday !== undefined) {
			let programSessions = [...this.state.programSessions];
			let addProgramSessions = [...this.state.addProgramSessions];
			let saveProgramSessions = [...this.state.saveProgramSessions];
			let copySessions = [];
			let addCopySessions = [];
			let saveCopySessions = [];
			let calendarNo = this.state.calendarNo;
			let day_start_paste = $(arg.draggedEl).parents().data('date');
			if(arg.draggedEl.dataset.calendar === 'calendar'){
				copySessions = [...this.state.programSessions];
				addCopySessions = [...this.state.addProgramSessions];
				saveCopySessions = [...this.state.saveProgramSessions];
			}
			else{
				copySessions = [...this.state.programSessionsRight];
				addCopySessions = [...this.state.addProgramSessionsRight];
				saveCopySessions = [...this.state.saveProgramSessionsRight];
			}
			
			let paste_sessions = [], paste_sessions_ass = [], paste_sessions_id = [];
			$(arg.draggedEl).parents(".fc-content-skeleton").find('.fc-event-container .e-id').each(function (ind, ele) {
  
				if (day_start_paste == $(ele).parent().children(".box-date")[0].value) {
				  paste_sessions.push(parseInt($(ele).val()));
				  paste_sessions_ass.push($(ele).parent().children(".sess-ass-id")[0].value);
				}
			  });
	  
		
			if (day_start_paste === undefined) {
				day_start_paste = $(arg.draggedEl).parents('.fc-day.fc-widget-content').parent();
				day_start_paste = $('td:last-child', day_start_paste).data('date');
				if (day_start_paste != undefined) {
					day_start_paste = new Date(day_start_paste+' 00:00:00');
					day_start_paste = new Date(day_start_paste.setDate(day_start_paste.getDate() - 6));
				}
			} else
			day_start_paste = new Date(day_start_paste+' 00:00:00');
			
			if (paste_sessions.length > 0 && day_start_paste != undefined) {
				let calendarApi = {};
				if(arg.draggedEl.dataset.calendar === 'calendar')
					calendarApi = this.calendarRef.current.getApi();
				else
					calendarApi = this.calendarRef1.current.getApi();
					let mbtGetDateDay = new Date(arg.date);
					let mbtday = mbtGetDateDay.getDay();
					let mbtdiff = mbtGetDateDay.getDate() - mbtday ;
					let day_start = new Date(mbtGetDateDay);
				let programDate = new Date(this.state.plannerProgram.startDate+' 00:00:00');
				
				for(let i = 0; i < addCopySessions.length; i++){
					if ($.inArray(addCopySessions[i]._id, paste_sessions) > -1) {
						let evt = calendarApi.getEventById(addCopySessions[i]._id);
						let sess_start = evt.start;
						let timeDiff = Math.abs(sess_start.getTime() - day_start_paste.getTime());
						let new_date = new Date(Math.abs(day_start.getTime() + timeDiff));
						let ddate = ("0" + new_date.getDate()).slice(-2);
						let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
						if (new_date.getTime() >= programDate.getTime()) {
							let sessInfo = evt.extendedProps;
							let timeDiff = new_date - programDate;
							let daysDiff = 0;
							if(timeDiff > 0)
								daysDiff = timeDiff / (1000 * 60 * 60 * 24);
							if(arg.draggedEl.dataset.calendar === 'calendar' && !arg.jsEvent.altKey){
								addProgramSessions[i].days = daysDiff;
							}
							else{
								let newSession = {
									_id: calendarNo,
									sessionId: sessInfo.sessionId,
									title: evt.title,
									unit: sessInfo.unit,
									distance: sessInfo.distance,
									hours: sessInfo.hours,
									minutes: sessInfo.minutes,
									sessTime: sessInfo.sessTime,
									rpeLoad: sessInfo.rpeLoad,
									sessionType: sessInfo.sessionType,
									activityType: sessInfo.activityType,
									color: sessInfo.color,
									icon: sessInfo.icon,
									exercisesTotal: sessInfo.exercisesTotal,
									days: daysDiff,
									order: 1,
									sessionTime: 0,
									sessionURL: ''
								};
								addProgramSessions.push(newSession);
								for(let j = 0; j < paste_sessions.length; j++){
									if(addCopySessions[i]._id === paste_sessions[j]){
										paste_sessions_id[j] = calendarNo;
									}
								}
								++calendarNo;
							}
						}
					}
				}
				
				for(let i = 0; i < saveCopySessions.length; i++){
					if ($.inArray(saveCopySessions[i]._id, paste_sessions_ass) > -1) {
						let calendar_no = 0;
						for(let j = 0; j < paste_sessions_ass.length; j++){
							if(saveCopySessions[i]._id === paste_sessions_ass[j]){
								paste_sessions_id[j] = calendarNo;
								calendar_no = paste_sessions[j];
							}
						}
						let evt = calendarApi.getEventById(calendar_no);
						let sess_start = evt.start;
						let timeDiff = Math.abs(sess_start.getTime() - day_start_paste.getTime());
						let new_date = new Date(Math.abs(day_start.getTime() + timeDiff));
						let ddate = ("0" + new_date.getDate()).slice(-2);
						let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
						if (new_date.getTime() >= programDate.getTime()) {
							let sessInfo = evt.extendedProps;
							let timeDiff = new_date - programDate;
							let daysDiff = 0;
							if(timeDiff > 0)
								daysDiff = timeDiff / (1000 * 60 * 60 * 24);
							if(arg.draggedEl.dataset.calendar === 'calendar' && !arg.jsEvent.altKey){
								saveProgramSessions[i].days = daysDiff;
							}
							else{
								let newSession = {
									_id: calendarNo,
									sessionId: sessInfo.sessionId,
									title: evt.title,
									unit: sessInfo.unit,
									distance: sessInfo.distance,
									hours: sessInfo.hours,
									minutes: sessInfo.minutes,
									sessTime: sessInfo.sessTime,
									rpeLoad: sessInfo.rpeLoad,
									sessionType: sessInfo.sessionType,
									activityType: sessInfo.activityType,
									color: sessInfo.color,
									icon: sessInfo.icon,
									exercisesTotal: sessInfo.exercisesTotal,
									days: daysDiff,
									order: 1,
									sessionTime: 0,
									sessionURL: ''
								};
								addProgramSessions.push(newSession);
								
								++calendarNo;
							}
						}
					}
				}
				
				for(let i = 0; i < copySessions.length; i++){
					if ($.inArray(copySessions[i].id, paste_sessions) > -1) {
						let evt = calendarApi.getEventById(copySessions[i].id);
						let sess_start = evt.start;
						let timeDiff = Math.abs(sess_start.getTime() - day_start_paste.getTime());
						let new_date = new Date(Math.abs(day_start.getTime() + timeDiff));
						let ddate = ("0" + new_date.getDate()).slice(-2);
						let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
						if (new_date.getTime() >= programDate.getTime()) {
							let sessInfo = evt.extendedProps;
							if(arg.draggedEl.dataset.calendar === 'calendar' && !arg.jsEvent.altKey){
								let newEvent = {
									id: programSessions[i].id,
									title: evt.title,
									start: new_date.getFullYear() + '-' + dmonth + '-' + ddate + ' 00:00:00',
									durationEditable: false,
									startEditable: true,
									extendedProps: {
										sessAssId: sessInfo.sessAssId,
										sessionId: sessInfo.sessionId,
										hours: sessInfo.hours,
										minutes: sessInfo.minutes,
										sessTime: sessInfo.sessTime,
										unit: sessInfo.unit,
										distance: sessInfo.distance,
										rpeLoad: sessInfo.rpeLoad,
										activityType: sessInfo.activityType,
										icon: sessInfo.icon,
										color: sessInfo.color,
										order: sessInfo.order,
										sessionType: sessInfo.sessionType,
										exercisesTotal: sessInfo.exercisesTotal,
										sessionTime: sessInfo.sessionTime,
										sessionURL: sessInfo.sessionURL
									}
								};
								programSessions[i] = newEvent;
							}
							else{
								let calendar_no = 0;
								for(let j = 0; j < paste_sessions.length; j++){
									if(copySessions[i].id === paste_sessions[j]){
										calendar_no = paste_sessions_id[j];
									}
								}
								let newEvent = {
									id: calendar_no,
									title: evt.title,
									start: new_date.getFullYear() + '-' + dmonth + '-' + ddate + ' 00:00:00',
									durationEditable: false,
									startEditable: true,
									extendedProps: {
										sessAssId: calendar_no+'',
										sessionId: sessInfo.sessionId,
										hours: sessInfo.hours,
										minutes: sessInfo.minutes,
										sessTime: sessInfo.sessTime,
										unit: sessInfo.unit,
										distance: sessInfo.distance,
										rpeLoad: sessInfo.rpeLoad,
										activityType: sessInfo.activityType,
										icon: sessInfo.icon,
										color: sessInfo.color,
										order: 1,
										sessionType: sessInfo.sessionType,
										exercisesTotal: sessInfo.exercisesTotal,
										sessionTime: 0,
										sessionURL: ''
									}
								};
								programSessions.push(newEvent);
							}
						}
					}
				}
			}
			this.setState({ programSessions, saveProgramSessions, addProgramSessions, calendarNo });
		}
	}
	
	handleDropRight = (arg) => {
		if(this.state.splitProgram.programId === ''){
			alert('Please load program');
		}
		else if(arg.draggedEl.dataset.sessid !== undefined){
			let programSessionsRight = [...this.state.programSessionsRight];
			let addProgramSessionsRight = [...this.state.addProgramSessionsRight];
			let calendarNo = this.state.calendarNo;
			
			let newEvent = {
				id: calendarNo,
				title: arg.draggedEl.title,
				start: arg.date,
				durationEditable: false,
				startEditable: true,
				extendedProps: {
					sessAssId: calendarNo+'',
					sessionId: arg.draggedEl.dataset.sessid,
					hours: arg.draggedEl.dataset.hours,
					minutes: arg.draggedEl.dataset.minutes,
					sessTime: arg.draggedEl.dataset.sesstime,
					unit: arg.draggedEl.dataset.unit,
					distance: arg.draggedEl.dataset.distance,
					rpeLoad: arg.draggedEl.dataset.rpeload,
					activityType: arg.draggedEl.dataset.activitytype,
					icon: arg.draggedEl.dataset.imgurl,
					color: arg.draggedEl.dataset.color,
					order: 1,
					sessionType: arg.draggedEl.dataset.sesstype,
					exercisesTotal: arg.draggedEl.dataset.exercisestotal,
					sessionTime: 0,
					sessionURL: '',
					isNew: 'yes'
				}
			};
			programSessionsRight.push(newEvent);
			
			let programDate = new Date(this.state.splitProgram.startDate+' 00:00:00');
			let timeDiff = arg.date - programDate;
			let daysDiff = 0;
			if(timeDiff > 0)
				daysDiff = timeDiff / (1000 * 60 * 60 * 24);
			let newSession = {
				_id: calendarNo,
				sessionId: arg.draggedEl.dataset.sessid,
				title: arg.draggedEl.title,
				unit: arg.draggedEl.dataset.unit,
				distance: arg.draggedEl.dataset.distance,
				hours: arg.draggedEl.dataset.hours,
				minutes: arg.draggedEl.dataset.minutes,
				sessTime: arg.draggedEl.dataset.sesstime,
				rpeLoad: arg.draggedEl.dataset.rpeload,
				sessionType: arg.draggedEl.dataset.sesstype,
				activityType: arg.draggedEl.dataset.activitytype,
				color: arg.draggedEl.dataset.color,
				icon: arg.draggedEl.dataset.imgurl,
				exercisesTotal: arg.draggedEl.dataset.exercisestotal,
				days: daysDiff,
				order: 1,
				sessionTime: 0,
				sessionURL: ''
			};
			addProgramSessionsRight.push(newSession);
			
			++calendarNo;
			this.setState({programSessionsRight, addProgramSessionsRight, calendarNo});
		}
		else if(arg.draggedEl.dataset.copymonth !== undefined && arg.draggedEl.dataset.calendar === 'calendar'){
			let programSessionsRight = [...this.state.programSessionsRight];
			let addProgramSessionsRight = [...this.state.addProgramSessionsRight];
			let calendarNo = this.state.calendarNo;
			
			let calendarApi = this.calendarRef.current.getApi();
			let programDate = new Date(this.state.splitProgram.startDate+' 00:00:00');
			$("#calendar .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-day-grid .fc-row.fc-week").each(function (ind) {
				for (let i = 1; i <= 7; i++) {
					let events_date = $('.fc-bg .fc-day.fc-widget-content:nth-child(' + i + ')', this).data('date');
					let events_new_date = $('#calendar1 .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-day-grid .fc-row.fc-week:nth-child(' + (ind + 1) + ') .fc-bg .fc-day.fc-widget-content:nth-child(' + i + ')').data('date');
					let events_new_date_obj = new Date(events_new_date+' 00:00:00');
					
					if (events_new_date_obj.getTime() >= programDate.getTime()) {
						$('.fc-content-skeleton table tbody input.box-date[value="' + events_date + '"]', this).each(function () {
							let ele = $(this).parent();
							let evt = calendarApi.getEventById(ele.find('.e-id').val());
							let sessInfo = evt.extendedProps;
							
							let newEvent = {
								id: calendarNo,
								title: evt.title,
								start: events_new_date+' 00:00:00',
								durationEditable: false,
								startEditable: true,
								extendedProps: {
									sessAssId: calendarNo+'',
									sessionId: sessInfo.sessionId,
									hours: sessInfo.hours,
									minutes: sessInfo.minutes,
									sessTime: sessInfo.sessTime,
									unit: sessInfo.unit,
									distance: sessInfo.distance,
									rpeLoad: sessInfo.rpeLoad,
									activityType: sessInfo.activityType,
									icon: sessInfo.icon,
									color: sessInfo.color,
									order: 1,
									sessionType: sessInfo.sessionType,
									exercisesTotal: sessInfo.exercisesTotal,
									sessionTime: 0,
									sessionURL: ''
								}
							};
							programSessionsRight.push(newEvent);
							
							let timeDiff = events_new_date_obj - programDate;
							let daysDiff = 0;
							if(timeDiff > 0)
								daysDiff = timeDiff / (1000 * 60 * 60 * 24);
							let newSession = {
								_id: calendarNo,
								sessionId: sessInfo.sessionId,
								title: evt.title,
								unit: sessInfo.unit,
								distance: sessInfo.distance,
								hours: sessInfo.hours,
								minutes: sessInfo.minutes,
								sessTime: sessInfo.sessTime,
								rpeLoad: sessInfo.rpeLoad,
								sessionType: sessInfo.sessionType,
								activityType: sessInfo.activityType,
								color: sessInfo.color,
								icon: sessInfo.icon,
								exercisesTotal: sessInfo.exercisesTotal,
								days: daysDiff,
								order: 1,
								sessionTime: 0,
								sessionURL: ''
							};
							addProgramSessionsRight.push(newSession);
							++calendarNo;
						});
					}
				}
			});
			this.setState({programSessionsRight, addProgramSessionsRight, calendarNo});
		}
		else if(arg.draggedEl.dataset.copyweek !== undefined){
			let programSessionsRight = [...this.state.programSessionsRight];
			let addProgramSessionsRight = [...this.state.addProgramSessionsRight];
			let saveProgramSessionsRight = [...this.state.saveProgramSessionsRight];
			let copySessions = [];
			let addCopySessions = [];
			let saveCopySessions = [];
			let calendarNo = this.state.calendarNo;
			
			if(arg.draggedEl.dataset.calendar === 'calendar'){
				copySessions = [...this.state.programSessions];
				addCopySessions = [...this.state.addProgramSessions];
				saveCopySessions = [...this.state.saveProgramSessions];
			}
			else{
				copySessions = [...this.state.programSessionsRight];
				addCopySessions = [...this.state.addProgramSessionsRight];
				saveCopySessions = [...this.state.saveProgramSessionsRight];
			}
			
			let paste_sessions = [], paste_sessions_ass = [], paste_sessions_id = [];
			$(arg.draggedEl).parents('.fc-row.fc-week.fc-widget-content').find('.fc-event-container .e-id').each(function (ind, ele) {
				paste_sessions.push(parseInt($(ele).val()));
				paste_sessions_ass.push($(ele).parent().children('.sess-ass-id')[0].value);
			});
			let week_start_paste = $(arg.draggedEl).parents('.fc-day.fc-widget-content').data('date');
			if (week_start_paste === undefined) {
				week_start_paste = $(arg.draggedEl).parents('.fc-day.fc-widget-content').parent();
				week_start_paste = $('td:last-child', week_start_paste).data('date');
				if (week_start_paste != undefined) {
					week_start_paste = new Date(week_start_paste+' 00:00:00');
					week_start_paste = new Date(week_start_paste.setDate(week_start_paste.getDate() - 6));
				}
			} else
				week_start_paste = new Date(week_start_paste+' 00:00:00');
			
			if (paste_sessions.length > 0 && week_start_paste != undefined) {
				let calendarApi = {};
				if(arg.draggedEl.dataset.calendar === 'calendar')
					calendarApi = this.calendarRef.current.getApi();
				else
					calendarApi = this.calendarRef1.current.getApi();
				let mbtGetDateDay = new Date(arg.date);
				let mbtday = mbtGetDateDay.getDay();
				let mbtdiff = mbtGetDateDay.getDate() - mbtday + (mbtday == 0 ? -6 : 1);
				let week_start = new Date(mbtGetDateDay.setDate(mbtdiff));
				let programDate = new Date(this.state.splitProgram.startDate+' 00:00:00');
				
				for(let i = 0; i < addCopySessions.length; i++){
					if ($.inArray(addCopySessions[i]._id, paste_sessions) > -1) {
						let evt = calendarApi.getEventById(addCopySessions[i]._id);
						let sess_start = evt.start;
						let timeDiff = Math.abs(sess_start.getTime() - week_start_paste.getTime());
						let new_date = new Date(Math.abs(week_start.getTime() + timeDiff));
						let ddate = ("0" + new_date.getDate()).slice(-2);
						let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
						if (new_date.getTime() >= programDate.getTime()) {
							let sessInfo = evt.extendedProps;
							let timeDiff = new_date - programDate;
							let daysDiff = 0;
							if(timeDiff > 0)
								daysDiff = timeDiff / (1000 * 60 * 60 * 24);
							if(arg.draggedEl.dataset.calendar === 'calendar1' && !arg.jsEvent.altKey){
								addProgramSessionsRight[i].days = daysDiff;
							}
							else{
								let newSession = {
									_id: calendarNo,
									sessionId: sessInfo.sessionId,
									title: evt.title,
									unit: sessInfo.unit,
									distance: sessInfo.distance,
									hours: sessInfo.hours,
									minutes: sessInfo.minutes,
									sessTime: sessInfo.sessTime,
									rpeLoad: sessInfo.rpeLoad,
									sessionType: sessInfo.sessionType,
									activityType: sessInfo.activityType,
									color: sessInfo.color,
									icon: sessInfo.icon,
									exercisesTotal: sessInfo.exercisesTotal,
									days: daysDiff,
									order: 1,
									sessionTime: 0,
									sessionURL: ''
								};
								addProgramSessionsRight.push(newSession);
								for(let j = 0; j < paste_sessions.length; j++){
									if(addCopySessions[i]._id === paste_sessions[j]){
										paste_sessions_id[j] = calendarNo;
									}
								}
								++calendarNo;
							}
						}
					}
				}
				
				for(let i = 0; i < saveCopySessions.length; i++){
					if ($.inArray(saveCopySessions[i]._id, paste_sessions_ass) > -1) {
						let calendar_no = 0;
						for(let j = 0; j < paste_sessions_ass.length; j++){
							if(saveCopySessions[i]._id === paste_sessions_ass[j]){
								paste_sessions_id[j] = calendarNo;
								calendar_no = paste_sessions[j];
							}
						}
						let evt = calendarApi.getEventById(calendar_no);
						let sess_start = evt.start;
						let timeDiff = Math.abs(sess_start.getTime() - week_start_paste.getTime());
						let new_date = new Date(Math.abs(week_start.getTime() + timeDiff));
						let ddate = ("0" + new_date.getDate()).slice(-2);
						let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
						if (new_date.getTime() >= programDate.getTime()) {
							let sessInfo = evt.extendedProps;
							let timeDiff = new_date - programDate;
							let daysDiff = 0;
							if(timeDiff > 0)
								daysDiff = timeDiff / (1000 * 60 * 60 * 24);
							if(arg.draggedEl.dataset.calendar === 'calendar1' && !arg.jsEvent.altKey){
								saveProgramSessionsRight[i].days = daysDiff;
							}
							else{
								let newSession = {
									_id: calendarNo,
									sessionId: sessInfo.sessionId,
									title: evt.title,
									unit: sessInfo.unit,
									distance: sessInfo.distance,
									hours: sessInfo.hours,
									minutes: sessInfo.minutes,
									sessTime: sessInfo.sessTime,
									rpeLoad: sessInfo.rpeLoad,
									sessionType: sessInfo.sessionType,
									activityType: sessInfo.activityType,
									color: sessInfo.color,
									icon: sessInfo.icon,
									exercisesTotal: sessInfo.exercisesTotal,
									days: daysDiff,
									order: 1,
									sessionTime: 0,
									sessionURL: ''
								};
								addProgramSessionsRight.push(newSession);
								
								++calendarNo;
							}
						}
					}
				}
				
				for(let i = 0; i < copySessions.length; i++){
					if ($.inArray(copySessions[i].id, paste_sessions) > -1) {
						let evt = calendarApi.getEventById(copySessions[i].id);
						let sess_start = evt.start;
						let timeDiff = Math.abs(sess_start.getTime() - week_start_paste.getTime());
						let new_date = new Date(Math.abs(week_start.getTime() + timeDiff));
						let ddate = ("0" + new_date.getDate()).slice(-2);
						let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
						if (new_date.getTime() >= programDate.getTime()) {
							let sessInfo = evt.extendedProps;
							if(arg.draggedEl.dataset.calendar === 'calendar1' && !arg.jsEvent.altKey){
								let newEvent = {
									id: programSessionsRight[i].id,
									title: evt.title,
									start: new_date.getFullYear() + '-' + dmonth + '-' + ddate + ' 00:00:00',
									durationEditable: false,
									startEditable: true,
									extendedProps: {
										sessAssId: sessInfo.sessAssId,
										sessionId: sessInfo.sessionId,
										hours: sessInfo.hours,
										minutes: sessInfo.minutes,
										sessTime: sessInfo.sessTime,
										unit: sessInfo.unit,
										distance: sessInfo.distance,
										rpeLoad: sessInfo.rpeLoad,
										activityType: sessInfo.activityType,
										icon: sessInfo.icon,
										color: sessInfo.color,
										order: sessInfo.order,
										sessionType: sessInfo.sessionType,
										exercisesTotal: sessInfo.exercisesTotal,
										sessionTime: sessInfo.sessionTime,
										sessionURL: sessInfo.sessionURL
									}
								};
								programSessionsRight[i] = newEvent;
							}
							else{
								let calendar_no = 0;
								for(let j = 0; j < paste_sessions.length; j++){
									if(copySessions[i].id === paste_sessions[j]){
										calendar_no = paste_sessions_id[j];
									}
								}
								let newEvent = {
									id: calendar_no,
									title: evt.title,
									start: new_date.getFullYear() + '-' + dmonth + '-' + ddate + ' 00:00:00',
									durationEditable: false,
									startEditable: true,
									extendedProps: {
										sessAssId: calendar_no+'',
										sessionId: sessInfo.sessionId,
										hours: sessInfo.hours,
										minutes: sessInfo.minutes,
										sessTime: sessInfo.sessTime,
										unit: sessInfo.unit,
										distance: sessInfo.distance,
										rpeLoad: sessInfo.rpeLoad,
										activityType: sessInfo.activityType,
										icon: sessInfo.icon,
										color: sessInfo.color,
										order: 1,
										sessionType: sessInfo.sessionType,
										exercisesTotal: sessInfo.exercisesTotal,
										sessionTime: 0,
										sessionURL: ''
									}
								};
								programSessionsRight.push(newEvent);
							}
						}
					}
				}
			}
			this.setState({ programSessionsRight, saveProgramSessionsRight, addProgramSessionsRight, calendarNo });
		}
		else if(arg.draggedEl.dataset.copysingleday!== undefined){
			let programSessionsRight = [...this.state.programSessionsRight];
			let addProgramSessionsRight = [...this.state.addProgramSessionsRight];
			let saveProgramSessionsRight = [...this.state.saveProgramSessionsRight];
			let copySessions = [];
			let addCopySessions = [];
			let saveCopySessions = [];
			let calendarNo = this.state.calendarNo;
			let day_start_paste = $(arg.draggedEl).parents().data('date');
			if(arg.draggedEl.dataset.calendar === 'calendar'){
				copySessions = [...this.state.programSessions];
				addCopySessions = [...this.state.addProgramSessions];
				saveCopySessions = [...this.state.saveProgramSessions];
			}
			else{
				copySessions = [...this.state.programSessionsRight];
				addCopySessions = [...this.state.addProgramSessionsRight];
				saveCopySessions = [...this.state.saveProgramSessionsRight];
			}
			
			let paste_sessions = [], paste_sessions_ass = [], paste_sessions_id = [];
			$(arg.draggedEl).parents(".fc-content-skeleton").find('.fc-event-container .e-id').each(function (ind, ele) {
  
				if (day_start_paste == $(ele).parent().children(".box-date")[0].value) {
				  paste_sessions.push(parseInt($(ele).val()));
				  paste_sessions_ass.push($(ele).parent().children(".sess-ass-id")[0].value);
				}
			  });
			
			if (day_start_paste === undefined) {
				day_start_paste = $(arg.draggedEl).parents('.fc-day.fc-widget-content').parent();
				day_start_paste = $('td:last-child', day_start_paste).data('date');
				if (day_start_paste != undefined) {
					day_start_paste = new Date(day_start_paste+' 00:00:00');
					day_start_paste = new Date(day_start_paste.setDate(day_start_paste.getDate() - 6));
				}
			} else
			day_start_paste = new Date(day_start_paste+' 00:00:00');
			
			if (paste_sessions.length > 0 && day_start_paste != undefined) {
				let calendarApi = {};
				if(arg.draggedEl.dataset.calendar === 'calendar')
					calendarApi = this.calendarRef.current.getApi();
				else
					calendarApi = this.calendarRef1.current.getApi();
					let mbtGetDateDay = new Date(arg.date);
					let mbtday = mbtGetDateDay.getDay();
					let mbtdiff = mbtGetDateDay.getDate() - mbtday ;
					let day_start = new Date(mbtGetDateDay);
				let programDate = new Date(this.state.splitProgram.startDate+' 00:00:00');
				
				for(let i = 0; i < addCopySessions.length; i++){
					if ($.inArray(addCopySessions[i]._id, paste_sessions) > -1) {
						let evt = calendarApi.getEventById(addCopySessions[i]._id);
						let sess_start = evt.start;
						let timeDiff = Math.abs(sess_start.getTime() - day_start_paste.getTime());
						let new_date = new Date(Math.abs(day_start.getTime() + timeDiff));
						let ddate = ("0" + new_date.getDate()).slice(-2);
						let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
						if (new_date.getTime() >= programDate.getTime()) {
							let sessInfo = evt.extendedProps;
							let timeDiff = new_date - programDate;
							let daysDiff = 0;
							if(timeDiff > 0)
								daysDiff = timeDiff / (1000 * 60 * 60 * 24);
							if(arg.draggedEl.dataset.calendar === 'calendar1' && !arg.jsEvent.altKey){
								addProgramSessionsRight[i].days = daysDiff;
							}
							else{
								let newSession = {
									_id: calendarNo,
									sessionId: sessInfo.sessionId,
									title: evt.title,
									unit: sessInfo.unit,
									distance: sessInfo.distance,
									hours: sessInfo.hours,
									minutes: sessInfo.minutes,
									sessTime: sessInfo.sessTime,
									rpeLoad: sessInfo.rpeLoad,
									sessionType: sessInfo.sessionType,
									activityType: sessInfo.activityType,
									color: sessInfo.color,
									icon: sessInfo.icon,
									exercisesTotal: sessInfo.exercisesTotal,
									days: daysDiff,
									order: 1,
									sessionTime: 0,
									sessionURL: ''
								};
								addProgramSessionsRight.push(newSession);
								for(let j = 0; j < paste_sessions.length; j++){
									if(addCopySessions[i]._id === paste_sessions[j]){
										paste_sessions_id[j] = calendarNo;
									}
								}
								++calendarNo;
							}
						}
					}
				}
				
				for(let i = 0; i < saveCopySessions.length; i++){
					if ($.inArray(saveCopySessions[i]._id, paste_sessions_ass) > -1) {
						let calendar_no = 0;
						for(let j = 0; j < paste_sessions_ass.length; j++){
							if(saveCopySessions[i]._id === paste_sessions_ass[j]){
								paste_sessions_id[j] = calendarNo;
								calendar_no = paste_sessions[j];
							}
						}
						let evt = calendarApi.getEventById(calendar_no);
						let sess_start = evt.start;
						let timeDiff = Math.abs(sess_start.getTime() - day_start_paste.getTime());
						let new_date = new Date(Math.abs(day_start.getTime() + timeDiff));
						let ddate = ("0" + new_date.getDate()).slice(-2);
						let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
						if (new_date.getTime() >= programDate.getTime()) {
							let sessInfo = evt.extendedProps;
							let timeDiff = new_date - programDate;
							let daysDiff = 0;
							if(timeDiff > 0)
								daysDiff = timeDiff / (1000 * 60 * 60 * 24);
							if(arg.draggedEl.dataset.calendar === 'calendar1' && !arg.jsEvent.altKey){
								saveProgramSessionsRight[i].days = daysDiff;
							}
							else{
								let newSession = {
									_id: calendarNo,
									sessionId: sessInfo.sessionId,
									title: evt.title,
									unit: sessInfo.unit,
									distance: sessInfo.distance,
									hours: sessInfo.hours,
									minutes: sessInfo.minutes,
									sessTime: sessInfo.sessTime,
									rpeLoad: sessInfo.rpeLoad,
									sessionType: sessInfo.sessionType,
									activityType: sessInfo.activityType,
									color: sessInfo.color,
									icon: sessInfo.icon,
									exercisesTotal: sessInfo.exercisesTotal,
									days: daysDiff,
									order: 1,
									sessionTime: 0,
									sessionURL: ''
								};
								addProgramSessionsRight.push(newSession);
								
								++calendarNo;
							}
						}
					}
				}
				
				for(let i = 0; i < copySessions.length; i++){
					if ($.inArray(copySessions[i].id, paste_sessions) > -1) {
						let evt = calendarApi.getEventById(copySessions[i].id);
						let sess_start = evt.start;
						let timeDiff = Math.abs(sess_start.getTime() - day_start_paste.getTime());
						let new_date = new Date(Math.abs(day_start.getTime() + timeDiff));
						let ddate = ("0" + new_date.getDate()).slice(-2);
						let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
						if (new_date.getTime() >= programDate.getTime()) {
							let sessInfo = evt.extendedProps;
							if(arg.draggedEl.dataset.calendar === 'calendar1' && !arg.jsEvent.altKey){
								let newEvent = {
									id: programSessionsRight[i].id,
									title: evt.title,
									start: new_date.getFullYear() + '-' + dmonth + '-' + ddate + ' 00:00:00',
									durationEditable: false,
									startEditable: true,
									extendedProps: {
										sessAssId: sessInfo.sessAssId,
										sessionId: sessInfo.sessionId,
										hours: sessInfo.hours,
										minutes: sessInfo.minutes,
										sessTime: sessInfo.sessTime,
										unit: sessInfo.unit,
										distance: sessInfo.distance,
										rpeLoad: sessInfo.rpeLoad,
										activityType: sessInfo.activityType,
										icon: sessInfo.icon,
										color: sessInfo.color,
										order: sessInfo.order,
										sessionType: sessInfo.sessionType,
										exercisesTotal: sessInfo.exercisesTotal,
										sessionTime: sessInfo.sessionTime,
										sessionURL: sessInfo.sessionURL
									}
								};
								programSessionsRight[i] = newEvent;
							}
							else{
								let calendar_no = 0;
								for(let j = 0; j < paste_sessions.length; j++){
									if(copySessions[i].id === paste_sessions[j]){
										calendar_no = paste_sessions_id[j];
									}
								}
								let newEvent = {
									id: calendar_no,
									title: evt.title,
									start: new_date.getFullYear() + '-' + dmonth + '-' + ddate + ' 00:00:00',
									durationEditable: false,
									startEditable: true,
									extendedProps: {
										sessAssId: calendar_no+'',
										sessionId: sessInfo.sessionId,
										hours: sessInfo.hours,
										minutes: sessInfo.minutes,
										sessTime: sessInfo.sessTime,
										unit: sessInfo.unit,
										distance: sessInfo.distance,
										rpeLoad: sessInfo.rpeLoad,
										activityType: sessInfo.activityType,
										icon: sessInfo.icon,
										color: sessInfo.color,
										order: 1,
										sessionType: sessInfo.sessionType,
										exercisesTotal: sessInfo.exercisesTotal,
										sessionTime: 0,
										sessionURL: ''
									}
								};
								programSessionsRight.push(newEvent);
							}
						}
					}
				}
			}
			this.setState({ programSessionsRight, saveProgramSessionsRight, addProgramSessionsRight, calendarNo });
		}


	}
	
	showHidePlannerBar = (e) => {
		e.preventDefault();
		this.setState({plannerBarShow: !this.state.plannerBarShow});
	}
	
	showPlannerAssignment = (e) => {
		e.preventDefault();
		this.props.showPlannerAssignment(this.state.club._id);
	}
	
	showHideGraph = (e) => {
		if(!this.state.plannerBarShowGraph){
			let plannerId = this.state.planner._id;
			let graphType = this.state.plannerBarGraphType;
			let startWeek = this.state.plannerBar.startWeek;
			getProgramsGraphDetail(plannerId, graphType, startWeek).then(res => {
				if(res.success === true){
					this.setState({plannerGraphData: {maxVal: res.maxVal, programArr: res.programArr}, plannerBarShowGraph: !this.state.plannerBarShowGraph});
				}
				else{
					alert(res.msg);
				}
			});
		}
		else{
			this.setState({plannerBarShowGraph: !this.state.plannerBarShowGraph});
		}
	}
	
	changePlannerGraphType = (e) => {
		let plannerId = this.state.planner._id;
		let graphType = e.target.value;
		let startWeek = this.state.plannerBar.startWeek;
		getProgramsGraphDetail(plannerId, graphType, startWeek).then(res => {
			if(res.success === true){
				this.setState({plannerGraphData: {maxVal: res.maxVal, programArr: res.programArr}, plannerBarGraphType: graphType});
			}
			else{
				alert(res.msg);
			}
		});
	}
	
	programMenu = (e, id) => {
		e.preventDefault();
		this.setState({programMenu: {show: true, x: e.pageX, y: e.pageY, id}});
	}
	
	displayProgramMenu(){
		if(this.state.programMenu.show){
			return (<div className="program-menu-cont" style={{left: this.state.programMenu.x+'px', top: this.state.programMenu.y+'px'}}><div className="program-menu-item" onClick={(e) => this.editProgram(e, this.state.programMenu.id)}>Edit</div><div className="program-menu-item" onClick={(e) => this.duplicateProgram(e, this.state.programMenu.id)}>Duplicate</div><div className="program-menu-item" onClick={(e) => this.removeProgram(e, this.state.programMenu.id)}>Remove</div></div>);
		}
		else{
			return null;
		}
	}
	
	closeProgramMenu(){
		this.setState({programMenu: {show: false, x: 0, y: 0, id: ''}});
	}
	
	editProgram = (e, programId) => {
		e.preventDefault();
		this.props.ShowEditProgram(programId);
	}
	
	duplicateProgram = (e, programId) => {
	
		e.preventDefault();
		this.setState({duplicateProgram: {programId, title: ''}});
	}
	
	removeProgram = (e, programId) => {
		e.preventDefault();
		let plannerId = this.state.planner._id;
		if (window.confirm("Are you sure you want to remove this program?")) {
			removeProgram(programId, plannerId).then(result => {
				if(result.success === true){
					this.setPlannerData(result, true);
				}
				else{
					alert(result.msg);
				}
			});
		}
	}
	
	duplicateProgramPopupClose = () => {
		this.setState({duplicateProgram: {programId: '', title: ''}});
	}
	
	handleDuplicateProgramTitle(e){
		this.setState({duplicateProgram: { ...this.state.duplicateProgram, title: e.target.value} });
	}
	
	handleDuplicateProgramSubmit(){
		if(this.state.duplicateProgram.title === ''){
			alert('Please enter program title');
		}
		else{
			let plannerId = this.state.planner._id;
			let programId = this.state.duplicateProgram.programId;
			let title = this.state.duplicateProgram.title;
			let userId = this.props.user.userId;
			duplicateProgram(programId, plannerId, title, userId).then(result => {
				if(result.success === true){
					this.setPlannerData(result, true);
				}
				else{
					alert(result.msg);
				}
			});
		}
	}
	
	plannerSplitDisplay(programId){
		if(programId == this.state.plannerProgram.programId){
			alert("Can not load same program on both sides");
		}
		else{
			getProgramSessions(programId)
				.then(result => {
					if (result.success === true) {
						this.setSplitProgram(programId, result, false);
					}
					else {
						alert(result.msg);
					}
				});
		}
	}
	
	setSplitProgram(programId, result, isUpdate){
		let session_events = [];
		let calendarNo = this.state.calendarNo;
		let splitProgram = {programId, startDate: result.startDate, title: result.title};
		
		if(this.calendarRef1.current !== null){
			let calendarApi1 = this.calendarRef1.current.getApi();
			calendarApi1.setOption('validRange', {start: splitProgram.startDate});
			calendarApi1.gotoDate(splitProgram.startDate);
		}
		
		result.sessions.forEach((item, ind) => {
			let session_date = new Date(result.startDate);
			session_date.setDate(session_date.getDate() + item.days);
			let sdate = ("0" + session_date.getDate()).slice(-2);
			let smonth = ("0" + (session_date.getMonth() + 1)).slice(-2);
			
			let obj = {
				id: calendarNo,
				title: item.title,
				start: session_date.getFullYear() + '-' + smonth + '-' + sdate + ' 00:00:00',
				durationEditable: false,
				startEditable: true,
				extendedProps: {
					sessAssId: item._id,
					sessionId: item.sessionId,
					hours: item.hours,
					minutes: item.minutes,
					sessTime: item.sessTime,
					unit: item.unit,
					distance: item.distance == undefined ? 0 : item.distance.$numberDecimal,
					rpeLoad: item.rpeLoad,
					activityType: item.activityType,
					icon: item.icon,
					color: item.color,
					order: item.order,
					sessionType: item.sessionType,
					exercisesTotal: item.exercisesTotal,
					sessionTime: item.sessionTime,
					sessionURL: item.sessionURL
				}
			}
			session_events.push(obj);
			++calendarNo;
		});
		if(isUpdate)
			this.setState({programSessionsRight: session_events, splitProgram, saveProgramSessionsRight: result.sessions, calendarNo});
		else
			this.setState({programSessionsRight: session_events, splitProgram, saveProgramSessionsRight: result.sessions, calendarNo, leftSidebarDisplay: false, rightSidebarDisplay: false, plannerBarShow: false});
	}
	
	showPlannerTitle(e){
		e.preventDefault();
		$('.plannerContent').show(1000);
		this.hidePlannerTitle();
	}
	
	hidePlannerTitle(){
		setTimeout(function () {
            $(".plannerContent").hide(500)
        }, 5000);
	}
	deleteWeekSessions(e){
		e.preventDefault();
		if (window.confirm("Are you sure you want to delete this week sessions?")) {
			let programSessions = [];
			let addProgramSessions = [];
			let saveProgramSessions = [];
			let newSessions = [];
			let addNewSessions = [];
			let saveNewSessions = [];
			
			if(e.currentTarget.dataset.calendar === 'calendar'){
				programSessions = [...this.state.programSessions];
				addProgramSessions = [...this.state.addProgramSessions];
				saveProgramSessions = [...this.state.saveProgramSessions];
			}
			else{
				programSessions = [...this.state.programSessionsRight];
				addProgramSessions = [...this.state.addProgramSessionsRight];
				saveProgramSessions = [...this.state.saveProgramSessionsRight];
			}
			
			let delete_sessions = [], delete_sessions_ass = [];
			$(e.currentTarget).parents('.fc-row.fc-week.fc-widget-content').find('.fc-event-container .e-id').each(function (ind, ele) {
				delete_sessions.push(parseInt($(ele).val()));
				delete_sessions_ass.push($(ele).parent().children('.sess-ass-id')[0].value);
			});
			if (delete_sessions.length > 0 ) {
				for(let i = 0; i < addProgramSessions.length; i++){
					if (!($.inArray(addProgramSessions[i]._id, delete_sessions) > -1)) {
						addNewSessions.push(addProgramSessions[i]);
					}
				}
				
				for(let i = 0; i < saveProgramSessions.length; i++){
					if (!($.inArray(saveProgramSessions[i]._id, delete_sessions_ass) > -1)) {
						saveNewSessions.push(saveProgramSessions[i]);
					}
				}
				
				for(let i = 0; i < programSessions.length; i++){
					if (!($.inArray(programSessions[i].id, delete_sessions) > -1)) {
						newSessions.push(programSessions[i]);
					}
				}
				if(e.currentTarget.dataset.calendar === 'calendar')
					this.setState({ programSessions: newSessions, saveProgramSessions: saveNewSessions, addProgramSessions: addNewSessions });
				else
					this.setState({ programSessionsRight: newSessions, saveProgramSessionsRight: saveNewSessions, addProgramSessionsRight: addNewSessions });
			}
		}
	}
	handleSelectedSession(element){

		let highligh=this.state.selectedSSessions;
		let that=element.target;
 	//alert('function called'); 
					// if ($(this).closest('.fc-unthemed').attr('id') == 'calendar1' && split_program_id == '') {
					// 	if ($('.session-drag').hasClass('active')) {
					// 		alert('Please Select a Programme');
					// 		return false;
					// 	}
					// }
					if ($('.ss_session').hasClass('active')) {
						if ($('#program-title-list option:selected').val() == '') {
							alert('Please Select a Programme');
							return false;
						}
				
						if ($(that).hasClass('fc-disabled-day') || $(that).attr('data-date') == '') {
				
						} else {
							if ($(that).hasClass('selectedDate')) {
								$(that).removeClass('selectedDate');
								var itemtoRemove = $(that).attr('data-date');
								highligh.splice($.inArray(itemtoRemove, highligh), 1);
							} else {
								$(that).addClass('selectedDate');
								 highligh.push($(that).attr('data-date'));
							}
						}
						if (highligh.length > 0) {
							$('.ss_session .ntes-per-btns').hide();
							$('.ss_session.active .ntes-per-btns').show();
							 $('.session-drag.active .note-ad-mbt').hide();
						} else {
							$('.ss_session.active .ntes-per-btns').hide();
							 $('.ss_session.active .note-ad-mbt').show();
						}
				
					}
					
					this.setState({ selectedSSessions: highligh });
	}
	handleSingleDay = (info) => { 
		if(this.state.plannerProgram.programId === ''){
			alert('Please select a program');
			return;
		}

		let daySessionDrag='';
		let  monthSessionDrag1 = "";
		 let date=info.dateStr;
		 let daySessionEl = document.getElementById('calendar');
		 var mbtDay = $("#calendar .fc-day-top[data-date='" + date + "']");
		 if (mbtDay.find('.single-day-session').length == 0) {
		   $(mbtDay).find('.fc-day-number').before("<a href='javascript:;'class='single-day-session' data-calendar='calendar' data-calendar-id='calendar' data-copysingleday='yes' style='' title='Drag single day sessions'><i class='fa fa-arrows' aria-hidden='true'></i></a>");
		   if (daySessionDrag !== "") {
			 daySessionDrag.destroy();
		   }
		   daySessionDrag = new Draggable(daySessionEl, {
			 itemSelector: ".single-day-session",
			 eventData: function (eventEl) {
			   return {
				 id: eventEl.getAttribute("data-calendar"),
				 create: false,
			   };
			 },
		   });
	   }
	 }
	 handleSingleDayRight = (info) => { 
		let daySessionDrag='';
		let  monthSessionDrag1 = "";
		 let date=info.dateStr;
		 let daySessionEl = document.getElementById('calendar1');
		 var mbtDay = $("#calendar1 .fc-day-top[data-date='" + date + "']");
		 if (mbtDay.find('.single-day-session').length == 0) {
		   $(mbtDay).find('.fc-day-number').before("<a href='javascript:;'class='single-day-session' data-calendar='calendar1' data-calendar-id='calendar1' data-copysingleday='yes' style='' title='Drag single day sessions'><i class='fa fa-arrows' aria-hidden='true'></i></a>");
		   if (daySessionDrag !== "") {
			 daySessionDrag.destroy();
		   }
		   daySessionDrag = new Draggable(daySessionEl, {
			 itemSelector: ".single-day-session",
			 eventData: function (eventEl) {
			   return {
				 id: eventEl.getAttribute("data-calendar"),
				 create: false,
			   };
			 },
		   });
	   }
	  } 
	 handleRecoveryDay=(info)=>{

		 let plannerBar = this.state.plannerBar;
		 let recovery_days=plannerBar.recovery_days;
		  let cal_date=info.el.getAttribute("data-date");
		  if(cal_date!= undefined){
		  let tokens = cal_date.split('-'),
			mm = tokens[1];
			if (mm.charAt(0) === '0') tokens[1] = mm.replace("0", "");
	 		cal_date = tokens[0] + "-" +tokens[1]  + "-" + tokens[2];
			 if (recovery_days.indexOf(cal_date) >= 0) {
			$(info.el).addClass('fc-recovery-day');
			$(info.el).attr('title', 'Recovery Day');
		}
	}
	 }
	render() {
		if (this.state.club === null || this.state.planner === null) {
			return <Redirect to="/home" />;
		}
		if (this.state.loading) {
			return (
				<div className='profile-container-loading'>
					<img src={loading} alt="" />
				</div>
			);
		}
		let popup;
		if(this.state.duplicateProgram.programId){
			popup = <Modal
						centered
						size="lg"
						show={true}
						onHide={this.duplicateProgramPopupClose.bind(this)}
						dialogClassName="duplicate-program-dialog"
					>
						<Modal.Header closeButton>
							<Modal.Title>Duplicate Program</Modal.Title>
						</Modal.Header>
						<Modal.Body>
							<Form>
								<Form.Group controlId="duplicateProgramTitle">
									<Form.Label>Program Title</Form.Label>
									<Form.Control type="text" value={this.state.duplicateProgram.title} onChange={this.handleDuplicateProgramTitle.bind(this)} />
								</Form.Group>
							</Form>
						</Modal.Body>
						<Modal.Footer>
							<Button variant="coaching-mate" onClick={this.handleDuplicateProgramSubmit.bind(this)}>Duplicate Program</Button>
						</Modal.Footer>
					</Modal>;
		}
		
		let splitHtml;
		let leftCalendarCont = {};
		let splitMainClass = '';
		if(this.state.splitProgram.programId){
			leftCalendarCont = {width: '50%', float:'left'};
			splitMainClass = " adjust-overlapping-items";
			splitHtml = <div className="cstmtoolbx cstmtoolbx-split-view" style={{display: 'block', width: '50%', float:'left'}}>
							<div className="row clearfix">
								<div className="col-md-4">
									<div className="split-view-load-program">
										<span id="cm_split_view_program_name">{this.state.splitProgram.title}</span>
									</div>
								</div>
								<div className="col-md-8">
									<div className="slmnthin new-classset">
										<button type="button" className="fc-load-program-button fc-state-default fc-corner-left fc-corner-right" onClick={(e) => this.loadPrograms(e)}>Load Program</button>
										<a id="update-split-program-right" title="Save Program" href="" onClick={(e) => this.saveProgramRight(e)}>Save</a>
									</div>
								</div>
							</div>
							<div id="calendar1">
								<FullCalendar
									defaultView="dayGridMonth"
									editable={true}
									droppable={true}
									firstDay={1}
									dragRevertDuration={0}
									eventOrder={"order,title"}
									plugins={[dayGridPlugin, interactionPlugin]}
									defaultDate={this.state.splitProgram.startDate}
									validRange={{start: this.state.splitProgram.startDate}}
									ref={this.calendarRef1}
									events={this.state.programSessionsRight}
									eventRender={this.handleEventRenderRight}
									drop={this.handleDropRight}
									eventDrop={this.handleEventDropRight}
									eventReceive={this.handleEventReceiveRight}
									dateClick={this.handleSingleDayRight}
								/>
							</div>
						</div>;
		}

		return (
			<div className={"container-large clearfix"+splitMainClass}>
				{popup}
				{this.displayProgramMenu()}
				<div id="wrapper" className={"coach-planner"+(this.state.leftSidebarDisplay ? "": " toggled-left")+(this.state.rightSidebarDisplay ? "": " toggled-right")}>
					<LeftSidebar club={this.state.club} sidebarDisplay={this.state.leftSidebarDisplay} leftSidebarChange={this.leftSidebarChange} />
					<div id="page-content-wrapper" className="mbt-wrapper-option">
						<div className="container-fluid">
							<div className="row" style={{ display: 'block' }}>
								<div className="col-lg-12-large">
									<div className="top-header-bar mrgn-btm0 adjust-height slickno-abs">
										<a href="#menu-toggle-left" className="menu-toggle-left" id="show-after-left-close" style={!this.state.leftSidebarDisplay ? {display: 'inline-block'} : {}} onClick={(e) => {e.preventDefault();this.leftSidebarChange()}}>
											<span className="icon-bar"></span>
											<span className="icon-bar"></span>
											<span className="icon-bar"></span>
										</a>
										<div className="tp-top">
											<div className="tabs-head">
												<ul className="nav nav-tabs">
													<li><a className="active plannerTab" href="#" onMouseOver={(e) => this.showPlannerTitle(e)}>Planner</a></li>
												</ul>
											</div>
										</div>
										<div className="icons-pack-small">
											<a href="" className="load-programe" data-target="#loadPlanner" title="Load Planner" style={{display: 'none'}}><i className="fa fa-map" aria-hidden="true"></i></a>
											{this.props.type === 'membership' && <a href="" className="load-programe" data-toggle="modal" data-target="#plannerAssignment" title="Planner Assignment" onClick={(e) => this.showPlannerAssignment(e)}><img src={plannerAssignmentIcon} alt="" /></a>}
										</div>
										<div className="butons-icons-pack width40">
											<div className="checkbox-buttons d-flex align-items-center mrdr-bmt0">
												<div className="custom-checkbox-items">
													<input type="checkbox" name="" value="" id="switch-to-graph" onClick={(e) => this.showHideGraph(e)} />
													<label htmlFor="switch-to-graph" id="label-graph-view" title="Graph View"><span className="options-check">Graph View</span></label>
												</div>
												<div id="planner-graph-type-top" className="styled-select top-one" style={{ display: (this.state.plannerBarShow && this.state.plannerBarShowGraph ? '' : 'none') }}>
													<select id="planner-graph-type" onChange={(e) => this.changePlannerGraphType(e)}>
														<option value="time">Show Time</option>
														<option value="distance">Show Distance</option>
														<option value="load">Show Load</option>
													</select>
												</div>
											</div>
										</div>
										<div className="option-bat-p display-inline-b">
											<a href="" className={"cheron-up-icon"+(this.state.plannerBarShow ? "" : " icon-change")} id="hide-topbar" onClick={(e) => this.showHidePlannerBar(e)}>
												<i className="fa fa-chevron-up" aria-hidden="true"></i>
												<i className="fa fa-chevron-down" aria-hidden="true"></i>
											</a>
											<div className="inline-ele arrows-year next-year">
												<button type="button" data-role="none" className="slick-prev slick-arrow " aria-label="Previous" role="button">Back</button>
												<div className="year-duration" style={{backgroundColor: '#3cb779', color: '#fff'}}>{this.state.plannerBar.start_year} - {this.state.plannerBar.end_year}</div>
												<button type="button" data-role="none" className="slick-next slick-arrow" aria-label="Next" role="button" >Next</button>
											</div>
										</div>
										<a href="#menu-toggle-right" className="menu-toggle-right search-icon f-right" id="show-after-right-close" title="Search" style={!this.state.rightSidebarDisplay ? {visibility: 'visible'} : {}} onClick={(e) => {e.preventDefault();this.rightSidebarChange()}}>
											<i className="fa fa-search" aria-hidden="true"></i>
										</a>
									</div>
									<div className="clearfix plannerContent" style={{display: 'none', paddingLeft: '20px'}}>
										<p>Planner Title : <span id="loaded-planner-title">{this.state.planner.title}</span></p>
									</div>
									<div className="row-counter next-year" id="graph__bydefaul" ref={this.plannerBarCont} style={{ display: (this.state.plannerBarShow && !this.state.plannerBarShowGraph ? '' : 'none'), overflow: 'hidden' }}>
										<div className="layer-lines" style={{ width: this.state.weeksContWidth + 'px', left: this.state.plannerBarPosition.x + 21 }}>
											<div id="layer-1"></div>
											<div id="layer-2"></div>
										</div>
										<div className="layer-indicator">
											<span className="layer-indicator-layer">L1</span>
											<span className="layer-indicator-layer">L2</span>
											<span className="layer-indicator-layer">L3</span>
											<span className="layer-indicator-layer"></span>
										</div>
										<div className="year-container year16" style={{ zIndex: 2, width: this.state.weeksContWidth + 'px', overflowX: 'scroll', position: 'relative' }}>
											{this.displayPlannerBar()}
										</div>
									</div>
									<div className="row-counter graph-view-show-time" id="graph__show__time" ref={this.graphBarCont} style={{ display: (this.state.plannerBarShow && this.state.plannerBarShowGraph ? '' : 'none'), overflow: 'hidden', position: 'relative' }}>
										<div className="layer-lines" style={{ width: this.state.weeksContWidth + 'px', left: this.state.graphBarPosition.x }}>
											<div id="layer-1" style={{ borderBottom: '0px', height: '1px' }}></div>
										</div>
										<div className="year-container year-container-graph year16" style={{ zIndex: 2, width: this.state.weeksContWidth + 'px', overflowX: 'scroll', position: 'relative' }}>
											<PlannerBarGraph position={this.state.graphBarPosition} onDrag={this.handleGraphDrag} graphWeekbarHtml={this.graph_weekbar_html} displayPlannerGraph={this.displayPlannerGraph()} />
										</div>
									</div>
									<div className="grid-layer-container-mbt scrollmenu" id="grid-color-selection">

									</div>
									<div className="cstmtoolbx adjust-tp-space" style={leftCalendarCont}>
										<div className="row clearfix">
											<div className="col-md-4">
												<div className="custom-select">
													<select className="form-control" id="program-title-list" name="program-title-list" value={this.state.plannerProgram.programId} onChange={this.selectPlannerProgram}>
														<option value="">Select Program</option>
														{
															this.state.planner.programs.length !== 0 && this.state.planner.programs.map(program => (
																<option key={'planner-program-select-' + program.programId} value={program.programId} data-start-date={program.startDate.split('T')[0]}>{program.title}</option>
															))
														}
													</select>
												</div>
											</div>
											<div className="col-md-8">
												<div className="icons-mixed asdffs" style={{ display: this.state.splitProgram.programId ? 'none' : '' }}>
													<span style={{display: 'none'}}><a href="" className="show-planner-seesions-print" title="Print Planner Sessions"><img src={sessionPrintIcon} alt="" /></a></span>
													<span style={{display: 'none'}}><a href="" className="show-program-graph" title="View Program Graph"><img src={programGraphIcon} alt="" /></a></span>
													<span><a href="" id="save-program" title="Save Program" onClick={(e) => this.saveProgram(e)}><img src={programSaveIcon} alt="" /></a></span>
												</div>
												<div className="slmnthin adjust-itsmt"></div>
												<span className="update-program-wrapper" style={{ display: this.state.splitProgram.programId ? '' : 'none' }}><a id="update-split-program" href="" onClick={(e) => this.saveProgramSplit(e)}>Done</a></span>
											</div>
										</div>
										<div id="calendar">
											<span>
											<FullCalendar
												
												defaultView="dayGridMonth"
												editable={true}
												droppable={true}
												firstDay={1}
												dragRevertDuration={0}
												eventOrder={"order,title"}
												plugins={[dayGridPlugin, interactionPlugin]}
												ref={this.calendarRef}
												events={this.state.programSessions}
												eventRender={this.handleEventRender}
												drop={this.handleDrop}
												eventDrop={this.handleEventDrop}
												eventReceive={this.handleEventReceive}
												dateClick={this.handleSingleDay}
												dayRender={this.handleRecoveryDay}
											/>
											</span>
										</div>
									</div>
									{splitHtml}
								</div>
							</div>
						</div>
						<RightSidebar club={this.state.club} rightSidebarChange={this.rightSidebarChange} plannerSplit={'yes'} plannerSplitDisplay={this.plannerSplitDisplay} />
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		selectedProgramId: state.planner.rightProgramId,
		sessData: state.planner.sesstimeData,
		user: state.auth.user,
		selected_populated_session: state.planner.selectedPopulteSession,
	};
};

export default connect(mapStateToProps, {selectedPopulateSession,showStrengthSession, showAddSession, showSessionDescription, viewSessions, editSessionTime, ShowEditProgram, loadProgram, showPlannerAssignment })(Planner);