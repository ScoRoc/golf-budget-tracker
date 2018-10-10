import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../global_styles/colors';
import NavButton from './NavButton';

const nav = {
  home: {
    text: 'Home',
    page: 'home',
    icon: 'home',
    iconType: 'font-awesome'
  },
  myCourses: {
    text: 'My courses',
    page: 'myCourses',
    icon: 'trees',
    iconType: 'foundation'
  },
  myRounds: {
    text: 'My rounds',
    page: 'myRounds',
    icon: 'golf',
    iconType: 'material-community'
  },
  logout: {
    text: 'Logout',
    page: 'home',
    icon: 'lock',
    iconType: 'material'
  }
};

const bgColor = {
  home: {
    // backgroundColor: '#ef4'
    backgroundColor: colors.seafoam
  },
  myCourses: {
    // backgroundColor: '#ea4'
    backgroundColor: colors.lightBlue
    // backgroundColor: colors.purple
  },
  myRounds: {
    // backgroundColor: '#e83'
    backgroundColor: colors.purple
  },
  logout: {
    // backgroundColor: '#e61'
    backgroundColor: colors.orange
  }
}

const Nav = props => {
  return (
    <View style={styles.nav}>
      <NavButton changePage={props.changePage} nav={nav.home} bgColor={bgColor.home} />
      <NavButton changePage={props.changePage} nav={nav.myCourses} bgColor={bgColor.myCourses} />
      <NavButton changePage={props.changePage} nav={nav.myRounds} bgColor={bgColor.myRounds} />
      <NavButton changePage={props.changePage} nav={nav.logout} bgColor={bgColor.logout} />
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    alignSelf: 'stretch',
    height: 100,
    flexDirection: 'row',
    justifyContent: 'space-between',
    shadowColor: '#222',
    shadowOpacity: .4,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: -4}
  }
});

export default Nav;
