import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import {Tabs, Tab, Modal, Row, Button, Col, Form, Card, Container} from "react-bootstrap";
import {getServerUrl, groupUpload, groupAdd, loadUserGroups, getGroups, groupAddMember, memberRemoveGroup, groupRemoveRequest} from '../utils/api.js';
import LeftSideBar from '../components/LeftSideBar';
import loading from "../assets/loading.svg";

class Groups extends Component {
	constructor(props) {
		super(props);
		
		this.state = {
			group: {
				title: '',
				description: '',
				address: '',
				addressCity: '',
				addressCountry: '',
				interest: 'Running',
				logo: '',
				coverPhoto: ''
			},
			groups: [],
			myGroups: [],
			joinedGroups: [],
			userGroups: this.props.user.groups,
			userGroupRequests: this.props.user.groupRequests,
			loading: true
		}
		
		this.uploadLogoRef = React.createRef();
		this.uploadCoverPhotoRef = React.createRef();
		
		this.handleTitle = this.handleTitle.bind(this);
		this.handleDescription = this.handleDescription.bind(this);
		this.handleAddress = this.handleAddress.bind(this);
		this.handleAddressCity = this.handleAddressCity.bind(this);
		this.handleAddressCountry = this.handleAddressCountry.bind(this);
		this.handleInterest = this.handleInterest.bind(this);
	}
	
	componentDidMount() {
		loadUserGroups(this.props.user._id)
			.then(resp => {
				if(resp.success == true)
					this.setState({myGroups: resp.myGroups, joinedGroups: resp.joinedGroups, loading: false});
				else
					this.setState({loading: false});
			});
	}
	
	tabChanged = (key) => {
		if(key === 'Explore'){
			getGroups(this.props.user._id)
				.then(resp => {
					if(resp.success == true)
						this.setState({groups: resp.groups, userGroups: resp.userGroups, userGroupRequests: resp.userGroupRequests, loading: false});
					else
						this.setState({loading: false});
				});
			this.setState({loading: true});
		}
		else if(key === 'Groups'){
			loadUserGroups(this.props.user._id)
				.then(resp => {
					if(resp.success == true)
						this.setState({myGroups: resp.myGroups, joinedGroups: resp.joinedGroups, loading: false});
					else
						this.setState({loading: false});
				});
		}
	}
	
	handleTitle = (e) => {
		this.setState({group: { ...this.state.group, title: e.target.value} });
	}
	
	handleDescription = (e) => {
		this.setState({group: { ...this.state.group, description: e.target.value} });
	}
	
	handleAddress = (e) => {
		this.setState({group: { ...this.state.group, address: e.target.value} });
	}
	
	handleAddressCity = (e) => {
		this.setState({group: { ...this.state.group, addressCity: e.target.value} });
	}
	
	handleAddressCountry = (e) => {
		this.setState({group: { ...this.state.group, addressCountry: e.target.value} });
	}
	
	handleInterest = (e) => {
		this.setState({group: { ...this.state.group, interest: e.target.value} });
	}
	
	openUploadLogo = () => {
		this.uploadLogoRef.current.click();
	}
	
	openUploadCoverPhoto = () => {
		this.uploadCoverPhotoRef.current.click();
	}
	
	uploadLogo = (e) => {
		let groupLogo = this.uploadLogoRef.current.files[0];
		let fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
		
		if(groupLogo === undefined){
			alert('Please select image file to upload');
		}
		else if(fileTypes.indexOf(groupLogo.type) === -1){
			alert('Please select file type of JPEG, JPG, PNG or GIF');
		}
		else{
			const Imagedata = new FormData();
			Imagedata.append('groupUpload', groupLogo);
			groupUpload(Imagedata)
				.then(imgUpload => {
					this.setState({loading: false, group: { ...this.state.group, logo: imgUpload.filename } });
				});
			this.setState({loading: true});
		}
	}
	
	uploadCoverPhoto = (e) => {
		let groupCoverPhoto = this.uploadCoverPhotoRef.current.files[0];
		let fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
		
		if(groupCoverPhoto === undefined){
			alert('Please select image file to upload');
		}
		else if(fileTypes.indexOf(groupCoverPhoto.type) === -1){
			alert('Please select file type of JPEG, JPG, PNG or GIF');
		}
		else{
			const Imagedata = new FormData();
			Imagedata.append('groupUpload', groupCoverPhoto);
			groupUpload(Imagedata)
				.then(imgUpload => {
					this.setState({loading: false, group: { ...this.state.group, coverPhoto: imgUpload.filename } });
				});
			this.setState({loading: true});
		}
	}
	
	addGroup = () => {
		if(this.state.group.title === ''){
			alert('Enter group title');
			return;
		}
		else if(this.state.group.description === ''){
			alert('Enter group description');
			return;
		}
		else if(this.state.group.address === ''){
			alert('Enter group address');
			return;
		}
		else if(this.state.group.addressCity === ''){
			alert('Enter group city');
			return;
		}
		else if(this.state.group.addressCountry === ''){
			alert('Select group country');
			return;
		}
		else if(this.state.group.interest === ''){
			alert('Select group interest');
			return;
		}
		else if(this.state.group.logo === ''){
			alert('Upload group logo');
			return;
		}
		else if(this.state.group.coverPhoto === ''){
			alert('Upload group cover photo');
			return;
		}
		else{
			let group = this.state.group;
			let slugify = require('slugify');
			group.slug = slugify(group.title, { replacement: '-', remove: null, lower: true });
			group.creatorId = this.props.user._id;
			groupAdd(group)
				.then(resp => {
					if(resp.success == false){
						alert(resp.msg);
					}
					else{
						alert(resp.msg);
						this.setState({loading: false,
							myGroups: resp.myGroups,
							group: {
								title: '',
								description: '',
								address: '',
								addressCity: '',
								addressCountry: '',
								interest: '',
								logo: '',
								coverPhoto: ''
							}
						});
					}
				});
			this.setState({loading: true});
		}
	}
	
	joinGroup = (e, groupId, groupType) => {
		e.preventDefault();
		groupAddMember(groupId, this.props.user._id, groupType)
			.then(resp => {
				alert(resp.msg);
				if(resp.success == true)
					this.setState({groups: resp.groups, joinedGroups: resp.joinedGroups, userGroups: resp.userGroups, userGroupRequests: resp.userGroupRequests, loading: false});
				else
					this.setState({loading: false});
			});
		this.setState({loading: true});
	}
	
	leaveGroup = (e, groupId) => {
		e.preventDefault();
		memberRemoveGroup(groupId, this.props.user._id)
			.then(resp => {
				alert(resp.msg);
				if(resp.success == true)
					this.setState({groups: resp.groups, joinedGroups: resp.joinedGroups, userGroups: resp.userGroups, userGroupRequests: resp.userGroupRequests, loading: false});
				else
					this.setState({loading: false});
			});
		this.setState({loading: true});
	}
	
	removeGroupRequest = (e, groupId) => {
		e.preventDefault();
		groupRemoveRequest(groupId, this.props.user._id)
			.then(resp => {
				alert(resp.msg);
				if(resp.success == true)
					this.setState({groups: resp.groups, joinedGroups: resp.joinedGroups, userGroups: resp.userGroups, userGroupRequests: resp.userGroupRequests, loading: false});
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
									<h6>Groups</h6>
								</div> : null
					}
					{is_mobile ? null : <div className='col-3'>
							<LeftSideBar />
						</div>
					}

					<div className={is_mobile ? '' : 'col-9'}>
						<Tabs fill defaultActiveKey="Groups" id="uncontrolled-tab-example" onSelect={(k) => this.tabChanged(k)}>
							<Tab eventKey="Explore" title="Explore">
								<div className={is_mobile ? 'main-container' : 'secteams'}>
									<h3>Explore Groups</h3>
									<div className={is_mobile ? '' : 'row'}>
										{this.state.groups.map(group => (
											<div key={"groups-"+group._id} className={is_mobile ? 'club-box' : 'col-lg-6 col-md-12 clubbxsrch'}>
												<div className={is_mobile ? '' : 'bxshadow teambxim'}>
													<div className='row'>
														<div className={is_mobile ? 'col-2' : 'col-4'}><Link to={"/group/"+group.slug}><img src={group.logo ? getServerUrl().apiURL+'/uploads/group/'+group.logo : '/uploads/images/group_default.png'} /></Link></div>
														{is_mobile ? <div className='col-7'><h5 style={{display: 'block', width: '100%'}}><Link to={"/group/"+group.slug}>{group.title}</Link></h5><small>{group.membersCount} members</small></div> : 
															<div className="col-8 pl-0"><Link to={"/group/"+group.slug}>{group.title}</Link><span className="small pstim">{group.membersCount} members</span><p><span>
																{!this.state.userGroups.includes(group._id) && !this.state.userGroupRequests.includes(group._id) && <a className='f14 btn' href='' onClick={(e) => this.joinGroup(e, group._id, group.type)}>Join</a>}
																{this.state.userGroups.includes(group._id) && <a className='f14 btn' href='' onClick={(e) => this.leaveGroup(e, group._id)}>Leave</a>}
																{this.state.userGroupRequests.includes(group._id) && <a className='f14 btn' href='' onClick={(e) => this.removeGroupRequest(e, group._id)}>Remove Request</a>}
															</span></p></div>
														}
														{is_mobile ? <div className='col-3'>
															{!this.state.userGroups.includes(group._id) && !this.state.userGroupRequests.includes(group._id) && <a className='btn' href='' onClick={(e) => this.joinGroup(e, group._id, group.type)}>Join</a>}
															{this.state.userGroups.includes(group._id) && <a className='btn' href='' onClick={(e) => this.leaveGroup(e, group._id)}>Leave</a>}
															{this.state.userGroupRequests.includes(group._id) && <a className='btn' href='' onClick={(e) => this.removeGroupRequest(e, group._id)}>Remove Request</a>}
														</div> : null}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</Tab>
							<Tab eventKey="Groups" title="Groups">
								<div className={is_mobile ? 'main-container' : 'secteams'}>
									<h3>Your Groups</h3>
									<div className={is_mobile ? '' : 'row'}>
										{this.state.myGroups.map(group => (
											<div key={"my-groups-"+group._id} className={is_mobile ? 'club-box' : 'col-lg-6 col-md-12 clubbxsrch'}>
												<div className={is_mobile ? '' : 'bxshadow teambxim'}>
													<div className='row'>
														<div className={is_mobile ? 'col-2' : 'col-4'}><Link to={"/group/"+group.slug}><img src={group.logo ? getServerUrl().apiURL+'/uploads/group/'+group.logo : '/uploads/images/group_default.png'} /></Link></div>
														{is_mobile ? <div className='col-7'><h5 style={{display: 'block', width: '100%'}}><Link to={"/group/"+group.slug}>{group.title}</Link></h5><small>{group.membersCount} members</small></div> : 
															<div className="col-8 pl-0"><Link to={"/group/"+group.slug}>{group.title}</Link><span className="small pstim">{group.membersCount} members</span><p><span><Link to={"/group/"+group.slug+'/admin'} className='f14 btn'>Admin</Link></span></p></div>
														}
														{is_mobile ? <div className='col-3'><Link to={"/group/"+group.slug+'/admin'} className='btn'>Admin</Link></div> : null}
													</div>
												</div>
											</div>
										))}
									</div>
									
									<h3>Groups You Have Joined</h3>
									<div className={is_mobile ? '' : 'row'}>
										{this.state.joinedGroups.map(group => (
											<div key={"my-groups-"+group._id} className={is_mobile ? 'club-box' : 'col-lg-6 col-md-12 clubbxsrch'}>
												<div className={is_mobile ? '' : 'bxshadow teambxim'}>
													<div className='row'>
														<div className={is_mobile ? 'col-2' : 'col-4'}><Link to={"/group/"+group.slug}><img src={group.logo ? getServerUrl().apiURL+'/uploads/group/'+group.logo : '/uploads/images/group_default.png'} /></Link></div>
														{is_mobile ? <div className='col-7'><h5 style={{display: 'block', width: '100%'}}><Link to={"/group/"+group.slug}>{group.title}</Link></h5><small>{group.membersCount} members</small></div> : 
															<div className="col-8 pl-0"><Link to={"/group/"+group.slug}>{group.title}</Link><span className="small pstim">{group.membersCount} members</span><p><span><a className='f14 btn' href='' onClick={(e) => this.leaveGroup(e, group._id)}>Leave</a></span></p></div>
														}
														{is_mobile ? <div className='col-3'><a className='btn' href='' onClick={(e) => this.leaveGroup(e, group._id)}>Leave</a></div> : null}
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							</Tab>
							<Tab eventKey="Create New" title="Create New">
								<div className='main-container createnew'>
									<h3>Create Group</h3>
									<div className='userthumb'>
										<span className='userbx'><img src={this.props.user.profilePicture ? getServerUrl().apiURL+'/uploads/user/'+this.props.user.profilePicture : '/uploads/images/profile_default.png'} /></span>
										<span>{this.props.user.firstName+' '+this.props.user.lastName}</span>
									</div>
									<form>
										<Form.Group controlId="formGroupTitle">
											<Form.Label>Title</Form.Label>
											<Form.Control type="text" name="title" placeholder="" value={this.state.group.title} onChange={this.handleTitle} />
										</Form.Group>
										
										<Form.Group controlId="formGroupDescription">
											<Form.Label>Description</Form.Label>
											<Form.Control as="textarea" rows={3} value={this.state.group.description} onChange={this.handleDescription} />
										</Form.Group>
										
										<Form.Group controlId="formGroupLocation">
											<Form.Label>Location</Form.Label>
											<Form.Control type="text" placeholder="Address" onChange={this.handleAddress} value={this.state.group.address} />
											<Form.Control type="text" placeholder="City" onChange={this.handleAddressCity} value={this.state.group.addressCity} />
											<Form.Control as="select" onChange={this.handleAddressCountry} value={this.state.group.addressCountry}>
												<option value="">Country</option>
												<option value="Australia">Australia</option>
												<option value="Pakistan">Pakistan</option>
											</Form.Control>
										</Form.Group>
										
										<Form.Group controlId="formGroupInterest">
											<Form.Label>Interest</Form.Label>
											<Form.Control as="select" onChange={this.handleInterest} value={this.state.group.interest}>
												<option value="Running">Running</option>
												<option value="Walking">Walking</option>
												<option value="Football">Football</option>
												<option value="Badminton">Badminton</option>
												<option value="Cycling">Cycling</option>
												<option value="Gym">Gym</option>
												<option value="Swimming">Swimming</option>
												<option value="Tennis">Tennis</option>
												<option value="Yoga">Yoga</option>
											</Form.Control>
										</Form.Group>
										
										<Form.Group>
											<a className='button' onClick={() => this.openUploadLogo()}>Upload Logo</a>
											<input type="file" ref={this.uploadLogoRef} onChange={() => this.uploadLogo()} style={{display: 'none'}} />
											<a className='button' onClick={() => this.openUploadCoverPhoto()}>Upload Cover Photo</a>
											<input type="file" ref={this.uploadCoverPhotoRef} onChange={() => this.uploadCoverPhoto()} style={{display: 'none'}} />
										</Form.Group>
										
										<Form.Group> 
											<a className='button subbtn' onClick={() => this.addGroup()}>Create Group</a>
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

export default connect(mapStateToProps, {})(Groups);