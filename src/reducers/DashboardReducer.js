const INITIAL_STATE = {
	screenId: 0,
	coachInfo: '',
	groupInfo: '',
	activities: '',
	sessionActivityTypes: '',
	sessionStatistics: '',
	statisticsOptions: {statisticsType: 'session', timeInterval: 'year', activityType: 'all'}
};

export default (state = INITIAL_STATE, action) => {
	switch(action.type){
		case 'login_user_success':
			return {...state, coachInfo: action.payload.coach_info};
		case 'dashboard_info':
			return {...state, groupInfo: action.payload.group_info, activities: action.payload.activities, sessionActivityTypes: action.payload.activity_types, sessionStatistics: action.payload.session_statistics, screenId: action.payload.screen_id};
		case 'change_statistics':
			return {...state, sessionStatistics: action.payload.session_statistics, statisticsOptions: action.payload.statistics_options};
		case 'logout':
			return {...state, INITIAL_STATE};
		default:
			return state;
	}
}