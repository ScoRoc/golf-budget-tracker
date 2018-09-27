import React, { Component } from 'react';
import {
  StyleSheet,
  Dimensions,
  Animated,
  DatePickerIOS,
  Keyboard,
  TouchableWithoutFeedback,
  Text,
  TextInput,
  View,
  Button
} from 'react-native';
import Modal from 'react-native-modalbox'
import axios from 'axios';
import DatePicker from './DatePicker';
import { Icon } from 'react-native-elements';

const slideTime = 700;

export default class AddCourse extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slideAnim: new Animated.Value(Dimensions.get('window').width),
      courseName: '',
      notes: ''
    }
  }

  addCourse = () => {
    axios.post('http://localhost:3000/api/course', {
      courseName: this.state.courseName,
      notes: this.state.notes,
      user: this.props.user
    }).then(result => {
      console.log('result.data: ', result.data);
      this.props.getCourses();
      this.animateClose();
    })
  }

  animateClose = () => {
    Animated.timing(
      this.state.slideAnim,
      {
        toValue: Dimensions.get('window').width,
        duration: slideTime
      }
    ).start();
    setTimeout(this.props.close, slideTime);
  }

  componentDidMount() {
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
    return (
      <Animated.View style={[
        styles.addMatchesWrapper,
        { transform: [ {translateX: slideAnim} ]}
      ]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.addMatchesView}>
          <Text onPress={this.animateClose}>~~~Close~~~</Text>
          <Text>CourseName</Text>
          <TextInput
            value={this.state.courseName}
            onChangeText={courseName => this.setState({courseName})}
            style={{backgroundColor: 'red'}}
          />
          <Text>Notes</Text>
          <TextInput
            value={this.state.notes}
            onChangeText={notes => this.setState({notes})}
            multiline={true}
            style={{backgroundColor: 'red'}}
          />
          <Button title='Add course' onPress={this.addCourse} />
        </View>
      </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  addMatchesWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'yellow'
  },
  addMatchesView: {
    ...StyleSheet.absoluteFillObject,
  }
});