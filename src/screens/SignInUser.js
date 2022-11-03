/**
 * =====================================
 * REACT COMPONENT className
 * =====================================
 * @date created: 22 August 2019
 * @authors: Waqas Rehmani
 *
 * This file defines the Login component. The className Login
 * is where the component is defined.
 *
 * This is a component defined for reusability.
 *
 * This component defines the login model that is seen throughout the app.
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import GoogleLoginBtn from 'react-google-login';
import FacebookLogin from 'react-facebook-login';
import { Tabs, Tab, Modal, Row, Button, Col, Form, Card, Container, collapse } from "react-bootstrap";
import { loginUser,socialLogIn} from '../actions';

// Importing icons and pictures
import { FaTimesCircle } from 'react-icons/fa';
import {
    IoIosAddCircleOutline,
    IoIosCheckmarkCircleOutline,
} from 'react-icons/io';
import loading2 from '../assets/loading2.svg';

// Importing helper functions
import {userIdExists} from '../utils/api';

class SignInUser extends Component {
    // Constructor
    constructor(props) {
        super(props);

        this.state = {
            loginDetails: {
                userId: '',
                password: '',
            },
            showLoading: false,
            loading: false,
            userExists: true,
        };
    }

    // Changes current userId or password whenever the user changes the values they have entered.
    handleChange = () => {
        this.setState({
            loginDetails: {
                userId: this.userIdIn.value,
                password: this.passwordIn.value,
            },
        });
    };

    // Logs the user into the system.
    loginUser = (e) => {
        e.preventDefault();
        this.props.loginUser(this.state.loginDetails);
    };
    
    // Checks of the user exists in the database using an API call.
    checkUserExists = () => {
        this.setState(
            {
                showLoading: true,
                loading: true,
            },
            () => {
                userIdExists(this.state.loginDetails.userId).then((res) => {
                    this.setState({
                        loading: false,
                        userExists: res,
                    });
                });
            }
        );
    };

    // Render method
    onLoginSuccess = (res) => {
      let loginDetails = {
            socialId:res.profileObj.googleId,
            socialType:'google',
            email:res.profileObj.email,
            firstName:res.profileObj.givenName,
            lastName:res.profileObj.familyName,
        }
            this.props.socialLogIn(loginDetails);
    
    }
    onLoginFaliure = (res) => {
        console.log("Log in Faliure", res)
    }
    state = {
        auth: "false",
        name: "",
        picture: ""
    }
    responseFacebook = response => {
        console.log(response)
        var data = [];
        data=response.name.split(' ');
        var fname = data[0];
         var latname = data[1];

         let loginDetails = {
           socialId:response.id,
           socialType:'facebook',
           email: response.email,
           firstName:fname,
           lastName:latname
         }
         this.props.socialLogIn(loginDetails);
         
    }
    componentClicked = () => console.log('clicked');

    render() {
        
        if (this.props.redirect) {
            return <Redirect to={this.props.redirect} />;

        }
        let facebookData;
        if (this.state.isLoggeIn) {
            facebookData = null;
        }
        else {
          
            facebookData = (<FacebookLogin
                appId="1048080372706950"
                fields="name,email,picture"
                onClick={this.componentClicked}
                callback={this.responseFacebook} />
                )     
        } 
        return (
            <div className='outbx'>
                <div className="loginbx">
                    <img src="/uploads/images/grey-logo.png" />
                    <h3><i>Welcome, <span>Login Here</span></i></h3>
                </div>
                <div className="loginbxin">
                    <form onSubmit={this.loginUser}>
                        <div className='form-group'>
                            <label className='form-label' htmlFor='formGroupEmail'>
                                Username/Email
                            </label>
                            <input
                                className='form-control'
                                type='text'
                                id='formGroupEmail'
                                ref={(val) => (this.userIdIn = val)}
                                onChange={this.handleChange}
                                value={this.state.loginDetails.userId}
                                required
                                onBlur={this.checkUserExists}
                            />
                            {this.state.showLoading ? (
                                <div>
                                    {this.state.loading ? (
                                        <img src={loading2} alt='' />
                                    ) : (
                                        <div>
                                            {this.state.userExists ? (
                                                <IoIosCheckmarkCircleOutline
                                                    className='login-loading-true'
                                                    size={22}
                                                />
                                            ) : (
                                                <IoIosAddCircleOutline
                                                    className='login-loading-false'
                                                    size={22}
                                                />
                                            )}
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <span />
                            )}
                        </div>
                        <div className='form-group'>
                            <label
                                className='form-label'
                                htmlFor='formGroupPassword'
                            >
                                Password
                            </label>
                            <input
                                className='form-control'
                                id='formGroupPassword'
                                type='password'
                                ref={(val) => (this.passwordIn = val)}
                                value={this.state.loginDetails.password}
                                onChange={this.handleChange}
                                required
                            />
                        </div>
                        <div className='form-group'>
                            <Button variant="primary" type="submit">
                                Login
                            </Button>
                        </div>
                        {this.props.incorrect ? (
                            <p style={{ color: 'red' }}>* Incorrect details</p>
                        ) : null}
                    </form>
                    <div className="frgtbxin">
                        <a href="">Forgot Password?</a>  <Link to='/signupUser'>Get Registered</Link>
                    </div>
                    {/* <a className='fbbtn' href='#'><img src="/uploads/images/facebook.png" />Login with Facebook</a> */}
                    <div className='btnfacbook'>
                        {facebookData}
                    </div>
                    <div className='btngoogle'>
                    <GoogleLoginBtn
                        clientId="589421384225-8t7d2ktt4gp3tv0o2kqphd4djq233hq1.apps.googleusercontent.com"
                        text="Login With google"
                        onSuccess={this.onLoginSuccess}
                        onFailure={this.onLoginFaliure}
                        cookiePolicy={"single_host_origin"}
                    />
                     </div>
                    {/* <a className='gglbtn' href='Logingoogle'><img src="/uploads/images/google.png" /> Login with Google</a> */}
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        incorrect: state.auth.incorrect,
        redirect: state.auth.redirectLogin,
    };
};

export default connect(mapStateToProps, { loginUser,socialLogIn})(SignInUser);