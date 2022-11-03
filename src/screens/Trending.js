/**
 * =====================================
 * REACT SCREEN COMPONENT CLASSName
 * =====================================
 * @date created: 12 October 2019
 * @authors: Waqas Rehmani
 *
 * This file defines the Trending screen component. The className Trending
 * is where the component is defined. This is a screen component.
 *
 * This screen shows the Trending Posts in the application.
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { logOutUser } from '../actions';
import InfiniteScroll from 'react-infinite-scroll-component';
import Feed from '../components/Feed';
import { assignTimeAgo, formatDateTime } from '../utils/helper';

// Importing helper functions
import {
    getServerUrl,
    groupAddMember,
    memberRemoveGroup,
    getTrendingPosts,
    getTrendingGroups,
    getTrendingTeams,
    getTrendingUsers,
    getTrendingEvents,
    getInitialTrendingQuestions,
    getPostListByObjId,
    updateFollowAct,
    updateUnfollowAct,
    getPostByGroup,
} from '../utils/api';

// Importing other components
import TrendingPost from '../components/TrendingPost';

// Importing icons and pictures
import loading from '../assets/loading.svg';
import profileBlank from '../assets/profile_blank.png';

class Trending extends Component {
    // Constructor for Trending
    constructor(props) {
        super(props);

        this.state = {
            displayPosts: [],
            totalPostsCount: 0,
            currPostTrackerId: '',
            postsOwner: [],
            hasMorePosts: true,
            posts: [],
            owners: [],
            teams: [],
            groups: [],
            groupsPostsCount: [],
            events: [],
            creators: [],
            displayQuestions: [],
            totalQuestionsCount: 0,
            currQuestionTrackerId: '',
            questionsOwner: [],
            hasMoreQuestions: true,
            users: [],
            usersFollowStatus: [],
            loading: true,
            target: 'posts',
        };
    }

    // Get the current address from the default map position and set those values in the state.
    componentDidMount() {
        getInitialTrendingQuestions(this.props.user.userId).then((res) => {
            res.questions &&
                this.setState({
                    totalQuestionsCount: res.totalQuestionsLength,
                    currQuestionTrackerId: res.currTrackerId,
                    displayQuestions: res.questions,
                    questionsOwner: res.owners,
                    hasMoreQuestions: res.hasMore,
                });
        });

        getTrendingPosts().then((res) => {
            res.owners && this.setState({ owners: res.owners });
            res.posts && this.setState({ posts: res.posts });
        });

        getTrendingTeams().then((res) => {
            res.teams && this.setState({ teams: res.teams });
        });

        getTrendingGroups().then(async (res) => {
            res.groups && this.setState({ groups: res.groups });
            let groupsPostsCount = [];
            for (const group of res.groups) {
                const posts = await getPostByGroup(group._id);
                groupsPostsCount.push(posts.length);
            }
            this.setState({ groupsPostsCount });
        });

        getTrendingEvents().then((res) => {
            res.events &&
                this.setState({ events: res.events, creators: res.creators });
        });

        getTrendingUsers().then((res) => {
            if (res.users) {
                this.setState({ users: res.users });

                let usersFollowStatus = [];
                for (const user of res.users) {
                    usersFollowStatus.push(
                        user.userId !== this.props.user.userId &&
                            user.followers.includes(this.props.user.userId)
                    );
                }

                this.setState({ usersFollowStatus });
            }
        });

        this.setState({ loading: false });
    }

    getMorePosts = async () => {
        // scroll down => add 5 more posts
        const STEP_LENGTH = 5;

        // get current num of display posts and total posts number
        let currPostsLen = this.state.displayPosts.length;
        let totalPostsLen = this.state.totalPostsCount;

        // make sure have posts to add for display
        if (currPostsLen < totalPostsLen) {
            if (currPostsLen + STEP_LENGTH < totalPostsLen) {
                const res = await getPostListByObjId(
                    this.state.currPostTrackerId,
                    currPostsLen,
                    currPostsLen + STEP_LENGTH
                );

                this.setState({
                    displayPosts: [...this.state.displayPosts, ...res.posts],
                    postsOwner: [...this.state.postsOwner, ...res.owners],
                });
            } else {
                // display all of the posts as it reached to the end of the num of posts
                const res = await getPostListByObjId(
                    this.state.currPostTrackerId,
                    currPostsLen,
                    totalPostsLen
                );
                this.setState({
                    displayPosts: [...this.state.displayPosts, ...res.posts],
                    postsOwner: [...this.state.postsOwner, ...res.owners],
                    hasMorePosts: false,
                });
            }
        } else {
            this.setState({ hasMorePosts: false });
        }
    };

    getMoreQuestions = async () => {
        // scroll down => add 5 more questions
        const STEP_LENGTH = 5;

        // get current num of display posts and total posts number
        let currQuestionsLen = this.state.displayQuestions.length;
        let totalQuestionsLen = this.state.totalQuestionsCount;

        // make sure have posts to add for display
        if (currQuestionsLen < totalQuestionsLen) {
            if (currQuestionsLen + STEP_LENGTH < totalQuestionsLen) {
                const res = await getPostListByObjId(
                    this.state.currQuestionTrackerId,
                    currQuestionsLen,
                    currQuestionsLen + STEP_LENGTH
                );

                this.setState({
                    displayQuestions: [
                        ...this.state.displayQuestions,
                        ...res.posts,
                    ],
                    questionsOwner: [
                        ...this.state.questionsOwner,
                        ...res.owners,
                    ],
                });
            } else {
                // display all of the questions as it reached to the end of the num of questions
                const res = await getPostListByObjId(
                    this.state.currQuestionTrackerId,
                    currQuestionsLen,
                    totalQuestionsLen
                );

                this.setState({
                    displayQuestions: [
                        ...this.state.displayQuestions,
                        ...res.posts,
                    ],
                    questionsOwner: [
                        ...this.state.questionsOwner,
                        ...res.owners,
                    ],
                    hasMoreQuestions: false,
                });
            }
        } else {
            this.setState({ hasMoreQuestions: false });
        }
    };

    handleTarget = (target) => {
        this.setState({ target });

        this.props.history.push({
            pathname: '/trending',
            search: `?tab=${target}`,
        });
    };

    isGroupMember = (groupId) => {
        return this.props.user.groups.includes(groupId);
    };

    joinGroup = (e, groupId, groupType) => {
        e.preventDefault();
        groupAddMember(groupId, this.props.user._id, groupType).then((resp) => {
            alert(resp.msg);
            if (resp.success == true) {
                let groupAccessBtn = document.getElementById(
                    `group-btn-${groupId}`
                );
                groupAccessBtn.innerHTML = 'Pending';
                groupAccessBtn.className = 'smplbtn m-0 dislinks blur';
            }
        });
    };

    leaveGroup = (e, groupId, groupType) => {
        e.preventDefault();
        memberRemoveGroup(groupId, this.props.user._id, 'group').then((resp) => {
            alert(resp.msg);
            if (resp.success == true) {
                let groupAccessBtn = document.getElementById(
                    `group-btn-${groupId}`
                );
                groupAccessBtn.innerHTML = 'Join Group';
                groupAccessBtn.className = 'smplbtn m-0';

                groupAccessBtn.onclick = (e) => {
                    this.joinGroup(e, groupId, groupType);
                };
            }
        });
    };

    renderPosts = (posts, owners) => {
        return posts.map((post, index) => {
            if (post.description) {
                if (post.imgFileName.length > 0) {
                    return (
                        <div className='item' key={post._id}>
                            <span className='trntop'>
                                <img
                                    src={
                                        owners[index] &&
                                        owners[index].profilePicture
                                            ? `${
                                                  getServerUrl().apiURL
                                              }/uploads/user/${
                                                  owners[index].profilePicture
                                              }`
                                            : profileBlank
                                    }
                                />
                            </span>
                            <div className='authname'>
                                <a>{`${owners[index].firstName} ${owners[index].lastName}`}</a>{' '}
                                <span className='small pstim'>
                                    {assignTimeAgo(post.time)}
                                </span>
                            </div>
                            {post.interest.icon && (
                                <span className='acttyp pushright'>
                                    <img
                                        src={`/uploads/images/${post.interest.icon}`}
                                    />
                                </span>
                            )}
                            <span className='pstover f14'>
                                {post.description}
                            </span>
                            <img
                                src={`${getServerUrl().apiURL}/uploads/posts/${
                                    post.imgFileName[0]
                                }`}
                            />
                        </div>
                    );
                } else {
                    return (
                        <div className='item' key={post._id}>
                            <span className='trntop'>
                                <img
                                    src={
                                        owners[index] &&
                                        owners[index].profilePicture
                                            ? `${
                                                  getServerUrl().apiURL
                                              }/uploads/user/${
                                                  owners[index].profilePicture
                                              }`
                                            : profileBlank
                                    }
                                />
                            </span>
                            <div className='authname'>
                                <a>{`${owners[index].firstName} ${owners[index].lastName}`}</a>{' '}
                                <span className='small pstim'>
                                    {assignTimeAgo(post.time)}
                                </span>
                            </div>
                            {post.interest.icon && (
                                <span className='acttyp pushright'>
                                    <img
                                        src={`/uploads/images/${post.interest.icon}`}
                                    />
                                </span>
                            )}
                            <p className='pstxt f14'>
                                <a href='#'>{post.description}</a>
                            </p>
                        </div>
                    );
                }
            } else {
                if (post.imgFileName.length > 0) {
                    return (
                        <div className='item' key={post._id}>
                            <span className='trntop'>
                                <img
                                    src={
                                        owners[index] &&
                                        owners[index].profilePicture
                                            ? `${
                                                  getServerUrl().apiURL
                                              }/uploads/user/${
                                                  owners[index].profilePicture
                                              }`
                                            : profileBlank
                                    }
                                />
                            </span>
                            <div className='authname'>
                                <a>{`${owners[index].firstName} ${owners[index].lastName}`}</a>{' '}
                                <span className='small pstim'>
                                    {assignTimeAgo(post.time)}
                                </span>
                            </div>
                            {post.interest.icon && (
                                <span className='acttyp pushright'>
                                    <img
                                        src={`/uploads/images/${post.interest.icon}`}
                                    />
                                </span>
                            )}
                            <img
                                src={`${getServerUrl().apiURL}/uploads/posts/${
                                    post.imgFileName[0]
                                }`}
                            />
                        </div>
                    );
                }
            }
        });
    };

    renderTeams = (teams) => {
        return teams.map((team) => (
            <div className='col-lg-6 col-md-6 clubbxsrch' key={team._id}>
                <div className='bxshadow teambxim'>
                    <div className='row'>
                        <div className='col-4'>
                            <a href=''>
                                <img
                                    src='/uploads/images/dummy-logo.png'
                                    style={{ width: '100%' }}
                                />
                            </a>
                        </div>
                        <div className='col-8 pl-0'>
                            <Link to={`/team/${team.slug}`}>{team.title}</Link>
                            <span className='small pstim'>
                                {`${team.membersCount} follower${
                                    team.membersCount > 1 ? 's' : ''
                                }`}
                            </span>
                            <p>
                                <span>
                                    Offers:
                                    {' ' + team.activityType}
                                </span>
                            </p>
                            <p>
                                <span>
                                    <a className='f14 btn' href='#'>
                                        Follow Us
                                    </a>
                                    <a className='f14 btn' href='#'>
                                        Get Membership
                                    </a>
                                </span>
                            </p>
                            <p>
                                <span className='small'>
                                    <img src='/uploads/images/pin.png' />
                                    {team.address}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        ));
    };

    renderGroups = (groups) => {
        const { groupsPostsCount } = this.state;

        return groups.map((group, index) => (
            <div className='col-lg-6 col-md-12' key={group._id}>
                <div className='pplsrch grpsrch'>
                    <div className='usrtop'>
                        <div className='row'>
                            <div className='col-3'>
                                <div className='userthumb'>
                                    <a className='userbx'>
                                        <img src='/uploads/images/user2.jpg' />
                                    </a>
                                </div>
                            </div>
                            <div className='col-9 nopad'>
                                <a className='mb-2' href='#'>
                                    {group.title}
                                </a>
                                <p className='mt-1 small  pstim'>
                                    {this.props.user.groups.includes(group._id)
                                        ? `Group ${group.membersCount} member${
                                              group.membersCount > 1 ? 's' : ''
                                          } - ${groupsPostsCount[index]} posts`
                                        : group.address}
                                </p>
                                {this.props.user._id !== group.creatorId && (
                                    <p className='mt-1'>
                                        {' '}
                                        <a
                                            id={'group-btn-' + group._id}
                                            className={`smplbtn m-0 ${
                                                this.props.user.groupRequests.includes(
                                                    group._id
                                                )
                                                    ? 'dislinks blur'
                                                    : this.isGroupMember(
                                                          group._id
                                                      )
                                                    ? 'unflw'
                                                    : ''
                                            }`}
                                            href=''
                                            onClick={(e) => {
                                                if (
                                                    this.isGroupMember(
                                                        group._id
                                                    )
                                                ) {
                                                    this.leaveGroup(
                                                        e,
                                                        group._id,
                                                        group.type
                                                    );
                                                } else {
                                                    this.joinGroup(
                                                        e,
                                                        group._id,
                                                        group.type
                                                    );
                                                }
                                            }}
                                        >
                                            {this.props.user.groupRequests.includes(
                                                group._id
                                            )
                                                ? 'Pending'
                                                : !this.isGroupMember(group._id)
                                                ? 'Join Group'
                                                : 'Leave Group'}
                                        </a>
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ));
    };

    renderUsers = (users) => {
        return users.map((user, index) => (
            <div className='col-lg-6 col-md-12' key={user._id}>
                <div className='pplsrch bxshadow'>
                    <div className='usrtop'>
                        <div className='row'>
                            <div className='col-3'>
                                <div className='userthumb'>
                                    <a className='userbx'>
                                        <img
                                            src={
                                                user.profilePicture
                                                    ? `${
                                                          getServerUrl().apiURL
                                                      }/uploads/user/${
                                                          user.profilePicture
                                                      }`
                                                    : profileBlank
                                            }
                                        />
                                    </a>
                                </div>
                            </div>
                            <div className='col-5 nopad'>
                                <Link
                                    to={`/profile/${user.userId}`}
                                >{`${user.firstName} ${user.lastName}`}</Link>
                                <span className='small pstim'>
                                    {user.location}
                                </span>
                            </div>
                            {user.userId !== this.props.user.userId && (
                                <div className='col-4 text-right'>
                                    <a
                                        className={`smplbtn m-0 ${
                                            this.state.usersFollowStatus[index]
                                                ? 'unflw'
                                                : ''
                                        }`}
                                        href='#'
                                        onClick={() => {
                                            if (
                                                this.state.usersFollowStatus[
                                                    index
                                                ]
                                            ) {
                                                this.unfollowUser(
                                                    user.userId,
                                                    index
                                                );
                                            } else {
                                                this.followUser(
                                                    user.userId,
                                                    index
                                                );
                                            }
                                        }}
                                    >
                                        {this.state.usersFollowStatus[index]
                                            ? 'Unfollow'
                                            : 'Follow Me'}
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        ));
    };

    renderEvents = (events) => {
        const { creators } = this.state;

        return events.map((event, index) => (
            <div className='col-lg-6 col-md-12' key={event._id}>
                <div className='srchpstbx'>
                    <div className='usrtop'>
                        <div className='row'>
                            <div className='col-2'>
                                <div className='userthumb'>
                                    <a className='userbx'>
                                        <img
                                            src={
                                                creators[index] !== undefined &&
                                                creators[index].profilePicture
                                                    ? `${
                                                          getServerUrl().apiURL
                                                      }/uploads/user/${
                                                          creators[index]
                                                              .profilePicture
                                                      }`
                                                    : profileBlank
                                            }
                                        />
                                    </a>
                                </div>
                            </div>
                            <div className='col-8 nopad pt-1'>
                                <Link to={`/profile/${creators[index].userId}`}>
                                    {`${creators[index].firstName} ${creators[index].lastName}`}
                                </Link>
                                {event.time && (
                                    <span className='small pstim'>
                                        {assignTimeAgo(event.time)}
                                    </span>
                                )}
                            </div>
                            {event.interest && event.interest.icon && (
                                <div className='col-2'>
                                    <span className='acttyp pushright'>
                                        <img
                                            src={`/uploads/images/${event.interest.icon}`}
                                        />
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    {event.logo && (
                        <div className='pstmd'>
                            <img
                                src={`${getServerUrl().apiURL}/uploads/event/${
                                    event.logo
                                }`}
                            />
                        </div>
                    )}
                    <h4 className='mt-3 mb-3'>
                        <Link to={`/teamEvents/${event.slug}`}>
                            {event.title}
                        </Link>
                    </h4>
                    <p>
                        <span className='f14'>
                            <img src='/uploads/images/calendar.png' />
                            {`Start: ${formatDateTime(event.start)}`}
                        </span>
                    </p>
                    <p>
                        <span className='f14'>
                            <img src='/uploads/images/calendar.png' />
                            {`End: ${formatDateTime(event.end)}`}
                        </span>
                    </p>
                    <p>
                        <span className='f14'>
                            <img src='/uploads/images/pin.png' />
                            {event.location}
                        </span>
                    </p>
                    <p className='mb-2'>
                        <span className='f14'>
                            <img src='/uploads/images/people.png' />
                            {event.attending.length} People Attending
                        </span>
                    </p>
                    <p className='mb-2'>
                        <span className='f14'>
                            <img src='/uploads/images/people.png' />
                            {event.interested.length} People Interested
                        </span>
                    </p>
                    <a href='' className='btn grnbtn w100 mt-2 f14'>
                        I am Interested
                    </a>
                    <div className='lkbxbtm f12'>
                        <div className='row'>
                            <div className='col'>
                                <a href='#'>
                                    <img src='/uploads/images/share.png' />
                                    Share
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        ));
    };

    followUser = async (followedUserId, index) => {
        await updateFollowAct(this.props.user.userId, followedUserId).then(
            (res) => {
                if (res.success === true) {
                    let usersFollowStatus = [...this.state.usersFollowStatus];
                    usersFollowStatus[index] = true;
                    this.setState({ usersFollowStatus });
                }
            }
        );
    };

    unfollowUser = async (unfollowedUserId, index) => {
        await updateUnfollowAct(this.props.user.userId, unfollowedUserId).then(
            (res) => {
                if (res.success === true) {
                    let usersFollowStatus = [...this.state.usersFollowStatus];
                    usersFollowStatus[index] = false;
                    this.setState({ usersFollowStatus });
                }
            }
        );
    };

    // Render method for Trending Screen
    render() {
        let span = -1;
        const { target, teams, groups, users, events, posts, owners } = this.state;
        const { user } = this.props;
        const isMobile = window.matchMedia('(max-width: 500px)').matches;

        if (this.state.loading) {
            return (
                <div className='profile-container-loading'>
                    <img src={loading} alt='' />
                </div>
            );
        } else {
            //     return (
            //         <div className='trending-container'>
            //             <h2>T R E N D I N G</h2>
            //             <div className='trending-list-container'>
            //                 {this.state.displayPosts.map((post) => {
            //                     span = span + 1;

            //                     return (
            //                         <TrendingPost
            //                             key={post.postId}
            //                             span={span}
            //                             post={post}
            //                         />
            //                     );
            //                 })}
            //             </div>
            //         </div>
            //     );
            // } else {
            return (
                <>
                    <div className='subhdr'>
                        <div className='container'>
                            <div className='row'>
                                <div className='col'>
                                    <div className='typsldr'>
                                        <a href='#' className={`${target === 'posts' ? 'sel' : ''}`} onClick={() => this.handleTarget('posts')}>Posts</a>
                                        <a href='#' className={`${target === 'teams' ? 'sel' : ''}`} onClick={() => this.handleTarget('teams')}>Teams</a>
                                        <a href='#' className={`${target === 'users' ? 'sel' : ''}`} onClick={() => this.handleTarget('users')}>People</a>
                                        <a href='#' className={`${target === 'questions' ? 'sel' : ''}`} onClick={() => this.handleTarget('questions')}>Questions</a>
                                        <a href='#' className={`${target === 'events' ? 'sel' : ''}`} onClick={() => this.handleTarget('events')}>Events</a>
                                        <a href='#' className={`${target === 'groups' ? 'sel' : ''}`} onClick={() => this.handleTarget('groups')}>Groups</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='tagline'>
                        <div className='container'>
                            <div className='row'>
                                <div className='col'>
                                    <a className='tag' href=''>#Trialliance</a>
                                    <a className='tag' href=''>#Eliza</a>
                                    <a className='tag' href=''>#Dehli</a>
                                    <a className='tag' href=''>#Keto Food</a>
                                    <a className='tag' href=''>#Stress</a>
                                    <a className='tag' href=''>#Marathon</a>
                                    <a className='tag' href=''>#Diet</a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='container cntntbx'>
                        <div className='row'>
                            {!isMobile && (
                                <div className='col-3'>
                                    <div className=' bxshadow menuinr'>
                                        <div className='userthumb'>
                                            <div className='userbx'>
                                                <img src={user.profilePicture ? `${getServerUrl().apiURL}/uploads/user/${user.profilePicture}` : profileBlank} />
                                            </div>
                                            <div>{user.firstName + ' ' + user.lastName}</div>
                                        </div>
                                    </div>

                                    <div className='mnuen'>
                                        <p><b>Group: Ketogenic Diet</b></p>
                                        <ul>
                                            <li><a href='#'><span><img src='/uploads/images/recent.svg' /></span>{' '}Most Recent</a></li>
                                            <li><Link to='/groups'><span><img src='/uploads/images/group.svg' /></span>{' '}Group</Link></li>
                                            <li><Link to='/teams'><span><img src='/uploads/images/team.svg' /></span>{' '}Teams</Link></li>
                                            <li><a href='#'><span><img src='/uploads/images/follow.svg' /></span>{' '}Your Followers{' '}</a></li>
                                            <li><Link to='/questions/own'><span><img src='/uploads/images/questions.svg' /></span>{' '}Your Questions{' '}</Link></li>
                                            <li><a href='#'><span><img src='/uploads/images/flag.svg' /></span>{' '}Events</a></li>
                                            <li><Link to='/saved'><span><img src='/uploads/images/bookmark.svg' /></span>{' '}Saved</Link></li>
                                            <li><a href='#'><span><img src='/uploads/images/setting.svg' /></span>{' '}Settings</a></li>
                                            <li><a onClick={this.logOutUser} href='#'><span><img src='/uploads/images/logout.svg' /></span>{' '}Logout</a></li>
                                        </ul>
                                        <p className='mt-4 mb-0'><a className='btnspl' href='#'>Join The Group</a></p>
                                    </div>
                                </div>
                            )}
                            <div className={`${!isMobile ? 'col-9' : ''}`}>
                                {target === 'posts' && (
                                    <div className='trending'>
                                        <div className='container'>
                                            <div className='row'>
                                                <div id='list' className='section'>{this.renderPosts(posts, owners)}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {target === 'teams' && (
                                    <div className='secteams'><div className='row'>{this.renderTeams(teams)}</div></div>
                                )}

                                {target === 'users' && (
                                    <div className='row'>{this.renderUsers(users)}</div>
                                )}

                                {target === 'questions' && (
                                    <InfiniteScroll
                                        style={{ overflow: 'hidden' }}
                                        dataLength={this.state.displayQuestions.length}
                                        next={this.getMoreQuestions}
                                        hasMore={this.state.hasMoreQuestions}
                                        loader={<div className='text-center'><div className='spinner-border' role='status'><span className='sr-only'>Loading...</span></div></div>}
                                        endMessage={<p className='text-center'><b>Yay! You have seen it all</b></p>}
                                    >
                                        <Feed
                                            key={`own-questions-${this.props.user.userId}-${this.state.totalQuestionsCount}`}
                                            posts={this.state.displayQuestions}
                                            owners={this.state.questionsOwner}
                                            editPost={this.props.editPost}
                                            deletePost={this.props.deletePost}
                                            showPopup={this.props.showPopup}
                                            changeKudos={this.props.changeKudos}
                                            openPictureViewer={this.props.openPictureViewer}
                                            createComment={this.props.createComment}
                                            isQuestionPage={true}
                                        />
                                    </InfiniteScroll>
                                )}

                                {target === 'events' && (
                                    <div className='lstevnt'><div className='row'>{this.renderEvents(events)}</div></div>
                                )}

                                {target === 'groups' && (
                                    <div className='row'>{this.renderGroups(groups)}</div>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    };
};

export default withRouter(connect(mapStateToProps, { logOutUser })(Trending));
