import React, { Component } from 'react';
import { Button, Modal, Row } from 'react-bootstrap';
import { FaPlusSquare} from 'react-icons/fa';
import { connect } from 'react-redux';
import { closeAlert, hidePrepare, showAddSession ,loadSessions, loadAddSessionData} from '../../../actions';
import logo from '../../../assets/logo-orange.svg';
import {withRouter} from "react-router-dom";

class PrepareAddSession extends Component {
  constructor(props) {
    super(props);
    this.state = {
      session_id:""
    }
    this.loadSessionVal = '';
    this.selectLoadSession = this.selectLoadSession.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleAddSession = this.handleAddSession.bind(this);

  }

  //su
  componentDidMount() {
    this.props.loadSessions(this.props.club._id);
  }

  displaySessionsSelect(session, ind) {
    if (ind === 0) {
      this.loadSessionVal = session.slug;

    }
    return (
        <option key={'load-session-sidebar' + session._id} value={session._id}>
          {session.title}
        </option>
    );
  }

  selectLoadSession(e) {
    this.loadSessionVal = e.target.value;
    this.setState({session_id: e.target.value});
  }

  handleClose() {
    this.props.hidePrepare();
  }

  handleAddSession(e, id) {
    e.preventDefault();
    this.props.showAddSession(id);

  }
  loadAddSessionData(sessionId, clubId){
    this.props.loadAddSessionData(sessionId, clubId);
  }

  render() {
    return (
        <Modal
            show={true}
            onHide={this.handleClose}
            centered
            aria-labelledby="contained-modal-title-vcenter"
        >
          <Modal.Body className="prepare">
            <Row>
              <img
                  style={{
                    padding: '40px 60px'
                  }}
                  src={logo}
                  alt="logo"
              />
            </Row>

            <Row className="justify-content-center" style={{ margin: '12px 0' }}>
              <Button
                  variant="light"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    width: '180px',
                    boxShadow: '1px 1px 2px 0 #ccc'
                  }}
                  onClick={e => this.handleAddSession(e, null)}
              >
                <i style={{ color: 'rgb(215,139,89)', marginRight: '4px' }}>
                  <FaPlusSquare></FaPlusSquare>
                </i>
                Create New Workout
              </Button>
            </Row>
            {/*su*/}
            <Row className="justify-content-center">
              <form method="post" action="/planner/">
                <div className="styled-select top-one">
                  <select
                      name="load-session"
                      id="load-session-sidebar"
                      style={{ color: 'rgb(215,139,89)', marginRight: '4px' }}
                      onChange={this.selectLoadSession}
                      value={this.state.session_id}
                  >
                    {this.props.sessions.map(this.displaySessionsSelect.bind(this))}
                  </select>
                </div>
                <div className="load-session-btn" style={{ marginTop: 10 }}>
                  <Button
                      variant="light"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        width: '180px',
                        boxShadow: '1px 1px 2px 0 #ccc',
                      }}
                      name=""
                      onClick={(e) => this.handleAddSession(e, this.state.session_id)}
                  >
                    <i style={{ color: 'rgb(215,139,89)', marginRight: '4px' }}>
                    </i>
                    Edit a Workout Plan
                  </Button>
                </div>
              </form>
            </Row>
          </Modal.Body>
        </Modal>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.auth.user,
    addSession: state.planner.modals.addSession,
    //
    sessionId: state.planner.modals.addSession,
    familyNames: state.planner.familyNames,
    sessionActivityTypes: state.planner.sessionActivityTypes,
    sessionSportsKeywords: state.planner.sessionSportsKeywords,
    sessionComponents: state.planner.sessionComponents,
    session: state.planner.session,
    alertMessage: state.planner.alertMessage,
    error: state.planner.error

  };
};

const mapStateToPropss = (state) => {
  return {
    user: state.auth.user,
    modals: state.planner.modals,
    error: state.auth.error,
    loading: state.auth.loading,
    planners: state.planner.planners,
    sessions: state.planner.sessions
  };
};

export default withRouter(
    connect(mapStateToPropss, {
      showAddSession,
      closeAlert,
      loadSessions,
      hidePrepare,
      loadAddSessionData
    })(PrepareAddSession)
);

