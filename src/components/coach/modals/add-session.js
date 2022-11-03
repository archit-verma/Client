// New Modifications
//Budgerigar
import React, { Component } from 'react';

import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';

import { connect } from 'react-redux';
import {
  hideAddSession,
  loadAddSessionData,
  createSession,
  closeAlert,
  updateSession,
  updateSeachSession
} from '../../../actions';
import { sessionImageUpload } from '../../../utils/api.js';
import { getSessionIcons } from '../../../utils/api.js';
import { linkFamilyName, linkTags, sessionSave } from '../../../utils/api.js';
import { Image } from 'react-bootstrap';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import * as Highcharts from 'highcharts';
import variwide from 'highcharts/modules/variwide';
import dragable from 'highcharts/modules/draggable-points';
import HighchartsReact from 'highcharts-react-official';

import loading from '../../../assets/loading.svg';
import arrowLeft from '../../../assets/arrowLeft.png';
import arrowRight from '../../../assets/arrowRight.png';
import closeIcon from '../../../assets/close.png';
import duplicateIcon from '../../../assets/duplicate.png';
import clockIcon from '../../../assets/clock.png';
import modificationIcon from '../../../assets/modification.png';

variwide(Highcharts);
dragable(Highcharts);



class AddSession extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoverData: null,
      edit:false,
      // chart end
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
        wp: [0, 0, 0, 0, 0, 0, 0],
        wpLoad: 0,
        tags:'',
        videos: [],
        stages: [],
        familyName: '',
        athleteLevel: 'Elite',
        description: [],
        keywords: [],
        image: '',
        activityType: '',
        intervalsType: '',
        sportsKeywords: '',
        components: '',
        sessionType: 'normal',
        addedBy: props.user.userId,
        clubId: props.club._id,
        desJson: {}//JSON file
      },
      tags:'',
      rpeEffort: 1,
      rpeHours: 0,
      rpeMinutes: 0,
      rpeTotalHours: 0,
      rpeTotalMinutes: 0,
      rpeTotalTime: 0,
      familyName: '',
      keyword: '',
      loading: true,
      wpEffort: 1,
      wpHours: 0,
      wpMinutes: 0,
      wpTotalHours: 0,
      wpTotalMinutes: 0,
      wpTotalTime: 0,

      //hf
      addPopFrm: false,
      showPopFrm: false,
      showTxtFrm: false,
      showVarFrm: false,
      showInputFrm: false,
      selectedIndex: undefined,
      selectedStage: undefined,
      addText: undefined,
      addValue: undefined,
      stageIndex: 1,

      //Budgerigar

      //su
      hasWarmCool: false,
      hasWarm: false,
      hasCool: false,
      totalDuration: 0,
      totalLoad: 0,
      editTitle: false,
      athleteLevelOptionList: [
        'Elite',
        'Advanced',
        'Intermediate/Advanced',
        'Intermediate',
        'Low/Intermediate',
        'Novice'
      ],
      sportsKeywordsOptionList:['Aerobics','Extreme Sports','Fitness Training','--Athletics--','Cross Country','Distant Running','Jumps and Throws'],
      icons: [],
      linkNameDiv: { display: 'none' },
      linkFamilyNameList: [],
      linkTagsDiv: { display: 'none' },
      linkTagsList: [],
      originalPoint: null,
      finalStage: null,
      chartData: [],
      stageColors: [
        '#c2c2c2',
        '#89afe6',
        '#9bc696',
        '#f4dd84',
        '#c97c5f',
        '#a84c37'
      ],
      colors: [],
      stageNames: [],
      stageSeries: [],
      desLines: [],
      stageChanged: false,
      stageType: "Duration-min",

      chartOptions: {
        credits: {
          enabled: false
        },
        colors: this.stageColors,
        title: { text: 'Workout Plan' },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          labels: {
            format: 'z{value}'
          },
          title: 'intensity',
          min: 0,
          max: 6
        },
        caption: {
          text: 'Column widths are proportional to Time'
        },
        legend: {
          enabled: true
        },
        series: [
          {
            allowPointSelect: false,
            showInLegend: true,
            name: 'workout stages',
            data: [],
            type: 'variwide',
            dataLabels: {
              enabled: true,
              format: 'z{point.y:.0f}'
            },
            dataSorting: {
              enabled: false
            },
            colorByPoint: true
          }
        ],
        plotOptions: {
          type: 'column',
          series: {
            stickyTracking: false,
            dragDrop: {
              draggableY: true,
              draggableX: true,
              dragMinY: 0.1,
              dragMaxY: 5.9
            },
            column: {
              stacking: 'normal',
              minPointLength: 20
            },
            line: {
              //cursor: 'ns-resize'
            },
            tooltip: {
              valueDecimals: 0
            },
            point: {
              events: {
                mouseOver: this.setHoverData.bind(this),
                dragStart: function (e) {},
                drag: function (e) {},
                drop: function (e) {
                  return false;
                }
              }
            },
            borderRadius: 5
          }
        }
      }
    };

    this.uploadImageRef = React.createRef();

    this.handleClose = this.handleClose.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this.handleDistanceUnit = this.handleDistanceUnit.bind(this);
    this.handleDistance = this.handleDistance.bind(this);
    this.addVideo = this.addVideo.bind(this);
    this.updateSessionChart = this.updateSessionChart.bind(this);
    this.addStagez1 = this.addStagez1.bind(this);
    this.addStagez2 = this.addStagez2.bind(this);
    this.addStagez3 = this.addStagez3.bind(this);
    this.addStagez4 = this.addStagez4.bind(this);
    this.addStagez5 = this.addStagez5.bind(this);
    this.addStagez6 = this.addStagez6.bind(this);
    this.addWarmCool = this.addWarmCool.bind(this);
    this.addWarmUp = this.addWarmUp.bind(this);
    this.addCoolDown = this.addCoolDown.bind(this);
    this.addUp = this.addUp.bind(this);
    this.addDown = this.addDown.bind(this);
    this.addPyramid = this.addPyramid.bind(this);
    this.addPlateau = this.addPlateau.bind(this);
    this.handleLikeFamilyName = this.handleLikeFamilyName.bind(this);
    this.handleVideoText = this.handleVideoText.bind(this);
    this.removeVideo = this.removeVideo.bind(this);
    this.handleTitle = this.handleTitle.bind(this);
    this.handleAthleteLevel = this.handleAthleteLevel.bind(this);

    this.handleKeyword = this.handleKeyword.bind(this);
    this.addKeyword = this.addKeyword.bind(this);
		this.removeKeyword = this.removeKeyword.bind(this);

    this.deleteKeyword = this.deleteKeyword.bind(this);
    this.uploadImage = this.uploadImage.bind(this);
    this.removeImage = this.removeImage.bind(this);
    this.handleSessionActivity = this.handleSessionActivity.bind(this);
    this.handleSessionSports = this.handleSessionSports.bind(this);
    this.handleSessionComponent = this.handleSessionComponent.bind(this);
    this.handleSessionStagesType = this.handleSessionStagesType.bind(this);
    this.handleSessionIntervals = this.handleSessionIntervals.bind(this);
    this.editWorkoutTitle = this.editWorkoutTitle.bind(this);
    this.editWorkoutTitleDone = this.editWorkoutTitleDone.bind(this);
    this.generateJson = this.generateJson.bind(this);
    this.minusStages = this.minusStages.bind(this);
    this.addStages = this.addStages.bind(this);
    //tags
    this.handleLikeTags = this.handleLikeTags.bind(this)
  }

  componentDidMount() {
    if (this.state.chartOptions.series[0].data) {
      this.setState({ chartData: this.state.chartOptions.series[0].data});
    }

    if (this.props.sessionId !== null) {
      this.props.loadAddSessionData(this.props.sessionId, this.props.club._id);
    } else {
      this.props.loadAddSessionData('add', this.props.club._id);
    }

    //Budgerigar icons
    getSessionIcons().then(icons => {
      this.setState({ icons: icons });
    });

    var originalStage = this.state.originalPoint;
    var finalStage = this.state.finalStage;
    var addSessionState = this;

    function changeStageStart(e) {
      if (!originalStage) {
        originalStage = [e.chartX, e.chartY, e.target.z];
      }
    }

    function changeStageDone(e) {
      finalStage = [e.chartX, e.chartY, e.target.z];
      var id = '' + e.newPointId;
      update(e.newPoints[id].point.index);

      addSessionState.setState({
        chartData: addSessionState.state.chartOptions.series[0].data,
        stageChanged: true,
      });
      originalStage = null;
    }

    // hf update data to chart
    function update(stageIndex) {
      var updateOption = '';
      if (
          Math.abs(finalStage[0] - originalStage[0]) <=
          Math.abs(finalStage[1] - originalStage[1])
      ) {
        if (finalStage[1] - originalStage[1] >= 0) {
          updateOption = 'y_Down';
        } else {
          updateOption = 'y_Up';
        }
      } else {
        if (finalStage[0] - originalStage[0] >= 0) {
          updateOption = 'x_Up';
        } else {
          updateOption = 'x_Down';
        }
      }

      var data = addSessionState.state.chartData;
      var newData = data;
      var duration = addSessionState.state.totalDuration;
      var load = addSessionState.state.totalLoad;

      switch (updateOption) {
        case 'y_Up': {
          if (data[stageIndex][1] + 1 > 6) {
            return;
          }
          newData[stageIndex] = [
            data[stageIndex][0],
            data[stageIndex][1] + 1,
            data[stageIndex][2],
            data[stageIndex][3],
            data[stageIndex][4]
          ];
          if (newData[stageIndex][4].match("PLATEAU")){
            plateauUpdate(newData, stageIndex, data);
          }
          load = load + data[stageIndex][2];
          break;
        }
        case 'y_Down': {
          if (data[stageIndex][1] - 1 < 1) {
            return;
          }
          newData[stageIndex] = [
            data[stageIndex][0],
            data[stageIndex][1] - 1,
            data[stageIndex][2],
            data[stageIndex][3],
            data[stageIndex][4]
          ];
          if (newData[stageIndex][4].match("PLATEAU")){
            plateauUpdate(newData, stageIndex, data);
          }
          load = load - data[stageIndex][2];
          break;
        }
        case 'x_Up': {
          newData[stageIndex] = [
            data[stageIndex][0],
            data[stageIndex][1],
            data[stageIndex][2] + 5,
            data[stageIndex][3],
            data[stageIndex][4]
          ];
          if (newData[stageIndex][4].match("PLATEAU")){
            plateauUpdate(newData, stageIndex, data);
          }
          duration = duration + 5;
          load = load + data[stageIndex][1] * 5;
          break;
        }
        case 'x_Down': {
          if (data[stageIndex][2] - 5 <= 0) {
            return;
          }
          newData[stageIndex] = [
            data[stageIndex][0],
            data[stageIndex][1],
            data[stageIndex][2] - 5,
            data[stageIndex][3],
            data[stageIndex][4]
          ];
          if (newData[stageIndex][4].match("PLATEAU")){
            plateauUpdate(newData, stageIndex, data);
          }
          duration = duration - 5;
          load = load - data[stageIndex][1] * 5;
          break;
        }
        default: {
          break;
        }
      }

      function plateauUpdate(newData, stageIndex, data){
        if (newData[stageIndex][4].match("PLATEAU")){
          var plateau = newData[stageIndex][4];
          var plateauStartNum = 0;
          var plateauEndNum = 0;
          for (let i = 0; i < data.length; i++){
            if (data[i][4] == plateau){
              plateauStartNum = i;
              break;
            }
          }
          for (let i = data.length - 1; i >= 0; i--){
            if (data[i][4] == plateau) {
              plateauEndNum = i;
              break;
            }
          }

          for (let i = plateauStartNum; i <= plateauEndNum; i++){
            if ((stageIndex - i) % 2 == 0){
              newData[i][1] = newData[stageIndex][1];
              newData[i][2] = newData[stageIndex][2];
            }
          }
        }
      }

      var colors = [];
      addSessionState.state.chartData.forEach((a, b, c) => {
        colors.push(addSessionState.state.stageColors[a[1] - 1]);
      });

      addSessionState.setState({
        totalDuration: duration,
        totalLoad: load,
        colors:colors,
        chartOptions: {
          colors: colors,
          series: [
            {
              allowPointSelect: false,
              showInLegend: true,
              name: 'workout stages',
              data: newData,
              type: 'variwide',
              dataLabels: {
                enabled: true,
                format: 'z{point.y:.0f}'
              },
              colorByPoint: true
            }
          ]
        }
      });
    }

    //Ashlynn switch x-axix, initialization
    var format = "";
    if (this.state.stageType == "Duration-min") {
      format = 'intensity: <b> z{point.y}</b><br>' + 'duration: <b>{point.z} min</b><br>';
    }else if (this.state.stageType == "Distance-km"){
      format = 'intensity: <b> z{point.y}</b><br>' + 'distance: <b>{point.z} km</b><br>';
    }else if (this.state.stageType == "Distance-m"){
      format = 'intensity: <b> z{point.y}</b><br>' + 'distance: <b>{point.z} m</b><br>';
    }

    //hf
    // fix stage's color by it's height
    this.state.chartData.forEach((a, b, c) => {
      this.state.colors.push(this.state.stageColors[a[1] - 1]);
      this.state.totalDuration = this.state.totalDuration + a[2];
      this.state.totalLoad = this.state.totalLoad + a[1] * a[2];
    });

    this.setState({
      chartOptions: {
        credits: {
          enabled: false
        },
        colors: this.state.colors,
        title: { text: 'Workout Plan' },
        xAxis: {
          type: 'category'
        },
        yAxis: {
          labels: {
            format: 'z{value}'
          },
          title: 'intensity',
          min: 0,
          max: 6
        },
        caption: {
          text: 'Column widths are proportional to Time'
        },
        legend: {
          enabled: true
        },
        series: [
          {
            allowPointSelect: false,
            showInLegend: true,
            name: 'workout stages',
            data: this.state.chartData,
            type: 'variwide',
            dataLabels: {
              enabled: true,
              format: 'z{point.y:.0f}'
            },
            tooltip: {
              pointFormat: format
            },
            dataSorting: {
              enabled: false
            },
            colorByPoint: true
          }
        ],
        plotOptions: {
          type: 'column',
          series: {
            stickyTracking: false,
            dragDrop: {
              draggableY: true,
              draggableX: true,
              dragMinY: 0.1,
              dragMaxY: 5.9
            },
            column: {
              stacking: 'normal',
              minPointLength: 20
            },
            line: {
              //cursor: 'ns-resize'
            },
            point: {
              events: {
                mouseOver: this.setHoverData.bind(this),
                dragStart: function (e) {},
                drag: function (e) {
                  changeStageStart(e);
                  return false;
                },
                drop: function (e) {
                  changeStageDone(e);
                  return false;
                },
                // hf
                // handle stage click
                click: function (e) {
                  const index = this.category;

                  // set selected index and stage
                  addSessionState.setState({
                    showPopFrm: true,
                    selectedIndex: index,
                    selectedStage: addSessionState.state.chartData[index],
                    leftLoc: this.clientX
                  });
                }
              }
            },
            borderRadius: 5
          }
        }
      }
    });
  }

  //Ashlynn Description Methods
  componentDidUpdate(newProps,newState) {
    if (newState.chartOptions.series[0].data.length < 1 || newState.chartData.length < 1) {
      return;
    }

    var dataList = newState.chartData;
    var description = [
      {
        title: "WARMUP",
        descriptionList: []
      },
      {
        title: "MAINSET",
        descriptionList: []
      },
      {
        title: "COOLDOWN",
        descriptionList: []
      }
    ];

    var desLines = [];

    this.generateDescription(description, dataList, this.state.stageType, desLines);

    if ( this.state.desLines.toString() !== desLines.toString() || this.state.stageChanged){
      this.setState({session: {...this.state.session, description: description}, desLines: desLines, stageChanged: false})
    }
  }
  //Ashlynn Description Methods
  generateDescription(description, dataList, type, desLines) {
    var desLine = '';
    var intensity = 0;
    var totalAmount = 0;
    var durationOrDistance = type;

    for (let i = 0; i < dataList.length; i++) {
      // normal stages
      if (dataList[i][4] == "") {
        desLine = dataList[i][2]  + durationOrDistance.split("-")[1] + " @" + "T" + dataList[i][1];
        if (dataList[i][3][0][1] != ""){
          desLine = desLine + ": " + dataList[i][3][0][1];
        }
        description[1].descriptionList.push(desLine);
      } // warmup
      else if (dataList[i][4] == "WARMUP") {
        desLine = dataList[i][2] + durationOrDistance.split("-")[1] + " @ " + "T" + dataList[i][1] ;
        description[0].descriptionList.splice(0, 0, desLine);
      } //cooldown
      else if (dataList[i][4] == "COOLDOWN") {
        desLine = dataList[i][2] + durationOrDistance.split("-")[1] + " @ " + "T" + dataList[i][1] + ": " + dataList[i][3][0][1];
        description[2].descriptionList.splice(0, 0, desLine);
      } // intervals
      else {
        let range = 1;
        desLine = "";
        let xAxis = durationOrDistance.split("-")[1];
        let type = "";
        let stageType = dataList[i][4];

        for (let j = dataList.length - 1; j >= 0; j--){
          if (dataList[j][4] == stageType){
            range = j;
            break;
          }
        }

        if (stageType.match("UP")){
          type = "UP";
        }else if (stageType.match("DOWN")){
          type = "DOWN";
        }else if (stageType.match("PYRAMID")){
          type = "PYRAMID";
        }else if (stageType.match("PLATEAU")){
          type = "PLATEAU";
        }

        for (let j = i; j <= range; j++){
          if (dataList[j]){
            totalAmount = totalAmount + dataList[j][2];
            intensity = intensity + dataList[j][1];
            if (j == i){
              desLine = desLine + " ";
            }
            if (dataList[j][3][0][1] != ""){
              desLine = desLine + dataList[j][2] + xAxis+ " @ "  + " T" + dataList[j][1] + ": " + dataList[j][3][0][1] ;
            }else{
              desLine = desLine  + dataList[j][2] + xAxis+ " @ "  + " T" + dataList[j][1] ;
            }
            if (j != range){
              desLine = desLine + " , ";
            }
          }
        }
        if (desLine != ""){
          desLine = totalAmount + " " + xAxis + " " + type + " @ "  + "T" + intensity + " | " + desLine;
        }else{
          desLine = totalAmount + " " + xAxis + " " + type + " @ " + "T" + intensity;
        }
        description[1].descriptionList.push(desLine);
        totalAmount = 0;
        intensity = 0;
        i = range;
      }
    }
    for (let i = 0; i < description.length; i++){
      desLines.push(
          <p class="desLinesTitle">{description[i].title}</p>
      );
      for (let j = 0; j < description[i].descriptionList.length; j++){
        desLines.push(
            <p class="desLines">{description[i].descriptionList[j]}</p>
        );
      }
    }

    var desAndLines = {
      description: description,
      desLines: desLines
    }
    return desAndLines;
  }
  //Ashlynn Description Methods

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (nextProps.addSession && nextProps.alertMessage) {
      this.clearForm();
    } else if (nextProps.addSession && nextProps.error) {
      this.setState({ loading: false });
    } else if (nextProps.addSession && nextProps.session) {
      let session = nextProps.session;
      let familyName = '',
          familyNameObj = '';
      if (session.familyName) {
        familyName = session.familyName._id;
        familyNameObj = session.familyName;
      }
      //tags
      let tags = '',
          tagsObj = '';
      if (session.tags) {
        tags = session.tags._id;
        tagsObj = session.tags;
      }


      this.setState({
            session: {
              _id: session._id,
              title: session.title,
              distance: session.distance,
              unit: session.unit,
              hours: session.hours,
              minutes: session.minutes,
              sessTime: session.sessTime,
              rpeLoad: session.rpeLoad,
              videos: session.videos,
              familyName: familyNameObj,
              athleteLevel: session.athleteLevel,
              description: session.description,
              keywords: session.keywords,
              image: session.image,
              activityType: session.activityType,
              sportsKeywords: session.sportsKeyWords,
              components: session.components,
              sessionType: session.sessionType,
              clubId: session.clubId,
            },
            tags: tagsObj,
            edit: true,
            chartData: session.chartData,
            loading: false
          }, () => {
            this.updateChart();
            this.updateSessionChart();
          }
      )
    } else if (nextProps.addSession && nextProps.sessionActivityTypes) {
      this.setState({ loading: false });
    }
  }

  clearForm() {
    this.setState({
      session: {
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
        stages: [],
        familyName: '',
        athleteLevel: 'Elite',
        description: [],
        keywords: [],
        image: '',
        activityType: '',
        intervalsType: '',
        sportsKeywords: '',
        components: '',
        sessionType: 'normal',
        tags:'',
      },
      rpeEffort: 1,
      rpeHours: 0,
      rpeMinutes: 0,
      rpeTotalHours: 0,
      rpeTotalMinutes: 0,
      rpeTotalTime: 0,
      wpEffort: 1,
      wpHours: 0,
      wpMinutes: 0,
      wpTotalHours: 0,
      wpTotalMinutes: 0,
      wpTotalTime: 0,
      tags:'',
      familyName: '',
      keyword: '',
      loading: false
    });
  }

  setHoverData = e => {
    this.setState({ hoverData: 1 + e.target.category });
  };

  //hf
  // switch stage
  //Ashlynn stage border test
  prevStage() {
    let index = this.state.selectedIndex,
        left;
    let chartData = this.state.chartData;

    let stageIndex = index;
    let stageEndIndex = stageIndex;
    let intervalRange = 1;
    let title = chartData[stageIndex][4];
    var move = null;

    if (title != "" && title != "WARMUP" && title != "COOLDOWN"){
      for (let i = 0; i < chartData.length; i++){
        if (chartData[i][4] == title){
          stageIndex = i;
          break;
        }
      }
      for (let i = chartData.length - 1; i >= 0; i--){
        if (chartData[i][4] == title){
          stageEndIndex = i;
          break;
        }
      }
      intervalRange = stageEndIndex - stageIndex + 1;
    }

    // border testing
    if(title.match("COOLDOWN") || title.match("WARMUP")){
      return;
    }else if(stageIndex == 1){
      return;
    }

    move = chartData.splice(stageIndex, intervalRange);

    if (index-- <= 0) {
      index = 0;
      left = this.state.leftLoc;
    } else {
      left = this.state.leftLoc - 200;
    }

    if (left < 0) {
      left = 30;
    }

    let prevIndex = stageIndex - 1;
    let prevStartIndex = 0;
    let prevTitle = chartData[prevIndex][4];
    let prevRange = 1;

    if (prevTitle != "" && prevTitle != "WARMUP" && prevTitle != "COOLDOWN"){
      for (let i = 0; i < chartData.length; i++){
        if (chartData[i][4] == prevTitle){
          prevStartIndex = i;
          break;
        }
      }
      prevRange = prevIndex - prevStartIndex + 1;
    }

    for (let i = 0; i < intervalRange; i++){
      chartData.splice(stageIndex - prevRange + i, 0, move[i]);
    }

    this.setState({
      leftLoc: left,
      selectedIndex: index,
      stageChanged: true,
      showPopFrm: false,
      chartData
    });

    this.updateChart();
  }

  //Ashlynn stage border test
  netxStage() {
    let index = this.state.selectedIndex,
        left;
    let chartData = this.state.chartData;

    let stageIndex = index;
    let stageEndIndex = stageIndex;
    let intervalRange = 1;
    let title = chartData[stageIndex][4];
    var move = null;

    if (title != "" && title != "WARMUP" && title != "COOLDOWN"){
      for (let i = 0; i < chartData.length; i++){
        if (chartData[i][4] == title){
          stageIndex = i;
          break;
        }
      }
      for (let i = chartData.length - 1; i >= 0; i--){
        if (chartData[i][4] == title){
          stageEndIndex = i;
          break;
        }
      }
      intervalRange = stageEndIndex - stageIndex + 1;
    }

    //border testing
    if(title.match("COOLDOWN") || title.match("WARMUP")){
      return;
    }
    else if(stageEndIndex >= chartData.length - 2){
      return;
    }

    let nextIndex = stageEndIndex + 1;
    let nextEndIndex = 0;
    let nextTitle = chartData[nextIndex][4];
    let nextRange = 1;

    if (nextTitle != "" && nextTitle != "WARMUP" && nextTitle != "COOLDOWN"){
      for (let i = chartData.length - 1; i >= 0; i--){
        if (chartData[i][4] == nextTitle){
          nextEndIndex = i;
          break;
        }
      }
      nextRange = nextEndIndex - nextIndex + 1;
    }

    move = chartData.splice(stageIndex, intervalRange);

    if (index++ >= this.state.chartData.length - 1) {
      index = this.state.chartData.length - 1;
      left = this.state.leftLoc;
    } else {
      left = this.state.leftLoc + 200;
    }

    if (left + 380 > window.innerWidth) {
      left = window.innerWidth - 380;
    }

    for (let i = 0; i < intervalRange; i++){
      chartData.splice(stageIndex + nextRange + i, 0, move[i]);
    }

    this.setState({
      leftLoc: left,
      selectedIndex: index,
      stageChanged: true,
      showPopFrm: false,
      chartData: chartData
    });

    this.updateChart();
  }

  //hf
  // update change to  chart
  updateChart() {
    const colors = this.state.chartData.map(
        s => this.state.stageColors[s[1] - 1]
    );

    this.setState({
      chartOptions: {
        colors: colors,
        series: [
          {
            allowPointSelect: false,
            showInLegend: true,
            name: 'workout stages',
            data: this.state.chartData,
            type: 'variwide',
            dataLabels: {
              enabled: true,
              format: 'z{point.y:.0f}'
            },
            colorByPoint: true
          }
        ]
      }
    });
  }

  //hf
  // handle add variable name
  handleVarName(e) {
    this.setState({
      addText: e.target.value
    });
  }

  //hf
  // handle duplicate stage
  duplicateStage() {
    let chartData = this.state.chartData;
    let colors = this.state.colors;
    let selectedStage = [...chartData[this.state.selectedIndex]];
    let selectedColor = colors[this.state.selectedIndex];

    if (selectedStage[4] != ""){return;}

    //hf
    // get selected stage count
    const length = chartData.filter(
        n => n[0].indexOf(selectedStage[0]) >= 0
    ).length;

    selectedStage[0] = 'stage' + this.state.stageIndex;

    // insert copy to chart data
    chartData.splice(this.state.selectedIndex + 1, 0, selectedStage);
    colors.splice(this.state.selectedIndex + 1, 0, selectedColor);

    this.setState({
      chartData,
      colors,
      showPopFrm: false,
      selectedIndex: undefined,
      selectedStage: undefined,
      stageIndex: this.state.stageIndex + 1,
      stageChanged: true
    });

    this.updateChart();
  }

  //hf
  removeStage() {
    let chartData = this.state.chartData;
    let colors = this.state.colors;
    let stageIndex = this.state.selectedIndex;
    let stageEndIndex = stageIndex + 1;
    let intervalRange = 1;
    let title = chartData[stageIndex][4];
    //su
    if (title != "" && title != "WARMUP" && title != "COOLDOWN"){
      for (let i = 0; i < chartData.length; i++){
        if (chartData[i][4] == title){
          stageIndex = i;
          break;
        }
      }
    }

    if (title != "" && title != "WARMUP" && title != "COOLDOWN"){
      for (let i = 0; i < chartData.length; i++){
        if (chartData[i][4] == title){
          stageIndex = i;
          break;
        }
      }
      for (let i = chartData.length - 1; i >= 0; i--){
        if (chartData[i][4] == title){
          stageEndIndex = i;
          break;
        }
      }
      intervalRange = stageEndIndex - stageIndex + 1;
    }

    //su
    if(title.match("WARMUP")){
      chartData.splice(0, 1);
      colors.splice(0, 1);
      this.setState({hasWarm:false})
    }
    else if(title.match("COOLDOWN")){
      chartData.splice(stageIndex, 1);
      colors.splice(stageIndex, 1);
      this.setState({hasCool:false})
    }
    else{
      chartData.splice(stageIndex, intervalRange);
      colors.splice(stageIndex, intervalRange);
    }

    this.setState({
      chartData,
      colors,
      showPopFrm: false,
      selectedIndex: undefined,
      selectedStage: undefined,
      stageChanged: true
    });

    this.updateChart();
  }

  //hf
  saveStage() {
    let chartData = this.state.chartData;
    let selectedStage = this.state.selectedStage;

    // save change to chartData
    // clear selected index and stage
    this.setState({
      chartData:chartData,
      showPopFrm: false,
      selectedIndex: undefined,
      selectedStage: undefined,
      stageChanged: true
    });

    this.updateChart();
  }

  //hf
  // handle text prompt
  handlePromptChange(e) {
    let selectedStage = this.state.selectedStage;

    selectedStage[3][0][1] = e.target.value;

    this.setState({
      selectedStage
    });
  }

  //hf
  // handle distance
  handleDistanceChange(e) {
    let selectedStage = this.state.selectedStage;

    selectedStage[3][1][1] = e.target.value;

    this.setState({
      selectedStage
    });
  }

  //hf
  // handle add var value
  handleVarTxt(e) {
    this.setState({
      addValue: e.target.value
    });
  }

  //hf
  // close txtfrm
  handleShowTxtFrm2() {
    this.setState({
      showTxtFrm: !this.state.showTxtFrm
    });
  }



  //hf
  handleSelectChange(e) {
    let selectedStage = this.state.selectedStage;

    selectedStage[3][1][2] = e.target.value;

    this.setState({
      selectedStage
    });
  }

  //hf
  handleShowInputFrm() {
    this.setState({
      showInputFrm: !this.state.showInputFrm
    });
  }

  //hf
  // save add var to selected stage
  handleSaveAddVar() {
    let selectedStage = this.state.selectedStage;

    selectedStage[3].push([this.state.addText, this.state.addValue]);

    this.setState({
      showVarFrm: !this.state.showVarFrm,
      selectedStage,
      addText: '',
      addValue: ''
    });
  }

  //hf
  // handle added var
  handleAddVar(index, e) {
    let selectedStage = this.state.selectedStage;

    selectedStage[3][index][1] = e.target.value;

    this.setState({
      selectedStage
    });
  }

  //hf
  // close add var frm
  handleShowVarFrm2() {
    this.setState({
      showVarFrm: !this.state.showVarFrm,
      addText: '',
      addValue: ''
    });
  }

  // Charttest end
  handleClose() {
    this.props.hideAddSession();
  }

  // handle distance unit
  handleDistanceUnit(e){
		this.setState({session: { ...this.state.session, unit: e.target.value} });
	}

  handleDistance(e) {
    this.setState({
      session: { ...this.state.session, distance: e.target.value }
    });
  }

  addVideo(e) {
    e.preventDefault();
    let videos = [...this.state.session.videos];
    videos.push('');
    this.setState({ session: { ...this.state.session, videos } });
  }

  handleVideoText(e) {
    let videos = [...this.state.session.videos];
    videos[e.target.name] = e.target.value;
    this.setState({ session: { ...this.state.session, videos } });
  }

  removeVideo(e) {
    e.preventDefault();
    let videos = [...this.state.session.videos];
    videos.splice(e.target.name, 1);
    this.setState({ session: { ...this.state.session, videos } });
  }

  addWarmCool(stages) {
    if (!this.state.hasWarmCool) {
      // let stages = this.state.chartData;
      stages.splice(0, 0, [
        'warmup',
        1,
        5,
        [['Text Prompt:', 'warm up'], ['Distance:', 10, 'm']],
        'WARMUP'
      ]);
      this.state.colors.splice(
          0,
          0,
          this.state.stageColors[[stages[0][1]] - 1]
      );
      stages.push([
        'cooldown',
        1,
        5,
        [['Text Prompt:', 'cooldown'], ['Distance:', 10, 'm']],
        'COOLDOWN'
      ]);
      this.state.colors.push(
          this.state.stageColors[[stages[stages.length - 1][1]] - 1]
      );
      this.setState({ hasWarmCool: true , hasWarm: true, hasCool :true});
      this.setState({ chartData: stages });
      this.state.totalDuration = this.state.totalDuration + 10;
      this.state.totalLoad = this.state.totalLoad + 10;
    }
  }
  updateSessionChart() {
    // e.preventDefault();
    // console.log(this.state.chartData)
    let edit = this.state.edit;
    if(edit){
      let stages = this.state.chartData;
      let lenth = stages.length;
      console.log(lenth)
      this.setState({ stageIndex: lenth - 1 , hasWarmCool: true});
      this.updateChart();
      if( lenth !== 0 ){
        let warmtitle = this.state.chartData[0][4];
        let cooltitle = this.state.chartData[lenth - 1][4];
        if (warmtitle == "WARMUP"){
          this.setState({ hasWarm: true});
        }
        if (cooltitle == "COOLDOWN"){
          this.setState({ hasCool: true});
        }
      }
      this.state.totalDuration = this.state.totalDuration + 5;
      this.state.totalLoad = this.state.totalLoad + 5;
    }
  }
  addStagez1(e) {
    e.preventDefault();
    let stages = this.state.chartData;
    this.addWarmCool(stages);
    stages.splice(stages.length - 1, 0, [
      'stage' + this.state.stageIndex,
      1,
      5,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      ''
    ]);
    this.setState({ chartData: stages, stageIndex: this.state.stageIndex + 1 });
    this.updateChart();
    this.state.totalDuration = this.state.totalDuration + 5;
    this.state.totalLoad = this.state.totalLoad + 5;
  }

  addStagez2(e) {
    e.preventDefault();
    let stages = this.state.chartData;
    this.addWarmCool(stages);

    stages.splice(stages.length - 1, 0, [
      'stage' + this.state.stageIndex,
      2,
      5,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      ''
    ]);
    this.setState({ chartData: stages, stageIndex: this.state.stageIndex + 1 });
    this.updateChart();
    this.state.totalDuration = this.state.totalDuration + 5;
    this.state.totalLoad = this.state.totalLoad + 10;
  }

  addStagez3(e) {
    e.preventDefault();
    let stages = this.state.chartData;
    this.addWarmCool(stages);
    stages.splice(stages.length - 1, 0, [
      'stage' + this.state.stageIndex,
      3,
      5,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      ''
    ]);
    this.setState({ chartData: stages, stageIndex: this.state.stageIndex + 1 });
    this.updateChart();
    this.state.totalDuration = this.state.totalDuration + 5;
    this.state.totalLoad = this.state.totalLoad + 15;
  }

  addStagez4(e) {
    e.preventDefault();
    let stages = this.state.chartData;
    this.addWarmCool(stages);
    stages.splice(stages.length - 1, 0, [
      'stage' + this.state.stageIndex,
      4,
      5,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      ''
    ]);
    this.setState({ chartData: stages, stageIndex: this.state.stageIndex + 1 });
    this.updateChart();
    this.state.totalDuration = this.state.totalDuration + 5;
    this.state.totalLoad = this.state.totalLoad + 20;
  }

  addStagez5(e) {
    e.preventDefault();
    let stages = this.state.chartData;
    this.addWarmCool(stages);
    stages.splice(stages.length - 1, 0, [
      'stage' + this.state.stageIndex,
      5,
      5,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      ''
    ]);
    this.setState({ chartData: stages, stageIndex: this.state.stageIndex + 1 });
    this.updateChart();
    this.state.totalDuration = this.state.totalDuration + 5;
    this.state.totalLoad = this.state.totalLoad + 25;
  }

  addStagez6(e) {
    e.preventDefault();
    let stages = this.state.chartData;
    this.addWarmCool(stages);
    stages.splice(stages.length - 1, 0, [
      'stage' + this.state.stageIndex,
      6,
      5,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      ''
    ]);

    this.setState({ chartData: stages, stageIndex: this.state.stageIndex + 1 });
    this.updateChart();
    this.state.totalDuration = this.state.totalDuration + 5;
    this.state.totalLoad = this.state.totalLoad + 30;
  }

  addWarmUp(e) {
    e.preventDefault();
    let stages = this.state.chartData;
    let index = this.state.stageIndex;
    if (!this.state.hasWarm && this.state.hasWarmCool) {
      stages.splice(0, 0, [
        'warmup' ,
        1,
        5,
        [['Text Prompt:', 'warm up'], ['Distance:', 10, 'm']],
        'WARMUP'
      ]);
      this.setState({chartData: stages, stageIndex: index + 1, hasWarm: true});
      this.updateChart();
      this.state.totalDuration = this.state.totalDuration + 5;
      this.state.totalLoad = this.state.totalLoad + 5;
    }
    else if(this.state.hasWarmCool) {
      alert('already have Warmup!');
    }
    else{}
  }

  addUp(e) {
    e.preventDefault();
    let stages = this.state.chartData;
    let index = this.state.stageIndex;
    let startIndex = index;

    this.addWarmCool(stages);
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      2,
      5,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'UP' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      1,
      2,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'UP' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      3,
      5,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'UP' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      2,
      2,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'UP' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      4,
      5,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'UP' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      3,
      2,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'UP' + startIndex
    ]);
    index++;
    this.setState({ chartData: stages, stageIndex: index });
    this.updateChart();
    this.state.totalDuration = this.state.totalDuration + 21;
    this.state.totalLoad = this.state.totalLoad + 57;
  }

  addCoolDown(e) {
    e.preventDefault();
    let stages = this.state.chartData;
    let index = this.state.stageIndex;

    // this.addWarmCool(stages);
    if (!this.state.hasCool && this.state.hasWarmCool) {
      stages.push([
        'cooldown' ,
        1,
        5,
        [['Text Prompt:', 'cooldown'], ['Distance:', 10, 'm']],
        'COOLDOWN'
      ]);
      this.setState({chartData: stages, stageIndex: index + 1, hasCool:true});
      this.updateChart();
      this.state.totalDuration = this.state.totalDuration + 5;
      this.state.totalLoad = this.state.totalLoad + 5;
    }
    else if(this.state.hasWarmCool){
      alert('already have Cooldown!');
    }
    else{}
  }

  addDown(e) {
    e.preventDefault();
    let stages = this.state.chartData;
    let index = this.state.stageIndex;
    let startIndex = index;

    this.addWarmCool(stages);
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      3,
      2,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'DOWN' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      4,
      5,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'DOWN' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      2,
      2,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'DOWN' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      3,
      5,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'DOWN' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      1,
      2,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'DOWN' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      2,
      5,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'DOWN' + startIndex
    ]);
    index++;
    this.setState({ chartData: stages, stageIndex: index });
    this.updateChart();
    this.state.totalDuration = this.state.totalDuration + 21;
    this.state.totalLoad = this.state.totalLoad + 57;
  }

  addPyramid(e) {
    e.preventDefault();
    let stages = this.state.chartData;
    let index = this.state.stageIndex;
    let startIndex = index;

    this.addWarmCool(stages);
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      1,
      2,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'PYRAMID' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      2,
      5,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'PYRAMID' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      3,
      2,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'PYRAMID' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      4,
      3,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'PYRAMID' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      5,
      5,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'PYRAMID' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      3,
      2,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'PYRAMID' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      2,
      5,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'PYRAMID' + startIndex
    ]);
    index++;
    this.setState({ chartData: stages, stageIndex: index });
    this.updateChart();
    this.state.totalDuration = this.state.totalDuration + 24;
    this.state.totalLoad = this.state.totalLoad + 71;
  }

  addPlateau(e) {
    e.preventDefault();
    let stages = this.state.chartData;
    let index = this.state.stageIndex;
    let startIndex = index;

    this.addWarmCool(stages);
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      4,
      5,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'PLATEAU' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      3,
      2,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'PLATEAU' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      4,
      5,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'PLATEAU' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      3,
      2,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'PLATEAU' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      4,
      5,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'PLATEAU' + startIndex
    ]);
    index++;
    stages.splice(stages.length - 1, 0, [
      'stage' + index,
      3,
      2,
      [
        ['Text Prompt:', ''],
        ['Distance:', 0, 'm']
      ],
      'PLATEAU' + startIndex
    ]);
    index++;
    this.setState({ chartData: stages, stageIndex: index });
    this.updateChart();
    this.state.totalDuration = this.state.totalDuration + 19;
    this.state.totalLoad = this.state.totalLoad + 67;
  }

  //hf
  // change duration
  handleInputChange(event) {
    let selectedStage = this.state.selectedStage;

    selectedStage[2] = parseInt(event.target.value);

    this.setState({
      selectedStage
    });
  }
  //tags
  handleLikeTags(e) {
    this.setState(  {tags:e.target.value,session: {...this.state.session, tags: e.target.value}
    });

    if (e.target.value === '') {
      this.setState({
        linkTagDiv: { display: 'none' },
        linkTagsList: []
      });
    } else {
      linkTags(e.target.value).then(linkTagsList => {
        if (linkTagsList.length > 0) {
          this.setState({
            linkTagDiv: { display: 'block' },
            linkTagsList: linkTagsList
          });
        } else {
          this.setState({
            linkTagDiv: { display: 'none' }
          });
        }
      });
    }
  }
  //zy
  handleLikeFamilyName(e) {
    this.setState({session: {...this.state.session, familyName: e.target.value}
    });

    if (e.target.value === '') {
      this.setState({
        linkNameDiv: { display: 'none' },
        linkFamilyNameList: []
      });
    } else {
      linkFamilyName(e.target.value).then(linkFamilyNameList => {
        if (linkFamilyNameList.length > 0) {
          this.setState({
            linkNameDiv: { display: 'block' },
            linkFamilyNameList: linkFamilyNameList
          });
        } else {
          this.setState({
            linkNameDiv: { display: 'none' }
          });
        }
      });
    }
  }

  //zy
  handleClickFamilyName = familyName => {
    if (familyName === '') {
      this.setState({
        linkNameDiv: { display: 'none' }
      });
    } else {
      this.setState({
        linkNameDiv: { display: 'none' },
        familyName: familyName, session: {...this.state.session, familyName: familyName}
      });
    }
  };
  //tags
  handleClickTags = tags => {
    if (tags === '') {
      this.setState({
        linkTagDiv: { display: 'none' }
      });
    } else {
      this.setState({
        linkTagDiv: { display: 'none' },
        tags: tags
      });
    }
  };
  // adds zy
  sessionSave = type => {
    //get totalduration and totalload data
    var duration = document.getElementsByClassName("total-duration");
    var totalduration = duration[0].innerText;
    var numArrDuration = totalduration.match(/\d+/g);
    numArrDuration = numArrDuration[0];
    numArrDuration = parseInt(numArrDuration);
    var load = document.getElementsByClassName("total-intensity");

    var totalload = load[0].innerText;
    var numArrLoad = totalload.match(/\d+/g);
    numArrLoad = numArrLoad[0];
    numArrLoad = parseInt(numArrLoad);
    //chart data  zy
    if(this.state.session.title === ''){
      alert("Please enter a title");
      return;
    }

    let json = this.generateJson(this.state.desLines, numArrDuration, numArrLoad, this.state.stageType);
    //desJson add zy
    let sessionSaveObj = {
      title: this.state.session.title,
      familyName: this.state.session.familyName,
      //tags
      tags:this.state.tags,
      activityType: this.state.session.activityType,
      athleteLevel: this.state.session.athleteLevel,
      sportsKeywords: this.state.session.sportsKeywords,
      components: this.state.session.components,
      chatData: this.state.chartData,
      totalDuration: numArrDuration,
      totalLoad: numArrLoad,
      type: type,
      addedBy:this.state.session.addedBy,
      clubId:this.state.session.clubId,
      description:this.state.session.description,
      videos:this.state.session.videos,
      image:this.state.session.image,
      hasWarmCool:this.state.hasWarmCool,
      hasWarm:this.state.hasWarm,
      hasCool:this.state.hasCool,
      stageType:this.state.stageType,
      desJson:json,
    };

    this.setState({totalDuration:numArrDuration , totalLoad: numArrLoad })

    sessionSave(sessionSaveObj).then(vresult => {
      alert(vresult.message);
      let close = vresult.message;
      if (close !== 'Title already exists!' && close !== 'Update session fail!'){
        this.handleClose();
      }
    });
  };

  generateJson(desLines, duration, load, stageType){
    //this.state.desLines
    var jsonObj = {
      
      "workoutName": this.state.session.title,
      "description": "Description_for the wokrout",
      "workoutId": null,
      "sport": "CYCLING",
      "WARMUP": [],
      "COOLDOWN": [],
      "MAINSET": [],
      "steps": [
          {
              "type": "WorkoutStep",
              "stepId": 1475,
              "stepOrder": 1,
              "intensity": "WARMUP",
              "description": null,
              "durationType": "CALORIES",
              "durationValue": 2,
              "durationValueType": null,
              "targetType": "OPEN",
              "targetValue": null,
              "targetValueLow": null,
              "targetValueHigh": null,
              "targetValueType": null
          },
          {
              "type": "WorkoutRepeatStep",
              "stepId": 1476,
              "stepOrder": 2,
              "repeatType": null,
              "repeatValue": null,
              "steps": [
                  {
                      "type": "WorkoutStep",
                      "stepId": 1477,
                      "stepOrder": 5,
                      "intensity": "ACTIVE",
                      "description": null,
                      "durationType": "TIME",
                      "durationValue": 120,
                      "durationValueType": null,
                      "targetType": "POWER",
                      "targetValue": 1,
                      "targetValueLow": null,
                      "targetValueHigh": null,
                      "targetValueType": null
                  },
                  {
                      "type": "WorkoutStep",
                      "stepId": 1478,
                      "stepOrder": 6,
                      "intensity": "ACTIVE",
                      "description": null,
                      "durationType": "DISTANCE",
                      "durationValue": 32186.880859,
                      "durationValueType": "MILE",
                      "targetType": "OPEN",
                      "targetValue": null,
                      "targetValueLow": null,
                      "targetValueHigh": null,
                      "targetValueType": null
                  }
              ]
          }
      ]
    }
      // "workoutName": this.state.session.title,
      // "totalLoad": load,
      // "totalXAxis": duration + stageType.split("-")[1],
      // "WARMUP": [],
      // "COOLDOWN": [],
      // "MAINSET": []
    

    for (let i = 0; i <= desLines.length - 1; i++){
      if (desLines[i].props.class == "desLinesTitle"){
        let attr = desLines[i].props.children;
        for (let j = i + 1; j <= desLines.length - 1; j++){
          if (desLines[j].props.class == "desLinesTitle"){
            i = j - 1;
            break;
          }
          jsonObj[attr].push(desLines[j].props.children);
        }
      }
    }

    // change the object into json string
    let json = JSON.stringify(jsonObj);
    return json;
  }


  handleTitle(e) {
    this.setState({
      session: { ...this.state.session, title: e.target.value }
    });
  }

  handleAthleteLevel(e){
		this.setState({session: { ...this.state.session, athleteLevel : e.target.value} });
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

  deleteKeyword(ind, e) {
    e.preventDefault();
    let keywords = [...this.state.session.keywords];
    keywords.splice(ind, 1);
    this.setState({ session: { ...this.state.session, keywords } });
  }

  uploadImage(e) {
    let sessImage = this.uploadImageRef.current.files[0];
    let fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

    if (sessImage === undefined) {
      alert('Please select image file to upload');
    } else if (fileTypes.indexOf(sessImage.type) === -1) {
      alert('Please select file type of JPEG, JPG, PNG or GIF');
    } else {
      const Imagedata = new FormData();
      Imagedata.append('sessImage', sessImage);
      sessionImageUpload(Imagedata).then(imgUpload => {
        //alert();
        this.setState({
          session: { ...this.state.session, image: imgUpload.filename }
        });
      });
    }
  }

  removeImage() {
    this.setState({ session: { ...this.state.session, image: '' } });
  }

  handleSessionActivity(e) {
    this.setState({
      session: { ...this.state.session, activityType: e.target.value }
    });
  }

  handleSessionSports(e) {
    this.setState({
      session: { ...this.state.session, sportsKeywords: e.target.value }
    });
  }

  handleSessionIntervals(e) {
    if (e.target.value === 'up') {
      this.addUp(e);
    }
    if (e.target.value === 'down') {
      this.addDown(e);
    }
    if (e.target.value === 'pyramid') {
      this.addPyramid(e);
    }
    if (e.target.value === 'plateau') {
      this.addPlateau(e);
    }
    this.setState({
      session: { ...this.state.session, intervalsType: e.target.value }
    });
  }

  handleSessionComponent(e) {
    this.setState({
      session: { ...this.state.session, components: e.target.value }
    });
  }

  //Ashlynn switch x-axis
  handleSessionStagesType(e) {
    var format = "";
    if (e.target.value == "Duration-min") {
      format = 'intensity: <b> z{point.y}</b><br>' + 'duration: <b>{point.z} min</b><br>';
    }else if (e.target.value == "Distance-km"){
      format = 'intensity: <b> z{point.y}</b><br>' + 'distance: <b>{point.z} km</b><br>';
    }else if (e.target.value == "Distance-m"){
      format = 'intensity: <b> z{point.y}</b><br>' + 'distance: <b>{point.z} m</b><br>';
    }

    if (e.target.value != this.state.stageType){
      var data = [];
      var description = [
        {
          title: "WARMUP",
          descriptionList: []
        },
        {
          title: "MAINSET",
          descriptionList: []
        },
        {
          title: "COOLDOWN",
          descriptionList: []
        }
      ];

      this.setState({stageType: e.target.value, chartData: data, hasWarmCool: false, desLines: [],
        chartOptions: {
          series: [
            {
              allowPointSelect: false,
              showInLegend: true,
              name: 'workout stages',
              data: data,
              type: 'variwide',
              dataLabels: {
                enabled: true,
                format: 'z{point.y:.0f}'
              },
              tooltip: {
                pointFormat: format
              },
              colorByPoint: true
            }
          ]
        }
      }, () => {
        var desAndLines = this.generateDescription(description, data, this.state.stageType, []);
        this.setState({session: {...this.state.session, description: desAndLines.description}, desLines: desAndLines.desLines});
      });
    }
  }

  closeAlert() {
    this.props.closeAlert();
  }

  //Budgerigar
  editWorkoutTitle() {
    this.setState({ editTitle: true });
  }

  editWorkoutTitleDone() {
    if (this.state.session.title == '') {
      this.setState({
        session: { ...this.state.session, title: 'Workout Builder' }
      });
    }
    this.setState({ editTitle: false });
  }

  minusStages(){
    let index = this.state.selectedIndex;
    let chartData = this.state.chartData;
    let colors = this.state.colors;

    let stageIndex = index;
    let stageEndIndex = stageIndex + 1;
    let intervalRange = 1;
    let title = chartData[stageIndex][4];

    if (title.match("PLATEAU")){
      for (let i = 0; i < chartData.length; i++){
        if (chartData[i][4] == title){
          stageIndex = i;
          break;
        }
      }
      for (let i = chartData.length - 1; i >= 0; i--){
        if (chartData[i][4] == title){
          stageEndIndex = i;
          break;
        }
      }
      intervalRange = stageEndIndex - stageIndex + 1;
    } else {return;}

    chartData.splice(stageEndIndex - 1, 2);
    colors.splice(stageEndIndex - 1, 2);

    this.setState({
      selectedIndex: undefined,
      selectedStage: undefined,
      colors,
      stageChanged: true,
      showPopFrm: false,
      chartData
    });

    this.updateChart();
  }

  addStages(){
    let index = this.state.selectedIndex;
    let chartData = this.state.chartData;
    let colors = this.state.colors;

    let stageIndex = index;
    let stageEndIndex = stageIndex + 1;
    let intervalRange = 1;
    let title = chartData[stageIndex][4];

    if (title.match("PLATEAU")){
      for (let i = 0; i < chartData.length; i++){
        if (chartData[i][4] == title){
          stageIndex = i;
          break;
        }
      }
      for (let i = chartData.length - 1; i >= 0; i--){
        if (chartData[i][4] == title){
          stageEndIndex = i;
          break;
        }
      }
      intervalRange = stageEndIndex - stageIndex + 1;
    } else {return;}

    var addOne = ['stage' + this.state.stageIndex,
      chartData[stageIndex][1],
      chartData[stageIndex][2],
      chartData[stageIndex][3],
      chartData[stageIndex][4]];
    var addOneColor = colors.slice(stageIndex);
    stageIndex++;
    var addTwo = ['stage' + (this.state.stageIndex + 1),
      chartData[stageIndex][1],
      chartData[stageIndex][2],
      chartData[stageIndex][3],
      chartData[stageIndex][4]];
    var addTwoColor = colors.slice(stageIndex);

    chartData.splice(stageEndIndex + 1, 0, addOne);
    chartData.splice(stageEndIndex + 2, 0, addTwo);
    colors.splice(stageEndIndex + 1, 0, addOneColor);
    colors.splice(stageEndIndex + 2, 0, addTwoColor);
    this.setState({
      selectedIndex: undefined,
      selectedStage: undefined,
      colors,
      stageChanged: true,
      showPopFrm: false,
      stageIndex: this.state.stageIndex + 2,
      chartData
    });

    this.updateChart();
  }

  render() {
    const { chartOptions, hoverData } = this.state;
    if (this.state.loading) {
      return (
          <Modal
              centered
              size="lg"
              show={true}
              onHide={this.handleClose}
              dialogClassName="individual stage"
          >
            <Modal.Header closeButton>
              <Modal.Title>
                {this.props.sessionId != null ? 'Edit' : 'Add'} Session
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="modal-container-loading">
                <img src={loading} alt="" />
              </div>
            </Modal.Body>
          </Modal>
      );
    }

    let durationHours = [],
        durationMinutes = [],
        rpeHours = [],
        rpeMinutes = [],
        keywordsList = [],
        sportsGroup = '',
        sportsList = [],
        alertMessage = ''
    ;

    for (let i = 0; i <= 24; i++) {
      durationHours.push(
          <option key={'addSessionHours' + i} value={i}>
            {i}
          </option>
      );
    }
    for (let i = 0; i <= 59; i++) {
      durationMinutes.push(
          <option key={'addSessionMinutes' + i} value={i}>
            {i}
          </option>
      );
    }

    for (let i = 0; i <= 24; i++) {
      rpeHours.push(
          <option key={'addSessionHours' + i} value={i}>
            {i}
          </option>
      );
    }
    for (let i = 0; i <= 59; i++) {
      rpeMinutes.push(
          <option key={'addSessionMinutes' + i} value={i}>
            {i}
          </option>
      );
    }

    //Budgerigar SportsKeywords
    this.props.sessionSportsKeywords.forEach((item, ind) => {
      if (item.group !== '' && sportsGroup !== item.group) {
        sportsList.push(
            <option key={'sports-keyword-group-' + item._id} value="groupName">
              {' '}
              —— {item.group} ——{' '}
            </option>
        );
        sportsGroup = item.group;
      }

      sportsList.push(
          <option key={'sports-keyword-' + item._id} value={item._id}>
            {item.title}
          </option>
      );
    });

    let rpe_txt_arr = [];
    let rpe_val_arr = [];
    let rpe_title_arr = [
      'Very Very Easy',
      'Easy',
      'Moderate',
      'Some What Hard',
      'Hard',
      '6/10',
      'Very Hard',
      '8/10',
      '9/10',
      'Maximal'
    ];
    let rpe_color_arr = [
      '#00ffff',
      '#00ff00',
      '#ffff00',
      '#ff9933',
      '#ff6633',
      '#ff3333',
      '#cc3333',
      '#663399',
      '#330066',
      '#000000'
    ];
    //su change
    
    const options = {
      credits: { enabled: false },
      chart: { type: 'column' },
      title: { text: 'Rating Perceived Effort' },
      subtitle: { text: '' },
      xAxis: { categories: rpe_txt_arr, crosshair: true },
      yAxis: { min: 0, title: { text: 'Min(s)' } },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat:
            '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y} min(s)</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: { column: { pointPadding: 0.2, borderWidth: 0 } },
      series: [
        {
          name: 'Rating Perceived Effort',
          data: rpe_val_arr
        }
      ]
    };

    if (this.props.alertMessage) {
      alertMessage = (
          <Alert variant="success" dismissible onClose={this.closeAlert}>
            {this.props.alertMessage}
          </Alert>
      );
    }
    if (this.props.error) {
      alertMessage = (
          <Alert variant="danger" dismissible onClose={this.closeAlert}>
            {this.props.error}
          </Alert>
      );
    }

    /*return (
        <Modal
            centered
            size="lg"
            show={true}
            onHide={this.handleClose}
            dialogClassName="modal-70w planner-dialog adsesn adsesnWindow"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {this.props.sessionId != null ? 'Edit' : 'Add'} Session
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {alertMessage}
              <Row>
                <div className="workoutPlanName">
                  <Form.Control
                      required
                      disabled={!this.state.editTitle}
                      type="text"
                      id={'workoutTitle'}
                      className="sessionNameInput"
                      value={this.state.session.title}
                      onChange={this.handleTitle}
                  />
                  <Image
                      className={
                        this.state.editTitle ? 'titleEditNone' : 'titleEdit'
                      }
                      onClick={this.editWorkoutTitle}
                      src={this.state.icons[0]}
                  />
                  <Image
                      className={
                        this.state.editTitle ? 'titleEdit' : 'titleEditNone'
                      }
                      onClick={this.editWorkoutTitleDone}
                      src={this.state.icons[1]}
                  />

                  //{/** adds zy **///}
                  /*<Button
                      variant="coaching-mate"
                      className="btn-sm sessionSaveAs"
                      onClick={this.sessionSave.bind(this, 'saveas')}
                  >
                    Save As
                  </Button>

                  <Button
                      variant="coaching-mate"
                      className="btn-sm sessionSaveAs sessionSave"
                      onClick={this.sessionSave.bind(this, 'save')}
                  >
                    Save
                  </Button>
                </div>
                <Col md={3} className="sesatr leftTopBlock" id={'attrForm'}>
                  <div style={{ background: 'white', paddingRight: '0px' }}>
                    <Form.Row>
                      <Form.Group as={Col} controlId="addSessionFamilyName">
                        <Form.Label>Family Name</Form.Label>
                        <Form.Control
                            className="attrInput"
                            as="input"
                            value={this.state.session.familyName}
                            onChange={this.handleLikeFamilyName}
                        ></Form.Control>
                      </Form.Group>
                      <div style={this.state.linkNameDiv} className="linkDivCss">
                        <ul className="linkUlCss">
                          {this.state.linkFamilyNameList.map((item, index) => {
                            return (
                                <li
                                    className={this.state.linkLiCss}
                                    onClick={this.handleClickFamilyName.bind(
                                        this,
                                        item
                                    )}
                                >
                                  {item}
                                </li>
                            );
                          })}
                        </ul>
                      </div>
                    </Form.Row>*/
                    //{/*tags*/}
                    /*<Form.Row>
                      <Form.Group as={Col} controlId="addTags">
                        <Form.Label>Tags</Form.Label>
                        <Form.Control
                            className="attrInput"
                            as="input"
                            value={this.state.tags}
                            onChange={this.handleLikeTags}
                        ></Form.Control>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="addSessionActivityTypes">
                        <Form.Label>Activity Type</Form.Label>
                        <Form.Control
                            className="attrInput"
                            as="select"
                            value={this.state.session.activityType}
                            onChange={this.handleSessionActivity}
                        >
                          <option value="">Select Activity Type</option>
                          {this.props.sessionActivityTypes.map(
                              sessionActivityType => (
                                  <option>{sessionActivityType.title}</option>
                              )
                          )}
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="addSessionAthleteLevel">
                        <Form.Label>Athlete Level</Form.Label>
                        <Form.Control
                            className="attrInput"
                            as="select"
                            value={this.state.session.athleteLevel}
                            onChange={this.handleAthleteLevel}
                        >
                          <option value="">Select Athlete Level</option>
                          {this.state.athleteLevelOptionList.map(function (
                              levels
                          ) {
                            return <option>{levels}</option>;
                          })}
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="addSessionSportsKeywords">
                        <Form.Label>Sports Keyword</Form.Label>
                        <Form.Control
                            className="attrInput"
                            as="select"
                            value={this.state.session.sportsKeywords}
                            onChange={this.handleSessionSports}
                        >
                          <option value="">Select Sports Keyword</option>
                          // adds zy
                          {this.state.sportsKeywordsOptionList.map(function(sportsList) {
                            return <option>{sportsList}</option>
                          })}
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="addSessionComponent">
                        <Form.Label>Component</Form.Label>
                        <Form.Control
                            className="attrInput"
                            as="select"
                            value={this.state.session.components}
                            onChange={this.handleSessionComponent}
                        >
                          <option value="">Select Component</option>
                          {this.props.sessionComponents.map(sessionComponent => (
                              <option>{sessionComponent.title}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="changeXAxis">
                        <Form.Label>X-axis</Form.Label>
                        <Form.Control
                            className="attrInput"
                            as="select"
                            value={this.state.stageType}
                            onChange={this.handleSessionStagesType}
                        >
                          <option value="Duration-min">Duration-minute</option>
                          <option value="Distance-km">Distance-km</option>
                          <option value="Distance-m">Distance-m</option>
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                  </div>
                </Col>
                <Col md={6}>
                  <div>*/
                    //{/*desBlock*/}
                    /*<Form.Row class="middleBlock">
                      <Form.Group controlId="addSessionDescription">
                        <p class="desTitle">Description</p>
                        <div class="descriptionBlock">{this.state.desLines}</div>
                      </Form.Group>
                    </Form.Row>
                  </div>
                </Col>
                <Col md={3}>
                  <div>
                    <Form.Group controlId="addSessionImage">
                      <div className={"addpictext"}>
                        Upload Image
                        <Image className="addpic" src={'http://localhost:3001/uploads/images/img/addpic.png'} />
                      </div>
                      <Form.Control type="file" ref={this.uploadImageRef}/>
                    </Form.Group>
                    <Form.Row>
                      <Form.Group controlId="addSessionImageUpload">
                        <Button
                            variant="coaching-mate"
                            className="btn-sm commenstyle"
                            onClick={this.uploadImage}
                        >
                          Upload
                        </Button>
                      </Form.Group>
                      <Form.Group controlId="addSessionImageRemove">
                        <Button
                            variant="coaching-mate btn-sm commenstyle"
                            onClick={this.removeImage}
                        >
                          Remove
                        </Button>
                      </Form.Group>
                    </Form.Row>
                    {this.state.session.image && (
                        <Form.Row>
                          <img
                              src={
                                'http://localhost:3001/uploads/session/' +
                                this.state.session.image
                              }
                              style={{width: '100%', marginBottom: '15px'}}
                              alt=""
                          />
                        </Form.Row>
                    )}
                    <Form.Group controlId="addSessionVideo">
                      <div className="add-video-links">
                        <div className={"addvideotext"}>Add/Edit Video Links</div>
                        <div className="sess-videos">
                          {this.state.session.videos.map((video, ind) => (
                              <div key={"sess-video" + ind} className="sess-video">
                                <input type="text" className="sess-video-links " name={ind} value={video}
                                       onChange={this.handleVideoText}/>
                                <a href="remove-video" className="remove-sess-video" name={ind}
                                   onClick={this.removeVideo}>X</a>
                              </div>
                          ))}
                        </div>
                        <Button
                            variant="coaching-mate btn-sm commenstyle"
                            onClick={this.addVideo}>Add More</Button>
                      </div>
                    </Form.Group>
                  </div>
                </Col>

                <div className="workoutPlan">
                  <div className={"totalRPE"}>
                    <div className="total-duration">
                      Total {this.state.stageType.split("-")[0]} :{' '}
                      {this.state.chartData.reduce(
                          (prev, cur) => (prev += cur[2]),
                          0
                      )}{' '}
                      {this.state.stageType.split("-")[1]}
                    </div>
                    <div className="total-intensity">
                      Total Load:{' '}
                      {this.state.chartData.reduce(
                          (prev, cur) => (prev += cur[1] * cur[2]),
                          0
                      )}
                    </div>
                  </div>

                  <div>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={chartOptions}
                    />
                  </div>
                  <Form.Group
                      controlId="addStage"
                      className={'workoutPlanControlBoard'}
                  >
                    <Button
                        variant="coaching-mate"
                        className="btn-sm stagez1style "
                        onClick={this.addStagez1}
                    >
                      z1
                    </Button>
                    <Button
                        variant="coaching-mate"
                        className="btn-sm stagez2style "
                        onClick={this.addStagez2}
                    >
                      z2
                    </Button>
                    <Button
                        variant="coaching-mate"
                        className="btn-sm stagez3style "
                        onClick={this.addStagez3}
                    >
                      z3
                    </Button>
                    <Button
                        variant="coaching-mate"
                        className="btn-sm stagez4style "
                        onClick={this.addStagez4}
                    >
                      z4
                    </Button>
                    <Button
                        variant="coaching-mate"
                        className="btn-sm stagez5style "
                        onClick={this.addStagez5}
                    >
                      z5
                    </Button>
                    <Button
                        variant="coaching-mate"
                        className="btn-sm stagez6style "
                        onClick={this.addStagez6}
                    >
                      z6
                    </Button>
                    <Button
                        variant="coaching-mate"
                        className="btn-sm stageblankstyle "
                    >
                      {' '}
                    </Button>
                    <Button
                        variant="coaching-mate"
                        className="btn-sm stagewarmupstyle "
                        onClick={this.addWarmUp}
                    >
                      warm up
                    </Button>
                    <Button
                        variant="coaching-mate"
                        className="btn-sm stagecooldownstyle "
                        onClick={this.addCoolDown}
                    >
                      cool down
                    </Button>
                    <Form.Control
                        className="intervalsInput"
                        as="select"
                        value={this.state.intervalsType}
                        onChange={this.handleSessionIntervals}
                    >
                      <option value="intervals" selected="selected">
                        Intervals
                      </option>
                      <option value="up">Up</option>
                      <option value="down">Down</option>
                      <option value="pyramid">Pyramid</option>
                      <option value="plateau">Plateau</option>
                    </Form.Control>
                  </Form.Group>
                </div>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>*/
          //{/* hf */}
 
    // Merged the code from Redback to our code base 

    return (
        <Modal
            centered
            size="xl"
            show={true}
            onHide={this.handleClose}
            dialogClassName="modal-95w planner-dialog adsesn"
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {this.props.sessionId != null ? 'Edit' : 'Add'} Session
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              {alertMessage}
              <Row>
                <Col md={3} className="sesatr" id={'attrForm'}>
                  <div>
                    <Form.Label>Distance Unit</Form.Label>
                    <Form.Group controlId="addSessionUnit">
                      <Form.Check inline label="Km" type={'radio'} id={'addSessionUnitKm'} name={'addSessionUnit'} value={'km'} checked={this.state.session.unit === 'km' ? true : false} onChange={this.handleDistanceUnit} style={{width: '50%'}} />
                      <Form.Check inline label="Miles" type={'radio'} id={'addSessionUnitMiles'} name={'addSessionUnit'} value={'miles'} checked={this.state.session.unit === 'miles' ? true : false} onChange={this.handleDistanceUnit} />
                    </Form.Group>
                    <Form.Row>
                      <Form.Group as={Col} controlId="addSessionFamilyName">
                        <Form.Label>Family Name</Form.Label>
                        <Form.Control
                            as="select"
                            value={this.state.familyName}
                            onChange={this.handleFamilyName}
                            style={{maxWidth: 'none'}}
                        >
                          <option value="">Select Family Name</option>
                          {this.props.familyNames.map(familyName => (
                            <option key={"family-name-"+familyName._id} value={familyName._id}>{familyName.name}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                      <div style={this.state.linkNameDiv} className="linkDivCss">
                        <ul className="linkUlCss">
                          {this.state.linkFamilyNameList.map((item, index) => {
                            return (
                                <li
                                    className={this.state.linkLiCss}
                                    onClick={this.handleClickFamilyName.bind(
                                        this,
                                        item
                                    )}
                                >
                                  {item}
                                </li>
                            );
                          })}
                        </ul>
                      </div>
                    </Form.Row>
                    {/*tags*/}
                    <Form.Row>
                      <Form.Group controlId="addSessionKeywords" style={{width: '100%'}}>
                        <Form.Label>Keywords</Form.Label>
                        <div>
                          <ul className="add-session-keywords" style={{display: 'block'}}>
                            {keywordsList}
                            <li className="keyword-new"><Form.Control type="text" value={this.state.keyword} onChange={this.handleKeyword} onKeyUp={this.addKeyword} onKeyDown={this.removeKeyword} /></li>
                          </ul>
                        </div>
                        {/*<Form.Control
                            className="attrInput"
                            as="input"
                            value={this.state.tags}
                            onChange={this.handleLikeTags}
                        ></Form.Control>*/}
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="addSessionAthleteLevel">
                        <Form.Label>Athlete Level</Form.Label>
                        <Form.Group controlId="addSessionAthleteLevel">
                          <Form.Check inline label="Elite" type={'radio'} id={'addSessionAthleteLevelElite'} name={'addSessionAthleteLevel'} value={'Elite'}   checked={this.state.session.athleteLevel === 'Elite' ? true : false} onChange={this.handleAthleteLevel} style={{width: '50%'}} />
                          <Form.Check inline label="Advanced" type={'radio'} id={'addSessionAthleteLevelAdvanced'} name={'addSessionAthleteLevel'} value={'Advanced'}   checked={this.state.session.athleteLevel === 'Advanced' ? true : false} onChange={this.handleAthleteLevel} />
                          <Form.Check inline label="Intermediate/Advanced" type={'radio'} id={'addSessionAthleteLevelIntermediateAdvanced'} name={'addSessionAthleteLevel'} value={'Intermediate/Advanced'}   checked={this.state.session.athleteLevel === 'Intermediate/Advanced' ? true : false} onChange={this.handleAthleteLevel} />
                          <Form.Check inline label="Intermediate" type={'radio'} id={'addSessionAthleteLevelIntermediate'} name={'addSessionAthleteLevel'} value={'Intermediate'}   checked={this.state.session.athleteLevel === 'Intermediate' ? true : false} onChange={this.handleAthleteLevel} />
                          <Form.Check inline label="Low/Intermediate" type={'radio'} id={'addSessionAthleteLevelLowIntermediate'} name={'addSessionAthleteLevel'} value={'Low/Intermediate'}   checked={this.state.session.athleteLevel === 'Low/Intermediate' ? true : false} onChange={this.handleAthleteLevel} />
                          <Form.Check inline label="Novice" type={'radio'} id={'addSessionAthleteLevelNovice'} name={'addSessionAthleteLevel'} value={'Novice'}   checked={this.state.session.athleteLevel === 'Novice' ? true : false} onChange={this.handleAthleteLevel} />
                        </Form.Group>

                        {/*<Form.Control
                            className="attrInput"
                            as="select"
                            value={this.state.session.athleteLevel}
                            onChange={this.handleAthleteLevel}
                        >
                          <option value="">Select Athlete Level</option>
                          {this.state.athleteLevelOptionList.map(function (
                              levels
                          ) {
                            return <option>{levels}</option>;
                          })}
                        </Form.Control>*/}
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group controlId="addSessionVideo">
                        <div className="add-video-links">
                          <div className={"addvideotext"}>Add/Edit Video Links</div>
                          <div className="sess-videos">
                            {this.state.session.videos.map((video, ind) => (
                                <div key={"sess-video" + ind} className="sess-video">
                                  <input type="text" className="sess-video-links " name={ind} value={video}
                                        onChange={this.handleVideoText}/>
                                  <a href="remove-video" className="remove-sess-video" name={ind}
                                    onClick={this.removeVideo}>X</a>
                                </div>
                            ))}
                          </div>
                          <Button
                              variant="coaching-mate btn-sm commenstyle"
                              onClick={this.addVideo}>Add More</Button>
                        </div>
                      </Form.Group>
                    </Form.Row>
                    <Form.Row>
                      <Form.Group as={Col} controlId="changeXAxis">
                        <Form.Label>X-axis</Form.Label>
                        <Form.Control
                            as="select"
                            value={this.state.stageType}
                            onChange={this.handleSessionStagesType}
                        >
                          <option value="Duration-min">Duration-minute</option>
                          <option value="Distance-km">Distance-km</option>
                          <option value="Distance-m">Distance-m</option>
                        </Form.Control>
                      </Form.Group>
                    </Form.Row>
                  </div>
                </Col>
                <Col md={6}>
                  <div>
                    <Form.Row>
                      <Form.Group as={Col} controlId="addSessionTitle">
                        <Form.Control required  type="text" id={'workoutTitle'} value={this.state.session.title} onChange={this.handleTitle} />
                        {/*<Image className={this.state.editTitle ? 'titleEditNone' : 'titleEdit'} onClick={this.editWorkoutTitle} src={this.state.icons[0]} />
                        <Image className={this.state.editTitle ? 'titleEdit' : 'titleEditNone'} onClick={this.editWorkoutTitleDone} src={this.state.icons[1]} />*/}
                      </Form.Group>

                      <Form.Group as={Col} controlId="addSessionSave">
                        {/** adds zy **/}
                        {this.props.sessionId != null && <Button variant="coaching-mate" className="btn-sm sessionSaveAs" onClick={this.sessionSave.bind(this, 'saveas')}>Save As New</Button>}
                        <Button variant="coaching-mate" className="btn-sm sessionSaveAs sessionSave" onClick={this.sessionSave.bind(this, 'save')}>{this.props.sessionId != null ? 'Update' : 'Create'}</Button>
                      </Form.Group>
                    </Form.Row>
                    {/*desBlock*/}
                    <Form.Row className="middleBlock">
                      <Form.Group controlId="addSessionDescription" style={{width: '100%'}}>
                        <p className="desTitle">Description</p>
                        <div className="descriptionBlock">{this.state.desLines}</div>
                      </Form.Group>
                    </Form.Row>

                    <div className={"totalRPE"}>
                      <div className="total-duration">
                        Total {this.state.stageType.split("-")[0]} :{' '}
                        {this.state.chartData.reduce(
                            (prev, cur) => (prev += cur[2]),
                            0
                        )}{' '}
                        {this.state.stageType.split("-")[1]}
                      </div>
                      <div className="total-intensity">
                        Total Load:{' '}
                        {this.state.chartData.reduce(
                            (prev, cur) => (prev += cur[1] * cur[2]),
                            0
                        )}
                      </div>
                    </div>
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
                      <Form.Group controlId="addSessionUploadedImage">
                        {this.state.session.image && (
                          <Form.Row style={{width: '50px', marginLeft: '20px'}}>
                            <img src={'http://localhost:3001/uploads/session/' + this.state.session.image} style={{width: '100%', marginBottom: '15px'}} alt="" />
                          </Form.Row>
                        )}
                      </Form.Group>
                    </Form.Row>

                    <Form.Label>Activity & Components</Form.Label>
                    <Accordion defaultActiveKey="0">
                      <Card className="keyopt">
                        <Card.Header>
                          <Accordion.Toggle as={Button} variant="link" eventKey="0">Activity Type</Accordion.Toggle>
                        </Card.Header>
                        <Accordion.Collapse eventKey="0">
                          <Card.Body>
                            <div className="radio-buttons">
                              {this.props.sessionActivityTypes.map(sessionActivityType => (
                                <div key={"session-activity-"+sessionActivityType.value}>
                                  <input id={"session-activity-"+sessionActivityType.value} name="activity" type="radio" value={sessionActivityType.value} onChange={this.handleSessionActivity} defaultChecked={this.state.session.activityType === sessionActivityType.value ? true : false} />
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
                          <Accordion.Toggle as={Button} variant="link" eventKey="1">Sport Keywords</Accordion.Toggle>
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
                          <Accordion.Toggle as={Button} variant="link" eventKey="2">Components</Accordion.Toggle>
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
                  </div>
                </Col>

                <div className="workoutPlan">
                  <div style={{margin:'0px 20px'}}>
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={chartOptions}
                    />
                  </div>
                  <Form.Group
                      controlId="addStage"
                      className={'workoutPlanControlBoard'}
                  >
                    <Button
                        variant="coaching-mate"
                        className="btn-sm stagez1style "
                        onClick={this.addStagez1}
                    >
                      z1
                    </Button>
                    <Button
                        variant="coaching-mate"
                        className="btn-sm stagez2style "
                        onClick={this.addStagez2}
                    >
                      z2
                    </Button>
                    <Button variant="coaching-mate" className="btn-sm stagez3style " onClick={this.addStagez3}>z3</Button>
                    <Button variant="coaching-mate" className="btn-sm stagez4style " onClick={this.addStagez4}>z4</Button>
                    <Button variant="coaching-mate" className="btn-sm stagez5style " onClick={this.addStagez5}>z5</Button>
                    <Button variant="coaching-mate" className="btn-sm stagez6style " onClick={this.addStagez6}>z6</Button>
                    <Button variant="coaching-mate" className="btn-sm stageblankstyle ">{' '}</Button>
                    <Button variant="coaching-mate" className="btn-sm stagewarmupstyle " onClick={this.addWarmUp}>warm up</Button>
                    <Button variant="coaching-mate" className="btn-sm stagecooldownstyle " onClick={this.addCoolDown}>cool down</Button>
                    <Form.Control className="intervalsInput" as="select" value={this.state.intervalsType} onChange={this.handleSessionIntervals}>
                      <option value="intervals" selected="selected">Intervals</option>
                      <option value="up">Ascending</option>
                      <option value="down">Descending</option>
                      <option value="pyramid">Pyramid</option>
                      <option value="plateau">Plateau</option>
                    </Form.Control>
                  </Form.Group>
                </div>
              </Row>
            </Form>
          </Modal.Body>
          <Modal.Footer>
          </Modal.Footer>
          {/* hf */}

          {this.state.selectedIndex === undefined ? (
              ''
          ) : (
              <div
                  id="popFrm"
                  className={this.state.showPopFrm ? 'word-style' : 'word-style hide'}
              >
                <Form
                    className="form1"
                    id="popFrm1"
                    style={{ left: this.state.leftLoc - 150 }}
                >
                  <div className="icons">
                    <img
                        className="ico"
                        src={arrowLeft}
                        alt=""
                        onClick={this.prevStage.bind(this)}
                    />
                    <img
                        className="ico"
                        src={arrowRight}
                        alt=""
                        onClick={this.netxStage.bind(this)}
                    />
                    <img
                        className="ico close"
                        src={closeIcon}
                        onClick={this.removeStage.bind(this)}
                        alt=""
                    />
                    <img
                        className="ico"
                        src={duplicateIcon}
                        onClick={this.duplicateStage.bind(this)}
                        alt=""
                    />
                    <img
                        className="ico"
                        src={"http://localhost:3001/uploads/images/complete.png"}
                        alt=""
                        onClick={this.saveStage.bind(this)}
                    />
                  </div>

                  <div class="items">
                    <img
                        src={clockIcon}
                        class="time_ico"
                        alt=""
                    />
                    <input
                        type="number"
                        value={
                          this.state.selectedStage !== undefined
                              ? this.state.selectedStage[2]
                              : 0
                        }
                        onChange={this.handleInputChange.bind(this)}
                        class="list time_int"
                        style={{
                          display: this.state.showInputFrm ? 'inline-block' : 'none'
                        }}
                    />
                    <span
                        class="time_reslut"
                        style={{
                          display: this.state.showInputFrm ? 'none' : 'inline-block'
                        }}
                    >
                                    {' '}
                      {this.state.selectedStage != undefined
                          ? this.state.selectedStage[2]
                          : 0}{' '}
                      min
                                    </span>
                    <img
                        src={modificationIcon}
                        onClick={this.handleShowInputFrm.bind(this)}
                        class="edit_ico"
                        alt=""
                    />
                  </div>

                  <div class="items items_sp">
                    <span>Text Prompt:</span>
                    <input
                        class="list addText"
                        placeholder="+ Add Text Prompt"
                        value={this.state.selectedStage[3][0][1]}
                        onChange={this.handlePromptChange.bind(this)}
                    />
                  </div>
                  <div class="items">
                    <span>Distance:</span>
                    <input
                        type="number"
                        class="list"
                        style={{width: 150}}
                        placeholder="Distance"
                        value={this.state.selectedStage[3][1][1]}
                        onInput={this.handleDistanceChange.bind(this)}
                    />
                    <select
                        name=""
                        value={this.state.selectedStage[3][1][2]}
                        onChange={this.handleSelectChange.bind(this)}
                        id=""
                        class="list"
                    >
                      <option value="m">m</option>
                      <option value="km">km</option>
                    </select>
                  </div>
                  {this.state.selectedStage[3].map((item, index) => {
                    if (index <= 1) {
                      return '';
                    }

                    return (
                        <div class="items items_sp">
                          <span>{item[0]}</span>
                          <input
                              class="list addText"
                              placeholder="+ Add Text Prompt"
                              value={item[1]}
                              onChange={this.handleAddVar.bind(this, index)}
                          />
                        </div>
                    );
                  })}
                  <div
                      class="list items footer form1_footer"
                      onClick={this.handleShowVarFrm2.bind(this)}
                  >
                    + Add Variables
                  </div>
                  <div className="items addAndMinus">
                    <span style={{color: "black"}}>Add or Minus:</span>
                    <Button onClick={this.minusStages}> - </Button>
                    <Button onClick={this.addStages}> + </Button>
                  </div>
                </Form>

                <div
                    className="form2"
                    style={{
                      left: this.state.leftLoc - 100,
                      display: this.state.showTxtFrm ? 'block' : 'none'
                    }}
                >
                  <h2>Add a Text Prompt</h2>
                  <div class="txt">
                    <textarea name="" id="p_content"></textarea>
                  </div>
                  <div class="btn_div">
                    <button class="save" onClick={this.handleSaveAddVar.bind(this)}>
                      Save
                    </button>
                    <button
                        class="cancel"
                        onClick={this.handleShowTxtFrm2.bind(this)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <div
                    className="form3"
                    style={{
                      left: this.state.leftLoc - 100,
                      display: this.state.showVarFrm ? 'block' : 'none'
                    }}
                >
                  <h2>Add Variables</h2>
                  <div class="form3_list">
                    <span>Variable Name:</span>
                    <input
                        type="text"
                        class="insert_name"
                        value={this.state.addText}
                        onChange={this.handleVarName.bind(this)}
                    />
                  </div>

                  <div class="form3_list">
                    <span>Variable Text:</span>
                    <input
                        type="text"
                        class="input2 insert_content"
                        value={this.state.addValue}
                        onChange={this.handleVarTxt.bind(this)}
                    />
                  </div>
                  <div class="footer">
                    <button
                        class="form3_save"
                        onClick={this.handleSaveAddVar.bind(this)}
                    >
                      Save
                    </button>
                    <button
                        class="form3_cancel"
                        onClick={this.handleShowVarFrm2.bind(this)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
          )}
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
    error: state.planner.error,
    //tags
    tags: state.planner.tags,
  };
};

export default connect(mapStateToProps, {
  hideAddSession,
  loadAddSessionData,
  createSession,
  closeAlert,
  updateSession,
  updateSeachSession
})(AddSession);






// //Budgerigar
// import React, { Component } from 'react';

// import { connect } from 'react-redux';
// import {
//   hideAddSession,
//   loadAddSessionData,
//   createSession,
//   closeAlert,
//   updateSession,
//   updateSeachSession
// } from '../../../actions';
// import { sessionImageUpload } from '../../../utils/api.js';
// import { getSessionIcons } from '../../../utils/api.js';
// import { linkFamilyName, linkTags, sessionSave } from '../../../utils/api.js';
// import { Image } from 'react-bootstrap';
// import Modal from 'react-bootstrap/Modal';
// import Form from 'react-bootstrap/Form';
// import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
// import Alert from 'react-bootstrap/Alert';
// import Button from 'react-bootstrap/Button';
// import * as Highcharts from 'highcharts';
// import variwide from 'highcharts/modules/variwide';
// import dragable from 'highcharts/modules/draggable-points';
// import HighchartsReact from 'highcharts-react-official';

// import loading from '../../../assets/loading.svg';
// import arrowLeft from '../../../assets/arrowLeft.png';
// import arrowRight from '../../../assets/arrowRight.png';
// import closeIcon from '../../../assets/close.png';
// import duplicateIcon from '../../../assets/duplicate.png';
// import clockIcon from '../../../assets/clock.png';
// import modificationIcon from '../../../assets/modification.png';

// variwide(Highcharts);
// dragable(Highcharts);



// class AddSession extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       hoverData: null,
//       edit:false,
//       // chart end
//       session: {
//         _id: '',
//         title: 'Workout Builder',
//         distance: 0,
//         unit: 'km',
//         hours: 0,
//         minutes: 0,
//         sessTime: 0,
//         rpe: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//         rpeLoad: 0,
//         wp: [0, 0, 0, 0, 0, 0, 0],
//         wpLoad: 0,
//         tags:'',
//         videos: [],
//         stages: [],
//         familyName: '',
//         athleteLevel: '',
//         description: [],
//         keywords: [],
//         image: '',
//         activityType: '',
//         intervalsType: '',
//         sportsKeywords: '',
//         components: '',
//         sessionType: 'normal',
//         addedBy: props.user.userId,
//         clubId: props.club._id,
//         desJson: {}//JSON file
//       },
//       tags:'',
//       rpeEffort: 1,
//       rpeHours: 0,
//       rpeMinutes: 0,
//       rpeTotalHours: 0,
//       rpeTotalMinutes: 0,
//       rpeTotalTime: 0,
//       familyName: '',
//       keyword: '',
//       loading: true,
//       wpEffort: 1,
//       wpHours: 0,
//       wpMinutes: 0,
//       wpTotalHours: 0,
//       wpTotalMinutes: 0,
//       wpTotalTime: 0,

//       //hf
//       addPopFrm: false,
//       showPopFrm: false,
//       showTxtFrm: false,
//       showVarFrm: false,
//       showInputFrm: false,
//       selectedIndex: undefined,
//       selectedStage: undefined,
//       addText: undefined,
//       addValue: undefined,
//       stageIndex: 1,

//       //Budgerigar

//       //su
//       hasWarmCool: false,
//       hasWarm: false,
//       hasCool: false,
//       totalDuration: 0,
//       totalLoad: 0,
//       editTitle: false,
//       athleteLevelOptionList: [
//         'Elite',
//         'Advanced',
//         'Intermediate/Advanced',
//         'Intermediate',
//         'Low/Intermediate',
//         'Novice'
//       ],
//       sportsKeywordsOptionList:['Aerobics','Extreme Sports','Fitness Training','--Athletics--','Cross Country','Distant Running','Jumps and Throws'],
//       icons: [],
//       linkNameDiv: { display: 'none' },
//       linkFamilyNameList: [],
//       linkTagsDiv: { display: 'none' },
//       linkTagsList: [],
//       originalPoint: null,
//       finalStage: null,
//       chartData: [],
//       stageColors: [
//         '#c2c2c2',
//         '#89afe6',
//         '#9bc696',
//         '#f4dd84',
//         '#c97c5f',
//         '#a84c37'
//       ],
//       colors: [],
//       stageNames: [],
//       stageSeries: [],
//       desLines: [],
//       stageChanged: false,
//       stageType: "Duration-min",

//       chartOptions: {
//         credits: {
//           enabled: false
//         },
//         colors: this.stageColors,
//         title: { text: 'Workout Plan' },
//         xAxis: {
//           type: 'category'
//         },
//         yAxis: {
//           labels: {
//             format: 'z{value}'
//           },
//           title: 'intensity',
//           min: 0,
//           max: 6
//         },
//         caption: {
//           text: 'Column widths are proportional to Time'
//         },
//         legend: {
//           enabled: true
//         },
//         series: [
//           {
//             allowPointSelect: false,
//             showInLegend: true,
//             name: 'workout stages',
//             data: [],
//             type: 'variwide',
//             dataLabels: {
//               enabled: true,
//               format: 'z{point.y:.0f}'
//             },
//             dataSorting: {
//               enabled: false
//             },
//             colorByPoint: true
//           }
//         ],
//         plotOptions: {
//           type: 'column',
//           series: {
//             stickyTracking: false,
//             dragDrop: {
//               draggableY: true,
//               draggableX: true,
//               dragMinY: 0.1,
//               dragMaxY: 5.9
//             },
//             column: {
//               stacking: 'normal',
//               minPointLength: 20
//             },
//             line: {
//               //cursor: 'ns-resize'
//             },
//             tooltip: {
//               valueDecimals: 0
//             },
//             point: {
//               events: {
//                 mouseOver: this.setHoverData.bind(this),
//                 dragStart: function (e) {},
//                 drag: function (e) {},
//                 drop: function (e) {
//                   return false;
//                 }
//               }
//             },
//             borderRadius: 5
//           }
//         }
//       }
//     };

//     this.uploadImageRef = React.createRef();

//     this.handleClose = this.handleClose.bind(this);
//     this.closeAlert = this.closeAlert.bind(this);
//     this.handleDistance = this.handleDistance.bind(this);
//     this.addVideo = this.addVideo.bind(this);
//     this.updateSessionChart = this.updateSessionChart.bind(this);
//     this.addStagez1 = this.addStagez1.bind(this);
//     this.addStagez2 = this.addStagez2.bind(this);
//     this.addStagez3 = this.addStagez3.bind(this);
//     this.addStagez4 = this.addStagez4.bind(this);
//     this.addStagez5 = this.addStagez5.bind(this);
//     this.addStagez6 = this.addStagez6.bind(this);
//     this.addWarmCool = this.addWarmCool.bind(this);
//     this.addWarmUp = this.addWarmUp.bind(this);
//     this.addCoolDown = this.addCoolDown.bind(this);
//     this.addUp = this.addUp.bind(this);
//     this.addDown = this.addDown.bind(this);
//     this.addPyramid = this.addPyramid.bind(this);
//     this.addPlateau = this.addPlateau.bind(this);
//     this.handleLikeFamilyName = this.handleLikeFamilyName.bind(this);
//     this.handleVideoText = this.handleVideoText.bind(this);
//     this.removeVideo = this.removeVideo.bind(this);
//     this.handleTitle = this.handleTitle.bind(this);
//     this.handleAthleteLevel = this.handleAthleteLevel.bind(this);
//     this.deleteKeyword = this.deleteKeyword.bind(this);
//     this.uploadImage = this.uploadImage.bind(this);
//     this.removeImage = this.removeImage.bind(this);
//     this.handleSessionActivity = this.handleSessionActivity.bind(this);
//     this.handleSessionSports = this.handleSessionSports.bind(this);
//     this.handleSessionComponent = this.handleSessionComponent.bind(this);
//     this.handleSessionStagesType = this.handleSessionStagesType.bind(this);
//     this.handleSessionIntervals = this.handleSessionIntervals.bind(this);
//     this.editWorkoutTitle = this.editWorkoutTitle.bind(this);
//     this.editWorkoutTitleDone = this.editWorkoutTitleDone.bind(this);
//     this.generateJson = this.generateJson.bind(this);
//     this.minusStages = this.minusStages.bind(this);
//     this.addStages = this.addStages.bind(this);
//     //tags
//     this.handleLikeTags = this.handleLikeTags.bind(this)
//   }

//   componentDidMount() {
//     if (this.state.chartOptions.series[0].data) {
//       this.setState({ chartData: this.state.chartOptions.series[0].data});
//     }

//     if (this.props.sessionId !== null) {
//       this.props.loadAddSessionData(this.props.sessionId, this.props.club._id);
//     } else {
//       this.props.loadAddSessionData('add', this.props.club._id);
//     }

//     //Budgerigar icons
//     getSessionIcons().then(icons => {
//       this.setState({ icons: icons });
//     });

//     var originalStage = this.state.originalPoint;
//     var finalStage = this.state.finalStage;
//     var addSessionState = this;

//     function changeStageStart(e) {
//       if (!originalStage) {
//         originalStage = [e.chartX, e.chartY, e.target.z];
//       }
//     }

//     function changeStageDone(e) {
//       finalStage = [e.chartX, e.chartY, e.target.z];
//       var id = '' + e.newPointId;
//       update(e.newPoints[id].point.index);

//       addSessionState.setState({
//         chartData: addSessionState.state.chartOptions.series[0].data,
//         stageChanged: true,
//       });
//       originalStage = null;
//     }

//     // hf update data to chart
//     function update(stageIndex) {
//       var updateOption = '';
//       if (
//           Math.abs(finalStage[0] - originalStage[0]) <=
//           Math.abs(finalStage[1] - originalStage[1])
//       ) {
//         if (finalStage[1] - originalStage[1] >= 0) {
//           updateOption = 'y_Down';
//         } else {
//           updateOption = 'y_Up';
//         }
//       } else {
//         if (finalStage[0] - originalStage[0] >= 0) {
//           updateOption = 'x_Up';
//         } else {
//           updateOption = 'x_Down';
//         }
//       }

//       var data = addSessionState.state.chartData;
//       var newData = data;
//       var duration = addSessionState.state.totalDuration;
//       var load = addSessionState.state.totalLoad;

//       switch (updateOption) {
//         case 'y_Up': {
//           if (data[stageIndex][1] + 1 > 6) {
//             return;
//           }
//           newData[stageIndex] = [
//             data[stageIndex][0],
//             data[stageIndex][1] + 1,
//             data[stageIndex][2],
//             data[stageIndex][3],
//             data[stageIndex][4]
//           ];
//           if (newData[stageIndex][4].match("PLATEAU")){
//             plateauUpdate(newData, stageIndex, data);
//           }
//           load = load + data[stageIndex][2];
//           break;
//         }
//         case 'y_Down': {
//           if (data[stageIndex][1] - 1 < 1) {
//             return;
//           }
//           newData[stageIndex] = [
//             data[stageIndex][0],
//             data[stageIndex][1] - 1,
//             data[stageIndex][2],
//             data[stageIndex][3],
//             data[stageIndex][4]
//           ];
//           if (newData[stageIndex][4].match("PLATEAU")){
//             plateauUpdate(newData, stageIndex, data);
//           }
//           load = load - data[stageIndex][2];
//           break;
//         }
//         case 'x_Up': {
//           newData[stageIndex] = [
//             data[stageIndex][0],
//             data[stageIndex][1],
//             data[stageIndex][2] + 5,
//             data[stageIndex][3],
//             data[stageIndex][4]
//           ];
//           if (newData[stageIndex][4].match("PLATEAU")){
//             plateauUpdate(newData, stageIndex, data);
//           }
//           duration = duration + 5;
//           load = load + data[stageIndex][1] * 5;
//           break;
//         }
//         case 'x_Down': {
//           if (data[stageIndex][2] - 5 <= 0) {
//             return;
//           }
//           newData[stageIndex] = [
//             data[stageIndex][0],
//             data[stageIndex][1],
//             data[stageIndex][2] - 5,
//             data[stageIndex][3],
//             data[stageIndex][4]
//           ];
//           if (newData[stageIndex][4].match("PLATEAU")){
//             plateauUpdate(newData, stageIndex, data);
//           }
//           duration = duration - 5;
//           load = load - data[stageIndex][1] * 5;
//           break;
//         }
//         default: {
//           break;
//         }
//       }

//       function plateauUpdate(newData, stageIndex, data){
//         if (newData[stageIndex][4].match("PLATEAU")){
//           var plateau = newData[stageIndex][4];
//           var plateauStartNum = 0;
//           var plateauEndNum = 0;
//           for (let i = 0; i < data.length; i++){
//             if (data[i][4] == plateau){
//               plateauStartNum = i;
//               break;
//             }
//           }
//           for (let i = data.length - 1; i >= 0; i--){
//             if (data[i][4] == plateau) {
//               plateauEndNum = i;
//               break;
//             }
//           }

//           for (let i = plateauStartNum; i <= plateauEndNum; i++){
//             if ((stageIndex - i) % 2 == 0){
//               newData[i][1] = newData[stageIndex][1];
//               newData[i][2] = newData[stageIndex][2];
//             }
//           }
//         }
//       }

//       var colors = [];
//       addSessionState.state.chartData.forEach((a, b, c) => {
//         colors.push(addSessionState.state.stageColors[a[1] - 1]);
//       });

//       addSessionState.setState({
//         totalDuration: duration,
//         totalLoad: load,
//         colors:colors,
//         chartOptions: {
//           colors: colors,
//           series: [
//             {
//               allowPointSelect: false,
//               showInLegend: true,
//               name: 'workout stages',
//               data: newData,
//               type: 'variwide',
//               dataLabels: {
//                 enabled: true,
//                 format: 'z{point.y:.0f}'
//               },
//               colorByPoint: true
//             }
//           ]
//         }
//       });
//     }

//     //Ashlynn switch x-axix, initialization
//     var format = "";
//     if (this.state.stageType == "Duration-min") {
//       format = 'intensity: <b> z{point.y}</b><br>' + 'duration: <b>{point.z} min</b><br>';
//     }else if (this.state.stageType == "Distance-km"){
//       format = 'intensity: <b> z{point.y}</b><br>' + 'distance: <b>{point.z} km</b><br>';
//     }else if (this.state.stageType == "Distance-m"){
//       format = 'intensity: <b> z{point.y}</b><br>' + 'distance: <b>{point.z} m</b><br>';
//     }

//     //hf
//     // fix stage's color by it's height
//     this.state.chartData.forEach((a, b, c) => {
//       this.state.colors.push(this.state.stageColors[a[1] - 1]);
//       this.state.totalDuration = this.state.totalDuration + a[2];
//       this.state.totalLoad = this.state.totalLoad + a[1] * a[2];
//     });

//     this.setState({
//       chartOptions: {
//         credits: {
//           enabled: false
//         },
//         colors: this.state.colors,
//         title: { text: 'Workout Plan' },
//         xAxis: {
//           type: 'category'
//         },
//         yAxis: {
//           labels: {
//             format: 'z{value}'
//           },
//           title: 'intensity',
//           min: 0,
//           max: 6
//         },
//         caption: {
//           text: 'Column widths are proportional to Time'
//         },
//         legend: {
//           enabled: true
//         },
//         series: [
//           {
//             allowPointSelect: false,
//             showInLegend: true,
//             name: 'workout stages',
//             data: this.state.chartData,
//             type: 'variwide',
//             dataLabels: {
//               enabled: true,
//               format: 'z{point.y:.0f}'
//             },
//             tooltip: {
//               pointFormat: format
//             },
//             dataSorting: {
//               enabled: false
//             },
//             colorByPoint: true
//           }
//         ],
//         plotOptions: {
//           type: 'column',
//           series: {
//             stickyTracking: false,
//             dragDrop: {
//               draggableY: true,
//               draggableX: true,
//               dragMinY: 0.1,
//               dragMaxY: 5.9
//             },
//             column: {
//               stacking: 'normal',
//               minPointLength: 20
//             },
//             line: {
//               //cursor: 'ns-resize'
//             },
//             point: {
//               events: {
//                 mouseOver: this.setHoverData.bind(this),
//                 dragStart: function (e) {},
//                 drag: function (e) {
//                   changeStageStart(e);
//                   return false;
//                 },
//                 drop: function (e) {
//                   changeStageDone(e);
//                   return false;
//                 },
//                 // hf
//                 // handle stage click
//                 click: function (e) {
//                   const index = this.category;

//                   // set selected index and stage
//                   addSessionState.setState({
//                     showPopFrm: true,
//                     selectedIndex: index,
//                     selectedStage: addSessionState.state.chartData[index],
//                     leftLoc: this.clientX
//                   });
//                 }
//               }
//             },
//             borderRadius: 5
//           }
//         }
//       }
//     });
//   }

//   //Ashlynn Description Methods
//   componentDidUpdate(newProps,newState) {
//     if (newState.chartOptions.series[0].data.length < 1 || newState.chartData.length < 1) {
//       return;
//     }

//     var dataList = newState.chartData;
//     var description = [
//       {
//         title: "WARMUP",
//         descriptionList: []
//       },
//       {
//         title: "MAINSET",
//         descriptionList: []
//       },
//       {
//         title: "COOLDOWN",
//         descriptionList: []
//       }
//     ];

//     var desLines = [];

//     this.generateDescription(description, dataList, this.state.stageType, desLines);

//     if ( this.state.desLines.toString() !== desLines.toString() || this.state.stageChanged){
//       this.setState({session: {...this.state.session, description: description}, desLines: desLines, stageChanged: false})
//     }
//   }
//   //Ashlynn Description Methods
//   generateDescription(description, dataList, type, desLines) {
//     var desLine = '';
//     var intensity = 0;
//     var totalAmount = 0;
//     var durationOrDistance = type;

//     for (let i = 0; i < dataList.length; i++) {
//       // normal stages
//       if (dataList[i][4] == "") {
//         desLine = dataList[i][2]  + durationOrDistance.split("-")[1] + " @" + "T" + dataList[i][1];
//         if (dataList[i][3][0][1] != ""){
//           desLine = desLine + ": " + dataList[i][3][0][1];
//         }
//         description[1].descriptionList.push(desLine);
//       } // warmup
//       else if (dataList[i][4] == "WARMUP") {
//         desLine = dataList[i][2] + durationOrDistance.split("-")[1] + " @ " + "T" + dataList[i][1] ;
//         description[0].descriptionList.splice(0, 0, desLine);
//       } //cooldown
//       else if (dataList[i][4] == "COOLDOWN") {
//         desLine = dataList[i][2] + durationOrDistance.split("-")[1] + " @ " + "T" + dataList[i][1] + ": " + dataList[i][3][0][1];
//         description[2].descriptionList.splice(0, 0, desLine);
//       } // intervals
//       else {
//         let range = 1;
//         desLine = "";
//         let xAxis = durationOrDistance.split("-")[1];
//         let type = "";
//         let stageType = dataList[i][4];

//         for (let j = dataList.length - 1; j >= 0; j--){
//           if (dataList[j][4] == stageType){
//             range = j;
//             break;
//           }
//         }

//         if (stageType.match("UP")){
//           type = "UP";
//         }else if (stageType.match("DOWN")){
//           type = "DOWN";
//         }else if (stageType.match("PYRAMID")){
//           type = "PYRAMID";
//         }else if (stageType.match("PLATEAU")){
//           type = "PLATEAU";
//         }

//         for (let j = i; j <= range; j++){
//           if (dataList[j]){
//             totalAmount = totalAmount + dataList[j][2];
//             intensity = intensity + dataList[j][1];
//             if (j == i){
//               desLine = desLine + " ";
//             }
//             if (dataList[j][3][0][1] != ""){
//               desLine = desLine + dataList[j][2] + xAxis+ " @ "  + " T" + dataList[j][1] + ": " + dataList[j][3][0][1] ;
//             }else{
//               desLine = desLine  + dataList[j][2] + xAxis+ " @ "  + " T" + dataList[j][1] ;
//             }
//             if (j != range){
//               desLine = desLine + " , ";
//             }
//           }
//         }
//         if (desLine != ""){
//           desLine = totalAmount + " " + xAxis + " " + type + " @ "  + "T" + intensity + " | " + desLine;
//         }else{
//           desLine = totalAmount + " " + xAxis + " " + type + " @ " + "T" + intensity;
//         }
//         description[1].descriptionList.push(desLine);
//         totalAmount = 0;
//         intensity = 0;
//         i = range;
//       }
//     }
//     for (let i = 0; i < description.length; i++){
//       desLines.push(
//           <p class="desLinesTitle">{description[i].title}</p>
//       );
//       for (let j = 0; j < description[i].descriptionList.length; j++){
//         desLines.push(
//             <p class="desLines">{description[i].descriptionList[j]}</p>
//         );
//       }
//     }

//     var desAndLines = {
//       description: description,
//       desLines: desLines
//     }
//     return desAndLines;
//   }
//   //Ashlynn Description Methods

//   UNSAFE_componentWillReceiveProps(nextProps) {
//     if (nextProps.addSession && nextProps.alertMessage) {
//       this.clearForm();
//     } else if (nextProps.addSession && nextProps.error) {
//       this.setState({ loading: false });
//     } else if (nextProps.addSession && nextProps.session) {
//       let session = nextProps.session;
//       let familyName = '',
//           familyNameObj = '';
//       if (session.familyName) {
//         familyName = session.familyName._id;
//         familyNameObj = session.familyName;
//       }
//       //tags
//       let tags = '',
//           tagsObj = '';
//       if (session.tags) {
//         tags = session.tags._id;
//         tagsObj = session.tags;
//       }


//       this.setState({
//             session: {
//               _id: session._id,
//               title: session.title,
//               distance: session.distance,
//               unit: session.unit,
//               hours: session.hours,
//               minutes: session.minutes,
//               sessTime: session.sessTime,
//               rpeLoad: session.rpeLoad,
//               videos: session.videos,
//               familyName: familyNameObj,
//               athleteLevel: session.athleteLevel,
//               description: session.description,
//               keywords: session.keywords,
//               image: session.image,
//               activityType: session.activityType,
//               sportsKeywords: session.sportsKeyWords,
//               components: session.components,
//               sessionType: session.sessionType,
//               clubId: session.clubId,
//             },
//             tags: tagsObj,
//             edit: true,
//             chartData: session.chartData,
//             loading: false
//           }, () => {
//             this.updateChart();
//             this.updateSessionChart();
//           }
//       )
//     } else if (nextProps.addSession && nextProps.sessionActivityTypes) {
//       this.setState({ loading: false });
//     }
//   }

//   clearForm() {
//     this.setState({
//       session: {
//         _id: '',
//         title: '',
//         distance: 0,
//         unit: 'km',
//         hours: 0,
//         minutes: 0,
//         sessTime: 0,
//         rpe: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//         rpeLoad: 0,
//         videos: [],
//         stages: [],
//         familyName: '',
//         athleteLevel: '',
//         description: [],
//         keywords: [],
//         image: '',
//         activityType: '',
//         intervalsType: '',
//         sportsKeywords: '',
//         components: '',
//         sessionType: 'normal',
//         tags:'',
//       },
//       rpeEffort: 1,
//       rpeHours: 0,
//       rpeMinutes: 0,
//       rpeTotalHours: 0,
//       rpeTotalMinutes: 0,
//       rpeTotalTime: 0,
//       wpEffort: 1,
//       wpHours: 0,
//       wpMinutes: 0,
//       wpTotalHours: 0,
//       wpTotalMinutes: 0,
//       wpTotalTime: 0,
//       tags:'',
//       familyName: '',
//       keyword: '',
//       loading: false
//     });
//   }

//   setHoverData = e => {
//     this.setState({ hoverData: 1 + e.target.category });
//   };

//   //hf
//   // switch stage
//   //Ashlynn stage border test
//   prevStage() {
//     let index = this.state.selectedIndex,
//         left;
//     let chartData = this.state.chartData;

//     let stageIndex = index;
//     let stageEndIndex = stageIndex;
//     let intervalRange = 1;
//     let title = chartData[stageIndex][4];
//     var move = null;

//     if (title != "" && title != "WARMUP" && title != "COOLDOWN"){
//       for (let i = 0; i < chartData.length; i++){
//         if (chartData[i][4] == title){
//           stageIndex = i;
//           break;
//         }
//       }
//       for (let i = chartData.length - 1; i >= 0; i--){
//         if (chartData[i][4] == title){
//           stageEndIndex = i;
//           break;
//         }
//       }
//       intervalRange = stageEndIndex - stageIndex + 1;
//     }

//     // border testing
//     if(title.match("COOLDOWN") || title.match("WARMUP")){
//       return;
//     }else if(stageIndex == 1){
//       return;
//     }

//     move = chartData.splice(stageIndex, intervalRange);

//     if (index-- <= 0) {
//       index = 0;
//       left = this.state.leftLoc;
//     } else {
//       left = this.state.leftLoc - 200;
//     }

//     if (left < 0) {
//       left = 30;
//     }

//     let prevIndex = stageIndex - 1;
//     let prevStartIndex = 0;
//     let prevTitle = chartData[prevIndex][4];
//     let prevRange = 1;

//     if (prevTitle != "" && prevTitle != "WARMUP" && prevTitle != "COOLDOWN"){
//       for (let i = 0; i < chartData.length; i++){
//         if (chartData[i][4] == prevTitle){
//           prevStartIndex = i;
//           break;
//         }
//       }
//       prevRange = prevIndex - prevStartIndex + 1;
//     }

//     for (let i = 0; i < intervalRange; i++){
//       chartData.splice(stageIndex - prevRange + i, 0, move[i]);
//     }

//     this.setState({
//       leftLoc: left,
//       selectedIndex: index,
//       stageChanged: true,
//       showPopFrm: false,
//       chartData
//     });

//     this.updateChart();
//   }

//   //Ashlynn stage border test
//   netxStage() {
//     let index = this.state.selectedIndex,
//         left;
//     let chartData = this.state.chartData;

//     let stageIndex = index;
//     let stageEndIndex = stageIndex;
//     let intervalRange = 1;
//     let title = chartData[stageIndex][4];
//     var move = null;

//     if (title != "" && title != "WARMUP" && title != "COOLDOWN"){
//       for (let i = 0; i < chartData.length; i++){
//         if (chartData[i][4] == title){
//           stageIndex = i;
//           break;
//         }
//       }
//       for (let i = chartData.length - 1; i >= 0; i--){
//         if (chartData[i][4] == title){
//           stageEndIndex = i;
//           break;
//         }
//       }
//       intervalRange = stageEndIndex - stageIndex + 1;
//     }

//     //border testing
//     if(title.match("COOLDOWN") || title.match("WARMUP")){
//       return;
//     }
//     else if(stageEndIndex >= chartData.length - 2){
//       return;
//     }

//     let nextIndex = stageEndIndex + 1;
//     let nextEndIndex = 0;
//     let nextTitle = chartData[nextIndex][4];
//     let nextRange = 1;

//     if (nextTitle != "" && nextTitle != "WARMUP" && nextTitle != "COOLDOWN"){
//       for (let i = chartData.length - 1; i >= 0; i--){
//         if (chartData[i][4] == nextTitle){
//           nextEndIndex = i;
//           break;
//         }
//       }
//       nextRange = nextEndIndex - nextIndex + 1;
//     }

//     move = chartData.splice(stageIndex, intervalRange);

//     if (index++ >= this.state.chartData.length - 1) {
//       index = this.state.chartData.length - 1;
//       left = this.state.leftLoc;
//     } else {
//       left = this.state.leftLoc + 200;
//     }

//     if (left + 380 > window.innerWidth) {
//       left = window.innerWidth - 380;
//     }

//     for (let i = 0; i < intervalRange; i++){
//       chartData.splice(stageIndex + nextRange + i, 0, move[i]);
//     }

//     this.setState({
//       leftLoc: left,
//       selectedIndex: index,
//       stageChanged: true,
//       showPopFrm: false,
//       chartData: chartData
//     });

//     this.updateChart();
//   }

//   //hf
//   // update change to  chart
//   updateChart() {
//     const colors = this.state.chartData.map(
//         s => this.state.stageColors[s[1] - 1]
//     );

//     this.setState({
//       chartOptions: {
//         colors: colors,
//         series: [
//           {
//             allowPointSelect: false,
//             showInLegend: true,
//             name: 'workout stages',
//             data: this.state.chartData,
//             type: 'variwide',
//             dataLabels: {
//               enabled: true,
//               format: 'z{point.y:.0f}'
//             },
//             colorByPoint: true
//           }
//         ]
//       }
//     });
//   }

//   //hf
//   // handle add variable name
//   handleVarName(e) {
//     this.setState({
//       addText: e.target.value
//     });
//   }

//   //hf
//   // handle duplicate stage
//   duplicateStage() {
//     let chartData = this.state.chartData;
//     let colors = this.state.colors;
//     let selectedStage = [...chartData[this.state.selectedIndex]];
//     let selectedColor = colors[this.state.selectedIndex];

//     if (selectedStage[4] != ""){return;}

//     //hf
//     // get selected stage count
//     const length = chartData.filter(
//         n => n[0].indexOf(selectedStage[0]) >= 0
//     ).length;

//     selectedStage[0] = 'stage' + this.state.stageIndex;

//     // insert copy to chart data
//     chartData.splice(this.state.selectedIndex + 1, 0, selectedStage);
//     colors.splice(this.state.selectedIndex + 1, 0, selectedColor);

//     this.setState({
//       chartData,
//       colors,
//       showPopFrm: false,
//       selectedIndex: undefined,
//       selectedStage: undefined,
//       stageIndex: this.state.stageIndex + 1,
//       stageChanged: true
//     });

//     this.updateChart();
//   }

//   //hf
//   removeStage() {
//     let chartData = this.state.chartData;
//     let colors = this.state.colors;
//     let stageIndex = this.state.selectedIndex;
//     let stageEndIndex = stageIndex + 1;
//     let intervalRange = 1;
//     let title = chartData[stageIndex][4];
//     //su
//     if (title != "" && title != "WARMUP" && title != "COOLDOWN"){
//       for (let i = 0; i < chartData.length; i++){
//         if (chartData[i][4] == title){
//           stageIndex = i;
//           break;
//         }
//       }
//     }

//     if (title != "" && title != "WARMUP" && title != "COOLDOWN"){
//       for (let i = 0; i < chartData.length; i++){
//         if (chartData[i][4] == title){
//           stageIndex = i;
//           break;
//         }
//       }
//       for (let i = chartData.length - 1; i >= 0; i--){
//         if (chartData[i][4] == title){
//           stageEndIndex = i;
//           break;
//         }
//       }
//       intervalRange = stageEndIndex - stageIndex + 1;
//     }

//     //su
//     if(title.match("WARMUP")){
//       chartData.splice(0, 1);
//       colors.splice(0, 1);
//       this.setState({hasWarm:false})
//     }
//     else if(title.match("COOLDOWN")){
//       chartData.splice(stageIndex, 1);
//       colors.splice(stageIndex, 1);
//       this.setState({hasCool:false})
//     }
//     else{
//       chartData.splice(stageIndex, intervalRange);
//       colors.splice(stageIndex, intervalRange);
//     }

//     this.setState({
//       chartData,
//       colors,
//       showPopFrm: false,
//       selectedIndex: undefined,
//       selectedStage: undefined,
//       stageChanged: true
//     });

//     this.updateChart();
//   }

//   //hf
//   saveStage() {
//     let chartData = this.state.chartData;
//     let selectedStage = this.state.selectedStage;

//     // save change to chartData
//     // clear selected index and stage
//     this.setState({
//       chartData:chartData,
//       showPopFrm: false,
//       selectedIndex: undefined,
//       selectedStage: undefined,
//       stageChanged: true
//     });

//     this.updateChart();
//   }

//   //hf
//   // handle text prompt
//   handlePromptChange(e) {
//     let selectedStage = this.state.selectedStage;

//     selectedStage[3][0][1] = e.target.value;

//     this.setState({
//       selectedStage
//     });
//   }

//   //hf
//   // handle distance
//   handleDistanceChange(e) {
//     let selectedStage = this.state.selectedStage;

//     selectedStage[3][1][1] = e.target.value;

//     this.setState({
//       selectedStage
//     });
//   }

//   //hf
//   // handle add var value
//   handleVarTxt(e) {
//     this.setState({
//       addValue: e.target.value
//     });
//   }

//   //hf
//   // close txtfrm
//   handleShowTxtFrm2() {
//     this.setState({
//       showTxtFrm: !this.state.showTxtFrm
//     });
//   }



//   //hf
//   // handle distance unit
//   handleSelectChange(e) {
//     let selectedStage = this.state.selectedStage;

//     selectedStage[3][1][2] = e.target.value;

//     this.setState({
//       selectedStage
//     });
//   }

//   //hf
//   handleShowInputFrm() {
//     this.setState({
//       showInputFrm: !this.state.showInputFrm
//     });
//   }

//   //hf
//   // save add var to selected stage
//   handleSaveAddVar() {
//     let selectedStage = this.state.selectedStage;

//     selectedStage[3].push([this.state.addText, this.state.addValue]);

//     this.setState({
//       showVarFrm: !this.state.showVarFrm,
//       selectedStage,
//       addText: '',
//       addValue: ''
//     });
//   }

//   //hf
//   // handle added var
//   handleAddVar(index, e) {
//     let selectedStage = this.state.selectedStage;

//     selectedStage[3][index][1] = e.target.value;

//     this.setState({
//       selectedStage
//     });
//   }

//   //hf
//   // close add var frm
//   handleShowVarFrm2() {
//     this.setState({
//       showVarFrm: !this.state.showVarFrm,
//       addText: '',
//       addValue: ''
//     });
//   }

//   // Charttest end
//   handleClose() {
//     this.props.hideAddSession();
//   }

//   handleDistance(e) {
//     this.setState({
//       session: { ...this.state.session, distance: e.target.value }
//     });
//   }

//   addVideo(e) {
//     e.preventDefault();
//     let videos = [...this.state.session.videos];
//     videos.push('');
//     this.setState({ session: { ...this.state.session, videos } });
//   }

//   handleVideoText(e) {
//     let videos = [...this.state.session.videos];
//     videos[e.target.name] = e.target.value;
//     this.setState({ session: { ...this.state.session, videos } });
//   }

//   removeVideo(e) {
//     e.preventDefault();
//     let videos = [...this.state.session.videos];
//     videos.splice(e.target.name, 1);
//     this.setState({ session: { ...this.state.session, videos } });
//   }

//   addWarmCool(stages) {
//     if (!this.state.hasWarmCool) {
//       // let stages = this.state.chartData;
//       stages.splice(0, 0, [
//         'warmup',
//         1,
//         5,
//         [['Text Prompt:', 'warm up'], ['Distance:', 10, 'm']],
//         'WARMUP'
//       ]);
//       this.state.colors.splice(
//           0,
//           0,
//           this.state.stageColors[[stages[0][1]] - 1]
//       );
//       stages.push([
//         'cooldown',
//         1,
//         5,
//         [['Text Prompt:', 'cooldown'], ['Distance:', 10, 'm']],
//         'COOLDOWN'
//       ]);
//       this.state.colors.push(
//           this.state.stageColors[[stages[stages.length - 1][1]] - 1]
//       );
//       this.setState({ hasWarmCool: true , hasWarm: true, hasCool :true});
//       this.setState({ chartData: stages });
//       this.state.totalDuration = this.state.totalDuration + 10;
//       this.state.totalLoad = this.state.totalLoad + 10;
//     }
//   }
//   updateSessionChart() {
//     // e.preventDefault();
//     // console.log(this.state.chartData)
//     let edit = this.state.edit;
//     if(edit){
//       let stages = this.state.chartData;
//       let lenth = stages.length;
//       console.log(lenth)
//       this.setState({ stageIndex: lenth - 1 , hasWarmCool: true});
//       this.updateChart();
//       if( lenth !== 0 ){
//         let warmtitle = this.state.chartData[0][4];
//         let cooltitle = this.state.chartData[lenth - 1][4];
//         if (warmtitle == "WARMUP"){
//           this.setState({ hasWarm: true});
//         }
//         if (cooltitle == "COOLDOWN"){
//           this.setState({ hasCool: true});
//         }
//       }
//       this.state.totalDuration = this.state.totalDuration + 5;
//       this.state.totalLoad = this.state.totalLoad + 5;
//     }
//   }
//   addStagez1(e) {
//     e.preventDefault();
//     let stages = this.state.chartData;
//     this.addWarmCool(stages);
//     stages.splice(stages.length - 1, 0, [
//       'stage' + this.state.stageIndex,
//       1,
//       5,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       ''
//     ]);
//     this.setState({ chartData: stages, stageIndex: this.state.stageIndex + 1 });
//     this.updateChart();
//     this.state.totalDuration = this.state.totalDuration + 5;
//     this.state.totalLoad = this.state.totalLoad + 5;
//   }

//   addStagez2(e) {
//     e.preventDefault();
//     let stages = this.state.chartData;
//     this.addWarmCool(stages);

//     stages.splice(stages.length - 1, 0, [
//       'stage' + this.state.stageIndex,
//       2,
//       5,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       ''
//     ]);
//     this.setState({ chartData: stages, stageIndex: this.state.stageIndex + 1 });
//     this.updateChart();
//     this.state.totalDuration = this.state.totalDuration + 5;
//     this.state.totalLoad = this.state.totalLoad + 10;
//   }

//   addStagez3(e) {
//     e.preventDefault();
//     let stages = this.state.chartData;
//     this.addWarmCool(stages);
//     stages.splice(stages.length - 1, 0, [
//       'stage' + this.state.stageIndex,
//       3,
//       5,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       ''
//     ]);
//     this.setState({ chartData: stages, stageIndex: this.state.stageIndex + 1 });
//     this.updateChart();
//     this.state.totalDuration = this.state.totalDuration + 5;
//     this.state.totalLoad = this.state.totalLoad + 15;
//   }

//   addStagez4(e) {
//     e.preventDefault();
//     let stages = this.state.chartData;
//     this.addWarmCool(stages);
//     stages.splice(stages.length - 1, 0, [
//       'stage' + this.state.stageIndex,
//       4,
//       5,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       ''
//     ]);
//     this.setState({ chartData: stages, stageIndex: this.state.stageIndex + 1 });
//     this.updateChart();
//     this.state.totalDuration = this.state.totalDuration + 5;
//     this.state.totalLoad = this.state.totalLoad + 20;
//   }

//   addStagez5(e) {
//     e.preventDefault();
//     let stages = this.state.chartData;
//     this.addWarmCool(stages);
//     stages.splice(stages.length - 1, 0, [
//       'stage' + this.state.stageIndex,
//       5,
//       5,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       ''
//     ]);
//     this.setState({ chartData: stages, stageIndex: this.state.stageIndex + 1 });
//     this.updateChart();
//     this.state.totalDuration = this.state.totalDuration + 5;
//     this.state.totalLoad = this.state.totalLoad + 25;
//   }

//   addStagez6(e) {
//     e.preventDefault();
//     let stages = this.state.chartData;
//     this.addWarmCool(stages);
//     stages.splice(stages.length - 1, 0, [
//       'stage' + this.state.stageIndex,
//       6,
//       5,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       ''
//     ]);

//     this.setState({ chartData: stages, stageIndex: this.state.stageIndex + 1 });
//     this.updateChart();
//     this.state.totalDuration = this.state.totalDuration + 5;
//     this.state.totalLoad = this.state.totalLoad + 30;
//   }

//   addWarmUp(e) {
//     e.preventDefault();
//     let stages = this.state.chartData;
//     let index = this.state.stageIndex;
//     if (!this.state.hasWarm && this.state.hasWarmCool) {
//       stages.splice(0, 0, [
//         'warmup' ,
//         1,
//         5,
//         [['Text Prompt:', 'warm up'], ['Distance:', 10, 'm']],
//         'WARMUP'
//       ]);
//       this.setState({chartData: stages, stageIndex: index + 1, hasWarm: true});
//       this.updateChart();
//       this.state.totalDuration = this.state.totalDuration + 5;
//       this.state.totalLoad = this.state.totalLoad + 5;
//     }
//     else if(this.state.hasWarmCool) {
//       alert('already have Warmup!');
//     }
//     else{}
//   }

//   addUp(e) {
//     e.preventDefault();
//     let stages = this.state.chartData;
//     let index = this.state.stageIndex;
//     let startIndex = index;

//     this.addWarmCool(stages);
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       2,
//       5,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'UP' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       1,
//       2,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'UP' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       3,
//       5,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'UP' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       2,
//       2,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'UP' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       4,
//       5,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'UP' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       3,
//       2,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'UP' + startIndex
//     ]);
//     index++;
//     this.setState({ chartData: stages, stageIndex: index });
//     this.updateChart();
//     this.state.totalDuration = this.state.totalDuration + 21;
//     this.state.totalLoad = this.state.totalLoad + 57;
//   }

//   addCoolDown(e) {
//     e.preventDefault();
//     let stages = this.state.chartData;
//     let index = this.state.stageIndex;

//     // this.addWarmCool(stages);
//     if (!this.state.hasCool && this.state.hasWarmCool) {
//       stages.push([
//         'cooldown' ,
//         1,
//         5,
//         [['Text Prompt:', 'cooldown'], ['Distance:', 10, 'm']],
//         'COOLDOWN'
//       ]);
//       this.setState({chartData: stages, stageIndex: index + 1, hasCool:true});
//       this.updateChart();
//       this.state.totalDuration = this.state.totalDuration + 5;
//       this.state.totalLoad = this.state.totalLoad + 5;
//     }
//     else if(this.state.hasWarmCool){
//       alert('already have Cooldown!');
//     }
//     else{}
//   }

//   addDown(e) {
//     e.preventDefault();
//     let stages = this.state.chartData;
//     let index = this.state.stageIndex;
//     let startIndex = index;

//     this.addWarmCool(stages);
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       3,
//       2,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'DOWN' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       4,
//       5,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'DOWN' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       2,
//       2,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'DOWN' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       3,
//       5,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'DOWN' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       1,
//       2,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'DOWN' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       2,
//       5,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'DOWN' + startIndex
//     ]);
//     index++;
//     this.setState({ chartData: stages, stageIndex: index });
//     this.updateChart();
//     this.state.totalDuration = this.state.totalDuration + 21;
//     this.state.totalLoad = this.state.totalLoad + 57;
//   }

//   addPyramid(e) {
//     e.preventDefault();
//     let stages = this.state.chartData;
//     let index = this.state.stageIndex;
//     let startIndex = index;

//     this.addWarmCool(stages);
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       1,
//       2,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'PYRAMID' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       2,
//       5,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'PYRAMID' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       3,
//       2,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'PYRAMID' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       4,
//       3,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'PYRAMID' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       5,
//       5,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'PYRAMID' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       3,
//       2,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'PYRAMID' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       2,
//       5,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'PYRAMID' + startIndex
//     ]);
//     index++;
//     this.setState({ chartData: stages, stageIndex: index });
//     this.updateChart();
//     this.state.totalDuration = this.state.totalDuration + 24;
//     this.state.totalLoad = this.state.totalLoad + 71;
//   }

//   addPlateau(e) {
//     e.preventDefault();
//     let stages = this.state.chartData;
//     let index = this.state.stageIndex;
//     let startIndex = index;

//     this.addWarmCool(stages);
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       4,
//       5,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'PLATEAU' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       3,
//       2,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'PLATEAU' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       4,
//       5,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'PLATEAU' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       3,
//       2,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'PLATEAU' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       4,
//       5,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'PLATEAU' + startIndex
//     ]);
//     index++;
//     stages.splice(stages.length - 1, 0, [
//       'stage' + index,
//       3,
//       2,
//       [
//         ['Text Prompt:', ''],
//         ['Distance:', 0, 'm']
//       ],
//       'PLATEAU' + startIndex
//     ]);
//     index++;
//     this.setState({ chartData: stages, stageIndex: index });
//     this.updateChart();
//     this.state.totalDuration = this.state.totalDuration + 19;
//     this.state.totalLoad = this.state.totalLoad + 67;
//   }

//   //hf
//   // change duration
//   handleInputChange(event) {
//     let selectedStage = this.state.selectedStage;

//     selectedStage[2] = parseInt(event.target.value);

//     this.setState({
//       selectedStage
//     });
//   }
//   //tags
//   handleLikeTags(e) {
//     this.setState(  {tags:e.target.value,session: {...this.state.session, tags: e.target.value}
//     });

//     if (e.target.value === '') {
//       this.setState({
//         linkTagDiv: { display: 'none' },
//         linkTagsList: []
//       });
//     } else {
//       linkTags(e.target.value).then(linkTagsList => {
//         if (linkTagsList.length > 0) {
//           this.setState({
//             linkTagDiv: { display: 'block' },
//             linkTagsList: linkTagsList
//           });
//         } else {
//           this.setState({
//             linkTagDiv: { display: 'none' }
//           });
//         }
//       });
//     }
//   }
//   //zy
//   handleLikeFamilyName(e) {
//     this.setState({session: {...this.state.session, familyName: e.target.value}
//     });

//     if (e.target.value === '') {
//       this.setState({
//         linkNameDiv: { display: 'none' },
//         linkFamilyNameList: []
//       });
//     } else {
//       linkFamilyName(e.target.value).then(linkFamilyNameList => {
//         if (linkFamilyNameList.length > 0) {
//           this.setState({
//             linkNameDiv: { display: 'block' },
//             linkFamilyNameList: linkFamilyNameList
//           });
//         } else {
//           this.setState({
//             linkNameDiv: { display: 'none' }
//           });
//         }
//       });
//     }
//   }

//   //zy
//   handleClickFamilyName = familyName => {
//     if (familyName === '') {
//       this.setState({
//         linkNameDiv: { display: 'none' }
//       });
//     } else {
//       this.setState({
//         linkNameDiv: { display: 'none' },
//         familyName: familyName, session: {...this.state.session, familyName: familyName}
//       });
//     }
//   };
//   //tags
//   handleClickTags = tags => {
//     if (tags === '') {
//       this.setState({
//         linkTagDiv: { display: 'none' }
//       });
//     } else {
//       this.setState({
//         linkTagDiv: { display: 'none' },
//         tags: tags
//       });
//     }
//   };
//   // adds zy
//   sessionSave = type => {
//     //get totalduration and totalload data
//     var duration = document.getElementsByClassName("total-duration");
//     var totalduration = duration[0].innerText;
//     var numArrDuration = totalduration.match(/\d+/g);
//     numArrDuration = numArrDuration[0];
//     numArrDuration = parseInt(numArrDuration);
//     var load = document.getElementsByClassName("total-intensity");

//     var totalload = load[0].innerText;
//     var numArrLoad = totalload.match(/\d+/g);
//     numArrLoad = numArrLoad[0];
//     numArrLoad = parseInt(numArrLoad);
//     //chart data  zy
//     if(this.state.session.title === ''){
//       alert("Please enter a title");
//       return;
//     }

//     let json = this.generateJson(this.state.desLines, numArrDuration, numArrLoad, this.state.stageType);
//     //desJson add zy
//     let sessionSaveObj = {
//       title: this.state.session.title,
//       familyName: this.state.session.familyName,
//       //tags
//       tags:this.state.tags,
//       activityType: this.state.session.activityType,
//       athleteLevel: this.state.session.athleteLevel,
//       sportsKeywords: this.state.session.sportsKeywords,
//       components: this.state.session.components,
//       chatData: this.state.chartData,
//       totalDuration: numArrDuration,
//       totalLoad: numArrLoad,
//       type: type,
//       addedBy:this.state.session.addedBy,
//       clubId:this.state.session.clubId,
//       description:this.state.session.description,
//       videos:this.state.session.videos,
//       image:this.state.session.image,
//       hasWarmCool:this.state.hasWarmCool,
//       hasWarm:this.state.hasWarm,
//       hasCool:this.state.hasCool,
//       stageType:this.state.stageType,
//       desJson:json,
//     };

//     this.setState({totalDuration:numArrDuration , totalLoad: numArrLoad })

//     sessionSave(sessionSaveObj).then(vresult => {
//       alert(vresult.message);
//       let close = vresult.message;
//       if (close !== 'Title already exists!' && close !== 'Update session fail!'){
//         this.handleClose();
//       }
//     });
//   };

//   generateJson(desLines, duration, load, stageType){
//     //this.state.desLines
//     var jsonObj = {
//       "workoutName": this.state.session.title,
//       "totalLoad": load,
//       "totalXAxis": duration + stageType.split("-")[1],
//       "WARMUP": [],
//       "COOLDOWN": [],
//       "MAINSET": []
//     }

//     for (let i = 0; i <= desLines.length - 1; i++){
//       if (desLines[i].props.class == "desLinesTitle"){
//         let attr = desLines[i].props.children;
//         for (let j = i + 1; j <= desLines.length - 1; j++){
//           if (desLines[j].props.class == "desLinesTitle"){
//             i = j - 1;
//             break;
//           }
//           jsonObj[attr].push(desLines[j].props.children);
//         }
//       }
//     }

//     // change the object into json string
//     let json = JSON.stringify(jsonObj);
//     return json;
//   }

//   handleTitle(e) {
//     this.setState({
//       session: { ...this.state.session, title: e.target.value }
//     });
//   }

//   handleAthleteLevel(e) {
//     this.setState({
//       session: { ...this.state.session, athleteLevel: e.target.value }
//     });
//   }

//   deleteKeyword(ind, e) {
//     e.preventDefault();
//     let keywords = [...this.state.session.keywords];
//     keywords.splice(ind, 1);
//     this.setState({ session: { ...this.state.session, keywords } });
//   }

//   uploadImage(e) {
//     let sessImage = this.uploadImageRef.current.files[0];
//     let fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

//     if (sessImage === undefined) {
//       alert('Please select image file to upload');
//     } else if (fileTypes.indexOf(sessImage.type) === -1) {
//       alert('Please select file type of JPEG, JPG, PNG or GIF');
//     } else {
//       const Imagedata = new FormData();
//       Imagedata.append('sessImage', sessImage);
//       sessionImageUpload(Imagedata).then(imgUpload => {
//         //alert();
//         this.setState({
//           session: { ...this.state.session, image: imgUpload.filename }
//         });
//       });
//     }
//   }

//   removeImage() {
//     this.setState({ session: { ...this.state.session, image: '' } });
//   }

//   handleSessionActivity(e) {
//     this.setState({
//       session: { ...this.state.session, activityType: e.target.value }
//     });
//   }

//   handleSessionSports(e) {
//     this.setState({
//       session: { ...this.state.session, sportsKeywords: e.target.value }
//     });
//   }

//   handleSessionIntervals(e) {
//     if (e.target.value === 'up') {
//       this.addUp(e);
//     }
//     if (e.target.value === 'down') {
//       this.addDown(e);
//     }
//     if (e.target.value === 'pyramid') {
//       this.addPyramid(e);
//     }
//     if (e.target.value === 'plateau') {
//       this.addPlateau(e);
//     }
//     this.setState({
//       session: { ...this.state.session, intervalsType: e.target.value }
//     });
//   }

//   handleSessionComponent(e) {
//     this.setState({
//       session: { ...this.state.session, components: e.target.value }
//     });
//   }

//   //Ashlynn switch x-axis
//   handleSessionStagesType(e) {
//     var format = "";
//     if (e.target.value == "Duration-min") {
//       format = 'intensity: <b> z{point.y}</b><br>' + 'duration: <b>{point.z} min</b><br>';
//     }else if (e.target.value == "Distance-km"){
//       format = 'intensity: <b> z{point.y}</b><br>' + 'distance: <b>{point.z} km</b><br>';
//     }else if (e.target.value == "Distance-m"){
//       format = 'intensity: <b> z{point.y}</b><br>' + 'distance: <b>{point.z} m</b><br>';
//     }

//     if (e.target.value != this.state.stageType){
//       var data = [];
//       var description = [
//         {
//           title: "WARMUP",
//           descriptionList: []
//         },
//         {
//           title: "MAINSET",
//           descriptionList: []
//         },
//         {
//           title: "COOLDOWN",
//           descriptionList: []
//         }
//       ];

//       this.setState({stageType: e.target.value, chartData: data, hasWarmCool: false, desLines: [],
//         chartOptions: {
//           series: [
//             {
//               allowPointSelect: false,
//               showInLegend: true,
//               name: 'workout stages',
//               data: data,
//               type: 'variwide',
//               dataLabels: {
//                 enabled: true,
//                 format: 'z{point.y:.0f}'
//               },
//               tooltip: {
//                 pointFormat: format
//               },
//               colorByPoint: true
//             }
//           ]
//         }
//       }, () => {
//         var desAndLines = this.generateDescription(description, data, this.state.stageType, []);
//         this.setState({session: {...this.state.session, description: desAndLines.description}, desLines: desAndLines.desLines});
//       });
//     }
//   }

//   closeAlert() {
//     this.props.closeAlert();
//   }

//   //Budgerigar
//   editWorkoutTitle() {
//     this.setState({ editTitle: true });
//   }

//   editWorkoutTitleDone() {
//     if (this.state.session.title == '') {
//       this.setState({
//         session: { ...this.state.session, title: 'Workout Builder' }
//       });
//     }
//     this.setState({ editTitle: false });
//   }

//   minusStages(){
//     let index = this.state.selectedIndex;
//     let chartData = this.state.chartData;
//     let colors = this.state.colors;

//     let stageIndex = index;
//     let stageEndIndex = stageIndex + 1;
//     let intervalRange = 1;
//     let title = chartData[stageIndex][4];

//     if (title.match("PLATEAU")){
//       for (let i = 0; i < chartData.length; i++){
//         if (chartData[i][4] == title){
//           stageIndex = i;
//           break;
//         }
//       }
//       for (let i = chartData.length - 1; i >= 0; i--){
//         if (chartData[i][4] == title){
//           stageEndIndex = i;
//           break;
//         }
//       }
//       intervalRange = stageEndIndex - stageIndex + 1;
//     } else {return;}

//     chartData.splice(stageEndIndex - 1, 2);
//     colors.splice(stageEndIndex - 1, 2);

//     this.setState({
//       selectedIndex: undefined,
//       selectedStage: undefined,
//       colors,
//       stageChanged: true,
//       showPopFrm: false,
//       chartData
//     });

//     this.updateChart();
//   }

//   addStages(){
//     let index = this.state.selectedIndex;
//     let chartData = this.state.chartData;
//     let colors = this.state.colors;

//     let stageIndex = index;
//     let stageEndIndex = stageIndex + 1;
//     let intervalRange = 1;
//     let title = chartData[stageIndex][4];

//     if (title.match("PLATEAU")){
//       for (let i = 0; i < chartData.length; i++){
//         if (chartData[i][4] == title){
//           stageIndex = i;
//           break;
//         }
//       }
//       for (let i = chartData.length - 1; i >= 0; i--){
//         if (chartData[i][4] == title){
//           stageEndIndex = i;
//           break;
//         }
//       }
//       intervalRange = stageEndIndex - stageIndex + 1;
//     } else {return;}

//     var addOne = ['stage' + this.state.stageIndex,
//       chartData[stageIndex][1],
//       chartData[stageIndex][2],
//       chartData[stageIndex][3],
//       chartData[stageIndex][4]];
//     var addOneColor = colors.slice(stageIndex);
//     stageIndex++;
//     var addTwo = ['stage' + (this.state.stageIndex + 1),
//       chartData[stageIndex][1],
//       chartData[stageIndex][2],
//       chartData[stageIndex][3],
//       chartData[stageIndex][4]];
//     var addTwoColor = colors.slice(stageIndex);

//     chartData.splice(stageEndIndex + 1, 0, addOne);
//     chartData.splice(stageEndIndex + 2, 0, addTwo);
//     colors.splice(stageEndIndex + 1, 0, addOneColor);
//     colors.splice(stageEndIndex + 2, 0, addTwoColor);
//     this.setState({
//       selectedIndex: undefined,
//       selectedStage: undefined,
//       colors,
//       stageChanged: true,
//       showPopFrm: false,
//       stageIndex: this.state.stageIndex + 2,
//       chartData
//     });

//     this.updateChart();
//   }

//   render() {
//     const { chartOptions, hoverData } = this.state;
//     if (this.state.loading) {
//       return (
//           <Modal
//               centered
//               size="lg"
//               show={true}
//               onHide={this.handleClose}
//               dialogClassName="individual stage"
//           >
//             <Modal.Header closeButton>
//               <Modal.Title>
//                 {this.props.sessionId != null ? 'Edit' : 'Add'} Session
//               </Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//               <div className="modal-container-loading">
//                 <img src={loading} alt="" />
//               </div>
//             </Modal.Body>
//           </Modal>
//       );
//     }

//     let durationHours = [],
//         durationMinutes = [],
//         rpeHours = [],
//         rpeMinutes = [],
//         keywordsList = [],
//         sportsGroup = '',
//         sportsList = [],
//         alertMessage = ''
//     ;

//     for (let i = 0; i <= 24; i++) {
//       durationHours.push(
//           <option key={'addSessionHours' + i} value={i}>
//             {i}
//           </option>
//       );
//     }
//     for (let i = 0; i <= 59; i++) {
//       durationMinutes.push(
//           <option key={'addSessionMinutes' + i} value={i}>
//             {i}
//           </option>
//       );
//     }

//     for (let i = 0; i <= 24; i++) {
//       rpeHours.push(
//           <option key={'addSessionHours' + i} value={i}>
//             {i}
//           </option>
//       );
//     }
//     for (let i = 0; i <= 59; i++) {
//       rpeMinutes.push(
//           <option key={'addSessionMinutes' + i} value={i}>
//             {i}
//           </option>
//       );
//     }

//     //Budgerigar SportsKeywords
//     this.props.sessionSportsKeywords.forEach((item, ind) => {
//       if (item.group !== '' && sportsGroup !== item.group) {
//         sportsList.push(
//             <option key={'sports-keyword-group-' + item._id} value="groupName">
//               {' '}
//               —— {item.group} ——{' '}
//             </option>
//         );
//         sportsGroup = item.group;
//       }

//       sportsList.push(
//           <option key={'sports-keyword-' + item._id} value={item._id}>
//             {item.title}
//           </option>
//       );
//     });

//     let rpe_txt_arr = [];
//     let rpe_val_arr = [];
//     let rpe_title_arr = [
//       'Very Very Easy',
//       'Easy',
//       'Moderate',
//       'Some What Hard',
//       'Hard',
//       '6/10',
//       'Very Hard',
//       '8/10',
//       '9/10',
//       'Maximal'
//     ];
//     let rpe_color_arr = [
//       '#00ffff',
//       '#00ff00',
//       '#ffff00',
//       '#ff9933',
//       '#ff6633',
//       '#ff3333',
//       '#cc3333',
//       '#663399',
//       '#330066',
//       '#000000'
//     ];
//     //su change
//     const options = {
//       credits: { enabled: false },
//       chart: { type: 'column' },
//       title: { text: 'Rating Perceived Effort' },
//       subtitle: { text: '' },
//       xAxis: { categories: rpe_txt_arr, crosshair: true },
//       yAxis: { min: 0, title: { text: 'Min(s)' } },
//       tooltip: {
//         headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
//         pointFormat:
//             '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
//             '<td style="padding:0"><b>{point.y} min(s)</b></td></tr>',
//         footerFormat: '</table>',
//         shared: true,
//         useHTML: true
//       },
//       plotOptions: { column: { pointPadding: 0.2, borderWidth: 0 } },
//       series: [
//         {
//           name: 'Rating Perceived Effort',
//           data: rpe_val_arr
//         }
//       ]
//     };

//     if (this.props.alertMessage) {
//       alertMessage = (
//           <Alert variant="success" dismissible onClose={this.closeAlert}>
//             {this.props.alertMessage}
//           </Alert>
//       );
//     }
//     if (this.props.error) {
//       alertMessage = (
//           <Alert variant="danger" dismissible onClose={this.closeAlert}>
//             {this.props.error}
//           </Alert>
//       );
//     }

//     return (
//         <Modal
//             centered
//             size="lg"
//             show={true}
//             onHide={this.handleClose}
//             dialogClassName="modal-70w planner-dialog adsesn adsesnWindow"
//         >
//           <Modal.Header closeButton>
//             <Modal.Title>
//               {this.props.sessionId != null ? 'Edit' : 'Add'} Session
//             </Modal.Title>
//           </Modal.Header>
//           <Modal.Body>
//             <Form>
//               {alertMessage}
//               <Row>
//                 <div className="workoutPlanName">
//                   <Form.Control
//                       required
//                       disabled={!this.state.editTitle}
//                       type="text"
//                       id={'workoutTitle'}
//                       className="sessionNameInput"
//                       value={this.state.session.title}
//                       onChange={this.handleTitle}
//                   />
//                   <Image
//                       className={
//                         this.state.editTitle ? 'titleEditNone' : 'titleEdit'
//                       }
//                       onClick={this.editWorkoutTitle}
//                       src={this.state.icons[0]}
//                   />
//                   <Image
//                       className={
//                         this.state.editTitle ? 'titleEdit' : 'titleEditNone'
//                       }
//                       onClick={this.editWorkoutTitleDone}
//                       src={this.state.icons[1]}
//                   />

//                   {/** adds zy **/}
//                   <Button
//                       variant="coaching-mate"
//                       className="btn-sm sessionSaveAs"
//                       onClick={this.sessionSave.bind(this, 'saveas')}
//                   >
//                     Save As
//                   </Button>

//                   <Button
//                       variant="coaching-mate"
//                       className="btn-sm sessionSaveAs sessionSave"
//                       onClick={this.sessionSave.bind(this, 'save')}
//                   >
//                     Save
//                   </Button>
//                 </div>
//                 <Col md={3} className="sesatr leftTopBlock" id={'attrForm'}>
//                   <div style={{ background: 'white', paddingRight: '0px' }}>
//                     <Form.Row>
//                       <Form.Group as={Col} controlId="addSessionFamilyName">
//                         <Form.Label>Family Name</Form.Label>
//                         <Form.Control
//                             className="attrInput"
//                             as="input"
//                             value={this.state.session.familyName}
//                             onChange={this.handleLikeFamilyName}
//                         ></Form.Control>
//                       </Form.Group>
//                       <div style={this.state.linkNameDiv} className="linkDivCss">
//                         <ul className="linkUlCss">
//                           {this.state.linkFamilyNameList.map((item, index) => {
//                             return (
//                                 <li
//                                     className={this.state.linkLiCss}
//                                     onClick={this.handleClickFamilyName.bind(
//                                         this,
//                                         item
//                                     )}
//                                 >
//                                   {item}
//                                 </li>
//                             );
//                           })}
//                         </ul>
//                       </div>
//                     </Form.Row>
//                     {/*tags*/}
//                     <Form.Row>
//                       <Form.Group as={Col} controlId="addTags">
//                         <Form.Label>Tags</Form.Label>
//                         <Form.Control
//                             className="attrInput"
//                             as="input"
//                             value={this.state.tags}
//                             onChange={this.handleLikeTags}
//                         ></Form.Control>
//                       </Form.Group>
//                     </Form.Row>
//                     <Form.Row>
//                       <Form.Group as={Col} controlId="addSessionActivityTypes">
//                         <Form.Label>Activity Type</Form.Label>
//                         <Form.Control
//                             className="attrInput"
//                             as="select"
//                             value={this.state.session.activityType}
//                             onChange={this.handleSessionActivity}
//                         >
//                           <option value="">Select Activity Type</option>
//                           {this.props.sessionActivityTypes.map(
//                               sessionActivityType => (
//                                   <option>{sessionActivityType.title}</option>
//                               )
//                           )}
//                         </Form.Control>
//                       </Form.Group>
//                     </Form.Row>
//                     <Form.Row>
//                       <Form.Group as={Col} controlId="addSessionAthleteLevel">
//                         <Form.Label>Athlete Level</Form.Label>
//                         <Form.Control
//                             className="attrInput"
//                             as="select"
//                             value={this.state.session.athleteLevel}
//                             onChange={this.handleAthleteLevel}
//                         >
//                           <option value="">Select Athlete Level</option>
//                           {this.state.athleteLevelOptionList.map(function (
//                               levels
//                           ) {
//                             return <option>{levels}</option>;
//                           })}
//                         </Form.Control>
//                       </Form.Group>
//                     </Form.Row>
//                     <Form.Row>
//                       <Form.Group as={Col} controlId="addSessionSportsKeywords">
//                         <Form.Label>Sports Keyword</Form.Label>
//                         <Form.Control
//                             className="attrInput"
//                             as="select"
//                             value={this.state.session.sportsKeywords}
//                             onChange={this.handleSessionSports}
//                         >
//                           <option value="">Select Sports Keyword</option>
//                           // adds zy
//                           {this.state.sportsKeywordsOptionList.map(function(sportsList) {
//                             return <option>{sportsList}</option>
//                           })}
//                         </Form.Control>
//                       </Form.Group>
//                     </Form.Row>
//                     <Form.Row>
//                       <Form.Group as={Col} controlId="addSessionComponent">
//                         <Form.Label>Component</Form.Label>
//                         <Form.Control
//                             className="attrInput"
//                             as="select"
//                             value={this.state.session.components}
//                             onChange={this.handleSessionComponent}
//                         >
//                           <option value="">Select Component</option>
//                           {this.props.sessionComponents.map(sessionComponent => (
//                               <option>{sessionComponent.title}</option>
//                           ))}
//                         </Form.Control>
//                       </Form.Group>
//                     </Form.Row>
//                     <Form.Row>
//                       <Form.Group as={Col} controlId="changeXAxis">
//                         <Form.Label>X-axis</Form.Label>
//                         <Form.Control
//                             className="attrInput"
//                             as="select"
//                             value={this.state.stageType}
//                             onChange={this.handleSessionStagesType}
//                         >
//                           <option value="Duration-min">Duration-minute</option>
//                           <option value="Distance-km">Distance-km</option>
//                           <option value="Distance-m">Distance-m</option>
//                         </Form.Control>
//                       </Form.Group>
//                     </Form.Row>
//                   </div>
//                 </Col>
//                 <Col md={6}>
//                   <div>
//                     {/*desBlock*/}
//                     <Form.Row class="middleBlock">
//                       <Form.Group controlId="addSessionDescription">
//                         <p class="desTitle">Description</p>
//                         <div class="descriptionBlock">{this.state.desLines}</div>
//                       </Form.Group>
//                     </Form.Row>
//                   </div>
//                 </Col>
//                 <Col md={3}>
//                   <div>
//                     <Form.Group controlId="addSessionImage">
//                       <div className={"addpictext"}>
//                         Upload Image
//                         <Image className="addpic" src={'http://localhost:3001/uploads/images/img/addpic.png'} />
//                       </div>
//                       <Form.Control type="file" ref={this.uploadImageRef}/>
//                     </Form.Group>
//                     <Form.Row>
//                       <Form.Group controlId="addSessionImageUpload">
//                         <Button
//                             variant="coaching-mate"
//                             className="btn-sm commenstyle"
//                             onClick={this.uploadImage}
//                         >
//                           Upload
//                         </Button>
//                       </Form.Group>
//                       <Form.Group controlId="addSessionImageRemove">
//                         <Button
//                             variant="coaching-mate btn-sm commenstyle"
//                             onClick={this.removeImage}
//                         >
//                           Remove
//                         </Button>
//                       </Form.Group>
//                     </Form.Row>
//                     {this.state.session.image && (
//                         <Form.Row>
//                           <img
//                               src={
//                                 'http://localhost:3001/uploads/session/' +
//                                 this.state.session.image
//                               }
//                               style={{width: '100%', marginBottom: '15px'}}
//                               alt=""
//                           />
//                         </Form.Row>
//                     )}
//                     <Form.Group controlId="addSessionVideo">
//                       <div className="add-video-links">
//                         <div className={"addvideotext"}>Add/Edit Video Links</div>
//                         <div className="sess-videos">
//                           {this.state.session.videos.map((video, ind) => (
//                               <div key={"sess-video" + ind} className="sess-video">
//                                 <input type="text" className="sess-video-links " name={ind} value={video}
//                                        onChange={this.handleVideoText}/>
//                                 <a href="remove-video" className="remove-sess-video" name={ind}
//                                    onClick={this.removeVideo}>X</a>
//                               </div>
//                           ))}
//                         </div>
//                         <Button
//                             variant="coaching-mate btn-sm commenstyle"
//                             onClick={this.addVideo}>Add More</Button>
//                       </div>
//                     </Form.Group>
//                   </div>
//                 </Col>

//                 <div className="workoutPlan">
//                   <div className={"totalRPE"}>
//                     <div className="total-duration">
//                       Total {this.state.stageType.split("-")[0]} :{' '}
//                       {this.state.chartData.reduce(
//                           (prev, cur) => (prev += cur[2]),
//                           0
//                       )}{' '}
//                       {this.state.stageType.split("-")[1]}
//                     </div>
//                     <div className="total-intensity">
//                       Total Load:{' '}
//                       {this.state.chartData.reduce(
//                           (prev, cur) => (prev += cur[1] * cur[2]),
//                           0
//                       )}
//                     </div>
//                   </div>

//                   <div>
//                     <HighchartsReact
//                         highcharts={Highcharts}
//                         options={chartOptions}
//                     />
//                   </div>
//                   <Form.Group
//                       controlId="addStage"
//                       className={'workoutPlanControlBoard'}
//                   >
//                     <Button
//                         variant="coaching-mate"
//                         className="btn-sm stagez1style "
//                         onClick={this.addStagez1}
//                     >
//                       z1
//                     </Button>
//                     <Button
//                         variant="coaching-mate"
//                         className="btn-sm stagez2style "
//                         onClick={this.addStagez2}
//                     >
//                       z2
//                     </Button>
//                     <Button
//                         variant="coaching-mate"
//                         className="btn-sm stagez3style "
//                         onClick={this.addStagez3}
//                     >
//                       z3
//                     </Button>
//                     <Button
//                         variant="coaching-mate"
//                         className="btn-sm stagez4style "
//                         onClick={this.addStagez4}
//                     >
//                       z4
//                     </Button>
//                     <Button
//                         variant="coaching-mate"
//                         className="btn-sm stagez5style "
//                         onClick={this.addStagez5}
//                     >
//                       z5
//                     </Button>
//                     <Button
//                         variant="coaching-mate"
//                         className="btn-sm stagez6style "
//                         onClick={this.addStagez6}
//                     >
//                       z6
//                     </Button>
//                     <Button
//                         variant="coaching-mate"
//                         className="btn-sm stageblankstyle "
//                     >
//                       {' '}
//                     </Button>
//                     <Button
//                         variant="coaching-mate"
//                         className="btn-sm stagewarmupstyle "
//                         onClick={this.addWarmUp}
//                     >
//                       warm up
//                     </Button>
//                     <Button
//                         variant="coaching-mate"
//                         className="btn-sm stagecooldownstyle "
//                         onClick={this.addCoolDown}
//                     >
//                       cool down
//                     </Button>
//                     <Form.Control
//                         className="intervalsInput"
//                         as="select"
//                         value={this.state.intervalsType}
//                         onChange={this.handleSessionIntervals}
//                     >
//                       <option value="intervals" selected="selected">
//                         Intervals
//                       </option>
//                       <option value="up">Up</option>
//                       <option value="down">Down</option>
//                       <option value="pyramid">Pyramid</option>
//                       <option value="plateau">Plateau</option>
//                     </Form.Control>
//                   </Form.Group>
//                 </div>
//               </Row>
//             </Form>
//           </Modal.Body>
//           <Modal.Footer>
//           </Modal.Footer>
//           {/* hf */}
//           {this.state.selectedIndex === undefined ? (
//               ''
//           ) : (
//               <div
//                   id="popFrm"
//                   className={this.state.showPopFrm ? 'word-style' : 'word-style hide'}
//               >
//                 <Form
//                     className="form1"
//                     id="popFrm1"
//                     style={{ left: this.state.leftLoc - 150 }}
//                 >
//                   <div className="icons">
//                     <img
//                         className="ico"
//                         src={arrowLeft}
//                         alt=""
//                         onClick={this.prevStage.bind(this)}
//                     />
//                     <img
//                         className="ico"
//                         src={arrowRight}
//                         alt=""
//                         onClick={this.netxStage.bind(this)}
//                     />
//                     <img
//                         className="ico close"
//                         src={closeIcon}
//                         onClick={this.removeStage.bind(this)}
//                         alt=""
//                     />
//                     <img
//                         className="ico"
//                         src={duplicateIcon}
//                         onClick={this.duplicateStage.bind(this)}
//                         alt=""
//                     />
//                     <img
//                         className="ico"
//                         src={"http://localhost:3001/uploads/images/complete.png"}
//                         alt=""
//                         onClick={this.saveStage.bind(this)}
//                     />
//                   </div>

//                   <div class="items">
//                     <img
//                         src={clockIcon}
//                         class="time_ico"
//                         alt=""
//                     />
//                     <input
//                         type="number"
//                         value={
//                           this.state.selectedStage !== undefined
//                               ? this.state.selectedStage[2]
//                               : 0
//                         }
//                         onChange={this.handleInputChange.bind(this)}
//                         class="list time_int"
//                         style={{
//                           display: this.state.showInputFrm ? 'inline-block' : 'none'
//                         }}
//                     />
//                     <span
//                         class="time_reslut"
//                         style={{
//                           display: this.state.showInputFrm ? 'none' : 'inline-block'
//                         }}
//                     >
//                                     {' '}
//                       {this.state.selectedStage != undefined
//                           ? this.state.selectedStage[2]
//                           : 0}{' '}
//                       min
//                                     </span>
//                     <img
//                         src={modificationIcon}
//                         onClick={this.handleShowInputFrm.bind(this)}
//                         class="edit_ico"
//                         alt=""
//                     />
//                   </div>

//                   <div class="items items_sp">
//                     <span>Text Prompt:</span>
//                     <input
//                         class="list addText"
//                         placeholder="+ Add Text Prompt"
//                         value={this.state.selectedStage[3][0][1]}
//                         onChange={this.handlePromptChange.bind(this)}
//                     />
//                   </div>
//                   <div class="items">
//                     <span>Distance:</span>
//                     <input
//                         type="number"
//                         class="list"
//                         style={{width: 150}}
//                         placeholder="Distance"
//                         value={this.state.selectedStage[3][1][1]}
//                         onInput={this.handleDistanceChange.bind(this)}
//                     />
//                     <select
//                         name=""
//                         value={this.state.selectedStage[3][1][2]}
//                         onChange={this.handleSelectChange.bind(this)}
//                         id=""
//                         class="list"
//                     >
//                       <option value="m">m</option>
//                       <option value="km">km</option>
//                     </select>
//                   </div>
//                   {this.state.selectedStage[3].map((item, index) => {
//                     if (index <= 1) {
//                       return '';
//                     }

//                     return (
//                         <div class="items items_sp">
//                           <span>{item[0]}</span>
//                           <input
//                               class="list addText"
//                               placeholder="+ Add Text Prompt"
//                               value={item[1]}
//                               onChange={this.handleAddVar.bind(this, index)}
//                           />
//                         </div>
//                     );
//                   })}
//                   <div
//                       class="list items footer form1_footer"
//                       onClick={this.handleShowVarFrm2.bind(this)}
//                   >
//                     + Add Variables
//                   </div>
//                   <div className="items addAndMinus">
//                     <span style={{color: "black"}}>Add or Minus:</span>
//                     <Button onClick={this.minusStages}> - </Button>
//                     <Button onClick={this.addStages}> + </Button>
//                   </div>
//                 </Form>

//                 <div
//                     className="form2"
//                     style={{
//                       left: this.state.leftLoc - 100,
//                       display: this.state.showTxtFrm ? 'block' : 'none'
//                     }}
//                 >
//                   <h2>Add a Text Prompt</h2>
//                   <div class="txt">
//                     <textarea name="" id="p_content"></textarea>
//                   </div>
//                   <div class="btn_div">
//                     <button class="save" onClick={this.handleSaveAddVar.bind(this)}>
//                       Save
//                     </button>
//                     <button
//                         class="cancel"
//                         onClick={this.handleShowTxtFrm2.bind(this)}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>

//                 <div
//                     className="form3"
//                     style={{
//                       left: this.state.leftLoc - 100,
//                       display: this.state.showVarFrm ? 'block' : 'none'
//                     }}
//                 >
//                   <h2>Add Variables</h2>
//                   <div class="form3_list">
//                     <span>Variable Name:</span>
//                     <input
//                         type="text"
//                         class="insert_name"
//                         value={this.state.addText}
//                         onChange={this.handleVarName.bind(this)}
//                     />
//                   </div>

//                   <div class="form3_list">
//                     <span>Variable Text:</span>
//                     <input
//                         type="text"
//                         class="input2 insert_content"
//                         value={this.state.addValue}
//                         onChange={this.handleVarTxt.bind(this)}
//                     />
//                   </div>
//                   <div class="footer">
//                     <button
//                         class="form3_save"
//                         onClick={this.handleSaveAddVar.bind(this)}
//                     >
//                       Save
//                     </button>
//                     <button
//                         class="form3_cancel"
//                         onClick={this.handleShowVarFrm2.bind(this)}
//                     >
//                       Cancel
//                     </button>
//                   </div>
//                 </div>
//               </div>
//           )}
//         </Modal>
//     );
//   }
// }

// const mapStateToProps = state => {
//   return {
//     user: state.auth.user,
//     addSession: state.planner.modals.addSession,
//     sessionId: state.planner.modalsParams.id,
//     familyNames: state.planner.familyNames,
//     sessionActivityTypes: state.planner.sessionActivityTypes,
//     sessionSportsKeywords: state.planner.sessionSportsKeywords,
//     sessionComponents: state.planner.sessionComponents,
//     session: state.planner.session,
//     alertMessage: state.planner.alertMessage,
//     error: state.planner.error,
//     //tags
//     tags: state.planner.tags,
//   };
// };

// export default connect(mapStateToProps, {
//   hideAddSession,
//   loadAddSessionData,
//   createSession,
//   closeAlert,
//   updateSession,
//   updateSeachSession
// })(AddSession);

