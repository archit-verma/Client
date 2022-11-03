import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Form } from 'react-bootstrap';
import loading from '../assets/loading.svg';
import profileBlank from '../assets/profile_blank.png';

import {
    getServerUrl,
    getGroupAdmin,
    getGroupMembers,
    updateGroupStatus,
    groupUpload,
    updateGroupLogoCoverPhoto,
    updateGroupDescription,
    groupEventUpload,
    groupEventAdd,
    getGroupEvents,
    groupEventRemove,
    groupMemberRemove,
    groupMemberAccept,
    groupMemberReject,
} from '../utils/api';

let dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
let monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];

class AdminGroup extends Component {
    constructor(props) {
        super(props);

        this.state = {
            group: { title: '', description: '' },
            event: {
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                startTime: '',
                endTime: '',
                logo: '',
                moduleType: 'group',
                moduleId: '',
            },
            screenType: 'menu',
            logo: '',
            coverPhoto: '',
            memberRequests: [],
            members: [],
            events: [],
            loading: false,
        };

        this.uploadLogoRef = React.createRef();
        this.uploadCoverPhotoRef = React.createRef();
        this.uploadEventLogoRef = React.createRef();
        this.handleDescription = this.handleDescription.bind(this);
    }

    componentDidMount() {
        getGroupAdmin(this.props.groupSlug).then((resp) => {
            if (resp.success == true) {
                if (resp.group.creatorId === this.props.user._id)
                    this.setState({
                        group: resp.group,
                        event: {
                            ...this.state.event,
                            moduleId: resp.group._id,
                        },
                    });
            } else alert('Error fetching data, please try again');
        });
    }

    changeScreen = (e, screenType) => {
        e.preventDefault();
        if (screenType === 'members') {
            if (
                this.state.group.membersCount > 0 ||
                this.state.group.memberRequestsCount > 0
            ) {
                getGroupMembers(this.state.group._id).then((resp) => {
                    if (resp.success == true)
                        this.setState({
                            screenType,
                            members: resp.members,
                            memberRequests: resp.memberRequests,
                        });
                });
            } else this.setState({ screenType });
        } else if (screenType === 'events') {
            getGroupEvents(this.state.group._id).then((resp) => {
                if (resp.success == true)
                    this.setState({ screenType, events: resp.events });
            });
        } else this.setState({ screenType });
    };

    changeGroupStatus = (status) => {
        let group = {
            id: this.state.group._id,
            status,
        };
        updateGroupStatus(group).then((resp) => {
            if (resp.success == true) {
                alert(resp.msg);
                this.setState({
                    loading: false,
                    group: { ...this.state.group, status },
                });
            } else {
                alert(resp.msg);
                this.setState({ loading: false });
            }
        });
        this.setState({ loading: true });
    };

    handleDescription = (e) => {
        this.setState({
            group: { ...this.state.group, description: e.target.value },
        });
    };

    openUploadLogo = () => {
        this.uploadLogoRef.current.click();
    };

    openUploadCoverPhoto = () => {
        this.uploadCoverPhotoRef.current.click();
    };

    openUploadEventLogo = () => {
        this.uploadEventLogoRef.current.click();
    };

    uploadLogo = (e) => {
        let groupLogo = this.uploadLogoRef.current.files[0];
        let fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        if (groupLogo === undefined) {
            alert('Please select image file to upload');
        } else if (fileTypes.indexOf(groupLogo.type) === -1) {
            alert('Please select file type of JPEG, JPG, PNG or GIF');
        } else {
            const Imagedata = new FormData();
            Imagedata.append('groupUpload', groupLogo);
            groupUpload(Imagedata).then((imgUpload) => {
                this.setState({ loading: false, logo: imgUpload.filename });
            });
            this.setState({ loading: true });
        }
    };

    uploadCoverPhoto = (e) => {
        let groupCoverPhoto = this.uploadCoverPhotoRef.current.files[0];
        let fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        if (groupCoverPhoto === undefined) {
            alert('Please select image file to upload');
        } else if (fileTypes.indexOf(groupCoverPhoto.type) === -1) {
            alert('Please select file type of JPEG, JPG, PNG or GIF');
        } else {
            const Imagedata = new FormData();
            Imagedata.append('groupUpload', groupCoverPhoto);
            groupUpload(Imagedata).then((imgUpload) => {
                this.setState({
                    loading: false,
                    coverPhoto: imgUpload.filename,
                });
            });
            this.setState({ loading: true });
        }
    };

    updateLogoCoverPhoto = (e) => {
        e.preventDefault();
        if (this.state.logo === '' && this.state.coverPhoto === '') {
            alert('Upload Logo/Cover Photo');
            return;
        }
        let groupMedia = {
            id: this.state.group._id,
            logo: this.state.logo,
            coverPhoto: this.state.coverPhoto,
        };
        updateGroupLogoCoverPhoto(groupMedia).then((resp) => {
            if (resp.success == true) {
                alert(resp.msg);
                let group = { ...this.state.group };
                if (groupMedia.logo) group.logo = groupMedia.logo;
                if (groupMedia.coverPhoto)
                    group.coverPhoto = groupMedia.coverPhoto;
                this.setState({
                    loading: false,
                    group,
                    logo: '',
                    coverPhoto: '',
                });
            } else {
                alert(resp.msg);
                this.setState({ loading: false });
            }
        });
        this.setState({ loading: true });
    };

    updateDescription = (e) => {
        e.preventDefault();
        let group = {
            id: this.state.group._id,
            description: this.state.group.description,
        };
        updateGroupDescription(group).then((resp) => {
            if (resp.success == true) {
                alert(resp.msg);
                this.setState({ loading: false });
            } else {
                alert(resp.msg);
                this.setState({ loading: false });
            }
        });
        this.setState({ loading: true });
    };

    handleEventTitle = (e) => {
        this.setState({
            event: { ...this.state.event, title: e.target.value },
        });
    };

    handleEventStartDate = (e) => {
        this.setState({
            event: { ...this.state.event, startDate: e.target.value },
        });
    };

    handleEventEndDate = (e) => {
        this.setState({
            event: { ...this.state.event, endDate: e.target.value },
        });
    };

    handleEventStartTime = (e) => {
        this.setState({
            event: { ...this.state.event, startTime: e.target.value },
        });
    };

    handleEventEndTime = (e) => {
        this.setState({
            event: { ...this.state.event, endTime: e.target.value },
        });
    };

    handleEventDescription = (e) => {
        this.setState({
            event: { ...this.state.event, description: e.target.value },
        });
    };

    uploadEventLogo = (e) => {
        let eventLogo = this.uploadEventLogoRef.current.files[0];
        let fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        if (eventLogo === undefined) {
            alert('Please select image file to upload');
        } else if (fileTypes.indexOf(eventLogo.type) === -1) {
            alert('Please select file type of JPEG, JPG, PNG or GIF');
        } else {
            const Imagedata = new FormData();
            Imagedata.append('eventUpload', eventLogo);
            groupEventUpload(Imagedata).then((imgUpload) => {
                this.setState({
                    loading: false,
                    event: { ...this.state.event, logo: imgUpload.filename },
                });
            });
            this.setState({ loading: true });
        }
    };

    addEvent = (e) => {
        e.preventDefault();
        if (this.state.event.title === '') {
            alert('Enter event name');
            return;
        } else if (this.state.event.startDate === '') {
            alert('Enter event start date');
            return;
        } else if (this.state.event.endDate === '') {
            alert('Enter event end date');
            return;
        } else if (this.state.event.startTime === '') {
            alert('Enter event start time');
            return;
        } else if (this.state.event.endTime === '') {
            alert('Enter event end time');
            return;
        } else if (this.state.event.description === '') {
            alert('Enter event description');
            return;
        } else if (this.state.event.logo === '') {
            alert('Upload event logo');
            return;
        } else {
            let groupEvent = this.state.event;
            let slugify = require('slugify');
            groupEvent.slug = slugify(groupEvent.title, {
                replacement: '-',
                remove: null,
                lower: true,
            });
            groupEvent.creatorId = this.props.user._id;
            groupEvent.groupId = this.state.group._id;
            groupEventAdd(groupEvent).then((resp) => {
                if (resp.success == false) {
                    alert(resp.msg);
                } else {
                    alert(resp.msg);
                    this.setState({
                        loading: false,
                        event: {
                            title: '',
                            description: '',
                            startDate: '',
                            endDate: '',
                            startTime: '',
                            endTime: '',
                            logo: '',
                            moduleId: '',
                        },
                    });
                }
            });
            this.setState({ loading: true });
        }
    };

    acceptMember = (e, userId) => {
        e.preventDefault();
        let groupId = this.state.group._id;
        groupMemberAccept(userId, groupId).then((resp) => {
            if (resp.success == false) {
                alert(resp.msg);
            } else {
                alert(resp.msg);
                this.setState({
                    loading: false,
                    members: resp.members,
                    memberRequests: resp.memberRequests,
                });
            }
        });
        this.setState({ loading: true });
    };

    rejectMember = (e, userId) => {
        e.preventDefault();
        let groupId = this.state.group._id;
        groupMemberReject(userId, groupId).then((resp) => {
            if (resp.success == false) {
                alert(resp.msg);
            } else {
                alert(resp.msg);
                this.setState({
                    loading: false,
                    memberRequests: resp.memberRequests,
                });
            }
        });
        this.setState({ loading: true });
    };

    removeMember = (e, userId) => {
        e.preventDefault();
        let groupId = this.state.group._id;
        groupMemberRemove(userId, groupId).then((resp) => {
            if (resp.success == false) {
                alert(resp.msg);
            } else {
                alert(resp.msg);
                this.setState({ loading: false, members: resp.members });
            }
        });
        this.setState({ loading: true });
    };

    removeEvent = (e, eventId) => {
        e.preventDefault();
        let groupId = this.state.group._id;
        groupEventRemove(eventId, groupId, 'remove').then((resp) => {
            if (resp.success == false) {
                alert(resp.msg);
            } else {
                alert(resp.msg);
                this.setState({ loading: false, events: resp.events });
            }
        });
        this.setState({ loading: true });
    };

    render() {
        let loadingHtml = null;
        if (this.state.loading && this.state.group.title === '') {
            return (
                <div
                    className='profile-container-loading'
                    style={{
                        position: 'absolute',
                        height: '100%',
                        backgroundColor: 'lightgray',
                        opacity: '0.8',
                    }}
                >
                    <img src={loading} alt='' />
                </div>
            );
        }
        if (!this.state.loading && this.state.group.title === '') {
            return (
                <div className='outbx'>
                    <div className='boxmenu'>
                        You can not access this page,{' '}
                        <Link to={'/'}>go to home</Link>
                    </div>
                </div>
            );
        }
        if (this.state.loading) {
            loadingHtml = (
                <div
                    className='profile-container-loading'
                    style={{
                        position: 'absolute',
                        height: '100%',
                        backgroundColor: 'lightgray',
                        opacity: '0.8',
                    }}
                >
                    <img src={loading} alt='' />
                </div>
            );
        }

        if (this.state.screenType == 'menu') {
            let statusDisplay = null;
            if (this.state.group.status === 'active')
                statusDisplay = (
                    <ul>
                        <li>
                            <a
                                className=''
                                onClick={() =>
                                    this.changeGroupStatus('suspend')
                                }
                            >
                                Suspend Group
                            </a>
                        </li>
                        <li>
                            <a
                                className=''
                                onClick={() => this.changeGroupStatus('remove')}
                            >
                                Remove Group
                            </a>
                        </li>
                    </ul>
                );
            else if (this.state.group.status === 'suspend')
                statusDisplay = (
                    <ul>
                        <li>
                            <a
                                className=''
                                onClick={() => this.changeGroupStatus('active')}
                            >
                                Activate Group
                            </a>
                        </li>
                        <li>
                            <a
                                className=''
                                onClick={() => this.changeGroupStatus('remove')}
                            >
                                Remove Group
                            </a>
                        </li>
                    </ul>
                );
            else if (this.state.group.status === 'remove')
                statusDisplay = (
                    <ul>
                        <li>
                            <a
                                className=''
                                onClick={() => this.changeGroupStatus('active')}
                            >
                                Activate Group
                            </a>
                        </li>
                        <li>
                            <a
                                className=''
                                onClick={() =>
                                    this.changeGroupStatus('suspend')
                                }
                            >
                                Suspend Group
                            </a>
                        </li>
                    </ul>
                );

            return (
                <div className='outbx'>
                    {loadingHtml}
                    <div className='teams-container'>
                        <a href='/groups/' className='backbtn'>
                            {' '}
                        </a>
                        <h6>{this.state.group.title}</h6>
                    </div>
                    <div className='boxmenu'>
                        <ul>
                            <li onClick={(e) => this.changeScreen(e, 'cover')}>
                                <a href='' className=''>
                                    Change Logo/Cover Photo
                                </a>
                            </li>
                            <li onClick={(e) => this.changeScreen(e, 'about')}>
                                <a href='' className=''>
                                    About your group{' '}
                                </a>
                            </li>
                            <li onClick={(e) => this.changeScreen(e, 'posts')}>
                                <a href='' className=''>
                                    Posts
                                </a>
                            </li>
                            <li
                                onClick={(e) => this.changeScreen(e, 'members')}
                            >
                                <a href='' className=''>
                                    Members
                                </a>
                            </li>
                            <li onClick={(e) => this.changeScreen(e, 'events')}>
                                <a href='' className=''>
                                    Events
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div className='boxmenu'>{statusDisplay}</div>
                </div>
            );
        } else if (this.state.screenType == 'cover') {
            let logoDisplay = null,
                coverPhotoDisplay = null;
            if (this.state.logo)
                logoDisplay = (
                    <img
                        src={
                            getServerUrl().apiURL +
                            '/uploads/temp/' +
                            this.state.logo
                        }
                        style={{ width: '100%' }}
                    />
                );
            else if (this.state.group.logo)
                logoDisplay = (
                    <img
                        src={
                            getServerUrl().apiURL +
                            '/uploads/group/' +
                            this.state.group.logo
                        }
                        style={{ width: '100%' }}
                    />
                );

            if (this.state.coverPhoto)
                coverPhotoDisplay = (
                    <img
                        src={
                            getServerUrl().apiURL +
                            '/uploads/temp/' +
                            this.state.coverPhoto
                        }
                        style={{ width: '100%' }}
                    />
                );
            else if (this.state.group.coverPhoto)
                coverPhotoDisplay = (
                    <img
                        src={
                            getServerUrl().apiURL +
                            '/uploads/group/' +
                            this.state.group.coverPhoto
                        }
                        style={{ width: '100%' }}
                    />
                );

            return (
                <div className='outbx'>
                    {loadingHtml}
                    <div className='teams-container'>
                        <a
                            href=''
                            className='backbtn'
                            onClick={(e) => this.changeScreen(e, 'menu')}
                        >
                            {' '}
                        </a>
                        <h6>Change Logo/Cover Photo</h6>
                    </div>
                    <div className='boxmenu'>
                        <div>Logo</div>
                        {logoDisplay}
                        <a
                            className='button subbtn'
                            onClick={() => this.openUploadLogo()}
                        >
                            Choose Logo
                        </a>
                        <input
                            type='file'
                            ref={this.uploadLogoRef}
                            onChange={() => this.uploadLogo()}
                            style={{ display: 'none' }}
                        />
                        <p className='text-center'>
                            <small className='text-center'>
                                Please choose at least 400px wide and 400px
                                tall.
                            </small>
                        </p>
                        <br />
                        <br />
                        <div>Cover Photo</div>
                        {coverPhotoDisplay}
                        <a
                            className='button subbtn'
                            onClick={() => this.openUploadCoverPhoto()}
                        >
                            Choose Cover Photo
                        </a>
                        <input
                            type='file'
                            ref={this.uploadCoverPhotoRef}
                            onChange={() => this.uploadCoverPhoto()}
                            style={{ display: 'none' }}
                        />
                        <p className='text-center'>
                            <small className='text-center'>
                                Please choose at least 400px wide and 150px
                                tall.
                            </small>
                        </p>

                        <a
                            className='button subbtn'
                            onClick={(e) => this.updateLogoCoverPhoto(e)}
                        >
                            Save
                        </a>
                    </div>
                </div>
            );
        } else if (this.state.screenType == 'about') {
            return (
                <div className='outbx'>
                    {loadingHtml}
                    <div className='teams-container'>
                        <a
                            href=''
                            className='backbtn'
                            onClick={(e) => this.changeScreen(e, 'menu')}
                        >
                            {' '}
                        </a>
                        <h6>About</h6>
                    </div>
                    <div className='boxmenu'>
                        <p>
                            <Form.Control
                                as='textarea'
                                rows={10}
                                value={this.state.group.description}
                                onChange={this.handleDescription}
                            />
                        </p>

                        <a
                            className='button subbtn'
                            onClick={(e) => this.updateDescription(e)}
                        >
                            Save
                        </a>
                    </div>
                </div>
            );
        } else if (this.state.screenType == 'posts') {
            return (
                <div className='outbx'>
                    {loadingHtml}
                    <div className='teams-container'>
                        <a
                            href=''
                            className='backbtn'
                            onClick={(e) => this.changeScreen(e, 'menu')}
                        >
                            {' '}
                        </a>
                        <h6>Posts</h6>
                    </div>
                    <div className='boxmenu'></div>
                </div>
            );
        } else if (this.state.screenType == 'members') {
            return (
                <div className='outbx'>
                    {loadingHtml}
                    <div className='teams-container'>
                        <a
                            href=''
                            className='backbtn'
                            onClick={(e) => this.changeScreen(e, 'menu')}
                        >
                            {' '}
                        </a>
                        <h6>Members</h6>
                    </div>

                    {this.state.memberRequests.map((member) => (
                        <div
                            key={'group-member-' + member._id}
                            className='boxmenu mmbr'
                        >
                            <div className='userthumb'>
                                <div className='userbx'>
                                    <img
                                        src={
                                            member.profilePicture
                                                ? `${
                                                      getServerUrl().apiURL
                                                  }/uploads/user/${
                                                      member.profilePicture
                                                  }`
                                                : profileBlank
                                        }
                                    />
                                </div>
                                <div>
                                    {member.firstName + ' ' + member.lastName}
                                </div>
                                <div className='col'>
                                    <span className='pushright'>
                                        <a
                                            className='green'
                                            href=''
                                            onClick={(e) =>
                                                this.acceptMember(e, member._id)
                                            }
                                        >
                                            {' '}
                                            Accept{' '}
                                        </a>{' '}
                                        &nbsp; | &nbsp;{' '}
                                        <a
                                            href=''
                                            onClick={(e) =>
                                                this.rejectMember(e, member._id)
                                            }
                                        >
                                            {' '}
                                            Reject{' '}
                                        </a>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {this.state.members.map((member) => (
                        <div
                            key={'group-member-' + member._id}
                            className='boxmenu mmbr'
                        >
                            <div className='userthumb'>
                                <div className='userbx'>
                                    <img src={member.profilePicture} />
                                </div>
                                <div>
                                    {member.firstName + ' ' + member.lastName}
                                </div>
                                <div className='col'>
                                    <a
                                        className='pushright'
                                        href=''
                                        onClick={(e) =>
                                            this.removeMember(e, member._id)
                                        }
                                    >
                                        Remove
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                    {this.state.members.length === 0 &&
                        this.state.memberRequests.length === 0 && (
                            <div className='boxmenu mmbr'>No members found</div>
                        )}
                </div>
            );
        } else if (this.state.screenType == 'events') {
            return (
                <div className='outbx'>
                    {loadingHtml}
                    <div className='teams-container'>
                        <a
                            href=''
                            className='backbtn'
                            onClick={(e) => this.changeScreen(e, 'menu')}
                        >
                            {' '}
                        </a>
                        <h6>
                            Events{' '}
                            <a
                                href=''
                                className='pushright createbtn f14'
                                onClick={(e) =>
                                    this.changeScreen(e, 'create-event')
                                }
                            >
                                Create Event
                            </a>
                        </h6>
                    </div>

                    {this.state.events.length > 0 &&
                        this.state.events.map((event) => {
                            let eventStart = new Date(event.start);
                            let eventEnd = new Date(event.end);
                            let eventStartDisplay =
                                dayNames[eventStart.getDay()] +
                                ' ' +
                                eventStart.getDate() +
                                ' ' +
                                monthNames[eventStart.getMonth()] +
                                ' ' +
                                eventStart.getFullYear() +
                                ' ' +
                                eventStart.getHours() +
                                ':' +
                                eventStart.getMinutes();
                            let eventEndDisplay =
                                dayNames[eventEnd.getDay()] +
                                ' ' +
                                eventEnd.getDate() +
                                ' ' +
                                monthNames[eventEnd.getMonth()] +
                                ' ' +
                                eventEnd.getFullYear() +
                                ' ' +
                                eventEnd.getHours() +
                                ':' +
                                eventEnd.getMinutes();

                            return (
                                <div
                                    key={'group-event-' + event._id}
                                    className='boxmenu mmbr'
                                >
                                    <div>
                                        <div className='userbx'>
                                            <a href=''>
                                                <img
                                                    src={
                                                        getServerUrl().apiURL +
                                                        '/uploads/event/' +
                                                        event.logo
                                                    }
                                                />
                                            </a>
                                        </div>
                                        <h6>{event.title}</h6>
                                        <small>
                                            {eventStartDisplay +
                                                ' - ' +
                                                eventEndDisplay}
                                        </small>
                                        <p className='text-right'>
                                            <a
                                                href=''
                                                className=''
                                                onClick={(e) =>
                                                    this.removeEvent(
                                                        e,
                                                        event._id
                                                    )
                                                }
                                            >
                                                Remove
                                            </a>
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    {this.state.events.length === 0 && (
                        <div className='boxmenu mmbr'>No events found</div>
                    )}
                </div>
            );
        } else if (this.state.screenType == 'create-event') {
            return (
                <div className='outbx'>
                    {loadingHtml}
                    <div className='teams-container'>
                        <a
                            href=''
                            className='backbtn'
                            onClick={(e) => this.changeScreen(e, 'menu')}
                        >
                            {' '}
                        </a>
                        <h6>
                            Create Event{' '}
                            <a
                                href=''
                                className='pushright createbtn f14'
                                onClick={(e) => this.changeScreen(e, 'events')}
                            >
                                Cancel
                            </a>
                        </h6>
                    </div>
                    <div className='boxmenu mmbr crtevnt'>
                        <form>
                            <div className='form-group'>
                                <label
                                    className='form-label'
                                    htmlFor='formEventName'
                                >
                                    Event Name
                                </label>
                                <input
                                    placeholder=''
                                    type='text'
                                    id='formEventName'
                                    className='form-control'
                                    value={this.state.event.title}
                                    onChange={this.handleEventTitle}
                                />
                            </div>
                            <div className='row'>
                                <div className='col'>
                                    <div className='form-group'>
                                        <label
                                            className='form-label'
                                            htmlFor='formEventStart'
                                        >
                                            Start Date
                                        </label>
                                        <input
                                            placeholder=''
                                            type='date'
                                            id='formEventStart'
                                            className='form-control'
                                            value={this.state.event.startDate}
                                            onChange={this.handleEventStartDate}
                                        />
                                    </div>
                                </div>
                                <div className='col pl-0'>
                                    <div className='form-group'>
                                        <label
                                            className='form-label'
                                            htmlFor='formEventEnd'
                                        >
                                            End Date
                                        </label>
                                        <input
                                            placeholder=''
                                            type='date'
                                            id='formEventEnd'
                                            className='form-control'
                                            value={this.state.event.endDate}
                                            onChange={this.handleEventEndDate}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='row'>
                                <div className='col'>
                                    <div className='form-group'>
                                        <label
                                            className='form-label'
                                            htmlFor='formEventStartTime'
                                        >
                                            Start Time
                                        </label>
                                        <input
                                            placeholder=''
                                            type='time'
                                            id='formEventStartTime'
                                            className='form-control'
                                            value={this.state.event.startTime}
                                            onChange={this.handleEventStartTime}
                                        />
                                    </div>
                                </div>
                                <div className='col pl-0'>
                                    <div className='form-group'>
                                        <label
                                            className='form-label'
                                            htmlFor='formEventEndTime'
                                        >
                                            End Time
                                        </label>
                                        <input
                                            placeholder=''
                                            type='time'
                                            id='formEventEndTime'
                                            className='form-control'
                                            value={this.state.event.endTime}
                                            onChange={this.handleEventEndTime}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className='form-group'>
                                <label
                                    className='form-label'
                                    htmlFor='formEventAbout'
                                >
                                    About Event
                                </label>
                                <textarea
                                    rows='3'
                                    id='formEventAbout'
                                    className='form-control'
                                    onChange={this.handleEventDescription}
                                    value={this.state.event.description}
                                ></textarea>
                            </div>

                            <div className='form-group'>
                                <a
                                    className='button'
                                    onClick={() => this.openUploadEventLogo()}
                                >
                                    Upload Photo
                                </a>
                                <input
                                    type='file'
                                    ref={this.uploadEventLogoRef}
                                    onChange={() => this.uploadEventLogo()}
                                    style={{ display: 'none' }}
                                />
                            </div>

                            <div className='form-group'>
                                <a
                                    className='button subbtn'
                                    onClick={(e) => this.addEvent(e)}
                                >
                                    Create Event
                                </a>
                            </div>
                        </form>
                    </div>
                </div>
            );
        }
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    };
};

export default connect(mapStateToProps, {})(AdminGroup);
