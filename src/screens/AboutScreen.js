import React, { Component } from 'react';
import { View, Text, } from 'react-native';
import { Icon } from 'native-base';  


export default class AboutScreen extends Component {
    render() {
        return (
            <View>
                <Text>About</Text>
            </View>
        );
    }

    static navigationOptions = () => ({
        title: 'About',
        header: null,
        drawerIcon: ({ tintColor }) => (<Icon name='home' style={{ color: tintColor, fontSize: 24 }} />)
    });
}
