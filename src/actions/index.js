import axios from 'axios';
import * as API from '../utils/api';

const server_url = API.getServerUrl().apiURL;

export const emailChanged = (text) => {
    return {
        type: 'email_changed',
        payload: text,
    };
};

export const passwordChanged = (text) => {
    return {
        type: 'password_changed',
        payload: text,
    };
};

export const signUpUser = (userDetails) => {
    return (dispatch) => {
        dispatch({ type: 'signup_loading' });
        API.signUpUser(userDetails).then((user) => {
            if (user.userId) {
                API.loginUser({
                    userId: userDetails.userId,
                    password: userDetails.password,
                }).then(
                    (user) => {
                        localStorage.setItem('token', user.token);
                        localStorage.setItem('userData', user.user.userId);
                        dispatch({
                            type: 'signup_user_success',
                            payload: {
                                user: user.user,
                                token: user.token,
                                redirect: '/first-time-login',
                            },
                        });
                    },
                    (err) => {
                        dispatch({ type: 'login_user_fail' });
                    }
                );
            }
            else if (user.type == "userId_exists"){
                dispatch ({
                  type:"signup_loading_stop",
                });
                dispatch({
                   type : "show_popup",
                   payload:{
                       message: "the userId already exists",
                       button:"try again",
                       redirect: "none",
                   }
                });
            }
            else if (user.type == "email_exists"){
                dispatch ({
                   type:"signup_loading_stop",
                });
                    dispatch({
                        type:"show_popup",
                        payload:{
                            message: "the email is already exists ",
                            button: "try again",
                            redirect: "none",
                        }
                    });
            }
            
             else {
                dispatch({
                    type : "signup_loading_stop",
                        
                });
                dispatch({
                
                    type: 'show_popup',
                    payload: {
                        message: 'Sign Up failed. Please try again.',
                        button: 'Try Again',
                        redirect: 'none',
                    },
                });
            }
        });
    };
};

export const signupUpdateAthlete = ({ userId, token, edited }) => {
    return (dispatch) => {
        dispatch({ type: 'signup_loading' });

        API.editProfile(userId, edited).then((res) => {
            API.getUser(userId, token).then((user) => {
                if (user.userId) {
                    dispatch({
                        type: 'update_user',
                        payload: {
                            user,
                            redirect: '/home',
                        },
                    });
                }
            });
        });
    };
};

export const signupUpdateCoach = ({
    userId,
    token,
    file,
    certificate,
    edited,
}) => {
    return (dispatch) => {
        dispatch({ type: 'signup_loading' });
        if (certificate !== null) {
            const coach = new FormData();

            coach.append('file', certificate);
            axios
                .put(
                    API.getServerUrl() +
                        '/users/' +
                        userId +
                        '/updateCertificate',
                    coach,
                    {
                        onUploadProgress: (ProgressEvent) => {
                            dispatch({
                                type: 'upload_progress',
                                payload: Math.ceil(
                                    (ProgressEvent.loaded /
                                        ProgressEvent.total) *
                                        100
                                ),
                            });
                        },
                        headers: {
                            // 'Content-Type': false
                        },
                    }
                )
                .then((res) => {
                    if (res.status === 200) {
                        console.log(res);
                    }
                });
        }
        if (file !== null) {
            const data = new FormData();

            data.append('userId', userId);
            data.append('file', file);
            axios
                .put(
                    API.getServerUrl() + '/users/' + userId + '/profilePicture',
                    data
                )
                .then((res) => {
                    if (res.status === 200) {
                        API.editProfile(userId, edited).then((res) => {
                            API.getUser(userId, token).then((user) => {
                                if (user.userId) {
                                    dispatch({
                                        type: 'update_user',
                                        payload: {
                                            user,
                                        },
                                    });
                                    dispatch({
                                        type: 'show_popup',
                                        payload: {
                                            message: 'Signup Complete!',
                                            button: 'Go Home',
                                            redirect: '/profile/' + userId,
                                        },
                                    });
                                }
                            });
                        });
                    }
                });
        } else {
            API.editProfile(userId, edited).then((res) => {
                API.getUser(userId, token).then((user) => {
                    if (user.userId) {
                        dispatch({
                            type: 'update_user',
                            payload: { user, redirect: '/profile/' + userId },
                        });
                    }
                });
            });
        }
    };
};

export const updateUserProfile = ({ userId, token, certificate, edited }) => {
    return (dispatch) => {
        if (certificate) {
            const coach = new FormData();
            coach.append('file', certificate);
            axios
                .put(
                    API.getServerUrl() +
                        '/users/' +
                        userId +
                        '/updateCertificate',
                    coach
                )
                .then((res) => {
                    if (res.status === 200) {
                    }
                });
        }

        // edit profile
        API.editProfile(userId, edited).then((res) => {
            API.getUser(userId, token).then((user) => {
                if (user.userId) {
                    dispatch({
                        type: 'update_user',
                        payload: {
                            user,
                            redirect: '/profile/' + userId,
                        },
                    });
                }
            });
        });
    };
};

export const isUserloggedIn = () => {
    return (dispatch) => {
        let tok = localStorage.getItem('token');
        let userID = localStorage.getItem('userData');

        if (tok && userID) {
            API.getUser(userID, tok).then((user) => {
                if (user.userId) {
                    dispatch({
                        type: 'login_user_success',
                        payload: { user: user, token: tok, redirect: '' },
                    });
                } else {
                    dispatch({ type: 'loading_stop' });
                }
            });
        } else {
            dispatch({ type: 'loading_stop' });
        }
    };
};

export const loginUser = (loginDetails) => {
    return (dispatch) => {
        API.loginUser(loginDetails).then(
            (user) => {
                localStorage.setItem('token', user.token);
                localStorage.setItem('userData', user.user.userId);
                dispatch({
                    type: 'login_user_success',
                    payload: {
                        user: user.user,
                        token: user.token,
                        redirect: '/home',
                    },
                });
            },
            (err) => {
                dispatch({ type: 'login_user_fail' });
            }
        );
    };
};

export const socialLogIn = (loginDetails) => {
    return (dispatch) => {
        //console.log(loginDetails);
        API.socialLogIn(loginDetails).then(
            (user) => {
                if(user.success == true){
                localStorage.setItem('token', user.token);
                  localStorage.setItem('userData', user.user.userId);
                dispatch({
                    type: 'login_user_success',
                    payload: {
                        user: user.user,
                        token: user.token,
                        redirect: '/home',
                    },
                });
                console.log("this is the true case user find");
            }
            else if(user.success == false){
               // console.log(loginDetails);
              
                dispatch({
                    type: "sociallogin",
                    payload:{
                        loginDetails,
                         redirect: "/signupUser",
                    }
                })
                console.log("this is the false case  user not find")
            }
           
        }
            
        );
            
    };
};


const errorOccurred = (dispatch, error) => {
    //console.log(error);
    dispatch({ type: 'error_occurred', payload: error });
};

export const closePopup = () => {
    return (dispatch) => {
        dispatch({ type: 'close_popup' });
    };
};

export const editUser = ({ userID, token }) => {
    return (dispatch) => {
        API.getUser(userID, token).then((user) => {
            if (user.userId) {
                dispatch({ type: 'update_user', payload: { user } });
            }
        });
    };
};

export const logOutUser = () => {
    return (dispatch) => {
        // Deletes token and userId from local storage.
        localStorage.removeItem('token');
        localStorage.removeItem('userData');

        dispatch({ type: 'logout' });
    };
};

export const getAllPosts = () => {
    return (dispatch) => {
        API.getAllPosts().then((posts) => {
            dispatch({ type: 'all_posts', payload: posts });
        });
        API.getAllQuestions().then((questions) => {
            dispatch({ type: 'all_questions', payload: questions });
        });
    };
};

export const getGroupPosts = (groupId) => {
    return (dispatch) => {
        API.getPostByGroup(groupId).then((posts) => {
            dispatch({ type: 'group_posts', payload: posts });
        });
    };
};

export const getEventPosts = (eventId) => {
    return (dispatch) => {
        API.getAllEventsPosts(eventId).then((posts) => {
            dispatch({ type: 'event_posts', payload: posts });
        });
    };
};

export const getUserPosts = (userId) => {
    return (dispatch) => {
        API.getPostByUser(userId).then((posts) => {
            dispatch({ type: 'user_posts', payload: posts });
        });
    };
};

export const postEdit = (postId) => {
    return (dispatch) => {
        dispatch({ type: 'edit_post', payload: postId });
    };
};

export const updatePost = (postId, edited) => {
    return (dispatch) => {
        API.editPost(postId, edited).then((post) => {
            if (post.postId) {
                if (post.section.type === 'users') {
                    dispatch({
                        type: 'update_post',
                        payload: { postId, post },
                    });
                } else {
                    dispatch({
                        type: 'update_post',
                        payload: { postId, post },
                    });
                }
            } else {
                dispatch({
                    type: 'show_popup',
                    payload: {
                        message: 'There was some issue. Please try again.',
                        button: 'Close',
                        redirect: 'none',
                    },
                });
            }
        });
    };
};

/*export const createPost = (newPost) => {
	return (dispatch) => {
		const data = new FormData()
		data.append('postId', newPost.postId);
		data.append('userId', newPost.userId);
		data.append('isQuestion', newPost.isQuestion);
		data.append('type', newPost.type);
		data.append('description', newPost.description);
		data.append('interest', newPost.interest);
		data.append('time', newPost.time);
		data.append('role', newPost.role);
		data.append('section', JSON.stringify(newPost.section));
		
		if (newPost.type !== 'text')
			data.append('file', newPost.file);
		
		let promise = new Promise((resolve) => {
			axios.post(API.getServerUrl() + "/posts", data, {
				onUploadProgress: ProgressEvent => {
					dispatch({type: 'post_upload_progress', payload:Math.ceil(ProgressEvent.loaded / ProgressEvent.total * 100)});
				},
				headers: {
					'Content-Type': false
				}
			}).then(res => {
				if (res.status === 200) {
					let postToAdd = res.data;

					if (postToAdd.section.type === "users") {
						this.setState(previousState => {
							if (newPost.isQuestion) {
								let sortedQuestions = previousState.questions
								sortedQuestions.push(postToAdd)
								sortedQuestions.sort((a, b) => Date.parse(b.time) - Date.parse(a.time))
								return {
									questions: sortedQuestions,
								}
							} else {
								let sortedPosts = previousState.posts
								sortedPosts.push(postToAdd)
								sortedPosts.sort((a, b) => Date.parse(b.time) - Date.parse(a.time))
								return {
									posts: sortedPosts,
								}
							}
						}, () => {
							resolve(true)
						})
					} else {
						resolve(postToAdd)
					}
				}
			});
		});
	};
}

export const deletePost = (postId, typeQuestion) => {
	return (dispatch) => {
		API.deletePost(postId).then(post => {
			if (post) {
				dispatch({type: 'delete_post', payload:{postId, typeQuestion}});
				dispatch({type: 'show_popup', payload:{message: 'Your post was deleted.', button: 'Close', redirect: 'none'}});
			} else {
				dispatch({type: 'show_popup', payload:{message: 'There was error. Please try again.', button: 'Close', redirect: 'none'}});
			}
		})
	};
}*/

export const loadPlanners = (teamId) => {
    return (dispatch) => {
        dispatch({ type: 'loading' });

        axios
            .get(server_url + '/planners/getByTeam/' + teamId)
            .then((response) => {
                if (response.data.success === false) {
                    //dispatch({type: 'login_user_fail', payload:response.data.error_message});
                } else if (response.data.success === true) {
                    dispatch({
                        type: 'load_planners',
                        payload: response.data.planners,
                    });
                }
            })
            .catch((error) => errorOccurred(dispatch, error));
    };
};

export const loadSessions = (teamId) => {
    return (dispatch) => {
        axios
            .get(server_url + '/sessions/getByTeam/' + teamId)
            .then((response) => {
                if (response.data.success === false) {
                    //dispatch({type: 'login_user_fail', payload:response.data.error_message});
                } else if (response.data.success === true) {
                    dispatch({
                        type: 'load_sessions',
                        payload: response.data.sessions,
                    });
                }
            })
            .catch((error) => errorOccurred(dispatch, error));
    };
};

export const loadAddSessionData = (sessionId, clubId) => {
    return (dispatch) => {
        dispatch({ type: 'loading' });

        axios
            .get(
                server_url +
                    '/sessions/' +
                    clubId +
                    '/addSessionData/' +
                    sessionId
            )
            .then((response) => {
                if (response.data.success === false) {
                    //dispatch({type: 'login_user_fail', payload:response.data.error_message});
                } else if (response.data.success === true) {
                    dispatch({
                        type: 'load_add_session_data',
                        payload: response.data,
                    });
                }
            })
            .catch((error) => errorOccurred(dispatch, error));
    };
};

export const closeAlert = () => {
    return (dispatch) => {
        dispatch({ type: 'alert_close' });
    };
};

export const showAddPlanner = (id) => {
    return (dispatch) => {
        dispatch({ type: 'show_add_planner', payload: id });
    };
};

export const hideAddPlanner = () => {
    return (dispatch) => {
        dispatch({ type: 'hide_add_planner' });
    };
};

export const showAddProgram = () => {
    return (dispatch) => {
        dispatch({ type: 'show_add_program' });
    };
};

export const hideAddProgram = () => {
    return (dispatch) => {
        dispatch({ type: 'hide_add_program' });
    };
};

export const showAddExercise = () => {
    return (dispatch) => {
        dispatch({ type: 'show_add_exercise' });
    };
};
export const loadProgram = () => {
    return (dispatch) => {
        dispatch({ type: 'load_programs' });
    };
};
export const hideProgram = () => {
    return (dispatch) => {
        dispatch({ type: 'hide_programs' });
    };
};

export const hideAddExercise = () => {
    return (dispatch) => {
        dispatch({ type: 'hide_add_exercise' });
    };
};

export const showAddSession = (id) => {
    return (dispatch) => {
        dispatch({ type: 'show_add_session', payload: id });
    };
};

export const hideAddSession = () => {
    return (dispatch) => {
        dispatch({ type: 'hide_add_session' });
    };
};

//hf
export const prepareAddSession = (id) => {
    return (dispatch) => {
        dispatch({ type: "prepare_add_session", payload: id });
    }
}

//hf
export const hidePrepare = () => {
    return (dispatch) => {
        dispatch({ type: "hide_prepare" });
    }
}

export const ShowEditExercise = (id) => {
    return (dispatch) => {
        dispatch({ type: 'show_edit_exercise', payload: id });
    };
};
export const viewExercise = (id) => {
    return (dispatch) => {
        dispatch({ type: 'view_exercise', payload: id });
    };
};
export const hideViewExercise = () => {
    return (dispatch) => {
        dispatch({ type: 'hide_view_exercise' });
    };
};
export const hideEditExercise = () => {
    return (dispatch) => {
        dispatch({ type: 'hide_edit_exercise' });
    };
};
export const ShowEditProgram = (id) => {
    return (dispatch) => {
        dispatch({ type: 'show_edit_program', payload: id });
    };
};
export const SelectedProgramId = (id) => {
    return (dispatch) => {
        dispatch({ type: 'selected_program_id', payload: id });
    };
};
export const viewSessions = (id) => {
    return (dispatch) => {
        dispatch({ type: 'view_sessions', payload: id });
    };
};
export const hideViewSession = () => {
    return (dispatch) => {
        dispatch({ type: 'hide_view_sessions' });
    };
};
export const hideEditProgram = () => {
    return (dispatch) => {
        dispatch({ type: 'hide_edit_program' });
    };
};
export const updateSeachExercise = (params) => {
    return (dispatch) => {
        dispatch({ type: 'update_ss_exercise_search', payload: params });
    };
};
export const updateSeachProgram = (params) => {
    return (dispatch) => {
        dispatch({ type: 'update_program_search', payload: params });
    };
};
export const updateSeachSession = (params) => {
    return (dispatch) => {
        dispatch({ type: 'update_session_search', payload: params });
    };
};
export const showSessionDescription = (des) => {
    return (dispatch) => {
        dispatch({ type: 'show_session_desc', payload: des });
    };
};
export const hideSessionDescription = (des) => {
    return (dispatch) => {
        dispatch({ type: 'hide_session_desc' });
    };
};
export const showPlannerAssignment = () => {
    return (dispatch) => {
        dispatch({ type: 'show_planner_assignment' });
    };
};
export const hidePlannerAssignment = () => {
    return (dispatch) => {
        dispatch({ type: 'hide_planner_assignment' });
    };
};
export const editSessionTime = (
    id,
    eventId,
    calendar,
    sessionTime,
    sessionURL
) => {
    return (dispatch) => {
        dispatch({
            type: 'edit_session_time',
            payload: { id, eventId, calendar, sessionTime, sessionURL },
        });
    };
};
export const hideEditSessionTime = () => {
    return (dispatch) => {
        dispatch({ type: 'hide_edit_session_time' });
    };
};

export const showStrengthSession = (id) => {
    return (dispatch) => {
        dispatch({ type: 'show_strength_session', payload: id });
    };
};
export const hideStrengthSession = () => {
    return (dispatch) => {
        dispatch({ type: 'hide_strength_session' });
    };
};
export const setSessTimeData = (data) => {
    return (dispatch) => {
        dispatch({ type: 'set_sess_time_data', payload: data });
    };
};
export const createPlanner = (planner) => {
    return (dispatch) => {
        let slugify = require('slugify');
        planner.slug = slugify(planner.title, {
            replacement: '-',
            remove: null,
            lower: true,
        });

        if (planner.displayCountdown) planner.displayCountdown = 'yes';
        else planner.displayCountdown = 'no';
        if (planner.revCountdown) planner.revCountdown = 'yes';
        else planner.revCountdown = 'no';

        axios
            .post(server_url + '/planners/add', planner)
            .then((response) => {
                if (response.data.success === false) {
                    dispatch({
                        type: 'add_failed',
                        payload: response.data.msg,
                    });
                } else if (response.data.success === true) {
                    let msg = response.data.msg;
                    axios
                        .get(
                            server_url + '/planners/getByTeam/' + planner.clubId
                        )
                        .then((response) => {
                            if (response.data.success === false) {
                                dispatch({
                                    type: 'planner_added',
                                    payload: { msg, planners: false },
                                });
                            } else if (response.data.success === true) {
                                dispatch({
                                    type: 'planner_added',
                                    payload: {
                                        msg,
                                        planners: response.data.planners,
                                    },
                                });
                            }
                        })
                        .catch((error) => errorOccurred(dispatch, error));
                }
            })
            .catch((error) => errorOccurred(dispatch, error));
    };
};

export const updatePlanner = (planner) => {
    return (dispatch) => {
        let slugify = require('slugify');
        planner.slug = slugify(planner.title, {
            replacement: '-',
            remove: null,
            lower: true,
        });

        if (planner.displayCountdown) planner.displayCountdown = 'yes';
        else planner.displayCountdown = 'no';
        if (planner.revCountdown) planner.revCountdown = 'yes';
        else planner.revCountdown = 'no';

        axios
            .post(server_url + '/planners/update/' + planner._id, planner)
            .then((response) => {
                if (response.data.success === false) {
                    dispatch({
                        type: 'add_failed',
                        payload: response.data.msg,
                    });
                } else if (response.data.success === true) {
                    let msg = response.data.msg;
                    axios
                        .get(
                            server_url + '/planners/getByTeam/' + planner.clubId
                        )
                        .then((response) => {
                            if (response.data.success === false) {
                                dispatch({
                                    type: 'planner_added',
                                    payload: { msg, planners: false },
                                });
                            } else if (response.data.success === true) {
                                dispatch({
                                    type: 'planner_added',
                                    payload: {
                                        msg,
                                        planners: response.data.planners,
                                    },
                                });
                            }
                        })
                        .catch((error) => errorOccurred(dispatch, error));
                }
            })
            .catch((error) => errorOccurred(dispatch, error));
    };
};

export const createProgram = ({
    title,
    startDate,
    programPhase,
    activityType,
    athleteLevel,
}) => {
    return (dispatch) => {
        dispatch({ type: 'loading' });

        let form_data = new FormData();
        form_data.append('title', title);
        form_data.append('startDate', startDate);
        form_data.append('programPhase', programPhase);
        form_data.append('activityType', activityType);
        form_data.append('athleteLevel', athleteLevel);

        axios
            .post(server_url + '/programs/add', form_data)
            .then((response) => {
                //console.log(response);
                if (response.data.success === false) {
                    dispatch({
                        type: '',
                        payload: response.data.error_message,
                    });
                } else if (response.data.success === true) {
                    dispatch({ type: 'program_added', payload: response.data });
                }
            })
            .catch((error) => errorOccurred(dispatch, error));
    };
};

export const createSession = (session) => {
    return (dispatch) => {
        session.perceivedEfforts = session.rpe;
        delete session.rpe;

        if (session.familyName === '') delete session.familyName;

        axios
            .post(server_url + '/sessions/add', session)
            .then((response) => {
                if (response.data.success === false) {
                    dispatch({
                        type: 'add_failed',
                        payload: response.data.msg,
                    });
                } else if (response.data.success === true) {
                    dispatch({
                        type: 'session_added',
                        payload: response.data.msg,
                    });
                }
            })
            .catch((error) => errorOccurred(dispatch, error));
    };
};

export const updateSession = (session) => {
    return (dispatch) => {
        session.perceivedEfforts = session.rpe;
        delete session.rpe;

        if (session.familyName === '') delete session.familyName;

        axios
            .post(server_url + '/sessions/update/' + session._id, session)
            .then((response) => {
                if (response.data.success === false) {
                    dispatch({
                        type: 'add_failed',
                        payload: response.data.msg,
                    });
                } else if (response.data.success === true) {
                    dispatch({
                        type: 'session_added',
                        payload: response.data.msg,
                    });
                }
            })
            .catch((error) => errorOccurred(dispatch, error));
    };
};

export const programAddSession = (sessionId) => {
    return (dispatch) => {
        let plannerId = '5e3c1656297fb976343d484d';
        let programId = '5e6a38f1e68b501ff49a88ba';
        let data = {
            plannerId,
            sessionId,
            sessionDate: '2020-03-03',
            sessionOrder: 1,
        };

        axios
            .post(server_url + '/programs/add_sessions/' + programId, data)
            .then((response) => {
                if (response.data.success === false) {
                    //console.log(response.data.msg);
                } else if (response.data.success === true) {
                    //console.log(response.data.msg);
                }
            })
            .catch((error) => errorOccurred(dispatch, error));
    };
};

export const selectedPopulateSession = (sessResult) => {
    return (dispatch) => {
        dispatch({ type: 'selected_session_populate', payload: sessResult });
    };
};

export const checkAuth = (userID) => {
    return axios.get(server_url + '/auth/check', {params: {
        userID: userID
    }}).then((res) => res.data)
};

export const outAuth = (userID) => {
    return axios.get(server_url + '/auth/out', {params: {
        userID: userID
    }}).then((res) => console.log(res));
};


export const authenticate = () => {
    //console.log("test sending to " + server_url + '/auth/')
    return axios.post(server_url + '/auth/').then((res) => res.data)
};



export const postGarmin = (data, userID) =>{
    
    return (dispatch) => {
        axios
            .post(server_url + '/workout/sendWorkout/',{data, userID})
            .then((response) => {
                if (response.data.success === false) {
                    //console.log(response.data.msg);
                } else if (response.data.success === true) {
                    //console.log(response.data.msg);
                }
            })
            .catch((error) => errorOccurred(dispatch, error));
    };
}