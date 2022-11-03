import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import LeftSidebar from './LeftSidebar';
import groupLinkIcon from '../../assets/icon1.gif';
import { getAthletePlanner } from '../../utils/api.js';

import loading from "../../assets/loading.svg";

class AthleteDashboard extends Component {
	constructor(){
		super();
		this.state = {
			club: '',
			loading: true
		};
	}
	
	componentDidMount(){
		getAthletePlanner(this.props.clubSlug, this.props.user._id, '')
			.then(result => {
				if (result.club === null) {
					this.setState({ club: null });
				}
				else if (result.planner === null) {
					this.setState({ planner: null });
				}
				else {
					this.setState({ club: result.club, planner: result.planner, loading: false });
				}
			});
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
		
		let programs_list = [];
		if(this.state.planner.programs.length > 0){
			this.state.planner.programs.forEach((item) => {
				programs_list.push(<li key={'program-'+item._id}>{item.title}</li>);
			});
		}
		else{
			programs_list.push(<li key={'no-programs'}>No Programs Found</li>);
		}
		
		return(
			<div className="container-large clearfix">
				<div id="wrapper" className="athlete-dashboard athlete-profile">
					<LeftSidebar club={this.state.club} />
					<div id="page-content-wrapper">
						<div className="container-fluid">
							<div className="row">
								<div className="col-lg-12-large w-100">
									<div className="sortable-deactive items-container clearfix">
										<div className="tab-content flwctrl clearfix">
											<div id="gernal-info" className="tab-pane active">
												<div className="col-mainleft equal-height">
													<div className="head-heading">
														<h4>Coach info</h4>
													</div>
													<div className="profile-banner white-background clearfix">
														<div className="profile-image">
															<img src="https://graph.facebook.com/10153629392691615/picture?width=580&amp;height=580" className="avatar user-5-avatar avatar-50 photo" alt="" width="50" height="50" />
														</div>
														<div className="athelete-name text-center">
															<h3>Ollie Allan</h3>
														</div>
														<div className="athelete-info">
															<div className="clearfix"> <span className="f1-in">Planner :</span> <span className="f2-in">{this.state.planner.title}</span> </div>
														</div>
														<div className="btn-grn">
															<a href="">Send Message</a>
														</div>
													</div>
													<div className="gropus-sec mt-10" style={{display: 'none'}}>
														<div className="head-heading">
															<h4>Group</h4>
														</div>
														<div className="grop-content white-background clearfix">
															
														</div>
													</div>
												</div>
												<div className="col-maincenter equal-height">
													<div className="activity-summary">
														<div className="head-heading">
															<h4>Activity Summary</h4>
														</div>
														<div className="white-background activity-body">
															<div style={{padding: '20px 0px'}}>
																<h5>No program to show activity</h5>
															</div>
														</div>
													</div>
												</div>
												<div className="col-mainright equal-height">
													<div className="programe-association cover-height">
														<div className="head-heading">
															<h4>Programs Associated</h4>
														</div>
														<div className="white-background programe-body cover-height">   
															<div className="program-session-list">
																<ul>
																	{programs_list}
																</ul>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
										<div className="clearfix"></div>
										<div style={{marginTop: '12px', maxWidth: '1157px', display: 'none'}}>
											<div className="gropus-sec">
												<div className="head-heading" style={{padding: '25px 12px'}}>
													<h4>Session Statistics
														<div className="select-fld-abt" style={{float: 'right', position: 'relative', top: '-7px', right: '10px'}}>
															<select id="searchByActivity" className="selectpicker" multiple="">
																<option value=""></option>
															</select>
														</div>
													</h4>
												</div>
												<div className="grop-content lictrl white-background clearfix">
													<ul style={{display: 'inline-block'}} className="activityMainDiv">
														<li className="selectedItem"><a href="" className="activity-session" data-attr="session">Session</a></li>
														<li><a style={{color: '#3c8ab7'}} href="" className="activity-session" data-attr="time">Time</a></li>
														<li><a style={{color: '#b7903c'}} href="" className="activity-session" data-attr="distance">Distance</a></li>
														<li><a style={{color: '#b73c59'}} href="" className="activity-session" data-attr="load">Load</a></li>
													</ul>
													<ul style={{display: 'inline-block', float: 'right'}} className="intervalMainDiv">
														<li className="selectedItem"><a href="" className="interval-session" data-attr="yearly">Yearly</a></li>
														<li><a href="" className="interval-session" data-attr="monthly">Monthly</a></li>
														<li><a href="" className="interval-session" data-attr="weekly">Weekly</a></li>
													</ul>
													<div className="clearfix"></div>

													<div>
														<div id="columnchart_material" style={{height: '500px'}}></div>
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

export default connect(mapStateToProps, {})(AthleteDashboard);