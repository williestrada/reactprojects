import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
  BackHandler,
  PermissionsAndroid,
} from 'react-native';

import Header from './Header';
import DateInfo from './DateInfo';
import CountData from './CountData';
import UserContext from './UserContext';
import ModalSales from './ModalSales';
import ModalEditSales from './ModalEditSales';
import {deleteSales, salesToCSV, csvToJSON} from '../src/RetailAPI';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Fontisto';
//import FontAwe from 'react-native-vector-icons/FontAwesome5';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Swipeout from 'react-native-swipeout';
import DocumentPicker from 'react-native-document-picker';
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
  } = useContext(UserContext);

  const confetti = React.createRef();

  useEffect(() => {
    console.log('Rendering Sales component');
    storeName(); //show store name on top <DateInfo />
    fetchSales();
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

  async function fetchSales() {
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
    setSalesItem(item), setCurrentItem(item);
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
          salesToCSV(data);
          setSalesDtl([]);
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

      readSavedFile(res.name);
      return res.name;
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

    console.log(data);
    const newData = [];
    await data.map(aSales => {
      let key = 'SALES' + aSales.RecordId;
      let RecordId = aSales.RecordId;
      let Date____ = aSales.Date____;
      let OtherCde = aSales.OtherCde;
      let Descript = aSales.Descript;
      let Quantity = Number(aSales.Quantity);
      let ItemPrce = Number(aSales.ItemPrce);
      let Location = aSales.Location;
      let DeviceId = aSales.DeviceId;

      if (!salesDtl.some(d => d.RecordId === RecordId)) {
        //          ntotalSales += Quantity * ItemPrce;
        const sale = {
          RecordId,
          Date____,
          OtherCde,
          Descript,
          Quantity,
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
    //salesDtl.concat(newData);
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
          color="#0000ff"
          animating={isLoading}
          hidesWhenStopped={true}
          style={{height: 0}}
        />

        <FlatList
          data={salesDtl}
          renderItem={({item, index}) => <ItemList item={item} index={index} />}
          keyExtractor={item => item.RecordId}
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
                    No sales item found
                  </Text>
                </View>
              );
            } else {
              return (
                <View>
                  <Text
                    style={{color: 'white', fontSize: 12, alignSelf: 'center'}}>
                    End of list.
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
              SingleFilePicker();
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
              <Text style={{color: 'white', fontFamily: 'Arial', fontSize: 12}}>
                Export
              </Text>
            </Icon.Button>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => AsyncStorage.removeItem('SETUP')}>
            <Icon.Button
              style={{color: 'white'}}
              size={20}
              backgroundColor="#00000000"
              name={Platform.OS === 'android' ? 'list-1' : 'list-1'}>
              <Text style={{color: 'white', fontFamily: 'Arial', fontSize: 12}}>
                List
              </Text>
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
    justifyContent: 'space-evenly',
    padding: 2,
    margin: 5,
    borderWidth: 0.8,
    borderColor: 'white',
    //backgroundColor: '#333',
  },
});

export default React.memo(Sales);
