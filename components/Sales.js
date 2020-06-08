import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  ActivityIndicator,
  Alert,
  BackHandler,
  PermissionsAndroid,
  FlatList,
} from 'react-native';

import Header from './Header';
import DateInfo from './DateInfo';
import CountData from './CountData';
import UserContext from './UserContext';
import ModalSales from './ModalSales';
import ModalEditSales from './ModalEditSales';
import {deleteSales, salesToCSV, fetchSalesDb} from '../src/RetailAPI';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Fontisto';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Swipeout from 'react-native-swipeout';
import DocumentPicker from 'react-native-document-picker';
//import {Calculator} from 'react-native-calculator';
import RNFS from 'react-native-fs';

function Sales({navigation}) {
  const [currentItem, setCurrentItem] = useState({});
  const [storName, setStorName] = useState('');
  const {
    setModalOpen,
    salesDtl,
    setSalesDtl,
    isLoading,
    setLoading,
    salesItem,
    setSalesItem,
    totalSales,
    setTotalSales,
    setModalEditOpen,
    clearData,
  } = useContext(UserContext);

  const confetti = React.createRef();

  useEffect(() => {
    console.log('Rendering Sales component');
    storeName(); //show store name on top <DateInfo />
    //fetchSales();
    //fetchSalesData();
    const backAction = () => {
      Alert.alert('Hold on!', 'Do you want to exit InfoPlus?', [
        {
          text: 'No',
          onPress: () => null,
          style: 'cancel',
        },
        {text: 'YES', onPress: () => BackHandler.exitApp()},
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  async function fetchSalesData() {
    const data = await fetchSalesDb();
    //console.log('fetched sales', data);
  }

  async function fetchSales() {
    setLoading(true);
    await AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, sales) => {
        const newData = [];
        let ntotalSales = 0;
        sales.map(result => {
          // get at each key/value so you can work with it

          if (result[0].includes('SALES')) {
            let key = result[0];
            let aSales = JSON.parse(result[1]);
            let RecordId = aSales.RecordId;
            let Date____ = aSales.Date____;
            let OtherCde = aSales.OtherCde;
            let Descript = aSales.Descript;
            let Quantity = aSales.Quantity;
            let ItemCode = aSales.ItemCode;
            let ItemPrce = aSales.ItemPrce;
            let Location = aSales.Location;
            let DeviceId = aSales.DeviceId;

            if (!salesDtl.some(d => d.RecordId === key)) {
              ntotalSales += Quantity * ItemPrce;
              const sale = {
                RecordId,
                Date____,
                OtherCde,
                Descript,
                Quantity,
                ItemCode,
                ItemPrce,
                Location,
                DeviceId,
              };
              newData.unshift(sale); //or push(sale)
            }
          }
        });
        setSalesDtl(salesDtl.concat(newData));
        setTotalSales(ntotalSales); //CountData
        setLoading(false);
      });
    });
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

  const editItem = item => {
    setSalesItem(item);
    setModalEditOpen(true);
  };

  const deleteItem = item => {
    let ntotalSales = item.Quantity * item.ItemPrce;
    setTotalSales(totalSales - ntotalSales); //CountData
    deleteSales(item.RecordId); //RetailAPI
    setSalesDtl(prevSales => {
      return prevSales.filter(val => val.RecordId != item.RecordId);
    });
  };

  const addSalesData = async () => {
    let objSetUp = await AsyncStorage.getItem('SETUP');
    if (objSetUp == null)
      return alert('Pls. set store and user name in Settings');
    let cLocation = '';
    let cUserName = '';
    await JSON.parse(objSetUp).map(setup => {
      cLocation = setup.Location.trim();
      cUserName = setup.UserName.trim();
    });

    if (!cLocation) return alert('Pls. set Store name in Settings');
    if (!cUserName) return alert('Pls. set User name in Settings');
    setModalOpen(true);
  };

  const saveSalesHandler = async data => {
    Alert.alert('Save', 'Save sales data to CSV?', [
      {
        text: 'No',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          salesToCSV(data, clearData);
          if (clearData) {
            setSalesDtl([]);
            setTotalSales(0);
          }
        },
      },
    ]);
  };

  const SingleFilePicker = async () => {
    try {
      const res = await DocumentPicker.pick({
        //options .allFiles .images .audio .pdf .plainText
        type: [DocumentPicker.types.allFiles],
      });

      if (res.name.includes('Sales')) {
        readSavedFile(res.name);
        return null;
      } else {
        alert('Wrong CSV file for sales.');
        return null;
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        return '';
      } else {
        Alert.alert('Unknown Error: ' + JSON.stringify(err));
        throw err;
      }
    }
  };

  async function readSavedFile(csvFile) {
    let RNFS = require('react-native-fs');
    let storedFileName = csvFile;
    let path = RNFS.DownloadDirectoryPath + '/' + storedFileName;
    let ext = /[.]/.exec(storedFileName)
      ? /[^.]+$/.exec(storedFileName)
      : undefined;
    // read the file

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          message: 'InfoPlus needs access to your storage to read a file.',
          buttonPositive: 'OK',
        },
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        await RNFS.readFile(path, 'utf8')
          .then(contents => {
            listJsonFile(contents, ext);
          })
          .catch(err => {
            return alert(err);
          });
      } else {
        alert('Permission denied');
      }
    } catch (err) {
      alert(err);
    }
  }

  async function listJsonFile(data, cFileExt) {
    if (cFileExt == 'csv') {
      data = csvJSON(data);
    } else {
      alert('The file is not a CSV file.');
      return null;
    }

    //console.log(data);
    const newData = [];
    let ntotalSales = 0;
    setLoading(true);
    await data.map(aSales => {
      let key = 'SALES' + aSales.RecordId;
      let RecordId = aSales.RecordId;
      let Date____ = aSales.Date____;
      let OtherCde = aSales.OtherCde;
      let Descript = aSales.Descript;
      let Quantity = Number(aSales.Quantity);
      let ItemPrce = Number(aSales.ItemPrce);
      let ItemCode = aSales.ItemCode;
      let Location = aSales.Location;
      let DeviceId = aSales.DeviceId;

      if (!salesDtl.some(d => d.RecordId === RecordId)) {
        ntotalSales += Quantity * ItemPrce;
        const sale = {
          RecordId,
          Date____,
          OtherCde,
          Descript,
          Quantity,
          ItemCode,
          ItemPrce,
          Location,
          DeviceId,
        };
        newData.push(sale);
      }

      let dataToSave = JSON.stringify({
        RecordId: RecordId,
        OtherCde: OtherCde,
        Descript: Descript,
        Quantity: Quantity,
        ItemCode: ItemCode,
        ItemPrce: ItemPrce,
        Date____: Date____,
        Location: Location,
        DeviceId: DeviceId,
      });
      // cannot set await on AsyncStorage here
      // call and check if item is stored, if not set it
      checkStoredData(key, dataToSave);
    });

    setSalesDtl(salesDtl.concat(newData));
    setTotalSales(totalSales + ntotalSales);
    setLoading(false);
  }

  async function checkStoredData(key, val) {
    let storedKey = await AsyncStorage.getItem(key);
    if (storedKey == null) {
      await AsyncStorage.setItem(key, val);
    }
    return null;
  }

  function csvJSON(csv) {
    const lines = csv.split('\r\n');
    const result = [];
    const headers = lines[0].split(',');

    for (let i = 1; i < lines.length; i++) {
      if (!lines[i]) continue;
      const obj = {};
      const currentline = lines[i].split(',');

      for (let j = 0; j < headers.length; j++) {
        obj[headers[j]] = currentline[j];
      }
      result.push(obj);
    }
    return result;
  }

  function ItemList({item, index}) {
    let nIndex = index + 1;
    if (nIndex <= 50 && nIndex != salesDtl.length) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    // let nItemPrce = item.ItemPrce;
    // let nAmount__ = item.Quantity * item.ItemPrce;

    let nItemPrce = item.ItemPrce.toFixed(2).replace(
      /\d(?=(\d{3})+\.)/g,
      '$&,',
    );
    let nAmount__ = (item.Quantity * item.ItemPrce)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,');

    var swipeEdit = [
      {
        text: 'Edit',
        backgroundColor: 'rgb(0,64,128)',
        onPress: () => {
          editItem(item);
        },
      },
    ];
    var swipeDelete = [
      {
        text: 'Del',
        backgroundColor: 'red',
        width: 10,
        onPress: () => deleteItem(item),
      },
    ];

    return (
      <View style={styles.itemContainer}>
        <Swipeout
          left={swipeEdit}
          right={swipeDelete}
          backgroundColor={'rgba(0,0,0,.3)'}
          sensitivity={70}
          buttonWidth={100}
          autoClose={true}>
          <View style={styles.textCodeView}>
            <Text style={styles.textOtherCde}>
              {nIndex.toString().trim()}. # {item.OtherCde}
            </Text>
            <Text style={styles.textItem}>Qty.: {item.Quantity}</Text>
            <Text style={{...styles.textItem, ...styles.unitPrice}}>
              {'   '}Price: {nItemPrce}
            </Text>
          </View>
          <View style={styles.textCodeView}>
            <Text style={styles.textDate____}>{item.Date____}</Text>
            <Text style={styles.textItem}>Amount.: {nAmount__}</Text>
          </View>
          <Text style={styles.textDescript}>{item.Descript.substr(0, 50)}</Text>
        </Swipeout>
      </View>
    );
  }

  return (
    <>
      <Header navigation={navigation} title={'Sales'} iconName={'home'} />
      <ModalSales storName={storName} confetti={confetti} />
      <ModalEditSales key={salesItem.RecordId} />
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require('../images/abstract_blue.png')}
          style={styles.imgBackground}
          imageStyle={styles.imgStyle}
        />
        <DateInfo storName={storName} />
        <ActivityIndicator
          size="large"
          color="orange"
          animating={isLoading}
          hidesWhenStopped={true}
          style={{height: 0}}
        />
        <FlatList
          data={salesDtl}
          renderItem={({item, index}) => <ItemList item={item} index={index} />}
          keyExtractor={item => item.RecordId}
          initialNumToRender={20}
          maxToRenderPerBatch={20}
          legacyImplementation={true} // this is a conversion to old listview
          ListFooterComponent={() => {
            if (!salesDtl.length) {
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
                      color: 'white',
                      alignSelf: 'center',
                    }}>
                    {''}
                  </Text>
                </View>
              );
            } else {
              return (
                <View>
                  {/* <ActivityIndicator
                    size="large"
                    color="orange"
                    animating={isLoading}
                    hidesWhenStopped={true}
                    style={{height: 0}}
                  /> */}

                  <Text
                    style={{color: 'white', fontSize: 12, alignSelf: 'center'}}>
                    {isLoading ? 'Loading...' : 'End of list.'}
                  </Text>
                </View>
              );
            }
            return null;
          }}
        />
        <CountData
          data1={salesDtl.length}
          label2={'Total Sales='}
          data2={totalSales.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}
        />
        <View style={styles.bottomMenu}>
          <TouchableOpacity
            onPress={() => {
              if (salesDtl.length) {
                setSalesDtl([]);
                setTotalSales(0);
              } else {
                Alert.alert(
                  'Alert',
                  'Listing all items may take some time to reload \n\n' +
                    'Do you want to continue?',
                  [
                    {
                      text: 'No',
                      onPress: () => null,
                      style: 'cancel',
                    },
                    {
                      text: 'YES',
                      onPress: () => {
                        setLoading(true);
                        fetchSales();
                      },
                    },
                  ],
                );
              }
            }}>
            <Icon.Button
              style={{color: 'white'}}
              size={20}
              backgroundColor="#00000000"
              name={salesDtl.length ? 'close' : 'list-1'}>
              <Text style={{color: 'white', fontFamily: 'Arial', fontSize: 12}}>
                {salesDtl.length ? 'Clear' : 'List'}
              </Text>
            </Icon.Button>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              if (salesDtl.length) {
                alert('Need to clear data before import.');
              } else {
                SingleFilePicker();
              }
            }}>
            <Icon.Button
              style={{color: 'white'}}
              size={20}
              backgroundColor="#00000000"
              name={Platform.OS === 'android' ? 'import' : 'import'}>
              <Text style={{color: 'white', fontFamily: 'Arial', fontSize: 12}}>
                Import
              </Text>
            </Icon.Button>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => saveSalesHandler(salesDtl)}>
            <Icon.Button
              style={{color: 'white'}}
              size={20}
              backgroundColor="#00000000"
              name={Platform.OS === 'android' ? 'export' : 'export'}>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    position: 'absolute',
                    marginLeft: 5,
                    marginBottom: 2,
                    height: 12,
                    width: 12,
                    borderRadius: 12,
                    alignSelf: 'flex-end',
                    backgroundColor: clearData ? 'red' : 'rgba(0,250,0,.5)',
                  }}>
                  {''}
                </Text>

                <Text
                  style={{color: 'white', fontFamily: 'Arial', fontSize: 12}}>
                  Export
                </Text>
              </View>
            </Icon.Button>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              addSalesData();
            }}>
            <Icon.Button
              style={{color: 'white'}}
              size={20}
              backgroundColor="#00000000"
              name={
                Platform.OS === 'android'
                  ? 'shopping-basket-add'
                  : 'shopping-basket-add'
              }>
              <Text style={{color: 'white', fontFamily: 'Arial', fontSize: 12}}>
                Add
              </Text>
            </Icon.Button>
          </TouchableOpacity>
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

  listSales: {
    flex: 1,
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
  textDate____: {
    flex: 2,
    fontSize: 12,
    color: 'white',
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
  unitPrice: {
    fontStyle: 'italic',
    color: 'rgba(255,255,255,.7)',
  },
  textDescript: {
    fontStyle: 'italic',
    fontSize: 10,
    color: 'white',
  },

  bottomMenu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 2,
    margin: 5,
    borderWidth: 0.8,
    borderColor: 'white',
    //    backgroundColor: '#333',
    backgroundColor: 'rgba(0,0,0,.8)',
  },
});

export default React.memo(Sales);
