import React, { Component } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View
} from 'react-native';
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
        <TouchableHighlight onPress={() => this.touchCourseName(id)} style={styles.courseOuterWrap} underlayColor='rgb(102, 51, 153)' key={id}>
          <View style={styles.courseInnerWrap}>
            <WhiteText>{course.courseName}</WhiteText>
            <Icon
              name='chevron-right'
              type='font-awesome'
              size={20}
              color={colors.yellow}
              iconStyle={styles.icon}
            />
          </View>
        </TouchableHighlight>
      );
    });
    return (
      <View style={styles.yourCourses}>

        <ScrollView contentContainerStyle={ {flexGrow: 1} }>

          <ImageBackground blurRadius={0} imageStyle={styles.image} style={styles.imgBG} source={ require('../../assets/imgs/course_aerial.jpeg') }>
            <View style={styles.titleWrap}>
              <WhiteText style={styles.title}>My courses</WhiteText>
            </View>
          </ImageBackground>

          <View style={styles.addCourseWrap}>
            <TouchableOpacity onPress={() => this.setState({showAddCourse: true})} activeOpacity={.5}>
              <View style={styles.addCourse}>
                <Icon color={yellow} size={60} name='add-circle-outline' />
                <WhiteText>Add a course</WhiteText>
              </View>
            </TouchableOpacity>
          </View>

          {courses}

        </ScrollView>

        {addCourse}
        {coursePage}

      </View>
    );
  }
}

const { darkGrey, darkOffWhite, lightBlue, mediumGrey, offWhite, purple, steelBlue, yellow } = colors;

const styles = StyleSheet.create({
  yourCourses: {
    flex: 1,
    alignSelf: 'stretch',
    height: '100%',
    backgroundColor: lightBlue
  },
  imgBG: {
    height: 150,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  image: {
    width: '100%',
    resizeMode: 'cover'
  },
  titleWrap: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, .4)'
  },
  title: {
    fontSize: 19,
  },
  addCourseWrap: {
    marginTop: 30,
    marginBottom: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: 'black',
    shadowOpacity: .7,
    shadowRadius: 3,
    shadowOffset: {width: 0, height: 0}
  },
  addCourse: {
    height: 120,
    width: 120,
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: steelBlue,
    borderRadius: 15
  },
  courseOuterWrap: {
    width: '100%',
    alignItems: 'center'
  },
  courseInnerWrap: {
    width: '90%',
    marginBottom: 5,
    padding: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: darkOffWhite
  }
});
