/**
 * =====================================
 * REACT SCREEN COMPONENT CLASS
 * =====================================
 * @date created: 13 October 2019
 * @authors: Waqas Rehmani
 *
 * This file defines the Post screen. The class PostDetail
 * is where the component is defined. This is a screen component.
 *
 * This screen shows the Post Details.
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

// Importing other components
import Post from '../components/Post';
import Comment from '../components/Comment';
import NewComment from '../components/NewComment';

// Importing icons and pictures
import loading from '../assets/loading.svg';

// Importing helper functions
import * as API from '../utils/api';

class PostDetail extends Component {
    // Constructor for PostDetail
    constructor(props) {
        super(props);

        this.state = {
            post: {},
            loading: true,
            trackShowField: [],
        };
    }

    // This method is called when the component first mounts after the constructor is called
    componentDidMount() {
        API.getPost(this.props.match.params.postId).then((post) => {
            if (post.postId) {
                const trackShowField = new Array(post.comments.length).fill(
                    false
                );

                this.setState({
                    post,
                    loading: false,
                    trackShowField,
                });
            }
        });
    }

    updateComments = (post) => {
        this.setState({ post });
    };

    updateShowField = (pos) => {
        const trackShowField = new Array(this.state.post.comments.length).fill(
            false
        );

        trackShowField[pos] = true;

        this.setState({ trackShowField });
    };

    resetShowField = () => {
        const trackShowField = new Array(this.state.post.comments.length).fill(
            false
        );

        this.setState({ trackShowField });
    };

    // Render method for Post Detail
    render() {
        const isMobile = window.matchMedia('(max-width: 500px)').matches;

        return (
            <div
                className={`${
                    isMobile
                        ? 'feed-container'
                        : 'post-details-container cntntbx'
                }`}
            >
                {this.state.loading ? (
                    <div className='profile-container-loading'>
                        <img src={loading} alt='' />
                    </div>
                ) : (
                    <>
                        {isMobile && (
                            <div className='teams-container'>
                                <a
                                    onClick={() => window.history.back()}
                                    className='backbtn'
                                >
                                    {' '}
                                </a>
                                <h6>Full Post View</h6>
                            </div>
                        )}

                        <Post
                            post={this.state.post}
                            editPost={this.props.editPost}
                            deletePost={this.props.deletePost}
                            showPopup={this.props.showPopup}
                            showPopupTwoButton={this.props.showPopupTwoButton}
                            createComment={this.props.createComment}
                            changeKudos={this.props.changeKudos}
                            openPictureViewer={this.props.openPictureViewer}
                            hasActionPermission={
                                this.props.hasReplyCommentPermission
                            }
                        />
                        <div className='comntsec mb-4 mt-0'>
                            <h6>Comments</h6>
                            {this.state.post.comments.map((comment, index) => (
                                <Comment
                                    key={comment.commentId}
                                    post={this.state.post}
                                    createComment={this.props.createComment}
                                    comment={comment}
                                    onUpdateComments={this.updateComments}
                                    onUpdateTrackShowField={() =>
                                        this.updateShowField(index)
                                    }
                                    onResetTrackShowField={this.resetShowField}
                                    showField={this.state.trackShowField[index]}
                                    hasReplyCommentPermission={
                                        this.props.hasReplyCommentPermission
                                    }
                                />
                            ))}

                            {this.props.hasReplyCommentPermission && (
                                <NewComment
                                    post={this.state.post}
                                    createComment={this.props.createComment}
                                    onUpdateComments={this.updateComments}
                                />
                            )}
                        </div>
                    </>
                )}
            </div>
        );
    }
}

export default withRouter(PostDetail);
