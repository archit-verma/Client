import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import LeftSidebar from './LeftSidebar';
import Draggable from 'react-draggable';
import { getServerUrl, getAthletePlanner, getProgramsGraphDetail, getPlannerLayer, getSessionDescriptionById } from '../../utils/api.js';
import { render } from 'react-dom';
import { showStrengthSession, showSessionDescription, viewSessions } from '../../actions';
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import loading from "../../assets/loading.svg";
import $ from 'jquery';

const monthNamesShort = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function cm_weekly_summary(){
	$('.fc-unthemed .fc-view-container .fc-dayGridMonth-view thead.fc-head .fc-head-container tr .cm-weekly-summary').remove();
    $('.fc-unthemed .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-day-grid .fc-row.fc-week .fc-bg tr td.summary-mbt-td').remove();
    $('.fc-unthemed .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-content-skeleton thead tr td.cm-weekly-summary-top').remove();
    $('.fc-unthemed .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-content-skeleton thead tr td.cm-weekly-summary-top1').remove();
	$('.fc-unthemed .fc-view-container .fc-dayGridMonth-view thead.fc-head .fc-head-container tr').append('<th class="fc-day-header fc-widget-header cm-weekly-summary"><span>Summary</span></th>');
	for (let i = 1; i < 7; i++) {
		let total_act_dist = 0;
		let total_act_time = 0;
		let total_act_rpe_load = 0;
		let session_activity_total = new Array();
		$('.fc-unthemed .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-day-grid .fc-row.fc-week:nth-child(' + i + ') .fc-content-skeleton tbody tr td.fc-event-container').each(function(){
			let sess_activity = $(this).find('.sess_activity').val();
			let sess_img = $(this).find('.media-left img').attr('src');
			let dist = $(this).find('.distance').val();
			let units = $(this).find('.units').val();
			let hours = $(this).find('.hours').val();
			let minutes = $(this).find('.minutes').val();
			let rpe_load = $(this).find('.rpe_load').val();
			if (units == 'km')
				total_act_dist = total_act_dist + parseFloat(dist);
			else if (units == 'miles')
				total_act_dist = total_act_dist + (parseFloat(dist) * 1.609344);
			total_act_time = total_act_time + parseInt(minutes) + (parseInt(hours) * 60);
			total_act_rpe_load = total_act_rpe_load + parseInt(rpe_load);
			if (!session_activity_total.hasOwnProperty(sess_activity)) {
				session_activity_total[sess_activity] = new Array();
				if (units == 'miles')
					session_activity_total[sess_activity]['dist'] = (parseFloat(dist) * 1.609344);
				else
					session_activity_total[sess_activity]['dist'] = parseFloat(dist);
				session_activity_total[sess_activity]['time'] = parseInt(minutes) + (parseInt(hours) * 60);
				session_activity_total[sess_activity]['load'] = parseInt(rpe_load);
			} else {
				if (units == 'miles')
					session_activity_total[sess_activity]['dist'] += (parseFloat(dist) * 1.609344);
				else
					session_activity_total[sess_activity]['dist'] += parseFloat(dist);
				session_activity_total[sess_activity]['time'] += parseInt(minutes) + (parseInt(hours) * 60);
				session_activity_total[sess_activity]['load'] += parseInt(rpe_load);
			}
			session_activity_total[sess_activity]['sess_img'] = sess_img;
		});
		let activity_top_html = '';
		let activity_total_html = '';
		for (let key in session_activity_total) {
			let total_dist = session_activity_total[key]['dist'];
			let total_time = session_activity_total[key]['time'];
			if (total_dist != '0')
				total_dist = total_dist.toFixed(1);
			activity_top_html += '<span class="activity-type-total selected"><img src="' + session_activity_total[key]['sess_img'] + '" id="activity-total-' + key + i + '" title="' + key + ' stats"></img></span> ';
			activity_total_html += '<div class="summary-panel activity-total-' + key + i + '" style="display:none;"><div class="row-mbt-re"><span class="light-gray-mbt">Distance:</span><span class="drk-gray-mbt"><span class="activity-total-dist">' + total_dist + '</span> Km</span></div><div class="row-mbt-re"><span class="light-gray-mbt">Time:</span><span class="drk-gray-mbt activity-total-time">' + Math.floor((total_time / 60)) + ':' + (total_time % 60) + '</span><span class="activity-total-time-hidden" style="display:none;">' + total_time + '</span></div><div class="row-mbt-re"><span class="light-gray-mbt load">Load:</span><span class="drk-gray-mbt load activity-total-load">' + session_activity_total[key]['load'] + '</span></div></div>';
		}
		if (activity_total_html == '')
			activity_total_html = '<div class="summary-panel"><div class="row-mbt-re"><span class="light-gray-mbt">Distance:</span><span class="drk-gray-mbt">0 Km</span></div><div class="row-mbt-re"><span class="light-gray-mbt">Time:</span><span class="drk-gray-mbt">0:0</span></div><div class="row-mbt-re"><span class="light-gray-mbt">Load:</span><span class="drk-gray-mbt">0</span></div></div>';
		else
			activity_total_html += '<div class="summary-panel activity-total-multiple"><div class="row-mbt-re"><span class="light-gray-mbt">Distance:</span><span class="drk-gray-mbt"><span class="activity-total-multiple-dist">' + total_act_dist.toFixed(1) + '</span> Km</span></div><div class="row-mbt-re"><span class="light-gray-mbt">Time:</span><span class="drk-gray-mbt activity-total-multiple-time">' + Math.floor((total_act_time / 60)) + ':' + (total_act_time % 60) + '</span></div><div class="row-mbt-re"><span class="light-gray-mbt">Load:</span><span class="drk-gray-mbt activity-total-multiple-load">' + total_act_rpe_load + '</span></div></div>';
		$('.fc-unthemed .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-day-grid .fc-row.fc-week:nth-child(' + i + ') .fc-bg tr').append('<td class="fc-day fc-widget-content summary-mbt-td"><div class="summary-container">' + activity_top_html + activity_total_html + '</div></td>');
	}
	$('.fc-unthemed .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-content-skeleton thead tr').append('<td class="fc-day-top cm-weekly-summary-top"></td>');
	$('.fc-unthemed .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-content-skeleton tbody tr').append('<td class="cm-weekly-summary-top1"></td>');
};

function activity_type_total_func(){
	$('body').on('click', '.activity-type-total img', function () {
		let parent = $(this).parent();
		let parent_parent = $(parent).parent();
		if ($(parent).hasClass('selected'))
			$(parent).removeClass('selected');
		else
			$(parent).addClass('selected');
		$(parent_parent).find('.summary-panel').hide();
		//$(this).parent().parent().find('.summary-panel.'+$(this).attr('id')).show();
		let activity_type_total = $(parent_parent).find('.activity-type-total.selected img');
		let total_dist = 0;
		let total_time = 0;
		let total_load = 0;
		if (activity_type_total.length <= 0)
			activity_type_total = $(parent_parent).find('.activity-type-total img');
		$.each(activity_type_total, function (key, val) {
			let summary_panel = $(parent_parent).find('.summary-panel.' + $(val).attr('id'));
			total_dist += parseFloat($(summary_panel).find('.activity-total-dist').html());
			total_time += parseFloat($(summary_panel).find('.activity-total-time-hidden').html());
			total_load += parseFloat($(summary_panel).find('.activity-total-load').html());
		});
		let summary_panel_multiple = $(parent_parent).find('.summary-panel.activity-total-multiple');
		if (total_dist != '0')
			total_dist = total_dist.toFixed(1);
		$(summary_panel_multiple).find('.activity-total-multiple-dist').html(total_dist);
		$(summary_panel_multiple).find('.activity-total-multiple-time').html(Math.floor((total_time / 60)) + ':' + (total_time % 60));
		$(summary_panel_multiple).find('.activity-total-multiple-load').html(total_load);
		$(summary_panel_multiple).show();
	});
}

class AthletePlanner extends Component {
	constructor(props) {
		super(props);
		this.state = {
			calendarNo: 1,
			club: '',
			planner: '',
			sessions: [],
			plannerBar: '',
			plannerBarShow: true,
			plannerBarShowGraph: false,
			plannerBarGraphType: 'time',
			weeksContWidth: 0,
			plannerBarPosition: { x: 0, y: 0 },
			graphBarPosition: { x: 0, y: 0 },
			plannerProgram: { programId: '', startDate: new Date() },
			programSessions: [],
			plannerGraphData: {maxVal: 0, programArr: []},
			layerNo: 1,
			loading: true
		}
		this.calendarRef = React.createRef();
		this.plannerBarCont = React.createRef();
		this.graphBarCont = React.createRef();
		this.changeLayer = this.changeLayer.bind(this);
		this.selectPlannerProgram = this.selectPlannerProgram.bind(this);
	}
	
	componentDidMount() {
		activity_type_total_func();
		getAthletePlanner(this.props.clubSlug, this.props.user._id, this.state.layerNo)
			.then(result => {
				if (result.club === null) {
					this.setState({ club: null });
				}
				else if (result.planner === null) {
					this.setState({ planner: null });
				}
				else {
					result.layerNo = this.state.layerNo;
					this.setPlannerData(result, false);
					//cm_weekly_summary();
					$('body').on("click", "button.fc-prev-button, button.fc-next-button", function(){ cm_weekly_summary(); });
					$(".fc-today-button").click(function(){ cm_weekly_summary(); });
					//setTimeout(this.cm_weekly_summary(), 1000);
				}
			});
	}
	
	componentWillUnmount() {
		
	}
	
	componentDidUpdate(prevProps, prevState) {
		if(prevState.programSessions !== this.state.programSessions){
			setTimeout(function(){cm_weekly_summary()}, 100);
			//cm_weekly_summary();
		}
	}
	
	setPlannerData(result, isUpdate){
		let planner_bar = { curr_month_no: 0, curr_week_no: -1, max_comp_week_no: 0, tc_start_week: -1 };
		let weeksContWidth = 0;
		let weekFirstDay = 1;
		let week_counter = 1;
		let tc_count = -1;
		let maxCompDate = 0, maxProgramWeek = 0, maxCompTime = 0, tc_cycle_start_time = 0;
		let weekarr = [], recovery_days = [];
		let next_start_week = '';
		let cur_time = new Date();
		let planner = result.planner;
		let sessions = result.sessions;
		let session_events = [];
		let layerNo = result.layerNo;
		
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
		
		let calendarNo = this.state.calendarNo;
		if (planner.programs) {
			planner.programs.forEach((item, ind) => {
				let prog_date = new Date(item.startDate.split('T')[0]);
				prog_date.setDate(prog_date.getDate() + (item.weeks * 7));
				if (maxProgramWeek === 0)
					maxProgramWeek = prog_date;
				if (prog_date > maxProgramWeek)
					maxProgramWeek = prog_date;
				
				if(item.layer === layerNo && sessions[ind] !== undefined){
					sessions[ind].programSessions.forEach((item1, ind1) => {
						let session_date = new Date(item.startDate.split('T')[0]);
						session_date.setDate(session_date.getDate() + item1.days);
						let sdate = ("0" + session_date.getDate()).slice(-2);
						let smonth = ("0" + (session_date.getMonth() + 1)).slice(-2);
						
						let obj = {
							id: calendarNo,
							title: item1.title,
							start: session_date.getFullYear() + '-' + smonth + '-' + sdate,
							durationEditable: false,
							startEditable: false,
							extendedProps: {
								sessAssId: item1._id,
								sessionId: item1.sessionId,
								hours: item1.hours,
								minutes: item1.minutes,
								sessTime: item1.sessTime,
								unit: item1.unit,
								distance: item1.distance == undefined ? 0 : item1.distance.$numberDecimal,
								rpeLoad: item1.rpeLoad,
								activityType: item1.activityType,
								icon: item1.icon,
								color: item1.color,
								order: item1.order,
								sessionType: item1.sessionType,
								exercisesTotal: item1.exercisesTotal,
								sessionTime: item1.sessionTime,
								sessionURL: item1.sessionURL,
								programId: item.programId,
								startDate: item.startDate.split('T')[0]
							}
						}
						session_events.push(obj);
						++calendarNo;
					});
				}
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
		weeksContWidth = weekarr.length * 21;
		
		if(isUpdate)
			this.setState({ planner: result.planner, sessions: result.sessions, plannerBar: planner_bar, weeksContWidth, programSessions: session_events, calendarNo, layerNo });
		else
			this.setState({ club: result.club, planner: result.planner, sessions: result.sessions, plannerBar: planner_bar, weeksContWidth, programSessions: session_events, calendarNo, loading: false });
	}
	
	changeLayer = (e) => {
		let layerNo = parseInt(e.target.value);
		let plannerId = this.state.planner._id;
		getPlannerLayer(plannerId, layerNo)
			.then(result => {
				result.layerNo = layerNo;
				this.setPlannerData(result, true);
				//cm_weekly_summary();
			});
	}
	
	selectPlannerProgram = (e) => {
		let session_events = [];
		let calendarNo = this.state.calendarNo;
		let layerNo = this.state.layerNo;
		let planner = this.state.planner;
		let sessions = this.state.sessions;
		
		if(e.target.value === ''){
			let plannerProgram = {
				programId: '',
				startDate: new Date()
			};
			
			let session_events = [];
			let calendarNo = this.state.calendarNo;
			let layerNo = this.state.layerNo;
			let planner = this.state.planner;
			if (planner.programs) {
				planner.programs.forEach((item, ind) => {
					if(item.layer === layerNo){
						sessions[ind].programSessions.forEach((item1, ind1) => {
							let session_date = new Date(item.startDate.split('T')[0]);
							session_date.setDate(session_date.getDate() + item1.days);
							let sdate = ("0" + session_date.getDate()).slice(-2);
							let smonth = ("0" + (session_date.getMonth() + 1)).slice(-2);
							
							let obj = {
								id: calendarNo,
								title: item1.title,
								start: session_date.getFullYear() + '-' + smonth + '-' + sdate,
								durationEditable: false,
								startEditable: false,
								extendedProps: {
									sessAssId: item1._id,
									sessionId: item1.sessionId,
									hours: item1.hours,
									minutes: item1.minutes,
									sessTime: item1.sessTime,
									unit: item1.unit,
									distance: item1.distance == undefined ? 0 : item1.distance.$numberDecimal,
									rpeLoad: item1.rpeLoad,
									activityType: item1.activityType,
									icon: item1.icon,
									color: item1.color,
									order: item1.order,
									sessionType: item1.sessionType,
									exercisesTotal: item1.exercisesTotal,
									sessionTime: item1.sessionTime,
									sessionURL: item1.sessionURL,
									programId: item.programId,
									startDate: item.startDate.split('T')[0]
								}
							}
							session_events.push(obj);
							++calendarNo;
						});
					}
				});
			}
			
			this.setState({programSessions: session_events, plannerProgram, calendarNo});
		}
		else{
			let plannerProgram = {
				programId: e.target.value,
				startDate: e.target.options[e.target.options.selectedIndex].attributes.getNamedItem('data-start-date').value
			};
			
			if (planner.programs) {
				planner.programs.forEach((item, ind) => {
					if(item.layer === layerNo && plannerProgram.programId === item.programId){
						let calendarApi = this.calendarRef.current.getApi();
						calendarApi.gotoDate(plannerProgram.startDate);
						
						sessions[ind].programSessions.forEach((item1, ind1) => {
							let session_date = new Date(item.startDate.split('T')[0]);
							session_date.setDate(session_date.getDate() + item1.days);
							let sdate = ("0" + session_date.getDate()).slice(-2);
							let smonth = ("0" + (session_date.getMonth() + 1)).slice(-2);
							
							let obj = {
								id: calendarNo,
								title: item1.title,
								start: session_date.getFullYear() + '-' + smonth + '-' + sdate,
								durationEditable: false,
								startEditable: false,
								extendedProps: {
									sessAssId: item1._id,
									sessionId: item1.sessionId,
									hours: item1.hours,
									minutes: item1.minutes,
									sessTime: item1.sessTime,
									unit: item1.unit,
									distance: item1.distance == undefined ? 0 : item1.distance.$numberDecimal,
									rpeLoad: item1.rpeLoad,
									activityType: item1.activityType,
									icon: item1.icon,
									color: item1.color,
									order: item1.order,
									sessionType: item1.sessionType,
									exercisesTotal: item1.exercisesTotal,
									sessionTime: item1.sessionTime,
									sessionURL: item1.sessionURL,
									programId: item.programId,
									startDate: item.startDate.split('T')[0]
								}
							}
							session_events.push(obj);
							++calendarNo;
						});
					}
				});
			}
			
			this.setState({programSessions: session_events, plannerProgram, calendarNo});
		}
	}
	
	handleEventRender = (info) => {
		let sessInfo = info.event.extendedProps;
		let time = new Date().getTime();
		
		render(
			<div className="fc-content" style={{ backgroundColor: sessInfo.color }}>
				<ContextMenu id={time+sessInfo.sessAssId}>
					<MenuItem onClick={this.handleClick}>Mark Done</MenuItem>
					{
						(sessInfo.sessionType === 'normal') ?
							<MenuItem onClick={() => this.viewSession(sessInfo.sessionId)}>View</MenuItem> : <MenuItem onClick={() => this.showSSession(sessInfo.sessionId, sessInfo.programId, sessInfo.startDate)}>View</MenuItem>
					}
				</ContextMenu>
				<ContextMenuTrigger id={time+sessInfo.sessAssId}>
					<span style={{ width: '100%', backgroundColor: sessInfo.color }} className="fc-title snbx sn-run">
						<div className="media snbx sn-run" style={{ backgroundColor: sessInfo.color, display: 'none' }}></div>
							<div className="media-left"><img src={'/uploads/images/' + sessInfo.icon} alt="" /></div>
							<div className="media-body"><h4 className="media-heading">{info.event.title}</h4></div>
							{
								(sessInfo.sessionType === 'normal') ?
									<p>{sessInfo.distance + sessInfo.unit + ' ' + sessInfo.hours + ':' + sessInfo.minutes + ',' + sessInfo.rpeLoad + ' Load'}</p> :
									<p>{sessInfo.exercisesTotal + ' Exercises'}</p>
							}
							<div className="sess-desc-icon" onClick={() => this.ShowSessionDesc(sessInfo.sessionId)} ><img src="/uploads/images/desc-icon2.png" alt="" /></div>
							<input type="hidden" className="sess_activity" value={sessInfo.activityType} />
							<input type="hidden" className="distance" value={sessInfo.distance} />
							<input type="hidden" className="units" value={sessInfo.unit} />
							<input type="hidden" className="hours" value={sessInfo.hours} />
							<input type="hidden" className="minutes" value={sessInfo.minutes} />
							<input type="hidden" className="rpe_load" value={sessInfo.rpeLoad} />
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
	
	viewSession(id) {
		this.props.viewSessions(id);
	}
	
	showSSession(id, programId, programStartDate) {
		let valObj = {};
		valObj['club_id'] = this.state.club._id;
		valObj['planner_id'] = this.state.planner._id;
		valObj['session_id'] = id;
		valObj['program_id'] = programId;
		valObj['program_start_date'] = programStartDate;
		valObj['user_id'] = this.props.user.userId;
		this.props.showStrengthSession(valObj);
	}
	
	ShowSessionDesc(id) {
		getSessionDescriptionById(id).then(sessDess => {
			this.props.showSessionDescription(sessDess.description);
		})
	}
	
	displayPlannerBar() {
		let weekbar_html = new Array();
		this.graph_weekbar_html = new Array();
		let time = new Date().getTime();

		let planner = this.state.planner;
		let plannerBar = this.state.plannerBar;
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
				let layerNo = this.state.layerNo;
				planner.programs.forEach((item2, ind2) => {
					if(item2.layer === layerNo){
						let prog_date = item2.startDate.split('T')[0];
						if (item === prog_date) {
							let prog_width = item2.weeks * 21;
							let margin_top = 25;
							if (item2.layer === 2)
								margin_top = 45;
							else if (item2.layer === 3)
								margin_top = 65;
							else if (item2.layer === 4)
								margin_top = 85;
							
							program_html.push(<div key={'planner-program-'+item2.programId} draggable className="dragable-srip resizable program-drag" onDragStart={(e) => this.onDragStart(e, item2.programId, item2.title, item2.color, item2.weeks)} onContextMenu={(e) => this.programMenu(e, item2.programId)} title={item2.title} style={{ backgroundColor: item2.color, marginTop: margin_top + 'px', width: prog_width + 'px' }}></div>);
						}
					}
				});
			}

			weekbar_html.push(<div key={'programs-week-box-' + item} className="week-box" title={item}><div className={"droppable week-box-layer week-box-layer1"} data-layer="1" onDragOver={(e) => this.onDragOver(e)} onDragEnter={(e) => this.onDragEnter(e, 1, item)}  onDragLeave={(e) => this.onDragLeave(e, 1, item)} onDrop={(e) => this.onDrop(e, 1, item)}></div><div className={"droppable week-box-layer week-box-layer2"} data-layer="2" onDragOver={(e) => this.onDragOver(e)} onDragEnter={(e) => this.onDragEnter(e, 2, item)} onDragLeave={(e) => this.onDragLeave(e, 2, item)} onDrop={(e) => this.onDrop(e, 2, item)}></div><div className={"droppable week-box-layer week-box-layer3"} data-layer="3" onDragOver={(e) => this.onDragOver(e)} onDragEnter={(e) => this.onDragEnter(e, 3, item)} onDragLeave={(e) => this.onDragLeave(e, 3, item)} onDrop={(e) => this.onDrop(e, 3, item)}></div><div className="week-counter">{week_text}</div>{plannerBar.curr_week_no === ind && plannerBar.curr_week_no !== -1 && <span className="current-week-mbt"></span>}{recovery_week_dot}{comp_html}{month_box}{program_html}</div>);
			this.graph_weekbar_html.push(<div key={'graph-week-box-' + item} className="week-box" title={item}><div className="week-counter">{week_text}</div>{plannerBar.curr_week_no === ind && plannerBar.curr_week_no !== -1 && <span className="current-week-mbt"></span>}{recovery_week_dot}{comp_html}{month_box}</div>);

			prev_week_day = parseInt(datearr[2]);
			if (tc_count !== -1)
				tc_count = tc_count + 1;
			if (planner.reverseCountdown === 'yes')
				week_no = week_no - 1;
			else
				week_no = week_no + 1;
		});

		return (<Draggable axis="x" grid={[21, 92]} position={this.state.plannerBarPosition} onDrag={this.handlePlannerDrag} cancel={".program-drag"}><div className="weeks-container">{weekbar_html}</div></Draggable>);
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
		//console.log(this.plannerBarCont.current.clientWidth);
		//console.log(this.state.weeksContWidth);
		let x = ui.x;
		if (ui.x > 0)
			x = 0;
		else if (ui.x < (this.plannerBarCont.current.clientWidth - this.state.weeksContWidth - 21))
			x = this.plannerBarCont.current.clientWidth - this.state.weeksContWidth - 21;

		this.setState({ plannerBarPosition: { x, y: 0 } });
		//console.log(ui);
	}

	handleGraphDrag = (e, ui) => {
		let x = ui.x;
		if (ui.x > 0)
			x = 0;
		else if (ui.x < (this.graphBarCont.current.clientWidth - this.state.weeksContWidth))
			x = this.graphBarCont.current.clientWidth - this.state.weeksContWidth;

		this.setState({ graphBarPosition: { x, y: 0 } });
	}
	
	showHidePlannerBar = (e) => {
		e.preventDefault();
		this.setState({plannerBarShow: !this.state.plannerBarShow});
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
		
		return (
			<div className="container-large clearfix athelete-panner-dashobard">
				<div id="wrapper" className="athlete-dashboard">
					<LeftSidebar club={this.state.club} />
					<div id="page-content-wrapper" >
						<div className="container-fluid full-screen">
							<div className="row full-screen">
								<div className="col-lg-12-large full-screen">
									<div className="top-header-bar mrgn-btm0 react-style">
										<div className="tp-top">
											<a href="" className="pro-small"><img src={this.props.user.profilePicture === '' ? '/uploads/images/profile_default.png' : getServerUrl().apiURL+'/uploads/user/'+this.props.user.profilePicture} alt="" /><span className="display-name">{this.props.user.firstName+' '+this.props.user.lastName}</span></a>
											<div className="tabs-head">
												<ul className="nav nav-tabs">
													<li><a className="active plannerTab" href="#" onMouseOver={(e) => this.showPlannerTitle(e)}>Planner</a></li>
												</ul>
											</div>
										</div>
										<div className="option-bat-p">
											<div className="radio-buttons show-onswith-graphe" style={{ display: (this.state.plannerBarShow && this.state.plannerBarShowGraph ? '' : 'none') }}>
												<input id="show_time" type="radio" name="ShowTime" value="time" checked={this.state.plannerBarGraphType === "time" ? true : false} onChange={(e) => this.changePlannerGraphType(e)} />
												<label htmlFor="show_time">Show Time</label>
			
												<input id="show_distance" type="radio" name="ShowTime" value="distance" checked={this.state.plannerBarGraphType === "distance" ? true : false} onChange={(e) => this.changePlannerGraphType(e)} />
												<label htmlFor="show_distance">Show Distance</label>
			
												<input id="show_load" type="radio" name="ShowTime" value="load" checked={this.state.plannerBarGraphType === "load" ? true : false} onChange={(e) => this.changePlannerGraphType(e)} />
												<label htmlFor="show_load">Show Load</label>
											</div>
											<div className="custom-checkbox-items hidemobile-only">
												<input type="checkbox" name="" value="" id="switch-to-graph" onClick={(e) => this.showHideGraph(e)} />
												<label htmlFor="switch-to-graph"><span className="options-check">Graph View</span></label>
											</div>
											<a href="" className={"cheron-up-icon"+(this.state.plannerBarShow ? "" : " icon-change")} id="hide-topbar" style={{zIndex: 999}} onClick={(e) => this.showHidePlannerBar(e)}>
												<i className="fa fa-chevron-up" aria-hidden="true"></i>
												<i className="fa fa-chevron-down" aria-hidden="true"></i>
											</a>
											<div className="inline-ele arrows-year next-year">
												<button type="button" data-role="none" className="slick-prev slick-arrow" aria-label="Previous" role="button">Back</button>
												<div className="year-duration" style={{backgroundColor: '#3cb779', color: '#fff'}}>{this.state.plannerBar.start_year} - {this.state.plannerBar.end_year}</div>
												<button type="button" data-role="none" className="slick-next slick-arrow" aria-label="Next" role="button">Next</button>
											</div>
										</div>
									</div>
									<div className="clearfix showmobile"></div>
									<div className="clearfix plannerContent" style={{display: 'none', paddingLeft: '20px'}}>
										<p>Planner Title : {this.state.planner.title}</p>
									</div>
									<div className="clearfix showmobile"></div>
									<div className="row-counter next-year" id="graph__bydefaul" ref={this.plannerBarCont} style={{display: (this.state.plannerBarShow && !this.state.plannerBarShowGraph ? '' : 'none'), overflow: 'hidden'}}>
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
										<div className="year-container year16" style={{zIndex: 2, width: this.state.weeksContWidth + 'px', overflowX: 'scroll', position: 'relative'}}>
											{this.displayPlannerBar()}
										</div>
									</div>
									<div className="row-counter graph-view-show-time" id="graph__show__time" ref={this.graphBarCont} style={{display: (this.state.plannerBarShow && this.state.plannerBarShowGraph ? '' : 'none'), overflow: 'hidden', position: 'relative'}}>
										<div className="layer-lines" style={{ width: this.state.weeksContWidth + 'px', left: this.state.graphBarPosition.x }}>
											<div id="layer-1" style={{borderBottom: '0px', height: '1px'}}></div>
										</div>
										<div className="year-container year16" style={{zIndex: 2}}>
											<Draggable axis="x" grid={[21, 92]} position={this.state.graphBarPosition} onDrag={this.handleGraphDrag}>
												<div>
													<div className="graph-view-container">
														{this.displayPlannerGraph()}
													</div>
													<div className="weeks-container">{this.graph_weekbar_html}</div>
												</div>
											</Draggable>
										</div>
									</div>
									<div className="cstmtoolbx ">
										<div className="row clearfix">
											<div className="col-md-6">
												<div className="custom-select bkup-bg" style={{float: 'left', width: '150px'}}>
													<select className="form-control" id="program-title-list" name="program-title-list" value={this.state.layerNo} onChange={this.changeLayer}>
														<option value="1">Layer 1 Programs</option>
														<option value="2">Layer 2 Programs</option>
														<option value="3">Layer 3 Programs</option>
													</select>
												</div>
												<div className="custom-select" style={{float: 'left', width: '180px'}}>
													<select className="form-control" id="layer-program-list" value={this.state.plannerProgram.programId} onChange={this.selectPlannerProgram}>
														<option value="">All Programs</option>
														{
															this.state.planner.programs.length !== 0 && this.state.planner.programs.map((program) => {
																if(program.layer === this.state.layerNo){
																	return (
																		<option key={'planner-program-select-' + program.programId} value={program.programId} data-start-date={program.startDate.split('T')[0]}>{program.title}</option>
																	);
																}
																else{
																	return (null);
																}
															})
														}
													</select>
												</div>
											</div>
											<div className="col-md-6" style={{clear: 'both'}}>
												<div className="icons-mixed">
													<span id="show-calendar-list-view"><a href="#" className=""><i className="fa fa-calendar" aria-hidden="true"></i></a></span>
												</div>
												<div className="slmnthin adjust-itsmt"></div>
											</div>
										</div>
										
										<FullCalendar
											defaultView="dayGridMonth"
											editable={false}
											droppable={false}
											firstDay={1}
											eventOrder={"order,title"}
											plugins={[dayGridPlugin, interactionPlugin]}
											ref={this.calendarRef}
											eventRender={this.handleEventRender}
											events={this.state.programSessions}
										/>
			
										<div className="calendar-list-view clearfix" id="calendar-list-view" style={{display: 'none'}}>
											<div className="calender-container clearfix">Please select a program</div>
										</div>
										<div className="calendar-bottom-content showmobile" style={{display: 'none'}}>
											<h4 className="modal-title">Sessions In: <strong>Thursday 5</strong></h4>
											<div className="session-listing"></div>
											<div className="footer-strip-row text-center">
												<h5>Daily Total</h5>
												<p>
													Daily: <span id="daily-time"></span> Hr | <span id="daily-distance"></span> Km | Load <span id="daily-load"></span>
												</p>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		user: state.auth.user
	};
};

export default connect(mapStateToProps, { showStrengthSession, showSessionDescription, viewSessions })(AthletePlanner);