import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Tabs, Tab, Form} from "react-bootstrap";
import {getServerUrl, teamUpload, teamAdd, loadUserTeams, getTeams, teamAddMember, memberRemoveTeam, teamRemoveRequest} from '../utils/api.js';
import LeftSideBar from '../components/LeftSideBar';
import GoogleLocationSearch from "../components/GoogleLocationSearch";
import loading from "../assets/loading.svg";

class Teams extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			team: {
				title: '',
				description: '',
				address: '',
				lat: 0,
				lng: 0,
				activityType: 'Running',
				logo: '',
				coverPhoto: '',
				documents: []
			},
			teams: [],
			myTeams: [],
			joinedTeams: [],
			userTeams: this.props.user.teams,
			userTeamRequests: this.props.user.teamRequests,
			loading: true
		}
		
		this.uploadLogoRef = React.createRef();
		this.uploadCoverPhotoRef = React.createRef();
		this.uploadDocumentsRef = React.createRef();
		
		this.handleTitle = this.handleTitle.bind(this);
		this.handleDescription = this.handleDescription.bind(this);
		this.handleAddress = this.handleAddress.bind(this);
		this.handleActivityType = this.handleActivityType.bind(this);
	}
	
	componentDidMount() {
		loadUserTeams(this.props.user._id)
			.then(resp => {
				if(resp.success == true)
					this.setState({myTeams: resp.myTeams, joinedTeams: resp.joinedTeams, loading: false});
				else
					this.setState({loading: false});
			});
	}
	
	tabChanged = (key) => {
		if(key === 'Explore'){
			getTeams(this.props.user._id)
				.then(resp => {
					if(resp.success == true)
						this.setState({teams: resp.teams, userTeams: resp.userTeams, userTeamRequests: resp.userTeamRequests, loading: false});
					else
						this.setState({loading: false});
				});
			this.setState({loading: true});
		}
		else if(key === 'Teams'){
			loadUserTeams(this.props.user._id)
				.then(resp => {
					if(resp.success == true)
						this.setState({myTeams: resp.myTeams, joinedTeams: resp.joinedTeams, loading: false});
					else
						this.setState({loading: false});
				});
		}
	}
	
	handleTitle = (e) => {
		this.setState({team: { ...this.state.team, title: e.target.value} });
	}
	
	handleDescription = (e) => {
		this.setState({team: { ...this.state.team, description: e.target.value} });
	}
	
	handleAddress = (e) => {
		this.setState({team: { ...this.state.team, address: e.target.value} });
	}
	
	handleGoogleAddress = (address, lat, lng) => {
		this.setState({team: { ...this.state.team, address, lat, lng} });
	}
	
	handleActivityType = (e) => {
		this.setState({team: { ...this.state.team, activityType: e.target.value} });
	}
	
	openUploadLogo = () => {
		this.uploadLogoRef.current.click();
	}
	
	openUploadCoverPhoto = () => {
		this.uploadCoverPhotoRef.current.click();
	}
	
	openUploadDocuments = () => {
		this.uploadDocumentsRef.current.click();
	}
	
	uploadLogo = (e) => {
		let teamLogo = this.uploadLogoRef.current.files[0];
		let fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
		
		if(teamLogo === undefined){
			alert('Please select image file to upload');
		}
		else if(fileTypes.indexOf(teamLogo.type) === -1){
			alert('Please select file type of JPEG, JPG, PNG or GIF');
		}
		else{
			const Imagedata = new FormData();
			Imagedata.append('teamUpload', teamLogo);
			teamUpload(Imagedata)
				.then(imgUpload => {
					this.setState({loading: false, team: { ...this.state.team, logo: imgUpload.filename } });
				});
			this.setState({loading: true});
		}
	}
	
	uploadCoverPhoto = (e) => {
		let teamCoverPhoto = this.uploadCoverPhotoRef.current.files[0];
		let fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
		
		if(teamCoverPhoto === undefined){
			alert('Please select image file to upload');
		}
		else if(fileTypes.indexOf(teamCoverPhoto.type) === -1){
			alert('Please select file type of JPEG, JPG, PNG or GIF');
		}
		else{
			const Imagedata = new FormData();
			Imagedata.append('teamUpload', teamCoverPhoto);
			teamUpload(Imagedata)
				.then(imgUpload => {
					this.setState({loading: false, team: { ...this.state.team, coverPhoto: imgUpload.filename } });
				});
			this.setState({loading: true});
		}
	}
	
	uploadDocuments = (e) => {
		let teamDocuments = this.uploadDocumentsRef.current.files[0];
		let fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
		
		if(teamDocuments === undefined){
			alert('Please select image file to upload');
		}
		else if(fileTypes.indexOf(teamDocuments.type) === -1){
			alert('Please select file type of JPEG, JPG, PNG or GIF');
		}
		else{
			const Imagedata = new FormData();
			Imagedata.append('teamUpload', teamDocuments);
			teamUpload(Imagedata)
				.then(imgUpload => {
					let documents = this.state.team.documents;
					documents.push(imgUpload.filename);
					this.setState({loading: false, team: { ...this.state.team, documents } });
				});
			this.setState({loading: true});
		}
	}
	
	addTeam = () => {
		if(this.state.team.title === ''){
			alert('Enter team title');
			return;
		}
		else if(this.state.team.description === ''){
			alert('Enter team description');
			return;
		}
		else if(this.state.team.address === ''){
			alert('Enter team location');
			return;
		}
		else if(this.state.team.logo === ''){
			alert('Upload team logo');
			return;
		}
		else if(this.state.team.coverPhoto === ''){
			alert('Upload team cover photo');
			return;
		}
		else if(this.state.team.documents.length === 0){
			alert('Upload team documents');
			return;
		}
		else{
			let team = this.state.team;
			let slugify = require('slugify');
			team.slug = slugify(team.title, { replacement: '-', remove: null, lower: true });
			team.creatorId = this.props.user._id;
			teamAdd(team)
				.then(resp => {
					if(resp.success == false){
						alert(resp.msg);
					}
					else{
						alert(resp.msg);
						this.setState({loading: false,
							myTeams: resp.myTeams,
							team: {
								title: '',
								description: '',
								address: '',
								lat: 0,
								lng: 0,
								activityType: 'Running',
								logo: '',
								coverPhoto: '',
								documents: []
							}
						});
					}
				});
			this.setState({loading: true});
		}
	}
	
	joinTeam = (e, teamId, teamType) => {
		e.preventDefault();
		teamAddMember(teamId, this.props.user._id, teamType)
			.then(resp => {
				alert(resp.msg);
				if(resp.success == true)
					this.setState({teams: resp.teams, joinedTeams: resp.joinedTeams, userTeams: resp.userTeams, userTeamRequests: resp.userTeamRequests, loading: false});
				else
					this.setState({loading: false});
			});
		this.setState({loading: true});
	}
	
	leaveTeam = (e, teamId) => {
		e.preventDefault();
		memberRemoveTeam(teamId, this.props.user._id)
			.then(resp => {
				alert(resp.msg);
				if(resp.success == true)
					this.setState({teams: resp.teams, joinedTeams: resp.joinedTeams, userTeams: resp.userTeams, userTeamRequests: resp.userTeamRequests, loading: false});
				else
					this.setState({loading: false});
			});
		this.setState({loading: true});
	}
	
	removeTeamRequest = (e, teamId) => {
		e.preventDefault();
		teamRemoveRequest(teamId, this.props.user._id)
			.then(resp => {
				alert(resp.msg);
				if(resp.success == true)
					this.setState({teams: resp.teams, joinedTeams: resp.joinedTeams, userTeams: resp.userTeams, userTeamRequests: resp.userTeamRequests, loading: false});
				else
					this.setState({loading: false});
			});
		this.setState({loading: true});
	}
	
	render() {
		let loadingHtml = null;
		if (this.state.loading) {
			loadingHtml = <div className='profile-container-loading' style={{position: 'absolute', height: '100%', backgroundColor: 'lightgray', opacity: '0.8'}}>
							<img src={loading} alt="" />
						</div>
		}
		let is_mobile = window.matchMedia('(max-width: 500px)').matches;
		
		return (
			<div className={is_mobile ? 'outbx' : 'container cntntbx'}>
				{loadingHtml}
				<div className={is_mobile ? '' : 'row'}>
					{is_mobile ? <div className='teams-container'>
									<a href='/home/' className='backbtn'> </a>
									<h6>Teams</h6>
								</div> : null
					}
					{is_mobile ? null : <div className='col-3'><LeftSideBar /></div>}
					
					<div className={is_mobile ? '' : 'col-9'}>
						<Tabs fill defaultActiveKey="Teams" id="uncontrolled-tab-example" onSelect={(k) => this.tabChanged(k)}>
							<Tab eventKey="Explore" title="Explore">
								<div className={is_mobile ? 'main-container' : 'secteams'}>
									<h3>Explore Teams</h3>
									<div className={is_mobile ? '' : 'row'}>
										{this.state.teams.map(team => (
											<div key={"teams-"+team._id} className={is_mobile ? 'club-box' : 'col-lg-6 col-md-12 clubbxsrch'}>
												<div className={is_mobile ? '' : 'bxshadow teambxim'}>
													<div className='row'>
														<div className={is_mobile ? 'col-2' : 'col-4'}><Link to={"/team/"+team.slug}><img src={team.logo ? getServerUrl().apiURL+'/uploads/team/'+team.logo : '/uploads/images/team_default.png'} /></Link></div>
														{is_mobile ? <div className='col-7'><h5 style={{display: 'block', width: '100%'}}><Link to={"/team/"+team.slug}>{team.title}</Link></h5><small>{team.membersCount} members</small></div> : 
															<div className="col-8 pl-0"><Link to={"/team/"+team.slug}>{team.title}</Link><span className="small pstim">{team.membersCount} members</span><p><span>
																{!this.state.userTeams.includes(team._id) && !this.state.userTeamRequests.includes(team._id) && <a className='f14 btn' href='' onClick={(e) => this.joinTeam(e, team._id, team.type)}>Join</a>}
																{this.state.userTeams.includes(team._id) && <a className='f14 btn' href='' onClick={(e) => this.leaveTeam(e, team._id)}>Leave</a>}
																{this.state.userTeamRequests.includes(team._id) && <a className='f14 btn' href='' onClick={(e) => this.removeTeamRequest(e, team._id)}>Remove Request</a>}
															</span></p></div>
														}
														{is_mobile ? <div className='col-3'>
															{!this.state.userTeams.includes(team._id) && !this.state.userTeamRequests.includes(team._id) && <a className='btn' href='' onClick={(e) => this.joinTeam(e, team._id, team.type)}>Join</a>}
															{this.state.userTeams.includes(team._id) && <a className='btn' href='' onClick={(e) => this.leaveTeam(e, team._id)}>Leave</a>}
															{this.state.userTeamRequests.includes(team._id) && <a className='btn' href='' onClick={(e) => this.removeTeamRequest(e, team._id)}>Remove Request</a>}
														</div> : null}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</Tab>
							<Tab eventKey="Teams" title="Teams">
								<div className={is_mobile ? 'main-container' : 'secteams'}>
									<h3>Your Teams</h3>
									<div className={is_mobile ? '' : 'row'}>
										{this.state.myTeams.map(team => (
											<div key={"my-teams-"+team._id} className={is_mobile ? 'club-box' : 'col-lg-6 col-md-12 clubbxsrch'}>
												<div className={is_mobile ? '' : 'bxshadow teambxim'}>
													<div className='row'>
														<div className={is_mobile ? 'col-2' : 'col-4'}><Link to={"/team/"+team.slug}><img src={team.logo ? getServerUrl().apiURL+'/uploads/team/'+team.logo : '/uploads/images/team_default.png'} /></Link></div>
														{is_mobile ? <div className='col-7'><h5 style={{display: 'block', width: '100%'}}><Link to={"/team/"+team.slug}>{team.title}</Link></h5><small>{team.membersCount} members</small></div> : 
															<div className="col-8 pl-0"><Link to={"/team/"+team.slug}>{team.title}</Link><span className="small pstim">{team.membersCount} members</span><p><span><Link to={"/team/"+team.slug+'/admin'} className='f14 btn'>Admin</Link></span></p></div>
														}
														{is_mobile ? <div className='col-3'><Link to={"/team/"+team.slug+'/admin'} className='btn'>Admin</Link></div> : null}
													</div>
												</div>
											</div>
										))}
									</div>
									
									<h3>Teams You Have Joined</h3>
									<div className={is_mobile ? '' : 'row'}>
										{this.state.joinedTeams.map(team => (
											<div key={"my-teams-"+team._id} className={is_mobile ? 'club-box' : 'col-lg-6 col-md-12 clubbxsrch'}>
												<div className={is_mobile ? '' : 'bxshadow teambxim'}>
													<div className='row'>
														<div className={is_mobile ? 'col-2' : 'col-4'}><Link to={"/team/"+team.slug}><img src={team.logo ? getServerUrl().apiURL+'/uploads/team/'+team.logo : '/uploads/images/team_default.png'} /></Link></div>
														{is_mobile ? <div className='col-7'><h5 style={{display: 'block', width: '100%'}}><Link to={"/team/"+team.slug}>{team.title}</Link></h5><small>{team.membersCount} members</small></div> : 
															<div className="col-8 pl-0"><Link to={"/team/"+team.slug}>{team.title}</Link><span className="small pstim">{team.membersCount} members</span><p><span><a className='f14 btn' href='' onClick={(e) => this.leaveTeam(e, team._id)}>Leave</a></span></p></div>
														}
														{is_mobile ? <div className='col-3'><a className='btn' href='' onClick={(e) => this.leaveTeam(e, team._id)}>Leave</a></div> : null}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</Tab>
							
							<Tab eventKey="Create New" title="Create New">
								<div className='main-container createnew'>
									<h3>Create Team</h3>
									<div className='userthumb'>
										<span className='userbx'><img src={this.props.user.profilePicture ? getServerUrl().apiURL+'/uploads/user/'+this.props.user.profilePicture : '/uploads/images/profile_default.png'} /></span>
										<span>{this.props.user.firstName+' '+this.props.user.lastName}</span>
									</div>
									<form>
										<Form.Group controlId="formTeamTitle">
											<Form.Label>Title</Form.Label>
											<Form.Control type="text" name="title" placeholder="" value={this.state.team.title} onChange={this.handleTitle} />
										</Form.Group>
										
										<Form.Group controlId="formTeamDescription">
											<Form.Label>Description</Form.Label>
											<Form.Control as="textarea" rows={3} value={this.state.team.description} onChange={this.handleDescription} />
										</Form.Group>
										
										<Form.Group controlId="formTeamAddress">
											<Form.Label>Location</Form.Label>
											<GoogleLocationSearch handleGoogleAddress={this.handleGoogleAddress} />
											{/*<Form.Control type="text" placeholder="Address" onChange={this.handleAddress} value={this.state.team.address} />
											<Form.Control type="text" placeholder="City" onChange={this.handleAddressCity} value={this.state.team.addressCity} />
											<Form.Control as="select" onChange={this.handleAddressCountry} value={this.state.team.addressCountry}>
												<option value="">Country</option>
												<option value="Australia">Australia</option>
												<option value="Pakistan">Pakistan</option>
											</Form.Control>
											*/}
										</Form.Group>
										
										<Form.Group controlId="formTeamActivityType">
											<Form.Label>Activity Type</Form.Label>
											<Form.Control as="select" onChange={this.handleActivityType} value={this.state.team.activityType}>
												<option value="Running">Running</option>
												<option value="Weight Lifting">Weight Lifting</option>
												<option value="Swimming">Swimming</option>
											</Form.Control>
										</Form.Group>
										
										<Form.Group>
											<a className='button' onClick={() => this.openUploadLogo()}>Upload Logo</a>
											<input type="file" ref={this.uploadLogoRef} onChange={() => this.uploadLogo()} style={{display: 'none'}} />
											<a className='button' onClick={() => this.openUploadCoverPhoto()}>Upload Cover Photo</a>
											<input type="file" ref={this.uploadCoverPhotoRef} onChange={() => this.uploadCoverPhoto()} style={{display: 'none'}} />
											<a className='button' onClick={() => this.openUploadDocuments()}>Upload Documents</a>
											<input type="file" ref={this.uploadDocumentsRef} onChange={() => this.uploadDocuments()} style={{display: 'none'}} />
										</Form.Group>
										
										<Form.Group> 
											<a className='button subbtn' onClick={() => this.addTeam()}>Create Team</a>
										</Form.Group>
									</form>
								</div>
							</Tab>
						</Tabs>
					</div>
				</div>
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		user: state.auth.user
	};
};

export default connect(mapStateToProps, {})(Teams);