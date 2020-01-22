import React from 'react';
import { StackNavigator, DrawerNavigator, } from 'react-navigation';
import SearchButton from './SearchButton';
import DrawerMenu from '../components/DrawerMenu';
import DrawerContent from './drawerContent';
import { colors } from '../styles';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import ResetPasswordScreen from '../screens/password/ResetPasswordScreen';
import ResetPasswordConfirmationScreen from '../screens/password/ResetPasswordConfirmationScreen';
import NewPasswordScreen from '../screens/password/NewPasswordScreen';
import LoginScreen from '../screens/LoginScreen';
import PlayerManageScreen from '../screens/player/PlayerManageScreen';
import ClubManageScreen from '../screens/club/ClubManageScreen';
import CoachManageScreen from '../screens/coach/CoachManageScreen';
import VirtualPlayerScreen from '../screens/player/VirtualPlayerScreen';
import PlayerScreen from '../screens/player/PlayerScreen';
import MovePlayerScreen from '../screens/player/MovePlayerScreen';
import SelectClubScreen from '../screens/player/SelectClubScreen';
import ChoosePlayersTeamScreen from '../screens/player/ChoosePlayersTeamScreen';
import TeamPlayersScreen from '../screens/team/TeamPlayersScreen';
import SelectTeamScreen from '../screens/team/SelectTeamScreen';
import PlayerProfileScreen from '../screens/player/PlayerProfileScreen';
import TeamManageScreen from '../screens/team/TeamManageScreen';
import AdminProfileScreen from '../screens/admin/AdminProfileScreen';
import RegisterNewPlayerScreen from '../screens/player/RegisterNewPlayerScreen';
import AddNewTeamScreen from '../screens/team/AddNewTeamScreen';
import AddClubScreen from '../screens/club/AddClubScreen';
import ClubsScreen from '../screens/club/ClubsScreen';
import AdminCoachRegistrationScreen from '../screens/admin/AdminCoachRegistrationScreen';
import CoachScreen from '../screens/coach/CoachScreen';
import CoachProfileScreen from '../screens/coach/CoachProfileScreen';
import TeamsScreen from '../screens/team/TeamsScreen';
import TeamDetailScreen from '../screens/team/TeamDetailScreen';
import ClubDetailScreen from '../screens/club/ClubDetailScreen';
import SupportScreen from '../screens/issues/SupportScreen';
import SubmitIssueScreen from '../screens/issues/SubmitIssueScreen';
import IssuesReportScreen from '../screens/issues/IssuesReportScreen';
import IssuesManageScreen from '../screens/issues/IssuesManageScreen';
import AddRosterScreen from '../screens/roster/AddRosterScreen';
import ManageRosterScreen from '../screens/roster/ManageRosterScreen';
import SelectRosterScreen from '../screens/roster/SelectRosterScreen';
import MoveRosterScreen from '../screens/roster/MoveRosterScreen';

export const HomeScreenNavigator = DrawerNavigator({
    AdminDashboard: {screen: AdminDashboardScreen },
    Clubs: { screen: ClubsScreen },
    Teams: {screen: TeamsScreen},
    Coaches: {screen: CoachScreen },
    Players: {screen: PlayerScreen},
    
    AdminProfile: {screen: AdminProfileScreen},
    CoachProfile: {screen: CoachProfileScreen},
    Support: {screen: SupportScreen},
}, {
    contentOptions: {
        activeTintColor: '#4d4f50',
        labelStyle: {
            fontWeight: 'normal'
        }
    },
    contentComponent: DrawerContent,
    drawerBackgroundColor: colors.white,
    headerMode: 'screen',
    initialRouteName: 'AdminDashboard'
});

HomeScreenNavigator.navigationOptions = ({navigation}) => {
    const { routeName } = navigation.state.routes[navigation.state.index]; //TODO Get the label name instead of routename
    let navigationOptions = {};
    switch(routeName) {
        case 'AdminDashboard':
            navigationOptions = {
                title: 'Dashboard',
                header: null
            };
            break;
        case 'Teams':
            navigationOptions = {
                title: 'Teams',
                headerLeft: <DrawerMenu navigation={navigation} />,
                headerRight: <SearchButton />,
            };
            break;
        case 'Players':
            navigationOptions = {
                title: 'Players',
                headerLeft: <DrawerMenu navigation={navigation} />,
                headerRight: <SearchButton />,
            };
            break;
        case 'Clubs':
            navigationOptions = {
                title: 'Clubs',
                headerLeft: <DrawerMenu navigation={navigation} />,
                headerRight: <SearchButton />,
            }
            break;
        case 'AdminProfile':
            navigationOptions = {
                title: 'Profile',
                headerLeft: <DrawerMenu navigation={navigation} />,
                headerRight: <SearchButton />,
            }
            break;
        case 'CoachProfile':
            navigationOptions = {
                title: 'Profile',
                headerLeft: <DrawerMenu navigation={navigation} />,
                headerRight: <SearchButton />,
            }
            break;
        case 'Coaches':
            navigationOptions = {
                title: 'Coaches',
                headerLeft: <DrawerMenu navigation={navigation} />,
                headerRight: <SearchButton />,
            }
            break;
        case 'Support':
            navigationOptions = {
                title: 'Support',
                headerLeft: <DrawerMenu navigation={navigation} />,
                headerRight: <SearchButton />,
            }
            break;
    }
    return navigationOptions;
};

const AppNavigator = StackNavigator(
    {   
        HomeDrawer: { screen: HomeScreenNavigator },
        ResetPasswordConfirmation: { screen: ResetPasswordConfirmationScreen },
        Login: { screen: LoginScreen },
        ResetPasswordConfirmationScreen: { screen: ResetPasswordConfirmationScreen },
        ResetPassword: { screen: ResetPasswordScreen },
        NewPassword: { screen: NewPasswordScreen },
        PlayerManage: {screen: PlayerManageScreen },
        TeamManage: {screen: TeamManageScreen },
        ClubManage: {screen: ClubManageScreen },
        CoachManage: {screen: CoachManageScreen },
        VirtualPlayer: {screen: VirtualPlayerScreen },
        MovePlayer: {screen: MovePlayerScreen },
        TeamPlayers: {screen: TeamPlayersScreen },
        SelectTeam: {screen: SelectTeamScreen },
        RegisterNewPlayer: { screen: RegisterNewPlayerScreen },
        AddNewTeam: { screen: AddNewTeamScreen },
        PlayerProfile: {screen: PlayerProfileScreen},
        AddClub: { screen: AddClubScreen },
        Clubs: { screen: ClubsScreen },
        TeamDetail: {screen: TeamDetailScreen },
        AdminRegister: { screen: AdminCoachRegistrationScreen},
        ClubDetail: {screen: ClubDetailScreen },
        CoachProfile: {screen: CoachProfileScreen},
        Support: { screen: SupportScreen },
        SubmitIssue: { screen: SubmitIssueScreen },
        IssuesReport: {screen: IssuesReportScreen},
        IssuesManage: {screen: IssuesManageScreen},
        AddRoster:  {screen: AddRosterScreen},
        ManageRoster:  {screen: ManageRosterScreen},
        SelectRoster:  {screen: SelectRosterScreen},
        MoveRoster:  {screen: MoveRosterScreen},
        SelectClub: {screen: SelectClubScreen},
        ChoosePlayersTeam: {screen: ChoosePlayersTeamScreen}
    }, {
        navigationOptions: {
            headerTintColor: 'white',
            headerRight: <SearchButton />,
            headerStyle: {
                elevation: 0,
                backgroundColor: colors.colorPrimary,
                height: 61
            },
        },
        headerMode: 'screen',
        initialRouteName: 'Login',

    }
);

export {AppNavigator};