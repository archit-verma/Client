/**
 * =====================================
 * REACT SCREEN COMPONENT CLASS
 * =====================================
 * @date created: 10 September 2019
 * @authors: Waqas Rehmani
 *
 * This file defines the Profile screen component. The class Profile
 * is where the component is defined. This is a screen component.
 *
 * This screen shows the Profile of a user.
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';

// Importing other components
import Feed from '../components/Feed';
import EventsSideBar from '../components/EventsSideBar';

// Importing icons and pictures
import profileBlank from '../assets/profile_blank.png';
import loading from '../assets/loading.svg';
import LeftSideBar from '../components/LeftSideBar';

// Importing helper functions
import {
    getUser,
    getInitialCurrUserPosts,
    getPostListByObjId,
    getAllEvents,
    getAllGroups,
    getAllTeams,
    getUserBasicData,
    getServerUrl,
    deleteTracker,
    mobileQuery
} from '../utils/api';

class Profile extends Component {
    // Constructor for Profile
    constructor(props) {
        super(props);

        this.state = {
            user: {},
            posts: [],
            events: [],
            groups: [],
            teams: [],
            isCurrentUser: false,
            loading: true,
            profilePicture: '',
            followers: [],
            totalPostsCount: 0,
            currTrackerId: '',
            displayPosts: [],
            postsOwner: [],
            hasMore: true,
            following: [],
        };
    }

    // This method is called when the component first mounts after the constructor is called
    componentDidMount() {
        if (this.props.match.params.userid === this.props.user.userId) {
            getInitialCurrUserPosts(this.props.user.userId).then((res) => {
                // get total number of display posts
                this.setState({
                    totalPostsCount: res.totalPostsLength,
                    currTrackerId: res.currTrackerId,
                    displayPosts: res.posts,
                    postsOwner: res.owners,
                    hasMore: res.hasMore,
                    // TODO: remove `posts` property if new design adapted desktop version
                    posts: res.posts,
                    user: this.props.user,
                    loading: false,
                    isCurrentUser: true,
                });
            });

            getAllEvents().then((events) => {
                this.setState({
                    events: events.filter((e) =>
                        e.attending.includes(this.props.user.userId)
                    ),
                });
            });

            getAllGroups().then((groups) => {
                this.setState({
                    groups,
                });
            });

            getAllTeams().then((res) => {
                if (res.success === true) {
                    this.setState({
                        teams: res.teams,
                    });
                }
            });

            this.props.user.followers.map((follower) => {
                getUserBasicData(follower).then((user) => {
                    this.setState({
                        followers: [...this.state.followers, user],
                    });
                });
            });

            this.props.user.following.map((followingUser) => {
                getUserBasicData(followingUser).then((user) => {
                    this.setState({
                        following: [...this.state.following, user],
                    });
                });
            });
        } else {
            getUser(this.props.match.params.userid, this.props.token).then(
                (user) => {
                    if (user.userId) {
                        getInitialCurrUserPosts(user.userId).then((res) => {
                            // get total number of display posts
                            this.setState({
                                totalPostsCount: res.totalPostsLength,
                                currTrackerId: res.currTrackerId,
                                displayPosts: res.posts,
                                postsOwner: res.owners,
                                hasMore: res.hasMore,
                                // TODO: remove `posts` property if new design adapted desktop version
                                posts: res.posts,
                                user,
                                loading: false,
                            });
                        });

                        getAllEvents().then((events) => {
                            this.setState({events: events.filter((e) => e.attending.includes(user.userId))});
                        });

                        getAllGroups().then((groups) => {
                            this.setState({groups});
                        });

                        getAllTeams().then((res) => {
                            if (res.success === true) {
                                this.setState({teams: res.teams});
                            }
                        });

                        user.followers.map((follower) => {
                            getUserBasicData(follower).then((user) => {
                                this.setState({followers: [...this.state.followers, user]});
                            });
                        });

                        user.following.map((followingUser) => {
                            getUserBasicData(followingUser).then((user) => {
                                this.setState({following: [...this.state.following, user]});
                            });
                        });
                    }
                }
            );
        }
    }

    componentWillUnmount() {
        // remove tracker before navigate to other page
        if (this.props.userSignedIn) {
            deleteTracker(this.state.currTrackerId);
        }
    }

    goToGroup = (groupSlug) => {
        this.props.history.push('/group/' + groupSlug);
    };

    goToTeam = (teamSlug) => {
        this.props.history.push('/team/' + teamSlug);
    };

    // Invokes the delete post API call
    deletePost = (postId) => {
        let promise = new Promise((resolve, reject) => {
            this.props.deletePost(postId).then((post) => {
                if (post) {
                    this.setState(
                        (previousState) => ({
                            posts: previousState.posts.filter((p) => p.postId !== postId)
                        }),
                        () => {
                            resolve(true);
                        }
                    );
                } else {
                    reject(false);
                }
            });
        });
        return promise;
    };

    // Invokes the change kudos status API call
    changeKudos = (postId, kudos) => {
        let promise = new Promise((resolve, reject) => {
            this.props.changeKudos(postId, kudos).then((post) => {
                if (post.postId) {
                    this.setState(
                        (previousState) => {
                            let sortedPosts = previousState.posts.filter(
                                (p) => p.postId !== postId
                            );
                            sortedPosts.push(post);
                            sortedPosts.sort(
                                (a, b) =>
                                    Date.parse(b.time) - Date.parse(a.time)
                            );
                            return {
                                posts: sortedPosts,
                            };
                        },
                        () => {
                            resolve(true);
                        }
                    );
                } else {
                    reject(false);
                }
            });
        });
        return promise;
    };

    // Invokes the create comment API call
    createComment = (postId, postComment) => {
        let promise = new Promise((resolve, reject) => {
            this.props
                .createComment(postId, postComment, this.props.user._id)
                .then((post) => {
                    if (post.postId) {
                        this.setState(
                            (previousState) => {
                                let sortedPosts = previousState.posts.filter(
                                    (p) => p.postId !== postId
                                );
                                sortedPosts.push(post);
                                sortedPosts.sort(
                                    (a, b) =>
                                        Date.parse(b.time) - Date.parse(a.time)
                                );
                                return {
                                    posts: sortedPosts,
                                };
                            },
                            () => {
                                resolve(true);
                            }
                        );
                    } else {
                        reject(false);
                    }
                });
        });
        return promise;
    };

    getMorePosts = async () => {
        // scroll down => add 5 more posts
        const STEP_LENGTH = 5;

        // get current num of display posts and total posts number
        let currPostsLen = this.state.displayPosts.length;
        let totalPostsLen = this.state.totalPostsCount;

        // make sure have posts to add for display
        if (currPostsLen < totalPostsLen) {
            if (currPostsLen + STEP_LENGTH < totalPostsLen) {
                await getPostListByObjId(
                    this.state.currTrackerId,
                    currPostsLen,
                    currPostsLen + STEP_LENGTH
                ).then((res) => {
                    this.setState({
                        displayPosts: [
                            ...this.state.displayPosts,
                            ...res.posts,
                        ],
                        postsOwner: [...this.state.postsOwner, ...res.owners],
                    });
                });
            } else {
                // display all of the posts as it reached to the end of the num of posts
                await getPostListByObjId(
                    this.state.currTrackerId,
                    currPostsLen,
                    totalPostsLen
                ).then((res) => {
                    this.setState({
                        displayPosts: [
                            ...this.state.displayPosts,
                            ...res.posts,
                        ],
                        postsOwner: [...this.state.postsOwner, ...res.owners],
                    });
                });

                this.setState({ hasMore: false });
            }
        } else {
            this.setState({ hasMore: false });
        }
    };

    refresh = async () => {
        // delete tracker before refreshing the page
        await deleteTracker(this.state.currTrackerId);

        window.location.reload();
    };

    // Render method for Profile
    render() {
        let pictureExists = true;

        if (this.state.user.profilePicture === '') {
            pictureExists = false;
        }

        let isMobile = window.matchMedia(mobileQuery).matches;

        if (!this.props.userSignedIn) {
            return (
                <div className='home-container-no-user'>
                    <h2>You must login to see your feed.</h2>
                    <div>
                        <Link to='/signInUser'>Log In</Link>
                        <Link to='/signupUser'>SignUp</Link>
                    </div>
                </div>
            );
        } else {
            if (this.state.loading) {
                return (
                    <div className='profile-container-loading'>
                        <img src={loading} alt='' />
                    </div>
                );
            } else {
                let myGroups = this.state.groups.filter((e) =>
                    this.state.user.groups.includes(e._id)
                );

                let myTeams = this.state.teams.filter((e) =>
                    this.state.user.teams.includes(e._id)
                );

                if (!isMobile) {
                    return (
                        <div className='container cntntbx'>
                        <div className='row'>
                            <div className='col-3'>
                                <LeftSideBar />
                            </div>
                            <div className='col-md-9'>
                                <div className='bxshadow usrprfl'>
                                    <div className='prflbx'>
                                        {this.state.isCurrentUser && (
                                            <Link to={`/profile/${this.state.user.userId}/edit`} className='splbtn f12'>Edit</Link>
                                        )}
                                        <span className='bigusr'>
                                            <img
                                                src={
                                                    this.state.user
                                                        .profilePicture
                                                        ? `${
                                                              getServerUrl()
                                                                  .apiURL
                                                          }/uploads/user/${
                                                              this.state.user
                                                                  .profilePicture
                                                          }`
                                                        : profileBlank
                                                }
                                                className={
                                                    !this.state.isCurrentUser
                                                        ? 'dislinks'
                                                        : ''
                                                }
                                                onClick={() =>
                                                    this.props.history.push(
                                                        `/profile/${this.state.user.userId}/editPhoto`
                                                    )
                                                }
                                                style={{ cursor: 'pointer' }}
                                            />
                                        </span>
                                        <span>{`${this.state.user.firstName} ${this.state.user.lastName}`}</span>
                                        <span>
                                            <img src='/uploads/images/cap.svg' />
                                        </span>
                                    </div>

                                    <div className='row'>
                                        <div className='col-6'>
                                            <div className='infbx'>
                                                <p>Your Coaching Team</p>
                                                {myTeams.map((team, index) => (
                                                    <p
                                                        key={
                                                            'team-profile-desktop-' +
                                                            index
                                                        }
                                                    >
                                                        <a
                                                            onClick={() =>
                                                                this.goToTeam(
                                                                    team.slug
                                                                )
                                                            }
                                                            style={{
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            <img
                                                                src={
                                                                    team.logo
                                                                        ? `${
                                                                              getServerUrl()
                                                                                  .apiURL
                                                                          }/uploads/team/${
                                                                              team.logo
                                                                          }`
                                                                        : '/uploads/images/dummy-logo.png'
                                                                }
                                                            />
                                                            {team.title}
                                                        </a>
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                        <div className='col-6'>
                                            <div className='infbx'>
                                                <p>Your Location</p>
                                                <p>
                                                    <a href='#'>
                                                        {this.state.user
                                                            .location ||
                                                            'Unknown'}
                                                    </a>
                                                </p>
                                            </div>
                                            <div className='infbx'>
                                                <p>Your Coaching Group</p>
                                                {myGroups.map(
                                                    (group, index) => (
                                                        <p
                                                            key={
                                                                'group-profile-desktop-' +
                                                                index
                                                            }
                                                        >
                                                            <a
                                                                onClick={() =>
                                                                    this.goToGroup(
                                                                        group.slug
                                                                    )
                                                                }
                                                                style={{
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                <img
                                                                    src={
                                                                        group.logo
                                                                            ? `${
                                                                                  getServerUrl()
                                                                                      .apiURL
                                                                              }/uploads/group/${
                                                                                  group.logo
                                                                              }`
                                                                            : '/uploads/images/dummy-logo.png'
                                                                    }
                                                                />

                                                                {group.title}
                                                            </a>
                                                        </p>
                                                    )
                                                )}
                                            </div>
                                        </div>

                                        <div className='usrphto'>
                                            <p>
                                                Your Photos (
                                                {this.state.user.photos.length})
                                            </p>
                                            <div className='phtoglry'>
                                                <div className='row'>
                                                    {this.state.user.photos.map(
                                                        (photo, index) => (
                                                            <div
                                                                key={
                                                                    'photo-desktop-' +
                                                                    index
                                                                }
                                                                className='col-3 nopad'
                                                            >
                                                                <a
                                                                    href='#'
                                                                    onClick={() =>
                                                                        this.props.openPictureViewer(
                                                                            `${
                                                                                getServerUrl()
                                                                                    .apiURL
                                                                            }/uploads/user/${photo}`
                                                                        )
                                                                    }
                                                                    style={{
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    <img
                                                                        src={`${
                                                                            getServerUrl()
                                                                                .apiURL
                                                                        }/uploads/user/${photo}`}
                                                                    />
                                                                </a>
                                                            </div>
                                                        )
                                                    )}
                                                    <div className='col-12 mt-4'>
                                                        <a
                                                            onClick={() =>
                                                                this.props.history.push(
                                                                    `/profile/${this.state.user.userId}/photos`
                                                                )
                                                            }
                                                            className={`btnbig ${
                                                                this.state.user
                                                                    .photos
                                                                    .length ===
                                                                0
                                                                    ? 'dislinks blur'
                                                                    : ''
                                                            }`}
                                                            style={{
                                                                cursor: 'pointer',
                                                            }}
                                                        >
                                                            View All Photos
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className='row'>
                                        <div className='phtoglry usrphto'>
                                            <p>
                                                Your Followers (
                                                {
                                                    this.state.user.followers
                                                        .length
                                                }
                                                )
                                            </p>
                                            <div className='row flwrs'>
                                                {this.state.followers.map(
                                                    (follower, index) => (
                                                        <div
                                                            key={index}
                                                            className='col-3 nopad'
                                                        >
                                                            <a
                                                                href=''
                                                                onClick={() =>
                                                                    this.props.history.push(
                                                                        '/profile/' +
                                                                            follower.userId
                                                                    )
                                                                }
                                                                style={{
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                <img
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
                                                                <span>
                                                                    {
                                                                        follower.userId
                                                                    }
                                                                </span>
                                                            </a>
                                                        </div>
                                                    )
                                                )}
                                                <div className='col-12 mt-1'>
                                                    <a
                                                        onClick={() =>
                                                            this.props.history.push(
                                                                `/profile/${this.state.user.userId}/follow/followers`
                                                            )
                                                        }
                                                        className={`btnbig ${
                                                            this.state.user
                                                                .followers
                                                                .length === 0
                                                                ? 'dislinks blur'
                                                                : ''
                                                        }`}
                                                        style={{
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        View All Followers
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='row'>
                                        <div className='phtoglry usrphto'>
                                            <p>
                                                Your Following (
                                                {
                                                    this.state.user.following
                                                        .length
                                                }
                                                )
                                            </p>
                                            <div className='row flwrs'>
                                                {this.state.following.map(
                                                    (fUser, index) => (
                                                        <div
                                                            key={index}
                                                            className='col-3 nopad'
                                                        >
                                                            <a
                                                                href=''
                                                                onClick={() =>
                                                                    this.props.history.push(
                                                                        '/profile/' +
                                                                            fUser.userId
                                                                    )
                                                                }
                                                                style={{
                                                                    cursor: 'pointer',
                                                                }}
                                                            >
                                                                <img
                                                                    src={
                                                                        fUser.profilePicture
                                                                            ? `${
                                                                                  getServerUrl()
                                                                                      .apiURL
                                                                              }/uploads/user/${
                                                                                  fUser.profilePicture
                                                                              }`
                                                                            : profileBlank
                                                                    }
                                                                />
                                                                <span>
                                                                    {
                                                                        fUser.userId
                                                                    }
                                                                </span>
                                                            </a>
                                                        </div>
                                                    )
                                                )}
                                                <div className='col-12 mt-1'>
                                                    <a
                                                        onClick={() =>
                                                            this.props.history.push(
                                                                `/profile/${this.state.user.userId}/follow/following`
                                                            )
                                                        }
                                                        className={`btnbig ${
                                                            this.state.user
                                                                .following
                                                                .length === 0
                                                                ? 'dislinks blur'
                                                                : ''
                                                        }`}
                                                        style={{
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        View All Following
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {this.state.displayPosts.length > 0 ? (
                                        <div className='infbx topline'>
                                            <p>Your Posts</p>
                                            <InfiniteScroll
                                                dataLength={
                                                    this.state.displayPosts
                                                        .length
                                                }
                                                next={this.getMorePosts}
                                                hasMore={this.state.hasMore}
                                                loader={
                                                    <div className='text-center'>
                                                        <div
                                                            className='spinner-border'
                                                            role='status'
                                                        >
                                                            <span className='sr-only'>
                                                                Loading...
                                                            </span>
                                                        </div>
                                                    </div>
                                                }
                                                endMessage={
                                                    <p className='text-center'>
                                                        <b>
                                                            Yay! You have seen
                                                            it all
                                                        </b>
                                                    </p>
                                                }
                                                refreshFunction={this.refresh}
                                                pullDownToRefresh
                                                pullDownToRefreshThreshold={50}
                                                pullDownToRefreshContent={
                                                    <h3
                                                        style={{
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        &#8595; Pull down to
                                                        refresh
                                                    </h3>
                                                }
                                                releaseToRefreshContent={
                                                    <h3
                                                        style={{
                                                            textAlign: 'center',
                                                        }}
                                                    >
                                                        &#8593; Release to
                                                        refresh
                                                    </h3>
                                                }
                                                style={{ overflow: 'hidden' }}
                                            >
                                                <Feed
                                                    key={`profile-post-${this.props.user.userId}-
                                                ${this.state.displayPosts.length}`}
                                                    posts={
                                                        this.state.displayPosts
                                                    }
                                                    owners={
                                                        this.state.postsOwner
                                                    }
                                                    editPost={
                                                        this.props.editPost
                                                    }
                                                    deletePost={
                                                        this.props.deletePost
                                                    }
                                                    showPopup={
                                                        this.props.showPopup
                                                    }
                                                    changeKudos={
                                                        this.props.changeKudos
                                                    }
                                                    openPictureViewer={
                                                        this.props
                                                            .openPictureViewer
                                                    }
                                                    createComment={
                                                        this.props.createComment
                                                    }
                                                    isQuestionPage=''
                                                />
                                            </InfiniteScroll>
                                        </div>
                                    ) : (
                                        <div className='infbx topline'>
                                            <p className='small'>Your Posts</p>
                                            <div className='algnmid'>
                                                {this.state.isCurrentUser ? (
                                                    <>
                                                        <h5>
                                                            We noticed you haven't posted anything.
                                                        </h5>
                                                        <p>
                                                            Go{' '}
                                                            <Link to={'/home'}>
                                                                Home
                                                            </Link>{' '}
                                                            to create your first
                                                            post!
                                                        </p>
                                                    </>
                                                ) : (
                                                    <h5>
                                                        User hasn't posted
                                                        anything yet.
                                                    </h5>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        </div>
                    );
                } else {
                    return (
                        <div className='usrpfl'>
                            <div className='prflbx'>
                                {this.state.isCurrentUser && (
                                    <Link to={`/profile/${this.state.user.userId}/edit`} className='splbtn f12'>Edit</Link>
                                )}
                                <span className='bigusr'>
                                    <img
                                        src={this.state.user.profilePicture ? `${getServerUrl().apiURL}/uploads/user/${this.state.user.profilePicture}` : profileBlank}
                                        className={!this.state.isCurrentUser ? 'dislinks' : ''}
                                        onClick={() => this.props.history.push(`/profile/${this.state.user.userId}/editPhoto`)}
                                    />
                                </span>
                                <span>{`${this.state.user.firstName} ${this.state.user.lastName}`}</span>
                                <span>
                                    <img src='/uploads/images/cap.svg' />
                                </span>
                            </div>
                            <div className='infbx'>
                                <p className='small'>Your Coaching Team</p>
                                {myTeams.map((team, index) => (
                                    <p key={'team-profile-' + index}>
                                        <a onClick={() => this.goToTeam(team.slug)}>{team.title}</a>
                                    </p>
                                ))}
                            </div>
                            <div className='infbx'>
                                <p className='small'>Your Coaching Group</p>
                                {myGroups.map((group, index) => (
                                    <p key={'group-profile-' + index}>
                                        <a onClick={() => this.goToGroup(group.slug)} style={{ cursor: 'pointer' }}>{group.title}</a>
                                    </p>
                                ))}
                            </div>

                            <div className='infbx'>
                                <p className='small'>Your Location</p>
                                <p><a href='#'>{this.state.user.location}</a></p>
                            </div>
                            <div className='usrphto'>
                                <p className='small'>
                                    Your Photos ({this.state.user.photos.length})
                                </p>
                                <div className='phtoglry'>
                                    <div className='row'>
                                        {this.state.user.photos.map(
                                            (photo, index) => (
                                                <div key={index} className='col-4 nopad'>
                                                    <a
                                                        href='#'
                                                        onClick={() => this.props.openPictureViewer(`${getServerUrl().apiURL}/uploads/user/${photo}`)}
                                                    >
                                                        <img src={`${getServerUrl().apiURL}/uploads/user/${photo}`}
                                                        />
                                                    </a>
                                                </div>
                                            )
                                        )}
                                        <div className='col-12 mt-2'>
                                            <a
                                                onClick={() => this.props.history.push(`/profile/${this.state.user.userId}/photos`)}
                                                className={`btnbig ${this.state.user.photos.length === 0 ? 'dislinks blur' : ''}`}
                                            >
                                                View All Photos
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='usrphto'>
                                <p className='small'>
                                    Your Followers (
                                    {this.state.user.followers.length})
                                </p>
                                <div className='phtoglry'>
                                    <div className='row'>
                                        {this.state.followers.map(
                                            (follower, index) => (
                                                <div
                                                    key={index}
                                                    className='col-4 nopad'
                                                >
                                                    <a href='' onClick={() => this.props.history.push('/profile/' + follower.userId)}>
                                                        <img src={follower.profilePicture ? `${getServerUrl().apiURL}/uploads/user/${follower.profilePicture}` : profileBlank} />
                                                        <span>{follower.userId}</span>
                                                    </a>
                                                </div>
                                            )
                                        )}
                                        <div className='col-12 mt-1'>
                                            <a
                                                onClick={() => this.props.history.push(`/profile/${this.state.user.userId}/follow/followers`)}
                                                className={`btnbig ${this.state.user.followers.length === 0 ? 'dislinks blur' : ''}`}
                                            >
                                                View All Followers
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className='usrphto'>
                                <p className='small'>
                                    Your Following (
                                    {this.state.user.following.length})
                                </p>
                                <div className='phtoglry'>
                                    <div className='row'>
                                        {this.state.following.map(
                                            (followingUser, index) => (
                                                <div
                                                    key={`${followingUser.userId}-${index}`}
                                                    className='col-4 nopad'
                                                >
                                                    <a
                                                        href=''
                                                        onClick={() => this.props.history.push('/profile/' + followingUser.userId)}
                                                    >
                                                        <img src={followingUser.profilePicture ? `${getServerUrl().apiURL}/uploads/user/${followingUser.profilePicture}` : profileBlank} />
                                                        <span>
                                                            {followingUser.userId}
                                                        </span>
                                                    </a>
                                                </div>
                                            )
                                        )}
                                        <div className='col-12 mt-1'>
                                            <a
                                                onClick={() =>
                                                    this.props.history.push(
                                                        `/profile/${this.state.user.userId}/follow/following`
                                                    )
                                                }
                                                className={`btnbig ${
                                                    this.state.user.following
                                                        .length === 0
                                                        ? 'dislinks blur'
                                                        : ''
                                                }`}
                                            >
                                                View All Following
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {this.state.displayPosts.length > 0 ? (
                                <div className='infbx topline'>
                                    <p className='small'>Your Posts</p>
                                    <InfiniteScroll
                                        dataLength={
                                            this.state.displayPosts.length
                                        }
                                        next={this.getMorePosts}
                                        hasMore={this.state.hasMore}
                                        loader={
                                            <div className='text-center'>
                                                <div
                                                    className='spinner-border'
                                                    role='status'
                                                >
                                                    <span className='sr-only'>
                                                        Loading...
                                                    </span>
                                                </div>
                                            </div>
                                        }
                                        endMessage={
                                            <p className='text-center'>
                                                <b>Yay! You have seen it all</b>
                                            </p>
                                        }
                                        refreshFunction={this.refresh}
                                        pullDownToRefresh
                                        pullDownToRefreshThreshold={50}
                                        pullDownToRefreshContent={
                                            <h3 style={{ textAlign: 'center' }}>
                                                &#8595; Pull down to refresh
                                            </h3>
                                        }
                                        releaseToRefreshContent={
                                            <h3 style={{ textAlign: 'center' }}>
                                                &#8593; Release to refresh
                                            </h3>
                                        }
                                    >
                                        <Feed
                                            key={`profile-post-${this.props.user.userId}-
                                                ${this.state.displayPosts.length}`}
                                            posts={this.state.displayPosts}
                                            owners={this.state.postsOwner}
                                            editPost={this.props.editPost}
                                            deletePost={this.props.deletePost}
                                            showPopup={this.props.showPopup}
                                            changeKudos={this.props.changeKudos}
                                            openPictureViewer={
                                                this.props.openPictureViewer
                                            }
                                            createComment={
                                                this.props.createComment
                                            }
                                            isQuestionPage=''
                                        />
                                    </InfiniteScroll>
                                </div>
                            ) : (
                                <div className='infbx topline'>
                                    <p className='small'>Your Posts</p>
                                    <div className='algnmid'>
                                        {this.state.isCurrentUser ? (
                                            <>
                                                <h5>
                                                    We noticed you haven't
                                                    posted anything.
                                                </h5>
                                                <p>
                                                    Go{' '}
                                                    <Link to={'/home'}>
                                                        Home
                                                    </Link>{' '}
                                                    to create your first post!
                                                </p>
                                            </>
                                        ) : (
                                            <h5>
                                                User hasn't posted anything yet.
                                            </h5>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                }
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        userSignedIn: state.auth.userSignedIn,
        user: state.auth.user,
        token: state.auth.token,
    };
};

export default withRouter(connect(mapStateToProps, {})(Profile));
