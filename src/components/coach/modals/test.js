//Budgerigar
import React, { Component } from 'react';
import {connect} from 'react-redux';
import {hideAddSession, loadAddSessionData, createSession, closeAlert, updateSession,updateSeachSession} from '../../../actions';
import {sessionImageUpload} from '../../../utils/api.js';
import {getSessionIcons} from '../../../utils/api.js';
//link zy
import {linkFamilyName} from '../../../utils/api.js'

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import {Image} from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';

import CKEditor from 'ckeditor4-react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

import loading from "../../../assets/loading.svg";

class AddSession extends Component {
    constructor(props){
        super(props);
        this.state = {
            session: {
                _id: '',
                title: 'Workout Builder',
                distance: 0,
                unit: 'km',
                hours: 0,
                minutes: 0,
                sessTime: 0,
                rpe: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                rpeLoad: 0,
                videos: [],
                familyName: '',
                athleteLevel: [],
                description: '',
                keywords: [],
                image: '',
                activityType: '',
                sportsKeywords: [],
                components: [],
                sessionType: 'normal',
                addedBy: props.user.userId,
                clubId: props.club._id
            },
            rpeEffort: 1,
            rpeHours: 0,
            rpeMinutes: 0,
            rpeTotalHours: 0,
            rpeTotalMinutes: 0,
            rpeTotalTime: 0,
            familyName: '',
            keyword: '',
            loading: true,

            //Budgerigar
            editTitle: false,
            athleteLevelOptionList:['Elite','Advanced','Intermediate/Advanced','Intermediate','Low/Intermediate','Novice'],
            icons:[],
            linkNameDiv:{display : 'none'},
            linkFamilyNameList:[]
        }

        this.uploadImageRef = React.createRef();

        this.handleClose = this.handleClose.bind(this);
        this.addSession = this.addSession.bind(this);
        this.saveAsNew = this.saveAsNew.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.handleDistanceUnit = this.handleDistanceUnit.bind(this);
        this.handleDistance = this.handleDistance.bind(this);
        this.handleTotalHours = this.handleTotalHours.bind(this);
        this.handleTotalMinutes = this.handleTotalMinutes.bind(this);
        this.handleRpeEffort = this.handleRpeEffort.bind(this);
        this.handleRpeHours = this.handleRpeHours.bind(this);
        this.handleRpeMinutes = this.handleRpeMinutes.bind(this);
        this.addRpeTime = this.addRpeTime.bind(this);
        this.addVideo = this.addVideo.bind(this);
        this.handleFamilyName = this.handleFamilyName.bind(this);
        //like wxh
        this.handleLikeFamilyName = this.handleLikeFamilyName.bind(this);
        this.handleVideoText = this.handleVideoText.bind(this);
        this.removeVideo = this.removeVideo.bind(this);
        this.handleTitle = this.handleTitle.bind(this);
        this.handleAthleteLevel = this.handleAthleteLevel.bind(this);
        this.handleDescription = this.handleDescription.bind(this);
        this.handleKeyword = this.handleKeyword.bind(this);
        this.addKeyword = this.addKeyword.bind(this);
        this.removeKeyword = this.removeKeyword.bind(this);
        this.deleteKeyword = this.deleteKeyword.bind(this);
        this.uploadImage = this.uploadImage.bind(this);
        this.removeImage = this.removeImage.bind(this);
        this.handleSessionActivity = this.handleSessionActivity.bind(this);
        this.handleSessionSports = this.handleSessionSports.bind(this);
        this.handleSessionComponent = this.handleSessionComponent.bind(this);

        //Budgerigar
        this.editWorkoutTitle = this.editWorkoutTitle.bind(this);
        this.editWorkoutTitleDone = this.editWorkoutTitleDone.bind(this);
    }

    componentDidMount(){
        if(this.props.sessionId !== null){
            this.props.loadAddSessionData(this.props.sessionId, this.props.club._id);
        }
        else{
            this.props.loadAddSessionData('add', this.props.club._id);
        }

        //Budgerigar icons
        getSessionIcons().then(icons => {
                this.setState({icons: icons});
                console.log(icons);
            }
        );
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        if(nextProps.addSession && nextProps.alertMessage){
            this.clearForm();
        }
        else if(nextProps.addSession && nextProps.error){
            this.setState({loading: false});
        }
        else if(nextProps.addSession && nextProps.session){
            let session = nextProps.session;
            let familyName = '', familyNameObj = '';
            if(session.familyName){
                familyName = session.familyName._id;
                familyNameObj = session.familyName;
            }

            let newRpe = session.perceivedEfforts;
            let mintTotal = 0;
            for(let i=1; i<=10; i++){
                mintTotal = mintTotal + newRpe[i-1];
            }
            let rpeTotalHours = Math.floor(mintTotal / 60);
            let rpeTotalMinutes = mintTotal % 60;

            this.setState({
                session: {
                    _id: session._id,
                    title: session.title,
                    distance: session.distance.$numberDecimal,
                    unit: session.unit,
                    hours: session.hours,
                    minutes: session.minutes,
                    sessTime: session.sessTime,
                    rpe: session.perceivedEfforts,
                    rpeLoad: session.rpeLoad,
                    videos: session.videos,
                    familyName: familyNameObj,
                    athleteLevel: session.athleteLevel,
                    description: session.description,
                    keywords: session.keywords,
                    image: session.image,
                    activityType: session.activityType._id,
                    sportsKeywords: session.sportsKeywords,
                    components: session.components,
                    sessionType: session.sessionType,
                },
                familyName: familyName,
                rpeTotalHours,
                rpeTotalMinutes,
                rpeTotalTime: mintTotal,
                loading: false
            });
        }
        else if(nextProps.addSession && nextProps.sessionActivityTypes){
            this.setState({loading: false});
        }
    }

    clearForm(){
        this.setState({session: {
                _id: '',
                title: '',
                distance: 0,
                unit: 'km',
                hours: 0,
                minutes: 0,
                sessTime: 0,
                rpe: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
                rpeLoad: 0,
                videos: [],
                familyName: '',
                athleteLevel: [],
                description: '',
                keywords: [],
                image: '',
                activityType: '',
                sportsKeywords: [],
                components: [],
                sessionType: 'normal'
            },
            rpeEffort: 1,
            rpeHours: 0,
            rpeMinutes: 0,
            rpeTotalHours: 0,
            rpeTotalMinutes: 0,
            rpeTotalTime: 0,
            familyName: '',
            keyword: '',
            loading: false,
        });
    }

    handleClose(){
        this.props.hideAddSession();
    }

    handleDistanceUnit(e){
        this.setState({session: { ...this.state.session, unit: e.target.value} });
    }

    handleDistance(e){
        this.setState({session: { ...this.state.session, distance: e.target.value} });
    }

    handleTotalHours(e){
        let hours = parseInt(e.target.value);
        let sessTime = (hours * 60) + this.state.session.minutes;

        this.setState({session: { ...this.state.session, hours, sessTime } });
    }

    handleTotalMinutes(e){
        let minutes = parseInt(e.target.value);
        let sessTime = (this.state.session.hours * 60) + minutes;
        this.setState({session: { ...this.state.session, minutes, sessTime } });
    }

    handleRpeEffort(e){
        this.setState({rpeEffort: parseInt(e.target.value)});
    }

    handleRpeHours(e){
        this.setState({rpeHours: parseInt(e.target.value)});
    }

    handleRpeMinutes(e){
        this.setState({rpeMinutes: parseInt(e.target.value)});
    }

    addRpeTime(e){
        let newRpe = [...this.state.session.rpe];
        newRpe[this.state.rpeEffort-1] = (this.state.rpeHours * 60) + this.state.rpeMinutes;
        let rpeLoad = 0, mintTotal = 0;
        for(let i=1; i<=10; i++){
            mintTotal = mintTotal + newRpe[i-1];
            rpeLoad = rpeLoad + (newRpe[i-1] * i);
        }

        if(mintTotal <= this.state.session.sessTime){
            let rpeTotalHours = Math.floor(mintTotal / 60);
            let rpeTotalMinutes = mintTotal % 60;
            this.setState({rpeTotalHours, rpeTotalMinutes, rpeTotalTime: mintTotal, session: { ...this.state.session, rpe: newRpe, rpeLoad} });
        }
        else{
            alert('RPE total duration can not be greater than session duration');
        }
    }

    addVideo(e){
        e.preventDefault();
        let videos = [...this.state.session.videos];
        videos.push('');
        this.setState({session: { ...this.state.session, videos} });
    }

    handleVideoText(e){
        let videos = [...this.state.session.videos];
        videos[e.target.name] = e.target.value;
        this.setState({session: { ...this.state.session, videos} });
    }

    removeVideo(e){
        e.preventDefault();
        let videos = [...this.state.session.videos];
        videos.splice(e.target.name, 1);
        this.setState({session: { ...this.state.session, videos} });
    }

    handleFamilyName(e){
        if(e.target.value === '')
            this.setState({familyName: '', session: { ...this.state.session, familyName: ''} });
        else{
            let familyName = {_id: e.target.value, name: e.target.options[e.target.options.selectedIndex].text};
            this.setState({familyName: e.target.value, session: { ...this.state.session, familyName} });
        }
    }
    // like wxh
    handleLikeFamilyName(e){

        this.setState({
            familyName: e.target.value
        });

        if(e.target.value === ''){
            this.setState({
                linkNameDiv: {display:'none'},
                linkFamilyNameList: []
            });
        }else{
            linkFamilyName(e.target.value).then(linkFamilyNameList => {
                    if(linkFamilyNameList.length > 0){
                        this.setState({
                            linkNameDiv: {display:'block'},
                            linkFamilyNameList: linkFamilyNameList
                        });
                        console.log(this.state.linkFamilyNameList);
                    }else{
                        this.setState({
                            linkNameDiv: {display:'none'}
                        });
                    }
                }
            );
        }
    }

    // like wxh
    handleClickFamilyName = (familyName) =>{
        if(familyName === ''){
            this.setState({
                linkNameDiv:{display : 'none'}
            });
        }else{
            this.setState({
                linkNameDiv:{display : 'none'},
                familyName: familyName
            });
        }
    }


    handleTitle(e){
        this.setState({session: { ...this.state.session, title: e.target.value} });
    }

    handleAthleteLevel(e){
        let athleteLevel = [...this.state.session.athleteLevel];
        if(e.target.checked)
            athleteLevel.push(e.target.name);
        else{
            let index = athleteLevel.indexOf(e.target.name);
            if(index !== -1)
                athleteLevel.splice(index, 1);
        }

        this.setState({session: { ...this.state.session, athleteLevel} });
    }

    handleDescription(e){
        //this.setState({session: { ...this.state.session, description: e.target.value} });
        this.setState({session: { ...this.state.session, description: e.editor.getData()} });
    }

    handleKeyword(e){
        this.setState({keyword: e.target.value});
    }

    addKeyword(e){
        if((e.keyCode === 13 || e.keyCode === 188) && this.state.keyword && this.state.keyword !== ',' && this.state.session.keywords.indexOf(e.target.value) === -1){
            let keywords = [...this.state.session.keywords];
            if(e.keyCode === 188)
                keywords.push(this.state.keyword.substr(0, this.state.keyword.length-1));
            else
                keywords.push(this.state.keyword);
            this.setState({keyword: '', session: { ...this.state.session, keywords } });
        }
        else if(e.keyCode === 188 && this.state.keyword === ','){
            this.setState({keyword: ''});
        }
    }

    removeKeyword(e){
        if(e.keyCode === 8 && this.state.keyword === ''){
            let keywords = [...this.state.session.keywords];
            keywords.pop();
            this.setState({session: { ...this.state.session, keywords } });
        }
    }

    deleteKeyword(ind, e){
        e.preventDefault();
        let keywords = [...this.state.session.keywords];
        keywords.splice(ind, 1);
        this.setState({session: { ...this.state.session, keywords } });
    }

    uploadImage(e){
        let sessImage = this.uploadImageRef.current.files[0];
        let fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        if(sessImage === undefined){
            alert('Please select image file to upload');
        }
        else if(fileTypes.indexOf(sessImage.type) === -1){
            alert('Please select file type of JPEG, JPG, PNG or GIF');
        }
        else{
            const Imagedata = new FormData();
            Imagedata.append('sessImage', sessImage);
            sessionImageUpload(Imagedata)
                .then(imgUpload => {
                    //alert();
                    this.setState({session: { ...this.state.session, image: imgUpload.filename } });
                });
        }
    }

    removeImage(){
        this.setState({session: { ...this.state.session, image: '' } });
    }

    //Budgerigar Activity Type
    handleSessionActivity(e){
        this.setState({session: { ...this.state.session, activityType: e.target.value} });
    }

    //Budgerigar SportsKeywords
    handleSessionSports(e){
        let sportsKeywords = [...this.state.session.sportsKeywords];

        if(e.target.checked)
            sportsKeywords.push(e.target.value);
        if (e.target.value == "groupName"){
            this.state.sportsKeywords = [];
        }
        else{
            let index = sportsKeywords.indexOf(e.target.value);
            if(index !== -1)
                sportsKeywords.splice(index, 1);
        }

        this.setState({session: { ...this.state.session, sportsKeywords} });
    }

    handleSessionComponent(e){
        let components = [...this.state.session.components];
        if(e.target.checked)
            components.push(e.target.value);
        else{
            let index = components.indexOf(e.target.value);
            if(index !== -1)
                components.splice(index, 1);
        }

        this.setState({session: { ...this.state.session, components} });
    }

    addSession(){
        if(this.state.session.title === ''){
            alert('Enter session title');
            return;
        }
        else if(this.state.session.athleteLevel.length === 0){
            alert('Select session athlete level');
            return;
        }
        else if(this.state.session.description === ''){
            alert('Enter session description');
            return;
        }
        else if(this.state.session.keywords.length === 0){
            alert('Enter session keywords');
            return;
        }
        else if(this.state.session.sessTime !== this.state.rpeTotalTime){
            alert('Total Duration and RPE total duration are different');
            return;
        }
        else if(this.state.session.activityType === ''){
            alert('Select session activity type');
            return;
        }

        let session = {...this.state.session};
        this.setState({loading: true});
        if(this.props.sessionId != null){
            this.props.updateSession(session);
            this.props.updateSeachSession(true);
        }else{
            delete session._id;
            this.props.createSession(session);
        }
    }

    saveAsNew(){
        if(this.state.session.title === ''){
            alert('Enter session title');
            return;
        }
        else if(this.state.session.athleteLevel.length === 0){
            alert('Select session athlete level');
            return;
        }
        else if(this.state.session.description === ''){
            alert('Enter session description');
            return;
        }
        else if(this.state.session.keywords.length === 0){
            alert('Enter session keywords');
            return;
        }
        else if(this.state.session.sessTime !== this.state.rpeTotalTime){
            alert('Total Duration and RPE total duration are different');
            return;
        }
        else if(this.state.session.activityType === ''){
            alert('Select session activity type');
            return;
        }

        let session = {...this.state.session};
        delete session._id;

        this.setState({loading: true});
        this.props.createSession(session);

    }

    closeAlert(){
        this.props.closeAlert();
    }

    //Budgerigar
    editWorkoutTitle()
    {
        this.setState({editTitle: true});
    }

    editWorkoutTitleDone()
    {
        if (this.state.session.title == ""){
            this.setState({session: { ...this.state.session, title: "Workout Builder"} });
        }
        this.setState({editTitle: false});
    }

    render(){
        if(this.state.loading){
            return (
                <Modal
                    centered
                    size="lg"
                    show={true}
                    onHide={this.handleClose}
                    dialogClassName="modal-70w planner-dialog adsesn adsesnWindow">
                    <Modal.Header closeButton>
                        <Modal.Title>{this.props.sessionId != null ? 'Edit' : 'Add'} Session</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='modal-container-loading'>
                            <img src={loading} alt="" />
                        </div>
                    </Modal.Body>
                </Modal>
            );
        }

        let durationHours = [], durationMinutes = [], rpeHours = [], rpeMinutes = [], keywordsList = [], sportsGroup = '', sportsList = [], alertMessage = '';
        for (let i = 0; i <= 24; i++) {
            durationHours.push(<option key={'addSessionHours'+i} value={i}>{i}</option>);
        }
        for (let i = 0; i <= 59; i++) {
            durationMinutes.push(<option key={'addSessionMinutes'+i} value={i}>{i}</option>);
        }

        for (let i = 0; i <= 24; i++) {
            rpeHours.push(<option key={'addSessionHours'+i} value={i}>{i}</option>);
        }
        for (let i = 0; i <= 59; i++) {
            rpeMinutes.push(<option key={'addSessionMinutes'+i} value={i}>{i}</option>);
        }

        for (let i = 0; i < this.state.session.keywords.length; i++) {
            keywordsList.push(<li key={'session-keyword-'+i} className="session-keyword">{this.state.session.keywords[i]}<a href="delete-keyword" className="session-keyword-delete" onClick={(e) => this.deleteKeyword(i, e)}><span className="text-icon"><i class="fa fa-times" aria-hidden="true"></i>
			</span></a></li>);
        }

        //Budgerigar SportsKeywords
        this.props.sessionSportsKeywords.forEach((item, ind) => {
            if(item.group !== '' && sportsGroup !== item.group){
                sportsList.push(<option key={'sports-keyword-group-'+item._id} value="groupName"> —— {item.group} —— </option>);
                sportsGroup = item.group;
            }

            sportsList.push(<option key={'sports-keyword-'+item._id} value={item._id}>{item.title}</option>);
        });

        // this.props.sessionSportsKeywords.forEach((item, ind) => {
        // 	if(item.group !== '' && sportsGroup !== item.group){
        // 		sportsList.push(<h3 key={'sports-keyword-group-'+item._id}>{item.group}</h3>);
        // 		sportsGroup = item.group;
        // 	}
        // 	sportsList.push(<Form.Label key={'sports-keyword-'+item._id} className="myCheckbox"><input name="sports" type="checkbox" value={item._id} onChange={this.handleSessionSports} defaultChecked={this.state.session.sportsKeywords.indexOf(item._id) !== -1 ? true : false} /> <span>{item.title}</span></Form.Label>);
        // });


        let rpe_txt_arr = [];
        let rpe_val_arr = [];
        let rpe_title_arr = ['Very Very Easy', 'Easy', 'Moderate', 'Some What Hard', 'Hard', '6/10', 'Very Hard', '8/10', '9/10', 'Maximal'];
        let rpe_color_arr = ['#00ffff', '#00ff00', '#ffff00', '#ff9933', '#ff6633', '#ff3333', '#cc3333', '#663399', '#330066', '#000000'];
        this.state.session.rpe.forEach((item, ind) => {
            rpe_txt_arr.push(rpe_title_arr[ind]);
            rpe_val_arr.push({y: parseInt(item), color: rpe_color_arr[ind]});
        });

        const options = {
            credits: {enabled: false},
            chart: {type: 'column'},
            title: {text: 'Rating Perceived Effort'},
            subtitle: {text: ''},
            xAxis: {categories: rpe_txt_arr, crosshair: true},
            yAxis: {min: 0, title: {text: 'Min(s)'}},
            tooltip: {
                headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
                pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
                    '<td style="padding:0"><b>{point.y} min(s)</b></td></tr>',
                footerFormat: '</table>',
                shared: true,
                useHTML: true
            },
            plotOptions: {column: {pointPadding: 0.2, borderWidth: 0}},
            series: [{
                name: 'Rating Perceived Effort',
                data: rpe_val_arr,
            }]
        }

        if(this.props.alertMessage){
            alertMessage = <Alert variant="success" dismissible onClose={this.closeAlert}>{this.props.alertMessage}</Alert>;
        }
        if(this.props.error){
            alertMessage = <Alert variant="danger" dismissible onClose={this.closeAlert}>{this.props.error}</Alert>;
        }

        return(
            <Modal
                centered
                size="lg"
                show={true}
                onHide={this.handleClose}
                dialogClassName="modal-70w planner-dialog adsesn adsesnWindow">
                <Modal.Header closeButton>
                    <Modal.Title>{this.props.sessionId != null ? 'Edit' : 'Add'} Session</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        {alertMessage}
                        <Row>
                            <div className="workoutPlanName">
                                <Form.Control required disabled={!this.state.editTitle} type="text" id={'workoutTitle'} className="sessionNameInput" value={this.state.session.title} onChange={this.handleTitle}/>
                                {/*<span className={this.state.editTitle ? "titleEditNone" : "titleEdit"} onClick={this.editWorkoutTitle}> Edit </span>*/}
                                {/*<span className={this.state.editTitle ? "titleEdit" : "titleEditNone"} onClick={this.editWorkoutTitleDone}> Done </span>*/}
                                <Image className={this.state.editTitle ? "titleEditNone" : "titleEdit"} onClick={this.editWorkoutTitle} src={this.state.icons[0]}/>
                                <Image className={this.state.editTitle ? "titleEdit" : "titleEditNone"} onClick={this.editWorkoutTitleDone} src={this.state.icons[1]}/>
                            </div>
                            <Col md={3} className="sesatr leftTopBlock" id={'attrForm'}>
                                <div style={{background: "white", paddingRight: "0px"}}>
                                    <Form.Row>

                                        <Form.Group as={Col} controlId="addSessionFamilyName">
                                            <Form.Label>Family Name</Form.Label>
                                            <Form.Control className="attrInput" as="input" value={this.state.familyName} onChange={this.handleLikeFamilyName}>
                                            </Form.Control>
                                        </Form.Group>
                                        <div style={this.state.linkNameDiv} className="linkDivCss">
                                            <ul className="linkUlCss">
                                                {
                                                    this.state.linkFamilyNameList.map((item,index)=>{
                                                        return <li className={this.state.linkLiCss} onClick={this.handleClickFamilyName.bind(this,item)}>{item}</li>
                                                    })
                                                }
                                            </ul>
                                        </div>

                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} controlId="addSessionActivityTypes">
                                            <Form.Label>Activity Type</Form.Label>
                                            <Form.Control className="attrInput" as="select" value={this.state.activityType} onChange={this.handleSessionActivity}>
                                                <option value="">Select Activity Type</option>
                                                {this.props.sessionActivityTypes.map(sessionActivityType => (
                                                    <option>
                                                        {sessionActivityType.title}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} controlId="addSessionAthleteLevel">
                                            <Form.Label>Athlete Level</Form.Label>
                                            <Form.Control className="attrInput" as="select" value={this.state.athleteLevel} onChange={this.handleAthleteLevel}>
                                                <option value="">Select Athlete Level</option>
                                                {this.state.athleteLevelOptionList.map(function(levels) {
                                                    return <option>{levels}</option>
                                                })}
                                            </Form.Control>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} controlId="addSessionSportsKeywords">
                                            <Form.Label>Sports Keywords</Form.Label>
                                            <Form.Control className="attrInput" as="select" value={this.state.sportsKeywords} onChange={this.handleSessionSports}>
                                                <option value="">Select Sports Keywords</option>
                                                {sportsList}
                                            </Form.Control>
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Row>
                                        <Form.Group as={Col} controlId="addSessionComponent">
                                            <Form.Label>Components</Form.Label>
                                            <Form.Control className="attrInput" as="select" value={this.state.components} onChange={this.handleSessionComponent}>
                                                <option value="">Select Activity Type</option>
                                                {this.props.sessionComponents.map(sessionComponent => (
                                                    <option>
                                                        {sessionComponent.title}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                        </Form.Group>
                                    </Form.Row>
                                </div>
                            </Col>












                            {/*<Col md={3} className="sesatr">*/}
                            {/*	<div>*/}
                            {/*		<Form.Label>Time And Distance</Form.Label>*/}
                            {/*		<hr />*/}
                            {/*		<Form.Group controlId="addSessionUnit">*/}
                            {/*			<Form.Check inline label="Km" type={'radio'} id={'addSessionUnitKm'} name={'addSessionUnit'} value={'km'} checked={this.state.session.unit === 'km' ? true : false} onChange={this.handleDistanceUnit} />*/}
                            {/*			<Form.Check inline label="Miles" type={'radio'} id={'addSessionUnitMiles'} name={'addSessionUnit'} value={'miles'} checked={this.state.session.unit === 'miles' ? true : false} onChange={this.handleDistanceUnit} />*/}
                            {/*		</Form.Group>*/}
                            {/*		<Form.Group controlId="addSessionDistance">*/}
                            {/*			<Form.Label>Distance</Form.Label>*/}
                            {/*			<Form.Control required type="text" value={this.state.session.distance} onChange={this.handleDistance} />*/}
                            {/*		</Form.Group>*/}
                            {/*		<Form.Label>Total Duration</Form.Label>*/}
                            {/*		<p className="small txtred">Note: Distribute minutes first prior to hours</p>*/}
                            {/*		<Form.Row>*/}
                            {/*			<Form.Group as={Col} controlId="addSessionHours">*/}
                            {/*				<Form.Label>HH</Form.Label>*/}
                            {/*				<Form.Control as="select" value={this.state.session.hours} onChange={this.handleTotalHours}>*/}
                            {/*					{durationHours}*/}
                            {/*				</Form.Control>*/}
                            {/*			</Form.Group>*/}
                            {/*			<Form.Group as={Col} controlId="addSessionMinutes">*/}
                            {/*				<Form.Label>MM</Form.Label>*/}
                            {/*				<Form.Control as="select" value={this.state.session.minutes} onChange={this.handleTotalMinutes}>*/}
                            {/*					{durationMinutes}*/}
                            {/*				</Form.Control>*/}
                            {/*			</Form.Group>*/}
                            {/*		</Form.Row>*/}
                            {/*		<Form.Group controlId="addSessionRpeEffort">*/}
                            {/*			<Form.Label>Rating Of Perceived Effort (RPE)</Form.Label>*/}
                            {/*			<Form.Control as="select" value={this.state.rpeEffort} onChange={this.handleRpeEffort}>*/}
                            {/*				<option value="1">Very Very Easy</option>*/}
                            {/*				<option value="2">Easy</option>*/}
                            {/*				<option value="3">Moderate</option>*/}
                            {/*				<option value="4">Some What Hard</option>*/}
                            {/*				<option value="5">Hard</option>*/}
                            {/*				<option value="6">6/10</option>*/}
                            {/*				<option value="7">Very Hard</option>*/}
                            {/*				<option value="8">8/10</option>*/}
                            {/*				<option value="9">9/10</option>*/}
                            {/*				<option value="10">Maximal</option>*/}
                            {/*			</Form.Control>*/}
                            {/*		</Form.Group>*/}
                            {/*		<Form.Row>*/}
                            {/*			<Form.Group as={Col} controlId="addSessionRpeHours">*/}
                            {/*				<Form.Label>HH</Form.Label>*/}
                            {/*				<Form.Control as="select" value={this.state.rpeHours} onChange={this.handleRpeHours}>*/}
                            {/*					{rpeHours}*/}
                            {/*				</Form.Control>*/}
                            {/*			</Form.Group>*/}
                            {/*			<Form.Group as={Col} controlId="addSessionRpeMinutes">*/}
                            {/*				<Form.Label>MM</Form.Label>*/}
                            {/*				<Form.Control as="select" value={this.state.rpeMinutes} onChange={this.handleRpeMinutes}>*/}
                            {/*					{rpeMinutes}*/}
                            {/*				</Form.Control>*/}
                            {/*			</Form.Group>*/}
                            {/*		</Form.Row>*/}
                            {/*		<Form.Row><Button variant="coaching-mate" className="btn-sm adjbtn" onClick={this.addRpeTime}>Add Time</Button></Form.Row>*/}
                            {/*		<Form.Row>*/}
                            {/*			<div className="hour-counter">*/}
                            {/*				<h3 className="text-center green-text">{this.state.rpeTotalHours} hour {this.state.rpeTotalMinutes} min</h3>*/}
                            {/*				<div className="hour-strip">*/}
                            {/*					<div className="strip-clr">*/}
                            {/*						<div id="rpe-maximal-time" className="maximal-time" style={{width:parseInt(100 * (this.state.session.rpe[9] / this.state.session.sessTime))+'%', background:'#000000'}} title={this.state.session.rpe[9]+" mins"}></div>*/}
                            {/*						<div id="rpe-harder-time" className="harder-time" style={{width:parseInt(100 * (this.state.session.rpe[8] / this.state.session.sessTime))+'%', background:'#330066'}} title={this.state.session.rpe[8]+" mins"}></div>*/}
                            {/*						<div id="rpe-very-hard-time" className="very-hard-time" style={{width:parseInt(100 * (this.state.session.rpe[7] / this.state.session.sessTime))+'%', background:'#663399'}} title={this.state.session.rpe[7]+" mins"}></div>*/}
                            {/*						<div id="rpe-hard-time" className="hard-time" style={{width:parseInt(100 * (this.state.session.rpe[6] / this.state.session.sessTime))+'%', background:'#cc3333'}} title={this.state.session.rpe[6]+" mins"}></div>*/}
                            {/*						<div id="rpe-some-hard-time" className="some-hard-time" style={{width:parseInt(100 * (this.state.session.rpe[5] / this.state.session.sessTime))+'%', background:'#ff3333'}} title={this.state.session.rpe[5]+" mins"}></div>*/}
                            {/*						<div id="rpe-moderate-time" className="moderate-time" style={{width:parseInt(100 * (this.state.session.rpe[4] / this.state.session.sessTime))+'%', background:'#ff6633'}} title={this.state.session.rpe[4]+" min"}></div>*/}
                            {/*						<div id="rpe-easy-time" className="easy-time" style={{width:parseInt(100 * (this.state.session.rpe[3] / this.state.session.sessTime))+'%', background:'#ff9933'}} title={this.state.session.rpe[3]+" min"}></div>*/}
                            {/*						<div id="rpe-easier-time" className="easier-time" style={{width:parseInt(100 * (this.state.session.rpe[2] / this.state.session.sessTime))+'%', background:'#ffff00'}} title={this.state.session.rpe[2]+" min"}></div>*/}
                            {/*						<div id="rpe-very-easy-time" className="very-easy-time" style={{width:parseInt(100 * (this.state.session.rpe[1] / this.state.session.sessTime))+'%', background:'#00ff00'}} title={this.state.session.rpe[1]+" mins"}></div>*/}
                            {/*						<div id="rpe-very-very-easy-time" className="very-very-easy-time" style={{width:parseInt(100 * (this.state.session.rpe[0] / this.state.session.sessTime))+'%', background:'#00ffff'}} title={this.state.session.rpe[0]+" mins"}></div>*/}
                            {/*					</div>*/}
                            {/*				</div>*/}
                            {/*			</div>*/}
                            {/*		</Form.Row>*/}
                            {/*		<Form.Row>*/}
                            {/*			<div className="load-results text-center">*/}
                            {/*				<h2>Load: <span>{this.state.session.rpeLoad}</span></h2>*/}
                            {/*			</div>*/}
                            {/*		</Form.Row>*/}
                            {/*		<Form.Row>*/}
                            {/*			<div className="add-video-links text-center">*/}
                            {/*				<br />*/}
                            {/*				<label>Add/Edit Video Links <i className="fa fa-info-circle" title="Youtube enter video url, Vimeo enter video id"></i></label>*/}
                            {/*				<div className="sess-videos">*/}
                            {/*					{this.state.session.videos.map((video, ind) => (*/}
                            {/*						<div key={"sess-video"+ind} className="sess-video"><input type="text" className="sess-video-links " name={ind} value={video} onChange={this.handleVideoText} /> <a href="remove-video" className="remove-sess-video" name={ind} onClick={this.removeVideo}>X</a></div>*/}
                            {/*					))}*/}
                            {/*				</div>*/}
                            {/*				<a href="add-video" className="add-sess-video-btn  btn-coaching-mate btn-sm" onClick={this.addVideo}>Add More</a>*/}
                            {/*			</div>*/}
                            {/*		</Form.Row>*/}
                            {/*	</div>*/}
                            {/*</Col>*/}
                            <Col md={6}>
                                <div>
                                    <Form.Row>
                                        <Form.Group as={Col} controlId="addSessionTitle">
                                            <Form.Label>Session Title</Form.Label>
                                            <Form.Control required type="text" value={this.state.session.title} onChange={this.handleTitle} />
                                        </Form.Group>
                                    </Form.Row>
                                    <Form.Group controlId="addSessionDescription">
                                        <Form.Label>Description</Form.Label>
                                        <CKEditor
                                            onChange={this.handleDescription}
                                            data={this.state.session.description}
                                            config={{
                                                toolbar: [
                                                    { name: 'paragraph', items: ['Paragraph', 'Bold', 'Italic', 'Link', 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
                                                ]
                                            }}
                                        />
                                        {/*<Form.Control required as="textarea" value={this.state.session.description} onChange={this.handleDescription} />*/}
                                    </Form.Group>
                                    <Form.Group controlId="addSessionKeywords">
                                        <Form.Label>Keywords</Form.Label>
                                        <ul className="add-session-keywords">
                                            {keywordsList}
                                            <li className="keyword-new"><Form.Control type="text" value={this.state.keyword} onChange={this.handleKeyword} onKeyUp={this.addKeyword} onKeyDown={this.removeKeyword} /></li>
                                        </ul>
                                    </Form.Group>
                                    <HighchartsReact
                                        highcharts={Highcharts}
                                        options={options}
                                        containerProps={{className: 'add-session-chart-cont'}}
                                    />
                                </div>
                            </Col>
                            <Col md={3}>
                                <div>
                                    <Form.Group controlId="addSessionImage">
                                        <Form.Label>Upload Image</Form.Label>
                                        <Form.Control type="file" ref={this.uploadImageRef} />
                                    </Form.Group>
                                    <Form.Row>
                                        <Form.Group controlId="addSessionImageUpload">
                                            <Button variant="coaching-mate" className="btn-sm commenstyle" onClick={this.uploadImage}>Upload</Button>
                                        </Form.Group>
                                        <Form.Group controlId="addSessionImageRemove">
                                            <Button variant="coaching-mate btn-sm commenstyle" onClick={this.removeImage}>Remove</Button>
                                        </Form.Group>
                                    </Form.Row>
                                    {this.state.session.image && <Form.Row><img src={'http://localhost:3001/uploads/session/'+this.state.session.image} style={{width: '100%', marginBottom: '15px'}} alt="" /></Form.Row>}
                                    <Form.Label>Activity & Components</Form.Label>
                                    <Accordion defaultActiveKey="0">
                                        <Card className="keyopt">
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="0">
                                                    Activity Type
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="0">
                                                <Card.Body>
                                                    <div className="radio-buttons">
                                                        {this.props.sessionActivityTypes.map(sessionActivityType => (
                                                            <div key={"session-activity-"+sessionActivityType.value}>
                                                                <input id={"session-activity-"+sessionActivityType.value} name="activity" type="radio" value={sessionActivityType._id} onChange={this.handleSessionActivity} defaultChecked={this.state.session.activityType === sessionActivityType._id ? true : false} />
                                                                <Form.Label htmlFor={"session-activity-"+sessionActivityType.value}>
                                                                    <Image className="lazy loaded img-fluid width20" src={"/uploads/images/"+sessionActivityType.imgUrl} /> {sessionActivityType.title}
                                                                </Form.Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                        <Card className="keyopt">
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="1">
                                                    Sport Keywords
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="1">
                                                <Card.Body>
                                                    <div className="sports-buttons rightopt">
                                                        {sportsList}
                                                    </div>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                        <Card className="keyopt">
                                            <Card.Header>
                                                <Accordion.Toggle as={Button} variant="link" eventKey="2">
                                                    Components
                                                </Accordion.Toggle>
                                            </Card.Header>
                                            <Accordion.Collapse eventKey="2">
                                                <Card.Body>
                                                    <div className="component-buttons rightopt">
                                                        {this.props.sessionComponents.map(sessionComponent => (
                                                            <div key={"session-component-"+sessionComponent._id}>
                                                                <Form.Label className="myCheckbox">
                                                                    <input name="component" type="checkbox" value={sessionComponent._id} onChange={this.handleSessionComponent} defaultChecked={this.state.session.components.indexOf(sessionComponent._id) !== -1 ? true : false} /> <span>{sessionComponent.title}</span>
                                                                </Form.Label>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </Card.Body>
                                            </Accordion.Collapse>
                                        </Card>
                                    </Accordion>



                                    <div id="keywords_cloud" style={{display: 'none'}}>
                                        <h3>Keywords</h3>
                                        <a href="#" role="button" className="tag-cloud-link tag-link-0 tag-link-position-1">asdad</a>
                                        <a href="#" role="button" className="tag-cloud-link tag-link-1 tag-link-position-2" >dasda</a>
                                        <a href="#" role="button" className="tag-cloud-link tag-link-2 tag-link-position-3"  > 1.15min/100m</a>
                                        <a href="#" role="button" className="tag-cloud-link tag-link-3 tag-link-position-4" > 1.15min/100m.</a>
                                        <a href="#" role="button" className="tag-cloud-link tag-link-4 tag-link-position-5"  > 1.20min 1.40mn</a>
                                        <a href="#" role="button" className="tag-cloud-link tag-link-5 tag-link-position-6"  >1.25/100m</a>
                                        <a href="#" role="button" className="tag-cloud-link tag-link-6 tag-link-position-7"  > 1.25/100m</a>
                                        <a href="#" role="button" className="tag-cloud-link tag-link-7 tag-link-position-8" > 1.30 - 1.45min</a>
                                        <a href="#" role="button" className="tag-cloud-link tag-link-8 tag-link-position-9"  > 1.30-1.45min</a>
                                        <a href="#" role="button" className="tag-cloud-link tag-link-9 tag-link-position-10"  > 1.30min/100m</a>
                                        <a href="#" role="button" className="tag-cloud-link tag-link-10 tag-link-position-11"  > 1.30min/100m.</a>
                                        <a href="#" role="button" className="tag-cloud-link tag-link-11 tag-link-position-12"  >1.40min/100m</a>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="coaching-mate" onClick={this.addSession}>{this.props.sessionId != null ? 'Update' : 'Create'}</Button>
                    {this.props.sessionId != null && <Button variant="coaching-mate" onClick={this.saveAsNew}>Save as new</Button>}
                </Modal.Footer>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        addSession: state.planner.modals.addSession,
        sessionId: state.planner.modalsParams.id,
        familyNames: state.planner.familyNames,
        sessionActivityTypes: state.planner.sessionActivityTypes,
        sessionSportsKeywords: state.planner.sessionSportsKeywords,
        sessionComponents: state.planner.sessionComponents,
        session: state.planner.session,
        alertMessage: state.planner.alertMessage,
        error: state.planner.error
    };
};

export default connect(mapStateToProps, {hideAddSession, loadAddSessionData, createSession, closeAlert, updateSession,updateSeachSession})(AddSession);





// import React, { Component } from 'react';
// import {connect} from 'react-redux';
// import {hideAddSession, loadAddSessionData, createSession, closeAlert, updateSession,updateSeachSession} from '../../../actions';
// import {sessionImageUpload} from '../../../utils/api.js';
//
// import Accordion from 'react-bootstrap/Accordion';
// import Card from 'react-bootstrap/Card';
// import {Image} from 'react-bootstrap';
// import Modal from 'react-bootstrap/Modal';
// import Form from 'react-bootstrap/Form';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Alert from 'react-bootstrap/Alert';
// import Button from 'react-bootstrap/Button';
//
// import CKEditor from 'ckeditor4-react';
// import Highcharts from 'highcharts';
// import HighchartsReact from 'highcharts-react-official';
//
// import loading from "../../../assets/loading.svg";
//
// class AddSession extends Component {
// 	constructor(props){
// 		super(props);
// 		this.state = {
// 			session: {
// 				_id: '',
// 				title: '',
// 				distance: 0,
// 				unit: 'km',
// 				hours: 0,
// 				minutes: 0,
// 				sessTime: 0,
// 				rpe: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 				rpeLoad: 0,
// 				videos: [],
// 				familyName: '',
// 				athleteLevel: [],
// 				description: '',
// 				keywords: [],
// 				image: '',
// 				activityType: '',
// 				sportsKeywords: [],
// 				components: [],
// 				sessionType: 'normal',
// 				addedBy: props.user.userId,
// 				clubId: props.club._id
// 			},
// 			rpeEffort: 1,
// 			rpeHours: 0,
// 			rpeMinutes: 0,
// 			rpeTotalHours: 0,
// 			rpeTotalMinutes: 0,
// 			rpeTotalTime: 0,
// 			familyName: '',
// 			keyword: '',
// 			loading: true
// 		}
//
// 		this.uploadImageRef = React.createRef();
//
// 		this.handleClose = this.handleClose.bind(this);
// 		this.addSession = this.addSession.bind(this);
// 		this.saveAsNew = this.saveAsNew.bind(this);
// 		this.closeAlert = this.closeAlert.bind(this);
// 		this.handleDistanceUnit = this.handleDistanceUnit.bind(this);
// 		this.handleDistance = this.handleDistance.bind(this);
// 		this.handleTotalHours = this.handleTotalHours.bind(this);
// 		this.handleTotalMinutes = this.handleTotalMinutes.bind(this);
// 		this.handleRpeEffort = this.handleRpeEffort.bind(this);
// 		this.handleRpeHours = this.handleRpeHours.bind(this);
// 		this.handleRpeMinutes = this.handleRpeMinutes.bind(this);
// 		this.addRpeTime = this.addRpeTime.bind(this);
// 		this.addVideo = this.addVideo.bind(this);
// 		this.handleFamilyName = this.handleFamilyName.bind(this);
// 		this.handleVideoText = this.handleVideoText.bind(this);
// 		this.removeVideo = this.removeVideo.bind(this);
// 		this.handleTitle = this.handleTitle.bind(this);
// 		this.handleAthleteLevel = this.handleAthleteLevel.bind(this);
// 		this.handleDescription = this.handleDescription.bind(this);
// 		this.handleKeyword = this.handleKeyword.bind(this);
// 		this.addKeyword = this.addKeyword.bind(this);
// 		this.removeKeyword = this.removeKeyword.bind(this);
// 		this.deleteKeyword = this.deleteKeyword.bind(this);
// 		this.uploadImage = this.uploadImage.bind(this);
// 		this.removeImage = this.removeImage.bind(this);
// 		this.handleSessionActivity = this.handleSessionActivity.bind(this);
// 		this.handleSessionSports = this.handleSessionSports.bind(this);
// 		this.handleSessionComponent = this.handleSessionComponent.bind(this);
// 	}
//
// 	componentDidMount(){
// 		if(this.props.sessionId !== null){
// 			this.props.loadAddSessionData(this.props.sessionId, this.props.club._id);
// 		}
// 		else{
// 			this.props.loadAddSessionData('add', this.props.club._id);
// 		}
// 	}
//
// 	UNSAFE_componentWillReceiveProps(nextProps){
// 		if(nextProps.addSession && nextProps.alertMessage){
// 			this.clearForm();
// 		}
// 		else if(nextProps.addSession && nextProps.error){
// 			this.setState({loading: false});
// 		}
// 		else if(nextProps.addSession && nextProps.session){
// 			let session = nextProps.session;
// 			let familyName = '', familyNameObj = '';
// 			if(session.familyName){
// 				familyName = session.familyName._id;
// 				familyNameObj = session.familyName;
// 			}
//
// 			let newRpe = session.perceivedEfforts;
// 			let mintTotal = 0;
// 			for(let i=1; i<=10; i++){
// 				mintTotal = mintTotal + newRpe[i-1];
// 			}
// 			let rpeTotalHours = Math.floor(mintTotal / 60);
// 			let rpeTotalMinutes = mintTotal % 60;
//
// 			this.setState({
// 				session: {
// 					_id: session._id,
// 					title: session.title,
// 					distance: session.distance.$numberDecimal,
// 					unit: session.unit,
// 					hours: session.hours,
// 					minutes: session.minutes,
// 					sessTime: session.sessTime,
// 					rpe: session.perceivedEfforts,
// 					rpeLoad: session.rpeLoad,
// 					videos: session.videos,
// 					familyName: familyNameObj,
// 					athleteLevel: session.athleteLevel,
// 					description: session.description,
// 					keywords: session.keywords,
// 					image: session.image,
// 					activityType: session.activityType._id,
// 					sportsKeywords: session.sportsKeywords,
// 					components: session.components,
// 					sessionType: session.sessionType,
// 				},
// 				familyName: familyName,
// 				rpeTotalHours,
// 				rpeTotalMinutes,
// 				rpeTotalTime: mintTotal,
// 				loading: false
// 			});
// 		}
// 		else if(nextProps.addSession && nextProps.sessionActivityTypes){
// 			this.setState({loading: false});
// 		}
// 	}
//
// 	clearForm(){
// 		this.setState({session: {
// 				_id: '',
// 				title: '',
// 				distance: 0,
// 				unit: 'km',
// 				hours: 0,
// 				minutes: 0,
// 				sessTime: 0,
// 				rpe: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
// 				rpeLoad: 0,
// 				videos: [],
// 				familyName: '',
// 				athleteLevel: [],
// 				description: '',
// 				keywords: [],
// 				image: '',
// 				activityType: '',
// 				sportsKeywords: [],
// 				components: [],
// 				sessionType: 'normal'
// 			},
// 			rpeEffort: 1,
// 			rpeHours: 0,
// 			rpeMinutes: 0,
// 			rpeTotalHours: 0,
// 			rpeTotalMinutes: 0,
// 			rpeTotalTime: 0,
// 			familyName: '',
// 			keyword: '',
// 			loading: false
// 		});
// 	}
//
// 	handleClose(){
// 		this.props.hideAddSession();
// 	}
//
// 	handleDistanceUnit(e){
// 		this.setState({session: { ...this.state.session, unit: e.target.value} });
// 	}
//
// 	handleDistance(e){
// 		this.setState({session: { ...this.state.session, distance: e.target.value} });
// 	}
//
// 	handleTotalHours(e){
// 		let hours = parseInt(e.target.value);
// 		let sessTime = (hours * 60) + this.state.session.minutes;
//
// 		this.setState({session: { ...this.state.session, hours, sessTime } });
// 	}
//
// 	handleTotalMinutes(e){
// 		let minutes = parseInt(e.target.value);
// 		let sessTime = (this.state.session.hours * 60) + minutes;
// 		this.setState({session: { ...this.state.session, minutes, sessTime } });
// 	}
//
// 	handleRpeEffort(e){
// 		this.setState({rpeEffort: parseInt(e.target.value)});
// 	}
//
// 	handleRpeHours(e){
// 		this.setState({rpeHours: parseInt(e.target.value)});
// 	}
//
// 	handleRpeMinutes(e){
// 		this.setState({rpeMinutes: parseInt(e.target.value)});
// 	}
//
// 	addRpeTime(e){
// 		let newRpe = [...this.state.session.rpe];
// 		newRpe[this.state.rpeEffort-1] = (this.state.rpeHours * 60) + this.state.rpeMinutes;
// 		let rpeLoad = 0, mintTotal = 0;
// 		for(let i=1; i<=10; i++){
// 			mintTotal = mintTotal + newRpe[i-1];
// 			rpeLoad = rpeLoad + (newRpe[i-1] * i);
// 		}
//
// 		if(mintTotal <= this.state.session.sessTime){
// 			let rpeTotalHours = Math.floor(mintTotal / 60);
// 			let rpeTotalMinutes = mintTotal % 60;
// 			this.setState({rpeTotalHours, rpeTotalMinutes, rpeTotalTime: mintTotal, session: { ...this.state.session, rpe: newRpe, rpeLoad} });
// 		}
// 		else{
// 			alert('RPE total duration can not be greater than session duration');
// 		}
// 	}
//
// 	addVideo(e){
// 		e.preventDefault();
// 		let videos = [...this.state.session.videos];
// 		videos.push('');
// 		this.setState({session: { ...this.state.session, videos} });
// 	}
//
// 	handleVideoText(e){
// 		let videos = [...this.state.session.videos];
// 		videos[e.target.name] = e.target.value;
// 		this.setState({session: { ...this.state.session, videos} });
// 	}
//
// 	removeVideo(e){
// 		e.preventDefault();
// 		let videos = [...this.state.session.videos];
// 		videos.splice(e.target.name, 1);
// 		this.setState({session: { ...this.state.session, videos} });
// 	}
//
// 	handleFamilyName(e){
// 		if(e.target.value === '')
// 			this.setState({familyName: '', session: { ...this.state.session, familyName: ''} });
// 		else{
// 			let familyName = {_id: e.target.value, name: e.target.options[e.target.options.selectedIndex].text};
// 			this.setState({familyName: e.target.value, session: { ...this.state.session, familyName} });
// 		}
// 	}
//
// 	handleTitle(e){
// 		this.setState({session: { ...this.state.session, title: e.target.value} });
// 	}
//
// 	handleAthleteLevel(e){
// 		let athleteLevel = [...this.state.session.athleteLevel];
// 		if(e.target.checked)
// 			athleteLevel.push(e.target.name);
// 		else{
// 			let index = athleteLevel.indexOf(e.target.name);
// 			if(index !== -1)
// 				athleteLevel.splice(index, 1);
// 		}
//
// 		this.setState({session: { ...this.state.session, athleteLevel} });
// 	}
//
// 	handleDescription(e){
// 		//this.setState({session: { ...this.state.session, description: e.target.value} });
// 		this.setState({session: { ...this.state.session, description: e.editor.getData()} });
// 	}
//
// 	handleKeyword(e){
// 		this.setState({keyword: e.target.value});
// 	}
//
// 	addKeyword(e){
// 		if((e.keyCode === 13 || e.keyCode === 188) && this.state.keyword && this.state.keyword !== ',' && this.state.session.keywords.indexOf(e.target.value) === -1){
// 			let keywords = [...this.state.session.keywords];
// 			if(e.keyCode === 188)
// 				keywords.push(this.state.keyword.substr(0, this.state.keyword.length-1));
// 			else
// 				keywords.push(this.state.keyword);
// 			this.setState({keyword: '', session: { ...this.state.session, keywords } });
// 		}
// 		else if(e.keyCode === 188 && this.state.keyword === ','){
// 			this.setState({keyword: ''});
// 		}
// 	}
//
// 	removeKeyword(e){
// 		if(e.keyCode === 8 && this.state.keyword === ''){
// 			let keywords = [...this.state.session.keywords];
// 			keywords.pop();
// 			this.setState({session: { ...this.state.session, keywords } });
// 		}
// 	}
//
// 	deleteKeyword(ind, e){
// 		e.preventDefault();
// 		let keywords = [...this.state.session.keywords];
// 		keywords.splice(ind, 1);
// 		this.setState({session: { ...this.state.session, keywords } });
// 	}
//
// 	uploadImage(e){
// 		let sessImage = this.uploadImageRef.current.files[0];
// 		let fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
//
// 		if(sessImage === undefined){
// 			alert('Please select image file to upload');
// 		}
// 		else if(fileTypes.indexOf(sessImage.type) === -1){
// 			alert('Please select file type of JPEG, JPG, PNG or GIF');
// 		}
// 		else{
// 			const Imagedata = new FormData();
// 			Imagedata.append('sessImage', sessImage);
// 			sessionImageUpload(Imagedata)
// 			.then(imgUpload => {
// 				//alert();
// 				this.setState({session: { ...this.state.session, image: imgUpload.filename } });
// 			});
// 		}
// 	}
//
// 	removeImage(){
// 		this.setState({session: { ...this.state.session, image: '' } });
// 	}
//
// 	handleSessionActivity(e){
// 		this.setState({session: { ...this.state.session, activityType: e.target.value} });
// 	}
//
// 	handleSessionSports(e){
// 		let sportsKeywords = [...this.state.session.sportsKeywords];
// 		if(e.target.checked)
// 			sportsKeywords.push(e.target.value);
// 		else{
// 			let index = sportsKeywords.indexOf(e.target.value);
// 			if(index !== -1)
// 				sportsKeywords.splice(index, 1);
// 		}
//
// 		this.setState({session: { ...this.state.session, sportsKeywords} });
// 	}
//
// 	handleSessionComponent(e){
// 		let components = [...this.state.session.components];
// 		if(e.target.checked)
// 			components.push(e.target.value);
// 		else{
// 			let index = components.indexOf(e.target.value);
// 			if(index !== -1)
// 				components.splice(index, 1);
// 		}
//
// 		this.setState({session: { ...this.state.session, components} });
// 	}
//
// 	addSession(){
// 		if(this.state.session.title === ''){
// 			alert('Enter session title');
// 			return;
// 		}
// 		else if(this.state.session.athleteLevel.length === 0){
// 			alert('Select session athlete level');
// 			return;
// 		}
// 		else if(this.state.session.description === ''){
// 			alert('Enter session description');
// 			return;
// 		}
// 		else if(this.state.session.keywords.length === 0){
// 			alert('Enter session keywords');
// 			return;
// 		}
// 		else if(this.state.session.sessTime !== this.state.rpeTotalTime){
// 			alert('Total Duration and RPE total duration are different');
// 			return;
// 		}
// 		else if(this.state.session.activityType === ''){
// 			alert('Select session activity type');
// 			return;
// 		}
//
// 		let session = {...this.state.session};
// 		this.setState({loading: true});
// 		if(this.props.sessionId != null){
// 			this.props.updateSession(session);
// 			this.props.updateSeachSession(true);
// 		}else{
// 			delete session._id;
// 			this.props.createSession(session);
// 		}
// 	}
//
// 	saveAsNew(){
// 		if(this.state.session.title === ''){
// 			alert('Enter session title');
// 			return;
// 		}
// 		else if(this.state.session.athleteLevel.length === 0){
// 			alert('Select session athlete level');
// 			return;
// 		}
// 		else if(this.state.session.description === ''){
// 			alert('Enter session description');
// 			return;
// 		}
// 		else if(this.state.session.keywords.length === 0){
// 			alert('Enter session keywords');
// 			return;
// 		}
// 		else if(this.state.session.sessTime !== this.state.rpeTotalTime){
// 			alert('Total Duration and RPE total duration are different');
// 			return;
// 		}
// 		else if(this.state.session.activityType === ''){
// 			alert('Select session activity type');
// 			return;
// 		}
//
// 		let session = {...this.state.session};
// 		delete session._id;
//
// 		this.setState({loading: true});
// 		this.props.createSession(session);
//
// 	}
//
// 	closeAlert(){
// 		this.props.closeAlert();
// 	}
//
// 	render(){
// 		if(this.state.loading){
// 			return (
// 				<Modal
// 					centered
// 					size="lg"
// 					show={true}
// 					onHide={this.handleClose}
// 					dialogClassName="modal-70w planner-dialog adsesn">
// 					<Modal.Header closeButton>
// 						<Modal.Title>{this.props.sessionId != null ? 'Edit' : 'Add'} Session</Modal.Title>
// 					</Modal.Header>
// 					<Modal.Body>
// 						<div className='modal-container-loading'>
// 							<img src={loading} alt="" />
// 						</div>
// 					</Modal.Body>
// 				</Modal>
// 			);
// 		}
//
// 		let durationHours = [], durationMinutes = [], rpeHours = [], rpeMinutes = [], keywordsList = [], sportsGroup = '', sportsList = [], alertMessage = '';
// 		for (let i = 0; i <= 24; i++) {
// 			durationHours.push(<option key={'addSessionHours'+i} value={i}>{i}</option>);
// 		}
// 		for (let i = 0; i <= 59; i++) {
// 			durationMinutes.push(<option key={'addSessionMinutes'+i} value={i}>{i}</option>);
// 		}
//
// 		for (let i = 0; i <= 24; i++) {
// 			rpeHours.push(<option key={'addSessionHours'+i} value={i}>{i}</option>);
// 		}
// 		for (let i = 0; i <= 59; i++) {
// 			rpeMinutes.push(<option key={'addSessionMinutes'+i} value={i}>{i}</option>);
// 		}
//
// 		for (let i = 0; i < this.state.session.keywords.length; i++) {
// 			keywordsList.push(<li key={'session-keyword-'+i} className="session-keyword">{this.state.session.keywords[i]}<a href="delete-keyword" className="session-keyword-delete" onClick={(e) => this.deleteKeyword(i, e)}><span className="text-icon"><i class="fa fa-times" aria-hidden="true"></i>
// 			</span></a></li>);
// 		}
//
// 		this.props.sessionSportsKeywords.forEach((item, ind) => {
// 			if(item.group !== '' && sportsGroup !== item.group){
// 				sportsList.push(<h3 key={'sports-keyword-group-'+item._id}>{item.group}</h3>);
// 				sportsGroup = item.group;
// 			}
// 			sportsList.push(<Form.Label key={'sports-keyword-'+item._id} className="myCheckbox"><input name="sports" type="checkbox" value={item._id} onChange={this.handleSessionSports} defaultChecked={this.state.session.sportsKeywords.indexOf(item._id) !== -1 ? true : false} /> <span>{item.title}</span></Form.Label>);
// 		});
//
// 		let rpe_txt_arr = [];
// 		let rpe_val_arr = [];
// 		let rpe_title_arr = ['Very Very Easy', 'Easy', 'Moderate', 'Some What Hard', 'Hard', '6/10', 'Very Hard', '8/10', '9/10', 'Maximal'];
// 		let rpe_color_arr = ['#00ffff', '#00ff00', '#ffff00', '#ff9933', '#ff6633', '#ff3333', '#cc3333', '#663399', '#330066', '#000000'];
// 		this.state.session.rpe.forEach((item, ind) => {
// 			rpe_txt_arr.push(rpe_title_arr[ind]);
// 			rpe_val_arr.push({y: parseInt(item), color: rpe_color_arr[ind]});
// 		});
//
// 		const options = {
// 			credits: {enabled: false},
// 			chart: {type: 'column'},
// 			title: {text: 'Rating Perceived Effort'},
// 			subtitle: {text: ''},
// 			xAxis: {categories: rpe_txt_arr, crosshair: true},
// 			yAxis: {min: 0, title: {text: 'Min(s)'}},
// 			tooltip: {
// 				headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
// 				pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
// 						'<td style="padding:0"><b>{point.y} min(s)</b></td></tr>',
// 				footerFormat: '</table>',
// 				shared: true,
// 				useHTML: true
// 			},
// 			plotOptions: {column: {pointPadding: 0.2, borderWidth: 0}},
// 			series: [{
// 				name: 'Rating Perceived Effort',
// 				data: rpe_val_arr,
// 			}]
// 		}
//
// 		if(this.props.alertMessage){
// 			alertMessage = <Alert variant="success" dismissible onClose={this.closeAlert}>{this.props.alertMessage}</Alert>;
// 		}
// 		if(this.props.error){
// 			alertMessage = <Alert variant="danger" dismissible onClose={this.closeAlert}>{this.props.error}</Alert>;
// 		}
//
// 		return(
// 			<Modal
// 				centered
// 				size="lg"
// 				show={true}
// 				onHide={this.handleClose}
// 				dialogClassName="modal-70w planner-dialog adsesn">
// 				<Modal.Header closeButton>
// 					<Modal.Title>{this.props.sessionId != null ? 'Edit' : 'Add'} Session</Modal.Title>
// 				</Modal.Header>
// 				<Modal.Body>
// 					<Form>
// 						{alertMessage}
// 						<Row>
// 							<Col md={3} className="sesatr">
// 								<div>
// 									<Form.Label>Time And Distance</Form.Label>
// 									<hr />
// 									<Form.Group controlId="addSessionUnit">
// 										<Form.Check inline label="Km" type={'radio'} id={'addSessionUnitKm'} name={'addSessionUnit'} value={'km'} checked={this.state.session.unit === 'km' ? true : false} onChange={this.handleDistanceUnit} />
// 										<Form.Check inline label="Miles" type={'radio'} id={'addSessionUnitMiles'} name={'addSessionUnit'} value={'miles'} checked={this.state.session.unit === 'miles' ? true : false} onChange={this.handleDistanceUnit} />
// 									</Form.Group>
// 									<Form.Group controlId="addSessionDistance">
// 										<Form.Label>Distance</Form.Label>
// 										<Form.Control required type="text" value={this.state.session.distance} onChange={this.handleDistance} />
// 									</Form.Group>
// 									<Form.Label>Total Duration</Form.Label>
// 									<p className="small txtred">Note: Distribute minutes first prior to hours</p>
// 									<Form.Row>
// 										<Form.Group as={Col} controlId="addSessionHours">
// 											<Form.Label>HH</Form.Label>
// 											<Form.Control as="select" value={this.state.session.hours} onChange={this.handleTotalHours}>
// 												{durationHours}
// 											</Form.Control>
// 										</Form.Group>
// 										<Form.Group as={Col} controlId="addSessionMinutes">
// 											<Form.Label>MM</Form.Label>
// 											<Form.Control as="select" value={this.state.session.minutes} onChange={this.handleTotalMinutes}>
// 												{durationMinutes}
// 											</Form.Control>
// 										</Form.Group>
// 									</Form.Row>
// 									<Form.Group controlId="addSessionRpeEffort">
// 										<Form.Label>Rating Of Perceived Effort (RPE)</Form.Label>
// 										<Form.Control as="select" value={this.state.rpeEffort} onChange={this.handleRpeEffort}>
// 											<option value="1">Very Very Easy</option>
// 											<option value="2">Easy</option>
// 											<option value="3">Moderate</option>
// 											<option value="4">Some What Hard</option>
// 											<option value="5">Hard</option>
// 											<option value="6">6/10</option>
// 											<option value="7">Very Hard</option>
// 											<option value="8">8/10</option>
// 											<option value="9">9/10</option>
// 											<option value="10">Maximal</option>
// 										</Form.Control>
// 									</Form.Group>
// 									<Form.Row>
// 										<Form.Group as={Col} controlId="addSessionRpeHours">
// 											<Form.Label>HH</Form.Label>
// 											<Form.Control as="select" value={this.state.rpeHours} onChange={this.handleRpeHours}>
// 												{rpeHours}
// 											</Form.Control>
// 										</Form.Group>
// 										<Form.Group as={Col} controlId="addSessionRpeMinutes">
// 											<Form.Label>MM</Form.Label>
// 											<Form.Control as="select" value={this.state.rpeMinutes} onChange={this.handleRpeMinutes}>
// 												{rpeMinutes}
// 											</Form.Control>
// 										</Form.Group>
// 									</Form.Row>
// 									<Form.Row><Button variant="coaching-mate" className="btn-sm adjbtn" onClick={this.addRpeTime}>Add Time</Button></Form.Row>
// 									<Form.Row>
// 										<div className="hour-counter">
// 											<h3 className="text-center green-text">{this.state.rpeTotalHours} hour {this.state.rpeTotalMinutes} min</h3>
// 											<div className="hour-strip">
// 												<div className="strip-clr">
// 													<div id="rpe-maximal-time" className="maximal-time" style={{width:parseInt(100 * (this.state.session.rpe[9] / this.state.session.sessTime))+'%', background:'#000000'}} title={this.state.session.rpe[9]+" mins"}></div>
// 													<div id="rpe-harder-time" className="harder-time" style={{width:parseInt(100 * (this.state.session.rpe[8] / this.state.session.sessTime))+'%', background:'#330066'}} title={this.state.session.rpe[8]+" mins"}></div>
// 													<div id="rpe-very-hard-time" className="very-hard-time" style={{width:parseInt(100 * (this.state.session.rpe[7] / this.state.session.sessTime))+'%', background:'#663399'}} title={this.state.session.rpe[7]+" mins"}></div>
// 													<div id="rpe-hard-time" className="hard-time" style={{width:parseInt(100 * (this.state.session.rpe[6] / this.state.session.sessTime))+'%', background:'#cc3333'}} title={this.state.session.rpe[6]+" mins"}></div>
// 													<div id="rpe-some-hard-time" className="some-hard-time" style={{width:parseInt(100 * (this.state.session.rpe[5] / this.state.session.sessTime))+'%', background:'#ff3333'}} title={this.state.session.rpe[5]+" mins"}></div>
// 													<div id="rpe-moderate-time" className="moderate-time" style={{width:parseInt(100 * (this.state.session.rpe[4] / this.state.session.sessTime))+'%', background:'#ff6633'}} title={this.state.session.rpe[4]+" min"}></div>
// 													<div id="rpe-easy-time" className="easy-time" style={{width:parseInt(100 * (this.state.session.rpe[3] / this.state.session.sessTime))+'%', background:'#ff9933'}} title={this.state.session.rpe[3]+" min"}></div>
// 													<div id="rpe-easier-time" className="easier-time" style={{width:parseInt(100 * (this.state.session.rpe[2] / this.state.session.sessTime))+'%', background:'#ffff00'}} title={this.state.session.rpe[2]+" min"}></div>
// 													<div id="rpe-very-easy-time" className="very-easy-time" style={{width:parseInt(100 * (this.state.session.rpe[1] / this.state.session.sessTime))+'%', background:'#00ff00'}} title={this.state.session.rpe[1]+" mins"}></div>
// 													<div id="rpe-very-very-easy-time" className="very-very-easy-time" style={{width:parseInt(100 * (this.state.session.rpe[0] / this.state.session.sessTime))+'%', background:'#00ffff'}} title={this.state.session.rpe[0]+" mins"}></div>
// 												</div>
// 											</div>
// 										</div>
// 									</Form.Row>
// 									<Form.Row>
// 										<div className="load-results text-center">
// 											<h2>Load: <span>{this.state.session.rpeLoad}</span></h2>
// 										</div>
// 									</Form.Row>
// 									<Form.Row>
// 										<div className="add-video-links text-center">
// 											<br />
// 											<label>Add/Edit Video Links <i className="fa fa-info-circle" title="Youtube enter video url, Vimeo enter video id"></i></label>
// 											<div className="sess-videos">
// 												{this.state.session.videos.map((video, ind) => (
// 													<div key={"sess-video"+ind} className="sess-video"><input type="text" className="sess-video-links " name={ind} value={video} onChange={this.handleVideoText} /> <a href="remove-video" className="remove-sess-video" name={ind} onClick={this.removeVideo}>X</a></div>
// 												))}
// 											</div>
// 											<a href="add-video" className="add-sess-video-btn  btn-coaching-mate btn-sm" onClick={this.addVideo}>Add More</a>
// 										</div>
// 									</Form.Row>
// 								</div>
// 							</Col>
// 							<Col md={6}>
// 								<div>
// 									<Form.Row>
// 										<Form.Group as={Col} controlId="addSessionFamilyName">
// 											<Form.Label>Family Name</Form.Label>
// 											<Form.Control as="select" value={this.state.familyName} onChange={this.handleFamilyName}>
// 												<option value="">Select Family Name</option>
// 												{this.props.familyNames.map(familyName => (
// 													<option key={"family-name-"+familyName._id} value={familyName._id}>{familyName.name}</option>
// 												))}
// 											</Form.Control>
// 										</Form.Group>
// 										<Form.Group as={Col} controlId="addSessionTitle">
// 											<Form.Label>Session Title</Form.Label>
// 											<Form.Control required type="text" value={this.state.session.title} onChange={this.handleTitle} />
// 										</Form.Group>
// 									</Form.Row>
// 									<Form.Label>Athlete Level</Form.Label>
// 									<Form.Group controlId="addSessionAthleteLevel">
// 										<Form.Check inline label="Elite" type="checkbox" name='Elite' onChange={this.handleAthleteLevel} id="addSessionAthleteLevelElite" defaultChecked={this.state.session.athleteLevel.indexOf('Elite') !== -1 ? true : false} />
// 										<Form.Check inline label="Advanced" type="checkbox" name='Advanced' onChange={this.handleAthleteLevel} id="addSessionAthleteLevelAdvanced" defaultChecked={this.state.session.athleteLevel.indexOf('Advanced') !== -1 ? true : false} />
// 										<Form.Check inline label="Intermediate/Advanced" type="checkbox" name='Intermediate/Advanced' onChange={this.handleAthleteLevel} id="addSessionAthleteLevelIntermediateAdvanced" defaultChecked={this.state.session.athleteLevel.indexOf('Intermediate/Advanced') !== -1 ? true : false} />
// 										<Form.Check inline label="Intermediate" type="checkbox" name='Intermediate' onChange={this.handleAthleteLevel} id="addSessionAthleteLevelIntermediate" defaultChecked={this.state.session.athleteLevel.indexOf('Intermediate') !== -1 ? true : false} />
// 										<Form.Check inline label="Low/Intermediate" type="checkbox" name='Low/Intermediate' onChange={this.handleAthleteLevel} id="addSessionAthleteLevelLowIntermediate" defaultChecked={this.state.session.athleteLevel.indexOf('Low/Intermediate') !== -1 ? true : false} />
// 										<Form.Check inline label="Novice" type="checkbox" name='Novice' onChange={this.handleAthleteLevel} id="addSessionAthleteLevelNovice" defaultChecked={this.state.session.athleteLevel.indexOf('Novice') !== -1 ? true : false} />
// 									</Form.Group>
// 									<Form.Group controlId="addSessionDescription">
// 										<Form.Label>Description</Form.Label>
// 										<CKEditor
// 											onChange={this.handleDescription}
// 											data={this.state.session.description}
// 											config={{
// 												toolbar: [
// 													{ name: 'paragraph', items: ['Paragraph', 'Bold', 'Italic', 'Link', 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'] },
// 												]
// 											}}
// 										/>
// 										{/*<Form.Control required as="textarea" value={this.state.session.description} onChange={this.handleDescription} />*/}
// 									</Form.Group>
// 									<Form.Group controlId="addSessionKeywords">
// 										<Form.Label>Keywords</Form.Label>
// 										<ul className="add-session-keywords">
// 											{keywordsList}
// 											<li className="keyword-new"><Form.Control type="text" value={this.state.keyword} onChange={this.handleKeyword} onKeyUp={this.addKeyword} onKeyDown={this.removeKeyword} /></li>
// 										</ul>
// 									</Form.Group>
// 									<HighchartsReact
// 										highcharts={Highcharts}
// 										options={options}
// 										containerProps={{className: 'add-session-chart-cont'}}
// 									/>
// 								</div>
// 							</Col>
// 							<Col md={3}>
// 								<div>
// 									<Form.Group controlId="addSessionImage">
// 										<Form.Label>Upload Image</Form.Label>
// 										<Form.Control type="file" ref={this.uploadImageRef} />
// 									</Form.Group>
// 									<Form.Row>
// 										<Form.Group controlId="addSessionImageUpload">
// 											<Button variant="coaching-mate" className="btn-sm commenstyle" onClick={this.uploadImage}>Upload</Button>
// 										</Form.Group>
// 										<Form.Group controlId="addSessionImageRemove">
// 											<Button variant="coaching-mate btn-sm commenstyle" onClick={this.removeImage}>Remove</Button>
// 										</Form.Group>
// 									</Form.Row>
// 									{this.state.session.image && <Form.Row><img src={'http://localhost:3001/uploads/session/'+this.state.session.image} style={{width: '100%', marginBottom: '15px'}} alt="" /></Form.Row>}
// 									<Form.Label>Activity & Components</Form.Label>
// 									<Accordion defaultActiveKey="0">
// 										<Card className="keyopt">
// 											<Card.Header>
// 												<Accordion.Toggle as={Button} variant="link" eventKey="0">
// 													Activity Type
// 												</Accordion.Toggle>
// 											</Card.Header>
// 											<Accordion.Collapse eventKey="0">
// 												<Card.Body>
// 													<div className="radio-buttons">
// 														{this.props.sessionActivityTypes.map(sessionActivityType => (
// 															<div key={"session-activity-"+sessionActivityType.value}>
// 																<input id={"session-activity-"+sessionActivityType.value} name="activity" type="radio" value={sessionActivityType._id} onChange={this.handleSessionActivity} defaultChecked={this.state.session.activityType === sessionActivityType._id ? true : false} />
// 																<Form.Label htmlFor={"session-activity-"+sessionActivityType.value}>
// 																	<Image className="lazy loaded img-fluid width20" src={"/uploads/images/"+sessionActivityType.imgUrl} /> {sessionActivityType.title}
// 																</Form.Label>
// 															</div>
// 														))}
// 													</div>
// 												</Card.Body>
// 											</Accordion.Collapse>
// 										</Card>
// 										<Card className="keyopt">
// 											<Card.Header>
// 												<Accordion.Toggle as={Button} variant="link" eventKey="1">
// 													Sport Keywords
// 												</Accordion.Toggle>
// 											</Card.Header>
// 											<Accordion.Collapse eventKey="1">
// 												<Card.Body>
// 													<div className="sports-buttons rightopt">
// 														{sportsList}
// 													</div>
// 												</Card.Body>
// 											</Accordion.Collapse>
// 										</Card>
// 										<Card className="keyopt">
// 											<Card.Header>
// 												<Accordion.Toggle as={Button} variant="link" eventKey="2">
// 													Components
// 												</Accordion.Toggle>
// 											</Card.Header>
// 											<Accordion.Collapse eventKey="2">
// 												<Card.Body>
// 													<div className="component-buttons rightopt">
// 														{this.props.sessionComponents.map(sessionComponent => (
// 															<div key={"session-component-"+sessionComponent._id}>
// 																<Form.Label className="myCheckbox">
// 																	<input name="component" type="checkbox" value={sessionComponent._id} onChange={this.handleSessionComponent} defaultChecked={this.state.session.components.indexOf(sessionComponent._id) !== -1 ? true : false} /> <span>{sessionComponent.title}</span>
// 																</Form.Label>
// 															</div>
// 														))}
// 													</div>
// 												</Card.Body>
// 											</Accordion.Collapse>
// 										</Card>
// 									</Accordion>
//
//
//
// 									<div id="keywords_cloud" style={{display: 'none'}}>
// 										<h3>Keywords</h3>
// 										<a href="#" role="button" className="tag-cloud-link tag-link-0 tag-link-position-1">asdad</a>
// 										<a href="#" role="button" className="tag-cloud-link tag-link-1 tag-link-position-2" >dasda</a>
// 										<a href="#" role="button" className="tag-cloud-link tag-link-2 tag-link-position-3"  > 1.15min/100m</a>
// 										<a href="#" role="button" className="tag-cloud-link tag-link-3 tag-link-position-4" > 1.15min/100m.</a>
// 										<a href="#" role="button" className="tag-cloud-link tag-link-4 tag-link-position-5"  > 1.20min 1.40mn</a>
// 										<a href="#" role="button" className="tag-cloud-link tag-link-5 tag-link-position-6"  >1.25/100m</a>
// 										<a href="#" role="button" className="tag-cloud-link tag-link-6 tag-link-position-7"  > 1.25/100m</a>
// 										<a href="#" role="button" className="tag-cloud-link tag-link-7 tag-link-position-8" > 1.30 - 1.45min</a>
// 										<a href="#" role="button" className="tag-cloud-link tag-link-8 tag-link-position-9"  > 1.30-1.45min</a>
// 										<a href="#" role="button" className="tag-cloud-link tag-link-9 tag-link-position-10"  > 1.30min/100m</a>
// 										<a href="#" role="button" className="tag-cloud-link tag-link-10 tag-link-position-11"  > 1.30min/100m.</a>
// 										<a href="#" role="button" className="tag-cloud-link tag-link-11 tag-link-position-12"  >1.40min/100m</a>
// 									</div>
// 								</div>
// 							</Col>
// 						</Row>
// 					</Form>
// 				</Modal.Body>
// 				<Modal.Footer>
// 					<Button variant="coaching-mate" onClick={this.addSession}>{this.props.sessionId != null ? 'Update' : 'Create'}</Button>
// 					{this.props.sessionId != null && <Button variant="coaching-mate" onClick={this.saveAsNew}>Save as new</Button>}
// 				</Modal.Footer>
// 			</Modal>
// 		);
// 	}
// }
//
// const mapStateToProps = state => {
// 	return {
// 		user: state.auth.user,
// 		addSession: state.planner.modals.addSession,
// 		sessionId: state.planner.modalsParams.id,
// 		familyNames: state.planner.familyNames,
// 		sessionActivityTypes: state.planner.sessionActivityTypes,
// 		sessionSportsKeywords: state.planner.sessionSportsKeywords,
// 		sessionComponents: state.planner.sessionComponents,
// 		session: state.planner.session,
// 		alertMessage: state.planner.alertMessage,
// 		error: state.planner.error
// 	};
// };
//
// export default connect(mapStateToProps, {hideAddSession, loadAddSessionData, createSession, closeAlert, updateSession,updateSeachSession})(AddSession);