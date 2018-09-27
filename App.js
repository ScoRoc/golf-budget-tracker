import React from 'react';
import { AsyncStorage, TouchableHighlight, StyleSheet, Text, View, ScrollView } from 'react-native';
import axios from 'axios';
import Header from './Components/Header';
import Nav from './Components/Nav';
import Home from './Components/Home';
import YourCourses from './Components/YourCourses';
import YourMatches from './Components/YourMatches';
import Auth from './Components/Auth';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'home',
      token: null,
      user: null
    }
  }

  changePage = page => {
    this.setState({ page });
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
    this.setState({ token: null, user: null })
  }

  componentDidMount = () => {
    var token = AsyncStorage.getItem('golf-budget-tracker-token')
    if (token === 'undefined' || token === 'null' || token === '' || token === undefined) {
      AsyncStorage.removeItem('golf-budget-tracker-token')
      this.setState({
        token: null,
        user: null
      })
    } else {
      axios.post('http://localhost:3000/api/auth/me/from/token', {  ////////////// FIX FIX FIX FIX FIX FIX FIX
        token
      }).then( result => {
        AsyncStorage.setItem('golf-budget-tracker-token', result.data.token)
        this.setState({
          token: result.data.token,
          user: result.data.user
        })
      }).catch( err => console.log(err))
    }
  }

  render() {
    let userName = this.state.user ? this.state.user.name : 'nothin yet';
    const pages = {
      home: <Home onPress={() => this.changePage('test')} />,
      yourCourses: <YourCourses />,
      yourMatches: <YourMatches />,
      auth: <Auth liftToken={this.liftTokenToState} />
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
