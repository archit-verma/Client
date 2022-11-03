import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import loading from '../assets/loading.svg';
import {
    getServerUrl,
    getUserTeamMemberships,
    saveUserMemberShipData,
    memberShipsCron,
    cancelUserMemberShipData,
    renewMembership,
    //loadUserTeams,
    mobileQuery
} from '../utils/api';
import LeftSideBar from '../components/LeftSideBar';

class TeamMemberships extends Component {
    constructor(props) {
        super(props);

        this.state = {
            team: { title: '', description: '' },
            screenType: 'memberships',
            loading: true,
            memberships: [],
            deniedMemberships: [],
            updateReplace: [],
            usersubmemberships: [],
            usersubmemids: [],
            memSelCoach: [],
            isAdmin: false,
            isAdminOrJoined: false,
        };

        this.isMobile = '';
    }

    componentDidMount() {
        this.isMobile = window.matchMedia(mobileQuery).matches;
        getUserTeamMemberships(this.props.teamSlug, this.props.user._id).then(
            (resp) => {
                if (resp.success == true) {
                    //if(resp.team.creatorId === this.props.user._id)
                    this.setState({
                        team: resp.team,
                        memberships: resp.memberships,
                        userMemberships: resp.userMemberships,
                        deniedMemberships: resp.deniedMemberships,
                        updateReplace: resp.updateReplace,
                        usersubmemberships: resp.usersubscribedmembership,
                        usersubmemids: resp.usersubmemids,
                        isAdmin: !this.props.user._id.localeCompare(
                            resp.team.creatorId
                        ),
                        isAdminOrJoined: resp.isAdminOrJoined,
                        loading: false
                    });
                } 
                else
                    alert('Error fetching data, please try again');
            }
        );

        /*loadUserTeams(this.props.user._id).then((resp) => {
            if (resp.success == true) {
                this.setState({
                    myTeams: resp.myTeams,
                    joinedTeams: resp.joinedTeams,
                    loading: false,
                });

                this.assignAdminOrJoined(resp.myTeams, resp.joinedTeams);
            } else {
                alert('Error load user teams, please try again');
            }
        });*/
        memberShipsCron(this.props.user._id);
    }

    /*assignAdminOrJoined = (myTeams, joinedTeams) => {
        myTeams.forEach((team) => {
            if (team.slug === this.props.teamSlug) {
                this.setState({ isAdminOrJoined: true });
                return;
            }
        });

        joinedTeams.forEach((team) => {
            if (team.slug === this.props.teamSlug) {
                this.setState({ isAdminOrJoined: true });
                return;
            }
        });
    };*/

    getMemberShips = (membership) => {
        if (membership.subscribeWithoutMembership == true && this.state.userMemberships.length <= 0) {
            return (
                <div key={'my-memberships-' + membership._id} className='pkginbx bxshadow mb-3' style={{textAlign: 'center'}}>
                    <img src={membership.logo ? getServerUrl().apiURL + '/uploads/memberships/' + membership.logo : '/uploads/images/membership_default.png'} style={{width: this.isMobile ? '100%' : '50%'}} />
                    <h4>{membership.title}</h4>
                    <h5 className='grntxt'>${membership.price.$numberDecimal}</h5>
                    <div>{membership.description}</div>
                    <a className='btn mob-btn-green' onClick={(e) => this.saveUserMembership(e, membership)}>Buy This Package</a>
                </div>
            );
        } else {
            // let res=this.deniedmeM(membership._id);
            // if(res==false){
            // 	return (<div key={"my-memberships-" + membership._id} className='club-box'>
            // 	<div className='row'>
            // 		<div className='col-2'><Link to={"/team/" + this.state.team.slug + "/admin/membership/" + membership.slug}><img src={membership.logo ? getServerUrl().apiURL + '/uploads/memberships/' + membership.logo : '/uploads/images/membership_default.png'} /></Link></div>
            // 		<div className='col-7'><h5 style={{ display: 'block', width: '100%' }}><Link to={"/team/" + this.state.team.slug + "/admin/membership/" + membership.slug}>{membership.title}</Link></h5><small>{membership.membersCount} members</small></div>
            // 		<div className='col-3'><a className='btn' onClick={(e) => this.saveUserMembership(e, membership)}>Subscribe</a></div>
            // 	</div>
            // </div>)
            //  }
            let usermem = this.UserSubScribeMemberShips(membership._id);
            if (usermem == false) {
                return (
                    <div key={'my-memberships-' + membership._id} className='pkginbx bxshadow mb-3' style={{textAlign: 'center'}}>
                        <img src={membership.logo ? getServerUrl().apiURL + '/uploads/memberships/' + membership.logo : '/uploads/images/membership_default.png'} style={{width: this.isMobile ? '100%' : '50%'}} />
                        <h4>{membership.title}</h4>
                        <h5 className='grntxt'>${membership.price.$numberDecimal}</h5>
                        <div>{membership.description}</div>
                        <a className='btn mob-btn-green' onClick={(e) => this.saveUserMembership(e, membership)}>Buy This Package</a>
                    </div>
                );
            }
        }
        // if(this.state.userMemberships.length>0){

        // }
    };
    deniedmeM = (id) => {
        let deninedMemberShips = this.state.deniedMemberships;
        return deninedMemberShips.indexOf(id) > -1;
    };
    UserSubScribeMemberShips = (id) => {
        let ids = this.state.usersubmemids;
        return ids.indexOf(id) > -1;
    };

    saveUserMembership = (e, membership) => {
        let loggedInUserId = this.props.user._id;
        let memUserId = membership.userId;
        if (loggedInUserId == memUserId) {
            alert('you cannot purchase your own membership.');
            return false;
        }
        let data = {
            membership: membership,
            user_id: this.props.user._id,
        };
        saveUserMemberShipData(data).then((membership) => {
            if (membership) {
                alert('Membership subscribe successfully.');
                window.location.reload();
                // this.setState({
                // 	success_m: 'Program added successfully.',
                // 	alert_cls: 'alert-success',
                // 	loading: false
            }
            // });updateReplaceupdateReplace
        });

        return false;
    };
    cancelUserMembership = (e, membership) => {
        let loggedInUserId = this.props.user._id;
        let memUserId = membership.userId;
        if (loggedInUserId == memUserId) {
            alert('you cannot purchase your own membership.');
            return false;
        }
        let data = {
            membership_id: membership,
            user_id: this.props.user._id,
        };
        cancelUserMemberShipData(data).then((membership) => {
            if (membership) {
                alert('Membership cancel successfully.');
                //	window.location.reload();
                // this.setState({
                // 	success_m: 'Program added successfully.',
                // 	alert_cls: 'alert-success',
                // 	loading: false
            }
            // });updateReplaceupdateReplace
        });

        return false;
    };
    renewUserMembership = (e, membership) => {
        let loggedInUserId = this.props.user._id;
        let memUserId = membership.userId;
        // if(loggedInUserId==memUserId){
        // 	alert('you cannot purchase your own membership.');
        // 	return false;
        // }
        let data = {
            membership_id: membership,
            user_id: this.props.user._id,
        };
        renewMembership(data).then((membership) => {
            if (membership) {
                alert('Membership renew successfully.');
                //	window.location.reload();
                // this.setState({
                // 	success_m: 'Program added successfully.',
                // 	alert_cls: 'alert-success',
                // 	loading: false
            }
            // });updateReplaceupdateReplace
        });
    };

    render() {
        let loadingHtml = null;
        
        if (this.state.loading && this.state.team.title === '') {
            return (
                <div
                    className='profile-container-loading'
                    style={{
                        position: 'absolute',
                        height: '100%',
                        backgroundColor: 'lightgray',
                        opacity: '0.8',
                    }}
                >
                    <img src={loading} alt='' />
                </div>
            );
        }
        if (this.state.memberships.length <= 0) {
            return (
                <div className='outbx'>
                    <div className='boxmenu'></div>
                </div>
            );
        }
        if (this.state.loading) {
            loadingHtml = (
                <div
                    className='profile-container-loading'
                    style={{
                        position: 'absolute',
                        height: '100%',
                        backgroundColor: 'lightgray',
                        opacity: '0.8',
                    }}
                >
                    <img src={loading} alt='' />
                </div>
            );
        }

        if (this.state.screenType == 'memberships' && this.state.memberships.length > 0) {
            return (
                <div>
                    {loadingHtml}
                    {this.isMobile && <div className='teams-container'>
                        <Link to={'/team/'+this.state.team.slug} className='backbtn'>{' '}</Link>
                        <h6>Memberships</h6>
                    </div>}
                    <div className='container cntntbx'>
                        <div className='row'>
                            {!this.isMobile && <div className='col-3'>
                                <LeftSideBar
                                    team={this.state.team}
                                    isAdmin={this.state.isAdmin}
                                    isAdminOrJoined={this.state.isAdminOrJoined}
                                />
                            </div>}
                            <div className='col-md-8 col-lg-9'>
                                <div className='boxmenu'>
                                    <span>Subscribed Memberships</span>
                                    {this.state.usersubmemberships.map(
                                        (usermemships) => (
                                            <div key={'my-memberships-' + usermemships._id} className='pkginbx bxshadow mb-3' style={{textAlign: 'center'}}>
                                                <img src={usermemships.logo ? getServerUrl().apiURL + '/uploads/memberships/' + usermemships.logo : '/uploads/images/membership_default.png'} style={{width: this.isMobile ? '100%' : '50%'}} />
                                                <h4>{usermemships.title}</h4>
                                                <h5 className='grntxt'>${usermemships.price.$numberDecimal}</h5>
                                                {usermemships.description}
                                                {usermemships.status == 'cancel' ? (
                                                    <a className='btn mob-btn-green' onClick={(e) => this.cancelUserMembership(e, usermemships)}>Renew Membership</a>
                                                ) : (
                                                    <a className='btn mob-btn-green' onClick={(e) => this.renewUserMembership(e, usermemships)}>Cancel Membership</a>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                                {this.state.memberships.length > 0 && (
                                    <div className='boxmenu'>
                                        <span>Memberships</span>
                                        {this.state.memberships.map((membership) => this.getMemberShips(membership))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    };
};

export default connect(mapStateToProps, {})(TeamMemberships);
