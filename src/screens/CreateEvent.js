/**
 * =====================================
 * REACT SCREEN COMPONENT CLASS
 * =====================================
 * @date created: 14 October 2019
 * @authors: Jay Parikh, Waqas Rehmani
 *
 * This file defines the Create Event screen component. The class CreateEvent
 * is where the component is defined. This is a screen component.
 *
 * It contains the form that user can fill to create an event.
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';
import Map from '../components/Map';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

class CreateEvent extends Component {
    constructor(props) {
        super(props);

        let fromGroups = '';

        if (this.props.match.params.groupId)
            fromGroups = this.props.match.params.groupId;

        this.state = {
            eventId: '',
            name: '',
            owner: '',
            groupEvent: fromGroups,
            time: Date.now(),
            eventType: '',
            location: {
                lat: -37.791,
                lng: 144.961,
            },
            description: '',
            attending: [],
            interested: [],
        };
    }

    // Sets new latitude and longitude when location of marker on the map is changed.
    handleMarkerPositionChange = (latitude, longitude) => {
        this.setState({
            location: {
                lat: latitude,
                lng: longitude,
            },
        });
    };

    // Handles (stores) changes in any of the fields and displays them
    handleChange = () => {
        this.setState({
            name: this.name.value,
            time: Date.parse(this.time.value),
            eventType: this.eventType.value,
            description: this.description.value,
        });
    };

    // Invokes the create event API call.
    createEvent = (e) => {
        e.preventDefault();
        let newEvent = this.state;
        newEvent.eventId = 'e' + Math.floor(Math.random() * 100000).toString();
        newEvent.owner = this.props.userId;
        newEvent.attending = [...newEvent.attending, this.props.userId];
        this.props.createEvent(newEvent).then((res) => {
            this.setState({
                eventId: '',
                name: '',
                eventType: '',
                description: '',
                location: {
                    lat: -37.791,
                    lng: 144.961,
                },
            });
            this.props.showPopup(
                'Event is created! Go to event homepage to view it!',
                'Go',
                '/events/' + newEvent.eventId
            );
        });
    };

    render() {
        if (this.props.userSignedIn) {
            return (
                <div className='create-event-container'>
                    <h2>Create Event</h2>

                    <form onSubmit={this.createEvent}>
                        <div className='create-event-container-section'>
                            <label>Event Name: </label>
                            <input
                                ref={(val) => (this.name = val)}
                                onChange={this.handleChange}
                                required
                            />
                        </div>

                        <div className='create-event-container-section'>
                            <label>Owner: </label>
                            <input
                                value={this.props.userId}
                                readOnly='readOnly'
                            />
                        </div>

                        <div className='create-event-container-section'>
                            <label>Date of Event: </label>
                            <input
                                type='datetime-local'
                                ref={(val) => (this.time = val)}
                                onChange={this.handleChange}
                                required
                            />
                        </div>

                        <div className='create-event-container-section'>
                            <label>Type of Event:</label>
                            <select
                                ref={(val) => (this.eventType = val)}
                                onChange={this.handleChange}
                            >
                                <option value='Running'>Running</option>
                                <option value='Walking'>Walking</option>
                                <option value='Football'>Football</option>
                                <option value='Badminton'>Badminton</option>
                                <option value='Cycling'>Cycling</option>
                                <option value='Gym'>Gym</option>
                                <option value='Swimming'>Swimming</option>
                                <option value='Tennis'>Tennis</option>
                                <option value='Yoga'>Yoga</option>
                            </select>
                        </div>

                        <div className='create-event-container-section'>
                            <label>Event Description:</label>
                            <textarea
                                placeholder={'Type you description here'}
                                rows='4'
                                cols='38'
                                ref={(val) => (this.description = val)}
                                onChange={this.handleChange}
                                required
                            />
                        </div>

                        <div id='create-event-map'>
                            <Map
                                google={this.props.google}
                                location={this.state.location}
                                handleMarkerPositionChange={
                                    this.handleMarkerPositionChange
                                }
                                height='500px'
                                zoom={15}
                                fixed={false}
                            ></Map>
                        </div>

                        <button>Create Event</button>
                    </form>
                </div>
            );
        } else {
            return (
                <div className='home-container-no-user'>
                    <h2>You must login to create an event</h2>
                    <div>
                        <Link to='/signInUser'>Log In</Link>
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
        userId: state.auth.user.userId,
    };
};

export default withRouter(connect(mapStateToProps, { })(CreateEvent));
