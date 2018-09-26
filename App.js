import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import Nav from './Components/Nav';
import Home from './Components/Home';
import Test from './Components/Test';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      page: 'home'
    }
  }

  changePage = page => {
    console.log('heres page: ', page);
    // this.setState({ page });
  }

  render() {

    const pages = {
      home: <Home onPress={() => this.changePage('test')} />,
      test: <Test />
    }

    return (
      <View style={styles.app}>

        <View style={styles.top}>
          <Text>Top asd asd asd asd ads asd asd asd dsa </Text>
        </View>

        {/* <ScrollView style={styles.mid}>
          <Text>Open up App.js to start working on your app!</Text>
          <Text>BLOOP BLOOP BLOOP</Text>
        </ScrollView> */}
        {pages[this.state.page]}

        <Nav changePage={this.changePage} />

      </View>
    );
  }
}

const styles = StyleSheet.create({
  app: {
    flex: 1,
    backgroundColor: '#84d',
    alignItems: 'center',
    justifyContent: 'center',
  },
  top: {
    paddingTop: 50,
    height: 80,
    alignSelf: 'stretch',
    backgroundColor: '#5dd'
  }
});
