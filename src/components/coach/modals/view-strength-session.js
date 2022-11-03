import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hideEditSessionTime } from '../../../actions';
// Importing helper functions
import * as API from '../../../utils/api.js'
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import renderHTML from 'react-render-html';
import { hideStrengthSession, viewExercise } from '../../../actions';
//import Multiselect from 'multiselect-dropdown-react';
class ShowStrengthSession extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			strengthSessionData: {title: '', comments: ''},
			strengthSessionExercise: [],
			sessionDates: [],
			exarr: {},
			exdetails: {
				session_date: '',
				program_id: this.props.valobj.program_id,
				session_id: this.props.valobj.session_id,
				ex_ids: '',
				unit_a_value: '',
				unit_b_value: '',
				sets: ''
			}
		}
		this.handleValue = this.handleValue.bind(this);
	}
	
	componentDidMount = async () => {
		let sessionval = this.props.valobj;
		
		API.getStrengthSessInfo(sessionval).then(sessData => {
			this.setState({
				strengthSessionData: sessData.session_data,
				strengthSessionExercise: sessData.strength_data,
				sessionDates: sessData.session_dates
			});
		})
	}
	
	viewExercise = (id) => {
        this.props.viewExercise(id);
        this.handleClose();
    }
	
	handleClose() {
		this.props.hideStrengthSession();
	}
	
	removeValueFromArray(exdata, sessionDate) {
		let myArray = [...this.state.exarr];
		if (myArray.length > 0) {
			for (let i = 0; i <= myArray.length - 1; i++) {
				if (myArray[i].session_date == sessionDate) {
					myArray[i] = exdata;
				}
			}
		} else {
			myArray.push(exdata);
		}
		this.setState({ exarr: myArray });
	}
	
	handleValue(e) {
		/*let sessionDate = e.target.attributes.getNamedItem('data-sess-date').value;
		let ex_id = e.target.attributes.getNamedItem('data-exercise-id').value;
		this.setState({ exdetails: { ...this.state.exdetails, [e.target.name]: e.target.value, session_date: sessionDate, ex_ids: ex_id } });
	
		let exDatas = this.state.exdetails;
		let myArray = [...this.state.exarr];
	   
		if (myArray.length > 0) {
			//this.removeValueFromArray(exDatas, sessionDate);  
		} else {
			myArray.push(this.state.exdetails);
			this.setState({ exarr: myArray });
		}*/
		let sessAssocId = e.target.attributes.getNamedItem('data-sess-assoc-id').value;
		let exerAssocId = e.target.attributes.getNamedItem('data-exercise-assoc-id').value;
		let sessionDates = [...this.state.sessionDates];
		let exarr = {...this.state.exarr};
		
		if(exarr[sessAssocId] !== undefined){
			if(exarr[sessAssocId][exerAssocId] !== undefined){
				if(e.target.name == 'sets')
					exarr[sessAssocId][exerAssocId].sets = e.target.value;
				else if(e.target.name == 'unit_a_value')
					exarr[sessAssocId][exerAssocId].unita = e.target.value;
				else if(e.target.name == 'unit_b_value')
					exarr[sessAssocId][exerAssocId].unitb = e.target.value;
			}
			else{
				if(e.target.name == 'sets')
					exarr[sessAssocId][exerAssocId] = {sets: e.target.value};
				else if(e.target.name == 'unit_a_value')
					exarr[sessAssocId][exerAssocId] = {unita: e.target.value};
				else if(e.target.name == 'unit_b_value')
					exarr[sessAssocId][exerAssocId] = {unitb: e.target.value};
			}
		}
		else{
			exarr[sessAssocId] = {};
			if(e.target.name == 'sets')
				exarr[sessAssocId][exerAssocId] = {sets: e.target.value};
			else if(e.target.name == 'unit_a_value')
				exarr[sessAssocId][exerAssocId] = {unita: e.target.value};
			else if(e.target.name == 'unit_b_value')
				exarr[sessAssocId][exerAssocId] = {unitb: e.target.value};
		}
		
		sessionDates.map((q, i) => {
			if(sessAssocId == q.sessAssocId){
				if(e.target.name == 'sets')
					q.exerciseData[exerAssocId].sets = e.target.value;
				else if(e.target.name == 'unit_a_value')
					q.exerciseData[exerAssocId].unita = e.target.value;
				else if(e.target.name == 'unit_b_value')
					q.exerciseData[exerAssocId].unitb = e.target.value;
			}
		});
		this.setState({ sessionDates, exarr });
	}
	
	saveSessionData(e){
		e.preventDefault();
		let programId = this.props.valobj.program_id;
		let sessionId = this.props.valobj.session_id;
		let exarr = {...this.state.exarr};
		
		API.saveStrengthSessInfo(programId, sessionId, exarr).then(resp => {
			if(resp.success === true){
				let sessionval = this.props.valobj;
				API.getStrengthSessInfo(sessionval).then(sessData => {
					alert(resp.msg);
					this.setState({
						strengthSessionExercise: sessData.strength_data,
						sessionDates: sessData.session_dates,
						exarr: {}
					});
				})
			}
			else if(resp.success === false){
				alert(resp.msg);
			}
		});
	}
	
	render() {
		return (
			<Modal
				centered
				size="lg"
				show={true}
				onHide={this.handleClose.bind(this)}
				dialogClassName="planner-dialog" id="strengthSessionView-modal" className="customize-excersice modal-exercise-info strengthSessionView">
				<Modal.Header closeButton>
					<Modal.Title>{this.state.strengthSessionData.title ? this.state.strengthSessionData.title : ''}</Modal.Title>
					<div className="pnt-delte-btn">
						<a href="" className="prnt-btnd-coach" style={{display: 'none'}}>Print</a>
						<a href="" className="save-coach-data" onClick={(e) => this.saveSessionData(e)}>Save</a>
					</div>
				</Modal.Header>
				<Modal.Body>
					<div className="sessn-view-container clearfix">
						<form action="" method="POST" id="save_coach_values">
							<ul class="custom-list-options ui-sortable clearfix">
								{this.state.strengthSessionExercise.map((activities, index) => (
									<li class="clearfix">
										<div className="list-rslt-mbt enable-lst-container note-border-remove">
											<div className="exercise-copy-paste" style={{display: 'none'}}>
												<a href="" className="cm-copy-exercise-data" title="Copy Exercise Data">
													<i class="fa fa-files-o" aria-hidden="true"></i>
												</a> &nbsp; <a href="" className="cm-paste-exercise-data" title="Paste Exercise Data"><i className="fa fa-clipboard" aria-hidden="true"></i></a></div>
											<div className="lst-wrapper-tp">
												<div className="bx-cnt-list clearfix">
													<div className="bx-lft-ct">
														<h5>
															<a href="javascript:;" data-toggle="modal" className="edit-ex" data-ex_id={activities.exercise_id} data-target="#exercise-info" title="Chest Workout">{activities.data}</a>
														</h5>
														<div className="icn-wth-thmbs">
															<span className="cam-icn">
																<a href="javascript:;" onClick={() => this.viewExercise(activities.exercise_id)}>
																	<i className="fa fa-video-camera" aria-hidden="true"></i>
																</a>
															</span>
															<span className="ex-thmbil-imgs">
																<a href="javascript:;" data-toggle="modal" className="edit-ex" data-ex_id="1" data-target="#exercise-info">
																	<span className="thbnail-one"><img src={API.getServerUrl().apiURL+'/uploads/exercise/'+activities.pic1} alt="" class="img-responsive" /></span>
																	<span className="thbnail-one" ><img src={API.getServerUrl().apiURL+'/uploads/exercise/'+activities.pic2} alt="" class="img-responsive" /></span>
																	<span className="thbnail-one"><img src={API.getServerUrl().apiURL+'/uploads/exercise/'+activities.pic3} alt="" class="img-responsive" /></span>
																</a>
															</span>
														</div>
													</div>
													<div className="bx-thbnl">
														<a href="javascript:;" class="add-notes-modalmbt">
															<i className="fa fa-file" aria-hidden="true"></i>
														</a>
														<img src={API.getServerUrl().apiURL+'/uploads/bodystrength/'+activities.strength_body_img} alt="" class="img-responsive" />
													</div>
												</div>
												<div className="unit-box">
													<div className="units-selection">
														<div className="sngle-field clearfix">
															<div className="unit-value"><span>Sets:</span></div>
														</div>
														<div className="sngle-field clearfix">
															{/* <div class="unit-value" style="display:none;">
																<span>Unit A:</span>
															</div> */}
															<div class="unit-value"><span>{activities.unit_a_value}: </span></div>
														</div>
														<div class="sngle-field clearfix">
															{/* <div class="unit-value" style="display:none;">
																<span>Unit B:</span>
															</div> */}
															<div className="unit-value"><span>{activities.unit_b_value}: </span></div>
														</div>
													</div>
												</div>
											</div>
											{/* <div className="lst-footer clearfix">
												<div className="clearfix">
													<a href="javascript:;" className="remove-add-note-comment"><i className="fa fa-times" aria-hidden="true"></i></a>
												</div>
											</div> */}
										</div>
										<div className="date-container-mbt">
											<div className="date-txt">
												<span>Date:</span>
											</div>
											<div className="clndr-containr-mbt">
											{
												this.state.sessionDates.map((q) => (
													<div className="date-col">
														<div className="col-section-head">
															<span> {q.daterr}</span>
														</div>
														<div className="col-body-cnt">
															<div className="form-gruop-dte">
																<input type="number" data-sess-assoc-id={q.sessAssocId} data-exercise-assoc-id={activities.exerAssocId} className="form-control numberonlyfield exercise-sets" name="sets" min="0" max="9999" onChange={(evt) => this.handleValue(evt)} value={q.exerciseData[activities.exerAssocId].sets} />
															</div>
															<div className="form-gruop-dte">
																<input type="number" data-sess-assoc-id={q.sessAssocId} data-exercise-assoc-id={activities.exerAssocId} className="form-control numberonlyfield exercise-unita" name="unit_a_value" min="0" max="9999" onChange={(evt) => this.handleValue(evt)} value={q.exerciseData[activities.exerAssocId].unita} />
															</div>
															<div className="form-gruop-dte">
																<input type="number" data-sess-assoc-id={q.sessAssocId} data-exercise-assoc-id={activities.exerAssocId} className="form-control numberonlyfield exercise-unitb" name="unit_b_value" min="0" max="9999" onChange={(evt) => this.handleValue(evt)} value={q.exerciseData[activities.exerAssocId].unitb} />
															</div>
														</div>
													</div>
												))
											}
											</div>
										</div>
									</li>
								))}
							</ul>
						</form>
					</div>
				</Modal.Body>
				<div class="coachNote-btm"><h4>Session Comment:</h4><p>{this.state.strengthSessionData.comments ? this.state.strengthSessionData.comments : ''}</p></div>
				<Modal.Footer className="buttons-save">
				</Modal.Footer>
			</Modal>
		);
	}
}

const mapStateToProps = state => {
	return {
		valobj: state.planner.modalsParams.id
	};
};

export default connect(mapStateToProps, { hideStrengthSession, viewExercise })(ShowStrengthSession);