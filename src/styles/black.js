import styled from 'styled-components';
import { Platform } from 'react-native';

import {
    Button as _Button,
    Card as _Card,
    CardItem as _CardItem,
    Container as _Container,
    Content as _Content,
    H2 as _H2,
    Text as _Text
} from 'native-base';

export const colors = {
    darkWhite: '#8f8f8f',
    lightWhite: '#4D4848',
    red: '#DF353F',
    darkRed: '#eb2b2b',
    black: '#212121',
    lightBlack: '#424242',
    darkGrey: '#383838',
    darkerGrey: '#424242',
    white: '#FFFFFF',
    colorPrimary: '#1b75bc',
    colorAccent: '#f1b86d',
    colorPrimaryGrey: '#7d7d7d',
    colorSecondaryGrey: '#b5b5b5',
    colorFaintGrey: '#f9f9f9',
    colorError: '#cc0000',
    colorPrimaryGreen: '#36b236'
}

export const cardStyle = {
    backgroundColor: '#1b1d1c',
    borderColor: colors.black
}

export const cardItemStyle = {
    backgroundColor: colors.lightBlack
}

export const tabBarStyle = {
    backgroundColor: '#b32f35'
}

export const tabBarOption = {
    showIcon: true,
    inactiveTintColor: 'white',
    activeBackgroundColor: 'white',
    inactiveBackgroundColor: '#212121',
    indicatorStyle: {
      backgroundColor: 'white'
    },
}

export const containerStyle = {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: colors.darkGrey
}

export const contentStyle = {
    padding: 16
}

export const headerStyle = Platform.select({
  ios: {
    backgroundColor: '#1b75bc',
  },
  android: {
    backgroundColor: '#1b75bc',
    paddingTop: 24,
    height: 48+24
  }
});

export const buttonStyle = {
    backgroundColor: colors.red

}

export const cardTextStyle = {
    color: 'white'
}

export const cardTextDefaultSize = {
    fontSize: 14
}

export const Card = styled(_Card) `
    backgroundColor: #424242;
    borderColor: ${colors.black}
`;

export const CardItem = styled(_CardItem) `
    backgroundColor: ${colors.lightBlack};
`;

export const Content = styled(_Content) `
    padding: 16px;
`;

export const Container = styled(_Container) `
        backgroundColor: ${colors.darkGrey};
`;

export const H2 = styled(_H2) `
    color: ${colors.white}
    marginTop: 10;
    marginBottom: 10;
    fontSize: 20;
`;

export const Text = styled(_Text) `
    color: ${colors.white}
    fontSize: 13;
`;

export const Button = styled(_Button) `
    backgroundColor: ${colors.red}
    justifyContent: center;
    height:50;
    alignSelf: stretch;
`;
