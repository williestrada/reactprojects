import React, {useState, useEffect, useContext, createRef} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  TouchableOpacity,
  Keyboard,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';

import Header from './Header';
import DateInfo from './DateInfo';
import CountData from './CountData';
import UserContext from './UserContext';
import ModalQuantity from './ModalQuantity';

import {saveCount, deleteCount, countToCSV} from '../src/RetailAPI';

import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Icon} from 'react-native-elements';

import {CheckBox} from 'react-native-elements';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import Highlighter from 'react-native-highlight-words';
import Swipeout from 'react-native-swipeout';
import moment from 'moment';

export default function Count({navigation}) {
  const {product, isLoading, setLoading} = useContext(UserContext);
  const [prodSearch, setProdSearch] = useState('WPE');
  prodSearch ? '' : setProdSearch('WPE'); //clear search when prodSearch =''

  const dataList = product.filter(
    mFile =>
      mFile.Descript.toLowerCase().includes(prodSearch.toLowerCase()) ||
      mFile.OtherCde.toLowerCase().includes(prodSearch.toLowerCase()),
  );

  const [showProdList, setShowProdList] = useState(0); //dont show product Flatlist
  const [showCounList, setShowCounList] = useState(400);

  const [valOtherCde, setOtherCde] = useState('');
  const [txtSearch, setTxtSearch] = useState('WPE');
  const [countDtl, setCountDtl] = useState([]);
  const [storName, setStorName] = useState('');
  const [barScannerOn, setBarScannerOn] = useState(false);
  const [getSettings, setGetSettings] = useState(['', '']);
  const [modalQtyOpen, setModalQtyOpen] = useState(false);

  const [countItem, setCountItem] = useState([]);

  const [unSavedData, setUnSavedData] = useState(0);
  const deviceId = DeviceInfo.getDeviceId();
  const othercde = React.createRef();

  useEffect(() => {
    console.log('Rendering Count component');
    fetchCount();
    getSettingsData();
    setStorName(getSettings[0]);
    //storeName(); //show store name on top <DateInfo />
  }, []);

  const getSettingsData = async () => {
    let objSetUp = await AsyncStorage.getItem('SETUP');
    if (objSetUp == null) return;
    let cLocation = '';
    let cUserName = '';
    await JSON.parse(objSetUp).map(setup => {
      cLocation = setup.Location.trim();
      cUserName = setup.UserName.trim();
    });
    setStorName(cLocation);
    setGetSettings([cLocation, cUserName]);
  };

  async function fetchCount() {
    await AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, count) => {
        const newData = [];
        let ntotalCount = 0;
        count.map(result => {
          // get at each key/value so you can work with it

          if (result[0].includes('COUNT')) {
            let key = result[0];
            let aCount = JSON.parse(result[1]);
            let RecordId = aCount.RecordId;
            let OtherCde = aCount.OtherCde;
            let Descript = aCount.Descript;
            let Quantity = aCount.Quantity;

            let Date____ = aCount.Date____;
            let Location = aCount.Location;
            let UserName = aCount.UserName;
            let DeviceId = aCount.DeviceId;
            let Is_Saved = aCount.Is_Saved;

            if (!countDtl.some(d => d.RecordId === key)) {
              // ntotalCount += Quantity * ItemPrce;
              const data = {
                RecordId,
                OtherCde,
                Descript,
                Quantity,
                Date____,
                Location,
                UserName,
                DeviceId,
                Is_Saved,
              };
              newData.push(data);
            }
          }
        });
        setCountDtl(countDtl.concat(newData));
      });
    });
  }

  //TextInput OtherCde onChange()
  const handlerSearchOtherCde = val => {
    // if (1 == 1) return null;
    setOtherCde(val);
    setProdSearch(val); //filters items on Product picklist
    othercde.current.focus();
  };

  //Add button menu click
  const handlerShowProdList = () => {
    if (getSettings[0] == '')
      return alert('Pls. set store and user name in Settings');
    Keyboard.dismiss();
    if (!valOtherCde) return null;
    if (dataList.length == 0) {
      Alert.alert(
        'Alert',
        valOtherCde + ' is not in the masterfile. \nDo you want to save?',
        [
          {
            text: 'No',
            onPress: () => {
              return null;
            },
            style: 'cancel',
          },
          {text: 'YES', onPress: () => addCountData()},
        ],
      );
      return null;
    } else {
      if (dataList.length == 1) {
        addCountData(dataList[0]);
        return null;
      }

      setShowProdList(400);
      setShowCounList(0);
    }
  };

  //Product Flatlist is clicked
  const addCountData = item => {
    let cLocation = getSettings[0];
    let cUserName = getSettings[1];

    let cOtherCde = valOtherCde;
    let cDescript = 'Item is not in the masterfile';
    if (dataList.length > 0) {
      cOtherCde = item.OtherCde;
      cDescript = item.Descript;
    }
    let newCount = {
      RecordId: Date.now(),
      OtherCde: cOtherCde,
      Descript: cDescript,
      Quantity: 1,
      Date____: moment().format('L'),
      Location: cLocation,
      UserName: cUserName,
      DeviceId: deviceId,
      Is_Saved: true,
    };

    saveCount(newCount); //RetailAPI
    setCountDtl(prevCount => {
      return [...prevCount, newCount];
    });

    setShowProdList(0);
    setShowCounList(400);
    setOtherCde('');
  };

  const delCountData = item => {
    deleteCount(item.RecordId); //RetailAPI
    setCountDtl(prevCount => {
      return prevCount.filter(data => data.RecordId != item.RecordId);
    });
  };

  // const calcSaved = () => {
  //   let nCtr = 0;
  //   countDtl.forEach(data => {
  //     if (!data.Is_Saved) {
  //       nCtr++;
  //     }
  //   });
  //   setUnSavedData(nCtr);
  // };

  const saveCountHandler = async data => {
    Alert.alert('Save', 'Save count data to CSV?', [
      {
        text: 'No',
        onPress: () => null,
        style: 'cancel',
      },
      {text: 'YES', onPress: () => countToCSV(data)},
    ]);
  };

  function ItemList({item, index}) {
    let nIndex = index + 1;
    //const [valQuantity, setQuantity] = useState(item.Quantity.toString() || 0);

    useEffect(() => {
      console.log(nIndex + ' Rendering Count Flatlist');
    }, []);

    const swipeDelete = [
      {
        text: 'Del',
        backgroundColor: 'red',
        width: 10,
        onPress: () => delCountData(item),
      },
    ];

    return (
      <View style={styles.itemContainer}>
        <Swipeout
          right={swipeDelete}
          backgroundColor={'rgba(0,0,0,.3)'}
          sensitivity={70}
          buttonWidth={100}
          autoClose={true}>
          <TouchableOpacity
            onPress={() => {
              setCountItem(item);
              setModalQtyOpen(true);
            }}>
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <View style={styles.textCodeView}>
                  <Highlighter
                    highlightStyle={{fontWeight: 'bold', color: 'orange'}}
                    searchWords={[txtSearch]}
                    textToHighlight={nIndex.toString() + '. # ' + item.OtherCde}
                    style={styles.textOtherCde}
                  />
                </View>
                <Highlighter
                  highlightStyle={{fontWeight: 'bold', color: 'orange'}}
                  searchWords={[txtSearch]}
                  textToHighlight={item.Descript.substr(0, 50)}
                  style={styles.textDescript}
                />
              </View>

              {/* Right Panel + - buttons */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,.6)',
                }}>
                {/* <TouchableOpacity
                  onPress={() => {
                    const newQuantity = Number(valQuantity) - 1;
                    checkCount(newQuantity.toString()); //prevent negative
                  }}
                  style={{
                    height: 34,
                    width: 34,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: 28,
                      width: 28,
                      borderRadius: 28,
                      backgroundColor: 'red',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Material
                      type="MaterialCommunityIcons"
                      name="minus"
                      size={20}
                      color="white"
                    />
                  </View>
                </TouchableOpacity> */}

                <Text
                  style={{
                    width: 46,
                    height: 40,
                    borderWidth: 0.5,
                    color: 'white',
                    fontSize: 14,
                    marginLeft: 4,
                    marginRight: 4,
                    textAlign: 'center',
                    paddingTop: 10,
                    borderColor: 'rgba(255,255,255,.7)',
                  }}>
                  {item.Quantity}
                  {/* // keyboardType="numeric"
                  // maxLength={6}
                  // value={valQuantity}
                  // selectTextOnFocus={true}
                  // onChangeText={val => checkCount(val)} */}
                </Text>

                {/* <TouchableOpacity
                  onPress={() => {
                    const newQuantity = Number(valQuantity) + 1;
                    checkCount(newQuantity.toString());
                  }}
                  style={{
                    height: 34,
                    width: 34,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: 28,
                      width: 28,
                      borderRadius: 28,
                      backgroundColor: '#4CD995',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Material
                      type="MaterialCommunityIcons"
                      name="plus"
                      size={20}
                      color="white"
                    />
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    editCountData(item, index, valQuantity);
                  }}
                  style={{
                    height: 34,
                    width: 34,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <View
                    style={{
                      height: 28,
                      width: 28,
                      paddingLeft: 6,
                      paddingRight: 0,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Fontisto name="save" size={22} color={isSavedQtyColor} />
                  </View>
                </TouchableOpacity> */}
              </View>
            </View>
          </TouchableOpacity>
        </Swipeout>
      </View>
    );
  }

  //Product PickList FlatList render
  function ProdList({item, index}) {
    let nIndex = index + 1;
    let nItemPrce = item.ItemPrce.toFixed(2).replace(
      /\d(?=(\d{3})+\.)/g,
      '$&,',
    );

    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => addCountData(item)}>
          <View style={styles.textCodeView}>
            <Highlighter
              highlightStyle={{fontWeight: 'bold', color: 'orange'}}
              searchWords={[prodSearch]}
              textToHighlight={nIndex.toString() + '. # ' + item.OtherCde}
              style={styles.textOtherCde}
              //numberOfLines={1}
            />
            <Text style={styles.textItem}>Price: {nItemPrce}</Text>
          </View>
          <Highlighter
            highlightStyle={{fontWeight: 'bold', color: 'orange'}}
            searchWords={[prodSearch]}
            textToHighlight={item.Descript.substr(0, 50)}
            style={styles.textDescript}
          />
        </TouchableOpacity>
      </View>
    );
  }

  let scannerColor = barScannerOn ? 'white' : 'black';

  return (
    <>
      <Header navigation={navigation} title={'Count'} iconName={'settings'} />
      <ModalQuantity
        key={countItem.RecordId}
        countItem={countItem}
        countDtl={countDtl}
        setCountDtl={setCountDtl}
        setModalQtyOpen={setModalQtyOpen}
        modalQtyOpen={modalQtyOpen}
      />

      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require('../images/abstract_dark_red2.png')}
          style={styles.imgBackground}
          imageStyle={styles.imgStyle}
        />
        <DateInfo storName={storName} />

        <View
          style={{
            flexDirection: 'row',
            paddingTop: 10,
            alignItems: 'center',
          }}>
          <Text style={styles.text}>Bar Code: </Text>
          <TextInput
            ref={othercde}
            style={{...styles.textInput, ...styles.textBarCode}}
            placeholder="barcode ..."
            autoCapitalize="characters"
            maxLength={20}
            value={valOtherCde}
            selectTextOnFocus={true}
            onFocus={() => {
              setShowProdList(0);
              setShowCounList(400);
            }}
            showSoftInputOnFocus={!barScannerOn}
            onChangeText={val => handlerSearchOtherCde(val)}
          />
          <Icon
            name="speaker-phone"
            containerStyle={{
              paddingRight: 0,
              marginRight: 0,
              borderWidth: 0,
            }}
            size={28}
            color={scannerColor}
          />
          <CheckBox
            center
            size={20}
            checkedColor="white"
            uncheckedColor="rgba(255,255,255,.7)"
            onPress={() => setBarScannerOn(!barScannerOn)}
            textStyle={{
              padding: 0,
              color: 'white',
            }}
            containerStyle={{
              padding: 0,
              margin: 0,
              borderWidth: 0,
              color: 'white',
              backgroundColor: '#00000000',
            }}
            checked={barScannerOn}
          />
        </View>
        <Text //Line
          style={styles.line}>
          {' '}
        </Text>
        <ScrollView style={{flex: 1}}>
          {/* Product View List */}
          <View style={{height: showProdList}}>
            <FlatList
              data={dataList}
              renderItem={({item, index}) => (
                <ProdList item={item} index={index} />
              )}
              keyExtractor={item => item.OtherCde}
              ListFooterComponent={() => {
                if (dataList.length) {
                  return (
                    <View>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 12,
                          alignSelf: 'center',
                        }}>
                        Select item from Product list.
                      </Text>
                    </View>
                  );
                }
                return null;
              }}
            />
          </View>

          {/* Count List */}
          <View style={{height: showCounList}}>
            <FlatList
              data={countDtl}
              renderItem={({item, index}) => (
                <ItemList item={item} index={index} />
              )}
              keyExtractor={item => item.OtherCde}
              ListFooterComponent={() => {
                if (countDtl.length) {
                  return (
                    <View>
                      <Text
                        style={{
                          color: 'white',
                          fontSize: 12,
                          alignSelf: 'center',
                        }}>
                        End of list.
                      </Text>
                    </View>
                  );
                }
                return null;
              }}
            />
          </View>
        </ScrollView>
        <CountData
          data1={countDtl.length}
          // label2={'Unsaved= '}
          // data2={unSavedData}
        />

        <View style={styles.bottomMenu}>
          <Fontisto.Button
            type="Fontisto"
            style={{color: 'white'}}
            size={20}
            backgroundColor="#00000000"
            onPress={() => saveCountHandler(countDtl)}
            name={Platform.OS === 'android' ? 'export' : 'export'}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Arial',
                fontSize: 12,
              }}>
              Export
            </Text>
          </Fontisto.Button>
          <Entypo.Button
            type="Entypo"
            style={{color: 'white'}}
            size={20}
            backgroundColor="#00000000"
            onPress={() => handlerShowProdList()}
            name={Platform.OS === 'android' ? 'add-to-list' : 'add-to-list'}>
            <Text style={{color: 'white', fontFamily: 'Arial', fontSize: 12}}>
              Add
            </Text>
          </Entypo.Button>
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
    fontSize: 12,
    color: 'white',
    width: 80,
    paddingLeft: 10,
    paddingRight: 10,
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
    backgroundColor: 'rgba(100,0,0,.3)',
    //backgroundColor: '#00000000',
    //    alignItems: 'center', //centers the delete button
  },
  textCodeView: {
    flexDirection: 'row',
  },
  textOtherCde: {
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

  bottomMenu: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 2,
    margin: 5,
    marginLeft: 0,
    borderWidth: 0.8,
    borderColor: 'white',
    backgroundColor: '#00000000',
  },
});
