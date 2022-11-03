/**
 * =====================================
 * REACT SCREEN COMPONENT CLASS
 * =====================================
 * @date created: 9 September 2019
 * @authors: Jay Parikh, Waqas Rehmani
 *
 * This file defines the Event screen component. The class Event
 * is where the component is defined. This is a screen component.
 *
 * This screen shows the event details.
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

// Importing other components
import NewPost from '../screens/NewPost';
import Feed from '../components/Feed';

// Importing libraries for map
import {
    GoogleMap,
    InfoWindow,
    Marker,
    withGoogleMap,
    withScriptjs,
} from 'react-google-maps';
import Geocode from 'react-geocode';
import { Redirect } from 'react-router';

// Importing helper functions
import * as API from '../utils/api';

// Importing icons and pictures
import {
    IoIosStar,
    IoIosStarOutline,
    IoMdCheckmarkCircle,
    IoMdCheckmarkCircleOutline,
} from 'react-icons/io';
import loading from '../assets/loading.svg';
import Badminton from '../assets/Badminton.svg';
import Cycling from '../assets/Cycling.svg';
import Football from '../assets/Football.svg';
import Gym from '../assets/Gym.svg';
import Running from '../assets/Running.svg';
import Swimming from '../assets/Swimming.svg';
import Tennis from '../assets/Tennis.svg';
import Walking from '../assets/Walking.svg';
import Yoga from '../assets/Yoga.svg';

const keysConfig = require('../config/keys');

Geocode.setApiKey(keysConfig.google.apiKey);
Geocode.enableDebug();

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

class Event extends Component {
    AsyncMap = withScriptjs(
        withGoogleMap((props) => (
            <GoogleMap
                google={this.props.google}
                defaultZoom={15}
                defaultCenter={{
                    lat: this.state.eventDetails.location.lat,
                    lng: this.state.eventDetails.location.lng,
                }}
            >
                <Marker
                    google={this.props.google}
                    name={'Dolores park'}
                    position={{
                        lat: this.state.eventDetails.location.lat,
                        lng: this.state.eventDetails.location.lng,
                    }}
                />

                <InfoWindow
                    position={{
                        lat: this.state.eventDetails.location.lat + 0.0018,
                        lng: this.state.eventDetails.location.lng,
                    }}
                >
                    <div>
                        <span style={{ padding: 0, margin: 0 }}>
                            {this.state.address}
                        </span>
                    </div>
                </InfoWindow>
            </GoogleMap>
        ))
    );

    constructor(props) {
        super(props);
        this.state = {
            eventDetails: {},
            address: '',
            eventPosts: [],
            loading: true,
            isShowDetails: true,
            redirect: false,
        };
    }

    componentDidMount() {
        API.getEvent(this.props.eventId).then((eventDetails) => {
            if (eventDetails.eventId) {
                API.getAllEventsPosts(eventDetails.eventId).then(
                    (eventPosts) => {
                        this.setState({
                            eventDetails,
                            eventPosts,
                            loading: false,
                        });
                        Geocode.fromLatLng(
                            eventDetails.location.lat,
                            eventDetails.location.lng
                        ).then(
                            (response) => {
                                const address =
                                    response.results[0].formatted_address;

                                this.setState({
                                    address: address ? address : '',
                                });
                            },
                            (error) => {
                                console.error(error);
                            }
                        );
                    }
                );
            }
        });
    }

    // Contains API call to create a post.
    createPost = (newPost) => {
        let promise = new Promise((resolve, reject) => {
            this.props.createPost(newPost).then((post) => {
                if (post.postId) {
                    let postToAdd = post;
                    this.setState(
                        (previousState) => {
                            let sortedPosts = previousState.eventPosts;
                            sortedPosts.push(postToAdd);
                            sortedPosts.sort(
                                (a, b) =>
                                    Date.parse(b.time) - Date.parse(a.time)
                            );
                            return {
                                eventPosts: sortedPosts,
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

    // Contains API call to delete a post.
    deletePost = (postId) => {
        let promise = new Promise((resolve, reject) => {
            this.props.deletePost(postId).then((post) => {
                if (post) {
                    this.setState(
                        (previousState) => ({
                            eventPosts: previousState.eventPosts.filter(
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

    // Contains API call to change status of kudos.
    changeKudos = (postId, kudos) => {
        let promise = new Promise((resolve, reject) => {
            this.props.changeKudos(postId, kudos).then((post) => {
                if (post.postId) {
                    this.setState(
                        (previousState) => {
                            let sortedPosts = previousState.eventPosts.filter(
                                (p) => p.postId !== postId
                            );
                            sortedPosts.push(post);
                            sortedPosts.sort(
                                (a, b) =>
                                    Date.parse(b.time) - Date.parse(a.time)
                            );
                            return {
                                eventPosts: sortedPosts,
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

    // Contains API call for creating a comment.
    createComment = (postId, postComment) => {
        let promise = new Promise((resolve, reject) => {
            this.props
                .createComment(postId, postComment, this.props.user._id)
                .then((post) => {
                    if (post.postId) {
                        this.setState(
                            (previousState) => {
                                let sortedPosts =
                                    previousState.eventPosts.filter(
                                        (p) => p.postId !== postId
                                    );
                                sortedPosts.push(post);
                                sortedPosts.sort(
                                    (a, b) =>
                                        Date.parse(b.time) - Date.parse(a.time)
                                );
                                return {
                                    eventPosts: sortedPosts,
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

    // Updates interested/going accordingly.
    editEventResponse = (responseType) => {
        let editedEvent = this.state.eventDetails;
        if (responseType === 'interested') {
            if (editedEvent.interested.includes(this.props.user.userId)) {
                editedEvent = {
                    ...editedEvent,
                    interested: editedEvent.interested.filter(
                        (i) => i !== this.props.user.userId
                    ),
                };
            } else {
                if (editedEvent.attending.includes(this.props.user.userId)) {
                    editedEvent = {
                        ...editedEvent,
                        attending: editedEvent.attending.filter(
                            (i) => i !== this.props.user.userId
                        ),
                        interested: [
                            ...editedEvent.interested,
                            this.props.user.userId,
                        ],
                    };
                } else {
                    editedEvent = {
                        ...editedEvent,
                        interested: [
                            ...editedEvent.interested,
                            this.props.user.userId,
                        ],
                    };
                }
            }
        } else {
            if (editedEvent.attending.includes(this.props.user.userId)) {
                editedEvent = {
                    ...editedEvent,
                    attending: editedEvent.attending.filter(
                        (i) => i !== this.props.user.userId
                    ),
                };
            } else {
                if (editedEvent.interested.includes(this.props.user.userId)) {
                    editedEvent = {
                        ...editedEvent,
                        interested: editedEvent.interested.filter(
                            (i) => i !== this.props.user.userId
                        ),
                        attending: [
                            ...editedEvent.attending,
                            this.props.user.userId,
                        ],
                    };
                } else {
                    editedEvent = {
                        ...editedEvent,
                        attending: [
                            ...editedEvent.attending,
                            this.props.user.userId,
                        ],
                    };
                }
            }
        }
        API.editEventResponse(
            this.state.eventDetails.eventId,
            editedEvent
        ).then((event) => {
            if (event.eventId) {
                this.setState((prevState) => ({
                    ...prevState,
                    eventDetails: event,
                }));
            }
        });
    };

    // Does API call to delete event and all the posts created within the event.
    deleteEvent = () => {
        if (window.confirm('Are you sure you wish to delete this Event?')) {
            API.deleteEvent(this.props.eventId).then(
                (res) => {
                    if (res) {
                        API.deletePostsByEvent(res.eventId).then((res) => {
                            if (res) {
                                this.props.showPopup(
                                    'Your Event was deleted.',
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

    render() {
        if (this.state.redirect) {
            return <Redirect push to='/home' />;
        }
        if (this.props.userSignedIn) {
            if (this.state.loading) {
                return (
                    <div className='profile-container-loading'>
                        <img src={loading} alt='' />
                    </div>
                );
            } else {
                return (
                    <div className='event-container'>
                        <div className='event-left-sidebar'>
                            <div className='event-map'>
                                <this.AsyncMap
                                    googleMapURL={keysConfig.google.mapUrl}
                                    loadingElement={
                                        <div style={{ height: `100%` }} />
                                    }
                                    containerElement={
                                        <div style={{ height: '30vh' }} />
                                    }
                                    mapElement={
                                        <div style={{ height: `100%` }} />
                                    }
                                />
                            </div>

                            <div className='event-time'>
                                Time:{' '}
                                {new Date(
                                    Date.parse(this.state.eventDetails.time)
                                ).getHours() +
                                    ':' +
                                    new Date(
                                        Date.parse(this.state.eventDetails.time)
                                    ).getMinutes() +
                                    ' ' +
                                    new Date(
                                        Date.parse(this.state.eventDetails.time)
                                    ).getDate() +
                                    '/' +
                                    new Date(
                                        Date.parse(this.state.eventDetails.time)
                                    ).getMonth() +
                                    '/' +
                                    new Date(
                                        Date.parse(this.state.eventDetails.time)
                                    ).getFullYear()}
                            </div>

                            {this.state.eventDetails.owner ===
                            this.props.user.userId ? (
                                <div>
                                    <div
                                        className='event-edit'
                                        onClick={() => {
                                            this.props.history.push(
                                                '/editEvent/' +
                                                    this.props.eventId
                                            );
                                        }}
                                    >
                                        Edit Event
                                    </div>
                                    <div
                                        className='event-edit'
                                        onClick={this.deleteEvent}
                                    >
                                        Delete Event
                                    </div>
                                </div>
                            ) : null}

                            <div
                                className={
                                    this.state.eventDetails.interested.includes(
                                        this.props.user.userId
                                    )
                                        ? 'event-interested-selected event-interested'
                                        : 'event-interested'
                                }
                                onClick={() => {
                                    this.editEventResponse('interested');
                                }}
                            >
                                {this.state.eventDetails.interested.includes(
                                    this.props.user.userId
                                ) ? (
                                    <IoIosStar />
                                ) : (
                                    <IoIosStarOutline />
                                )}

                                <span>Interested</span>
                                <span>
                                    {this.state.eventDetails.interested.length}
                                </span>
                            </div>

                            <div
                                className={
                                    this.state.eventDetails.attending.includes(
                                        this.props.user.userId
                                    )
                                        ? 'event-interested-selected event-interested'
                                        : 'event-interested'
                                }
                                onClick={() => {
                                    this.editEventResponse('attending');
                                }}
                            >
                                {this.state.eventDetails.attending.includes(
                                    this.props.user.userId
                                ) ? (
                                    <IoMdCheckmarkCircle />
                                ) : (
                                    <IoMdCheckmarkCircleOutline />
                                )}

                                <span>Going</span>
                                <span>
                                    {this.state.eventDetails.attending.length}
                                </span>
                            </div>

                            <div className='event-time'>
                                <label> Event by: </label>

                                <Link
                                    to={
                                        '/profile/' +
                                        this.state.eventDetails.owner
                                    }
                                >
                                    {' ' + this.state.eventDetails.owner}
                                </Link>
                            </div>

                            {this.state.eventDetails.groupEvent !== '' ? (
                                <div className='event-time'>
                                    <label> Group: </label>

                                    <Link
                                        to={
                                            '/group/' +
                                            this.state.eventDetails.groupEvent
                                        }
                                    >
                                        {' ' +
                                            this.state.eventDetails.groupEvent}
                                    </Link>
                                </div>
                            ) : null}

                            <div className='event-time' title='About the event'>
                                <p> {this.state.eventDetails.description}</p>
                            </div>
                        </div>

                        <div className='event-center'>
                            <div className='event-top-info'>
                                <div>
                                    <h1> {this.state.eventDetails.name}</h1>
                                </div>

                                <span>
                                    <img
                                        style={{}}
                                        src={
                                            pictureHelper[
                                                this.state.eventDetails
                                                    .eventType
                                            ]
                                        }
                                        title={
                                            this.state.eventDetails.eventType
                                        }
                                        alt=''
                                    />
                                </span>
                            </div>

                            <div className='event-cover-photo'>
                                {this.state.eventDetails.eventAsset === '' ? (
                                    <div
                                        className='event-cover-photo-blank'
                                        onClick={() => {
                                            this.props.history.push(
                                                '/editEvent/' +
                                                    this.props.eventId
                                            );
                                        }}
                                    >
                                        Add a cover Photo!
                                        <h1>+</h1>
                                    </div>
                                ) : (
                                    <img
                                        src={this.state.eventDetails.eventAsset}
                                        onClick={() =>
                                            this.props.openPictureViewer(
                                                this.state.eventDetails
                                                    .eventAsset
                                            )
                                        }
                                        style={{ cursor: 'pointer' }}
                                        alt=''
                                    />
                                )}
                            </div>

                            <NewPost
                                createPost={this.createPost}
                                section={{
                                    type: 'events',
                                    id: this.state.eventDetails.eventId,
                                }}
                                notGeneral={true}
                            />
                            <Feed
                                posts={this.state.eventPosts}
                                editPost={this.props.editPost}
                                deletePost={this.deletePost}
                                showPopup={this.props.showPopup}
                                notGeneral={true}
                                changeKudos={this.changeKudos}
                                createComment={this.createComment}
                                openPictureViewer={this.props.openPictureViewer}
                            />
                        </div>
                    </div>
                );
            }
        } else {
            return (
                <div className='home-container-no-user'>
                    <h2>You must login to see events</h2>
                    <div>
                        <Link to='/signInUser'>Log In</Link>
                        <Link to='/signupUser'>SignUp</Link>
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

export default withRouter(connect(mapStateToProps, {})(Event));
