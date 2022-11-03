import React, { Component } from 'react';
import LeftSidebar from './left-sidebar';
//import StrengthRightsidebar from './strength-right-sidebar';
import '../../styles/custom-style.css';
import Accordion from 'react-bootstrap/Accordion'
import '../../fonts/stylesheet.css';
import * as API from '../../utils/api.js'
//import { Image } from 'react-bootstrap';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import { Container, Draggable } from 'react-smooth-dnd';
//import { applyDrag, generateItems } from './utils';
import { applyDrag } from './utils';
import { connect } from 'react-redux';
import { ShowEditProgram, updateSeachExercise, ShowEditExercise, viewExercise } from '../../actions';
const groupStyle = {
	marginLeft: '50px',
	flex: 1
}
class EditStrengthsession extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ssDetail: {
				ss_title: '',
				exercise_type: 'exercise',
				ss_and: 'and',
				strength_body: '',

			},
			strengthSessionstate: {
				str_session_title: '',
				str_session_id: '',
				str_session_keywords: '',
				str_session_exercise_type: 'exercise',
				strength_activity_type: '',
				str_session_hours: '',
				str_session_minuts: '',
				str_session_rating: '',
				str_session_comment: '',
				load: '',
			},
			strengthBody: [],
			ex_unit: [],
			ex_results: [],
			unita: [],
			unitb: [],
			unitc: [],
			Activities: [],
			rpe: [],
			//items1: generateItems(3, (i) => ({ id: '1' + i, data: `Item  - ${i}` })),
			items1: [],
			//items2: generateItems(3, (i) => ({ id: '3' + i, data: `Draggable 3 - ${i}` })),
			items2: [],
			unita_val: '',

			exerciseDetail: '',
			club: '',
			form_state: '',
			success_m:'',
			alert_cls:'',
			leftSidebarDisplay: true,
			rightSidebarDisplay: true,
			exerciseTabActive: 0,
			exNotesView: []
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleStrenghtSessionSubmit = this.handleStrenghtSessionSubmit.bind(this);
		this.handltype = this.handltype.bind(this);
		this.handlestrengthSession = this.handlestrengthSession.bind(this);
		this.handleExerciseNote = this.handleExerciseNote.bind(this);
		this.setformstate = this.setformstate.bind(this);
		this.leftSidebarChange = this.leftSidebarChange.bind(this);
		this.rightSidebarChange = this.rightSidebarChange.bind(this);
		this.exerciseTabChange = this.exerciseTabChange.bind(this);
	}


	componentDidMount = async () => {
		API.getTeam(this.props.clubSlug)
			.then(response => {
				if (response.team === null) {
					this.setState({ club: null });
				}
				else {
					if (response.team.creatorId === this.props.user._id)
						this.setState({ club: response.team, loading: false });
					else
						this.setState({ club: null });
				}
			});
		API.getbodystrength().then(strengthBody => {
			this.setState({
				strengthBody: strengthBody,
			});
		})
		API.getunitA().then(unita => {
			this.setState({
				unita: unita,
			});
		})
		API.getsessionActivity().then(activities => {
			this.setState({
				Activities: activities,
			});
		})
		API.getRpe().then(rpe => {
			this.setState({
				rpe: rpe,
			});
		})
		API.getStrengthSessionById(this.props.sessionId).then(strengthSessionData => {
			this.setState({ strengthSessionstate: { ...this.state.strengthSessionstate, str_session_title: strengthSessionData.title } });
			this.setState({ strengthSessionstate: { ...this.state.strengthSessionstate, str_session_id: this.props.sessionId } });
			this.setState({ strengthSessionstate: { ...this.state.strengthSessionstate, str_session_keywords: strengthSessionData.keywords } });
			this.setState({ strengthSessionstate: { ...this.state.strengthSessionstate, str_session_exercise_type: strengthSessionData.exercise_type } });
			this.setState({ strengthSessionstate: { ...this.state.strengthSessionstate, str_session_minuts: strengthSessionData.total_time_min } });
			this.setState({ strengthSessionstate: { ...this.state.strengthSessionstate, str_session_hours: strengthSessionData.total_time_hours } });
			this.setState({ strengthSessionstate: { ...this.state.strengthSessionstate, str_session_comment: strengthSessionData.comment } });
			this.setState({ strengthSessionstate: { ...this.state.strengthSessionstate, strength_activity_type: strengthSessionData.activity_type._id } });
			this.setState({ strengthSessionstate: { ...this.state.strengthSessionstate, str_session_rating: strengthSessionData.rpe } });
			this.setState({ strengthSessionstate: { ...this.state.strengthSessionstate, load: strengthSessionData.load } });
			this.setState({ items2: strengthSessionData.ex_components });
			this.setState({ unitc: strengthSessionData.unit_b_opt });
			this.setState({ exerciseDetail: strengthSessionData.session_exercises });
		});
	}
	UNSAFE_componentWillReceiveProps(nextProps) {
		if (nextProps.updateSearchState) {
			setTimeout(() => {
				let data={};
		data['ssDetail']=this.state.ssDetail;
		data['clubId']=this.state.club._id;

				API.searchExercise(data).then(ex_results => {
					//this.savearr(ex_results);
					this.setState({
						items1: ex_results
					});
				})
			}, 1000);
			//this.props.updateSeachExercise(false);
		}
	}
	editExercise = (id) => {
		this.props.ShowEditExercise(id);
	}
	viewExercise = (e, id) => {
		e.preventDefault();
		this.props.viewExercise(id);
	}
	editProgram = (id) => {
		this.props.ShowEditProgram(id);
	}
	removeExercise = (id) => {
		if (window.confirm('Are you sure you wish to delete this exercise?')) {
			var currentArr = this.state.items2;
			currentArr.splice(id, 1);
			this.setState({ items2: currentArr });
		}
	}

	handltype(e) {
		this.setState({ ssDetail: { ...this.state.ssDetail, [e.target.name]: e.target.value } });
	}

	handlestrengthSession(e) {
		this.setState({ strengthSessionstate: { ...this.state.strengthSessionstate, [e.target.name]: e.target.value } });
	}
	handleExerciseNote = (e) => {
		let currentNoteIndex = e.target.attributes.getNamedItem('data-note-id').value;
		let currentValue = e.target.value;
		let items2 = [...this.state.items2];
		items2[currentNoteIndex].note_value = currentValue;
		this.setState({items2});
	}
	handleselect = (e) => {
		var unitaitem = e.target.attributes.getNamedItem('data-ex-id').value;
		let currentState = this.state.items2[unitaitem];
		let currentValue = e.target.value;
		currentState.unit_a_value = currentValue;
		this.setState(currentState);
		if (currentValue.length !== 0) {
			API.getUnitB(currentValue).then(unitbdata => {
				var currentState = this.state.unitc;
				if (unitbdata.length !== 0) {
					currentState[unitaitem] = unitbdata;
					this.setState({
						unitc: currentState
					})
				} else {
					currentState[unitaitem] = '';
					this.setState({
						unitc: currentState
					})
				}
			})
		}
	}
	handleunitb = (e) => {
		var currentValue = e.target.value;
		var unitaitem = e.target.attributes.getNamedItem('data-unitb-id').value;
		let currentState = this.state.items2[unitaitem];
		currentState.unit_b_value = currentValue;
		this.setState(currentState);
	}

	handleRpe = (e) => {
		let id = e.target.value;
		this.setState({ strengthSessionstate: { ...this.state.strengthSessionstate, str_session_rating: e.target.value } })
		if (id.length !== 0) {
			API.getLoad(id).then(loaddata => {
				if (loaddata._id) {
					this.setState({ strengthSessionstate: { ...this.state.strengthSessionstate, load: loaddata.value } })
				}
			})
		}
	}
	handleSubmit(event) {
		event.preventDefault();
		let data={};
		data['ssDetail']=this.state.ssDetail;
		data['clubId']=this.state.club._id;
		API.searchExercise(data).then(ex_results => {
			this.setState({
				items1: ex_results,
			});
		})
	}
	handleUnitbs(id) {
		let currentExerciseData = this.state.items2[id];
		let currentState = this.state.unitc[currentExerciseData.order];

		return (
			<select value={currentExerciseData.unit_b_value} onChange={this.handleunitb} data-unitb-id={id} >
				<option>select unit b</option>
				{
					currentState && currentState.map((q, e) => (
						<option value={q.unit_b_value}>{q.unit_b_name}</option>
					))
				}
			</select>
		)
	}

	handleUnita(i, p) {
		var obj = {};
		let currentExerciseData = this.state.items2[i];
		let unitAstate = [...this.state.unita];
		obj[i] = unitAstate;
		return (
			<select value={currentExerciseData.unit_a_value} data-ex-id={i} data-unit-b={'unitb_' + i} data-exercises_id={currentExerciseData.exercise_id} onChange={this.handleselect}>
				<option value=''>value</option>
				{
					obj[i].map((q, e) => (
						<option value={q._id}>{q.name}</option>
					))
				}
			</select>
		);
	}
	
	showExNotes(e, i){
		e.preventDefault();
		let exNotesView = [...this.state.exNotesView];
		//if(exNotesView[i] !== undefined)
			//exNotesView[i] = !exNotesView[i];
		//else
			exNotesView[i] = true;
		
		this.setState({exNotesView});
	}
	
	hideExNotes(e, i){
		e.preventDefault();
		let exNotesView = [...this.state.exNotesView];
		exNotesView[i] = false;
		this.setState({exNotesView});
	}
	
	showExerciseNotes(i) {
		let currentExerciseData = this.state.items2[i];

		return (
			<input type='text' data-note-id={i} name='ex_note' id='ex_note' onChange={this.handleExerciseNote} value={currentExerciseData.note_value} />
		);
	}
	handleStrenghtSessionSubmit(e) {
		e.preventDefault();
		var dataArr = {};
		let ssdata = this.state.strengthSessionstate;
		dataArr['ssdata'] = ssdata;
		dataArr['exercisedata'] = this.state.items2;
		if (this.state.items2.length === 0) {
			alert('Please add session exercises');
			return false;
		}
		for (let i = 0; i < this.state.items2.length; i++) {
			if(this.state.items2[i].unit_a_value === ''){
				alert('Please select Unit A for exrecise '+this.state.items2[i].data);
				return false;
			}
			if(this.state.items2[i].unit_b_value === ''){
				alert('Please select Unit B for exrecise '+this.state.items2[i].data);
				return false;
			}
		}
		if (this.state.form_state === 'add') {
			API.saveSSession(dataArr).then(data => {
				if(data.id){
					this.setState({
						success_m: 'Strength Session Added Successfully.',
                        alert_cls: 'alert-success',
					})
				}else{
					this.setState({
						success_m: 'Something Went Wrong.',
						alert_cls: 'alert-danger',
					})
				}
			})
			setTimeout(() => {
				this.setState({
					success_m: '',
					alert_cls: '',
				});
			}, 5000);
		} else {
			API.updateSSession(dataArr).then(data => {
				if(data){
					this.setState({
						success_m: 'Strength Session Updated Successfully.',
                        alert_cls: 'alert-success',
					})
				}else{
					this.setState({
						success_m: 'Something Went Wrong.',
						alert_cls: 'alert-danger',
					})
				}
			})
			setTimeout(() => {
				this.setState({
					success_m: '',
					alert_cls: '',
				});
			}, 5000);
		}
	}
	setformstate = async () => {
		this.setState({ form_state: 'add' })
	}
	
	leftSidebarChange(){
		this.setState({leftSidebarDisplay: !this.state.leftSidebarDisplay});
	}
	
	rightSidebarChange(e){
		e.preventDefault();
		this.setState({rightSidebarDisplay: !this.state.rightSidebarDisplay});
	}
	
	exerciseTabChange(key){
		this.setState({exerciseTabActive: key});
	}

	render() {
		let timeInterval = [], ex_type_ex = {}, ex_type_flex = {};
		for (let i = 0; i < 25; i++) {
			timeInterval.push(<option key={'timeInterval' + i} value={i} selected={this.state.strengthSessionstate.str_session_hours === i ? true : false}>{i} Hours</option>);
		}
		
		let timeIntervalsec = [];
		for (let i = 0; i < 60; i++) {
			timeIntervalsec.push(<option key={'timeIntervalsec' + i} value={i} selected={this.state.strengthSessionstate.str_session_minuts === i ? true : false}>{i} Minute</option>);
		}
		if(this.state.strengthSessionstate.str_session_exercise_type === 'exercise')
			ex_type_ex['checked'] = 'checked';
		if(this.state.strengthSessionstate.str_session_exercise_type === 'flexibility')
			ex_type_flex['checked'] = 'checked';
		return (
			<div className="container-large strength-sessiontemplate  clearfix">
				<div id="wrapper" className={"coach-planner"+(this.state.leftSidebarDisplay ? "": " toggled-left")+(this.state.rightSidebarDisplay ? "": " toggled-right")}>
				<LeftSidebar userid={this.props.userSignedIn} club={this.state.club} sidebarDisplay={this.state.leftSidebarDisplay} leftSidebarChange={this.leftSidebarChange} />
					<div id="page-content-wrapper" className="mbt-wrapper-option strength-session-body">
						<form action="" onSubmit={this.handleStrenghtSessionSubmit} method="post" id="savestrength-session" className="getform-mbt">
							<input type="hidden" name="action" value="add_strength_session" />
							<input type="hidden" name="cm_sess_id" value="" />
							<div className="container-fluid h100 edit-strength-session-tab">
								<div className="row h100">
									<div className="col-lg-12-large h100">
										<div className="top-header-bar mrgn-btm0">
											<div className="dashboard-heading edit-session-btn">
												<h3>
													<a href="#menu-toggle-left" className="menu-toggle-left" id="show-after-left-close" style={!this.state.leftSidebarDisplay ? {display: 'inline-block'} : {}} onClick={(e) => {e.preventDefault();this.leftSidebarChange()}}>
														<span className="icon-bar"></span>
														<span className="icon-bar"></span>
														<span className="icon-bar"></span>
													</a>
													Building Strength Program</h3>
												<input type="submit" name="submit" value="Update Session" />
												<input type="submit" className="submit-sessn" onClick={this.setformstate} name="submit" value="Save Session As" />
											</div>
											<a href="#menu-toggle-right" className="menu-toggle-right search-icon f-right" id="show-after-right-close" style={!this.state.rightSidebarDisplay ? {visibility: 'visible'} : {}} onClick={(e) => {this.rightSidebarChange(e)}}>
												<i className="fa fa-search" aria-hidden="true"></i>
											</a>
										</div>
										{/* <div className="alert alert-success">
                                    <strong>Success!</strong> Session Added Successfully.
                                </div> */}
								{this.state.success_m && <div className={this.state.alert_cls + " alert"}>{this.state.success_m}</div>}
										<div className="strength-cotnainer clearfix">
											<div className="strength-sessn-indo">
												<h3 className="hdng-ssc">Strength Session Info</h3>
												<div className="sessn-fm">
													<div className="form-group">
														<label htmlFor="str_session_title">Session Title</label>
														<input type="text" name="str_session_title" onChange={this.handlestrengthSession} id="str_session_title" value={this.state.strengthSessionstate.str_session_title} className="form-control" placeholder="Select Session Title..." />
													</div>
													<div className="form-group">
														<label htmlFor="str_session_keywords">Session Keywords (comma separated)</label>
														<input type="text" name="str_session_keywords" onChange={this.handlestrengthSession} id="str_session_keywords" value={this.state.strengthSessionstate.str_session_keywords} className="form-control" placeholder="Type keywords" />
													</div>
												</div>
												<div className="radio-buttons form-group">
													<input id="str_session_exercise" type="radio" name="str_session_exercise_type" value="exercise" onChange={this.handlestrengthSession} {...ex_type_ex} />
													<label htmlFor="str_session_exercise">Exercise</label>
													<input id="str_session_flexibility" type="radio" name="str_session_exercise_type" value="flexibility" onChange={this.handlestrengthSession} {...ex_type_flex} />
													<label htmlFor="str_session_flexibility">Flexibility</label>
												</div>
												<div className="form-group">
													<label htmlFor="str_session_activity_type">Activity Type:</label>
													<div className="input-cover">
														<select id="str_session_activity_type" className="styled-select select-widthimage" onChange={this.handlestrengthSession} name="strength_activity_type" required="required">
															<option value="" id="disable-item">Please Select</option>
															{this.state.Activities.map(activities => (
																<option key={'session-activities'+activities._id} value={activities._id} selected={this.state.strengthSessionstate.strength_activity_type === activities._id ? true : false}>{activities.title}</option>
															))}
														</select>
													</div>
												</div>
												<div className="form-group minuts-select clearfix">
													<label htmlFor="str_session_hours">Total Time</label>
													<div className="input-cover" style={{ width: '100%', background: 'none' }}>
														<select id="str_session_hours" name="str_session_hours" onChange={this.handlestrengthSession} className="styled-select" style={{ width: '47%' }}>
															<option value="" disabled="" selected="" >HH</option>
															{timeInterval}
														</select>
														<select id="str_session_minuts" name="str_session_minuts" onChange={this.handlestrengthSession} className="styled-select" style={{ width: '47%', float: 'right' }}>
															<option value="" disabled="" selected="" >MM</option>
															{timeIntervalsec}
														</select>
													</div>
												</div>
												<div className="load-cntnr-wrap form-group clearfix">
													<label htmlFor="str_session_rating">Rating of Perceived Effort (RPE)</label>
													<div className="form-group-lmt">
														<div className="input-cover rpe-effort ">
															<input type="hidden" name="rpe_val" id="rpe_val" value="" />
															<select id="str_session_rating" className="styled-select form-control" name="str_session_rating" onChange={this.handleRpe}>
																<option value=""> Please Select</option>
																{this.state.rpe.map(rpe => (
																	<option value={rpe._id} selected={this.state.strengthSessionstate.str_session_rating === rpe._id ? true : false}>{rpe.name}</option>
																))}
															</select>
														</div>
													</div>
													<div className="strength-load-results text-center">
														<h2>Load: <span>
															{this.state.strengthSessionstate.load}
														</span>
														</h2>
													</div>
												</div>
												<div className="sesson-wrap-comment form-group">
													<label htmlFor="str_session_comment">Session Comment</label>
													<textarea name="str_session_comment" id="str_session_comment" className="form-control" onChange={this.handlestrengthSession} value={this.state.strengthSessionstate.str_session_comment} rows="4" cols="4" placeholder="Type Session Comment..." maxLength="200">{this.state.strengthSessionstate.comment}</textarea>
												</div>
											</div>
											<div className="strenth-sessn-excerze">
												<h3 className="hdng-ssc">Strength Session Exercises</h3>
												<div className="scroll-panes">
													<ul id="activemodules" className="ui-sortable custom-list-options ">
														<Container className="scroll-panes-mbtcustom"  groupName="1" getChildPayload={i => this.state.items2[i]} onDrop={e => this.setState({ items2: applyDrag(this.state.items2, e) })}>
															{
																this.state.items2.map((p, i) => {
																	return (
																		<Draggable key={i}>
																			<div className="draggable-item">
																				<div className="list-rslt-mbt">
																					<div className="lst-wrapper-tp">
																						<div className="bx-cnt-list clearfix">
																							<div className="bx-lft-ct">
																								<h5>
																									{p.data}
																									{p.exercise_id ?<a className="edit-execrcise-modal edit-ex" onClick={() => this.editExercise(p.exercise_id)}>
																							<i className="fa fa-pencil-square-o" aria-hidden="true"></i>
																						</a>
																						:null}
																								</h5>
																								<div className="icn-wth-thmbs">
																								{p.exercise_id ? <span className="cam-icn"><a href="" onClick={(e) => this.viewExercise(e, p.exercise_id)}><i className="fa fa-video-camera" aria-hidden="true"></i></a>
																						</span>: null}
																									<span className="ex-thmbil-imgs">
																									<a href="" className="edit-ex">
																										{p.pic1 ? <span className="thbnail-one"><img src={API.getServerUrl().apiURL+'/uploads/exercise/' + p.pic1} alt="" /></span> : null}
																										{p.pic2 ? <span className="thbnail-one"><img src={API.getServerUrl().apiURL+'/uploads/exercise/' + p.pic2} alt="" /></span> : null}
																										{p.pic3 ? <span className="thbnail-one"><img src={API.getServerUrl().apiURL+'/uploads/exercise/' + p.pic3} alt="" /></span> : null}
																									</a>
																								</span>
																								</div>
																							</div>
																							<div className="bx-thbnl enable-lst-container">
																								<a href="" className="add-notes-modalmbt" onClick={(e) => this.showExNotes(e, i)}>
																									<i className="fa fa-file" aria-hidden="true"></i>
																								</a>
																								{p.bodystrenght ? <div className="bx-thbnl"><img className="img-fluid" src={API.getServerUrl().apiURL+'/uploads/bodystrength/' + p.bodystrenght} /></div> : null}
																							</div>
																						</div>
																						<div className="unit-box inner-loader">
																							<div className="units-selection">
																								<div className="sngle-field clearfix">
																									<div className="cstm-select">
																										{this.handleUnita(i, p)}
																									</div>
																								</div>
																								<div className="sngle-field clearfix">
																									<div className="cstm-select">
																										{this.handleUnitbs(i)}
																									</div>
																								</div>
																							</div>
																						</div>
																						<div className="lst-footer clearfix">
																							<div className="add-note-option clearfix" style={{opacity: (this.state.exNotesView[i] !== undefined && this.state.exNotesView[i] === true) ? 1: 0}}>
																								{this.showExerciseNotes(i)}
																								<a href="" className="add-note-btn" onClick={(e) => this.hideExNotes(e, i)}>Add Note</a>
																								<a href="" className="remove-note-bx" onClick={(e) => this.hideExNotes(e, i)}><i className="fa fa-times" aria-hidden="true"></i></a>
																							</div>
																						</div>
																					</div>
																					<div className="remove-frm-sessn">
																						<a onClick={() => this.removeExercise(i)}>
																							<i className="fa fa-trash-o" aria-hidden="true"></i>  Remove
																						</a>
																					</div>
																				</div>
																			</div>
																		</Draggable>
																	);
																})
															}
														</Container>
													</ul>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</form>
						{/* strength session sidebar  */}
						<div id="sidebar-wrapper-right" className="strength-session-sidebar">
							<div className="sidebar-container">
								<div className="head-section">
									<a href="#menu-toggle" className="menu-toggle-right" id="" onClick={(e) => this.rightSidebarChange(e)}>
										<span className="icon-bar"></span>
										<span className="icon-bar"></span>
										<span className="icon-bar"></span>
									</a>
									<span className="search-labled">Find</span>
									<a href="" className="refresh-icon" title="Refresh Programs and Sessions"> Reset</a>
								</div>
								<div className="cm-sidebar-contents">
									<div className="panel-group" id="cm-accordion" role="tablist" aria-multiselectable="true">
										<div className="panel panel-default current">
											
											<Form onSubmit={this.handleSubmit}>
												
												<Accordion defaultActiveKey="0" className="custom-accordian">
													<Card className={this.state.exerciseTabActive === 0 ? 'active' : ''}>
														<Card.Header>
															<Accordion.Toggle as={Button} variant="link" eventKey="0" onClick={() => this.exerciseTabChange(0)}>
																Basic Search</Accordion.Toggle>
														</Card.Header>
														<Accordion.Collapse eventKey="0">
															<Card.Body>
																<Form.Group controlId="addProgramAthleteLevel">
																	<Form.Check inline label="Exercise" type={'radio'} id='exercise_type' name='exercise_type' value='exercise' onChange={this.handltype} checked={this.state.ssDetail.exercise_type === "exercise" ? true : false} />
																	<Form.Check inline label="Flexibility" type={'radio'} id='flexibility_type' name='exercise_type' value='flexibility' onChange={this.handltype} checked={this.state.ssDetail.exercise_type === "flexibility" ? true : false} />
																</Form.Group>
																<Form.Row>
																	<Form.Group controlId="formBasicEmail">
																		<Form.Control type="text" placeholder="By Title" name='ss_title' onChange={this.handltype} />
																	</Form.Group>
																</Form.Row>
																<Form.Row>
																	<Form.Group controlId="program_phase">
																		<Form.Control name="strength_body" as="select" onChange={this.handltype} >
																			<option value="">Strength to body</option>
																			{this.state.strengthBody.map(strengthBody => (
																				<option key={'stength-body-'+strengthBody._id} value={strengthBody._id}>{strengthBody.title}</option>
																			))}
																		</Form.Control>
																	</Form.Group>
																</Form.Row>
															</Card.Body>
														</Accordion.Collapse>
													</Card>
													<Card className={this.state.exerciseTabActive === 1 ? 'active' : ''}>
														<Card.Header>
															<Accordion.Toggle as={Button} variant="link" eventKey="1" onClick={() => this.exerciseTabChange(1)}>
																Exercise Components </Accordion.Toggle>
														</Card.Header>
														<Accordion.Collapse eventKey="1">
															<Card.Body>
																<Form.Group controlId="addProgramAthleteLevel">
																	<Form.Check inline label="And" type={'radio'} id='ex_and' onChange={this.handltype} name='ss_and' value='and' checked={this.state.ssDetail.ss_and === "and" ? true : false} />
																	<Form.Check inline label="Or" type={'radio'} id='ex_or' onChange={this.handltype} name='ss_and' value='or' checked={this.state.ssDetail.ss_and === "or" ? true : false} />
																</Form.Group>
															</Card.Body>
														</Accordion.Collapse>
													</Card>
													<Card className={this.state.exerciseTabActive === 2 ? 'active' : ''}>
														<Accordion.Toggle as={Card.Header} variant="link" eventKey="2" onClick={() => this.exerciseTabChange(2)}>
															<div className="search-results-btn">
																<input type="submit" name="submit" value="Results" />
															</div>
														</Accordion.Toggle>
														<Accordion.Collapse eventKey="2">
															<Card.Body className="no-padding">
																<ul className="panel benefitList list-group">
																	<Container groupName="1" behaviour="copy" getChildPayload={i => this.state.items1[i]} onDrop={e => this.setState({ items1: applyDrag(this.state.items1, e) })}>
																		{
																			this.state.items1 && this.state.items1.map((p, i) => {
																				return (
																					<Draggable key={i}>
																						<div className="draggable-item">
																							<div className="list-rslt-mbt">
																								<div className="lst-wrapper-tp">
																									<div className="bx-cnt-list clearfix">
																										<div className="bx-lft-ct">
																											<h5>
																												{p.exercise_id ? <a className="edit-execrcise-modal edit-ex" onClick={() => this.editExercise(p.exercise_id)}>
																													<i className="fa fa-pencil-square-o" aria-hidden="true"></i>
																												</a>
																													: null}
																												{p.data}
																											</h5>
					
																											<div className="icn-wth-thmbs">
																												{p.exercise_id ? <span className="cam-icn"><a href="" onClick={(e) => this.viewExercise(e, p.exercise_id)}><i className="fa fa-video-camera" aria-hidden="true"></i></a>
																												</span> : null}
																												<span className="ex-thmbil-imgs">
																													{p.pic1 ? <span className="thbnail-one"><img src={API.getServerUrl().apiURL+'/uploads/exercise/' + p.pic1} alt="" /></span> : null}
																													{p.pic2 ? <span className="thbnail-one"><img src={API.getServerUrl().apiURL+'/uploads/exercise/' + p.pic2} alt="" /></span> : null}
																													{p.pic3 ? <span className="thbnail-one"><img src={API.getServerUrl().apiURL+'/uploads/exercise/' + p.pic3} alt="" /></span> : null}
																												</span>
																											</div>
																										</div>
																										{p.bodystrenght ? <div className="bx-thbnl"><img className="img-fluid" src={API.getServerUrl().apiURL+'/uploads/bodystrength/' + p.bodystrenght} /></div> : null}
					
																									</div>
																								</div>
																							</div>
																						</div>
																					</Draggable>
																				);
																			})
																		}
																	</Container>
																</ul>
															</Card.Body>
														</Accordion.Collapse>
													</Card>
												</Accordion>
											</Form>
											
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
		updateSearchState: state.planner.updateSeachExercise,
		user: state.auth.user
	};
};
export default connect(mapStateToProps, { ShowEditExercise, ShowEditProgram, updateSeachExercise, viewExercise })(EditStrengthsession);