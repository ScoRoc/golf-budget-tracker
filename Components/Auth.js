import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import Signup from './Signup';
import Login from './Login';
import { colors } from '../global_styles/colors';

export default class NavButton extends React.Component {
  render() {
    return (
      <ImageBackground imageStyle={styles.image} style={styles.imgBG} source={ require('../assets/imgs/golf_ball_and_hole.jpg') }>
        <View style={styles.authWrap}>
          <View style={styles.auth}>
            <Signup
              passedStyles={passedStyles}
              getUserInfo={this.props.getUserInfo}
              liftToken={this.props.liftToken}
              changePage={this.props.changePage}
            />
            <Text>-- or --</Text>
            <Login
              passedStyles={passedStyles}
              getUserInfo={this.props.getUserInfo}
              liftToken={this.props.liftToken}
              changePage={this.props.changePage}
            />
          </View>
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  imgBG: {
    flex: 1,
    alignSelf: 'stretch',
  },
  image: {
    resizeMode: 'cover',
  },
  authWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(50, 50, 50, .2)'
  },
  auth: {
    height: '70%',
    width: '100%',
    justifyContent: 'space-around',
    paddingLeft: '8%',
    paddingRight: '8%',
    backgroundColor: 'rgba(51, 255, 170, .5)'
  }
});

const passedStyles = StyleSheet.create({
  inputWrap: {
    height: '30%',
    justifyContent: 'space-around',
    padding: 10,
    paddingTop: 15,
    borderRadius: 20,
    backgroundColor: 'rgba(51, 170, 255, .3)'
  },
  text: {
    color: colors.offWhite
  },
  textInput: {
    backgroundColor: colors.offWhite,
  },
  button: {
    backgroundColor: colors.offWhite,
  }
})
