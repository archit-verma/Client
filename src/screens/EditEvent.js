/**
 * =====================================
 * REACT SCREEN COMPONENT CLASS
 * =====================================
 * @date created: 18 October 2019
 * @authors: Jay Parikh
 *
 * This file defines the EditEvent screen component. The class EditEvent
 * is where the component is defined. This is a screen component.
 *
 * It contains the form that user can fill to edit an event.
 *
 */

// Importing libraries for setup
import React, {Component} from 'react'
import {Link} from "react-router-dom";
import axios from "axios";
import {connect} from 'react-redux';

// Importing icons and pictures
import loading from "../assets/loading.svg";
import {MdPhotoCamera} from "react-icons/md";

// Importing other components
import Map from "../components/Map";

// Importing helper functions
import * as API from "../utils/api";
import {fileToBase64} from "../utils/helper";

class EditEvent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            time: Date.now(),
            eventType: '',
            location: {
                lat: 0,
                lng: 0
            },
            description: '',
            loading: true,
            uploadedImage: '',
            file: null,

            updateLoading: false,
        }
    }

    componentDidMount() {
        API.getEvent(this.props.eventId).then(eventDetails => {
            if (eventDetails.eventId) {

                this.setState({
                    name: eventDetails.name,
                    time: this.dateConvert(eventDetails.time),
                    eventType: eventDetails.eventType,
                    location: {
                        lat: eventDetails.location.lat,
                        lng: eventDetails.location.lng
                    },
                    description: eventDetails.description,
                    loading: false,
                    uploadedImage: eventDetails.eventAsset
                })
            }
        })
    }

    // Sets new latitude and longitude when location of marker on the map is changed.
    handleMarkerPositionChange = (latitude, longitude) => {
        this.setState({
            location: {
                lat: latitude,
                lng: longitude
            }
        })
    };

    // Handles (stores) changes in any of the fields and displays them
    handleChange = () => {
        this.setState({
            name: this.name.value,
            time: this.time.value,
            eventType: this.eventType.value,
            description: this.description.value,
        })
    };

    // Convert date to useful format.
    dateConvert = (dateInput) => {
        let tempDate = new Date(dateInput);
        let result = tempDate.getFullYear();
        if (tempDate.getMonth() < 10) {
            result = result + '-0' + (tempDate.getMonth() + 1)
        } else {
            result = result + '-' + (tempDate.getMonth() + 1)
        }
        if (tempDate.getDate() < 10) {
            result = result + '-0' + tempDate.getDate()
        } else {
            result = result + '-' + tempDate.getDate()
        }
        result = result + 'T';
        if (tempDate.getHours() < 10) {
            result = result + '0' + tempDate.getHours()
        } else {
            result = result + '' + tempDate.getHours()
        }
        if (tempDate.getMinutes() < 10) {
            result = result + ':0' + tempDate.getMinutes()
        } else {
            result = result + ':' + tempDate.getMinutes()
        }
        return result
    };

    // Invokes the edit event API call.
    editEvent = (e) => {
        e.preventDefault();

        this.setState({
            updateLoading: true
        }, () => {
            let newEvent = {
                name: this.state.name,
                eventType: this.state.eventType,
                location: this.state.location,
                description: this.state.description,
            };
            newEvent.time = Date.parse(this.state.time);

            if (this.state.file !== null) {

                const data = new FormData();

                data.append('eventId', this.props.eventId);
                data.append('file', this.state.file);

                axios.put(API.getServerUrl().apiURL+"/events/" + this.props.eventId + "/coverPicture", data).then(res => {

                    if (res.status === 200) {
                        this.props.editEvent(this.props.eventId, newEvent).then(res => {
                            this.setState({updateLoading: false});
                            this.props.showPopup('Event updated!', 'Go to Event Page', '/events/' + this.props.eventId)
                        });
                    }
                });

            } else {
                this.props.editEvent(this.props.eventId, newEvent).then(res => {
                    this.setState({updateLoading: false});
                    this.props.showPopup('Event updated!', 'Go to Event Page', '/events/' + this.props.eventId)
                });
            }


        })


    };

    // Allows user to add an image for the event.
    handleChangePhoto = (e) => {
        this.setState({
            file: e.target.files[0]
        }, () => {
            fileToBase64(this.state.file)
                .then(res => {
                    this.setState({
                        uploadedImage: res,
                        pictureLoading: false
                    })
                })
        })
    };

    // Render method for EditEvent
    render() {
        if (this.props.userSignedIn) {
            if (this.state.loading) {
                return (
                    <div className='profile-container-loading'>
                        <img src={loading} alt="" />
                    </div>
                )
            } else {
                let pictureExists = true;
                if (this.state.uploadedImage === '') {
                    pictureExists = false
                }
                return (
                    <div className='create-event-container'>

                        {
                            this.state.updateLoading
                                ?
                                <div className='signup-user-container-login'>
                                    <img src={loading} alt="" />
                                </div>
                                :
                                null
                        }


                        <h2>Edit Event</h2>

                        <form onSubmit={this.editEvent}>

                            <div className='create-event-container-section'>
                                <label>Event Name: </label>
                                <input ref={(val) => this.name = val} onChange={this.handleChange}
                                       value={this.state.name} required/>
                            </div>

                            <div className='create-event-container-section'>
                                <label>Date of Event: </label>
                                <input type='datetime-local' ref={(val) => this.time = val} onChange={this.handleChange}
                                       value={this.state.time} required/>
                            </div>

                            <div className='create-event-container-section'>
                                <label>Profile Picture:</label>
                                <div id='edit-event-picture'>
                                    <label className="new-post-container-buttons-photo">
                                        <MdPhotoCamera/>
                                        <input type="file" accept=".jpg,.png" onChange={this.handleChangePhoto}/>
                                        Upload Photo
                                    </label>
                                    {
                                        pictureExists
                                            ?
                                            <div
                                                id={this.state.pictureLoading ? 'edit-event-picture-img-loading' : 'edit-event-picture-img-loaded'}
                                            >
                                                <img
                                                    src={this.state.uploadedImage}
                                                    alt='Profile Pic'
                                                />
                                            </div>

                                            :

                                            <div
                                                id={'edit-event-picture-empty'}
                                            >
                                                Upload a photo!
                                            </div>

                                    }
                                </div>
                            </div>

                            <div className='create-event-container-section'>
                                <label>
                                    Type of Event:
                                </label>
                                <select ref={(val) => this.eventType = val} onChange={this.handleChange}
                                        value={this.state.eventType}>
                                    <option value="Running">Running</option>
                                    <option value="Walking">Walking</option>
                                    <option value="Football">Football</option>
                                    <option value="Badminton">Badminton</option>
                                    <option value="Cycling">Cycling</option>
                                    <option value="Gym">Gym</option>
                                    <option value="Swimming">Swimming</option>
                                    <option value="Tennis">Tennis</option>
                                    <option value="Yoga">Yoga</option>
                                </select>
                            </div>

                            <div className='create-event-container-section'>
                                <label>
                                    Event Description:
                                </label>
                                <textarea
                                    placeholder={"Type you description here"}
                                    rows="4" cols="38"
                                    ref={(val) => this.description = val}
                                    value={this.state.description}
                                    onChange={this.handleChange}
                                    required
                                />
                            </div>


                            <div id='create-event-map'>

                                <Map
                                    google={this.props.google}
                                    location={this.state.location}
                                    handleMarkerPositionChange={this.handleMarkerPositionChange}
                                    height='500px'
                                    zoom={15}
                                >
                                </Map>

                            </div>

                            <button>Edit Event</button>

                        </form>
                    </div>
                )
            }
        } else {
            return (
                <div className='home-container-no-user'>
                    <h2>You must login to create an event</h2>
                    <div>
                        <Link to='/signInUser'>Log In</Link>
                        <Link to='/signupUser'>Sign Up</Link>
                    </div>
                </div>
            )
        }
    }
}

const mapStateToProps = state => {
	return {
		userSignedIn: state.auth.userSignedIn
	};
};

export default connect(mapStateToProps, {})(EditEvent);