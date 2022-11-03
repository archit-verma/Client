import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';

import LeftSideBar from '../components/LeftSideBar';
import Post from '../components/Post';

import {
    getInitialSavedPosts,
    deleteTracker,
    getPostListByObjId,
    getServerUrl,
} from '../utils/api';

class SavedContent extends Component {
    state = {
        savedPosts: [],
        totalSavedPostsCount: 0,
        postsOwner: [],
        currTrackerId: '',
        hasMore: true,
    };

    componentDidMount() {
        if (this.props.userSignedIn) {
            getInitialSavedPosts(this.props.user.userId).then((res) => {
                this.setState({
                    savedPosts: res.savedPosts,
                    totalSavedPostsCount: res.totalSavedPostsLength,
                    currTrackerId: res.currTrackerId,
                    postsOwner: res.owners,
                    hasMore: res.hasMore,
                });
            });
        }
    }

    componentWillUnmount() {
        // remove tracker before navigate to other page
        if (this.props.userSignedIn) {
            deleteTracker(this.state.currTrackerId);
        }
    }

    getMorePosts = async () => {
        // scroll down => add 5 more posts
        const STEP_LENGTH = 5;

        // get current num of display posts and total posts number
        let currPostsLen = this.state.savedPosts.length;
        let totalPostsLen = this.state.totalSavedPostsCount;

        // make sure have posts to add for display
        if (currPostsLen < totalPostsLen) {
            if (currPostsLen + STEP_LENGTH < totalPostsLen) {
                await getPostListByObjId(
                    this.state.currTrackerId,
                    currPostsLen,
                    currPostsLen + STEP_LENGTH
                ).then((res) => {
                    this.setState({
                        savedPosts: [...this.state.savedPosts, ...res.posts],
                        postsOwner: [...this.state.postsOwner, ...res.owners],
                    });
                });
            } else {
                // display all of the posts as it reached to the end of the num of posts
                await getPostListByObjId(
                    this.state.currTrackerId,
                    currPostsLen,
                    totalPostsLen
                ).then((res) => {
                    this.setState({
                        savedPosts: [...this.state.savedPosts, ...res.posts],
                        postsOwner: [...this.state.postsOwner, ...res.owners],
                    });
                });

                this.setState({ hasMore: false });
            }
        } else {
            this.setState({ hasMore: false });
        }
    };

    refresh = async () => {
        // delete tracker before refreshing the page
        await deleteTracker(this.state.currTrackerId);

        window.location.reload();
    };

    render() {
        return (
            <>
                {!window.matchMedia('(max-width: 500px)').matches ? (
                    <div className='container cntntbx'>
                        <div className='row'>
                            <div className='col-3'>
                                <LeftSideBar />
                            </div>

                            <div className='col-9'>
                                <InfiniteScroll
                                    style={{ overflow: 'hidden' }}
                                    dataLength={this.state.savedPosts.length}
                                    next={this.getMorePosts}
                                    hasMore={this.state.hasMore}
                                    loader={
                                        <div className='text-center'>
                                            <div
                                                className='spinner-border'
                                                role='status'
                                            >
                                                <span className='sr-only'>
                                                    Loading...
                                                </span>
                                            </div>
                                        </div>
                                    }
                                    endMessage={
                                        <p className='text-center'>
                                            <b>Yay! You have seen it all</b>
                                        </p>
                                    }
                                >
                                    {this.state.savedPosts.map(
                                        (post, index) => (
                                            <Post
                                                key={`saved-content-${post._id}-${post.postId}`}
                                                post={post}
                                                owner={
                                                    this.props.owners !==
                                                        undefined &&
                                                    this.props.owners[index] !==
                                                        undefined &&
                                                    this.props.owners[index]
                                                        .userId === post.userId
                                                        ? this.props.owners[
                                                              index
                                                          ]
                                                        : 'Unknown'
                                                }
                                                editPost={this.props.editPost}
                                                deletePost={
                                                    this.props.deletePost
                                                }
                                                showPopup={this.props.showPopup}
                                                createComment={
                                                    this.props.createComment
                                                }
                                                changeKudos={
                                                    this.props.changeKudos
                                                }
                                                openPictureViewer={
                                                    this.props.openPictureViewer
                                                }
                                                hasActionPermission={true}
                                            />
                                        )
                                    )}
                                </InfiniteScroll>
                            </div>
                        </div>
                    </div>
                ) : (
                    <InfiniteScroll
                        style={{ overflow: 'hidden' }}
                        dataLength={this.state.savedPosts.length}
                        next={this.getMorePosts}
                        hasMore={this.state.hasMore}
                        loader={
                            <div className='text-center'>
                                <div className='spinner-border' role='status'>
                                    <span className='sr-only'>Loading...</span>
                                </div>
                            </div>
                        }
                        endMessage={
                            <p className='text-center'>
                                <b>Yay! You have seen it all</b>
                            </p>
                        }
                        refreshFunction={this.refresh}
                        pullDownToRefresh
                        pullDownToRefreshThreshold={50}
                        pullDownToRefreshContent={
                            <h3 style={{ textAlign: 'center' }}>
                                &#8595; Pull down to refresh
                            </h3>
                        }
                        releaseToRefreshContent={
                            <h3 style={{ textAlign: 'center' }}>
                                &#8593; Release to refresh
                            </h3>
                        }
                    >
                        {this.state.savedPosts.map((post, index) => (
                            <Post
                                key={`saved-content-${post._id}-${post.postId}`}
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
                                createComment={this.props.createComment}
                                changeKudos={this.props.changeKudos}
                                openPictureViewer={this.props.openPictureViewer}
                                hasActionPermission={true}
                            />
                        ))}
                    </InfiniteScroll>
                )}
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userSignedIn: state.auth.userSignedIn,
        user: state.auth.user,
    };
};

export default withRouter(connect(mapStateToProps, {})(SavedContent));
