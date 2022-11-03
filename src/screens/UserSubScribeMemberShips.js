import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import loading from "../assets/loading.svg";
import { getSubScribeMemberships, getServerUrl, updateMembershipStatus } from '../utils/api';

class UserSubScribeMemberShips  extends Component {


	constructor(props) {
		super(props);

		this.state = {
			team: { title: '', description: '' },
			screenType: 'memberships',
			loading: false,
			memberships: [],
			userData: [],
		} 
	}

	componentDidMount() {
		let userId=this.props.user._id
		getSubScribeMemberships(this.props.memberShipSlug,userId)
			.then(resp => {
				if (resp.success == true) {
					//if(resp.team.creatorId === this.props.user._id)
					this.setState({ team: resp.team, memberships: resp.membershipsarr,userData:resp.userArray });
				}
				else
					alert('Error fetching data, please try again');
			});
	}
	updateUserMembership(membership, action) {
		if (window.confirm("Are you sure ?")) {
			updateMembershipStatus(membership, action).then(resp => {
				if (resp.success == true) {
					//if(resp.team.creatorId === this.props.user._id)
					alert('Membership aprroved successfully.');
					 window.location.reload(false);
				}
				else
					alert('Error fetching data, please try again');
			});
		} else {
			return false;
		}
	}
	render() {
		let loadingHtml = null;
		if (this.state.loading) {
			loadingHtml = <div className='profile-container-loading' style={{ position: 'absolute', height: '100%', backgroundColor: 'lightgray', opacity: '0.8' }}>
				<img src={loading} alt="" />
			</div>
		}
		return (
			<div className='outbx'>
				{loadingHtml}
				<div className='teams-container'>
					<a href='' className='backbtn' onClick={(e) => this.changeScreen(e, 'menu')}> </a>
					<h6>Memberships</h6>
				</div>
				{this.state.memberships.length > 0 &&
				<div className='boxmenu'>
					<span>Pending Memberships</span>
				
				{this.state.memberships.map(membership => (
					<div key={"my-memberships-" + membership._id} className='club-box'>
						<div className='row'>
							<div className='col-2'><Link to={"/team/" + this.props.memberShipSlug + "/admin/membership/" + membership.slug}><img src={membership.logo ? getServerUrl().apiURL + '/uploads/memberships/' + membership.logo : '/uploads/images/membership_default.png'} /></Link></div>
							<div className='col-7'><h5 style={{ display: 'block', width: '100%' }}><Link to={"/team/" + this.props.memberShipSlug + "/admin/membership/" + membership.slug}>{membership.title}</Link></h5><small>{membership.membersCount} members</small></div>
							<div className='col-3'><a  onClick={(e) => this.updateUserMembership(membership, 'accept')}>Accept</a>|<a onClick={(e) => this.updateUserMembership(membership, 'reject')}>Reject</a></div>
						</div>
					</div>
				))}
				</div>
	}
				<div className='boxmenu'>
				<span>Subscribed Users</span>
				{this.state.userData.map(user => (

					<div key={"my-memberships-" + user._id} className='club-box'>
						<div className='row'>
							<div className='col-2'><Link to={"/team/"}><img src={user.profilePicture ? getServerUrl().apiURL + '/uploads/memberships/' + user.profilePicture : '/uploads/images/membership_default.png'} /></Link></div>
							<div className='col-7'><h5 style={{ display: 'block', width: '100%' }}><Link to={"/team/"}>{user.firstName +' '+user.lastName}</Link></h5></div>
							<div className='col-3'></div>
						</div>
					</div>
				))}
			</div>
			
				
				{this.state.memberships.length === 0 &&
					<div className='boxmenu mmbr'>
						No Pending Membership Found
                </div>
				}
			</div>
		)
	}
}

const mapStateToProps = state => {
	return {
		user: state.auth.user
	};
};

export default connect(mapStateToProps, {})(UserSubScribeMemberShips);