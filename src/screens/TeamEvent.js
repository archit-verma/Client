import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import Geocode from 'react-geocode';
import { getTeamEventBySlug, getServerUrl } from '../utils/api';
import { assignTimeAgo, formatDateTime } from '../utils/helper';

import Map from '../components/Map';

import profileBlank from '../assets/profile_blank.png';
import loading from '../assets/loading.svg';

const keysConfig = require('../config/keys');

// Setting up Geocode
Geocode.setApiKey(keysConfig.google.apiKey);
Geocode.enableDebug();

class TeamEvent extends Component {
    state = {
        event: {
            title: '',
            description: '',
            start: '',
            end: '',
            location: '',
            logo: '',
            attending: [],
            interested: [],
            interest: {
                icon: '',
            },
            time: Date.now(),
        },
        creator: {
            userId: '',
            firstName: '',
            lastName: '',
            profilePicture: '',
        },
        loading: true,
        address: {
            lat: -37.791,
            lng: 144.961,
        },
    };

    componentDidMount() {
        getTeamEventBySlug(this.props.match.params.teamEventSlug).then(
            async (res) => {
                res.creator && this.setState({ creator: res.creator });
                res.event && this.setState({ event: res.event });
                res.event.location &&
                    (await Geocode.fromAddress(res.event.location)
                        .then((response) => {
                            const { lat, lng } =
                                response.results[0].geometry.location;

                            console.log('lat = ' + lat);

                            this.setState({
                                address: { lat, lng },
                            });
                        })
                        .catch((error) => {
                            console.error(error);
                        }));

                this.setState({ loading: false });
            }
        );
    }

    render() {
        const { event, creator } = this.state;

        if (this.state.loading) {
            return (
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
            <div className='srchpstbx postbx bxshadow'>
                <div className='usrtop'>
                    <div className='row'>
                        <div className='col-6'>
                            <div className='userthumb'>
                                <a className='userbx'>
                                    <img
                                        src={
                                            creator.profilePicture
                                                ? `${
                                                      getServerUrl().apiURL
                                                  }/uploads/user/${
                                                      creator.profilePicture
                                                  }`
                                                : profileBlank
                                        }
                                    />
                                </a>
                                <div>
                                    {`${creator.firstName} ${creator.lastName}`}
                                    <span className='small pstim'>
                                        {assignTimeAgo(event.time)}
                                    </span>
                                </div>
                            </div>
                        </div>
                        {event.interest && event.interest.icon && (
                            <div className='col-6'>
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
                <h4 className='mt-3 mb-3'>{event.title}</h4>
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
                <p>
                    <span className='f14'>
                        <img src='/uploads/images/people.png' />
                        {event.attending.length} People Attending
                    </span>
                </p>
                <p>
                    <span className='f14'>
                        <img src='/uploads/images/people.png' />
                        {event.interested.length} People Interested
                    </span>
                </p>
                <a href='' className='btn grnbtn w100 f14'>
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
                <div class='dtacontrl'>
                    <h4 class='mt-4'>Event Details</h4>
                    <p class='f14'>{event.description}</p>
                    <h4 class='mt-3 mb-3'>Event Location</h4>
                    <p class='mb-0'>
                        <Map
                            google={this.props.google}
                            location={this.state.address}
                            height='500px'
                            zoom={15}
                            fixed={true}
                        ></Map>
                    </p>
                </div>
            </div>
        );
    }
}

export default withRouter(TeamEvent);
