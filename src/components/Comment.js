/**
 * =====================================
 * REACT COMPONENT CLASS
 * =====================================
 * @date created: 14 September 2019
 * @authors: Jay Parikh, Waqas Rehmani
 *
 * This file defines the Comment component. The class Comment
 * is where the component is defined.
 *
 * This is a component defined for reusability.
 *
 * This component shows a comment made on a post.
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { getUser, getServerUrl } from '../utils/api';
import { assignTimeAgo } from '../utils/helper';

// Importing icons and pictures
import profileBlank from '../assets/profile_blank.png';
import loading from '../assets/loading2.svg';

class Comment extends Component {
    state = {
        commentUser: {},
        showReplies: false,
        reply: {
            replyId: '',
            userId: this.props.currentUserId,
            description: '',
            time: new Date().toISOString(),
            likes: [],
            dislikes: [],
        },
        replyUsers: [],
        showRepliesLoading: true,
    };

    componentDidMount() {
        getUser(this.props.comment.userId, this.props.token).then((user) => {
            this.setState({
                commentUser: user,
            });
        });

        if (this.props.comment.replies) {
            this.props.comment.replies.forEach((reply) => {
                getUser(reply.userId, this.props.token).then((user) => {
                    this.setState({
                        replyUsers: [...this.state.replyUsers, user],
                    });
                });
            });
            this.setState({ showRepliesLoading: false });
        }
    }

    // Adds/removes kudos for the comment and makes API call via App.js to edit comment.
    editComment = (e) => {
        e.preventDefault();
        let allComments = this.props.post.comments.filter(
            (c) => c.commentId !== this.props.comment.commentId
        );
        let currentComment = {
            commentId: this.props.comment.commentId,
            description: this.props.comment.description,
            userId: this.props.comment.userId,
            time: this.props.comment.time,
            replies: this.props.comment.replies,
            likes: this.props.comment.likes,
            dislikes: this.props.comment.dislikes,
        };
        if (currentComment.likes.includes(this.props.currentUserId)) {
            currentComment.likes = currentComment.likes.filter(
                (l) => l !== this.props.currentUserId
            );
        } else {
            currentComment.likes = [
                ...currentComment.likes,
                this.props.currentUserId,
            ];
        }
        allComments = [...allComments, currentComment];
        allComments.sort((a, b) => Date.parse(a.time) - Date.parse(b.time));

        let post = this.props.post;
        post.comments = allComments;

        this.props.createComment(
            this.props.post.postId,
            post.comments,
            this.props.user._id
        );
    };

    // Makes API call via App.js to delete comment.
    deleteComment = () => {
        if (window.confirm('Are you sure you wish to delete this comment?')) {
            let comments = this.props.post.comments.filter(
                (c) => c.commentId !== this.props.comment.commentId
            );
            comments.sort((a, b) => Date.parse(a.time) - Date.parse(b.time));
            this.props.post.comments = comments;
            this.props.createComment(
                this.props.post.postId,
                this.props.post.comments,
                this.props.user._id
            );
        }
    };

    // add reply to a comment
    createCommentReply = (e) => {
        e.preventDefault();

        let allComments = this.props.post.comments.filter(
            (c) => c.commentId !== this.props.comment.commentId
        );
        let currentComment = {
            commentId: this.props.comment.commentId,
            description: this.props.comment.description,
            userId: this.props.comment.userId,
            time: this.props.comment.time,
            replies: this.props.comment.replies,
            likes: this.props.comment.likes,
            dislikes: this.props.comment.dislikes,
        };

        let newReply = this.state.reply;
        newReply.replyId =
            this.props.comment.commentId +
            Math.floor(Math.random() * 1000).toString();
        newReply.description = this.state.reply.description;
        newReply.time = this.state.reply.time;

        // add reply to the comment
        currentComment.replies.push(newReply);

        allComments = [...allComments, currentComment];
        allComments.sort((a, b) => Date.parse(a.time) - Date.parse(b.time));

        this.setState({
            replyUsers: [...this.state.replyUsers, this.props.user],
        });
        let post = this.props.post;
        post.comments = allComments;

        this.props
            .createComment(post.postId, post.comments, this.props.user._id)
            .then(() => {
                this.setState({
                    reply: {
                        replyId: '',
                        userId: this.props.currentUserId,
                        description: '',
                        time: new Date().toISOString(),
                        likes: [],
                        dislikes: [],
                    },
                });
            });
    };

    toggleReplies = () => {
        if (!this.props.showField) {
            this.props.onUpdateTrackShowField();
        } else {
            this.props.onResetTrackShowField();
        }
    };

    handleChange = (e) => {
        const reply = this.state.reply;
        reply.description = e.target.value;
        reply.time = new Date().toISOString();

        this.setState({ reply });
    };

    // Render method for Comment
    render() {
        // Formatting time to be viewed in the Comment component
        let unformattedTime = new Date(Date.parse(this.props.comment.time));
        let formattedTime =
            unformattedTime.getHours() +
            ':' +
            unformattedTime.getMinutes() +
            ' ' +
            unformattedTime.getDate() +
            '/' +
            unformattedTime.getMonth() +
            '/' +
            unformattedTime.getFullYear();

        return (
            <div className='comntbx'>
                <div className='usrtop'>
                    <div className='row'>
                        <div className='col-2'>
                            <div className='userthumb'>
                                <a className='userbx'>
                                    <img
                                        src={
                                            this.state.commentUser
                                                .profilePicture
                                                ? `${
                                                      getServerUrl().apiURL
                                                  }/uploads/user/${
                                                      this.state.commentUser
                                                          .profilePicture
                                                  }`
                                                : profileBlank
                                        }
                                    />
                                </a>
                            </div>
                        </div>
                        <div className='col-10 nopad pt-1'>
                            <Link to={'/profile/' + this.props.comment.userId}>
                                {`${this.state.commentUser.firstName} 
                                ${this.state.commentUser.lastName}`}
                            </Link>
                            <span className='small pstim'>
                                {assignTimeAgo(this.props.comment.time)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className='cmntxt'>
                    <p>{this.props.comment.description}</p>
                </div>
                <hr />
                <div className='rplybx row'>
                    <div className='col text-left'>
                        <span>
                            {this.props.comment.replies
                                ? `${this.props.comment.replies.length} Replies`
                                : '0 Reply'}
                        </span>{' '}
                    </div>
                    <div className='col text-right'>
                        <a
                            onClick={this.toggleReplies}
                            style={{ cursor: 'pointer' }}
                        >
                            {!this.props.showField
                                ? 'Show Replies'
                                : 'Close Replies'}
                        </a>
                    </div>

                    {this.props.showField && this.props.comment.replies ? (
                        this.state.showRepliesLoading ? (
                            <div>
                                <img
                                    width={22}
                                    height={22}
                                    src={loading}
                                    alt=''
                                />
                            </div>
                        ) : (
                            this.props.comment.replies.length > 0 &&
                            this.props.comment.replies.map((reply, index) => (
                                <div
                                    className='col-12 replybxin'
                                    key={reply.replyId}
                                >
                                    <div className='usrtop'>
                                        <div className='row'>
                                            <div className='col-2'>
                                                <div className='userthumb'>
                                                    <a className='userbx'>
                                                        <img
                                                            src={
                                                                this.state
                                                                    .replyUsers[
                                                                    index
                                                                ] &&
                                                                this.state
                                                                    .replyUsers[
                                                                    index
                                                                ].profilePicture
                                                                    ? `${
                                                                          getServerUrl()
                                                                              .apiURL
                                                                      }/uploads/user/${
                                                                          this
                                                                              .state
                                                                              .replyUsers[
                                                                              index
                                                                          ]
                                                                              .profilePicture
                                                                      }`
                                                                    : profileBlank
                                                            }
                                                        />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className='col-10 nopad pt-1'>
                                                <a>{`${this.state.replyUsers[index].firstName} ${this.state.replyUsers[index].lastName}`}</a>
                                                <span className='small pstim'>
                                                    {assignTimeAgo(reply.time)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className='cmntxt'>
                                        {reply.description}
                                    </div>
                                </div>
                            ))
                        )
                    ) : (
                        ''
                    )}

                    {this.props.hasReplyCommentPermission &&
                        this.props.showField && (
                            <div
                                className={`${
                                    window.matchMedia('(max-width: 500px)')
                                        .matches
                                        ? 'wrtcmnt btmfld'
                                        : 'col-12 replybxin new-comment-container'
                                }`}
                                style={{ zIndex: '10' }}
                            >
                                <input
                                    placeholder='Write a reply....'
                                    type='text'
                                    id={`writeReplyField${this.props.comment.commentId}`}
                                    className='form-control'
                                    onChange={this.handleChange}
                                    value={this.state.reply.description}
                                    ref={(val) => (this.descriptionInput = val)}
                                />
                                <a
                                    onClick={this.createCommentReply}
                                    className={`${
                                        window.matchMedia('(max-width: 500px)')
                                            ? 'sndreplybtn'
                                            : 'sndbtn'
                                    }`}
                                ></a>
                            </div>
                        )}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        currentUserId: state.auth.user.userId,
        token: state.auth.token,
    };
};

export default connect(mapStateToProps, {})(Comment);
