/**
 * =====================================
 * REACT COMPONENT CLASS
 * =====================================
 * @date created: 20 October 2019
 * @authors: Waqas Rehmani
 *
 * This file defines the PictureViewer component. The class PictureViewer
 * is where the component is defined.
 *
 * This is a component defined for reusability.
 *
 * This component enlarges a larger picture that is in the app.
 *
 */

// Importing libraries for setup
import React, {Component} from 'react';

// Importing icons and pictures
import {MdClose} from "react-icons/md";

class PictureViewer extends Component {
    render() {

        if (this.props.visible) {
            return (

                <div className='picture-viewer'>
                    <div className='backdrop' onClick={this.props.closePictureViewer}/>

                    <span>
                        <img src={this.props.image} alt="" />
                        <MdClose onClick={this.props.closePictureViewer}/>
                    </span>


                </div>
            )
        } else {
            return (
                <div/>
            )
        }
    }

}

export default PictureViewer