/**
 * =====================================
 * REACT SCREEN COMPONENT CLASS
 * =====================================
 * @date created: 17 October 2019
 * @authors: Hasitha Dias
 *
 * This file defines the EditGroup screen component. The class EditGroup
 * is where the component is defined. This is a screen component.
 *
 * It contains the form that user can fill to edit a group.
 *
 */

// Importing libraries for setup
import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import axios from "axios";
import {connect} from 'react-redux';

// Importing icons and pictures
import profileBlank from "../assets/profile_blank.png";
import {MdPhotoCamera} from "react-icons/md";
import loading from "../assets/loading.svg";

// Importing helper functions
import * as API from "../utils/api";
import {fileToBase64} from "../utils/helper";

class EditGroup extends Component {
    // Constructor for EditGroup
    constructor(props) {
        super(props);

        this.state = {
            group: {},
            uploadedImage: '',
            file: null,
            updateLoading: false,

        }
    }

    // This method is called when the component first mounts after the constructor is called
    componentDidMount() {
        API.getGroup(this.props.match.params.groupId).then(group => {
            let uploadedImage = ''
            if (group.coverPhoto !== '') {
                uploadedImage = group.coverPhoto
            }
            this.setState({
                group,
                uploadedImage
            })
        })
    }

    // Handles (stores) changes in any of the fields and displays them.
    handleChange = () => {
        this.setState({
            group: {
                ...this.state.group,
                groupName: this.groupName.value,
                description: this.description.value,
                interest: this.interest.value
            }
        })
    }

    // Updates group details with an API call.
    handleSubmit = (e) => {
        e.preventDefault();

        this.setState({
            updateLoading: true,
        }, () => {
            let editedGroup = this.state.group;
			let slugify = require('slugify');
			let slug = slugify(this.state.group.groupName, {replacement: '-', remove: null, lower: true});
			editedGroup.slug = slug;

            if (this.state.file !== null) {
                const data = new FormData()
                data.append('groupId', this.state.group.groupId);
                data.append('file', this.state.file);

                axios.put(API.getServerUrl().apiURL+"/groups/" + this.state.group.groupId + "/coverPhoto", data, {
                    onUploadProgress: ProgressEvent => {
                        this.setState({
                            progressBar: Math.ceil(ProgressEvent.loaded / ProgressEvent.total * 100),
                        })
                    },
                }).then(res => {

                    if (res.status === 200) {
                        API.editGroup(this.state.group.groupId, editedGroup).then(group => {
                            this.setState({updateLoading: false})
                            if (group.groupId) {
                                this.props.showPopup('Group Details Updated', 'Group Home', '/group/' + this.state.group.groupId)
                            } else {
                                this.props.showPopup('Error in updating group. Please try again.', 'Try Again', 'none')
                            }
                            // this.props.editUser(res.userId)
                        })

                    }
                });
            } else {

                API.editGroup(this.state.group.groupId, editedGroup).then(group => {
                    this.setState({updateLoading: false})
                    if (group.groupId) {
                        this.props.showPopup('Group Details Updated', 'Group Home', '/group/' + this.state.group.groupId)
                    } else {
                        this.props.showPopup('Error in updating group. Please try again.', 'Try Again', 'none')
                    }
                })
            }
        })


    }

    // Uploads image onto system.
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
    }

    // Render method for Edit
    render() {
        let pictureExists = true
        if (this.state.uploadedImage === '') {
            pictureExists = false
        }

        if (this.props.userSignedIn) {
            return (
                <div className='create-group-container'>
                    {
                        this.state.updateLoading
                            ?
                            <div className='signup-user-container-login'>
                                <img src={loading} alt="" />
                            </div>
                            :
                            null
                    }
                    <h2>Edit Group</h2>

                    <form onSubmit={this.handleSubmit}>
                        <div>
                            <label>Group Name: </label>
                            <input ref={(val) => this.groupName = val} onChange={this.handleChange}
                                   value={this.state.group.groupName} required/>
                        </div>

                        <div>
                            <label>Profile Picture:</label>
                            <div id='edit-profile-form1-picture'>
                                <label className="new-post-container-buttons-photo">
                                    <MdPhotoCamera/>
                                    <input type="file" accept=".jpg,.png" onChange={this.handleChangePhoto}/>
                                    Upload Photo
                                </label>
                                {
                                    pictureExists
                                        ?
                                        <div
                                            id={this.state.pictureLoading ? 'edit-profile-form1-picture-img-loading' : 'edit-profile-form1-picture-img-loaded'}
                                        >
                                            <img
                                                // src={this.state.pictureLoading ? loading : this.state.uploadedImage}
                                                src={this.state.uploadedImage}
                                                alt='Profile Pic'
                                            />
                                        </div>

                                        :

                                        <div
                                            id={'edit-profile-form1-picture-img-loaded'}
                                        >
                                            <img
                                                src={profileBlank}
                                                alt='Profile Pic'
                                            />
                                        </div>

                                }
                            </div>
                        </div>

                        <div>
                            <label>Description: </label>
                            <textarea ref={(val) => this.description = val} onChange={this.handleChange}
                                      value={this.state.group.description} required/>
                        </div>

                        <div className='create-group-container-section'>
                            <label>
                                Type of Group:
                            </label>
                            <select ref={(val) => this.interest = val} onChange={this.handleChange}
                                    value={this.state.group.interest}>
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

                        <span className='create-group-container-span'>
                            <button>Done</button>
                        </span>


                    </form>


                </div>
            )
        } else {
            return (
                <div className='home-container-no-user'>
                    <h2>You must login to see your feed.</h2>
                    <div>
                        <Link to='/signInUser'>Log In</Link>
                        <Link to='/signupUser'>SignUp</Link>
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

export default withRouter(connect(mapStateToProps, {})(EditGroup));