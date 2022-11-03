import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hideEditSessionTime,setSessTimeData } from '../../../actions';
// Importing helper functions
import * as API from '../../../utils/api.js';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import renderHTML from 'react-render-html';
import Spinner from 'react-bootstrap/Spinner';
import Select from 'react-select';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
//import Multiselect from 'multiselect-dropdown-react';
class EditSessionTime extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			sessiontimeDetail: {
				str_session_minuts: '',
				str_session_hours: '',
				session_url: '',
				id_session:'',
				eventId:'',
				calendar:''
			},
			sessionData:''
		}
		this.submitData = this.submitData.bind(this);
		this.handledata = this.handledata.bind(this);
	}
	
	componentDidMount = async () => {
		let hours = 0, mins = 0;
		let sessionTime = this.props.sessionTime;
		if(sessionTime != 0){
			hours = Math.floor(parseInt(sessionTime) / 60);
			mins = parseInt(sessionTime) % 60;
		}
		this.setState({ sessiontimeDetail: { ...this.state.sessiontimeDetail, str_session_hours: hours, str_session_minuts: mins, session_url: this.props.sessionURL, id_session: this.props.session_id, eventId: this.props.eventId, calendar: this.props.calendar } });
		let sessObj={};
		sessObj['id_session']=this.props.session_id;
		
		/*API.getProgramSessionBySessionId(sessObj).then(sessionData => {
			this.setState({ sessiontimeDetail: { ...this.state.sessiontimeDetail, str_session_minuts: sessionData.sessions[0].minutes } });
			this.setState({ sessiontimeDetail: { ...this.state.sessiontimeDetail, str_session_hours: sessionData.sessions[0].hours } });
		});*/
	}
	
	handleClose() {
		this.props.hideEditSessionTime();
	}
	handledata(e){
		this.setState({ sessiontimeDetail: { ...this.state.sessiontimeDetail, [e.target.name]: e.target.value } });
	}
	submitData(event){
		event.preventDefault();
		this.props.setSessTimeData(this.state.sessiontimeDetail);
		setTimeout(() => {
			this.handleClose();
			// this.props.setSessTimeData('');
		}, 3000)
	}
	render() {
		let timeInterval = [];
		for (let i = 0; i < 25; i++) {
			timeInterval.push(<option key={'timeInterval' + i} value={i} >{i} Hours</option>);
		}
		let timeIntervalsec = [];
		for (let i = 0; i < 60; i++) {
			timeIntervalsec.push(<option key={'timeIntervalsec' + i} value={i}>{i} Minute</option>);
		}
		return (
			<Modal
				centered
				size="md"
				show={true}
				onHide={this.handleClose.bind(this)}
				dialogClassName="planner-dialog" className='customize-excersice'>
				<Modal.Header closeButton>
					<Modal.Title>Edit Session Time & URL</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form onSubmit={this.handleSubmit}>
						<Modal.Body>
							<Form.Row className='child-fixed-width'>
								<Form.Group as={Col} controlId="formHours">
									<select id="str_session_hours" name="str_session_hours" value={this.state.sessiontimeDetail.str_session_hours} onChange={this.handledata} className="styled-select">
										{timeInterval}
									</select>
								</Form.Group>
								<Form.Group as={Col} controlId="formMins">
									<select value={this.state.sessiontimeDetail.str_session_minuts} id="str_session_minuts" name="str_session_minuts" onChange={this.handledata} className="styled-select">
										{timeIntervalsec}
									</select>
								</Form.Group>
							</Form.Row>
							<Form.Group className="exbx" controlId="addProgramAthleteLevel">
								<Form.Label className="extyp">Session Url:</Form.Label>
								<Form.Control type="text" name='session_url'onChange={this.handledata}  />
							</Form.Group>
						</Modal.Body>
						<Modal.Footer className="buttons-save">
							<Button type='submit' onClick={this.submitData} >Update Time & URL</Button>
						</Modal.Footer>
					</Form>
				</Modal.Body>
				<Modal.Footer className="buttons-save">
				</Modal.Footer>
			</Modal>
		);
	}
}

const mapStateToProps = state => {
	return {
		session_id: state.planner.modalsParams.id,
		eventId: state.planner.modalsParams.id1,
		calendar: state.planner.modalsParams.par1,
		sessionTime: state.planner.modalsParams.par2,
		sessionURL: state.planner.modalsParams.par3
	};
};

export default connect(mapStateToProps, { hideEditSessionTime,setSessTimeData })(EditSessionTime);