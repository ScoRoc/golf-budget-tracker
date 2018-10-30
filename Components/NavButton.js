import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableHighlight,
  View
} from 'react-native';
import { Icon } from 'react-native-elements';
import { colors } from '../global_styles/colors';
import WhiteText from './Text/WhiteText';

const NavButton = props => {

  const handlePress = page => {
    if (props.changePage) props.changePage(page);
    if (props.logout) props.logout();
  }

  const nav = props.nav

  return (
    <TouchableHighlight
      onPress={() => handlePress(nav.page)}
      style={[styles.navButton, props.bgColor]}
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

const styles = StyleSheet.create({
  navButton: {
    flex: 1,
    paddingTop: 8
  },
  view: {
    flex: 1,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: .3,
    shadowRadius: 1,
    shadowOffset: {width: 2, height: 1}
  },
  icon: {
    marginTop: 6
  },
  text: {
    fontSize: 14.5
  }
});

export default NavButton;
