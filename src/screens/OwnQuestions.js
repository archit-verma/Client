import React, { Component } from 'react';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import LeftSideBar from '../components/LeftSideBar';
import Feed from '../components/Feed';

import {
    getInitialCurrUserQuestions,
    deleteTracker,
    getPostListByObjId,
    getServerUrl,
} from '../utils/api';

class OwnQuestions extends Component {
    state = {
        displayQuestions: [],
        owners: [],
        currTrackerId: '',
        totalQuestionsCount: 0,
        hasMore: true,
    };

    componentDidMount() {
        if (this.props.userSignedIn) {
            getInitialCurrUserQuestions(this.props.user.userId).then((res) => {
                this.setState({
                    displayQuestions: res.questions,
                    owners: res.owners,
                    currTrackerId: res.currTrackerId,
                    totalQuestionsCount: res.totalQuestionsLength,
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

    getMoreQuestions = async () => {
        // scroll down => add 5 more questions
        const STEP_LENGTH = 5;

        // get current num of display posts and total posts number
        let currQuestionsLen = this.state.displayQuestions.length;
        let totalQuestionsLen = this.state.totalQuestionsCount;

        // make sure have posts to add for display
        if (currQuestionsLen < totalQuestionsLen) {
            if (currQuestionsLen + STEP_LENGTH < totalQuestionsLen) {
                getPostListByObjId(
                    this.state.currTrackerId,
                    currQuestionsLen,
                    currQuestionsLen + STEP_LENGTH
                ).then((res) => {
                    this.setState({
                        displayQuestions: [
                            ...this.state.displayQuestions,
                            ...res.posts,
                        ],
                        questionsOwner: [...this.state.owners, ...res.owners],
                    });
                });
            } else {
                // display all of the questions as it reached to the end of the num of questions
                getPostListByObjId(
                    this.state.currTrackerId,
                    currQuestionsLen,
                    totalQuestionsLen
                ).then((res) => {
                    this.setState({
                        displayQuestions: [
                            ...this.state.displayQuestions,
                            ...res.posts,
                        ],
                        questionsOwner: [...this.state.owners, ...res.owners],
                        hasMore: false,
                    });
                });
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
                                    dataLength={
                                        this.state.displayQuestions.length
                                    }
                                    next={this.getMoreQuestions}
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
                                    <Feed
                                        key={`own-questions-${this.props.user.userId}-${this.state.totalQuestionsCount}`}
                                        posts={this.state.displayQuestions}
                                        owners={this.state.owners}
                                        editPost={this.props.editPost}
                                        deletePost={this.props.deletePost}
                                        showPopup={this.props.showPopup}
                                        changeKudos={this.props.changeKudos}
                                        openPictureViewer={
                                            this.props.openPictureViewer
                                        }
                                        createComment={this.props.createComment}
                                        isQuestionPage={true}
                                    />
                                </InfiniteScroll>
                            </div>
                        </div>
                    </div>
                ) : (
                    <InfiniteScroll
                        dataLength={this.state.displayQuestions.length}
                        next={this.getMoreQuestions}
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
                        <Feed
                            key={`own-questions-${this.props.user.userId}-${this.state.totalQuestionsCount}`}
                            posts={this.state.displayQuestions}
                            owners={this.state.owners}
                            editPost={this.props.editPost}
                            deletePost={this.props.deletePost}
                            showPopup={this.props.showPopup}
                            changeKudos={this.props.changeKudos}
                            openPictureViewer={this.props.openPictureViewer}
                            createComment={this.props.createComment}
                            isQuestionPage={true}
                        />
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

export default connect(mapStateToProps, {})(OwnQuestions);
