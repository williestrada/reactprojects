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
} from 'react-native';

import Header from './Header';
import DateInfo from './DateInfo';
import CountData from './CountData';
import UserContext from './UserContext';
import {saveCount, deleteCount} from '../src/RetailAPI';

import Icon from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import Highlighter from 'react-native-highlight-words';
import Swipeout from 'react-native-swipeout';

export default function Count({navigation}) {
  const {product, isLoading, setLoading} = useContext(UserContext);
  const [prodSearch, setProdSearch] = useState('WPE');
  prodSearch ? '' : setProdSearch('WPE'); //clear search when prodSearch =''
  const dataList = product.filter(
    mFile =>
      mFile.Descript.toLowerCase().includes(prodSearch.toLowerCase()) ||
      mFile.OtherCde.toLowerCase().includes(prodSearch.toLowerCase()),
  );

  const [showProdList, setShowProdList] = useState(0);

  const [valOtherCde, setOtherCde] = useState('');
  const [txtSearch, setTxtSearch] = useState('WPE');
  const [countDtl, setCountDtl] = useState([]);
  const [storName, setStorName] = useState('');

  const deviceId = DeviceInfo.getDeviceId();
  const othercde = React.createRef();

  useEffect(() => {
    console.log('Rendering Count component');
    fetchCount();
    storeName(); //show store name on top <DateInfo />
  }, []);

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

            if (!countDtl.some(d => d.RecordId === key)) {
              // ntotalCount += Quantity * ItemPrce;
              const data = {
                RecordId,
                OtherCde,
                Descript,
                Quantity,
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
    setOtherCde(val);
    setProdSearch(val); //filters items on Product picklist
    othercde.current.focus();
    //    othercde.current.clear();
  };

  //Add button
  const handlerShowProdList = () => {
    Keyboard.dismiss();
    if (!valOtherCde) return null;
    if (dataList.length == 0) {
      addCountData();
    } else {
      setShowProdList(400);
    }
  };

  //Product Flatlist is clicked
  const addCountData = item => {
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
    };

    saveCount(newCount); //RetailAPI
    setCountDtl(prevCount => {
      return [...prevCount, newCount];
    });

    setShowProdList(0);
    setOtherCde('');
  };

  const delCountData = item => {
    deleteCount(item.RecordId); //RetailAPI
    setCountDtl(prevCount => {
      return prevCount.filter(data => data.RecordId != item.RecordId);
    });
  };

  const editCountData = (item, editedQty) => {
    let key = item.RecordId;
    // let nQuantity = Number(editedQty);
    let nQuantity = editedQty;
    let newCount = {
      RecordId: item.RecordId,
      OtherCde: item.OtherCde,
      Descript: item.Descript,
      Quantity: nQuantity,
    };

    // alert(newCount.Quantity);
    saveCount(newCount); //RetailAPI
    // setCountDtl(prevCount => {
    //   return prevCount.map(function(data) {
    //     data.RecordId == key ? {...newCount} : data;
    //   });
    // });

    // setCountDtl(prevCount => {
    //   return prevCount.map(data =>
    //     data.key === key ? {...newCount, key} : data,
    //   );
    // });
  };

  function ItemList({item, index}) {
    let nIndex = index + 1;
    const [valQuantity, setQuantity] = useState(item.Quantity.toString() || 0);

    useEffect(() => {
      console.log('Rendering Count Flatlist');
    }, []);

    const checkCount = val => {
      if (Number(val) < 1) return null;
      setQuantity(val);
      // alert(val);
      editCountData(item, val);
    };

    var swipeDelete = [
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
                paddingLeft: 10,
                // backgroundColor: 'red',
              }}>
              {/* <Text style={{color: 'yellow'}}>{valQuantity}</Text> */}
              <TouchableOpacity
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
                  <Material name="minus" size={20} color="white" />
                </View>
              </TouchableOpacity>
              <TextInput
                style={{
                  width: 40,
                  height: 40,
                  borderWidth: 0.5,
                  color: 'white',
                  fontSize: 14,
                  marginLeft: 6,
                  marginRight: 6,
                  textAlign: 'center',
                  alignItems: 'center',
                  borderColor: 'rgba(255,255,255,.7)',
                }}
                keyboardType="numeric"
                maxLength={6}
                value={valQuantity}
                selectTextOnFocus={true}
                onChangeText={val => checkCount(val)}
              />

              <TouchableOpacity
                onPress={() => {
                  const newQuantity = Number(valQuantity) + 1;
                  setQuantity(newQuantity.toString());
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
                  <Material name="plus" size={20} color="white" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
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

  const storeName = async () => {
    let objSetUp = await AsyncStorage.getItem('SETUP');
    if (objSetUp == null) return;
    let cLocation = '';
    await JSON.parse(objSetUp).map(setup => {
      cLocation = setup.Location.trim();
    });
    setStorName(cLocation);
  };

  return (
    <>
      <Header navigation={navigation} title={'Count'} iconName={'settings'} />
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
            onChangeText={val => handlerSearchOtherCde(val)}
          />
        </View>
        <Text //Line
          style={styles.line}>
          {' '}
        </Text>
        <View style={{flex: 1}}>
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
                        End of Product list.
                      </Text>
                    </View>
                  );
                }
                return null;
              }}
            />
          </View>

          {/* Count List */}
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
        <CountData data1={countDtl.length} label2={'Total Count= '} data2={0} />

        <View style={styles.bottomMenu}>
          <Icon.Button
            style={{color: 'white'}}
            size={20}
            backgroundColor="#00000000"
            onPress={() => ''}
            name={Platform.OS === 'android' ? 'export' : 'export'}>
            <Text
              style={{
                color: 'white',
                fontFamily: 'Arial',
                fontSize: 12,
              }}>
              Export
            </Text>
          </Icon.Button>
          <Entypo.Button
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
    fontSize: 14,
    color: 'white',
    width: 90,
    paddingLeft: 10,
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
