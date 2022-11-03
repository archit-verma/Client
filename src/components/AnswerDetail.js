import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import {
    getUser,
    getServerUrl,
    acceptTopAnswer,
    updateQuestionExpScore,
    updateComment,
} from '../utils/api';
import { assignTimeAgo } from '../utils/helper';
import profileBlank from '../assets/profile_blank.png';

class AnswerDetail extends Component {
    state = {
        answerOwner: {},
        timeAgo: null,
        accepted: false,
    };

    componentDidMount() {
        getUser(this.props.answer.userId, this.props.token).then((user) => {
            this.setState({
                answerOwner: user,
            });
        });

        // set time ago for answer
        if (this.props.answer.time) {
            this.setState({ timeAgo: assignTimeAgo(this.props.answer.time) });
        }
    }

    toggleExpression = async (e, expression) => {
        e.preventDefault();
        const { post, answer, acceptedAnswer } = this.props;

        let allAnswers = this.props.answers.filter(
            (a) => a.commentId !== answer.commentId
        );

        let currentAnswer = {
            commentId: answer.commentId,
            description: answer.description,
            userId: answer.userId,
            time: answer.time,
            likes: answer.likes ? answer.likes : [],
            dislikes: answer.dislikes ? answer.dislikes : [],
            accepted: answer.accepted,
        };

        switch (expression) {
            case 'agree':
                if (currentAnswer.likes.includes(this.props.currentUserId)) {
                    currentAnswer.likes = currentAnswer.likes.filter(
                        (l) => l !== this.props.currentUserId
                    );
                } else {
                    currentAnswer.likes.push(this.props.currentUserId);

                    currentAnswer.dislikes = currentAnswer.dislikes.filter(
                        (dl) => dl !== this.props.currentUserId
                    );

                    await updateQuestionExpScore(
                        post._id,
                        this.props.user._id,
                        'like'
                    );
                }
                break;
            case 'disagree':
                if (currentAnswer.dislikes.includes(this.props.currentUserId)) {
                    currentAnswer.dislikes = currentAnswer.dislikes.filter(
                        (dl) => dl !== this.props.currentUserId
                    );
                } else {
                    currentAnswer.dislikes.push(this.props.currentUserId);

                    currentAnswer.likes = currentAnswer.likes.filter(
                        (l) => l !== this.props.currentUserId
                    );

                    await updateQuestionExpScore(
                        post._id,
                        this.props.user._id,
                        'dislike'
                    );
                }

                break;
            default:
                break;
        }

        if (!answer.accepted) {
            if (Object.keys(acceptedAnswer).length) {
                // filter accepted answer first
                allAnswers = allAnswers.filter(
                    (answer) => answer !== acceptedAnswer
                );

                // sort answers (without accepted answer in the list)
                allAnswers.push(currentAnswer);
                allAnswers.sort((a, b) => b.likes.length - a.likes.length);
                this.props.onUpdateFilteredAnswers(allAnswers);

                allAnswers = [acceptedAnswer, ...allAnswers];
            } else {
                // sort answers (without accepted answer in the list)
                allAnswers.push(currentAnswer);
                allAnswers.sort((a, b) => b.likes.length - a.likes.length);
                this.props.onUpdateFilteredAnswers(allAnswers);
            }
        } else {
            allAnswers = [currentAnswer, ...allAnswers];
            this.props.onUpdateAcceptedAnswer(currentAnswer);
        }

        post.comments = allAnswers;

        await updateComment(post.postId, post.comments);
    };

    handleAccept = () => {
        acceptTopAnswer(
            this.props.post._id,
            this.props.answer.commentId,
            this.state.answerOwner._id
        ).then((res) => {
            if (res.message === 'success') {
                document.getElementById('acceptBtn').innerHTML = 'Accepted!';
                this.setState({ accepted: true });
            }
        });
    };

    render() {
        const { answerOwner } = this.state;
        const { answer, acceptedAnswer } = this.props;

        return (
            <div className='qstnbx ansrbx'>
                {this.props.answer.accepted ? <h5>Top Answer</h5> : ''}
                <div className='usrtop'>
                    <div className='row'>
                        <div className='col-2'>
                            <div className='userthumb'>
                                <a className='userbx'>
                                    <img
                                        src={
                                            answerOwner.profilePicture
                                                ? `${
                                                      getServerUrl().apiURL
                                                  }/uploads/user/${
                                                      answerOwner.profilePicture
                                                  }`
                                                : profileBlank
                                        }
                                        onClick={() =>
                                            this.props.history.push(
                                                '/profile/' + answer.userId
                                            )
                                        }
                                    />
                                </a>
                            </div>
                        </div>
                        <div className='col-8 nopad pt-1'>
                            <Link to={`/profile/${answerOwner.userId}`}>
                                {answerOwner.firstName +
                                    ' ' +
                                    answerOwner.lastName}
                            </Link>

                            <div className='small pstim'>
                                {this.state.timeAgo}
                            </div>
                        </div>
                    </div>
                </div>
                <p>{answer.description}</p>
                <div className='row mb-3'>
                    <div className='col-6 pr-1 text-center'>
                        <p className='grntxt'>
                            {answer.likes ? answer.likes.length : '0'} found
                            helpful
                        </p>
                        <a
                            onClick={(e) => this.toggleExpression(e, 'agree')}
                            className={
                                answer.likes &&
                                answer.likes.includes(this.props.currentUserId)
                                    ? 'btn btngrn'
                                    : 'btn grnbtn'
                            }
                            style={{ display: 'block' }}
                        >
                            Agree
                        </a>
                    </div>

                    <div className='col-6 pl-1 text-center'>
                        <p>
                            {answer.dislikes ? answer.dislikes.length : '0'} not
                            convinced
                        </p>
                        <a
                            onClick={(e) =>
                                this.toggleExpression(e, 'disagree')
                            }
                            className={
                                answer.dislikes &&
                                answer.dislikes.includes(
                                    this.props.currentUserId
                                )
                                    ? 'btn btngry'
                                    : 'btn grybtn'
                            }
                        >
                            Disagree
                        </a>
                    </div>
                </div>
                {this.props.post.userId === this.props.currentUserId &&
                    Object.keys(acceptedAnswer).length === 0 && (
                        <a
                            onClick={this.handleAccept}
                            className={`${
                                this.state.accepted
                                    ? 'btn btnblue'
                                    : 'btn bluebtn'
                            }`}
                            id='acceptBtn'
                        >
                            Accept this as Answer
                        </a>
                    )}
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

export default withRouter(connect(mapStateToProps, {})(AnswerDetail));
