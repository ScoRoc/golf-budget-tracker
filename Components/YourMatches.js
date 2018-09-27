import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import AddMatch from './AddMatch';

export default class YourMatches extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAddMatch: false
    }
  }

  openAddMatch = () => {
    this.setState( {showAddMatch: true} )
  }

  closeAddMatch = () => {
    this.setState( {showAddMatch: false} )
  }

  render() {
    let addMatch = this.state.showAddMatch ? <AddMatch close={this.closeAddMatch} /> : '';
    return (
      <View style={styles.yourMatches}>
          <Text>YourMatches page</Text>
          <View style={styles.addMatchWrap}>
            <TouchableHighlight onPress={this.openAddMatch} underlayColor='rgb(102, 51, 153)'>
              <View style={styles.addMatch}>
                <Text style={ {marginRight: 10} }>Add a match</Text>
                <Icon color='rgb(195, 58, 161)' name='add-circle-outline' />
              </View>
            </TouchableHighlight>
          </View>
          <Text>CourseName____Date____Score____Price</Text>
          <Text>Notes_____________</Text>
          {addMatch}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  yourMatches: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#bfd'
  },
  addMatchWrap: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  addMatch: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 30
  }
});
