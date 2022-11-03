import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hideAddProgram } from '../../../actions';
// Importing helper functions
import * as API from '../../../utils/api.js'
import Modal from 'react-bootstrap/Modal';
import { Image } from 'react-bootstrap';

import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import SimpleReactValidator from 'simple-react-validator';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
class AddProgram extends Component {
	constructor(props) {
		super(props);
		this.validator = new SimpleReactValidator();
		this.state = {
			phases: [],
			Activities: [],
			ativitytype: [],
			athleteLevelchecked: "",
			athleteLevel:[],
			
			program_phase:[],
			loading: false,
			success_m: "",
			alert_cls: "",
			valid_form: true,
			
			programDetail:{
				program_title: '',
				startDate: '',
				activity_type:'',
				phase_id:'',
				clubId:props.club._id
			}
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleTitle = this.handleTitle.bind(this);
		this.handleStartDate = this.handleStartDate.bind(this);
		this.handleCheckBoxChange = this.handleCheckBoxChange.bind(this);
		this.handleCheckBoxAthlete = this.handleCheckBoxAthlete.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handlePhaseChange = this.handlePhaseChange.bind(this);
	}

	componentDidMount = async () => {
		API.getphases().then(phases => {
			this.setState({
				phases: phases,
			});
		})
		API.getActivity().then(activities => {
			this.setState({
				Activities: activities,
			});
		})

	}

	handleChange(e){
		this.setState({ programDetail: { ...this.state.programDetail, [e.target.name]: e.target.value } });
	}
	handlePhaseChange(e){
		let arr=this.state.program_phase;
		 let currentIndex=e.target.selectedIndex;
		let phaseName= e.target.options[currentIndex].text
		let phaseValue= e.target.value;
		let phaseObj={'phase_id':phaseValue,'phase_name':phaseName};
		this.setState({program_phase:phaseObj});
	 
	}
	handleCheckBoxChange(e) {
		let ativitytype = [...this.state.ativitytype];
		let value = e.target.value;
		let name=e.target.name;
		let activityObj={'activity_id':value,'activity_name':name};

		if (e.target.checked === true) {
			ativitytype.push(activityObj);
		}
		else if (e.target.checked === false) {
			ativitytype.forEach((item,key,object)=>{
				if(item.activity_id===value){
					object.splice(key,1);
				}
			});
		}
		this.setState({ ativitytype })
	}

	handleCheckBoxAthlete(e) {
		let athleteLevel = [...this.state.athleteLevel];
		let value = e.target.value;

		if (e.target.checked === true) {
			athleteLevel.push(value);
		}
		else if (e.target.checked === false) {
			var index = athleteLevel.indexOf(value);
			if (index > -1) {
				athleteLevel.splice(index, 1);
			}
		}
		this.setState({ athleteLevel })
	}
	handleClose() {
		this.props.hideAddProgram();
	}
	validateEmail = (e) => {
		let title = this.state.programDetail.program_title;
		API.checkTitle(title).then(programtitle => {
			if (programtitle._id) {
				this.setState({
					success_m: 'Program title already exist.',
					alert_cls: 'alert-danger',
					valid_form: false
				})
			} else {
				this.setState({
					success_m: '',
					alert_cls: '',
					valid_form: true
				})
			}
		})
	}
	handleSubmit(event) {		
		event.preventDefault();
		if (this.validator.allValid() && this.state.valid_form === true) {
			var data={};
			data['program_detail']=this.state.programDetail;
			data['clubId']=this.state.programDetail.clubId;
			data['ativity_type']=this.state.ativitytype;
			data['athlete_Level']=this.state.athleteLevel;
			data['userId']=this.props.user.userId;
			this.setState({ loading: true })
			API.saveProgram(data).then(programs => {
				if (programs._id) {
					this.setState({
						success_m: 'Program added successfully.',
						alert_cls: 'alert-success',
						loading: false

					})
					this.setState({ title: '', startDate: '', programPhase: '', ativitytype: [], athleteLevel: [] });
					setTimeout(() => {
						this.setState({
							success_m: '',
							alert_cls: '',
						});
						this.handleClose();
					}, 5000);

				} else {
					this.setState({
						success_m: 'Something went wrong.',
						alert_cls: 'alert-danger',
						loading: false

					})
				}
			})
		} else {
			this.validator.showMessages();

			this.forceUpdate();
		}
	}
	handleTitle(e) {
		this.setState({ title: e.target.value });
	}
	handleStartDate(e) {
		this.setState({ startDate: e.target.value });
	}
	// handleprogramPhase(e) {
	// 	this.setState({ programDetail: { ...this.state.programDetail,:programPhase['program_name'] e.target.name } });
	// 	this.setState({ programDetail: { ...this.state.programDetail,:programPhase['program_id'] e.target.value } });
	// }
	render() {
		return ( 
			<Modal
				centered
				size="lg"
				show={true}
				onHide={this.handleClose.bind(this)}
				dialogClassName="planner-dialog"
			>

				<Form onSubmit={this.handleSubmit}>
					<Modal.Header closeButton>
						<Modal.Title>Create Program</Modal.Title>
					</Modal.Header>
					<Modal.Body>

				{this.state.success_m && <div className={this.state.alert_cls + " alert"}>{this.state.success_m}</div>}

						<Form.Group controlId="formBasicEmail">
							<Form.Label>Program Title</Form.Label>
							<Form.Control type="text" placeholder="Enter Title" name='program_title' onChange={this.handleChange} value={this.state.programDetail.program_title} onBlur={this.validateEmail} />
							{this.validator.message('title', this.state.programDetail.program_title, 'required')}
						</Form.Group>

						<Form.Row>
							<Form.Group as={Col} controlId="program_date">
								<Form.Label>Start Date</Form.Label>
								<Form.Control type="date" name='startDate' onChange={this.handleChange} value={this.state.programDetail.startDate} />
								{this.validator.message('startDate', this.state.programDetail.startDate, 'required')}
							</Form.Group>
							<Form.Group as={Col} controlId="program_phase">
								<Form.Label>Phase</Form.Label>
								<Form.Control as="select" name='phase_id' onChange={this.handleChange}>
									<option value="">Please Select Phase</option>
									{this.state.phases.map(phaseses => (
										<option key={"phases-"+phaseses._id} value={phaseses._id}>{phaseses.name}</option>
									))}
								</Form.Control>
								{this.validator.message('programPhase', this.state.programDetail.phase_id, 'required')}
							</Form.Group>
						</Form.Row>

						<Form.Label>Activity Type</Form.Label>

						<Form.Group controlId="addProgramActivityType">

						{this.state.Activities.map(activities => (
								<span className="acttyp" key={"program-activity-"+activities._id}>
									<Image src={activities.image_name} style={{ width: '25px' }} />
									<Form.Check inline label={activities.title} type="checkbox" name={activities.title} value={activities._id} onChange={this.handleCheckBoxChange} defaultChecked={false} />
								</span>

							))}
							{/* {this.validator.message('ativitytype', this.state.ativitytype, 'required')} */}
						</Form.Group>
						<Form.Label>Athlete Level</Form.Label>
						<Form.Group controlId="addProgramAthleteLevel">
							<Form.Check inline label="Novice" type="checkbox" name='novice' onChange={this.handleCheckBoxAthlete} id="addProgramAthleteLevelNovice" value='novice' />
							<Form.Check inline label="Intermediate" type="checkbox" name='intermediate' onChange={this.handleCheckBoxAthlete} id="addProgramAthleteLevelIntermediate" value='intermediate'/>
							<Form.Check inline label="Advance" type="checkbox" name='advance' onChange={this.handleCheckBoxAthlete} id="addProgramAthleteLevelAdvance" value='advance' />
							<Form.Check inline label="Elite" name='elite' type="checkbox" onChange={this.handleCheckBoxAthlete} id="addProgramAthleteLevelElite" value='elite' />
							{/* {this.validator.message('athleteLevelchecked', this.state.athleteLevelchecked, 'required')} */}
						</Form.Group>
					</Modal.Body>
					<Modal.Footer>
						<Button type='submit' variant="coaching-mate" style={{ display: this.state.loading ? 'none' : 'block' }} >Create</Button><Spinner animation="grow" style={{ display: this.state.loading ? 'block' : 'none' }} />
					</Modal.Footer>
				</Form>
			</Modal>
		);
	}
}

const mapStateToProps = state => {
	return {
		addProgram: state.planner.modals.addProgram,
		user: state.auth.user
	};
};

export default connect(mapStateToProps, { hideAddProgram })(AddProgram);