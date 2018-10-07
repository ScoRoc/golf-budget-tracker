import React from 'react';
import { View, StyleSheet, Text, DatePickerIOS } from 'react-native';

export default class DatePicker extends React.Component {
  render() {
    return (
      <View style={styles.datePicker}>
        <DatePickerIOS
          date={this.props.date}
          onDateChange={this.props.setDate}
          maximumDate={new Date()}
          minuteInterval={5}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  datePicker: {
    // backgroundColor: 'red',
  }
});
