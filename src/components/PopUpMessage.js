/**
 * =====================================
 * REACT COMPONENT CLASS
 * =====================================
 * @date created: 2 September 2019
 * @authors: Waqas Rehmani
 *
 * This file defines the PopUpMessage component. The class PopUpMessage
 * is where the component is defined.
 *
 * This is a component defined for reusability.
 *
 * This component shows a popup message that can be seen throughout the app
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { closePopup } from '../actions';

class PopUpMessage extends Component {
    // Reroutes the app accordingly when button is clicked.
    handleClick = () => {
        if (this.props.popupRedirect !== 'none') {
            this.props.history.push(this.props.popupRedirect);
            window.location.reload();
        }
        this.props.closePopup();
    };

    // Render method for Popup messages
    render() {
        // Displays the popup iff the prop 'popupVisible' is true
        if (this.props.popupVisible) {
            return (
                <div className={'popup-message-container-top'}>
                    <div
                        className={'backdrop'}
                        onClick={this.props.closePopup}
                    />

                    <div className={'popup-message-container'}>
                        <p>{this.props.popupMessage}</p>
                        <button
                            onClick={this.handleClick}
                            className='button-red'
                        >
                            {this.props.buttonMessage}
                        </button>
                    </div>
                </div>
            );
        } else {
            return <div />;
        }
    }
}

const mapStateToProps = (state) => {
    return {
        popupVisible: state.popup.visible,
        buttonMessage: state.popup.button,
        popupMessage: state.popup.message,
        popupRedirect: state.popup.redirect,
    };
};

export default withRouter(
    connect(mapStateToProps, { closePopup })(PopUpMessage)
);
