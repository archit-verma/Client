import React, {Component} from 'react';
import {Switch, Redirect, Route} from 'react-router-dom';
import {connect} from 'react-redux';

import Planner from './components/coach/planner';
import CoachDashboard from './components/coach/coach-dashboard';
import PrivateMessages from './components/coach/private-messages';
import Strengthsession from './components/coach/Strengthsession';
import EditStrengthsession from './components/coach/EditStrengthsession';
import ProgramSplitView from './components/coach/ProgramSplitView';
import AthleteDashboard from './components/athlete/AthleteDashboard';
import AthletePlanner from './components/athlete/AthletePlanner';
import Workouts from './components/coach/workouts';

class CoachRoutes extends Component{
	render(){
		if(this.props.userRole === 'Coach'){
			return(
				<Switch>
					<Route exact path="/team/:clubSlug/coach-dashboard/" render={(props) => (
						<CoachDashboard
							clubSlug={props.match.params.clubSlug}
						/>
					)} />
					<Route exact path="/team/:clubSlug/planner/:plannerSlug" render={(props) => (
						<Planner
							clubSlug={props.match.params.clubSlug}
							plannerSlug={props.match.params.plannerSlug}
							type={'planner'}
						/>
					)} />
					<Route exact path="/team/:clubSlug/planner/membership/:membershipSlug" render={(props) => (
						<Planner
							clubSlug={props.match.params.clubSlug}
							membershipSlug={props.match.params.membershipSlug}
							type={'membership'}
						/>
					)} />
					<Route exact path="/team/:clubSlug/planner/athlete/:userId" render={(props) => (
						<Planner
							clubSlug={props.match.params.clubSlug}
							userId={props.match.params.userId}
							type={'athlete'}
						/>
					)} />
					<Route exact path="/team/:clubSlug/private-messages/" render={(props) => (
						<PrivateMessages
							clubSlug={props.match.params.clubSlug}
						/>
					)} />
					<Route exact path={'/team/:clubSlug/strength-session'} render={(props) => (
						<Strengthsession
							clubSlug={props.match.params.clubSlug}
						/>
					)} />
					<Route exact path={'/team/:clubSlug/edit-session/:sessionId'} render={(props) => (
						<EditStrengthsession
							clubSlug={props.match.params.clubSlug}
							sessionId={props.match.params.sessionId}
						/>
					)} />
					<Route exact path={'/team/:clubSlug/program-split-view/:programSlug'} render={(props) => (
						<ProgramSplitView
							clubSlug={props.match.params.clubSlug}
							programSlug={props.match.params.programSlug}
						/>
					)} />
					<Route exact path="/team/:clubSlug/workouts/" render={(props) => (
						<Workouts
							clubSlug={props.match.params.clubSlug}
						/>
					)} />
				</Switch>
			);
		}
		else if(this.props.userRole === 'Athlete'){
			return(
				<Switch>
					<Route exact path="/team/:clubSlug/athlete-dashboard/" render={(props) => (
						<AthleteDashboard
							clubSlug={props.match.params.clubSlug}
						/>
					)} />
					<Route exact path="/team/:clubSlug/athlete-planner/" render={(props) => (
						<AthletePlanner
							clubSlug={props.match.params.clubSlug}
						/>
					)} />
				</Switch>
			);
		}
		else{
			return null
			//return <Redirect to="/" />
		}
	}
}

const mapStateToProps = state => {
	return {
		userRole: state.auth.user.role
	};
};

export default connect(mapStateToProps, {})(CoachRoutes);