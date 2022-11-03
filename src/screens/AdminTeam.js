import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Tabs, Tab, Form, Table } from 'react-bootstrap';
import loading from '../assets/loading.svg';
import {
    getServerUrl,
    getTeamAdmin,
    getTeamMembers,
    getTeamCoaches,
    updateTeamStatus,
    teamUpload,
    updateTeamLogoCoverPhoto,
    updateTeamDescription,
    eventUpload,
    teamEventAdd,
    getTeamEvents,
    teamEventRemove,
    teamMemberRemove,
    teamMemberAccept,
    teamMemberReject,
    getActivityByTitle,
    updateTeamPageInfo,
    updateTeamPostManagement,
    getPostByTeam,
    getPostsByTypeAndDate,
    getPendingPostByTeam,
    getPendingTeamPostByDateRange,
    searchPendingTeamPostsWithDateRange,
    searchTeamPosts,
    searchTeamUsers,
    updatePostStatus,
    updatePostsStatus,
    searchTeamCoaches,
    teamAddCoach,
    mobileQuery,
    getClubMembers,
    updatePageMembersStatus,
    updatePageMembersRole,
} from '../utils/api';

import TeamMembershipsAdmin from '../components/teams/admin/Memberships';
import LeftSideBarTeam from '../components/LeftSideBarTeam';
import { assignTimeAgo, formatDate } from '../utils/helper';
import AsyncSelect from 'react-select/async';

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

const loadOptions = (inputValue, callback) => {
    searchTeamCoaches(inputValue).then((resp) => {
        if (resp.success == true) {
            let options = [];
            for (let i = 0; i < resp.coaches.length; i++) {
                options.push({
                    value: resp.coaches[i]._id,
                    label:
                        resp.coaches[i].firstName +
                        ' ' +
                        resp.coaches[i].lastName +
                        ' (' +
                        resp.coaches[i].email +
                        ')',
                });
            }
            callback(options);
        }
    });
};

class AdminTeam extends Component {
    constructor(props) {
        super(props);

        this.state = {
            team: {
                title: '',
                description: '',
                activityType: '',
                phone: '',
                address: '',
                cityStateCountry: '',
                logo: '',
                hideAddress: false,
                openingTimings: [],
                operatingStartHours: '',
                operatingEndHours: '',
                postRestriction: 'allowMembers',
                postReqApproval: true,
            },
            event: {
                title: '',
                description: '',
                startDate: '',
                endDate: '',
                startTime: '',
                endTime: '',
                logo: '',
                location: '',
            },
            screenType: 'menu',
            logo: '',
            coverPhoto: '',
            memberRequests: [],
            members: [],
            coaches: [],
            events: [],
            posts: [],
            postsOwner: [],
            postsForApprovalDateRange: 'all',
            searchPendingPosts: '',
            postsForAdminAction: '',
            searchTeamPostsQuery: '',
            filterPostsType: 'all',
            filterPostsTime: 'allTime',
            hasAppliedDateType: false,
            hasCheckedAll: false,
            hasSearched: false,
            pendingPosts: [],
            pendingPostsOwner: [],
            allMembers: [],
            bannedUsers: [],
            freeUsers: [],
            paidUsers: [],
            pageMembers: [],
            memberNameQuery: '',
            showPageMembers: 'all',
            actionPageMembers: '',
            saving: false,
            loading: false,
            interestValue: '',
            selectedRestriction: 'allowMembers',
            publishApproval: true,
            coachSearch: '',
        };

        this.uploadLogoRef = React.createRef();
        this.uploadCoverPhotoRef = React.createRef();
        this.uploadEventLogoRef = React.createRef();
        this.handleDescription = this.handleDescription.bind(this);
    }

    componentDidMount() {
        getTeamAdmin(this.props.teamSlug).then((resp) => {
            if (resp.success === true) {
                // admin page accessible by creator/admins/coaches/mod
                if (
                    resp.team.creatorId === this.props.user._id ||
                    (resp.team.administrators &&
                        resp.team.administrators.some(
                            (uId) =>
                                uId
                                    .toString()
                                    .localeCompare(
                                        this.props.user._id.toString()
                                    ) === 0
                        )) ||
                    (resp.team.coaches &&
                        resp.team.coaches.some(
                            (uId) =>
                                uId
                                    .toString()
                                    .localeCompare(
                                        this.props.user._id.toString()
                                    ) === 0
                        )) ||
                    (resp.team.moderators &&
                        resp.team.moderators.some(
                            (uId) =>
                                uId
                                    .toString()
                                    .localeCompare(
                                        this.props.user._id.toString()
                                    ) === 0
                        ))
                )
                    this.setState({ team: resp.team });

                resp.team.postRestriction &&
                    this.setState({
                        selectedRestriction: resp.team.postRestriction,
                    });

                resp.team.postReqApproval &&
                    this.setState({
                        publishApproval: resp.team.postReqApproval,
                    });
            } else alert('Error fetching data, please try again');
        });

        getPostByTeam(this.props.teamSlug).then((res) => {
            this.setState({
                posts: res.posts,
                postsOwner: res.owners,
            });
        });

        getPendingPostByTeam(this.props.teamSlug).then((res) => {
            this.setState({
                pendingPosts: res.posts,
                pendingPostsOwner: res.owners,
            });
        });
    }

    changeScreen = (e, screenType) => {
        e.preventDefault();
        if (screenType === 'members') {
            if (
                this.state.team.membersCount > 0 ||
                this.state.team.memberRequestsCount > 0
            ) {
                getTeamMembers(this.state.team._id).then((resp) => {
                    if (resp.success === true)
                        this.setState({
                            screenType,
                            members: resp.members,
                            memberRequests: resp.memberRequests,
                        });
                });
            } else this.setState({ screenType });
        } else if (screenType === 'events') {
            getTeamEvents(this.state.team._id).then((resp) => {
                if (resp.success === true)
                    this.setState({ screenType, events: resp.events });
            });
        } else if (screenType === 'coaches') {
            getTeamCoaches(this.state.team._id).then((resp) => {
                if (resp.success == true)
                    this.setState({ screenType, coaches: resp.coaches });
            });
        } else if (screenType === 'pageMembers') {
            getClubMembers(this.props.teamSlug).then((res) => {
                if (res.success === true) {
                    let users = [];

                    switch (this.state.showPageMembers) {
                        case 'all':
                            users = [...res.members];
                            break;
                        case 'banned':
                            users = [...res.bannedUsers];
                            break;
                        case 'paid':
                            users = [...res.paidUsers];
                            break;
                        case 'free':
                            users = [...res.freeUsers];
                            break;
                        default:
                            break;
                    }

                    this.setState({
                        members: res.members,
                        bannedUsers: res.bannedUsers,
                        freeUsers: res.freeUsers,
                        paidUsers: res.paidUsers,
                        pageMembers: users,
                        screenType,
                    });
                }
            });
        } else this.setState({ screenType });
    };

    changeTeamStatus = (status) => {
        let team = {
            id: this.state.team._id,
            status,
        };
        updateTeamStatus(team).then((resp) => {
            if (resp.success === true) {
                alert(resp.msg);
                this.setState({
                    loading: false,
                    team: { ...this.state.team, status },
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
            team: { ...this.state.team, description: e.target.value },
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
        let teamLogo = this.uploadLogoRef.current.files[0];
        let fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        if (teamLogo === undefined) {
            alert('Please select image file to upload');
        } else if (fileTypes.indexOf(teamLogo.type) === -1) {
            alert('Please select file type of JPEG, JPG, PNG or GIF');
        } else {
            const Imagedata = new FormData();
            Imagedata.append('teamUpload', teamLogo);
            teamUpload(Imagedata).then((imgUpload) => {
                this.setState({ loading: false, logo: imgUpload.filename });
            });
            this.setState({ loading: true });
        }
    };

    uploadCoverPhoto = (e) => {
        let teamCoverPhoto = this.uploadCoverPhotoRef.current.files[0];
        let fileTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

        if (teamCoverPhoto === undefined) {
            alert('Please select image file to upload');
        } else if (fileTypes.indexOf(teamCoverPhoto.type) === -1) {
            alert('Please select file type of JPEG, JPG, PNG or GIF');
        } else {
            const Imagedata = new FormData();
            Imagedata.append('teamUpload', teamCoverPhoto);
            teamUpload(Imagedata).then((imgUpload) => {
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
        let teamMedia = {
            id: this.state.team._id,
            logo: this.state.logo,
            coverPhoto: this.state.coverPhoto,
        };
        updateTeamLogoCoverPhoto(teamMedia).then((resp) => {
            if (resp.success === true) {
                alert(resp.msg);
                let team = { ...this.state.team };
                if (teamMedia.logo) team.logo = teamMedia.logo;
                if (teamMedia.coverPhoto)
                    team.coverPhoto = teamMedia.coverPhoto;
                this.setState({
                    loading: false,
                    team,
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
        let team = {
            id: this.state.team._id,
            description: this.state.team.description,
        };
        updateTeamDescription(team).then((resp) => {
            if (resp.success === true) {
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

    handleEventLocation = (e) => {
        this.setState({
            event: { ...this.state.event, location: e.target.value },
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
            eventUpload(Imagedata).then((imgUpload) => {
                this.setState({
                    loading: false,
                    event: { ...this.state.event, logo: imgUpload.filename },
                });
            });
            this.setState({ loading: true });
        }
    };

    addEvent = async (e) => {
        e.preventDefault();
        if (this.state.event.title === '') {
            alert('Enter event name');
            return;
        } else if (this.state.event.startDate === '') {
            alert('Enter event start date');
            return;
        } else if (this.state.event.startTime === '') {
            alert('Enter event start time');
            return;
        } else if (this.state.event.endDate === '') {
            alert('Enter event end date');
            return;
        } else if (this.state.event.endTime === '') {
            alert('Enter event end time');
            return;
        } else if (this.state.event.description === '') {
            alert('Enter event description');
            return;
        } else if (this.state.event.location === '') {
            alert('Event enter location');
            return;
        } else if (this.state.event.logo === '') {
            alert('Upload event logo');
            return;
        } else {
            let teamEvent = this.state.event;
            let slugify = require('slugify');
            teamEvent.slug = slugify(teamEvent.title, {
                replacement: '-',
                remove: null,
                lower: true,
            });
            teamEvent.creatorId = this.props.user._id;
            teamEvent.teamId = this.state.team._id;

            // get interest data
            if (this.state.interestValue) {
                await getActivityByTitle(this.state.interestValue).then(
                    (activity) => {
                        if (activity._id) {
                            teamEvent.interest = {
                                id: activity._id,
                                name: activity.title,
                                icon: activity.activity_icon,
                            };
                        }
                    }
                );
            }

            await teamEventAdd(teamEvent).then((resp) => {
                if (resp.success === false) {
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
                            location: '',
                        },
                    });
                }
            });
            this.setState({ loading: true });
        }
    };

    acceptMember = (e, userId) => {
        e.preventDefault();
        let teamId = this.state.team._id;
        teamMemberAccept(userId, teamId).then((resp) => {
            if (resp.success === false) {
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
        let teamId = this.state.team._id;
        teamMemberReject(userId, teamId).then((resp) => {
            if (resp.success === false) {
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
        let teamId = this.state.team._id;
        teamMemberRemove(userId, teamId).then((resp) => {
            if (resp.success === false) {
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
        let teamId = this.state.team._id;
        teamEventRemove(eventId, teamId, 'remove').then((resp) => {
            if (resp.success === false) {
                alert(resp.msg);
            } else {
                alert(resp.msg);
                this.setState({ loading: false, events: resp.events });
            }
        });
        this.setState({ loading: true });
    };

    processOpTimingsList = (dayOfWeek) => {
        let { operatingTimings } = this.state.team;

        // remove checkbox tick
        if (operatingTimings.includes(dayOfWeek)) {
            operatingTimings = operatingTimings.filter(
                (dow) => dow.localeCompare(dayOfWeek) !== 0
            );
        } else {
            operatingTimings.push(dayOfWeek);

            // arrange in the order of Mon,Tue,Wed,Thu,Fri,Sat,Sun
            let temp = [];
            const dayOfWeekList = [
                'Mon',
                'Tue',
                'Wed',
                'Thu',
                'Fri',
                'Sat',
                'Sun',
            ];
            for (const dow of dayOfWeekList) {
                if (operatingTimings.includes(dow)) {
                    temp.push(dow);
                }
            }
            // copy temp list (sorted day of week) into operatingTimings
            operatingTimings = [...temp];
        }

        return operatingTimings;
    };

    handleSaveInformation = (e) => {
        const { team } = this.state;
        team.logo = this.state.logo;

        updateTeamPageInfo(this.state.team.slug, this.state.team).then(
            (res) => {
                if (res.success === true) {
                    this.changeScreen(e, 'menu');
                }
            }
        );
    };

    savePostManagement = async (e) => {
        const postRestOpt = document.querySelector(
            'input[name="formHorizontalRadios"]:checked'
        ).value;

        const publishNeedApproval = document.getElementById(
            'formHorizontalCheck'
        ).checked;

        if (postRestOpt || publishNeedApproval) {
            await updateTeamPostManagement(
                this.state.team.slug,
                postRestOpt,
                publishNeedApproval
            ).then((res) => {
                if (res.success === true) {
                    this.changeScreen(e, 'menu');
                }
            });
        } else {
            this.changeScreen(e, 'menu');
        }
    };

    handlePostRestriction = (e) => {
        this.setState({ selectedRestriction: e.target.value });
    };

    updatePostStatus = (e, postId, status, index) => {
        e.preventDefault();

        updatePostStatus(postId, status).then((res) => {
            if (res.success === true) {
                // update button status in 1 sec
                setTimeout(() => {
                    if (status === 'active') {
                        document.getElementById(
                            `approveBtn-${postId}`
                        ).innerHTML = 'Approved';

                        // remove pending post
                        setTimeout(() => {
                            const pendingPosts = [...this.state.pendingPosts];
                            const pendingPostsOwner = [
                                ...this.state.pendingPostsOwner,
                            ];

                            pendingPosts.splice(index, 1);
                            pendingPostsOwner.splice(index, 1);

                            this.setState({
                                pendingPosts,
                                pendingPostsOwner,
                            });
                        }, 500);
                    } else if (status === 'declined') {
                        const declineBtn = document.getElementById(
                            `declineBtn-${postId}`
                        );
                        declineBtn.innerHTML = 'Declined';

                        // remove pending post
                        setTimeout(() => {
                            const pendingPosts = [...this.state.pendingPosts];
                            const pendingPostsOwner = [
                                ...this.state.pendingPostsOwner,
                            ];

                            pendingPosts.splice(index, 1);
                            pendingPostsOwner.splice(index, 1);

                            this.setState({
                                pendingPosts,
                                pendingPostsOwner,
                            });
                        }, 500);
                    }
                }, 500);
            }
        });
    };

    updatePostsStatus = (e) => {
        e.preventDefault();

        let checkedPosts = [];
        let uncheckedPosts = [];
        let uncheckPostsOwner = [];
        for (let i = 0; i < this.state.posts.length; i++) {
            if (document.getElementById(`checkbox-${i}`).checked) {
                checkedPosts.push(this.state.posts[i]);
            } else {
                uncheckedPosts.push(this.state.posts[i]);
                uncheckPostsOwner.push(this.state.postsOwner[i]);
            }
        }

        updatePostsStatus(checkedPosts, this.state.postsForAdminAction).then(
            (res) => {
                if (res.success === true) {
                    // retain unselected posts in 0.5 sec
                    setTimeout(() => {
                        this.setState({
                            posts: uncheckedPosts,
                            postsOwner: uncheckPostsOwner,
                        });
                    }, 500);
                }
            }
        );
    };

    handlePendingPostsSortedByDate = async (e) => {
        const range = e.target.value;

        await getPendingTeamPostByDateRange(this.props.teamSlug, range).then(
            (res) => {
                if (res.success === true) {
                    this.setState({
                        postsForApprovalDateRange: range,
                        pendingPosts: res.posts,
                        pendingPostsOwner: res.owners,
                    });
                }
            }
        );
    };

    handleSearchPendingPosts = async (e) => {
        e.preventDefault();

        if (this.state.searchPendingPosts) {
            await searchPendingTeamPostsWithDateRange(
                this.state.searchPendingPosts,
                this.props.teamSlug,
                this.state.postsForApprovalDateRange
            ).then((res) => {
                if (res.success === true) {
                    this.setState({
                        pendingPosts: res.posts,
                        pendingPostsOwner: res.owners,
                    });
                }
            });
        } else {
            await getPendingPostByTeam(this.props.teamSlug).then((res) => {
                this.setState({
                    pendingPosts: res.posts,
                    pendingPostsOwner: res.owners,
                });
            });
        }
    };

    handleTeamPostsSearchClick = async (e) => {
        e.preventDefault();

        if (this.state.searchTeamPostsQuery) {
            // search for team posts with the query
            await searchTeamPosts(
                this.state.searchTeamPostsQuery,
                this.props.teamSlug,
                this.state.posts
            ).then((res) => {
                if (res.success === true) {
                    this.setState({
                        posts: res.posts,
                        postsOwner: res.owners,
                        hasSearched: true,
                    });
                }
            });
        } else {
            // has not applied date type
            if (!this.state.hasAppliedDateType) {
                // get all team posts
                await getPostByTeam(this.props.teamSlug).then((res) => {
                    this.setState({
                        posts: res.posts,
                        postsOwner: res.owners,
                    });
                });
            }
            // apply date type to return back to the original state
            else {
                await getPostsByTypeAndDate(
                    this.props.teamSlug,
                    this.state.filterPostsType,
                    this.state.filterPostsTime
                ).then((res) => {
                    if (res.success === true) {
                        this.setState({
                            posts: res.posts,
                            postsOwner: res.owners,
                            hasAppliedDateType: true,
                        });
                    }
                });
            }
        }
    };

    handlePostsByAdminClearSearch = async (e) => {
        e.preventDefault();

        // has not applied date type
        if (!this.state.hasAppliedDateType) {
            // get all team posts
            await getPostByTeam(this.props.teamSlug).then((res) => {
                // uncheck the checkbox for checking all
                document.getElementById(`checkallbox`).checked = false;

                this.setState({
                    posts: res.posts,
                    postsOwner: res.owners,
                    searchTeamPostsQuery: '',
                    hasCheckedAll: false,
                    hasSearched: false,
                });
            });
        }
        // apply date type to return back to the original state
        else {
            await getPostsByTypeAndDate(
                this.props.teamSlug,
                this.state.filterPostsType,
                this.state.filterPostsTime
            ).then((res) => {
                if (res.success === true) {
                    // uncheck the checkbox for checking all
                    document.getElementById(`checkallbox`).checked = false;

                    this.setState({
                        posts: res.posts,
                        postsOwner: res.owners,
                        hasAppliedDateType: true,
                        searchTeamPostsQuery: '',
                        hasCheckedAll: false,
                    });
                }
            });
        }
    };

    handleApplyPostsDateType = async (e) => {
        e.preventDefault();

        await getPostsByTypeAndDate(
            this.props.teamSlug,
            this.state.filterPostsType,
            this.state.filterPostsTime
        ).then(async (res) => {
            if (res.success === true) {
                // uncheck the checkbox for checking all
                document.getElementById(`checkallbox`).checked = false;

                // apply back the search if searched is performed previously
                if (this.state.hasSearched) {
                    await searchTeamPosts(
                        this.state.searchTeamPostsQuery,
                        this.props.teamSlug,
                        res.posts
                    ).then((resp) => {
                        if (resp.success === true) {
                            this.setState({
                                posts: resp.posts,
                                postsOwner: resp.owners,
                                hasAppliedDateType: true,
                                hasCheckedAll: false,
                            });
                        }
                    });
                } else {
                    this.setState({
                        posts: res.posts,
                        postsOwner: res.owners,
                        hasAppliedDateType: true,
                        hasCheckedAll: false,
                    });
                }
            }
        });
    };

    handleClearPostsDateType = async (e) => {
        e.preventDefault();

        await getPostByTeam(this.props.teamSlug).then((res) => {
            // uncheck the checkbox for checking all
            document.getElementById(`checkallbox`).checked = false;

            this.setState({
                posts: res.posts,
                postsOwner: res.owners,
                filterPostsType: 'all',
                filterPostsTime: 'allTime',
                hasAppliedDateType: false,
                hasCheckedAll: false,
            });
        });
    };

    checkAllPosts = () => {
        const { hasCheckedAll } = this.state;

        for (let i = 0; i < this.state.posts.length; i++) {
            document.getElementById(`checkbox-${i}`).checked = !hasCheckedAll;
        }

        this.setState({
            hasCheckedAll: !hasCheckedAll,
        });
    };

    searchPageMembers = (e, users) => {
        const query = e.target.value;
        if (query) {
            searchTeamUsers(query, users).then((res) => {
                if (res.success === true) {
                    this.setState({
                        memberNameQuery: query,
                        pageMembers: res.users,
                    });
                }
            });
        } else {
            const { members, bannedUsers, paidUsers, freeUsers } = this.state;

            switch (this.state.showPageMembers) {
                case 'all':
                    users = [...members];
                    break;
                case 'banned':
                    users = [...bannedUsers];
                    break;
                case 'paid':
                    users = [...paidUsers];
                    break;
                case 'free':
                    users = [...freeUsers];
                    break;
                default:
                    break;
            }

            this.setState({ memberNameQuery: query, pageMembers: users });
        }
    };

    renderPageMembers = () => {
        const { team } = this.state;

        return (
            <div className='outbx'>
                <div className='teams-container'>
                    <a
                        href=''
                        className='backbtn'
                        onClick={(e) => this.changeScreen(e, 'menu')}
                    >
                        {' '}
                    </a>
                    <h6>Page Members</h6>
                </div>
                <div className='boxmenu'>
                    <div className='admincntnt bxshadow'>
                        <h4>Page Members ({this.state.members.length})</h4>
                        <Form>
                            <div className='mb-3'>
                                <div className='mb-3 row'>
                                    <div className='col'>
                                        <label
                                            className='form-label'
                                            htmlFor='formPageMemberShow'
                                        >
                                            Show
                                        </label>
                                        <select
                                            className='form-control form-control-lg'
                                            id='formPageMemberShow'
                                            onChange={this.displayPageMembers}
                                            value={this.state.showPageMembers}
                                        >
                                            <option value='all'>All</option>
                                            <option value='banned'>
                                                Banned users
                                            </option>
                                            <option value='paid'>
                                                Paid members
                                            </option>
                                            <option value='free'>
                                                Free members
                                            </option>
                                        </select>
                                    </div>
                                    <div className='col'>
                                        <label
                                            className='form-label'
                                            htmlFor='formGroupMemberName'
                                        >
                                            Search
                                        </label>
                                        <input
                                            placeholder='Type Member Name'
                                            type='text'
                                            id='formGroupMemberName'
                                            className='form-control'
                                            onChange={(e) => {
                                                this.searchPageMembers(
                                                    e,
                                                    this.state.pageMembers
                                                );
                                            }}
                                            value={this.state.memberNameQuery}
                                        />
                                    </div>
                                    <div className='col'>
                                        <label
                                            className='form-label'
                                            htmlFor='formGridZip'
                                        >
                                            Actions
                                        </label>
                                        <select
                                            className='form-control form-control-lg'
                                            onChange={(e) =>
                                                this.setState({
                                                    actionPageMembers:
                                                        e.target.value,
                                                })
                                            }
                                            value={this.state.actionPageMembers}
                                        >
                                            <option value=''>
                                                -Select One-
                                            </option>
                                            <option value='ban'>
                                                Ban from Page
                                            </option>
                                            <option value='remove'>
                                                Remove from Page
                                            </option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </Form>

                        <p className='f12'>
                            <b>Banned:</b> Person or group of people banned
                            can’t post, comment or take other actions on the
                            page but they can still view activity on the page
                        </p>
                        <p className='f12'>
                            <b>Removed:</b> Person or group of people who are
                            removed will be set to unfollow the page and no
                            longer considered as members
                        </p>
                        <p className='f12'>
                            <b>Admin:</b> Admin have all the rights to modify
                            and operate page
                        </p>
                        <p className='f12'>
                            <b>Coach:</b> Coach can add modify plans, posts and
                            members
                        </p>
                        <p className='f12'>
                            <b>Moderator:</b> Moderator can Approve and
                            Disapprove posts only
                        </p>

                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th> </th>
                                    <th>Name</th>
                                    <th>Current Role</th>
                                    <th>Assign Role</th>
                                    <th>Member Since</th>
                                </tr>
                            </thead>
                            <tbody className='imtbl'>
                                {this.state.pageMembers.map((member, index) => (
                                    <tr key={`page-members-${member._id}`}>
                                        <td>
                                            <input
                                                name='group1'
                                                type='checkbox'
                                                id={`page-members-checkbox-${index}`}
                                                className='form-check-input'
                                            />
                                        </td>
                                        <td>
                                            {member.profilePicture && (
                                                <div className='userbx'>
                                                    <img
                                                        src={`${
                                                            getServerUrl()
                                                                .apiURL
                                                        }/uploads/user/${
                                                            member.profilePicture
                                                        }`}
                                                    />
                                                </div>
                                            )}{' '}
                                            {`${member.firstName} ${member.lastName}`}
                                        </td>
                                        <td>
                                            {`${
                                                team.administrators &&
                                                team.administrators.some(
                                                    (uId) =>
                                                        uId
                                                            .toString()
                                                            .localeCompare(
                                                                member._id.toString()
                                                            ) === 0
                                                )
                                                    ? team.coaches &&
                                                      team.coaches.some(
                                                          (uId) =>
                                                              uId
                                                                  .toString()
                                                                  .localeCompare(
                                                                      member._id.toString()
                                                                  ) === 0
                                                      )
                                                        ? 'Admin, Coach'
                                                        : 'Admin'
                                                    : team.coaches &&
                                                      team.coaches.some(
                                                          (uId) =>
                                                              uId
                                                                  .toString()
                                                                  .localeCompare(
                                                                      member._id.toString()
                                                                  ) === 0
                                                      )
                                                    ? 'Coach'
                                                    : team.moderators &&
                                                      team.moderators.some(
                                                          (uId) =>
                                                              uId
                                                                  .toString()
                                                                  .localeCompare(
                                                                      member._id.toString()
                                                                  ) === 0
                                                      )
                                                    ? 'Moderator'
                                                    : ''
                                            }`}
                                        </td>
                                        <td>
                                            <select
                                                className='form-select form-select-sm'
                                                id={`role-${index}`}
                                            >
                                                <option value=''>
                                                    Assign Role
                                                </option>
                                                <option value='admin'>
                                                    Admin
                                                </option>
                                                <option value='coach'>
                                                    Coach
                                                </option>
                                                <option value='mod'>
                                                    Moderator
                                                </option>
                                            </select>
                                        </td>
                                        <td>12 June 2017</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <p className='mt-4'>
                            <hr />
                        </p>

                        <div className='col-6 nopad mt-2'>
                            <button
                                type='button'
                                className='btn btn-primary button subbtn f16'
                                onClick={this.handleActionsPageMembers}
                            >
                                {this.state.saving ? 'Saving...' : 'Save'}
                            </button>{' '}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    displayPageMembers = (e) => {
        const { members, bannedUsers, paidUsers, freeUsers, memberNameQuery } =
            this.state;
        const query = e.target.value;
        let pageMembers = [];

        switch (query) {
            case 'all':
                pageMembers = [...members];
                break;
            case 'banned':
                pageMembers = [...bannedUsers];
                break;
            case 'paid':
                pageMembers = [...paidUsers];
                break;
            case 'free':
                pageMembers = [...freeUsers];
                break;
            default:
                break;
        }

        // if there is a search query
        if (memberNameQuery) {
            searchTeamUsers(memberNameQuery, pageMembers).then((res) => {
                if (res.success === true) {
                    this.setState({
                        showPageMembers: query,
                        pageMembers: res.users,
                    });
                }
            });
        } else {
            this.setState({ showPageMembers: query, pageMembers });
        }
    };

    handleActionsPageMembers = async (e) => {
        e.preventDefault();

        let checkedUsersId = [];
        let uncheckedUsersId = [];
        let checkedUsersIdWithRoles = [];
        let roles = [];

        this.setState({ saving: true });

        for (let i = 0; i < this.state.pageMembers.length; i++) {
            if (document.getElementById(`page-members-checkbox-${i}`).checked) {
                checkedUsersId.push(this.state.pageMembers[i]._id);

                const role = document.getElementById(`role-${i}`).value;

                if (role) {
                    checkedUsersIdWithRoles.push(this.state.pageMembers[i]._id);
                    roles.push(role);
                }
            } else {
                uncheckedUsersId.push(this.state.pageMembers[i]);
            }
        }

        // update user roles
        if (checkedUsersIdWithRoles.length > 0 && roles.length > 0) {
            await updatePageMembersRole(
                this.props.teamSlug,
                checkedUsersIdWithRoles,
                roles
            );
        }

        if (this.state.actionPageMembers) {
            await updatePageMembersStatus(
                this.props.teamSlug,
                checkedUsersId,
                this.state.actionPageMembers
            ).then((res) => {
                if (
                    res.success === true &&
                    this.state.actionPageMembers === 'remove'
                ) {
                    this.setState({ pageMembers: uncheckedUsersId });
                }
            });
        }

        this.setState({
            saving: false,
            showPageMembers: 'all',
            memberNameQuery: '',
            actionPageMembers: '',
        });
    };

    handleChange = (field) => (e) => {
        this.setState({ [field]: e.target.value });
    };

    handleCoachInputChange = (newVal) => {
        //this.setState({ coachSearch: newVal });
        return newVal;
    };

    handleCoachChange = (selectedOption) => {
        this.setState({ coachSearch: selectedOption });
    };

    addCoach = (e) => {
        e.preventDefault();
        teamAddCoach(this.state.team._id, this.state.coachSearch.value).then(
            (resp) => {
                if (resp.success == false) {
                    this.setState({ loading: false });
                    alert(resp.msg);
                } else {
                    this.setState({ coaches: resp.coaches, loading: false });
                    alert(resp.msg);
                }
            }
        );
        this.setState({ loading: true });
    };

    render() {
        let loadingHtml = null;
        let isMobile = window.matchMedia(mobileQuery).matches;

        if (this.state.loading && this.state.team.title === '') {
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
        if (!this.state.loading && this.state.team.title === '') {
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

        if (isMobile && this.state.screenType === 'menu') {
            const { team } = this.state;
            let statusDisplay = null;
            if (team.status === 'active')
                statusDisplay = (
                    <ul>
                        <li>
                            <a
                                className=''
                                onClick={() => this.changeTeamStatus('suspend')}
                            >
                                Suspend Team
                            </a>
                        </li>
                        <li>
                            <a
                                className=''
                                onClick={() => this.changeTeamStatus('remove')}
                            >
                                Remove Team
                            </a>
                        </li>
                    </ul>
                );
            else if (team.status === 'suspend')
                statusDisplay = (
                    <ul>
                        <li>
                            <a
                                className=''
                                onClick={() => this.changeTeamStatus('active')}
                            >
                                Activate Team
                            </a>
                        </li>
                        <li>
                            <a
                                className=''
                                onClick={() => this.changeTeamStatus('remove')}
                            >
                                Remove Team
                            </a>
                        </li>
                    </ul>
                );
            else if (team.status === 'remove')
                statusDisplay = (
                    <ul>
                        <li>
                            <a
                                className=''
                                onClick={() => this.changeTeamStatus('active')}
                            >
                                Activate Team
                            </a>
                        </li>
                        <li>
                            <a
                                className=''
                                onClick={() => this.changeTeamStatus('suspend')}
                            >
                                Suspend Team
                            </a>
                        </li>
                    </ul>
                );

            const isCreator = team.creatorId === this.props.user._id;

            const isAdmin =
                team.administrators &&
                team.administrators.some(
                    (uId) =>
                        uId
                            .toString()
                            .localeCompare(this.props.user._id.toString()) === 0
                );

            const isCoach =
                team.coaches &&
                team.coaches.some(
                    (uId) =>
                        uId
                            .toString()
                            .localeCompare(this.props.user._id.toString()) === 0
                );

            const isMod =
                team.moderators &&
                team.moderators.some(
                    (uId) =>
                        uId
                            .toString()
                            .localeCompare(this.props.user._id.toString()) === 0
                );

            return (
                <div className='outbx desktop'>
                    {loadingHtml}

                    <div className='teams-container'>
                        <a href='/teams/' className='backbtn'>
                            {' '}
                        </a>
                        <h6>{team.title}</h6>
                    </div>
                    <div className='container cntntbx'>
                        <div className='row'>
                            <div className='col-md-8 col-lg-9'>
                                <div
                                    className='boxmenu'
                                    style={{ marginTop: '0' }}
                                >
                                    <ul>
                                        {(isCreator || isAdmin) && (
                                            <>
                                                <li
                                                    onClick={(e) =>
                                                        this.changeScreen(
                                                            e,
                                                            'cover'
                                                        )
                                                    }
                                                >
                                                    <a href='' className=''>
                                                        Change Logo/Cover Photo
                                                    </a>
                                                </li>
                                                <li
                                                    onClick={(e) =>
                                                        this.changeScreen(
                                                            e,
                                                            'pageInfo'
                                                        )
                                                    }
                                                >
                                                    <a href='' className=''>
                                                        Edit Page Information
                                                    </a>
                                                </li>
                                                <li
                                                    onClick={(e) =>
                                                        this.changeScreen(
                                                            e,
                                                            'about'
                                                        )
                                                    }
                                                >
                                                    <a href='' className=''>
                                                        About your Team{' '}
                                                    </a>
                                                </li>
                                                <li
                                                    onClick={(e) =>
                                                        this.changeScreen(
                                                            e,
                                                            'pageMembers'
                                                        )
                                                    }
                                                >
                                                    <a href=''>Page Members</a>
                                                </li>
                                            </>
                                        )}
                                        <li
                                            onClick={(e) =>
                                                this.changeScreen(e, 'posts')
                                            }
                                        >
                                            <a href='' className=''>
                                                Posts
                                            </a>
                                        </li>
                                        <li
                                            onClick={(e) =>
                                                this.changeScreen(
                                                    e,
                                                    'postsForApproval'
                                                )
                                            }
                                        >
                                            <a href='' className=''>
                                                Posts for Approval
                                            </a>
                                        </li>
                                        {(isCreator || isAdmin || isCoach) && (
                                            <>
                                                <li
                                                    onClick={(e) =>
                                                        this.changeScreen(
                                                            e,
                                                            'postsByAdmin'
                                                        )
                                                    }
                                                >
                                                    <a href='' className=''>
                                                        Posts by Admin
                                                    </a>
                                                </li>
                                                <li
                                                    onClick={(e) =>
                                                        this.changeScreen(
                                                            e,
                                                            'postManagement'
                                                        )
                                                    }
                                                >
                                                    <a href='' className=''>
                                                        Post Management
                                                    </a>
                                                </li>
                                                <li
                                                    onClick={(e) =>
                                                        this.changeScreen(
                                                            e,
                                                            'members'
                                                        )
                                                    }
                                                >
                                                    <a href='' className=''>
                                                        Members
                                                    </a>
                                                </li>
                                            </>
                                        )}
                                        {(isCreator || isAdmin) && (
                                            <li
                                                onClick={(e) =>
                                                    this.changeScreen(
                                                        e,
                                                        'coaches'
                                                    )
                                                }
                                            >
                                                <a href='' className=''>
                                                    Coaches
                                                </a>
                                            </li>
                                        )}
                                        {(isCreator || isAdmin || isCoach) && (
                                            <>
                                                <li
                                                    onClick={(e) =>
                                                        this.changeScreen(
                                                            e,
                                                            'events'
                                                        )
                                                    }
                                                >
                                                    <a href='' className=''>
                                                        Events
                                                    </a>
                                                </li>
                                                <li
                                                    onClick={(e) =>
                                                        this.changeScreen(
                                                            e,
                                                            'memberships'
                                                        )
                                                    }
                                                >
                                                    <a href='' className=''>
                                                        Memberships
                                                    </a>
                                                </li>
                                            </>
                                        )}
                                    </ul>
                                </div>

                                {isCreator && (
                                    <div className='boxmenu'>
                                        {statusDisplay}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.screenType === 'cover') {
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
            else if (this.state.team.logo)
                logoDisplay = (
                    <img
                        src={
                            getServerUrl().apiURL +
                            '/uploads/team/' +
                            this.state.team.logo
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
            else if (this.state.team.coverPhoto)
                coverPhotoDisplay = (
                    <img
                        src={
                            getServerUrl().apiURL +
                            '/uploads/team/' +
                            this.state.team.coverPhoto
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
        } else if (this.state.screenType === 'pageInfo') {
            let logoDisplay = null;
            if (this.state.team.logo) {
                logoDisplay = (
                    <img
                        src={
                            getServerUrl().apiURL +
                            '/uploads/temp/' +
                            this.state.team.logo
                        }
                        style={{ width: '100%' }}
                    />
                );
            }

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
                        <h6>Edit Page Information</h6>
                    </div>
                    <div className='admincntnt bxshadow'>
                        <h4>Page Info</h4>
                        <Form>
                            <Form.Group
                                className='mb-3'
                                controlId='formGroupPageName'
                            >
                                <Form.Label>Page Name</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Set your page name'
                                    value={this.state.team.title}
                                    onChange={(e) =>
                                        this.setState({
                                            team: {
                                                ...this.state.team,
                                                title: e.target.value,
                                            },
                                        })
                                    }
                                />
                            </Form.Group>

                            <Form.Group
                                className='mb-3'
                                controlId='formGroupDescription'
                            >
                                <Form.Label>Page Description</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Set your page description'
                                    as='textarea'
                                    rows={3}
                                    value={this.state.team.description}
                                    onChange={(e) =>
                                        this.setState({
                                            team: {
                                                ...this.state.team,
                                                description: e.target.value,
                                            },
                                        })
                                    }
                                />
                            </Form.Group>

                            <Form.Group controlId='formFileLg' className='mb-3'>
                                <Form.Label>
                                    Upload Logo (Max 500px by 500px)
                                </Form.Label>
                                {logoDisplay}
                                <a
                                    className='button subbtn'
                                    onClick={() => this.openUploadLogo()}
                                >
                                    Choose Logo
                                </a>
                                <input
                                    type='file'
                                    id='formFileLg'
                                    ref={this.uploadLogoRef}
                                    onChange={() => this.uploadLogo()}
                                    style={{ display: 'none' }}
                                />
                            </Form.Group>
                            <Form.Label className='f14'>
                                Activity Type
                            </Form.Label>
                            <Form.Control
                                as='select'
                                size='lg'
                                default={
                                    this.state.team.activityType
                                        ? this.state.team.activityType
                                        : ''
                                }
                                value={this.state.team.activityType}
                                onChange={(e) =>
                                    this.setState({
                                        team: {
                                            ...this.state.team,
                                            activityType: e.target.value,
                                        },
                                    })
                                }
                                required
                            >
                                <option value='' disabled>
                                    Choose here
                                </option>
                                <option value='Running'>Running</option>
                                <option value='Swimming'>Swimming</option>
                                <option value='Lifting'>Lifting</option>
                            </Form.Control>

                            <Form.Group
                                className='mb-3 mt-3 col-6 nopad'
                                controlId='formGroupPhoneNum'
                            >
                                <Form.Label>Phone Number</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Your Phone Number'
                                    value={
                                        this.state.team.phone
                                            ? this.state.team.phone
                                            : ''
                                    }
                                    onChange={(e) =>
                                        this.setState({
                                            team: {
                                                ...this.state.team,
                                                phone: e.target.value,
                                            },
                                        })
                                    }
                                />
                            </Form.Group>

                            <Form.Group
                                className='mb-3 mt-3'
                                controlId='formGroupAddress'
                            >
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Type Street Address'
                                    value={
                                        this.state.team.address
                                            ? this.state.team.address
                                            : ''
                                    }
                                    onChange={(e) =>
                                        this.setState({
                                            team: {
                                                ...this.state.team,
                                                address: e.target.value,
                                            },
                                        })
                                    }
                                />
                            </Form.Group>

                            <div className='row'>
                                <div className='col-6'>
                                    <Form.Group
                                        className='mb-3 mt-3 nopad'
                                        controlId='formGroupCityStateCountry'
                                    >
                                        <Form.Control
                                            type='text'
                                            placeholder='City, State and Country'
                                            value={
                                                this.state.team.cityStateCountry
                                                    ? this.state.team
                                                          .cityStateCountry
                                                    : ''
                                            }
                                            onChange={(e) =>
                                                this.setState({
                                                    team: {
                                                        ...this.state.team,
                                                        cityStateCountry:
                                                            e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </Form.Group>
                                </div>
                                <div className='col-6 mt-3 f14'>
                                    <Form.Label htmlFor='inline-checkbox-33'>
                                        <input
                                            name='group1'
                                            type='checkbox'
                                            id='inline-checkbox-33'
                                            className='form-check-input'
                                            onChange={() =>
                                                this.setState({
                                                    team: {
                                                        ...this.state.team,
                                                        hideAddress:
                                                            !this.state.team
                                                                .hideAddress,
                                                    },
                                                })
                                            }
                                            checked={
                                                this.state.team.hideAddress
                                                    ? true
                                                    : false
                                            }
                                        />
                                        Customers may visit my business place.
                                        Uncheck will hide the address from
                                        users.
                                    </Form.Label>
                                </div>
                            </div>

                            <Form.Group className='mb-3'>
                                <Form.Label>Opening Timings</Form.Label>
                                <div className='row ml-0 mr-0'>
                                    <div className='col f16'>
                                        <Form.Label htmlFor='inline-checkbox-1'>
                                            <input
                                                name='group1'
                                                type='checkbox'
                                                id='inline-checkbox-1'
                                                className='form-check-input'
                                                onChange={() =>
                                                    this.setState({
                                                        team: {
                                                            ...this.state.team,
                                                            operatingTimings:
                                                                this.processOpTimingsList(
                                                                    'Mon'
                                                                ),
                                                        },
                                                    })
                                                }
                                                checked={this.state.team.operatingTimings.includes(
                                                    'Mon'
                                                )}
                                            />
                                            Mon
                                        </Form.Label>
                                    </div>
                                    <div className='col f16'>
                                        <Form.Label htmlFor='inline-checkbox-2'>
                                            <input
                                                name='group1'
                                                type='checkbox'
                                                id='inline-checkbox-2'
                                                className='form-check-input'
                                                onChange={() =>
                                                    this.setState({
                                                        team: {
                                                            ...this.state.team,
                                                            operatingTimings:
                                                                this.processOpTimingsList(
                                                                    'Tue'
                                                                ),
                                                        },
                                                    })
                                                }
                                                checked={this.state.team.operatingTimings.includes(
                                                    'Tue'
                                                )}
                                            />
                                            Tue
                                        </Form.Label>
                                    </div>
                                    <div className='col f16'>
                                        <Form.Label htmlFor='inline-checkbox-3'>
                                            <input
                                                name='group1'
                                                type='checkbox'
                                                id='inline-checkbox-3'
                                                className='form-check-input'
                                                onChange={() =>
                                                    this.setState({
                                                        team: {
                                                            ...this.state.team,
                                                            operatingTimings:
                                                                this.processOpTimingsList(
                                                                    'Wed'
                                                                ),
                                                        },
                                                    })
                                                }
                                                checked={this.state.team.operatingTimings.includes(
                                                    'Wed'
                                                )}
                                            />
                                            Wed
                                        </Form.Label>
                                    </div>
                                    <div className='col f16'>
                                        <Form.Label htmlFor='inline-checkbox-4'>
                                            <input
                                                name='group1'
                                                type='checkbox'
                                                id='inline-checkbox-4'
                                                className='form-check-input'
                                                onChange={() =>
                                                    this.setState({
                                                        team: {
                                                            ...this.state.team,
                                                            operatingTimings:
                                                                this.processOpTimingsList(
                                                                    'Thu'
                                                                ),
                                                        },
                                                    })
                                                }
                                                checked={this.state.team.operatingTimings.includes(
                                                    'Thu'
                                                )}
                                            />
                                            Thu
                                        </Form.Label>
                                    </div>
                                    <div className='col f16'>
                                        <Form.Label htmlFor='inline-checkbox-5'>
                                            <input
                                                name='group1'
                                                type='checkbox'
                                                id='inline-checkbox-5'
                                                className='form-check-input'
                                                onChange={() =>
                                                    this.setState({
                                                        team: {
                                                            ...this.state.team,
                                                            operatingTimings:
                                                                this.processOpTimingsList(
                                                                    'Fri'
                                                                ),
                                                        },
                                                    })
                                                }
                                                checked={this.state.team.operatingTimings.includes(
                                                    'Fri'
                                                )}
                                            />
                                            Fri
                                        </Form.Label>
                                    </div>
                                    <div className='col f16'>
                                        <Form.Label htmlFor='inline-checkbox-6'>
                                            <input
                                                name='group1'
                                                type='checkbox'
                                                id='inline-checkbox-6'
                                                className='form-check-input'
                                                onChange={() =>
                                                    this.setState({
                                                        team: {
                                                            ...this.state.team,
                                                            operatingTimings:
                                                                this.processOpTimingsList(
                                                                    'Sat'
                                                                ),
                                                        },
                                                    })
                                                }
                                                checked={this.state.team.operatingTimings.includes(
                                                    'Sat'
                                                )}
                                            />
                                            Sat
                                        </Form.Label>
                                    </div>
                                    <div className='col f16'>
                                        <Form.Label htmlFor='inline-checkbox-7'>
                                            <input
                                                name='group1'
                                                type='checkbox'
                                                id='inline-checkbox-7'
                                                className='form-check-input'
                                                onChange={() =>
                                                    this.setState({
                                                        team: {
                                                            ...this.state.team,
                                                            operatingTimings:
                                                                this.processOpTimingsList(
                                                                    'Sun'
                                                                ),
                                                        },
                                                    })
                                                }
                                                checked={this.state.team.operatingTimings.includes(
                                                    'Sun'
                                                )}
                                            />
                                            Sun
                                        </Form.Label>
                                    </div>
                                </div>
                            </Form.Group>

                            <Form.Group
                                className='mb-3 mt-3 col-6 nopad'
                                controlId='formGroupOperatingHours'
                            >
                                <Form.Label>Opening Hours</Form.Label>
                                <div className='row'>
                                    <div className='col'>
                                        <Form.Control
                                            type='time'
                                            placeholder='From'
                                            value={
                                                this.state.team
                                                    .operatingStartHours
                                            }
                                            onChange={(e) =>
                                                this.setState({
                                                    team: {
                                                        ...this.state.team,
                                                        operatingStartHours:
                                                            e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>

                                    <div className='col'>
                                        <Form.Control
                                            type='time'
                                            placeholder='To'
                                            value={
                                                this.state.team
                                                    .operatingEndHours
                                            }
                                            onChange={(e) =>
                                                this.setState({
                                                    team: {
                                                        ...this.state.team,
                                                        operatingEndHours:
                                                            e.target.value,
                                                    },
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </Form.Group>
                            <p className='mt-4'>
                                <hr />
                            </p>
                            <div className='col-6 nopad mt-2'>
                                <button
                                    type='button'
                                    className='btn btn-primary button subbtn f16'
                                    onClick={this.handleSaveInformation}
                                >
                                    Save Information
                                </button>{' '}
                            </div>
                        </Form>
                    </div>
                </div>
            );
        } else if (this.state.screenType === 'about') {
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
                                value={this.state.team.description}
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
        } else if (this.state.screenType === 'pageMembers') {
            return this.renderPageMembers();
        } else if (this.state.screenType === 'posts') {
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
        } else if (this.state.screenType === 'postsForApproval') {
            return (
                <div className='outbx desktop'>
                    {loadingHtml}
                    <div className='teams-container'>
                        <a
                            href=''
                            className='backbtn'
                            onClick={(e) => this.changeScreen(e, 'menu')}
                        >
                            {' '}
                        </a>
                        <h6>Posts for Approval</h6>
                    </div>
                    <div className='boxmenu'>
                        <div className='admincntnt bxshadow'>
                            <h4>Posts For Approval</h4>
                            <div className='row'>
                                <div className='col-5'>
                                    <div className='form-group searchinpt'>
                                        <input
                                            placeholder='Search'
                                            type='text'
                                            className='form-control'
                                            value={
                                                this.state.searchPendingPosts
                                            }
                                            onChange={(e) =>
                                                this.setState({
                                                    searchPendingPosts:
                                                        e.target.value,
                                                })
                                            }
                                        />
                                        <button
                                            onClick={
                                                this.handleSearchPendingPosts
                                            }
                                        >
                                            <img src='/uploads/images/search.png' />
                                        </button>
                                    </div>
                                </div>
                                <div className='col-4'></div>
                                <div className='col-3'>
                                    <select
                                        className='form-control form-control-lg'
                                        id='selectPostsForApproval'
                                        value={
                                            this.state.postsForApprovalDateRange
                                        }
                                        onChange={(e) =>
                                            this.handlePendingPostsSortedByDate(
                                                e
                                            )
                                        }
                                    >
                                        <option value='all'>All</option>
                                        <option value='weekly'>Weekly</option>
                                        <option value='monthly'>Monthly</option>
                                        <option value='quarterly'>
                                            Quarterly
                                        </option>
                                        <option value='yearly'>Yearly</option>
                                    </select>
                                </div>
                            </div>

                            <div className='allpstadmn'>
                                {this.state.pendingPosts.map((post, index) => (
                                    <div
                                        className='postbx psttxt bxshadow'
                                        key={`pendingPosts-${post._id}`}
                                        id={`pendingPosts-${post.postId}`}
                                    >
                                        <div className='usrtop'>
                                            <div className='row'>
                                                <div className='col-10'>
                                                    <div className='userthumb'>
                                                        <a className='userbx'>
                                                            <img src='/uploads/images/user2.jpg' />
                                                        </a>
                                                        <div>
                                                            <a>
                                                                {`${this.state.pendingPostsOwner[index].firstName} ${this.state.pendingPostsOwner[index].lastName}`}
                                                            </a>
                                                            <span className='grytxt'>
                                                                {' '}
                                                                in team{' '}
                                                                <a>
                                                                    {
                                                                        this
                                                                            .state
                                                                            .team
                                                                            .title
                                                                    }
                                                                </a>
                                                            </span>
                                                            <span className='small pstim'>
                                                                {assignTimeAgo(
                                                                    post.time
                                                                )}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                {post.interest.icon && (
                                                    <div className='col-2'>
                                                        <span className='acttyp pushright'>
                                                            <img
                                                                src={`/uploads/images/${post.interest.icon}`}
                                                            />
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        {post.description && (
                                            <p className='f14'>
                                                {post.description}
                                            </p>
                                        )}
                                        {post.imgFileName.length > 0 &&
                                            post.imgFileName.map((img) => (
                                                <div
                                                    className='pstmd'
                                                    key={img}
                                                >
                                                    <img
                                                        src={
                                                            getServerUrl()
                                                                .apiURL +
                                                            '/uploads/posts/' +
                                                            img
                                                        }
                                                    />
                                                </div>
                                            ))}

                                        {post.videoFileName.length > 0 &&
                                            post.videoFileName.map((video) => (
                                                <div
                                                    className='pstmd'
                                                    key={video}
                                                >
                                                    <video
                                                        width='100%'
                                                        height='240'
                                                        controls
                                                    >
                                                        <source
                                                            src={`${
                                                                getServerUrl()
                                                                    .apiURL
                                                            }/uploads/posts/${video}`}
                                                            type='video/mp4'
                                                        ></source>
                                                    </video>
                                                </div>
                                            ))}

                                        <div className='row'>
                                            <div className='col text-left'>
                                                <a
                                                    className='smplbtn btn'
                                                    href='#'
                                                    id={`approveBtn-${post.postId}`}
                                                    onClick={(e) =>
                                                        this.updatePostStatus(
                                                            e,
                                                            post.postId,
                                                            'active',
                                                            index
                                                        )
                                                    }
                                                >
                                                    Approve
                                                </a>
                                                <a
                                                    className=' f14 grytxt'
                                                    href='#'
                                                    id={`declineBtn-${post.postId}`}
                                                    onClick={(e) =>
                                                        this.updatePostStatus(
                                                            e,
                                                            post.postId,
                                                            'declined',
                                                            index
                                                        )
                                                    }
                                                >
                                                    Decline
                                                </a>{' '}
                                            </div>
                                            <div className='col text-center'>
                                                {' '}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.screenType === 'postsByAdmin') {
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
                        <h6>Posts For Admin</h6>
                    </div>
                    <div className='boxmenu'>
                        <div className='admincntnt bxshadow'>
                            <h4>Posts By Admin</h4>

                            <form className='flrts mb-4'>
                                <div className='row'>
                                    <div className='col-md-3'>
                                        <select
                                            className='form-control'
                                            id='postsType'
                                            value={this.state.filterPostsType}
                                            onChange={(e) =>
                                                this.setState({
                                                    filterPostsType:
                                                        e.target.value,
                                                })
                                            }
                                        >
                                            <option value='all'>
                                                All Posts
                                            </option>

                                            <option value='public'>
                                                Public Posts Only
                                            </option>

                                            <option value='member'>
                                                Member Posts Only
                                            </option>

                                            <option value='coach'>
                                                Coaches Posts Only
                                            </option>

                                            <option value='moderator'>
                                                Moderators Posts Only
                                            </option>
                                            <option value='admin'>
                                                Admin Posts Only
                                            </option>
                                        </select>
                                    </div>

                                    <div className='col-md-3'>
                                        <select
                                            className='form-control'
                                            id='postsTimeFrame'
                                            value={this.state.filterPostsTime}
                                            onChange={(e) =>
                                                this.setState({
                                                    filterPostsTime:
                                                        e.target.value,
                                                })
                                            }
                                        >
                                            <option value='allTime'>
                                                All Time
                                            </option>
                                            <option value='lastWeek'>
                                                Last Week
                                            </option>
                                            <option value='lastMonth'>
                                                Last Month
                                            </option>
                                        </select>
                                    </div>

                                    <div className='col-2'>
                                        <a
                                            className='btn grnbtn'
                                            href='#'
                                            onClick={(e) =>
                                                this.handleApplyPostsDateType(e)
                                            }
                                        >
                                            Apply
                                        </a>
                                    </div>
                                    <div className='col-1 text-center'>
                                        <a
                                            className='mt-2'
                                            href='#'
                                            onClick={(e) =>
                                                this.handleClearPostsDateType(e)
                                            }
                                        >
                                            {' '}
                                            Clear
                                        </a>
                                    </div>
                                </div>
                            </form>

                            <hr />
                            <form>
                                <div className='row flrts'>
                                    <div className='col-md-3'>
                                        <select
                                            className='form-control'
                                            id='selectpostsForAdminAction'
                                            value={
                                                this.state.postsForAdminAction
                                            }
                                            onChange={(e) =>
                                                this.setState({
                                                    postsForAdminAction:
                                                        e.target.value,
                                                })
                                            }
                                        >
                                            <option value=''>Actions</option>
                                            <option value='suspend'>
                                                Suspend Post
                                            </option>
                                            <option value='delete'>
                                                Delete Post
                                            </option>
                                        </select>
                                    </div>
                                    <div className='col-md-2'>
                                        {' '}
                                        <a
                                            className={`btn grnbtn ${
                                                !this.state.postsForAdminAction
                                                    ? 'dislinks blur'
                                                    : ''
                                            }`}
                                            onClick={(e) =>
                                                this.updatePostsStatus(e)
                                            }
                                        >
                                            Apply
                                        </a>
                                    </div>
                                    <div className='col-md-5'>
                                        <div className='form-group searchinpt'>
                                            <input
                                                placeholder='Search'
                                                type='text'
                                                className='form-control'
                                                value={
                                                    this.state
                                                        .searchTeamPostsQuery
                                                }
                                                onChange={(e) =>
                                                    this.setState({
                                                        searchTeamPostsQuery:
                                                            e.target.value,
                                                    })
                                                }
                                            />
                                            <button
                                                onClick={(e) =>
                                                    this.handleTeamPostsSearchClick(
                                                        e
                                                    )
                                                }
                                            >
                                                <img src='/uploads/images/search.png' />
                                            </button>
                                        </div>
                                    </div>
                                    <div className='col-md-2'>
                                        <a
                                            className='mt-2'
                                            href='#'
                                            onClick={(e) =>
                                                this.handlePostsByAdminClearSearch(
                                                    e
                                                )
                                            }
                                        >
                                            Clear Search
                                        </a>
                                    </div>
                                </div>
                            </form>

                            <hr />

                            <Table striped bordered hover size='sm'>
                                <thead>
                                    <tr>
                                        <th className='text-center'>
                                            <input
                                                type='checkbox'
                                                onClick={this.checkAllPosts}
                                                id='checkallbox'
                                            />
                                        </th>
                                        <th>Posts</th>
                                        <th className='text-center'>
                                            Posted By
                                        </th>
                                        <th className='text-center'>
                                            Posted On
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.posts.map((post, index) => (
                                        <tr key={`postsForAdmin-${post._id}`}>
                                            <td className='text-center'>
                                                <input
                                                    type='checkbox'
                                                    value={index}
                                                    id={`checkbox-${index}`}
                                                    onClick={
                                                        this.handleCheckboxClick
                                                    }
                                                />
                                            </td>
                                            <td>
                                                {post.imgFileName.length > 0 &&
                                                    post.imgFileName.map(
                                                        (img) => (
                                                            <span
                                                                key={`postForAdmin-${img}`}
                                                            >
                                                                <img
                                                                    className='mr-2'
                                                                    width='50'
                                                                    src={
                                                                        getServerUrl()
                                                                            .apiURL +
                                                                        '/uploads/posts/' +
                                                                        img
                                                                    }
                                                                />
                                                            </span>
                                                        )
                                                    )}
                                                <a href='#'>
                                                    {post.description}
                                                </a>
                                            </td>
                                            <td className='text-center'>
                                                {`${this.state.postsOwner[index].firstName} ${this.state.postsOwner[index].lastName}`}
                                            </td>
                                            <td className='text-center'>
                                                {formatDate(post.time)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>{' '}
                    </div>
                </div>
            );
        } else if (this.state.screenType === 'postManagement') {
            return (
                <div className='outbx'>
                    {loadingHtml}
                    <div className='teams-container'>
                        <a
                            href=''
                            className='backbtn'
                            onClick={(e) => {
                                // revert back the post restriction and publish post approval state (map to DB)
                                this.setState({
                                    selectedRestriction:
                                        this.state.team.postRestriction,
                                    publishApproval:
                                        this.state.team.postReqApproval,
                                });
                                this.changeScreen(e, 'menu');
                            }}
                        >
                            {' '}
                        </a>
                        <h6>Post Management</h6>
                    </div>
                    <div className='boxmenu'>
                        <div className='admincntnt bxshadow'>
                            <h4>Post Management</h4>
                            <form>
                                <div className='pl-4'>
                                    <div>
                                        <input
                                            name='formHorizontalRadios'
                                            type='radio'
                                            id='formHorizontalRadios1'
                                            className='form-check-input'
                                            value='allowMembers'
                                            checked={
                                                this.state
                                                    .selectedRestriction ===
                                                'allowMembers'
                                            }
                                            onChange={
                                                this.handlePostRestriction
                                            }
                                        />
                                        <label
                                            htmlFor='formHorizontalRadios1'
                                            className='form-check-label'
                                        >
                                            Allow members to post
                                        </label>
                                    </div>

                                    <div>
                                        <input
                                            name='formHorizontalRadios'
                                            type='radio'
                                            id='formHorizontalRadios2'
                                            className='form-check-input'
                                            value='allowAll'
                                            checked={
                                                this.state
                                                    .selectedRestriction ===
                                                'allowAll'
                                            }
                                            onChange={
                                                this.handlePostRestriction
                                            }
                                        />
                                        <label
                                            htmlFor='formHorizontalRadios2'
                                            className='form-check-label'
                                        >
                                            Allow all to post
                                        </label>
                                    </div>

                                    <div>
                                        <input
                                            name='formHorizontalRadios'
                                            type='radio'
                                            id='formHorizontalRadios3'
                                            className='form-check-input'
                                            value='onlyAdmin'
                                            checked={
                                                this.state
                                                    .selectedRestriction ===
                                                'onlyAdmin'
                                            }
                                            onChange={
                                                this.handlePostRestriction
                                            }
                                        />
                                        <label
                                            htmlFor='formHorizontalRadios3'
                                            className='form-check-label'
                                        >
                                            Post only by admin
                                        </label>
                                    </div>
                                </div>
                                <hr />
                                <div className='form-check'>
                                    <input
                                        type='checkbox'
                                        id='formHorizontalCheck'
                                        className='form-check-input'
                                        checked={this.state.publishApproval}
                                        onChange={() =>
                                            this.setState({
                                                publishApproval:
                                                    !this.state.publishApproval,
                                            })
                                        }
                                    />
                                    <label
                                        htmlFor='formHorizontalCheck'
                                        className='form-check-label'
                                    >
                                        Publish post after approval
                                    </label>
                                </div>
                            </form>

                            <p className='mt-4'>
                                <hr />
                            </p>
                            <div className='col-6 nopad mt-2'>
                                <button
                                    type='button'
                                    className='btn btn-primary button subbtn f16'
                                    onClick={this.savePostManagement}
                                >
                                    Save
                                </button>{' '}
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else if (this.state.screenType === 'members') {
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
                            key={'team-member-' + member._id}
                            className='boxmenu mmbr'
                        >
                            <div className='userthumb'>
                                <div className='userbx'>
                                    <img src={member.profilePicture} />
                                </div>
                                <div>
                                    {member.firstName + '' + member.lastName}
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
                            key={'team-member-' + member._id}
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
        } else if (this.state.screenType == 'coaches') {
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
                        <h6>Coaches</h6>
                    </div>

                    <Tabs
                        fill
                        defaultActiveKey='Coaches'
                        id='uncontrolled-tab-example'
                    >
                        <Tab eventKey='Coaches' title='Coaches'>
                            {this.state.coaches.map((member) => (
                                <div
                                    key={'team-member-' + member._id}
                                    className='boxmenu mmbr'
                                >
                                    <div className='userthumb'>
                                        <div className='userbx'>
                                            <img src={member.profilePicture} />
                                        </div>
                                        <div>
                                            {member.firstName +
                                                ' ' +
                                                member.lastName}
                                        </div>
                                        <div className='col'>
                                            <a
                                                className='pushright'
                                                href=''
                                                onClick={(e) =>
                                                    this.removeMember(
                                                        e,
                                                        member._id
                                                    )
                                                }
                                            >
                                                Remove
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {this.state.coaches.length === 0 && (
                                <div className='boxmenu mmbr'>
                                    No coaches found
                                </div>
                            )}
                        </Tab>
                        <Tab eventKey='Add New' title='Add New'>
                            <div className='main-container createnew'>
                                <h3>Add Coach</h3>
                                <AsyncSelect
                                    placeholder={'Enter keyword to search'}
                                    loadOptions={loadOptions}
                                    onChange={this.handleCoachChange}
                                    onInputChange={this.handleCoachInputChange}
                                />

                                <div className='form-group'>
                                    <a
                                        className='button subbtn'
                                        onClick={(e) => this.addCoach(e)}
                                    >
                                        Add Coach
                                    </a>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            );
        } else if (this.state.screenType === 'events') {
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
                                    key={'team-event-' + event._id}
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
        } else if (this.state.screenType === 'create-event') {
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
                                <label
                                    className='form-label'
                                    htmlFor='formTeamAddress'
                                >
                                    Location
                                </label>
                                <div className='search-location-input'>
                                    <input
                                        placeholder='Type Address'
                                        type='text'
                                        id='formTeamAddress'
                                        className='form-control pac-target-input'
                                        value={this.state.event.location}
                                        onChange={this.handleEventLocation}
                                        autoComplete='off'
                                        required
                                    />
                                </div>
                            </div>

                            <div className='form-group'>
                                <label
                                    className='form-label'
                                    htmlFor='formTeamActivityType'
                                >
                                    Activity Type
                                </label>

                                <select
                                    className='form-control'
                                    id='formTeamActivityType'
                                    onChange={this.handleChange(
                                        'interestValue'
                                    )}
                                    value={this.state.interestValue}
                                    required
                                >
                                    <option value='' disabled>
                                        Choose one...
                                    </option>
                                    <option value='Swim'>Swimming</option>
                                    <option value='Run'>Running</option>
                                    <option value='Strength'>
                                        Weight Lifting
                                    </option>
                                    <option value='Bike'>Bike</option>
                                    <option value='Flexibility'>
                                        Flexibility
                                    </option>
                                    <option value='Note'>Note</option>
                                    <option value='Walk'>Walking</option>
                                    <option value='Recovery'>Recovery</option>
                                </select>
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
        } else if (this.state.screenType === 'memberships') {
            return (
                <TeamMembershipsAdmin
                    changeScreen={this.changeScreen}
                    team={this.state.team}
                />
            );
        } else {
            return null;
        }
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    };
};

export default connect(mapStateToProps, {})(AdminTeam);
