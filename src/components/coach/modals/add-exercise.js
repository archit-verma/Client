import React, { Component } from 'react';
import { connect } from 'react-redux';
import { hideAddExercise } from '../../../actions';
// Importing helper functions
import * as API from '../../../utils/api.js'
import Modal from 'react-bootstrap/Modal';
import { Image } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import SimpleReactValidator from 'simple-react-validator';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner'
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CKEditor from 'ckeditor4-react';
import Select from 'react-select';
//import Multiselect from 'multiselect-dropdown-react';
class AddExercise extends Component {
    constructor(props) {
        super(props);
        this.validator = new SimpleReactValidator();
        this.state = {
            exerciseDetail: {
                exercise_title: '',
                exercise_type: 'flexibility',
                ex_description: '',
                ex_tips: '',
                ex_img_one: '',
                ex_img_two: '',
                ex_img_three: '',
                video_link: '',
                exercise_components:'',
                strength: '',
                addedBy: '',
				clubId: props.club._id,

            },
            components: [],
            bodystrength: [],
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handltype = this.handltype.bind(this);
        this.onexDesChange = this.onexDesChange.bind(this);
        this.onexTypeChange = this.onexTypeChange.bind(this);
        this.handlexComponentsChange = this.handlexComponentsChange.bind(this);
    }

    componentDidMount = async () => {
        API.getComponents().then(components => {
            this.setState({
                components: components,
            });
        })
        API.getbodystrength().then(bodystrength => {
            this.setState({
                bodystrength: bodystrength,
            });
        })
//        this.setState({ exerciseDetail: { ...this.state.exerciseDetail, clubId: this.props.club._id } });
        //this.setState({ exerciseDetail: { ...this.state.exerciseDetail, addedBy: this.props.user.userId } });

    }

    handleClose() {
        this.props.hideAddExercise();
    }
    handltype(e) {
    
        this.setState({ exerciseDetail: { ...this.state.exerciseDetail, [e.target.name]: e.target.value } });
    }
    onexDesChange(evt) {
  
        this.setState({ exerciseDetail: { ...this.state.exerciseDetail, ex_description: evt.editor.getData() } });
    }
    onexTypeChange(evt) {
        this.setState({ exerciseDetail: { ...this.state.exerciseDetail, ex_tips: evt.editor.getData() } });
 
    }
    handlexComponentsChange(e) {
        this.setState({ exerciseDetail: { ...this.state.exerciseDetail, exercise_components:e} });

    }


    handleSubmit(event) {
        event.preventDefault();

        if (this.validator.allValid() && this.state.valid_form === true) {
            this.setState({ loading: true })
            let data = this.state.exerciseDetail;
            API.AddExercise(data).then(exerice => {
                if (exerice.id) {
                    this.setState({
                        success_m: 'Exercise  added successfully.',
                        alert_cls: 'alert-success',
                        loading: false

                    })
                    this.setState({
                        exerciseDetail: {
                            ...this.state.exerciseDetail, 'exercise_title': ''

                        },
                    });

                    setTimeout(() => {
                        this.setState({
                            success_m: '',
                            alert_cls: '',
                        });
                        this.handleClose();
                    }, 5000);

                } else {
                    this.setState({
                        success_m: 'Something went wrong.',
                        alert_cls: 'alert-danger',
                        loading: false

                    })
                }
            })

        } else {
            this.validator.showMessages();

            this.forceUpdate();
        }
    }
    validateTitle = (e) => {
        let title = this.state.exerciseDetail.exercise_title;
        if (title.length !== 0) {
            API.checkTitle(title).then(exerciseTitle => {
                if (exerciseTitle._id) {
                    this.setState({
                        success_m: 'Exercise title already exist.',
                        alert_cls: 'alert-danger',
                        valid_form: false
                    })
                } else {
                    this.setState({
                        success_m: '',
                        alert_cls: '',
                        valid_form: true
                    })
                }
            })
        }
    }
    handleSelectedImage = async event => {
        const eximg1 = event.target.files[0]
        const Imagedata = new FormData();
        Imagedata.append('eximg1', eximg1)
        API.ImageUpload(Imagedata)
            .then(ing => {
                this.setState({ exerciseDetail: { ...this.state.exerciseDetail, ex_img_one: ing.filename } });
            })
    }
    handleSelectedImage2 = async event => {
        const eximg1 = event.target.files[0]
        if (eximg1 !== '') {
            const Imagedata = new FormData();
            Imagedata.append('eximg2', eximg1)
            API.ImageUploadtwo(Imagedata)
                .then(ing => {
                    this.setState({ exerciseDetail: { ...this.state.exerciseDetail, ex_img_two: ing.filename } });
                })

        }
    }
    handleSelectedImage3 = async event => {
        const eximg1 = event.target.files[0]
        const Imagedata = new FormData();
        Imagedata.append('eximg3', eximg1)
        API.ImageUploadthree(Imagedata)
            .then(ing => {
                this.setState({ exerciseDetail: { ...this.state.exerciseDetail, ex_img_three: ing.filename } });
            })
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
                dialogClassName="planner-dialog" className='customize-excersice'
            >
                <Form onSubmit={this.handleSubmit}>
                    <Modal.Header closeButton>
                        <Modal.Title>Create Exercise</Modal.Title>
                    </Modal.Header>
                    <Modal.Body >
                    {this.state.success_m && <div className={this.state.alert_cls + " alert"}>{this.state.success_m}</div>}
                        <Form.Row className='child-fixed-width'>
                            <Form.Group as={Col} controlId="formBasicEmail">
                                <Form.Label>Exercise Title</Form.Label>
                                <Form.Control type="text" name='exercise_title' placeholder="Enter Title" onChange={this.handltype} onBlur={this.validateTitle} value={this.state.exerciseDetail.exercise_title} />
                                {this.validator.message('Exercise Title', this.state.exerciseDetail.exercise_title, 'required')}
                            </ Form.Group>
                            <Form.Group className="exbx col" controlId="addProgramAthleteLevel">
                            <Form.Label className="extyp">Type:</Form.Label>
                            <Form.Check inline label="Exercise" type={'radio'} id='exercise_type' onChange={this.handltype} name='exercise_type' value='exercise' />
                            <Form.Check inline label="Flexibility" type={'radio'} id='flexibility_type' onChange={this.handltype} name='exercise_type' value='flexibility' checked />
                            {this.validator.message('Exercise Type', this.state.exerciseDetail.exercise_type, 'required')}
                        </Form.Group>
                        </Form.Row>
                        <Form.Row>
                        <Form.Group as={Col} controlId="formBasicEmail" className='custom-selectbox'>
                                <Form.Label>Exercise Components</Form.Label>
            
                                <Select
                                isMulti
                                    //value={selectedOption}
                                    onChange={this.handlexComponentsChange}
                                    options={this.state.components}
                                />
                            </Form.Group>
                        </Form.Row>
                        <Form.Row>

                            <div className='form-group col'>
                                <Form.Label>Description</Form.Label>
                                <CKEditor
                                    onChange={this.onexDesChange}
                                    config={{
                                        toolbar: [
                                            { name: 'paragraph', items: ['Paragraph', 'Bold', 'Italic', 'Link', 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
                                        ]
                                    }}
                                />
                                {this.validator.message('Exercise Description', this.state.exerciseDetail.ex_description, 'required')}
                                {/* <textarea className="form-control" name='ex_description' onChange={this.handltype} rows="6"></textarea>
                                {this.validator.message('Exercise Description', this.state.exerciseDetail.ex_description, 'required')} */}
                            </div>
                            <div className='form-group col'>
                                <Form.Label>Tips</Form.Label>
                                {/* <textarea className="form-control" name='ex_tips' onChange={this.handltype} rows="6"></textarea>*/}

                                <CKEditor
                                    onChange={this.onexTypeChange}
                                    config={{
                                        toolbar: [
                                            { name: 'paragraph', items: ['Paragraph', 'Bold', 'Italic', 'Link', 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
                                        ]
                                    }}
                                />
                                {this.validator.message('Exercise Tips', this.state.exerciseDetail.ex_tips, 'required')}
                            </div>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="picture1">
                                <Form.Label>Picture 1</Form.Label>

                                <Form.Control type="file" name='ex_img_one' onChange={this.handleSelectedImage} />
                                {this.validator.message('Image', this.state.exerciseDetail.ex_img_one, 'required')}
                            </Form.Group>
                            <Form.Group as={Col} controlId="picture2">
                                <Form.Label>Picture 2</Form.Label>
                                <Form.Control type="file" name='ex_img_two' onChange={this.handleSelectedImage2} />

                            </Form.Group>
                        </Form.Row>
                        <Form.Row>
                            <Form.Group as={Col} controlId="picture3">
                                <Form.Label>Picture 3</Form.Label>
                                <Form.Control type="file" name='ex_img_three' onChange={this.handleSelectedImage3} />

                            </Form.Group>
                            <Form.Group as={Col} controlId="videolink">
                                <Form.Label>Video Link</Form.Label>
                                <Form.Control className="vidbx" type="text" name='video_link' onChange={this.handltype} />
                                <div className="custm-tooltip">
                                    <p class="lgt-gry vimeo-yotbe">Vimeo or Youtube Videos only
                                    <span class="tooltiptext"><p><span class="yb">Youtube</span></p><ul> <li> On a computer, go to the YouTube video you want to embed.</li>
                                            <li>Under the video, click SHARE option</li>
                                            <li>The pop up that opens up, click on Embed option</li>
                                            <li>Then another pop up opens up with Embed Video source code on Right side, copy the link from there after source src
                                            </li><li>And then paste that in add exercise section.</li>
                                        </ul>
                                            <p><span class="yb">Vimeo</span></p>
                                            <ul>
                                                <li>Go to the Vimeo website.</li>
                                                <li>Navigate to the video you wish to embed.</li>
                                                <li>Click the Share button in the top right corner of your video.</li>
                                                <li>A pop-up will appear with the embed link information. You will need to copy the embed link in order to add it to your page in the Employer Center.</li>
                                            </ul>
                                        </span>
                                    </p>
                                </div>

                            </Form.Group>
                        </Form.Row>
                        <div className="carousel slide">
                            <div class="form-group-mbt">
                                <label for="ex_video">Strength To Body</label>
                            </div>
                            <Slider {...settings} className='carousel-inner sliderable-content radio-button-image'>
                                {this.state.bodystrength.map(bodystrength => (
                                    <div className='item-slide'>
                                        <Form.Label>
                                            <input type="radio" name='strength' onChange={this.handltype} value={bodystrength._id} />
                                            <span class="sl-img"><Image src={bodystrength.icon} className="img-fluid" /></span>
                                        </Form.Label>
                                    </div>

                                ))}
                            </Slider>
                        </div>

                    </Modal.Body>
                    <Modal.Footer className="buttons-save">
                        <Button type='submit' variant="coaching-mate save-btn" style={{ display: this.state.loading ? 'none' : 'block' }} >Save</Button><Spinner animation="grow" style={{ display: this.state.loading ? 'block' : 'none' }} />
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {



        
        AddExercise: state.planner.modals.AddExercise
    };
};

export default connect(mapStateToProps, { hideAddExercise })(AddExercise);