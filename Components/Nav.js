import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import NavButton from './NavButton';

const text = {
  nav1: 'Nav 1',
  nav2: 'Nav 2',
  nav3: 'Nav 3'
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
        <NavButton text={text.nav1} bgColor={bgColor.top} />
        <NavButton text={text.nav2} bgColor={bgColor.mid} />
        <NavButton text={text.nav3} bgColor={bgColor.bot} />
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
    backgroundColor: '#fdb'
  }
});
