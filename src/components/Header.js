/**
 * =====================================
 * REACT COMPONENT CLASS
 * =====================================
 * @date created: 17 August 2019
 * @authors: Waqas Rehmani
 *
 * This file defines the Header component. The class Header
 * is where the component is defined.
 *
 * This is a component defined for reusability.
 *
 * This component defines the header that is seen throughout the app.
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { logOutUser } from '../actions';

// Importing icons and pictures
import { FaUser } from 'react-icons/fa';
import { IoMdLogOut } from 'react-icons/io';
import { getServerUrl } from '../utils/api';
import logo from '../assets/logo.svg';
import profileBlank from '../assets/profile_blank.png';
import Search from '../screens/Search';

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loginVisible: false,
            dropdownVisible: false,
            burgerMenuVisible: false,
            query: '',
            history: [],
        };
    }

    componentDidMount() {
        this.recoverHistory();

        // restore the query props
        if (this.props.history.location.pathname === '/search/posts') {
            const urlParams = new URLSearchParams(window.location.search);
            const query = urlParams.get('query');
            this.setState({ query });
        }
    }

    // Enables/disables dropdown with options for Login and Signup.
    toggleDropdown = () => {
        this.setState((prevState) => ({
            dropdownVisible: !prevState.dropdownVisible,
        }));
    };

    // toggle burger menu
    toggleBurgerMenu = () => {
        this.setState((prevState) => ({
            burgerMenuVisible: !prevState.burgerMenuVisible,
        }));
        this.props.onToggleBurgerMenu();
    };

    // close burger menu
    closeBurgerMenu = () => {
        this.setState({
            burgerMenuVisible: false,
        });
        this.props.onCloseBurgerMenu();
    };

    // Logs out the user.
    logOutUser = () => {
        if (window.confirm('Are you sure you wish to log out?')) {
            this.props.logOutUser();
            this.props.history.push('/home');
            window.location.reload();
        }
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

    handleSearchPress = (e, query) => {
        e.preventDefault();
        // only enable search other than empty string
        if (query) {
            this.saveToStorage(query);
            this.setState({ query });
            this.props.history.push({
                pathname: '/search/posts',
                search: `?query=${this.state.query}`,
            });
        }
    };

    render() {
        if (!window.matchMedia('(max-width: 500px)').matches) {
            if (this.props.userSignedIn) {
                return (
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
                                            onChange={this.handleSearchChange}
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
                                                src='/uploads/images/search.svg'
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
                );
            } else {
                return (
                    <div className='header-container'>
                        <img
                            src={logo}
                            className='header-logo'
                            onClick={() => this.props.history.push('/home')}
                            alt=''
                        />

                        <div className='header-buttons'>
                            <Link
                                to={'/'}
                                className={
                                    this.props.location.pathname === '/'
                                        ? 'header-button header-selected'
                                        : 'header-button'
                                }
                            >
                                W H A T ' S &nbsp; N E W
                            </Link>

                            <Link
                                to={'/home'}
                                className={
                                    this.props.location.pathname === '/home'
                                        ? 'header-button header-selected'
                                        : 'header-button'
                                }
                                onClick={() => window.scrollTo(0, 0)}
                            >
                                H O M E
                            </Link>

                            <Link
                                to={'/trending'}
                                className={
                                    this.props.location.pathname === '/trending'
                                        ? 'header-selected header-button'
                                        : 'header-button'
                                }
                            >
                                T R E N D I N G
                            </Link>
                        </div>

                        <div className='header-profile'>
                            <div>
                                <FaUser
                                    className={
                                        this.state.dropdownVisible
                                            ? 'header-profile-drowndown-button header-selected'
                                            : 'header-profile-drowndown-button'
                                    }
                                    onClick={this.toggleDropdown}
                                />
                                <div
                                    className={
                                        this.state.dropdownVisible
                                            ? 'dropdown-visible dropdown'
                                            : 'dropdown-invisible dropdown'
                                    }
                                >
                                    <div
                                        className={'dropdown-item'}
                                        onClick={() => {
                                            this.toggleDropdown();
                                        }}
                                    >
                                        <Link to='/signInUser'>L O G I N</Link>
                                    </div>
                                    <div
                                        className={'dropdown-item'}
                                        onClick={() => {
                                            this.props.history.push(
                                                '/signupUser'
                                            );
                                            this.toggleDropdown();
                                        }}
                                    >
                                        S I G N U P
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
        } else {
            if (this.props.userSignedIn) {
                return (
                    <>
                        <div className='hdrsec'>
                            <ul>
                                <li>
                                    <a href='#' onClick={this.toggleBurgerMenu}>
                                        <img src='/uploads/images/menu.svg' />
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className={
                                            this.props.location.pathname ===
                                            '/home'
                                                ? 'selsec'
                                                : ''
                                        }
                                        onClick={() => {
                                            this.props.history.push('/home');
                                            this.closeBurgerMenu();
                                        }}
                                    >
                                        <img src='/uploads/images/home.svg' />
                                        <span>Feed</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className={
                                            this.props.location.pathname ===
                                            '/trending'
                                                ? 'selsec'
                                                : ''
                                        }
                                        onClick={() => {
                                            this.props.history.push(
                                                '/trending'
                                            );
                                            this.closeBurgerMenu();
                                        }}
                                    >
                                        <img src='/uploads/images/trending.svg' />
                                        <span>Trending</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className={
                                            this.props.location.pathname ===
                                            '/questions'
                                                ? 'selsec'
                                                : ''
                                        }
                                        onClick={() => {
                                            this.props.history.push(
                                                '/questions'
                                            );
                                            this.closeBurgerMenu();
                                        }}
                                    >
                                        <img src='/uploads/images/questions.svg' />
                                        <span>Answers</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        onClick={() => {
                                            this.props.history.push('/search');
                                            this.closeBurgerMenu();
                                        }}
                                    >
                                        <img src='/uploads/images/search.svg' />
                                        <span>Search</span>
                                    </a>
                                </li>
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

                        {this.state.burgerMenuVisible ? (
                            <>
                                <div className='mnmenu'>
                                    <div className='tphd'>
                                        <div className='userthumb'>
                                            <div className='userbx'>
                                                <Link
                                                    to={
                                                        '/profile/' +
                                                        this.props.user.userId
                                                    }
                                                    onClick={() => {
                                                        this.closeBurgerMenu();
                                                    }}
                                                >
                                                    <img
                                                        src={
                                                            this.props.user
                                                                .profilePicture
                                                                ? `${
                                                                      getServerUrl()
                                                                          .apiURL
                                                                  }/uploads/user/${
                                                                      this.props
                                                                          .user
                                                                          .profilePicture
                                                                  }`
                                                                : profileBlank
                                                        }
                                                    />
                                                </Link>
                                            </div>
                                            <div>
                                                <Link
                                                    to={
                                                        '/profile/' +
                                                        this.props.user.userId
                                                    }
                                                    onClick={() => {
                                                        this.closeBurgerMenu();
                                                    }}
                                                >{`${this.props.user.firstName} ${this.props.user.lastName}`}</Link>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='mnuen'>
                                        <ul>
                                            <li>
                                                <a href='#'>
                                                    <span>
                                                        <img src='/uploads/images/recent.svg' />
                                                    </span>{' '}
                                                    Most Recent
                                                </a>
                                            </li>
                                            <li>
                                                <Link
                                                    to={'/groups/'}
                                                    onClick={() => {
                                                        this.closeBurgerMenu();
                                                    }}
                                                >
                                                    <span>
                                                        <img src='/uploads/images/group.svg' />
                                                    </span>{' '}
                                                    Groups
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to={'/teams/'}
                                                    onClick={() => {
                                                        this.closeBurgerMenu();
                                                    }}
                                                >
                                                    <span>
                                                        <img src='/uploads/images/team.svg' />
                                                    </span>{' '}
                                                    Teams
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to={'#'}
                                                    onClick={() => {
                                                        this.closeBurgerMenu();
                                                    }}
                                                >
                                                    <span>
                                                        <img src='/uploads/images/follow.svg' />
                                                    </span>{' '}
                                                    Your Followers{' '}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link
                                                    to={'/questions/own/'}
                                                    onClick={() => {
                                                        this.closeBurgerMenu();
                                                    }}
                                                >
                                                    <span>
                                                        <img src='/uploads/images/questions.svg' />
                                                    </span>
                                                    {' Your Questions '}
                                                </Link>
                                            </li>
                                            <li>
                                                <a href='#'>
                                                    <span>
                                                        <img src='/uploads/images/flag.svg' />
                                                    </span>{' '}
                                                    Events
                                                </a>
                                            </li>
                                            <li>
                                                <Link
                                                    to={'/saved/'}
                                                    onClick={() => {
                                                        this.closeBurgerMenu();
                                                    }}
                                                >
                                                    <span>
                                                        <img src='/uploads/images/bookmark.svg' />
                                                    </span>{' '}
                                                    Saved
                                                </Link>
                                            </li>
                                            <li>
                                                <a href='#'>
                                                    <span>
                                                        <img src='/uploads/images/setting.svg' />
                                                    </span>{' '}
                                                    Settings
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    href='#'
                                                    onClick={this.logOutUser}
                                                >
                                                    <span>
                                                        <img src='/uploads/images/logout.svg' />
                                                    </span>
                                                    {' Logout '}
                                                </a>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className='mnmnu'>
                                        <p>
                                            <a className='btnspl' href='#'>
                                                Go To My Planner
                                            </a>
                                        </p>
                                        <span className='small text-center'>
                                            Powered by: Coaching Mate
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className='blurField'
                                    onClick={this.closeBurgerMenu}
                                ></div>
                            </>
                        ) : (
                            <></>
                        )}
                    </>
                );
            } else {
                return (
                    <div className='hdrsec'>
                        <ul>
                            <li>
                                <Link
                                    to={'/home'}
                                    className={
                                        this.props.location.pathname === '/home'
                                            ? 'selsec'
                                            : ''
                                    }
                                >
                                    <img src='/uploads/images/home.svg' />
                                    <span>Home</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={'/'}
                                    className={
                                        this.props.location.pathname === '/'
                                            ? 'header-button header-selected'
                                            : 'header-button'
                                    }
                                >
                                    W H A T ' S &nbsp; N E W
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to={'/trending'}
                                    className={
                                        this.props.location.pathname ===
                                        '/trending'
                                            ? 'selsec'
                                            : ''
                                    }
                                >
                                    <img src='/uploads/images/trending.svg' />
                                    <span>Trending</span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                );
            }
        }
    }
}

const mapStateToProps = (state) => {
    return {
        userSignedIn: state.auth.userSignedIn,
        user: state.auth.user,
    };
};

export default withRouter(
    connect(mapStateToProps, { logOutUser })(Header)
);
