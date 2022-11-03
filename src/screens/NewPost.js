/**
 * =====================================
 * REACT COMPONENT CLASS
 * =====================================
 * @date created: 28 August 2019
 * @authors: Jay Parikh, Waqas Rehmani
 *
 * This file defines the NewPost component. The class NewPost
 * is where the component is defined.
 *
 * This is a component defined for reusability.
 *
 * This component shows a new post that can made on Home, Event and Group screenss.
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

// Importing icons and pictures
import loading from '../assets/loading2.svg';
import { MdPhotoCamera, MdVideocam } from 'react-icons/md';
import profileBlank from '../assets/profile_blank.png';

// Importing helper functions
import { fileToBase64 } from '../utils/helper';
import {
    getServerUrl,
    uploadPostMediaTemp,
    uploadPostMediaMain,
    getActivityByTitle,
    getTeam,
} from '../utils/api';

class NewPost extends Component {
    // Constructor for NewPost
    constructor(props) {
        super(props);

        let interestChecked = {
            Badminton: false,
            Cycling: false,
            Football: false,
            Gym: false,
            Running: false,
            Swimming: false,
            Tennis: false,
            Walking: false,
            Yoga: false,
        };

        this.state = {
            postId: '',
            userId: props.user.userId,
            type: 'text',
            description: '',
            isQuestion: false,
            interest: [],
            interestValue: '',
            time: new Date(),
            file: null,
            video: null,
            comments: [],
            kudos: {
                likes: [],
                bumSlaps: [],
                backSlaps: [],
            },
            section: props.section,
            loading: false,
            interestChecked: interestChecked,
            uploadedImage: '',
            uploadedVideo: '',
            imgs: [],
            imgsDateNow: [],
            imgsFile: [],
            videos: [],
            videosDateNow: [],
            videosFile: [],
        };

        this.uploadPostPictureRef = React.createRef();
        this.uploadPostVideoRef = React.createRef();
    }

    // Resets all interests back to unselected.
    resetInterest = () => {
        this.setState({
            interestChecked: {
                Badminton: false,
                Cycling: false,
                Football: false,
                Gym: false,
                Running: false,
                Swimming: false,
                Tennis: false,
                Walking: false,
                Yoga: false,
            },
        });
    };

    // Generates an array with all of the selected interests.
    compileInterests = () => {
        let interest = [];

        if (this.state.interestChecked.Badminton) interest.push('Badminton');

        if (this.state.interestChecked.Cycling) interest.push('Cycling');

        if (this.state.interestChecked.Football) interest.push('Football');

        if (this.state.interestChecked.Gym) interest.push('Gym');

        if (this.state.interestChecked.Running) interest.push('Running');

        if (this.state.interestChecked.Swimming) interest.push('Swimming');

        if (this.state.interestChecked.Tennis) interest.push('Tennis');

        if (this.state.interestChecked.Walking) interest.push('Walking');

        if (this.state.interestChecked.Yoga) interest.push('Yoga');

        return interest;
    };

    // Handles API call for creating a post.
    createPost = async (e) => {
        e.preventDefault();
        let newPost = {
            userId: this.state.userId,
            type: this.state.type,
            description: this.state.description,
            isQuestion: this.props.isQuestion,
            time: this.state.time,
            imgFileName: this.state.imgs,
            videoFileName: this.state.videos,
            section: this.state.section,
            comments: this.state.comments,
            kudos: this.state.kudos,
            role: this.props.user.role,
            interest: {},
            postId: Math.floor(Math.random() * 100000).toString(),
        };

        // get interest data
        if (this.state.interestValue) {
            await getActivityByTitle(this.state.interestValue).then(
                (activity) => {
                    if (activity._id) {
                        newPost.interest = {
                            id: activity._id,
                            name: activity.title,
                            icon: activity.activity_icon,
                        };
                    }
                }
            );
        }

        if (this.props.isQuestion) {
            newPost.isQuestion = true;
        } else {
            if (!this.props.notGeneral) {
                if (
                    this.state.description[
                        this.state.description.length - 1
                    ] === '?'
                ) {
                    if (
                        window.confirm(
                            'We noticed a question mark in your post. Do you post this as a question?'
                        )
                    ) {
                        newPost.isQuestion = true;
                    } else {
                        newPost.isQuestion = false;
                    }
                } else {
                    newPost.isQuestion = false;
                }
            }
        }

        if (newPost.section.type === 'teams') {
            if (newPost.section.id) {
                await getTeam(newPost.section.id).then((res) => {
                    if (res.success === true) {
                        const team = res.team;

                        // owner of team
                        if (
                            this.props.user._id === team.creatorId ||
                            (team.administrators &&
                                team.administrators.includes(
                                    this.props.user._id
                                ))
                        ) {
                            newPost.section.category = 'admin';
                        } else if (
                            team.coaches &&
                            team.coaches.includes(this.props.user._id)
                        ) {
                            newPost.section.category = 'coach';
                        } else if (
                            team.moderators &&
                            team.moderators.includes(this.props.user._id)
                        ) {
                            newPost.section.category = 'moderator';
                        } else if (this.props.user.teams.includes(team._id)) {
                            newPost.section.category = 'member';
                        } else {
                            newPost.section.category = 'public';
                        }
                    }
                });
            }
        }

        this.setState(
            {
                loading: true,
            },
            () => {
                this.props.createPost(newPost).then(async (res) => {
                    if (res) {
                        this.state.imgsFile.forEach((file, index) => {
                            this.uploadPostPictureToPosts(
                                file,
                                this.state.imgsDateNow[index]
                            );
                        });

                        this.state.videosFile.forEach((file, index) => {
                            this.uploadPostVideoToPosts(
                                file,
                                this.state.videosDateNow[index]
                            );
                        });

                        this.setState({
                            description: '',
                            interests: [],
                            loading: false,
                            type: 'text',
                            uploadedImage: '',
                            uploadedVideo: '',
                            imgs: [],
                            imgsDateNow: [],
                            imgsFile: [],
                            videos: [],
                            videosDateNow: [],
                            videosFile: [],
                        });
                        this.resetInterest();

                        {
                            !window.matchMedia('(max-width: 500px)').matches
                                ? window.location.reload()
                                : window.history.back();
                        }
                    }
                });
            }
        );
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

    // Handles change in description and displays in textbox.
    handleChange = () => {
        let postNum = Math.floor(Math.random() * 100000).toString();

        this.setState({
            postId: postNum,
            description: this.descriptionInput.value,
            time: new Date(),
        });
    };

    // Uploading photo onto the system.
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

    // Removing the photo from post.
    removePhoto = (filename) => {
        let photoIndex = this.state.imgs.indexOf(filename);
        const newImgList = this.state.imgs.filter((img) => img !== filename);
        const newImgDateNowList = [...this.state.imgsDateNow];
        newImgDateNowList.splice(photoIndex, 1);

        const newImgFileList = [...this.state.imgsFile];
        newImgFileList.splice(photoIndex, 1);

        this.setState({
            uploadedImage: '',
            type: this.state.imgs.length > 0 ? 'image' : 'text',
            imgs: newImgList,
            imgsDateNow: newImgDateNowList,
            imgsFile: newImgFileList,
        });
    };

    openUploadPostPicture = () => {
        this.uploadPostPictureRef.current.click();
    };

    uploadPostPictureToTemp = () => {
        let postPicture = this.uploadPostPictureRef.current.files[0];
        let fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        if (postPicture === undefined) {
            alert('Please select image file to upload');
        } else if (fileTypes.indexOf(postPicture.type) === -1) {
            alert('Please select file type of JPEG, JPG, PNG or GIF');
        } else {
            const dateNow = Date.now();
            const imageData = new FormData();
            imageData.append('mediaDateNow', dateNow);
            imageData.append('mediaToTempUpload', postPicture);

            uploadPostMediaTemp(imageData).then((imgUpload) => {
                this.setState({
                    uploadedImage: imgUpload.filename,
                    type: 'image',
                    imgsFile: [...this.state.imgsFile, postPicture],
                    imgs: [...this.state.imgs, imgUpload.filename],
                    imgsDateNow: [...this.state.imgsDateNow, dateNow],
                });
            });
        }
    };

    uploadPostPictureToPosts = (postPicture, storedDateNow) => {
        const imageData = new FormData();
        imageData.append('mediaDateNow', storedDateNow);
        imageData.append('mediaToPostsUpload', postPicture);

        uploadPostMediaMain(imageData);
    };

    // Removing the video from post.
    removeVideo = (filename) => {
        let videoIndex = this.state.videos.indexOf(filename);

        const newVideoList = this.state.videos.filter(
            (video) => video !== filename
        );

        const newVideoDateNowList = [...this.state.videosDateNow];
        newVideoDateNowList.splice(videoIndex, 1);

        const newVideoFileList = [...this.state.videosFile];
        newVideoFileList.splice(videoIndex, 1);

        this.setState({
            uploadedVideo: '',
            type: this.state.videos.length > 0 ? 'image' : 'text',
            videos: newVideoList,
            videosDateNow: newVideoDateNowList,
            videosFile: newVideoFileList,
        });
    };

    openUploadPostVideo = () => {
        this.uploadPostVideoRef.current.click();
    };

    uploadPostVideoToTemp = () => {
        let postVideo = this.uploadPostVideoRef.current.files[0];
        let fileTypes = ['video/mp4'];

        if (postVideo === undefined) {
            alert('Please select image file to upload');
        } else if (fileTypes.indexOf(postVideo.type) === -1) {
            alert('Please select file type of MP4');
        } else {
            const dateNow = Date.now();
            const videoData = new FormData();
            videoData.append('mediaDateNow', dateNow);
            videoData.append('mediaToTempUpload', postVideo);

            uploadPostMediaTemp(videoData).then((videoUpload) => {
                this.setState({
                    uploadedVideo: videoUpload.filename,
                    type: 'image',
                    videosFile: [...this.state.videosFile, postVideo],
                    videos: [...this.state.videos, videoUpload.filename],
                    videosDateNow: [...this.state.videosDateNow, dateNow],
                });
            });
        }
    };

    uploadPostVideoToPosts = (postVideo, storedDateNow) => {
        const videoData = new FormData();
        videoData.append('mediaDateNow', storedDateNow);
        videoData.append('mediaToPostsUpload', postVideo);

        uploadPostMediaMain(videoData);
    };

    handleSelectionChange = (e) => {
        this.setState({ interestValue: e.target.value });
    };

    // Render method for NewPost
    render() {
        const isMobile = window.matchMedia('(max-width: 500px)').matches;

        return !this.props.isQuestion ? (
            <>
                {isMobile && (
                    <div className='teams-container'>
                        <a
                            onClick={() => window.history.back()}
                            className='backbtn'
                        >
                            {' '}
                        </a>
                        <h6>Create Post</h6>
                    </div>
                )}
                <div className='main-container createnew'>
                    <div className='userthumb mt-2'>
                        <span className='userbx'>
                            <img
                                src={
                                    this.props.user.profilePicture
                                        ? `${
                                              getServerUrl().apiURL
                                          }/uploads/user/${
                                              this.props.user.profilePicture
                                          }`
                                        : profileBlank
                                }
                            />
                        </span>
                        <span
                            className={`${!isMobile ? 'text-white' : ''}`}
                        >{`${this.props.user.firstName} ${this.props.user.lastName}`}</span>
                    </div>

                    <form onSubmit={this.createPost}>
                        <div className='form-group'>
                            <label
                                className='form-label'
                                htmlFor='postDescription'
                            >
                                Write Something
                            </label>
                            <textarea
                                rows='3'
                                id='postDescription'
                                className='form-control'
                                placeholder={"What's on your mind?"}
                                ref={(val) => (this.descriptionInput = val)}
                                onChange={this.handleChange}
                                value={this.state.description}
                                required={
                                    this.state.imgs.length === 0 ? true : false
                                }
                            ></textarea>
                        </div>

                        <div className='form-group'>
                            <label
                                className='form-label'
                                htmlFor='interestSelection'
                            >
                                Interest
                            </label>
                            <select
                                className='custom-select'
                                id='interestSelection'
                                onChange={this.handleSelectionChange}
                                value={this.state.interestValue}
                                required
                            >
                                <option value='' disabled>
                                    Choose one...
                                </option>
                                <option value='Swim'>Swim</option>
                                <option value='Run'>Run</option>
                                <option value='Strength'>Strength</option>
                                <option value='Bike'>Bike</option>
                                <option value='Flexibility'>Flexibility</option>
                                <option value='Note'>Note</option>
                                <option value='Walk'>Walk</option>
                                <option value='Recovery'>Recovery</option>
                            </select>
                        </div>

                        <a
                            className='button'
                            onClick={() => this.openUploadPostPicture()}
                        >
                            <input
                                type='file'
                                ref={this.uploadPostPictureRef}
                                onChange={() => this.uploadPostPictureToTemp()}
                                onClick={(e) => (e.target.value = null)}
                                required={
                                    !this.state.description ? true : false
                                }
                            />
                            Add Photo
                        </a>

                        {this.state.imgs.map((img) => (
                            <div
                                key={img}
                                className='new-post-uploaded-image mt-1'
                            >
                                <div onClick={() => this.removePhoto(img)}>
                                    Click to remove
                                </div>
                                <img
                                    src={`${
                                        getServerUrl().apiURL
                                    }/uploads/temp/${img}`}
                                    alt=''
                                />
                            </div>
                        ))}

                        <a
                            className='button'
                            onClick={() => this.openUploadPostVideo()}
                        >
                            <input
                                type='file'
                                ref={this.uploadPostVideoRef}
                                onChange={() => this.uploadPostVideoToTemp()}
                                onClick={(e) => (e.target.value = null)}
                            />
                            Add Video
                        </a>

                        {this.state.videos.map((video) => (
                            <div
                                key={video}
                                className='new-post-uploaded-image mt-1'
                            >
                                <div onClick={() => this.removeVideo(video)}>
                                    Click to remove
                                </div>

                                <video width='100%' height='240' controls>
                                    <source
                                        src={`${
                                            getServerUrl().apiURL
                                        }/uploads/temp/${video}`}
                                        type='video/mp4'
                                    ></source>
                                </video>
                            </div>
                        ))}

                        <button className='button subbtn'>
                            Publish Your Post
                        </button>
                    </form>
                </div>
            </>
        ) : (
            <>
                {isMobile && (
                    <div className='teams-container'>
                        <a
                            onClick={() => window.history.back()}
                            className='backbtn'
                        >
                            {' '}
                        </a>
                        <h6>Create Question</h6>
                    </div>
                )}
                <div className='main-container createnew'>
                    <div className='userthumb mt-2'>
                        <span className='userbx'>
                            <img
                                src={
                                    this.props.user.profilePicture
                                        ? `${
                                              getServerUrl().apiURL
                                          }/uploads/user/${
                                              this.props.user.profilePicture
                                          }`
                                        : profileBlank
                                }
                            />
                        </span>
                        <span
                            className={`${!isMobile ? 'text-white' : ''}`}
                        >{`${this.props.user.firstName} ${this.props.user.lastName}`}</span>
                    </div>
                    <h3>Write a question</h3>
                    <form onSubmit={this.createPost}>
                        <div className='form-group'>
                            <textarea
                                rows='3'
                                id='postDescription'
                                className='form-control'
                                ref={(val) => (this.descriptionInput = val)}
                                onChange={this.handleChange}
                                value={this.state.description}
                                required
                            ></textarea>
                        </div>

                        <div className='form-group'>
                            <label
                                className='form-label'
                                htmlFor='interestSelection'
                            >
                                Interest
                            </label>
                            <select
                                className='custom-select'
                                id='interestSelection'
                                onChange={this.handleSelectionChange}
                                value={this.state.interestValue}
                                required
                            >
                                <option value='' disabled>
                                    Choose one...
                                </option>
                                <option value='Swim'>Swim</option>
                                <option value='Run'>Run</option>
                                <option value='Strength'>Strength</option>
                                <option value='Bike'>Bike</option>
                                <option value='Flexibility'>Flexibility</option>
                                <option value='Note'>Note</option>
                                <option value='Walk'>Walk</option>
                                <option value='Recovery'>Recovery</option>
                            </select>
                        </div>

                        <button className='button subbtn'>
                            Publish Your Question
                        </button>
                    </form>
                </div>
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    };
};

export default withRouter(connect(mapStateToProps, {})(NewPost));
