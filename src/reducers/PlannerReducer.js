const INITIAL_STATE = {
	clubId: 0,
	modals: { addPlanner: false, addProgram: false, addExercise: false, addSession: false, editPlanner: false, editExercise: false, viewExercise: false, sessionDesc: false, viewSessions: false, loadPrgrams: false, editSessionTime:false, showStrengthSession: false, plannerAssignment: false, prepareAddSession: false },
	modalsParams: { id: null, id1: null, par1: null, par2: null, par3: null },
	updateSeachExercise: { parms: false },
	sesstimeData:  false,
	selectedPopulteSession:false,
	rightProgramId: false,
	updateSeachProgram: false,
	updateSeachSession: false,
	sessionDescription: '',
	planner: { programs: [{ program: { ID: 1, title: 'Test' } }], planner_bar: {}, today_sessions: {}, layer_sessions: {}, sessions: {}, recovery_days: {} },
	plannerOptions: { plannerOption: false, layer: 1, selectedProgram: '', selectedProgramText: 'All Programs', plannerBarView: 'planner', plannerGraphView: 'time', tab: 'overview' },
	planners: [],
	sessions: [],
	familyNames: [],
	sessionActivityTypes: [],
	sessionSportsKeywords: [],
	sessionComponents: [],
	session: '',
	daySessions: { selDay: '', sessions: {} },
	graphData: '',
	sessionDetail: {},
	exerciseInfoId: {},
	exerciseInfo: {},
	exerciseId: '',
	exerciseMonth: '',
	error: '',
	loading: false,
	alertMessage: '',
	
};

export default (state = INITIAL_STATE, action) => {
	switch (action.type) {
		case 'loading':
			return { ...state, loading: true, error: '', alertMessage: '' };
		case 'loading_stop':
			return { ...state, loading: false, alertMessage: '' };
		case 'alert_close':
			return { ...state, alertMessage: '' };
		case 'load_planners':
			return { ...state, loading: false, alertMessage: '', planners: action.payload };
		case 'load_sessions':
			return { ...state, loading: false, alertMessage: '', sessions: action.payload };
		case 'load_add_session_data':
			return { ...state, loading: false, alertMessage: '', familyNames: action.payload.familyNames, sessionActivityTypes: action.payload.sessionActivityTypes, sessionSportsKeywords: action.payload.sessionSportsKeywords, sessionComponents: action.payload.sessionComponents, session: action.payload.session };
		case 'show_add_planner':
			return { ...state, modals: { ...state.modals, addPlanner: true }, modalsParams: { ...state.modalsParams, id: action.payload }, error: '', alertMessage: '' };
		case 'hide_add_planner':
			return { ...state, modals: { ...state.modals, addPlanner: false }, error: '', alertMessage: '' };
		case 'show_add_program':
			return { ...state, modals: { ...state.modals, addProgram: true }, error: '', alertMessage: '' };
		case 'hide_add_program':
			return { ...state, modals: { ...state.modals, addProgram: false }, error: '', alertMessage: '' };
		case 'show_add_exercise':
			return { ...state, modals: { ...state.modals, addExercise: true }, error: '', alertMessage: '' };
		case 'hide_add_exercise':
			return { ...state, modals: { ...state.modals, addExercise: false }, error: '', alertMessage: '' };
		case 'show_add_exercise':
			return { ...state, modals: { ...state.modals, addExercise: true }, error: '', alertMessage: '' };
		case 'load_programs':
			return { ...state, modals: { ...state.modals, loadPrgrams: true } };
		case 'hide_programs':
			return { ...state, modals: { ...state.modals, loadPrgrams: false } };
		case 'hide_add_session':
			return { ...state, modals: { ...state.modals, addSession: false }, error: '', alertMessage: '' };
		case 'add_failed':
			return { ...state, loading: false, error: action.payload, alertMessage: '' };
		case 'planner_added':
			if (action.payload.planners)
				return { ...state, loading: false, alertMessage: action.payload.msg, planners: action.payload.planners, error: '', modalsParams: { ...state.modalsParams, id: null } };
			else
				return { ...state, loading: false, alertMessage: action.payload.msg, error: '', modalsParams: { ...state.modalsParams, id: null } };
		case 'session_added':
			return { ...state, loading: false, alertMessage: action.payload, session: '', error: '', modalsParams: { ...state.modalsParams, id: null } };
		case 'show_edit_exercise':
			return { ...state, modalsParams: { id: action.payload }, modals: { ...state.modals, editExercise: true }, error: '', alertMessage: '' };
		case 'hide_edit_exercise':
			return { ...state, modals: { ...state.modals, editExercise: false }, error: '', alertMessage: '' };
		case 'show_edit_program':
			return { ...state, modalsParams: { id: action.payload }, modals: { ...state.modals, editProgram: true }, error: '', alertMessage: '' };
		case 'selected_program_id':
			return { ...state, rightProgramId: action.payload };
		case 'hide_edit_program':
			return { ...state, modals: { ...state.modals, editProgram: false }, error: '', alertMessage: '' };
		case 'update_ss_exercise_search':
			return { ...state, updateSeachExercise: { parms: action.payload } };
		case 'update_program_search':
			return { ...state, updateSeachProgram: action.payload };
		case 'update_session_search':
			return { ...state, updateSeachSession: action.payload };
		case 'view_exercise':
			return { ...state, modalsParams: { id: action.payload }, modals: { ...state.modals, viewExercise: true }, error: '', alertMessage: '' };
		case 'hide_view_exercise':
			return { ...state, modals: { ...state.modals, viewExercise: false }, error: '', alertMessage: '' };
		case 'show_session_desc':
			return { ...state, sessionDescription: action.payload, modals: { ...state.modals, sessionDesc: true } };
		case 'hide_session_desc':
			return { ...state, modals: { ...state.modals, sessionDesc: false }, sessionDescription: '' };
		case 'show_planner_assignment':
			return { ...state, modals: { ...state.modals, plannerAssignment: true } };
		case 'hide_planner_assignment':
			return { ...state, modals: { ...state.modals, plannerAssignment: false } };
		case 'view_sessions':
			return { ...state, modalsParams: { id: action.payload }, modals: { ...state.modals, viewSessions: true } };
		case 'hide_view_sessions':
			return { ...state, modals: { ...state.modals, viewSessions: false } };
		case 'show_add_session':
			return { ...state,  modals: { ...state.modals, addSession: true, viewSessions: false, prepareAddSession: false }, modalsParams: { ...state.modalsParams, id: action.payload }, error: '', alertMessage: '' };
		// hf handle state
		case 'prepare_add_session':
			return {
				...state, modals: { ...state.modals, prepareAddSession: true }, modalsParams: {
					...state.modalsParams, id: action.payload
				
				}, error: "", alertMessage: ''
			};
		// hf handle state
		case 'hide_prepare':
			return {
				...state, modals: {
					...state.modals,
					prepareAddSession: false
				},
				error: "",
				alertMessage: ''
			};
		case 'hide_add_session':
			return { ...state, modals: { ...state.modals, addSession: false }, error: '', alertMessage: '' };
		case 'edit_session_time':
			return { ...state, modalsParams: { id: action.payload.id, id1: action.payload.eventId, par1: action.payload.calendar, par2: action.payload.sessionTime, par3: action.payload.sessionURL }, modals: { ...state.modals, editSessionTime: true } };
		case 'hide_edit_session_time':
			return { ...state, modals: { ...state.modals, editSessionTime: false }, modalsParams: { ...state.modalsParams, id: null, id1: null, par1: null, par2: null, par3: null } };
		case 'show_strength_session':
			return { ...state, modalsParams: { id: action.payload }, modals: { ...state.modals, showStrengthSession: true } };
		case 'hide_strength_session':
			return { ...state, modals: { ...state.modals, showStrengthSession: false }};
		case 'set_sess_time_data':
			return { ...state, sesstimeData:  action.payload };
			case 'selected_session_populate':
			return { ...state, selectedPopulteSession:  action.payload };
		default:
			return state;
	}
}