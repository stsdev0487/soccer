import React, { Component } from 'react';
import { Provider } from 'react-redux';
import AppWithNavigationState from './navigation';
import { MenuProvider } from 'react-native-popup-menu';
import store from './utils/store';
import codePush from "react-native-code-push";

const codePushConfig = {
    installMode: codePush.InstallMode.IMMEDIATE
}

class AppContainer extends Component {
    componentDidMount() {
        codePush.sync(codePushConfig);
    }

    render() {
        return (
            <Provider store={store}>
                <MenuProvider>
                    <AppWithNavigationState />
                </MenuProvider>
            </Provider>
        );
    }
}

export default codePush(codePushConfig)(AppContainer);
