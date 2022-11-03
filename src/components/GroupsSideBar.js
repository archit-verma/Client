/**
 * =====================================
 * REACT COMPONENT CLASS
 * =====================================
 * @date created: 19 October 2019
 * @authors: Jay Parikh, Waqas Rehmani
 *
 * This file defines the GroupsSideBar component. The class GroupsSideBar
 * is where the component is defined.
 *
 * This is a component defined for reusability.
 *
 * This component shows a list of groups that is usually seen at the sidebar.
 *
 */

// Importing libraries for setup
import React, { Component } from 'react'
import { withRouter } from "react-router-dom";


// Importing icons and pictures
import profileBlank from '../assets/profile_blank.png'
import Badminton from "../assets/Badminton.svg";
import Cycling from "../assets/Cycling.svg";
import Football from "../assets/Football.svg";
import Gym from "../assets/Gym.svg";
import Running from "../assets/Running.svg";
import Swimming from "../assets/Swimming.svg";
import Tennis from "../assets/Tennis.svg";
import Walking from "../assets/Walking.svg";
import Yoga from "../assets/Yoga.svg";
// Initializing pictures to be used for interest type
const pictureHelper = {
    Badminton: Badminton,
    Cycling: Cycling,
    Gym: Gym,
    Football: Football,
    Running: Running,
    Swimming: Swimming,
    Tennis: Tennis,
    Walking: Walking,
    Yoga: Yoga,
}

class GroupsSideBar extends Component {

    // Links to the Group page when a group is selected
    goToGroup = (groupId) => {
        this.props.history.push('/group/' + groupId)
    }

    render() {
        return (
            <div className='events-container'>
                <h1>
                    {this.props.title}
                </h1>
                {
                    this.props.groups.length === 0

                        ?
                        <div className='events-list-no-events'>
                            There are no groups in this list.
                        </div>

                        :

                        <div className='events-list-container'>
                            {
                                this.props.groups.map(group => (
                                    <div
                                        key={group.groupId}
                                        onClick={() => this.goToGroup(group.groupId)}
                                        className='groups-list-item'
                                    >

                                        <img id='groups-list-item-icon'
                                             src={group.coverPhoto === '' ? profileBlank : group.coverPhoto}
                                             title={group.title + "'s picture"} alt="" />
                                        <div>
                                            <h4>
                                                {group.title}
                                            </h4>


                                            <span>
                                                <label>{group.membersCount} Members</label>
                                                -
                                                <img style={{width: '15px', height: '15px'}}
                                                     src={pictureHelper[group.interest]} title={group.interest} alt="" />
                                            </span>
                                        </div>


                                    </div>
                                ))
                            }

                        </div>
                }
            </div>
        )
    }
}

export default withRouter(GroupsSideBar)