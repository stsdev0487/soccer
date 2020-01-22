import React, { Component } from 'react';
import { AppState, ToastAndroid, } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { NavigationActions } from 'react-navigation';
import { Root } from 'native-base';
import { AppNavigator, } from './route';

class AppWithNavigationState extends Component {

    state = {
        appState: AppState.currentState
    }
    lastTime = 0

    constructor(props) {
        super(props);
    }

      componentDidMount() {
        // BackHandler.addEventListener("hardwareBackPress", this.onBackPress);
        // AppState.addEventListener('change', this._handleAppStateChange);
      }

      componentWillUnmount() {
        // BackHandler.removeEventListener("hardwareBackPress", this.onBackPress);
        // AppState.removeEventListener('change', this._handleAppStateChange);
      }

      onBackPress = () => {
        const { dispatch, nav } = this.props;

        if (nav.index === 0) {
          const currentTime = Date.now();
          if (currentTime - this.lastTime < 700) {
            return false;
          } else {
            this.lastTime = currentTime;
            ToastAndroid.show(
              'Press again to exit',
              ToastAndroid.SHORT
            );
            return true;
          }
        }
        dispatch(NavigationActions.back());
        return true;
      };

    render() {
        return (
            <Root>
                {/* Root for support for native base toast */}
                <AppNavigator />
            </Root>

        )
    }
}

AppWithNavigationState.propTypes = {
    dispatch: PropTypes.func.isRequired,
    //   nav: PropTypes.object.isRequired,
};


const mapStateToProps = state => ({
    // nav: state.nav,
    auth: state.auth,
});

export default connect(mapStateToProps)(AppWithNavigationState);
