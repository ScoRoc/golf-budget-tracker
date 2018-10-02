import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import AddRound from './AddRound';

export default class MyRounds extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAddRound: false,
      showRound: false,
      currentRound: {}
    }
  }

  touchCourseName = idx => {
    this.setState({currentCourse: this.props.courses[idx], showCourse: true});
  }

  componentDidUpdate(prevProps) {
    if (this.props.courses !== prevProps.courses) {
      this.props.getUserInfo();
    }
  }

  componentDidMount() {
    this.props.getUserInfo();
  }

  render() {
    let rounds = this.props.rounds.map( (round, id) => {
      return (
        <TouchableHighlight onPress={() => this.touchCourseName(id)} underlayColor='rgb(102, 51, 153)' key={id}>
        <View>
          <Text style={styles.round}>{round.score}</Text>
          <Text style={styles.round}>courseName teebox date score price notes</Text>
        </View>
        </TouchableHighlight>
      );
    });
    let addRound = this.state.showAddRound
                 ? <AddRound
                    user={this.props.user}
                    courses={this.props.courses}
                    getUserInfo={this.props.getUserInfo}
                    close={() => this.setState({showAddRound: false})}
                  />
                 : '';
    return (
      <View style={styles.myRounds}>
          <Text>MyRounds page</Text>
          <View style={styles.addRoundWrap}>
            <TouchableHighlight onPress={() => this.setState({showAddRound: true})} underlayColor='rgb(102, 51, 153)'>
              <View style={styles.addRound}>
                <Text style={ {marginRight: 10} }>Add a round</Text>
                <Icon color='rgb(195, 58, 161)' name='add-circle-outline' />
              </View>
            </TouchableHighlight>
          </View>
          <Text>CourseName____Date____Score____Price</Text>
          <Text>Notes_____________</Text>

          {rounds}

          {addRound}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  myRounds: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#bfd'
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
