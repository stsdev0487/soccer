import {AppNavigator} from '../navigation/route';
import { NavigationActions, StackActions } from 'react-navigation';

let initialRouteName = __DEV__?'HomeDrawer':'HomeDrawer';

const initialState = AppNavigator.router.getStateForAction(StackActions.reset({
    index: 0,
    actions: [
        NavigationActions.navigate({
            routeName: initialRouteName,
        }),
    ],
}));

export default (state=initialState, action) => {
    return AppNavigator.router.getStateForAction(action, state);
};

// export default navReducer = createNavigationReducer(AppNavigator);