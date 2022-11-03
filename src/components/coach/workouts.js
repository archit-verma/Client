import React, {Component} from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import LeftSidebar from './left-sidebar';
import {getTeam} from '../../utils/api.js';
import {postGarmin, authenticate, checkAuth, outAuth} from '../../actions';
import loading from "../../assets/loading.svg";

import {DataGrid} from '@mui/x-data-grid';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Stack from '@mui/material/Stack';

import {loadSessions} from '../../actions';
import {withRouter} from "react-router-dom";

import * as API from '../../utils/api';

const columns = [
    {field: 'id', headerName: 'ID', width: 70},
    {field: 'title', headerName: 'Workout Title', width: 260},
    {field: 'activityType', headerName: 'Activity Type', width: 130},
    {field: 'athleteLevel', headerName: 'Athlete Level', width: 260},
];


class Workouts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            club: '',
            loading: true,
            leftSidebarDisplay: true,
            rows: [],
            prev: [],
            selected: [],
            authenticated: false
        };

        this.leftSidebarChange = this.leftSidebarChange.bind(this);
        this.loadRows = this.loadRows.bind(this);
        this.postGarmin = this.postGarmin.bind(this);
        this.filerRow = this.filerRow.bind(this);
        this.matchData = this.matchData.bind(this);
        this.converChartData = this.converChartData.bind(this);
        this.promisedSetState = this.promisedSetState.bind(this);
        this.connectbutton = this.connectbutton.bind(this);
        this.connectClick = this.connectClick.bind(this);
        this.auth = this.auth.bind(this);
    }

    componentDidMount() {
        getTeam(this.props.clubSlug)
            .then(response => {
                if (response.team === null) {
                    this.setState({club: null});
                } else {
                    if (response.team.creatorId === this.props.user._id) {
                        this.setState({club: response.team, loading: false});
                        this.props.loadSessions(this.state.club._id);
                    } else {
                        this.setState({club: null});
                    }
                }
            });
        checkAuth(this.props.user._id)
            .then(res => {
                if (res.users.length>0){
                    this.setState({authenticated: true});
                }
            });
    }

    loadRows() {
        const r = [];
        for (const [i, value] of this.props.session.entries()) {
            r.push({
                id: i, title: value.title,
                activityType: value.activityType,
                athleteLevel: value.athleteLevel
            })
        }
        this.setState({rows: r, prev: this.props.session})
    }

    postGarmin(data) {
        const obj = this.matchData();
        for (const index in obj) {
            const d = obj[index];
            this.props.postGarmin(d, this.props.user._id);
        }
        alert("Workout sent");
    }

	leftSidebarChange(){
		this.setState({leftSidebarDisplay: !this.state.leftSidebarDisplay});
	}

	filerRow = async(id) => {
		const s = (this.props.session).filter(function (eachElem, index) {
			return id.indexOf(index) !== -1});
		await this.promisedSetState({selected: s});
        
	}

	promisedSetState = (newState) => new Promise(resolve => this.setState(newState, resolve));

	converChartData(chartData, type){
		const stage = [];
		for(let i = 0; i < chartData.length; i++){
			if (type=="swimming"){
				stage.push({"type":"WorkoutStep",  "stepOrder": i, "intensity": "INTERVAL", 
				"durationType": "DISTANCE", "durationValue": 150.0, "durationValueType": "METER"});
			}else{
				stage.push({"type":"WorkoutStep", "stepOrder": i, "intensity": "INTERVAL",
				"durationType": "DISTANCE", "durationValue": 150.0, "durationValueType": "METER"});
			}
		}
		return stage;
	}

	matchData(){
		const fixed = [];
		for (const index in this.state.selected){
			const s = this.state.selected[index];
			const steps = this.converChartData(s.chartData, s.activityType.toLowerCase());
			var a = null;
			if (s.activityType.toLowerCase() == "swimming"){
				a = {
					"workoutName": s.title,
					"description": null,
					"sport": "LAP_SWIMMING",
					"poolLength": 25.0,
					"poolLengthUnit": "METER",
					"steps": steps
				}
			}else{
				a = {
					"workoutName": s.title.toString(),
					"description": null,
					"sport": (s.activityType).toUpperCase().toString(),
					"steps": steps
				}
			}
			fixed.push(a);
		}
		return fixed;
	}

    connectbutton() {
    }

    connectClick = (requestToken) => {
        const width = 500;
        const height = 400;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2.5;
        const title = `GARMIN CONNECT LOGIN`;
        const base_url = API.getServerUrl().apiURL;
        const userID = this.props.user._id;
        const callback = base_url + '/auth/authorise';
        const url = 'https://connect.garmin.com/oauthConfirm?oauth_token=' + requestToken + '&oauth_callback=' + callback + '?action=step3'+'?user_id=' + userID;
        const popup = window.open(url, title, `width=${width},height=${height},left=${left},top=${top}`)
    }

    auth = () => {
        authenticate().then(res => this.connectClick(res)).then(this.setState({authenticated:true}));
    }

    unauth = () => {
        outAuth(this.props.user._id);
        this.promisedSetState({authenticated: false});
    }

	render(){
		if(this.state.club === null){
			return <Redirect to="/home" />;
		}
		if(this.state.loading){
			return (
                <div className='profile-container-loading'>
                    <img src={loading} alt=""/>
                </div>
            );
        }
        if (this.props.session != this.state.prev) {
            this.loadRows();
        }
        return (
            <div>
                <div class="container-large clearfix">
                    <div id="wrapper"
                         class={"athlete-profile" + (this.state.leftSidebarDisplay ? "" : " toggled-left")}>
                        <LeftSidebar club={this.state.club} sidebarDisplay={this.state.leftSidebarDisplay}
                                     leftSidebarChange={this.leftSidebarChange}/>
                        <div id="page-content-wrapper" class="message-section">
                            <div class="container-fluid">
                                <div class="row">
                                    <div class="col-lg-12-large">
                                        <div class="dashboard-heading">
                                            <h3>
                                                <a href="#menu-toggle-left" class="menu-toggle-left"
                                                   id="show-after-left-close"
                                                   style={!this.state.leftSidebarDisplay ? {display: 'inline-block'} : {}}
                                                   onClick={(e) => {
                                                       e.preventDefault();
                                                       this.leftSidebarChange()
                                                   }}>
                                                    <span class="icon-bar"></span>
                                                    <span class="icon-bar"></span>
                                                    <span class="icon-bar"></span>
                                                </a>
                                                All Workouts
                                            </h3>
                                        </div>
                                        <div style={{height: 400, width: 800}}>
                                            <DataGrid
                                                rows={this.state.rows}
                                                columns={columns}
                                                checkboxSelection
                                                onSelectionModelChange={(id) => this.filerRow(id)}
                                            />
                                            <Stack spacing={3}>
                                                <div>

                                                    <Stack direction="row" spacing={1}>
                                                        <Button variant="contained"
                                                            onClick={this.state.authenticated? null : this.auth}
                                                            color={this.state.authenticated? "success" : "primary"}
                                                        >{this.state.authenticated? "connected" : "connect"}</Button>
                                                        {this.state.authenticated && 
                                                        (<Button variant="contained" onClick={this.unauth} color="success">
                                                            Disconect
                                                        </Button>)}
                                                    </Stack>
                                                </div>
                                                {this.state.authenticated &&
                                                    <div>
                                                        <Button variant="contained" endIcon={<SendIcon/>}
                                                                onClick={this.postGarmin.bind(this, 'post')}>
                                                        Send
                                                        </Button>
                                                    </div>}
                                            </Stack>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.auth.user,
        session: state.planner.sessions
    };
};

export default withRouter(
    connect(mapStateToProps, {
        loadSessions,
        postGarmin,
    })(Workouts)
);

