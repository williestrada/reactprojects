import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import UserContext from './UserContext';
import Icon from 'react-native-vector-icons/Fontisto';
import DatePicker from 'react-native-datepicker';
//import DateTimePicker from '@react-native-community/datetimepicker';
//import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
{
  /* <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEnabled></KeyboardAwareScrollView> */
}

export default function ModalSales() {
  const {product, setSalesDtl, modalOpen, setModalOpen} = useContext(
    UserContext,
  );
  const [date, setDate] = useState(new Date());
  const [valQuantity, setQuantity] = useState('');
  const [valOtherCde, setOtherCde] = useState('');
  const [valDescript, setDescript] = useState('');
  const [valItemPrce, setItemPrce] = useState('');
  const [textMessage, setMessage] = useState('');
  console.log('Rendering Modal Sales ');

  //jest.mock('react-native/Libraries/Animated/src/NativeAnimatedHelper');

  const saveSalesData = () => {
    setSalesDtl(prevSales => {
      return [
        ...prevSales,
        {
          Date____: Date(),
          Quantity: parseInt(valQuantity, 10),
          OtherCde: valOtherCde,
          Descript: valDescript,
          ItemPrce: parseFloat(valItemPrce),
        },
      ];
    });

    setOtherCde('');
    setDescript('');
    setQuantity('');
    setItemPrce('');
    setTimeout(() => {
      setMessage('');
    }, 5000);
    setMessage('Data is saved.');
    //setModalOpen(false)
  };

  return (
    <Modal visible={modalOpen} animationType="slide" transparent={true}>
      <KeyboardAvoidingView
        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
        enableOnAndroid={true}
        enableAutoAutomaticScroll={true}>
        <View style={styles.modalView}>
          <View style={{flex: 1}}>
            <View style={styles.inputView}>
              <DatePicker
                style={{width: 200, fontSize: 12}}
                date={date} //initial date from state
                mode="date" //The enum of date, datetime and time
                placeholder="select date"
                format="MM-DD-YYYY"
                minDate="01-01-2016"
                maxDate="01-01-2030"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 10,
                    top: 4,
                    marginLeft: 0,
                  },
                  dateInput: {
                    marginLeft: 70,
                    color: 'white',
                    borderRadius: 10,
                    fontSize: 12,
                  },
                }}
                onDateChange={date => {
                  setDate(date);
                }}
              />
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <View style={styles.inputView}>
                <Text style={styles.inputLabel}>Quantity</Text>
                <TextInput
                  style={{...styles.textInput, ...styles.textNumber}}
                  placeholder="Enter quantity ..."
                  value={valQuantity}
                  keyboardType={'number-pad'}
                  onChangeText={valQuantity => setQuantity(valQuantity)}
                />
              </View>
              <View style={styles.inputView}>
                <Text style={styles.inputLabel}>Item Price</Text>
                <TextInput
                  style={{...styles.textInput, ...styles.textNumber}}
                  placeholder="Enter item price ..."
                  keyboardType={'number-pad'}
                  value={valItemPrce}
                  onChangeText={val => setItemPrce(val)}
                />
              </View>
            </View>

            <View style={styles.inputView}>
              <Text style={styles.inputLabel}>Bar Code</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter bar code ..."
                value={valOtherCde}
                onChangeText={val => setOtherCde(val)}
              />
            </View>

            <View style={styles.inputView}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Enter description ..."
                value={valDescript}
                onChangeText={val => setDescript(val)}
              />
            </View>
            <View style={styles.inputView}>
              <Text style={styles.msgLabel}>{textMessage}</Text>
              <View style={styles.bottomMenu}>
                <Icon.Button
                  style={{color: 'white'}}
                  size={20}
                  backgroundColor="#00000000"
                  onPress={() => setModalOpen(false)}
                  name={Platform.OS === 'android' ? 'close' : 'close'}>
                  <Text
                    style={{
                      color: 'white',
                      fontFamily: 'Arial',
                      fontSize: 12,
                    }}>
                    Cancel
                  </Text>
                </Icon.Button>

                <Icon.Button
                  style={{color: 'white'}}
                  size={20}
                  backgroundColor="#00000000"
                  onPress={() => saveSalesData()}
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
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  modalView: {
    //flex: 1,
    //     height: '75%',
    //     width: '90%',
    height: '100%',
    width: '100%',
    backgroundColor: '#333',
    backgroundColor: 'steelblue',
    alignSelf: 'center',
    //top: 47,
    position: 'absolute',
    borderStyle: 'solid',
    borderWidth: 1,
    padding: 10,
  },
  inputLabel: {
    borderWidth: 0,
    paddingLeft: 10,
    color: 'white',
    fontSize: 14,
    //backgroundColor: 'blue',
  },
  inputView: {
    marginTop: 3,
    paddingTop: 0,
    //backgroundColor: 'yellow',
  },
  textNumber: {
    width: 165,
  },
  textInput: {
    backgroundColor: 'white',
    //    alignSelf: 'stretch',
    paddingLeft: 10,
    fontSize: 14,
    borderWidth: 1,
    borderRadius: 10,
    height: 40, //TextBox height
  },
  msgLabel: {
    color: 'white',
    textAlign: 'center',
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
