import React, {Component} from 'react';
import {Tabs, Tab, Modal, Row, Button, Col, Form, Card, Container, collapse} from "react-bootstrap";

class Login extends Component {        
    render() {
        return (
            <div class='outbx'>
                <div class="loginbx">
                 <img src="/uploads/images/grey-logo.png"/>
                 <h3><i>Welcome, <span>Login Here</span></i></h3>
                </div>
                <div class="loginbxin">
                <Form>
                  <Form.Group controlId="formBasicEmail">
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted"> </Form.Text>
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    
                    <Form.Control type="password" placeholder="Password" />
                  </Form.Group>
                   
                  <Button variant="primary" type="submit">Login</Button>
                </Form>
            
                <div class="frgtbxin">
                <a href="">Forgot Password?</a> <a href="">Get Registered</a>
                </div>
                <a class='fbbtn' href='#'><img src="/uploads/images/facebook.png"/>Login with Facebook</a>
                <a class='gglbtn' href='#'><img src="/uploads/images/google.png"/> Login with Google</a>
                </div>
            
                <div class="loginbx logpln">
                 <img src="/uploads/images/grey-logo.png"/>
                 <h3><i>Welcome, <span>Login Here</span></i></h3>
                </div>
                <div class="loginbxin logpln">
                <Form>
                  <Form.Group controlId="formBasicEmail">
                    
                    <Form.Control type="email" placeholder="Enter email" />
                    <Form.Text className="text-muted"> </Form.Text>
                  </Form.Group>

                  <Form.Group controlId="formBasicPassword">
                    <Form.Control type="password" placeholder="Password" />
                  </Form.Group>
                   
                  <Button variant="primary" type="submit">Login</Button>
                </Form>
            
                <div class="frgtbxin">
                <a href="">Forgot Password?</a> <a href="">Get Registered</a>
                </div>
                <a class='fbbtn' href='#'><img   src="/uploads/images/facebook.png"/>Login with Facebook</a>
                <a class='gglbtn' href='#'><img src="/uploads/images/google.png"/> Login with Google</a>
                </div>
            </div>
        )
    }
}

export default  Login;