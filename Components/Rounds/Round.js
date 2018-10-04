import React, { Component } from 'react';
import {
  Animated,
  Button,
  Dimensions,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View
} from 'react-native';
import axios from 'axios';

const slideTime = 700;

export default class Round extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slideAnim: new Animated.Value(Dimensions.get('window').height),
      editable: false,
      showDatePicker: false,
      showCoursePicker: false,
      showTeeboxPicker: false,
      showAddCourse: false,
      roundId: '',
      course: null,
      courseId: '',
      teebox: null,
      teeboxId: '',
      date: '',
      score: '',
      price: '',
      notes: ''
    }
  }

  editRound = () => {
    // let { name } = this.state;
    // let rating = parseFloat(this.state.rating);
    // let slope = parseInt(this.state.slope);
    // axios.put('http://localhost:3000/api/teebox', {  /////// FIX URL
    //   name,
    //   rating,
    //   slope,
    //   id: this.props.teebox._id
    // }).then(result => {
    //   this.props.editTeebox(result.data.updatedTeebox, this.props.teeboxIdx);
      this.setState({editable: false});
    // });
  }

  deleteRound = () => {
    axios({
      url: 'http://localhost:3000/api/round',  /////// FIX URL
      method: 'delete',
      data: {id: this.state.roundId}
    }).then(result => {
      this.props.getUserInfo();
      this.animateClose();
    });
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
    let { date, notes } = this.props.round;
    let score = this.props.round.score.toString();
    let price = this.props.round.score.toString();
    let course = 'No course selected';
    let teebox = 'No teebox selected';
    this.props.courses.forEach(oneCourse => {
      if (oneCourse._id === this.props.round.courseId) {
        course = oneCourse;
        oneCourse.teeboxes.forEach(oneTeebox => {
          if (oneTeebox._id === this.props.round.teeboxId) {
            teebox = oneTeebox;
          }
        });
      }
    });
    this.setState({
      roundId: this.props.round._id,
      course,
      courseId: course._id,
      teebox,
      teeboxId: teebox._id,
      date,
      score,
      price,
      notes
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
                 ? <Text onPress={this.editRound}>Done</Text>
                 : <Text onPress={() => this.setState({editable: true})}>Edit</Text>;
    let deleteRound = this.state.editable ? <Button title='Delete round' onPress={this.deleteRound}  /> : '';
    return (
      <Animated.View style={[
        styles.roundWrapper,
        { transform: [ {translateY: slideAnim} ]}
      ]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.addRoundView}>


            <View style={ {flexDirection: 'row', justifyContent: 'space-between'} }>
              <Text onPress={this.animateClose}>~~~Close~~~</Text>
              {editSave}
            </View>




            <Text>hello from Round</Text>
            <Text>courseName: {this.state.courseId}</Text>
            <Text>teeboxId: {this.props.round.teeboxId}</Text>
            <Text>date: {this.props.round.date}</Text>




            {/* <View style={styles.selectAndAddWrap}>
              <Text onPress={() => this.setState({showCoursePicker: true})}>{courseName}</Text>
              <TouchableHighlight onPress={() => this.setState({showAddCourse: true})} underlayColor='rgb(102, 51, 153)'>
                <View style={styles.addButton}>
                  <Text style={ {marginRight: 10} }>Add</Text>
                  <Icon color='rgb(195, 58, 161)' name='add-circle-outline' />
                </View>
              </TouchableHighlight>
            </View>
            <Modal
              style={styles.modal}
              isOpen={this.state.showCoursePicker}
              backdropPressToClose={true}
              position='bottom'
              backdrop={true}
              animationDuration={500}
              onClosed={() => this.setState({showCoursePicker: false})}
              >
                <Picker selectedValue={this.state.courseId} onValueChange={(courseId, idx) => this.handleCoursePicker(courseId, idx)}>
                  <Picker.Item label='Please select a course...' value='pick' />
                  {courses}
                </Picker>
            </Modal> */}
            {/* {addCourse} */}

            {/* <View style={styles.selectAndAddWrap}> */}
              {/* <Text onPress={this.touchTeeboxName}>{teebox}</Text> */}
              {/* <TouchableHighlight onPress={() => this.setState({showAddTeebox: true})} underlayColor='rgb(102, 51, 153)'>
                <View style={styles.addButton}>
                  <Text style={ {marginRight: 10} }>Add</Text>
                  <Icon color='rgb(195, 58, 161)' name='add-circle-outline' />
                </View>
              </TouchableHighlight>
            </View> */}
            {/* <Modal
              style={styles.modal}
              isOpen={this.state.showTeeboxPicker}
              backdropPressToClose={true}
              position='bottom'
              backdrop={true}
              animationDuration={500}
              onClosed={() => this.setState({showTeeboxPicker: false})}
              >
                <Picker selectedValue={this.state.teeboxId} onValueChange={(teeboxId, idx) => this.handleTeeboxPicker(teeboxId, idx)}>
                  <Picker.Item label='Please select a course...' value='pick' />
                  {teeboxes}
                </Picker>
            </Modal> */}
            {/* {addTeebox} */}

            {/* <Text onPress={() => this.setState({showDatePicker: true})}>
              {this.state.date.toDateString()} {this.state.date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
            </Text>
            <Modal
              style={styles.modal}
              isOpen={this.state.showDatePicker}
              backdropPressToClose={true}
              position='bottom'
              backdrop={true}
              animationDuration={500}
              onClosed={() => this.setState({showDatePicker: false})}
              >
                <DatePicker date={this.state.date} setDate={date => this.setState({date})} />
            </Modal> */}

            <Text>Score</Text>
            <TextInput
              value={this.state.score}
              onChangeText={score => this.setState({score})}
              keyboardType='numeric'
              maxLength={3}
              editable={this.state.editable}
            />

            <Text>Price</Text>
            <TextInput
              value={this.state.price}
              onChangeText={price => this.setState({price})}
              keyboardType='numeric'
              maxLength={3}
            />

            <Text>Notes</Text>
            <TextInput
              value={this.state.notes}
              onChangeText={notes => this.setState({notes})}
              multiline={true}
              style={{backgroundColor: 'red'}}
            />





            {deleteRound}




          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  roundWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'orange',
    zIndex: 30
  },
  addRoundView: {
    ...StyleSheet.absoluteFillObject,
  }
});
