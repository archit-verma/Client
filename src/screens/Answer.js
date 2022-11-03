import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import AnswerDetail from '../components/AnswerDetail';
import { getPost, getUser, getServerUrl } from '../utils/api';
import { assignTimeAgo } from '../utils/helper';
import loading from '../assets/loading.svg';
import profileBlank from '../assets/profile_blank.png';

class Answer extends Component {
    state = {
        post: {},
        postOwner: {},
        profilePicture: '',
        answer: {
            commentId: '',
            userId: this.props.user.userId,
            description: '',
            time: new Date().toISOString(),
            likes: [],
            dislikes: [],
        },
        loading: true,
        hasAnswerPermission: true,
        filteredAnswersList: [],
        acceptedAnswer: {},
        timeAgo: null,
    };

    componentDidMount() {
        if (this.props.match.params.questionId) {
            getPost(this.props.match.params.questionId)
                .then((post) => {
                    this.setState({ post, timeAgo: assignTimeAgo(post.time) });

                    if (post.comments.length > 0) {
                        this.assignAnswerPermission(post.comments, post.userId);
                        this.assignFilterTopAnswer(post.comments);
                    }
                })
                .then(() => {
                    if (this.props.user.userId !== this.state.post.userId) {
                        getUser(this.state.post.userId, this.props.token).then(
                            (user) => {
                                this.setState({
                                    postOwner: user,
                                    profilePicture: user.profilePicture,
                                    loading: false,
                                });
                            }
                        );
                    } else {
                        this.setState({
                            postOwner: this.props.user,
                            profilePicture: this.props.user.profilePicture,
                            loading: false,
                        });
                    }
                });
        }
    }

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

    handleAnswer = (e) => {
        const answer = { ...this.state.answer };
        answer.description = e.target.value;
        answer.time = new Date().toISOString();
        this.setState({ answer });
    };

    createAnswer = () => {
        let newAnswer = { ...this.state.answer };
        let post = this.state.post;
        newAnswer.commentId =
            post.postId + Math.floor(Math.random() * 1000).toString();

        post.comments.push(newAnswer);

        this.props
            .createAnswer(post.postId, post.comments, this.props.user._id)
            .then(() => {
                this.assignFilterTopAnswer(post.comments);

                this.setState({
                    answer: {
                        commentId: '',
                        description: '',
                        likes: [],
                        dislikes: [],
                    },
                    hasAnswerPermission: false,
                });
            });
    };

    assignFilterTopAnswer = (answers) => {
        let newAnswersList = [...answers];

        // get accepted answer
        let acceptedAnswer = newAnswersList.find((answer) => answer.accepted);
        if (acceptedAnswer !== undefined) {
            this.setState({ acceptedAnswer });
        }

        // filter accepted answer
        newAnswersList = newAnswersList.filter(
            (answer) => answer !== acceptedAnswer
        );
        this.setState({ filteredAnswersList: newAnswersList });
    };

    updateAcceptedAnswer = (answer) => {
        this.setState({ acceptedAnswer: answer });
    };

    updateFilteredAnswers = (answers) => {
        this.setState({ filteredAnswersList: answers });
    };

    render() {
        if (this.state.loading) {
            return (
                <div className='profile-container-loading'>
                    <img src={loading} alt='' />
                </div>
            );
        }
        return (
            <>
                <div className='teams-container'>
                    <a
                        onClick={() => window.history.back()}
                        className='backbtn'
                    >
                        {' '}
                    </a>
                    <h6>Question View</h6>
                </div>
                <div className='qstnbx'>
                    <h6>Question</h6>
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
                                                        this.state.post.userId
                                                )
                                            }
                                        />
                                    </a>
                                </div>
                            </div>
                            <div className='col-8 nopad pt-1'>
                                <Link
                                    to={'/profile/' + this.state.post.userId}
                                    className={'post-userId'}
                                >
                                    {this.state.postOwner.firstName}{' '}
                                    {this.state.postOwner.lastName}
                                </Link>

                                <div className='small ptism'>
                                    {this.state.timeAgo}
                                </div>
                            </div>
                        </div>
                    </div>
                    <p>{this.state.post.description}</p>
                </div>
                {Object.keys(this.state.acceptedAnswer).length !== 0 && (
                    <AnswerDetail
                        key={this.state.acceptedAnswer.commentId}
                        post={this.state.post}
                        answers={this.state.post.comments}
                        answer={this.state.acceptedAnswer}
                        createAnswer={this.props.createAnswer}
                        acceptedAnswer={this.state.acceptedAnswer}
                        onUpdateAcceptedAnswer={this.updateAcceptedAnswer}
                        onUpdateFilteredAnswers={this.updateFilteredAnswers}
                    />
                )}
                {this.state.filteredAnswersList.map((answer) => (
                    <AnswerDetail
                        key={answer.commentId}
                        post={this.state.post}
                        answers={this.state.post.comments}
                        answer={answer}
                        createAnswer={this.props.createAnswer}
                        acceptedAnswer={this.state.acceptedAnswer}
                        onUpdateAcceptedAnswer={this.updateAcceptedAnswer}
                        onUpdateFilteredAnswers={this.updateFilteredAnswers}
                    />
                ))}

                {this.props.user.userId !== this.state.post.userId &&
                this.state.hasAnswerPermission ? (
                    <div className='wrtcmnt btmfld mt-2'>
                        <input
                            placeholder='Answer The Question'
                            type='text'
                            id='answerQuestionField'
                            className='form-control'
                            onChange={this.handleAnswer}
                            value={this.state.answer.description}
                            required
                        />
                        <a
                            onClick={this.createAnswer}
                            className='sndbtn'
                            style={{ border: '1px solid black' }}
                        ></a>
                    </div>
                ) : (
                    ''
                )}
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        token: state.auth.token,
        user: state.auth.user,
    };
};

export default withRouter(connect(mapStateToProps, {})(Answer));
