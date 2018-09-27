import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import AddCourse from './AddCourse';

export default class YourCourses extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAddMatch: false,
      courses: []
    }
  }

  getCourses = () => {
    console.log('getting courses func');
  }

  componentDidMount() {
    this.getCourses();
  }

  render() {
    let addCourse = this.state.showAddMatch
                  ? <AddCourse
                      user={this.props.user}
                      close={() => this.setState({showAddMatch: false})}
                      getCourses={this.getCourses}
                    />
                  : '';
    return (
      <View style={styles.yourCourses}>
          <Text>YourCourses page</Text>
          <View style={styles.addCourseWrap}>
            <TouchableHighlight onPress={() => this.setState({showAddMatch: true})} underlayColor='rgb(102, 51, 153)'>
              <View style={styles.addCourse}>
                <Text style={ {marginRight: 10} }>Add a course</Text>
                <Icon color='rgb(195, 58, 161)' name='add-circle-outline' />
              </View>
            </TouchableHighlight>
          </View>
          <Text>CourseName</Text>
          <Text>CourseName</Text>
          {addCourse}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  yourCourses: {
    flex: 1,
    alignSelf: 'stretch',
    backgroundColor: '#bfd'
  },
  addCourseWrap: {
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
