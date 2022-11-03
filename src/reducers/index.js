import {combineReducers} from 'redux';
import AuthReducer from './AuthReducer';
import PlannerReducer from './PlannerReducer';
import DashboardReducer from './DashboardReducer';
import PopupReducer from './PopupReducer';
import PostReducer from './PostReducer';

export default combineReducers({
	auth: AuthReducer,
	planner:PlannerReducer,
	dashboard:DashboardReducer,
	popup:PopupReducer,
	post:PostReducer
});