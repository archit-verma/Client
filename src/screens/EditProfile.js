/**
 * =====================================
 * REACT SCREEN COMPONENT CLASS
 * =====================================
 * @date created: 9 September 2019
 * @authors: Waqas Rehmani
 *
 * This file defines the EditProfile screen component. The class EditProfile
 * is where the component is defined. This is a screen component.
 *
 * It contains the form that user can fill to edit a user profile.
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';
import { withRouter, Redirect, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { updateUserProfile } from '../actions';

// Importing icons and pictures
import { MdPhotoCamera } from 'react-icons/md';
import profileBlank from '../assets/profile_blank.png';
import loading from '../assets/loading.svg';

// Importing helper functions
import { getServerUrl, profileUpload, profileUpdate } from '../utils/api';
import { fileToBase64 } from '../utils/helper';

class EditProfile extends Component {
    constructor(props) {
        super(props);
        let interestChecked = {
            Badminton: props.user.interest.includes('Badminton'),
            Cycling: props.user.interest.includes('Cycling'),
            Football: props.user.interest.includes('Football'),
            Gym: props.user.interest.includes('Gym'),
            Running: props.user.interest.includes('Running'),
            Swimming: props.user.interest.includes('Swimming'),
            Tennis: props.user.interest.includes('Tennis'),
            Walking: props.user.interest.includes('Walking'),
            Yoga: props.user.interest.includes('Yoga'),
        };

        let pictureLoading = true;

        this.state = {
            edited: {
                firstName: props.user.firstName,
                lastName: props.user.lastName,
                dob: this.dateConvert(props.user.dob),
                phone: props.user.phone,
                email: props.user.email,
                interest: props.user.interest,
                profilePicture: props.user.profilePicture,
                biography: props.user.biography,
            },
            interestChecked: interestChecked,
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
            file: null,
            fileDateNow: Date.now(),
            uploadedCoachingCertificate: props.user.coachingCertificate,
            uploadedCoachingCertificateFileName: '',
            uploadedImage: props.user.profilePicture,
            pictureLoading,
            redirect: false,
        };

        this.uploadProfilePicRef = React.createRef();
    }

    // This method is called when the component first mounts after the constructor is called
    componentDidMount() {
        let interestChecked = {
            Badminton: this.props.user.interest.includes('Badminton'),
            Cycling: this.props.user.interest.includes('Cycling'),
            Football: this.props.user.interest.includes('Football'),
            Gym: this.props.user.interest.includes('Gym'),
            Running: this.props.user.interest.includes('Running'),
            Swimming: this.props.user.interest.includes('Swimming'),
            Tennis: this.props.user.interest.includes('Tennis'),
            Walking: this.props.user.interest.includes('Walking'),
            Yoga: this.props.user.interest.includes('Yoga'),
        };

        this.setState({
            edited: {
                firstName: this.props.user.firstName,
                lastName: this.props.user.lastName,
                dob: this.dateConvert(this.props.user.dob),
                phone: this.props.user.phone,
                interest: this.props.user.interest,
                profilePicture: this.props.user.profilePicture,
                email: this.props.user.email,
                biography: this.props.user.biography,
            },
            interestChecked,
        });

        if (this.props.user.profilePicture) {
            this.setState({
                uploadedImage: this.props.user.profilePicture,
            });
        }

        this.setState({
            pictureLoading: false,
        });
    }

    // Uploads coaching certificate
    handleChangeCertificate = (e) => {
        this.setState({
            uploadedCoachingCertificate: e.target.files[0],
            uploadedCoachingCertificateFileName: e.target.files[0].name,
        });
    };

    // Uploads cover photo.
    handleChangePhoto = (e) => {
        this.setState({file: e.target.files[0]},
            () => {
                fileToBase64(this.state.file).then((res) => {
                    this.setState({
                        uploadedImage: res,
                        pictureLoading: false,
                    });
                });
            }
        );
    };

    // Creates array of the interests selected.
    compileInterests = () => {
        let interest = [];

        if (this.state.interestChecked.Badminton)
            interest = [...interest, 'Badminton'];

        if (this.state.interestChecked.Cycling)
            interest = [...interest, 'Cycling'];

        if (this.state.interestChecked.Football)
            interest = [...interest, 'Football'];

        if (this.state.interestChecked.Gym) interest = [...interest, 'Gym'];

        if (this.state.interestChecked.Running)
            interest = [...interest, 'Running'];

        if (this.state.interestChecked.Swimming)
            interest = [...interest, 'Swimming'];

        if (this.state.interestChecked.Tennis)
            interest = [...interest, 'Tennis'];

        if (this.state.interestChecked.Walking)
            interest = [...interest, 'Walking'];

        if (this.state.interestChecked.Yoga) interest = [...interest, 'Yoga'];

        return interest;
    };

    // Updates any change in the profile details fields.
    handleChange = () => {
        let interest = this.state.interest;

        this.setState({
            edited: {
                ...this.state.edited,
                firstName: this.firstNameIN.value,
                lastName: this.lastNameIN.value,
                dob: this.dobIN.value,
                interest,
                phone: this.phoneIN.value,
                email: this.emailIN.value,
                biography: this.biographyIN.value,
            },
        });
    };

    // The following functions handle the selection of interests.
    handleChangeCheckBox1 = () => {
        this.setState((prevState) => ({
            interestChecked: {
                ...prevState.interestChecked,
                Badminton: !prevState.interestChecked.Badminton,
            },
        }));
    };
    handleChangeCheckBox2 = () => {
        this.setState((prevState) => ({
            interestChecked: {
                ...prevState.interestChecked,
                Cycling: !prevState.interestChecked.Cycling,
            },
        }));
    };
    handleChangeCheckBox3 = () => {
        this.setState((prevState) => ({
            interestChecked: {
                ...prevState.interestChecked,
                Football: !prevState.interestChecked.Football,
            },
        }));
    };
    handleChangeCheckBox4 = () => {
        this.setState((prevState) => ({
            interestChecked: {
                ...prevState.interestChecked,
                Gym: !prevState.interestChecked.Gym,
            },
        }));
    };
    handleChangeCheckBox5 = () => {
        this.setState((prevState) => ({
            interestChecked: {
                ...prevState.interestChecked,
                Running: !prevState.interestChecked.Running,
            },
        }));
    };
    handleChangeCheckBox6 = () => {
        this.setState((prevState) => ({
            interestChecked: {
                ...prevState.interestChecked,
                Swimming: !prevState.interestChecked.Swimming,
            },
        }));
    };
    handleChangeCheckBox7 = () => {
        this.setState((prevState) => ({
            interestChecked: {
                ...prevState.interestChecked,
                Tennis: !prevState.interestChecked.Tennis,
            },
        }));
    };
    handleChangeCheckBox8 = () => {
        this.setState((prevState) => ({
            interestChecked: {
                ...prevState.interestChecked,
                Walking: !prevState.interestChecked.Walking,
            },
        }));
    };
    handleChangeCheckBox9 = () => {
        this.setState((prevState) => ({
            interestChecked: {
                ...prevState.interestChecked,
                Yoga: !prevState.interestChecked.Yoga,
            },
        }));
    };

    // Handles a new password.
    handleChangePassword = () => {
        this.setState({
            oldPassword: this.oldPasswordIN.value,
            newPassword: this.newPasswordIN.value,
            confirmPassword: this.confirmPasswordIN.value,
        });
    };

    // Converts date to useful format.
    dateConvert = (dateInput) => {
        let tempDate = new Date(dateInput);
        let result = tempDate.getFullYear();
        if (tempDate.getMonth() < 10) {
            result = result + '-0' + (tempDate.getMonth() + 1);
        } else {
            result = result + '-' + (tempDate.getMonth() + 1);
        }
        if (tempDate.getDate() < 10) {
            result = result + '-0' + tempDate.getDate();
        } else {
            result = result + '-' + tempDate.getDate();
        }
        return result;
    };

    // Handles the API call for updating profile.
    handleSubmit = (e) => {
        e.preventDefault();
        let certificate = '';

        if (
            this.state.uploadedCertificate !== '' &&
            this.props.user.role !== 'Athlete'
        ) {
            certificate = this.state.uploadedCertificate;
        }

        let edited = this.props.user;

        edited.firstName = this.state.edited.firstName;
        edited.lastName = this.state.edited.lastName;
        edited.phone = this.state.edited.phone;
        edited.email = this.state.edited.email;
        edited.biography = this.state.edited.biography;
        edited.interest = this.compileInterests();
        edited.dob = Date.parse(this.state.edited.dob);
        edited.profilePicture = this.state.uploadedImage;

        // create a copy of profile pic in uploads/user dir
        this.updateProfilePic();

        this.props.updateUserProfile({
            userId: this.props.user.userId,
            token: this.props.token,
            certificate,
            edited,
        });

        this.setState({ redirect: true });
    };

    handlePersonalDataSubmit = (e) => {
        e.preventDefault();
        let certificate = '';

        if (
            this.state.uploadedCertificate !== '' &&
            this.props.user.role !== 'Athlete'
        ) {
            certificate = this.state.uploadedCertificate;
        }

        let edited = this.props.user;

        edited.firstName = this.state.edited.firstName;
        edited.lastName = this.state.edited.lastName;
        edited.phone = this.state.edited.phone;
        edited.email = this.state.edited.email;
        edited.biography = this.state.edited.biography;
        edited.interest = this.compileInterests();
        edited.dob = Date.parse(this.state.edited.dob);

        this.props.updateUserProfile({
            userId: this.props.user.userId,
            token: this.props.token,
            certificate,
            edited,
        });

        this.setState({ redirect: true });
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
                    pictureLoading: false,
                    uploadedImage: imgUpload.filename,
                    file: imgUpload.filename,
                    fileDateNow: dateNow,
                });
            });

            this.setState({ pictureLoading: true });
        }
    };

    updateProfilePic = () => {
        let profilePic = this.uploadProfilePicRef.current.files[0];
        let fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        if (profilePic === undefined) {
            if (!this.state.uploadedImage) {
                alert('Please select image file to upload');
            }
        } else if (fileTypes.indexOf(profilePic.type) === -1) {
            alert('Please select file type of JPEG, JPG, PNG or GIF');
        } else {
            const imageData = new FormData();
            imageData.append(
                'mediaDateNow',
                this.state.fileDateNow ? this.state.fileDateNow : Date.now()
            );
            imageData.append('profileUpdate', profilePic);

            profileUpdate(imageData);
        }
    };

    render() {
        let pictureExists = true;

        if (!this.state.uploadedImage) {
            pictureExists = false;
        }

        if (this.state.redirect && this.props.redirect) {
            return <Redirect to={this.props.redirect} />;
        } else if (this.props.userSignedIn) {
            if (!window.matchMedia('(max-width: 500px)').matches) {
                return (
                    <div className='edit-profile-container'>
                        {this.state.signupLoading ? (
                            <div className='signup-user-container-login'>
                                <img src={loading} alt='' />
                            </div>
                        ) : null}

                        <h1> Edit Profile</h1>
                        <form
                            className='edit-profile-form1'
                            onSubmit={this.handleSubmit}
                        >
                            <div>
                                <label>Username:</label>
                                <span>{this.props.user.userId}</span>
                            </div>

                            {/* <div>
                                <label>Profile Picture:</label>
                                <div id='edit-profile-form1-picture'>
                                    <a
                                        className='new-post-container-buttons-photo'
                                        onClick={() =>
                                            this.openUploadProfilePic()
                                        }
                                    >
                                        <MdPhotoCamera />
                                        <input
                                            type='file'
                                            ref={this.uploadProfilePicRef}
                                            onChange={() =>
                                                this.uploadProfilePic()
                                            }
                                        />
                                        Upload Photo
                                    </a>
                                    {pictureExists ? (
                                        <div
                                            id={
                                                this.state.pictureLoading
                                                    ? 'edit-profile-form1-picture-img-loading'
                                                    : 'edit-profile-form1-picture-img-loaded'
                                            }
                                        >
                                            <img
                                                src={`${
                                                    getServerUrl().apiURL
                                                }/uploads/temp/${
                                                    this.state.uploadedImage
                                                }`}
                                                alt='Profile Pic'
                                            />
                                        </div>
                                    ) : (
                                        <div
                                            id={
                                                'edit-profile-form1-picture-img-loaded'
                                            }
                                        >
                                            <img
                                                src={profileBlank}
                                                alt='Profile Pic'
                                            />
                                        </div>
                                    )}
                                </div>
                            </div> */}

                            <div>
                                <label>Biography:</label>
                                <textarea
                                    ref={(val) => (this.biographyIN = val)}
                                    type='text'
                                    value={this.state.edited.biography}
                                    onChange={this.handleChange}
                                />
                            </div>

                            <div>
                                <label>First Name:</label>
                                <input
                                    ref={(val) => (this.firstNameIN = val)}
                                    type='text'
                                    value={this.state.edited.firstName}
                                    onChange={this.handleChange}
                                />
                            </div>

                            <div>
                                <label>Last Name:</label>
                                <input
                                    ref={(val) => (this.lastNameIN = val)}
                                    type='text'
                                    value={this.state.edited.lastName}
                                    onChange={this.handleChange}
                                />
                            </div>

                            <div>
                                <label>Phone:</label>
                                <input
                                    ref={(val) => (this.phoneIN = val)}
                                    type='text'
                                    value={this.state.edited.phone}
                                    onChange={this.handleChange}
                                />
                            </div>

                            <div>
                                <label>Email:</label>
                                <input
                                    ref={(val) => (this.emailIN = val)}
                                    type='email'
                                    value={this.state.edited.email}
                                    onChange={this.handleChange}
                                />
                            </div>
                            <div>
                                <label>Your Interests:</label>
                                <div id='edit-profile-checkboxes'>
                                    <span onClick={this.handleChangeCheckBox1}>
                                        <input
                                            ref={(val) => (this.cbBadminton = val)}
                                            readOnly
                                            checked={this.state.interestChecked.Badminton}
                                            type='checkbox'
                                            value='Badminton'
                                        />
                                        <p>Badminton</p>
                                    </span>

                                    <span onClick={this.handleChangeCheckBox2}>
                                        <input
                                            ref={(val) => (this.cbCycling = val)}
                                            readOnly
                                            checked={this.state.interestChecked.Cycling}
                                            type='checkbox'
                                            value='Cycling'
                                        />
                                        <p>Cycling</p>
                                    </span>

                                    <span onClick={this.handleChangeCheckBox3}>
                                        <input
                                            ref={(val) => (this.cbFootball = val)}
                                            readOnly
                                            checked={this.state.interestChecked.Football}
                                            type='checkbox'
                                            value='Football'
                                        />
                                        <p>Football</p>
                                    </span>

                                    <span onClick={this.handleChangeCheckBox4}>
                                        <input
                                            ref={(val) => (this.cbGym = val)}
                                            readOnly
                                            checked={this.state.interestChecked.Gym}
                                            type='checkbox'
                                            value='Gym'
                                        />
                                        <p>Gym</p>
                                    </span>

                                    <span onClick={this.handleChangeCheckBox5}>
                                        <input
                                            ref={(val) => (this.cbRunning = val)}
                                            readOnly
                                            checked={this.state.interestChecked.Running}
                                            type='checkbox'
                                            value='Running'
                                        />
                                        <p>Running</p>
                                    </span>

                                    <span onClick={this.handleChangeCheckBox6}>
                                        <input
                                            ref={(val) => (this.cbSwimming = val)}
                                            readOnly
                                            checked={this.state.interestChecked.Swimming}
                                            type='checkbox'
                                            value='Swimming'
                                        />
                                        <p>Swimming</p>
                                    </span>

                                    <span onClick={this.handleChangeCheckBox7}>
                                        <input
                                            ref={(val) => (this.cbTennis = val)}
                                            readOnly
                                            checked={this.state.interestChecked.Tennis}
                                            type='checkbox'
                                            value='Tennis'
                                        />
                                        <p>Tennis</p>
                                    </span>

                                    <span onClick={this.handleChangeCheckBox8}>
                                        <input
                                            ref={(val) => (this.cbWalking = val)}
                                            readOnly
                                            checked={this.state.interestChecked.Walking}
                                            type='checkbox'
                                            value='Walking'
                                        />
                                        <p>Walking</p>
                                    </span>

                                    <span onClick={this.handleChangeCheckBox9}>
                                        <input
                                            ref={(val) => (this.cbYoga = val)}
                                            readOnly
                                            checked={this.state.interestChecked.Yoga}
                                            type='checkbox'
                                            value='Yoga'
                                        />
                                        <p>Yoga</p>
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label>Birthday:</label>
                                <input
                                    ref={(val) => (this.dobIN = val)}
                                    type='date'
                                    value={this.state.edited.dob}
                                    onChange={this.handleChange}
                                />
                            </div>

                            {this.props.user.role === 'Athlete' ? null : (
                                <div>
                                    <label>Coaching Cerficate:</label>
                                    <div id='edit-profile-form1-picture'>
                                        <label className='new-post-container-buttons-photo'>
                                            <MdPhotoCamera />
                                            <input
                                                type='file'
                                                accept='.jpg,.png,.pdf'
                                                onChange={this.handleChangeCertificate}
                                            />
                                            Upload Certificate
                                        </label>
                                        {this.state.uploadedCoachingCertificate !== '' ? (
                                            <div id={this.state.pictureLoading ? 'edit-profile-form1-picture-img-loading' : 'edit-profile-form1-picture-img-loaded'}>
                                                {this.state.uploadedCoachingCertificateFileName ==='' ? (
                                                    <a href={this.state.uploadedCoachingCertificate} target='_blank' rel='noopener noreferrer'>Download Current Certificate</a>
                                                ) : (
                                                    <p>
                                                        Uploaded:
                                                        <br />
                                                        <strong>{this.state.uploadedCoachingCertificateFileName}</strong>
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <div id={'edit-profile-form1-picture-img-loaded'}>
                                                You haven't uploaded any
                                                coaching certificate!
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            <button>Done</button>
                        </form>

                        <h1> Change Password </h1>

                        <form className='edit-profile-form2'>
                            <div>
                                <label>Old Password:</label>
                                <input
                                    ref={(val) => (this.oldPasswordIN = val)}
                                    type='password'
                                    value={this.state.oldPassword}
                                    onChange={this.handleChangePassword}
                                />
                            </div>
                            <div>
                                <label>New Password:</label>
                                <input
                                    ref={(val) => (this.newPasswordIN = val)}
                                    type='password'
                                    value={this.state.newPassword}
                                    onChange={this.handleChangePassword}
                                />
                            </div>
                            <div>
                                <label>Confirm Password:</label>
                                <input
                                    ref={(val) => (this.confirmPasswordIN = val)}
                                    type='password'
                                    value={this.state.confirmPassword}
                                    onChange={this.handleChangePassword}
                                />
                            </div>
                            <button>Change Password</button>
                        </form>
                    </div>
                );
            } else {
                return (
                    <>
                        <div className='teams-container'>
                            <Link to={'/profile/'+this.props.match.params.userid} className='backbtn'>{' '}</Link>
                            <h6>Edit Profile</h6>
                        </div>
                        <div className='lgnrgstr'>
                            <div className='form-group'>
                                <label className='form-label'>Username</label>
                                <span className='form-control dislinks'>
                                    {this.props.user.userId}
                                </span>
                            </div>

                            <form onSubmit={this.handlePersonalDataSubmit}>
                                <div className='form-group'>
                                    <label className='form-label' htmlFor='formGroupBiography'>Biography</label>
                                    <textarea
                                        type='text'
                                        id='formGroupBiography'
                                        className='form-control'
                                        ref={(val) => (this.biographyIN = val)}
                                        value={this.state.edited.biography}
                                        onChange={this.handleChange}
                                        placeholder='Enter biography'
                                        required
                                    />
                                </div>

                                <div className='form-group'>
                                    <label className='form-label' htmlFor='formGroupFirstName'>First Name</label>
                                    <input
                                        type='text'
                                        id='formGroupFirstName'
                                        className='form-control'
                                        ref={(val) => (this.firstNameIN = val)}
                                        value={this.state.edited.firstName}
                                        onChange={this.handleChange}
                                        placeholder='Enter your first name'
                                        required
                                    />
                                </div>

                                <div className='form-group'>
                                    <label className='form-label' htmlFor='formGroupLastName'>Last Name</label>
                                    <input
                                        type='text'
                                        id='formGroupLastName'
                                        className='form-control'
                                        ref={(val) => (this.lastNameIN = val)}
                                        value={this.state.edited.lastName}
                                        onChange={this.handleChange}
                                        placeholder='Enter your last name'
                                        required
                                    />
                                </div>

                                <div className='form-group'>
                                    <label className='form-label' htmlFor='formGroupPhoneNum'>Phone Number</label>
                                    <input
                                        type='text'
                                        id='formGroupPhoneNum'
                                        className='form-control'
                                        ref={(val) => (this.phoneIN = val)}
                                        value={this.state.edited.phone}
                                        onChange={this.handleChange}
                                        placeholder='Enter your email'
                                        required
                                    />
                                </div>

                                <div className='form-group'>
                                    <label className='form-label' htmlFor='formGroupEmail'>Email</label>
                                    <input
                                        type='email'
                                        id='formGroupEmail'
                                        className='form-control'
                                        ref={(val) => (this.emailIN = val)}
                                        value={this.state.edited.email}
                                        onChange={this.handleChange}
                                        placeholder='Enter your email'
                                        required
                                    />
                                </div>

                                <div>
                                    <label className='form-label'>Your Interests</label>
                                    <div id='edit-profile-checkboxes'>
                                        <span onClick={this.handleChangeCheckBox1}>
                                            <input
                                                ref={(val) => (this.cbBadminton = val)}
                                                readOnly
                                                checked={this.state.interestChecked.Badminton}
                                                type='checkbox'
                                                value='Badminton'
                                            />
                                            <p>Badminton</p>
                                        </span>

                                        <span onClick={this.handleChangeCheckBox2}>
                                            <input
                                                ref={(val) => (this.cbCycling = val)}
                                                readOnly
                                                checked={this.state.interestChecked.Cycling}
                                                type='checkbox'
                                                value='Cycling'
                                            />
                                            <p>Cycling</p>
                                        </span>

                                        <span
                                            onClick={this.handleChangeCheckBox3}
                                        >
                                            <input
                                                ref={(val) => (this.cbFootball = val)}
                                                readOnly
                                                checked={this.state.interestChecked.Football}
                                                type='checkbox'
                                                value='Football'
                                            />
                                            <p>Football</p>
                                        </span>

                                        <span
                                            onClick={this.handleChangeCheckBox4}
                                        >
                                            <input
                                                ref={(val) => (this.cbGym = val)}
                                                readOnly
                                                checked={this.state.interestChecked.Gym}
                                                type='checkbox'
                                                value='Gym'
                                            />
                                            <p>Gym</p>
                                        </span>

                                        <span
                                            onClick={this.handleChangeCheckBox5}
                                        >
                                            <input
                                                ref={(val) => (this.cbRunning = val)}
                                                readOnly
                                                checked={this.state.interestChecked.Running}
                                                type='checkbox'
                                                value='Running'
                                            />
                                            <p>Running</p>
                                        </span>

                                        <span
                                            onClick={this.handleChangeCheckBox6}
                                        >
                                            <input
                                                ref={(val) => (this.cbSwimming = val)}
                                                readOnly
                                                checked={this.state.interestChecked.Swimming}
                                                type='checkbox'
                                                value='Swimming'
                                            />
                                            <p>Swimming</p>
                                        </span>

                                        <span
                                            onClick={this.handleChangeCheckBox7}
                                        >
                                            <input
                                                ref={(val) => (this.cbTennis = val)}
                                                readOnly
                                                checked={this.state.interestChecked.Tennis}
                                                type='checkbox'
                                                value='Tennis'
                                            />
                                            <p>Tennis</p>
                                        </span>

                                        <span
                                            onClick={this.handleChangeCheckBox8}
                                        >
                                            <input
                                                ref={(val) => (this.cbWalking = val)}
                                                readOnly
                                                checked={this.state.interestChecked.Walking}
                                                type='checkbox'
                                                value='Walking'
                                            />
                                            <p>Walking</p>
                                        </span>

                                        <span
                                            onClick={this.handleChangeCheckBox9}
                                        >
                                            <input
                                                ref={(val) => (this.cbYoga = val)}
                                                readOnly
                                                checked={this.state.interestChecked.Yoga}
                                                type='checkbox'
                                                value='Yoga'
                                            />
                                            <p>Yoga</p>
                                        </span>
                                    </div>
                                </div>

                                <div className='form-group'>
                                    <label className='form-label' htmlFor='formGroupDOB'>Date of Birth</label>
                                    <input
                                        type='date'
                                        id='formGroupDOB'
                                        className='form-control'
                                        ref={(val) => (this.dobIN = val)}
                                        value={this.state.edited.dob}
                                        onChange={this.handleChange}
                                        placeholder='Enter your email'
                                        required
                                    />
                                </div>

                                <div className='form-group'>
                                    <button className='button subbtn'>Update</button>
                                </div>
                            </form>

                            <div className='form-group'>
                                <button
                                    className='button btn-danger'
                                    onClick={() => this.props.history.push('/profile/' + this.props.user.userId)}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </>
                );
            }
        } else {
            return (
                <div className='edit-profile-container'>
                    <h1>User not signed in</h1>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        userSignedIn: state.auth.userSignedIn,
        user: state.auth.user,
        token: state.auth.token,
        redirect: state.auth.redirect,
    };
};

export default withRouter(
    connect(mapStateToProps, { updateUserProfile })(EditProfile)
);
