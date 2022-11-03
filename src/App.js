import React from 'react';
import { connect } from 'react-redux';
import { isUserloggedIn } from './actions';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import axios from 'axios';

import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import './styles/main.scss';
import './styles/social-style.css';
import * as API from './utils/api';
import CoachRoutes from './CoachRoutes';

import loading from './assets/loading3.svg';
// Importing Components
import Header from './components/Header';
import PopUpMessage from './components/PopUpMessage';
import PictureViewer from './components/PictureViewer';

// Importing Screen Components
import Profile from './screens/Profile';
import PostDetail from './screens/PostDetail';
import NewPost from './screens/NewPost';
import CreateEvent from './screens/CreateEvent';
import CreateTeamEvent from './screens/CreateTeamEvent';
import EditEvent from './screens/EditEvent';
import EditPhoto from './screens/EditPhoto';
import EditProfile from './screens/EditProfile';
import Home from './screens/Home';
import SavedContent from './screens/SavedContent';
import SignInUser from './screens/SignInUser';
import SignUpUser from './screens/SignUpUser';
import FirstTimeSignUp from './screens/FirstTimeSignUp';
import Trending from './screens/Trending';
import WhatsNew from './screens/WhatsNew';
import Event from './screens/Event';
import TeamEvent from './screens/TeamEvent';
import CreateGroup from './screens/CreateGroup';
import Group from './screens/Group';
import EditGroup from './screens/EditGroup';
import Teams from './screens/Teams';
import Team from './screens/Team';
import TeamMemberships from './screens/TeamMemberships';
import AdminTeam from './screens/AdminTeam';
import TeamAdmin from './screens/TeamAdmin';
import SplashSocial from './screens/SplashSocial';
import Login from './screens/Login';
import Register from './screens/Register';
import DesktopDesign from './screens/DesktopDesign';
import DesktopTrending from './screens/DesktopTrending';
import AdminGroup from './screens/AdminGroup';
import Groups from './screens/Groups';
import Search from './screens/Search';
import Answer from './screens/Answer';
import UserPhotos from './screens/UserPhotos';
import UserFollowers from './screens/UserFollowers';
import OwnQuestions from './screens/OwnQuestions';
import Dropped from './components/coach/Dropped';
import UserSubScribeMemberShips from './screens/UserSubScribeMemberShips';

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            posts: [],
            groups: [],
            events: [],
            questions: [],
            pictureViewerOptions: {
                visible: false,
                image: '',
            },
            popupOptions: {
                popupVisible: false,
                buttonMessage: '',
                popupMessage: '',
                popupRedirect: '',
            },
            popupTwoButtonOptions: {
                popupVisible: false,
                popupMessage: '',
                buttonMessage1: '',
                popupRedirect1: '',
                buttonMessage2: '',
                popupRedirect2: '',
            },
            imagesCache: {},
            burgerMenuVisible: false,
        };
    }

    componentDidMount() {
        // ComponentDidMount is called after the component mounts. It's called right after the constructor
        // has finished doing what it is supposed to do.

        //this.getAllPosts();

        // The following piece of code checks whether a user was already logged in and disables the loading.
        this.props.isUserloggedIn();
    }

    // ===============================================================
    // CRUD functions for Posts
    // ===============================================================

    // Function to get posts to populate the Home feed
    getAllPosts = () => {
        API.getAllPosts().then((posts) => {
            this.setState({
                posts,
            });
        });
        API.getAllQuestions().then((questions) => {
            this.setState({
                questions,
            });
        });
    };

    // Function to create a posts and updates the application state with the new post.
    createPost = (newPost) => {
        const data = {
            postId: newPost.postId,
            userId: newPost.userId,
            isQuestion: newPost.isQuestion,
            type: newPost.type,
            description: newPost.description,
            interest: newPost.interest,
            time: newPost.time,
            role: newPost.role,
            section: newPost.section,
            imgFileName:
                newPost.imgFileName.length > 0 ? newPost.imgFileName : [],
            videoFileName:
                newPost.videoFileName.length > 0 ? newPost.videoFileName : [],
        };

        let promise = new Promise((resolve) => {
            axios
                .post(
                    API.getServerUrl().apiURL + '/posts',
                    JSON.stringify(data),
                    {
                        onUploadProgress: (ProgressEvent) => {
                            this.setState({
                                loaded: Math.ceil(
                                    (ProgressEvent.loaded /
                                        ProgressEvent.total) *
                                        100
                                ),
                            });
                        },
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    }
                )
                .then((res) => {
                    if (res.status === 200) {
                        let postToAdd = res.data;

                        if (postToAdd.section.type === 'users') {
                            this.setState(
                                (previousState) => {
                                    if (newPost.isQuestion) {
                                        let sortedQuestions =
                                            previousState.questions;
                                        sortedQuestions.push(postToAdd);
                                        sortedQuestions.sort(
                                            (a, b) =>
                                                Date.parse(b.time) -
                                                Date.parse(a.time)
                                        );
                                        return {
                                            questions: sortedQuestions,
                                        };
                                    } else {
                                        let sortedPosts = previousState.posts;
                                        sortedPosts.push(postToAdd);
                                        sortedPosts.sort(
                                            (a, b) =>
                                                Date.parse(b.time) -
                                                Date.parse(a.time)
                                        );
                                        return {
                                            posts: sortedPosts,
                                        };
                                    }
                                },
                                () => {
                                    resolve(true);
                                }
                            );
                        } else {
                            resolve(postToAdd);
                        }
                    }
                });
        });

        return promise;
    };

    // Function to create a comment in a post and updates the application state with the edited post.
    createComment = (postId, postComment, userId) => {
        let promise = new Promise((resolve, reject) => {
            API.createComment(postId, postComment, userId).then((post) => {
                if (post.postId) {
                    if (post.section.type === 'users') {
                        this.setState(
                            (previousState) => {
                                if (post.isQuestion) {
                                    let sortedQuestions =
                                        previousState.questions.filter(
                                            (p) => p.postId !== postId
                                        );
                                    sortedQuestions.push(post);
                                    sortedQuestions.sort(
                                        (a, b) =>
                                            Date.parse(b.time) -
                                            Date.parse(a.time)
                                    );
                                    return {
                                        questions: sortedQuestions,
                                    };
                                } else {
                                    let sortedPosts =
                                        previousState.posts.filter(
                                            (p) => p.postId !== postId
                                        );
                                    sortedPosts.push(post);
                                    sortedPosts.sort(
                                        (a, b) =>
                                            Date.parse(b.time) -
                                            Date.parse(a.time)
                                    );
                                    return {
                                        posts: sortedPosts,
                                    };
                                }
                            },
                            () => {
                                resolve(true);
                            }
                        );
                    } else {
                        resolve(post);
                    }
                } else {
                    reject(false);
                }
            });
        });
        return promise;
    };

    // Function to edit a post
    editPost = (postId, edited) => {
        let promise = new Promise((resolve, reject) => {
            API.editPost(postId, edited).then((post) => {
                if (post.postId) {
                    if (post.section.type === 'users') {
                        this.setState(
                            (previousState) => {
                                if (post.isQuestion) {
                                    let sortedQuestions =
                                        previousState.questions.filter(
                                            (p) => p.postId !== postId
                                        );
                                    sortedQuestions.push(post);
                                    sortedQuestions.sort(
                                        (a, b) =>
                                            Date.parse(b.time) -
                                            Date.parse(a.time)
                                    );
                                    return {
                                        questions: sortedQuestions,
                                    };
                                } else {
                                    let sortedPosts =
                                        previousState.posts.filter(
                                            (p) => p.postId !== postId
                                        );
                                    sortedPosts.push(post);
                                    sortedPosts.sort(
                                        (a, b) =>
                                            Date.parse(b.time) -
                                            Date.parse(a.time)
                                    );
                                    return {
                                        posts: sortedPosts,
                                    };
                                }
                            },
                            () => {
                                resolve(true);
                            }
                        );
                    } else {
                        resolve(post);
                    }
                } else {
                    reject(false);
                }
            });
        });
        return promise;
    };

    // Function to delete a post and updates the application state.
    deletePost = (postId) => {
        let promise = new Promise((resolve, reject) => {
            API.deletePost(postId).then((post) => {
                if (post) {
                    this.setState((previousState) => ({
                        posts: previousState.posts.filter(
                            (p) => p.postId !== postId
                        ),
                    }));
                    resolve(post);
                } else {
                    reject(false);
                }
            });
        });
        return promise;
    };

    // ===============================================================
    // CRUD functions for KUDOS
    // ===============================================================

    changeKudos = (postId, kudos) => {
        let promise = new Promise((resolve, reject) => {
            API.changeKudos(postId, kudos).then((post) => {
                if (post.postId) {
                    if (post.section.type === 'users') {
                        this.setState((previousState) => {
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
                        });
                        resolve(true);
                    } else {
                        resolve(post);
                    }
                } else {
                    reject(false);
                }
            });
        });
        return promise;
    };

    // ===============================================================
    // Popup functions
    // ===============================================================
    showPopup = (popupMessage, buttonMessage, popupRedirect) => {
        this.setState({
            popupOptions: {
                popupVisible: true,
                buttonMessage,
                popupMessage,
                popupRedirect,
            },
        });
    };

    closePopup = () => {
        this.setState({
            popupOptions: {
                popupVisible: false,
                buttonMessage: '',
                popupMessage: '',
                popupRedirect: '',
            },
        });
    };

    // ===============================================================
    // Picture Viewer functions
    // ===============================================================

    openPictureViewer = (image) => {
        this.setState({
            pictureViewerOptions: {
                visible: true,
                image,
            },
        });
    };

    closePictureViewer = () => {
        this.setState({
            pictureViewerOptions: {
                visible: false,
                image: '',
            },
        });
    };

    // ===============================================================
    // Groups functions
    // ===============================================================

    createGroup = (groupDetails) => {
        let promise = new Promise((resolve, reject) => {
            API.createGroup(groupDetails).then((group) => {
                if (group.groupId) {
                    resolve(true);
                } else {
                    reject(false);
                }
            });
        });

        return promise;
    };

    // ===============================================================
    // Events functions
    // ===============================================================

    createEvent = (newEventDetails) => {
        let promise = new Promise((resolve, reject) => {
            API.createEvent(newEventDetails).then((event) => {
                if (event.eventId) {
                    resolve(true);
                } else {
                    reject(false);
                }
            });
        });
        return promise;
    };

    editEvent = (eventId, edited) => {
        let promise = new Promise((resolve, reject) => {
            API.editEvent(eventId, edited).then((event) => {
                if (event.eventId) {
                    resolve(true);
                } else {
                    reject(false);
                }
            });
        });
        return promise;
    };

    // toggle burger menu
    toggleBurgerMenu = () => {
        this.setState((prevState) => ({
            burgerMenuVisible: !prevState.burgerMenuVisible,
        }));
    };

    // close burger menu
    closeBurgerMenu = () => {
        this.setState({
            burgerMenuVisible: false,
        });
    };

    render() {
        let isMobile = window.matchMedia(API.mobileQuery).matches;

        if (!this.props.loading) {
            return (
                <Router>
                    <Route path='/' component={CoachRoutes} />

                    <Route exact path={'/drp'} render={() => <Dropped />} />

                    <PopUpMessage
                        popupVisible={this.state.popupOptions.popupVisible}
                        popupMessage={this.state.popupOptions.popupMessage}
                        buttonMessage={this.state.popupOptions.buttonMessage}
                        popupRedirect={this.state.popupOptions.popupRedirect}
                    />

                    <PictureViewer
                        closePictureViewer={this.closePictureViewer}
                        visible={this.state.pictureViewerOptions.visible}
                        image={this.state.pictureViewerOptions.image}
                    />

                    <Route
                        exact
                        path={'/'}
                        render={() => (
                            !isMobile ? 
                                <div className={`${!isMobile ? 'outbx desktop' : 'app-container'}`}>
                                    <Header onToggleBurgerMenu={this.toggleBurgerMenu} onCloseBurgerMenu={this.closeBurgerMenu} />
                                    <WhatsNew />
                                </div>
                                :
                                <SplashSocial />
                        )}
                    />

                    <Route
                        exact
                        path={'/createEvent'}
                        render={() => (
                            <div className={`${!isMobile ? 'outbx desktop' : 'app-container'}`}>
                                <Header />
                                <CreateEvent
                                    createEvent={this.createEvent}
                                    showPopup={this.showPopup}
                                />
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path={'/editEvent/:eventId'}
                        render={(props) => (
                            <div
                                className={`${
                                    !isMobile
                                        ? 'outbx desktop'
                                        : 'app-container'
                                }`}
                            >
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />
                                <EditEvent
                                    eventId={props.match.params.eventId}
                                    editEvent={this.editEvent}
                                    showPopup={this.showPopup}
                                />
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path={'/createEvent/:groupId'}
                        render={() => (
                            <div
                                className={`${
                                    !isMobile
                                        ? 'outbx desktop'
                                        : 'app-container'
                                }`}
                            >
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />
                                <CreateEvent
                                    createEvent={this.createEvent}
                                    showPopup={this.showPopup}
                                />
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path={'/createTeamEvent/:teamSlug'}
                        render={() => (
                            <div className='app-container'>
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />
                                <CreateTeamEvent />
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path={'/events/:eventId'}
                        render={(props) => (
                            <div
                                className={`${
                                    !isMobile
                                        ? 'outbx desktop'
                                        : 'app-container'
                                }`}
                            >
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />
                                <Event
                                    eventId={props.match.params.eventId}
                                    createPost={this.createPost}
                                    showPopup={this.showPopup}
                                    editPost={this.editPost}
                                    deletePost={this.deletePost}
                                    createComment={this.createComment}
                                    changeKudos={this.changeKudos}
                                    openPictureViewer={this.openPictureViewer}
                                />
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path={'/teamEvents/:teamEventSlug'}
                        render={() => (
                            <div
                                className={`${
                                    !isMobile
                                        ? 'outbx desktop'
                                        : 'app-container'
                                }`}
                            >
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />
                                <TeamEvent />
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path={'/trending'}
                        render={() => (
                            <div className={`${!isMobile ? ' outbx desktop' : 'app-container'}${this.state.burgerMenuVisible ? ' noscroll' : ''}`}>
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />

                                <div className={this.state.burgerMenuVisible ? 'blur' : ''}>
                                    <Trending />
                                </div>
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path={'/home'}
                        render={() => (
                            <div className={`${!isMobile ? 'outbx desktop' : 'app-container'} ${this.state.burgerMenuVisible ? 'noscroll' : ''}`}>
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />

                                <div className={this.state.burgerMenuVisible ? 'blur' : ''}>
                                    <Home
                                        posts={this.state.posts}
                                        showPopup={this.showPopup}
                                        createPost={this.createPost}
                                        editPost={this.editPost}
                                        deletePost={this.deletePost}
                                        createComment={this.createComment}
                                        changeKudos={this.changeKudos}
                                        groups={this.state.groups}
                                        openPictureViewer={this.openPictureViewer}
                                        isQuestionPage={false}
                                    />
                                </div>
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path={'/questions'}
                        render={() => (
                            <div
                                className={`${
                                    !isMobile
                                        ? 'outbx desktop'
                                        : 'app-container'
                                } ${
                                    this.state.burgerMenuVisible
                                        ? 'noscroll'
                                        : ''
                                }`}
                            >
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />

                                <div
                                    className={
                                        this.state.burgerMenuVisible
                                            ? 'blur'
                                            : ''
                                    }
                                >
                                    <Home
                                        posts={this.state.questions}
                                        showPopup={this.showPopup}
                                        createPost={this.createPost}
                                        editPost={this.editPost}
                                        deletePost={this.deletePost}
                                        createComment={this.createComment}
                                        changeKudos={this.changeKudos}
                                        groups={this.state.groups}
                                        openPictureViewer={
                                            this.openPictureViewer
                                        }
                                        isQuestionPage={true}
                                    />
                                </div>
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path={'/questions/own'}
                        render={() => (
                            <div
                                className={`${
                                    !isMobile
                                        ? 'outbx desktop'
                                        : 'app-container'
                                } ${
                                    this.state.burgerMenuVisible
                                        ? 'noscroll'
                                        : ''
                                }`}
                            >
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />

                                <div
                                    className={
                                        this.state.burgerMenuVisible
                                            ? 'blur'
                                            : ''
                                    }
                                >
                                    <OwnQuestions
                                        createComment={this.createComment}
                                        changeKudos={this.changeKudos}
                                        openPictureViewer={
                                            this.openPictureViewer
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path='/profile/:userid'
                        render={() => (
                            <div
                                className={`${
                                    !isMobile
                                        ? 'outbx desktop'
                                        : 'app-container'
                                } ${
                                    this.state.burgerMenuVisible
                                        ? 'noscroll'
                                        : ''
                                }`}
                            >
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />

                                <div
                                    className={
                                        this.state.burgerMenuVisible
                                            ? 'blur'
                                            : ''
                                    }
                                >
                                    <Profile
                                        editPost={this.editPost}
                                        deletePost={this.deletePost}
                                        showPopup={this.showPopup}
                                        createComment={this.createComment}
                                        changeKudos={this.changeKudos}
                                        openPictureViewer={
                                            this.openPictureViewer
                                        }
                                        onCloseBurgerMenu={this.closeBurgerMenu}
                                    />
                                </div>
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path='/posts/create'
                        render={() => (
                            <div className='app-container'>
                                <NewPost
                                    createPost={this.createPost}
                                    section={{ type: 'users' }}
                                    isQuestion=''
                                />
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path='/questions/create'
                        render={() => (
                            <div className='app-container'>
                                <NewPost
                                    createPost={this.createPost}
                                    section={{ type: 'users' }}
                                    isQuestion={true}
                                />
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path='/answers/:questionId'
                        render={(props) => (
                            <div className='app-container'>
                                <Answer
                                    {...props}
                                    createAnswer={this.createComment}
                                />
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path='/post/:postId'
                        render={() => (
                            <div
                                className={`${
                                    !isMobile ? 'outbx desktop' : ''
                                }`}
                            >
                                {!isMobile && (
                                    <Header
                                        onToggleBurgerMenu={
                                            this.toggleBurgerMenu
                                        }
                                        onCloseBurgerMenu={this.closeBurgerMenu}
                                    />
                                )}

                                <PostDetail
                                    editPost={this.editPost}
                                    deletePost={this.deletePost}
                                    showPopup={this.showPopup}
                                    createComment={this.createComment}
                                    changeKudos={this.changeKudos}
                                    openPictureViewer={this.openPictureViewer}
                                    hasReplyCommentPermission={true}
                                />
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path='/post/:postId/view'
                        render={() => (
                            <div
                                className={`${
                                    !isMobile
                                        ? 'outbx desktop'
                                        : 'app-container'
                                }`}
                            >
                                {!isMobile && (
                                    <Header
                                        onToggleBurgerMenu={
                                            this.toggleBurgerMenu
                                        }
                                        onCloseBurgerMenu={this.closeBurgerMenu}
                                    />
                                )}

                                <PostDetail
                                    editPost={this.editPost}
                                    deletePost={this.deletePost}
                                    showPopup={this.showPopup}
                                    createComment={this.createComment}
                                    changeKudos={this.changeKudos}
                                    openPictureViewer={this.openPictureViewer}
                                    hasReplyCommentPermission=''
                                />
                            </div>
                        )}
                    />

                    <Route
                        path='/profile/:userid/edit'
                        render={() => (
                            <div
                                className={`${
                                    !isMobile
                                        ? ' outbx desktop'
                                        : 'app-container'
                                }${
                                    this.state.burgerMenuVisible
                                        ? ' noscroll'
                                        : ''
                                }`}
                            >
                                {!isMobile && (
                                    <Header
                                        onToggleBurgerMenu={
                                            this.toggleBurgerMenu
                                        }
                                        onCloseBurgerMenu={this.closeBurgerMenu}
                                    />
                                )}

                                <div
                                    className={
                                        this.state.burgerMenuVisible
                                            ? 'blur'
                                            : ''
                                    }
                                >
                                    <EditProfile />
                                </div>
                            </div>
                        )}
                    />

                    <Route
                        path={'/profile/:userid/editPhoto'}
                        render={() => (
                            <div className='app-container'>
                                <EditPhoto />
                            </div>
                        )}
                    />

                    <Route
                        path={'/profile/:userid/follow/:tabKey'}
                        render={() => (
                            <div className='app-container'>
                                <UserFollowers />
                            </div>
                        )}
                    />

                    <Route
                        path={'/profile/:userid/photos'}
                        render={() => (
                            <div className='app-container'>
                                <UserPhotos />
                            </div>
                        )}
                    />

                    <Route
                        path={'/signInUser'}
                        render={() => (
                            <div className='app-container'>
                                <SignInUser />
                            </div>
                        )}
                    />

                    <Route
                        path={'/signupUser'}
                        render={() => (
                            <div className='app-container'>
                                <Header />
                                <div className='header-gap' />
                                <SignUpUser />
                            </div>
                        )}
                    />

                    <Route
                        path={'/first-time-login'}
                        render={() => (
                            <div className='app-container'>
                                <div className='header-gap' />
                                <FirstTimeSignUp />
                            </div>
                        )}
                    />

  

                    <Route
                        path={'/createGroup'}
                        render={() => (
                            <div
                                className={`${
                                    !isMobile
                                        ? 'outbx desktop'
                                        : 'app-container'
                                }`}
                            >
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />
                                <CreateGroup
                                    createGroup={this.createGroup}
                                    showPopup={this.showPopup}
                                />
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path='/group/:groupSlug'
                        render={() => (
                            <div
                                className={`${
                                    !isMobile
                                        ? 'outbx desktop'
                                        : 'app-container'
                                }`}
                            >
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />
                                <Group
                                    editPost={this.editPost}
                                    deletePost={this.deletePost}
                                    showPopup={this.showPopup}
                                    createPost={this.createPost}
                                    createComment={this.createComment}
                                    changeKudos={this.changeKudos}
                                    openPictureViewer={this.openPictureViewer}
                                />
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path='/group/:groupSlug/admin'
                        render={(props) => (
                            <div
                                className={`${
                                    !isMobile
                                        ? 'outbx desktop'
                                        : 'app-container'
                                }`}
                            >
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />
                                <AdminGroup
                                    groupSlug={props.match.params.groupSlug}
                                />
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path='/group/:groupId/edit'
                        render={() => (
                            <div
                                className={`${
                                    !isMobile
                                        ? 'outbx desktop'
                                        : 'app-container'
                                }`}
                            >
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />
                                <EditGroup showPopup={this.showPopup} />
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path='/teams/'
                        render={() => (
                            <div className={`${!isMobile ? 'outbx desktop' : 'app-container'} ${this.state.burgerMenuVisible ? 'noscroll' : ''}`}>
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />
                                <div className={this.state.burgerMenuVisible ? 'blur' : ''}>
                                    <Teams />
                                </div>
                            </div>
                        )}
                    />
                    <Route
                        exact
                        path='/team/:teamSlug'
                        render={(props) => (
                            <div className={`${!isMobile ? 'outbx desktop' : ''} ${this.state.burgerMenuVisible ? 'noscroll' : ''}`}>
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />
                                <Team
                                    teamSlug={props.match.params.teamSlug}
                                    editPost={this.editPost}
                                    deletePost={this.deletePost}
                                    showPopup={this.showPopup}
                                    changeKudos={this.changeKudos}
                                    openPictureViewer={this.openPictureViewer}
                                    createComment={this.createComment}
                                    isQuestionPage=''
                                />
                            </div>
                        )}
                    />
                    <Route
                        exact
                        path='/team/:teamSlug/admin'
                        render={(props) => (
                            <div className={`${!isMobile ? 'outbx desktop' : 'app-container'}`}>
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />
                                <div className={this.state.burgerMenuVisible ? 'blur' : ''}>
                                    <AdminTeam
                                        teamSlug={props.match.params.teamSlug}
                                    />
                                </div>
                            </div>
                        )}
                    />
                    <Route
                        exact
                        path='/team/:teamSlug/memberships'
                        render={(props) => (
                            <div className={`${!isMobile ? 'outbx desktop' : 'app-container'}`}>
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />
                                <div className={this.state.burgerMenuVisible ? 'blur' : ''}>
                                    <TeamMemberships
                                        teamSlug={props.match.params.teamSlug}
                                    />
                                </div>
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path='/team/:teamSlug/post/create'
                        render={(props) => (
                            <div className='app-container'>
                                <NewPost
                                    createPost={this.createPost}
                                    section={{type: 'teams', id: props.match.params.teamSlug}}
                                    notGeneral={true}
                                />
                            </div>
                        )}
                    />

                    <Route
                        exact
                        path='/groups/'
                        render={() => (
                            <div className={`${!isMobile ? 'outbx desktop' : 'app-container'} ${this.state.burgerMenuVisible ? 'noscroll' : ''}`}>
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />
                                <div className={this.state.burgerMenuVisible ? 'blur' : ''}>
                                    <Groups />
                                </div>
                            </div>
                        )}
                    />
                    <Route
                        exact
                        path='/TeamAdmin/'
                        render={() => <TeamAdmin />}
                    />
                    <Route
                        exact
                        path='/SplashSocial/'
                        render={() => <SplashSocial />}
                    />
                    <Route
                        exact
                        path='/Login/'
                        render={() => <Login />}
                    />
                    <Route
                        exact
                        path='/Register/'
                        render={() => <Register />}
                    />
                    <Route
                        exact
                        path='/DesktopDesign/'
                        render={() => <DesktopDesign />}
                    />
                    <Route
                        exact
                        path='/DesktopTrending/'
                        render={() => <DesktopTrending />}
                    />
                    <Route
                        path={'/saved'}
                        render={() => (
                            <div
                                className={`${
                                    !isMobile
                                        ? 'outbx desktop'
                                        : 'app-container'
                                }`}
                            >
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />
                                <div
                                    className={
                                        this.state.burgerMenuVisible
                                            ? 'blur'
                                            : ''
                                    }
                                >
                                    <SavedContent
                                        editPost={this.editPost}
                                        deletePost={this.deletePost}
                                        showPopup={this.showPopup}
                                        createComment={this.createComment}
                                        changeKudos={this.changeKudos}
                                        openPictureViewer={
                                            this.openPictureViewer
                                        }
                                    />
                                </div>
                            </div>
                        )}
                    />
                    <Route
                        exact
                        path='/team/:teamSlug/admin/membership/:membershipSlug'
                        render={(props) => (
                            <div>
                                <Header
                                    onToggleBurgerMenu={this.toggleBurgerMenu}
                                    onCloseBurgerMenu={this.closeBurgerMenu}
                                />
                                <UserSubScribeMemberShips
                                    teamSlug={props.match.params.teamSlug}
                                    memberShipSlug={
                                        props.match.params.membershipSlug
                                    }
                                />
                            </div>
                        )}
                    />
                    <Route
                        path={[
                            '/search',
                            '/search/posts',
                            '/search/teams',
                            '/search/users',
                            '/search/questions',
                            '/search/events',
                            '/search/groups',
                        ]}
                        render={() => (
                            <div
                                className={`${
                                    !isMobile
                                        ? 'outbx desktop'
                                        : 'app-container'
                                }`}
                            >
                                {isMobile && (
                                    <Header
                                        onToggleBurgerMenu={
                                            this.toggleBurgerMenu
                                        }
                                        onCloseBurgerMenu={this.closeBurgerMenu}
                                    />
                                )}
                                <div className={this.state.burgerMenuVisible ? 'blur' : ''}>
                                    <Search />
                                </div>
                            </div>
                        )}
                    />

                    {/*<Footer />*/}
                </Router>
            );
        } else {
            return (
                <div className='profile-container-loading'>
                    <img src={loading} alt='' />
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
    };
};

export default connect(mapStateToProps, { isUserloggedIn })(App);
