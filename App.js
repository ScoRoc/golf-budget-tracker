import React from 'react';
import { AsyncStorage, TouchableHighlight, StyleSheet, Text, View, ScrollView } from 'react-native';
import axios from 'axios';
import Expo from 'expo';
import { colors } from './global_styles/colors';
import Header from './Components/Header';
import Nav from './Components/Nav';
import Home from './Components/Home';
import MyCourses from './Components/Courses/MyCourses';
import MyRounds from './Components/Rounds/MyRounds';
import Auth from './Components/Auth';

const { manifest } = Expo.Constants;
const api = (typeof manifest.packagerOpts === `object`) && manifest.packagerOpts.dev
          ? manifest.debuggerHost.split(`:`).shift().concat(`:3000`)
          : `api.example.com`;

console.log('top of app - api: ', api);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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
    axios.get(`http://${api}/api/user/${this.state.user._id}`).then(result => {  //////// FIX URL
      this.setState({user: result.data.user, courses: result.data.courses, rounds: result.data.rounds});
    });
  }

  liftTokenToState = data => {
    this.setState({
      token: data.token,
      user: data.user
    })
  }

  logout = () => {
    console.log('Logging out')
    AsyncStorage.removeItem('golf-budget-tracker-token')
    this.setState({ token: null, user: null, page: 'auth' });
  }

  ////////////////////////////////////////////
  fakeLogin() {
    axios.post(`http://${api}/api/auth/login`, {  ////////////// FIX FIX FIX FIX FIX FIX FIX
      email: 'k@k.com',
      password: 'password'
    }).then( result => {
      AsyncStorage.setItem('golf-budget-tracker-token', result.data.token) // change 'mernToken' to your app name or something useful
      this.liftTokenToState(result.data);
      this.getUserInfo();
      this.setState({ page: 'home' })
    }).catch( err => console.log(err) )
  }
  ////////////////////////////////////////////

  componentDidMount = () => {
    //////////////
    this.fakeLogin();  ////// GET RID OF THIS
    //////////////
    var token = AsyncStorage.getItem('golf-budget-tracker-token');
    if (typeof token !== 'string' || token === 'undefined' || token === 'null' || token === '') {
      AsyncStorage.removeItem('golf-budget-tracker-token');
      this.setState({
        token: null,
        user: null
      });
    } else {
      axios.post(`http://${api}/api/auth/me/from/token`, {  ////////////// FIX FIX FIX FIX FIX FIX FIX
        token
      }).then( result => {
        AsyncStorage.setItem('golf-budget-tracker-token', result.data.token);
        this.setState({
          token: result.data.token,
          user: result.data.user
        });
      }).catch( err => console.log(err));
    }
  }

  render() {
    let userName = this.state.user ? this.state.user.name : 'nothin yet';
    const colorsMap = {
      home: colors.seafoam,
      myCourses: colors.lightBlue,
      myRounds: colors.purple
    }
    const pages = {
      home: <Home
              user={this.state.user}
              rounds={this.state.rounds}
              getUserInfo={this.getUserInfo}
            />,
      myCourses: <MyCourses
                    api={api}
                    user={this.state.user}
                    getUserInfo={this.getUserInfo}
                    courses={this.state.courses}
                  />,
      myRounds: <MyRounds
                  api={api}
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

          <Nav changePage={this.changePage} logout={this.logout} />

        </View>
      );
    } else {
      return (
        <View style={styles.app}>

          <Auth
            api={api}
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
  }
});
