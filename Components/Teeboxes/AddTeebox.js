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

const slideTime = 700;

export default class AddTeebox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slideAnim: new Animated.Value(Dimensions.get('window').height),
      showAddTeebox: false,
      name: '',
      rating: '',
      slope: ''
    }
  }

  addTeebox = () => {
    const { name } = this.state;
    const rating = parseFloat(this.state.rating);
    const slope = parseInt(this.state.slope);
    axios.post(`http://${this.props.api}/api/teebox`, {  /////// FIX URL
      name,
      rating,
      slope,
      courseId: this.props.course._id,
      userId: this.props.user._id
    }).then(result => {
      if (this.props.updateCourse) {
        this.props.updateCourse(result.data.newTeebox, null, 'add');
      }
      this.props.getUserInfo();
      this.animateClose();
    });
  }

  packTeebox = () => {
    const { name } = this.state;
    const rating = parseFloat(this.state.rating);
    const slope = parseInt(this.state.slope);
    let teebox = { name, rating, slope };
    this.props.addTeebox(teebox);
    this.animateClose();
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
    let addTeebox = this.props.course ? this.addTeebox : this.packTeebox;
    return (
      <Animated.View style={[
        styles.addTeeboxWrapper,
        { transform: [ {translateY: slideAnim} ]}
      ]}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.addTeeboxView}>
            <Text onPress={this.animateClose}>~~~Close~~~</Text>

            <Text>TeeboxName</Text>
            <TextInput
              returnKeyType='next'
              onSubmitEditing={() => this.ratingInput.focus()}
              value={this.state.name}
              onChangeText={name => this.setState({name})}
              style={{backgroundColor: 'red'}}
            />

            <Text>Rating</Text>
            <TextInput
              ref={input => this.ratingInput = input}
              onSubmitEditing={() => this.slopeInput.focus()}
              value={this.state.rating}
              onChangeText={rating => this.setState({rating})}
              keyboardType='numeric'
              maxLength={4}
              style={{backgroundColor: 'red'}}
            />

            <Text>Slope</Text>
            <TextInput
              ref={input => this.slopeInput = input}
              value={this.state.slope}
              onChangeText={slope => this.setState({slope})}
              keyboardType='numeric'
              maxLength={3}
              style={{backgroundColor: 'red'}}
            />

            <Button title='Add teebox' onPress={addTeebox} />

          </View>
        </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  addTeeboxWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'yellow',
    zIndex: 20
  },
  addTeeboxView: {
    ...StyleSheet.absoluteFillObject,
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
