import React, { Component } from 'react';
import { connect } from 'react-redux';
import { SelectedProgramId, hideProgram } from '../../../actions';
// Importing helper functions
import * as API from '../../../utils/api.js'
import Modal from 'react-bootstrap/Modal';
//import Button from 'react-bootstrap/Button';
//import Spinner from 'react-bootstrap/Spinner'
//import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
//import CKEditor from 'ckeditor4-react';
//import Select from 'react-select';
//import Multiselect from 'multiselect-dropdown-react';
class LoadPrograms extends Component {
    constructor(props) {
        super(props);
        // this.validator = new SimpleReactValidator();
        this.state = {
            programs: [],
            selectedvalue: '',
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handltype = this.handltype.bind(this);
    }


    componentDidMount = async () => {
        API.getPrograms().then(res => {
            this.setState({ programs: res });

        })

    }

    handleClose() {
        this.props.hideProgram();
    }
    handltype(e) {
        this.setState({ selectedvalue: e.target.value });
    }



    handleSubmit() {
        // console.log(this.state.selectedvalue);
        this.props.SelectedProgramId(this.state.selectedvalue);
        if (this.state.programs !== '') {
            this.handleClose();
        }




    }




    render() {
        return (
            <Modal
                centered
                size="lg"
                show={true}
                onHide={this.handleClose.bind(this)}
                dialogClassName="planner-dialog" className='customize-excersice'
            >
                <Modal.Header closeButton>
                    <Modal.Title>Create Program</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <select onChange={this.handltype}>
                        <option value="">Select Program</option>
                        {this.state.programs.map(program => (
                            <option key={'load-program-right-'+program._id} value={program._id}>{program.title}</option>

                        ))}
                    </select>
                </Modal.Body>
                <Modal.Footer>
                    <div className="create-planner-btn">
                        <input type="button" id="btnLoadProgram" name="" onClick={this.handleSubmit} value="Load This Program" />
                    </div>
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {

    };
};

export default connect(mapStateToProps, { hideProgram, SelectedProgramId })(LoadPrograms);