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
import React, {Component, useState} from 'react';
import {Tabs, Tab, Modal, Row, Button, Col, Form, Card, Container, Collapse, Table, Overlay, OverlayTrigger, Popover   } from "react-bootstrap";
 
                       

    
class DesktopDesign extends Component {
    
     constructor(props) {
        super(props);
        this.state = {
            modalShow: false,
            open:false
        }
    }
    
    openModal = () => {
        this.setState({
            modalShow: true
        })
    }
    closeModal = () => {
        this.setState({
            modalShow: false
        })
    }
    
    setOpen = (val) => {
        this.setState({
            open: val
        })
    }
                   
    render() {
        return (
            <div className='outbx desktop'> 
            
            
            
        
            
            
            
            <Modal
      onHide={this.closeModal}
      size="lg"
            show={this.state.modalShow}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
         
      </Modal.Header>
      <Modal.Body>
        <div class="row pstdtlout ">
        <div class="col-6 ansrmodl">
            
            <div class="postbx psttxt bxshadow "><div class="usrtop"><div class="row"><div class="col-6"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a><div><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div></div></div><div class="col-6 "><span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span></div></div></div><p class="f14">Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home, + simply in one part of the world, for long periods of time doesn’t mean you need to miss out on all the incredible sights this world has to offer!</p><div class="row"><div class="rctbx mt-2 col-9"><span><img src="/uploads/images/symbol1.png"/>23</span><span><img src="/uploads/images/symbol2.png"/>23</span><span><img src="/uploads/images/symbol3.png"/>23</span><span><img src="/uploads/images/symbol4.png"/>23</span><span><img src="/uploads/images/symbol5.png"/>23</span></div><div class="optbx mt-2 col-3 text-right"><a href="#"><img src="/uploads/images/ver-opt.png"/></a></div></div><div class="lkbxbtm f12"><div class="row"><div class="col"><a href="#"><img src="/uploads/images/hand.png"/>Back Slap</a></div><div class="col"><a href="#"><img src="/uploads/images/comment.png"/>Comment</a></div><div class="col"><a href="#"><img src="/uploads/images/share.png"/>Share</a></div></div></div></div>
            
            <div class="pstcomnt">
            <h4>Post Your Answer</h4>
                <Form> 
                  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Control as="textarea" rows={3} />
                  </Form.Group>
                  <p><button type="submit " class="btn btn-primary button subbtn">Answer This Question</button></p>
                  </Form>
            </div>
            </div>
                   <div class="col-6 mt-3 rghtbxdtl mb-3">
                    <h4 class="mb-4"><span class="grntxt">4</span> Peolpe answered this question</h4>
                    <div class="tpanswr">
            
            
                    <h6 class="grntxt">Top Answer</h6>
            
                     <div class="usrtop"><div class="row"><div class="col-6"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a><div><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div></div></div><div class="col-6 "></div></div></div>
            
                    <p class="f14">Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home, or simply in one part of the world, for long periods</p><div class="row"><div class="col-6 pr-1 text-center"><p class="grntxt"> 24 found helpful </p><a href="" class="btn grnbtn">I am Agree</a></div><div class="col-6 pl-1 text-center"><p>12 not convinced</p><a href="" class="btn grybtn">Not Agree</a></div></div></div>
                    
                    <h6 class="mt-4">Other Answers</h6>
                    <div class="mt-4">
            
                    <div class="usrtop"><div class="row"><div class="col-6"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a><div><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div></div></div><div class="col-6 "></div></div></div>
            
                    <p class="f14">Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home, or simply in one part of the world, for long periods</p><div class="row"><div class="col-6 pr-1 text-center"><p class="grntxt"> 24 found helpful </p><a href="" class="btn grnbtn">I am Agree</a></div><div class="col-6 pl-1 text-center"><p>12 not convinced</p><a href="" class="btn grybtn">Not Agree</a></div></div></div>
                     
                    <div class="mt-4">
            
                    <div class="usrtop"><div class="row"><div class="col-6"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a><div><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div></div></div><div class="col-6 "></div></div></div>
            
                    <p class="f14">Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home, or simply in one part of the world, for long periods</p><div class="row"><div class="col-6 pr-1 text-center"><p class="grntxt"> 24 found helpful </p><a href="" class="btn grnbtn">I am Agree</a></div><div class="col-6 pl-1 text-center"><p>12 not convinced</p><a href="" class="btn grybtn">Not Agree</a></div></div></div>
                    
                    <div class="mt-4">
            
                    <div class="usrtop"><div class="row"><div class="col-6"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a><div><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div></div></div><div class="col-6 "></div></div></div>   
            
                    <p class="f14">Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home, or simply in one part of the world, for long periods</p><div class="row"><div class="col-6 pr-1 text-center"><p class="grntxt"> 24 found helpful </p><a href="" class="btn grnbtn">I am Agree</a></div><div class="col-6 pl-1 text-center"><p>12 not convinced</p><a href="" class="btn grybtn">Not Agree</a></div></div></div> 

                    </div>
            
                    
            
            
                    </div>
      </Modal.Body>
      
    </Modal>
        
        
        
        
                        
                             
            
 
                             <div class="msgsbxs">
                                 
                        
                                <h5>Messages</h5><span class="close">×</span>
                                  <Tabs id="uncontrolled-tab-example" className="mb-3">
                                  <Tab eventKey="home" title="People">
                                 <div class="msgsbxsin">   
                                <div class="teamsrchbx mb-3"><div class="row"><div class="col-12"><div class="form-group"><input placeholder="Search People" type="text" class="form-control"/><button>
                                <img src="/uploads/images/search.png"/></button></div></div></div></div>
                                
                                <div class="usrtop"><div class="row"><div class="col-3 f12"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div><div class="col-9 nopad"><a>Adam Grason</a><span class="small pstim grntxt">coach</span></div></div></div>
                                <div class="usrtop"><div class="row"><div class="col-3 f12"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div><div class="col-9 nopad"><a>Adam Grason</a> </div></div></div>
            
                                <div class="usrtop"><div class="row"><div class="col-3 f12"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div><div class="col-9 nopad"><a>Adam Grason</a> </div></div></div> 
                                </div>
                                  </Tab>
                                  <Tab defaultActiveKey="profile" eventKey="profile" title="Boards">
                                    <div class="msgsbxsin">   
                                    <div class="teamsrchbx mb-3"><div class="row"><div class="col-12"><div class="form-group"><input placeholder="Search Boards" type="text" class="form-control"/><button>
                                    <img src="/uploads/images/search.png"/></button></div></div></div></div>

                                    <div class="usrtop"><div class="row"><div class="col-3 f12"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/><span class="brdimg1"><img src="/uploads/images/user1.jpg"/></span><span class="brdimg2"><img src="/uploads/images/user-thumb-big.jpg"/></span></a></div></div><div class="col-9 nopad f14"><a>Team Strong N Fit Discussion Board</a>
                                    <span class="small pstim  ">4 members</span></div></div></div>
                                    <div class="usrtop"> </div>

                                    <div class="usrtop"><div class="row"><div class="col-3 f12"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/><span class="brdimg1"><img src="/uploads/images/user1.jpg"/></span><span class="brdimg2"><img src="/uploads/images/user-thumb-big.jpg"/></span></a></div></div><div class="col-9 nopad"><a>The Marathon Club</a>
                                    <span class="small pstim">34 members</span></div></div></div> 
                                </div>
            
                                  </Tab>

                                </Tabs>

                                    
                                
            
                                
                            </div>
                    
                            <div class="cnvrsbx">

                                <div class="msghdr">
                                <h5>Coversation Between <span class="grntxt">You</span> and <span class="grntxt">Adam Grason</span></h5><span class="close">×</span>
                                </div>

                                <div class="usrmsgbx">
                                <div class="usrtop"><div class="row"><div class="col-2 f12"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div><div class="col-10 nopad mt-2"><a>Adam Grason</a>
                                <span class="small pstim">2 day ago</span></div></div></div> 
                                <p class="f14">Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home, or simply in one part of the world.</p> 
                                </div>
            
                                <div class="usrmsgbx msgyou">
                                <div class="usrtop"><div class="row"><div class="col-2 f12"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user1.jpg"/></a></div></div><div class="col-10 nopad mt-2"><a>You</a>
                                <span class="small pstim">2 day ago</span></div></div></div> 
                                <p class="f14">Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home.</p> 
                                </div> 
            
                                <div class="usrmsgbx">
                                <div class="usrtop"><div class="row"><div class="col-2 f12"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div><div class="col-10 nopad mt-2"><a>Adam Grason</a>
                                <span class="small pstim">2 day ago</span></div></div></div> 
                                <p class="f14">Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home, or simply in one part of the world, for long periods of time</p> 
                                </div> 
                                
                                <div class="msgwrtbx">
                                <h5>Write Message To <span class="grntxt">"Adam Grason"</span></h5>
                                <div class="form-group"><input placeholder="Write Message " type="text" class="form-control"/>
                                <button class="button"><img  src="/uploads/images/attach.svg"/></button></div>
                                </div>
                                
                                
                            </div>
                            
            
            
                            <div class="hdrsec">
                            <div class="container">
                            <div class="row">
                            <div class="col-2 leftprt"><div class="logo"><img src="/uploads/images/logo.jpg"/></div></div>
                            <div class="col-10">
                                <ul> 
                                <li><a className='selsec' href='#'><img src="/uploads/images/home.svg"/><span>Feed</span></a></li>
                                <li><a href='#'><img src="/uploads/images/trending.svg"/><span>Trending</span></a></li>
                                <li><a href='#'><img src="/uploads/images/questions.svg"/><span>Answers</span></a></li>
                                <li class="centerprt">
                                <div class="form-group"><input placeholder="Search" type="text" class="form-control"/><button>
                                <img src="/uploads/images/search.png"/></button></div>
                                </li>
                                 <li><a href="#"><img src="/uploads/images/notification.svg"/><span>Alerts</span></a>
                                <div class="ntfbx">
                                    
                                    <div class="pplsrch grpsrch"><div class="usrtop"><div class="row"><div class="col-2 f12"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div><div class="col-10 nopad"><a>Adam Grason</a><span class="small pstim">12 min ago</span>
                                    <p class=" f12">Commented on your post</p></div></div></div></div>
                
            
                                    <div class="pplsrch grpsrch"><div class="usrtop"><div class="row"><div class="col-2 f12"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div><div class="col-10 nopad"><a>Adam Grason</a><span class="small pstim">12 min ago</span>
                                    <p class="f12">Start Following You</p></div></div></div></div>
            
            
                                    <div class="pplsrch grpsrch"><div class="usrtop"><div class="row"><div class="col-2 f12"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div><div class="col-10 nopad"><a>Event: Marathon Malbourn</a><span class="small pstim">12 min ago</span>
                                    <p class=" f12">Starting: 10 am to 12 pm 12 oct</p></div></div></div></div>
                                    <hr/>
                                    <p class='f12'><a href='#'>Clear Notifications</a></p>
            
                                </div>
                                </li>
                                 <li><a href="#"><img src="/uploads/images/messages.svg"/><span>Messages</span></a></li> 
                                </ul> 
                                </div>
                             
                            
                             
                            </div>
                            </div>
                            </div>
                             
            
                            <div class="container cntntbx ">
                                <div class="row"> 
                                      
            
                                    <div class="col-md-4 col-lg-3">
            
                                    <div role="region" aria-label="Code Example" class="ReactPlayground-StyledExample-module--cls2--Z1-mo ReactPlayground-StyledExample-module--cls1--2oYwU bs-example ReactPlayground-StyledExample-module--show-code--rW9o2"><div><button type="button" class="btn btn-primary" onClick={this.openModal}>Answer Question Popup</button></div></div>
            
                                    <div class=" bxshadow menuinr">
                                       <div class="userthumb"><div class="userbx "><img src="/uploads/images/user1.jpg"/></div><div>David Makron</div> 
                                        </div>
           
                                    </div>
                                    
            
                                     <div className='mnuen'>
                                        <p><b>Group: Ketogenic Diet</b></p>
                                        <ul>
                                            <li><a href='#'><span><img src="/uploads/images/recent.svg"/></span> Most Recent</a>
                                            <span class="f12 grytxt">8</span></li>
                                            <li><a href='#'><span><img src="/uploads/images/group.svg"/></span> Group</a>
                                            <span class="f12 grytxt">7</span></li>
                                            <li><a href='#'><span><img src="/uploads/images/team.svg"/></span> Teams</a>
                                            <span class="f12 grytxt">6</span></li>
                                            <li><a href='#'><span><img src="/uploads/images/follow.svg"/></span> Your Followers
                                            </a><span class="f12 grytxt">4</span></li>
                                            <li><a href='#'><span><img src="/uploads/images/flag.svg"/></span> Events</a>
                                            <span class="f12 grytxt">12</span></li>
                                            <li><a href='#'><span><img src="/uploads/images/bookmark.svg"/></span> Saved</a>
                                            <span class="f12 grytxt">11</span></li>
                                            <li><a href='#'><span><img src="/uploads/images/setting.svg"/></span> Settings</a></li>
                                            <li><a href='#'><span><img src="/uploads/images/logout.svg"/></span> Logout</a></li>
                                        </ul>
                                        <p class="mt-4 mb-0"><a class="btnspl" href="#">Join The Group</a></p>       
                                    </div>
                                    <div className='mnuen'>
                                        <p><b>Group: Ketogenic Diet</b></p>
                                        <p><img src="/uploads/images/dummy-logo.png"/></p>
                                        <ul>
                                            <li><a href='#'><b>Page Info</b></a></li>
                                            <li><a href='#'><b>Page Members</b></a>      </li>
                                            <li><a href='#'><b>Membership Plans</b></a></li>
                                            <li><a href='#'><b>Post Mangement</b></a></li>
                                            <li><a href='#'><b>Payment Setup</b></a></li>
                                            <li><a href='#'><b>Account Settings</b></a></li> 
                                            <li><a href='#'><b>Help</b></a></li> 
                                           
                                        </ul>
                                        <p class="mt-4 mb-0"><a class="btnspl" href="#">Join The Group</a></p>       
                                    </div>
            
            
            
                                    </div>
                                     <div class="col-md-8 col-lg-9">
                                     <div class="topbanner bxshadow ">
                                     <img src="/uploads/images/banner1.png"/>
                                     <div class="row bnrin1">
                                        <div class="col-md-12 col-lg-5"><h3>Ketogenic Diet Coaching</h3></div>
                                        <div class="col-md-12 col-lg-7 bnrin2 ">
                                        <span>123 members</span> 
                                        <span>Joined</span>
                                        <span class="mropt"><img src="/uploads/images/dots.png"/> Options</span>
                                        </div>  
                                     </div>
                                     </div>
                                       
            
                                     <div class="topbanner bxshadow ">
                                     <img src="/uploads/images/banner2.jpg"/>
                                     <div class="row bnrin1">
                                        <div class="col-md-12 col-lg-5"><h3>Ketogenic Diet Coaching</h3></div>
                                        <div class="col-md-12 col-lg-7 bnrin2 ">
                                        <span>123 members</span> 
                                        <span><a class="grntxt btn" href="#">View Membership Plans</a></span>
                                        <span class="mropt"><img src="/uploads/images/dots.png"/> Options</span>
                                        </div>  
                                     </div>
                                     </div>
            
                                        
                                        <div class="pkgsbxot">
                                            <div class="row">
                                            <div class="col-4">
                                            <div class="pkginbx bxshadow">
                                            <h4>Bit Long Package Title Goes Here</h4>
                                            <h5 class="grntxt">$35.00</h5>
                                            <ul>
                                                <li>Not being able to travel</li>
                                                <li>However, being stuck at home</li>
                                                <li>for long periods of time</li>
                                                <li>Not being able to travel</li>
                                                <li>Being stuck at home</li>
                                            </ul>
                                            <a class="btn btngrn " href="#">Buy This Package</a>        
                                            </div>
                                            </div>
                                            <div class="col-4">
                                            <div class="pkginbx popular bxshadow">
                                            <h4>Package Title Here</h4>
                                            <h5 class="grntxt">$45.00</h5>
                                            <ul>
                                                <li>Not being able to travel</li>
                                                <li>However, being stuck at home</li>
                                                <li>for long periods of time</li>
                                                <li>Not being able to travel</li>
                                                <li>Being stuck at home</li>
                                                <li>However, being stuck at home</li>
                                                <li>for long periods of time</li>    
                                            </ul>
                                             <a class="btn btngrn " href="#">Buy This Package</a>
                                            </div>
                                            </div>
                                            <div class="col-4">
                                            <div class="pkginbx bxshadow">
                                            <h4>Package Title Here</h4>
                                            <h5 class="grntxt">$45.00</h5>
                                            <ul>
                                                <li>Not being able to travel</li>
                                                <li>However, being stuck at home</li>
                                                <li>for long periods of time</li>
                                                <li>Not being able to travel</li>
                                                <li>Being stuck at home</li>
                                                <li>However, being stuck at home</li>
                                                <li>for long periods of time</li>    
                                            </ul>
                                             <a class="btn btngrn " href="#">Buy This Package</a>
                                            </div>
                                            </div>
                                            <div class="col-4">
                                            <div class="pkginbx bxshadow">
                                            <h4>Package Title Here</h4>
                                            <h5 class="grntxt">$55.00</h5>
                                            <ul>
                                                <li>Not being able to travel</li>
                                                <li>However, being stuck at home</li>
                                                <li>for long periods of time</li>
                                                <li>Not being able to travel</li>
                                                <li>Being stuck at home</li>
                                            </ul>
                                            <a class="btn btngrn " href="#">Buy This Package</a>
                                            </div>    
                                            </div>
                                            </div>
                                        </div>
                                      
                                        <div class="admincntnt bxshadow ">
            
                                            <h4>Page Info</h4>
                                           <Form>
                                              <Form.Group className="mb-3" controlId="formGroupEmail">
                                                <Form.Label>Page Name</Form.Label>
                                                <Form.Control type="email" placeholder="Set your page name" />
                                              </Form.Group>
                                               
                                             <Form.Group controlId="formFileLg" className="mb-3">
                                                <Form.Label>Upload Logo (Max 500px by 500px)</Form.Label>
                                                <Form.Control type="file" size="lg" />
                                              </Form.Group>
                                            <Form.Label class="f14">Activity Type</Form.Label>
                                              <Form.Control as="select" size="lg" class="">  
                                                <option>Swimming</option>
                                                <option>Lifting</option>    
                                              </Form.Control>
        
                                              <Form.Group className="mb-3 mt-3 col-6 nopad" controlId="formGroupEmail">
                                                <Form.Label>Phone Number</Form.Label>
                                                <Form.Control  type="text" placeholder="Your Phone Number" />
                                              </Form.Group>
        
                                                <Form.Group className="mb-3 mt-3" controlId="formGroupEmail">
                                                <Form.Label>Address</Form.Label>
                                                <Form.Control type="text" placeholder="Type Stree Address" />
                                                </Form.Group> 

                                                <div class="row">
                                                <div class="col-6 "><Form.Group className="mb-3 mt-3  nopad" controlId="formGroupEmail">
                                                <Form.Control type="email" placeholder="City, State and Country" />
                                                </Form.Group></div>
                                                <div class="col-6 mt-3 f14 ">
                                                     <Form.Label for="inline-checkbox-33"><input name="group1" type="checkbox" id="inline-checkbox-33" class="form-check-input"/>
                                                        Customers may visit my buisness place. Uncheck will hide the address
                                                        from users.</Form.Label>       
                                                </div> 
                                                </div> 

                                                <Form.Group className="mb-3" >
                                                <Form.Label>Opening Timings</Form.Label>
                                                    <div class="row ml-0 mr-0">
                                                  <div class="col f16">
                                                   <Form.Label for="inline-checkbox-1"><input name="group1" type="checkbox" id="inline-checkbox-1" class="form-check-input"/>Mon</Form.Label>       
                                                 </div>
                                                 <div class="col f16">
                                                   <Form.Label for="inline-checkbox-2"><input name="group1" type="checkbox" id="inline-checkbox-2" class="form-check-input"/>Tue</Form.Label>       
                                                 </div>  
                                                 <div class="col f16">
                                                   <Form.Label for="inline-checkbox-3"><input name="group1" type="checkbox" id="inline-checkbox-3" class="form-check-input"/>Wed</Form.Label>       
                                                 </div>
                                                 <div class="col f16">
                                                   <Form.Label for="inline-checkbox-4"><input name="group1" type="checkbox" id="inline-checkbox-4" class="form-check-input"/>Thu</Form.Label>       
                                                 </div>
                                                 <div class="col f16">
                                                   <Form.Label for="inline-checkbox-5"><input name="group1" type="checkbox" id="inline-checkbox-5" class="form-check-input"/>Fri</Form.Label>       
                                                 </div>   
                                                 <div class="col f16">
                                                   <Form.Label for="inline-checkbox-6"><input name="group1" type="checkbox" id="inline-checkbox-6" class="form-check-input"/>Sat</Form.Label>       
                                                 </div>     
                                                 <div class="col f16">
                                                   <Form.Label for="inline-checkbox-7"><input name="group1" type="checkbox" id="inline-checkbox-7" class="form-check-input"/>Sun</Form.Label>       
                                                 </div>   
                                                </div>   
                                                </Form.Group>
                                                    
                                                <Form.Group className="mb-3 mt-3 col-6 nopad" controlId="formGroupEmail">
                                                <Form.Label>Opening Hours</Form.Label>
                                                <div class="row">
                                                    <div class="col"><Form.Control  type="text" placeholder="From" /></div>
                                                     <div class="col"><Form.Control  type="text" placeholder="To" /></div>
                                                    </div> 
                                              </Form.Group>   
                                               <p class="mt-4"><hr/></p> 
                                               <div class="col-6 nopad mt-2"><button type="button" class="btn btn-primary button subbtn f16">Save Information</button> </div>             
                                                               
                                            </Form>
 
         
                                        </div>
        
                                          <div class="admincntnt bxshadow ">
            
                                            <h4>Page Members (2,352)</h4>
                                            <Form>
                                             <div className="mb-3">
                                                        <div class="mb-3 row">
                                                        <div class="col">
                                                        <label class="form-label" for="formGridCity">Show All</label>
                                                        <select class="form-control form-control-lg"><option>People who baned</option><option>Paid members</option>
                                                        <option>Free members</option>
                                                        <option>Members package 1</option>
                                                        <option>Members package 2</option>
                                                        <option>Members package 3</option>
                                                        </select>
                                                        </div>
                                                        <div class="col"><label class="form-label" for="formGridState">Search</label><input placeholder="Type Member Name" type="text" id="formGroupEmail" class="form-control"/></div>
                                                        <div class="col"><label class="form-label" for="formGridZip">Actions</label><select class="form-control form-control-lg">
                                                        <option>Ban from Page</option>
                                                        <option>Remove from Page</option>
                                                        </select>
                                                        </div>
                                                        </div>
                                              </div>
                                             </Form>
                                            
                                            <p class="f12"><b>Banned:</b> Person or group of people banned can’t post, comment or take other actions on the page but they can still view activity on the page</p>
                                            <p class="f12"><b>Removed:</b> Person or group of people who are removed will be set to unfollow the page and longer considered as members</p>
                                            <p class="f12"><b>Admin:</b> Admin have all the rights to modify and operate page</p>
                                            <p class="f12"><b>Coach:</b> Coach can add modify plans, posts and members</p>
                                            <p class="f12"><b>Moderator:</b> Moderator can Approve and Disapprove posts only</p>
                                                
                                                
                                            <Table striped bordered hover >
  <thead>
    <tr>
      <th> </th>
      <th>Name</th>
      <th>Role</th>
      <th>Member Since</th>
    </tr>
  </thead>
  <tbody class="imtbl">
    <tr>
      <td><input name="group1" type="checkbox" id="inline-checkbox-3" class="form-check-input"/></td>
      <td><div class="userbx "><img src="/uploads/images/user1.jpg"/></div> Mark David</td>
      <td>
          <select class="form-select form-select-sm">
          <option>Assign Role</option>
          <option>Admin</option>
          <option>Coach</option>  
          </select>
      </td>
      <td>12 June 2017</td>
    </tr>
    <tr>
      <td><input name="group1" type="checkbox" id="inline-checkbox-3" class="form-check-input"/></td>
      <td><div class="userbx "><img src="/uploads/images/user2.jpg"/></div> Andrew Peter</td>
      <td> <select class="form-select form-select-sm">
          <option>Assign Role</option>
          <option>Admin</option>
          <option>Coach</option>
          </select></td>
      <td>13 June 2017</td>
    </tr>
     <tr>
      <td><input name="group1" type="checkbox" id="inline-checkbox-3" class="form-check-input"/></td>
      <td><div class="userbx "><img src="/uploads/images/user1.jpg"/></div> Jason Mathew</td>
      <td> <select class="form-select form-select-sm">
          <option>Assign Role</option>
          <option>Admin</option>
          <option>Coach</option>
          </select></td>
      <td>14 June 2017</td>
    </tr>
  </tbody>
</Table>   
<p class="mt-4"><hr/></p>
                                                
                          <div class="col-6 nopad mt-2"><button type="button" class="btn btn-primary button subbtn f16">Save</button> </div>
              </div>
        
        
            <div class="admincntnt bxshadow ">            
            <h4>Edit Membership: </h4>
            <form>    
              <Form.Group className="mb-3 mt-3 col-6 nopad" controlId="">
              <Form.Label>Membership Name</Form.Label>
              <Form.Control  type="text" placeholder="Type Package Name" />
              </Form.Group>
                
              <Form.Group className="mb-3 mt-3 col-3 nopad" controlId="">
              <label>Features Type</label>   
              <select class="form-control form-control-lg">
              <option>Description</option>
              <option>List Points</option>
              </select>
              </Form.Group>
        
              <Form.Group className="mb-3 mt-3 col-6 nopad" controlId="">
              <label>Description</label>   
              <textarea rows="3" id="exampleForm.ControlTextarea1" class="form-control"></textarea>
              </Form.Group>
        
              <Form.Group className="mb-3 mt-3 col-3 nopad" controlId="">
              <label>Payment Requirments</label>   
              <select class="form-control form-control-lg">
              <option>Recurring Payment</option>
              <option>One Time Payment</option>
              <option>Per Session Payment</option>  
              </select>
              </Form.Group>
        
              <Form.Group className="mb-3 mt-3 col-3 nopad" controlId="">
              <label>Payment Frequency</label>   
              <select class="form-control form-control-lg">
              <option>Weekly</option>
              <option>Monthly</option>
              <option>Quarterly</option>
              <option>Yearly</option>  
              </select>
              </Form.Group>  

              <Form.Group className="mb-3 mt-3 col-3 nopad" controlId="">
              <Form.Label>Discontinue After Number Of Payments</Form.Label>
              <Form.Control  type="text" placeholder="Type Number" />
              <span>Option set to 0 = unlimited recurring payments</span>    
              </Form.Group>  
          
              <Form.Group className="mb-3 mt-3 col-3 nopad" controlId="">
              <div class="infpop">
              <span class="arrow_box "></span>
                <h5>Service Fee</h5>
                <p>$10.00 will be charged to your members 
and $9.00 will be sent to your account.</p>
<p>10% of the amount is charged against service fee</p> 
                  </div>     
              <Form.Label>Price</Form.Label>
              <Form.Control  type="text" placeholder="Type Number" />
              </Form.Group>
        
              <Form.Group className="mb-3 mt-3 col-3 nopad" controlId=" ">
              <Form.Label>Discounted Price If Any</Form.Label>
              <Form.Control  type="text" placeholder="Type Number" />
              </Form.Group>   
              
              <Form.Group className=" col-6 nopad" controlId=" ">
              <div class="col f16"><label class="form-label" for="e1"><input name="group1" type="checkbox" id="e1" class="form-check-input"/>Allow Free Trail</label></div>
              </Form.Group>
            
              <Form.Group className="mb-3 col-3 nopad" controlId=" ">
              <Form.Label>Free Trail For</Form.Label>
              <Form.Control  type="text" placeholder="Number Of Days" />
              </Form.Group>  
        
              <Form.Group className="mb-3 mt-3 col-6 nopad" controlId="e2 ">
              <div class="col f16"><label class="form-label" for="e2">
              <input name="group1" type="checkbox" id="e2" class="form-check-input"/>I agree with terms of service</label></div>
              </Form.Group>     

             </form>   
                                    <p class="mt-4"><hr/></p>
                                   <div class="col-6 nopad mt-2"><button type="button" class="btn btn-primary button subbtn f16">Save</button> </div>
             </div> 
                                <div class="admincntnt bxshadow ">
                                <h4>Post Management</h4> 
                                   <form>
                                    <div class=" pl-4 ">
                                        <div class=" ">
                                          <input name="formHorizontalRadios" type="radio" id="formHorizontalRadios1" class="form-check-input"/><label title="" for="formHorizontalRadios1" class="form-check-label">Allow members to post</label>  
                                        </div>
        
         <div class=" ">
                                          <input name="formHorizontalRadios" type="radio" id="formHorizontalRadios2" class="form-check-input"/><label title="" for="formHorizontalRadios2" class="form-check-label">Allow all to post</label>  
                                        </div>
        
         <div class=" ">
                                          <input name="formHorizontalRadios" type="radio" id="formHorizontalRadios3" class="form-check-input"/><label title="" for="formHorizontalRadios3" class="form-check-label">Post only by admin</label>  
                                        </div>
                                    </div>
                                    <hr/>
                                    <div class="form-check  ">
                                        <input type="checkbox" id="formHorizontalCheck" class="form-check-input"/>
                                            <label title="" for="formHorizontalCheck" class="form-check-label">Publish post after approval</label>
                                            </div>
                                    </form>
                                
                                    <p class="mt-4"><hr/></p>
                                   <div class="col-6 nopad mt-2"><button type="button" class="btn btn-primary button subbtn f16">Save</button> </div>
                                </div> 
        
                    <div class="admincntnt bxshadow ">
                    <h4>Sales Report</h4>
                                <div class="salegrp">
                                <Tabs id="uncontrolled-tab-example" className="mb-3">
                                <Tab defaultActiveKey="weekly" eventKey="weekly" title="Weekly">
                                    
                                    <div class="row">
                                    <div class="col-md-4 ">
                                        <div class="leftprt">
                                            <h2 class="grntxt">3</h2>
                                            <p>sales this week</p>
                                            <p class="grntxt">$100,000 </p>
                                            <h2 class="grntxt">$80</h2>
                                            <p class="mb-2">earning this week</p>
                                            <a href="" class="btn btnbig">Download PDF Report</a>
                                        </div>
                                    </div>
                                    <div class="col-md-8 ">
                                    <div class="rghtprt">graph 1 here</div>   
                                    </div>
                                    </div>
                                    
                                </Tab>
                                <Tab defaultActiveKey="profile" eventKey="montly" title="Montly">
                                    <div class="row">
                                    <div class="col-md-4 ">
                                    <div class="leftprt">
                                            <h2 class="grntxt">15</h2>
                                            <p>sales this month</p>
                                            <p class="grntxt">$100,000 </p>
                                            <h2 class="grntxt">$80</h2>
                                            <p class="mb-2">earning this week</p>
                                            <a href="" class="btn btnbig">Download PDF Report</a>
                                        </div>
                                    </div>
                                    <div class="col-md-8 ">
                                    <div class="rghtprt">graph 2 here</div>   
                                    </div>
                                    </div>   
                                </Tab>
                                <Tab eventKey="quarterly" title="Quarterly"> <div class="row">
                                    <div class="col-md-4 ">
                                        <div class="leftprt">
                                            <h2 class="grntxt">425</h2>
                                            <p>sales this quarter</p>
                                            <p class="grntxt">$100,000 </p>
                                            <h2 class="grntxt">$80</h2>
                                            <p class="mb-2">earning this week</p>
                                            <a href="" class="btn btnbig">Download PDF Report</a>
                                        </div>
                                    </div>
                                    <div class="col-md-8 ">
                                    <div class="rghtprt">graph 3 here</div>   
                                    </div>
                                    </div>
                                    </Tab>
                                <Tab eventKey="yearly" title="Yearly"> <div class="row">
                                    <div class="col-md-4 ">
                                        <div class="leftprt">
                                            <h2 class="grntxt">4,483</h2>
                                            <p>sales this year</p>
                                            <p class="grntxt">$100,000 </p>
                                            <h2 class="grntxt">$80</h2>
                                            <p class="mb-2">earning this week</p>
                                            <a href="" class="btn btnbig">Download PDF Report</a>
                                        </div>
                                    </div>
                                    <div class="col-md-8 ">
                                    <div class="rghtprt">graph 4 here</div>   
                                    </div>
                                    </div>
                                    </Tab>
                                <Tab eventKey="alltime" title="All Time"> 
                                    <div class="row">
                                    <div class="col-md-4 ">
                                        <div class="leftprt">
                                            <h2 class="grntxt">15,753</h2>
                                            <p>total sales</p>
                                            <p class="grntxt">$100,000 </p>
                                            <h2 class="grntxt">$80</h2>
                                            <p class="mb-2">earning this week</p>
                                            <a href="" class="btn btnbig">Download PDF Report</a>
                                        </div>
                                    </div>
                                    <div class="col-md-8 ">
                                    <div class="rghtprt">graph 5 here</div>   
                                    </div>
                                    </div>
                                    </Tab>
                                </Tabs> 
                                </div>

                                <div class="mt-4">
                                    
                                    <h4>Sales Report From 20 Feb to 27 Feb 2020</h4>
                                        
                                            <form class="flrts mb-4">
                                                <div class="row">

                                                    <div class="col-3">
                                                    <select class="form-control" id=" ">
                                                    <option>By Package</option>
                                                    <option>All Packages</option>
                                                    <option>Package Name 1</option>
                                                    <option>Package Name 2</option>
                                                    <option>Package Name 3</option>
                                                    </select>
                                                    </div>
          
                                                    
                                                    <div class="col-3">
                                                    <select class="form-control" id=" ">
                                                    <option>Status</option>
                                                    <option>Approved</option>
                                                    <option>Waiting Approval</option>
                                                    </select>
                                                    </div>
        
                                                    
                                                    <div class="col-3">
                                                    <select class="form-control" id=" ">
                                                    <option>All Time</option>
                                                    <option>Yearly</option>
                                                    <option>Quarterly</option>
                                                    <option>Monthly</option>
                                                    <option>Weekly</option>    
                                                    </select>
                                                    </div> 

                                                    <div class="col-2"><a class="btn grnbtn">Apply</a></div> 
                                                    <div class="col-1 text-center"><a class="mt-2" href="#"> Clear</a></div>   
                                                </div>
                                            </form>
                                           
                                        <Table striped bordered hover size="sm">
                                          <thead>
                                            <tr>
                                              <th>Date</th>
                                              <th>Sale Order</th>
                                              <th>Product Name</th>
                                              <th>Customer Name</th>
                                               <th>Status</th>
                                               <th>Amount</th>
                                            </tr>
                                          </thead>
                                          <tbody>
                                            <tr>
                                              <td>20 Feb</td>
                                              <td>57567</td>
                                              <td>Otto</td>
                                              <td>James Perk</td>
                                              <td><span class="grntxt">Approved</span></td>
                                              <td>$15</td>  
                                            </tr>
                                            <tr>
                                              <td>21 Feb</td>
                                              <td>23424</td>
                                              <td>Thornton</td>
                                              <td>James Perkt</td>
                                              <td><span class="grntxt">Approved</span></td>
                                              <td>$15</td>  
                                            </tr>
                                           <tr>
                                              <td>22 Feb</td>
                                              <td>75464</td>
                                              <td>Thornton</td>
                                              <td>James Perk</td>
                                              <td><span class="">In Process</span></td>
                                              <td>$15</td>  
                                            </tr>
                                          </tbody>
                                        </Table>
                                </div> 
         
                    </div>
                
                        <div class="admincntnt bxshadow">
                            
                             <h4>Posts By Admin</h4>

                             <form class="flrts mb-4">
                                                <div class="row">

                                                    <div class="col-md-3">
                                                    <select class="form-control" id=" ">
                                                    <option>All Posts</option>
                                                    <option>Members Posts Only</option>
                                                    <option>Public Posts</option> 
                                                    </select>
                                                    </div> 
        
                                                    <div class="col-md-3">
                                                    <select class="form-control" id=" ">
                                                    <option>All Time</option>
                                                    <option>Last Week</option>
                                                    <option>Last Month</option> 
                                                    </select>
                                                    </div>
        
                                                    <div class="col-2"><a class="btn grnbtn">Apply</a></div> 
                                                    <div class="col-1 text-center"><a class="mt-2" href="#"> Clear</a></div>
 
                                                </div>
                                            </form>
                                        
                                            <hr/>
                                            <form>
                                            <div class="row flrts ">
                                                <div class="col-md-3">
                                                    <select class="form-control" id=" ">
                                                        <option>Actions</option>
                                                        <option>Suspend Post</option>
                                                        <option>Delete Post</option> 
                                                    </select> 
                                                </div> 
                                                <div class="col-md-2"> <a class="btn grnbtn">Apply</a></div>
                                                <div class="col-md-5">
                                                    <div class="form-group searchinpt"><input placeholder="Search" type="text" class="form-control"/><button><img src="/uploads/images/search.png"/></button></div>
                                                </div>
                                                <div class="col-md-2"><a class="mt-2" href="#">Clear Search</a></div> 
                                            </div>
                                            </form>
                                            <hr/>
                                                    
                                              
                                        <Table striped bordered hover size="sm">
                                        <thead>
                                        <tr>
                                        <th class="text-center"><input type="checkbox" /></th>
                                        <th>Posts</th>
                                        <th class="text-center">Posted On</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                              <td class="text-center"><input type="checkbox" /></td>
                                              <td>
                                                    <span><img class="mr-2" width='50' src="/uploads/images/img1.jpg"/></span>
                                                    <a href="#">Gym is now open in Sydney</a>
                                                </td>
                                               <td class="text-center">12 Jun 2021</td>
                                            </tr>
                                            <tr>
                                              <td class="text-center"><input type="checkbox" /></td>
                                              <td><span><img class="mr-2" width='50' src="/uploads/images/img1.jpg"/></span>
                                              <a href="#">Training technique safety measures and benefits. Inbox For Personal...</a>
                                              </td>
                                              <td class="text-center">12 Jun 2021</td> 
                                            </tr>
                                           <tr>
                                              <td class="text-center"><input type="checkbox" /></td>
                                              <td><span><img class="mr-2" width='50' src="/uploads/images/img1.jpg"/></span>
                                            <a href="#">How to take advantage of Keto</a>
                                                </td>
                                              <td class="text-center">12 Jun 2021</td> 
                                            </tr>
                                          </tbody>
                                        </Table>         
                                                            

                                         </div> 
        
        
                                            <div class="admincntnt bxshadow">
                                            <h4>Discussion Boards <a class="smplbtn floatright crtbtn" href="#">Create Board</a></h4>
                                            <div class="text-right"></div>
                                            <form class="mb-4">
                                            <div class="row flrts ">
                                                <div class="col-md-3">
                                                    <select class="form-control" id=" ">
                                                        <option>Actions</option>
                                                        <option>Suspend Post</option>
                                                        <option>Delete Post</option> 
                                                    </select> 
                                                </div> 
                                                <div class="col-md-2"> <a class="btn grnbtn">Apply</a>  </div>
                                                <div class="col-md-5">
                                                    <div class="form-group searchinpt"><input placeholder="Search" type="text" class="form-control"/><button><img src="/uploads/images/search.png"/></button></div>
                                                </div>
                                                <div class="col-md-2"><a class="mt-2" href="#">Clear Search</a></div>
                                            </div>
                                            </form> 
                                              
                                        <Table striped bordered hover size="sm">
                                        <thead>
                                        <tr>
                                        <th class="text-center"><input type="checkbox" /></th>
                                        <th>Board Name</th>
                                        <th class="text-center">Members</th>
                                        <th class="text-center">Created On</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr>
                                        <td class="text-center"><input type="checkbox" /></td>
                                        <td><span><img class="mr-2" width='50' src="/uploads/images/img1.jpg"/></span>
                                        <a href="#">Gym is now open in Sydney</a>
                                        </td>
                                        <td class="text-center"><a class="smplbtn" href="#"> 12 View </a> <a class="smplbtn"  href="#">Add</a></td>
                                        <td class="text-center">12 Jun 2021</td>
                                        </tr>
                                        <tr>
                                        <td class="text-center"><input type="checkbox" /></td>
                                        <td><span><img class="mr-2" width='50' src="/uploads/images/img1.jpg"/></span>
                                        <a href="#">Training technique safety measures and benefits.</a>
                                        </td>
                                        <td class="text-center"><a class="smplbtn" href="#"> 12 View </a> <a class="smplbtn"  href="#">Add</a></td> 
                                        <td class="text-center">12 Jun 2021</td>
                                        </tr>
                                        <tr>
                                        <td class="text-center"><input type="checkbox" /></td>
                                        <td><span><img class="mr-2" width='50' src="/uploads/images/img1.jpg"/></span>
                                        <a href="#">How to take advantage of Keto</a>
                                        </td>
                                        <td class="text-center"><a class="smplbtn" href="#"> 12 View </a> <a class="smplbtn"  href="#">Add</a></td>
                                        <td class="text-center">12 Jun 2021</td>
                                        </tr>
                                        </tbody>
                                        </Table>    
                                </div>
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        
                    <div class="admincntnt bxshadow">
                        <h4>Posts For Approval</h4>
                    <div class="row">
                        <div class="col-5"> 
                            <div class="form-group searchinpt"><input placeholder="Search" type="text" class="form-control "/><button><img src="/uploads/images/search.png"/></button>
                            </div> 
                        </div>
                            <div class="col-4"></div>
                            <div class="col-3">
                            <select class="form-control form-control-lg"><option>Weekly</option><option>Monthly</option><option>Quarterly</option><option>Yearly</option></select>
                            </div>
      
                    </div>
                
                      <div class="allpstadmn">
                                
                                    <div class="postbx psttxt  bxshadow ">
                                    <div class="usrtop">
                                    <div class="row"><div class="col-10">
                                    <div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                    <div><a>Teena Bill Grason</a><span class="grytxt"> in group <a>George Washington</a></span><span class="small pstim">12 min ago</span>
                                    </div>
                                    </div>
                                    </div>
                                    <div class="col-2 "><span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span></div></div></div><p class="f14">Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home, or simply in one part of the world, for long periods of time doesn’t mean you need to miss out on all the incredible sights this world has to offer!</p>
                                    <div class="row">
                                    <div class="col text-left"><a class="smplbtn  btn" href="#">Approve</a>
                                    <a class=" f14 grytxt" href="#">Decline</a> </div>
                                    <div class="col text-center"> </div>
                                    </div>
                                    </div>
        
                                    <div class="postbx psttxt  bxshadow ">
                                    <div class="usrtop">
                                    <div class="row"><div class="col-10">
                                    <div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                    <div><a>Teena Bill Grason</a><span class="grytxt"> in group <a>George Washington</a></span><span class="small pstim">12 min ago</span>
                                    </div>
                                    </div>
                                    </div>

                                    <div class="col-2 "><span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span></div></div></div><div class="pstmd"><img src="/uploads/images/img2.jpg"/></div>
                                    <div class="row">
                                    <div class="col text-left"><a class="smplbtn  btn" href="#">Approve</a>
                                    <a class=" f14 grytxt" href="#">Decline</a> </div>
                                    <div class="col text-center"> </div>
                                    </div>
                                    </div>
        
        
                                    <div class="postbx bxshadow ">
                                    <div class="usrtop">
                                    <div class="row"><div class="col-10">
                                    <div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                    <div><a>Teena Bill Grason</a><span class="grytxt"> in group <a>George Washington</a></span><span class="small pstim">12 min ago</span>
                                    </div>
                                    </div>
                                    </div>
                                    <div class="col-2 "><span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span></div></div></div><div class="pstmd"><img src="/uploads/images/img2.jpg"/></div>
                                    <div class="row">
                                    <div class="col text-left"><a class="smplbtn  btn" href="#">Approve</a>
                                    <a class=" f14 grytxt" href="#">Decline</a> </div>
                                    <div class="col text-center"> </div>
                                    </div>
                                    </div>
                                
                      </div>
                    
        
                    </div>
                     
        
                    
            </div> 
            
                                    <div class="col-md-4 col-lg-3"> 
                                        <div className='mnuen'>
                                        <div class="userthumb">
                                        <div class="userbx "><img src="/uploads/images/user1.jpg"/></div>
                                        <div>David Makron</div>
                                        </div>
                                        <ul>
                                            <li><a href='#'><span><img src="/uploads/images/recent.svg"/></span> Most Recent</a> <span class="f12 grytxt">4</span></li>
                                            <li><a href='#'><span><img src="/uploads/images/group.svg"/></span> Group</a> <span class="f12 grytxt">1</span></li>
                                            <li><a href='#'><span><img src="/uploads/images/team.svg"/></span> Teams</a> <span class="f12 grytxt">3</span></li>
                                            <li><a href='#'><span><img src="/uploads/images/follow.svg"/></span> Your Followers </a> <span class="f12 grytxt">8</span></li>
                                            <li><a href='#'><span><img src="/uploads/images/flag.svg"/></span> Events</a> <span class="f12 grytxt">6</span></li>
                                            <li><a href='#'><span><img src="/uploads/images/bookmark.svg"/></span> Saved</a> <span class="f12 grytxt">12</span></li>
                                            <li><a href='#'><span><img src="/uploads/images/setting.svg"/></span> Settings</a></li>
                                            <li><a href='#'><span><img src="/uploads/images/logout.svg"/></span> Logout</a></li>
                                        </ul> 
                                    </div>
                                    </div>
            
            
                                
                                    <div class="col-md-8 col-lg-6 "> 

                                    <div class="pstbxdsk bxshadow">
                                    <h3>Create Post</h3>
                                    <div class="wrtpstbx">
                                    Share Something
                                    </div>
                                    </div> 
                                    
            
                                    <div class="postbx qsnsldbxout  bxshadow ">
                                    <h6>Questions <span><a class="pushright addbtn" href="#">+</a></span></h6>
                                    
                                    <div class="row">

                                        <div class="col-4 ">
                                        <div class="qsnsldbx clr1">
                                           <div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a><div><a class="f12">Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div></div>
                                        <p class="f14"> 
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor?
                                        </p>
                                        </div>
                                        </div>

                                        <div class="col-4 ">
                                        <div class="qsnsldbx clr2">
                                            <div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a><div><a class="f12">Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div></div>
                                        <p class="f14"> 
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor?
                                        </p>
                                        </div>
                                        </div>
            
                                        <div class="col-4 ">
                                        <div class="qsnsldbx clr3">
                                            <div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a><div><a class="f12">Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div></div>
                                        <p class="f14"> 
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor?
                                        </p>
                                        </div>
                                        </div>
            
                                    </div>
                                    </div>


                                    <div className='postbx bxshadow '>  

                                        <div className='usrtop'>
                                        <div className='row'>
            
                                        <div className='col-10'>
                                            
                                            <div class="userthumb"> 
                                            <a class="userbx">
                                            <img src="/uploads/images/user2.jpg"/></a> 
                                            <div><a>Teena Bill Grason</a>  
                                            <span class="grytxt"> in group <a>George Washington</a></span>
                                            <span class="small pstim">12 min ago</span>
                                            </div> 
                                            </div>
            
                                        </div>
                                        
                                        <div className='col-2 '> 
                                        <span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span>
                                        </div>
                                        </div>  
                                        </div>

                                        
                                        <div className='pstmd'>
                                            <img src="/uploads/images/img2.jpg"/>
                                        </div>

                                        <div className='row'> 
                                            <div className='rctbx col-9'>
                                            <span><img src="/uploads/images/symbol1.png"/>23</span>
                                            <span><img src="/uploads/images/symbol2.png"/>23</span>
                                            <span><img src="/uploads/images/symbol3.png"/>23</span>
                                            <span><img src="/uploads/images/symbol4.png"/>23</span>
                                            <span><img src="/uploads/images/symbol5.png"/>23</span>
                                            </div> 
                                            <div className='optbx col-3 text-right'><a href="#"><img src="/uploads/images/ver-opt.png"/></a>
                                            </div> 
                                        </div>

                                        <div className='lkbxbtm f12'>
                                            <div className='row'>
                                            <div className='col'><a href="#"><img src="/uploads/images/hand.png"/>Back Slap</a></div>
                                            <div className='col'><a href="#"><img src="/uploads/images/comment.png"/>Comment</a></div>
                                            <div className='col'><a href="#"><img src="/uploads/images/share.png"/>Share</a></div>
                                            </div>
                                        </div> 

                                    </div> 
            
            
            
                                    <div className='postbx bxshadow '> 
                
                                        <div className='usrtop'>
                                        <div className='row'>
                                        <div className='col-6'>    
                                            
                                            <div class="userthumb"> 
                                            <a class="userbx">
                                            <img src="/uploads/images/user2.jpg"/></a> 
                                            <div><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span>
                                            </div> 
                                            </div>
            
                                        </div>
                                        
                                        <div className='col-6 '> 
                                        <span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span>
                                        </div>
                                        </div>  
                                        </div>

                                        <p className='f14'>
                                        Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home, or simply in one part of the world, for long periods of time doesn’t mean you need to miss out on all the incredible sights this world has to offer!
                                        </p> 
                                        <div className='pstmd'>
                                            <img src="/uploads/images/img2.jpg"/>
                                        </div>

                                        <div className='row'> 
                                            <div className='rctbx col-9'>
                                            <span><img src="/uploads/images/symbol1.png"/>23</span>
                                            <span><img src="/uploads/images/symbol2.png"/>23</span>
                                            <span><img src="/uploads/images/symbol3.png"/>23</span>
                                            <span><img src="/uploads/images/symbol4.png"/>23</span>
                                            <span><img src="/uploads/images/symbol5.png"/>23</span>
                                            </div> 
                                            <div className='optbx col-3 text-right'><a href="#"><img src="/uploads/images/ver-opt.png"/></a>
                                            </div> 
                                        </div>

                                        <div className='lkbxbtm f12'>
                                            <div className='row'>
                                            <div className='col'><a href="#"><img src="/uploads/images/hand.png"/>Back Slap</a></div>
                                            <div className='col'><a href="#"><img src="/uploads/images/comment.png"/>Comment</a></div>
                                            <div className='col'><a href="#"><img src="/uploads/images/share.png"/>Share</a></div>
                                            </div>
                                        </div> 
            
                                        

                                    </div>  
            
            
            
                                     <div className='postbx psttxt bxshadow '> 
                
                                        <div className='usrtop'>
                                        <div className='row'>
                                        <div className='col-6'>
                                            
                                            <div class="userthumb"> 
                                            <a class="userbx">
                                            <img src="/uploads/images/user2.jpg"/></a> 
                                            <div><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span>
                                            </div> 
                                            </div>
            
                                        </div>
                                        
                                        <div className='col-6 '> 
                                        <span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span>
                                        </div>
                                        </div>  
                                        </div>

                                        <p className='f14'>
                                        Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home, or simply in one part of the world, for long periods of time doesn’t mean you need to miss out on all the incredible sights this world has to offer!
                                        </p> 
                                        

                                        <div className='row'> 
                                            <div className='rctbx col-9'>
                                            <span><img src="/uploads/images/symbol1.png"/>23</span>
                                            <span><img src="/uploads/images/symbol2.png"/>23</span>
                                            <span><img src="/uploads/images/symbol3.png"/>23</span>
                                            <span><img src="/uploads/images/symbol4.png"/>23</span>
                                            <span><img src="/uploads/images/symbol5.png"/>23</span>
                                            </div> 
                                            <div className='optbx col-3 text-right'><a href="#"><img src="/uploads/images/ver-opt.png"/></a>
                                            </div> 
                                        </div>

                                        <div className='lkbxbtm f12'>
                                            <div className='row'>
                                            <div className='col'><a href="#"><img src="/uploads/images/hand.png"/>Back Slap</a></div>
                                            <div className='col'><a href="#"><img src="/uploads/images/comment.png"/>Comment</a></div>
                                            <div className='col'><a href="#"><img src="/uploads/images/share.png"/>Share</a></div>
                                            </div>
                                        </div> 
                                    </div> 
            
            
            
            
            
                                 <div className='postbx psttxt bxshadow '> 
                
                                        <div className='usrtop'>
                                        <div className='row'>
                                        <div className='col-6'>
                                            
                                            <div class="userthumb"> 
                                            <a class="userbx">
                                            <img src="/uploads/images/user2.jpg"/></a> 
                                            <div><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span>
                                            </div> 
                                            </div>
            
                                        </div>
                                        
                                        <div className='col-6 '> 
                                        <span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span>
                                        </div>
                                        </div>  
                                        </div>

                                        <p className='f14'>
                                        I want to learn how to make keto diet effective with excersising and swimming?
                                        </p> 
                                        <p class="col-md-12 nopad pt-0"><a href="#" class="btn btngrn col-md-6 ">Answer This Question</a></p>
                                        <div className='row answershare'> 
                                            <div className='rctbx  f12 col-9'>
                                            <a href="#"><img src="/uploads/images/share.png"/>Share</a>
                                            </div> 
                                            <div className='optbx col-3 text-right'><a href="#"><img src="/uploads/images/ver-opt.png"/></a>
                                            </div> 
                                        </div>
 
            
                                        <div class="pt-4">
                                        <h6>Top Answer</h6>
                                        <p class="f14">Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home, or simply in one part of the world, for long periods</p>
                                        <div class="row mb-3"><div class="col-6 pr-1 text-center"><p class="grntxt"> 24 found helpful </p><a href="" class="btn grnbtn">I am Agree</a></div><div class="col-6 pl-1 text-center"><p>12 not convinced</p><a href="" class="btn grybtn">Not Agree</a></div></div>
                                        </div>
                                        
                                    </div> 
            
            
            
            
            
                                  
            
            
            
                                    </div> 
            
            
            
            
                                    <div class="col-3 rightbxout ">
                                    <div class="lgnrgstr bxshadow">
                                    <h6 class="f12">Your followers</h6>
                                             <div class="usrtop">
                                                 <div class="row">
                                                 <div class="col-3">
                                                 <div class="userthumb">
                                                 <a class="userbx"><span class="onsmbl"></span><img src="/uploads/images/user2.jpg"/></a>
                                                 </div>
                                                 </div>
                                                 <div class="col-9 nopad pt-2">
                                                 <a>Teena Bill Grason</a><span class="small pstim grntxt f12">coach</span>
                                                 </div>
                                                </div> 
                                            </div>
                                             <div class="usrtop">
                                                 <div class="row">
                                                 <div class="col-3">
                                                 <div class="userthumb">
                                                 <a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                                 </div>
                                                 </div>
                                                 <div class="col-9 nopad pt-2">
                                                 <a>Teena Bill Grason</a>
                                                 </div>
                                                </div> 
                                            </div>
                                         </div> 
                                        <div class="lgnrgstr bxshadow">
                                            <h6 class="f12">Suggested Groups</h6>
                                            <div class="pstmd">
                                            <img src="/uploads/images/img2.jpg"/> 
                                            <h5><a href="">Swiming Sydney</a></h5>
                                            <small>22 members</small>
                                            <a class="smplbtn m-0 pushright" href="#">Join Team</a>
                                            </div> 
                                            <hr/>               
                                            <div class="pstmd">
                                            <img src="/uploads/images/img2.jpg"/> 
                                            <h5><a href="">Swiming Sydney</a></h5>
                                            <small>22 members</small>
                                            <a class="smplbtn m-0 pushright col-md-6" href="#">Join Team</a>
                                            </div> 
                                        </div> 
                                        <div class="lgnrgstr bxshadow">
                                            <h6 class="f12">Suggested Events</h6>
                                            <div class="pstmd">
                                            <img src="/uploads/images/img2.jpg"/> 
                                            <h5><a href="">Summer 2021 Mega Marathon In Sydney</a></h5>
                                            <p><img src="/uploads/images/pin.png"/><small>Barklay Street, Sydney</small></p>
                                            <p><img src="/uploads/images/calendar.png"/><small class="grntxt">8am to 12pm, Sun 11 Jan</small></p>
                                            <p><a class="smplbtn m-0 " href="#">Request To Join</a></p>
                                            </div> 
                                            <hr/>               
                                            <div class="pstmd">
                                            <img src="/uploads/images/img2.jpg"/> 
                                            <h5><a href="">Swiming Sydney</a></h5> 
                                            <p><img src="/uploads/images/pin.png"/><small>Barklay Street, Sydney</small></p>
                                            <p><img src="/uploads/images/calendar.png"/><small class="grntxt">8am to 12pm, Sun 11 Jan</small></p>
                                            <p><a class="smplbtn m-0 " href="#">Request To Join</a></p>
                                            </div> 
                                        </div> 

                                        <div class="lgnrgstr accouncement bxshadow">
                                              <h6 class="f12">Announcement</h6>
                                              <p class="mb-0">Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home, or simply in one part of the world</p> 
                                              <small>12 mina ago</small>
                                        </div> 
            
                                         <div class="lgnrgstr bxshadow">
                                         <h6 class="f12">sponsred ad</h6>   
                                              <a href=""><img src="/uploads/images/img2.jpg"/></a>
                                         </div> 
            
                                         
            
                                        
             
                                        

            
                                    </div>
                                </div>
                            </div>
            </div> 
            
            
            
        )
    }
}

export default DesktopDesign
