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
import {Tabs, Tab, Modal, Row, Button, Col, Form, Card, Container, Collapse} from "react-bootstrap";
                          

    
class DesktopTrending extends Component {
    
    
    constructor(props) {
        super(props);
        this.state = {
            modalShow: false
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
        <div class="row pstdtlout">
        <div class="col-8">
            <span class="pstdtl"><img src="/uploads/images/ex-img3.jpg"/></span>
            <div class="lkbxbtm f12">
            <div class="row">
            <div class="col">
            <a href="#"><img src="/uploads/images/hand.png"/>Back Slap</a></div>
            <div class="col"><a href="#"><img src="/uploads/images/comment.png"/>Comment</a></div>
            <div class="col"><a href="#"><img src="/uploads/images/share.png"/>Share</a></div></div>
            </div>
            <div class="pstcomnt">
            <h4>Post Comment</h4>
                <Form> 
                  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                    <Form.Control as="textarea" rows={3} />
                  </Form.Group>
                  <a href="#" class="imgatch"></a>  
                  <p><button type="submit " class="btn btn-primary button subbtn">Post Your Comment</button>  </p>
                  </Form>
            </div>
        </div>
        <div class="col-4 mt-4 rghtbxdtl">
                <div class="usrtop"><div class="row"><div class="col-9"><div class="userthumb"><a class="userbx">
                <img src="/uploads/images/user2.jpg"/></a><div><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div></div></div><div class="col-3 "><span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span></div></div>
                </div>
                <p class="f14">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <div class="row"><div class="rctbx col-9"><span><img src="/uploads/images/symbol1.png"/>23</span><span>
                <img src="/uploads/images/symbol2.png"/>23</span><span><img src="/uploads/images/symbol3.png"/>23</span><span>
                <img src="/uploads/images/symbol4.png"/>23</span><span><img src="/uploads/images/symbol5.png"/>23</span></div>
                <div class="optbx col-3 text-right"><a href="#"><img src="/uploads/images/ver-opt.png"/></a></div></div>
                <hr/>
                <h6>Comments</h6>
                <div class="cmntare">
                <div class="cmntbx">
                <div class="usrtop"><div class="row"><div class="col-9"><div class="userthumb"><a class="userbx">
                <img src="/uploads/images/user2.jpg"/></a><div><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div></div></div></div>
                </div>
                <p class="f12">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                
                <div class="row">
                <div class="col-6">
                
                <a class="f12"
                onClick={() => this.setOpen(!this.state.open)}
                aria-controls="example-collapse-text"
                aria-expanded={this.state.open}
                >
                Reply
                </a> 

                </div>
                <div class="col-6 text-right">
                <a class="f12"
                onClick={() => this.setOpen(!this.state.open)}
                aria-controls="example-collapse-text"
                aria-expanded={this.state.open}
                >
                View Replies (2)
                </a></div>  
                </div>
                <Collapse in={this.state.open}>
                <div id="example-collapse-text">
                 <div class="rplyinbx">
                    <div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a><div><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div></div>
                    <p class="f12"> 0308 9214408 Lorem ipsum dolor sit amet..</p>
                </div>
                 <div class="rplyinbx">
                    <div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a><div><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div></div>
                    <p class="f12">Lorem ipsum dolor sit amet consectetur.</p> 
                 </div>    
                <div class="rplyinbx pt-0">
                  <input placeholder="Reply To Teena Bill Grason" type="text" id="formGroupEmail" class="form-control"/>
                  <a href="#" class="imgatch"></a> 
                </div>
                </div>
              </Collapse>
                
                </div>
               
                <div class="cmntbx">
                <div class="usrtop"><div class="row"><div class="col-9"><div class="userthumb"><a class="userbx">
                <img src="/uploads/images/user2.jpg"/></a><div><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div></div></div></div>
                </div>
                <p class="f12">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo.</p>
                <div class="row">
                <div class="col-6"><a class="f12" href="#">Reply</a></div>
                <div class="col-6 text-right"><a class="f12" href="#">View Replies (2)</a></div>  
                </div>
                </div>
                <div class="cmntbx">
                <div class="usrtop"><div class="row"><div class="col-9"><div class="userthumb"><a class="userbx">
                <img src="/uploads/images/user2.jpg"/></a><div><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div></div></div></div>
                </div>
                <p class="f12">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempo. Lorem ipsum dolor sit amet.</p>
                <div class="row">
                <div class="col-6"><a class="f12" href="#">Reply</a></div>
                <div class="col-6 text-right"><a class="f12" href="#">View Replies (2)</a></div>  
                </div>
                </div>
                </div>    
                
        </div>     
        </div>
      </Modal.Body>
      
    </Modal>  
    
                        <div role="region" aria-label="Code Example" class="ReactPlayground-StyledExample-module--cls2--Z1-mo ReactPlayground-StyledExample-module--cls1--2oYwU bs-example ReactPlayground-StyledExample-module--show-code--rW9o2"><div><button type="button" class="btn btn-primary" onClick={this.openModal}>Post Details Popup</button></div></div>
        
                        
            
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
                            
            
        
            
                            <div class="subhdr">
                            <div class="container">
                            <div class="row">
                                <div class="col">
                                <div class="typsldr"><a class="sel" href="">Posts</a><a href="">Team</a><a href="">People</a><a href="">Questions</a><a href="">Events</a></div>
                                </div>
                            </div>                
                            </div>
                            </div>
                            
                            <div class="tagline">
                                <div class="container">
                                <div class="row">
                                <div class="col">
                                    <a class="tag" href="">#Trialliance</a>
                                    <a class="tag" href="">#Eliza</a>
                                    <a class="tag" href="">#Dehli</a>
                                    <a class="tag" href="">#Keto Food</a>
                                    <a class="tag" href="">#Stress</a>
                                    <a class="tag" href="">#Marathon</a>
                                    <a class="tag" href="">#Diet</a>
                                </div>
                                </div>
                                </div>
                                
                            </div>
            
            
                                                      
            
                            <div class="container cntntbx ">
                                <div class="row"> 
                                                
                                    <div class=" col-md-4 col-lg-3">
                                    <div class=" bxshadow menuinr">
                                       <div class="userthumb"><div class="userbx "><img src="/uploads/images/user1.jpg"/></div><div>David Makron</div> 
                                        </div>
           
                                    </div>
                                    
            
                                     <div className='mnuen'>
                                        <p><b>Group: Ketogenic Diet</b></p>
                                        <ul>
                                            <li><a href='#'><span><img src="/uploads/images/recent.svg"/></span> Most Recent</a></li>
                                            <li><a href='#'><span><img src="/uploads/images/group.svg"/></span> Group</a></li>
                                            <li><a href='#'><span><img src="/uploads/images/team.svg"/></span> Teams</a></li>
                                            <li><a href='#'><span><img src="/uploads/images/follow.svg"/></span> Your Followers </a></li>
                                            <li><a href='#'><span><img src="/uploads/images/flag.svg"/></span> Events</a></li>
                                            <li><a href='#'><span><img src="/uploads/images/bookmark.svg"/></span> Saved</a></li>
                                            <li><a href='#'><span><img src="/uploads/images/setting.svg"/></span> Settings</a></li>
                                            <li><a href='#'><span><img src="/uploads/images/logout.svg"/></span> Logout</a></li>
                                        </ul>
                                        <p class="mt-4 mb-0"><a class="btnspl" href="#">Join The Group</a></p>       
                                    </div>
            
            
            
                                    </div>
                                     <div class=" col-md-8 col-lg-9">
                                      
            
                                     <div class="trending">
                                    
                                      <div class="container">
                                      <div class="row"><div id="list" class="section">
                                            <div class="item">
                                            <span class="trntop"><img src="/uploads/images/user1.jpg"/></span>
                                            <div class="authname"><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div>
                                            <span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span>
                                            <span class="pstover f14">Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home, or simply in one part of the world,</span>
                                            <img src="/uploads/images/ex-img1.jpg"/>
                                                
                                            </div>
                                            <div class="item">
                                            <span class="trntop"><img src="/uploads/images/user1.jpg"/></span>
                                            <div class="authname"><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div>
                                            <span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span>        
                                            <img src="/uploads/images/ex-img4.jpg"/>
                                            </div>
                                            <div class="item"><span class="trntop"><img src="/uploads/images/user1.jpg"/></span>
                                            <div class="authname"><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div>
                                            <span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span>
                                            <img src="/uploads/images/ex-img3.jpg"/></div>
                                            <div class="item"><span class="trntop"><img src="/uploads/images/user1.jpg"/></span>
                                            <div class="authname"><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div>
                                            <span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span>
                                            <img src="/uploads/images/ex-img2.jpg"/></div>
                                            <div class="item"><span class="trntop"><img src="/uploads/images/user1.jpg"/></span>
                                            <div class="authname"><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div>
                                            <span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span>
                                            <p class="pstxt f14"><a href="#">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</a></p>
                                            </div>
                                            <div class="item"><span class="trntop"><img src="/uploads/images/user1.jpg"/></span>
                                            <div class="authname"><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div>
                                            <span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span>
                                            <img src="/uploads/images/ex-img3.jpg"/></div>
                                            <div class="item"><span class="trntop"><img src="/uploads/images/user1.jpg"/></span>
                                            <div class="authname"><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div>
                                            <span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span>
                                            <img src="/uploads/images/ex-img1.jpg"/></div>
                                            <div class="item"><span class="trntop"><img src="/uploads/images/user1.jpg"/></span>
                                            <div class="authname"><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div>
                                            <span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span>
                                            <img src="/uploads/images/ex-img2.jpg"/></div>
                                      </div>		
                                      </div>
                                         
                                    </div>
                                             
                                
                                    </div>
                                 
            
                                    <div class="secteams"> 

                                            <div class="row">
                                                <div class="col-lg-6 col-md-12 clubbxsrch">
                                                <div class="bxshadow teambxim">
                                                <div class="row ">  
                                                <div class="col-4"><a href=""><img src="/uploads/images/dummy-logo.png"/></a></div>
                                                <div class="col-8 pl-0">
                                                <a href="#">Fitness Club Name</a><span class="small pstim">13 followers</span>
                                                <p><span>Offers: Gym, Swimming, Running</span></p>
                                                <p><span><a class="f14 btn" href="#">Follow Us</a><a class="f14 btn" href="#">Get Membership</a></span></p>
                                                <p><span class="small"><img src="/uploads/images/pin.png"/>145, P block, Park View, Australia</span></p>
                                                </div>    
                                                </div>
                                                </div>
                                                </div>
                                                <div class="col-lg-6 col-md-12 clubbxsrch">
                                                <div class="bxshadow teambxim">    
                                                <div class="row ">  
                                                <div class="col-4"><a href=""><img src="/uploads/images/dummy-logo.png"/></a></div>
                                                <div class="col-8 pl-0">
                                                <a href="#">Fitness Club Name</a><span class="small pstim">13 followers</span>
                                                <p><span>Offers: Gym, Swimming, Running</span></p>
                                                <p><span><a class="f14 btn" href="#">Follow Us</a><a class="f14 btn" href="#">Get Membership</a></span></p>
                                                <p><span class="small"><img src="/uploads/images/pin.png"/>145, P block, Park View, Australia</span></p>
                                                </div>    
                                                </div>
                                                </div>    
                                                </div> 
                                                <div class="col-lg-6 col-md-12 clubbxsrch">
                                                <div class="bxshadow teambxim">    
                                                <div class="row ">  
                                                <div class="col-4"><a href=""><img src="/uploads/images/dummy-logo.png"/></a></div>
                                                <div class="col-8 pl-0">
                                                <a href="#">Fitness Club Name</a><span class="small pstim">13 followers</span>
                                                <p><span>Offers: Gym, Swimming, Running</span></p>
                                                <p><span><a class="f14 btn" href="#">Follow Us</a><a class="f14 btn" href="#">Get Membership</a></span></p>
                                                <p><span class="small"><img src="/uploads/images/pin.png"/>145, P block, Park View </span></p>
                                                </div>    
                                                </div>
                                                </div>    
                                                </div> 
                                                <div class="col-lg-6 col-md-12 clubbxsrch">
                                                <div class="bxshadow teambxim">    
                                                <div class="row ">  
                                                <div class="col-4"><a href=""><img src="/uploads/images/dummy-logo.png"/></a></div>
                                                <div class="col-8 pl-0">
                                                <a href="#">Fitness Club Name</a><span class="small pstim">13 followers</span>
                                                <p><span>Offers: Gym, Swimming, Running</span></p>
                                                <p><span><a class="f14 btn" href="#">Follow Us</a><a class="f14 btn" href="#">Get Membership</a></span></p>
                                                <p><span class="small"><img src="/uploads/images/pin.png"/>145, P block, Park View, Eithense </span></p>
                                                </div>    
                                                </div>
                                                </div>    
                                                </div>    
                                            </div> 
                                            
                                        </div>
                                        
            
                                        <div class="row">
                                        <div class="col-lg-6 col-md-12">
                                        <div class="pplsrch bxshadow "><div class="usrtop"><div class="row"><div class="col-3"><div class="userthumb"><a class="userbx">
                                        <img src="/uploads/images/user2.jpg"/></a></div></div><div class="col-5 nopad"><a>Teena Bill Grason</a><span class="small pstim">New Jerrssey, USA</span></div><div class="col-4 text-right"><a class="smplbtn m-0 unflw" href="#">Un Follow</a></div></div></div></div>
                                        </div>    
                                        <div class="col-lg-6 col-md-12">
                                        <div class="pplsrch bxshadow "><div class="usrtop"><div class="row"><div class="col-3"><div class="userthumb"><a class="userbx">
                                        <img src="/uploads/images/user2.jpg"/></a></div></div><div class="col-5 nopad"><a>Teena Bill Grason</a><span class="small pstim">New Jerrssey, USA</span></div><div class="col-4 text-right"><a class="smplbtn m-0 unflw" href="#">Un Follow</a></div></div></div></div>
                                        </div>
                                        <div class="col-lg-6 col-md-12">
                                        <div class="pplsrch bxshadow "><div class="usrtop"><div class="row"><div class="col-3"><div class="userthumb"><a class="userbx">
                                        <img src="/uploads/images/user2.jpg"/></a></div></div><div class="col-5 nopad"><a>Teena Bill Grason</a><span class="small pstim">New Jerrssey, USA</span></div><div class="col-4 text-right"><a class="smplbtn m-0 unflw" href="#">Un Follow</a></div></div></div></div>
                                        </div>
                                        <div class="col-lg-6 col-md-12">
                                        <div class="pplsrch bxshadow "><div class="usrtop"><div class="row"><div class="col-3"><div class="userthumb"><a class="userbx">
                                        <img src="/uploads/images/user2.jpg"/></a></div></div><div class="col-5 nopad"><a>Teena Bill Grason</a><span class="small pstim">New Jerrssey, USA</span></div><div class="col-4 text-right"><a class="smplbtn m-0" href="#">Follow Me</a></div></div></div></div>
                                        </div>
                                        </div>
                                        
                                        <div class=" ">
                                            
                                             
                                            <div class="postbx psttxt bxshadow "><div class="usrtop"><div class="row"><div class="col-6"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a><div><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div></div></div><div class="col-6 "><span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span></div></div></div><p class="f14">I want to learn how to make keto diet effective with excersising and swimming?</p><p class="col-md-12 nopad pt-0"><a href="#" class="btn btngrn   ">Answer This Question</a></p> <div class="row"><div class="rctbx col-9"><span><img src="/uploads/images/symbol1.png"/>23</span><span><img src="/uploads/images/symbol2.png"/>23</span><span><img src="/uploads/images/symbol3.png"/>23</span><span><img src="/uploads/images/symbol4.png"/>23</span><span><img src="/uploads/images/symbol5.png"/>23</span></div><div class="optbx col-3 text-right"><a href="#"><img src="/uploads/images/ver-opt.png"/></a></div></div><div class="lkbxbtm "><div class="row"><div class="col"><a href="#"><img src="/uploads/images/hand.png"/>Back Slap</a></div><div class="col"> </div><div class="col"><a href="#"><img src="/uploads/images/share.png"/>Share</a></div></div></div></div>
            
                                            <div class="postbx psttxt bxshadow "><div class="usrtop"><div class="row"><div class="col-6"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a><div><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div></div></div><div class="col-6 "><span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span></div></div></div><p class="f14">I want to learn how to make keto diet effective with excersising and swimming?</p><p class="col-md-12 nopad pt-0"><a href="#" class="btn btngrn  ">Answer This Question</a></p> <div class="row"><div class="rctbx col-9"><span><img src="/uploads/images/symbol1.png"/>23</span><span><img src="/uploads/images/symbol2.png"/>23</span><span><img src="/uploads/images/symbol3.png"/>23</span><span><img src="/uploads/images/symbol4.png"/>23</span><span><img src="/uploads/images/symbol5.png"/>23</span></div><div class="optbx col-3 text-right"><a href="#"><img src="/uploads/images/ver-opt.png"/></a></div></div><div class="lkbxbtm "><div class="row"><div class="col"><a href="#"><img src="/uploads/images/hand.png"/>Back Slap</a></div><div class="col"> </div><div class="col"><a href="#"><img src="/uploads/images/share.png"/>Share</a></div></div></div></div>
             
                                            
                                        </div>  
            
                                        <div class="lstevnt">
                                        <div class="row">
                                        <div class="col-lg-6 col-md-12"> 
                                        <div class="srchpstbx"><div class="usrtop"><div class="row"><div class="col-2"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div><div class="col-8 nopad pt-1"><a>Teena Bill Grason</a><span class="small pstim">12 min ago</span></div><div class="col-2"><span class="acttyp"><img src="/uploads/images/run.svg"/></span></div></div></div><div class="pstmd"><img src="/uploads/images/img2.jpg"/></div><h4 class="mt-3 mb-3"> <a href="#">Australian Health and Fitness Expo 2019</a></h4><p><span class="f14"><img src="/uploads/images/calendar.png"/>12:00 pm to 3:00 pm  -  Fri 12 Nov 2019</span></p><p> <span class="f14"><img src="/uploads/images/pin.png"/>145, P block, Park View, Eithense, Australia</span></p><p class="mb-2"> <span class="f14"><img src="/uploads/images/people.png"/>142 People Attending</span></p><a href="" class="btn grnbtn w100 mt-2 f16 mb-2">I am Interested</a><div class="lkbxbtm f12"><div class="row"><div class="col"><a href="#">
                                        <img src="/uploads/images/share.png"/>Share</a></div></div></div></div>    
                                        </div>
                                        <div class="col-lg-6 col-md-12"> 
                                        <div class="srchpstbx"><div class="usrtop"><div class="row"><div class="col-2"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div><div class="col-8 nopad pt-1"><a>Teena Bill Grason</a><span class="small pstim">12 min ago</span></div><div class="col-2"><span class="acttyp"><img src="/uploads/images/run.svg"/></span></div></div></div><div class="pstmd"><img src="/uploads/images/img2.jpg"/></div><h4 class="mt-3 mb-3"> <a href="#">Australian Health and Fitness Expo 2019</a></h4><p><span class="f14"><img src="/uploads/images/calendar.png"/>12:00 pm to 3:00 pm  -  Fri 12 Nov 2019</span></p><p> <span class="f14"><img src="/uploads/images/pin.png"/>145, P block, Park View, Eithense, Australia</span></p><p class="mb-2"> <span class="f14"><img src="/uploads/images/people.png"/>142 People Attending</span></p><a href="" class="btn grnbtn w100 mt-2 f16 mb-2">I am Interested</a><div class="lkbxbtm f12"><div class="row"><div class="col"><a href="#">
                                        <img src="/uploads/images/share.png"/>Share</a></div></div></div></div>  
                                        </div>
                                        </div>
                                        </div>  
                                        <div class="row">
                                        <div class="col-lg-6 col-md-12">
                                            <div class="pplsrch grpsrch"><div class="usrtop"><div class="row"><div class="col-3"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div><div class="col-9 nopad"><a class="mb-2" href="#">Gym Workout Fitness</a><p class="mt-1 small  pstim">New Jerrssey, USA</p><p class="mt-1"> <a class="smplbtn m-0 " href="#">Join Group</a></p></div></div></div></div>
                                        </div>
                                        <div class="col-lg-6 col-md-12">
                                            <div class="pplsrch grpsrch"><div class="usrtop"><div class="row"><div class="col-3"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div><div class="col-9 nopad"><a class="mb-2" href="#">Bodybuilding, Powerlifting And Fitness</a><p class="small mt-1 pstim">Group 3.1k members - 124 posts</p><p class="mt-1"> <a class="smplbtn m-0 unflw " href="#">Leave Group</a></p></div></div></div></div>
                                        </div>        
                                        </div>
                                        <div class="row">
                                        <div class="col-md-12"> 
                                            
                                        <div class="srchpstbx postbx bxshadow ">
            
            <div class="usrtop">
                <div class="row">
                    <div class="col-6">
                        <div class="userthumb"><a class="userbx">
                            <img src="/uploads/images/user2.jpg"/></a>
                                <div><a>Teena Bill Grason</a>
                                <span class="small pstim">12 min ago</span>
                                </div>
                            </div>
                            </div>
                            <div class="col-6 "><span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span>
                            </div>
                            </div>
                        </div> 

            
            <div class="pstmd"><img src="/uploads/images/img2.jpg"/></div>
            <div class="dtacontrl">
            <h4 class="mt-3 mb-3"> Australian Health and Fitness Expo 2019</h4>
            <p><span class="f14"><img src="/uploads/images/calendar.png"/>12:00 pm to 3:00 pm  -  Fri 12 Nov 2019</span></p>
            <p> <span class="f14"><img src="/uploads/images/pin.png"/>145, P block, Park View, Eithense, Australia</span></p>
            <p> <span class="f14"><img src="/uploads/images/people.png"/>142 People Attending</span></p>
            <a href="" class="btn grnbtn w100 f16">I am Interested</a>
            </div>
           
            <div class="lkbxbtm f12">
            <div class="row">
            <div class="col">
            <a href="#"><img src="/uploads/images/share.png"/>Share</a>
            </div>
            </div>
            </div>
            <div class="dtacontrl">
            <h4 class="mt-4">Event Details</h4><p class="f14">Phasellus eget purus id felis dignissim convallis Suspendisse et augue dui gravida Cras ultricies ligula sed magna dictum porta, Sed ut perspiciatis unde omnis iste natus error sit voluptat erci tation ullamco laboris nisi ut aliq uip.eiu smod tempor the incidi dunt ut labore et dolore magna aliqua. Ut atenim ad minim veniam, quis nostrud exerci tation abore et dolore magna aliqua. Uhbt atenim</p><h4 class="mt-3 mb-3">Event Location</h4><p class="mb-0"><img src="/uploads/images/map.jpg"/></p>
            </div>
            </div>
            
                                        </div>
                                        </div> 
                        
                                                <div class="row">
                                                <div class="col-md-12">
                                                <div class="bxshadow usrprfl">
                                                    
                                                    <div class="prflbx"><a class="splbtn f12">Edit</a><span class="bigusr"><img src="/uploads/images/user-thumb-big.jpg"/></span><span>Adam Grason</span><span>
                                                    <img src="/uploads/images/cap.svg"/></span></div> 

                                                    <div class="row">   
                                                        <div class="col-6">
                                                        <div class="infbx">
                                                        <a class="splbtn f12">Edit</a><p >Your Coaching Club</p><p><a href="#"><img src="/uploads/images/dummy-logo.png"/>AustAth</a></p><p><a href="#"><img src="/uploads/images/dummy-logo.png"/>Brooklyn Gym</a></p>
                                                        </div>    
                                                       </div>   
                                                        <div class="col-6">
                                                        <div class="infbx">
                                                        <a class="splbtn f12">Edit</a><p >Your Location</p><p><a href="#">Broklyn, Australia</a></p>
                                                        </div>    
                                                        </div>

                                                        <div class="usrphto"><p>Your Photos (34)</p><div class="phtoglry">
                                                        <div class="row">
                                                            <div class="col-3 nopad"><a href=""><img src="/uploads/images/img2.jpg"/></a>
                                                            </div>
                                                            <div class="col-3 nopad"><a href=""><img src="/uploads/images/user-thumb-big.jpg"/></a>
                                                            </div>
                                                            <div class="col-3 nopad"><a href=""><img src="/uploads/images/hotel-img.png"/></a></div>
                                                            <div class="col-3 nopad"><a href=""><img src="/uploads/images/img1.jpg"/></a></div> 
                                                                
                                                            <div class="col-3 nopad"><a href=""><img src="/uploads/images/ex-img3.jpg"/></a>
                                                            </div>
                                                            <div class="col-3 nopad"><a href=""><img src="/uploads/images/img3.jpg"/></a>
                                                            </div>
                                                            <div class="col-3 nopad"><a href=""><img src="/uploads/images/ex-img1.jpg"/></a></div>
                                                            <div class="col-3 nopad"><a href=""><img src="/uploads/images/ex-img4.jpg"/></a></div> 
                                                            <div class="col-12 mt-4"><a href="#" class="btnbig">View All Photos</a></div></div></div></div>
 
                                                    </div>

                                                    <div class="row">    
                                                        <div class="phtoglry usrphto">
                                                            <p>Your Followers (14)</p> 
                                                            <div class="row flwrs"> 
<div class="col-3 nopad"><a href=""><img src="/uploads/images/user-thumb-big.jpg"/><span>James</span></a></div><div class="col-3 nopad"><a href=""><img src="/uploads/images/user2.jpg"/><span>Makron</span></a></div><div class="col-3 nopad"><a href=""><img src="/uploads/images/user-thumb-big.jpg"/><span>Julia</span></a></div><div class="col-3 nopad"><a href=""><img src="/uploads/images/ex-img1.jpg"/><span>Bill</span></a></div><div class="col-3 nopad"><a href=""><img src="/uploads/images/user-thumb-big.jpg"/><span>Fodmatli</span></a></div><div class="col-3 nopad"><a href=""><img src="/uploads/images/user1.jpg"/><span>Pakerlog</span></a></div><div class="col-12 mt-1"><a href="#" class="btnbig">View All Followers</a></div></div></div>
 
                                                    </div>

                                                    </div>
                                            </div>
                                        </div>
                                    

                                    </div>
                                    
                                </div>
                            </div>

            

            </div> 
            
            
            
        )
    }
}

export default DesktopTrending
