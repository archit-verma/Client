/**
 * =====================================
 * REACT COMPONENT CLASS
 * =====================================
 * @date created: 24 August 2019
 * @authors: Waqas Rehmani, Hasitha Dias
 *
 * This file defines the Post component. The class Post
 * is where the component is defined.
 *
 * This is a component defined for reusability.
 *
 * This component shows a post that is seen throughout the app.
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { DateTime } from 'luxon';

// Importing icons and pictures
import profileBlank from '../assets/profile_blank.png';

// Importing helper functions
import {
    getUser,
    getServerUrl,
    savePostToSavedList,
    unsavePostSavedList,
} from '../utils/api.js';

// Importing other components
import Kudos from './Kudos';
import AnswerDetail from '../components/AnswerDetail';

// Importing icons and pictures
import Badminton from '../assets/Badminton.svg';
import Cycling from '../assets/Cycling.svg';
import Football from '../assets/Football.svg';
import Gym from '../assets/Gym.svg';
import Running from '../assets/Running.svg';
import Swimming from '../assets/Swimming.svg';
import Tennis from '../assets/Tennis.svg';
import Walking from '../assets/Walking.svg';
import Yoga from '../assets/Yoga.svg';

class Post extends Component {
    // Constructor for Post
    constructor(props) {
        super(props);

        this.state = {
            postDetails: {
                id: props.post._id,
                postId: props.post.postId,
                userId: props.post.userId,
                kudos: props.post.kudos,
                type: props.post.type,
                description: props.post.description,
                interest: props.post.interest,
                images: props.post.imgFileName,
                videos: props.post.videoFileName,
                comments: props.post.comments,
            },
            image: '',
            postOwner: {},
            profilePicture: '',
            timeAgo: null,
            editPost: false,
            dropdownVisible: false,
            hasAnswerPermission: true,
            acceptedAnswer: {},
            reaction: 'Thumbs Up',
            hasLiked: false,
            hasBumSlapped: false,
            hasBackSlapped: false,
            showReactionOpt: false,
            showEllipsisOpt: false,
            saved: this.props.user.saved,
        };
    }

    // This method is called when the component first mounts after the constructor is called
    componentDidMount() {
        // owner data is not passed or owner is not found
        if (this.props.owner !== undefined && this.props.owner !== 'Unknown') {
            this.setState({
                postOwner: this.props.owner,
                profilePicture: this.props.owner.profilePicture,
            });
        } else {
            if (this.props.user.userId !== this.props.post.userId) {
                getUser(this.props.post.userId, this.props.token).then(
                    (user) => {
                        this.setState({
                            postOwner: user,
                            profilePicture: user.profilePicture,
                        });
                    }
                );
            } else {
                this.setState({
                    postOwner: this.props.user,
                    profilePicture: this.props.user.profilePicture,
                });
            }
        }

        this.assignAnswerPermission(
            this.props.post.comments,
            this.props.post.userId
        );

        this.getAcceptedAnswer(this.props.post.comments);

        this.assignReaction(this.props.post.kudos);

        this.assignTimeAgo(this.props.post.time);
    }

    toggleReactionOpt = () => {
        this.setState({ showReactionOpt: !this.state.showReactionOpt });
    };

    toggleEllipsisOpt = () => {
        this.setState({ showEllipsisOpt: !this.state.showEllipsisOpt });
    };

    handleReactionChange = (reaction) => {
        if (reaction === 'Thumbs Up') {
            if (
                this.props.post.kudos.likes.find(
                    (p) => p === this.props.user.userId
                )
            ) {
                this.setState({ hasLiked: true });
            } else {
                this.setState({ hasLiked: false });
            }
        } else if (reaction === 'Bum Slap') {
            if (
                this.props.post.kudos.bumSlaps.find(
                    (p) => p === this.props.user.userId
                )
            ) {
                this.setState({ hasBumSlapped: true });
            } else {
                this.setState({ hasBumSlapped: false });
            }
        } else if (reaction === 'Back Slap') {
            if (
                this.props.post.kudos.backSlaps.find(
                    (p) => p === this.props.user.userId
                )
            ) {
                this.setState({ hasBackSlapped: true });
            } else {
                this.setState({ hasBackSlapped: false });
            }
        }

        this.setState({ reaction });
    };

    assignAnswerPermission = (answers, postUserId) => {
        answers.forEach((answer) => {
            // user already answered the question
            if (answer.userId === this.props.user.userId) {
                this.setState({ hasAnswerPermission: false });
            }
        });

        if (this.props.user.userId === postUserId) {
            this.setState({ hasAnswerPermission: false });
        }
    };

    getAcceptedAnswer = (answers) => {
        let acceptedAnswer = answers.find((answer) => answer.accepted);
        if (acceptedAnswer !== undefined) {
            this.setState({ acceptedAnswer });
        }
    };

    updateAcceptedAnswer = (answer) => {
        this.setState({ acceptedAnswer: answer });
    };

    assignReaction = (kudos) => {
        if (kudos.likes.find((p) => p === this.props.user.userId)) {
            this.setState({ reaction: 'Thumbs Up', hasLiked: true });
        } else if (kudos.bumSlaps.find((p) => p === this.props.user.userId)) {
            this.setState({ reaction: 'Bum Slap', hasBumSlapped: true });
        } else if (kudos.backSlaps.find((p) => p === this.props.user.userId)) {
            this.setState({ reaction: 'Back Slap', hasBackSlapped: true });
        }
    };

    assignTimeAgo = (date) => {
        const units = [
            'year',
            'month',
            'week',
            'day',
            'hour',
            'minute',
            'second',
        ];

        // convert date to Duration type
        let dateTime = DateTime.fromISO(date);

        // get time difference compared to the item datetime
        // shift to units for displaying
        const diffTime = dateTime.diffNow().shiftTo(...units);

        // get the first dominant time unit to display
        const unit = units.find((unit) => diffTime.get(unit) !== 0) || 'second';

        // create relative time formatter in your locale
        const relativeFormatter = new Intl.RelativeTimeFormat('en', {
            numeric: 'auto',
        });

        // math.trunc converts the diff time to whole number
        let timeAgo = relativeFormatter.format(
            Math.trunc(diffTime.as(unit)),
            unit
        );

        this.setState({ timeAgo });
    };

    savePost = (postId) => {
        savePostToSavedList(this.props.user.userId, postId).then((res) => {
            if (res.success === true) {
                this.setState({ showEllipsisOpt: false, saved: res.saved });
            }
        });
    };

    unsavePost = (postId) => {
        unsavePostSavedList(this.props.user.userId, postId).then((res) => {
            if (res.success === true) {
                this.setState({ showEllipsisOpt: false, saved: res.saved });
            }
        });
    };

    // Render method for for Post
    render() {
        return !window.matchMedia('(max-width: 500px)').matches ? (
            <div
                className={`postbx bxshadow ${
                    this.props.isQuestionPage ? 'psttxt' : ''
                }`}
                style={{ overflow: 'hidden' }}
            >
                <div className='usrtop'>
                    <div className='row'>
                        <div className='col-6'>
                            <div className='userthumb'>
                                <Link
                                    className='userbx'
                                    to={`/profile/${this.props.post.userId}`}
                                >
                                    <img
                                        src={
                                            this.state.profilePicture
                                                ? `${
                                                      getServerUrl().apiURL
                                                  }/uploads/user/${
                                                      this.state.profilePicture
                                                  }`
                                                : profileBlank
                                        }
                                    />
                                </Link>{' '}
                                <div>
                                    <Link
                                        to={`/profile/${this.props.post.userId}`}
                                    >{`${this.state.postOwner.firstName} ${this.state.postOwner.lastName}`}</Link>
                                    <span className='small pstim'>
                                        {this.state.timeAgo}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className='col-6'>
                            {this.state.postDetails.interest.icon && (
                                <span className='acttyp pushright'>
                                    <img
                                        src={`/uploads/images/${this.state.postDetails.interest.icon}`}
                                    />
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                {this.props.isQuestionPage ? (
                    <>
                        <p className='f14'>
                            {this.state.postDetails.description}
                        </p>

                        <p className='col-md-12 nopad pt-0'>
                            <a
                                className='btn btngrn col-md-6'
                                onClick={() =>
                                    this.props.history.push(
                                        `/answers/${this.state.postDetails.postId}`
                                    )
                                }
                            >
                                {this.state.hasAnswerPermission
                                    ? 'Answer This Question'
                                    : 'View All'}
                            </a>
                        </p>

                        {Object.keys(this.state.acceptedAnswer).length > 0 && (
                            <AnswerDetail
                                key={this.state.acceptedAnswer.commentId}
                                post={this.props.post}
                                answers={this.state.postDetails.comments}
                                answer={this.state.acceptedAnswer}
                                acceptedAnswer={this.state.acceptedAnswer}
                                createAnswer={this.props.createComment}
                                onUpdateAcceptedAnswer={
                                    this.updateAcceptedAnswer
                                }
                            />
                        )}
                    </>
                ) : (
                    <>
                        <p className='f14'>
                            {this.state.postDetails.description}
                        </p>

                        {this.state.postDetails.images.map((img) => (
                            <div className='pstmd' key={img}>
                                <img
                                    src={`${
                                        getServerUrl().apiURL
                                    }/uploads/posts/${img}`}
                                    onClick={() =>
                                        this.props.openPictureViewer(
                                            `${
                                                getServerUrl().apiURL
                                            }/uploads/posts/${img}`
                                        )
                                    }
                                    style={{ cursor: 'pointer' }}
                                    alt=''
                                />
                            </div>
                        ))}
                        {this.state.postDetails.videos.map((video) => (
                            <div className='pstmd' key={video}>
                                <video width='100%' height='240' controls>
                                    <source
                                        src={`${
                                            getServerUrl().apiURL
                                        }/uploads/posts/${video}`}
                                        type='video/mp4'
                                    ></source>
                                </video>
                            </div>
                        ))}
                    </>
                )}

                {!this.props.isQuestionPage && (
                    <div className='row'>
                        <div className='rctbx col-9'>
                            <span>
                                <img src='/uploads/images/symbol1.png' />
                                {this.state.postDetails.kudos.bumSlaps.length}
                            </span>
                            <span>
                                <img src='/uploads/images/symbol2.png' />
                                {this.state.postDetails.kudos.backSlaps.length}
                            </span>
                            <span>
                                <img src='/uploads/images/symbol3.png' />
                                {this.state.postDetails.kudos.likes.length}
                            </span>
                            <span>
                                <img src='/uploads/images/symbol4.png' />
                                23
                            </span>
                            <span>
                                <img src='/uploads/images/symbol5.png' />
                                {this.state.postDetails.comments.length}
                            </span>
                        </div>
                        <div className='optbx col-3 text-right'>
                            <a
                                style={{ cursor: 'pointer' }}
                                onClick={this.toggleEllipsisOpt}
                                className={
                                    !this.props.hasActionPermission
                                        ? 'dislinks blur'
                                        : ''
                                }
                            >
                                <img src='/uploads/images/ver-opt.png' />
                            </a>

                            {this.state.showEllipsisOpt && (
                                <div className='ovrmnu'>
                                    <ul>
                                        <li>
                                            {!this.state.saved.includes(
                                                this.state.postDetails.id
                                            ) ? (
                                                <a
                                                    onClick={() =>
                                                        this.savePost(
                                                            this.state
                                                                .postDetails.id
                                                        )
                                                    }
                                                >
                                                    Save Post
                                                </a>
                                            ) : (
                                                <a
                                                    onClick={() =>
                                                        this.unsavePost(
                                                            this.state
                                                                .postDetails.id
                                                        )
                                                    }
                                                >
                                                    Unsave Post
                                                </a>
                                            )}
                                        </li>
                                        <li>
                                            <a href='#'>Report Post</a>
                                        </li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <div className='lkbxbtm f12'>
                    <div className='row'>
                        {!this.props.isQuestionPage ? (
                            <>
                                <div className='col'>
                                    <a
                                        onClick={this.toggleReactionOpt}
                                        className={
                                            !this.props.hasActionPermission
                                                ? 'dislinks blur'
                                                : ''
                                        }
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img
                                            src={`/uploads/images/${
                                                this.state.reaction ===
                                                'Bum Slap'
                                                    ? this.state.hasBumSlapped
                                                        ? 'bum-c.png'
                                                        : 'symbol1.png'
                                                    : this.state.reaction ===
                                                      'Back Slap'
                                                    ? this.state.hasBackSlapped
                                                        ? 'back-c.png'
                                                        : 'symbol2.png'
                                                    : this.state.reaction ===
                                                          'Thumbs Up' &&
                                                      this.state.hasLiked
                                                    ? 'thumbs-c.png'
                                                    : 'symbol3.png'
                                            }`}
                                        />
                                        {this.state.reaction}
                                    </a>
                                    {this.state.showReactionOpt && (
                                        <Kudos
                                            post={this.props.post}
                                            changeKudos={this.props.changeKudos}
                                            onToggleReactionOpt={
                                                this.toggleReactionOpt
                                            }
                                            onHandleReactionChange={
                                                this.handleReactionChange
                                            }
                                            isQuestionPage={
                                                this.props.isQuestionPage
                                            }
                                        />
                                    )}
                                </div>

                                <div className='col'>
                                    <a
                                        onClick={() => {
                                            this.props.history.push(
                                                `/post/${
                                                    this.state.postDetails
                                                        .postId
                                                }${
                                                    !this.props
                                                        .hasActionPermission
                                                        ? '/view'
                                                        : ''
                                                }`
                                            );
                                        }}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img src='/uploads/images/comment.png' />
                                        Comment
                                    </a>
                                </div>

                                <div className='col'>
                                    <a
                                        className={
                                            !this.props.hasActionPermission
                                                ? 'dislinks blur'
                                                : ''
                                        }
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img src='/uploads/images/share.png' />
                                        Share
                                    </a>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className='col'>
                                    <a
                                        className={
                                            !this.props.hasActionPermission
                                                ? 'dislinks blur'
                                                : ''
                                        }
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img src='/uploads/images/share.png' />
                                        Share (23)
                                    </a>
                                </div>
                                <div className='col'>
                                    {!this.state.saved.includes(
                                        this.state.postDetails.id
                                    ) ? (
                                        <a
                                            onClick={() =>
                                                this.savePost(
                                                    this.state.postDetails.id
                                                )
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img src='/uploads/images/comment.png' />
                                            Save
                                        </a>
                                    ) : (
                                        <a
                                            onClick={() =>
                                                this.unsavePost(
                                                    this.state.postDetails.id
                                                )
                                            }
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <img src='/uploads/images/comment.png' />
                                            Unsave
                                        </a>
                                    )}
                                </div>
                                <div className='col'>
                                    <a href='#'>
                                        <img src='/uploads/images/hand.png' />
                                        Report
                                    </a>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        ) : this.props.isQuestionPage ? (
            <>
                <div className='postbx psttxt bxshadow'>
                    <div className='usrtop'>
                        <div className='row'>
                            <div className='col-2'>
                                <div className='userthumb'>
                                    <a className='userbx'>
                                        <img
                                            src={
                                                this.state.profilePicture
                                                    ? `${
                                                          getServerUrl().apiURL
                                                      }/uploads/user/${
                                                          this.state
                                                              .profilePicture
                                                      }`
                                                    : profileBlank
                                            }
                                            onClick={() =>
                                                this.props.history.push(
                                                    '/profile/' +
                                                        this.props.post.userId
                                                )
                                            }
                                        />
                                    </a>
                                </div>
                            </div>
                            <div className='col-8 nopad pt-1'>
                                <Link
                                    to={'/profile/' + this.props.post.userId}
                                    className={'post-userId'}
                                >
                                    {this.state.postOwner.firstName}{' '}
                                    {this.state.postOwner.lastName}
                                </Link>

                                <span className='small pstim'>
                                    {this.state.timeAgo}
                                </span>
                            </div>
                            {this.state.postDetails.interest.icon && (
                                <div className='col-2'>
                                    <span className='acttyp'>
                                        <img
                                            src={`/uploads/images/${this.state.postDetails.interest.icon}`}
                                        />
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className='qstnbx'>
                        <p>{this.state.postDetails.description}</p>

                        <a
                            className='btn btngrn'
                            onClick={() =>
                                this.props.history.push(
                                    `/answers/${this.state.postDetails.postId}`
                                )
                            }
                        >
                            {this.state.hasAnswerPermission
                                ? 'Answer This Question'
                                : 'View All'}
                        </a>
                    </div>

                    {Object.keys(this.state.acceptedAnswer).length > 0 && (
                        <AnswerDetail
                            key={this.state.acceptedAnswer.commentId}
                            post={this.props.post}
                            answers={this.state.postDetails.comments}
                            answer={this.state.acceptedAnswer}
                            acceptedAnswer={this.state.acceptedAnswer}
                            createAnswer={this.props.createComment}
                            onUpdateAcceptedAnswer={this.updateAcceptedAnswer}
                        />
                    )}
                    <div className='lkbxbtm f12'>
                        <div className='row'>
                            <div className='col'>
                                <a
                                    className={
                                        !this.props.hasActionPermission
                                            ? 'dislinks blur'
                                            : ''
                                    }
                                >
                                    <img src='/uploads/images/share.png' />
                                    {'Share (23)'}
                                </a>
                            </div>
                            <div className='col'>
                                {!this.state.saved.includes(
                                    this.state.postDetails.id
                                ) ? (
                                    <a
                                        onClick={() =>
                                            this.savePost(
                                                this.state.postDetails.id
                                            )
                                        }
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img src='/uploads/images/comment.png' />
                                        Save
                                    </a>
                                ) : (
                                    <a
                                        onClick={() =>
                                            this.unsavePost(
                                                this.state.postDetails.id
                                            )
                                        }
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <img src='/uploads/images/comment.png' />
                                        Unsave
                                    </a>
                                )}
                            </div>

                            <div className='col'>
                                <a href='#'>
                                    <img src='/uploads/images/hand.png' />
                                    Report
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        ) : (
            <div className='postbx'>
                <div className='usrtop'>
                    <div className='row'>
                        <div className='col-2'>
                            <div className='userthumb'>
                                <a className='userbx'>
                                    <img
                                        src={
                                            this.state.profilePicture
                                                ? `${
                                                      getServerUrl().apiURL
                                                  }/uploads/user/${
                                                      this.state.profilePicture
                                                  }`
                                                : profileBlank
                                        }
                                        onClick={() =>
                                            this.props.history.push(
                                                '/profile/' +
                                                    this.props.post.userId
                                            )
                                        }
                                    />
                                </a>
                            </div>
                        </div>
                        <div className='col-8 nopad pt-1'>
                            <Link
                                to={'/profile/' + this.props.post.userId}
                                className={'post-userId'}
                            >
                                {this.state.postOwner.firstName}{' '}
                                {this.state.postOwner.lastName}
                            </Link>
                            <span className='small pstim'>
                                {this.state.timeAgo}
                            </span>
                        </div>
                        {this.state.postDetails.interest.icon && (
                            <div className='col-2'>
                                <span className='acttyp'>
                                    <img
                                        src={`/uploads/images/${this.state.postDetails.interest.icon}`}
                                    />
                                </span>
                            </div>
                        )}
                    </div>
                </div>
                <p className='f12'>{this.state.postDetails.description}</p>
                {this.state.postDetails.images.map((img) => (
                    <div className='pstmd' key={img}>
                        <img
                            src={`${
                                getServerUrl().apiURL
                            }/uploads/posts/${img}`}
                            onClick={() =>
                                this.props.openPictureViewer(
                                    `${
                                        getServerUrl().apiURL
                                    }/uploads/posts/${img}`
                                )
                            }
                            style={{ cursor: 'pointer' }}
                            alt=''
                        />
                    </div>
                ))}
                {this.state.postDetails.videos.map((video) => (
                    <div className='pstmd' key={video}>
                        <video width='100%' height='240' controls>
                            <source
                                src={`${
                                    getServerUrl().apiURL
                                }/uploads/posts/${video}`}
                                type='video/mp4'
                            ></source>
                        </video>
                    </div>
                ))}
                <div className='row'>
                    <div className='rctbx col-9'>
                        <span>
                            <img src='/uploads/images/symbol1.png' />
                            {this.state.postDetails.kudos.bumSlaps.length}
                        </span>
                        <span>
                            <img src='/uploads/images/symbol2.png' />
                            {this.state.postDetails.kudos.backSlaps.length}
                        </span>
                        <span>
                            <img src='/uploads/images/symbol3.png' />
                            {this.state.postDetails.kudos.likes.length}
                        </span>
                        <span>
                            <img src='/uploads/images/symbol4.png' />
                            23
                        </span>
                        <span>
                            <img src='/uploads/images/symbol5.png' />
                            {this.state.postDetails.comments.length}
                        </span>
                    </div>
                    <div className='optbx col-3 text-right'>
                        <a
                            onClick={this.toggleEllipsisOpt}
                            className={
                                !this.props.hasActionPermission
                                    ? 'dislinks blur'
                                    : ''
                            }
                        >
                            <img src='/uploads/images/ver-opt.png' />
                        </a>
                        {this.state.showEllipsisOpt && (
                            <div className='ovrmnu'>
                                <ul>
                                    <li>
                                        {!this.state.saved.includes(
                                            this.state.postDetails.id
                                        ) ? (
                                            <a
                                                onClick={() =>
                                                    this.savePost(
                                                        this.state.postDetails
                                                            .id
                                                    )
                                                }
                                            >
                                                Save Post
                                            </a>
                                        ) : (
                                            <a
                                                onClick={() =>
                                                    this.unsavePost(
                                                        this.state.postDetails
                                                            .id
                                                    )
                                                }
                                            >
                                                Unsave Post
                                            </a>
                                        )}
                                    </li>
                                    <li>
                                        <a href='#'>Report Post</a>
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
                <div className='lkbxbtm f12'>
                    <div className='row'>
                        <div className='col'>
                            <a
                                onClick={this.toggleReactionOpt}
                                className={
                                    !this.props.hasActionPermission
                                        ? 'dislinks blur'
                                        : ''
                                }
                            >
                                <img
                                    src={`/uploads/images/${
                                        this.state.reaction === 'Bum Slap'
                                            ? this.state.hasBumSlapped
                                                ? 'bum-c.png'
                                                : 'symbol1.png'
                                            : this.state.reaction ===
                                              'Back Slap'
                                            ? this.state.hasBackSlapped
                                                ? 'back-c.png'
                                                : 'symbol2.png'
                                            : this.state.reaction ===
                                                  'Thumbs Up' &&
                                              this.state.hasLiked
                                            ? 'thumbs-c.png'
                                            : 'symbol3.png'
                                    }`}
                                />
                                {this.state.reaction}
                            </a>
                            {this.state.showReactionOpt && (
                                <Kudos
                                    post={this.props.post}
                                    changeKudos={this.props.changeKudos}
                                    onToggleReactionOpt={this.toggleReactionOpt}
                                    onHandleReactionChange={
                                        this.handleReactionChange
                                    }
                                    isQuestionPage={this.props.isQuestionPage}
                                />
                            )}
                        </div>
                        <div className='col'>
                            <a
                                onClick={() => {
                                    this.props.history.push(
                                        `/post/${
                                            this.state.postDetails.postId
                                        }${
                                            !this.props.hasActionPermission
                                                ? '/view'
                                                : ''
                                        }`
                                    );
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <img src='/uploads/images/comment.png' />
                                Comment
                            </a>
                        </div>
                        <div className='col'>
                            <a
                                className={
                                    !this.props.hasActionPermission
                                        ? 'dislinks blur'
                                        : ''
                                }
                            >
                                <img src='/uploads/images/share.png' />
                                Share
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user: state.auth.user,
    };
};

export default withRouter(connect(mapStateToProps, {})(Post));
