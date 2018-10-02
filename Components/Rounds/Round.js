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
      course: null,
      courseId: '',
      teebox: '',
      teeboxId: '',
      date: new Date(),
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

  deleteTeebox = () => {
    // axios({
    //   url: 'http://localhost:3000/api/teebox',  /////// FIX URL
    //   method: 'delete',
    //   data: {id: this.props.teebox._id}
    // }).then(result => {
    //   this.props.deleteTeebox(this.props.teeboxIdx);
    //   this.animateClose();
    // })
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
    // this.setState({
    //   name: this.props.teebox.name,
    //   rating: this.props.teebox.rating.toString(),
    //   slope: this.props.teebox.slope.toString()
    // });
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
    // let name = this.state.name ? this.state.name : '';
    // let rating = this.state.rating ? this.state.rating : '';
    // let slope = this.state.slope ? this.state.slope : '';
    // let deleteTeebox = this.state.editable ? <Button title='Delete teebox' onPress={this.deleteTeebox}  /> : '';
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
            <Text>courseId: {this.props.round.courseId}</Text>
            <Text>teeboxId: {this.props.round.teeboxId}</Text>
            <Text>date: {this.props.round.date}</Text>
            <Text>score: {this.props.round.score}</Text>
            <Text>price: {this.props.round.price}</Text>
            <Text>notes: {this.props.round.notes}</Text>




            {/* <TextInput
              editable={this.state.editable}
              value={name}
              onChangeText={name => this.setState({name})}
            /> */}

            {/* <TextInput
              editable={this.state.editable}
              value={rating}
              onChangeText={rating => this.setState({rating})}
              keyboardType='numeric'
              maxLength={4}
            /> */}

            {/* <TextInput
              editable={this.state.editable}
              value={slope}
              onChangeText={slope => this.setState({slope})}
              keyboardType='numeric'
              maxLength={3}
            /> */}

            {/* {deleteTeebox} */}




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
