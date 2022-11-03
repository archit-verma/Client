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
		
		API.getStrengthSessInfoAthlete(sessionval).then(sessData => {
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
	
	handleValue(e) {
		let sessAssocId = e.target.attributes.getNamedItem('data-sess-assoc-id').value;
		let exerAssocId = e.target.attributes.getNamedItem('data-exercise-assoc-id').value;
		let sessionDates = [...this.state.sessionDates];
		let exarr = {...this.state.exarr};
		
		if(exarr[sessAssocId] !== undefined){
			if(exarr[sessAssocId][exerAssocId] !== undefined){
				if(e.target.name == 'sets1')
					exarr[sessAssocId][exerAssocId].sets1 = e.target.value;
				else if(e.target.name == 'unita1')
					exarr[sessAssocId][exerAssocId].unita1 = e.target.value;
				else if(e.target.name == 'unitb1')
					exarr[sessAssocId][exerAssocId].unitb1 = e.target.value;
				else if(e.target.name == 'sets2')
					exarr[sessAssocId][exerAssocId].sets2 = e.target.value;
				else if(e.target.name == 'unita2')
					exarr[sessAssocId][exerAssocId].unita2 = e.target.value;
				else if(e.target.name == 'unitb2')
					exarr[sessAssocId][exerAssocId].unitb2 = e.target.value;
				else if(e.target.name == 'sets3')
					exarr[sessAssocId][exerAssocId].sets3 = e.target.value;
				else if(e.target.name == 'unita3')
					exarr[sessAssocId][exerAssocId].unita3 = e.target.value;
				else if(e.target.name == 'unitb3')
					exarr[sessAssocId][exerAssocId].unitb3 = e.target.value;
			}
			else{
				if(e.target.name == 'sets1')
					exarr[sessAssocId][exerAssocId] = {sets1: e.target.value};
				else if(e.target.name == 'unita1')
					exarr[sessAssocId][exerAssocId] = {unita1: e.target.value};
				else if(e.target.name == 'unitb1')
					exarr[sessAssocId][exerAssocId] = {unitb1: e.target.value};
				else if(e.target.name == 'sets2')
					exarr[sessAssocId][exerAssocId] = {sets2: e.target.value};
				else if(e.target.name == 'unita2')
					exarr[sessAssocId][exerAssocId] = {unita2: e.target.value};
				else if(e.target.name == 'unitb2')
					exarr[sessAssocId][exerAssocId] = {unitb2: e.target.value};
				else if(e.target.name == 'sets3')
					exarr[sessAssocId][exerAssocId] = {sets3: e.target.value};
				else if(e.target.name == 'unita3')
					exarr[sessAssocId][exerAssocId] = {unita3: e.target.value};
				else if(e.target.name == 'unitb3')
					exarr[sessAssocId][exerAssocId] = {unitb3: e.target.value};
			}
		}
		else{
			exarr[sessAssocId] = {};
			if(e.target.name == 'sets1')
				exarr[sessAssocId][exerAssocId] = {sets1: e.target.value};
			else if(e.target.name == 'unita1')
				exarr[sessAssocId][exerAssocId] = {unita1: e.target.value};
			else if(e.target.name == 'unitb1')
				exarr[sessAssocId][exerAssocId] = {unitb1: e.target.value};
			else if(e.target.name == 'sets2')
				exarr[sessAssocId][exerAssocId] = {sets2: e.target.value};
			else if(e.target.name == 'unita2')
				exarr[sessAssocId][exerAssocId] = {unita2: e.target.value};
			else if(e.target.name == 'unitb2')
				exarr[sessAssocId][exerAssocId] = {unitb2: e.target.value};
			else if(e.target.name == 'sets3')
				exarr[sessAssocId][exerAssocId] = {sets3: e.target.value};
			else if(e.target.name == 'unita3')
				exarr[sessAssocId][exerAssocId] = {unita3: e.target.value};
			else if(e.target.name == 'unitb3')
				exarr[sessAssocId][exerAssocId] = {unitb3: e.target.value};
		}
		//console.log(exarr);
		
		sessionDates.map((q, i) => {
			if(sessAssocId == q.sessAssocId){
				if(e.target.name == 'sets1')
					q.exerciseData[exerAssocId].sets1 = e.target.value;
				else if(e.target.name == 'unita1')
					q.exerciseData[exerAssocId].unita1 = e.target.value;
				else if(e.target.name == 'unitb1')
					q.exerciseData[exerAssocId].unitb1 = e.target.value;
				else if(e.target.name == 'sets2')
					q.exerciseData[exerAssocId].sets2 = e.target.value;
				else if(e.target.name == 'unita2')
					q.exerciseData[exerAssocId].unita2 = e.target.value;
				else if(e.target.name == 'unitb2')
					q.exerciseData[exerAssocId].unitb2 = e.target.value;
				else if(e.target.name == 'sets3')
					q.exerciseData[exerAssocId].sets3 = e.target.value;
				else if(e.target.name == 'unita3')
					q.exerciseData[exerAssocId].unita3 = e.target.value;
				else if(e.target.name == 'unitb3')
					q.exerciseData[exerAssocId].unitb3 = e.target.value;
			}
		});
		this.setState({ sessionDates, exarr });
	}
	
	saveSessionData(e){
		e.preventDefault();
		let programId = this.props.valobj.program_id;
		let sessionId = this.props.valobj.session_id;
		let clubId = this.props.valobj.club_id;
		let plannerId = this.props.valobj.planner_id;
		let athleteId = this.props.valobj.user_id;
		let exarr = {...this.state.exarr};
		//console.log(programId, exarr);
		API.saveStrengthSessInfoAthlete(programId, sessionId, exarr, clubId, plannerId, athleteId).then(resp => {
			if(resp.success === true){
				let sessionval = this.props.valobj;
				API.getStrengthSessInfoAthlete(sessionval).then(sessData => {
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
		//console.log(this.state.sessionDates);
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
					<div className="sessn-view-container strengthSessionView_athlete clearfix">
						<form action="" method="POST" id="save_coach_values">
							<ul className="custom-list-options ui-sortable clearfix">
								{this.state.strengthSessionExercise.map((activities, index) => (
									<li className="clearfix">
										<div className="list-rslt-mbt enable-lst-container note-border-remove">
											<div className="exercise-copy-paste" style={{display: 'none'}}>
												<a href="" className="cm-copy-exercise-data" title="Copy Exercise Data">
													<i className="fa fa-files-o" aria-hidden="true"></i>
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
																	<span className="thbnail-one"><img src={API.getServerUrl().apiURL+'/uploads/exercise/'+activities.pic1} alt="" className="img-responsive" /></span>
																	<span className="thbnail-one" ><img src={API.getServerUrl().apiURL+'/uploads/exercise/'+activities.pic2} alt="" className="img-responsive" /></span>
																	<span className="thbnail-one"><img src={API.getServerUrl().apiURL+'/uploads/exercise/'+activities.pic3} alt="" className="img-responsive" /></span>
																</a>
															</span>
														</div>
													</div>
													<div className="bx-thbnl">
														<a href="javascript:;" className="add-notes-modalmbt">
															<i className="fa fa-file" aria-hidden="true"></i>
														</a>
														<img src={API.getServerUrl().apiURL+'/uploads/bodystrength/'+activities.strength_body_img} alt="" className="img-responsive" />
													</div>
												</div>
												<div className="unit-box">
													<div className="units-selection">
														<div className="sngle-field clearfix">
															<div className="unit-value"><span>Sets:</span></div>
														</div>
														<div className="sngle-field clearfix">
															{/* <div className="unit-value" style="display:none;">
																<span>Unit A:</span>
															</div> */}
															<div className="unit-value"><span>{activities.unit_a_value}: </span></div>
														</div>
														<div className="sngle-field clearfix">
															{/* <div className="unit-value" style="display:none;">
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
												this.state.sessionDates.map((q) => {
													let read_only_sets = {}, read_only_unita = {}, read_only_unitb = {};
													if(q.exerciseData[activities.exerAssocId].sets === '')
														read_only_sets['readonly'] = 'readonly';
													if(q.exerciseData[activities.exerAssocId].unita === '')
														read_only_unita['readonly'] = 'readonly';
													if(q.exerciseData[activities.exerAssocId].unitb === '')
														read_only_unitb['readonly'] = 'readonly';
													return (
													<div className="date-col">
														<div className="col-section-head">
															<span> {q.daterr}</span>
														</div>
														<div className="col-body-cnt flex-container">
															<div className="col-lftSrch">
																<div className="form-gruop-dte">
																	<div className="valueonly">{q.exerciseData[activities.exerAssocId].sets}</div>
																	<div className="valueonly">{q.exerciseData[activities.exerAssocId].unita}</div>
																	<div className="valueonly">{q.exerciseData[activities.exerAssocId].unitb}</div>
																</div>
															</div>
															<div className="col-rghtSrch">
																<div className="form-gruop-dte">
																	<input type="number" {...read_only_sets} data-sess-assoc-id={q.sessAssocId} data-exercise-assoc-id={activities.exerAssocId} className="form-control numberonlyfield" name="sets1" min="0" max="9999" onChange={(evt) => this.handleValue(evt)} value={q.exerciseData[activities.exerAssocId].sets1} />
																</div>
																<div className="form-gruop-dte">
																	<input type="number" {...read_only_unita} data-sess-assoc-id={q.sessAssocId} data-exercise-assoc-id={activities.exerAssocId} className="form-control numberonlyfield" name="unita1" min="0" max="9999" onChange={(evt) => this.handleValue(evt)} value={q.exerciseData[activities.exerAssocId].unita1} />
																</div>
																<div className="form-gruop-dte">
																	<input type="number" {...read_only_unitb} data-sess-assoc-id={q.sessAssocId} data-exercise-assoc-id={activities.exerAssocId} className="form-control numberonlyfield" name="unitb1" min="0" max="9999" onChange={(evt) => this.handleValue(evt)} value={q.exerciseData[activities.exerAssocId].unitb1} />
																</div>
															</div>
															<div className="col-rghtSrch">
																<div className="form-gruop-dte">
																	<input type="number" {...read_only_sets} data-sess-assoc-id={q.sessAssocId} data-exercise-assoc-id={activities.exerAssocId} className="form-control numberonlyfield" name="sets2" min="0" max="9999" onChange={(evt) => this.handleValue(evt)} value={q.exerciseData[activities.exerAssocId].sets2} />
																</div>
																<div className="form-gruop-dte">
																	<input type="number" {...read_only_unita} data-sess-assoc-id={q.sessAssocId} data-exercise-assoc-id={activities.exerAssocId} className="form-control numberonlyfield" name="unita2" min="0" max="9999" onChange={(evt) => this.handleValue(evt)} value={q.exerciseData[activities.exerAssocId].unita2} />
																</div>
																<div className="form-gruop-dte">
																	<input type="number" {...read_only_unitb} data-sess-assoc-id={q.sessAssocId} data-exercise-assoc-id={activities.exerAssocId} className="form-control numberonlyfield" name="unitb2" min="0" max="9999" onChange={(evt) => this.handleValue(evt)} value={q.exerciseData[activities.exerAssocId].unitb2} />
																</div>
															</div>
															<div className="col-rghtSrch">
																<div className="form-gruop-dte">
																	<input type="number" {...read_only_sets} data-sess-assoc-id={q.sessAssocId} data-exercise-assoc-id={activities.exerAssocId} className="form-control numberonlyfield" name="sets3" min="0" max="9999" onChange={(evt) => this.handleValue(evt)} value={q.exerciseData[activities.exerAssocId].sets3} />
																</div>
																<div className="form-gruop-dte">
																	<input type="number" {...read_only_unita} data-sess-assoc-id={q.sessAssocId} data-exercise-assoc-id={activities.exerAssocId} className="form-control numberonlyfield" name="unita3" min="0" max="9999" onChange={(evt) => this.handleValue(evt)} value={q.exerciseData[activities.exerAssocId].unita3} />
																</div>
																<div className="form-gruop-dte">
																	<input type="number" {...read_only_unitb} data-sess-assoc-id={q.sessAssocId} data-exercise-assoc-id={activities.exerAssocId} className="form-control numberonlyfield" name="unitb3" min="0" max="9999" onChange={(evt) => this.handleValue(evt)} value={q.exerciseData[activities.exerAssocId].unitb3} />
																</div>
															</div>
														</div>
													</div>
													)
												})
											}
											</div>
										</div>
									</li>
								))}
							</ul>
						</form>
					</div>
				</Modal.Body>
				<div className="coachNote-btm"><h4>Session Comment:</h4><p>{this.state.strengthSessionData.comments ? this.state.strengthSessionData.comments : ''}</p></div>
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