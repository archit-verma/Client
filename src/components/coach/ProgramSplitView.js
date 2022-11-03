import React, { Component } from "react";
import { connect } from "react-redux";
import "@fullcalendar/core/main.css";
import "@fullcalendar/daygrid/main.css";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";

import {
  getSessionDescriptionById,
  getProgramSess,
  updateProgramSession,
  updatePlannerProgramSessions,
} from "../../utils/api.js";
import loading from "../../assets/loading.svg";
import { render } from "react-dom";
import {
  loadProgram,
  showAddSession,
  showSessionDescription,
  viewSessions,
  editSessionTime,
  showStrengthSession,
} from "../../actions";
import LeftSidebar from "./left-sidebar";
import RightSidebar from "./right-sidebar";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import interactionPlugin, { Draggable } from "@fullcalendar/interaction";
import $ from "jquery";

const monthNamesShort = [
  "",
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let weekSessionDrag = "",
  weekSessionDrag1 = "",
  monthSessionDrag = "",
  monthSessionDrag1 = "";
function cm_weekly_options(calendar_no) {
  if ($("#" +calendar_no +" .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-bg tr td:nth-child(1) .cm-week-options").length === 0) {
    $("#" +calendar_no +" .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-bg tr td:nth-child(1)").append(
      '<div class="cm-week-options"><div class="hover-stip-panel"><a href="" class="cm-copy-week-sessions" data-calendar="' +
        calendar_no +
        '" data-copyweek="yes" title="Drag this week sessions"><i class="fa fa-arrows" aria-hidden="true"></i></a><a href="" class="cm-delt-week-sessions" data-calendar="' +
        calendar_no +
        '" title="Delete this week sessions"><i class="fa fa-trash" aria-hidden="true"></i></a></div></div>'
    );
    let weekSessionEl = document.getElementById(calendar_no);
    if (weekSessionEl !== null) {
      if (calendar_no === "calendar") {
        if (weekSessionDrag !== "") {
          weekSessionDrag.destroy();
        }
        weekSessionDrag = new Draggable(weekSessionEl, {
          itemSelector: ".cm-copy-week-sessions",
          eventData: function (eventEl) {
            return {
              id: eventEl.getAttribute("data-calendar"),
              create: false,
            };
          },
        });
      } else {
        if (weekSessionDrag1 !== "") {
          weekSessionDrag1.destroy();
        }
        weekSessionDrag1 = new Draggable(weekSessionEl, {
          itemSelector: ".cm-copy-week-sessions",
          eventData: function (eventEl) {
            return {
              id: eventEl.getAttribute("data-calendar"),
              create: false,
            };
          },
        });
      }
    }
  }
}

function add_month_drag_for_calendar(calendar_no) {
  if ($("#" + calendar_no + " .fc-toolbar .copy-month-sessions").length === 0) {
    $("#" + calendar_no + " .fc-toolbar").prepend(
      '<a href="" class="copy-month-sessions" data-calendar="' +
        calendar_no +
        '" data-copymonth="yes" title="Drag current month all weeks sessions"><i class="fa fa-arrows" aria-hidden="true"></i></a>'
    );
    let monthSessionEl = document.getElementById(calendar_no);
    if (monthSessionEl !== null) {
      if (calendar_no === "calendar") {
        if (monthSessionDrag !== "") {
          monthSessionDrag.destroy();
        }
        monthSessionDrag = new Draggable(monthSessionEl, {
          itemSelector: ".copy-month-sessions",
          eventData: function (eventEl) {
            return {
              id: eventEl.getAttribute("data-calendar"),
              create: false,
            };
          },
        });
      } else {
        if (monthSessionDrag1 !== "") {
          monthSessionDrag1.destroy();
        }
        monthSessionDrag1 = new Draggable(monthSessionEl, {
          itemSelector: ".copy-month-sessions",
          eventData: function (eventEl) {
            return {
              id: eventEl.getAttribute("data-calendar"),
              create: false,
            };
          },
        });
      }
    }
  }
}

//import $ from 'jquery';
class ProgramSplitView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      calendarNo: 1,
      showHideSession: "none",
      value: { min: 0, max: 0 },
      programSessions: [],
      saveprogramSessions: [],
      addprogramSessions: [],
      saveprogramSessionsRight: [],
      programSessionsRight: [],
      addProgramSessionsRight: [],
      sessionInfo: [],
      sessionInfoRight: [],
      programStartDate: "",
      programStartDateRight: "",
      programId: "",
      rightProgramId: "",
      programTitle: "",
      club: "",
      sessionDess: "",
      ddate: "",
      loading: true,
      leftSidebarDisplay: false,
      rightSidebarDisplay: false,
    };

    this.calendarRef = React.createRef();
    this.calendarRef1 = React.createRef();
    this.leftSidebarChange = this.leftSidebarChange.bind(this);
    this.rightSidebarChange = this.rightSidebarChange.bind(this);
  }
  ShowSessionDesc(id) {
    getSessionDescriptionById(id).then((sessDess) => {
      this.props.showSessionDescription(sessDess.description);
    });
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    let Program = {};
    if (nextProps.selectedProgramId) {
      Program["program_id"] = nextProps.selectedProgramId;
      getProgramSess(Program).then((programData) => {
        if (this.calendarRef.current !== null) {
          let calendarApi = this.calendarRef.current.getApi();
          calendarApi.setOption("validRange", {
            start: programData.program_date,
          });
          calendarApi.gotoDate(programData.program_date);
        }
        let session_events = [];
        let save_event_sessions = [];
        let calendarNo = this.state.calendarNo;
        programData.program_session.forEach((item, ind) => {
          let session_date = new Date(programData.program_date);
          session_date.setDate(session_date.getDate() + item.days);
          let sdate = ("0" + session_date.getDate()).slice(-2);
          let smonth = ("0" + (session_date.getMonth() + 1)).slice(-2);

          let obj = {
            id: calendarNo,
            title: item.sesstitle,
            start: session_date.getFullYear() + "-" + smonth + "-" + sdate,
            durationEditable: false,
            startEditable: true,
            extendedProps: {
              _id: item.id_session,
              title: item.sesstitle,
              sessAssId: item.id_session,
              sessionId: item.sessionId,
              hours: item.hours,
              minutes: item.minutes,
              sessTime: item.sessTime,
              unit: item.unit,
              distance:
                item.distance == undefined ? 0 : item.distance.$numberDecimal,
              rpeLoad: item.rpe_load,
              activityType: item.activityType,
              icon: item.icon,
              color: item.sesscolor,
              order: item.order,
              sessionType: item.type,
              exercisesTotal: item.total_ex,
              sessionTime: item.sessionTime,
              sessionURL: item.sessionURL,
              days: item.days,
            },
          };
          save_event_sessions.push(obj.extendedProps);
          session_events.push(obj);
          ++calendarNo;
        });

        this.setState({
          rightProgramId: nextProps.selectedProgramId,
          programStartDateRight: programData.program_date,
          programSessionsRight: session_events,
          saveprogramSessionsRight: save_event_sessions,
          calendarNo,
        });
      });
    }
    // if (nextProps.sessData) {
    // 	let newobj = {};
    // 	let sessData = nextProps.sessData;
    // 	let ProgramSession = [...this.state.saveprogramSessions];

    // 	for (var i = 0; i < ProgramSession.length; i++) {
    // 		if (sessData.id_session === ProgramSession[i].id_session) {
    // 			let sessionTime = (sessData.str_session_hours * 60) + sessData.str_session_minuts;
    // 			newobj['date'] = ProgramSession[i].date;
    // 			newobj['days'] = ProgramSession[i].days;
    // 			newobj['hours'] = ProgramSession[i].hours;
    // 			newobj['minutes'] = ProgramSession[i].minutes;
    // 			newobj['sessTime'] = ProgramSession[i].sessTime;
    // 			newobj['order'] = ProgramSession[i].order;
    // 			newobj['programdate'] = ProgramSession[i].programdate;
    // 			newobj['rpe_load'] = ProgramSession[i].rpe_load;
    // 			newobj['sesscolor'] = ProgramSession[i].sesscolor;
    // 			newobj['sessionId'] = ProgramSession[i].sessionId;
    // 			newobj['sesstitle'] = ProgramSession[i].sesstitle;
    // 			newobj['type'] = ProgramSession[i].type;
    // 			newobj['unit'] = ProgramSession[i].unit;
    // 			newobj['distance'] = ProgramSession[i].distance;
    // 			newobj['icon'] = ProgramSession[i].icon;
    // 			newobj['id_session'] = ProgramSession[i].id_session;
    // 			newobj['sessionTime'] = sessionTime;
    // 			newobj['sessionURL'] = sessData.session_url;
    // 			ProgramSession.splice(i, 1);
    // 		}
    // 	}
    // 	ProgramSession.push(newobj);
    // 	this.setState({ saveprogramSessions: ProgramSession });
    // }
  }

  componentDidMount = async () => {
    let Program = {};
    Program["program_slug"] = this.props.programSlug;
    Program["club_slug"] = this.props.clubSlug;
    Program["user_id"] = this.props.user._id;
    getProgramSess(Program).then((programData) => {
      if (programData.club === null) {
        this.setState({ club: null });
      } else {
        let calendarApi1 = this.calendarRef1.current.getApi();
        calendarApi1.setOption("validRange", {
          start: programData.program_date,
        });
        calendarApi1.gotoDate(programData.program_date);
        let session_events = [];
        let save_event_sessions = [];
        let calendarNo = this.state.calendarNo;
        programData.program_session.forEach((item, ind) => {
          let session_date = new Date(programData.program_date);
          session_date.setDate(session_date.getDate() + item.days);
          let sdate = ("0" + session_date.getDate()).slice(-2);
          let smonth = ("0" + (session_date.getMonth() + 1)).slice(-2);
          let obj = {
            id: calendarNo,
            title: item.sesstitle,
            start: session_date.getFullYear() + "-" + smonth + "-" + sdate,
            durationEditable: false,
            startEditable: true,
            extendedProps: {
              _id: item.id_session,
              title: item.sesstitle,
              sessAssId: item.id_session,
              sessionId: item.sessionId,
              hours: item.hours,
              minutes: item.minutes,
              sessTime: item.sessTime,
              unit: item.unit,
              distance:
                item.distance == undefined ? 0 : item.distance.$numberDecimal,
              rpeLoad: item.rpe_load,
              activityType: item.activityType,
              icon: item.icon,
              color: item.sesscolor,
              order: item.order,
              sessionType: item.type,
              exercisesTotal: item.total_ex,
              sessionTime: item.sessionTime,
              sessionURL: item.sessionURL,
              days: item.days,
            },
          };
          session_events.push(obj);
          save_event_sessions.push(obj.extendedProps);
          ++calendarNo;
        });
       
        this.setState({
          club: programData.club,
          programId: programData.program_id,
          programTitle: programData.program_title,
          programSessions: session_events,
          saveprogramSessions: save_event_sessions,
          programStartDate: programData.program_date,
          loading: false,
        });

        $(document).on(
          "click",
          "#calendar , button.fc-next-button",
          function () {
            cm_weekly_options("calendar");
          }
        );
        $(document).on(
          "click",
          "#calendar , button.fc-prev-button",
          function () {
            cm_weekly_options("calendar");
          }
        );
        $(document).on(
          "click",
          "#calendar1 , button.fc-next-button",
          function () {
            cm_weekly_options("calendar1");
          }
        );
        $(document).on(
          "click",
          "#calendar1 , button.fc-prev-button",
          function () {
            cm_weekly_options("calendar1");
          }
        );
        $("#calendar .fc-today-button").click(function () {
          cm_weekly_options("calendar");
        });
        $("#calendar1 .fc-today-button").click(function () {
          cm_weekly_options("calendar1");
        });
        $(document).on("click", "#calendar .cm-delt-week-sessions", (e) =>
          this.deleteWeekSessions(e)
        );
        $(document).on("click", "#calendar1 .cm-delt-week-sessions", (e) =>
          this.deleteWeekSessions(e)
        );
      }
    });
  };
  componentDidUpdate(prevProps, prevState) {
    //if(prevState.programSessions !== this.state.programSessions){
    setTimeout(function () {
      cm_weekly_options("calendar");
      cm_weekly_options("calendar1");
      add_month_drag_for_calendar("calendar");
      add_month_drag_for_calendar("calendar1");
    }, 100);
    //cm_weekly_summary();
    //}
  }

  formatDate(date) {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  }

  handleEventDrop = (info) => {
    // bind with an arrow function

    let programSessions = [...this.state.programSessions];
    let saveprogramSessions = [...this.state.saveprogramSessions];
    let addprogramSessions = [...this.state.addprogramSessions];
    let programDate = new Date(this.state.programStartDate + " 00:00:00");
    let eventId = parseInt(info.event.id);
    let timeDiff = info.event.start - programDate;
    let daysDiff = 0;
    if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);

    for (let i = 0; i < programSessions.length; i++) {
      if (eventId === programSessions[i].id) {
        programSessions[i].start = info.event.start;
      }
    }
    for (let i = 0; i < addprogramSessions.length; i++) {
      if (info.event.id === addprogramSessions[i]._id) {
        addprogramSessions[i].days = daysDiff;
      }
    }
    for (let i = 0; i < saveprogramSessions.length; i++) {
      if (info.event.extendedProps.sessAssId === saveprogramSessions[i]._id) {
        saveprogramSessions[i].days = daysDiff;
      }
    }

    this.setState({ programSessions, saveprogramSessions, addprogramSessions });
  };

  handleEventDropRight = (info) => {
    let programSessionsRight = [...this.state.programSessionsRight];
    let addProgramSessionsRight = [...this.state.addProgramSessionsRight];
    let saveProgramSessionsRight = [...this.state.saveprogramSessionsRight];
    let programDate = new Date(this.state.programStartDateRight + " 00:00:00");
    let eventId = parseInt(info.event.id);
    let timeDiff = info.event.start - programDate;
    let daysDiff = 0;
    if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);
    for (let i = 0; i < programSessionsRight.length; i++) {
      if (eventId === programSessionsRight[i].id) {
        programSessionsRight[i].start = info.event.start;
      }
    }
    for (let i = 0; i < addProgramSessionsRight.length; i++) {
      if (info.event.id === addProgramSessionsRight[i]._id) {
        addProgramSessionsRight[i].days = daysDiff;
      }
    }

    for (let i = 0; i < saveProgramSessionsRight.length; i++) {
      if (
        info.event.extendedProps.sessAssId === saveProgramSessionsRight[i]._id
      ) {
        saveProgramSessionsRight[i].days = daysDiff;
      }
    }

    this.setState({
      programSessionsRight,
      saveProgramSessionsRight,
      addProgramSessionsRight,
    });
  };
  loadPrograms = (e) => {
    e.preventDefault();
    this.props.loadProgram();
  };

  savePrograms = (e) => {
    e.preventDefault();
    let SessionObj = {};
    SessionObj["program_id"] = this.state.programId;
    SessionObj["program_start_date"] = this.state.programStartDate;
    SessionObj["program_sessions"] = this.state.saveprogramSessions;
    SessionObj["add_sessions"] = this.state.addprogramSessions;
    updatePlannerProgramSessions(SessionObj).then((res) => {
      if (res.success === true) {
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
          let session_date = new Date(
            this.state.programStartDate + " 00:00:00"
          );
          session_date.setDate(session_date.getDate() + item.days);
          let sdate = ("0" + session_date.getDate()).slice(-2);
          let smonth = ("0" + (session_date.getMonth() + 1)).slice(-2);

          let obj = {
            id: calendarNo,
            title: item.title,
            start:
              session_date.getFullYear() +
              "-" +
              smonth +
              "-" +
              sdate +
              " 00:00:00",
            durationEditable: false,
            startEditable: true,
            extendedProps: {
              title: item.title,
              sessAssId: item._id,

              sessionId: item.sessionId,
              hours: item.hours,
              minutes: item.minutes,
              sessTime: item.sessTime,
              unit: item.unit,
              distance:
                item.distance == undefined ? 0 : item.distance.$numberDecimal,
              rpeLoad: item.rpeLoad,
              icon: item.icon,
              activityType: item.activityType,
              color: item.color,
              order: item.order,
              sessionType: item.sessionType,
              exercisesTotal: item.exercisesTotal,
              sessionTime: item.sessionTime,
              sessionURL: item.sessionURL,
              days: item.days,
            },
          };
          session_events.push(obj);
          ++calendarNo;
        });

        this.setState({
          programSessions: session_events,
          saveprogramSessions: res.sessions,
          addprogramSessions: [],
          calendarNo,
        });
        alert(res.msg);
      } else {
        alert(res.msg);
      }
    });
  };
  saveProgramsRight = (e) => {
    e.preventDefault();
    let SessionObj = {};
    SessionObj["program_id"] = this.state.rightProgramId;
    SessionObj["program_start_date"] = this.state.programStartDateRight;
    SessionObj["program_sessions"] = this.state.saveprogramSessionsRight;
    SessionObj["add_sessions"] = this.state.addProgramSessionsRight;
    updatePlannerProgramSessions(SessionObj).then((res) => {
      if (res.success === true) {
        let calendarApi1 = this.calendarRef.current.getApi();
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
          let session_date = new Date(this.state.programStartDateRight);
          session_date.setDate(session_date.getDate() + item.days);
          let sdate = ("0" + session_date.getDate()).slice(-2);
          let smonth = ("0" + (session_date.getMonth() + 1)).slice(-2);

          let obj = {
            id: calendarNo,
            title: item.title,
            start:
              session_date.getFullYear() +
              "-" +
              smonth +
              "-" +
              sdate +
              " 00:00:00",
            durationEditable: false,
            startEditable: true,
            extendedProps: {
              title: item.title,
              sessAssId: item._id,
              sessionId: item.sessionId,
              hours: item.hours,
              minutes: item.minutes,
              sessTime: item.sessTime,
              unit: item.unit,
              distance:
                item.distance == undefined ? 0 : item.distance.$numberDecimal,
              rpeLoad: item.rpeLoad,
              icon: item.icon,
              activityType: item.activityType,
              color: item.color,
              order: item.order,
              sessionType: item.sessionType,
              exercisesTotal: item.exercisesTotal,
              sessionTime: item.sessionTime,
              sessionURL: item.sessionURL,
            },
          };
          session_events.push(obj);
          ++calendarNo;
        });

        this.setState({
          programSessionsRight: session_events,
          saveProgramSessionsRight: res.sessions,
          addProgramSessionsRight: [],
          calendarNo,
        });
        alert(res.msg);
      } else {
        alert(res.msg);
      }
    });
  };
  handleEventReceive = (info) => {
    if (this.state.programId === "") {
      alert("Please select a program");
    } else {
      //let programSessions = [...this.state.programSessions];
      let addprogramSessions = [...this.state.addprogramSessions];
      let programSessionsRight = [...this.state.programSessionsRight];
      let calendarNo = this.state.calendarNo;
      let sessInfo = info.event.extendedProps;

      let eventId = parseInt(info.event.id);
      let newEvent = "";
      for (let i = 0; i < programSessionsRight.length; i++) {
        if (eventId === programSessionsRight[i].id) {
          newEvent = {
            id: calendarNo,
            title: info.event.title,
            start: programSessionsRight[i].start,
            durationEditable: false,
            startEditable: true,
            extendedProps: {
              title: info.event.title,
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
              sessionURL: sessInfo.sessionURL,
            },
          };
          programSessionsRight.splice(i, 1);
          ++calendarNo;
        }
      }
      if (newEvent !== "") programSessionsRight.push(newEvent);

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

      let programDate = new Date(this.state.programStartDate + " 00:00:00");
      let timeDiff = info.event.start - programDate;
      let daysDiff = 0;
      if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);

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
        sessionURL: "",
      };
      addprogramSessions.push(newSession);
      //let calendarApi = this.calendarRef.current.getApi();
      //let evt = calendarApi.getEventById(eventId);
      //evt.remove();

      ++calendarNo;
      //this.setState({programSessions, addProgramSessions, calendarNo});
      this.setState({ addprogramSessions, calendarNo, programSessionsRight });
    }
  };
  handleEventReceiveRight = (info) => {
    let addProgramSessionsRight = [...this.state.addProgramSessionsRight];
    let programSessions = [...this.state.programSessions];
    let calendarNo = this.state.calendarNo;
    let sessInfo = info.event.extendedProps;

    let eventId = parseInt(info.event.id);
    let newEvent = "";
    for (let i = 0; i < programSessions.length; i++) {
      if (eventId === programSessions[i].id) {
        newEvent = {
          id: calendarNo,
          title: info.event.title,
          start: programSessions[i].start,
          durationEditable: false,
          startEditable: true,
          extendedProps: {
            title: info.event.title,
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
            sessionURL: sessInfo.sessionURL,
          },
        };
        programSessions.splice(i, 1);
        ++calendarNo;
      }
    }
    if (newEvent !== "") programSessions.push(newEvent);

    let programDate = new Date(this.state.programStartDateRight + " 00:00:00");
    let timeDiff = info.event.start - programDate;
    let daysDiff = 0;
    if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);

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
      sessionURL: "",
    };
    addProgramSessionsRight.push(newSession);
    ++calendarNo;
    this.setState({ addProgramSessionsRight, calendarNo, programSessions });
  };
  deleteWeekSessions(e) {
    e.preventDefault();
    if (window.confirm("Are you sure you want to delete this week sessions?")) {
      let programSessions = [];
      let addprogramSessions = [];
      let saveprogramSessions = [];
      let newSessions = [];
      let addNewSessions = [];
      let saveNewSessions = [];

      if (e.currentTarget.dataset.calendar === "calendar") {
        programSessions = [...this.state.programSessions];
        addprogramSessions = [...this.state.addprogramSessions];
        saveprogramSessions = [...this.state.saveprogramSessions];
      } else {
        programSessions = [...this.state.programSessionsRight];
        addprogramSessions = [...this.state.addProgramSessionsRight];
        saveprogramSessions = [...this.state.saveprogramSessionsRight];
      }

      let delete_sessions = [],
        delete_sessions_ass = [];
      $(e.currentTarget)
        .parents(".fc-row.fc-week.fc-widget-content")
        .find(".fc-event-container .e-id")
        .each(function (ind, ele) {
          delete_sessions.push(parseInt($(ele).val()));
          delete_sessions_ass.push(
            $(ele).parent().children(".sess-ass-id")[0].value
          );
        });
      if (delete_sessions.length > 0) {
        for (let i = 0; i < addprogramSessions.length; i++) {
          if (!($.inArray(addprogramSessions[i]._id, delete_sessions) > -1)) {
            addNewSessions.push(addprogramSessions[i]);
          }
        }

        for (let i = 0; i < saveprogramSessions.length; i++) {
          if (
            !($.inArray(saveprogramSessions[i]._id, delete_sessions_ass) > -1)
          ) {
            saveNewSessions.push(saveprogramSessions[i]);
          }
        }

        for (let i = 0; i < programSessions.length; i++) {
          if (!($.inArray(programSessions[i].id, delete_sessions) > -1)) {
            newSessions.push(programSessions[i]);
          }
        }

        if (e.currentTarget.dataset.calendar === "calendar")
          this.setState({
            programSessions: newSessions,
            saveprogramSessions: saveNewSessions,
            addprogramSessions: addNewSessions,
          });
        else
          this.setState({
            programSessionsRight: newSessions,
            saveprogramSessionsRight: saveNewSessions,
            addProgramSessionsRight: addNewSessions,
          });
      }
    }
  }
  checkSessionExist = (sessionInfo) => {
    let programSession = this.state.programSessions;
    let sessionId = sessionInfo.sessionId;
    for (var i = 0; i < programSession.length; i++) {
      if (sessionId === programSession[i].sessionId) {
        return sessionInfo;
      }
    }
  };

  EditSession(id) {
    this.props.showAddSession(id);
  }

  ViewSession(id) {
    this.props.viewSessions(id);
  }

  duplicateSession(sessionId,eventId) {
    let saveprogramSessions = [...this.state.saveprogramSessions];
    let programSessions = [...this.state.programSessions];
    let calendarNo = this.state.calendarNo;
    let programSess=[];
    let saveProgrmSess=[];
    for (var i = 0; i < programSessions.length; i++) {
      let sessInfo = programSessions[i];
     let  newEvent={
        id: calendarNo,
        title: sessInfo.title,
        start: sessInfo.start,
        durationEditable: false,
        startEditable: true,
        extendedProps:sessInfo.extendedProps,
      };
      programSess.push(newEvent);
      saveProgrmSess.push(sessInfo.extendedProps);
      if (sessionId === programSessions[i].extendedProps._id) {
        let  newEvent={
          id: calendarNo,
          title: sessInfo.title,
          start: sessInfo.start,
          durationEditable: false,
          startEditable: true,
          extendedProps:sessInfo.extendedProps,
        };
        programSess.push(newEvent);
        saveProgrmSess.push(sessInfo.extendedProps);
      }
      calendarNo++;
    
    }
    this.setState({ programSessions:programSess,saveprogramSessions:saveProgrmSess});
  }

  duplicateSessionRight(id) {
    let calendarNo = this.state.calendarNo;
    let saveprogramSessionsRight = [...this.state.saveprogramSessionsRight];
    let programSessionsRight = [...this.state.programSessionsRight];
    let programSess=[];
    let saveProgrmSess=[];
    for (var i = 0; i < programSessionsRight.length; i++) {
      let sessInfo = programSessionsRight[i];
     let  newEvent={
        id: calendarNo,
        title: sessInfo.title,
        start: sessInfo.start,
        durationEditable: false,
        startEditable: true,
        extendedProps:sessInfo.extendedProps,
      };
      programSess.push(newEvent);
      saveProgrmSess.push(sessInfo.extendedProps);
      if (id === programSessionsRight[i].extendedProps._id) {
        let  newEvent={
          id: calendarNo,
          title: sessInfo.title,
          start: sessInfo.start,
          durationEditable: false,
          startEditable: true,
          extendedProps:sessInfo.extendedProps,
        };
        programSess.push(newEvent);
        saveProgrmSess.push(sessInfo.extendedProps);
      }
      calendarNo++;
    
    }
 
    this.setState({ programSessionsRight:programSess,saveprogramSessionsRight:saveProgrmSess});
  }

  removeSession(id, eventId) {
	if (window.confirm('Are you sure you want to remove this session?')) {
		//let calendarApi = this.calendarRef.current.getApi();
		//let evt = calendarApi.getEventById(eventId);
		//evt.remove();
		
		let programSessions = [...this.state.programSessions];
		let saveprogramSessions = [...this.state.saveprogramSessions];
		let addprogramSessions = [...this.state.addprogramSessions];
		for (let i = 0; i < programSessions.length; i++) {
			if (parseInt(eventId) === programSessions[i].id) {
				programSessions.splice(i, 1);
			}
		}
		for (let i = 0; i < saveprogramSessions.length; i++) {
			if (id === saveprogramSessions[i]._id) {
				saveprogramSessions.splice(i, 1);
			}
		}
		for (let i = 0; i < addprogramSessions.length; i++) {
			if (id === addprogramSessions[i]._id) {
				addprogramSessions.splice(i, 1);
			}
		}
		this.setState({ programSessions, saveprogramSessions, addprogramSessions });
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

  showSSession(id, programId, programStartDate) {
    let valObj = {};
    valObj["session_id"] = id;
    valObj["program_id"] = programId;
    valObj["program_start_date"] = programStartDate;
    this.props.showStrengthSession(valObj);
  }

  linkSession(id) {}

  updateTimeAndUrl(id, eventId, calendar, sessionTime, sessionURL) {
    this.props.editSessionTime(id, eventId, calendar, sessionTime, sessionURL);
  }

  showWarning() {
    alert("Only Strength Session can be printed");
  }

  resize = (info) => {
    info.revert();
  };

  handleEventRender = (info) => {
    let sessInfo = info.event.extendedProps;
    let time = new Date().getTime();
    //let sess_date = info.event.start.toISOString().split('T');
    //let dstring = sess_date[0];
    let ddate = ("0" + info.event.start.getDate()).slice(-2);
    let dmonth = ("0" + (info.event.start.getMonth() + 1)).slice(-2);
    let dstring = info.event.start.getFullYear() + "-" + dmonth + "-" + ddate;

    render(
      <div className="fc-content" style={{ backgroundColor: sessInfo.color }}>
        <ContextMenu id={sessInfo.sessAssId}>
          {sessInfo.sessionType === "normal" ? (
            <MenuItem onClick={() => this.ViewSession(sessInfo.sessionId)}>
              View
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() =>
                this.showSSession(
                  sessInfo.sessionId,
                  this.state.programId,
                  this.state.programStartDate
                )
              }
            >
              View
            </MenuItem>
          )}
          {/*<MenuItem onClick={() => this.updateTimeAndUrl(sessInfo.id_session, sessInfo.id, 0, sessInfo.sessionTime, sessInfo.sessionURL)}>Edit Time & URL</MenuItem>
					<MenuItem divider />*/}
          <MenuItem onClick={() => this.duplicateSession(sessInfo._id,info.event.id)}>
            Duplicate
          </MenuItem>
          <MenuItem divider />
          {sessInfo.sessionType === "normal" ? (
            <MenuItem onClick={() => this.EditSession(sessInfo.sessionId)}>
              Edit
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() =>
                window.open(
                  "/team/" +
                    this.state.club.slug +
                    "/edit-session/" +
                    sessInfo.sessionId,
                  "_blank"
                )
              }
            >
              Edit
            </MenuItem>
          )}
          <MenuItem onClick={() => this.removeSession(sessInfo.sessAssId,info.event.id)}>
            Remove
          </MenuItem>

          {/*
						(sessInfo.type === 'normal') ?
							<MenuItem onClick={() => this.showWarning()}>Print</MenuItem> : <MenuItem onClick={() => this.showSSession(sessInfo.sessionId, this.state.programId, this.state.programStartDate)}>Print</MenuItem>
					*/}
          {/*<MenuItem onClick={this.handleClick}>Move Up</MenuItem>
					<MenuItem onClick={this.handleClick}>Move Down</MenuItem>*/}
        </ContextMenu>
        <ContextMenuTrigger id={sessInfo.sessAssId}>
          <span
            style={{ width: "100%", backgroundColor: sessInfo.color }}
            className="fc-title snbx sn-run"
          >
            <div
              className="media snbx sn-run"
              style={{ backgroundColor: sessInfo.color, display: "none" }}
            ></div>
            <div className="media-left">
              <img src={"/uploads/images/" + sessInfo.icon} alt="" />
            </div>
            <div className="media-body">
              <h4 className="media-heading">{sessInfo.title}</h4>
            </div>
            <input type="hidden" className="e-id" value={info.event.id} />
            <input
              type="hidden"
              className="sess-ass-id"
              value={sessInfo.sessAssId}
            />
            <input type="hidden" className="box-date" value={dstring} />

            {sessInfo.sessionType === "normal" ? (
              <p>
                {sessInfo.distance +
                  sessInfo.unit +
                  " " +
                  sessInfo.hours +
                  ":" +
                  sessInfo.minutes +
                  "," +
                  sessInfo.rpeLoad +
                  " Load"}
              </p>
            ) : (
              <p>{sessInfo.exercisesTotal + " Exercises"}</p>
            )}
            <div
              className="sess-desc-icon"
              onClick={() => this.ShowSessionDesc(sessInfo.sessionId)}
            >
              <img src="/uploads/images/desc-icon2.png" alt="" />
            </div>
          </span>
        </ContextMenuTrigger>
      </div>,
      info.el
    );
    return info.el;
  };
  handleEventRenderRight = (info) => {
    let sessInfo = info.event.extendedProps;
    let time = new Date().getTime();
    //let sess_date = info.event.start.toISOString().split('T');
    //let dstring = sess_date[0];
    let ddate = ("0" + info.event.start.getDate()).slice(-2);
    let dmonth = ("0" + (info.event.start.getMonth() + 1)).slice(-2);
    let dstring = info.event.start.getFullYear() + "-" + dmonth + "-" + ddate;
    render(
      <div className="fc-content" style={{ backgroundColor: sessInfo.color }}>
        <ContextMenu id={sessInfo.sessAssId}>
          {sessInfo.sessionType === "normal" ? (
            <MenuItem onClick={() => this.ViewSession(sessInfo.sessionId)}>
              View
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() =>
                this.showSSession(
                  sessInfo.sessionId,
                  this.state.programId,
                  this.state.programStartDate
                )
              }
            >
              View
            </MenuItem>
          )}
          {/*<MenuItem onClick={() => this.updateTimeAndUrl(sessInfo.id_session, sessInfo.id, 0, sessInfo.sessionTime, sessInfo.sessionURL)}>Edit Time & URL</MenuItem>
					<MenuItem divider />*/}
          <MenuItem onClick={() => this.duplicateSessionRight(sessInfo.sessAssId)}>
            Duplicate
          </MenuItem>
          <MenuItem divider />
          {sessInfo.sessionType === "normal" ? (
            <MenuItem onClick={() => this.EditSession(sessInfo.sessionId)}>
              Edit
            </MenuItem>
          ) : (
            <MenuItem
              onClick={() =>
                window.open(
                  "/team/" +
                    this.state.club.slug +
                    "/edit-session/" +
                    sessInfo.sessionId,
                  "_blank"
                )
              }
            >
              Edit
            </MenuItem>
          )}
          <MenuItem onClick={() => this.removeSessionRight(sessInfo.sessAssId,info.event.id)}>
            Remove
          </MenuItem>
          {/*
						(sessInfo.type === 'normal') ?
							<MenuItem onClick={() => this.showWarning()}>Print</MenuItem> : <MenuItem onClick={() => this.showSSession(sessInfo.sessionId, this.state.programId, this.state.programStartDate)}>Print</MenuItem>
					*/}
          {/*<MenuItem onClick={this.handleClick}>Move Up</MenuItem>
					<MenuItem onClick={this.handleClick}>Move Down</MenuItem>*/}
        </ContextMenu>
        <ContextMenuTrigger id={sessInfo.sessAssId}>
          <span
            style={{ width: "100%", backgroundColor: sessInfo.color }}
            className="fc-title snbx sn-run"
          >
            <div
              className="media snbx sn-run"
              style={{ backgroundColor: sessInfo.color, display: "none" }}
            ></div>
            <div className="media-left">
              <img src={"/uploads/images/" + sessInfo.icon} alt="" />
            </div>
            <div className="media-body">
              <h4 className="media-heading">{sessInfo.title}</h4>
            </div>
            <input type="hidden" className="e-id" value={info.event.id} />
            <input
              type="hidden"
              className="sess-ass-id"
              value={sessInfo.sessAssId}
            />
            <input type="hidden" className="box-date" value={dstring} />

            {sessInfo.sessionType === "normal" ? (
              <p>
                {sessInfo.distance +
                  sessInfo.unit +
                  " " +
                  sessInfo.hours +
                  ":" +
                  sessInfo.minutes +
                  "," +
                  sessInfo.rpeLoad +
                  " Load"}
              </p>
            ) : (
              <p>{sessInfo.exercisesTotal + " Exercises"}</p>
            )}
            <div
              className="sess-desc-icon"
              onClick={() => this.ShowSessionDesc(sessInfo.sessionId)}
            >
              <img src="/uploads/images/desc-icon2.png" alt="" />
            </div>
          </span>
        </ContextMenuTrigger>
      </div>,
      info.el
    );
    return info.el;
  };

  leftSidebarChange() {
    this.setState({ leftSidebarDisplay: !this.state.leftSidebarDisplay });
  }

  rightSidebarChange() {
    this.setState({ rightSidebarDisplay: !this.state.rightSidebarDisplay });
  }
  handleDrop = (arg) => {
    if (this.state.programId === "") {
      alert("Please select a program");
    } else if (arg.draggedEl.dataset.sessid !== undefined) {
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
          sessAssId: calendarNo + "",
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
          sessionURL: "",
          isNew: "yes",
        },
      };
      addProgramSessions.push(newEvent);

      let programDate = new Date(
        this.state.plannerProgram.startDate + " 00:00:00"
      );
      let timeDiff = arg.date - programDate;
      let daysDiff = 0;
      if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);
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
        sessionURL: "",
      };
      addProgramSessions.push(newSession);

      //let calendarApi = this.calendarRef.current.getApi();
      //calendarApi.addEvent(newEvent);
      ++calendarNo;
      this.setState({ programSessions, addProgramSessions, calendarNo });
    } else if (
      arg.draggedEl.dataset.copymonth !== undefined &&
      arg.draggedEl.dataset.calendar === "calendar1"
    ) {
      let programSessions = [...this.state.programSessions];
      let addProgramSessions = [...this.state.addProgramSessions];
      let calendarNo = this.state.calendarNo;

      let calendarApi = this.calendarRef1.current.getApi();
      let programDate = new Date(
        this.state.plannerProgram.startDate + " 00:00:00"
      );
      $(
        "#calendar1 .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-day-grid .fc-row.fc-week"
      ).each(function (ind) {
        for (let i = 1; i <= 7; i++) {
          let events_date = $(
            ".fc-bg .fc-day.fc-widget-content:nth-child(" + i + ")",
            this
          ).data("date");
          let events_new_date = $(
            "#calendar .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-day-grid .fc-row.fc-week:nth-child(" +
              (ind + 1) +
              ") .fc-bg .fc-day.fc-widget-content:nth-child(" +
              i +
              ")"
          ).data("date");
          let events_new_date_obj = new Date(events_new_date + " 00:00:00");

          if (events_new_date_obj.getTime() >= programDate.getTime()) {
            $(
              '.fc-content-skeleton table tbody input.box-date[value="' +
                events_date +
                '"]',
              this
            ).each(function () {
              let ele = $(this).parent();
              let evt = calendarApi.getEventById(ele.find(".e-id").val());
              let sessInfo = evt.extendedProps;

              let newEvent = {
                id: calendarNo,
                title: evt.title,
                start: events_new_date + " 00:00:00",
                durationEditable: false,
                startEditable: true,
                extendedProps: {
                  sessAssId: calendarNo + "",
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
                  sessionURL: "",
                },
              };
              programSessions.push(newEvent);

              let timeDiff = events_new_date_obj - programDate;
              let daysDiff = 0;
              if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);
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
                sessionURL: "",
              };
              addProgramSessions.push(newSession);
              ++calendarNo;
            });
          }
        }
      });
      this.setState({ programSessions, addProgramSessions, calendarNo });
    } 
    else if (arg.draggedEl.dataset.copyweek !== undefined) {
      let programSessions = [...this.state.programSessions];
      let addProgramSessions = [...this.state.addProgramSessions];
      let saveProgramSessions = [...this.state.saveProgramSessions];
      let copySessions = [];
      let addCopySessions = [];
      let saveCopySessions = [];
      let calendarNo = this.state.calendarNo;

      if (arg.draggedEl.dataset.calendar === "calendar") {
        copySessions = [...this.state.programSessions];
        addCopySessions = [...this.state.addProgramSessions];
        saveCopySessions = [...this.state.saveProgramSessions];
      } else {
        copySessions = [...this.state.programSessionsRight];
        addCopySessions = [...this.state.addProgramSessionsRight];
        saveCopySessions = [...this.state.saveProgramSessionsRight];
      }

      let paste_sessions = [],
        paste_sessions_ass = [],
        paste_sessions_id = [];
      $(arg.draggedEl)
        .parents(".fc-row.fc-week.fc-widget-content")
        .find(".fc-event-container .e-id")
        .each(function (ind, ele) {
          paste_sessions.push(parseInt($(ele).val()));
          paste_sessions_ass.push(
            $(ele).parent().children(".sess-ass-id")[0].value
          );
        });
      let week_start_paste = $(arg.draggedEl)
        .parents(".fc-day.fc-widget-content")
        .data("date");
      if (week_start_paste === undefined) {
        week_start_paste = $(arg.draggedEl)
          .parents(".fc-day.fc-widget-content")
          .parent();
        week_start_paste = $("td:last-child", week_start_paste).data("date");
        if (week_start_paste != undefined) {
          week_start_paste = new Date(week_start_paste + " 00:00:00");
          week_start_paste = new Date(
            week_start_paste.setDate(week_start_paste.getDate() - 6)
          );
        }
      } else week_start_paste = new Date(week_start_paste + " 00:00:00");

      if (paste_sessions.length > 0 && week_start_paste != undefined) {
        let calendarApi = {};
        if (arg.draggedEl.dataset.calendar === "calendar")
          calendarApi = this.calendarRef.current.getApi();
        else calendarApi = this.calendarRef1.current.getApi();
        let mbtGetDateDay = new Date(arg.date);
        let mbtday = mbtGetDateDay.getDay();
        let mbtdiff = mbtGetDateDay.getDate() - mbtday + (mbtday == 0 ? -6 : 1);
        let week_start = new Date(mbtGetDateDay.setDate(mbtdiff));
        let programDate = new Date(
          this.state.plannerProgram.startDate + " 00:00:00"
        );

        for (let i = 0; i < addCopySessions.length; i++) {
          if ($.inArray(addCopySessions[i]._id, paste_sessions) > -1) {
            let evt = calendarApi.getEventById(addCopySessions[i]._id);
            let sess_start = evt.start;
            let timeDiff = Math.abs(
              sess_start.getTime() - week_start_paste.getTime()
            );
            let new_date = new Date(Math.abs(week_start.getTime() + timeDiff));
            let ddate = ("0" + new_date.getDate()).slice(-2);
            let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
            if (new_date.getTime() >= programDate.getTime()) {
              let sessInfo = evt.extendedProps;
              let timeDiff = new_date - programDate;
              let daysDiff = 0;
              if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);
              if (
                arg.draggedEl.dataset.calendar === "calendar" &&
                !arg.jsEvent.altKey
              ) {
                addProgramSessions[i].days = daysDiff;
              } else {
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
                  sessionURL: "",
                };
                addProgramSessions.push(newSession);
                for (let j = 0; j < paste_sessions.length; j++) {
                  if (addCopySessions[i]._id === paste_sessions[j]) {
                    paste_sessions_id[j] = calendarNo;
                  }
                }
                ++calendarNo;
              }
            }
          }
        }

        for (let i = 0; i < saveCopySessions.length; i++) {
          if ($.inArray(saveCopySessions[i]._id, paste_sessions_ass) > -1) {
            let calendar_no = 0;
            for (let j = 0; j < paste_sessions_ass.length; j++) {
              if (saveCopySessions[i]._id === paste_sessions_ass[j]) {
                paste_sessions_id[j] = calendarNo;
                calendar_no = paste_sessions[j];
              }
            }
            let evt = calendarApi.getEventById(calendar_no);
            let sess_start = evt.start;
            let timeDiff = Math.abs(
              sess_start.getTime() - week_start_paste.getTime()
            );
            let new_date = new Date(Math.abs(week_start.getTime() + timeDiff));
            let ddate = ("0" + new_date.getDate()).slice(-2);
            let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
            if (new_date.getTime() >= programDate.getTime()) {
              let sessInfo = evt.extendedProps;
              let timeDiff = new_date - programDate;
              let daysDiff = 0;
              if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);
              if (
                arg.draggedEl.dataset.calendar === "calendar" &&
                !arg.jsEvent.altKey
              ) {
                saveProgramSessions[i].days = daysDiff;
              } else {
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
                  sessionURL: "",
                };
                addProgramSessions.push(newSession);

                ++calendarNo;
              }
            }
          }
        }

        for (let i = 0; i < copySessions.length; i++) {
          if ($.inArray(copySessions[i].id, paste_sessions) > -1) {
            let evt = calendarApi.getEventById(copySessions[i].id);
            let sess_start = evt.start;
            let timeDiff = Math.abs(
              sess_start.getTime() - week_start_paste.getTime()
            );
            let new_date = new Date(Math.abs(week_start.getTime() + timeDiff));
            let ddate = ("0" + new_date.getDate()).slice(-2);
            let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
            if (new_date.getTime() >= programDate.getTime()) {
              let sessInfo = evt.extendedProps;
              if (
                arg.draggedEl.dataset.calendar === "calendar" &&
                !arg.jsEvent.altKey
              ) {
                let newEvent = {
                  id: programSessions[i].id,
                  title: evt.title,
                  start:
                    new_date.getFullYear() +
                    "-" +
                    dmonth +
                    "-" +
                    ddate +
                    " 00:00:00",
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
                    sessionURL: sessInfo.sessionURL,
                  },
                };
                programSessions[i] = newEvent;
              } else {
                let calendar_no = 0;
                for (let j = 0; j < paste_sessions.length; j++) {
                  if (copySessions[i].id === paste_sessions[j]) {
                    calendar_no = paste_sessions_id[j];
                  }
                }
                let newEvent = {
                  id: calendar_no,
                  title: evt.title,
                  start:
                    new_date.getFullYear() +
                    "-" +
                    dmonth +
                    "-" +
                    ddate +
                    " 00:00:00",
                  durationEditable: false,
                  startEditable: true,
                  extendedProps: {
                    sessAssId: calendar_no + "",
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
                    sessionURL: "",
                  },
                };
                programSessions.push(newEvent);
              }
            }
          }
        }
      }
      this.setState({
        programSessions,
        saveProgramSessions,
        addProgramSessions,
        calendarNo,
      });
    }

    
  };
  handleDropLeft = (arg) => {
    console.log(arg.draggedEl.dataset.calendar);
    if (this.state.programId === "") {
      alert("Please select a program");
    } else if (arg.draggedEl.dataset.sessid !== undefined) {
      let programSessions = [...this.state.programSessions];
      let addprogramSessions = [...this.state.addprogramSessions];
      let calendarNo = this.state.calendarNo;

      let newEvent = {
        id: calendarNo,
        title: arg.draggedEl.title,
        start: arg.date,
        durationEditable: false,
        startEditable: true,
        extendedProps: {
          title: arg.draggedEl.title,
          sessAssId: calendarNo + "",
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
          sessionURL: "",
          isNew: "yes",
        },
      };
      programSessions.push(newEvent);

      let programDate = new Date(this.state.programStartDate + " 00:00:00");
      let timeDiff = arg.date - programDate;
      let daysDiff = 0;
      if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);
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
        sessionURL: "",
      };
      addprogramSessions.push(newSession);

      //let calendarApi = this.calendarRef.current.getApi();
      //calendarApi.addEvent(newEvent);
      ++calendarNo;
      this.setState({ programSessions, addprogramSessions, calendarNo });
    } else if (arg.draggedEl.dataset.copymonth !== undefined && arg.draggedEl.dataset.calendar === "calendar1") {
      let programSessions = [...this.state.programSessions];
      let addprogramSessions = [...this.state.addprogramSessions];
      let calendarNo = this.state.calendarNo;

      let calendarApi = this.calendarRef.current.getApi();
      let programDate = new Date(this.state.programStartDate + " 00:00:00");
      $("#calendar1 .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-day-grid .fc-row.fc-week").each(function (ind) {
        for (let i = 1; i <= 7; i++) {
          let events_date = $(".fc-bg .fc-day.fc-widget-content:nth-child(" + i + ")",this).data("date");
          let events_new_date = $( "#calendar .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-day-grid .fc-row.fc-week:nth-child(" +(ind + 1) +") .fc-bg .fc-day.fc-widget-content:nth-child(" +
              i +
              ")"
          ).data("date");
          let events_new_date_obj = new Date(events_new_date + " 00:00:00");

          if (events_new_date_obj.getTime() >= programDate.getTime()) {
            $('.fc-content-skeleton table tbody input.box-date[value="' +events_date +'"]',this).each(function () {
             
              let ele = $(this).parent();
              let evt = calendarApi.getEventById(ele.find(".e-id").val());
              let sessInfo = evt.extendedProps;

              let newEvent = {
                id: calendarNo,
                title: evt.title,
                start: events_new_date + " 00:00:00",
                durationEditable: false,
                startEditable: true,
                extendedProps: {
                  title: evt.title,
                  sessAssId: calendarNo + "",
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
                  sessionURL: "",
                },
              };
              programSessions.push(newEvent);

              let timeDiff = events_new_date_obj - programDate;
              let daysDiff = 0;
              if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);
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
                sessionURL: "",
              };
              addprogramSessions.push(newSession);
              ++calendarNo;
            });
          }
        }
      });
      this.setState({ programSessions, addprogramSessions, calendarNo });
    } else if (arg.draggedEl.dataset.copyweek !== undefined) {
      let programSessions = [...this.state.programSessions];
      let addprogramSessions = [...this.state.addprogramSessions];
      let saveProgramSessions = [...this.state.saveprogramSessions];
      let copySessions = [];
      let addCopySessions = [];
      let saveCopySessions = [];
      let calendarNo = this.state.calendarNo;

      if (arg.draggedEl.dataset.calendar === "calendar1") {
        copySessions = [...this.state.programSessionsRight];
        addCopySessions = [...this.state.addProgramSessionsRight];
        saveCopySessions = [...this.state.saveprogramSessionsRight];
      } else {
        copySessions = [...this.state.programSessions];
        addCopySessions = [...this.state.addprogramSessions];
        saveCopySessions = [...this.state.saveprogramSessions];
      }

      let paste_sessions = [],
        paste_sessions_ass = [],
        paste_sessions_id = [];
      $(arg.draggedEl)
        .parents(".fc-row.fc-week.fc-widget-content")
        .find(".fc-event-container .e-id")
        .each(function (ind, ele) {
          paste_sessions.push(parseInt($(ele).val()));
          paste_sessions_ass.push(
            $(ele).parent().children(".sess-ass-id")[0].value
          );
        });

      let week_start_paste = $(arg.draggedEl)
        .parents(".fc-day.fc-widget-content")
        .data("date");
        
      if (week_start_paste === undefined) {
        week_start_paste = $(arg.draggedEl)
          .parents(".fc-day.fc-widget-content")
          .parent();
        week_start_paste = $("td:last-child", week_start_paste).data("date");
        if (week_start_paste != undefined) {
          week_start_paste = new Date(week_start_paste + " 00:00:00");
          week_start_paste = new Date(
            week_start_paste.setDate(week_start_paste.getDate() - 6)
          );
        }
      } else week_start_paste = new Date(week_start_paste + " 00:00:00");
     
      if (paste_sessions.length > 0 && week_start_paste != undefined) {
        let calendarApi = {};
        if (arg.draggedEl.dataset.calendar === "calendar1")
          calendarApi = this.calendarRef.current.getApi();
        else calendarApi = this.calendarRef1.current.getApi();
        let mbtGetDateDay = new Date(arg.date);
        let mbtday = mbtGetDateDay.getDay();
        let mbtdiff = mbtGetDateDay.getDate() - mbtday + (mbtday == 0 ? -6 : 1);
        let week_start = new Date(mbtGetDateDay.setDate(mbtdiff));
        let programDate = new Date(this.state.programStartDate + " 00:00:00");

        for (let i = 0; i < addCopySessions.length; i++) {
          if ($.inArray(addCopySessions[i]._id, paste_sessions) > -1) {
            let evt = calendarApi.getEventById(addCopySessions[i]._id);
            let sess_start = evt.start;
            let timeDiff = Math.abs(
              sess_start.getTime() - week_start_paste.getTime()
            );
            let new_date = new Date(Math.abs(week_start.getTime() + timeDiff));
            let ddate = ("0" + new_date.getDate()).slice(-2);
            let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
            if (new_date.getTime() >= programDate.getTime()) {
              let sessInfo = evt.extendedProps;
              let timeDiff = new_date - programDate;
              let daysDiff = 0;
              if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);
              if (
                arg.draggedEl.dataset.calendar === "calendar" &&
                !arg.jsEvent.altKey
              ) {
                addprogramSessions[i].days = daysDiff;
              } else {
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
                  sessionURL: "",
                };
                addprogramSessions.push(newSession);
                for (let j = 0; j < paste_sessions.length; j++) {
                  if (addCopySessions[i]._id === paste_sessions[j]) {
                    paste_sessions_id[j] = calendarNo;
                  }
                }
                ++calendarNo;
              }
            }
          }
        }

        for (let i = 0; i < saveCopySessions.length; i++) {
          if ($.inArray(saveCopySessions[i]._id, paste_sessions_ass) > -1) {
            let calendar_no = 0;
            for (let j = 0; j < paste_sessions_ass.length; j++) {
              if (saveCopySessions[i]._id === paste_sessions_ass[j]) {
                paste_sessions_id[j] = calendarNo;
                calendar_no = paste_sessions[j];
              }
            }
            let evt = calendarApi.getEventById(calendar_no);
            let sess_start = evt.start;
            let timeDiff = Math.abs(sess_start.getTime() - week_start_paste.getTime());
            let programDate = new Date(this.state.programStartDate + " 00:00:00");
            let new_date = new Date(Math.abs(week_start.getTime() + timeDiff));
            let ddate = ("0" + new_date.getDate()).slice(-2);
            let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
            if (new_date.getTime() >= programDate.getTime()) {
              let sessInfo = evt.extendedProps;
              let timeDiff = new_date - programDate;
              let daysDiff = 0;
              if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);
              if (
                arg.draggedEl.dataset.calendar === "calendar" &&
                !arg.jsEvent.altKey
              ) {
                saveProgramSessions[i].days = daysDiff;
              } else {
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
                  sessionURL: "",
                };
                addprogramSessions.push(newSession);

                ++calendarNo;
              }
            }
          }
        }

        for (let i = 0; i < copySessions.length; i++) {
          if ($.inArray(copySessions[i].id, paste_sessions) > -1) {
            let evt = calendarApi.getEventById(copySessions[i].id);
            let sess_start = evt.start;
            let timeDiff = Math.abs(
              sess_start.getTime() - week_start_paste.getTime()
            );
            let new_date = new Date(Math.abs(week_start.getTime() + timeDiff));
            let ddate = ("0" + new_date.getDate()).slice(-2);
            let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
            if (new_date.getTime() >= programDate.getTime()) {
              let sessInfo = evt.extendedProps;
              if (
                arg.draggedEl.dataset.calendar === "calendar" &&
                !arg.jsEvent.altKey
              ) {
                let newEvent = {
                  id: programSessions[i].id,
                  title: evt.title,
                  start:
                    new_date.getFullYear() +
                    "-" +
                    dmonth +
                    "-" +
                    ddate +
                    " 00:00:00",
                  durationEditable: false,
                  startEditable: true,
                  extendedProps: {
                    title: evt.title,
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
                    sessionURL: sessInfo.sessionURL,
                  },
                };
                programSessions[i] = newEvent;
              } else {
                let calendar_no = 0;
                for (let j = 0; j < paste_sessions.length; j++) {
                  if (copySessions[i].id === paste_sessions[j]) {
                    calendar_no = paste_sessions_id[j];
                  }
                }
                let newEvent = {
                  id: calendar_no,
                  title: evt.title,
                  start:
                    new_date.getFullYear() +
                    "-" +
                    dmonth +
                    "-" +
                    ddate +
                    " 00:00:00",
                  durationEditable: false,
                  startEditable: true,
                  extendedProps: {
                    title: evt.title,
                    sessAssId: calendar_no + "",
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
                    sessionURL: "",
                  },
                };
                programSessions.push(newEvent);
              }
            }
          }
        }
      }

      this.setState({
        programSessions,
        saveProgramSessions,
        addprogramSessions,
        calendarNo,
      });
    }
    else if (arg.draggedEl.dataset.copysingleday !== undefined) {
      let programSessions = [...this.state.programSessions];
      let addprogramSessions = [...this.state.addprogramSessions];
      let saveProgramSessions = [...this.state.saveprogramSessions];
      let copySessions = [];
      let addCopySessions = [];
      let saveCopySessions = [];
      let calendarNo = this.state.calendarNo;
      let day_start_paste = $(arg.draggedEl).parents().data('date');
      if (arg.draggedEl.dataset.calendar === "calendar1") {
        copySessions = [...this.state.programSessionsRight];
        addCopySessions = [...this.state.addProgramSessionsRight];
        saveCopySessions = [...this.state.saveprogramSessionsRight];
      } else {
        copySessions = [...this.state.programSessions];
        addCopySessions = [...this.state.addprogramSessions];
        saveCopySessions = [...this.state.saveprogramSessions];
      }

      let paste_sessions = [],
        paste_sessions_ass = [],
        paste_sessions_id = [];
        $(arg.draggedEl).parents(".fc-content-skeleton").find('.fc-event-container .e-id').each(function (ind, ele) {
  
          if (day_start_paste == $(ele).parent().children(".box-date")[0].value) {
            paste_sessions.push(parseInt($(ele).val()));
            paste_sessions_ass.push($(ele).parent().children(".sess-ass-id")[0].value);
          }
        });

      
        
      if (day_start_paste === undefined) {
        day_start_paste = $(arg.draggedEl)
          .parents(".fc-day.fc-widget-content")
          .parent();

          day_start_paste = $("td:last-child", day_start_paste).data("date");
        if (day_start_paste != undefined) {
          day_start_paste = new Date(day_start_paste + " 00:00:00");
          day_start_paste = new Date(
            day_start_paste.setDate(day_start_paste.getDate() - 6)
          );
        }
      } else day_start_paste = new Date(day_start_paste + " 00:00:00");
       
      if (paste_sessions.length > 0 && day_start_paste != undefined) {
        let calendarApi = {};
        if (arg.draggedEl.dataset.calendar === "calendar1")
          calendarApi = this.calendarRef.current.getApi();
        else calendarApi = this.calendarRef1.current.getApi();
        let mbtGetDateDay = new Date(arg.date);
        
        let mbtday = mbtGetDateDay.getDay();
        let mbtdiff = mbtGetDateDay.getDate() - mbtday ;
        let day_start = new Date(mbtGetDateDay);
        let programDate = new Date(this.state.programStartDate + " 00:00:00");

        for (let i = 0; i < addCopySessions.length; i++) {
          if ($.inArray(addCopySessions[i]._id, paste_sessions) > -1) {
            let evt = calendarApi.getEventById(addCopySessions[i]._id);
            let sess_start = evt.start;
            let timeDiff = Math.abs(
              sess_start.getTime() - day_start_paste.getTime()
            );
            let new_date = new Date(Math.abs(day_start.getTime() + timeDiff));
            let ddate = ("0" + new_date.getDate()).slice(-2);
            let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
            if (new_date.getTime() >= programDate.getTime()) {
              let sessInfo = evt.extendedProps;
              let timeDiff = new_date - programDate;
              let daysDiff = 0;
              if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);
              if (
                arg.draggedEl.dataset.calendar === "calendar" &&
                !arg.jsEvent.altKey
              ) {
                addprogramSessions[i].days = daysDiff;
              } else {
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
                  sessionURL: "",
                };
                addprogramSessions.push(newSession);
                for (let j = 0; j < paste_sessions.length; j++) {
                  if (addCopySessions[i]._id === paste_sessions[j]) {
                    paste_sessions_id[j] = calendarNo;
                  }
                }
                ++calendarNo;
              }
            }
          }
        }

        for (let i = 0; i < saveCopySessions.length; i++) {
          if ($.inArray(saveCopySessions[i]._id, paste_sessions_ass) > -1) {
            let calendar_no = 0;
            for (let j = 0; j < paste_sessions_ass.length; j++) {
              if (saveCopySessions[i]._id === paste_sessions_ass[j]) {
                paste_sessions_id[j] = calendarNo;
                calendar_no = paste_sessions[j];
              }
            }
            let evt = calendarApi.getEventById(calendar_no);
            let sess_start = evt.start;
            let timeDiff = Math.abs(sess_start.getTime() - day_start_paste.getTime());
            let programDate = new Date(this.state.programStartDate + " 00:00:00");
            let new_date = new Date(Math.abs(day_start.getTime() + timeDiff));
            let ddate = ("0" + new_date.getDate()).slice(-2);
            let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
            if (new_date.getTime() >= programDate.getTime()) {
              let sessInfo = evt.extendedProps;
              let timeDiff = new_date - programDate;
              let daysDiff = 0;
              if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);
              if (
                arg.draggedEl.dataset.calendar === "calendar" &&
                !arg.jsEvent.altKey
              ) {
                saveProgramSessions[i].days = daysDiff;
              } else {
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
                  sessionURL: "",
                };
                addprogramSessions.push(newSession);

                ++calendarNo;
              }
            }
          }
        }

        for (let i = 0; i < copySessions.length; i++) {
          if ($.inArray(copySessions[i].id, paste_sessions) > -1) {
            let evt = calendarApi.getEventById(copySessions[i].id);
            let sess_start = evt.start;
            let timeDiff = Math.abs(
              sess_start.getTime() - day_start_paste.getTime()
            );
            let new_date = new Date(Math.abs(day_start.getTime() + timeDiff));
            let ddate = ("0" + new_date.getDate()).slice(-2);
            let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
            if (new_date.getTime() >= programDate.getTime()) {
              let sessInfo = evt.extendedProps;
              console.log(arg.draggedEl.dataset.calendar);
              if (arg.draggedEl.dataset.calendar === "calendar" && !arg.jsEvent.altKey) {
                console.log('in if');
                let newEvent = {
                  id: programSessions[i].id,
                  title: evt.title,
                  start: new_date.getFullYear() +"-" +dmonth + "-" + ddate +" 00:00:00",
                  durationEditable: false,
                  startEditable: true,
                  extendedProps: {
                    title: evt.title,
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
                    sessionURL: sessInfo.sessionURL,
                  },
                };
                programSessions[i] = newEvent;
              } else {
                console.log('in else');
                let calendar_no = 0;
                for (let j = 0; j < paste_sessions.length; j++) {
                  if (copySessions[i].id === paste_sessions[j]) {
                    calendar_no = paste_sessions_id[j];
                  }
                }
                let newEvent = {
                  id: calendar_no,
                  title: evt.title,
                  start:
                    new_date.getFullYear() +
                    "-" +
                    dmonth +
                    "-" +
                    ddate +
                    " 00:00:00",
                  durationEditable: false,
                  startEditable: true,
                  extendedProps: {
                    title: evt.title,
                    sessAssId: calendar_no + "",
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
                    sessionURL: "",
                  },
                };
                programSessions.push(newEvent);
              }
            }
          }
        }
      }

      this.setState({
        programSessions,
        saveProgramSessions,
        addprogramSessions,
        calendarNo,
      });
    }


  };
  handleDropRight = (arg) => {
    if (this.state.rightProgramId === "") {
      alert("Please load program");
    } else if (arg.draggedEl.dataset.sessid !== undefined) {
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
          title: arg.draggedEl.title,
          sessAssId: calendarNo + "",
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
          sessionURL: "",
          isNew: "yes",
        },
      };
      programSessionsRight.push(newEvent);

      let programDate = new Date(
        this.state.programStartDateRight + " 00:00:00"
      );
      let timeDiff = arg.date - programDate;
      let daysDiff = 0;
      if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);
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
        sessionURL: "",
      };
      addProgramSessionsRight.push(newSession);

      ++calendarNo;
      this.setState({
        programSessionsRight,
        addProgramSessionsRight,
        calendarNo,
      });
    } else if (
      arg.draggedEl.dataset.copymonth !== undefined &&
      arg.draggedEl.dataset.calendar === "calendar"
    ) {
      let programSessionsRight = [...this.state.programSessionsRight];
      let addProgramSessionsRight = [...this.state.addProgramSessionsRight];
      let calendarNo = this.state.calendarNo;

      let calendarApi = this.calendarRef1.current.getApi();
      let programDate = new Date(
        this.state.programStartDateRight + " 00:00:00"
      );
      $(
        "#calendar .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-day-grid .fc-row.fc-week"
      ).each(function (ind) {
        for (let i = 1; i <= 7; i++) {
          let events_date = $(
            ".fc-bg .fc-day.fc-widget-content:nth-child(" + i + ")",
            this
          ).data("date");
          let events_new_date = $(
            "#calendar1 .fc-view-container .fc-dayGridMonth-view .fc-day-grid-container .fc-day-grid .fc-row.fc-week:nth-child(" +
              (ind + 1) +
              ") .fc-bg .fc-day.fc-widget-content:nth-child(" +
              i +
              ")"
          ).data("date");
          let events_new_date_obj = new Date(events_new_date + " 00:00:00");

          if (events_new_date_obj.getTime() >= programDate.getTime()) {
            $(
              '.fc-content-skeleton table tbody input.box-date[value="' +
                events_date +
                '"]',
              this
            ).each(function () {
              let ele = $(this).parent();
              let evt = calendarApi.getEventById(ele.find(".e-id").val());
              let sessInfo = evt.extendedProps;

              let newEvent = {
                id: calendarNo,
                title: evt.title,
                start: events_new_date + " 00:00:00",
                durationEditable: false,
                startEditable: true,
                extendedProps: {
                  title: evt.title,
                  sessAssId: calendarNo + "",
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
                  sessionURL: "",
                },
              };
              programSessionsRight.push(newEvent);

              let timeDiff = events_new_date_obj - programDate;
              let daysDiff = 0;
              if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);
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
                sessionURL: "",
              };
              addProgramSessionsRight.push(newSession);
              ++calendarNo;
            });
          }
        }
      });
      this.setState({
        programSessionsRight,
        addProgramSessionsRight,
        calendarNo,
      });
    } 
    else if (arg.draggedEl.dataset.copyweek !== undefined) {
      let programSessionsRight = [...this.state.programSessionsRight];
      let addProgramSessionsRight = [...this.state.addProgramSessionsRight];
      let saveProgramSessionsRight = [...this.state.saveprogramSessionsRight];
      let copySessions = [];
      let addCopySessions = [];
      let saveCopySessions = [];
      let calendarNo = this.state.calendarNo;

      if (arg.draggedEl.dataset.calendar === "calendar") {
        copySessions = [...this.state.programSessions];
        addCopySessions = [...this.state.addprogramSessions];
        saveCopySessions = [...this.state.saveprogramSessions];
      } else {
        copySessions = [...this.state.programSessionsRight];
        addCopySessions = [...this.state.addProgramSessionsRight];
        saveCopySessions = [...this.state.saveprogramSessionsRight];
      }

      let paste_sessions = [],
        paste_sessions_ass = [],
        paste_sessions_id = [];
      $(arg.draggedEl)
        .parents(".fc-row.fc-week.fc-widget-content")
        .find(".fc-event-container .e-id")
        .each(function (ind, ele) {
          paste_sessions.push(parseInt($(ele).val()));
          paste_sessions_ass.push(
            $(ele).parent().children(".sess-ass-id")[0].value
          );
        });
      let week_start_paste = $(arg.draggedEl)
        .parents(".fc-day.fc-widget-content")
        .data("date");
      if (week_start_paste === undefined) {
        week_start_paste = $(arg.draggedEl)
          .parents(".fc-day.fc-widget-content")
          .parent();
        week_start_paste = $("td:last-child", week_start_paste).data("date");
        if (week_start_paste != undefined) {
          week_start_paste = new Date(week_start_paste + " 00:00:00");
          week_start_paste = new Date(
            week_start_paste.setDate(week_start_paste.getDate() - 6)
          );
        }
      } else week_start_paste = new Date(week_start_paste + " 00:00:00");

      if (paste_sessions.length > 0 && week_start_paste != undefined) {
        let calendarApi = {};
        if (arg.draggedEl.dataset.calendar === "calendar")
          calendarApi = this.calendarRef1.current.getApi();
        else calendarApi = this.calendarRef.current.getApi();
        let mbtGetDateDay = new Date(arg.date);
        let mbtday = mbtGetDateDay.getDay();
        let mbtdiff = mbtGetDateDay.getDate() - mbtday + (mbtday == 0 ? -6 : 1);
        let week_start = new Date(mbtGetDateDay.setDate(mbtdiff));
        let programDate = new Date(
          this.state.programStartDateRight + " 00:00:00"
        );

        for (let i = 0; i < addCopySessions.length; i++) {
          if ($.inArray(addCopySessions[i]._id, paste_sessions) > -1) {
            let evt = calendarApi.getEventById(addCopySessions[i]._id);
            let sess_start = evt.start;
            let timeDiff = Math.abs(
              sess_start.getTime() - week_start_paste.getTime()
            );
            let new_date = new Date(Math.abs(week_start.getTime() + timeDiff));
            let ddate = ("0" + new_date.getDate()).slice(-2);
            let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
            if (new_date.getTime() >= programDate.getTime()) {
              let sessInfo = evt.extendedProps;
              let timeDiff = new_date - programDate;
              let daysDiff = 0;
              if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);
              if (
                arg.draggedEl.dataset.calendar === "calendar1" &&
                !arg.jsEvent.altKey
              ) {
                addProgramSessionsRight[i].days = daysDiff;
              } else {
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
                  sessionURL: "",
                };
                addProgramSessionsRight.push(newSession);
                for (let j = 0; j < paste_sessions.length; j++) {
                  if (addCopySessions[i]._id === paste_sessions[j]) {
                    paste_sessions_id[j] = calendarNo;
                  }
                }
                ++calendarNo;
              }
            }
          }
        }

        for (let i = 0; i < saveCopySessions.length; i++) {
          if ($.inArray(saveCopySessions[i]._id, paste_sessions_ass) > -1) {
            let calendar_no = 0;
            for (let j = 0; j < paste_sessions_ass.length; j++) {
              if (saveCopySessions[i]._id === paste_sessions_ass[j]) {
                paste_sessions_id[j] = calendarNo;
                calendar_no = paste_sessions[j];
              }
            }
            let evt = calendarApi.getEventById(calendar_no);
            let sess_start = evt.start;
            let timeDiff = Math.abs(
              sess_start.getTime() - week_start_paste.getTime()
            );
            let new_date = new Date(Math.abs(week_start.getTime() + timeDiff));
            let ddate = ("0" + new_date.getDate()).slice(-2);
            let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
            if (new_date.getTime() >= programDate.getTime()) {
              let sessInfo = evt.extendedProps;
              let timeDiff = new_date - programDate;
              let daysDiff = 0;
              if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);
              if (
                arg.draggedEl.dataset.calendar === "calendar1" &&
                !arg.jsEvent.altKey
              ) {
                saveProgramSessionsRight[i].days = daysDiff;
              } else {
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
                  sessionURL: "",
                };
                addProgramSessionsRight.push(newSession);

                ++calendarNo;
              }
            }
          }
        }

        for (let i = 0; i < copySessions.length; i++) {
          if ($.inArray(copySessions[i].id, paste_sessions) > -1) {
            let evt = calendarApi.getEventById(copySessions[i].id);
            let sess_start = evt.start;
            let timeDiff = Math.abs(
              sess_start.getTime() - week_start_paste.getTime()
            );
            let new_date = new Date(Math.abs(week_start.getTime() + timeDiff));
            let ddate = ("0" + new_date.getDate()).slice(-2);
            let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
            if (new_date.getTime() >= programDate.getTime()) {
              let sessInfo = evt.extendedProps;
              if (
                arg.draggedEl.dataset.calendar === "calendar1" &&
                !arg.jsEvent.altKey
              ) {
                let newEvent = {
                  id: programSessionsRight[i].id,
                  title: evt.title,
                  start:
                    new_date.getFullYear() +
                    "-" +
                    dmonth +
                    "-" +
                    ddate +
                    " 00:00:00",
                  durationEditable: false,
                  startEditable: true,
                  extendedProps: {
                    title: evt.title,
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
                    sessionURL: sessInfo.sessionURL,
                  },
                };
                programSessionsRight[i] = newEvent;
              } else {
                let calendar_no = 0;
                for (let j = 0; j < paste_sessions.length; j++) {
                  if (copySessions[i].id === paste_sessions[j]) {
                    calendar_no = paste_sessions_id[j];
                  }
                }
                let newEvent = {
                  id: calendar_no,
                  title: evt.title,
                  start:
                    new_date.getFullYear() +
                    "-" +
                    dmonth +
                    "-" +
                    ddate +
                    " 00:00:00",
                  durationEditable: false,
                  startEditable: true,
                  extendedProps: {
                    title: evt.title,
                    sessAssId: calendar_no + "",
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
                    sessionURL: "",
                  },
                };
                programSessionsRight.push(newEvent);
              }
            }
          }
        }
      }
      this.setState({
        programSessionsRight,
        saveProgramSessionsRight,
        addProgramSessionsRight,
        calendarNo,
      });
    } else if(arg.draggedEl.dataset.copysingleday!== undefined){
      let programSessionsRight = [...this.state.programSessionsRight];
      let addProgramSessionsRight = [...this.state.addProgramSessionsRight];
      let saveprogramSessionsRight = [...this.state.saveprogramSessionsRight];
      let copySessions = [];
      let addCopySessions = [];
      let saveCopySessions = [];
      let calendarNo = this.state.calendarNo;
      let day_start_paste = $(arg.draggedEl).parents().data('date');
      if (arg.draggedEl.dataset.calendar === "calendar") {
        copySessions = [...this.state.programSessions];
        addCopySessions = [...this.state.addprogramSessions];
        saveCopySessions = [...this.state.saveprogramSessions];
      } else {
        copySessions = [...this.state.programSessionsRight];
        addCopySessions = [...this.state.addProgramSessionsRight];
        saveCopySessions = [...this.state.saveprogramSessionsRight];
      }
      
     
     

      let paste_sessions = [],
        paste_sessions_ass = [],
        paste_sessions_id = [];
        $(arg.draggedEl).parents(".fc-content-skeleton").find('.fc-event-container .e-id').each(function (ind, ele) {
  
          if (day_start_paste == $(ele).parent().children(".box-date")[0].value) {
            paste_sessions.push(parseInt($(ele).val()));
            paste_sessions_ass.push($(ele).parent().children(".sess-ass-id")[0].value);
          }
        });
    
      if (day_start_paste === undefined) {
        day_start_paste = $(arg.draggedEl)
          .parents(".fc-day.fc-widget-content")
          .parent();
          day_start_paste = $("td:last-child", day_start_paste).data("date");
        if (day_start_paste != undefined) {
          day_start_paste = new Date(day_start_paste + " 00:00:00");
          day_start_paste = new Date(
            day_start_paste.setDate(day_start_paste.getDate() - 6)
          );
        }
      } else day_start_paste = new Date(day_start_paste + " 00:00:00");

      if (paste_sessions.length > 0 && day_start_paste != undefined) {
        let calendarApi = {};
        if (arg.draggedEl.dataset.calendar === "calendar")
          calendarApi = this.calendarRef1.current.getApi();
        else calendarApi = this.calendarRef.current.getApi();
        let mbtGetDateDay = new Date(arg.date);
        let mbtday = mbtGetDateDay.getDay();
        let mbtdiff = mbtGetDateDay.getDate() - mbtday ;
        let day_start = new Date(mbtGetDateDay);
        let programDate = new Date(
          this.state.programStartDateRight + " 00:00:00"
        );

        for (let i = 0; i < addCopySessions.length; i++) {
          if ($.inArray(addCopySessions[i]._id, paste_sessions) > -1) {
            let evt = calendarApi.getEventById(addCopySessions[i]._id);
            let sess_start = evt.start;
            let timeDiff = Math.abs(
              sess_start.getTime() - day_start_paste.getTime()
            );
            let new_date = new Date(Math.abs(day_start.getTime() + timeDiff));
            let ddate = ("0" + new_date.getDate()).slice(-2);
            let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
            if (new_date.getTime() >= programDate.getTime()) {
              let sessInfo = evt.extendedProps;
              let timeDiff = new_date - programDate;
              let daysDiff = 0;
              if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);
              if (arg.draggedEl.dataset.calendar === "calendar1" && !arg.jsEvent.altKey) {
                addProgramSessionsRight[i].days = daysDiff;
              } else {
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
                  sessionURL: "",
                };
                addProgramSessionsRight.push(newSession);
                for (let j = 0; j < paste_sessions.length; j++) {
                  if (addCopySessions[i]._id === paste_sessions[j]) {
                    paste_sessions_id[j] = calendarNo;
                  }
                }
                ++calendarNo;
              }
            }
          }
        }

        for (let i = 0; i < saveCopySessions.length; i++) {
          if ($.inArray(saveCopySessions[i]._id, paste_sessions_ass) > -1) {
            let calendar_no = 0;
            for (let j = 0; j < paste_sessions_ass.length; j++) {
              if (saveCopySessions[i]._id === paste_sessions_ass[j]) {
                paste_sessions_id[j] = calendarNo;
                calendar_no = paste_sessions[j];
              }
            }
            let evt = calendarApi.getEventById(calendar_no);
            let sess_start = evt.start;
            let timeDiff = Math.abs(
              sess_start.getTime() - day_start_paste.getTime()
            );
            let new_date = new Date(Math.abs(day_start.getTime() + timeDiff));
            let ddate = ("0" + new_date.getDate()).slice(-2);
            let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
            if (new_date.getTime() >= programDate.getTime()) {
              let sessInfo = evt.extendedProps;
              let timeDiff = new_date - programDate;
              let daysDiff = 0;
              if (timeDiff > 0) daysDiff = timeDiff / (1000 * 60 * 60 * 24);
              if ( arg.draggedEl.dataset.calendar === "calendar1" && !arg.jsEvent.altKey) {
              
                saveprogramSessionsRight[i].days = daysDiff;
              } else {
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
                  sessionURL: "",
                };
                addProgramSessionsRight.push(newSession);

                ++calendarNo;
              }
            }
          }
        }

        for (let i = 0; i < copySessions.length; i++) {
          if ($.inArray(copySessions[i].id, paste_sessions) > -1) {
            let evt = calendarApi.getEventById(copySessions[i].id);
            let sess_start = evt.start;
            let timeDiff = Math.abs(
              sess_start.getTime() - day_start_paste.getTime()
            );
            let new_date = new Date(Math.abs(day_start.getTime() + timeDiff));
            let ddate = ("0" + new_date.getDate()).slice(-2);
            let dmonth = ("0" + (new_date.getMonth() + 1)).slice(-2);
            if (new_date.getTime() >= programDate.getTime()) {
              let sessInfo = evt.extendedProps;
              if (
                arg.draggedEl.dataset.calendar === "calendar1" &&
                !arg.jsEvent.altKey
              ) {
                let newEvent = {
                  id: programSessionsRight[i].id,
                  title: evt.title,
                  start:
                    new_date.getFullYear() +
                    "-" +
                    dmonth +
                    "-" +
                    ddate +
                    " 00:00:00",
                  durationEditable: false,
                  startEditable: true,
                  extendedProps: {
                    title: evt.title,
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
                    sessionURL: sessInfo.sessionURL,
                  },
                };
                programSessionsRight[i] = newEvent;
              } else {
                let calendar_no = 0;
                for (let j = 0; j < paste_sessions.length; j++) {
                  if (copySessions[i].id === paste_sessions[j]) {
                    calendar_no = paste_sessions_id[j];
                  }
                }
                let newEvent = {
                  id: calendar_no,
                  title: evt.title,
                  start:
                    new_date.getFullYear() +
                    "-" +
                    dmonth +
                    "-" +
                    ddate +
                    " 00:00:00",
                  durationEditable: false,
                  startEditable: true,
                  extendedProps: {
                    title: evt.title,
                    sessAssId: calendar_no + "",
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
                    sessionURL: "",
                  },
                };
                programSessionsRight.push(newEvent);
              }
            }
          }
        }
      }
      this.setState({
        programSessionsRight,
        saveprogramSessionsRight,
        addProgramSessionsRight,
        calendarNo,
      });
    }
  };
  handleSingleDayLeft = (info) => { 
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
  render() {
    let leftSidebarDisplay = null;
    if (!this.state.loading) {
      leftSidebarDisplay = (
        <LeftSidebar
          club={this.state.club}
          sidebarDisplay={this.state.leftSidebarDisplay}
          leftSidebarChange={this.leftSidebarChange}
        />
      );
    }
    return (
      <div className="container-large clearfix">
        <div
          id="wrapper"
          className={
            "coach-planner" +
            (this.state.leftSidebarDisplay ? "" : " toggled-left") +
            (this.state.rightSidebarDisplay ? "" : " toggled-right")
          }
        >
          {leftSidebarDisplay}
          <div id="page-content-wrapper" className="mbt-wrapper-option">
            <div className="container-fluid">
              <div className="row">
                <div className="col-lg-12-large">
                  <div
                    className="top-header-bar mrgn-btm0"
                    style={{ minHeight: "50px" }}
                  >
                    <a
                      href="#menu-toggle-left"
                      className="menu-toggle-left"
                      id="show-after-left-close"
                      style={
                        !this.state.leftSidebarDisplay
                          ? { display: "inline-block" }
                          : {}
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        this.leftSidebarChange();
                      }}
                    >
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                      <span className="icon-bar"></span>
                    </a>
                    <div className="tp-top">
                      Program Start Date:{" "}
                      <input
                        type="text"
                        id="split-program-start-date"
                        defaultValue={this.state.programStartDate}
                        style={{ paddingLeft: "10px", width: "200px" }}
                      />
                    </div>
                    <a
                      href="#menu-toggle-right"
                      className="menu-toggle-right search-icon f-right"
                      id="show-after-right-close"
                      title="Search"
                      style={
                        !this.state.rightSidebarDisplay
                          ? { visibility: "visible" }
                          : {}
                      }
                      onClick={(e) => {
                        e.preventDefault();
                        this.rightSidebarChange();
                      }}
                    >
                      <i className="fa fa-search" aria-hidden="true"></i>
                    </a>
                  </div>

                  <div
                    className="cstmtoolbx"
                    style={{ display: "block", width: "50%", float: "left" }}
                  >
                    <div className="row clearfix">
                      <div className="col-md-4">
                        <span className="programe-title-name">
                          {this.state.programTitle}
                        </span>
                      </div>
                      <div className="col-md-8">
                        <div className="slmnthin adjust-itsmt"></div>
                        <span className="update-program-wrapper">
                          <a id="update-split-program" href="">
                            Done
                          </a>
                          <a
                            id="update-split-program"
                            onClick={(e) => this.savePrograms(e)}
                            href=""
                          >
                            Save
                          </a>
                        </span>
                        {/*<button onClick={this.gotoPast}>go to a date in the past</button>*/}
                      </div>
                    </div>
                    <div id="calendar">
                      <FullCalendar
                        defaultView="dayGridMonth"
                        editable={true}
                        droppable={true}
                        firstDay={1}
                        eventReceive={this.handleEventReceive}                                                                          
                        drop={this.handleDropLeft}
                        dragRevertDuration={0}
                        plugins={[dayGridPlugin, interactionPlugin]}
                        ref={this.calendarRef1}
                        eventRender={this.handleEventRender}
                        events={this.state.programSessions}
                        eventDrop={this.handleEventDrop}
                        dateClick={this.handleSingleDayLeft}
                        //defaultDate={this.state.programStartDate}
                      />
                    </div>
                  </div>
                  <div
                    className="cstmtoolbx cstmtoolbx-split-view"
                    style={{ display: "block", width: "50%", float: "left" }}
                  >
                    <div className="row clearfix">
                      <div className="col-md-4">
                        {/* <div className="custom-select">
													<select className="form-control" id="program-title-list" name="program-title-list" value=''>
														<option value="">Select Program</option>
													</select>
												</div> */}
                      </div>
                      <div className="col-md-8">
                        <span className="update-program-wrapper">
                          <a
                            id="load-split-program"
                            onClick={(e) => this.loadPrograms(e)}
                            href=""
                          >
                            Load Program
                          </a>
                        </span>
                        <span className="update-program-wrapper">
                          <a
                            id="update-split-program"
                            onClick={(e) => this.saveProgramsRight(e)}
                            href=""
                          >
                            Save
                          </a>
                        </span>
                        <span
                          className="update-program-wrapper"
                          style={{ display: "none" }}
                        >
                          <a id="update-split-program" href="">
                            Done
                          </a>
                        </span>
                      </div>
                    </div>
                    <div id="calendar1">
                      <FullCalendar
                        defaultView="dayGridMonth"
                        editable={true}
                        droppable={true}
                        firstDay={1}
                        drop={this.handleDropRight}
                        plugins={[dayGridPlugin, interactionPlugin]}
                        ref={this.calendarRef}
                        //eventRender={this.handleEventRender}
                        eventReceive={this.handleEventReceiveRight}
                        eventRender={this.handleEventRenderRight}
                        events={this.state.programSessionsRight}
                        eventDrop={this.handleEventDropRight}
                        dateClick={this.handleSingleDayRight}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <RightSidebar
              club={this.state.club}
              rightSidebarChange={this.rightSidebarChange}
              plannerSplit={"no"}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedProgramId: state.planner.rightProgramId,
    sessData: state.planner.sesstimeData,
    user: state.auth.user,
  };
};

export default connect(mapStateToProps, {
  showStrengthSession,
  loadProgram,
  showAddSession,
  showSessionDescription,
  viewSessions,
  editSessionTime,
})(ProgramSplitView);