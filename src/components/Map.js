/**
 * =====================================
 * REACT COMPONENT CLASS
 * =====================================
 * @date created: 13 October 2019
 * @authors: Jay Parikh
 *
 * This file defines the Map component. The class Map
 * is where the component is defined.
 *
 * This is a component defined for reusability.
 *
 * This component defines the map that is seen in Events page.
 *
 */

// Importing libraries for setup
import React from 'react';
import {
    GoogleMap,
    InfoWindow,
    Marker,
    withGoogleMap,
    withScriptjs,
} from 'react-google-maps';
import Autocomplete from 'react-google-autocomplete';
import Geocode from 'react-geocode';

const keysConfig = require('../config/keys');

// Setting up Geocode
Geocode.setApiKey(keysConfig.google.apiKey);

Geocode.enableDebug();

class Map extends React.Component {
    // Map constructor
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            city: '',
            area: '',
            state: '',
            mapPosition: {
                lat: this.props.location.lat,
                lng: this.props.location.lng,
            },
            markerPosition: {
                lat: this.props.location.lat,
                lng: this.props.location.lng,
            },
        };
    }

    // Get the current address from the default map position and set those values in the state.
    componentDidMount() {
        Geocode.fromLatLng(
            this.state.mapPosition.lat,
            this.state.mapPosition.lng
        ).then(
            (response) => {
                const address = response.results[0].formatted_address,
                    addressArray = response.results[0].address_components,
                    city = this.getCity(addressArray),
                    area = this.getArea(addressArray),
                    state = this.getState(addressArray);

                this.setState({
                    address: address ? address : '',
                    area: area ? area : '',
                    city: city ? city : '',
                    state: state ? state : '',
                });
            },
            (error) => {
                console.error(error);
            }
        );
    }

    // Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
    shouldComponentUpdate(nextProps, nextState) {
        if (
            this.state.markerPosition.lat !== this.props.location.lat ||
            this.state.address !== nextState.address ||
            this.state.city !== nextState.city ||
            this.state.area !== nextState.area ||
            this.state.state !== nextState.state
        ) {
            return true;
        } else if (this.props.location.lat === nextProps.location.lat) {
            return false;
        }
    }

    // Get the city and set the city input value to the one selected
    getCity = (addressArray) => {
        let city = '';
        for (let i = 0; i < addressArray.length; i++) {
            if (
                addressArray[i].types[0] &&
                'administrative_area_level_2' === addressArray[i].types[0]
            ) {
                city = addressArray[i].long_name;
                return city;
            }
        }
    };

    // Get the area and set the area input value to the one selected
    getArea = (addressArray) => {
        let area = '';
        for (let i = 0; i < addressArray.length; i++) {
            if (addressArray[i].types[0]) {
                for (let j = 0; j < addressArray[i].types.length; j++) {
                    if (
                        'sublocality_level_1' === addressArray[i].types[j] ||
                        'locality' === addressArray[i].types[j]
                    ) {
                        area = addressArray[i].long_name;
                        return area;
                    }
                }
            }
        }
    };

    // Get the address and set the address input value to the one selected
    getState = (addressArray) => {
        let state = '';
        for (let i = 0; i < addressArray.length; i++) {
            for (let i = 0; i < addressArray.length; i++) {
                if (
                    addressArray[i].types[0] &&
                    'administrative_area_level_1' === addressArray[i].types[0]
                ) {
                    state = addressArray[i].long_name;
                    return state;
                }
            }
        }
    };

    // And function for city,state and address input
    onChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    // This Event triggers when the marker window is closed
    onInfoWindowClose = (event) => {};

    // When the marker is dragged you get the lat and long using the functions available from event object.
    // Use geocode to get the address, city, area and state from the lat and lng positions.
    // And then set those values in the state.
    onMarkerDragEnd = (event) => {
        let newLat = event.latLng.lat(),
            newLng = event.latLng.lng();
        Geocode.fromLatLng(newLat, newLng).then(
            (response) => {
                const address = response.results[0].formatted_address,
                    addressArray = response.results[0].address_components,
                    city = this.getCity(addressArray),
                    area = this.getArea(addressArray),
                    state = this.getState(addressArray);
                this.setState({
                    address: address ? address : '',
                    area: area ? area : '',
                    city: city ? city : '',
                    state: state ? state : '',
                    markerPosition: {
                        lat: newLat,
                        lng: newLng,
                    },
                });
                this.props.handleMarkerPositionChange(newLat, newLng);
            },
            (error) => {
                console.error(error);
            }
        );
    };

    // When the user types an address in the search box
    onPlaceSelected = (place) => {
        const address = place.formatted_address,
            addressArray = place.address_components,
            city = this.getCity(addressArray),
            area = this.getArea(addressArray),
            state = this.getState(addressArray),
            latValue = place.geometry.location.lat(),
            lngValue = place.geometry.location.lng();
        // Set these values in the state.
        this.setState({
            address: address ? address : '',
            area: area ? area : '',
            city: city ? city : '',
            state: state ? state : '',
            markerPosition: {
                lat: latValue,
                lng: lngValue,
            },
            mapPosition: {
                lat: latValue,
                lng: lngValue,
            },
        });
        this.props.handleMarkerPositionChange(latValue, lngValue);
    };

    AsyncMap = withScriptjs(
        withGoogleMap((props) => (
            <GoogleMap
                google={this.props.google}
                defaultZoom={this.props.zoom}
                defaultCenter={{
                    lat: this.state.mapPosition.lat,
                    lng: this.state.mapPosition.lng,
                }}
            >
                <Autocomplete
                    style={{
                        width: '50vw',
                        margin: 'auto',
                        visibility: this.props.fixed ? 'hidden' : 'visible',
                    }}
                    onPlaceSelected={this.onPlaceSelected}
                    types={[]}
                    componentRestrictions={{ country: 'au' }}
                />

                <Marker
                    google={this.props.google}
                    name={'Dolores park'}
                    draggable={this.props.fixed ? false : true}
                    onDragEnd={this.onMarkerDragEnd}
                    position={{
                        lat: this.state.markerPosition.lat,
                        lng: this.state.markerPosition.lng,
                    }}
                />

                <InfoWindow
                    onClose={this.onInfoWindowClose}
                    position={{
                        lat: this.state.markerPosition.lat + 0.0018,
                        lng: this.state.markerPosition.lng,
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

    // Render method for Map
    render() {
        if (this.props.location && this.props.location.lat !== undefined) {
            return (
                <div>
                    <this.AsyncMap
                        googleMapURL={keysConfig.google.mapUrl}
                        loadingElement={<div style={{ height: `85%` }} />}
                        containerElement={
                            <div style={{ height: this.props.height }} />
                        }
                        mapElement={<div style={{ height: `85%` }} />}
                    />
                    <div>
                        <div className='form-group'>
                            <label htmlFor='city'>City: </label>
                            <input
                                type='text'
                                name='city'
                                id='city'
                                className='form-control'
                                onChange={this.onChange}
                                readOnly='readOnly'
                                value={this.state.city}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='area'>Area: </label>
                            <input
                                type='text'
                                name='area'
                                id='area'
                                className='form-control'
                                onChange={this.onChange}
                                readOnly='readOnly'
                                value={this.state.area}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='state'>State: </label>
                            <input
                                type='text'
                                name='state'
                                id='state'
                                className='form-control'
                                onChange={this.onChange}
                                readOnly='readOnly'
                                value={this.state.state}
                            />
                        </div>
                        <div className='form-group'>
                            <label htmlFor='address'>Address: </label>
                            <input
                                type='text'
                                name='address'
                                id='address'
                                className='form-control'
                                onChange={this.onChange}
                                readOnly='readOnly'
                                value={this.state.address}
                            />
                        </div>
                    </div>
                </div>
            );
        } else {
            return <div style={{ height: this.props.height }} />;
        }
    }
}

export default Map;
