import React, { Component } from 'react';
import '../../styles/custom-style.css';
import Accordion from 'react-bootstrap/Accordion'
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import * as API from '../../utils/api.js'
import { Image } from 'react-bootstrap';
export default class StrengthRightsidebar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ssDetail: {
                ss_title: '',
                exercise_type: '',
                ss_and: '',
            },
            strengthBody: [],
            ex_results: []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handltype = this.handltype.bind(this);
    }
    componentDidMount = async () => {
        API.getbodystrength().then(strengthBody => {
            this.setState({
                strengthBody: strengthBody,
            });
        })
    }
    handltype(e) {
        this.setState({ ssDetail: { ...this.state.ssDetail, [e.target.name]: e.target.value } });
    }
    handleSubmit(event) {
        event.preventDefault();
        let data = this.state.ssDetail;
        API.searchExercise(data).then(ex_results => {
            this.setState({
                ex_results: ex_results,
            });
        })

    }
    render() {
       // console.log(this.state.ex_results);
        return (

            <div id="sidebar-wrapper-right" className="strength-session-sidebar">
                <div className="strenth-sessn-excerze">
                    <h3 className="hdng-ssc">
                        Strength Session Exercises</h3>
                    <div className="scroll-panes">
                        <ul id="activemodules" className="ui-sortable custom-list-options">
                            <li>ffdd</li>
                        </ul>
                    </div>
                </div>
                <div className="sidebar-container">
                    <div className="head-section">
                        <a href="#menu-toggle" className="menu-toggle-right" id="">
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </a>
                        <span className="search-labled">Find</span>
                        <a href="javascript:;" className="refresh-icon" title="Refresh Programs and Sessions"> Reset</a>
                    </div>
                    <div className="cm-sidebar-contents">
                        <div className="panel-group" id="cm-accordion" role="tablist" aria-multiselectable="true">
                            <div className="panel panel-default current">
                                <Form onSubmit={this.handleSubmit}>
                                    <Accordion>
                                        <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                    Basic Search</Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>
                                                    <Form.Group controlId="addProgramAthleteLevel">
                                                        <Form.Check inline label="Flexibility" type={'radio'} id='flexibility_type' name='exercise_type' value='flexibility' onChange={this.handltype} />
                                                        <Form.Check inline label="Exercise" type={'radio'} id='exercise_type' name='exercise_type' value='exercise' onChange={this.handltype} />
                                                    </Form.Group>
                                                    <Form.Row>
                                                        <Form.Group controlId="formBasicEmail">
                                                            <Form.Control type="text" placeholder="By Title" name='ss_title' onChange={this.handltype} />
                                                        </Form.Group>
                                                    </Form.Row>
                                                    <Form.Row>
                                                        <Form.Group as={Col} controlId="program_phase">

                                                            <Form.Control as="select" onChange={this.handltype} >
                                                                <option value="">Strength to body</option>
                                                                {this.state.strengthBody.map(strengthBody => (
                                                                    <option value={strengthBody._id}>{strengthBody.title}</option>
                                                                ))}
                                                            </Form.Control>

                                                        </Form.Group>
                                                    </Form.Row>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                        <Card>
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                    Exercise Components </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="1">
                                                <Card.Body>
                                                    <Form.Group controlId="addProgramAthleteLevel">
                                                        <Form.Check inline label="And" type={'radio'} id='ex_and' onChange={this.handltype} name='ss_and' value='and' onChange={this.handltype} />
                                                        <Form.Check inline label="Or" type={'radio'} id='ex_or' onChange={this.handltype} name='ss_and' value='or' onChange={this.handltype} />
                                                    </Form.Group>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>
                                    <input type="submit" name="submit" value="Save Session" />
                                </Form>

                                <ul class="panel benefitList list-group">
                                    {
                                        this.state.ex_results.map(ex_result => (

                                            <li>
                                                {ex_result.title}
                                                <Image src={ex_result.pic1} style={{ width: '5%' }} />


                                            </li>

                                        ))
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
