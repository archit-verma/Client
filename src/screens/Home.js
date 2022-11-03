/**
 * =====================================
 * REACT SCREEN COMPONENT CLASS
 * =====================================
 * @date created: 25 August 2019
 * @authors: Jay Parikh, Hasitha Dias, Waqas Rehmani
 *
 * This file defines the Home screen component. The class Home
 * is where the component is defined. This is a screen component.
 *
 * This screen shows the Home page.
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logOutUser } from '../actions';
import { assignTimeAgo } from '../utils/helper';
import InfiniteScroll from 'react-infinite-scroll-component';

// Importing icons and pictures
import profileBlank from '../assets/profile_blank.png';

import LeftSideBar from '../components/LeftSideBar';
import Feed from '../components/Feed';

import NewPost from '../screens/NewPost';

// Importing helper functions
import {
    getServerUrl,
    getInitialFeedPosts,
    getSubscribedQuestions,
    getInitialSubQuestions,
    getPostListByObjId,
    getAllFollowersData,
    mobileQuery
} from '../utils/api';

class Home extends Component {
    // constructor for Home Screen
    constructor(props) {
        super(props);
        this.state = {
            events: [],
            groups: [],
            followers: [],
            displayPosts: [],
            displayQuestions: [],
            postsOwner: [],
            questionsOwner: [],
            hasMore: true,
            currTrackerId: '',
            totalPostsCount: 0,
            displayPostForm: false,
            displayQuestionForm: false,
            tab: 'POST',
        };
    }

    // This method is called when the component first mounts after the constructor is called
    componentDidMount() {
        window.scrollTo(0, 0);

        if (this.props.userSignedIn) {
            if (!this.props.isQuestionPage) {
                getInitialFeedPosts(this.props.user.userId).then((res) => {
                    // get total number of display posts
                    this.setState({
                        totalPostsCount: res.totalPostsLength,
                        currTrackerId: res.currTrackerId,
                        displayPosts: res.posts,
                        postsOwner: res.owners,
                        hasMore: res.hasMore,
                    });
                });

                getSubscribedQuestions(this.props.user.userId).then((res) => {
                    this.setState({
                        displayQuestions: res.subscribedQuestions,
                        questionsOwner: res.owners,
                    });
                });
            } else {
                getInitialSubQuestions(this.props.user.userId).then((res) => {
                    // get total number of display questions
                    this.setState({
                        totalPostsCount: res.totalQuestionsLength,
                        currTrackerId: res.currTrackerId,
                        displayQuestions: res.questions,
                        questionsOwner: res.owners,
                        hasMore: res.hasMore,
                    });
                });
            }
            getAllFollowersData(this.props.user.userId).then((followers) => {
                this.setState({
                    followers,
                });
            });
        }
    }

    togglePostForm = () => {
        this.setState({ displayPostForm: !this.state.displayPostForm });
    };

    toggleQuestionForm = () => {
        this.setState({ displayQuestionForm: !this.state.displayQuestionForm });
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

    getMoreQuestions = async () => {
        // scroll down => add 5 more questions
        const STEP_LENGTH = 5;

        // get current num of display posts and total posts number
        let currQuestionsLen = this.state.displayQuestions.length;
        let totalQuestionsLen = this.state.totalPostsCount;

        // make sure have posts to add for display
        if (currQuestionsLen < totalQuestionsLen) {
            if (currQuestionsLen + STEP_LENGTH < totalQuestionsLen) {
                getPostListByObjId(
                    this.state.currTrackerId,
                    currQuestionsLen,
                    currQuestionsLen + STEP_LENGTH
                ).then((res) => {
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
                });
            } else {
                // display all of the questions as it reached to the end of the num of questions
                getPostListByObjId(
                    this.state.currTrackerId,
                    currQuestionsLen,
                    totalQuestionsLen
                ).then((res) => {
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
                });

                this.setState({ hasMore: false });
            }
        } else {
            this.setState({ hasMore: false });
        }
    };

    logOutUser = () => {
        if (window.confirm('Are you sure you wish to log out?')) {
            this.props.logOutUser();
            this.props.history.push('/home');
            window.location.reload();
        }
    };

    // Render method for Home
    render() {
        if (this.props.userSignedIn) {
            // let myEvents = this.state.events.filter((e) =>
            //     e.attending.includes(this.props.user.userId)
            // );
            // myEvents = myEvents.sort(
            //     (a, b) => Date.parse(a.time) - Date.parse(b.time)
            // );
            // let popularEvents = this.state.events.sort(
            //     (a, b) =>
            //         b.attending.length +
            //         b.interested.length -
            //         (a.attending.length + a.interested.length)
            // );
            // let myGroups = this.state.groups.filter((e) =>
            //     this.props.user.groups.includes(e._id)
            // );
            // let popularGroups = this.state.groups.sort(
            //     (a, b) => b.membersCount - a.membersCount
            // );

            return (
                <>
                    {window.matchMedia(mobileQuery).matches ? (
                        <>
                            <div className='wrtpost'>
                                <div className='userthumb'>
                                    <a className='userbx'>
                                        <img
                                            src={
                                                this.props.user.profilePicture
                                                    ? `${
                                                          getServerUrl().apiURL
                                                      }/uploads/user/${
                                                          this.props.user
                                                              .profilePicture
                                                      }`
                                                    : profileBlank
                                            }
                                        />
                                    </a>
                                    {!this.props.isQuestionPage ? (
                                        <Link to={'/posts/create'}>
                                            Share Something...
                                        </Link>
                                    ) : (
                                        <Link to={'/questions/create'}>
                                            Post a Question
                                        </Link>
                                    )}
                                </div>
                            </div>

                            {!this.props.isQuestionPage && (
                                <div className='postbx qsnsldbxout bxshadow'>
                                    <h6>
                                        Questions{' '}
                                        <span>
                                            <Link
                                                to='questions/create'
                                                className='pushright addbtn'
                                            >
                                                +
                                            </Link>
                                        </span>
                                    </h6>

                                    {this.state.displayQuestions.length > 0 ? (
                                        <div
                                            className='row'
                                            style={{
                                                overflowX: 'auto',
                                                whiteSpace: 'nowrap',
                                                display: 'block',
                                            }}
                                        >
                                            {this.state.displayQuestions.map(
                                                (question, index) => (
                                                    <div
                                                        key={`home-questions-${question.description}-${index}`}
                                                        className='col-4'
                                                        style={{
                                                            display:
                                                                'inline-block',
                                                        }}
                                                    >
                                                        <div
                                                            className={`qsnsldbx clr${
                                                                (index % 3) + 1
                                                            }`}
                                                        >
                                                            <div className='userthumb'>
                                                                <Link
                                                                    to={`/profile/${question.userId}`}
                                                                    className='userbx'
                                                                >
                                                                    <img
                                                                        src={
                                                                            this
                                                                                .state
                                                                                .questionsOwner[
                                                                                index
                                                                            ]
                                                                                .profilePicture
                                                                                ? `${
                                                                                      getServerUrl()
                                                                                          .apiURL
                                                                                  }/uploads/user/${
                                                                                      this
                                                                                          .state
                                                                                          .questionsOwner[
                                                                                          index
                                                                                      ]
                                                                                          .profilePicture
                                                                                  }`
                                                                                : profileBlank
                                                                        }
                                                                    />
                                                                </Link>
                                                                <div>
                                                                    <Link
                                                                        to={`/profile/${question.userId}`}
                                                                        className='f14'
                                                                    >
                                                                        {this
                                                                            .state
                                                                            .questionsOwner[
                                                                            index
                                                                        ]
                                                                            .firstName +
                                                                            ' ' +
                                                                            this
                                                                                .state
                                                                                .questionsOwner[
                                                                                index
                                                                            ]
                                                                                .lastName}
                                                                    </Link>

                                                                    <span className='small pstim'>
                                                                        {assignTimeAgo(
                                                                            question.time
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                            <Link
                                                                to={`/answers/${question.postId}`}
                                                            >
                                                                <p className='f14 lineclamp'>
                                                                    {
                                                                        question.description
                                                                    }
                                                                </p>
                                                            </Link>
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            )}

                            <InfiniteScroll
                                dataLength={!this.props.isQuestionPage ? this.state.displayPosts.length : this.state.displayQuestions.length}
                                next={!this.props.isQuestionPage ? this.getMorePosts : this.getMoreQuestions}
                                hasMore={this.state.hasMore}
                                loader={
                                    <div className='text-center'>
                                        <div className='spinner-border' role='status'>
                                            <span className='sr-only'>Loading...</span>
                                        </div>
                                    </div>
                                }
                                endMessage={<p className='text-center'><b>Yay! You have seen it all</b></p>}
                            >
                                <Feed
                                    key={'feed-post-' + this.state.displayPosts.length}
                                    posts={!this.props.isQuestionPage ? this.state.displayPosts : this.state.displayQuestions}
                                    owners={!this.props.isQuestionPage ? this.state.postsOwner : this.state.questionsOwner}
                                    editPost={this.props.editPost}
                                    deletePost={this.props.deletePost}
                                    showPopup={this.props.showPopup}
                                    changeKudos={this.props.changeKudos}
                                    openPictureViewer={this.props.openPictureViewer}
                                    createComment={this.props.createComment}
                                    isQuestionPage={this.props.isQuestionPage}
                                />
                            </InfiniteScroll>
                        </>
                    ) : (
                        <div className='container cntntbx'>
                            <div className='row'>
                                <div className='col-3'>
                                    <LeftSideBar />
                                </div>

                                <div className='col-6'>
                                    <div className='pstbxdsk bxshadow'>
                                        <h3>
                                            Create a{' '}
                                            {!this.props.isQuestionPage ? 'Post' : 'Question'}
                                        </h3>

                                        {!this.props.isQuestionPage ? (
                                            !this.state.displayPostForm ? (
                                                <>
                                                    <div className='wrtpstbx'>
                                                        <div onClick={this.togglePostForm} style={{cursor: 'pointer'}}>Share what's on your mind...</div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div style={{border: '1px solid white',borderRadius: '5px',}}>
                                                    <NewPost
                                                        createPost={this.props.createPost}
                                                        section={{type: 'users'}}
                                                        isQuestion=''
                                                    />
                                                    <div onClick={this.togglePostForm} className='closebtn'>Close</div>
                                                </div>
                                            )
                                        ) : !this.state.displayQuestionForm ? (
                                            <div className='wrtpstbx'>
                                                <div onClick={this.toggleQuestionForm} style={{cursor: 'pointer'}}>Ask a question here...</div>
                                            </div>
                                        ) : (
                                            <div style={{border: '1px solid white', borderRadius: '5px'}}>
                                                <NewPost
                                                    createPost={this.props.createPost}
                                                    section={{type: 'users'}}
                                                    isQuestion={true}
                                                />
                                                <div onClick={this.toggleQuestionForm} className='closebtn'>Close</div>
                                            </div>
                                        )}
                                    </div>

                                    {!this.props.isQuestionPage && (
                                        <div className='postbx qsnsldbxout bxshadow'>
                                            <h6>
                                                Questions{' '}
                                                <span><Link to='questions/create' className='pushright addbtn'> + </Link></span>
                                            </h6>

                                            {this.state.displayQuestions
                                                .length > 0 ? (
                                                <div className='row' style={{overflowX: 'auto', whiteSpace: 'nowrap', display: 'block'}}>
                                                    {this.state.displayQuestions.map(
                                                        (question, index) => (
                                                            <div
                                                                key={`home-questions-${question.description}-${index}`}
                                                                className='col-4'
                                                                style={{display: 'inline-block'}}
                                                            >
                                                                <div className={`qsnsldbx clr${(index % 3) + 1}`}>
                                                                    <div className='userthumb'>
                                                                        <Link to={`/profile/${question.userId}`} className='userbx'>
                                                                            <img
                                                                                src={this.state.questionsOwner[index].profilePicture ? `${getServerUrl().apiURL}/uploads/user/${
                                                                                              this
                                                                                                  .state
                                                                                                  .questionsOwner[
                                                                                                  index
                                                                                              ]
                                                                                                  .profilePicture
                                                                                          }`
                                                                                        : profileBlank
                                                                                }
                                                                            />
                                                                        </Link>
                                                                        <div>
                                                                            <Link to={`/profile/${question.userId}`} className='f12'>
                                                                                {this.state.questionsOwner[index].firstName + ' ' + this.state.questionsOwner[index].lastName}
                                                                            </Link>
                                                                            <span className='small pstim'>
                                                                                {assignTimeAgo(question.time)}
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                    <Link to={`/answers/${question.postId}`}>
                                                                        <p className='f14 lineclamp'>
                                                                            {question.description}
                                                                        </p>
                                                                    </Link>
                                                                </div>
                                                            </div>
                                                        )
                                                    )}
                                                </div>
                                            ) : (
                                                ''
                                            )}
                                        </div>
                                    )}

                                    <InfiniteScroll
                                        style={{ overflow: 'hidden' }}
                                        dataLength={!this.props.isQuestionPage ? this.state.displayPosts.length : this.state.displayQuestions.length}
                                        next={
                                            !this.props.isQuestionPage ? this.getMorePosts : this.getMoreQuestions
                                        }
                                        hasMore={this.state.hasMore}
                                        loader={
                                            <div className='text-center'>
                                                <div className='spinner-border' role='status'>
                                                    <span className='sr-only'>Loading...</span>
                                                </div>
                                            </div>
                                        }
                                        endMessage={<p className='text-center'><b>Yay! You have seen it all</b></p>}
                                    >
                                        <Feed
                                            key={'feed-post-desktop-' + this.state.displayPosts.length}
                                            posts={!this.props.isQuestionPage ? this.state.displayPosts : this.state.displayQuestions}
                                            owners={!this.props.isQuestionPage ? this.state.postsOwner
                                                    : this.state.questionsOwner
                                            }
                                            editPost={this.props.editPost}
                                            deletePost={this.props.deletePost}
                                            showPopup={this.props.showPopup}
                                            changeKudos={this.props.changeKudos}
                                            openPictureViewer={this.props.openPictureViewer}
                                            createComment={this.props.createComment}
                                            isQuestionPage={this.props.isQuestionPage}
                                        />
                                    </InfiniteScroll>
                                </div>

                                <div className='col-3'>
                                    <div className='lgnrgstr bxshadow'>
                                        <h6 className='f12'>Your followers</h6>
                                        {this.state.followers.map(
                                            (follower) => (
                                                <div className='usrtop' key={`homepage-follower-${follower._id}`}>
                                                    <div className='row'>
                                                        <div className='col-3'>
                                                            <div className='userthumb'>
                                                                <Link className='userbx' to={`/profile/${follower.userId}`} >
                                                                    <img
                                                                        src={follower.profilePicture ? getServerUrl().apiURL+'/uploads/user/'+follower.profilePicture : profileBlank}
                                                                    />
                                                                </Link>
                                                            </div>
                                                        </div>
                                                        <div className='col-9 nopad pt-2'>
                                                            <Link
                                                                className='userbx'
                                                                to={`/profile/${follower.userId}`}
                                                            >
                                                                {`${follower.firstName} ${follower.lastName}`}
                                                            </Link>
                                                            {follower.role ===
                                                                'Coach' && (
                                                                <span className='small pstim grntxt f12'>
                                                                    coach
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            );
        } else {
            return (
                <div className='home-container-no-user'>
                    <h2>You must login to see your feed.</h2>
                    <div>
                        <Link to='/signInUser'>Sign In</Link>
                        <Link to='/signupUser'>Sign Up</Link>
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        userSignedIn: state.auth.userSignedIn,
        user: state.auth.user,
    };
};

export default withRouter(
    connect(mapStateToProps, { logOutUser })(Home)
);
