/**
 * =====================================
 * REACT SCREEN COMPONENT CLASS
 * =====================================
 * @date created: 6 October 2019
 * @authors: Hasitha Dias, Waqas Rehmani
 *
 * This file defines the Group screen component. The class Group
 * is where the component is defined. This is a screen component.
 *
 * This screen shows the group details.
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

// Importing icons and pictures
import { MdAdd } from 'react-icons/md';
import profileBlank from '../assets/profile_blank.png';
import loading from '../assets/loading.svg';

// Importing helper functions
import {
    getGroupBySlug,
    getPostByGroup,
    getEventsByGroup,
    editGroup,
    deleteGroup,
    deletePostsByGroup,
} from '../utils/api';

// Importing other components
import Feed from '../components/Feed';
import NewPost from '../screens/NewPost';
import EventsSideBar from '../components/EventsSideBar';

// Importing icons and pictures
import Badminton from '../assets/Badminton.svg';
import Cycling from '../assets/Cycling.svg';
import Football from '../assets/Football.svg';
import Gym from '../assets/Gym.svg';
import Running from '../assets/Running.svg';
import Swimming from '../assets/Swimming.svg';
import Tennis from '../assets/Tennis.svg';
import Walking from '../assets/Walking.svg';
import Yoga from '../assets/Yoga.svg';
// Initializing pictures to be used for interest type
const pictureHelper = {
    Badminton: Badminton,
    Cycling: Cycling,
    Gym: Gym,
    Football: Football,
    Running: Running,
    Swimming: Swimming,
    Tennis: Tennis,
    Walking: Walking,
    Yoga: Yoga,
};

class Group extends Component {
    // Constructor for Group screen
    constructor(props) {
        super(props);

        this.state = {
            group: {},
            events: [],
            posts: [],
            loading: true,
            isShowDetails: true,
            redirect: false,
        };
    }

    // This method is called when the component first mounts after the constructor is called
    componentDidMount() {
        getGroupBySlug(this.props.match.params.groupSlug).then((group) => {
            if (group._id) {
                getPostByGroup(group._id).then((posts) => {
                    let isShowDetails = true;
                    if (this.props.user.groups.includes(group._id)) {
                        isShowDetails = false;
                    }
                    this.setState({
                        group,
                        posts,
                        loading: false,
                        isShowDetails,
                    });
                });

                getEventsByGroup(group.groupId).then((events) => {
                    if (events.length > 0) {
                        this.setState({
                            events,
                        });
                    }
                });
            }
        });
    }

    // Adds a user to the group by adding userId into array of members.
    joinGroup = () => {
        let editedGroup = this.state.group;
        editedGroup = {
            ...editedGroup,
            members: [...editedGroup.members, this.props.user.userId],
        };

        this.editGroup(editedGroup);
    };

    // Does API call to change an aspect in the group, invoked by other functions.
    editGroup = (editedGroup) => {
        editGroup(this.state.group.groupId, editedGroup).then((group) => {
            if (group.groupId) {
                this.setState(
                    (prevState) => ({
                        ...prevState,
                        group,
                    }),
                    () => {
                        this.setState((prevState) => ({
                            ...prevState,
                            isShowDetails: !this.isMember(),
                        }));
                    }
                );
            }
        });
    };

    // Removes user from the list of members for group and invokes the API call.
    leaveGroup = () => {
        let editedGroup = this.state.group;
        editedGroup = {
            ...editedGroup,
            members: editedGroup.members.filter(
                (p) => p !== this.props.user.userId
            ),
        };
        this.editGroup(editedGroup);
    };

    // Deletes the entire group after which all the posts in that group are also deleted.
    deleteGroup = () => {
        if (window.confirm('Are you sure you wish to delete this Group?')) {
            deleteGroup(this.state.group.groupId).then(
                (res) => {
                    if (res) {
                        deletePostsByGroup(res.groupId).then((res) => {
                            if (res) {
                                this.props.showPopup(
                                    'Your Group was deleted.',
                                    'Close'
                                );
                                this.setState({ redirect: true });
                            }
                        });
                    }
                },
                (err) => {
                    this.props.showPopup(
                        'There was error. Please try again',
                        'Close'
                    );
                }
            );
        }
    };

    // Contains API call to create post.
    createPost = (newPost) => {
        let promise = new Promise((resolve, reject) => {
            this.props.createPost(newPost).then((post) => {
                if (post.postId) {
                    let postToAdd = post;
                    this.setState(
                        (previousState) => {
                            let sortedPosts = previousState.posts;
                            sortedPosts.push(postToAdd);
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

    // Contains API call to delete post.
    deletePost = (postId) => {
        let promise = new Promise((resolve, reject) => {
            this.props.deletePost(postId).then((post) => {
                if (post) {
                    this.setState(
                        (previousState) => ({
                            posts: previousState.posts.filter(
                                (p) => p.postId !== postId
                            ),
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

    // Contains API call to change status of Kudos.
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

    // Contains API call to create new comment.
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

    // Checks if the current user is a member of this group.
    isMember = () => {
        return this.props.user.groups.includes(this.state.group._id);
    };

    // Checks if the current user is the creator of this group.
    isCreator = () => {
        return this.state.group.creator === this.props.user.userId;
    };

    // Render method for Group
    render() {
        if (this.state.redirect) {
            return <Redirect push to='/home' />;
        }
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
                return (
                    <div className='group-container'>
                        <div className='group-top-left-photo'>
                            {this.state.group.coverPhoto === '' ? (
                                <img src={profileBlank} alt='' />
                            ) : (
                                <img
                                    src={this.state.group.coverPhoto}
                                    onClick={() =>
                                        this.props.openPictureViewer(
                                            this.state.group.coverPhoto
                                        )
                                    }
                                    style={{ cursor: 'pointer' }}
                                    alt=''
                                />
                            )}
                        </div>

                        <div className='group-left-sidebar'>
                            <div className='group-info'>
                                <h1> {this.state.group.groupName}</h1>

                                <p> {this.state.group.description}</p>
                            </div>

                            <div className='group-info-buttons'>
                                <div
                                    className={
                                        this.isMember()
                                            ? 'group-info-members group-info-members-isMember'
                                            : 'group-info-members'
                                    }
                                >
                                    <p>
                                        {this.state.group.membersCount > 1
                                            ? this.state.group.membersCount +
                                              ' Members'
                                            : this.state.group.membersCount +
                                              ' Member'}
                                    </p>
                                    <span>
                                        <img
                                            style={{}}
                                            src={
                                                pictureHelper[
                                                    this.state.group.interest
                                                ]
                                            }
                                            title={this.state.group.interest}
                                            alt=''
                                        />
                                    </span>
                                </div>

                                {!this.isMember() ? (
                                    <div
                                        className='group-info-button'
                                        onClick={this.joinGroup}
                                    >
                                        Join
                                    </div>
                                ) : null}
                                {this.isMember() && !this.isCreator() ? (
                                    <div
                                        className='group-info-button'
                                        onClick={this.leaveGroup}
                                    >
                                        Leave
                                    </div>
                                ) : null}
                                {this.isCreator() ? (
                                    <div className='group-info-button'>
                                        <Link
                                            to={`/group/${this.state.group.groupId}/edit`}
                                        >
                                            Edit Details
                                        </Link>
                                    </div>
                                ) : null}
                                {this.isCreator() ? (
                                    <div
                                        className='group-info-button'
                                        onClick={this.deleteGroup}
                                    >
                                        Delete
                                    </div>
                                ) : null}
                            </div>
                        </div>

                        {this.isMember() ? (
                            <div className='group-center'>
                                <NewPost
                                    createPost={this.createPost}
                                    section={{
                                        type: 'groups',
                                        id: this.state.group._id,
                                    }}
                                    notGeneral={true}
                                />

                                <Feed
                                    posts={this.state.posts}
                                    editPost={this.props.editPost}
                                    deletePost={this.deletePost}
                                    showPopup={this.props.showPopup}
                                    changeKudos={this.changeKudos}
                                    notGeneral={true}
                                    createComment={this.createComment}
                                    openPictureViewer={
                                        this.props.openPictureViewer
                                    }
                                />
                            </div>
                        ) : (
                            <div className='group-center'>
                                You're not a member of this group. <br />
                                <br />
                                Join to view the Feed!
                            </div>
                        )}

                        <div className='group-right-sidebar'>
                            <h2>E V E N T S</h2>

                            {this.isCreator() ? (
                                <Link
                                    to={
                                        '/createEvent/' +
                                        this.state.group.groupId
                                    }
                                    className='home-create-event-button'
                                    title='Create Event'
                                >
                                    <MdAdd />
                                </Link>
                            ) : null}

                            <EventsSideBar
                                events={this.state.events}
                                title='Group Events'
                            />
                        </div>
                    </div>
                );
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        userSignedIn: state.auth.userSignedIn,
        user: state.auth.user,
    };
};

export default withRouter(connect(mapStateToProps, {})(Group));
