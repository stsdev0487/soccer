import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView, FlatList, Dimensions } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Tab, Tabs, Container, Button, Card, } from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../styles';
import ScrollableHeader from '../../components/ScrollableHeader';
import ActionButton from 'react-native-action-button';
import ImagePicker from 'react-native-image-crop-picker';
import Api from '../../services/api';
import MultiUpload from '../../components/MultiUpload';

const { height, width } = Dimensions.get('window');

const noItems = Math.floor((width-60)/(80+(8+8)));
const imgWidth = Math.floor((width-60-16)/ noItems);

const styles = StyleSheet.create({
    tabContent: {
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flex: 1,
        paddingTop: 20,
    },
    wrapper: {
        paddingHorizontal:30,
        paddingVertical: 20,
        flex: 1,
        minHeight: height
    },
    overviewText: {
        textAlign: 'center',
        paddingLeft: 50,
        paddingRight: 50,
        lineHeight: 18,
        color: '#7d7d7d',
        fontSize: 12
    },
    editButton: {
        color: 'red',
        backgroundColor: '#f1b86d',
        elevation: 6,
        marginBottom: 20,
        marginTop: 20,
        alignSelf: 'center',
        width: '40%'
    },
    editText: {
        color: 'white',
        fontWeight: 'bold'
    },
    photoSection: {
        alignItems: 'center',
        paddingLeft: 30,
        paddingRight: 30,
        paddingBottom: 50,
    },
    photoWrapper: {
        marginBottom: 10,
        paddingRight: 8,
    },
    photoHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 20,
        alignSelf: 'stretch',
    },
    photosText: {
        color: '#1b75bc',
        fontSize: 16
    },
    detail: {
        display: 'flex',
        flex: 1
    },
    team: {
        marginBottom: 6,
        marginTop: 6,
        minHeight: 90,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        width: 90,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        marginRight: 10
    },
    teamName: {
        color: colors.colorPrimaryGrey,
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    teamInfo: {
        color: '#f1b86d',
        fontSize: 10,
        textAlign: 'center'
    },
    image: {
        marginBottom: 10,
        width: 40,
        height: 40,
        resizeMode: 'contain'
    },
    actionButtonIcon: {
        fontSize: 18,
        color: '#fff'
    },
    heading: {
        color: '#1b75bc',
        fontSize: 18,
        fontWeight: 'bold',
        paddingLeft: 10
    },
    actionButton: {
        zIndex: 1,
        flex: 1,
        position: 'absolute',
        top: -12,
        right: -7,
    },
    detailContainer: {
        marginTop: -20
    },
    tabBarStyle: {
        borderBottomWidth: 2,
        borderBottomColor: '#f1b86d'
    },
    tabElevation: {
        elevation: 0
    },
    tabBackground: {
        backgroundColor: '#fff'
    },
    activeTabText: {
        color: '#f1b86d',
        fontWeight: 'normal'
    },
    plusIcon: {
        color: 'white',
        fontSize: 24
    },
    tabText: {
        color: '#7d7d7d'
    },
    addPhoto: {
        color: '#7d7d7d'
    },
    galleryImage: {
        width: imgWidth,
        height: imgWidth
    }
});



export default class ClubDetailScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            teams: [],
            isUploading: false,
            clubImages: []
        };
        this.loadTeams = this.loadTeams.bind(this);
    }

    componentDidMount() {
        this.loadTeams();
    }

    async loadTeams() {
        const { club } = this.props.navigation.state.params;
        try{
            let res = await Api.team.list({ query: { club: club.id}});
            this.setState({ teams: res.results });
        }
        catch (err) {
            console.log(err);
        }
    }

    _uploadClubImages() {
        ImagePicker.openPicker({
            multiple: true,
            width: 300,
            height: 400,
            cropping: false
        }).then(images => {
            const { club } = this.props.navigation.state.params;
            let clubImages = images.map(image=>({
                title: image.filename,
                image: {uri: image.path, type: image.mime, name: image.path.split('/').pop()},
                club: club.id,
                path: image.path
            }));
            this.setState({
                clubImages,
                isUploading: true
            });
        });
    }
    
    _onUploadComplete = () => {
        this.setState({isUploading: false })
    }

    _renderItem = ({ item }) => {
        const { navigation } = this.props;
        const imageSource = item.emblem ? { uri: item.emblem } : require('../../assets/images/club.png');
        return (
            <View>
                <TouchableOpacity onPress={() => navigation.navigate('TeamDetail', { team: item })} >
                    <Card style={styles.team}>
                        <Image source={imageSource} style={styles.image} />
                        <View style={styles.detail}>
                            <Text style={styles.teamName}>
                                {item.name}
                            </Text>
                            <Text style={styles.teamInfo}>{item.playerCount} players</Text>
                        </View>

                    </Card>
                </TouchableOpacity>
            </View>
        );
    }

    _renderGallery = ({ item }) => {
        return (
            <View style={styles.photoWrapper}>
                <Image style={styles.galleryImage} source={{ uri: item }} />
            </View>
        );
    }


    render() {
        const { navigation } = this.props;
        const { teams, clubImages, isUploading } = this.state;
        const { club } = this.props.navigation.state.params;

        const content = (
            <Container style={styles.detailContainer}>
                <Tabs tabBarUnderlineStyle={styles.tabBarStyle} tabBarBackgroundColor={'#333'} tabContainerStyle={styles.tabElevation}>
                    <Tab heading="Overview" tabStyle={styles.tabBackground} textStyle={styles.tabText} activeTabStyle={styles.tabBackground} activeTextStyle={styles.activeTabText} >
                        <ScrollView style={styles.tabContent}>
                            <View styles={styles.wrapper}>
                                <Text style={styles.overviewText}> {club.description} </Text>
                                <Button 
                                    full 
                                    rounded 
                                    style={styles.editButton} 
                                    onPress={() => navigation.navigate('AddClub', { club })} >
                                    <Text style={styles.editText} >Edit Info</Text>
                                </Button>
                                <View style={styles.photoSection}>
                                    <View style={styles.photoHeader}>
                                        <Text style={styles.photosText}>Photos</Text>
                                        <TouchableOpacity onPress={this._uploadClubImages.bind(this)}>
                                            <Text style={styles.addPhoto}>+ Add Photos</Text>
                                        </TouchableOpacity>
                                    </View>
                                    <FlatList
                                        keyExtractor={item => item}
                                        showsVerticalScrollBar={false}
                                        data={club.gallery}
                                        renderItem={this._renderGallery} 
                                        numColumns= {noItems}
                                        horizontal={false}
                                    />
                                </View>
                            </View>
                        </ScrollView>
                    </Tab>
                    <Tab heading="Teams" tabStyle={styles.tabBackground} textStyle={styles.tabText} activeTabStyle={styles.tabBackground} activeTextStyle={styles.activeTabText}>
                        <ScrollView style={styles.tabContent}>
                            <View style={styles.wrapper}>
                                <Text style={styles.heading}>Teams</Text>
                                <FlatList
                                    keyExtractor={item => item.id.toString()}
                                    showsVerticalScrollBar={false}
                                    style={styles.list}
                                    data={teams}
                                    extraData={this.state}
                                    renderItem={this._renderItem}
                                    numColumns={3}
                                />
                                <ActionButton style={styles.actionButton}
                                    buttonColor={colors.colorAccent}
                                    renderIcon={() => <MaterialCommunityIcons name='plus' style={styles.plusIcon} />}
                                    size={32}
                                    offsetY={30}
                                    offsetX={30}
                                    verticalOrientation="down"
                                    elevation={2}
                                    bgColor="rgba(245, 245, 245, .92)">
                                    <ActionButton.Item buttonColor='#9c3c96' title="Add Team" onPress={() => navigation.navigate('AddNewTeam')}>
                                        <Ionicons style={styles.actionButtonIcon} name='ios-add-circle-outline' />
                                    </ActionButton.Item>
                                    <ActionButton.Item buttonColor='#d14545' title="Manage Teams" onPress={() => navigation.navigate('TeamManage', { teams })}>
                                        <Ionicons style={styles.actionButtonIcon} name='ios-settings' />
                                    </ActionButton.Item>
                                </ActionButton>
                            </View>

                        </ScrollView>
                    </Tab>
                </Tabs>
                {isUploading &&
                    <MultiUpload visible={isUploading} items={clubImages} apiKey='clubGalleries' onUploadComplete={this._onUploadComplete} />
                }
            </Container>


        );
        return (
            <ScrollableHeader navigation={navigation} data={{ name: club.name, image: club.emblem, nameTitle: 'Club' }} content={content} />
        );
    }

    static navigationOptions = () => ({
        title: '',
        header: null
    });
}
