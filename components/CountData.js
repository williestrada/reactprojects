import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function CountData({
  data1,
  data2,
  label1 = 'List total = ',
  label2 = 'Total items= ',
}) {
  let nTotalList = data1;
  let nTotalItems = data2;
  return (
    <View style={styles.viewCounter}>
      <Text style={styles.txtCounter}>
        {label1}
        {nTotalList}
      </Text>
      <Text style={styles.txtTotal}>
        {label2} {nTotalItems}{' '}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  viewCounter: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,.8)',
    marginBottom: 0,
  },
  txtCounter: {
    flex: 2,
    color: 'white',
    fontFamily: 'serif',
    fontSize: 12,
    fontStyle: 'italic',
    paddingLeft: 10,
    backgroundColor: '#00000000',
  },
  txtTotal: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    alignSelf: 'flex-end',
    paddingRight: 10,
    backgroundColor: '#00000000',
  },
});
