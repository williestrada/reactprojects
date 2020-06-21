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
  Keyboard,
} from 'react-native';

import Fontisto from 'react-native-vector-icons/Fontisto';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Header from './Header';
import {
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native-gesture-handler';
import SmsAndroid from 'react-native-get-sms-android';
//import {TextInput} from 'react-native-paper';

export default function ModalAbout({aboutOpen, setAboutOpen}) {
  const logo = require('../images/retail.png');
  const about = require('../images/datafast.bmp');
  const [valPhoneNum, setPhoneNum] = useState('09994893981');
  const [valPhoneMsg, setPhoneMsg] = useState('');
  const [valmsgHeight, setMsgHeight] = useState(0);

  const phonenum = React.useRef();
  const phonemsg = React.useRef();

  const sendSMS = async () => {
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
          // JSON.stringify(phoneNumbers),  //Puwede multi recipients
          JSON.stringify('[' + valPhoneNum + ']'),
          valPhoneMsg + '\n\n-msg sent from Retail App',
          fail => {
            alert('Failed to send message: ' + fail);
          },
          success => {
            alert('SMS sent to ' + valPhoneNum);
          },
        );
      }
    } catch (err) {
      alert(err);
    }
  };

  let nHeight = valmsgHeight;
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
          {/* <ScrollView> */}
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
              Handy data collector to keep track of inventory movements designed
              for retail stores.
              {'\n\n'}It can interface with mobile barcode scanner devices that
              will take the form of a real scanner and your phone as hardware
              for data storage.
              {'\n\n'}A product item file can be uploaded to serve as first
              level of validation and reference to the description of the
              scanned item.
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              setMsgHeight(140);
              //setPhoneNum('09994893981')
            }}>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 12,
                color: 'blue',
                fontStyle: 'italic',
              }}>
              For technical support, comments and feedback,
              {'\n'}Tap here to send SMS to 0999-4893981
            </Text>
          </TouchableOpacity>

          {/* <Text //Line
            style={styles.line}>
            {' '}
          </Text> */}
          {/* </ScrollView> */}
        </View>
      </View>
      <View
        style={{
          height: nHeight,
          backgroundColor: 'white',
        }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
          }}>
          <View style={{flex: 1}}>
            <TextInput
              ref={phonenum}
              style={{
                backgroundColor: 'lightgrey',
                height: nHeight / 3,
                textAlign: 'center',
                fontSize: 18,
              }}
              placeholder="enter phone no..."
              defaultValue="09994893981"
              value={valPhoneNum}
              selectTextOnFocus={true}
              onChangeText={val => setPhoneNum(val)}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              setMsgHeight(0), Keyboard.dismiss(), setAboutOpen(false);
            }}>
            <Icon
              name="cancel"
              size={24}
              color="white"
              style={{
                backgroundColor: 'red',
                height: nHeight / 3,
                width: 80,
                textAlign: 'center',
                textAlignVertical: 'center',
              }}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (!valPhoneNum || valPhoneNum.length < 11) {
                alert('Invalid phone no.\nPls. enter phone no. to send.');
                phonenum.current.focus();
                return null;
              }
              if (!valPhoneMsg) {
                alert('Pls. enter message to send.');
                phonemsg.current.focus();
                return null;
              }
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
                  {
                    text: 'YES',
                    onPress: () => {
                      {
                        sendSMS(valPhoneNum),
                          setPhoneNum(''),
                          phonenum.current.focus();
                      }
                    },
                  },
                ],
              );
            }}>
            <Icon
              name="send"
              size={24}
              color="white"
              style={{
                backgroundColor: 'dodgerblue',
                height: nHeight / 3,
                width: 80,
                textAlign: 'center',
                textAlignVertical: 'center',
              }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            //backgroundColor: 'red',
            borderColor: 'rgb(250,250,250)',
          }}>
          <TextInput
            ref={phonemsg}
            placeholder="enter message..."
            value={valPhoneMsg}
            selectTextOnFocus={true}
            multiline={true}
            onChangeText={val => setPhoneMsg(val)}
          />
        </View>
      </View>
      <View style={styles.bottomMenu}>
        <Fontisto.Button
          style={{color: 'white'}}
          size={20}
          backgroundColor="#00000000"
          onPress={() => {
            {
              setMsgHeight(0), setPhoneMsg(''), setAboutOpen(false);
            }
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
