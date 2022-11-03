/**
 * =====================================
 * REACT SCREEN COMPONENT CLASS
 * =====================================
 * @date created: 19 August 2019
 * @authors: Waqas Rehmani
 *
 * This file defines the Trending screen component. The class Trending
 * is where the component is defined. This is a screen component.
 *
 * This screen shows the things that are new on the Coaching Mate Website for the purpose of promotion.
 *
 */


// Importing libraries for setup
import React, {Component} from 'react';
import {Tabs, Tab, Modal, Row, Button, Col, Form, Card, Container, collapse} from "react-bootstrap";
                           

    
class SplashSocial extends Component {
    
                   
    render() {
        return (
            
            
            <div class='outbx'>

                <div class="loginbx">
                 <img src="/uploads/images/grey-logo.png"/>
                 <h3><i><span>Register  Here</span></i></h3>
                </div>
                <div class="loginbxin">
                <Form>
                  <Form.Group controlId="formBasicEmail"> 
                    <Form.Control type="text" placeholder="First Name" />
                    <Form.Text className="text-muted"> 
                    </Form.Text>
                  </Form.Group>
            
                    <Form.Group controlId="formBasicEmail"> 
                    <Form.Control type="text" placeholder="Last Name" />
                    <Form.Text className="text-muted"> 
                    </Form.Text>
                    </Form.Group>
            
                  <Form.Group controlId="formBasicEmail"> 
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted"> 
                    </Form.Text>
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword"> 
                    <Form.Control type="password" placeholder="Password" />
                  </Form.Group>
                   
                  <Button variant="primary" type="submit">
                    Get Registered
                  </Button>
                </Form>
            
                <div class="frgtbxin">
                <a href="">Forgot Password?</a> <a href="">Get Registered</a>
                </div>
                <a class='fbbtn' href='#'><img src="/uploads/images/facebook.png"/>Register with Facebook</a>
                <a class='gglbtn' href='#'><img src="/uploads/images/google.png"/> Register with Google</a>
                </div> 
            
            </div>
             
            
            
            
        )
    }
}

export default  SplashSocial
