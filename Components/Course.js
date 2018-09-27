import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  Animated,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  TextInput,
  View,
  Button
} from 'react-native';
import axios from 'axios';

const slideTime = 700;

export default class Course extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slideAnim: new Animated.Value(Dimensions.get('window').height),
      course: null,
      name: '',
      notes: '',
      editable: false
    }
  }

  editCourse = () => {
    console.log('name: ', this.state.name, 'notes: ', this.state.notes)
    axios.put('http://localhost:3000/api/course', {
      courseName: this.state.name,
      notes: this.state.notes,
      courseId: this.state.course._id
    }).then(result => {
      console.log('result.data: ', result.data);
      this.props.getCourses();
      // this.animateClose();
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
    let course = this.props.currentCourse;
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
    let { slideAnim } = this.state;
    let editSave = this.state.editable
                 ? <Text onPress={this.editCourse}>Save</Text>
                 : <Text onPress={() => this.setState({editable: true})}>Edit</Text>;
    let name = this.state.course ? this.state.course.courseName : '';
    let notes = this.state.course ? this.state.course.notes : '';
    return (
      <Animated.View style={[
        styles.addMatchesWrapper,
        { transform: [ {translateY: slideAnim} ]}
      ]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.addMatchesView}>
          <View style={ {flexDirection: 'row', justifyContent: 'space-between'} }>
            <Text onPress={this.animateClose}>~~~Close~~~</Text>
            {editSave}
          </View>
          <TextInput
            editable={this.state.editable}
            value={name}
            onChangeText={text => this.setState({name: text})}
          />
          <TextInput
            editable={this.state.editable}
            value={notes}
            onChangeText={text => this.setState({notes: text})}
          />
        </View>
      </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  addMatchesWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'orange'
  },
  addMatchesView: {
    ...StyleSheet.absoluteFillObject,
  }
});
