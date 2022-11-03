/**
 * =====================================
 * API FILE
 * =====================================
 * @date created: 24 August 2019
 * @authors: Waqas Rehmani, Hasitha Dias, Jay Parikh
 *
 * This file has all the APIs that are used by all the frontend components.
 *
 */

// This is the URL of the running server
const configConst = require('../config/constants');
export const apiURL = configConst.apiURL;
export const mobileQuery = configConst.mobileQuery;

let headers = {};
// ==========================================================================================
// User functions
// ==========================================================================================
export const getUser = (userName, token) =>
    fetch(`${apiURL}/users/${userName}`, {
        headers: { authorization: `Bearer ${token}` },
    }).then((res) => res.json());

export const getFollowerData = (userName) =>
    fetch(`${apiURL}/users/follower/${userName}`, headers).then((res) =>
        res.json()
    );

export const getUserBasicData = (userId) =>
    fetch(`${apiURL}/users/basic/${userId}`, headers).then((res) => res.json());

export const getAllFollowersData = (userId) =>
    fetch(`${apiURL}/users/followers/${userId}`, headers).then((res) =>
        res.json()
    );

export const getAllFollowingUserData = (userId) =>
    fetch(`${apiURL}/users/following/${userId}`, headers).then((res) =>
        res.json()
    );

export const userIdExists = (userName) =>
    fetch(`${apiURL}/users/checkId/${userName}`, headers).then((res) =>
        res.json()
    );

export const getProfilePicture = (userName) =>
    fetch(`${apiURL}/users/${userName}/profilePicture`, {
        headers,
    }).then((res) => res.json());

export const signUpUser = (userDetails) =>
    fetch(`${apiURL}/users`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userDetails),
    }).then((res) => res.json());

export const loginUser = (loginDetails) =>
    fetch(`${apiURL}/users/${loginDetails.userId}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginDetails),
    }).then((res) => res.json());

export const socialLogIn = (loginDetails) =>
    fetch(`${apiURL}/users/socialLogin`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ loginDetails }),
    }).then((res) => res.json());

export const logoutUser = (logoutDetails) =>
    fetch(`${apiURL}/users/logout/${logoutDetails.userId}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(logoutDetails),
    }).then((res) => res.json());

export const editProfile = (userId, edited) =>
    fetch(`${apiURL}/users/${userId}`, {
        method: 'put',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(edited),
    }).then((res) => res.json());

export const savePostToSavedList = (userId, postId) =>
    fetch(`${apiURL}/users/saved/${userId}/save/${postId}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    }).then((res) => res.json());

export const updateUnfollowAct = (userId, unfollowedUserId) =>
    fetch(`${apiURL}/users/${userId}/unfollow/${unfollowedUserId}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    }).then((res) => res.json());

export const unsavePostSavedList = (userId, postId) =>
    fetch(`${apiURL}/users/saved/${userId}/unsave/${postId}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    }).then((res) => res.json());

export const updateFollowAct = (userId, followedUserId) =>
    fetch(`${apiURL}/users/${userId}/follow/${followedUserId}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    }).then((res) => res.json());

export const profileUpload = (Image) =>
    fetch(`${apiURL}/users/uploadFile`, {
        method: 'post',
        body: Image,
    }).then((res) => res.json());

export const profileUpdate = (Image) =>
    fetch(`${apiURL}/users/updateProfilePicture`, {
        method: 'post',
        body: Image,
    }).then((res) => res.json());

// ==========================================================================================
// Post functions
// ==========================================================================================
export const getAllPosts = () =>
    fetch(`${apiURL}/posts`, { headers }).then((res) => res.json());

export const getPostByUser = (userId) =>
    fetch(`${apiURL}/posts/user/${userId}`, { headers }).then((res) =>
        res.json()
    );

export const getPostByGroup = (groupId) =>
    fetch(`${apiURL}/posts/group/${groupId}`, { headers }).then((res) =>
        res.json()
    );

export const getPostByTeam = (teamId) =>
    fetch(`${apiURL}/posts/team/${teamId}`, { headers }).then((res) =>
        res.json()
    );

export const getPostsByTypeAndDate = (teamId, category, range) =>
    fetch(`${apiURL}/posts/team/${teamId}/${category}/${range}`, {
        headers,
    }).then((res) => res.json());

export const getPendingTeamPostByDateRange = (teamId, range) =>
    fetch(`${apiURL}/posts/team/pending/${teamId}/${range}`, { headers }).then(
        (res) => res.json()
    );

export const getPendingPostByTeam = (teamId) =>
    fetch(`${apiURL}/posts/team/pending/${teamId}`, { headers }).then((res) =>
        res.json()
    );

export const getInitialFeedPosts = (userId) =>
    fetch(`${apiURL}/posts/feed/${userId}`, { headers }).then((res) =>
        res.json()
    );

export const getInitialSubQuestions = (userId) =>
    fetch(`${apiURL}/posts/questions/${userId}`, { headers }).then((res) =>
        res.json()
    );

export const getInitialTrendingQuestions = (userId) =>
    fetch(`${apiURL}/posts/questions/trending/${userId}`, { headers }).then(
        (res) => res.json()
    );

export const getInitialCurrUserPosts = (userId) =>
    fetch(`${apiURL}/posts/profile/${userId}`, { headers }).then((res) =>
        res.json()
    );

export const getInitialCurrUserQuestions = (userId) =>
    fetch(`${apiURL}/posts/questions/own/${userId}`, { headers }).then((res) =>
        res.json()
    );

export const getInitialSavedPosts = (userId) =>
    fetch(`${apiURL}/posts/saved/${userId}`, { headers }).then((res) =>
        res.json()
    );

export const getSubscribedQuestions = (userId) =>
    fetch(`${apiURL}/posts/questions/subscribed/${userId}`, { headers }).then(
        (res) => res.json()
    );

export const getPost = (postId) =>
    fetch(`${apiURL}/posts/${postId}`, { headers }).then((res) => res.json());

export const getPostListByObjId = (
    currTrackerId,
    currPostsLen,
    lastPostsIndex
) =>
    fetch(`${apiURL}/posts/list`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currTrackerId, currPostsLen, lastPostsIndex }),
    }).then((res) => res.json());

export const getPostAsset = (postId) =>
    fetch(`${apiURL}/posts/${postId}/asset`, { headers }).then((res) =>
        res.json()
    );

export const createPost = (newPost) =>
    fetch(`${apiURL}/posts`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newPost),
    }).then((res) => res.json());

export const createComment = (postId, comment, userId) =>
    fetch(`${apiURL}/posts/${postId}/createComment`, {
        method: 'put',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment, userId }),
    }).then((res) => res.json());

export const updateComment = (postId, comment) =>
    fetch(`${apiURL}/posts/${postId}/updateComment`, {
        method: 'put',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ comment }),
    }).then((res) => res.json());

export const updatePostStatus = (postId, status) =>
    fetch(`${apiURL}/posts/${postId}/updatePostStatus`, {
        method: 'put',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
    }).then((res) => res.json());

export const updatePostsStatus = (posts, status) =>
    fetch(`${apiURL}/posts/updatePostsStatus`, {
        method: 'put',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ posts, status }),
    }).then((res) => res.json());

export const acceptTopAnswer = (postId, commentId, answerOwner) =>
    fetch(`${apiURL}/posts/${commentId}/acceptTopAnswer`, {
        method: 'put',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postId, answerOwner }),
    }).then((res) => res.json());

export const editPost = (postId, edited) =>
    fetch(`${apiURL}/posts/${postId}`, {
        method: 'put',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(edited),
    }).then((res) => res.json());

export const deletePost = (postId) =>
    fetch(`${apiURL}/posts/${postId}`, {
        method: 'delete',
        headers: {
            ...headers,
        },
    }).then((res) => res.json());

export const changeKudos = (postId, kudos) =>
    fetch(`${apiURL}/posts/${postId}/kudos`, {
        method: 'put',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ kudos }),
    }).then((res) => res.json());

export const uploadPostMediaTemp = (Image) =>
    fetch(`${apiURL}/posts/uploadMediaToTemp`, {
        method: 'post',
        body: Image,
    }).then((res) => res.json());

export const uploadPostMediaMain = (Image) =>
    fetch(`${apiURL}/posts/uploadMediaToPosts`, {
        method: 'post',
        body: Image,
    }).then((res) => res.json());

// ==========================================================================================
// Tracker (posts & questions) functions
// ==========================================================================================
export const deleteTracker = (trackerId) =>
    fetch(`${apiURL}/tracker/${trackerId}`, {
        method: 'delete',
        headers: {
            ...headers,
        },
    }).then((res) => res.json());

// ==========================================================================================
// Questions functions
// ==========================================================================================
export const getAllQuestions = () =>
    fetch(`${apiURL}/posts/questions`, { headers }).then((res) => res.json());

// ==========================================================================================
// Group functions
// ==========================================================================================
export const createGroup = (newGroup) =>
    fetch(`${apiURL}/groups`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newGroup),
    }).then((res) => res.json());

export const getAllGroups = () =>
    fetch(`${apiURL}/groups`, { headers }).then((res) => res.json());

export const getGroup = (groupId) =>
    fetch(`${apiURL}/groups/${groupId}`, { headers }).then((res) => res.json());

export const editGroup = (groupId, edited) =>
    fetch(`${apiURL}/groups/${groupId}`, {
        method: 'put',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(edited),
    }).then((res) => res.json());

export const deleteGroup = (groupId) =>
    fetch(`${apiURL}/groups/${groupId}`, {
        method: 'delete',
        headers: {
            ...headers,
        },
    }).then((res) => res.json());

export const deletePostsByGroup = (groupId) =>
    fetch(`${apiURL}/posts/group/${groupId}`, {
        method: 'delete',
        headers: {
            ...headers,
        },
    }).then((res) => res.json());

// ==========================================================================================
// Event functions
// ==========================================================================================

export const createEvent = (newEvent) =>
    fetch(`${apiURL}/events`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(newEvent),
    }).then((res) => res.json());

export const getAllEvents = () =>
    fetch(`${apiURL}/events`, { headers }).then((res) => res.json());

export const getAllEventsPosts = (eventId) =>
    fetch(`${apiURL}/posts/${eventId}/events`, { headers }).then((res) =>
        res.json()
    );

export const getEvent = (eventId) =>
    fetch(`${apiURL}/events/${eventId}`, { headers }).then((res) => res.json());

export const getEventsByGroup = (groupId) =>
    fetch(`${apiURL}/events/${groupId}/group`, { headers }).then((res) =>
        res.json()
    );

export const editEventResponse = (eventId, edited) =>
    fetch(`${apiURL}/events/${eventId}`, {
        method: 'put',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(edited),
    }).then((res) => res.json());

export const editEvent = (eventId, edited) =>
    fetch(`${apiURL}/events/editEvent/${eventId}`, {
        method: 'put',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(edited),
    }).then((res) => res.json());

export const deleteEvent = (eventId) =>
    fetch(`${apiURL}/events/${eventId}`, {
        method: 'delete',
        headers: {
            ...headers,
        },
    }).then((res) => res.json());

export const deletePostsByEvent = (eventId) =>
    fetch(`${apiURL}/posts/events/${eventId}`, {
        method: 'delete',
        headers: {
            ...headers,
        },
    }).then((res) => res.json());

// ==========================================================================================
// Trending functions
// ==========================================================================================
export const updateQuestionExpScore = (questionId, userId, expr) =>
    fetch(`${apiURL}/trending/question/expression/${expr}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ questionId, userId }),
    }).then((res) => res.json());

export const updateKudosScore = (userId, sectionType, itemId) =>
    fetch(`${apiURL}/trending/kudos`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, sectionType, itemId }),
    }).then((res) => res.json());

export const getTrendingPosts = () =>
    fetch(`${apiURL}/trending/posts`).then((res) => res.json());

export const getTrendingTeams = () =>
    fetch(`${apiURL}/trending/teams`).then((res) => res.json());

export const getTrendingGroups = () =>
    fetch(`${apiURL}/trending/groups`).then((res) => res.json());

export const getTrendingEvents = () =>
    fetch(`${apiURL}/trending/events`).then((res) => res.json());

export const getTrendingQuestions = () =>
    fetch(`${apiURL}/trending/questions`).then((res) => res.json());

export const getTrendingUsers = () =>
    fetch(`${apiURL}/trending/users`).then((res) => res.json());

// ==========================================================================================
// Search functions
// ==========================================================================================

export const searchUsers = (userQuery) =>
    fetch(`${apiURL}/search/users`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userQuery),
    }).then((res) => res.json());

export const searchTeamUsers = (query, users) =>
    fetch(`${apiURL}/search/users/team`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, users }),
    }).then((res) => res.json());

export const searchPosts = (postQuery) =>
    fetch(`${apiURL}/search/posts`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postQuery),
    }).then((res) => res.json());

export const searchTeamPosts = (postQuery, teamId, posts) =>
    fetch(`${apiURL}/search/posts/team/${teamId}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: postQuery, posts }),
    }).then((res) => res.json());

export const searchPendingTeamPostsWithDateRange = (postQuery, teamId, range) =>
    fetch(`${apiURL}/search/pending/posts/${teamId}/${range}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: postQuery }),
    }).then((res) => res.json());

export const searchGroups = (groupQuery) =>
    fetch(`${apiURL}/search/groups`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupQuery),
    }).then((res) => res.json());

export const searchTeams = (teamQuery) =>
    fetch(`${apiURL}/search/teams`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamQuery),
    }).then((res) => res.json());

export const searchEvents = (eventQuery) =>
    fetch(`${apiURL}/search/events`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventQuery),
    }).then((res) => res.json());

// ==========================================================================================
// Phases functions
// ==========================================================================================

export const getphases = () =>
    fetch(`${apiURL}/phase/phases`, {
        method: 'get',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    }).then((res) => res.json());

// ==========================================================================================
// Programs functions
// ==========================================================================================

export const saveProgram = (programsdata) =>
    fetch(`${apiURL}/coach-program/program-save`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(programsdata),
    }).then((res) => res.json());

export const checkTitle = (programsdata) =>
    fetch(`${apiURL}/coach-program/check-title`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: programsdata }),
    }).then((res) => res.json());
// ==========================================================================================
// Activity  functions
// ==========================================================================================

export const getActivity = () =>
    fetch(`${apiURL}/activity/activities`, {
        method: 'get',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    }).then((res) => res.json());

export const getActivityByTitle = (title) =>
    fetch(`${apiURL}/activity/${title}`).then((res) => res.json());

export const getServerUrl = () => {
    return { apiURL };
};
// ==========================================================================================
// Component  functions
// ==========================================================================================
export const getComponents = () =>
    fetch(`${apiURL}/components/components`, {
        method: 'get',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    }).then((res) => res.json());

// ==========================================================================================
// Exercises  functions
// ==========================================================================================

export const AddExercise = (exercisedata) =>
    fetch(`${apiURL}/exercise/exercise-save`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(exercisedata),
    }).then((res) => res.json());

export const validateTitle = (title) =>
    fetch(`${apiURL}/exercise/validate-title`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title }),
    }).then((res) => res.json());

export const ImageUpload = (Image) =>
    fetch(`${apiURL}/exercise/ex-image-upload`, {
        method: 'post',
        body: Image,
    }).then((res) => res.json());

export const ImageUploadtwo = (Image) =>
    fetch(`${apiURL}/exercise/ex-image-upload-1`, {
        method: 'post',
        body: Image,
    }).then((res) => res.json());

export const ImageUploadthree = (Image) =>
    fetch(`${apiURL}/exercise/ex-image-upload-2`, {
        method: 'post',
        body: Image,
    }).then((res) => res.json());

// ==========================================================================================
// Streght body  functions
// ==========================================================================================

export const getbodystrength = () =>
    fetch(`${apiURL}/bodystrength/bodystrength`, {
        method: 'get',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    }).then((res) => res.json());

export const searchExercise = (exercisedata) =>
    fetch(`${apiURL}/exercise/search-exercise`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(exercisedata),
    }).then((res) => res.json());
// ==========================================================================================
// Streght body  functions
// ==========================================================================================

export const getunitA = () =>
    fetch(`${apiURL}/unit/unita`, {
        method: 'get',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    }).then((res) => res.json());

export const getUnitB = (unitaId) =>
    fetch(`${apiURL}/unit/unitb`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unita_id: unitaId }),
    }).then((res) => res.json());

export const getRpe = () =>
    fetch(`${apiURL}/rpe/all-rpe`, {
        method: 'get',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    }).then((res) => res.json());

export const getLoad = (rpeId) =>
    fetch(`${apiURL}/rpe/load`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: rpeId }),
    }).then((res) => res.json());

export const saveSSession = (ssdata) =>
    fetch(`${apiURL}/strength-session/save-strength-session`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ssdata),
    }).then((res) => res.json());

export const getExerciseById = (exdata) =>
    fetch(`${apiURL}/exercise/exercisebyid`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: exdata }),
    }).then((res) => res.json());

export const updateExercise = (exercisedata) =>
    fetch(`${apiURL}/exercise/update-exercise`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(exercisedata),
    }).then((res) => res.json());

export const getProgramById = (programData) =>
    fetch(`${apiURL}/coach-program/getprogram`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: programData }),
    }).then((res) => res.json());

export const getGroupBySlug = (groupSlug) =>
    fetch(`${apiURL}/groups/slug/${groupSlug}`, { headers }).then((res) =>
        res.json()
    );

export const getGroupAdmin = (groupSlug) =>
    fetch(`${apiURL}/groups/getAdminBySlug`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupSlug }),
    }).then((res) => res.json());

export const getGroupMembers = (groupId) =>
    fetch(`${apiURL}/groups/getMembers`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId }),
    }).then((res) => res.json());

export const updateGroupStatus = (group) =>
    fetch(`${apiURL}/groups/updateStatus`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(group),
    }).then((res) => res.json());

export const updateGroupLogoCoverPhoto = (groupMedia) =>
    fetch(`${apiURL}/groups/updateLogoCoverPhoto`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupMedia),
    }).then((res) => res.json());

export const updateGroupDescription = (group) =>
    fetch(`${apiURL}/groups/updateDescription`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(group),
    }).then((res) => res.json());

export const groupMemberAccept = (userId, groupId) =>
    fetch(`${apiURL}/groups/acceptMember`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, groupId }),
    }).then((res) => res.json());

export const groupMemberReject = (userId, groupId) =>
    fetch(`${apiURL}/groups/rejectMember`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, groupId }),
    }).then((res) => res.json());

export const groupMemberRemove = (userId, groupId) =>
    fetch(`${apiURL}/groups/removeMember`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, groupId }),
    }).then((res) => res.json());

export const groupEventUpload = (Image) =>
    fetch(`${apiURL}/groups/uploadEventFile`, {
        method: 'post',
        body: Image,
    }).then((res) => res.json());

export const groupEventAdd = (groupEvent) =>
    fetch(`${apiURL}/groups/addEvent`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupEvent),
    }).then((res) => res.json());

export const groupEventRemove = (eventId, groupId, status) =>
    fetch(`${apiURL}/groups/removeEvent`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId, groupId, status }),
    }).then((res) => res.json());

export const getGroupEvents = (groupId) =>
    fetch(`${apiURL}/groups/getEvents`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId }),
    }).then((res) => res.json());

export const updateGroupEventLogo = (eventMedia) =>
    fetch(`${apiURL}/groups/updateEventLogo`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventMedia),
    }).then((res) => res.json());

export const getPlannerBySlug = (plannerSlug, clubSlug, userId) =>
    fetch(`${apiURL}/planners/slug/${plannerSlug}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clubSlug, userId }),
    }).then((res) => res.json());

export const getPlannerDetails = (plannerId, clubId) =>
    fetch(`${apiURL}/planners/${clubId}/${plannerId}`, {
        method: 'get',
    }).then((res) => res.json());

export const getProgramSess = (programData) =>
    fetch(`${apiURL}/coach-program/program-sessions`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(programData),
    }).then((res) => res.json());

export const updateProgramSession = (programData) =>
    fetch(`${apiURL}/coach-program/update-programsessions`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(programData),
    }).then((res) => res.json());

export const updatePlannerProgramSessions = (programData) =>
    fetch(`${apiURL}/programs/update_sessions`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(programData),
    }).then((res) => res.json());

export const getPrograms = () =>
    fetch(`${apiURL}/coach-program/programs`, {
        method: 'get',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    }).then((res) => res.json());

export const getProgramSessions = (programId) =>
    fetch(`${apiURL}/programs/sessions/${programId}`, {
        method: 'get',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
    }).then((res) => res.json());

export const getSessionById = (sessionData) =>
    fetch(`${apiURL}/strength-session/getbyid`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
    }).then((res) => res.json());

export const getSessionFormData = () =>
    fetch(`${apiURL}/strength-session/form-data`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    }).then((res) => res.json());

export const updateSSession = (ssdata) =>
    fetch(`${apiURL}/strength-session/update-session`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ssdata),
    }).then((res) => res.json());

export const searchProgram = (programData) =>
    fetch(`${apiURL}/coach-program/search-program`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(programData),
    }).then((res) => res.json());

export const searchSession = (sessionData) =>
    fetch(`${apiURL}/strength-session/search-session`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
    }).then((res) => res.json());

//Budgerigar
export const getSessionIcons = () =>
    fetch(`${apiURL}/search/getSessionIcons`, {
        method: 'get',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    }).then((res) => res.json());

export const searchNormalSession = (sessionData) =>
    fetch(`${apiURL}/strength-session/search-simple-session`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ search_title: sessionData }),
    }).then((res) => res.json());

export const searcStrengthSession = (sessionData) =>
    fetch(`${apiURL}/strength-session/search-simple-strenght-session`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ search_title: sessionData }),
    }).then((res) => res.json());

export const searchAdvanceStrengthSession = (sessionData) =>
    fetch(`${apiURL}/strength-session/search-advance-strenght-session`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
    }).then((res) => res.json());

export const getsessionActivity = () =>
    fetch(`${apiURL}/activity/session-activities`, {
        method: 'get',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(),
    }).then((res) => res.json());

export const removeSessionById = (sessionData) =>
    fetch(`${apiURL}/strength-session/remove-session`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
    }).then((res) => res.json());

export const getStrengthSessionById = (ssdata) =>
    fetch(`${apiURL}/strength-session/get-session`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ _id: ssdata }),
    }).then((res) => res.json());

export const sessionImageUpload = (Image) =>
    fetch(`${apiURL}/sessions/uploadImage`, {
        method: 'post',
        body: Image,
    }).then((res) => res.json());

export const updateProgram = (programData) =>
    fetch(`${apiURL}/coach-program/update-program`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(programData),
    }).then((res) => res.json());

export const getSessionDescriptionById = (ssdata) =>
    fetch(`${apiURL}/strength-session/description`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ sessionId: ssdata }),
    }).then((res) => res.json());

export const getStrengthSessInfo = (ssdata) =>
    fetch(`${apiURL}/strength-session/strength-sess-info`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ssdata),
    }).then((res) => res.json());

export const saveStrengthSessInfo = (programId, sessionId, exarr) =>
    fetch(`${apiURL}/strength-session/save-strength-sess-info`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ programId, sessionId, exarr }),
    }).then((res) => res.json());

export const getStrengthSessInfoAthlete = (ssdata) =>
    fetch(`${apiURL}/strength-session/strength-sess-info-athlete`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ssdata),
    }).then((res) => res.json());

export const saveStrengthSessInfoAthlete = (
    programId,
    sessionId,
    exarr,
    clubId,
    plannerId,
    athleteId
) =>
    fetch(`${apiURL}/strength-session/save-strength-sess-info-athlete`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            programId,
            sessionId,
            exarr,
            clubId,
            plannerId,
            athleteId,
        }),
    }).then((res) => res.json());

export const getProgramSessionBySessionId = (ssdata) =>
    fetch(`${apiURL}/coach-program/session-time`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(ssdata),
    }).then((res) => res.json());

export const plannerAddProgram = (plannerId, programData) =>
    fetch(`${apiURL}/planners/add-program/${plannerId}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(programData),
    }).then((res) => res.json());

export const plannerUpdateProgram = (plannerId, programData) =>
    fetch(`${apiURL}/planners/update-program/${plannerId}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(programData),
    }).then((res) => res.json());

export const getProgramsGraphDetail = (plannerId, graphType, startWeek) =>
    fetch(`${apiURL}/planners/programs-graph-detail/${plannerId}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ graphType, startWeek }),
    }).then((res) => res.json());

export const duplicateProgram = (programId, plannerId, title, userId) =>
    fetch(`${apiURL}/planners/duplicate-program/${plannerId}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ programId, title, userId }),
    }).then((res) => res.json());

export const removeProgram = (programId, plannerId) =>
    fetch(`${apiURL}/planners/remove-program/${plannerId}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ programId }),
    }).then((res) => res.json());

export const getAthletePlanner = (clubSlug, userId, layerNo) =>
    fetch(`${apiURL}/teams/getPlanner/${userId}/${clubSlug}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ layerNo }),
    }).then((res) => res.json());

export const getPlannerLayer = (plannerId, layerNo) =>
    fetch(`${apiURL}/planners/layer-programs/${plannerId}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ layerNo }),
    }).then((res) => res.json());

export const teamUpload = (Image) =>
    fetch(`${apiURL}/teams/uploadFile`, {
        method: 'post',
        body: Image,
    }).then((res) => res.json());

export const teamAdd = (team) =>
    fetch(`${apiURL}/teams/add`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(team),
    }).then((res) => res.json());

export const teamAddMember = (teamId, userId, teamType, screen='teams') =>
    fetch(`${apiURL}/teams/addMember`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId, userId, teamType, screen }),
    }).then((res) => res.json());

export const memberRemoveTeam = (teamId, userId, screen='teams') =>
    fetch(`${apiURL}/teams/memberRemoveTeam`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId, userId, screen }),
    }).then((res) => res.json());

export const teamRemoveRequest = (teamId, userId, screen='teams') =>
    fetch(`${apiURL}/teams/removeRequest`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId, userId, screen }),
    }).then((res) => res.json());

export const loadUserTeams = (userId) =>
    fetch(`${apiURL}/teams/getUserTeams`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    }).then((res) => res.json());

export const getTeams = (userId) =>
    fetch(`${apiURL}/teams/getTeams`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    }).then((res) => res.json());

export const getTeamAdmin = (teamSlug) =>
    fetch(`${apiURL}/teams/getAdminBySlug`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamSlug }),
    }).then((res) => res.json());

export const getTeamMembers = (teamId) =>
    fetch(`${apiURL}/teams/getMembers`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId }),
    }).then((res) => res.json());

export const getTeamCoaches = (teamId) =>
    fetch(`${apiURL}/teams/getCoaches`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId }),
    }).then((res) => res.json());

export const searchTeamCoaches = (query) =>
    fetch(`${apiURL}/teams/searchCoaches`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
    }).then((res) => res.json());

export const teamAddCoach = (teamId, coachId) =>
    fetch(`${apiURL}/teams/addCoach`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId, coachId }),
    }).then((res) => res.json());

export const updateTeamStatus = (team) =>
    fetch(`${apiURL}/teams/updateStatus`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(team),
    }).then((res) => res.json());

export const updateTeamLogoCoverPhoto = (teamMedia) =>
    fetch(`${apiURL}/teams/updateLogoCoverPhoto`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamMedia),
    }).then((res) => res.json());

export const updateTeamDescription = (team) =>
    fetch(`${apiURL}/teams/updateDescription`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(team),
    }).then((res) => res.json());

export const updateTeamPageInfo = (teamSlug, information) =>
    fetch(`${apiURL}/teams/edit/pageInfo/${teamSlug}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ information }),
    }).then((res) => res.json());

export const updateTeamPostManagement = (
    teamSlug,
    postRestriction,
    postReqApproval
) =>
    fetch(`${apiURL}/teams/postManagement/${teamSlug}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ postRestriction, postReqApproval }),
    }).then((res) => res.json());

export const updatePageMembersStatus = (
    teamSlug,
    checkedUsersId,
    status
) =>
    fetch(`${apiURL}/teams/updatePageMembersStatus/${teamSlug}`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ checkedUsersId, status }),
    }).then((res) => res.json());

export const updatePageMembersRole = (
        teamSlug,
        usersId,
        roles
    ) =>
        fetch(`${apiURL}/teams/updatePageMembersRole/${teamSlug}`, {
            method: 'post',
            headers: {
                ...headers,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usersId, roles }),
        }).then((res) => res.json());

export const eventUpload = (Image) =>
    fetch(`${apiURL}/teams/uploadEventFile`, {
        method: 'post',
        body: Image,
    }).then((res) => res.json());

export const teamEventAdd = (teamEvent) =>
    fetch(`${apiURL}/teams/addEvent`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(teamEvent),
    }).then((res) => res.json());

export const getTeamEventBySlug = (teamEventSlug) =>
    fetch(`${apiURL}/teams/getEventBySlug`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamEventSlug }),
    }).then((res) => res.json());

export const getTeamEvents = (teamId) =>
    fetch(`${apiURL}/teams/getEvents`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId }),
    }).then((res) => res.json());

export const teamMemberAccept = (userId, teamId) =>
    fetch(`${apiURL}/teams/acceptMember`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, teamId }),
    }).then((res) => res.json());

export const teamMemberReject = (userId, teamId) =>
    fetch(`${apiURL}/teams/rejectMember`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, teamId }),
    }).then((res) => res.json());

export const teamEventRemove = (eventId, teamId, status) =>
    fetch(`${apiURL}/teams/removeEvent`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventId, teamId, status }),
    }).then((res) => res.json());

export const teamMemberRemove = (userId, teamId) =>
    fetch(`${apiURL}/teams/removeMember`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, teamId }),
    }).then((res) => res.json());

export const getAllTeams = () =>
    fetch(`${apiURL}/teams`, { headers }).then((res) => res.json());

export const getTeam = (teamSlug) =>
    fetch(`${apiURL}/teams/getBySlug`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamSlug }),
    }).then((res) => res.json());

export const loadUserGroups = (userId) =>
    fetch(`${apiURL}/groups/getUserGroups`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    }).then((res) => res.json());

export const getGroups = (userId) =>
    fetch(`${apiURL}/groups/getGroups`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
    }).then((res) => res.json());

export const groupUpload = (Image) =>
    fetch(`${apiURL}/groups/uploadFile`, {
        method: 'post',
        body: Image,
    }).then((res) => res.json());

export const groupAdd = (group) =>
    fetch(`${apiURL}/groups/add`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(group),
    }).then((res) => res.json());

export const groupAddMember = (groupId, userId, groupType, screen='groups') =>
    fetch(`${apiURL}/groups/addMember`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId, userId, groupType, screen }),
    }).then((res) => res.json());

export const memberRemoveGroup = (groupId, userId, screen='groups') =>
    fetch(`${apiURL}/groups/memberRemoveGroup`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId, userId, screen }),
    }).then((res) => res.json());

export const groupRemoveRequest = (groupId, userId, screen='groups') =>
    fetch(`${apiURL}/groups/memberRemoveRequest`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ groupId, userId, screen }),
    }).then((res) => res.json());

export const membershipUpload = (Image) =>
    fetch(`${apiURL}/memberships/uploadMembershipFile`, {
        method: 'post',
        body: Image,
    }).then((res) => res.json());

export const teamMembershipAdd = (membership) =>
    fetch(`${apiURL}/memberships/addMembership`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(membership),
    }).then((res) => res.json());

export const loadTeamMemberships = (teamId, coaches, userID) =>
    fetch(`${apiURL}/memberships/getByTeam`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamId, coaches, userID }),
    }).then((res) => res.json());

export const getTeamMembership = (membershipId) =>
    fetch(`${apiURL}/memberships/get`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ membershipId }),
    }).then((res) => res.json());

export const teamMembershipUpdate = (membership, logo) =>
    fetch(`${apiURL}/memberships/updateMembership`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ membership, logo }),
    }).then((res) => res.json());

export const getMembershipLevels = (clubId) =>
    fetch(`${apiURL}/memberships/getMembershipLevels`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clubId }),
    }).then((res) => res.json());

export const getMembershipLevelPlanners = (clubId, membershipId, levelId) =>
    fetch(`${apiURL}/memberships/getMembershipLevelPlanners`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ clubId, membershipId, levelId }),
    }).then((res) => res.json());

export const membershipUpdateUpgradePaths = (membership) =>
    fetch(`${apiURL}/memberships/updateUpgradePaths`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ membership }),
    }).then((res) => res.json());

export const getUserTeamMemberships = (teamSlug, userId) =>
    fetch(`${apiURL}/memberships/getUserMemberships`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ teamSlug, userId }),
    }).then((res) => res.json());

export const saveUserMemberShipData = (membershipdata) =>
    fetch(`${apiURL}/membership-relations/add-user-membership`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(membershipdata),
    }).then((res) => res.json());
export const cancelUserMemberShipData = (membershipdata) =>
    fetch(`${apiURL}/membership-relations/cancel-user-membership`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(membershipdata),
    }).then((res) => res.json());

export const getSubScribeMemberships = (slug, userId) =>
    fetch(`${apiURL}/membership-relations/get-pending-memberships`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug, userId }),
    }).then((res) => res.json());
export const updateMembershipStatus = (membershipdata, action) =>
    fetch(`${apiURL}/membership-relations/update-memberships`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            membershipdata: membershipdata,
            action: action,
        }),
    }).then((res) => res.json());

export const memberShipsCron = (userId) =>
    fetch(`${apiURL}/membership-relations/memberships-check`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: userId }),
    }).then((res) => res.json());

export const renewMembership = (membership) =>
    fetch(`${apiURL}/membership-relations/memberships-renew`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ membership: membership }),
    }).then((res) => res.json());

export const getClubMembers = (slug) =>
    fetch(`${apiURL}/membership-relations/getClubMembers`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slug }),
    }).then((res) => res.json());

//link zy
export const linkFamilyName = (data) =>
    fetch(`${apiURL}/exercise/like-familyname`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: data }),
    }).then((res) => res.json());

//tags
export const linkTags = (data) =>
    fetch(`${apiURL}/exercise/like-tags`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ value: data }),
    }).then((res) => res.json());
//adds zy
export const sessionSave = (data) =>
    fetch(`${apiURL}/adds/session-add`, {
        method: 'post',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }).then((res) => res.json());
