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

export default function Settings({navigation}) {
  const [valLocation, setLocation] = useState('');
  const [valUserName, setUserName] = useState('');
  const [valMastFile, setMastFile] = useState('');
  const deviceId = DeviceInfo.getDeviceId();
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
        <ScrollView style={styles.scrollView}>
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 10,
              alignItems: 'center',
            }}>
            <Text style={styles.text}>Store: </Text>
            <TextInput
              style={{...styles.textInput, ...styles.textStore}}
              placeholder="store name..."
              autoCapitalize="characters"
              maxLength={10}
              value={valLocation}
              onChangeText={val => setLocation(val)}
            />
          </View>
          <Text //Line
            style={styles.line}>
            {' '}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 5,
              alignItems: 'center',
            }}>
            <Text style={styles.text}>User Name: </Text>
            <TextInput
              style={{...styles.textInput, ...styles.textStore}}
              placeholder="user name..."
              autoCapitalize="characters"
              maxLength={10}
              value={valUserName}
              onChangeText={val => setUserName(val)}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 5,
              alignItems: 'center',
            }}>
            <Text style={styles.text}>Device Id: </Text>
            <TextInput
              style={{...styles.textInput, ...styles.textStore}}
              showSoftInputOnFocus={false}
              onFocus={() => Keyboard.dismiss()}
              value={deviceId}
            />
          </View>
          <Text //Line
            style={styles.line}>
            {' '}
          </Text>
          <View
            style={{
              flexDirection: 'row',
              paddingTop: 5,
              alignItems: 'center',
            }}>
            <Text style={styles.text}>Masterfile: </Text>
            <TextInput
              style={{...styles.textInput, ...styles.textMastFile}}
              placeholder="masterfile..."
              value={valMastFile}
              onChangeText={val => setMastFile(val)}
            />
          </View>
          <Text style={{color: 'white'}}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
            culpa qui officia deserunt mollit anim id est laborum.
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
    marginHorizontal: 20,
  },
  textItem: {
    fontSize: 12,
    color: 'white',
  },
  textStore: {
    width: 120,
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
