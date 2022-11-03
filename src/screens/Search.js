/**
 * =====================================
 * REACT COMPONENT CLASS
 * =====================================
 * @date created: 10 October 2019
 * @authors: Fatemeh Fatih, Waqas Rehmani
 *
 * This file defines the Search component. The class Search
 * is where the component is defined.
 *
 * This is a component defined for reusability.
 *
 * This component displays the search functionality.
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';

// Importing helper functions
import { withRouter } from 'react-router-dom';
import {
    searchUsers,
    searchPosts,
    searchEvents,
    searchGroups,
    searchTeams,
    getFollowerData,
} from '../utils/api';

// Importing icons and pictures
import loading from '../assets/loading2.svg';

import SearchResult from './SearchResult';

class Search extends Component {
    // Constructor Search
    constructor(props) {
        super(props);

        this.state = {
            query: '',
            searchTarget: 'posts',
            typing: false,
            typingTimeout: 0,
            visible: false,
            dataSource: [],
            searchLoading: false,
            searchVisible: false,
            usersLoading: true,
            postsLoading: true,
            questionsLoading: true,
            eventsLoading: true,
            groupsLoading: true,
            teamsLoading: true,
            postsProfilePicturesLoading: true,
            questionsProfilePicturesLoading: true,
            isSearchEntered: false,
            users: [],
            posts: [],
            generalPostsUPP: [],
            questions: [],
            questionsUPP: [],
            profilePictureKV: {},
            fullNameKV: {},
            events: [],
            groups: [],
            teams: [],
            history: [],
        };
    }

    componentDidMount() {
        this.recoverHistory();

        if (!window.matchMedia('(max-width: 500px)').matches) {
            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('query');
            this.setState({ query });
            this.handleDesktopSearch(query);
        }
    }

    handleChange = (event) => {
        if (event.target.value === '') {
            this.setState({
                query: event.target.value,
                typing: false,
                searchLoading: false,
                searchVisible: false,
            });
        } else {
            let self = this;
            event.preventDefault();

            this.props.history.push({
                pathname: this.props.pathname,
                search: `?query=${event.target.value}`,
            });

            if (this.state.typingTimeout) {
                clearTimeout(this.state.typingTimeout);
            }

            this.setState({
                query: event.target.value,
                typing: false,
                searchLoading: true,
                searchVisible: true,
                typingTimeout: setTimeout(function () {
                    self.handleSearch();
                }, 1800),
            });
        }
    };

    handleSearchPress = (e, query) => {
        e.preventDefault();
        // only enable search other than empty string
        if (query) {
            console.log('in handle search press');
            this.saveToStorage(query);
            this.setState({ query });
            this.props.history.push({
                pathname: this.props.pathname,
                search: `?query=${this.state.query}`,
            });
        }
    };

    // Invokes search on all types of entities involved in this webapp.
    handleSearch = () => {
        this.setState(
            {
                searchVisible: true,
                searchLoading: true,
            },
            () => {
                searchUsers({ query: this.state.query }).then((res) => {
                    this.setState({
                        users: res,
                        usersLoading: false,
                    });
                });

                searchPosts({ query: this.state.query }).then((posts) => {
                    // get all general posts and sort by date
                    const generalPosts = posts.filter(
                        (p) => p.isQuestion === false
                    );
                    generalPosts.sort(
                        (a, b) => Date.parse(b.time) - Date.parse(a.time)
                    );

                    // to store profile picture value for posts/questions user
                    let profilePictureKV = {};

                    // to store full name for posts/questions user
                    let fullNameKV = {};

                    let generalPostsUPP = [];
                    if (generalPosts.length === 0) {
                        this.setState({ postsProfilePicturesLoading: false });
                    } else {
                        generalPosts.forEach((post) => {
                            getFollowerData(post.userId).then((user) => {
                                // get profile picture as value of post user (key)
                                if (!(user.userId in profilePictureKV)) {
                                    if (user.profilePicture) {
                                        profilePictureKV[user.userId] =
                                            user.profilePicture;
                                    }
                                }
                                generalPostsUPP.push(user.profilePicture);

                                // get full name of users
                                if (!(user.userId in fullNameKV)) {
                                    if (user.firstName && user.lastName) {
                                        const fullName =
                                            user.firstName +
                                            ' ' +
                                            user.lastName;

                                        fullNameKV[user.userId] = fullName;
                                    }
                                }

                                if (
                                    generalPosts.length ===
                                    generalPostsUPP.length
                                ) {
                                    this.setState({
                                        postsProfilePicturesLoading: false,
                                        profilePictureKV,
                                        fullNameKV,
                                    });
                                }
                            });
                        });
                    }

                    // get all questions and sort by date
                    const questions = posts.filter(
                        (p) => p.isQuestion === true
                    );
                    questions.sort(
                        (a, b) => Date.parse(b.time) - Date.parse(a.time)
                    );

                    let questionsUPP = [];
                    if (questions.length === 0) {
                        this.setState({
                            questionsProfilePicturesLoading: false,
                        });
                    } else {
                        questions.forEach((question) => {
                            getFollowerData(question.userId).then((user) => {
                                // get profile picture as value of question user (key)
                                if (!(user.userId in profilePictureKV)) {
                                    if (user.profilePicture) {
                                        profilePictureKV[`${user.userId}`] =
                                            user.profilePicture;
                                    }
                                }
                                questionsUPP.push(user.profilePicture);

                                // get full name of users
                                if (!(user.userId in fullNameKV)) {
                                    if (user.firstName && user.lastName) {
                                        const fullName =
                                            user.firstName +
                                            ' ' +
                                            user.lastName;

                                        fullNameKV[user.userId] = fullName;
                                    }
                                }

                                if (questions.length === questionsUPP.length) {
                                    this.setState({
                                        questionsProfilePicturesLoading: false,
                                        profilePictureKV,
                                        fullNameKV,
                                    });
                                }
                            });
                        });
                    }

                    this.setState({
                        posts: generalPosts,
                        questions,
                        postsLoading: false,
                        questionsLoading: false,
                    });
                });

                searchEvents({ query: this.state.query }).then((res) => {
                    this.setState({
                        events: res,
                        eventsLoading: false,
                    });
                });

                searchGroups({ query: this.state.query }).then((res) => {
                    this.setState({
                        groups: res,
                        groupsLoading: false,
                    });
                });

                searchTeams({ query: this.state.query }).then((res) => {
                    this.setState({
                        teams: res,
                        teamsLoading: false,
                    });
                });

                this.setState({
                    searchLoading: false,
                });
            }
        );
    };

    handleRecentQuerySearch = (query) => {
        this.saveToStorage(query);

        searchUsers({ query }).then((res) => {
            this.setState({
                users: res,
                usersLoading: false,
            });
        });

        searchPosts({ query }).then((posts) => {
            // get all general posts and sort by date
            const generalPosts = posts.filter((p) => p.isQuestion === false);
            generalPosts.sort(
                (a, b) => Date.parse(b.time) - Date.parse(a.time)
            );

            // to store profile picture value for posts/questions user
            let profilePictureKV = {};

            // to store full name for posts/questions user
            let fullNameKV = {};

            let generalPostsUPP = [];
            if (generalPosts.length === 0) {
                this.setState({ postsProfilePicturesLoading: false });
            } else {
                generalPosts.forEach((post) => {
                    getFollowerData(post.userId).then((user) => {
                        // get profile picture as value of general post user (key)
                        if (!(user.userId in profilePictureKV)) {
                            if (user.profilePicture) {
                                profilePictureKV[user.userId] =
                                    user.profilePicture;
                            }
                        }
                        generalPostsUPP.push(user.profilePicture);

                        // get full name of users
                        if (!(user.userId in fullNameKV)) {
                            if (user.firstName && user.lastName) {
                                const fullName =
                                    user.firstName + ' ' + user.lastName;

                                fullNameKV[user.userId] = fullName;
                            }
                        }

                        if (generalPosts.length === generalPostsUPP.length) {
                            this.setState({
                                postsProfilePicturesLoading: false,
                                profilePictureKV,
                                fullNameKV,
                            });
                        }
                    });
                });
            }

            // get all questions and sort by date
            const questions = posts.filter((p) => p.isQuestion === true);
            questions.sort((a, b) => Date.parse(b.time) - Date.parse(a.time));

            let questionsUPP = [];
            if (questions.length === 0) {
                this.setState({
                    questionsProfilePicturesLoading: false,
                });
            } else {
                questions.forEach((question) => {
                    getFollowerData(question.userId).then((user) => {
                        // get profile picture as value of question user (key)
                        if (!(user.userId in profilePictureKV)) {
                            if (user.profilePicture) {
                                profilePictureKV[user.userId] =
                                    user.profilePicture;
                            }
                        }
                        questionsUPP.push(user.profilePicture);

                        // get full name of users
                        if (!(user.userId in fullNameKV)) {
                            if (user.firstName && user.lastName) {
                                const fullName =
                                    user.firstName + ' ' + user.lastName;

                                fullNameKV[user.userId] = fullName;
                            }
                        }

                        if (questions.length === questionsUPP.length) {
                            this.setState({
                                questionsProfilePicturesLoading: false,
                                profilePictureKV,
                                fullNameKV,
                            });
                        }
                    });
                });
            }

            this.setState({
                posts: generalPosts,
                questions,
                postsLoading: false,
                questionsLoading: false,
            });
        });

        searchEvents({ query }).then((res) => {
            this.setState({
                events: res,
                eventsLoading: false,
            });
        });

        searchGroups({ query }).then((res) => {
            this.setState({
                groups: res,
                groupsLoading: false,
            });
        });

        searchTeams({ query }).then((res) => {
            this.setState({
                teams: res,
                teamsLoading: false,
            });
        });
    };

    handleDesktopSearch = (query) => {
        searchUsers({ query }).then((res) => {
            this.setState({
                users: res,
                usersLoading: false,
            });
        });

        searchPosts({ query }).then((posts) => {
            // get all general posts and sort by date
            const generalPosts = posts.filter((p) => p.isQuestion === false);
            generalPosts.sort(
                (a, b) => Date.parse(b.time) - Date.parse(a.time)
            );

            // to store profile picture value for posts/questions user
            let profilePictureKV = {};

            // to store full name for posts/questions user
            let fullNameKV = {};

            let generalPostsUPP = [];
            if (generalPosts.length === 0) {
                this.setState({ postsProfilePicturesLoading: false });
            } else {
                generalPosts.forEach((post) => {
                    getFollowerData(post.userId).then((user) => {
                        // get profile picture as value of general post user (key)
                        if (!(user.userId in profilePictureKV)) {
                            if (user.profilePicture) {
                                profilePictureKV[user.userId] =
                                    user.profilePicture;
                            }
                        }
                        generalPostsUPP.push(user.profilePicture);

                        // get full name of users
                        if (!(user.userId in fullNameKV)) {
                            if (user.firstName && user.lastName) {
                                const fullName =
                                    user.firstName + ' ' + user.lastName;

                                fullNameKV[user.userId] = fullName;
                            }
                        }

                        if (generalPosts.length === generalPostsUPP.length) {
                            this.setState({
                                postsProfilePicturesLoading: false,
                                profilePictureKV,
                                fullNameKV,
                            });
                        }
                    });
                });
            }

            // get all questions and sort by date
            const questions = posts.filter((p) => p.isQuestion === true);
            questions.sort((a, b) => Date.parse(b.time) - Date.parse(a.time));

            let questionsUPP = [];
            if (questions.length === 0) {
                this.setState({
                    questionsProfilePicturesLoading: false,
                });
            } else {
                questions.forEach((question) => {
                    getFollowerData(question.userId).then((user) => {
                        // get profile picture as value of question user (key)
                        if (!(user.userId in profilePictureKV)) {
                            if (user.profilePicture) {
                                profilePictureKV[user.userId] =
                                    user.profilePicture;
                            }
                        }
                        questionsUPP.push(user.profilePicture);

                        // get full name of users
                        if (!(user.userId in fullNameKV)) {
                            if (user.firstName && user.lastName) {
                                const fullName =
                                    user.firstName + ' ' + user.lastName;

                                fullNameKV[user.userId] = fullName;
                            }
                        }

                        if (questions.length === questionsUPP.length) {
                            this.setState({
                                questionsProfilePicturesLoading: false,
                                profilePictureKV,
                                fullNameKV,
                            });
                        }
                    });
                });
            }

            this.setState({
                posts: generalPosts,
                questions,
                postsLoading: false,
                questionsLoading: false,
            });
        });

        searchEvents({ query }).then((res) => {
            this.setState({
                events: res,
                eventsLoading: false,
            });
        });

        searchGroups({ query }).then((res) => {
            this.setState({
                groups: res,
                groupsLoading: false,
            });
        });

        searchTeams({ query }).then((res) => {
            this.setState({
                teams: res,
                teamsLoading: false,
            });
        });
    };

    onBlur = () => {
        if (this.state.query === '') {
            this.setState({
                visible: false,
            });
        }
    };

    hideSearchResults = () => {
        this.setState({
            visible: false,
            searchVisible: false,
        });
    };

    showSearchResults = () => {
        if (this.state.query === '') {
            this.setState({
                visible: true,
            });
        } else {
            this.setState({
                visible: true,
                searchVisible: true,
            });
        }

        this.refs.inputField.focus();
    };

    goToProfile = (userId) => {
        this.setState({
            searchVisible: false,
        });
        this.props.history.push('/profile/' + userId);
    };

    goToPost = (postId) => {
        this.setState({
            searchVisible: false,
        });
        this.props.history.push('/post/' + postId);
    };

    goToEvent = (eventId) => {
        this.setState({
            searchVisible: false,
        });
        this.props.history.push('/events/' + eventId);
    };

    goToGroup = (groupId) => {
        this.setState({
            searchVisible: false,
        });
        this.props.history.push('/group/' + groupId);
    };

    goToTeam = (slug) => {
        this.setState({
            searchVisible: false,
        });
        this.props.history.push('/team/' + slug);
    };

    handleSearchTarget = (searchTarget) => {
        this.setState({ searchTarget });
    };

    recoverHistory = () => {
        let history = JSON.parse(localStorage.getItem('history'));

        this.setState({ history: history ? history : [] });
    };

    saveToStorage = (input) => {
        // remove old search input (same as the current input)
        let filteredInputs = [...this.state.history];
        filteredInputs = filteredInputs.filter(
            (prevInput) => prevInput !== input
        );

        const history = [input, ...filteredInputs];

        this.setState({
            history,
            query: '',
        });

        localStorage.setItem('history', JSON.stringify(history));
    };

    handleSearchChange = (e) => {
        this.setState({ query: e.target.value });
    };

    handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            // only enable search other than empty string
            if (e.target.value) {
                this.saveToStorage(e.target.value);
                this.setState({ isSearchEntered: true, query: e.target.value });
                this.props.history.push({
                    pathname: '/search/posts',
                    search: `?query=${this.state.query}`,
                });
            }
        }
    };

    handleRecentSearchClick = (query) => {
        this.handleRecentQuerySearch(query);
        this.setState({ isSearchEntered: true, query });
        this.props.history.push({
            pathname: '/search/posts',
            search: `?query=${query}`,
        });
    };

    handleDelete = (e) => {
        let history = [...this.state.history];
        let index = e.target.name;

        history.splice(index, 1);

        // update storage after deletion
        localStorage.setItem('history', JSON.stringify(history));
    };

    clearHistory = () => {
        let history = [];

        this.setState({ history });
        localStorage.setItem('history', JSON.stringify(history));
    };

    // Render method for Search
    render() {
        if (!window.matchMedia('(max-width: 500px)').matches) {
            return (
                <>
                    <div className='hdrsec'>
                        <div className='container'>
                            <div className='row'>
                                <div className='col-4 leftprt'>
                                    <div className='row'>
                                        <div className='col-6'>
                                            <div className='logo'>
                                                <img src='/uploads/images/logo.jpg' />
                                            </div>
                                        </div>
                                        <div className='col-6'>
                                            <ul>
                                                <li>
                                                    <a
                                                        className={
                                                            this.props.location
                                                                .pathname ===
                                                            '/home'
                                                                ? 'selsec'
                                                                : ''
                                                        }
                                                        onClick={() =>
                                                            this.props.history.push(
                                                                '/home'
                                                            )
                                                        }
                                                    >
                                                        <img src='/uploads/images/home.svg' />
                                                        <span>Feed</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        className={
                                                            this.props.location
                                                                .pathname ===
                                                            '/trending'
                                                                ? 'selsec'
                                                                : ''
                                                        }
                                                        onClick={() =>
                                                            this.props.history.push(
                                                                '/trending'
                                                            )
                                                        }
                                                    >
                                                        <img src='/uploads/images/trending.svg' />
                                                        <span>Trending</span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a
                                                        className={
                                                            this.props.location
                                                                .pathname ===
                                                            '/questions'
                                                                ? 'selsec'
                                                                : ''
                                                        }
                                                        onClick={() =>
                                                            this.props.history.push(
                                                                '/questions'
                                                            )
                                                        }
                                                    >
                                                        <img src='/uploads/images/questions.svg' />
                                                        <span>Answers</span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                <div className='col-4 centerprt'>
                                    <div className='form-group'>
                                        <input
                                            type='text'
                                            list='searchHistoryList'
                                            className='form-control'
                                            placeholder='Search'
                                            value={this.state.query}
                                            onChange={this.handleChange}
                                            required
                                        />
                                        <datalist id='searchHistoryList'>
                                            {this.state.history.map((query) => (
                                                <option
                                                    value={query}
                                                    key={query}
                                                ></option>
                                            ))}
                                        </datalist>
                                        <button
                                            type='submit'
                                            onClick={(e) =>
                                                this.handleSearchPress(
                                                    e,
                                                    this.state.query
                                                )
                                            }
                                            className={`${
                                                !this.state.query
                                                    ? 'dislinks'
                                                    : ''
                                            }`}
                                        >
                                            <img
                                                src='/uploads/images/search.png'
                                                className={`${
                                                    !this.state.query
                                                        ? 'blur'
                                                        : ''
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>

                                <div className='col-4 leftprt'>
                                    <ul>
                                        <li>
                                            <a href='#'>
                                                <img src='/uploads/images/notification.svg' />
                                                <span>Alerts</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href='#'>
                                                <img src='/uploads/images/messages.svg' />
                                                <span>Messages</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>

                    {!this.state.searchLoading &&
                    !this.state.usersLoading &&
                    !this.state.postsLoading &&
                    !this.state.postsProfilePicturesLoading &&
                    !this.state.questionsLoading &&
                    !this.state.questionsProfilePicturesLoading &&
                    !this.state.eventsLoading &&
                    !this.state.groupsLoading &&
                    !this.state.teamsLoading ? (
                        <SearchResult
                            onHandleSearchTarget={this.handleSearchTarget}
                            onQueryChange={this.handleChange}
                            onQuerySearch={this.handleSearch}
                            onEnterPressed={this.handleKeyDown}
                            query={this.state.query}
                            searchTarget={this.state.searchTarget}
                            filteredUsers={this.state.users}
                            filteredPosts={this.state.posts}
                            filteredQuestions={this.state.questions}
                            filteredEvents={this.state.events}
                            filteredGroups={this.state.groups}
                            filteredTeams={this.state.teams}
                            usersLoading={this.state.usersLoading}
                            postsLoading={this.state.postsLoading}
                            questionsLoading={this.state.questionsLoading}
                            eventsLoading={this.state.eventsLoading}
                            groupsLoading={this.state.groupsLoading}
                            teamsLoading={this.state.teamsLoading}
                            goToProfile={this.goToProfile}
                            goToPost={this.goToPost}
                            goToEvent={this.goToEvent}
                            goToGroup={this.goToGroup}
                            goToTeam={this.goToTeam}
                            profilePictureKV={this.state.profilePictureKV}
                            fullNameKV={this.state.fullNameKV}
                        />
                    ) : (
                        <div>
                            <img
                                width={250}
                                height={250}
                                src={loading}
                                alt=''
                            />
                        </div>
                    )}
                </>
            );
        } else {
            return (
                <>
                    {!this.state.isSearchEntered ? (
                        <>
                            <div className='wrtpost srch'>
                                <div className='userthumb'>
                                    <span>
                                        <img src='/uploads/images/search.png' />
                                    </span>

                                    <form>
                                        <input
                                            type='text'
                                            placeholder='Search something here...'
                                            onChange={this.handleChange}
                                            onKeyDown={this.handleKeyDown}
                                            value={this.state.query}
                                            required
                                        />
                                    </form>
                                </div>
                            </div>
                            <div className='rcntsrch'>
                                <div className='rcntsrch'>
                                    <h6>Recent Searches</h6>
                                    <ul className='rcntbx'>
                                        {this.state.history.map(
                                            (history, index) => (
                                                <li key={index}>
                                                    <a
                                                        href='#'
                                                        onClick={() =>
                                                            this.handleRecentSearchClick(
                                                                history
                                                            )
                                                        }
                                                    >
                                                        {history}
                                                    </a>
                                                    <a
                                                        name={index}
                                                        className='pushright small'
                                                        href=''
                                                        onClick={
                                                            this.handleDelete
                                                        }
                                                    >
                                                        Delete
                                                    </a>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                    <p className='text-center'>
                                        <a
                                            className='grytxt'
                                            href='#'
                                            onClick={this.clearHistory}
                                        >
                                            Clear Search History
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </>
                    ) : !this.state.usersLoading &&
                      !this.state.postsLoading &&
                      !this.state.postsProfilePicturesLoading &&
                      !this.state.questionsLoading &&
                      !this.state.questionsProfilePicturesLoading &&
                      !this.state.eventsLoading &&
                      !this.state.groupsLoading &&
                      !this.state.teamsLoading ? (
                        <SearchResult
                            onHandleSearchTarget={this.handleSearchTarget}
                            onQueryChange={this.handleChange}
                            onQuerySearch={this.handleSearch}
                            onEnterPressed={this.handleKeyDown}
                            query={this.state.query}
                            searchTarget={this.state.searchTarget}
                            filteredUsers={this.state.users}
                            filteredPosts={this.state.posts}
                            filteredQuestions={this.state.questions}
                            filteredEvents={this.state.events}
                            filteredGroups={this.state.groups}
                            filteredTeams={this.state.teams}
                            usersLoading={this.state.usersLoading}
                            postsLoading={this.state.postsLoading}
                            questionsLoading={this.state.questionsLoading}
                            eventsLoading={this.state.eventsLoading}
                            groupsLoading={this.state.groupsLoading}
                            teamsLoading={this.state.teamsLoading}
                            goToProfile={this.goToProfile}
                            goToPost={this.goToPost}
                            goToEvent={this.goToEvent}
                            goToGroup={this.goToGroup}
                            goToTeam={this.goToTeam}
                            profilePictureKV={this.state.profilePictureKV}
                            fullNameKV={this.state.fullNameKV}
                        />
                    ) : (
                        <div>
                            <img
                                width={100}
                                height={100}
                                src={loading}
                                alt=''
                            />
                        </div>
                    )}
                </>
            );
        }
    }
}

export default withRouter(Search);
