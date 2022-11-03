import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logOutUser } from '../actions';
import Feed from '../components/Feed';
import loading from '../assets/loading.svg';
import LeftSideBar from '../components/LeftSideBar';

import {
    getServerUrl,
    getTeam,
    loadUserTeams,
    getPostByTeam,
    teamAddMember,
    mobileQuery,
} from '../utils/api';

import profileBlank from '../assets/profile_blank.png';

class Team extends Component {
    constructor(props) {
        super(props);

        this.state = {
            team: { title: '', description: '' },
            myTeams: [],
            joinedTeams: [],
            userTeams: this.props.user.teams,
            userTeamRequests: this.props.user.teamRequests,
            isAdminOrJoined: false,
            isAdmin: false,
            posts: [],
            loading: true,
            showEllipsisOpt: false,
        };
    }

    componentDidMount() {
        getTeam(this.props.teamSlug).then((resp) => {
            if (resp.success == true) {
                this.setState({
                    team: resp.team,
                    isAdmin: !this.props.user._id.localeCompare(
                        resp.team.creatorId
                    ),
                });

                getPostByTeam(resp.team.slug).then((res) => {
                    this.setState({
                        posts: res.posts,
                    });
                });
            } else {
                alert('Error fetching data, please try again');
            }
        });

        loadUserTeams(this.props.user._id).then((resp) => {
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
        });
    }

    assignAdminOrJoined = (myTeams, joinedTeams) => {
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
    };

    toggleOpt = () => {
        this.setState({ showEllipsisOpt: !this.state.showEllipsisOpt });
    };

    render() {
        if (this.state.loading) {
            return (
                <div className='profile-container-loading'>
                    <img src={loading} alt='' />
                </div>
            );
        }
        let isMobile = window.matchMedia(mobileQuery).matches;
        return (
            <>
                <div className='container cntntbx'>
                    <div className='row'>
                        {!isMobile && <div className='col-3'>
                            <LeftSideBar
                                team={this.state.team}
                                isAdmin={this.state.isAdmin}
                                isAdminOrJoined={this.state.isAdminOrJoined}
                            />
                        </div>}
                        <div className={isMobile ? 'col-12' : 'col-9'}>
                            <div className='topbanner bxshadow'>
                                <img
                                    src={
                                        this.state.team.coverPhoto
                                            ? getServerUrl().apiURL +
                                              '/uploads/team/' +
                                              this.state.team.coverPhoto
                                            : '/uploads/images/banner2.png'
                                    }
                                />
                                <div className='row bnrin1'>
                                    <div className='col-md-12 col-lg-5'>
                                        <h3>{this.state.team.title}</h3>
                                    </div>
                                    <div className='col-md-12 col-lg-7 bnrin2 '>
                                        <span>{`${
                                            this.state.team.membersCount
                                        } member${
                                            this.state.team.membersCount > 1
                                                ? 's'
                                                : ''
                                        }`}</span>
                                        {!this.state.isAdmin && (
                                            <span>
                                                <Link
                                                    to={`/team/${this.state.team.slug}/memberships`}
                                                    className='grntxt btn'
                                                >
                                                    View Membership Plans
                                                </Link>
                                            </span>
                                        )}
                                        <span
                                            className='mropt'
                                            onClick={this.toggleOpt}
                                        >
                                            <img src='/uploads/images/dots.png' />{' '}
                                            Options
                                        </span>
                                        {this.state.showEllipsisOpt && (
                                            <div className='ovrmnu'>
                                                <ul>
                                                    <li>
                                                        <a href='#'>
                                                            Share Team
                                                        </a>
                                                    </li>
                                                    {this.state.isAdmin && (
                                                        <li>
                                                            <a
                                                                onClick={() =>
                                                                    this.props.history.push(
                                                                        `/createTeamEvent/${this.state.team.slug}`
                                                                    )
                                                                }
                                                            >
                                                                Create Event
                                                            </a>
                                                        </li>
                                                    )}
                                                </ul>{' '}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            {!this.state.team.banned.includes(
                                this.props.user._id
                            ) &&
                                (this.state.team.postRestriction ===
                                    'allowAll' ||
                                    (this.state.team.postRestriction ===
                                        'allowMembers' &&
                                        this.state.isAdminOrJoined) ||
                                    (this.state.team.postRestriction ===
                                        'onlyAdmin' &&
                                        this.state.isAdmin)) && (
                                    <div className='wrtpost'>
                                        <div className='userthumb'>
                                            <a className='userbx'>
                                                <img
                                                    src={
                                                        this.props.user
                                                            .profilePicture
                                                            ? `${
                                                                  getServerUrl()
                                                                      .apiURL
                                                              }/uploads/user/${
                                                                  this.props
                                                                      .user
                                                                      .profilePicture
                                                              }`
                                                            : profileBlank
                                                    }
                                                />
                                            </a>

                                            <Link
                                                to={`/team/${this.state.team.slug}/post/create`}
                                            >
                                                Post Something...
                                            </Link>
                                        </div>
                                    </div>
                                )}

                            {this.state.posts && (
                                <Feed
                                    posts={this.state.posts}
                                    editPost={this.props.editPost}
                                    deletePost={this.props.deletePost}
                                    showPopup={this.props.showPopup}
                                    changeKudos={this.props.changeKudos}
                                    openPictureViewer={
                                        this.props.openPictureViewer
                                    }
                                    createComment={this.props.createComment}
                                    isQuestionPage={this.props.isQuestionPage}
                                    hasActionPermission={
                                        !this.state.team.banned.includes(
                                            this.props.user._id
                                        ) && this.state.isAdminOrJoined
                                    }
                                />
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    };
};

export default withRouter(connect(mapStateToProps, { logOutUser })(Team));
