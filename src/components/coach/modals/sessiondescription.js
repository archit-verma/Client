import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hideSessionDescription } from '../../../actions';
// Importing helper functions
import * as API from '../../../utils/api.js'
import Modal from 'react-bootstrap/Modal';
import renderHTML from 'react-render-html';

//import Multiselect from 'multiselect-dropdown-react';
class SessionDescription extends Component {
    constructor(props) {
        super(props);
      
        this.state = {
            exerciseDetail: {
                exercise_title: '',
               
            }
        }
    }

    componentDidMount = async () => {
        API.getComponents().then(components => {
            this.setState({
                components: components,
            });
        })
    }

    handleClose() {
        this.props.hideSessionDescription();
    }

    render() {
        return (
            <Modal
                centered
                size="md"
                show={true}
                onHide={this.handleClose.bind(this)}
                dialogClassName="planner-dialog" className='customize-excersice'>
                    <Modal.Header closeButton>
                        <Modal.Title>Session Description</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                  
                   {renderHTML(this.props.SessionDescriptionDetail)}
                    </Modal.Body>
                    <Modal.Footer className="buttons-save">
                    </Modal.Footer>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        SessionDescriptionDetail: state.planner.sessionDescription
    };
};

export default connect(mapStateToProps, { hideSessionDescription })(SessionDescription);