import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NavButton from './NavButton';

const nav = {
  home: {
    text: 'Home',
    page: 'home'
  },
  yourCourses: {
    text: 'Your courses',
    page: 'yourCourses'
  },
  yourMatches: {
    text: 'Your matches',
    page: 'yourMatches'
  },
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
  }
}

export default class Nav extends React.Component {
  render() {
    return (
      <View style={styles.nav}>
        <NavButton changePage={this.props.changePage} nav={nav.home} bgColor={bgColor.top} />
        <NavButton changePage={this.props.changePage} nav={nav.yourCourses} bgColor={bgColor.mid} />
        <NavButton changePage={this.props.changePage} nav={nav.yourMatches} bgColor={bgColor.bot} />
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
