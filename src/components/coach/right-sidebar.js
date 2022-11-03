import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import Select from 'react-select';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import 'react-tabs/style/react-tabs.css';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import { Draggable } from '@fullcalendar/interaction';
//import RightSidebarPrograms from './right-sidebar-programs';
import { selectedPopulateSession,ShowEditProgram, updateSeachSession, updateSeachProgram, showAddSession, showSessionDescription, viewSessions } from '../../actions';
import * as API from '../../utils/api.js';
import $ from 'jquery';
class RightSidebar extends Component {
	constructor(props){
		super(props);
		this.state = {
			showHideSession: 'none', value: { min: 0, max: 0 },
			StrengthSessionState: 'none',
			programData: [],
			programDetail: {
				searching: '',
			},
			strengthSessionDetail: {
				ss_title: '',
				ss_keyword: '',
				ss_activitytype: '',
				ss_to_hours: '',
				ss_to_minutes: '',
				ss_from_hours: '',
				ss_from_minutes: '',
				ss_ex_type: '',
			},
			normalSearchSession: '',
			normalSearchStrengthSession: '',
			sessionDetail: {
				session_title: '',
				session_keyword: '',
				session_activity_types: '',
				athlete_levels: '',
				session_Components: '',
				sports_keywords: '',
				to_str_session_hours: '',
				to_str_session_minuts: '',
				from_str_session_hours: '',
				from_str_session_minuts: '',
				session_range: '',
				session_unit: 'km',
			},
			sessionResults: [],
			strengthSessionResults: [],
			components: [],
			activityType: [],
			sskeyWords: [],
			activeClass:null,
		}
		
		this.showHideSessionSearch = this.showHideSessionSearch.bind(this);
		this.showHideStrengthSession = this.showHideStrengthSession.bind(this);
		this.handleProgramSearch = this.handleProgramSearch.bind(this);
		this.onKeyDownHandler = this.onKeyDownHandler.bind(this);
		this.onKeyDownSession = this.onKeyDownSession.bind(this);
		this.onKeyDownNSession = this.onKeyDownNSession.bind(this);
		this.handleSession = this.handleSession.bind(this);
		this.handlexComponentsChange = this.handlexComponentsChange.bind(this);
		this.handlexSportsChange = this.handlexSportsChange.bind(this);
		this.searchSession = this.searchSession.bind(this);
		this.handleNormalSearch = this.handleNormalSearch.bind(this);
		this.submitNormalSearch = this.submitNormalSearch.bind(this);
		this.handleStrengthSearch = this.handleStrengthSearch.bind(this);
		this.handleSSAdvanceSearch = this.handleSSAdvanceSearch.bind(this);
		this.resetSSForm = this.resetSSForm.bind(this);
		this.rightSidebarChange = this.rightSidebarChange.bind(this);
		this.sessionDraggable = '';
		this.strengthSessionDraggable = '';
	}
	
	componentDidMount() {
		API.getSessionFormData().then(formdata => {
			this.setState({
				activityType: formdata.activitype,
				components: formdata.componentArr,
				sskeyWords: formdata.sskeywords,
			})
		});
	}
	
	componentDidUpdate(prevProps, prevState){
		let sessionDraggableEl = document.getElementById("session-events");
		let strengthSessionDraggableEl = document.getElementById("strength-session-events");
		if(sessionDraggableEl){
			if(this.sessionDraggable !== ''){
				this.sessionDraggable.destroy();
			}
			this.sessionDraggable = new Draggable(sessionDraggableEl, {
				itemSelector: ".session-drag",
				eventData: function (eventEl) {
					//console.log(eventEl);
					return {
						title: eventEl.getAttribute("title"),
						create: false
					};
				}
			});
		}
		if(strengthSessionDraggableEl){
			if(this.strengthSessionDraggable !== ''){
				this.strengthSessionDraggable.destroy();
			}
			this.strengthSessionDraggable = new Draggable(strengthSessionDraggableEl, {
				itemSelector: ".session-drag",
				eventData: function (eventEl) {
					//console.log(eventEl);
					return {
						title: eventEl.getAttribute("title"),
						create: false
					};
				}
			});
		}
	}
	
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.updateProgramState) {
			setTimeout(() => {
				let data = this.state.programDetail;

				API.searchProgram(data).then(programdata => {
					this.setState({ programData: programdata });
				})
			}, 1000);
			//this.props.updateSeachExercise(false);
		}
		if(nextProps.updateSessionState){
			let data = {};
			data['sDetail'] = this.state.normalSearchSession;
			data['clubId'] = this.props.club._id;
			API.searchNormalSession(data).then(searchdata => {
				this.setState({
					sessionResults: searchdata
				});
			})
		}
	}
	
	showHideSessionSearch = (e, dis) => {
		if(e !== null)
			e.preventDefault();
		if (dis === 'none') {
			this.setState({ showHideSession: 'block' });
		} else if (dis === 'block') {
			this.setState({ showHideSession: 'none' });
		}
	}
	
	showHideStrengthSession = (dis) => {
		if (dis === 'none') {
			this.setState({ StrengthSessionState: 'block' });
		} else if (dis === 'block') {
			this.setState({ StrengthSessionState: 'none' });
		}
	}
	
	handleProgramSearch(e) {
		this.setState({ programDetail: { ...this.state.programDetail, [e.target.name]: e.target.value } });
	}
	
	onKeyDownHandler(e) {
		let data = this.state.programDetail;
		if (e.keyCode === 13) {
			API.searchProgram(data).then(programdata => {
				this.setState({ programData: programdata });
			})
		}
	}
	populateStrengthSession(info){
		this.props.selectedPopulateSession(info);
	}
	
	onKeyDownSession(e) {
		let data = this.state.programDetail;
		if (e.keyCode === 13) {
			API.searchProgram(data).then(programdata => {
				this.setState({ programData: programdata });
			})
		}
	}
	
	onKeyDownNSession(e) {
		if (e.keyCode === 13) {
			let data = {};
			data['sDetail'] = this.state.normalSearchSession;
			data['clubId'] = this.props.club._id;
			API.searchNormalSession(data).then(searchdata => {
				this.setState({
					sessionResults: searchdata
				});
			})
		}
	}
	
	keydownSession(e) {
		if (e.keyCode === 13) {
			let data = {};
			data['sDetail'] = this.state.normalSearchStrengthSession;
			data['clubId'] = this.props.club._id;
			API.searcStrengthSession(data).then(strengthdata => {
				this.setState({
					strengthSessionResults: strengthdata,
				});
			})
		}
	}
	
	editProgram = (e, id) => {
		e.preventDefault();
		this.props.ShowEditProgram(id);
	}
	
	handleSession(e) {
		this.setState({ sessionDetail: { ...this.state.sessionDetail, [e.target.name]: e.target.value } });
	}
	
	handlexComponentsChange(e) {
		this.setState({ sessionDetail: { ...this.state.sessionDetail, session_Components: e } });
	}
	
	EditSession(id, e) {
		e.preventDefault();
		this.props.showAddSession(id);
	}
	
	ViewSession(id, e){
		e.preventDefault();
		this.props.viewSessions(id);
	}
	
	ShowSessionDesc(des, e) {
		e.preventDefault();
		this.props.showSessionDescription(des);
	}
	
	handlexSportsChange(e) {
		this.setState({ sessionDetail: { ...this.state.sessionDetail, sports_keywords: e } });
	}
	
	searchSession(e) { 
		e.preventDefault();
		this.showHideSessionSearch(null, this.state.showHideSession)
		let data = {};
		data['sessionDetail'] = this.state.sessionDetail;
		data['rangeValue'] = this.state.value;
		data['clubId'] = this.props.club._id;
		API.searchSession(data).then(searchdata => {
			this.setState({
				sessionResults: searchdata
			});
		})
	}
	
	handleNormalSearch(e) {
		this.setState({ normalSearchSession: e.target.value });
	}
	
	submitNormalSearch() {
		let data = {};
		data['sDetail'] = this.state.normalSearchSession;
		data['clubId'] = this.props.club._id;
		API.searchNormalSession(data).then(searchdata => {
			this.setState({
				sessionResults: searchdata
			});
		})
	}
	
	handleStrengthSearch(e) {
		this.setState({ normalSearchStrengthSession: e.target.value })
	}
	
	handleSSAdvanceSearch(e) {
		this.setState({ strengthSessionDetail: { ...this.state.strengthSessionDetail, [e.target.name]: e.target.value } });
	}
	
	submitNormalStrengthSearch() {
		let data = {};
		data['sDetail'] = this.state.normalSearchStrengthSession;
		data['clubId'] = this.props.club._id;
		API.searcStrengthSession(data).then(strengthdata => {
			this.setState({
				strengthSessionResults: strengthdata,
			});
		})

	}
	
	resetSSForm(e) {
		//	this.setState({ strengthSessionDetail: { ...this.state.strengthSessionDetail, ss_title: ''} });
		e.preventDefault();
		this.setState({
			strengthSessionDetail: {
				ss_title: '',
				ss_keyword: '',
				ss_activitytype: '',
				ss_to_hours: '',
				ss_to_minutes: '',
				ss_from_hours: '',
				ss_from_minutes: '',
			}
		})
	}
	
	submitAdvanceStrengthSearch() {
		let data = {};
		data['sessionDetail'] = this.state.strengthSessionDetail;
		data['clubId'] = this.props.club._id;
		this.showHideStrengthSession(this.state.StrengthSessionState)
		API.searchAdvanceStrengthSession(data).then(strengthdata => {
			
			this.setState({
				strengthSessionResults: strengthdata,
			});
		})
	}
	
	rightSidebarChange(e){
		e.preventDefault();
		this.props.rightSidebarChange();
	}
	
	onDragStart = (e, id, title, color, weeks) => {
		e.dataTransfer.setData('id', id);
		e.dataTransfer.setData('title', title);
		e.dataTransfer.setData('color', color);
		e.dataTransfer.setData('weeks', weeks);
		e.dataTransfer.setData('status', 'new');
	}
	
	plannerSplitDisplay(e, id){
		e.preventDefault();
		this.props.plannerSplitDisplay(id);
	}
	handleClassClick = id => {
		this.setState({ activeClass: id });
		console.log(this.state.activeClass);
	  };
	  handleCancelSession= () => {
		this.setState({ activeClass: '' });
		$('.ss_session.active .ntes-per-btns').hide();
		$(".fc-widget-content td").removeClass('selectedDate');
	  }

	render(){
		let timeInterval = [];
		for (let i = 0; i < 25; i++) {
			timeInterval.push(<option key={'timeInterval' + i} value={i}>{i} Hours</option>);
		}

		let timeIntervalsec = [];
		for (let i = 0; i < 60; i++) {
			timeIntervalsec.push(<option key={'timeIntervalsec' + i} value={i}>{i} Minute</option>);
		}
		return(
			<div id="sidebar-wrapper-right">
				<Tabs className="rightbartab">
					{/* Side bar header starts */}
					<div className="head-section">
						<a href="#menu-toggle" className="menu-toggle-right" id="" onClick={(e) => this.rightSidebarChange(e)}>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</a>
						<span className="search-labled">Search Programs or Session</span>
						<a href="" className="refresh-icon"> <i className="fa fa-refresh refresh-btn" aria-hidden="true"></i></a>
					</div>
					{/* Side bar header ends */}
					<TabList>
						<Tab >Programs</Tab>
						<Tab >Sessions</Tab>
						<Tab >Strength</Tab>
					</TabList>

					<TabPanel>
						<div className="tab-content clearfix">
							<div id="programs" className="tab-pane active in">
								<div className="search-field">
									<input type="text" name="searching" id="program-search" onKeyDown={this.onKeyDownHandler} onChange={this.handleProgramSearch} placeholder="Type min 3 characters to search in title" className="filter" />
								</div>
								<div className="results-found">
									<span className="program-count">Showing {this.state.programData.length ? this.state.programData.length : 0} Programs</span>
									<span className="blub-icon"><img className="lazy" src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%201%201'%3E%3C/svg%3E" data-src="https://tri-alliance.com/wp-content/plugins/coaching-mate-2/images/blub-shine.png" alt="" /></span>
								</div>
							</div>
							<div className="results-programe scroll-pane jspScrollable">
								<div className="jspContainer">
									<div className="jspPane">
										{/*<RightSidebarPrograms club={this.props.club} programData={this.state.programData} />*/}
										<ul className="clearfix">
											{this.state.programData.map(prodata => (
												<li key={'program-search'+prodata._id} draggable className="fadein program-drag prog-drag-search" onDragStart={(e) => this.onDragStart(e, prodata._id, prodata.title, prodata.phase.colorcode, prodata.weeks)}>
													<div className="heading-pro"><p>{prodata.title}</p></div>
													<div className="icon-pro">
														<Link to={'/' + this.props.club.slug + '/program-split-view/' + prodata.slug} title="Program Split View">
															<img src="https://tri-alliance.com/wp-content/plugins/coaching-mate-2/images/icon-dual.gif" alt="" />
														</Link>
														<a className="edit-program" href="" onClick={(e) => this.editProgram(e, prodata._id)} title="Edit Program">
															<img src="https://tri-alliance.com/wp-content/plugins/coaching-mate-2/images/icon-sess-edit.png" alt="" /></a>
														{this.props.plannerSplit === 'yes' && <a className="program-split-view" href='' onClick={(e) => this.plannerSplitDisplay(e, prodata._id)} title="Planner Split View">
															<img src="https://tri-alliance.com/wp-content/plugins/coaching-mate-2/images/icon-dual.gif" alt="" />
														</a>}
													</div>
												</li>
											))}
										</ul>
									</div>
									<div className="xxxjspVerticalBar">
										<div className="xxxjspCap xxxjspCapTop"></div>
										<div className="xxxjspTrack">
											<div className="xxxjspDrag">
												<div className="xxxjspDragTop"></div>
												<div className="xxxjspDragBottom"></div>
											</div>
										</div>
										<div className="xxxjspCap xxxjspCapBottom"></div>
									</div>
								</div>
							</div>
						</div>
					</TabPanel>
					<TabPanel>
						<div className="search-field">
							<input type="text" name="searching" id="session-search" placeholder="Type min 3 characters to search in title" className="filter" onKeyDown={this.onKeyDownNSession} onChange={this.handleNormalSearch} />
							<i id="filtersubmit" className="fa fa-search" onClick={() => this.submitNormalSearch()} ></i>
						</div>
						<div className="create-planner-btn extcss2"  >
							<input type="button" className="loadplannerbtn open-advancedSearch extcss1" name="" value="Advance Search" onClick={(e) => this.showHideSessionSearch(e, this.state.showHideSession)} />
						</div>
						<div className="results-found">
							<span className="session-count">Showing  Sessions</span>
							<span className="blub-icon"><img className="lazy" src="data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%201%201'%3E%3C/svg%3E" data-src="https://tri-alliance.com/wp-content/plugins/coaching-mate-2/images/blub-shine.png" alt="" /></span>
						</div>
						<div className="session-container  clearfix ">
							<div className="session-results clearfix scroll-pane jspScrollable extcss" tabIndex="0">
								<div className="jspContainer extcss3" >
									<div className="jspPane extcss4" >
										<ul id="session-events" className="clearfix">
											{this.state.sessionResults!='' && this.state.sessionResults.map(ssresults => (
												<li key={"session-results-"+ssresults._id} className="ui-draggable ui-draggable-handle">
													<div className="listing-panel session-drag" title={ssresults.title} data-unit={ssresults.unit} data-distance={ssresults.distance == undefined ? 0 : ssresults.distance.$numberDecimal} data-rpeload={ssresults.rpeLoad} data-hours={ssresults.hours} data-minutes={ssresults.minutes} data-sesstime={ssresults.sessTime} data-activitytype={ssresults.activityType.value} data-imgurl={ssresults.activityType.imgUrl} data-color={ssresults.activityType.color} data-sessid={ssresults._id} data-sesstype={"normal"} data-exercisestotal={0} style={{border: '1px solid #f2f2f2', background: '#fff', borderRadius: '3px', padding: '0px 10px', float: 'left', position: 'relative', textAlign: 'left', marginBottom: '0px', width: '100%', cursor: 'pointer'}}>
														<div className="img-icon" style={{width: '30px', float: 'left', padding: '6px 0', cursor: 'pointer', textAlign: 'left'}}><img width="30px" className="img-responsive" src={API.getServerUrl().apiURL+'/uploads/images/' + ssresults.activityType.imgUrl} style={{cursor: 'pointer', textAlign: 'left'}} /></div>
														<div className="heading-pro-session" style={{width: '70%', textAlign: 'left', float: 'none', borderLeft: '1px solid #f2f2f2', padding: '6px 0', paddingLeft: '7px', display: 'table-cell'}}><p style={{color: '#3d4146', fontSize: '13px'}}>{ssresults.title}</p></div>
														<div className="icon-pro-sess" style={{float: 'none', width: '58px', padding: '6px 0', textAlign: 'left', display: 'table-cell'}}>
															<a title="Description" className="session-desc-view" onClick={(e) => this.ShowSessionDesc(ssresults.description, e)} href=""><img src="https://tri-alliance.com/wp-content/plugins/coaching-mate-2/images/desc-icon.png" alt="" style={{margin: '1px'}} /></a>
															<a title="Session Details" className="session-detail-view" href="" onClick={(e) => this.ViewSession(ssresults._id, e)} ><img src="https://tri-alliance.com/wp-content/plugins/coaching-mate-2/images/icon-sess-view.png" alt="" /></a>
															<a title="Edit Session" className="session-edit-view" onClick={(e) => this.EditSession(ssresults._id, e)} href=""><img src="https://tri-alliance.com/wp-content/plugins/coaching-mate-2/images/icon-sess-edit.png" alt="" /></a>
														</div>
													</div>
												</li>
											))}
										</ul>
									</div>
								</div>
							</div>
						</div>
					</TabPanel>
					<TabPanel>
						<div id="session-strength" className="tab-pane   strength-tab-cntent active in">

							<div className="search-field">
								<input type="text" name="searching" id="search-strength-session" placeholder="Start Typing Name" className="filter" onKeyDown={this.onKeyDownSession} onChange={this.handleStrengthSearch} />
								<button type="button" onClick={() => this.submitNormalStrengthSearch()}> <i id="" className="fa fa-search"></i></button>
							</div>

							<div className="create-planner-btn extcss6"  >
								<input id="adv-search-btn-mbt" type="button" className="loadplannerbtn extcss5" name="" value="Advance Search" onClick={() => this.showHideStrengthSession(this.state.StrengthSessionState)} />
							</div>
							<div className="advanced-search-panel tempr" style={{ display: this.state.StrengthSessionState }}></div>
							<div className='session-results-strength'>
								<ul id="strength-session-events" >
									{
									this.state.strengthSessionResults.map(ssresults => (
										<li key={"strength-session-results-"+ssresults._id} className={"ss_session " + (ssresults._id === this.state.activeClass  ? 'active' : '')}>
											<div className="listing-panel session-drag" title={ssresults.title} data-unit={ssresults.unit} data-distance={ssresults.distance == undefined ? 0 : ssresults.distance.$numberDecimal} data-rpeload={ssresults.rpeLoad} data-hours={ssresults.hours} data-minutes={ssresults.minutes} data-sesstime={ssresults.sessTime} data-activitytype={ssresults.activityType.value} data-imgurl={ssresults.activityType.imgUrl} data-color={ssresults.activityType.color} data-sessid={ssresults._id} data-sesstype={"strength"} data-exercisestotal={ssresults.exercises.length}>
												<a className="restl-cntnr"  onClick={() => this.handleClassClick(ssresults._id)} href="javascript:void(0)">
													<div className="adhdng-tp heading-pro-session">
														<p>{ssresults.title}</p>
														<h6 className="total-cntr-exe">{ssresults.exercises.length} Exercises</h6>
													</div>
												</a>
												
												<div className="icon-pro-sess" >
													<Link to={'/team/' + this.props.club.slug + '/edit-session/' + ssresults._id}>
														<img src="/uploads/images/icon-sess-edit.png" alt="" />
													</Link>
												</div>
												<div class="note-ad-mbt" style={{display: ssresults._id === this.state.activeClass  ? 'block' : 'none' }}	> <p> Note: Choose date(s) into calendar to populate <a href="javascript:void(0)" onClick={() => this.handleCancelSession('')} class="ad-cncl-btn2"> <i class="fa fa-close" aria-hidden="true"></i> </a></p> </div>
												<div class="ntes-per-btns">  <a href="javascript:;" onClick={() => this.handleCancelSession('')} class="ad-cncl-btn"> Cancel  </a>  <a href="javascript:void(0)" onClick={() => this.populateStrengthSession(ssresults)} class="populate-btn"> Populate Now  </a> </div>
											</div>
										</li>
									))
									}
								</ul>
							</div>
							<div className="advanced-search-panel tempr reactadvanced-search" style={{ display: this.state.StrengthSessionState }}>
								<div className="strength-advancedSrh">

								
									<h3 className="ad-sesn-hdng">Advance Session
									   <a href="" onClick={(e) => this.resetSSForm(e)} className="reset-adSearch">Reset</a>
									</h3>
									<div className="col-sm-12-large">
										<div className="form-group">

											<div className="d-flex">
												<label className="container-check">Flexibility
													<input type="radio"  type="radio" name="ss_ex_type" value="flexibility" onChange={this.handleSSAdvanceSearch} />
													<span className="checkmark"></span>
												</label>

												<label className="container-check space-right" >Exercise
													<input type="radio" name="radio" name="ss_ex_type" value="exercise" onChange={this.handleSSAdvanceSearch}/>
													<span className="checkmark"></span>
												</label>
												</div>
													

											<div className="form-group">
												<input type="text" className="form-control" required="" name="ss_title" placeholder="By Title" onChange={this.handleSSAdvanceSearch} value={this.state.strengthSessionDetail.ss_title} />
											</div>
											<div className="form-group">
												<input type="text" className="form-control" required="" name="ss_keyword" placeholder="Keyword" onChange={this.handleSSAdvanceSearch} value={this.state.strengthSessionDetail.ss_keyword} />
											</div>

											<div className="panel-body-mbt  text-left">
												<h5>Select Activity Type</h5>
												<div className="radio-buttons scroll-pane jspScrollable">
													{this.state.activityType.map(acttype => (
														<span key={"advStrengthSearchActivityType-"+acttype._id}>
															<input id={"activity" + acttype._id} value={acttype._id} type="radio" name="ss_activitytype" onChange={this.handleSSAdvanceSearch} />
															<label htmlFor={"activity" + acttype._id}> <img src={API.getServerUrl().apiURL+'/uploads/images/' + acttype.imgUrl} alt="" />  {acttype.title}</label>
														</span>

													))}


												</div>

											</div>
											<h3 className="ad-sesn-hdng">Duration</h3>
											<div className="form-group minuts-select clearfix flex-cont-mbt">
												<label htmlFor="adFrom_session_hours" className="lft-cnt-lable">From</label>
												<div className="input-cover ">
													<select name="ss_to_hours" onChange={this.handleSSAdvanceSearch} className="styled-select left-fist" defaultValue="">
														<option value="" disabled="">HH</option>
														{timeInterval}
													</select>
													<select id="ss_to_minutes" name="ss_to_minutes" onChange={this.handleSSAdvanceSearch} className="styled-select left-second" defaultValue="">
														<option value="" disabled="">MM</option>
														{timeIntervalsec}
													</select>
												</div>
											</div>
											<div className="form-group minuts-select clearfix flex-cont-mbt">
												<label htmlFor="adFrom_session_hours" className="lft-cnt-lable">To</label>
												<div className="input-cover ">
													<select name="ss_from_hours" onChange={this.handleSSAdvanceSearch} className="styled-select left-fist" defaultValue="">
														<option value="" disabled="">HH</option>
														{timeInterval}
													</select>
													<select id="ad_session_minuts" value={this.state.strengthSessionDetail.ss_from_minutes} onChange={this.handleSSAdvanceSearch} name="ss_from_minutes" className="styled-select left-second">
														<option value="" disabled="">MM</option>
														{timeIntervalsec}
													</select>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className="bttns-cncel-search">
									<a href="javascript:;" onClick={() => this.showHideStrengthSession(this.state.StrengthSessionState)} className="tab-cncel-btn">
										Cancel
									</a>
									<a href="javascript:;" onClick={() => this.submitAdvanceStrengthSearch()} className="tab-srch-btn">
										Search
									</a>
								</div>
							</div>
						</div>
					</TabPanel>
				</Tabs>
				<div className="advanced-search-panel tempr tab-sessionAdvancedSearch" style={{ display: this.state.showHideSession }}>
					<h3>Advance Session Search</h3>
					<div className="search-form scroll-pane-full extcss7">
					<div className="form-search-inner-container">
						<div className="form-group">
							<label>Session Title:</label>
							<div className="reletive">
								<input type="text" className="form-control input-option" name='session_title' id="sess-title" placeholder="Start Typing Title" onChange={this.handleSession} /></div>
						</div>
						<div className="form-group">
							<label>Session Keyword:</label>
							<div className="reletive"><input type="text" name='session_keyword' onChange={this.handleSession} className="form-control input-option" id="sess-keyword" placeholder="Start Typing Keyword" /></div>
						</div>
						<div className="form-group ">
							<label className="form-label" htmlFor="addSessionFamilyName">Activity Type</label>
							<select id="activity-types" name='session_activity_types' onChange={this.handleSession} className="form-control">
								<option value="">Please Select</option>
								{this.state.activityType.map(acttype => (
									<option key={"advSearchActivityType-"+acttype._id} value={acttype._id}>{acttype.title}</option>

								))}
							</select>
						</div>
						<div className="form-group nopad rightmulti">
							<Form.Group as={Col} controlId="formBasicEmail" className='custom-selectbox nopad'>
								<Form.Label>Sport Keywords:</Form.Label>
								<Select isMulti
									//value={selectedOption}
									onChange={this.handlexSportsChange}
									options={this.state.sskeyWords}
								/>
							</Form.Group>
						</div>
						<div className="form-group ">
							<label className="form-label">Athlete Level</label>
							<select id="athlete-levels" name='athlete_levels' onChange={this.handleSession} className="form-control">
								<option value="">Select Level</option>
								<option value="Novice">Novice</option>
								<option value="Low/Intermediate">Low/Intermediate</option>
								<option value="Intermediate">Intermediate</option>
								<option value="Intermediate/Advanced">Intermediate/Advanced</option>
								<option value="Advanced">Advanced</option>
								<option value="Elite">Elite</option>
							</select>
						</div>
						<div className="form-group nopad rightmulti">
							<Form.Group as={Col} controlId="formBasicEmail" className='custom-selectbox nopad'>
								<Form.Label>Components:</Form.Label>
								<Select isMulti
									//value={selectedOption}
									onChange={this.handlexComponentsChange}
									options={this.state.components}
								/>
							</Form.Group>
						</div>
						<div className="panel-group custom-accor scroll-hide-onright" id="menuAccordion">
							<Accordion className="custom-accordian">
								<Card>
									<Card.Header>
										<Accordion.Toggle as={Button} variant="link" eventKey="0">
											Time and Distance</Accordion.Toggle>
									</Card.Header>
									<Accordion.Collapse eventKey="0">
										<Card.Body>
											<Form.Group className="exbx " controlId="addProgramAthleteLevel">
												{/* <Form.Label className="extyp">Type:</Form.Label> */}
												<Form.Check inline label="Km" type={'radio'} id='km' name='session_unit' onChange={this.handleSession} value='km' checked={true} />
												<Form.Check inline label="Miles" type={'radio'} id='miles' name='session_unit' onChange={this.handleSession} value='miles' />
											</Form.Group>
											<InputRange
												maxValue={50}
												minValue={0}
												value={this.state.value}
												onChange={value => this.setState({ value })}
											/>
											<div className='duration-section panel-title '>														
											<div className='durationheading panel-headings'> <h3>Duration</h3></div>
											
											
											<div className="row row-from">														
											<div className="col-sm-2">
												<label htmlFor="str_session_hours" className="small-fnt">To</label>
											</div>

												<div className="col-sm-5">
												<div className="styled-select small-field">
													<select id="str_session_hours" name="to_str_session_hours" onChange={this.handleSession} className="styled-select" defaultValue="">
														<option value="" disabled="">HH</option>
														{timeInterval}
													</select>
												</div>
													</div>
													<div className="col-sm-5">
													<div className="styled-select small-field">
													<select id="str_session_minuts" name="to_str_session_minuts" onChange={this.handleSession} className="styled-select" defaultValue="">
														<option value="" disabled="">MM</option>
														{timeIntervalsec}
													</select>
													</div>
												</div>
											</div>
											

											<div className="row row-from">
												<div className="col-sm-2">
													<label htmlFor="str_session_hours" className="small-fnt">From</label>
												</div>

												<div className="col-sm-5">
												<div className="styled-select small-field">
													<select id="str_session_hours" name="from_str_session_hours" onChange={this.handleSession} className="styled-select" defaultValue="">
														<option value="" disabled="">HH</option>
														{timeInterval}
													</select>
													</div>                                                                                                                                                                   
												</div>

												<div className="col-sm-5">
												<div className="styled-select small-field">
													<select id="str_session_minuts" name="from_str_session_minuts" onChange={this.handleSession} className="styled-select" defaultValue="">
														<option value="" disabled="">MM</option>
														{timeIntervalsec}
													</select>
												</div>
												</div>
											</div>


											</div>
										</Card.Body>
									</Accordion.Collapse>
								</Card>

							</Accordion>
						</div>
						</div>
						</div>
						<div className="advanced-search">
							<div className="panel-after" style={{ display: 'block' }}>
								<a href="" className="cancel-btn" onClick={(e) => this.showHideSessionSearch(e, this.state.showHideSession)}>Cancel</a>
								<a href="" onClick={(e) => this.searchSession(e)} className="search-btn">Search Sessions</a>
							</div>
						</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		updateProgramState: state.planner.updateSeachProgram,
		updateSessionState: state.planner.updateSeachSession
	};
};

export default withRouter(connect(mapStateToProps, {selectedPopulateSession,ShowEditProgram, updateSeachSession, updateSeachProgram, showAddSession, showSessionDescription, viewSessions})(RightSidebar));