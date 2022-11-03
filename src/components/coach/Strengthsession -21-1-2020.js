import React, { Component } from 'react';
import LeftSidebar from './left-sidebar';
import StrengthRightsidebar from './strength-right-sidebar';
import '../../styles/custom-style.css';
import Accordion from 'react-bootstrap/Accordion'
import '../../fonts/stylesheet.css';
import * as API from '../../utils/api.js'
import { Image } from 'react-bootstrap';
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
export default class Strengthsession extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ssDetail: {
				ss_title: '',
				exercise_type: '',
				ss_and: '',

			},
			strengthSessionstate: {
				str_session_title: '',
				str_session_keywords: '',
				str_session_type: '',
				strength_activity_type: '',
				str_session_hours: '',
				str_session_minuts: '',
				str_session_rating: '',
				str_session_comment: '',
				load: '',

			},
			strengthBody: [],
			ex_results: [],
			unita: [],
			unitb: [],
			Activities: [],
			rpe: [],
		
		}
		this.handleSubmit = this.handleSubmit.bind(this);
		this.handleStrenghtSessionSubmit = this.handleStrenghtSessionSubmit.bind(this);
		this.handltype = this.handltype.bind(this);
		this.handlestrengthSession = this.handlestrengthSession.bind(this);
	}
	onDragOver = (ev) => {
		ev.preventDefault();
	}
	onDragStart = (ev, id) => {
	
		ev.dataTransfer.setData('id', id);
	}
	onDrop = (ev, cat) => {
		let id = ev.dataTransfer.getData('id');
		console.log(id);
		let taskarr = [];
		let tasks = this.state.ex_results.filter((task) => {
			if (task.title == id) {
				taskarr = { "title": task.title, "category": "wip" };
				task.category = cat;
			}

			return task;
		});
		this.setState({
			...this.state,
		});
		this.state.ex_results.push(taskarr)
	}

	componentDidMount = async () => {
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
		API.getActivity().then(activities => {
			this.setState({
				Activities: activities,
			});
		})
		API.getRpe().then(rpe => {
			this.setState({
				rpe: rpe,
			});
		})

	}

	handltype(e) {
		this.setState({ ssDetail: { ...this.state.ssDetail, [e.target.name]: e.target.value } });
	}
	
	handlestrengthSession(e) {
		this.setState({ strengthSessionstate: { ...this.state.strengthSessionstate, [e.target.name]: e.target.value } });
	}

	handleselect = (e) => {
		let id = e.target.value;
		let name=e.target.name;
		if (id.length != 0) {
			API.getUnitB(id).then(unitbdata => {
				if (unitbdata.length != 0) {
					this.setState({
						unitb: unitbdata
					})
				} else {
					this.setState({
						unitb: []
					})
				}
			})
		}
	}


	handleRpe = (e) => {
		let id = e.target.value;
		if (id.length != 0) {
			API.getLoad(id).then(loaddata => {
				if (loaddata._id) {
					this.setState({ strengthSessionstate: { ...this.state.strengthSessionstate, load: loaddata.value }})
				}
			})
		}
	}
	handleSubmit(event) {
		event.preventDefault();
		let data = this.state.ssDetail;
		API.searchExercise(data).then(ex_results => {
			//this.savearr(ex_results);
			this.setState({
				ex_results: ex_results,
			});
		})

	}
	handleStrenghtSessionSubmit(e){
		e.preventDefault();
		let data = this.state.strengthSessionstate;
	}

	render() {
		var tasks = {
			wip: [],
			complete: [],
		}
		let timeInterval = [];
		for (let i = 0; i < 25; i++) {
			timeInterval.push(<option key={'timeInterval' + i} value={i}>{i} Hours</option>);
		}
		let timeIntervalsec = [];
		for (let i = 0; i < 60; i++) {
			timeIntervalsec.push(<option key={'timeIntervalsec' + i} value={i}>{i} Minute</option>);
		}
		var cntr=1;
		this.state.ex_results.forEach((t) => {
			tasks[t.category].push(
				<div key={t.title} onDragStart={(e) => this.onDragStart(e, t.title)} draggable className="draggable">
					{t.title}
					<select name={cntr} onChange={this.handleselect}>
						<option>value</option>
						{this.state.unita.map(unita => (
							<option value={unita._id}>{unita.name}</option>
						))}
					</select>
					<select name={'unit_b'+cntr}>
						<option>select unit b</option>
						{this.state.unitb.map(unitb => (
							<option value={unitb._id}>{unitb.unit_b_name}</option>
						))}
					</select>
				</div>
			);
			cntr++;
		});
		return (
			<div className="container-large strength-sessiontemplate  clearfix">
				<div id="wrapper" className="coach-planner">
					<LeftSidebar userid={this.props.userSignedIn} />
					<div id="page-content-wrapper" className="mbt-wrapper-option strength-session-body">
						<form action="" onSubmit={this.handleStrenghtSessionSubmit} method="post" id="savestrength-session" className="getform-mbt">
							<input type="hidden" name="action" value="add_strength_session" />
							<input type="hidden" name="cm_sess_id" value="" />
							<div className="container-fluid h100">

								<div className="row h100">
									<div className="col-lg-12-large h100">

										<div className="top-header-bar mrgn-btm0">

											<div className="dashboard -heading">
												<h3>
													<a href="#menu-toggle-left" className="menu-toggle-left" id="show-after-left-close">
														<span className="icon-bar"></span>
														<span className="icon-bar"></span>
														<span className="icon-bar"></span>
													</a>
													Building Strength Program</h3>
												<input type="submit" name="submit" value="Save Session" /></div>
											<a href="#menu-toggle-right" className="menu-toggle-right search-icon f-right" id="show-after-right-close">
												<i className="fa fa-search" aria-hidden="true"></i>
											</a>
										</div>
										<div className="strength-cotnainer clearfix">
											<div className="strength-sessn-indo">
												<h3 className="hdng-ssc">
													Strength Session Info</h3>

												<div className="sessn-fm">
													<div className="form-group">
														<label for="str_session_title">Session Title</label>
														<input type="text" name="str_session_title" onChange={this.handlestrengthSession} id="str_session_title" value={this.state.strengthSessionstate.str_session_title}  class="form-control" placeholder="Select Session Title..." />
													</div>
													<div class="form-group">
														<label for="str_session_keywords">Session Keywords (comma separated)</label>

														<input type="text" name="str_session_keywords" id="str_session_keywords" value="" className="form-control" placeholder="Type keywords" />
													</div>
												</div>

												<div class="radio-buttons form-group">
													<input id="str_session_flexibility" type="radio" name="str_session_type" value="flexibility" checked="checked" />
													<label for="str_session_flexibility">Flexibility</label>
													<input id="str_session_exercise" type="radio" name="str_session_type" value="exercise" />
													<label for="str_session_exercise">Exercise</label></div>

												<div className="form-group">
													<label for="str_session_activity_type">Activity Type:</label>
													<div className="input-cover">
														<select id="str_session_activity_type" className="styled-select select-widthimage" name="strength_activity_type" required="required">
															<option value="" id="disable-item">Please Select</option>
															{this.state.Activities.map(activities => (
																<option value={activities._id}>{activities.title}</option>

															))}
														</select>
													</div>
												</div>
												<div className="form-group minuts-select clearfix">
													<label for="str_session_hours">Total Time</label>
													<div className="input-cover" style={{ width: '100%', background: 'none' }}>
														<select id="str_session_hours" name="str_session_hours" className="styled-select" style={{ width: '47%' }}>
															<option value="" disabled="" selected="" >HH</option>
															{timeInterval}
														</select>
														<select id="str_session_minuts" name="str_session_minuts" className="styled-select" style={{ width: '47%', float: 'right' }}>
															<option value="" disabled="" selected="" >MM</option>
															{timeIntervalsec}
														</select>
													</div>
												</div>
												<div className="load-cntnr-wrap form-group clearfix">
													<label for="str_session_rating">Rating of Perceived Effort (RPE)</label>
													<div className="form-group-lmt">
														<div className="input-cover rpe-effort ">
															<input type="hidden" name="rpe_val" id="rpe_val" value="" />
															<select id="str_session_rating" className="styled-select form-control" name="str_session_rating" onChange={this.handleRpe}>
																<option value=""> Please Select</option>
																{this.state.rpe.map(rpe => (
																	<option value={rpe._id}>{rpe.name}</option>

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
													<label for="str_session_comment">Session Comment</label>
													<textarea name="str_session_comment" id="str_session_comment" className="form-control" value="" rows="4" cols="4" placeholder="Type Session Comment..." maxlength="200"></textarea>
												</div>
											</div>
											<div className="strenth-sessn-excerze">
												<h3 className="hdng-ssc">
													Strength Session Exercises</h3>
												<div className="scroll-panes">
													<ul id="activemodules" className="ui-sortable custom-list-options">
														<li className="droppable" onDragOver={(e) => this.onDragOver(e)} onDrop={(e) => this.onDrop(e, 'complete')}>
															 {tasks.complete}
														</li>
													</ul>
												</div>
											</div>
										</div>
									</div>

								</div>
							</div>
							{/* strength session sidebar  */}
							<div id="sidebar-wrapper-right" className="strength-session-sidebar">
								<div className="sidebar-container">
									<div className="head-section">
										<a href="#menu-toggle" className="menu-toggle-right" id="">
											<span className="icon-bar"></span>
											<span className="icon-bar"></span>
											<span className="icon-bar"></span>
										</a>
										<span className="search-labled">Find</span>
										<a href="javascript:;" className="refresh-icon" title="Refresh Programs and Sessions"> Reset</a>
									</div>
									<div className="cm-sidebar-contents">
										<div className="panel-group" id="cm-accordion" role="tablist" aria-multiselectable="true">
											<div className="panel panel-default current">
												<Form onSubmit={this.handleSubmit}>
													<Accordion>
														<Card>
															<Card.Header>
																<Accordion.Toggle as={Button} variant="link" eventKey="0">
																	Basic Search</Accordion.Toggle>
															</Card.Header>
															<Accordion.Collapse eventKey="0">
																<Card.Body>
																	<Form.Group controlId="addProgramAthleteLevel">
																		<Form.Check inline label="Flexibility" type={'radio'} id='flexibility_type' name='exercise_type' value='flexibility' onChange={this.handltype} />
																		<Form.Check inline label="Exercise" type={'radio'} id='exercise_type' name='exercise_type' value='exercise' onChange={this.handltype} />
																	</Form.Group>
																	<Form.Row>
																		<Form.Group controlId="formBasicEmail">
																			<Form.Control type="text" placeholder="By Title" name='ss_title' onChange={this.handltype} />
																		</Form.Group>
																	</Form.Row>
																	<Form.Row>
																		<Form.Group as={Col} controlId="program_phase">

																			<Form.Control as="select" onChange={this.handltype} >
																				<option value="">Strength to body</option>
																				{this.state.strengthBody.map(strengthBody => (
																					<option value={strengthBody._id}>{strengthBody.title}</option>
																				))}
																			</Form.Control>

																		</Form.Group>
																	</Form.Row>
																</Card.Body>
															</Accordion.Collapse>
														</Card>
														<Card>
															<Card.Header>
																<Accordion.Toggle as={Button} variant="link" eventKey="1">
																	Exercise Components </Accordion.Toggle>
															</Card.Header>
															<Accordion.Collapse eventKey="1">
																<Card.Body>
																	<Form.Group controlId="addProgramAthleteLevel">
																		<Form.Check inline label="And" type={'radio'} id='ex_and' onChange={this.handltype} name='ss_and' value='and' onChange={this.handltype} />
																		<Form.Check inline label="Or" type={'radio'} id='ex_or' onChange={this.handltype} name='ss_and' value='or' onChange={this.handltype} />
																	</Form.Group>
																</Card.Body>
															</Accordion.Collapse>
														</Card>
													</Accordion>
													<input type="submit" name="submit" value="Save Session" />
												</Form>

												<ul class="panel benefitList list-group">
													{this.state.ex_results.map(ex_result => (

														<li>
															{/* {ex_result.title}
																<Image src={ex_result.pic1} style={{ width: '5%' }} /> */}
															{tasks.wip}

														</li>

													))

													}


												</ul>

											</div>
										</div>
									</div>
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}
