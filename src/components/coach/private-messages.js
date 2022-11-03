import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import LeftSidebar from './left-sidebar';
import {getTeam} from '../../utils/api.js';

import loading from "../../assets/loading.svg";

class PrivateMessages extends Component {
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
			<div>
				<div class="container-large clearfix">
				    <div id="wrapper" class={"athlete-profile"+(this.state.leftSidebarDisplay ? "": " toggled-left")}>
						<LeftSidebar club={this.state.club} sidebarDisplay={this.state.leftSidebarDisplay} leftSidebarChange={this.leftSidebarChange} />
						<div id="page-content-wrapper" class="message-section">
							<div class="container-fluid">
								<div class="row">
									<div class="col-lg-12-large">
										<div class="dashboard-heading">
											<h3>
												<a href="#menu-toggle-left" class="menu-toggle-left" id="show-after-left-close" style={!this.state.leftSidebarDisplay ? {display: 'inline-block'} : {}} onClick={(e) => {e.preventDefault();this.leftSidebarChange()}}>
													<span class="icon-bar"></span>
													<span class="icon-bar"></span>
													<span class="icon-bar"></span>
												</a>
												Messages
											</h3>
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

export default connect(mapStateToProps, {})(PrivateMessages);