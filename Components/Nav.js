import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Icon from 'react-native-elements';
import NavButton from './NavButton';

const nav = {
  home: {
    text: 'Home',
    page: 'home'
  },
  myCourses: {
    text: 'My courses',
    page: 'myCourses'
  },
  myRounds: {
    text: 'My rounds',
    page: 'myRounds'
  },
  auth: {
    text: 'Auth',
    page: 'auth',
    icon: 'lock'
  }
};

const bgColor = {
  top: {
    backgroundColor: '#ef4'
  },
  mid: {
    backgroundColor: '#ea4'
  },
  bot: {
    backgroundColor: '#e83'
  },
  fug: {
    backgroundColor: '#e61'
  }
}

export default class Nav extends React.Component {
  render() {
    return (
      <View style={styles.nav}>
        <NavButton changePage={this.props.changePage} nav={nav.home} bgColor={bgColor.top} />
        <NavButton changePage={this.props.changePage} nav={nav.myCourses} bgColor={bgColor.mid} />
        <NavButton changePage={this.props.changePage} nav={nav.myRounds} bgColor={bgColor.bot} />
        <NavButton
          changePage={this.props.changePage}
          nav={nav.auth}
          bgColor={bgColor.fug}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  nav: {
    alignSelf: 'stretch',
    height: 80,
    flexDirection: 'row',
    justifyContent: 'space-between',
  }
});
