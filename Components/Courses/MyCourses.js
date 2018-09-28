import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import AddCourse from './AddCourse';
import Course from './Course';

export default class MyCourses extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAddCourse: false,
      showCourse: false,
      currentCourse: {}
    }
  }

  touchCourseName = idx => {
    this.setState({currentCourse: this.props.courses[idx], showCourse: true});
  }

  componentDidMount() {
    this.props.getCourses();
  }

  render() {
    let addCourse = this.state.showAddCourse
                  ? <AddCourse
                      user={this.props.user}
                      close={() => this.setState({showAddCourse: false})}
                      getCourses={this.props.getCourses}
                    />
                  : '';
    let coursePage = this.state.showCourse
                  ? <Course
                      user={this.props.user}
                      currentCourse={this.state.currentCourse}
                      close={() => this.setState({showCourse: false})}
                      getCourses={this.props.getCourses}
                    />
                  : '';
    let courses = this.props.courses.map( (course, id) => {
      return (
        <TouchableHighlight onPress={() => this.touchCourseName(id)} underlayColor='rgb(102, 51, 153)' key={id}>
          <Text style={styles.course}>{course.courseName}</Text>
        </TouchableHighlight>
      );
    });
    return (
      <View style={styles.yourCourses}>
          <Text>YourCourses page</Text>
          <View style={styles.addCourseWrap}>
            <TouchableHighlight onPress={() => this.setState({showAddCourse: true})} underlayColor='rgb(102, 51, 153)'>
              <View style={styles.addCourse}>
                <Text style={ {marginRight: 10} }>Add a course</Text>
                <Icon color='rgb(195, 58, 161)' name='add-circle-outline' />
              </View>
            </TouchableHighlight>
          </View>
          {courses}
          {addCourse}
          {coursePage}
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
  course: {
    marginBottom: 3,
    color: 'rgb(195, 58, 161)'
  },
  addCourse: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 30
  }
});
