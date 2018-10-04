import React from 'react';
import { AsyncStorage, TouchableHighlight, StyleSheet, Text, View, ScrollView } from 'react-native';
import axios from 'axios';
import Header from './Components/Header';
import Nav from './Components/Nav';
import Home from './Components/Home';
import MyCourses from './Components/Courses/MyCourses';
import MyRounds from './Components/Rounds/MyRounds';
import Auth from './Components/Auth';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'home',
      token: null,
      user: null,
      courses: [],
      rounds: []
    }
  }

  changePage = page => {
    this.setState({ page });
  }

  getUserInfo = () => {
    axios.get(`http://localhost:3000/api/user/${this.state.user._id}`).then(result => {  //////// FIX URL
      this.setState({user: result.data.user, courses: result.data.courses, rounds: result.data.rounds});
      console.log('rounds: ', result.data.rounds);
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
    this.setState({ token: null, user: null });
  }

  ////////////////////////////////////////////
  fakeLogin() {
    axios.post('http://localhost:3000/api/auth/login', {  ////////////// FIX FIX FIX FIX FIX FIX FIX
      email: 'g@g.com',
      password: 'password'
    }).then( result => {
      AsyncStorage.setItem('golf-budget-tracker-token', result.data.token) // change 'mernToken' to your app name or something useful
      this.liftTokenToState(result.data);
      this.getUserInfo();
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
      axios.post('http://localhost:3000/api/auth/me/from/token', {  ////////////// FIX FIX FIX FIX FIX FIX FIX
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
    const pages = {
      home: <Home user={this.state.user} onPress={() => this.changePage('test')} />,
      myCourses: <MyCourses user={this.state.user} getUserInfo={this.getUserInfo} courses={this.state.courses} />,
      myRounds: <MyRounds
                  user={this.state.user}
                  getUserInfo={this.getUserInfo}
                  courses={this.state.courses}
                  rounds={this.state.rounds}
                />,
      auth: <Auth getUserInfo={this.getUserInfo} liftToken={this.liftTokenToState} />
    }

    return (
      <View style={styles.app}>

        <Header userName={userName} logout={this.logout} />

        {pages[this.state.page]}

        <Nav changePage={this.changePage} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#84d',
    alignItems: 'center',
    justifyContent: 'center',
  }
});
