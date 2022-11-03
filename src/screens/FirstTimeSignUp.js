/**
 * =====================================
 * REACT SCREEN COMPONENT CLASS
 * =====================================
 * @date created: 9 October 2019
 * @authors: Waqas Rehmani
 *
 * This file defines the FirstTimeSignUp screen component. The class FirstTimeSignUp
 * is where the component is defined. This is a screen component.
 *
 * It is the wizard which comes up when the user first signs up!
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { signupUpdateAthlete, signupUpdateCoach } from '../actions';

// Importing helper functions
import { fileToBase64 } from '../utils/helper';
import { getServerUrl, profileUpload, profileUpdate } from '../utils/api';

// Importing icons and pictures
import loading from '../assets/loading.svg';
import { MdPhotoCamera } from 'react-icons/md';

class FirstTimeSignUp extends Component {
    // Constructor for FirstTimeSignUp
    constructor(props) {
        super(props);

        this.state = {
            step: 1,
            uploadedImage: '',
            uploadedCertificate: '',
            interest: [],
            biography: '',
            profilePicture: false,
            file: null,
            fileDateNow: Date.now(),
        };

        this.uploadProfilePicRef = React.createRef();
    }

    // Generates an array with all of the selected interests.
    handleChangeInterests = () => {
        let interest = [];

        // if (this.cbBadminton.checked) interest = [...interest, 'Badminton'];

        // if (this.cbCycling.checked) interest = [...interest, 'Cycling'];

        // if (this.cbFootball.checked) interest = [...interest, 'Football'];

        // if (this.cbGym.checked) interest = [...interest, 'Gym'];

        if (this.cbRunning.checked) interest = [...interest, 'Running'];

        if (this.cbSwimming.checked) interest = [...interest, 'Swimming'];

        // if (this.cbTennis.checked) interest = [...interest, 'Tennis'];

        // if (this.cbWalking.checked) interest = [...interest, 'Walking'];

        // if (this.cbYoga.checked) interest = [...interest, 'Yoga'];

        if (this.cbLifting.checked) interest = [...interest, 'Weight Lifting'];

        this.setState({
            interest,
        });
    };

    // Goes back to the previous step in the sign up process.
    handlePrevious = () => {
        this.setState((prevState) => ({
            step: prevState.step - 1,
        }));
    };

    // Goes to the next step for an athlete
    handleNextAthlete = () => {
        if (this.state.step === 3) {
            let edited = this.props.user;

            edited.interest = this.state.interest;
            edited.biography = this.state.biography;
            edited.profilePicture = this.state.uploadedImage;

            if (this.state.uploadedImage && this.state.file) {
                this.updateFinalProfilePic();
            }

            this.props.signupUpdateAthlete({
                userId: this.props.user.userId,
                token: this.props.token,
                edited,
            });
        } else {
            this.setState((prevState) => ({
                step: 1 + prevState.step,
            }));
        }
    };

    // Skip to the next step for an athlete
    handleSkipNextAthlete = () => {
        let edited = this.props.user;

        if (this.state.step === 1) {
            this.setState({ interest: [] });
            edited.interest = [];
        } else if (this.state.step === 2) {
            this.setState({ uploadedImage: '' });
            edited.profilePicture = false;
        }

        this.setState((prevState) => ({
            step: 1 + prevState.step,
            edited,
        }));
    };

    // Goes to next step for a coach.
    handleNextCoach = () => {
        if (this.state.step === 4) {
            let edited = this.props.user;

            edited.interest = this.state.interest;
            edited.biography = this.state.biography;
            edited.profilePicture = this.state.profilePicture;

            this.props.signupUpdateCoach({
                userId: this.props.user.userId,
                token: this.props.token,
                file: this.state.file,
                certificate: this.state.uploadedCertificate,
                edited,
            });
        } else {
            this.setState((prevState) => ({
                step: 1 + prevState.step,
            }));
        }
    };

    // Skip to the next step for a coach
    handleSkipNextCoach = () => {
        let edited = this.props.user;

        if (this.state.step === 1) {
            edited.interest = [];
        } else if (this.state.step === 2) {
            edited.profilePicture = false;
        } else {
            edited.biography = '';
        }

        this.setState((prevState) => ({
            step: 1 + prevState.step,
        }));
    };

    // Uploads cover photo.
    handleChangePhoto = (e) => {
        this.setState(
            {
                type: 'image',
                file: e.target.files[0],
            },
            () => {
                fileToBase64(this.state.file).then((res) => {
                    this.setState({
                        uploadedImage: res,
                    });
                });
            }
        );
    };

    // Uploads coaching certificate
    handleChangeCertificate = (e) => {
        this.setState({
            uploadedCertificate: e.target.files[0],
        });
    };

    // Updates state with and displays any changes in the biography field.
    handleChange = () => {
        this.setState({
            biography: this.biographyIN.value,
        });
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
                this.setState({
                    uploadedImage: imgUpload.filename,
                    file: profilePic,
                    fileDateNow: dateNow,
                });
            });
        }
    };

    updateFinalProfilePic = () => {
        const imageData = new FormData();
        imageData.append(
            'mediaDateNow',
            this.state.fileDateNow ? this.state.fileDateNow : Date.now()
        );
        imageData.append('profileUpdate', this.state.file);

        profileUpdate(imageData);
    };

    // Render method for FirstTimeSignUp
    render() {
        if (
            this.props.user &&
            this.props.redirect &&
            this.props.redirect !== '/first-time-login'
        ) {
            return <Redirect to={this.props.redirect} />;
        }

        return (
            <div className='login-first-time-container'>
                {this.props.signupLoading ? (
                    <div className='signup-user-container-login'>
                        <img src={loading} alt='' />
                    </div>
                ) : null}
                <h2>
                    {' '}
                    Welcome to Coaching Mate Social Club,{' '}
                    {this.props.user.firstName}.
                </h2>
                {this.state.step === 1 ? (
                    // <div className='wizard-step-container'>
                    //     <h3>Select your interests</h3>

                    //     <div className='wizard-step-checkbox'>
                    //         <span>
                    //             <input
                    //                 ref={(val) => (this.cbBadminton = val)}
                    //                 onChange={this.handleChangeInterests}
                    //                 type='checkbox'
                    //                 value='Badminton'
                    //             />
                    //             <label>Badminton</label>
                    //         </span>

                    //         <span>
                    //             <input
                    //                 ref={(val) => (this.cbCycling = val)}
                    //                 onChange={this.handleChangeInterests}
                    //                 type='checkbox'
                    //                 value='Cycling'
                    //             />
                    //             <label>Cycling</label>
                    //         </span>

                    //         <span>
                    //             <input
                    //                 ref={(val) => (this.cbFootball = val)}
                    //                 onChange={this.handleChangeInterests}
                    //                 type='checkbox'
                    //                 value='Football'
                    //             />
                    //             <label>Football</label>
                    //         </span>

                    //         <span>
                    //             <input
                    //                 ref={(val) => (this.cbGym = val)}
                    //                 onChange={this.handleChangeInterests}
                    //                 type='checkbox'
                    //                 value='Gym'
                    //             />
                    //             <label>Gym</label>
                    //         </span>

                    //         <span>
                    //             <input
                    //                 ref={(val) => (this.cbRunning = val)}
                    //                 onChange={this.handleChangeInterests}
                    //                 type='checkbox'
                    //                 value='Running'
                    //             />
                    //             <label>Running</label>
                    //         </span>

                    //         <span>
                    //             <input
                    //                 ref={(val) => (this.cbSwimming = val)}
                    //                 onChange={this.handleChangeInterests}
                    //                 type='checkbox'
                    //                 value='Swimming'
                    //             />
                    //             <label>Swimming</label>
                    //         </span>

                    //         <span>
                    //             <input
                    //                 ref={(val) => (this.cbTennis = val)}
                    //                 onChange={this.handleChangeInterests}
                    //                 type='checkbox'
                    //                 value='Tennis'
                    //             />
                    //             <label>Tennis</label>
                    //         </span>

                    //         <span>
                    //             <input
                    //                 ref={(val) => (this.cbWalking = val)}
                    //                 onChange={this.handleChangeInterests}
                    //                 type='checkbox'
                    //                 value='Walking'
                    //             />
                    //             <label>Walking</label>
                    //         </span>

                    //         <span>
                    //             <input
                    //                 ref={(val) => (this.cbYoga = val)}
                    //                 onChange={this.handleChangeInterests}
                    //                 type='checkbox'
                    //                 value='Yoga'
                    //             />
                    //             <label>Yoga</label>
                    //         </span>
                    //     </div>
                    // </div>
                    <>
                        <div className='lgnrgstr wizard-step-container'>
                            <h6>Select Your Interest</h6>
                            <div className='form-check'>
                                <input
                                    type='checkbox'
                                    aria-label='swimming'
                                    className='form-check-input position-static'
                                    ref={(val) => (this.cbSwimming = val)}
                                    onChange={this.handleChangeInterests}
                                    value='Swimming'
                                />{' '}
                                <img src='/uploads/images/swimming.svg' />{' '}
                                Swimming{' '}
                            </div>
                            <div className='form-check'>
                                <input
                                    type='checkbox'
                                    aria-label='running'
                                    className='form-check-input position-static'
                                    ref={(val) => (this.cbRunning = val)}
                                    onChange={this.handleChangeInterests}
                                    value='Running'
                                />{' '}
                                <img src='/uploads/images/run.svg' />
                                Running{' '}
                            </div>
                            <div className='form-check'>
                                <input
                                    type='checkbox'
                                    aria-label='option 1'
                                    className='form-check-input position-static'
                                    ref={(val) => (this.cbLifting = val)}
                                    onChange={this.handleChangeInterests}
                                    value='Weight Lifting'
                                />{' '}
                                <img src='/uploads/images/lifting.svg' /> Weight
                                Lifting{' '}
                            </div>
                        </div>
                        <div className='form-group'>
                            <a
                                onClick={
                                    this.props.user.role !== 'Athlete'
                                        ? this.handleNextCoach
                                        : this.handleNextAthlete
                                }
                                className='button subbtn login-container-width'
                                href='#'
                            >
                                Next
                            </a>
                            <p className='text-center'>
                                {' '}
                                <a
                                    onClick={
                                        this.props.user.role !== 'Athlete'
                                            ? this.handleSkipNextCoach
                                            : this.handleSkipNextAthlete
                                    }
                                    className='col'
                                    href='#'
                                >
                                    Skip this step{' '}
                                </a>
                            </p>
                        </div>
                    </>
                ) : (
                    <div />
                )}
                {this.state.step === 2 ? (
                    <>
                        <div className='lgnrgstr wizard-step-container'>
                            <h6>Upload Your Photo</h6>

                            <div className='wizard-step-profile-photo'>
                                {this.state.uploadedImage === '' ? (
                                    <div
                                        className='new-post-container-buttons-photo'
                                        onClick={() =>
                                            this.openUploadProfilePic()
                                        }
                                    >
                                        <span className='addphoto text-center'>
                                            +
                                        </span>
                                        <input
                                            type='file'
                                            ref={this.uploadProfilePicRef}
                                            onChange={() =>
                                                this.uploadProfilePic()
                                            }
                                        />
                                    </div>
                                ) : (
                                    <div className='wizard-step-profile-photo-uploaded'>
                                        <img
                                            src={`${
                                                getServerUrl().apiURL
                                            }/uploads/temp/${
                                                this.state.uploadedImage
                                            }`}
                                            alt=''
                                        />
                                        <span
                                            onClick={() =>
                                                this.setState({
                                                    uploadedImage: '',
                                                })
                                            }
                                        >
                                            Click to Remove
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className='form-group'>
                            <a
                                onClick={
                                    this.props.user.role !== 'Athlete'
                                        ? this.handleNextCoach
                                        : this.handleNextAthlete
                                }
                                className='button subbtn login-container-width'
                                href='#'
                            >
                                Next
                            </a>
                        </div>
                        <p className='text-center'>
                            <a
                                onClick={this.handlePrevious}
                                className='col'
                                href='#'
                            >
                                Go back
                            </a>{' '}
                            <a
                                onClick={
                                    this.props.user.role !== 'Athlete'
                                        ? this.handleSkipNextCoach
                                        : this.handleSkipNextAthlete
                                }
                                className='col'
                                href='#'
                            >
                                Skip this step{' '}
                            </a>
                        </p>
                    </>
                ) : (
                    <div />
                )}
                {this.state.step === 3 ? (
                    <>
                        <div className='lgnrgstr wizard-step-container'>
                            <h6>Write something about yourself!</h6>

                            <div className='form-group'>
                                <textarea
                                    rows='7'
                                    id='aboutYourselfForm'
                                    className='form-control'
                                    ref={(val) => (this.biographyIN = val)}
                                    type='text'
                                    value={this.state.biography}
                                    onChange={this.handleChange}
                                ></textarea>
                            </div>
                        </div>
                        <div className='form-group'>
                            <a
                                onClick={
                                    this.props.user.role !== 'Athlete'
                                        ? this.handleNextCoach
                                        : this.handleNextAthlete
                                }
                                className='button subbtn login-container-width'
                                href='#'
                            >
                                Finish
                            </a>
                        </div>
                        <p className='text-center'>
                            <a
                                onClick={this.handlePrevious}
                                className='col'
                                href='#'
                            >
                                Go back
                            </a>{' '}
                        </p>
                    </>
                ) : (
                    <div />
                )}
                {this.state.step === 4 && this.props.user.role !== 'Athlete' ? (
                    <div className='wizard-step-container'>
                        <h3>Upload Coaching Certificate</h3>

                        <div className='wizard-step-profile-photo'>
                            {this.state.uploadedCertificate === '' ? (
                                <label className='new-post-container-buttons-photo'>
                                    <h1>+</h1>
                                    <input
                                        type='file'
                                        accept='.jpg,.png,.pdf'
                                        onChange={this.handleChangeCertificate}
                                    />
                                </label>
                            ) : (
                                <div className='wizard-step-profile-photo-uploaded'>
                                    <p>{this.state.uploadedCertificate.name}</p>
                                    <span
                                        onClick={() =>
                                            this.setState({
                                                uploadedCertificate: '',
                                            })
                                        }
                                    >
                                        Click to Remove
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div />
                )}
                <div className='login-first-time-bottom-bar'>
                    <div className='login-first-time-dots-container'>
                        <span
                            className={
                                this.state.step === 1
                                    ? 'dot dot-selected'
                                    : 'dot'
                            }
                            onClick={() => {
                                this.setState({
                                    step: 1,
                                });
                            }}
                        />
                        <span
                            className={
                                this.state.step === 2
                                    ? 'dot dot-selected'
                                    : 'dot'
                            }
                            onClick={() => {
                                this.setState({
                                    step: 2,
                                });
                            }}
                        />
                        <span
                            className={
                                this.state.step === 3
                                    ? 'dot dot-selected'
                                    : 'dot'
                            }
                            onClick={() => {
                                this.setState({
                                    step: 3,
                                });
                            }}
                        />

                        {this.props.user.role !== 'Athlete' ? (
                            <span
                                className={
                                    this.state.step === 4
                                        ? 'dot dot-selected'
                                        : 'dot'
                                }
                                onClick={() => {
                                    this.setState({
                                        step: 4,
                                    });
                                }}
                            />
                        ) : (
                            <span />
                        )}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        token: state.auth.token,
        redirect: state.auth.redirect,
        signupLoading: state.auth.signupLoading,
    };
};

export default connect(mapStateToProps, {
    signupUpdateAthlete,
    signupUpdateCoach,
})(FirstTimeSignUp);
