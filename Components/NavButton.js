import React from 'react';
import { View, StyleSheet, Text, TouchableHighlight } from 'react-native';
import { Icon } from 'react-native-elements';
import { colors } from '../global_styles/colors';
import WhiteText from './Text/WhiteText';

export default class NavButton extends React.Component {
  render() {
    let nav = this.props.nav
    return (
      <TouchableHighlight
        onPress={() => this.props.changePage(nav.page)}
        style={[styles.navButton, this.props.bgColor]}
        underlayColor='rgb(102, 51, 153)'
        >
          <View style={styles.view}>
            <WhiteText style={styles.text}>{nav.text}</WhiteText>
            <Icon
              name={nav.icon}
              type={nav.iconType}
              size={36}
              color={colors.yellow}
              iconStyle={styles.icon}
            />
          </View>
      </TouchableHighlight>
    );
  }
}

const styles = StyleSheet.create({
  navButton: {
    flex: 1,
    paddingTop: 10
  },
  view: {
    flex: 1,
    alignItems: 'center',
  },
  icon: {
    marginTop: 8
  },
  text: {
    fontSize: 14
  }
});
