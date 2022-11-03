/**
 * =====================================
 * REACT SCREEN COMPONENT CLASS
 * =====================================
 * @date created: 15 October 2019
 * @authors: Hasitha Dias, Waqas Rehmani
 *
 * This file defines the CreateGroup screen component. The class Create Group
 * is where the component is defined. This is a screen component.
 *
 * It contains the form that user can fill to create a group.
 *
 */


// Importing libraries for setup
import React, {Component} from 'react';
import { Link } from "react-router-dom";
import {connect} from 'react-redux';

class CreateGroup extends Component {
    // Constructor for CreateGroup
    constructor(props) {
        super(props);

        this.state = {
            groupDetails: {
                groupId: '',
                groupName: '',
                creator: props.user.userId,
                description: '',
                interest: '',
                members: [props.user.userId],
                time: new Date()
            }
        }
    }

    // Handles (stores) changes in any of the fields and displays them.
    handleChange = () => {
        this.setState({
            groupDetails: {
                ...this.state.groupDetails,
                groupName: this.groupName.value,
                description: this.description.value,
                interest: this.interest.value
            }
        })
    }

    // Invokes the create group API call.
    createGroup = (e) => {
        e.preventDefault();

        let id = 'G' + Math.floor(Math.random() * 100000).toString();
		let slugify = require('slugify');
		let slug = slugify(this.state.groupDetails.groupName, {replacement: '-', remove: null, lower: true});

        this.setState({
            groupDetails: {
                ...this.state.groupDetails,
                groupId: id,
				slug,
                time: Date.now(),
            }
        }, () => {
            this.props.createGroup(this.state.groupDetails).then(res => {
                this.props.showPopup('New Group Created', 'Group Page', '/group/' + this.state.groupDetails.groupId)
            }, err => {
                this.props.showPopup('Error in creating group. Please try again.', 'Try Again', 'none')
            })
        })
    }

    // Render method CreateGroup
    render() {
        // Displays Page only if the user is signed in
        if (this.props.userSignedIn) {
            return (
                <div className='create-group-container'>

                    <h2>Create Group</h2>

                    <form onSubmit={this.createGroup}>
                        <div>
                            <label>Group Name: </label>
                            <input ref={(val) => this.groupName = val} onChange={this.handleChange}
                                   value={this.state.groupDetails.groupName} required/>
                        </div>

                        <div>
                            <label>Description: </label>
                            <textarea ref={(val) => this.description = val} onChange={this.handleChange}
                                      value={this.state.groupDetails.description} required/>
                        </div>

                        <div className='create-group-container-section'>
                            <label>
                                Type of Group:
                            </label>
                            <select ref={(val) => this.interest = val} onChange={this.handleChange} required>
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
                            <button>Create Group</button>
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
		userSignedIn: state.auth.userSignedIn,
		user: state.auth.user
	};
};

export default connect(mapStateToProps, {})(CreateGroup);