import React, { Component } from 'react';
import LeftSidebar from './left-sidebar';

export default class Strengthsession extends Component {
	render(){
		return(
			<div className="container-large clearfix">
				<div id="wrapper" className="coach-planner">
					<LeftSidebar userid={this.props.userSignedIn} />
					<div id="page-content-wrapper" class="mbt-wrapper-option strength-session-body">

						this is session
					</div>
				</div>
			</div>
		);
	}
}