import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
// import nav from './nav';
import auth from './auth';

const appReducer = combineReducers({
    form: formReducer,
    auth,
    // nav

});

// Setup root reducer
const rootReducer = (state, action) => {
    const newState = (action.type === 'RESET') ? undefined : state;
    return appReducer(newState, action);
};

export default rootReducer;
