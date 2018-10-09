import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight, Text, View } from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import { colors } from '../../global_styles/colors';
import WhiteText from '../Text/WhiteText';
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

  render() {
    let addCourse = this.state.showAddCourse
                  ? <AddCourse
                      api={this.props.api}
                      user={this.props.user}
                      close={() => this.setState({showAddCourse: false})}
                      getUserInfo={this.props.getUserInfo}
                    />
                  : '';
    let coursePage = this.state.showCourse
                  ? <Course
                      api={this.props.api}
                      user={this.props.user}
                      course={this.state.currentCourse}
                      close={() => this.setState({showCourse: false})}
                      getUserInfo={this.props.getUserInfo}
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
          <WhiteText>YourCourses page</WhiteText>
          <View style={styles.addCourseWrap}>
            <TouchableHighlight onPress={() => this.setState({showAddCourse: true})} underlayColor='rgb(102, 51, 153)'>
              <View style={styles.addCourse}>
                <WhiteText style={ {marginRight: 10} }>Add a course</WhiteText>
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

const { lightBlue, purple } = colors;

const styles = StyleSheet.create({
  yourCourses: {
    flex: 1,
    alignSelf: 'stretch',
    // backgroundColor: '#ea4'
    backgroundColor: lightBlue
    // backgroundColor: purple
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
