import React, { Component } from 'react';
import {
    Animated,
    ScrollView,
    StyleSheet,
    View,
    Dimensions,
    Text,
    Platform
} from 'react-native';
import { colors } from '../styles';
import DrawerMenu from '../components/DrawerMenu';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connect } from 'react-redux';


const HEADER_MAX_HEIGHT = 200;
const HEADER_MIN_HEIGHT = 80;
const STATUS_BAR_HEIGHT = 0;
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - STATUS_BAR_HEIGHT;

const { width, height } = Dimensions.get('window');

class ScrollableHeader extends Component {
    constructor(props) {
        super(props);

        this.state = {
            scrollY: new Animated.Value(0),
        };
        this._renderScrollViewContent = this._renderScrollViewContent.bind(this);
        this._getBackButton = this._getBackButton.bind(this);
    }


    _renderScrollViewContent() {
        return (
            <View style={styles.scrollViewContent}>
                {this.props.content}
            </View>
        );
    }

    _getBackButton() {
        const {navigation}=this.props;
        return (
            Platform.OS=='ios'?
                <Ionicons style={styles.backIcon} name='ios-arrow-back' size={33} onPress={()=>navigation.goBack()}/>
                :
                <MaterialIcons style={styles.backIcon} name='arrow-back' size={33} onPress={()=>navigation.goBack()}/>
        );
    }

    get title() {
        return `Welcome ${this.props.user.isStaff?'Admin':'Coach'}`;
    }

    render() {
        const { data, navigation, type, user } = this.props;
        const headerHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
            extrapolate: 'clamp',
        });
        const imageOpacity = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE / 2, HEADER_SCROLL_DISTANCE],
            outputRange: [1, 1, 0],
            extrapolate: 'clamp',
        });
        const imageTranslate = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [0, -100],
            extrapolate: 'clamp',
        });
        const imageHeight = this.state.scrollY.interpolate({
            inputRange: [0, HEADER_SCROLL_DISTANCE],
            outputRange: [135, 10],
            extrapolate: 'clamp',
        });
        const defaultImage = (data.nameTitle)?require('../assets/images/club.png'):require('../assets/images/person.png');
        return (
            <View style={styles.fill}>
                {/* <StatusBar translucent barStyle='light-content' backgroundColor="rgba(173, 55, 55, 0)" /> */}
                {(type==='back')? 
                    this._getBackButton()
                :
                    <DrawerMenu navigation={navigation} style={styles.drawerIcon}/>
                }
                
                <Animated.View style={{ zIndex: 9000, position: 'absolute', height: headerHeight, width: width, overflow: 'hidden', backgroundColor: colors.colorPrimary }}>
                    
                </Animated.View>
                <Animated.View style={[{ height: headerHeight }, styles.backgroundImageView]}>
                    <Animated.Image
                        style={[
                            styles.backgroundImage,
                            {
                                // resizeMode: 'contain',
                                opacity: imageOpacity,
                                height: imageHeight,
                                width: 90,
                                height: 90,
                                borderRadius: 45,
                                marginBottom: 30,
                                transform: [{ translateY: imageTranslate }]
                            },
                        ]}
                        source={data.image?{uri:data.image}:defaultImage}
                    />
                    <View style={styles.info}>
                        <Text style={styles.welcome}> {data.nameTitle?data.nameTitle:this.title} </Text>
                        <Text style={styles.name}>{data.name?data.name:`${user.firstName} ${user.lastName}`}</Text>
                    </View>
                </Animated.View>
                <ScrollView
                    style={styles.fill}
                    scrollEventThrottle={16}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }]
                    )}
                >
                    {this._renderScrollViewContent()}
                </ScrollView>
            </View>

        );
    }

    static defaultProps = {
        type: 'back'
    }
}

const styles = StyleSheet.create({
    fill: {
        backgroundColor: colors.colorFaintGrey,
    },
    scrollViewContent: {
        top: HEADER_MIN_HEIGHT+20,
        marginTop: HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT,
        height: height
    },
    backgroundImageView: {
        left: 0,
        right: 0,
        position: 'absolute',
        width: null,
        zIndex: 10000,
        alignItems: 'center',
        justifyContent: 'center',
    },
    info: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        bottom: 10
    },
    welcome: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    name: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18
    },
    backIcon: {
        position: 'absolute',
        top: 36,
        left: 10,
        zIndex: 99999999,
        color: 'white'
    },
    drawerIcon: {
        position: 'absolute',
        top: 36,
        zIndex: 99999999,
        height: 100,
        width: 100
    }
});

const mapStateToProps = ({ auth }) => ({
    user: auth.user
});

export default connect(mapStateToProps, null)(ScrollableHeader);

