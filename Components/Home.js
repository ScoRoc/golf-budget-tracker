import React, { Component } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';

export default class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
      ytdRounds: 0,
      ytdSpent: 0,
      mtdRounds: 0,
      mtdSpent: 0
    }
  }

  componentDidMount() {
    const rounds = this.props.rounds;
    const ytdRounds = [];
    let ytdSpent = 0;
    const mtdRounds = [];
    let mtdSpent = 0;
    const thisYear = new Date().getFullYear();
    const thisMonth = new Date().getMonth();
    rounds.forEach(round => {
      if (new Date(round.date).getFullYear() === thisYear) ytdRounds.push(round);
      if (new Date(round.date).getMonth() === thisMonth) mtdRounds.push(round);
    });
    if (ytdRounds.length !== 0) ytdSpent = ytdRounds.map(round => round.price).reduce((acc, cur) => acc + cur);
    if (mtdRounds.length !== 0) mtdSpent = mtdRounds.map(round => round.price).reduce((acc, cur) => acc + cur);
    this.setState({
      ytdRounds: ytdRounds.length,
      ytdSpent,
      mtdRounds: mtdRounds.length,
      mtdSpent
    })
  }

  render() {
    const handicap  = !this.props.user
                    ? ''
                    : this.props.user.handicap === 99
                    ? 'Add a round to find your handicap'
                    : this.props.user.handicap;
    return (
      <View style={styles.home}>
          <Text>Home page</Text>

          <Text>Your handicap index: {handicap}</Text>
          <Text>Your current YTD spent: {this.state.ytdSpent}</Text>
          <Text>Your current MTD spent: {this.state.mtdSpent}</Text>
          <Text>You've played {this.state.ytdRounds} rounds YTD</Text>
          <Text>You've played {this.state.mtdRounds} rounds MTD</Text>
          <Text>See total spent in previous months of current year</Text>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#bfd'
  }
});
