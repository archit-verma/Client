import React, { Component } from 'react';
import {connect} from 'react-redux';
import {hideAddPlanner, createPlanner, closeAlert, updatePlanner} from '../../../actions';
import {getPlannerDetails} from '../../../utils/api';

import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Jumbotron from "react-bootstrap/Jumbotron";
import Button from 'react-bootstrap/Button';

import loading from "../../../assets/loading.svg";

class AddPlanner extends Component {
	constructor(props){
		super(props);
		this.state = {
			planner: {
				_id: '',
				title: '',
				startDate: '',
				plannerInterval: 12,
				displayCountdown: true,
				revCountdown: true,
				trainCycleStartDate: '',
				trainCycleInterval: 3,
				competitions: [],
				addedBy: props.user.userId,
				clubId: props.club._id
			},
			compTitle: '',
			compType: 'a',
			compDate: '',
			loading: true
		}
		this.handleClose = this.handleClose.bind(this);
		this.addPlanner = this.addPlanner.bind(this);
		this.saveAsNew = this.saveAsNew.bind(this);
		this.closeAlert = this.closeAlert.bind(this);
		this.handleTitle = this.handleTitle.bind(this);
		this.handlePlannerStart = this.handlePlannerStart.bind(this);
		this.handleInterval = this.handleInterval.bind(this);
		this.handleDisplayCountdown = this.handleDisplayCountdown.bind(this);
		this.handleReverseCountdown = this.handleReverseCountdown.bind(this);
		this.handleTrainingCycleStart = this.handleTrainingCycleStart.bind(this);
		this.handleTrainingCycleInterval = this.handleTrainingCycleInterval.bind(this);
		
		this.handleAddCompTitle = this.handleAddCompTitle.bind(this);
		this.handleAddCompType = this.handleAddCompType.bind(this);
		this.handleAddCompDate = this.handleAddCompDate.bind(this);
		this.addCompetition = this.addCompetition.bind(this);
		this.handleCompTitle = this.handleCompTitle.bind(this);
		this.handleCompType = this.handleCompType.bind(this);
		this.handleCompDate = this.handleCompDate.bind(this);
		this.removeCompetition = this.removeCompetition.bind(this);
	}
	
	componentDidMount(){
		if(this.props.plannerId != null){
			getPlannerDetails(this.props.plannerId, this.props.club._id)
			.then(planner => {
				for(let i=0; i<planner.competitions.length; i++){
					planner.competitions[i].compDate = planner.competitions[i].compDate.split('T')[0];
				}
				this.setState({
					planner: {
						_id: planner._id,
						title: planner.title,
						startDate: planner.startingDate.split('T')[0],
						plannerInterval: planner.endInterval,
						displayCountdown: planner.displayCountdown === 'yes' ? true : false,
						revCountdown: planner.reverseCountdown === 'yes' ? true : false,
						trainCycleStartDate: planner.tcStartDate === null ? '' : planner.tcStartDate.split('T')[0],
						trainCycleInterval: planner.tcInterval,
						competitions: planner.competitions
					},
					compTitle: '',
					compType: 'a',
					compDate: '',
					loading: false
				});
			});
		}
		else{
			this.setState({loading: false});
		}
	}
	
	UNSAFE_componentWillReceiveProps(nextProps){
		if(nextProps.addPlanner && nextProps.alertMessage){
			this.clearForm();
		}
		else if(nextProps.addPlanner && nextProps.error){
			this.setState({loading: false});
		}
	}
	
	clearForm(){
		this.setState({planner: {
				_id: '',
				title: '',
				startDate: '',
				plannerInterval: 12,
				displayCountdown: true,
				revCountdown: true,
				trainCycleStartDate: '',
				trainCycleInterval: 3,
				competitions: [],
				addedBy: 1,
				clubId: this.props.club._id
			},
			compTitle: '',
			compType: 'a',
			compDate: '',
			loading: false
		});
	}
	
	handleClose(){
		this.props.hideAddPlanner();
	}
	
	handleTitle(e){
		this.setState({planner: { ...this.state.planner, title: e.target.value} });
	}
	
	handlePlannerStart(e){
		this.setState({planner: { ...this.state.planner, startDate: e.target.value} });
	}
	
	handleInterval(e){
		this.setState({planner: { ...this.state.planner, plannerInterval: e.target.value} });
	}
	
	handleDisplayCountdown(e){
		this.setState({planner: { ...this.state.planner, displayCountdown: e.target.checked} });
	}
	
	handleReverseCountdown(e){
		this.setState({planner: { ...this.state.planner, revCountdown: e.target.checked} });
	}
	
	handleTrainingCycleStart(e){
		this.setState({planner: { ...this.state.planner, trainCycleStartDate: e.target.value} });
	}
	
	handleTrainingCycleInterval(e){
		this.setState({planner: { ...this.state.planner, trainCycleInterval: e.target.value} });
	}
	
	handleAddCompTitle(e){
		this.setState({compTitle: e.target.value});
	}
	
	handleAddCompType(e){
		this.setState({compType: e.target.value});
	}
	
	handleAddCompDate(e){
		this.setState({compDate: e.target.value});
	}
	
	addCompetition(e){
		e.preventDefault();
		if(this.state.compTitle === ''){
			alert('Enter competition title');
			return;
		}
		else if(this.state.compDate === ''){
			alert('Enter competition date');
			return;
		}
		let competitions = [...this.state.planner.competitions];
		competitions.push({title: this.state.compTitle, type: this.state.compType, compDate: this.state.compDate});
		this.setState({compTitle: '', compType: 'a', compDate: '', planner: { ...this.state.planner, competitions} });
	}
	
	handleCompTitle(e){
		let competitions = [...this.state.planner.competitions];
		competitions[e.target.name].title = e.target.value;
		this.setState({planner: { ...this.state.planner, competitions} });
	}
	
	handleCompType(e){
		let competitions = [...this.state.planner.competitions];
		competitions[e.target.name].type = e.target.value;
		this.setState({planner: { ...this.state.planner, competitions} });
	}
	
	handleCompDate(e){
		let competitions = [...this.state.planner.competitions];
		competitions[e.target.name].compDate = e.target.value;
		this.setState({planner: { ...this.state.planner, competitions} });
	}
	
	removeCompetition(e){
		e.preventDefault();
		let competitions = [...this.state.planner.competitions];
		competitions.splice(e.target.name, 1);
		this.setState({planner: { ...this.state.planner, competitions} });
	}
	
	addPlanner(){
		if(this.state.planner.title === ''){
			alert('Enter planner title');
			return;
		}
		else if(this.state.planner.startDate === ''){
			alert('Enter planner start date');
			return;
		}
		else if(this.state.planner.plannerInterval === ''){
			alert('Select planner interval');
			return;
		}
		
		let planner = {...this.state.planner};
		this.setState({loading: true});
		if(this.props.plannerId != null)
			this.props.updatePlanner(planner);
		else{
			delete planner._id;
			this.props.createPlanner(planner);
		}
	}
	
	saveAsNew(){
		if(this.state.planner.title === ''){
			alert('Enter planner title');
			return;
		}
		else if(this.state.planner.startDate === ''){
			alert('Enter planner start date');
			return;
		}
		else if(this.state.planner.plannerInterval === ''){
			alert('Select planner interval');
			return;
		}
		
		let planner = {...this.state.planner};
		delete planner._id;
		
		for(let i=0; i<planner.competitions.length ;i++){
			if(planner.competitions[i]._id)
				delete planner.competitions[i]._id;
		}
		
		this.setState({loading: true});
		this.props.createPlanner(planner);
	}
	
	closeAlert(){
		this.props.closeAlert();
	}
	
	render(){
		if(this.state.loading){
			return (
				<Modal
					centered
					size="lg"
					show={true}
					onHide={this.handleClose}
					dialogClassName="planner-dialog" className="createPlanner" 
				>
					<Modal.Header closeButton>
						<Modal.Title>{this.props.plannerId != null ? 'Edit' : 'Add'} Planner</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className='modal-container-loading'>
							<img src={loading} alt="" />
						</div>
					</Modal.Body>
				</Modal>
			);
		}
		
		let plannerInterval = [], competitionsHtml = [], alertMessage = '';
		for (let i = 2; i < 24; i++) {
			plannerInterval.push(<option key={'addPlannerInterval'+i} value={i}>{i} Months</option>);
		}
		
		let competitions = this.state.planner.competitions;
		for (let i = 0; i < competitions.length; i++) {
			competitionsHtml.push(<div key={'competitions-'+i}><Form.Row><Form.Group as={Col} controlId="addPlannerCompetitionTitle{i}"><Form.Label>Competition Title</Form.Label><Form.Control name={i} value={competitions[i].title} onChange={this.handleCompTitle} /></Form.Group><Form.Group as={Col} controlId="addPlannerCompetitionType{i}"><Form.Label>Comp Type</Form.Label><Form.Control as="select" name={i} value={competitions[i].type} onChange={this.handleCompType}><option value='a'>Comp A</option><option value='b'>Comp B</option><option value='c'>Comp C</option></Form.Control></Form.Group><Form.Group as={Col} controlId="addPlannerCompetitionDate{i}"><Form.Label>Date</Form.Label><Form.Control type="date" name={i} value={competitions[i].compDate} onChange={this.handleCompDate} /></Form.Group></Form.Row><Form.Row className="compsep"><a href="remove-competition" className="remove-comp" name={i} onClick={this.removeCompetition}>Remove</a></Form.Row></div>);
		}
		
		if(this.props.alertMessage){
			alertMessage = <Alert variant="success" dismissible onClose={this.closeAlert}>{this.props.alertMessage}</Alert>;
		}
		if(this.props.error){
			alertMessage = <Alert variant="danger" dismissible onClose={this.closeAlert}>{this.props.error}</Alert>;
		}
		
		return(
			<Modal
				centered
				size="lg"
				show={true}
				onHide={this.handleClose}
				dialogClassName="planner-dialog" className="createPlanner" 
			>
				<Modal.Header closeButton>
					<Modal.Title>{this.props.plannerId != null ? 'Edit' : 'Add'} Planner</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form>
						{alertMessage}
						<Form.Group controlId="addPlannerTitle">
							<Form.Label>Planner Title</Form.Label>
							<Form.Control type="text" value={this.state.planner.title} onChange={this.handleTitle} />
						</Form.Group>
						
						<Form.Row>
							<Form.Group as={Col} controlId="addPlannerStartDate">
								<Form.Label>Planner Start Date</Form.Label>
								<Form.Control type="date" value={this.state.planner.startDate} onChange={this.handlePlannerStart} />
							</Form.Group>
							<Form.Group as={Col} controlId="addPlannerInterval">
								<Form.Label>Planner Interval</Form.Label>
								<Form.Control as="select" value={this.state.planner.plannerInterval} onChange={this.handleInterval}>
									{plannerInterval}
								</Form.Control>
							</Form.Group>
						</Form.Row>
						
						<Form.Label>Competitions</Form.Label>
						<Jumbotron>
							{competitionsHtml}
							<Form.Row>
								<Form.Group as={Col} controlId="addPlannerCompetitionTitle">
									<Form.Label>Competition Title</Form.Label>
									<Form.Control value={this.state.compTitle} onChange={this.handleAddCompTitle} />
								</Form.Group>
								<Form.Group as={Col} controlId="addPlannerCompetitionType">
									<Form.Label>Comp Type</Form.Label>
									<Form.Control as="select" value={this.state.compType} onChange={this.handleAddCompType}>
										<option value='a'>Comp A</option>
										<option value='b'>Comp B</option>
										<option value='c'>Comp C</option>
									</Form.Control>
								</Form.Group>
								<Form.Group as={Col} controlId="addPlannerCompetitionDate">
									<Form.Label>Date</Form.Label>
									<Form.Control type="date" value={this.state.compDate} onChange={this.handleAddCompDate} />
								</Form.Group>
							</Form.Row>
							<Form.Row className="compsep">
								<a href="add-competition" className="add-comp" onClick={this.addCompetition}>+ Add Competition</a>
							</Form.Row>
						</Jumbotron>
						
						<Form.Row>
							<Form.Group as={Col} controlId="addPlannerDisplayCountdown">
								<Form.Check 
									custom
									type="switch"
								>
									<Form.Check.Input checked={this.state.planner.displayCountdown} onChange={this.handleDisplayCountdown} />
									<Form.Check.Label><span className="textadj">Display Countdown On/Off</span></Form.Check.Label>
								</Form.Check>
							</Form.Group>
							<Form.Group as={Col} controlId="addPlannerRevCountdown">
								<Form.Check 
									custom
									type="switch"
								>
									<Form.Check.Input checked={this.state.planner.revCountdown} onChange={this.handleReverseCountdown} />
									<Form.Check.Label><span className="textadj">Reverse Countdown On/Off</span></Form.Check.Label>
								</Form.Check>
							</Form.Group>
						</Form.Row>
						
						<Form.Row>
							<Form.Group as={Col} controlId="addPlannerTrainingCycleStartDate">
								<Form.Label>Training Cycle Start Date</Form.Label>
								<Form.Control type="date" value={this.state.planner.trainCycleStartDate} onChange={this.handleTrainingCycleStart} />
							</Form.Group>
							<Form.Group as={Col} controlId="addPlannerTrainingCycleInterval">
								<Form.Label>Training Cycle Interval</Form.Label>
								<Form.Control as="select" value={this.state.planner.trainCycleInterval} onChange={this.handleTrainingCycleInterval}>
									<option value="3">3 Weeks</option>
									<option value="4">4 Weeks</option>
								</Form.Control>
							</Form.Group>
						</Form.Row>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="coaching-mate" onClick={this.addPlanner}>{this.props.plannerId != null ? 'Update' : 'Create'}</Button>
					{this.props.plannerId != null && <Button variant="coaching-mate" onClick={this.saveAsNew}>Save as new</Button>}
				</Modal.Footer>
			</Modal>
		);
	}
}

const mapStateToProps = state => {
	return {
		user: state.auth.user,
		addPlanner: state.planner.modals.addPlanner,
		plannerId: state.planner.modalsParams.id,
		alertMessage: state.planner.alertMessage,
		error: state.planner.error
	};
};

export default connect(mapStateToProps, {hideAddPlanner, createPlanner, closeAlert, updatePlanner})(AddPlanner);