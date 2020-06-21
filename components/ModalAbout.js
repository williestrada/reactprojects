import React, {useState} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  Image,
  Alert,
  TouchableOpacity,
  PermissionsAndroid,
  TextInput,
} from 'react-native';

import Fontisto from 'react-native-vector-icons/Fontisto';

import Header from './Header';
import {ScrollView} from 'react-native-gesture-handler';
import SmsAndroid from 'react-native-get-sms-android';
//import {TextInput} from 'react-native-paper';

export default function ModalAbout({aboutOpen, setAboutOpen}) {
  const logo = require('../images/retail.png');
  const about = require('../images/datafast.bmp');
  const [valPhoneNum, setPhoneNum] = useState('');

  const sendSMS = async smsNumber => {
    // let phoneNumbers = {
    //   addressList: ['+639491431584'],
    // };

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.SEND_SMS,
        {
          message: 'InfoPlus needs access to your storage to read a file.',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // Permission has already been granted
        SmsAndroid.autoSend(
          // JSON.stringify(phoneNumbers),  //Puewede multi recipients
          smsNumber,
          'How much do you charge for this retail app?',
          fail => {
            console.log('Failed with this error: ' + fail);
          },
          success => {
            console.log('SMS sent successfully');
          },
        );
      }
    } catch (err) {
      alert(err);
    }
  };

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
            paddingTop: 10,
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
                {'\n\n'}It can interface with mobile barcode scanner devices
                that will take the form of a real scanner and your phone as
                hardware for data storage.
                {'\n\n'}A product item file can be uploaded to serve as first
                level of validation by giving reference to the description of
                the scanned item.
              </Text>
            </View>
            <Text style={{textAlign: 'center', fontSize: 12}}>
              For technical support, comments and feedback,
              {'\n'}Pls. send SMS to 0999-4893981
            </Text>

            {/* <Text //Line
            style={styles.line}>
            {' '}
          </Text> */}
          </ScrollView>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              // backgroundColor: 'yellow',
              width: 180,
            }}>
            <TextInput
              style={{
                backgroundColor: 'white',
                borderRadius: 10,
                margin: 10,
                padding: 10,
                height: 40,
                width: 130,
              }}
              placeholder="enter phone no..."
              defaultValue="09994893981"
              value={valPhoneNum}
              selectTextOnFocus={true}
              onChangeText={val => setPhoneNum(val)}
            />

            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  'Confirm',
                  'Retail app will use your default SMS app in sending messages\n' +
                    'Do you want to send to ' +
                    valPhoneNum +
                    ' ?',
                  [
                    {
                      text: 'No',
                      onPress: () => {
                        return null;
                      },
                      style: 'cancel',
                    },
                    {text: 'YES', onPress: () => sendSMS(valPhoneNum)},
                  ],
                );
              }}>
              <Text
                style={{
                  fontSize: 12,
                  color: 'white',
                  backgroundColor: 'dodgerblue',
                  height: 40,
                  width: 80,
                  textAlign: 'center',
                  alignSelf: 'center',
                  textAlignVertical: 'center',
                }}>
                Send
              </Text>
            </TouchableOpacity>
          </View>
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
    backgroundColor: 'dodgerblue',
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
