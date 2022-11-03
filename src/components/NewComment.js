/**
 * =====================================
 * REACT COMPONENT CLASS
 * =====================================
 * @date created: 12 September 2019
 * @authors: Jay Parikh, Waqas Rehmani
 *
 * This file defines the NewComment component. The class NewComment
 * is where the component is defined.
 *
 * This is a component defined for reusability.
 *
 * This component shows a new comment that can made on a post.
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';
import autosize from 'autosize';
import { connect } from 'react-redux';

class NewComment extends Component {
    // Constructor for NewComment
    constructor(props) {
        super(props);

        this.state = {
            commentId: '',
            userId: props.userId,
            description: '',
            time: new Date().toISOString(),
            replies: [],
            likes: [],
            dislikes: [],
        };
    }

    // This method is called when the component first mounts after the constructor is called
    componentDidMount() {
        this.descriptionInput.focus();
        autosize(this.descriptionInput);
    }

    // Does API call to add comment to post.
    createComment = () => {
        let newComment = this.state;
        newComment.commentId =
            this.props.post.postId +
            Math.floor(Math.random() * 1000).toString();

        let post = this.props.post;
        post.comments.push(newComment);

        this.props
            .createComment(post.postId, post.comments, this.props.user._id)
            .then(() => {
                this.setState({
                    commentId: '',
                    description: '',
                    replies: [],
                    likes: [],
                    dislikes: [],
                });

                this.props.onUpdateComments(post);
            });
    };

    // Allows the user to create a comment by pressing the enter key.
    onEnterPress = (e) => {
        if (e.keyCode === 13 && e.shiftKey === false) {
            e.preventDefault();
            this.createComment();
        }
    };

    // Handles change in comment and displays the updated comment on the text field.
    handleChange = (e) => {
        e.preventDefault();

        this.setState({
            description: this.descriptionInput.value,
            time: new Date().toISOString(),
        });
    };

    // Render method for NewComment
    render() {
        const isMobile = window.matchMedia('(max-width: 500px)').matches;
        return (
            <div
                className={`${
                    isMobile
                        ? 'wrtcmnt btmfld'
                        : 'col-12 nopad new-comment-container'
                }`}
            >
                <input
                    placeholder='Write a comment....'
                    type='text'
                    id='writeCommentField'
                    className='form-control'
                    onChange={this.handleChange}
                    value={this.state.description}
                    ref={(val) => (this.descriptionInput = val)}
                />
                <a onClick={this.createComment} className='sndbtn'></a>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
        userId: state.auth.user.userId,
    };
};

export default connect(mapStateToProps, {})(NewComment);
