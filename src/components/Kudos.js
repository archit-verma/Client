/**
 * =====================================
 * REACT COMPONENT CLASS
 * =====================================
 * @date created: 17 September 2019
 * @authors: Hasitha Dias, Waqas Rehmani
 *
 * This file defines the Kudos component. The class Kudos
 * is where the component is defined.
 *
 * This is a component defined for reusability.
 *
 * This component shows a the likes, bumslaps and backslaps made on a post.
 *
 */

// Importing libraries for setup
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { updateKudosScore } from '../utils/api';

class Kudos extends Component {
    // Constructor
    constructor(props) {
        super(props);

        this.state = {
            currentLike: props.post.kudos.likes.find(
                (p) => p === props.user.userId
            ),
            currentBumSlap: props.post.kudos.bumSlaps.find(
                (p) => p === props.user.userId
            ),
            currentBackSlap: props.post.kudos.backSlaps.find(
                (p) => p === props.user.userId
            ),
            likes: props.post.kudos.likes.length,
            bumSlaps: props.post.kudos.bumSlaps.length,
            backSlaps: props.post.kudos.backSlaps.length,
        };
    }

    // Adds or removes like from the current user.
    // Note: Adding like will remove backslap and bumslap of the user
    handleLike = async () => {
        if (this.state.currentLike) {
            let kudos = this.props.post.kudos;
            kudos.likes = kudos.likes.filter(
                (p) => p !== this.props.user.userId
            );

            this.props.changeKudos(this.props.post.postId, kudos);

            this.setState(
                (prevState) => {
                    return {
                        currentLike: false,
                        likes: prevState.likes - 1,
                    };
                },
                () => {
                    this.props.onToggleReactionOpt();
                    this.props.onHandleReactionChange('Thumbs Up');
                }
            );
        } else {
            let kudos = this.props.post.kudos;
            kudos.likes.push(this.props.user.userId);

            // filter out post bumslap of the user
            if (this.state.currentBumSlap) {
                kudos.bumSlaps = kudos.bumSlaps.filter(
                    (p) => p !== this.props.user.userId
                );

                this.setState({
                    currentBumSlap: false,
                    bumSlaps: !this.state.bumSlaps - 1,
                });
            }
            // filter out post backslap of the user
            else if (this.state.currentBackSlap) {
                kudos.backSlaps = kudos.backSlaps.filter(
                    (p) => p !== this.props.user.userId
                );

                this.setState({
                    currentBackSlap: false,
                    backSlaps: !this.state.backSlaps - 1,
                });
            } else {
                // update trending score with +1 score for post/question and user (like)
                if (this.props.post.section.type === 'users') {
                    await updateKudosScore(
                        this.props.user._id,
                        this.props.post.section.type,
                        this.props.post._id
                    );
                }

                // update trending score with +1 score for groups / teams
                if (
                    this.props.post.section.type === 'groups' ||
                    this.props.post.section.type === 'teams'
                ) {
                    await updateKudosScore(
                        this.props.user._id,
                        this.props.post.section.type,
                        this.props.post.section.id
                    );
                }
            }

            this.setState(
                (prevState) => {
                    return {
                        currentLike: true,
                        likes: prevState.likes + 1,
                    };
                },
                () => {
                    this.props.changeKudos(this.props.post.postId, kudos);
                    this.props.onToggleReactionOpt();
                    this.props.onHandleReactionChange('Thumbs Up');
                }
            );
        }
    };

    // Adds or removes bumslap from the current user.
    // Note: Adding bumslap will remove like and backslap of the user
    handleBumSlap = async () => {
        if (this.state.currentBumSlap) {
            let kudos = this.props.post.kudos;
            kudos.bumSlaps = kudos.bumSlaps.filter(
                (p) => p !== this.props.user.userId
            );

            this.props.changeKudos(this.props.post.postId, kudos);
            this.setState(
                (prevState) => {
                    return {
                        currentBumSlap: false,
                        bumSlaps: prevState.bumSlaps - 1,
                    };
                },
                () => {
                    this.props.onToggleReactionOpt();
                    this.props.onHandleReactionChange('Thumbs Up');
                }
            );
        } else {
            let kudos = this.props.post.kudos;
            kudos.bumSlaps.push(this.props.user.userId);

            // filter out post like of the user
            if (this.state.currentLike) {
                kudos.likes = kudos.likes.filter(
                    (p) => p !== this.props.user.userId
                );

                this.setState({
                    currentLike: false,
                    likes: !this.state.likes - 1,
                });
            }
            // filter out post backslap of the user
            else if (this.state.currentBackSlap) {
                kudos.backSlaps = kudos.backSlaps.filter(
                    (p) => p !== this.props.user.userId
                );

                this.setState({
                    currentBackSlap: false,
                    backSlaps: !this.state.backSlaps - 1,
                });
            } else {
                // update trending score with +1 score for post/question and user (like)
                if (this.props.post.section.type === 'users') {
                    await updateKudosScore(
                        this.props.user._id,
                        this.props.post.section.type,
                        this.props.post._id
                    );
                }

                // update trending score with +1 score for groups / teams
                if (
                    this.props.post.section.type === 'groups' ||
                    this.props.post.section.type === 'teams'
                ) {
                    await updateKudosScore(
                        this.props.user._id,
                        this.props.post.section.type,
                        this.props.post.section.id
                    );
                }
            }

            this.setState(
                (prevState) => {
                    return {
                        currentBumSlap: true,
                        bumSlaps: prevState.bumSlaps + 1,
                    };
                },
                () => {
                    this.props.changeKudos(this.props.post.postId, kudos);
                    this.props.onToggleReactionOpt();
                    this.props.onHandleReactionChange('Bum Slap');
                }
            );
        }
    };

    // Adds or removes backslap from the current user.
    // Note: Adding backslap will remove like and bumslap of the user
    handleBackSlap = async () => {
        if (this.state.currentBackSlap) {
            let kudos = this.props.post.kudos;
            kudos.backSlaps = kudos.backSlaps.filter(
                (p) => p !== this.props.user.userId
            );

            this.props.changeKudos(this.props.post.postId, kudos);
            this.setState(
                (prevState) => {
                    return {
                        currentBackSlap: false,
                        backSlaps: prevState.backSlaps - 1,
                    };
                },
                () => {
                    this.props.onToggleReactionOpt();
                    this.props.onHandleReactionChange('Thumbs Up');
                }
            );
        } else {
            let kudos = this.props.post.kudos;
            kudos.backSlaps.push(this.props.user.userId);

            // filter out post like of the user
            if (this.state.likes) {
                kudos.likes = kudos.likes.filter(
                    (p) => p !== this.props.user.userId
                );

                this.setState({
                    currentLike: false,
                    likes: !this.state.likes - 1,
                });
            }
            // filter out post bumslap of the user
            else if (this.state.currentBumSlap) {
                kudos.bumSlaps = kudos.bumSlaps.filter(
                    (p) => p !== this.props.user.userId
                );

                this.setState({
                    currentBumSlap: false,
                    bumSlaps: !this.state.bumSlaps - 1,
                });
            } else {
                // update trending score with +1 score for post/question and user (like)
                if (this.props.post.section.type === 'users') {
                    await updateKudosScore(
                        this.props.user._id,
                        this.props.post.section.type,
                        this.props.post._id
                    );
                }

                // update trending score with +1 score for groups / teams
                if (
                    this.props.post.section.type === 'groups' ||
                    this.props.post.section.type === 'teams'
                ) {
                    await updateKudosScore(
                        this.props.user._id,
                        this.props.post.section.type,
                        this.props.post.section.id
                    );
                }
            }

            this.setState(
                (prevState) => {
                    return {
                        currentBackSlap: true,
                        backSlaps: prevState.backSlaps + 1,
                    };
                },
                () => {
                    this.props.changeKudos(this.props.post.postId, kudos);
                    this.props.onToggleReactionOpt();
                    this.props.onHandleReactionChange('Back Slap');
                }
            );
        }
    };

    // Render Method that actually displays the component
    render() {
        return (
            <div className='ovrmnu lkbx'>
                <ul>
                    <li>
                        <a onClick={this.handleLike}>
                            <img
                                src={`/uploads/images/${
                                    this.state.currentLike
                                        ? 'thumbs-c.png'
                                        : 'symbol3.png'
                                }`}
                            />{' '}
                            Thumbs Up
                        </a>
                    </li>
                    <li>
                        <a onClick={this.handleBumSlap}>
                            <img
                                src={`/uploads/images/${
                                    this.state.currentBumSlap
                                        ? 'bum-c.png'
                                        : 'symbol1.png'
                                }`}
                            />{' '}
                            Bum Slap
                        </a>
                    </li>
                    <li>
                        <a onClick={this.handleBackSlap}>
                            <img
                                src={`/uploads/images/${
                                    this.state.currentBackSlap
                                        ? 'back-c.png'
                                        : 'symbol2.png'
                                }`}
                            />{' '}
                            Back Slap
                        </a>
                    </li>
                </ul>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    };
};

export default connect(mapStateToProps, {})(Kudos);
