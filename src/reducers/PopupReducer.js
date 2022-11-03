const INITIAL_STATE = {
	visible: false,
	button: '',
	message: '',
	redirect: '',
};

export default (state = INITIAL_STATE, action) => {
	switch(action.type){
		case 'show_popup':
			return {...state, visible: true, button: action.payload.button, message: action.payload.message, redirect: action.payload.redirect};
		case 'close_popup':
			return {...state, visible: false, button: '', message: '', redirect: ''};
		default:
			return state;
	}
}