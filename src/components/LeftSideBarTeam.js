import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logOutUser } from '../actions';
import { getServerUrl } from '../utils/api';

import profileBlank from '../assets/profile_blank.png';

class LeftSideBarTeam extends Component {
    logOutUser = () => {
        if (window.confirm('Are you sure you wish to log out?')) {
            this.props.logOutUser();
            this.props.history.push('/home');
            window.location.reload();
        }
    };

    render() {
        const { team, isAdmin, isAdminOrJoined, group } = this.props;

        return (
            <div className='col-md-4 col-lg-3'>
                <div className='bxshadow menuinr'>
                    <div className='userthumb'>
                        <div className='userbx'>
                            <img src={this.props.user.profilePicture ? getServerUrl().apiURL+'/uploads/user/'+this.props.user.profilePicture : profileBlank} />
                        </div>
                        <div>{this.props.user.firstName+' '+this.props.user.lastName}</div>
                    </div>
                </div>

                <div className='mnuen'>
                    {team != null && (
                        <div>
                            <p><b>Team: {team.title}</b></p>
                            <p><img src={team.logo ? getServerUrl().apiURL + '/uploads/team/' + team.logo : '/uploads/images/dummy-logo.png'} /></p>
                        </div>
                    )}
                    {group != null && (
                        <div>
                            <p><b>Group: {group.title}</b></p>
                            <p><img src={group.logo ? getServerUrl().apiURL + '/uploads/group/' + group.logo : '/uploads/images/dummy-logo.png'} /></p>
                        </div>
                    )}
                    <ul>
                        <li>
                            <a href='#'>
                                <b>Page Info</b>
                            </a>
                        </li>
                        <li>
                            <a href='#'>
                                <b>Page Members</b>
                            </a>{' '}
                        </li>
                        <li>
                            <a href='#'>
                                <b>Membership Plans</b>
                            </a>
                        </li>
                        <li>
                            <a href='#'>
                                <b>Post Mangement</b>
                            </a>
                        </li>
                        <li>
                            <a href='#'>
                                <b>Payment Setup</b>
                            </a>
                        </li>
                        <li>
                            <a href='#'>
                                <b>Account Settings</b>
                            </a>
                        </li>
                        <li>
                            <a href='#'>
                                <b>Help</b>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    };
};

export default withRouter(
    connect(mapStateToProps, { logOutUser })(LeftSideBarTeam)
);
