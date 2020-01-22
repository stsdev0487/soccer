import {
    createReactNavigationReduxMiddleware
} from 'react-navigation-redux-helpers';

const navMiddleware = createReactNavigationReduxMiddleware(
    'root',
    state => state.nav,
);

export {
    navMiddleware,
};
