import React from 'react';
import {
  AsyncStorage,
  ScrollView,
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import axios from 'axios';
import Expo from 'expo';
import Modal from 'react-native-modalbox';
import { colors } from './global_styles/colors';
import WhiteText from './Components/Text/WhiteText';
import Header from './Components/Header';
import Nav from './Components/Nav';
import Home from './Components/Home';
import MyCourses from './Components/Courses/MyCourses';
import MyRounds from './Components/Rounds/MyRounds';
import Auth from './Components/Auth';

// FOR LOCAL DEPLOYMENT
// const { manifest } = Expo.Constants;
// const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
//           ? manifest.debuggerHost.split(`:`).shift().concat(`:3000`)
//           : `api.example.com`;
// const http = 'http://';
//
// console.log('top of app - api: ', api);

// FOR HEROKU
const http = 'https://';
const api = 'my-golf-tracker.herokuapp.com';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showLogout: false,
      page: 'auth',
      token: null,
      user: null,
      courses: [],
      rounds: []
    }
  }

  changePage = page => {
    this.setState({ page });
  }

  getUserInfo = async () => {
    axios.get(`${http}${api}/api/user/${this.state.user._id}`).then(result => {
      this.setState({user: result.data.user, courses: result.data.courses, rounds: result.data.rounds});
    });
  }

  liftTokenToState = data => {
    this.setState({
      token: data.token,
      user: data.user
    })
  }

  setToken = async token => {
    try {
      await AsyncStorage.setItem('my-golf-tracker-token', token);
    } catch (err) {
      console.log(err);
    }
  }

  getToken = async () => {
    let token = '';
    try {
      token = await AsyncStorage.getItem('my-golf-tracker-token') || 'none';
    } catch (err) {
      console.log(err);
    }
    return token;
  }

  deleteToken = async () => {
    try {
      await AsyncStorage.removeItem('my-golf-tracker-token');
    } catch (err) {
      console.log(err);
    }
  }

  logout = async () => {
    console.log('Logging out');
    await this.deleteToken();
    this.setState({ showLogout: false, token: null, user: null, page: 'auth' });
  }

  ////////////////////////////////////////////
  fakeLogin = () => {
    // let email = 'k@k.com';
    let email = 'donnatest@donnatest.com';
    let password = 'password';
    axios.post(`${http}${api}/api/auth/login`, {
      email,
      password
    }).then( async result => {
      await this.setToken(result.data.token);
      this.liftTokenToState(result.data);
      this.getUserInfo();
      this.changePage('home');
    }).catch( err => console.log(err) )
  }
  ////////////////////////////////////////////

  componentDidMount = async () => {
    //////////////
    this.fakeLogin();  ////// GET RID OF THIS
    //////////////
    let token = await this.getToken();
    if (typeof token !== 'string' || token === 'none' || token === '') {
      await this.deleteToken();
      this.setState({
        token: null,
        user: null
      });
    } else {
      axios.post(`${http}${api}/api/auth/me/from/token`, {
        token
      }).then( async result => {
        await this.setToken(result.data.token);
        this.setState({
          token: result.data.token,
          user: result.data.user,
          page: 'home'
        });
      }).catch( err => console.log(err));
    }
  }

  render() {
    // let userName = this.state.user ? this.state.user.name : 'nothin yet';
    const colorsMap = {
      home: colors.seafoam,
      myCourses: colors.lightBlue,
      myRounds: colors.lightPurple
    }
    const pages = {
      home: <Home
              user={this.state.user}
              rounds={this.state.rounds}
              getUserInfo={this.getUserInfo}
            />,
      myCourses: <MyCourses
                    api={api}
                    http={http}
                    user={this.state.user}
                    getUserInfo={this.getUserInfo}
                    courses={this.state.courses}
                  />,
      myRounds: <MyRounds
                  api={api}
                  http={http}
                  user={this.state.user}
                  getUserInfo={this.getUserInfo}
                  courses={this.state.courses}
                  rounds={this.state.rounds}
                />
    };

    if (this.state.page !== 'auth') {
      return (
        <View style={styles.app}>

          {/* <Header userName={userName} logout={this.logout} /> */}
          <Header color={colorsMap[this.state.page]} />

          {pages[this.state.page]}

          <Modal
            style={styles.modal}
            isOpen={this.state.showLogout}
            backdropPressToClose={true}
            entry='bottom'
            position='center'
            backdrop={true}
            animationDuration={350}
            onClosed={() => this.setState({showLogout: false})}
          >
            <View style={styles.modalTop}>
              <WhiteText style={ {color: 'black'} }>Are you sure you want to logout?</WhiteText>
            </View>
            <View style={styles.modalBottom}>
              <TouchableHighlight onPress={() => this.setState({showLogout: false})} underlayColor='rgb(102, 51, 153)'>
                <View style={styles.push}>
                  <WhiteText style={ {color: 'blue'} }>Cancel</WhiteText>
                </View>
              </TouchableHighlight>
              <TouchableHighlight onPress={this.logout} underlayColor='rgb(102, 51, 153)'>
                <View style={styles.push}>
                  <WhiteText style={ {color: 'red'} }>Logout</WhiteText>
                </View>
              </TouchableHighlight>
            </View>
          </Modal>

          <Nav changePage={this.changePage} logout={() => this.setState({showLogout: true})} />

        </View>
      );
    } else {
      return (
        <View style={styles.app}>

          <Auth
            api={api}
            http={http}
            getUserInfo={this.getUserInfo}
            liftToken={this.liftTokenToState}
            changePage={this.changePage}
          />

        </View>
      );
    }

  }
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  modal: {
    height: '15%',
    width: '75%',
    borderRadius: 10,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  modalTop: {
    height: '50%',
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
    // borderBottomWidth: StyleSheet.hairlineWidth
  },
  modalBottom: {
    height: '50%',
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  push: {
    padding: 10
  }
});
