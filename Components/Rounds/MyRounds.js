import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import { colors } from '../../global_styles/colors';
import WhiteText from '../Text/WhiteText';
import AddRound from './AddRound';
import Round from './Round';


export default class MyRounds extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAddRound: false,
      showRound: false,
      currentRound: {}
    }
  }

  touchRound = idx => {
    this.setState({currentRound: this.props.rounds[idx], showRound: true});
  }

  render() {
    let rounds = this.props.rounds.map( (round, id) => {
      return (
        <TouchableHighlight onPress={() => this.touchRound(id)} underlayColor='rgb(102, 51, 153)' key={id}>
        <View>
          <Text style={styles.round}>{(new Date(round.date)).toDateString()} ---------- {round.score}</Text>
          <Text style={styles.round}>---------</Text>
        </View>
        </TouchableHighlight>
      );
    });
    let addRound = this.state.showAddRound
                  ? <AddRound
                      api={this.props.api}
                      user={this.props.user}
                      courses={this.props.courses}
                      getUserInfo={this.props.getUserInfo}
                      close={() => this.setState({showAddRound: false})}
                    />
                  : '';
    let roundPage = this.state.showRound
                  ? <Round
                      api={this.props.api}
                      user={this.props.user}
                      round={this.state.currentRound}
                      courses={this.props.courses}
                      getUserInfo={this.props.getUserInfo}
                      close={() => this.setState({showRound: false})}
                    />
                  : '';
    return (
      <View style={styles.myRounds}>
          <WhiteText>MyRounds page</WhiteText>
          <View style={styles.addRoundWrap}>
            <TouchableHighlight onPress={() => this.setState({showAddRound: true})} underlayColor='rgb(102, 51, 153)'>
              <View style={styles.addRound}>
                <WhiteText style={ {marginRight: 10} }>Add a round</WhiteText>
                <Icon color='rgb(195, 58, 161)' name='add-circle-outline' />
              </View>
            </TouchableHighlight>
          </View>

          {rounds}

          {roundPage}
          {addRound}
      </View>
    );
  }
}

const { purple } = colors;

const styles = StyleSheet.create({
  myRounds: {
    flex: 1,
    alignSelf: 'stretch',
    // backgroundColor: '#e83'
    backgroundColor: purple
  },
  round: {
    marginBottom: 3,
    color: 'rgb(195, 58, 161)'
  },
  addRoundWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  addRound: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 30
  }
});
