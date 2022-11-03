import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import ShowStrengthSession from './modals/view-strength-session';
import ViewSession from './modals/view-sessions';
import {connect} from 'react-redux';
import {getServerUrl} from '../../utils/api';

class LeftSidebar extends Component {
	constructor(props){
		super(props);
	}
	componentDidMount(){
		
	}
	
	render(){
		let popup;
		if(this.props.modals.viewSessions)
			popup = <ViewSession club={this.props.club} />;
		else if(this.props.modals.showStrengthSession)
			popup = <ShowStrengthSession club={this.props.club} />;
		
		return(
			<div id="sidebar-wrapper-left" className="desktop-verstion">
				{popup}
				<div className="wrapin">
					<div className="wrapin-inner">
						<a href="" className="edit-icon-mbt"><i className="fa fa-pencil" aria-hidden="true"></i></a>
						<div className="profile clearfix">
							<Link to={"/"+this.props.club.slug+"/athlete-dashboard/"}>
								<div className="profile_pic"><img src={this.props.user.profilePicture === '' ? '/uploads/images/profile_default.png' : getServerUrl().apiURL+'/uploads/user/'+this.props.user.profilePicture} className="avatar" width="50" height="50" alt="" /></div>
							</Link>
							<div className="profile_info">
								<h2>{this.props.user.firstName+' '+this.props.user.lastName}</h2>
							</div>
						</div>
						<div className="about-athlete-detail mb-0">
							<div className="athlete-name">
								<span>{this.props.user.firstName+' '+this.props.user.lastName}</span>
							</div>
						</div>
						<div className="scrollable-container">
							<div className="about-athlete-detail">
								<div className="athlete-level common-listing">
									<span className="gray-text">Athlete Level</span>
									<span className="white-text"></span>
								</div>
							</div>
							<div className="athlete-navigation">
								<ul>
									<li><Link to={"/"+this.props.club.slug+"/athlete-dashboard/"}>Dashboard</Link></li>
									<li><Link to={"/"+this.props.club.slug+"/athlete-planner/"}>Planner</Link></li>
								</ul>
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
	};
};

export default withRouter(connect(mapStateToProps, {})(LeftSidebar));