import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logOutUser } from '../actions';
import { getServerUrl, teamAddMember, memberRemoveTeam, teamRemoveRequest, groupAddMember, memberRemoveGroup, groupRemoveRequest } from '../utils/api';

import profileBlank from '../assets/profile_blank.png';

class LeftSideBar extends Component {
    logOutUser = () => {
        if (window.confirm('Are you sure you wish to log out?')) {
            this.props.logOutUser();
            this.props.history.push('/home');
            window.location.reload();
        }
    };

    joinTeam = (e, teamId, teamType) => {
		e.preventDefault();
		teamAddMember(teamId, this.props.user._id, teamType, 'team')
			.then(resp => {
				alert(resp.msg);
				if(resp.success == true)
                    window.location.reload();
			});
	}

    leaveTeam = (e, teamId) => {
		e.preventDefault();
		memberRemoveTeam(teamId, this.props.user._id, 'team')
			.then(resp => {
				alert(resp.msg);
				if(resp.success == true)
                    window.location.reload();
			});
		this.setState({loading: true});
	}

    removeTeamRequest = (e, teamId) => {
		e.preventDefault();
		teamRemoveRequest(teamId, this.props.user._id, 'team')
			.then(resp => {
				alert(resp.msg);
				if(resp.success == true)
                    window.location.reload();
			});
	}

    joinGroup = (e, groupId, groupType) => {
		e.preventDefault();
		groupAddMember(groupId, this.props.user._id, groupType, 'group')
			.then(resp => {
				alert(resp.msg);
				if(resp.success == true)
                    window.location.reload();
			});
	}

    leaveGroup = (e, groupId) => {
		e.preventDefault();
		memberRemoveGroup(groupId, this.props.user._id, 'group')
			.then(resp => {
				alert(resp.msg);
				if(resp.success == true)
                    window.location.reload();
			});
	}

    removeGroupRequest = (e, groupId) => {
		e.preventDefault();
		groupRemoveRequest(groupId, this.props.user._id, 'group')
			.then(resp => {
				alert(resp.msg);
				if(resp.success == true)
                    window.location.reload();
			});
	}

    render() {
        return (
            <div>
            {
                this.props.team && <div className='mnuen'>
                    <div className='userthumb'>
                        <div className='userbx'>
                            <Link to={`/profile/${this.props.user.userId}`}>
                                <img src={this.props.user.profilePicture ? `${getServerUrl().apiURL}/uploads/user/${this.props.user.profilePicture}` : profileBlank} />
                            </Link>
                        </div>
                        <div>
                            <Link to={`/profile/${this.props.user.userId}`}>
                                {`${this.props.user.firstName} ${this.props.user.lastName}`}
                            </Link>
                        </div>
                    </div>
                </div>
            }
            <div className='mnuen'>
                {this.props.team == null && <div className='userthumb'>
                    <div className='userbx'>
                        <Link to={`/profile/${this.props.user.userId}`} >
                            <img src={this.props.user.profilePicture ? `${getServerUrl().apiURL}/uploads/user/${this.props.user.profilePicture}` : profileBlank} />
                        </Link>
                    </div>
                    <div>
                        <Link to={`/profile/${this.props.user.userId}`}>
                            {`${this.props.user.firstName} ${this.props.user.lastName}`}
                        </Link>
                    </div>
                </div>
                }

                {this.props.team != null && (
                    <div>    
                        <p><b>Team: {this.props.team.title}</b></p>
                        <p><img src={this.props.team.logo ? getServerUrl().apiURL + '/uploads/team/' + this.props.team.logo : '/uploads/images/dummy-logo.png'} /></p>
                    </div>
                )}
                
                <ul>
                    <li>
                        <a href='#'>
                            <span>
                                <img src='/uploads/images/recent.svg' />
                            </span>
                            {' Most Recent '}
                        </a>
                    </li>
                    <li>
                        <Link to={'/groups'}>
                            <span>
                                <img src='/uploads/images/group.svg' />
                            </span>
                            {' Groups'}
                        </Link>
                    </li>
                    <li>
                        <Link to={'/teams'}>
                            <span>
                                <img src='/uploads/images/team.svg' />
                            </span>
                            {' Teams '}
                        </Link>
                    </li>
                    <li>
                        <a href='#'>
                            <span>
                                <img src='/uploads/images/follow.svg' />
                            </span>
                            {' Your Followers '}
                        </a>
                    </li>
                    <li>
                        <Link to='/questions/own'>
                            <span>
                                <img src='/uploads/images/questions.svg' />
                            </span>
                            {' Your Questions '}
                        </Link>
                    </li>
                    <li>
                        <a href='#'>
                            <span>
                                <img src='/uploads/images/flag.svg' />
                            </span>
                            {' Events '}
                        </a>
                    </li>
                    <li>
                        <Link to={'/saved'}>
                            <span>
                                <img src='/uploads/images/bookmark.svg' />
                            </span>
                            {' Saved '}
                        </Link>
                    </li>
                    <li>
                        <a href='#'>
                            <span>
                                <img src='/uploads/images/setting.svg' />
                            </span>
                            {' Settings '}
                        </a>
                    </li>
                    <li>
                        <a onClick={this.logOutUser} href='#'>
                            <span>
                                <img src='/uploads/images/logout.svg' />
                            </span>
                            {' Logout '}
                        </a>
                    </li>
                </ul>
                {this.props.team != null && !this.props.isAdmin && (
                    <p className='mt-4 mb-0'>
                        {!this.props.isAdminOrJoined ? 
                            (this.props.user.teamRequests.includes(this.props.team._id) ? <a className='btnspl' href='#' onClick={(e) => this.removeTeamRequest(e, this.props.team._id)}>Remove Request</a>
                                : <a className='btnspl' href='#' onClick={(e) => this.joinTeam(e, this.props.team._id, this.props.team.type)}>Join The Team</a>)
                            : <a className='btnspl' href='#' onClick={(e) => this.leaveTeam(e, this.props.team._id)}>Leave The Team</a>
                        }
                        
                    </p>
                )}
                {this.props.group != null && !this.props.isAdmin && (
                    <p className='mt-4 mb-0'>
                        {!this.props.isAdminOrJoined ? 
                            (this.props.user.groupRequests.includes(this.props.group._id) ? <a className='btnspl' href='#' onClick={(e) => this.removeGroupRequest(e, this.props.group._id)}>Remove Request</a>
                                : <a className='btnspl' href='#' onClick={(e) => this.joinGroup(e, this.props.group._id, this.props.group.type)}>Join The Group</a>)
                            : <a className='btnspl' href='#' onClick={(e) => this.leaveGroup(e, this.props.group._id)}>Leave The Group</a>
                        }
                        
                    </p>
                )}
            </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userSignedIn: state.auth.userSignedIn,
        user: state.auth.user,
    };
};

export default withRouter(connect(mapStateToProps, { logOutUser })(LeftSideBar));