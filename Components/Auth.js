import React from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Keyboard,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modalbox';
import WhiteText from './Text/WhiteText';
import Signup from './Signup';
import Login from './Login';
import { colors } from '../global_styles/colors';

export default class NavButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showSpinner: false,
      showLoginErrMsg: false,
      errMsg: ''
    }
  }

  errMsgPopup = msg => {
    this.setState({showLoginErrMsg: true, errMsg: msg});
    setTimeout(() => this.setState({showLoginErrMsg: false}), 3000);
  }

  changePageFromAuth = () => {
    this.setState({ showSpinner: true });
    setTimeout(() => {
      this.setState({ showSpinner: false });
      this.props.changePage('home');
    }, 500);
  }

  render() {
    const blur = this.state.showSpinner ? 3 : 0;
    return (
      <ImageBackground blurRadius={blur} imageStyle={styles.image} style={styles.imgBG} source={ require('../assets/imgs/golf_ball_and_hole.jpg') }>
        <TouchableWithoutFeedback style={styles.keyboardScrollViewWrap} onPress={Keyboard.dismiss}>

          <KeyboardAwareScrollView
            contentContainerStyle={styles.authKeyboardScrollView}
            resetScrollToCoords={{ x: 0, y: 0 }}
          >

            <View style={styles.auth}>
              <Signup
                api={this.props.api}
                http={this.props.http}
                placeholderColor={placeholderColor}
                passedStyles={passedStyles}
                getUserInfo={this.props.getUserInfo}
                liftToken={this.props.liftToken}
                errMsgPopup={this.errMsgPopup}
                changePageFromAuth={this.changePageFromAuth}
              />

              <ActivityIndicator animating={this.state.showSpinner} size='large' color={purple} />

              <Login
                api={this.props.api}
                http={this.props.http}
                placeholderColor={placeholderColor}
                passedStyles={passedStyles}
                getUserInfo={this.props.getUserInfo}
                liftToken={this.props.liftToken}
                errMsgPopup={this.errMsgPopup}
                changePageFromAuth={this.changePageFromAuth}
              />
            </View>

            <Modal
              style={styles.modal}
              isOpen={this.state.showLoginErrMsg}
              backdropPressToClose={true}
              entry='top'
              position='top'
              backdrop={true}
              animationDuration={350}
              onClosed={() => this.setState({showLoginErrMsg: false})}
            >
              <WhiteText style={ {color: 'red'} }>{this.state.errMsg}</WhiteText>
            </Modal>

          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </ImageBackground>
    );
  }
}

const {
  darkGrey,
  darkGreyTrans,
  purple,
  darkMediumGrey,
  darkSeafoam,
  seafoam,
  offWhite,
  offWhiteTrans,
  orange,
  yellow
} = colors;

const placeholderColor = darkMediumGrey;

const styles = StyleSheet.create({
  imgBG: {
    flex: 1,
    alignSelf: 'stretch',
  },
  image: {
    resizeMode: 'cover'
  },
  keyboardScrollViewWrap: {
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
    color: offWhite,
    fontSize: 22,
    fontWeight: 'bold',
  },
  modal: {
    height: '20%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ddd'
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
    // backgroundColor: 'rgba(45, 82, 108, 0.3)'
  },
  textInputWrap: {
    backgroundColor: offWhiteTrans,
  },
  label: {
    color: purple,
    fontSize: 20,
    fontWeight: 'bold'
  },
  textInput: {
    padding: 8,
    backgroundColor: 'transparent',
    borderBottomWidth: .5,
    borderBottomColor: darkGreyTrans,
    borderTopWidth: .5,
    borderTopColor: darkGreyTrans,
    borderLeftWidth: .5,
    borderLeftColor: darkGreyTrans,
    borderRightWidth: .5,
    borderRightColor: darkGreyTrans,
    color: purple,
    fontWeight: 'bold',
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: yellow,
  },
  buttonText: {
    color: offWhite,
    fontSize: 16,
    fontWeight: 'bold'
  }
})
