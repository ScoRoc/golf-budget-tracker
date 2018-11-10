import React from 'react';
import { StyleSheet, View } from 'react-native';
import { colors } from '../../global_styles/colors';
import WhiteText from '../Text/WhiteText';

const MiniScoreBox = props => {
  const round = props.round;
  const team = round.teamScore ? <WhiteText style={ {fontSize: 10} }>team</WhiteText> : '';
  const color = round.teamScore ? styles.team : styles.solo;
  return (
    <View style={ [styles.roundScoreBox, color] }>
      <WhiteText style={ {fontSize: 11} }>Score</WhiteText>
      <WhiteText style={ {fontSize: 20} }>{round.score}</WhiteText>
      {team}
    </View>
  );
}

const { darkSeafoam, steelBlue } = colors;

const styles = StyleSheet.create({
  roundScoreBox: {
    height: 50,
    width: 50,
    marginRight: 10,
    padding: 4,
    justifyContent: 'space-around',
    alignItems: 'center',
    borderRadius: 5
  },
  solo: {
    backgroundColor: darkSeafoam
  },
  team: {
    backgroundColor: steelBlue
  }
});

export default MiniScoreBox;
