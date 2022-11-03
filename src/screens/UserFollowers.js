import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'react-bootstrap';

import {
    getServerUrl,
    getAllFollowersData,
    getAllFollowingUserData,
    updateUnfollowAct,
    updateFollowAct,
} from '../utils/api';

import profileBlank from '../assets/profile_blank.png';
import loading from '../assets/loading.svg';

class UserFollowers extends Component {
    state = {
        followers: [],
        followersUserId: [],
        following: [],
        currUserFollowingList: this.props.user.following,
        loading: true,
    };

    componentDidMount() {
        if (this.props.match.params.tabKey === 'followers') {
            getAllFollowersData(this.props.match.params.userid).then(
                (followers) => {
                    this.setState({
                        followers,
                        loading: false,
                    });
                }
            );
        } else if (this.props.match.params.tabKey === 'following') {
            getAllFollowingUserData(this.props.match.params.userid).then(
                (following) => {
                    this.setState({
                        following,
                        loading: false,
                    });
                }
            );
        }
    }

    tabChanged = (key) => {
        if (key === 'followers') {
            this.setState({ loading: true });

            getAllFollowersData(this.props.match.params.userid).then(
                (followers) => {
                    this.setState({
                        followers,
                        loading: false,
                    });
                }
            );
        } else if (key === 'following') {
            this.setState({ loading: true });

            getAllFollowingUserData(this.props.match.params.userid).then(
                (following) => {
                    this.setState({
                        following,
                        loading: false,
                    });
                }
            );
        }
    };

    followUser = (followedUserId) => {
        updateFollowAct(this.props.user.userId, followedUserId).then(
            async (res) => {
                if (res.success === true) {
                    if (
                        this.props.match.params.userid ===
                        this.props.user.userId
                    ) {
                        this.setState({
                            following: [
                                ...this.state.following,
                                res.followedUser,
                            ],
                        });
                    }

                    let currUserFollowingList = [
                        ...this.state.currUserFollowingList,
                    ];
                    currUserFollowingList = currUserFollowingList.filter(
                        (u) => u !== res.followedUser.userId
                    );
                    currUserFollowingList.push(res.followedUser.userId);

                    this.setState({
                        currUserFollowingList,
                    });
                }
            }
        );
    };

    unfollowUser = (unfollowedUserId, index) => {
        // remove the user on the list iff the current follow component is the owner
        if (this.props.match.params.userid === this.props.user.userId) {
            let following = [...this.state.following];

            following.splice(index, 1);

            // get all following users id
            const followingUserId = following.map((user) => user.userId);

            updateUnfollowAct(this.props.user.userId, unfollowedUserId).then(
                (res) => {
                    if (res.success === true) {
                        this.setState({
                            following,
                            currUserFollowingList: followingUserId,
                        });
                    }
                }
            );
        } else {
            updateUnfollowAct(this.props.user.userId, unfollowedUserId).then(
                (res) => {
                    if (res.success === true) {
                        // get following users id of the current user
                        const followingUserId =
                            this.state.currUserFollowingList.filter(
                                (uId) => uId !== unfollowedUserId
                            );

                        this.setState({
                            currUserFollowingList: followingUserId,
                        });
                    }
                }
            );
        }
    };

    render() {
        let loadingHtml = null;
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
        return (
            <div className='outbx'>
                <div className='teams-container'>
                    <a
                        onClick={() =>
                            this.props.history.push(
                                '/profile/' + this.props.match.params.userid
                            )
                        }
                        className='backbtn'
                    >
                        {' '}
                    </a>
                    <h6>{this.props.match.params.userid}</h6>
                </div>

                {loadingHtml}

                <Tabs
                    fill
                    defaultActiveKey={this.props.match.params.tabKey}
                    id='uncontrolled-tab-user-followers'
                    onSelect={(k) => this.tabChanged(k)}
                >
                    <Tab eventKey='followers' title='Followers'>
                        <div className='main-container'>
                            {this.state.followers.map((follower, index) => (
                                <div
                                    key={`followers-${follower.userId}-${index}`}
                                    className='club-box'
                                >
                                    <div className='row'>
                                        <div className='col-2'>
                                            <img
                                                style={{ borderRadius: '84px' }}
                                                src={
                                                    follower.profilePicture
                                                        ? `${
                                                              getServerUrl()
                                                                  .apiURL
                                                          }/uploads/user/${
                                                              follower.profilePicture
                                                          }`
                                                        : profileBlank
                                                }
                                            />
                                        </div>

                                        <div className='col-7'>
                                            <Link
                                                to={`/profile/${follower.userId}`}
                                            >
                                                <h5>{`${follower.firstName} ${follower.lastName}`}</h5>
                                            </Link>
                                        </div>
                                        {follower.userId !==
                                            this.props.user.userId &&
                                            !this.state.currUserFollowingList.includes(
                                                follower.userId
                                            ) && (
                                                <div className='col-3'>
                                                    <a
                                                        onClick={() =>
                                                            this.followUser(
                                                                follower.userId
                                                            )
                                                        }
                                                        className='btn'
                                                    >
                                                        Follow
                                                    </a>
                                                </div>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Tab>
                    <Tab eventKey='following' title='Following'>
                        <div className='main-container'>
                            {this.state.following.map((following, index) => (
                                <div
                                    key={`following-${following.userId}-${index}`}
                                    className='club-box'
                                >
                                    <div className='row'>
                                        <div className='col-2'>
                                            <img
                                                style={{ borderRadius: '84px' }}
                                                src={
                                                    following.profilePicture
                                                        ? `${
                                                              getServerUrl()
                                                                  .apiURL
                                                          }/uploads/user/${
                                                              following.profilePicture
                                                          }`
                                                        : profileBlank
                                                }
                                            />
                                        </div>

                                        <div className='col-7'>
                                            <Link
                                                to={`/profile/${following.userId}`}
                                            >
                                                <h5>{`${following.firstName} ${following.lastName}`}</h5>
                                            </Link>
                                        </div>

                                        {this.state.currUserFollowingList.includes(
                                            following.userId
                                        ) ? (
                                            <div className='col-3'>
                                                <a
                                                    onClick={() =>
                                                        this.unfollowUser(
                                                            following.userId,
                                                            index
                                                        )
                                                    }
                                                    className='btn'
                                                >
                                                    Unfollow
                                                </a>
                                            </div>
                                        ) : (
                                            <div className='col-3'>
                                                <a
                                                    onClick={() =>
                                                        this.followUser(
                                                            following.userId
                                                        )
                                                    }
                                                    className='btn'
                                                >
                                                    Follow
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Tab>
                </Tabs>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    };
};

export default withRouter(connect(mapStateToProps, {})(UserFollowers));
