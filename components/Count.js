import React, {useState} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';

import Header from './Header';
import Icon from 'react-native-vector-icons/Fontisto';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';

export default function Count({navigation}) {
  const [valLocation, setLocation] = useState('');
  const deviceId = DeviceInfo.getDeviceId();
  console.log('Rendering Count component');

  return (
    <>
      <Header navigation={navigation} title={'Count'} iconName={'settings'} />
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require('../images/abstract_dark_red2.png')}
          style={styles.imgBackground}
          imageStyle={styles.imgStyle}
        />
        <ScrollView style={styles.scrollView}>
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 10,
              alignItems: 'center',
            }}>
            <Text style={styles.text}>Store: </Text>
            <TextInput
              style={{...styles.textInput, ...styles.textBarCode}}
              placeholder="barcode ..."
              autoCapitalize="characters"
              maxLength={20}
              value={valLocation}
              onChangeText={val => setLocation(val)}
            />
          </View>
          <Text //Line
            style={styles.line}>
            {' '}
          </Text>
        </ScrollView>
        <View style={styles.bottomMenu}>
          <Icon.Button
            style={{color: 'white'}}
            size={20}
            backgroundColor="#00000000"
            onPress={() => ''}
            name={Platform.OS === 'android' ? 'save' : 'save'}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Arial',
                fontSize: 12,
              }}>
              Save
            </Text>
          </Icon.Button>
        </View>
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
  scrollView: {
    backgroundColor: '#00000000',
    marginHorizontal: 10,
  },
  textItem: {
    fontSize: 12,
    color: 'white',
  },
  textBarCode: {
    width: 200,
  },
  textMastFile: {
    width: 200,
  },
  textInput: {
    backgroundColor: 'rgba(250,250,250,.7)',
    padding: 10,
    fontSize: 12,
    borderWidth: 0.5,
    borderRadius: 8,
    height: 40, //TextBox height
  },

  line: {
    width: '100%',
    marginTop: 10,
    marginBottom: 0,
    //backgroundColor: 'blue',
    borderTopColor: 'rgba(250,250,250,.5)',
    height: 10,
    borderTopWidth: 1,
  },

  text: {
    fontSize: 14,
    color: 'white',
    width: 90,
  },

  bottomMenu: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 2,
    margin: 5,
    marginLeft: 0,
    borderWidth: 0.8,
    borderColor: 'white',
    backgroundColor: '#333',
  },
});
