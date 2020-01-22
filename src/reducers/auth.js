const initialState = { 
    isAuthenticated: false,
    user: {
    },
    login: {
        username: 'bishal',
        password: 'bishal123'
    },
    token: '',
    refresh: ''
};

import * as actions from '../actions/authAction';

export default  (state=initialState, action) => {
    switch(action.type) {
    case actions.LOGIN:
        return { ...state, isAuthenticated: true };
    case actions.LOGOUT:
        return { ...initialState };
    case actions.LOGIN_CRED:
        return { ...state, login: action.cred };
    case actions.SET_USER:
        return { ...state, user: action.user || {} };
    case actions.SET_TOKEN:
        return { ...state, token: action.token || '' };
    case actions.SET_REFRESH:
    return { ...state, token: action.refresh || '' };
    default: 
        return state;
    }
};
