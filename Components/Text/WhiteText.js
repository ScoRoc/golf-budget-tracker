import React from 'react';
import { Text } from 'react-native';
import { colors } from '../../global_styles/colors';

const WhiteText = props => {
  if (Text.defaultProps == null) Text.defaultProps = {};
  Text.defaultProps.allowFontScaling = false;
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
