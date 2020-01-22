import { NavigationActions } from 'react-navigation';
import type { NavigationParams, NavigationRoute } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
    _navigator = navigatorRef;
}

function reset(routeName: string, params?: NavigationParams) {
    _navigator.dispatch(
        NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({
                    type: 'Navigation/NAVIGATE',
                    routeName,
                    params,
                }),
            ],
        }),
    );
}

function navigate(routeName, params) {
    _navigator.dispatch(
        NavigationActions.navigate({
            type: 'Navigation/NAVIGATE',
            routeName,
            params,
        }),
    );
}

function navigateDeep(actions: { routeName: string, params?: NavigationParams }[]) {
    _navigator.dispatch(
        actions.reduceRight(
            (prevAction, action): any =>
                NavigationActions.navigate({
                    type: 'Navigation/NAVIGATE',
                    routeName: action.routeName,
                    params: action.params,
                    action: prevAction,
                }),
            undefined,
        ),
    );
}

function getCurrentRoute(): NavigationRoute | null {
    if (!_navigator || !_navigator.state.nav) {
        return null;
    }
    return _navigator.state.nav.routes[_navigator.state.nav.index] || null;
}

function getNavState() {
    if (!_navigator || !_navigator.state.nav) {
        return null;
    }
    return _navigator.state.nav || null;
}


export default {
    setTopLevelNavigator,
    navigateDeep,
    navigate,
    reset,
    getCurrentRoute,
    getNavState
};
