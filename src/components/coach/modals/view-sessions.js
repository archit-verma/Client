import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hideViewSession, loadAddSessionData, showAddSession } from '../../../actions';
import Modal from 'react-bootstrap/Modal';
import * as API from '../../../utils/api.js'
import renderHTML from 'react-render-html';
class ViewSession extends Component {
	constructor(props) {
		super(props);
		this.state = {
			session: {
				_id: '',
				athleteLevel: '',
				distance: '',
				title: '',
				description: '',
				perceivedEfforts: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
				sessTime: '',
				activityType: '',
				distance: '',
				unit: '',
				hours: '',
				minutes: '',
				rpeLoad: '',
				keywords: [],
				programData: [],
				familyName: {},
				sessionImage: ''
			},
			success_m:'',
			alert_cls:'',
			loading: true
		}
		//this.uploadImageRef = React.createRef();
		this.handleClose = this.handleClose.bind(this);
	}
	componentDidMount() {
		var data = {};
		data['sessionId'] = this.props.sessionId;
		data['clubId'] = this.props.club._id;

		API.getSessionById(data).then(sessionData => {
			//console.log(data);
			//return false;
			this.setState({ session: { ...this.state.session, title: sessionData.session.title, description: sessionData.session.description, athleteLevel: sessionData.session.athleteLevel, hours: sessionData.session.hours, minutes: sessionData.session.minutes, sessTime: sessionData.session.sessTime, activityType: sessionData.session.activityType, unit: sessionData.session.unit, distance: sessionData.session.distance.$numberDecimal, rpeLoad: sessionData.session.rpeLoad, perceivedEfforts: sessionData.session.perceivedEfforts, keywords: sessionData.session.keywords, programData: sessionData.programs, familyName: sessionData.session.familyName, sessionImage: sessionData.session.image } });
		})
	}
	EditSession(e, id) {
		e.preventDefault();
		this.props.showAddSession(id);
	}
	removeSession = (sessionId) => {
		if (window.confirm('Are you sure you wish to delete this session?')) {
			var data = {};
			data['sessionId'] = this.props.sessionId;
			data['clubId'] = this.props.club._id;

			API.removeSessionById(data).then(sessionRes => {
				//console.log(sessionRes);
				if (sessionRes!='') {
					this.setState({
						success_m: 'Session deleted successfully.',
						alert_cls: 'alert-success'
					})

					setTimeout(() => {
						this.setState({
							success_m: '',
							alert_cls: '',
						});
						this.handleClose();
					}, 5000);
					//let errormessage=exerice.error;
				} else {
					this.setState({
						success_m: 'Something Went Wrong',
						alert_cls: 'alert-danger',
						loading: false
					})
				}
			})
		}
	}
	handleClose() {
		this.props.hideViewSession();
	}
	render() {
		if (this.state.loading) {
			let keywordsList = [];
			let programLists = [];
			for (let i = 0; i < this.state.session.keywords.length; i++) {
				keywordsList.push(<p>{this.state.session.keywords[i]}</p>);
			}
			for (let i = 0; i < this.state.session.programData.length; i++) {
				programLists.push(<li>{this.state.session.programData[i].title}</li>);
			}
			return (
				<Modal
					centered
					size="lg"
					show={true}
					onHide={this.handleClose}
					dialogClassName="modal-70w planner-dialog adsesn">
					<Modal.Header closeButton>
						<Modal.Title>Session Details</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div className='contin clearfix'>
							{this.state.success_m && <div className={this.state.alert_cls + " alert"}>{this.state.success_m}</div>}
							<div className='row'>
								<div className='col-md-8'>
									<div className="btn-group" role="group" aria-label="...">
										<button type="button" className={"btn btn-default elite " + (this.state.session.athleteLevel.indexOf('Elite') !== -1 ? 'active' : '')}>Elite</button>
										<button type="button" className={'btn btn-default advanced ' + (this.state.session.athleteLevel.indexOf('Advanced') !== -1 ? 'active' : '')}>Advanced</button>
										<button type="button" className={'btn btn-default intermediateadvanced ' + (this.state.session.athleteLevel.indexOf('Intermediate/Advanced') !== -1 ? 'active' : '')}>Int/Adv</button>
										<button type="button" className={'btn btn-default intermediate ' + (this.state.session.athleteLevel.indexOf('Intermediate') !== -1 ? 'active' : '')}>Intermediate</button>
										<button type="button" className={'btn btn-default lowintermediate ' + (this.state.session.athleteLevel.indexOf('Low/Intermediate') !== -1 ? 'active' : '')}>Low/Int</button>
										<button type="button" className={'btn btn-default novice ' + (this.state.session.athleteLevel.indexOf('Novice') !== -1 ? "active " : "")}>Novice</button>
									</div>
									<div className="media sec1">
										<div className="media-left">
											<a href="#">
												<img className="media-object max-width25" src={API.getServerUrl().apiURL+'/uploads/images/' + this.state.session.activityType.imgUrl} alt="" style={{width: '35px'}}></img>
											</a>
										</div>
										<div className="media-body">
											<h4 className="media-heading"><strong>{this.state.session.activityType.title}: </strong>{this.state.session.title}</h4>
											<p className="sts"><span className="distance">{this.state.session.distance}</span> <span className="unit">{this.state.session.unit}</span>    <span>|</span>   <span className="hour">{this.state.session.hours}</span> hour <span className="minutes">{this.state.session.minutes}</span> min    <span>|</span>    Load <span className="rpe_load">{this.state.session.rpeLoad}</span></p>
										</div>
									</div>
									<div className="sec2">
										<h4>Rating Perceived Effort (RPE)</h4>
										<div className="strip-clr clearfix">
											<div style={{ width: parseInt(100 * (this.state.session.perceivedEfforts[9] / this.state.session.sessTime)) + '%', background: '#000000' }} ><span className="maximal-time text-line">{this.state.session.perceivedEfforts[9]}</span><span>Maximal</span></div>
											<div style={{ width: parseInt(100 * (this.state.session.perceivedEfforts[8] / this.state.session.sessTime)) + '%', background: '#330066' }} ><span className="harder-time text-line">{this.state.session.perceivedEfforts[8]}</span><span>9/10</span></div>
											<div style={{ width: parseInt(100 * (this.state.session.perceivedEfforts[7] / this.state.session.sessTime)) + '%', background: '#663399' }} ><span className="very-hard-time text-line">{this.state.session.perceivedEfforts[7]}</span><span>8/10</span></div>
											<div style={{ width: parseInt(100 * (this.state.session.perceivedEfforts[6] / this.state.session.sessTime)) + '%', background: '#cc3333' }} ><span className="hard-time text-line">{this.state.session.perceivedEfforts[6]}</span><span>Very Hard</span></div>
											<div style={{ width: parseInt(100 * (this.state.session.perceivedEfforts[5] / this.state.session.sessTime)) + '%', background: '#ff3333' }} ><span className="somewaht-hard text-line">{this.state.session.perceivedEfforts[5]}</span><span>6/10</span></div>
											<div style={{ width: parseInt(100 * (this.state.session.perceivedEfforts[4] / this.state.session.sessTime)) + '%', background: '#ff6633' }} ><span className="moderate-time text-line">{this.state.session.perceivedEfforts[4]}</span><span>Hard</span></div>
											<div style={{ width: parseInt(100 * (this.state.session.perceivedEfforts[3] / this.state.session.sessTime)) + '%', background: '#ff9933' }} ><span className="easy-time text-line">{this.state.session.perceivedEfforts[3]}</span><span>Some What Hard</span></div>
											<div style={{ width: parseInt(100 * (this.state.session.perceivedEfforts[2] / this.state.session.sessTime)) + '%', background: '#ffff00' }} ><span className="easier-time text-line">{this.state.session.perceivedEfforts[2]}</span><span>Moderate</span></div>
											<div style={{ width: parseInt(100 * (this.state.session.perceivedEfforts[1] / this.state.session.sessTime)) + '%', background: '#00ff00' }} ><span className="very-easy-time text-line">{this.state.session.perceivedEfforts[1]}</span><span>Easy</span></div>
											<div style={{ width: parseInt(100 * (this.state.session.perceivedEfforts[0] / this.state.session.sessTime)) + '%', background: '#00ffff' }} ><span className="very-very-easy-time text-line">{this.state.session.perceivedEfforts[0]}</span><span>Very Very Easy</span></div>
										</div>
									</div>
									<div className="sec3">
										<h4>Keywords</h4>
										<p className="keywords-sec">
											{keywordsList}
										</p>
									</div>
									<div className="sec4">
										<h4>Description</h4>
										{renderHTML(this.state.session.description)}
									</div>
									<div class="sec4" style={{display: 'none'}}>
										<h4>Videos</h4>
										<p class="videos-sec"></p>
									</div>
								</div>
								<div className="col-md-4">
									<div className="edtabl">
										<a href="javascript:;" onClick={() => this.removeSession(this.props.sessionId)} id="delete-session">Delete Session</a>&nbsp; &nbsp; |  &nbsp; &nbsp;<a href="" onClick={(e) => this.EditSession(e, this.props.sessionId)} >Edit Session</a>
									</div>
									<div className="xtrinf">
										<h4>Family Name Association</h4>
										<div className="family-name-association">{this.state.session.familyName === undefined ? 'None' : this.state.session.familyName.name}</div>
										<br />
										<h4>Session Associations</h4>
										<ol className="sess-assoc">
											{programLists}
										</ol>
									</div>
									<div id="session-view-image" style={{display: this.state.session.sessionImage === undefined || this.state.session.sessionImage === "" ? 'none' : ''}}><img src={this.state.session.sessionImage === undefined || this.state.session.sessionImage === "" ? '' : API.getServerUrl().apiURL+'/uploads/session/'+this.state.session.sessionImage} style={{width: '100%', marginTop: '10px'}} /></div>
								</div>
							</div>
						</div>
					</Modal.Body>
				</Modal>
			);
		}
	}
}
const mapStateToProps = state => {
	return {
		//user: state.auth.user,
		//addSession: state.planner.modals.addSession,
		sessionId: state.planner.modalsParams.id
	};
};

export default connect(mapStateToProps, { hideViewSession, showAddSession })(ViewSession);