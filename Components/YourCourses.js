import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
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
    axios.get(`http://localhost:3000/api/course/${this.props.user._id}`).then(result => {
      this.setState({courses: result.data.courses});
    });
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
    let courses = this.state.courses.map( (course, id) => {
      return <Text key={id}>{course.courseName}</Text>
    })
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
          {courses}
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
  addCourse: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 30
  }
});
