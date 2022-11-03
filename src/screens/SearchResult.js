import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import {
    getServerUrl,
    groupAddMember,
    memberRemoveGroup,
    getGroupBySlug,
} from '../utils/api';
import { assignTimeAgo, assignAnswerPermission } from '../utils/helper';

import profileBlank from '../assets/profile_blank.png';
import loading from '../assets/loading2.svg';

class SearchResult extends Component {
    // check if the current user is part of the group
    isGroupMember = (groupId) => {
        return this.props.user.groups.includes(groupId);
    };

    joinGroup = (e, groupId, groupType) => {
        e.preventDefault();
        groupAddMember(groupId, this.props.user._id, groupType).then((resp) => {
            alert(resp.msg);
            if (resp.success == true) {
                let groupAccessBtn = document.getElementById(
                    `group-btn-${groupId}`
                );
                groupAccessBtn.innerHTML = 'Pending';
                groupAccessBtn.className = 'smplbtn m-0 dislinks blur';
            }
        });
    };

    leaveGroup = (e, groupId, groupType) => {
        e.preventDefault();
        memberRemoveGroup(groupId, this.props.user._id, 'group').then((resp) => {
            alert(resp.msg);
            if (resp.success == true) {
                let groupAccessBtn = document.getElementById(
                    `group-btn-${groupId}`
                );
                groupAccessBtn.innerHTML = 'Join Group';
                groupAccessBtn.className = 'smplbtn m-0';

                groupAccessBtn.onclick = (e) => {
                    this.joinGroup(e, groupId, groupType);
                };
            }
        });
    };

    render() {
        const isMobile = window.matchMedia('(max-width: 500px)').matches;

        return (
            <>
                {isMobile && (
                    <div className='wrtpost srch'>
                        <div className='userthumb'>
                            <span>
                                <img src='/uploads/images/search.png' />
                            </span>

                            <input
                                type='text'
                                placeholder='Search something here...'
                                onChange={(e) => this.props.onQueryChange(e)}
                                onKeyDown={(e) => {
                                    this.props.onEnterPressed(e);
                                    this.props.onQuerySearch();
                                }}
                                value={this.props.query}
                            />
                        </div>
                    </div>
                )}

                <div className='typsldr'>
                    <a
                        className={
                            this.props.searchTarget === 'posts' ? 'sel' : ''
                        }
                        href='#'
                        onClick={() => {
                            this.props.onHandleSearchTarget('posts');
                            this.props.history.push({
                                pathname: '/search/posts',
                                search: `${this.props.location.search}`,
                            });
                        }}
                    >
                        Posts
                    </a>
                    <a
                        className={
                            this.props.searchTarget === 'teams' ? 'sel' : ''
                        }
                        href='#'
                        onClick={() => {
                            this.props.onHandleSearchTarget('teams');
                            this.props.history.push({
                                pathname: '/search/teams',
                                search: `${this.props.location.search}`,
                            });
                        }}
                    >
                        Teams
                    </a>
                    <a
                        className={
                            this.props.searchTarget === 'users' ? 'sel' : ''
                        }
                        href='#'
                        onClick={() => {
                            this.props.onHandleSearchTarget('users');
                            this.props.history.push({
                                pathname: '/search/users',
                                search: `${this.props.location.search}`,
                            });
                        }}
                    >
                        People
                    </a>
                    <a
                        className={
                            this.props.searchTarget === 'questions' ? 'sel' : ''
                        }
                        href='#'
                        onClick={() => {
                            this.props.onHandleSearchTarget('questions');
                            this.props.history.push({
                                pathname: '/search/questions',
                                search: `${this.props.location.search}`,
                            });
                        }}
                    >
                        Questions
                    </a>
                    <a
                        className={
                            this.props.searchTarget === 'events' ? 'sel' : ''
                        }
                        href='#'
                        onClick={() => {
                            this.props.onHandleSearchTarget('events');
                            this.props.history.push({
                                pathname: '/search/events',
                                search: `${this.props.location.search}`,
                            });
                        }}
                    >
                        Events
                    </a>
                    <a
                        className={
                            this.props.searchTarget === 'groups' ? 'sel' : ''
                        }
                        href='#'
                        onClick={() => {
                            this.props.onHandleSearchTarget('groups');
                            this.props.history.push({
                                pathname: '/search/groups',
                                search: `${this.props.location.search}`,
                            });
                        }}
                    >
                        Groups
                    </a>
                </div>
                {this.props.searchTarget === 'posts' ? (
                    this.props.filteredPosts.length > 0 ||
                    this.props.postsLoading ? (
                        this.props.postsLoading ? (
                            <div>
                                <img
                                    width={35}
                                    height={35}
                                    src={loading}
                                    alt=''
                                />
                            </div>
                        ) : (
                            this.props.filteredPosts.map((post, index) => (
                                <div
                                    className='srchpstbx'
                                    key={'search-post-' + index}
                                >
                                    <div className='usrtop'>
                                        <div className='row'>
                                            <div className='col-2'>
                                                <div className='userthumb'>
                                                    <a className='userbx'>
                                                        <img
                                                            src={
                                                                post.userId in
                                                                this.props
                                                                    .profilePictureKV
                                                                    ? `${
                                                                          getServerUrl()
                                                                              .apiURL
                                                                      }/uploads/user/${
                                                                          this
                                                                              .props
                                                                              .profilePictureKV[
                                                                              post
                                                                                  .userId
                                                                          ]
                                                                      }`
                                                                    : profileBlank
                                                            }
                                                        />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className='col-8 nopad pt-1'>
                                                <a
                                                    onClick={() =>
                                                        this.props.goToProfile(
                                                            post.userId
                                                        )
                                                    }
                                                >
                                                    {post.userId in
                                                    this.props.fullNameKV
                                                        ? this.props.fullNameKV[
                                                              post.userId
                                                          ]
                                                        : 'Unknown'}
                                                </a>
                                                <span className='small pstim'>
                                                    {assignTimeAgo(post.time)}
                                                </span>
                                            </div>
                                            {post.interest.icon && (
                                                <div className='col-2'>
                                                    <span className='acttyp'>
                                                        <img
                                                            src={`/uploads/images/${post.interest.icon}`}
                                                        />
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <p>{post.description}</p>

                                    {post.imgFileName &&
                                        post.imgFileName.map((img) => (
                                            <div className='pstmd' key={img}>
                                                <img
                                                    src={`${
                                                        getServerUrl().apiURL
                                                    }/uploads/posts/${img}`}
                                                    onClick={() =>
                                                        this.props.openPictureViewer(
                                                            `${
                                                                getServerUrl()
                                                                    .apiURL
                                                            }/uploads/posts/${img}`
                                                        )
                                                    }
                                                    style={{
                                                        cursor: 'pointer',
                                                    }}
                                                    alt=''
                                                />
                                            </div>
                                        ))}
                                    {post.videoFileName &&
                                        post.videoFileName.map((video) => (
                                            <div className='pstmd' key={video}>
                                                <video
                                                    width='100%'
                                                    height='240'
                                                    controls
                                                >
                                                    <source
                                                        src={`${
                                                            getServerUrl()
                                                                .apiURL
                                                        }/uploads/posts/${video}`}
                                                        type='video/mp4'
                                                    ></source>
                                                </video>
                                            </div>
                                        ))}

                                    <div className='rctbx'>
                                        <span>
                                            <img src='/uploads/images/symbol1.png' />
                                            {post.kudos.bumSlaps.length}
                                        </span>
                                        <span>
                                            <img src='/uploads/images/symbol2.png' />
                                            {post.kudos.backSlaps.length}
                                        </span>
                                        <span>
                                            <img src='/uploads/images/symbol3.png' />
                                            {post.kudos.likes.length}
                                        </span>
                                        <span>
                                            <img src='/uploads/images/symbol4.png' />
                                            23
                                        </span>
                                        <span>
                                            <img src='/uploads/images/symbol5.png' />
                                            {post.comments.length}
                                        </span>
                                    </div>

                                    <div className='lkbxbtm f12'>
                                        <div className='row'>
                                            <div className='col'>
                                                <a
                                                    onClick={() => {
                                                        this.props.history.push(
                                                            `/post/${
                                                                post.postId
                                                            }${
                                                                post.section
                                                                    .type !==
                                                                'users'
                                                                    ? '/view'
                                                                    : ''
                                                            }`
                                                        );
                                                    }}
                                                >
                                                    <img src='/uploads/images/comment.png' />
                                                    {post.section.type !==
                                                    'users'
                                                        ? 'View Comment'
                                                        : 'Comment'}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    ) : (
                        <p>No Post Found</p>
                    )
                ) : (
                    ''
                )}

                {this.props.searchTarget === 'teams' ? (
                    this.props.filteredTeams.length > 0 ||
                    this.props.teamsLoading ? (
                        this.props.teamsLoading ? (
                            <div>
                                <img
                                    width={35}
                                    height={35}
                                    src={loading}
                                    alt=''
                                />
                            </div>
                        ) : (
                            this.props.filteredTeams.map((team, index) => (
                                <div
                                    className='srchpstbx clubbxsrch'
                                    key={'team-search-' + index}
                                >
                                    <p>
                                        <img
                                            src={`${
                                                getServerUrl().apiURL
                                            }/uploads/team/${team.logo}`}
                                            alt={'Team Logo'}
                                        />
                                        <div>
                                            <a
                                                href=''
                                                onClick={() =>
                                                    this.props.goToTeam(
                                                        team.slug
                                                    )
                                                }
                                            >
                                                {team.title}
                                            </a>
                                            <span className='small pstim'>
                                                {`${
                                                    team.membersCount
                                                } follower${
                                                    team.membersCount > 1
                                                        ? 's'
                                                        : ''
                                                }`}
                                            </span>
                                            <span>
                                                Offers: {team.activityType}
                                            </span>
                                            <span>
                                                <a className='f14 btn' href='#'>
                                                    Follow Us
                                                </a>
                                                <a className='f14 btn' href='#'>
                                                    Get Membership
                                                </a>
                                            </span>
                                            <span className='small'>
                                                <img src='/uploads/images/pin.png' />
                                                145, P block, Park View,
                                                Eithense, Australia
                                            </span>
                                        </div>
                                    </p>
                                </div>
                            ))
                        )
                    ) : (
                        <p>No Team Found</p>
                    )
                ) : (
                    ''
                )}

                {this.props.searchTarget === 'users' ? (
                    this.props.filteredUsers.length > 0 ||
                    this.props.usersLoading ? (
                        this.props.usersLoading ? (
                            <div>
                                <img
                                    width={35}
                                    height={35}
                                    src={loading}
                                    alt=''
                                />
                            </div>
                        ) : (
                            this.props.filteredUsers.map((user, index) => (
                                <div
                                    className='pplsrch'
                                    key={'search-user-' + index}
                                >
                                    <div className='usrtop'>
                                        <div className='row'>
                                            <div className='col-3'>
                                                <div className='userthumb'>
                                                    <a className='userbx'>
                                                        <img
                                                            src={
                                                                user.profilePicture
                                                                    ? `${
                                                                          getServerUrl()
                                                                              .apiURL
                                                                      }/uploads/user/${
                                                                          user.profilePicture
                                                                      }`
                                                                    : profileBlank
                                                            }
                                                        />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className='col-5 nopad'>
                                                <a
                                                    onClick={() =>
                                                        this.props.goToProfile(
                                                            user.userId
                                                        )
                                                    }
                                                >{`${user.firstName} ${user.lastName}`}</a>
                                                {user.location && (
                                                    <span className='small pstim'>
                                                        {user.location}
                                                    </span>
                                                )}
                                            </div>
                                            <div className='col-4 text-right'>
                                                <a
                                                    className={`smplbtn m-0 ${
                                                        user.followers.includes(
                                                            this.props.user
                                                                .userId
                                                        )
                                                            ? 'unflw'
                                                            : ''
                                                    }`}
                                                    href='#'
                                                >
                                                    {user.followers.includes(
                                                        this.props.user.userId
                                                    )
                                                        ? 'Unfollow'
                                                        : 'Follow Me'}
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    ) : (
                        <p>No User Found</p>
                    )
                ) : (
                    ''
                )}

                {this.props.searchTarget === 'questions' ? (
                    this.props.filteredQuestions.length > 0 ||
                    this.props.questionsLoading ? (
                        this.props.questionsLoading ? (
                            <div>
                                <img
                                    width={35}
                                    height={35}
                                    src={loading}
                                    alt=''
                                />
                            </div>
                        ) : (
                            this.props.filteredQuestions.map(
                                (question, index) => (
                                    <div
                                        className='srchpstbx'
                                        key={'questions-search-' + index}
                                    >
                                        <div className='usrtop'>
                                            <div className='row'>
                                                <div className='col-2'>
                                                    <div className='userthumb'>
                                                        <a className='userbx'>
                                                            <img
                                                                src={
                                                                    question.userId in
                                                                    this.props
                                                                        .profilePictureKV
                                                                        ? `${
                                                                              getServerUrl()
                                                                                  .apiURL
                                                                          }/uploads/user/${
                                                                              this
                                                                                  .props
                                                                                  .profilePictureKV[
                                                                                  question
                                                                                      .userId
                                                                              ]
                                                                          }`
                                                                        : profileBlank
                                                                }
                                                            />
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className='col-8 nopad pt-1'>
                                                    <a
                                                        onClick={() =>
                                                            this.props.goToProfile(
                                                                question.userId
                                                            )
                                                        }
                                                    >
                                                        {question.userId in
                                                        this.props.fullNameKV
                                                            ? this.props
                                                                  .fullNameKV[
                                                                  question
                                                                      .userId
                                                              ]
                                                            : 'Unknown'}
                                                    </a>
                                                    <span className='small pstim'>
                                                        {assignTimeAgo(
                                                            question.time
                                                        )}
                                                    </span>
                                                </div>
                                                {question.interest.icon && (
                                                    <div className='col-2'>
                                                        <span className='acttyp'>
                                                            <img
                                                                src={`/uploads/images/${question.interest.icon}`}
                                                            />
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <p>{question.description}</p>
                                        <a
                                            onClick={() =>
                                                this.props.history.push(
                                                    `/answers/${question.postId}`
                                                )
                                            }
                                            className='btn grnbtn'
                                        >
                                            {assignAnswerPermission(
                                                question.comments,
                                                this.props.user.userId,
                                                question.userId
                                            )
                                                ? 'Answer This Question'
                                                : 'View All'}
                                        </a>
                                    </div>
                                )
                            )
                        )
                    ) : (
                        <p>No Question Found</p>
                    )
                ) : (
                    ''
                )}

                {this.props.searchTarget === 'events' ? (
                    this.props.filteredEvents.length > 0 ||
                    this.props.eventsLoading ? (
                        this.props.eventsLoading ? (
                            <div>
                                <img
                                    width={35}
                                    height={35}
                                    src={loading}
                                    alt=''
                                />
                            </div>
                        ) : (
                            this.props.filteredEvents.map((event, index) => (
                                <div
                                    className='srchpstbx'
                                    key={'event-search-' + index}
                                >
                                    <div className='usrtop'>
                                        <div className='row'>
                                            <div className='col-2'>
                                                <div className='userthumb'>
                                                    <a className='userbx'>
                                                        <img
                                                            src={
                                                                event.owner in
                                                                this.props
                                                                    .profilePictureKV
                                                                    ? this.props
                                                                          .profilePictureKV[
                                                                          event
                                                                              .owner
                                                                      ]
                                                                    : profileBlank
                                                            }
                                                        />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className='col-8 nopad pt-1'>
                                                <a
                                                    onClick={() =>
                                                        this.props.goToProfile(
                                                            event.owner
                                                        )
                                                    }
                                                >
                                                    {event.owner}
                                                </a>
                                                <span className='small pstim'>
                                                    {assignTimeAgo(event.time)}
                                                </span>
                                            </div>
                                            <div className='col-2'>
                                                <span className='acttyp'>
                                                    <img src='/uploads/images/run.svg' />
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <p>
                                        <a
                                            href='#'
                                            onClick={() =>
                                                this.props.goToEvent(
                                                    event.eventId
                                                )
                                            }
                                        >
                                            {event.name}
                                        </a>
                                    </p>
                                    <p>
                                        <span className='small'>
                                            <img src='/uploads/images/calendar.png' />
                                            {event.time}
                                        </span>
                                    </p>
                                    <p>
                                        {' '}
                                        <span className='small'>
                                            <img src='/uploads/images/pin.png' />
                                            145, P block, Park View, Eithense,
                                            Australia
                                        </span>
                                    </p>
                                    <p>
                                        {' '}
                                        <span className='small'>
                                            <img src='/uploads/images/people.png' />
                                            {event.attending.length} People
                                            Attending
                                        </span>
                                    </p>
                                    <a href='' className='btn grnbtn'>
                                        I am Interested
                                    </a>
                                </div>
                            ))
                        )
                    ) : (
                        <p>No Event Found</p>
                    )
                ) : (
                    ''
                )}

                {this.props.searchTarget === 'groups' ? (
                    this.props.filteredGroups.length > 0 ||
                    this.props.groupsLoading ? (
                        this.props.groupsLoading ? (
                            <div>
                                <img
                                    width={35}
                                    height={35}
                                    src={loading}
                                    alt=''
                                />
                            </div>
                        ) : (
                            this.props.filteredGroups.map((group, index) => (
                                <div
                                    className='pplsrch grpsrch'
                                    key={'group-search-' + index}
                                >
                                    <div className='usrtop'>
                                        <div className='row'>
                                            <div className='col-3'>
                                                <div className='userthumb'>
                                                    <a className='userbx'>
                                                        <img
                                                            src={
                                                                group.logo
                                                                    ? `${
                                                                          getServerUrl()
                                                                              .apiURL
                                                                      }/uploads/group/${
                                                                          group.logo
                                                                      }`
                                                                    : ''
                                                            }
                                                            alt={`${group.title} Logo`}
                                                        />
                                                    </a>
                                                </div>
                                            </div>
                                            <div className='col-9 nopad'>
                                                <a
                                                    href='#'
                                                    onClick={() =>
                                                        this.props.goToGroup(
                                                            group.slug
                                                        )
                                                    }
                                                >
                                                    {group.title}
                                                </a>
                                                <span className='small pstim'>
                                                    {`Group ${
                                                        group.membersCount
                                                    } ${
                                                        group.membersCount === 0
                                                            ? 'member'
                                                            : 'members'
                                                    }`}
                                                </span>
                                                <p className='mt-1'>
                                                    {' '}
                                                    <a
                                                        id={
                                                            'group-btn-' +
                                                            group._id
                                                        }
                                                        className={`smplbtn m-0 ${
                                                            this.props.user.groupRequests.includes(
                                                                group._id
                                                            )
                                                                ? 'dislinks blur'
                                                                : this.isGroupMember(
                                                                      group._id
                                                                  )
                                                                ? 'unflw'
                                                                : ''
                                                        }`}
                                                        href=''
                                                        onClick={(e) => {
                                                            if (
                                                                this.isGroupMember(
                                                                    group._id
                                                                )
                                                            ) {
                                                                this.leaveGroup(
                                                                    e,
                                                                    group._id,
                                                                    group.type
                                                                );
                                                            } else {
                                                                this.joinGroup(
                                                                    e,
                                                                    group._id,
                                                                    group.type
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {this.props.user.groupRequests.includes(
                                                            group._id
                                                        )
                                                            ? 'Pending'
                                                            : !this.isGroupMember(
                                                                  group._id
                                                              )
                                                            ? 'Join Group'
                                                            : 'Leave Group'}
                                                    </a>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    ) : (
                        <p>No Group Found</p>
                    )
                ) : (
                    ''
                )}
            </>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.auth.user,
    };
};

export default withRouter(connect(mapStateToProps)(SearchResult));
