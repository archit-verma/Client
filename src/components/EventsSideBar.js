/**
 * =====================================
 * REACT COMPONENT CLASS
 * =====================================
 * @date created: 18 October 2019
 * @authors: Jay Parikh, Waqas Rehmani
 *
 * This file defines the EventsSideBar component. The class EventsSideBar
 * is where the component is defined.
 *
 * This is a component defined for reusability.
 *
 * This component shows a list of events that is usually seen at the sidebar.
 *
 */

import React, {Component} from 'react'
import {withRouter} from "react-router-dom";

// Importing pictures to be used for interest type
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
};

class EventsSideBar extends Component {
    // Links to the Event page when an event is selected
    goToEvent = (eventId) => {
        this.props.history.push('/events/' + eventId)
    };
    // Render method for EventsSideBar
    render() {
        return (
            <div className='events-container'>
                <h1>
                    {this.props.title}
                </h1>

                <div className='events-list-container'>
                    {
                        this.props.events.length === 0

                            ?
                            <div className='events-list-no-events'>
                                There are no current events.
                            </div>

                            :
                            <div>
                                {
                                    this.props.events.map(event => (
                                        <div
                                            key={event.eventId}
                                            onClick={() => this.goToEvent(event.eventId)}
                                            className='events-list-item'
                                        >
                                            <h4>
                                                {event.name}
                                            </h4>

                                            <div>
                                                <span>
                                                    <small>
                                                        {
                                                            new Date(Date.parse(event.time)).getDate() +
                                                            '/' +
                                                            new Date(Date.parse(event.time)).getMonth() +
                                                            '/' +
                                                            new Date(Date.parse(event.time)).getFullYear()
                                                        }
                                                    </small>
                                                </span>
                                                <span>
                                                    <strong>
                                                        {
                                                            new Date(Date.parse(event.time)).getHours() +
                                                            ':' +
                                                            new Date(Date.parse(event.time)).getMinutes()
                                                        }
                                                    </strong>
                                                </span>
                                                <span>
                                                    <img width={15} height={15} src={pictureHelper[event.eventType]} title={event.eventType} alt="" />
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                    }
                </div>
            </div>
        )
    }
}

export default withRouter(EventsSideBar)