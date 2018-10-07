import React, { Component } from 'react';
import {
  Animated,
  Button,
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import AddTeebox from '../Teeboxes/AddTeebox';
import Teebox from '../Teeboxes/Teebox';

const slideTime = 700;

export default class Course extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slideAnim: new Animated.Value(Dimensions.get('window').height),
      showAddTeebox: false,
      showTeexbox: false,
      currentTeeboxIdx: '',
      course: null,
      name: '',
      notes: '',
      editable: false
    }
  }

  updateCourseLocalState = (teebox, idx, type) => {
    let updatedCourse = {...this.state.course};
    switch (type) {
      case 'add':
        updatedCourse.teeboxes.push(teebox);
        break;
      case 'edit':
        updatedCourse.teeboxes[idx] = teebox;
        break;
      case 'delete':
        updatedCourse.teeboxes.splice(idx, 1);
        break;
    }
    this.setState({updatedCourse});
  }

  editCourse = () => {
    axios.put('http://localhost:3000/api/course', {  /////// FIX URL
      courseName: this.state.name,
      notes: this.state.notes,
      courseId: this.state.course._id
    }).then(result => {
      this.setState({editable: false});
      this.props.getUserInfo();
    })
  }

  deleteCourse = () => {
    axios({
      url: 'http://localhost:3000/api/course',  /////// FIX URL
      method: 'delete',
      data: {courseId: this.state.course._id}
    }).then(result => {
      this.props.getUserInfo();
      this.animateClose();
    })
  }

  animateClose = () => {
    Animated.timing(
      this.state.slideAnim,
      {
        toValue: Dimensions.get('window').height,
        duration: slideTime
      }
    ).start();
    setTimeout(this.props.close, slideTime);
  }

  componentDidMount() {
    let course = this.props.course;
    this.setState({
      course: course,
      name: course.courseName,
      notes: course.notes
    });
    Animated.timing(
      this.state.slideAnim,
      {
        toValue: 0,
        duration: slideTime
      }
    ).start();
  }

  render() {
    if (this.state.course) this.state.course.teeboxes.forEach(teebox => console.log('teebox handi: ', teebox))
    let { slideAnim } = this.state;
    let editSave = this.state.editable
                 ? <Text onPress={this.editCourse}>Done</Text>
                 : <Text onPress={() => this.setState({editable: true})}>Edit</Text>;
    let name = this.state.course ? this.state.course.courseName : '';
    let notes = this.state.course ? this.state.course.notes : '';
    let deleteCourse = this.state.editable ? <Button title='Delete course' onPress={this.deleteCourse}  /> : '';
    const teeboxes = this.state.course
                   ? this.state.course.teeboxes.map((teebox, idx) => {
                       return (
                         <TouchableHighlight onPress={() => this.setState({ currentTeeboxIdx: idx, showTeebox: true })} underlayColor='rgb(102, 51, 153)' key={idx}>
                           <Text style={styles.teebox}>{teebox.name} --- teebox handicap: {teebox.teeboxHandicap}</Text>
                         </TouchableHighlight>
                       )
                     })
                   : '';
    let teeboxPage = this.state.showTeebox
                   ? <Teebox
                       user={this.props.user}
                       close={() => this.setState({showTeebox: false})}
                       teebox={this.state.course.teeboxes[this.state.currentTeeboxIdx]}
                       teeboxIdx={this.state.currentTeeboxIdx}
                       updateCourse={this.updateCourseLocalState}
                       getUserInfo={this.props.getUserInfo}
                     />
                   : '';
    let addTeebox = this.state.showAddTeebox
                  ? <AddTeebox
                      user={this.props.user}
                      close={() => this.setState({showAddTeebox: false})}
                      course={this.state.course}
                      updateCourse={this.updateCourseLocalState}
                      getUserInfo={this.props.getUserInfo}
                    />
                  : '';
    let addTeeboxPlus = this.state.editable
                      ? <TouchableHighlight onPress={() => this.setState({showAddTeebox: true})} underlayColor='rgb(102, 51, 153)'>
                          <View style={styles.addTeebox}>
                            <Text style={ {marginRight: 10} }>Add</Text>
                            <Icon color='rgb(195, 58, 161)' name='add-circle-outline' />
                          </View>
                        </TouchableHighlight>
                      : '';
    return (
      <Animated.View style={[
        styles.addCoursesWrapper,
        { transform: [ {translateY: slideAnim} ]}
      ]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.addCoursesView}>
          <View style={ {flexDirection: 'row', justifyContent: 'space-between'} }>
            <Text onPress={this.animateClose}>~~~Close~~~</Text>
            {editSave}
          </View>

          <Text>Course name:</Text>
          <TextInput
            editable={this.state.editable}
            value={name}
            onChangeText={text => this.setState({name: text})}
          />

          <Text>Notes:</Text>
          <TextInput
            editable={this.state.editable}
            value={notes}
            onChangeText={text => this.setState({notes: text})}
          />

          <View style={styles.addTeeboxWrap}>
            <Text>Tee Boxes</Text>
            {addTeeboxPlus}
          </View>

          {teeboxes}
          {teeboxPage}

          {addTeebox}

          {deleteCourse}
        </View>
      </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  addCoursesWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'orange'
  },
  addCoursesView: {
    ...StyleSheet.absoluteFillObject,
  },
  teebox: {
    marginBottom: 3,
    color: 'rgb(195, 58, 161)'
  },
  addTeeboxWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  addTeebox: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 30
  },
});
