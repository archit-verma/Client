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
                           

    
class TeamAdmin extends Component {
    
                   
    render() {
        return (
            <div className='outbx'>
             
 


                <p className='text-center small'>- - - Home Section Starts - - -</p>


                <div className='hdrsec'>
                    <ul>
                        <li><a href='#'><img src="/uploads/images/menu.svg"/></a></li>
                        <li><a className='selsec' href='#'><img src="/uploads/images/home.svg"/><span>Feed</span></a></li>
                        <li><a href='#'><img src="/uploads/images/trending.svg"/><span>Trending</span></a></li>
                        <li><a href='#'><img src="/uploads/images/questions.svg"/><span>Answers</span></a></li>
                         <li><a href='#'><img src="/uploads/images/search.svg"/><span>Answers</span></a></li>
                        <li><a href='#'><img src="/uploads/images/notification.svg"/><span>Alerts</span></a></li>
                        <li><a href='#'><img src="/uploads/images/messages.svg"/><span>Messages</span></a></li>
                        
                    </ul>
                </div>

                <div className='mnmenu'>
                    <div className='tphd'>
                    <div class="userthumb">
                        <div class="userbx ">
                            <img src="/uploads/images/user1.jpg"/></div>
                            <div>David Makron</div>
                            </div> 
                    </div>
                    <div className='mnuen'>
                        
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

                    </div>

                    

                    <div className='mnmnu'>
                         <p><a className='btnspl' href="#">Go To My Planner</a></p>
                        <span className='small text-center'>Powered by: Coaching Mate</span>
                    </div>

                </div>

                <p className='text-center small'>- - - Home Section Ends - - -</p>   


                <span>user container before row</span>
                <div className='teams-container'>
                <a className='backbtn'> </a> 
                <h6>Athlete Melbourne</h6>
                </div>
                 
                
                
                <div className='boxmenu'>
                    <ul>
                    <li><a className=''>Change Cover</a></li>
                    <li><a className=''>About your team </a></li>
                    <li><a className=''>Posts</a></li>
                    <li><a className=''>Members</a></li>
                    <li><a className=''>Events</a></li> 
                    </ul>
                </div> 
            
                <div className='boxmenu'>
                    <ul> 
                    <li><a className=''>Suspend Team</a></li>
                    <li><a className=''>Remove Team</a></li> 
                    </ul>  
                </div>
               
            
                
                <div className='teams-container'>
                <a className='backbtn'> </a> 
                <h6>Chage Cover</h6>
                </div>
                <h6 className='text-center'>Add photo to your team page</h6>
                <div className='boxmenu'>
                <a href='' className='button subbtn'>Choose Photo</a>
                <p className='text-center'><small className='text-center'>Please choose at least 400px wide and 150px tall.</small></p>
                </div>
                
            
                 
                <div className='teams-container'>
                <a className='backbtn'> </a> 
                <h6>About </h6>
                </div>
                 
                <div className='boxmenu'>
                 <p>
                    Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home, or simply in one part of the world, for long periods of time doesn’t mean you need to miss out on all the incredible sights this world has to offer! Instead of only dreaming of when you can travel again, I recommend that you take a virtual tour of some of the best landmarks around the world.
                 </p>
                </div>
            
            
            
                <div className='teams-container'>
                <a className='backbtn'> </a> 
                <h6>Members</h6>
                </div>
                 
                <div className='boxmenu mmbr'> 
                <div class="userthumb">
                <div class="userbx "><img src="/uploads/images/user1.jpg"/></div>
                <div >David Makron</div>
                <div className='col'>
                <span className='pushright'><a className='green' href='#'> Accept </a>  &nbsp; | &nbsp; <a  href='#'> Reject </a></span>
                </div>
                </div> 
                </div>
            
                <div className='boxmenu mmbr'> 
                <div class="userthumb">
                <div class="userbx "><img src="/uploads/images/user1.jpg"/></div>
                <div >Ever Green</div>
                <div className='col'><a className='pushright' href='#'>Remove</a></div>
                </div> 
                </div>
                
                <div className='boxmenu mmbr'> 
                <div class="userthumb">
                <div class="userbx "><img src="/uploads/images/user1.jpg"/></div>
                <div>Johans Parker David</div>
                <div className='col'><a className='pushright' href='#'>Remove</a></div>
                </div> 
                </div>
            
                <div className='boxmenu mmbr'> 
                <div class="userthumb">
                <div class="userbx "><img src="/uploads/images/user1.jpg"/></div>
                <div >Tom Barklay</div>
                <div className='col'><a className='pushright' href='#'>Remove</a></div>
                </div> 
                </div>
            
                <div className='boxmenu mmbr'> 
                <div class="userthumb">
                <div class="userbx "><img src="/uploads/images/user1.jpg"/></div>
                <div >Johantan Endriew</div>
                <div className='col'><a className='pushright' href='#'>Remove</a></div>
                </div> 
                </div>
            
            
            
                
            
            
                <div className='teams-container'>
                <a className='backbtn'> </a> 
                <h6>Events <a className='pushright createbtn f14' href="#">Create Event</a></h6>
                </div>
                 
                <div className='boxmenu mmbr'> 
                <div>
                <div class="userbx "><a href="#"><img src="/uploads/images/img1.jpg"/></a></div>
                <h6>Athletes Color Day Special</h6>
                <small>Sat 1 Jan 2020 - 10 am to 5pm</small>
                <p className='text-right'><a className='' href='#'>Remove</a></p> 
                </div> 
                </div>
            
                <div className='boxmenu mmbr'> 
                <div>
                <div class="userbx "><a href="#"><img src="/uploads/images/img1.jpg"/></a></div>
                <h6>Athletes Color Day Special</h6>
                <small>Sat 1 Jan 2020 - 10 am to 5pm</small>
                <p className='text-right'><a className='' href='#'>Remove</a></p> 
                </div> 
                </div>
            
            
                
            
                <div className='teams-container'>
                <a className='backbtn'> </a> 
                <h6>Create Event<a className='pushright createbtn f14' href="#">Cancel</a></h6>
                </div>
                 
                <div className='boxmenu mmbr crtevnt'> 
                 
                <form>
                    <div class="form-group"><label class="form-label" for="formGroupEmail">Event Name</label><input placeholder="" type="text" id="formGroupEmail" class="form-control"/></div>
                    <div className='row'> 
                        <div className='col'>
                        <div class="form-group"><label class="form-label" for="formGroupEmail">Start Date</label><input placeholder="" type="text" id="formGroupEmail" class="form-control"/></div>
                        </div>
                        <div className='col pl-0'>
                        <div class="form-group"><label class="form-label" for="formGroupEmail">End Date</label><input placeholder="" type="text" id="formGroupEmail" class="form-control"/></div>
                        </div>
                    </div>
            
                    <div className='row'> 
                        <div className='col'>
                        <div class="form-group"><label class="form-label" for="formGroupEmail">Start Time</label><input placeholder="" type="text" id="formGroupEmail" class="form-control"/></div>
                        </div>
                        <div className='col pl-0'>
                        <div class="form-group"><label class="form-label" for="formGroupEmail">End Time</label><input placeholder="" type="text" id="formGroupEmail" class="form-control"/></div>
                        </div>
                    </div>
            
            
                    <div class="form-group">
                    <label class="form-label" for="exampleForm.ControlTextarea1">About Event</label><textarea rows="3" id="exampleForm.ControlTextarea1" class="form-control"></textarea>
                    </div>
            
                    <div class="form-group">
                    <a class="button ">Upload Photo</a> 
                    </div>
            
                    <div class="form-group"><a class="button subbtn">Create Event</a></div>
            
                </form>
            
                </div>
            
            
            
            
            <div className='teams-container'>
                <a className='backbtn'> </a> 
                <h6>Fitness And Running</h6>
                </div>
                 
                <div className='pgttl'>
                <h3 className='f20'>Fitness and Kieto Diet</h3>
                <span>454 members</span>
                <span className='bdg'>Admin</span>
                <img src="/uploads/images/img2.jpg"/> 
                </div>
            
            
                <div className='teamsrchbx'> 

                        <div className='row'>
                        <div className='col-9'>
                    
                        <div class="form-group"> 
                          <input placeholder="Search" type="text" class="form-control"/>
                          <button><img src="/uploads/images/search.png"/></button>
                        </div>
            
                        </div>
                        <div className='col-2 nopad text-center mropt'> <span><img src="/uploads/images/dots.png"/><br/>Options</span> </div>
                        </div> 

                </div>
            
            
                <div className='wrtpost'> 

                        <div class="userthumb">
                        <a class="userbx"><img src="/uploads/images/user1.jpg"/></a>
                        <a>Post Somthing</a>
                        </div>

                </div>
            
            
                
                <div className='postbx'> 
                
                    <div className='usrtop'>
                    <div className='row'>
                    <div className='col-2'><div class="userthumb">
                    <a class="userbx"><img src="/uploads/images/user2.jpg"/></a> 
                    </div></div>
                    <div className='col-8 nopad pt-1'><a>Teena Bill Grason</a></div>
                    <div className='col-2'> 
                    <span class="acttyp"><img src="/uploads/images/run.svg"/></span>
                    </div>
                    </div>  
                    </div>
                    
                    <p className='f12'>
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
               
            
            
            
                <div className='postbx'> 
                
                    <div className='usrtop'>
                    <div className='row'>
                    <div className='col-2'><div class="userthumb">
                    <a class="userbx"><img src="/uploads/images/user2.jpg"/></a> 
                    </div></div>
                    <div className='col-8 nopad pt-1'><a>Teena Bill Grason</a></div>
                    <div className='col-2'> 
                    <span class="acttyp"><img src="/uploads/images/run.svg"/></span>
                    </div>
                    </div>  
                    </div>
                    
                    <p className='f12'>
                    Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home, or simply in one part of the world, for long periods of time doesn’t mean you need to miss out on all the incredible sights this world has to offer!
                    </p> 
                    <div className='pstmd'>
                        <img src="/uploads/images/img1.jpg"/>
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
                        <div className='ovrmnu'>
                            <ul>
                            <li><a href="#">Save Post</a></li>
                            <li><a href="#">Edit Post</a></li>
                            <li><a href="#">Delete Post</a></li>
                            <li><a href="#">Report Post</a></li> 
                            </ul>
                        </div>
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
                
            
            
            
            
            
                <div className='postbx'> 
                
                    <div className='usrtop'>
                    <div className='row'>
                    <div className='col-2'><div class="userthumb">
                    <a class="userbx"><img src="/uploads/images/user2.jpg"/></a> 
                    </div></div>
                    <div className='col-8 nopad pt-1'><a>Teena Bill Grason</a></div>
                    <div className='col-2'> 
                    <span class="acttyp"><img src="/uploads/images/run.svg"/></span>
                    </div>
                    </div>  
                    </div>
                    
                    <p className='f12'>
                    Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home, or simply in one part of the world, for long periods of time doesn’t mean you need to miss out on all the incredible sights this world has to offer!
                    </p> 
                    <div className='pstmd'>
                        <img src="/uploads/images/img3.jpg"/>
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
                        <div className='col'><a href="#"><img src="/uploads/images/share.png"/>Share</a>
                            <div className='ovrmnu'>
                                <ul>
                                <li><a href="#"><img   src="/uploads/images/share.png"/> Share Post</a></li> 
                                </ul>
                            </div>
                        </div>
                        </div>
                    </div> 
                    
                </div>
            
            
            
            
            <div className='postbx'> 
                
                    <div className='usrtop'>
                    <div className='row'>
                    <div className='col-2'><div class="userthumb">
                    <a class="userbx"><img src="/uploads/images/user2.jpg"/></a> 
                    </div></div>
                    <div className='col-8 nopad pt-1'><a>Teena Bill Grason</a></div>
                    <div className='col-2'> 
                    <span class="acttyp"><img src="/uploads/images/run.svg"/></span>
                    </div>
                    </div>  
                    </div>
                    
                    <p className='f12'>
                    Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home, or simply in one part of the world, for long periods of time doesn’t mean you need to miss out on all the incredible sights this world has to offer!
                    </p> 
                    <div className='pstmd'>
                        <img src="/uploads/images/55.jpeg"/>
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
                        <div className='col'><a href="#"><img src="/uploads/images/hand.png"/>Back Slap</a>
                            <div className='ovrmnu lkbx'>
                                    <ul>
                                    <li><a href="#"><img   src="/uploads/images/back-c.png"/> Thumbs Up</a></li>
                                    <li><a href="#"><img   src="/uploads/images/bum-c.png"/> Bum Slap</a></li> 
                                    <li><a href="#"><img   src="/uploads/images/thumbs-c.png"/> Back Slap</a></li>
                                    </ul>
                                </div>
                            </div>
                        <div className='col'><a href="#"><img src="/uploads/images/comment.png"/>Comment</a></div>
                        <div className='col'><a href="#"><img src="/uploads/images/share.png"/>Share</a>
                            
                        </div>
                        </div>
                    </div> 


                    
                    
                </div>
            
            
            
            
            
            
            <div class="teams-container"><a class="backbtn"> </a><h6>It’s the hottest weight loss trend...</h6></div>
            
            
            <div className='postbx'> 
                
                    <div className='usrtop'>
                    <div className='row'>
                    <div className='col-2'><div class="userthumb">
                    <a class="userbx"><img src="/uploads/images/user2.jpg"/></a> 
                    </div></div>
                    <div className='col-8 nopad pt-1'><a>Teena Bill Grason</a><span className='small pstim'>12 min ago</span></div>
                    <div className='col-2'> 
                    <span class="acttyp"><img src="/uploads/images/run.svg"/></span>
                    </div>
                    </div>  
                    </div>
                    
                    <p className='f12'>
                    Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home, or simply in one part of the world, for long periods of time doesn’t mean you need to miss out on all the incredible sights this world has to offer!
                    </p> 
                    <div className='pstmd'>
                        <img src="/uploads/images/55.jpeg"/>
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
                        <div className='col'>
                        <a href="#"><img src="/uploads/images/hand.png"/>Back Slap</a>
                        </div>
                        <div className='col'><a href="#"><img src="/uploads/images/comment.png"/>Comment</a></div>
                        <div className='col'><a href="#"><img src="/uploads/images/share.png"/>Share</a>
                            
                        </div>
                        </div>
                    </div> 
            
            
                          
                    
            
                    
            
            
                </div>
               <div className='comntsec'>
                               <h6>Comments</h6>
                <div className='comntbx'>
                    
                    <div className='usrtop'>
                    <div className='row'>
                    <div className='col-2'><div class="userthumb">
                    <a class="userbx"><img src="/uploads/images/user2.jpg"/></a> 
                    </div></div>
                    <div className='col-10 nopad pt-1'><a>Teena Bill Grason</a><span className='small pstim'>12 min ago</span></div> 
                    </div>  
                    </div>
                    
                    <div className='cmntxt'>
                        <p>
                        It's the hottest weight loss trend around-- but is it healthy? Discover the important effects can have on our health with these tips from CR's nutrition experts.
                        </p>
                    </div>
                    <hr/>
                    <div className='rplybx row'>
                        
                       <div className='col text-left'><span>0 Replies</span> </div>
                       <div className='col text-right'><a href='#'>Post Reply</a></div> 
                       
                    </div>
                </div>
            
            
                 <div className='comntbx'>
                    
                    <div className='usrtop'>
                    <div className='row'>
                    <div className='col-2'><div class="userthumb">
                    <a class="userbx"><img src="/uploads/images/user2.jpg"/></a> 
                    </div></div>
                    <div className='col-10 nopad pt-1'><a>James Bratheon</a><span className='small pstim'>12 min ago</span></div> 
                    </div>  
                    </div>
                    
                    <div className='cmntxt'>
                        <p>
                        It's the hottest weight loss trend around-- but is it healthy? Discover the important effects can have on our health with these tips from CR's nutrition experts.
                        </p>
                    </div>
                                <hr/>
                                <div className='rplybx row'>
                                   
                                   <div className='col text-left'><a href="#">3 Replies</a> </div>
                                   <div className='col text-right'><span>Close Replies</span></div> 

                                   <div className='col-12 replybxin'>
                                        <div class="usrtop">
                                            <div class="row">
                                                <div class="col-2">
                                                    <div class="userthumb">
                                                    <a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div>
                                                    <div class="col-10 nopad pt-1"><a>Teena Bill Grason</a>
                                                    <span class="small pstim">12 min ago</span>
                                                </div>
                                            </div>
                                         </div>
                                        <div className='cmntxt'>This is way better method to reduce weight effectively</div>
                                    </div> 
                                    </div>
                                
                                <div className='rplybx row'> 
                                   
                                   <div className='col-12 replybxin'>
                                        <div class="usrtop">
                                            <div class="row">
                                                <div class="col-2">
                                                    <div class="userthumb">
                                                    <a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div>
                                                    <div class="col-10 nopad pt-1"><a>Teena Bill Grason</a>
                                                    <span class="small pstim">12 min ago</span>
                                                </div>
                                            </div>
                                         </div>
                                        <div className='cmntxt'>This is way better method to reduce weight effectively</div>
                                   </div> 
                                </div>
                               
                                <div className='rplybx row'> 
                                   
                                   <div className='col-12 replybxin'>
                                        <div class="usrtop">
                                            <div class="row">
                                                <div class="col-2">
                                                    <div class="userthumb">
                                                    <a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div>
                                                    <div class="col-10 nopad pt-1"><a>Teena Bill Grason</a>
                                                    <span class="small pstim">12 min ago</span>
                                                </div>
                                            </div>
                                         </div>
                                        <div className='cmntxt'>This is way better method to reduce weight effectively</div>
                                   </div> 
                                </div>
            
                               <div className='pstrplybxbtm'>
                                <a href="#">Post Reply</a>     
                               </div>
                                
                </div>
                   
            
                <div className='wrtcmnt'> 
                    <input placeholder="Write Comment" type="text" id="formGroupEmail" class="form-control"/>
                    <a href="#" className='sndbtn'></a>
                </div>
 
                
                
                <div className='ntfbx'> 
                <div class="boxmenu mmbr">
                <div class="userthumb"><div class="userbx "><img src="/uploads/images/user1.jpg"/>
                </div><div><a href="#">Bill Johanson</a><span class="small pstim">12 min ago</span><span>Commented on your post</span></div><div class="col">  </div></div>
                </div>
                </div>
            
                <div className='ntfbx'> 
                <div class="boxmenu mmbr">
                <div class="userthumb"><div class="userbx "><img src="/uploads/images/user1.jpg"/>
                </div><div><a href="#">Event: Marathon in Mallborn</a><span class="small pstim">12 min ago</span><span>Commented on your post</span></div><div class="col">  </div></div>
                </div>
                </div>
            
            
            
            
            
                    
            
            
            
            
                    <div className='usrpfl'> 
            
                            <div className='prflbx'> 
                            <a className='splbtn f12'>Edit</a>
                            <span className='bigusr'><img src="/uploads/images/user-thumb-big.jpg"/></span><span>Adam Grason</span><span><img  src="/uploads/images/cap.svg"/></span>  
                            </div>

                            <div className='infbx'>
                            <a class="splbtn f12">Edit</a>
                            <p className='small'>Your Coaching Club</p>
                            <p><a href="#">AustAth</a></p>
                            <p><a href="#">Brooklyn Gym</a></p> 
                            </div>

                            <div className='infbx'>
                            <a class="splbtn f12">Edit</a>
                            <p className='small'>Your Location</p>
                            <p><a href="#">Broklyn, Australia</a></p>
                            </div>
                            <div className='usrphto'>
                            <p className='small'>Your Photos (34)</p>
                                <div className='phtoglry'> 
                                <div className='row'>
                                <div className='col-4 nopad'><a href=''><img src="/uploads/images/user-thumb-big.jpg"/></a></div>
                                <div className='col-4 nopad'><a href=''><img src="/uploads/images/user-thumb-big.jpg"/></a></div>
                                <div className='col-4 nopad'><a href=''><img src="/uploads/images/user-thumb-big.jpg"/></a></div>
                                <div className='col-4 nopad'><a href=''><img src="/uploads/images/user-thumb-big.jpg"/></a></div>
                                <div className='col-4 nopad'><a href=''><img src="/uploads/images/user-thumb-big.jpg"/></a></div>
                                <div className='col-4 nopad'><a href=''><img src="/uploads/images/user-thumb-big.jpg"/></a></div>
                                <div className='col-12 mt-2'><a href="#" className='btnbig'>View All Photos</a></div>
                                </div>
                                </div>
                            </div>

                            <div className='usrphto'>
                            <p className='small'>Your Followers (123)</p>
                                <div className='phtoglry'> 
                                <div className='row'>
                                <div className='col-4 nopad'><a href=''><img src="/uploads/images/user-thumb-big.jpg"/><span>James</span></a></div>
                                <div className='col-4 nopad'><a href=''><img src="/uploads/images/user-thumb-big.jpg"/><span>Makron</span></a></div>
                                <div className='col-4 nopad'><a href=''><img src="/uploads/images/user-thumb-big.jpg"/><span>Julia</span></a></div>
                                <div className='col-4 nopad'><a href=''><img src="/uploads/images/user-thumb-big.jpg"/><span>Bill</span></a></div>
                                <div className='col-4 nopad'><a href=''><img src="/uploads/images/user-thumb-big.jpg"/><span>Fodmatli</span></a></div>
                                <div className='col-4 nopad'><a href=''><img src="/uploads/images/user-thumb-big.jpg"/><span>Pakerlog</span></a></div>
                                <div className='col-12 mt-1'><a href="#" className='btnbig'>View All Followers</a></div>
                                </div>
                                </div>
                            </div> 

                    </div>
            
                    <span>----------- Questions Main Start ---------</span>

                        <div class="wrtpost">
                            <div class="userthumb"><a class="userbx"><img src="/uploads/images/user1.jpg"/></a><a>Post a Question</a></div>
                        </div>


                        <div className='qststrp'>
                            <span className='bxtyp typsel'><img src="/uploads/images/walk.svg"/> Walking</span>
                            <span className='bxtyp'><img src="/uploads/images/cycling.svg"/> Cycling</span> 
                            <span className='bxtyp'><img src="/uploads/images/flexibility.svg"/> Flexibility</span>
                            <span className='bxtyp'><img src="/uploads/images/run.svg"/> Running</span>    
                        </div>

                        <div class="qstnbx">
                            <h6>Question</h6>
                            <div class="usrtop">
                                <div class="row">
                                    <div class="col-2"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div>
                                    <div class="col-8 nopad pt-1"><a>Teena Bill Grason</a></div>
                                    <div class="col-2"><span class="acttyp"><img src="/uploads/images/run.svg"/></span></div></div></div>
                                    <p>I want to learn how to make my keto diet effective with excersing and swimming?</p>
                                    <a href="#" className='btn btngrn '>Answer This Question</a>
                        </div>

                        <div className='qstnbx ansrbx'> 
                        <h5>Top Answer</h5>
                                <div class="usrtop">
                                        <div class="row">
                                            <div class="col-2">
                                                <div class="userthumb">
                                                    <a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                                </div>
                                            </div>
                                            <div class="col-8 nopad pt-1">
                                                <a className=''>Tommy Branthon</a>
                                            </div>
                                            <div class="col-2">
                                                <span class="acttyp"><img src="/uploads/images/run.svg"/></span>
                                            </div>
                                        </div>
                                 </div>
                                <p>I want to learn how to make my keto diet effective with excersing and swimming?</p>
                                    <div className='row'>
                                        <div className='col-6 pr-1 text-center'>
                                            <p className='grntxt'> 24 found helpful </p> 
                                            <a href="" className='btn grnbtn'>I am Agree</a>                                  
                                        </div>
                                    
                                        <div className='col-6 pl-1 text-center'>
                                        <p>12 not convinced</p>
                                        <a href="" className='btn grybtn'>Not Agree</a> 
                                        </div>
                                    </div>
                                    
                         </div>


                        <div class="qstnbx">
                            <h6>Question</h6>
                            <div class="usrtop">
                                <div class="row">
                                    <div class="col-2"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div>
                                    <div class="col-8 nopad pt-1"><a>Teena Bill Grason</a></div>
                                    <div class="col-2"><span class="acttyp"><img src="/uploads/images/run.svg"/></span></div></div></div>
                                    <p>I want to learn how to make my keto diet effective with excersing and swimming?</p>
                                    <a href="#" className='btn btngrn '>Answer This Question</a>
                        </div>

                        <div className='qstnbx ansrbx'> 
                        <h5>Top Answer</h5>
                                <div class="usrtop">
                                        <div class="row">
                                            <div class="col-2">
                                                <div class="userthumb">
                                                    <a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                                </div>
                                            </div>
                                            <div class="col-8 nopad pt-1">
                                                <a className=''>Tommy Branthon</a>
                                            </div>
                                            <div class="col-2">
                                                <span class="acttyp"><img src="/uploads/images/run.svg"/></span>
                                            </div>
                                        </div>
                                 </div>
                                <p>I want to learn how to make my keto diet effective with excersing and swimming?</p>
                                    <div className='row'>
                                        <div className='col-6 pr-1 text-center'>
                                            <p className='grntxt'> 24 found helpful </p> 
                                            <a href="" className='btn grnbtn'>I am Agree</a>                                  
                                        </div>
                                    
                                        <div className='col-6 pl-1 text-center'>
                                        <p>12 not convinced</p>
                                        <a href="" className='btn grybtn'>Not Agree</a> 
                                        </div>
                                    </div>
                                    
                         </div>

                    <p className='text-center'>------------ Questions Inner Start -----------</p>

                   <p  className='text-center'>----Post Question Popup start-----</p>
                   <div class="main-container createnew">
                       <h3>Write a question</h3>
                        <form><div class="form-group">
                       <textarea rows="3" id="exampleForm.ControlTextarea1" class="form-control"></textarea>
                       </div> <a class="button subbtn">Publish Your Question</a></form>
                       </div>
                   <p className='text-center'>----Post Question Popup Ends-----</p>     
                    <div className='qstnbx'> 
                        <h6>Question</h6>
                                <div class="usrtop">
                                        <div class="row">
                                            <div class="col-2">
                                                <div class="userthumb">
                                                    <a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                                </div>
                                            </div>
                                            <div class="col-8 nopad pt-1">
                                                <a>Teena Bill Grason</a>
                                            </div>
                                            <div class="col-2">
                                                <span class="acttyp"><img src="/uploads/images/run.svg"/></span>
                                            </div>
                                        </div>
                                 </div>
                            <p>I want to learn how to make my keto diet effective with excersing and swimming?</p>
                    </div>

                    <div className='qstnbx ansrbx'> 
                        <h5>Top Answer</h5>
                                <div class="usrtop">
                                        <div class="row">
                                            <div class="col-2">
                                                <div class="userthumb">
                                                    <a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                                </div>
                                            </div>
                                            <div class="col-8 nopad pt-1">
                                                <a className=''>Tommy Branthon</a>
                                            </div>
                                            <div class="col-2">
                                                <span class="acttyp"><img src="/uploads/images/run.svg"/></span>
                                            </div>
                                        </div>
                                 </div>
                                <p>I want to learn how to make my keto diet effective with excersing and swimming?</p>
                                    <div className='row'>
                                        <div className='col-6 pr-1 text-center'>
                                            <p className='grntxt'> 24 found helpful </p> 
                                            <a href="" className='btn grnbtn'>I am Agree</a>                                  
                                        </div>
                                    
                                        <div className='col-6 pl-1 text-center'>
                                        <p>12 not convinced</p>
                                        <a href="" className='btn grybtn'>Not Agree</a> 
                                        </div>
                                    </div>
                                     
                    </div>

                    <div className='qstnbx ansrbx'> 
                        <h6>Top Answer</h6>
                                <div class="usrtop">
                                        <div class="row">
                                            <div class="col-2">
                                                <div class="userthumb">
                                                    <a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                                </div>
                                            </div>
                                            <div class="col-8 nopad pt-1">
                                                <a className=''>Tommy Branthon</a>
                                            </div>
                                            <div class="col-2">
                                                <span class="acttyp"><img src="/uploads/images/run.svg"/></span>
                                            </div>
                                        </div>
                                 </div>
                                <p>I want to learn how to make my keto diet effective with excersing and swimming?</p>
                                    <div className='row'>
                                        <div className='col-6 pr-1 text-center'>
                                            <p className='grntxt'> 24 found helpful </p> 
                                            <a href="" className='btn grnbtn'>I am Agree</a>                                  
                                        </div>
                                    
                                        <div className='col-6 pl-1 text-center'>
                                        <p>12 not convinced</p>
                                        <a href="" className='btn grybtn'>Not Agree</a> 
                                        </div>
                                    </div>
                                     
                    </div>

                    <div className='qstnbx ansrbx'> 
                        <h6>Top Answer</h6>
                                <div class="usrtop">
                                        <div class="row">
                                            <div class="col-2">
                                                <div class="userthumb">
                                                    <a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                                </div>
                                            </div>
                                            <div class="col-8 nopad pt-1">
                                                <a className=''>Tommy Branthon</a>
                                            </div>
                                            <div class="col-2">
                                                <span class="acttyp"><img src="/uploads/images/run.svg"/></span>
                                            </div>
                                        </div>
                                 </div>
                                <p>I want to learn how to make my keto diet effective with excersing and swimming?</p>
                                    <div className='row'>
                                        <div className='col-6 pr-1 text-center'>
                                            <p className='grntxt'> 24 found helpful </p> 
                                            <a href="" className='btn grnbtn'>I am Agree</a>                                  
                                        </div>
                                    
                                        <div className='col-6 pl-1 text-center'>
                                        <p>12 not convinced</p>
                                        <a href="" className='btn grybtn'>Not Agree</a> 
                                        </div>
                                    </div>
                                     
                    </div>
                    
                    <div class="wrtcmnt mt-2">
                        <input placeholder="Answer The Question" type="text" id="formGroupEmail" class="form-control"/><a href="#" class="sndbtn"></a>
                    </div>
            
            
                    
                    
            
            
            
            
                
               </div>

               <p className='text-center'>- - - Search Section Recent - - -</p>

                    <div class="wrtpost srch"> 
                    <div class="userthumb">
                        <span><img src="/uploads/images/search.png"/></span>
                        <span>Search somthing here...</span>
                        </div>
                    </div>
                    <div className='rcntsrch'>

                        <div className='rcntsrch'>
                            <h6>Recent Searches</h6>
                            <ul className='rcntbx'>
                                <li><a href="">Exercises</a> <a className='pushright small' href="#">Delete</a></li>
                                <li><a href="">Gym workout</a><a className='pushright small' href="#">Delete</a></li>
                                <li><a href="">Training and Fitness</a><a className='pushright small' href="#">Delete</a></li>
                                <li><a href="">Diet and Health</a><a className='pushright small' href="#">Delete</a></li>
                                <li><a href="">Interminent Fasting</a><a className='pushright small' href="#">Delete</a></li>

                            </ul>
                            <p className='text-center'><a className="grytxt" href="">Clear Search History</a></p>
                             
                        </div>

                    </div>




                    <p className='text-center'>- - - Search Section - - -</p>

                    <div class="wrtpost srch">
                        <div class="userthumb">
                            <span ><img src="/uploads/images/search.png"/></span>

                            <span>Search somthing here...</span>

                        </div> 
                    </div>
                    <div className='typsldr'>
                            <a className="sel" href="">Posts</a>
                            <a href="">Team</a>
                            <a href="">People</a>
                            <a href="">Questions</a>
                            <a href="">Events</a>
                    </div>
                    <div className="srchpstbx"> 
                        <div class="usrtop">
                             <div class="row">
                                <div class="col-2"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div>
                                <div class="col-8 nopad pt-1"><a>Teena Bill Grason</a><span class="small pstim">12 min ago</span></div>
                                <div class="col-2"><span class="acttyp"><img src="/uploads/images/run.svg"/></span></div>
                            </div>
                         </div>
                         <p> My morning walk keeps me fit, healthy and wealthy :)<img src="/uploads/images/img1-small.jpg"/></p>
                            <div className='rctbx'>
                                <span><img src="/uploads/images/symbol1.png"/>23</span>
                                <span><img src="/uploads/images/symbol2.png"/>23</span>
                                <span><img src="/uploads/images/symbol3.png"/>23</span>
                                <span><img src="/uploads/images/symbol4.png"/>23</span>
                                <span><img src="/uploads/images/symbol5.png"/>23</span>
                            </div>  
                    </div>

                    <div className="srchpstbx"> 
                        <div class="usrtop">
                             <div class="row">
                                <div class="col-2"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div>
                                <div class="col-8 nopad pt-1"><a>Teena Bill Grason</a><span class="small pstim">12 min ago</span></div>
                                <div class="col-2"><span class="acttyp"><img src="/uploads/images/run.svg"/></span></div>
                            </div>
                         </div>
                         <p> My morning walk keeps me fit, healthy and wealthy :)<img src="/uploads/images/img1-small.jpg"/></p>
                            <div className='rctbx'>
                                <span><img src="/uploads/images/symbol1.png"/>23</span>
                                <span><img src="/uploads/images/symbol2.png"/>23</span>
                                <span><img src="/uploads/images/symbol3.png"/>23</span>
                                <span><img src="/uploads/images/symbol4.png"/>23</span>
                                <span><img src="/uploads/images/symbol5.png"/>23</span>
                            </div>  
                    </div>

                    <div className="srchpstbx"> 
                        <div class="usrtop">
                             <div class="row">
                                <div class="col-2"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div>
                                <div class="col-8 nopad pt-1"><a>Teena Bill Grason</a><span class="small pstim">12 min ago</span></div>
                                <div class="col-2"><span class="acttyp"><img src="/uploads/images/run.svg"/></span></div>
                            </div>
                         </div>
                         <p> My morning walk keeps me fit, healthy and wealthy :)<img src="/uploads/images/img1-small.jpg"/></p>
                            <div className='rctbx'>
                                <span><img src="/uploads/images/symbol1.png"/>23</span>
                                <span><img src="/uploads/images/symbol2.png"/>23</span>
                                <span><img src="/uploads/images/symbol3.png"/>23</span>
                                <span><img src="/uploads/images/symbol4.png"/>23</span>
                                <span><img src="/uploads/images/symbol5.png"/>23</span>
                            </div>  
                    </div>

                    <div className='typsldr'>
                            <a  href="">Posts</a>
                            <a className="sel" href="">Team</a>
                            <a href="">People</a>
                            <a href="">Questions</a>
                            <a href="">Events</a>
                    </div>

                    <div className="srchpstbx clubbxsrch"> 
                    
                         <p>
                             <img src="/uploads/images/logo.jpg"/><div><a href="#">Fitness Club Name</a>
                             <span class="small pstim">13 followers</span>
                             <span>Offers: Gym, Swimming, Running</span>
                             <span><a className='f14 btn' href="#">Follow Us</a><a className='f14 btn' href="#">Get Membership</a></span>
                             <span className='small'><img src="/uploads/images/pin.png"/>145, P block, Park View, Eithense, Australia</span>
                             </div>
                         </p>
                             
                    </div>

                    <div className='typsldr'>
                            <a  href="">Posts</a>
                            <a href="">Team</a>
                            <a className="sel" href="">People</a>
                            <a href="">Questions</a>
                            <a href="">Events</a>
                    </div>

                    <div className='pplsrch'>
                        <div class="usrtop">
                            <div class="row">
                                <div class="col-3">
                                    <div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                    </div>
                                </div>
                                <div class="col-5 nopad">
                                    <a>Teena Bill Grason</a><span class="small pstim">New Jerrssey, USA</span>
                                </div>
                                <div class="col-4 text-right">
                                    <a className='smplbtn m-0' href="#" >Follow Me</a></div>
                            </div>
                        </div>
                    </div>

                    <div className='pplsrch'>
                        <div class="usrtop">
                            <div class="row">
                                <div class="col-3">
                                    <div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                    </div>
                                </div>
                                <div class="col-5 nopad">
                                    <a>Teena Bill Grason</a><span class="small pstim">New Jerrssey, USA</span>
                                </div>
                                <div class="col-4 text-right">
                                    <a className='smplbtn m-0 unflw' href="#" >Un Follow</a></div>
                            </div>
                        </div>
                    </div>


                    <div className='typsldr'>
                            <a  href="">Posts</a>
                            <a href="">Team</a>
                            <a  href="">People</a>
                            <a className="sel" href="">Questions</a>
                            <a href="">Events</a>
                    </div>

                    <div className="srchpstbx"> 
                        <div class="usrtop">
                             <div class="row">
                                <div class="col-2"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div>
                                <div class="col-8 nopad pt-1"><a>Teena Bill Grason</a><span class="small pstim">12 min ago</span></div>
                                <div class="col-2"><span class="acttyp"><img src="/uploads/images/run.svg"/></span></div>
                            </div>
                         </div>
                         <p> My morning walk keeps me fit, healthy and wealthy :)</p>
                         <a href="" class="btn grnbtn">Answer This Question</a>     
                    </div>

                    <div className="srchpstbx"> 
                        <div class="usrtop">
                             <div class="row">
                                <div class="col-2"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div>
                                <div class="col-8 nopad pt-1"><a>Teena Bill Grason</a><span class="small pstim">12 min ago</span></div>
                                <div class="col-2"><span class="acttyp"><img src="/uploads/images/run.svg"/></span></div>
                            </div>
                         </div>
                         <p> My morning walk keeps me fit, healthy and wealthy :)</p>
                         <a href="" class="btn grnbtn">Answer This Question</a>     
                    </div>

                    <div className="srchpstbx"> 
                        <div class="usrtop">
                             <div class="row">
                                <div class="col-2"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div>
                                <div class="col-8 nopad pt-1"><a>Teena Bill Grason</a><span class="small pstim">12 min ago</span></div>
                                <div class="col-2"><span class="acttyp"><img src="/uploads/images/run.svg"/></span></div>
                            </div>
                         </div>
                         <p> My morning walk keeps me fit, healthy and wealthy :)</p>
                         <a href="" class="btn grnbtn">Answer This Question</a>     
                    </div>

                    <div className='typsldr'>
                            <a  href="">Posts</a>
                            <a href="">Team</a>
                            <a  href="">People</a>
                            <a  href="">Questions</a>
                            <a className="sel" href="">Events</a>
                    </div>

                    <div className="srchpstbx"> 
                        <div class="usrtop">
                             <div class="row">
                                <div class="col-2"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div>
                                <div class="col-8 nopad pt-1"><a>Teena Bill Grason</a><span class="small pstim">12 min ago</span></div>
                                <div class="col-2"><span class="acttyp"><img src="/uploads/images/run.svg"/></span></div>
                            </div>
                         </div>
                         <p> Australian Health and Fitness Expo 2019</p>
                         <p><span class="small"><img src="/uploads/images/calendar.png"/>12:00 pm to 3:00 pm  -  Fri 12 Nov 2019</span></p>
                         <p> <span class="small"><img src="/uploads/images/pin.png"/>145, P block, Park View, Eithense, Australia</span></p>
                         <p> <span class="small"><img src="/uploads/images/people.png"/>142 People Attending</span></p> 
                         <a href="" class="btn grnbtn">I am Interested</a> 
                    </div>

                    <div className='typsldr'>
                             
                            <a href="">Team</a>
                            <a  href="">People</a>
                            <a  href="">Questions</a>
                            <a  href="">Events</a>
                            <a className="sel" href="">Groups</a>
                    </div>

                    <div class="pplsrch grpsrch">
                        <div class="usrtop">
                                <div class="row">
                                    <div class="col-3">
                                        <div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                        </div>
                                    </div>
                                    <div class="col-9 nopad">
                                        <a>Gym Workout Fitness</a><span class="small pstim">New Jerrssey, USA</span>
                                        <p className='mt-1'> <a class="smplbtn m-0 " href="#">Join Group</a></p>
                                    </div> 
                            </div> 
                        </div>
                    </div>

                    <div class="pplsrch grpsrch">
                        <div class="usrtop">
                                <div class="row">
                                    <div class="col-3">
                                        <div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                        </div>
                                    </div>
                                    <div class="col-9 nopad">
                                        <a>Bodybuilding, Powerlifting And Fitness</a><span class="small pstim">Group 3.1k members - 124 posts</span>
                                        <p className='mt-1'> <a class="smplbtn m-0 unflw " href="#">Leave Group</a></p>
                                    </div> 
                            </div> 
                        </div>
                    </div>

                    <p className='text-center'>- - - Search Section Ends - - -</p>


                    <p className='text-center'>- - - Notifications Start - - -</p>
                    <div class="pplsrch grpsrch">
                        <div class="usrtop">
                                <div class="row">
                                    <div class="col-3">
                                        <div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                        </div>
                                    </div>
                                    <div class="col-9 nopad">
                                        <a>Adam Grason</a><span class="small pstim">12 min ago</span>
                                        <p className='mt-1 '>Commented on your post</p>
                                    </div> 
                            </div> 
                        </div>
                    </div>
                    <div class="pplsrch grpsrch">
                        <div class="usrtop">
                                <div class="row">
                                    <div class="col-3">
                                        <div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                        </div>
                                    </div>
                                    <div class="col-9 nopad">
                                        <a>Adam Grason</a><span class="small pstim">12 min ago</span>
                                        <p className='mt-1 f12'>Start following you</p>
                                    </div> 
                            </div> 
                        </div>
                    </div>
                    <div class="pplsrch grpsrch">
                        <div class="usrtop">
                                <div class="row">
                                    <div class="col-3">
                                        <div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                        </div>
                                    </div>
                                    <div class="col-9 nopad">
                                        <a>Event: Marathon in Melborn</a><span class="small pstim">12 min ago</span>
                                        <p className='mt-1 f12'>Starting: 10am to 12pm 12 Oct 2019</p>
                                    </div> 
                            </div> 
                        </div>
                    </div>
                    <p class="text-center"><a class="grytxt" href="">Clear All</a></p>
                    <p className='text-center'>- - - Notifications Ends - - -</p>

                    <p className='text-center'>- - - Event Details Start - - -</p>
                            <div class="srchpstbx">
                                <div class="usrtop">
                                    <div class="row">
                                            <div class="col-2">
                                                <div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                                </div>
                                            </div>
                                            <div class="col-8 nopad pt-1">
                                                <a>Teena Bill Grason</a>
                                                <span class="small pstim">12 min ago</span>
                                            </div>
                                            <div class="col-2">
                                                <span class="acttyp"><img src="/uploads/images/run.svg"/></span>
                                            </div>
                                     </div>
                                </div>
                                    <div class="pstmd"><img src="/uploads/images/img2.jpg"/></div>
                                    <h4 className='mt-3 mb-3'> Australian Health and Fitness Expo 2019</h4>
                                    <p><span class="f14"><img src="/uploads/images/calendar.png"/>12:00 pm to 3:00 pm  -  Fri 12 Nov 2019</span></p>
                                    <p> <span class="f14"><img src="/uploads/images/pin.png"/>145, P block, Park View, Eithense, Australia</span></p>
                                    <p> <span class="f14"><img src="/uploads/images/people.png"/>142 People Attending</span></p>
                                    <a href="" class="btn grnbtn w100 f14">I am Interested</a>
                                    <div class="lkbxbtm f12">
                                            <div class="row"> 
                                                <div class="col"><a href="#"><img src="/uploads/images/share.png"/>Share</a></div>
                                            </div>
                                            </div>

                                    <h4 className='mt-3'>Event Details</h4>
                                    <p className='f12'>Phasellus eget purus id felis dignissim convallis Suspendisse et augue dui gravida Cras 
                                    ultricies ligula sed magna dictum porta, Sed ut perspiciatis unde omnis iste natus error sit voluptat erci 
                                    tation ullamco laboris nisi ut aliq uip.eiu smod tempor the incidi dunt ut labore et dolore magna aliqua. 
                                    Ut atenim ad minim veniam, quis nostrud exerci tation abore et dolore magna aliqua. Uhbt atenim</p>
                                    <h4 className='mt-3'>Event Location</h4>
                                    <p><img src="/uploads/images/map.jpg"/></p>
                            </div>



                    <p className='text-center'>- - - Event Details End - - -</p>


                    <p className='text-center'>- - - Create Post Starts - - -</p>

                    <div class="main-container createnew">
                        <h3>Write a Post</h3>
                        <div class="userthumb"><span class="userbx"><img src="/uploads/images/user1.jpg"/></span><span>Ever Green</span></div>
                                            
                                            <form> 
                                            <div class="form-group">
                                                <label class="form-label" for="exampleForm.ControlTextarea1">Write Somthing</label>
                                                <textarea rows="3" id="exampleForm.ControlTextarea1" class="form-control"></textarea>
                                            </div> 
                                            <a class="button ">Add Photo or Video</a>
                                             
                                            <a class="button subbtn">Publish Your Post</a>
                                            </form>

                    </div>
                    <p className='text-center'>- - - Create Post Ends - - -</p>

                    <p className='text-center'>- - - Messages Starts - - -</p>
                        <div className='msgmnbx'>
                            <div className='msnlstin'>
                                
                                <div class="boxmenu mmbr unrd">
                                        <div class="userthumb">
                                        <div class="userbx ">
                                            <img src="/uploads/images/user1.jpg"/>
                                        </div>
                                            <div>
                                                <a>David Makron</a>
                                                <p>Session will start at 7pm</p>
                                            </div>
                                            <div class="col"><span class="pushright"> <a href="#"> <img src="/uploads/images/delete.png"/> </a> </span></div>
                                        </div>
                                </div>

                                <div class="boxmenu mmbr">
                                        <div class="userthumb">
                                        <div class="userbx ">
                                            <img src="/uploads/images/user1.jpg"/>
                                        </div>
                                        <div>
                                                <a>James Bratheon</a>
                                                <p>You: My boys are getting ready...</p>
                                            </div>
                                            <div class="col"><span class="pushright"> <a href="#"> <img src="/uploads/images/delete.png"/> </a> </span></div>
                                        </div>
                                </div>

                                <div class="boxmenu mmbr">
                                        <div class="userthumb">
                                        <div class="userbx ">
                                            <img src="/uploads/images/user1.jpg"/>
                                        </div>
                                             <div>
                                                <a>Villiam Box</a>
                                                <p>Session will start at 7pm</p>
                                            </div>
                                            <div class="col"><span class="pushright"> <a href="#"> <img src="/uploads/images/delete.png"/> </a> </span></div>
                                        </div>
                                </div>

                            </div>
                        </div>
                    <p className='text-center small'>- - - Messages Ends - - -</p>
                    <p className='text-center small'>- - - Messages Inner Starts - - -</p>

                    <div><p className='text-center'>Conversation between You and Thompson</p></div>  
                    <div className='msginr'>
                        <div className='usrmsg1 f14'>
                        <p>In tegenstelling tot wat algemeen aangenomen wordt is Lorem Ipsum niet zomaar willekeurige tekst.</p>
                        <p className='f12 grytxt'>5 days ago</p> 
                    </div>
                    </div>
                    <div className='msginr'>                         
                        <div className='usrmsg2 f14'>
                        <a href="#" className='delbtn'> <img src="/uploads/images/delete.png"/> </a>    
                        <p>In tegenstelling tot wat algemeen aangenomen wordt is Lorem Ipsum niet zomaar willekeurige tekst.</p>
                        <p className='f12 grytxt'>2 days ago</p>
                        </div> 
                    </div> 

                    <div className='msginr'>
                        <div className='usrmsg1 f14'>
                        <p>In tegenstelling tot wat algemeen aangenomen wordt is Lorem Ipsum niet zomaar willekeurige tekst.</p>
                        <p className='f12 grytxt'>5 days ago</p> 
                    </div>
                    </div>

                    <p className='text-center small'>- - - Messages Inner Ends - - -</p>

                    <p className='text-center small'>- - - Share Post Start - - -</p>
                        <div className='shrpst'>
                            <div class="form-group">
                                <label class="form-label" for="exampleForm.ControlTextarea1">Write Somthing</label>
                                <textarea rows="3" id="exampleForm.ControlTextarea1" class="form-control"></textarea>
                            </div>
                            
                            <div className="srchpstbx"> 
                        <div class="usrtop">
                             <div class="row">
                                <div class="col-2"><div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a></div></div>
                                <div class="col-8 nopad pt-1"><a>Teena Bill Grason</a><span class="small pstim">12 min ago</span></div>
                                <div class="col-2"><span class="acttyp"><img src="/uploads/images/run.svg"/></span></div>
                            </div>
                         </div>
                         <p> My morning walk keeps me fit, healthy and wealthy :)<img src="/uploads/images/img1-small.jpg"/></p>
                             
                    </div>
                     <a class="button subbtn">Share Your Post</a>
                        </div>
                        
                    <p className='text-center small'>- - - Share Post Ends - - -</p>
 

                    <p className='text-center small'>- - - Edit Clubs Starts - - -</p>

                    <div class="teams-container"><a class="backbtn"> </a><h6>Your Teams </h6></div>
                    <div className='usrclbs'> 
                    <ul class="rcntbx">
                        <li><a href=""><img src="/uploads/images/logo.jpg"/>AustAthletes</a> <a class="pushright small" href="#">Delete</a></li>
                        <li><a href=""><img src="/uploads/images/logo.jpg"/> Broklyn Gym </a><a class="pushright small" href="#">Delete</a></li>
                    </ul> 

                    <h6 className='mb-0'>Add Team</h6>

                
                    <div class="teamsrchbx">
                            <div class="row">
                                <div class="col-12 nopad"><div class="form-group">
                                    <input placeholder="Search Team" type="text" class="form-control"/><button><img src="/uploads/images/search.png"/>
                                    </button>
                                    </div>
                                </div>
                            </div>
                    </div>
                    <div className='tmrsltbx'>


                    </div>
                    <ul class="rcntbx">
                        <li><a href="">James Clark Gym</a> <a class="pushright small" href="#">Add</a></li>
                        <li><a href="">AustAuth</a><a class="pushright small" href="#">Add</a></li>
                        <li><a href="">Swimmer's Club</a><a class="pushright small" href="#">Add</a></li>
                        <li><a href="">Beta Club</a><a class="pushright small" href="#">Add</a></li>
                        <li><a href="">TeamAuth</a><a class="pushright small" href="#">Add</a></li></ul>
                    </div>
                   
                    <p className='text-center small'>- - - Edit Clubs Ends - - -</p>

                    <p className='text-center small'>- - - Sing In Start - - -</p>
                        <div className='lgnrgstr'>
                            <h6>Sign In</h6>
                                <div class="form-group">
                                    <label class="form-label" for="formGroupEmail">Email</label>
                                    <input placeholder="" type="text" id="formGroupEmail" class="form-control"/>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="formGroupEmail">Password</label>
                                    <input placeholder="" type="password" id="formGroupEmail" class="form-control"/>
                                </div>
                                <div class="form-group"><a class="button subbtn">Enter</a></div>
                                <p className='text-center'>Are you a new user? <a href="#">Sign Up</a></p>
                        </div>
                    <p className='text-center small'>- - - Sing In Ends - - -</p>

                    <p className='text-center small'>- - - Sing Up Step 1 Starts - - -</p>
                        <div className='lgnrgstr'>
                            <h6>Sign Up</h6>
                                 <div class="form-group">
                                    <label for="exampleSelect1">Who are you?</label>
                                    <select class="form-control" id="exampleSelect1">
                                    <option>I am a athlete</option>
                                    <option>I am a coach</option> 
                                    </select>
                                </div>

                                <div class="form-group">
                                    <label class="form-label" for=" ">User Name</label>
                                    <input placeholder="" type="text" id="formGroupEmail" class="form-control"/>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for=" ">First Name</label>
                                    <input placeholder="" type="text" id=" " class="form-control"/>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for=" ">Last Name</label>
                                    <input placeholder="" type="text" id=" " class="form-control"/>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for=" ">date Of Birth</label>
                                    <input placeholder="" type="text" id=" " class="form-control"/>
                                </div>
                                <div class="form-group">
                                    <label class="form-label"  >Phone</label>
                                    <input placeholder="" type="text"  class="form-control"/>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="formGroupEmail">Email</label>
                                    <input placeholder="" type="email" id="formGroupEmail" class="form-control"/>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="formGroupEmail">Password</label>
                                    <input placeholder="" type="password" id="formGroupEmail" class="form-control"/>
                                </div>
                                <div class="form-group">
                                    <label class="form-label" for="formGroupEmail">Confirm Password</label>
                                    <input placeholder="" type="password" id="formGroupEmail" class="form-control"/>
                                </div>
                                <div class="form-group"><a class="button subbtn">Next</a></div>
                                <p className='text-center'>Already user? <a href="#">Sign In</a></p>
                        </div>
                    <p className='text-center small'>- - - Sing Up Step 1 Ends - - -</p>


                    <p className='text-center small'>- - - Sing Up Step 2 Starts - - -</p>
                        <div className='lgnrgstr'>
                            <h6>Select Your Interest</h6> 
                            <div class="form-check">
                               <label><input type="checkbox" aria-label="option 1" class="form-check-input position-static"/> <img src="/uploads/images/swimming.svg"/> Swimming </label> 
                            </div>
                            <div class="form-check">
                            <label><input type="checkbox" aria-label="option 1" class="form-check-input position-static"/> <img src="/uploads/images/run.svg"/>Running </label>
                            </div>
                            <div class="form-check">
                            <label><input type="checkbox" aria-label="option 1" class="form-check-input position-static"/> <img src="/uploads/images/lifting.svg"/> Weight lifting </label>
                            </div>  
                                <div class="form-group"><a class="button subbtn">Next</a></div>
                                <p className='text-center'><a className='col' href="#">Go back</a>   <a className='col' href="#">Skip this step </a></p>
                        </div>
                    <p className='text-center small'>- - - Sing Up Step 2 Ends - - -</p>


                    <p className='text-center small'>- - - Sing Up Step 3 Starts - - -</p>
                        <div className='lgnrgstr'>
                            <h6>Upload Your Photo</h6> 
                            
                                <div className='addphoto text-center'>
                                    +
                                </div>  
                                <div class="form-group"><a class="button subbtn">Next</a></div>
                                <p className='text-center'><a className='col' href="#">Go back</a>   <a className='col' href="#">Skip this step </a></p>
                        </div>
                    <p className='text-center small'>- - - Sing Up Step 3 Ends - - -</p>

                    <p className='text-center small'>- - - Sing Up Step 4 Starts - - -</p>
                        <div className='lgnrgstr'>
                            <h6>About Your Self</h6> 
                            
                                <div class="form-group">
                                     <textarea rows="3" id="exampleForm.ControlTextarea1" class="form-control"></textarea>
                                </div>
                                <div class="form-group"><a class="button subbtn">Finish</a></div>
                                <p className='text-center'><a className='col' href="#">Go back</a> </p>
                        </div>
                    

                                
                                <div class="lgnrgstr">
                                         <h6>Your followers</h6> 
                                    <div class="usrtop">
                                        <div class="row">
                                            <div class="col-2">
                                            <div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                            </div>
                                            </div>
                                            <div class="col-10 nopad pt-2">
                                            <a>Teena Bill Grason</a><span class="small pstim grntxt f14">coach</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="usrtop">
                                        <div class="row">
                                            <div class="col-2">
                                            <div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                            </div>
                                            </div>
                                            <div class="col-10 nopad pt-2">
                                            <a>Teena Bill Grason</a> 
                                            </div>
                                        </div>
                                    </div>

                                    <div class="usrtop">
                                        <div class="row">
                                            <div class="col-2">
                                            <div class="userthumb"><a class="userbx"><img src="/uploads/images/user2.jpg"/></a>
                                            </div>
                                            </div>
                                            <div class="col-10 nopad pt-2">
                                            <a>Teena Bill Grason</a> 
                                            </div>
                                        </div>
                                    </div>
                                    
                                  </div>
                    
                                        
                                
                                
                                <div class="main-container createnew">
                                    <h3>Create Event</h3>
                                    <div class="userthumb">
                                    <span class="userbx">
                                    <img src="http://localhost:3001/uploads/user/1619775993779Desert.jpg"/></span>
                                    <span>Ollie Allan</span>
                                    </div>
                                    <form>
                                    <div class="form-group"><label class="form-label" for="formTeamTitle">Event Name</label>
                                    <input name="title" placeholder="" type="text" id="formTeamTitle" class="form-control" value=""/></div>
                                
                                    <div class="row">
                                    <div class="form-group col-6"><label class="form-label" for="formTeamTitle">Start Date</label>
                                    <input name="title" placeholder="" type="text" id="formTeamTitle" class="form-control" value=""/></div>
                                    <div class="form-group col-6"><label class="form-label" for="formTeamTitle">End Date</label>
                                    <input name="title" placeholder="" type="text" id="formTeamTitle" class="form-control" value=""/></div>
                                    </div>
                                     <div class="row">
                                    <div class="form-group col-6"><label class="form-label" for="formTeamTitle">Start Time</label>
                                    <input name="title" placeholder="" type="text" id="formTeamTitle" class="form-control" value=""/></div>
                                    <div class="form-group col-6"><label class="form-label" for="formTeamTitle">End Time</label>
                                    <input name="title" placeholder="" type="text" id="formTeamTitle" class="form-control" value=""/></div>
                                    </div>
                                    <div class="form-group"><label class="form-label" for="formTeamDescription">Description</label><textarea rows="3" id="formTeamDescription" class="form-control"></textarea>
                                    </div>
                                    <div class="form-group">
                                    <label class="form-label" for="formTeamAddress">Location</label>
                                    <div class="search-location-input">
                                    <input placeholder="Type Address" type="text" id="formTeamAddress" class="form-control pac-target-input" value="" autocomplete="off"/>
                                    </div>
                                    </div>
                                    <div class="form-group">
                                    <label class="form-label" for="formTeamActivityType">Activity Type</label>
                                    <select id="formTeamActivityType" class="form-control">
                                    <option value="Running">Running</option>
                                    <option value="Weight Lifting">Weight Lifting</option>
                                    <option value="Swimming">Swimming</option>
                                    </select>
                                    </div>
                                     
                                    <div class="form-group"><a class="button subbtn">Create Event</a></div></form></div>
                                        
                                    <p className='text-center small'>- - - Trending Section Starts - - -</p>
                                    
                                <div class="trending"><div class="container"><div class="row"><div id="list" class="section"><div class="item"><span class="trntop"><img src="/uploads/images/user1.jpg"/></span><div class="authname"><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div><span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span><span class="pstover f14">Not being able to travel is one of the worst things that can happen to some people. However, being stuck at home, or simply in one part of the world,</span><img src="/uploads/images/ex-img1.jpg"/></div><div class="item"><span class="trntop"><img src="/uploads/images/user1.jpg"/></span><div class="authname"><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div><span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span><img src="/uploads/images/ex-img4.jpg"/></div><div class="item"><span class="trntop"><img src="/uploads/images/user1.jpg"/></span><div class="authname"><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div><span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span><img src="/uploads/images/ex-img3.jpg"/></div><div class="item"><span class="trntop"><img src="/uploads/images/user1.jpg"/></span><div class="authname"><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div><span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span><img src="/uploads/images/ex-img2.jpg"/></div><div class="item"><span class="trntop"><img src="/uploads/images/user1.jpg"/></span><div class="authname"><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div><span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span><p class="pstxt f14"><a href="#">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</a></p></div><div class="item"><span class="trntop"><img src="/uploads/images/user1.jpg"/></span><div class="authname"><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div><span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span><img src="/uploads/images/ex-img3.jpg"/></div><div class="item"><span class="trntop"><img src="/uploads/images/user1.jpg"/></span><div class="authname"><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div><span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span><img src="/uploads/images/ex-img1.jpg"/></div><div class="item"><span class="trntop"><img src="/uploads/images/user1.jpg"/></span><div class="authname"><a>Teena Bill Grason</a> <span class="small pstim">12 min ago</span></div><span class="acttyp pushright"><img src="/uploads/images/run.svg"/></span><img src="/uploads/images/ex-img2.jpg"/></div></div></div></div></div>
                                
                                    <p className='text-center small'>- - - Trending Section Ends - - -</p>
                                            
            </div> 
            
        )
    }
}

export default TeamAdmin
