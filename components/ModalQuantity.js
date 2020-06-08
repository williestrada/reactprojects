import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from 'react-native';

//import UserContext from './UserContext';
import {saveCount} from '../src/RetailAPI';

import Icon from 'react-native-vector-icons/Fontisto';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ModalQuantity({
  countItem,
  modalQtyOpen,
  setModalQtyOpen,
  countDtl,
  setCountDtl,
  totalQty,
  setTotalQty,
}) {
  // const {product} = useContext(UserContext);

  if (typeof countItem.Quantity == 'undefined') return null; //omg thanks to null return
  const [valQuantity, setQuantity] = useState(
    countItem.Quantity.toString() || 1,
  );

  useEffect(() => {
    console.log('Rendering ModalQuantity module');
  }, []);

  // const calcTotalQty = () => {
  //   let nTotal = 0;
  //   countDtl.forEach(data => {
  //     nTotal += data.Quantity;
  //   });
  //   setTotalQty(nTotal);
  // };

  //When Quantity Changes
  const editCountData = (item, editedQty) => {
    let key = item.RecordId;
    let nQuantity = Number(editedQty);
    let newCount = {
      RecordId: item.RecordId,
      OtherCde: item.OtherCde,
      Descript: item.Descript,
      Quantity: nQuantity,
      ItemCode: item.ItemCode,
      Date____: item.Date____,
      Location: item.Location,
      UserName: item.UserName,
      DeviceId: item.DeviceId,
      Is_Saved: true,
    };

    saveCount(newCount); //RetailAPI
    const newCountDtl = countDtl.map(data =>
      data.RecordId === key
        ? {...data, Quantity: nQuantity, Is_Saved: true}
        : data,
    );
    setCountDtl(newCountDtl);
    setTotalQty(totalQty - item.Quantity + nQuantity);
  };

  const checkCount = val => {
    if (Number(val) < 1) return null;
    setQuantity(val);
  };

  return (
    <Modal visible={modalQtyOpen} animationType="slide" transparent={true}>
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
        <Text style={{fontSize: 18, textAlign: 'center'}}>
          # {countItem.OtherCde}
        </Text>
        <Text style={{fontSize: 12, textAlign: 'center'}}>
          {countItem.Descript}
        </Text>
        <Text>Quantity {countItem.Quantity}</Text>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* <Text>{countItem.Quantity}</Text> */}
          <TouchableOpacity
            onPress={() => {
              const newQuantity = Number(valQuantity) - 1;
              checkCount(newQuantity.toString()); //prevent negative
            }}>
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 40,
                margin: 10,
                backgroundColor: 'red',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Material
                type="MaterialCommunityIcons"
                name="minus"
                size={32}
                color="white"
              />
            </View>
          </TouchableOpacity>

          <TextInput
            style={{
              fontSize: 18,
              backgroundColor: 'grey',
              textAlign: 'center',
              color: 'white',
            }}
            placeholder="quantity ..."
            selectTextOnFocus={true}
            value={valQuantity}
            autoFocus={true}
            onSubmitEditing={() => setModalQtyOpen(false)}
            keyboardType={'numeric'}
            defaultValue={countItem.Quantity}
            onChangeText={val => setQuantity(val)}
          />
          <TouchableOpacity
            onPress={() => {
              const newQuantity = Number(valQuantity) + 1;
              checkCount(newQuantity.toString());
            }}>
            <View
              style={{
                height: 40,
                width: 40,
                borderRadius: 40,
                margin: 10,
                backgroundColor: '#4CD995',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Material
                type="MaterialCommunityIcons"
                name="plus"
                size={32}
                color="white"
              />
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.bottomMenu}>
        <Icon.Button
          style={{color: 'white'}}
          size={20}
          backgroundColor="#00000000"
          onPress={() => setModalQtyOpen(false)}
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
            editCountData(countItem, valQuantity);
            setModalQtyOpen(false);
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
