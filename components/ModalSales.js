import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Modal,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  FlatList,
  Keyboard,
} from 'react-native';

import Icon from 'react-native-vector-icons/Fontisto';
import DatePicker from 'react-native-datepicker';
import Highlighter from 'react-native-highlight-words';

import UserContext from './UserContext';
import {saveSales} from '../src/RetailAPI';

export default function ModalSales() {
  const {product, setSalesDtl, modalOpen, setModalOpen} = useContext(
    UserContext,
  );

  const [date, setDate] = useState(new Date());
  const [valQuantity, setQuantity] = useState('1');
  const [valOtherCde, setOtherCde] = useState('');
  const [valDescript, setDescript] = useState('');
  const [valItemPrce, setItemPrce] = useState('0.00');

  const [textMessage, setMessage] = useState('');
  const [highLightText, sethighLightText] = useState('');
  const [pickList, setPickList] = useState([]);

  //reference to textinput fields
  const othercde = React.createRef();
  const descript = React.createRef();
  const quantity = React.createRef();
  const itemprce = React.createRef();

  useEffect(() => {
    console.log('Rendering Modal Sales ');
    console.disableYellowBox = true;
    setQuantity('1');
    setItemPrce('0.00');
    setPickList([]);
  }, []);

  //Search product and generate picklist on setPickList
  const getProduct = () => {
    if (!valOtherCde) {
      alertMsg('Enter bar code or description to search');
      return;
    }
    if (valOtherCde.length < 5 && product.length > 100) {
      alertMsg('Enter at least 5 chars to limit search');
      return;
    }
    let txtSearch = valOtherCde.trim();
    sethighLightText(txtSearch); //use txtSearch value as highilighted text than valOtherCde
    const dataItem = product.filter(
      data =>
        data.OtherCde.includes(txtSearch) || data.Descript.includes(txtSearch),
    );
    if (dataItem.length > 0) {
      setOtherCde(dataItem[0].OtherCde);
      setDescript(dataItem[0].Descript);
      setItemPrce(
        dataItem[0].ItemPrce.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'),
      );

      if (dataItem.length > 0) {
        if (dataItem.length > 1) {
          Keyboard.dismiss();
          alertMsg(dataItem.length + ' items found, choose from picklist');
          setPickList(dataItem); //Flatlist
        } else {
          setPickList([]); //Flatlist
          alertMsg("Press 'Save' when done / 'Close' to cancel");
          othercde.current.focus();
        }
      }
    } else {
      setDescript('Item not in the masterfile');
      setItemPrce('0.00');
      setPickList([]); //Flatlist
    }

    setQuantity('1');
    return;
  };

  const selectFromList = item => {
    setOtherCde(item.OtherCde);
    setDescript(item.Descript);
    setQuantity('1');
    setItemPrce(item.ItemPrce.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'));
  };

  const alertMsg = msg => {
    setTimeout(() => {
      setMessage('');
    }, 5000);
    setMessage(msg);
  };

  const saveSalesData = () => {
    let dDate____ =
      typeof date == 'object'
        ? date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()
        : date.substr(0, 16);
    let cRecordId = Date.now();
    let cLocation = '';

    if (valOtherCde == 0 || valOtherCde == 'undefined') {
      alertMsg('Pls. enter bar code');
      return;
    }
    if (valDescript == '' || valDescript == 'undefined') {
      alertMsg('Pls. enter description');
      descript.current.focus();
      return;
    }
    if (valQuantity == 0 || valQuantity == 'undefined') {
      alertMsg('Pls. enter quantity');
      quantity.current.focus();
      return;
    }
    if (valItemPrce == 0) {
      alertMsg('Pls. enter item price');
      itemprce.current.focus();
      return;
    }

    //setTimeout(() => flat_ref.scrollToEnd(), 200);

    setSalesDtl(prevSales => {
      alertMsg('Data is saved.');
      let cRecordId = Date.now();
      let aSales = {
        RecordId: cRecordId,
        Date____: dDate____,
        Quantity: Number(valQuantity),
        OtherCde: valOtherCde,
        Descript: valDescript,
        ItemPrce: Number(valItemPrce.replace(/,|_/g, '')),
      };

      saveSales(aSales); //RetailAPI
      return [...prevSales, aSales];
    });

    setOtherCde('');
    setDescript('');
    setQuantity('');
    setItemPrce('');
    setModalOpen(false);
  };

  function ItemList({item, index}) {
    let nIndex = index + 1;
    let nItemPrce = item.ItemPrce.toFixed(2).replace(
      /\d(?=(\d{3})+\.)/g,
      '$&,',
    );

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => selectFromList(item)}>
          <View style={styles.textCodeView}>
            <Highlighter
              highlightStyle={{fontWeight: 'bold', color: 'orange'}}
              searchWords={[highLightText]}
              textToHighlight={nIndex.toString() + '. Code:' + item.OtherCde}
              style={styles.txtOtherCde}
              //numberOfLines={1}
            />
            <Text style={styles.textItem}>Price: {nItemPrce}</Text>
          </View>
          <Highlighter
            highlightStyle={{fontWeight: 'bold', color: 'orange'}}
            searchWords={[highLightText]}
            textToHighlight={item.Descript.substr(0, 70)}
            style={styles.textDescript}
          />
        </TouchableOpacity>
      </View>
    );
  }

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

            <View style={styles.inputView}>
              <Text style={styles.inputLabel}>Bar Code</Text>
              <View style={{flexDirection: 'row'}}>
                <TextInput
                  ref={othercde}
                  style={{...styles.textInput, ...styles.textOtherCde}}
                  placeholder="Enter bar code ..."
                  autoCapitalize="characters"
                  onSubmitEditing={() => {
                    getProduct();
                  }}
                  autoFocus={true}
                  showSoftInputOnFocus={true}
                  value={valOtherCde}
                  returnKeyType="search"
                  onChangeText={val => setOtherCde(val)}
                />
                <Icon.Button
                  style={{
                    color: 'white',
                    borderWidth: 1,
                    borderColor: 'white',
                    borderRadius: 8,
                  }}
                  size={20}
                  backgroundColor="#333"
                  onPress={() => getProduct()}
                  name={Platform.OS === 'android' ? 'search' : 'search'}>
                  <Text
                    style={{color: 'white', fontFamily: 'Arial', fontSize: 12}}>
                    Search
                  </Text>
                </Icon.Button>
              </View>
            </View>

            <View style={styles.inputView}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                ref={descript}
                style={styles.textInput}
                placeholder="Enter description ..."
                selectTextOnFocus={true}
                onSubmitEditing={() => {
                  quantity.current.focus();
                }}
                value={valDescript}
                onChangeText={val => setDescript(val)}
              />
            </View>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-around'}}>
              <View style={styles.inputView}>
                <Text style={styles.inputLabel}>Quantity</Text>
                <TextInput
                  ref={quantity}
                  style={{...styles.textInput, ...styles.textNumber}}
                  placeholder="Enter quantity ..."
                  onSubmitEditing={() => {
                    itemprce.current.focus();
                  }}
                  keyboardType={'number-pad'}
                  selectTextOnFocus={true}
                  value={valQuantity}
                  textAlign="right"
                  onChangeText={valQuantity => setQuantity(valQuantity)}
                />
              </View>
              <View style={styles.inputView}>
                <Text style={styles.inputLabel}>Item Price</Text>
                <TextInput
                  ref={itemprce}
                  style={{...styles.textInput, ...styles.textNumber}}
                  placeholder="Enter item price ..."
                  onSubmitEditing={() => {
                    othercde.current.focus();
                  }}
                  keyboardType={'number-pad'}
                  selectTextOnFocus={true}
                  value={valItemPrce}
                  textAlign="right"
                  onChangeText={val => setItemPrce(val)}
                />
              </View>
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
                    Close
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

        <View
          style={{
            //backgroundColor: 'blue',
            top: 330,
            width: '95%',
            height: '43%',
            alignSelf: 'center',
            paddingBottom: 5,
          }}>
          <FlatList
            data={pickList}
            renderItem={({item, index}) => (
              <ItemList item={item} index={index} />
            )}
            keyExtractor={item => item.OtherCde}
            ListHeaderComponent={() => {
              if (!pickList.length) {
                return (
                  <View>
                    <Text
                      style={{
                        color: 'red',
                        alignSelf: 'center',
                      }}>
                      {''}
                    </Text>
                    <Text
                      style={{
                        color: 'red',
                        alignSelf: 'center',
                      }}>
                      {' '}
                    </Text>
                  </View>
                );
              } else {
                return (
                  <View>
                    <Text
                      style={{
                        color: 'yellow',
                        fontSize: 12,
                        alignSelf: 'center',
                      }}>
                      {pickList.length} items found
                    </Text>
                  </View>
                );
              }
              return null;
            }}
          />
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
    paddingRight: 10,
  },
  textOtherCde: {
    width: 250,
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
    color: 'yellow',
    fontWeight: 'bold',
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

  // Flatlist items container
  itemContainer: {
    borderBottomWidth: 0.8,
    borderStyle: 'dashed',
    //borderRadius: 10,
    borderBottomColor: 'rgba(250,250,250,0.4)',
    padding: 3,
    paddingLeft: 5,
    paddingRight: 5,
    marginVertical: 2,
    marginHorizontal: 10,
    //backgroundColor: 'rgba(250,250,250,0.6)',
    backgroundColor: '#00000000',
    //    alignItems: 'center', //centers the delete button
  },
  textCodeView: {
    flexDirection: 'row',
  },
  txtOtherCde: {
    flex: 2,
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  textItem: {
    fontSize: 12,
    color: 'white',
  },
  textDescript: {
    fontStyle: 'italic',
    fontSize: 10,
    color: 'white',
  },
  headingText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: 'white',
    // marginBottom: 4
  },
});
