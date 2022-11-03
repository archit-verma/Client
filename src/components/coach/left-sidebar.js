import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {connect} from 'react-redux';

import AddProgram from './modals/add-program';
import AddPlanner from './modals/add-planner';
import EditExercise from './modals/edit-exercise';
import AddExercise from './modals/add-exercise';
import EditProgram from './modals/edit-programs';

import SessionDesc from './modals/sessiondescription';
import EditSessionTime from './modals/edit-session-time';
import ShowStrengthSession from './modals/view-strength-session';
import AddSession from './modals/add-session';
import ViewSession from './modals/view-sessions';
import ViewEx from './modals/viewExercise';
import LoadPrograms from './modals/loadPrograms';
import PlannerAssignment from './modals/planner-assignment';
import PrepareAddSession from './modals/prepare-add-session';

import {programAddSession, loadPlanners, loadSessions, showAddPlanner, showAddProgram, showAddExercise, showAddSession, prepareAddSession} from '../../actions';

import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';

class LeftSidebar extends Component {
	constructor(props){
		super(props);
		
		/*this.state = {
			
		}*/
		
		this.loadPlannerVal = '';
		this.handleAddPlanner = this.handleAddPlanner.bind(this);
		this.handleAddProgram = this.handleAddProgram.bind(this);
		this.handleAddExercise = this.handleAddExercise.bind(this);
		this.handleAddSession = this.handleAddSession.bind(this);
		this.selectLoadPlanner = this.selectLoadPlanner.bind(this);
		this.handleLoadPlanner = this.handleLoadPlanner.bind(this);
	}
	componentDidMount(){
		this.props.loadPlanners(this.props.club._id);
		//this.props.loadSessions(this.props.club._id);
	}
	
	displayPlannersSelect(planner, ind){
		if(ind === 0){
			//this.setState({loadPlannerVal: planner.slug});
			this.loadPlannerVal = planner.slug;
		}
		return(
			<option key={'load-planner-sidebar'+planner._id} value={planner.slug}>{planner.title}</option>
		);
	}
	
	displayPlannersEdit(planner){
		return(
			<a href="edit-planner" key={'edit-planner-'+planner._id} onClick={e => this.handleAddPlanner(e, planner._id)}>{planner.title}</a>
		);
	}
	
	displaySessionsEdit(session){
		return(
			<a href="edit-session" key={'edit-session-'+session._id} onClick={e => this.programAddSession(e, session._id)}>{session.title}</a>
		);
	}
	
	programAddSession(e, id){
		e.preventDefault();
		this.props.programAddSession(id);
	}
	
	handleAddPlanner(e, id){
		e.preventDefault();
		this.props.showAddPlanner(id);
	}
	
	handleAddProgram(e){
		e.preventDefault();
		this.props.showAddProgram();
	}
	
	handleAddExercise(e){
		e.preventDefault();
		this.props.showAddExercise();
	}
	
	handleAddSession(e, id){
		e.preventDefault();
		this.props.showAddSession(id);
		//hf
		//this.props.prepareAddSession(id);
	}
	
	selectLoadPlanner(e){
		//this.setState({loadPlannerVal: e.target.value});
		this.loadPlannerVal = e.target.value;
	}
	
	handleLoadPlanner(e){
		e.preventDefault();
		this.props.history.push("/team/"+this.props.club.slug+"/planner/"+this.loadPlannerVal);
		window.location.reload();
	}
	
	leftSidebarChange(e){
		e.preventDefault();
		this.props.leftSidebarChange();
	}
	
	render(){
		let popup;
		if(this.props.modals.addPlanner)
			popup = <AddPlanner club={this.props.club} />;
		else if(this.props.modals.addProgram)
			popup = <AddProgram club={this.props.club} />;
		// hf
		else if (this.props.modals.prepareAddSession)
            popup = <PrepareAddSession club={this.props.club} />;
		else if(this.props.modals.addSession)
			popup = <AddSession club={this.props.club} />;
		else if(this.props.modals.addExercise)
			popup = <AddExercise club={this.props.club} />;
		else if(this.props.modals.editExercise)
			popup = <EditExercise club={this.props.club} />;
		else if(this.props.modals.editProgram)
			popup = <EditProgram club={this.props.club} />;
		else if(this.props.modals.viewExercise)
			popup = <ViewEx club={this.props.club} />;
		else if(this.props.modals.sessionDesc)
			popup = <SessionDesc club={this.props.club} />;
		else if(this.props.modals.viewSessions)
			popup = <ViewSession club={this.props.club} />;
		else if(this.props.modals.loadPrgrams)
			popup = <LoadPrograms club={this.props.club} />;
		else if(this.props.modals.editSessionTime)
			popup = <EditSessionTime club={this.props.club} />;
		else if(this.props.modals.showStrengthSession)
			popup = <ShowStrengthSession club={this.props.club} />;
		else if(this.props.modals.plannerAssignment)
			popup = <PlannerAssignment club={this.props.club} />;
		
		return(
			<div id="sidebar-wrapper-left" className={'sidebarleft'+(this.props.sidebarDisplay ? '':' sidebarLeftHide')}>
				{popup}
				
				<div className="wrapin">
					<div className="wrapin-inner">
						<a href="#menu-toggle-left" className="common-style menu-toggle-left" onClick={(e) => this.leftSidebarChange(e)}>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
							<span className="icon-bar"></span>
						</a>
						<div className="profile clearfix">
							<Link to={"/team/"+this.props.club.slug+"/coach-dashboard/"}>
								<div className="profile_pic"><img src="" className="avatar" width="50" height="50" alt="" /></div>
							</Link>
							<div className="profile_info">
								<h2>{this.props.user.firstName+' '+this.props.user.lastName}</h2>
								{/*<a href="" className="edit-profile dropdown-toggle" data-toggle="dropdown">
									<i className="fa fa-circle" aria-hidden="true"></i>
									<i className="fa fa-circle" aria-hidden="true"></i>
									<i className="fa fa-circle" aria-hidden="true"></i>
									<ul className="dropdown-menu custom-drop" role="menu">
										<li><a href="">Edit Profile</a></li>
										<li><a href="">Account Settings</a></li>
										<li><a href="">Change Password</a></li>
										<li><a href="">Logout</a></li>
									</ul>
								</a>*/}
							</div>
						</div>
						<hr />
						<ul className="nav side-menu">
							<li><Link to={"/team/"+this.props.club.slug+"/coach-dashboard/"}>Coach Dashboard</Link></li>
							<li><Link to={"/team/"+this.props.club.slug+"/private-messages/"}>Messages <span className=""></span></Link></li>
							<li><Link to={"/team/"+this.props.club.slug+"/workouts/"}>All Workouts<span className=""></span></Link></li>
						</ul>
						<div className="bgbtn">
							<DropdownButton variant="coaching-mate" size="sm" id="dropdown-add" title="Add">
								<Dropdown.Item onClick={e => this.handleAddPlanner(e, null)}>Add Planner</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item onClick={this.handleAddProgram}>Add Program</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item onClick={this.handleAddExercise}>Add Exercise</Dropdown.Item>
								<Dropdown.Divider />
								<Dropdown.Item onClick={e => this.handleAddSession(e, null)}>Add Session</Dropdown.Item>
								<Dropdown.Divider />

								<Dropdown.Item><Link to={"/team/"+this.props.club.slug+'/strength-session'}>Add Strength Session{' '}</Link></Dropdown.Item>
							</DropdownButton>
						</div>
						<div style={{marginTop:10}}>
							Load Planner
							<form method="post" action="/planner/">
								<div className="styled-select top-one">
									<select name="load-planner" id="load-planner-sidebar" style={{color:'#333333'}} onChange={this.selectLoadPlanner}>
										{this.props.planners.map(this.displayPlannersSelect.bind(this))}
									</select>
								</div>
								<div className="create-planner-btn" style={{marginTop:10}}>
									<input type="button" className="loadplannerbtn" name="" value="Load Planner" onClick={e => this.handleLoadPlanner(e)} />
								</div>
							</form>
						</div>
						<div className="tabbx">
							<ul className="nav nav-tabs" role="tablist">
								<li role="presentation" className="active"><a href="#home" aria-controls="home" role="tab" data-toggle="tab">Athletes</a></li>
								<li role="presentation"><a href="#profile" aria-controls="profile" role="tab" data-toggle="tab">Groups</a></li>
							</ul>
							<div className="tab-content">
								<div role="tabpanel" className="tab-pane fade active in show" id="home">
									<div className="srchbx">
										<input id="athlete-search" type="text" className="form-control" placeholder="Search Athletes" />
									</div>
									<div className="srchresbx athlete-count-show">
										<p>No Associated Athlete Found</p>
									</div>
									<div id="sidebar_athlete_tab" className="athlets-results clearfix scroll-pane-stripLeft">
										<ul id="ul_sidebar_athlete_tab">
											<li className="user_status_pink user_status_all">
												<div className="single-list">
													<div className="athlete-img"><a href="/athlete-profile/"><img src="" className="avatar" width="30" height="30" alt="" /></a></div>
													<div className="athlete-name"><a href="/athlete-profile/"></a></div>
													<a href="" className="edit-profile dropdown-toggle" data-toggle="dropdown">
														<i className="fa fa-circle" aria-hidden="true"></i>
														<i className="fa fa-circle" aria-hidden="true"></i>
														<i className="fa fa-circle" aria-hidden="true"></i>
													</a>
													<ul className="dropdown-menu custom-drop" role="menu">
														<li><a href="/athlete-profile/">View Profile</a></li>
														<li><a href="/private-messages/">Send Message</a></li>
													</ul>
												</div>
											</li>
										</ul>
										{/*this.props.planners.map(this.displayPlannersEdit.bind(this))*/}
										{/*this.props.sessions.map(this.displaySessionsEdit.bind(this))*/}
									</div>
									<div className="filters-colurs-dots">
										<div className="seprate-dots">
											<a href=""><span className="colurs-circle green-dot" style={{color: '#3cb779'}}><i className="fa fa-circle" aria-hidden="true"></i></span></a>
											<a href=""><span className="colurs-circle yellow-dot" style={{color: '#d8bc38'}}><i className="fa fa-circle" aria-hidden="true"></i></span></a>
											<a href=""><span className="colurs-circle pink-dot" style={{color: '#ee5f70'}}><i className="fa fa-circle" aria-hidden="true"></i></span></a>
										</div>
										<div className="mixed-filterable-dots active-all">
											<a href=""><span className="colurs-circle green-dot" style={{color: '#3cb779'}}><i className="fa fa-circle" aria-hidden="true"></i></span></a>
											<a href=""><span className="colurs-circle yellow-dot" style={{color: '#d8bc38'}}><i className="fa fa-circle" aria-hidden="true"></i></span></a>
											<a href=""><span className="colurs-circle pink-dot" style={{color: '#ee5f70'}}><i className="fa fa-circle" aria-hidden="true"></i></span></a>
										</div>
									</div>
								</div>
								<div role="tabpanel" className="tab-pane fade" id="profile">
									<div className="srchbx"><input id="groups-search" type="text" className="form-control" placeholder="Search Group" /></div>
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
		user: state.auth.user,
		modals: state.planner.modals,
		error: state.auth.error,
		loading: state.auth.loading,
		planners: state.planner.planners,
		sessions: state.planner.sessions
	};
};

export default withRouter(connect(mapStateToProps, {programAddSession, loadPlanners, loadSessions, showAddPlanner, showAddProgram, showAddExercise, showAddSession, prepareAddSession})(LeftSidebar));