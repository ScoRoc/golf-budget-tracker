import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import AddRound from './AddRound';

export default class MyRounds extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAddRound: false
    }
  }

  render() {
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
