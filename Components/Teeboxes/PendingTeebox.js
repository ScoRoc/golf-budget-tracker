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

const slideTime = 700;

export default class Teebox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      slideAnim: new Animated.Value(Dimensions.get('window').height),
      editable: false,
      name: '',
      rating: '',
      slope: ''
    }
  }

  editTeebox = () => {
    let editedTeebox = {
      name: this.state.name,
      rating: parseFloat(this.state.rating),
      slope: parseInt(this.state.slope),
    };
    this.props.updateTeebox(this.props.teeboxIdx, editedTeebox);
    this.setState({editable: false});
  }

  deleteTeebox = () => {
    this.props.deleteTeebox(this.props.teeboxIdx);
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
    let name = this.props.teebox.name ? this.props.teebox.name : '';
    let rating = this.props.teebox.rating ? this.props.teebox.rating.toString() : '';
    let slope = this.props.teebox.slope ? this.props.teebox.slope.toString() : '';
    this.setState({
      name: name,
      rating: rating,
      slope: slope
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
                 ? <Text onPress={this.editTeebox}>Done</Text>
                 : <Text onPress={() => this.setState({editable: true})}>Edit</Text>;
    let name = this.state.name ? this.state.name : '';
    let rating = this.state.rating ? this.state.rating : '';
    let slope = this.state.slope ? this.state.slope : '';
    let deleteTeebox = this.state.editable ? <Button title='Delete teebox' onPress={this.deleteTeebox}  /> : '';
    return (
      <Animated.View style={[
        styles.teeboxWrapper,
        { transform: [ {translateY: slideAnim} ]}
      ]}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.addTeeboxView}>

          <View style={ {flexDirection: 'row', justifyContent: 'space-between'} }>
            <Text onPress={this.animateClose}>~~~Close~~~</Text>
            {editSave}
          </View>

          <Text>Name:</Text>
          <TextInput
            editable={this.state.editable}
            value={name}
            onChangeText={name => this.setState({name})}
          />

          <Text>Rating:</Text>
          <TextInput
            editable={this.state.editable}
            value={rating}
            onChangeText={rating => this.setState({rating})}
            keyboardType='numeric'
            maxLength={4}
          />

          <Text>Slope:</Text>
          <TextInput
            editable={this.state.editable}
            value={slope}
            onChangeText={slope => this.setState({slope})}
            keyboardType='numeric'
            maxLength={3}
          />

          {deleteTeebox}
        </View>
      </TouchableWithoutFeedback>
      </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  teeboxWrapper: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'orange',
    zIndex: 30
  },
  addTeeboxView: {
    ...StyleSheet.absoluteFillObject,
  }
});
