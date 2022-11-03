import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {
    getTeam,
    eventUpload,
    getActivityByTitle,
    teamEventAdd,
    getServerUrl,
} from '../utils/api';
import profileBlank from '../assets/profile_blank.png';

class CreateTeamEvent extends Component {
    constructor(props) {
        super(props);

        this.state = {
            team: {},
            title: '',
            startDate: '',
            endDate: '',
            startTime: '',
            endTime: '',
            description: '',
            location: '',
            interestValue: '',
            logo: '',
        };

        this.uploadEventLogoRef = React.createRef();
    }

    componentDidMount() {
        if (this.props.userSignedIn) {
            getTeam(this.props.match.params.teamSlug).then((res) => {
                if (res.success) {
                    this.setState(
                        {
                            team: res.team
                        }
                    );
                }
            });
        }
    }

    handleChange = (field) => (e) => {
        this.setState({ [field]: e.target.value });
    };

    openUploadEventLogo = () => {
        this.uploadEventLogoRef.current.click();
    };

    uploadEventLogo = () => {
        let eventLogo = this.uploadEventLogoRef.current.files[0];
        let fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        if (eventLogo === undefined) {
            alert('Please select image file to upload');
        } else if (fileTypes.indexOf(eventLogo.type) === -1) {
            alert('Please select file type of JPEG, JPG, PNG or GIF');
        } else {
            const Imagedata = new FormData();
            Imagedata.append('eventUpload', eventLogo);
            eventUpload(Imagedata).then((imgUpload) => {
                this.setState({ logo: imgUpload.filename });
            });
        }
    };

    createEvent = async (e) => {
        e.preventDefault();

        // convert title to slug
        const slug = this.state.title.toLowerCase().replace(/ /g, '-');
        let event = {
            creatorId: this.props.user._id,
            title: this.state.title,
            slug,
            startDate: this.state.startDate,
            endDate: this.state.endDate,
            startTime: this.state.startTime,
            endTime: this.state.endTime,
            description: this.state.description,
            location: this.state.location,
            teamId: this.state.team._id,
            interest: {},
            logo: this.state.logo,
        };

        // get interest data
        if (this.state.interestValue) {
            await getActivityByTitle(this.state.interestValue).then(
                (activity) => {
                    if (activity._id) {
                        event.interest = {
                            id: activity._id,
                            name: activity.title,
                            icon: activity.activity_icon,
                        };
                    }
                }
            );
        }

        await teamEventAdd(event).then((res) => {
            if (res.success) {
                this.props.history.push(
                    `/team/${this.props.match.params.teamSlug}`
                );
            }
        });
    };

    render() {
        return (
            <div className='main-container createnew'>
                <h3>Create Event</h3>
                <div className='userthumb'>
                    <span className='userbx'>
                        <img
                            src={
                                this.props.user.profilePicture
                                    ? `${getServerUrl().apiURL}/uploads/user/${
                                          this.props.user.profilePicture
                                      }`
                                    : profileBlank
                            }
                        />
                    </span>
                    <span>{`${this.props.user.firstName} ${this.props.user.lastName}`}</span>
                </div>
                <form onSubmit={this.createEvent}>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='teamEventTitle'>
                            Event Name
                        </label>
                        <input
                            type='text'
                            id='teamEventTitle'
                            className='form-control'
                            value={this.state.title}
                            onChange={this.handleChange('title')}
                            required
                        />
                    </div>

                    <div className='row'>
                        <div className='form-group col-6'>
                            <label
                                className='form-label'
                                htmlFor='teamEventStartDate'
                            >
                                Start Date
                            </label>
                            <input
                                type='date'
                                id='teamEventStartDate'
                                className='form-control'
                                value={this.state.startDate}
                                onChange={this.handleChange('startDate')}
                                required
                            />
                        </div>
                        <div className='form-group col-6'>
                            <label
                                className='form-label'
                                htmlFor='teamEventEndDate'
                            >
                                End Date
                            </label>
                            <input
                                type='date'
                                id='teamEventEndDate'
                                className='form-control'
                                value={this.state.endDate}
                                onChange={this.handleChange('endDate')}
                                required
                            />
                        </div>
                    </div>
                    <div className='row'>
                        <div className='form-group col-6'>
                            <label
                                className='form-label'
                                htmlFor='teamEventStartTime'
                            >
                                Start Time
                            </label>
                            <input
                                type='time'
                                id='teamEventStartTime'
                                className='form-control'
                                value={this.state.startTime}
                                onChange={this.handleChange('startTime')}
                                required
                            />
                        </div>
                        <div className='form-group col-6'>
                            <label
                                className='form-label'
                                htmlFor='teamEventEndTime'
                            >
                                End Time
                            </label>
                            <input
                                type='time'
                                id='teamEventEndTime'
                                className='form-control'
                                value={this.state.endTime}
                                onChange={this.handleChange('endTime')}
                                required
                            />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label
                            className='form-label'
                            htmlFor='formTeamDescription'
                        >
                            Description
                        </label>
                        <textarea
                            rows='3'
                            id='formTeamDescription'
                            className='form-control'
                            value={this.state.description}
                            onChange={this.handleChange('description')}
                        ></textarea>
                    </div>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='formTeamAddress'>
                            Location
                        </label>
                        <div className='search-location-input'>
                            <input
                                placeholder='Type Address'
                                type='text'
                                id='formTeamAddress'
                                className='form-control pac-target-input'
                                value={this.state.location}
                                onChange={this.handleChange('location')}
                                autoComplete='off'
                                required
                            />
                        </div>
                    </div>
                    <div className='form-group'>
                        <label
                            className='form-label'
                            htmlFor='formTeamActivityType'
                        >
                            Activity Type
                        </label>

                        <select
                            className='form-control'
                            id='formTeamActivityType'
                            onChange={this.handleChange('interestValue')}
                            value={this.state.interestValue}
                            required
                        >
                            <option value='' disabled>
                                Choose one...
                            </option>
                            <option value='Swim'>Swimming</option>
                            <option value='Run'>Running</option>
                            <option value='Strength'>Weight Lifting</option>
                            <option value='Bike'>Bike</option>
                            <option value='Flexibility'>Flexibility</option>
                            <option value='Note'>Note</option>
                            <option value='Walk'>Walking</option>
                            <option value='Recovery'>Recovery</option>
                        </select>
                    </div>

                    <div className='form-group'>
                        <a
                            className='button'
                            onClick={this.openUploadEventLogo}
                        >
                            Upload Logo
                        </a>
                        <input
                            type='file'
                            style={{ display: 'none' }}
                            ref={this.uploadEventLogoRef}
                            onChange={this.uploadEventLogo}
                        />
                    </div>

                    {this.state.logo && (
                        <div className='new-post-uploaded-image mt-1'>
                            <div onClick={() => this.setState({ logo: '' })}>
                                Click to remove
                            </div>
                            <img
                                src={
                                    getServerUrl().apiURL +
                                    '/uploads/temp/' +
                                    this.state.logo
                                }
                                style={{ width: '100%' }}
                            />
                        </div>
                    )}

                    <div className='form-group'>
                        <button type='submit' className='button subbtn'>
                            Create Event
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userSignedIn: state.auth.userSignedIn,
        user: state.auth.user,
    };
};

export default withRouter(connect(mapStateToProps, {})(CreateTeamEvent));
