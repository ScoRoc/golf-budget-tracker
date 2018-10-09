import React from 'react';
import { Text } from 'react-native';
import { colors } from '../../global_styles/colors';

const WhiteText = props => {
  return (
    <Text onPress={props.onPress} style={[styles.text, props.style]}>{props.children}</Text>
  )
}

const styles = {
  text: {
    color: colors.offWhite,
    fontSize: 16,
    fontFamily: 'Oriya Sangam MN'
  }
}

export default WhiteText;
