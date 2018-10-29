import React, { Component } from 'react';
import {
  AsyncStorage,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import axios from 'axios';

class Signup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: '',
      email: '',
      password: ''
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    axios.post(`${this.props.http}${this.props.api}/api/auth/signup`, {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    }).then( result => {
      if (result.data.err) {
        this.props.errMsgPopup(result.data.err.msg);
        return;
      }
      AsyncStorage.setItem('golf-budget-tracker-token', result.data.token)
      this.props.liftToken(result.data);
      this.props.getUserInfo();
      this.props.changePageFromAuth();
    }).catch( err => console.log(err) );
  }

  render() {
    const { passedStyles } = this.props;
    const { placeholderColor } = this.props;
    return (
      <View style={[passedStyles.inputWrap, {height: '45%'}]}>

        <Text style={passedStyles.label}>Signup</Text>

        <View style={passedStyles.textInputWrap}>
          <TextInput
            placeholder='Full Name'
            placeholderTextColor={placeholderColor}
            clearButtonMode='while-editing'
            style={passedStyles.textInput}
            value={this.state.name}
            autoCapitalize='words'
            onChangeText={ name => this.setState({name}) }
          />
        </View>

        <View style={passedStyles.textInputWrap}>
          <TextInput
            placeholder='Email'
            placeholderTextColor={placeholderColor}
            clearButtonMode='while-editing'
            style={passedStyles.textInput}
            value={this.state.email}
            textContentType='emailAddress'
            keyboardType='email-address'
            autoCapitalize='none'
            onChangeText={ email => this.setState({email}) }
          />
        </View>

        <View style={passedStyles.textInputWrap}>
          <TextInput
            placeholder='Password'
            placeholderTextColor={placeholderColor}
            clearButtonMode='while-editing'
            style={passedStyles.textInput}
            value={this.state.password}
            textContentType='password'
            autoCapitalize='none'
            secureTextEntry={true}
            onChangeText={ password => this.setState({password}) }
          />
        </View>

        <TouchableOpacity
          onPress={this.handleSubmit}
          style={passedStyles.button}
        >
          <Text style={passedStyles.buttonText}>Signup</Text>
        </TouchableOpacity>
      </View>
    )
  }

};

export default Signup;
