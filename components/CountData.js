import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function CountData({data, master}) {
  let nTotalList = data.length;
  let nTotalItems = master.length;
  return (
    <View style={styles.viewCounter}>
      <Text style={styles.txtCounter}>List total = {nTotalList}</Text>
      <Text style={styles.txtTotal}>Total items= {nTotalItems} </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  viewCounter: {
    flexDirection: 'row',
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
