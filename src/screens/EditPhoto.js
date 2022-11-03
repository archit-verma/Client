import React, { Component, createRef } from 'react';
import axios from 'axios';
import { withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import { updateUserProfile } from '../actions';
import { profileUpload, profileUpdate, getServerUrl } from '../utils/api';

class EditPhoto extends Component {
    constructor(props) {
        super(props);

        this.state = {
            uploadedImages: [],
            uploadedImagesDateNow: [],
            selectedImg: '',
            redirect: false,
        };

        this.uploadProfilePicRef = createRef();
    }

    componentDidMount() {
        this.recoverUploadedImgs();
    }

    recoverUploadedImgs = () => {
        let uploadedImages = JSON.parse(localStorage.getItem('uploadedImages'));
        let uploadedImagesDateNow = JSON.parse(
            localStorage.getItem('uploadedImagesDateNow')
        );

        // check if the profile picture is within the uploaded imgs
        if (uploadedImages) {
            uploadedImages.forEach((img) => {
                if (this.props.user.profilePicture === img) {
                    this.setState({
                        selectedImg: img,
                    });
                }
            });
        }

        this.setState({
            uploadedImages: uploadedImages ? uploadedImages : [],
            uploadedImagesDateNow: uploadedImagesDateNow
                ? uploadedImagesDateNow
                : [],
        });
    };

    saveToStorage = (input, dateNow) => {
        let uploadedImages = [input, ...this.state.uploadedImages];
        let uploadedImagesDateNow = [
            dateNow,
            ...this.state.uploadedImagesDateNow,
        ];

        this.setState({
            uploadedImages,
            uploadedImagesDateNow,
        });

        localStorage.setItem('uploadedImages', JSON.stringify(uploadedImages));
        localStorage.setItem(
            'uploadedImagesDateNow',
            JSON.stringify(uploadedImagesDateNow)
        );
    };

    handleImgSelection = (selectedImg) => {
        if (selectedImg === this.state.selectedImg) {
            this.setState({ selectedImg: '' });
        } else {
            this.setState({
                selectedImg,
            });
        }
    };

    openUploadProfilePic = () => {
        this.uploadProfilePicRef.current.click();
    };

    uploadProfilePic = () => {
        let profilePic = this.uploadProfilePicRef.current.files[0];
        let fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        if (profilePic === undefined) {
            alert('Please select image file to upload');
        } else if (fileTypes.indexOf(profilePic.type) === -1) {
            alert('Please select file type of JPEG, JPG, PNG or GIF');
        } else {
            const dateNow = Date.now();
            const imageData = new FormData();
            imageData.append('mediaDateNow', dateNow);
            imageData.append('profileUpload', profilePic);

            profileUpload(imageData).then((imgUpload) => {
                this.saveToStorage(imgUpload.filename, dateNow);
            });
        }
    };

    updateProfilePic = async (index) => {
        const config = { responseType: 'blob' };
        await axios
            .get(
                `${getServerUrl().apiURL}/uploads/temp/${
                    this.state.selectedImg
                }`,
                config
            )
            .then((response) => {
                const filename = this.state.selectedImg.replace(
                    this.state.uploadedImagesDateNow[index],
                    ''
                );
                return new File([response.data], filename);
            })
            .then((file) => {
                const imageData = new FormData();

                imageData.append(
                    'mediaDateNow',
                    this.state.uploadedImagesDateNow[index]
                        ? this.state.uploadedImagesDateNow[index]
                        : Date.now()
                );
                imageData.append('profileUpdate', file);

                profileUpdate(imageData);
            });
    };

    handleSubmit = (e) => {
        e.preventDefault();

        let edited = this.props.user;

        edited.profilePicture = this.state.selectedImg;

        this.props.updateUserProfile({
            userId: this.props.user.userId,
            token: this.props.token,
            certificate: '',
            edited,
        });

        this.setState({ redirect: true });
    };

    render() {
        if (this.state.redirect && this.props.redirect) {
            return <Redirect to={this.props.redirect} />;
        }

        return (
            <>
                <div className='teams-container'>
                    <a
                        onClick={() => window.history.back()}
                        className='backbtn'
                    >
                        {' '}
                    </a>
                    <h6>
                        Profile Photo
                        {this.state.selectedImg ? (
                            <form onSubmit={this.handleSubmit}>
                                <button
                                    className='pushright createbtn f14'
                                    type='submit'
                                    onClick={() =>
                                        this.updateProfilePic(
                                            this.state.uploadedImages.indexOf(
                                                this.state.selectedImg
                                            )
                                        )
                                    }
                                >
                                    Confirm
                                </button>
                            </form>
                        ) : (
                            <a
                                className='pushright createbtn f14'
                                onClick={() =>
                                    this.props.history.push(
                                        '/profile/' + this.props.user.userId
                                    )
                                }
                                style={{ cursor: 'pointer' }}
                            >
                                Cancel
                            </a>
                        )}
                    </h6>
                </div>

                <div className='usrphto'>
                    <p className='small' style={{ textAlign: 'center' }}>
                        {!this.state.selectedImg
                            ? 'Choose a profile picture'
                            : "Click 'Confirm' button on top right to change profile picture"}
                    </p>
                    <div className='phtoglry'>
                        <div className='row'>
                            {this.state.uploadedImages.map((photo, index) => (
                                <div
                                    key={'uploaded-img-' + index}
                                    className={`col-4 nopad ${
                                        this.state.selectedImg === photo
                                            ? 'blur'
                                            : ''
                                    }`}
                                >
                                    <a
                                        onClick={() =>
                                            this.handleImgSelection(
                                                photo,
                                                index
                                            )
                                        }
                                    >
                                        <img
                                            src={`${
                                                getServerUrl().apiURL
                                            }/uploads/temp/${photo}`}
                                        />
                                        {this.state.selectedImg === photo && (
                                            <span>Selected</span>
                                        )}
                                    </a>
                                </div>
                            ))}
                            <div className='col-12 mt-2'>
                                <a
                                    className='btnbig'
                                    onClick={() => this.openUploadProfilePic()}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <input
                                        type='file'
                                        ref={this.uploadProfilePicRef}
                                        onChange={() => this.uploadProfilePic()}
                                    />
                                    Upload New Photo
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
        user: state.auth.user,
        token: state.auth.token,
        redirect: state.auth.redirect,
    };
};

export default withRouter(
    connect(mapStateToProps, { updateUserProfile })(EditPhoto)
);
