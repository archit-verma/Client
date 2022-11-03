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

// Importing icons and pictures
import home1 from '../assets/home2.jpg';
import home2 from '../assets/home1.jpg';
import home3 from '../assets/home3.jpg';

class WhatsNew extends Component {
    // Render method for WhatsNew
    render() {
        return (
            <div className='whats-new-container'>
                <a href='https://www.garmin.com' target='_blank' rel='noopener noreferrer'>More about Garmin</a>
                <img src={home1} alt="" />
                <div></div>
                <img src={home2} alt="" />
                <div></div>
                <img src={home3} alt="" />

            </div>
        )
    }
}

export default WhatsNew
