import React from 'react';
import {View, Text, Modal, StyleSheet, Image} from 'react-native';

import Fontisto from 'react-native-vector-icons/Fontisto';

import Header from './Header';
import {ScrollView} from 'react-native-gesture-handler';

export default function ModalAbout({aboutOpen, setAboutOpen}) {
  const logo = require('../images/retail.png');
  const about = require('../images/datafast.bmp');

  //  console.log('Rendering About component');
  return (
    <Modal visible={aboutOpen}>
      <Header title={'About'} iconAbout={'questioncircleo'} />
      <View style={styles.modalContainer}>
        <View style={{flex: 1.3}}>
          <Image
            source={about}
            resizeMode="cover"
            style={{height: '100%', borderWidth: 0}}
          />
        </View>
        <View
          style={{
            flex: 2,
            backgroundColor: 'lightgrey',
            paddingTop: 20,
            alignItems: 'center',
          }}>
          <Image
            source={logo}
            style={{width: 50, height: 50}}
            resizeMode="contain"
          />
          <Text> InfoPlus Retail </Text>
          <Text //Line
            style={styles.line}>
            {' '}
          </Text>
          <ScrollView>
            <View
              style={{
                padding: 20,
                backgroundColor: 'gray',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 12,
                  color: 'white',
                }}>
                Handy data collector to keep track of inventory movements
                designed for retail stores.
                {/* {'\n\n'}Available components are Sales and Count modules. */}
                {'\n\n'}Compatible with barcode scanner devices via wireless
                connection using phone's bluetooth feature.
              </Text>
            </View>
            <Text style={{textAlign: 'center', fontSize: 12}}>
              For technical support and feedback,
              {'\n'}Pls. call or send SMS to 0999-4893981
            </Text>

            {/* <Text //Line
            style={styles.line}>
            {' '}
          </Text> */}
          </ScrollView>
        </View>
      </View>
      <View style={styles.bottomMenu}>
        <Fontisto.Button
          style={{color: 'white'}}
          size={20}
          backgroundColor="#00000000"
          onPress={() => {
            setAboutOpen(false);
          }}
          name={Platform.OS === 'android' ? 'check' : 'check'}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Arial',
              fontSize: 12,
            }}>
            Ok
          </Text>
        </Fontisto.Button>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'red',
    flexDirection: 'row',
  },
  bottomMenu: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 2,
    //margin: 5,
    marginLeft: 0,
    borderWidth: 0.8,
    borderColor: 'white',
    backgroundColor: '#333',
  },
  line: {
    width: '100%',
    paddingTop: 20,
    //backgroundColor: 'blue',
    borderBottomColor: 'rgba(0,0,0,.3)',
    height: 10,
    borderBottomWidth: 1,
  },
});
