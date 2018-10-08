import React, { Component } from 'react';
import { AsyncStorage, StyleSheet, Text, TextInput, View, Button } from 'react-native';
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
    e.preventDefault()
    axios.post('http://localhost:3000/api/auth/signup', {  ////////////// FIX FIX FIX FIX FIX FIX FIX
      name: this.state.name,
      email: this.state.email,
      password: this.state.password
    }).then( result => {
      AsyncStorage.setItem('golf-budget-tracker-token', result.data.token) // change 'mernToken' to your app name or something useful
      this.props.liftToken(result.data);
      this.props.getUserInfo();
      this.props.changePage('home');
    })
  }

  render() {
    const { passedStyles } = this.props;
    return (
      <View style={passedStyles.inputWrap}>
        {/* <Text style={passedStyles.text}>Name:</Text> */}
        <TextInput
          placeholder='Full Name'
          style={passedStyles.textInput}
          value={this.state.name}
          autoCapitalize='words'
          onChangeText={ name => this.setState({name}) }
        />

        {/* <Text style={passedStyles.text}>Email:</Text> */}
        <TextInput
          placeholder='Email'
          style={passedStyles.textInput}
          value={this.state.email}
          textContentType='emailAddress'
          keyboardType='email-address'
          autoCapitalize='none'
          onChangeText={ email => this.setState({email}) }
        />

        {/* <Text style={passedStyles.text}>Password:</Text> */}
        <TextInput
          placeholder='Password'
          style={passedStyles.textInput}
          value={this.state.password}
          textContentType='password'
          autoCapitalize='none'
          onChangeText={ password => this.setState({password}) }
        />
        <Button
          title='Sign Up!'
          onPress={this.handleSubmit}
          style={passedStyles.button}
        />
      </View>
    )
  }

};

const styles = {
//
}

export default Signup;
