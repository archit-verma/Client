/**
 * =====================================
 * REACT SCREEN COMPONENT className
 * =====================================
 * @date created: 21 August 2019
 * @authors: Hasitha Dias, Jay Parikh, Waqas Rehmani
 *
 * This file defines the SignUpUser screen component. The className SignUpUser
 * is where the component is defined. This is a screen component.
 *
 * This screen shows the Sign Up page for a user.
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import { signUpUser } from '../actions';

// Importing helper functions
import loading from '../assets/loading.svg';

class SignUpUser extends Component {
    // Constructor for SignUpUser
    constructor(props) {
        super(props);

        this.state = {
            userDetails: {
                userId: '',
                firstName: '',
                lastName: '',
                email:'',
                role: 'Athlete',
                password: '',
                dob: '',
                phone: '',
                type:'',
                socialid:'',
            },
            cpassword: '',
        };
    }
 
    // Handles change in the inputs given by user onto the fields.
    handleChange = () => {
        this.setState({
            userDetails: {
                ...this.state.userDetails,
                userId: this.userId.value,
                firstName: this.firstName.value,
                lastName: this.lastName.value,
                email: this.email.value,
                password: this.password.value,
                dob: Date.parse(this.dob.value),
                phone: this.phone.value,
            },
            cpassword: this.cpassword.value,
        });
    };
   
    componentDidMount() {
        if(this.props.sociallogin.email != undefined){
               this.setState({
                userDetails:{
                    ...this.state.userDetails,
                email: this.props.sociallogin.email,
                firstName:this.props.sociallogin.firstName,
                lastName:this.props.sociallogin.lastName,
                type:this.props.sociallogin.socialType,
                 socialid:this.props.sociallogin.socialId,
                }
            });
        }
        }
    
       
    // Changes type of user to Coach.
    changeRoleCoach = () => {
        this.setState({
            userDetails: {
                ...this.state.userDetails,
                role: 'Coach',
            },
        });
    };

    // Invokes the signup user API call, then logs the user in and redirects the user to continue onto the rest of the
    // signup.
    signUpUser = (e) => {
        e.preventDefault();

        // assign the user role
        let selectedRole = document.getElementById('roleSelect');

        if (selectedRole.value === 'Coach') {
            this.changeRoleCoach();
        }

        if (this.state.cpassword === this.state.userDetails.password) {
            this.props.signUpUser(this.state.userDetails);
        }
    };
  
    // Render method for Sign Up User
    render() {
        if (this.props.user && this.props.redirect) {
            return <Redirect to={this.props.redirect} />;
        }

        return (
            <div className='lgnrgstr'>
                <h6>Sign Up</h6>

                <form onSubmit={this.signUpUser}>
                    <div className='form-group'>
                        <label htmlFor='roleSelect'>Who are you?</label>
                        <select className='form-control' id='roleSelect'>
                            <option value='Athlete'>I am an athlete</option>
                            <option value='Coach'>I am a coach</option>
                        </select>
                    </div>

                    <div className='form-group'>
                        <label
                            className='form-label'
                            htmlFor='formGroupUsername'
                        >
                            Username
                        </label>
                        <input
                            type='text'
                            id='formGroupUsername'
                            className='form-control'
                            ref={(val) => (this.userId = val)}
                            onChange={this.handleChange}
                            value={this.state.userDetails.userId}
                            placeholder='Type your username'
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label
                            className='form-label'
                            htmlFor='formGroupFirstName'
                        >
                            First Name
                        </label>
                        <input
                            type='text'
                            id='formGroupFirstName'
                            className='form-control'
                            ref={(val) => (this.firstName = val)}
                            onChange={this.handleChange}
                            value={this.state.userDetails.firstName}
                            placeholder='Type your first name'
                            required
                            value = {this.state.userDetails.firstName}
                        />
                    </div>
                    <div className='form-group'>
                        <label
                            className='form-label'
                            htmlFor='formGroupLastName'
                        >
                            Last Name
                        </label>
                        <input
                            type='text'
                            id='formGroupLastName'
                            className='form-control'
                            ref={(val) => (this.lastName = val)}
                            onChange={this.handleChange}
                            placeholder='Type your last name'
                            required
                            value={this.state.userDetails.lastName}
                        />
                    </div>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='formGroupDOB'>
                            date Of Birth
                        </label>
                        <input
                            type='date'
                            id='formGroupDOB'
                            className='form-control'
                            ref={(val) => (this.dob = val)}
                            onChange={this.handleChange}
                            placeholder='Enter your date of birth'
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='formGroupPhone'>
                            Phone
                        </label>
                        <input
                            type='tel'
                            id='formGroupPhone'
                            className='form-control'
                            ref={(val) => (this.phone = val)}
                            onChange={this.handleChange}
                            minLength='10'
                            maxLength='10'
                            placeholder='Type your phone number'
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='formGroupEmail'>
                            Email
                        </label>
                        <input
                            type='email'
                            id='formGroupEmail'
                            className='form-control'
                            ref={(val) => (this.email = val)}
                            onChange={this.handleChange}
                            placeholder='Enter your email'
                            required
                            value = {this.state.userDetails.email}
                            readOnly =  {this.state.userDetails.type ? true : false}
                        />
                    </div>
                    <div className='form-group'>
                        <label className='form-label' htmlFor='formGroupPw'>
                            Password
                        </label>
                        <input
                            type='password'
                            id='formGroupPw'
                            className='form-control'
                            ref={(val) => (this.password = val)}
                            onChange={this.handleChange}
                            placeholder='Type your password'
                            required
                            minLength={6}
                            maxLength={12}
                        />
                    </div>
                    <div className='form-group'>
                        <label
                            className='form-label'
                            htmlFor='formGroupConfirmPw'
                        >
                            Confirm Password
                        </label>
                        <input
                            type='password'
                            id='formGroupConfirmPw'
                            className='form-control'
                            ref={(val) => (this.cpassword = val)}
                            onChange={this.handleChange}
                            placeholder='Retype your password'
                            required
                        />
                    </div>
                    <div className='form-group'>
                        <button className='button subbtn'>Next</button>
                    </div>
                </form>

                <p className='text-center'>
                    Already user? <Link to='/signInUser'>Sign In</Link>
                </p>

                {this.props.signupLoading ? (
                    <div className='signup-user-container-login'>
                        <img src={loading} alt='' />
                    </div>
                ) : (
                    <br />
                )}
            </div>
        );
    }
}
const mapStateToProps = (state) => {
    return {
        signupLoading: state.auth.signupLoading,
        user: state.auth.user,
        redirect: state.auth.redirect,
        sociallogin:state.auth.socialDetails,   
    };
};

export default connect(mapStateToProps, { signUpUser })(SignUpUser);

