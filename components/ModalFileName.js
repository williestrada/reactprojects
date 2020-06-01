import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';

export default function ModalFileName({modalFileOpen, setModalFileOpen}) {
  const [valFileName, setFileName] = useState('');

  useEffect(() => {
    console.log('Rendering Modal FileName module');
  }, []);

  return (
    <Modal visible={modalFileOpen} animationType="slide" transparent={true}>
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          paddingTop: 20,
          padding: 10,
          top: 130,
          height: 200,
          backgroundColor: 'rgba(200,200,200,20)',
        }}>
        <Text>Enter FileName</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* <Text>{countItem.Quantity}</Text> */}

          <TextInput
            style={{fontSize: 18, backgroundColor: 'grey', textAlign: 'center'}}
            placeholder="filename ..."
            selectTextOnFocus={true}
            value={valFileName}
            autoFocus={true}
            onChangeText={val => setFileName(val)}
          />
        </View>
      </View>

      <View style={styles.bottomMenu}>
        <Icon.Button
          style={{color: 'white'}}
          size={20}
          backgroundColor="#00000000"
          onPress={() => setModalFileOpen(false)}
          name={Platform.OS === 'android' ? 'close' : 'close'}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'Arial',
              fontSize: 12,
            }}>
            Close
          </Text>
        </Icon.Button>

        <Icon.Button
          style={{color: 'white'}}
          size={20}
          backgroundColor="#00000000"
          onPress={() => {
            setModalFileOpen(false);
          }}
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
    </Modal>
  );
}

const styles = StyleSheet.create({
  bottomMenu: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 2,
    margin: 5,
    marginLeft: 0,
    marginBottom: 0,
    borderWidth: 0.8,
    borderColor: 'white',
    backgroundColor: '#333',
  },
});
