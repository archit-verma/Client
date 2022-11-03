const INITIAL_STATE = {
    email: '',
    password: '',
    user: {},
    error: '',
    loading: true,
    signupLoading: false,
    userSignedIn: false,
    token: '',
    incorrect: false,
    loadedXX: 0,
    redirect: '',
    redirectLogin:'',
    socialDetails :{

    }
};

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case 'email_changed':
            return { ...state, email: action.payload };
        case 'password_changed':
            return { ...state, password: action.payload };
        case 'login_user':
            return { ...state, loading: true, error: '' };
        case 'login_user_success':
            return {
                ...state,
                user: action.payload.user,
                token: action.payload.token,
                // redirect: action.payload.redirect,
                redirectLogin: action.payload.redirect,
                userSignedIn: true,
                loading: false,
                signupLoading: false,
            };
            case 'signup_user_success':
                return {
                    ...state,
                    user: action.payload.user,
                    token: action.payload.token,
                     redirect: action.payload.redirect,
                    userSignedIn: true,
                    loading: false,
                    signupLoading: false,
                };
        case 'login_user_fail':
            return {
                ...state,
                user: {},
                userSignedIn: false,
                incorrect: true,
                loading: false,
                signupLoading: false,
            };
        case 'loading_stop':
            return { ...state, loading: false };
        case 'logout':
            return { ...state };
        case 'signup_loading':
            return { ...state, signupLoading: true };
            case 'signup_loading_stop':
                return { ...state, signupLoading: false };
        case 'update_user':
            return {
                ...state,
                user: action.payload.user,
                redirect: action.payload.redirect,
                signupLoading: false,
            };
        case 'upload_progress':
            return { ...state, loadedXX: action.payload };
            case "sociallogin":
                return { ...state,
                    redirectLogin:  action.payload.redirect ,
                    socialDetails:action.payload.loginDetails
                };
        default:
            return state;
    }
};
