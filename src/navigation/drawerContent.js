import React from 'react';
import { DrawerItems, SafeAreaView } from 'react-navigation';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Image } from 'react-native';
import { Icon } from 'native-base';
import * as authAction from '../actions/authAction';
import PropTypes from 'prop-types';
import { colors } from '../styles';
import { connect } from 'react-redux';
import store from '../utils/store';


const styles = StyleSheet.create({
    drawerNavStyle: {
        flex: 1,
        justifyContent: 'space-between'
    },
    drawerHeader: {
        flex: 1,
        backgroundColor: '#17629c',
        alignItems: 'center',
    },
    profileImage: {
        height: 70,
        width: 70,
        borderRadius: 35,
        marginTop: 33,
        marginBottom: 10
    },
    userText: {
        color: '#ffffff',
        marginBottom: 3
    },
    mText: {
        fontSize: 12,
        color: '#ffffff',
        marginBottom: 23
    },
    logout: {
        color: colors.darkWhite,
        margin: 15,
        fontWeight: 'bold',
    },
    viewContainer: {
        width: 24,
        margin: 16,
        alignItems: 'center',
        opacity: 0.62
    },
    iconStyle: { 
        color: colors.colorAccent, 
        fontSize: 24 },
    touchable: {
        flexGrow: 1,
        flexShrink: 1,
        flexDirection: 'row'
    },
    labelStyle: Platform.select({
        android: {
            fontFamily: 'roboto'
        }
    })
});

class DrawerContent extends React.Component {

    constructor(props) {
        super(props);
        this._onLogout = this._onLogout.bind(this);
    }

    async _onLogout() {
        this.props.onLogout();
        this.props.navigation.navigate('Login');
    }

    static filterItemsByRole(items, user) {

        let adminOnlyRoutes = ['Coaches', 'Clubs', 'AdminProfile'];
        let coachOnlyRoutes = ['CoachProfile'];

        if(!user.isStaff) { //for coach
            items = items.filter(item => !adminOnlyRoutes.includes(item.key));
        }
        if (!user.isCoach || user.isStaff) {
           items = items.filter(item => !coachOnlyRoutes.includes(item.key));
        }

        return items;
    }

    render() {
        const { isAuthenticated, user } = this.props;
        let items = DrawerContent.filterItemsByRole(this.props.items, user);

        const imageSrc = user.image ? { uri: user.image } : require('../assets/images/person.png');
        return (
            <SafeAreaView style={styles.drawerNavStyle} forceInset={{ top: 'never', horizontal: 'never' }}>
                <ScrollView>
                    <View style={styles.drawerHeader}>
                        <Image style={styles.profileImage} source={imageSrc} />
                        <Text style={styles.userText}>{user.firstName} {user.lastName}</Text>
                        <Text style={styles.mText}>{user.email}</Text>
                    </View>

                    <DrawerItems labelStyle={styles.labelStyle} {...this.props} items={items} />
                </ScrollView>
                {isAuthenticated &&
                    <View>
                        <TouchableOpacity style={styles.touchable} onPress={this._onLogout}>
                            <View style={styles.viewContainer}>
                                <Icon name='ios-log-out' style={styles.iconStyle} />
                            </View>
                            <Text style={styles.logout}>
                                Log Out
                        </Text>
                        </TouchableOpacity>
                    </View>
                }
            </SafeAreaView>
        );
    }
}

const mapStateToProps = (state) => ({
    isAuthenticated: state.auth.isAuthenticated,
    user: state.auth.user
});

const mapDispatchToProps = (dispatch) => ({
    onLogout: () => {
        dispatch(authAction.logout());
    }
});

DrawerContent.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    onLogout: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);
