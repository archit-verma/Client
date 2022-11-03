import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';
import Dropdown from 'react-bootstrap/Dropdown';
import loading from "../../../assets/loading.svg";
import {getServerUrl, membershipUpload, teamMembershipAdd, loadTeamMemberships, getTeamMembership, teamMembershipUpdate, membershipUpdateUpgradePaths, mobileQuery} from '../../../utils/api';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import LeftSideBarTeam from '../../LeftSideBarTeam';

class TeamMembershipsAdmin extends Component {
	constructor(props) {
        super(props);
		
		this.state = {
			membership: {title: '', description: '', isPublic: 'yes', type: 'free', paymentType: 'permanent', intervalType: 'days', interval: 1, startDate: '', endDate: '', totalPayments: 0, trial: false, trialType: 'days', trialPeriod: 1, price: 0, discountPrice: 0, logo: '', coverPhoto: '', subscribeWithoutMembership: true, updateDenied: [], updateReplace: [], coaches: []},
			screenType: 'memberships',
			logo: '',
			coverPhoto: '',
			memberships: [],
			coaches: [],
			loading: true,
			isAdmin: false,
            isAdminOrJoined: false,
		}
		
		this.uploadMembershipLogoRef = React.createRef();
	}
	
	componentDidMount() {
		loadTeamMemberships(this.props.team._id, this.props.team.coaches, this.props.user._id)
			.then(resp => {
				if(resp.success == true)
					this.setState({memberships: resp.memberships, coaches: resp.coaches, loading: false, isAdminOrJoined: resp.isAdminOrJoined});
				else
					this.setState({loading: false});
			});
	}
	
	changeScreen = (e, screenType, id) => {
		e.preventDefault();
		if(screenType === 'edit-membership'){
			getTeamMembership(id)
				.then(resp => {
					if(resp.success === true){
						let membership = resp.membership;
						membership.price = membership.price.$numberDecimal;
						membership.discountPrice = membership.discountPrice.$numberDecimal;
						
						this.setState({screenType, membership});
					}
					else if(resp.success ===  false)
						alert(resp.msg)
				});
		}
		else if(screenType === 'upgrade-paths'){
			this.setState({screenType});
		}
		else if(screenType === 'create-membership'){
			this.setState({
							screenType,
							loading: false,
							membership: {
								title: '',
								description: '',
								isPublic: 'yes',
								type: 'free',
								paymentType: 'permanent',
								intervalType: 'days',
								interval: 1,
								startDate: '',
								endDate: '',
								totalPayments: 0,
								trial: false,
								trialType: 'days',
								trialPeriod: 1,
								price: 0,
								discountPrice: 0,
								logo: '',
								coverPhoto: '',
								subscribeWithoutMembership: true,
								updateDenied: [],
								updateReplace: [],
								coaches: []
							}
						});
		}
		else{
			this.setState({screenType, loading: false});
		}
	}
	
	handleMembershipTitle = (e) => {
		this.setState({membership: { ...this.state.membership, title: e.target.value}});
	}
	
	handleMembershipDescription = (e) => {
		this.setState({membership: { ...this.state.membership, description: e.target.value}});
	}
	
	handleMembershipPublic = (e) => {
		this.setState({membership: { ...this.state.membership, isPublic: e.target.value}});
	}
	
	handleMembershipType = (e) => {
		this.setState({membership: { ...this.state.membership, type: e.target.value, paymentType: 'permanent'}});
	}
	
	handleMembershipPaymentType = (e) => {
		this.setState({membership: { ...this.state.membership, paymentType: e.target.value}});
	}
	
	handleMembershipInterval = (e) => {
		this.setState({membership: { ...this.state.membership, interval: e.target.value}});
	}
	
	handleMembershipIntervalType = (e) => {
		this.setState({membership: { ...this.state.membership, intervalType: e.target.value}});
	}
	
	handleMembershipStartDate = (e) => {
		this.setState({membership: { ...this.state.membership, startDate: e.target.value}});
	}
	
	handleMembershipEndDate = (e) => {
		this.setState({membership: { ...this.state.membership, endDate: e.target.value}});
	}
	
	handleMembershipTrial = (e) => {
		this.setState({membership: { ...this.state.membership, trial: e.target.checked}});
	}
	
	handleMembershipTrialType = (e) => {
		this.setState({membership: { ...this.state.membership, trialType: e.target.value}});
	}
	
	handleMembershipTrialPeriod = (e) => {
		this.setState({membership: { ...this.state.membership, trialPeriod: e.target.value}});
	}
	
	handleMembershipPrice = (e) => {
		this.setState({membership: { ...this.state.membership, price: e.target.value}});
	}
	
	handleMembershipDiscountPrice = (e) => {
		this.setState({membership: { ...this.state.membership, discountPrice: e.target.value}});
	}
	
	handleMembershipTotalPayments = (e) => {
		this.setState({membership: { ...this.state.membership, totalPayments: e.target.value}});
	}
	
	openUploadMembershipLogo = () => {
		this.uploadMembershipLogoRef.current.click();
	}
	
	uploadMembershipLogo = (e) => {
		let membershipLogo = this.uploadMembershipLogoRef.current.files[0];
		let fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
		
		if(membershipLogo === undefined){
			alert('Please select image file to upload');
		}
		else if(fileTypes.indexOf(membershipLogo.type) === -1){
			alert('Please select file type of JPEG, JPG, PNG or GIF');
		}
		else{
			const Imagedata = new FormData();
			Imagedata.append('membershipUpload', membershipLogo);
			membershipUpload(Imagedata)
				.then(imgUpload => {
					this.setState({loading: false, logo: imgUpload.filename, membership: { ...this.state.membership, logo: imgUpload.filename}});
				});
			this.setState({loading: true});
		}
	}

	handleCoachChange = (selectedOption) => {
		let coaches = [];
		if(selectedOption.length > 0){
			for(let i=0; i<selectedOption.length; i++){
				coaches.push(selectedOption[i].value);
			}
		}
		
		this.setState({membership: { ...this.state.membership, coaches}});
    }
	
	addMembership = (e) => {
		e.preventDefault();
		if(this.state.membership.title === ''){
			alert('Enter membership name');
			return;
		}
		else if(this.state.membership.description === ''){
			alert('Enter membership description');
			return;
		}
		else if((this.state.membership.paymentType === 'finite' || this.state.membership.paymentType === 'recurring') && this.state.membership.interval <= 0){
			alert('Enter positive value to give access for '+this.state.membership.intervalType);
			return;
		}
		else if(this.state.membership.paymentType === 'recurring' && this.state.membership.totalPayments < 0){
			alert('Enter positive value to limit total number of payments');
			return;
		}
		else if(this.state.membership.paymentType === 'range' && this.state.membership.startDate === ''){
			alert('Enter membership start date');
			return;
		}
		else if(this.state.membership.paymentType === 'range' && this.state.membership.endDate === ''){
			alert('Enter membership end date');
			return;
		}
		else if(this.state.membership.type === 'paid' && this.state.membership.price <= 0){
			alert('Enter membership price');
			return;
		}
		else if(this.state.membership.type === 'paid' && this.state.membership.discountPrice < 0){
			alert('Enter membership discounted price');
			return;
		}
		else if(this.state.membership.logo === ''){
			alert('Upload membership logo');
			return;
		}
		else{
			let membership = this.state.membership;
			let slugify = require('slugify');
			membership.slug = slugify(membership.title, { replacement: '-', remove: null, lower: true });
			membership.clubId = this.props.team._id;
			membership.creatorId = this.props.user._id;
			teamMembershipAdd(membership)
				.then(resp => {
					if(resp.success == false){
						alert(resp.msg);
					}
					else{
						alert(resp.msg);
						this.setState({
							loading: false,
							logo: '',
							memberships: resp.memberships,
							membership: {
								title: '',
								description: '',
								isPublic: 'yes',
								type: 'free',
								paymentType: 'permanent',
								intervalType: 'days',
								interval: 1,
								startDate: '',
								endDate: '',
								totalPayments: 0,
								trial: false,
								trialType: 'days',
								trialPeriod: 1,
								price: 0,
								discountPrice: 0,
								logo: '',
								coverPhoto: '',
								subscribeWithoutMembership: true,
								updateDenied: [],
								updateReplace: [],
								coaches: []
							}
						});
					}
				});
			this.setState({loading: true});
		}
	}
	
	updateMembership = (e) => {
		e.preventDefault();
		if(this.state.membership.title === ''){
			alert('Enter membership name');
			return;
		}
		else if(this.state.membership.description === ''){
			alert('Enter membership description');
			return;
		}
		else if((this.state.membership.paymentType === 'finite' || this.state.membership.paymentType === 'recurring') && this.state.membership.interval <= 0){
			alert('Enter positive value to give access for '+this.state.membership.intervalType);
			return;
		}
		else if(this.state.membership.paymentType === 'recurring' && this.state.membership.totalPayments < 0){
			alert('Enter positive value to limit total number of payments');
			return;
		}
		else if(this.state.membership.paymentType === 'range' && this.state.membership.startDate === ''){
			alert('Enter membership start date');
			return;
		}
		else if(this.state.membership.paymentType === 'range' && this.state.membership.endDate === ''){
			alert('Enter membership end date');
			return;
		}
		else if(this.state.membership.type === 'paid' && this.state.membership.price <= 0){
			alert('Enter membership price');
			return;
		}
		else if(this.state.membership.type === 'paid' && this.state.membership.discountPrice < 0){
			alert('Enter membership discounted price');
			return;
		}
		else if(this.state.membership.logo === ''){
			alert('Upload membership logo');
			return;
		}
		else{
			let membership = this.state.membership;
			let slugify = require('slugify');
			membership.slug = slugify(membership.title, { replacement: '-', remove: null, lower: true });
			teamMembershipUpdate(membership, this.state.logo)
				.then(resp => {
					if(resp.success == false){
						alert(resp.msg);
					}
					else{
						alert(resp.msg);
						this.setState({
							loading: false,
							logo: '',
							memberships: resp.memberships,
							screenType: 'memberships',
							membership: {
								title: '',
								description: '',
								isPublic: 'yes',
								type: 'free',
								paymentType: 'permanent',
								intervalType: 'days',
								interval: 1,
								startDate: '',
								endDate: '',
								totalPayments: 0,
								trial: false,
								trialType: 'days',
								trialPeriod: 1,
								price: 0,
								discountPrice: 0,
								logo: '',
								coverPhoto: '',
								subscribeWithoutMembership: true,
								updateDenied: [],
								updateReplace: [],
								coaches: []
							}
						});
					}
				});
			this.setState({loading: true});
		}
	}
	
	handleSubscribeWithoutMembership = (e) => {
		this.setState({membership: { ...this.state.membership, subscribeWithoutMembership: e.target.checked}});
	}
	
	handleCanSubscribe = (e, id) => {
		let updateDenied = this.state.membership.updateDenied;
		if(e.target.checked){
			for (let i = 0; i < updateDenied.length; i++) {
				if (id === updateDenied[i]) {
					updateDenied.splice(i, 1);
				}
			}
		}
		else{
			updateDenied.push(id);
		}
		
		this.setState({membership: { ...this.state.membership, updateDenied}});
	}
	
	handleCancelMembership = (e, id) => {
		let updateReplace = this.state.membership.updateReplace;
		if(e.target.checked)
			updateReplace.push(id);
		else{
			for (let i = 0; i < updateReplace.length; i++) {
				if (id === updateReplace[i]) {
					updateReplace.splice(i, 1);
				}
			}
		}
		
		this.setState({membership: { ...this.state.membership, updateReplace}});
	}
	
	saveUpgradePaths = (e) => {
		e.preventDefault();
		let {_id, subscribeWithoutMembership, updateDenied, updateReplace} = this.state.membership
		let membership = {_id, subscribeWithoutMembership, updateDenied, updateReplace};
		
		membershipUpdateUpgradePaths(membership)
			.then(resp => {
				if(resp.success == false){
					alert(resp.msg);
				}
				else{
					alert(resp.msg);
					this.setState({screenType: 'edit-membership', loading: false});
				}
			});
		this.setState({loading: true});
	}

	render() {
		let loadingHtml = null;
		let isMobile = window.matchMedia(mobileQuery).matches;

		if (this.state.loading) {
			loadingHtml = <div className='profile-container-loading' style={{position: 'absolute', height: '100%', backgroundColor: 'lightgray', opacity: '0.8'}}>
							<img src={loading} alt="" />
						</div>
		}
		
		if(this.state.screenType == 'memberships'){
			return (
				<div className='outbx'>
					{loadingHtml}
					
					<div className='teams-container'>
						<a href='' className='backbtn' onClick={(e) => this.props.changeScreen(e, 'menu')}> </a>
						<h6>Memberships <a href='' className='pushright createbtn f14' onClick={(e) => this.changeScreen(e, 'create-membership', '')}>Create New</a></h6>
					</div>
					<div className='boxmenu'>
						{this.state.memberships.map(membership => (
							<div key={"my-memberships-"+membership._id} className='club-box'>
								<div className='row'>
									<div className='col-2'><Link to={"/team/"+this.props.team.slug+"/admin/membership/"+membership.slug}><img src={membership.logo ? getServerUrl().apiURL+'/uploads/memberships/'+membership.logo : '/uploads/images/membership_default.png'} /></Link></div>
									<div className='col-7'><h5 style={{display: 'block', width: '100%'}}><Link to={"/team/"+this.props.team.slug+"/admin/membership/"+membership.slug}>{membership.title}</Link></h5><small>{membership.membersCount} members</small></div>
									<div className='col-3'><a className='btn' href='' onClick={(e) => this.changeScreen(e, 'edit-membership', membership._id)}>Edit</a></div>
								</div>
							</div>
						))}
					</div>
				</div>
			)
		}
		else if(this.state.screenType === 'create-membership' || this.state.screenType == 'edit-membership'){
			let paymentTypeDisplay = null, paymentTypeOptionsDisplay = null, trialPeriodDisplay = null, priceDisplay = null, totalPaymentsDisplay = null;
			let upgradePathsBtn = null;
			let teamCoaches = [];
			let defaultCoaches = [];
			
			if(this.state.screenType == 'edit-membership')
				upgradePathsBtn = <div className="form-group">
									<a className="button" onClick={(e) => this.changeScreen(e, 'upgrade-paths', this.state.membership._id)}>Upgrade Paths</a>
								</div>
			if(this.state.membership.type === 'free'){
				paymentTypeDisplay = <div className="form-group">
										<label className="form-label" htmlFor="formMembershipPaymentType">Access Type</label>
										<Form.Control as="select" id="formMembershipPaymentType" onChange={this.handleMembershipPaymentType} value={this.state.membership.paymentType}>
											<option value="permanent">Permanent access</option>
											<option value="finite">Finite access</option>
											<option value="range">Date range access</option>
										</Form.Control>
									</div>
			}
			else if(this.state.membership.type === 'paid'){
				paymentTypeDisplay = <div className="form-group">
										<label className="form-label" htmlFor="formMembershipPaymentType">Payment Type</label>
										<Form.Control id="formMembershipPaymentType" as="select" onChange={this.handleMembershipPaymentType} value={this.state.membership.paymentType}>
											<option value="permanent">One payment for permanent access</option>
											<option value="finite">One payment for finite access</option>
											<option value="range">One payment for date range access</option>
											<option value="recurring">Recurring payments</option>
										</Form.Control>
									</div>
				priceDisplay = <div>
								<div className="form-group">
									<label className="form-label" htmlFor="formMembershipPrice">Price</label>
									<input placeholder="" type="number" step="1" min="0" id="formMembershipPrice" className="form-control" value={this.state.membership.price} onChange={this.handleMembershipPrice} />
								</div>
								<div className="form-group">
									<label className="form-label" htmlFor="formMembershipDiscountPrice">Discounted Price</label>
									<input placeholder="" type="number" step="1" min="0" id="formMembershipDiscountPrice" className="form-control" value={this.state.membership.discountPrice} onChange={this.handleMembershipDiscountPrice} />
								</div>
							</div>
			}
			
			if(this.state.membership.paymentType === 'recurring')
				totalPaymentsDisplay = <div className="form-group">
											<label className="form-label" htmlFor="formMembershipTotalPayment">Total Payments (0 = unlimited)</label>
											<input placeholder="" type="number" step="1" min="0" id="formMembershipTotalPayment" className="form-control" value={this.state.membership.totalPayments} onChange={this.handleMembershipTotalPayments} />
										</div>
			
			if(this.state.membership.paymentType === 'finite' || this.state.membership.paymentType === 'recurring')
				paymentTypeOptionsDisplay = <div className="form-group">
												<label className="form-label" htmlFor="formMembershipInterval">Grant access for</label>
												<div className='row'>
													<div className='col'>
														<div className="form-group">
															<input placeholder="" type="number" step="1" min="1" id="formMembershipInterval" className="form-control" value={this.state.membership.interval} onChange={this.handleMembershipInterval} />
														</div>
													</div>
													<div className='col pl-0'>
														<div className="form-group">
															<Form.Control as="select" onChange={this.handleMembershipIntervalType} value={this.state.membership.intervalType}>
																<option value="days">days</option>
																<option value="weeks">weeks</option>
																<option value="months">months</option>
																<option value="years">years</option>
															</Form.Control>
														</div>
													</div>
												</div>
												{totalPaymentsDisplay}
											</div>
			else if(this.state.membership.paymentType === 'range')
				paymentTypeOptionsDisplay = <div className="form-group">
												<div className='row'>
													<div className='col'>
														<div className="form-group">
															<label className="form-label" htmlFor="formMembershipStart">Start Date</label>
															<input placeholder="" type="date" id="formMembershipStart" className="form-control" value={this.state.membership.startDate} onChange={this.handleMembershipStartDate} />
														</div>
													</div>
													<div className='col pl-0'>
														<div className="form-group">
															<label className="form-label" htmlFor="formMembershipEnd">End Date</label>
															<input placeholder="" type="date" id="formMembershipEnd" className="form-control" value={this.state.membership.endDate} onChange={this.handleMembershipEndDate} />
														</div>
													</div>
												</div>
											</div>
			
			if(this.state.membership.trial)
				trialPeriodDisplay = <div className="form-group">
										<label className="form-label" htmlFor="formMembershipTrialPeriod">Free Trial</label>
										<div className='row'>
											<div className='col'>
												<div className="form-group">
													<input placeholder="" type="number" step="1" min="1" id="formMembershipTrialPeriod" className="form-control" value={this.state.membership.trialPeriod} onChange={this.handleMembershipTrialPeriod} />
												</div>
											</div>
											<div className='col pl-0'>
												<div className="form-group">
													<Form.Control as="select" onChange={this.handleMembershipTrialType} value={this.state.membership.trialType}>
														<option value="days">days</option>
														<option value="weeks">weeks</option>
														<option value="months">months</option>
														<option value="years">years</option>
													</Form.Control>
												</div>
											</div>
										</div>
									</div>
			
			if(this.state.coaches.length > 0){
				let coaches = this.state.coaches;
				for(let i = 0; i < coaches.length; i++){
					teamCoaches.push({value: coaches[i]._id, label: coaches[i].firstName+' '+coaches[i].lastName+' ('+coaches[i].email+')'});
					if(this.state.membership.coaches.includes(coaches[i]._id)){
						defaultCoaches.push(teamCoaches[i]);
					}
				}
			}
			
			return (
				<div className='outbx'>
					{loadingHtml}
					<div className='teams-container'>
						<a href='' className='backbtn' onClick={(e) => this.changeScreen(e, 'memberships', '')}> </a>
						{this.state.screenType === 'create-membership' && <h6>Create Membership</h6>}
						{this.state.screenType === 'edit-membership' && <h6>Edit Membership</h6>}
					</div>
					
					{!isMobile && <LeftSideBarTeam
                                team={this.state.team}
                                isAdmin={true}
                                isAdminOrJoined={true}
                            />
					}
					<div className='boxmenu mmbr crtevnt'>
						<form>
							<div className="form-group">
								<label className="form-label" htmlFor="formMembershipName">Membership Name</label>
								<input placeholder="" type="text" id="formMembershipName" className="form-control" value={this.state.membership.title} onChange={this.handleMembershipTitle} />
							</div>
							<div className="form-group">
								<label className="form-label" htmlFor="formEventAbout">Description</label>
								<textarea rows="3" id="formEventAbout" className="form-control" onChange={this.handleMembershipDescription} value={this.state.membership.description}></textarea>
							</div>
							<div className="form-group">
								<label className="form-label" htmlFor="formMembershipPublic">Is Public</label>
								<Form.Control id="formMembershipPublic" as="select" onChange={this.handleMembershipPublic} value={this.state.membership.isPublic}>
									<option value="yes">Yes</option>
									<option value="no">No</option>
								</Form.Control>
							</div>
							<div className="form-group">
								<label className="form-label" htmlFor="formMembershipPaid">Is Paid</label>
								<Form.Control id="formMembershipPaid" as="select" onChange={this.handleMembershipType} value={this.state.membership.type}>
									<option value="free">Free</option>
									<option value="paid">Paid</option>
								</Form.Control>
							</div>
							{paymentTypeDisplay}
							{paymentTypeOptionsDisplay}
							<Form.Group controlId="addMembershipTrial">
								<Form.Check custom type="switch">
									<Form.Check.Input checked={this.state.membership.trial} onChange={this.handleMembershipTrial} />
									<Form.Check.Label><span className="textadj">Allow Free Trial</span></Form.Check.Label>
								</Form.Check>
							</Form.Group>
							{trialPeriodDisplay}
							{priceDisplay}

							<div className="form-group">
								<label className="form-label" htmlFor="formMembershipCoaches">Coaches</label>
								<Select
									defaultValue={defaultCoaches}
									isMulti
									options={teamCoaches}
									onChange={this.handleCoachChange}
								/>
							</div>
							<div className="form-group">
								<a className="button" onClick={() => this.openUploadMembershipLogo()}>Upload Photo</a>
								<input type="file" ref={this.uploadMembershipLogoRef} onChange={() => this.uploadMembershipLogo()} style={{display: 'none'}} />
							</div>
							{upgradePathsBtn}
							
							{this.state.screenType === 'create-membership' && <div className="form-group"><a className="button subbtn" onClick={(e) => this.addMembership(e)}>Create Membership</a></div>}
							{this.state.screenType === 'edit-membership' && <div className="form-group"><a className="button subbtn" onClick={(e) => this.updateMembership(e)}>Update Membership</a></div>}
						</form>
					</div>
				</div>
			)
		}
		else if(this.state.screenType === 'upgrade-paths'){
			return(
				<div className='outbx'>
					<div className='teams-container'>
						<a href='' className='backbtn' onClick={(e) => {e.preventDefault();this.setState({screenType: 'edit-membership'});}}> </a>
						<h6>Upgrade Paths</h6>
					</div>
					<div className='boxmenu'>
						<h6>Here you can define which members are allowed to subscribe to '{this.state.membership.title}'</h6>
						<form>
							<div className='club-box'>
								<div className='row'>
									<Form.Group controlId="subscribeWithoutMembership">
										<Form.Check custom type="switch">
											<Form.Check.Input checked={this.state.membership.subscribeWithoutMembership} onChange={this.handleSubscribeWithoutMembership} />
											<Form.Check.Label><span className="textadj">Users without membership can subscribe</span></Form.Check.Label>
										</Form.Check>
									</Form.Group>
								</div>
							</div>
							{this.state.memberships.map((membership) => {
								if(this.state.membership._id === membership._id){
									return(null);
								}
								else{
									let updateDenied = this.state.membership.updateDenied.includes(membership._id);
									let updateReplaceDisabled = false;
									if(updateDenied)
										updateReplaceDisabled = true;
									return(
										<div key={"membership-upgrade-"+membership._id} className=''>
											<div className=''>
												<Dropdown.Divider style={{width: '100%'}} />
												<Form.Group controlId={"subscribeWithMembership"+membership._id}>
													<Form.Check custom type="switch">
														<Form.Check.Input checked={!updateDenied} onChange={(e) => this.handleCanSubscribe(e, membership._id)} />
														<Form.Check.Label><span className="textadj">Members of '{membership.title}' can subscribe</span></Form.Check.Label>
													</Form.Check>
												</Form.Group>
												<Form.Group controlId={"cancelMembership"+membership._id}>
													<Form.Check custom type="switch">
														<Form.Check.Input disabled={updateReplaceDisabled} checked={this.state.membership.updateReplace.includes(membership._id)} onChange={(e) => this.handleCancelMembership(e, membership._id)} />
														<Form.Check.Label><span className="textadj">Cancel '{membership.title}' on subscription</span></Form.Check.Label>
													</Form.Check>
												</Form.Group>
											</div>
										</div>
									)
								}}
							)}
						</form>
						<div className="form-group"><a className="button subbtn" onClick={(e) => this.saveUpgradePaths(e)}>Update Upgrade Paths</a></div>
					</div>
				</div>
			)
		}
	}
}

const mapStateToProps = state => {
	return {
		user: state.auth.user
	};
};

export default connect(mapStateToProps, {})(TeamMembershipsAdmin);