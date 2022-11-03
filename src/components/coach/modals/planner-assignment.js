import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hidePlannerAssignment } from '../../../actions';
// Importing helper functions
import * as API from '../../../utils/api.js'
import Modal from 'react-bootstrap/Modal';

class PlannerAssignment extends Component {
	constructor(props) {
		super(props);
	  
		this.state = {
			membershipLevels: [],
			associatedPlanners: [],
			selMembershipLevel: '',
			selPlanner: ''
		}
	}

	componentDidMount = async () => {
		API.getMembershipLevels(this.props.club._id).then(levels => {
			this.setState({
				membershipLevels: levels,
				associatedPlanners: []
			});
		})
	}

	handleClose() {
		this.props.hidePlannerAssignment();
	}
	
	handleLevelChange(e){
		API.getMembershipLevelPlanners(this.props.club._id).then(planners => {
			this.setState({
				selMembershipLevel: e.target.value,
				associatedPlanners: planners
			});
		})
	}

	render() {
		return (
			<Modal
				centered
				size="md"
				show={true}
				onHide={this.handleClose.bind(this)}
				dialogClassName="planner-dialog" className='customize-excersice'>
					<Modal.Header closeButton>
						<Modal.Title>Planner Assignment</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div class="select-planner-group-level">
							<label>Select Level</label>
							<div class="styled-select">
								<select id="planner-group-level" onChange={this.handleLevelChange.bind(this)}>
									{this.state.membershipLevels.map(level => (
										<option key={'membership-levels-'+level._id} value={level._id}>{level.title}</option>
									))}
								</select>
							</div>
							<br /><br />
							<label>Select Planner</label>
							<div class="input-cover">
								<select id="group-level-planner" class="styled-select" style="width:100%;">
									<option value="">Select Planner</option>
									{this.props.planners.map(planner => (
										<option key={'assign-planner-'+planner._id} value={planner._id}>{planner.title}</option>
									))}
								</select>
							</div>
							<br /><br />
							<div class="create-planner-btn">
								<input type="submit" id="assignplannerbtn" class="assignplannerbtn" name="" value="Assign Planner" />
							</div>
						</div>
						<div class="group-level-associated-planners">
							{this.state.associatedPlanners.map(planner => (
								<div></div>
							))}
							{this.state.associatedPlanners.length === 0 ? 'No planners associated': ''}
						</div>
					</Modal.Body>
					<Modal.Footer className="buttons-save">
					</Modal.Footer>
			</Modal>
		);
	}
}

const mapStateToProps = state => {
	return {
		planners: state.planner.planners
	};
};

export default connect(mapStateToProps, { hidePlannerAssignment })(PlannerAssignment);