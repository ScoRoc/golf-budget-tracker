import React from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-elements';

export default class NavButton extends React.Component {
  render() {
    let nav = this.props.nav
    return (
      <TouchableHighlight
        onPress={() => this.props.changePage(nav.page)}
        style={[styles.navButton, this.props.bgColor]}
        underlayColor='rgb(102, 51, 153)'
        // underlayColor='#b1be2e'
        >
          <View>
            <Text>{nav.text}</Text>
            <Icon name={nav.icon} />
          </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  navButton: {
    flex: 1,
  }
});
