/**
 * =====================================
 * REACT COMPONENT CLASS
 * =====================================
 * @date created: 2 September 2019
 * @authors: Waqas Rehmani
 *
 * This file defines the Feed component. The class Feed
 * is where the component is defined.
 *
 * This is a component defined for reusability.
 *
 * This component shows a list of posts. Feed can be seen on Home, Profile, Event and Group pages
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Importing other components
import Post from './Post';

class Feed extends Component {
    // Constructor for Feed
    constructor(props) {
        super(props);
        this.state = {
            posts: props.posts.sort(
                (a, b) => Date.parse(b.time) - Date.parse(a.time)
            ),
            newPostCreated: false,
        };
    }
    // This method is called whenever component recieves props
    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.posts === this.props.posts) {
            this.setState({
                posts: nextProps.posts.sort(
                    (a, b) => Date.parse(b.time) - Date.parse(a.time)
                ),
            });
        }
    }

    // Render method for Feed
    render() {
        // Sorting the posts (following users & groups) by date
        let posts = this.props.posts;

        return (
            <div className='feed-container'>
                {posts.length > 0 ? (
                    <div>
                        {posts.map((post, index) => (
                            <Post
                                key={`${post._id}-${post.postId}`}
                                post={post}
                                owner={
                                    this.props.owners !== undefined &&
                                    this.props.owners[index] !== undefined &&
                                    this.props.owners[index].userId ===
                                        post.userId
                                        ? this.props.owners[index]
                                        : 'Unknown'
                                }
                                editPost={this.props.editPost}
                                deletePost={this.props.deletePost}
                                showPopup={this.props.showPopup}
                                notGeneral={this.props.notGeneral}
                                createComment={this.props.createComment}
                                changeKudos={this.props.changeKudos}
                                openPictureViewer={this.props.openPictureViewer}
                                isQuestionPage={this.props.isQuestionPage}
                                hasActionPermission={
                                    this.props.hasActionPermission !== undefined
                                        ? this.props.hasActionPermission
                                        : true
                                }
                            />
                        ))}
                    </div>
                ) : (
                    <div className='feed-container-empty'>
                        There are no posts right now. <br />
                        Add your first post!
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {};
};

export default connect(mapStateToProps, {})(Feed);
