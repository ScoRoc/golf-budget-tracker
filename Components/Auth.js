import React from 'react';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Signup from './Signup';
import Login from './Login';
import { colors } from '../global_styles/colors';

export default class NavButton extends React.Component {
  render() {
    return (
      <ImageBackground imageStyle={styles.image} style={styles.imgBG} source={ require('../assets/imgs/golf_ball_and_hole.jpg') }>
        <View style={styles.authView}>
          <KeyboardAwareScrollView
            contentContainerStyle={styles.authKeyboardScrollView}
            resetScrollToCoords={{ x: 0, y: 0 }}
          >
            <View style={styles.auth}>
              <Signup
                placeholderColor={placeholderColor}
                passedStyles={passedStyles}
                getUserInfo={this.props.getUserInfo}
                liftToken={this.props.liftToken}
                changePage={this.props.changePage}
              />
              <Text style={styles.text}>Or</Text>
              <Login
                placeholderColor={placeholderColor}
                passedStyles={passedStyles}
                getUserInfo={this.props.getUserInfo}
                liftToken={this.props.liftToken}
                changePage={this.props.changePage}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
      </ImageBackground>
    );
  }
}

const placeholderColor = '#555';

const styles = StyleSheet.create({
  imgBG: {
    flex: 1,
    alignSelf: 'stretch',
  },
  image: {
    resizeMode: 'cover',
  },
  authView: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    backgroundColor: 'rgba(50, 50, 50, .3)'
  },
  authKeyboardScrollView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  auth: {
    height: '70%',
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingLeft: '8%',
    paddingRight: '8%',
    // backgroundColor: 'rgba(51, 255, 170, .5)'
  },
  text: {
    color: 'white',
    fontSize: 22,
    fontWeight: 'bold',
  }
});

const passedStyles = StyleSheet.create({
  inputWrap: {
    height: '35%',
    width: '100%',
    justifyContent: 'space-around',
    padding: 10,
    paddingTop: 15,
    borderRadius: 20,
    // backgroundColor: 'rgba(51, 170, 255, .3)'
  },
  text: {
    color: colors.offWhite
  },
  textInputWrap: {
    backgroundColor: colors.offWhiteTrans,
  },
  textInput: {
    padding: 8,
    backgroundColor: 'transparent',
    borderBottomWidth: 1,
    borderBottomColor: colors.darkGrey,
    color: colors.darkSeafoam,
    fontWeight: 'bold',
  },
  button: {
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.yellow,
  },
  text: {
    fontSize: 16,
    color: '#FF9450'
  }
})
