import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import Header from './Header';

export default function Settings({navigation}) {
  console.log('Rendering Settings component');

  return (
    <>
      <Header
        navigation={navigation}
        title={'Settings'}
        iconName={'settings'}
      />
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require('../images/settingsBackGround.png')}
          style={styles.imgBackground}
          imageStyle={styles.imgStyle}
        />
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBackground: {
    width: '100%',
    height: '100%',
    alignSelf: 'center',
    backgroundColor: '#333',
    position: 'absolute', // covers the whole SafeAreaView
  },
  imgStyle: {
    resizeMode: 'stretch',
    opacity: 0.4,
  },
});
