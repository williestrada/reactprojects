import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import moment from 'moment';

export default function DateInfo() {
  return (
    <View style={styles.viewDate}>
      <Text style={styles.txtDate}>
        {' '}
        {moment()
          .format('llll')
          .substr(0, 17)}{' '}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  viewDate: {
    flexDirection: 'row',
  },
  txtDate: {
    flex: 1,
    color: 'white',
    fontFamily: 'serif',
    fontSize: 12,
    fontStyle: 'italic',
    paddingRight: 10,
    textAlign: 'right',
    backgroundColor: '#00000000',
    //backgroundColor: 'yellow',
  },
});
