import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { getUser, getServerUrl } from '../utils/api';

class UserPhotos extends Component {
    state = {
        photos: [],
    };

    componentDidMount() {
        getUser(this.props.match.params.userid, this.props.token).then(
            (user) => {
                if (user.userId) {
                    this.setState({ photos: user.photos });
                }
            }
        );
    }

    render() {
        return (
            <>
                <div className='teams-container'>
                    <a
                        onClick={() =>
                            this.props.history.push(
                                '/profile/' + this.props.match.params.userid
                            )
                        }
                        className='backbtn'
                    >
                        {' '}
                    </a>
                    <h6>Photos</h6>
                </div>

                <div className='usrphto'>
                    <div className='phtoglry'>
                        <div className='row'>
                            {this.state.photos.map((photo, index) => (
                                <div
                                    key={`photo-${photo}-${index}`}
                                    className='col-4 nopad'
                                >
                                    <img
                                        src={`${
                                            getServerUrl().apiURL
                                        }/uploads/user/${photo}`}
                                    />
                                </div>
                            ))}

                            <div className='col-12 mt-2'>
                                <a
                                    className='btnbig'
                                    onClick={() =>
                                        this.props.history.push(
                                            '/profile/' +
                                                this.props.match.params.userid
                                        )
                                    }
                                    style={{ cursor: 'pointer' }}
                                >
                                    Go Back to Profile
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
    };
};

export default withRouter(connect(mapStateToProps, {})(UserPhotos));
