import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import LeftSidebar from './left-sidebar';
import groupLinkIcon from '../../assets/icon1.gif';
import {getTeam} from '../../utils/api.js';

import loading from "../../assets/loading.svg";

class CoachDashboard extends Component {
	constructor(){
		super();
		this.state = {
			club: '',
			loading: true,
			leftSidebarDisplay: true
		};
		
		this.leftSidebarChange = this.leftSidebarChange.bind(this);
	}
	
	componentDidMount(){
		getTeam(this.props.clubSlug)
		.then(response => {
			if(response.team === null){
				this.setState({club: null});
			}
			else{
				if(response.team.creatorId === this.props.user._id)
					this.setState({club: response.team, loading: false});
				else
					this.setState({club: null});
			}
		});
	}
	
	leftSidebarChange(){
		this.setState({leftSidebarDisplay: !this.state.leftSidebarDisplay});
	}
	
	render(){
		if(this.state.club === null){
			return <Redirect to="/home" />;
		}
		if(this.state.loading){
			return (
                <div className='profile-container-loading'>
                    <img src={loading} alt="" />
                </div>
            );
		}
		
		return(
			<div className="container-large clearfix">
				<div id="wrapper" className={"coach-dashboard"+(this.state.leftSidebarDisplay ? "": " toggled-left")}>
					<LeftSidebar club={this.state.club} sidebarDisplay={this.state.leftSidebarDisplay} leftSidebarChange={this.leftSidebarChange} />
					<div id="page-content-wrapper">
						<div className="container-fluid">
							<div className="row">
								<div className="col-lg-12-large">
									<div className="dashboard-heading">
										<h3>
											<a href="#menu-toggle-left" className="menu-toggle-left" id="show-after-left-close" style={!this.state.leftSidebarDisplay ? {display: 'inline-block'} : {}} onClick={(e) => {e.preventDefault();this.leftSidebarChange()}}>
												<span className="icon-bar"></span>
												<span className="icon-bar"></span>
												<span className="icon-bar"></span>
											</a>
											Dashboard
										</h3>
									</div>
									<div className="sortable">
										<div className="col-mainleft">
											<div className="head-heading">
												<h4>Personal Info</h4>
											</div>
											<div className="profile-banner white-background clearfix">
												<div className="profile-image top-sapce">
													<img src="" className="avatar" alt="" width="150" height="150" />
												</div>
												<div className="athelete-name text-center">
													<h3>{this.props.user.firstName+' '+this.props.user.lastName}</h3>
												</div>
												<div className="athelete-info">
													<div className="clearfix"> <span className="f1-in">Level:</span> <span className="f2-in">Coach</span> </div>
			
													<div className="clearfix"> <span className="f1-in">Role:</span> <span className="f2-in"></span> </div>
													<div className="clearfix"> <span className="f1-in">Joined:</span> <span className="f2-in"></span> </div>
												</div>
											</div>
											<div className="gropus-sec m-p20">
												<div className="head-heading">
													<h4>Groups</h4>
												</div>
												<div className="grop-content white-background clearfix">
													<ul>
														<li>
															<a href="/athlete-planner/">
																<div className="group-img"><img src="http://dev.tri-alliance.com/wp-content/plugins/buddypress/bp-core/images/mystery-group-50.png" className="img-responsive group-37-avatar avatar-50 photo" alt="" width="50" height="50" /></div>
																<div className="group-content">
																	<div className="group-heading-meta">
																		<h4>Short Course</h4>
																	</div>
																	<div className="icon-place">
																		<img src={groupLinkIcon} alt="" />
																	</div>
																</div>
															</a>
															<div>
																<label htmlFor="cm-group-allow-individual-athlete-planner-group1-id">
																	<input type="checkbox" id="cm-group-allow-individual-athlete-planner-group1-id" data-group-id="group1-id" className="cm_group_allow_individual_athlete_planner" value="1" /> Allow Individual Athlete Planner
																</label>
															</div>
														</li>
													</ul>
													<div className="clearfix"></div>
												</div>
											</div>
										</div>
										<div className="col-maincenter">
											<div className="atheletes-panel">
												<div className="head-heading">
													<h4>Athletes</h4>
												</div>
												<div className="white-background container-panel clearfix">
													<div className="head-panel clearfix">
														<ul className="clearfix">
															<li className="ca-ist">Athlete</li>
															<li className="ca-ist2">Income</li>
															<li className="ca-ist3">Last Fortnight</li>
														</ul>
													</div>
													<div className="listing-panel scroll-option">
														<ul className="clearfix">
															<li>
																<div className="img-circle-style"><img src="" className="avatar" alt="" width="30" height="30" /></div>
																<div className="name-dis">
																	<a href="/athlete-profile/"><h4 title="">Athlete</h4></a>
																	<span>Athlete level</span>
																</div>
																<div className="income-show">Income total</div>
																<div className="last-mtnh-inco">Last month</div>
															</li>
														</ul>
													</div>
													<div className="total-section">
														<span className="clr-gry">Total: <span className="clr-gren">$Coach income total</span></span>
														<span className="seprator-line"> | </span>
														<span className="clr-gry">Last Fortnight: <span className="clr-gren">$Income last month</span></span>
													</div>
													<div className="popup-mnt-coach">
														<a href="" data-toggle="modal" data-target="#coach-earning-modal">Manage Extra Hours</a>
													</div>
												</div>
											</div>
										</div>
										<div className="col-mainright">
											<div className="notification">
												<div className="head-heading">
													<h4>Notifications</h4>
												</div>
												<div className="white-background">
													<div className="notification-listing">
														<ul>
															<li>
																<a href="" target="_blank">
																	<div className="bodyCon-nt">
																		<div className="bodyCon-head">
																			<span className="jbshead">Notification content</span>
																		</div>
																		<span className="date-dispay">Time passed</span>
																	</div>
																</a>
															</li>
														</ul>
													</div>
												</div>
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

export default connect(mapStateToProps, {})(CoachDashboard);