import React, { Component } from 'react';
import { connect } from 'react-redux';
// Importing helper functions
import * as API from '../../../utils/api.js'
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import {hideViewExercise,ShowEditExercise} from '../../../actions';
class viewExercise extends Component {
    constructor(props) {
        super(props);
        this.state = {
            exerciseDetail: {
                exercise_title: '',
                exercise_type: '',
                ex_description: '',
                ex_tips: '',
                ex_img_one: '',
                ex_img_two: '',
                ex_img_three: '',
                video_link: '',
                exercise_components: '',
                strength: '',
                exercise_id:'',


            },
            form_state:'',
            components: [],
            bodystrength: [],
        }
        // this.handleSubmit = this.handleSubmit.bind(this);
        // this.handltype = this.handltype.bind(this);
        // this.onexDesChange = this.onexDesChange.bind(this);
        // this.onexTypeChange = this.onexTypeChange.bind(this);
        // this.handlexComponentsChange = this.handlexComponentsChange.bind(this);
        // this.setformstate = this.setformstate.bind(this);
    }

    componentDidMount = async () => {
        let exerciseId = this.props.exercise_id;
        API.getExerciseById(exerciseId).then(exercisedata => {
            this.setState({ exerciseDetail: { ...this.state.exerciseDetail, exercise_title: exercisedata.title } });
            this.setState({ exerciseDetail: { ...this.state.exerciseDetail, exercise_type: exercisedata.type } });
            this.setState({ exerciseDetail: { ...this.state.exerciseDetail, ex_description: exercisedata.description } });
            this.setState({ exerciseDetail: { ...this.state.exerciseDetail, ex_tips: exercisedata.tips } });
            this.setState({ exerciseDetail: { ...this.state.exerciseDetail, strength: exercisedata.strength } });
            this.setState({ exerciseDetail: { ...this.state.exerciseDetail, ex_img_one: exercisedata.pic1 } });
            this.setState({ exerciseDetail: { ...this.state.exerciseDetail, ex_img_two: exercisedata.pic2 } });
            this.setState({ exerciseDetail: { ...this.state.exerciseDetail, ex_img_three: exercisedata.pic3 } });
            this.setState({ exerciseDetail: { ...this.state.exerciseDetail, video_link: exercisedata.video } });
            this.setState({ exerciseDetail: { ...this.state.exerciseDetail, exercise_id: exerciseId } });
            //this.setState({ exerciseDetail: { ...this.state.exerciseDetail, exercise_components: exercisedata.components}});
        })
        
    } 
    handleClose() {
        this.props.hideViewExercise();
    }
    editExercise = (id) => {
        this.props.ShowEditExercise(id);
        this.handleClose();
	}
    render() {
        var settings = {
            infinite: true,
            speed: 500,
            slidesToShow: 4,
            slidesToScroll: 1,

        };
        return (
            <Modal
                centered
                size="lg"
                show={true}
                onHide={this.handleClose.bind(this)}
                dialogClassName="planner-dialog modal-exercise-info" className='customize-excersice '>
                <Form onSubmit={this.handleSubmit}>
                    <Modal.Header closeButton>
        <Modal.Title>{this.state.exerciseDetail.exercise_title}</Modal.Title>
                <div className="pnt-delte-btn">
                    <a href="javascript:;" onClick={() => window.print()} className="prnt-btn">Print</a>
                    <a href="javascript:;" data-dismiss="modal" className="del-btn" onClick={() => this.editExercise(this.state.exerciseDetail.exercise_id)} >Edit</a>                    
                </div>                        
                    </Modal.Header>
                    <Modal.Body >
                    <div className="row ">
                        <div className="col-xs-12 col-sm-6 mobile-order-second">
                            <div className="row exImages-section-left ">
                               {this.state.exerciseDetail.ex_img_one ?<div className="col-sm-6"><div className="exc-pic-pop br-all-top"><img className="img-fluid"  src={API.getServerUrl().apiURL+'/uploads/exercise/' + this.state.exerciseDetail.ex_img_one} /></div></div>:null }    
                               {this.state.exerciseDetail.ex_img_two ?<div className="col-sm-6"><div className="exc-pic-pop br-all-top"><img className="img-fluid"  src={API.getServerUrl().apiURL+'/uploads/exercise/' + this.state.exerciseDetail.ex_img_two} /></div></div>:null }    
                               {this.state.exerciseDetail.ex_img_three ?<div className="col-sm-6"><div className="exc-pic-pop br-all-top"><img className="img-fluid"  src={API.getServerUrl().apiURL+'/uploads/exercise/' + this.state.exerciseDetail.ex_img_three} /></div></div>:null }    
                                
                            </div>    
                        </div>
                        <div className="col-xs-12 col-sm-6 mobile-order-first">
                            <div className="video-wrapper">
                                <div className="embed-responsive embed-responsive embed-responsive-16by9">
                                
                                {this.state.exerciseDetail.video_link? <iframe width="560" class="embed-responsive-item add-ajax-video" height="315" src={this.state.exerciseDetail.video_link} frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen=""></iframe>:null}
                                </div>
                            </div>
                            <div className="ex-descptin-bdy">
                               
                                <h3>Description</h3>
                                <p className="ex-desc-ajax">
                                    {this.state.exerciseDetail.ex_description} 
                                    </p>
                                    <h3>Tips</h3>
                                    <p className="ex-desc-ajax">
                                    {this.state.exerciseDetail.ex_tips}
                                    </p>                                    

                            </div>
                        </div>
                    </div>
                    </Modal.Body>


                </Form>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        updateSearchState: state.planner.updateSeachExercise,
        exercise_id: state.planner.modalsParams.id
    };
};

export default connect(mapStateToProps, {ShowEditExercise, hideViewExercise })(viewExercise);