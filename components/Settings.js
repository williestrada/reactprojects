import React from 'react';
import {View, Text, TouchableOpacity, Button, StyleSheet} from 'react-native';
import Header from './Header';

export default function Settings({navigation}) {
  return (
    <>
      <Header
        navigation={navigation}
        title={'Settings'}
        iconName={'settings'}
      />
    </>
  );
}
