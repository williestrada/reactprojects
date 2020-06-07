import React, {useState, useEffect, useContext} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Keyboard,
  ActivityIndicator,
  Alert,
  Dimensions,
  PermissionsAndroid,
} from 'react-native';

import Header from './Header';
import DateInfo from './DateInfo';
import CountData from './CountData';
import UserContext from './UserContext';
import ModalQuantity from './ModalQuantity';
import ProductPickList from './ProductPickList';
import CountBarcodeInput from './CountBarcodeInput';

import {saveCount, deleteCount, countToCSV, array_move} from '../src/RetailAPI';

import Fontisto from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import FontAwe from 'react-native-vector-icons/FontAwesome5';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import Highlighter from 'react-native-highlight-words';
import Swipeout from 'react-native-swipeout';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import {TouchableOpacity} from 'react-native-gesture-handler';

//import {OptimizedFlatList} from 'react-native-optimized-flatlist';

function Count({navigation}) {
  const {product, isLoading, setLoading, clearData} = useContext(UserContext);
  const [prodSearch, setProdSearch] = useState('WPE');
  prodSearch ? '' : setProdSearch('WPE'); //clear search when prodSearch =''

  const dataList = product.filter(
    mFile =>
      mFile.Descript.toLowerCase().includes(prodSearch.toLowerCase()) ||
      mFile.OtherCde.toLowerCase().includes(prodSearch.toLowerCase()),
  );

  const ITEM_HEIGHT = 70;
  const flatcount = React.createRef();
  const winHeight = Dimensions.get('window').height * 0.65;
  const [showProdList, setShowProdList] = useState(0); //dont show product Flatlist
  const [showCounList, setShowCounList] = useState(winHeight);

  const [countDtl, setCountDtl] = useState([]);
  const [countItem, setCountItem] = useState([]);

  const [valOtherCde, setOtherCde] = useState('');
  const [txtSearch, setTxtSearch] = useState('WPE');
  const [storName, setStorName] = useState('');
  const [getSettings, setGetSettings] = useState(['', '']);
  const [modalQtyOpen, setModalQtyOpen] = useState(false);

  const [totalQty, setTotalQty] = useState(0);
  const deviceId = DeviceInfo.getDeviceId();

  useEffect(() => {
    //console.log('Rendering Count component');
    //setLoading(true);
    //fetchCount();
    getSettingsData();
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
    // setLoading(true);
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

            if (!countDtl.some(d => d.RecordId === key.substr(5))) {
              ntotalCount += Quantity;
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
              newData.unshift(data); //or push(data)
            }
          }
        });
        setCountDtl(countDtl.concat(newData));
        setTotalQty(ntotalCount);
        setLoading(false);
      });
    });
  }

  // Called from CountBarcodeInput
  const handlerSearchOtherCde = val => {
    setOtherCde(val);
    setProdSearch(val); //filters items on Product picklist
    //othercde.current.focus();
  };

  //Add button menu click
  const handlerShowProdList = () => {
    if (getSettings[0] == '')
      return alert('Pls. set store and user name in Settings');
    Keyboard.dismiss();
    if (!valOtherCde) {
      alert('Pls. enter item to search.');
      return null;
    }
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

      setShowProdList(winHeight);
      setShowCounList(0);
    }
  };

  //Product Flatlist is clicked
  const addCountData = item => {
    let cLocation = getSettings[0];
    let cUserName = getSettings[1];

    let cOtherCde = valOtherCde;
    let cDescript = 'Item is not in the masterfile';
    let nQuantity = 1;
    let cRecordId = Date.now();
    let dDate____ = moment().format('L') + ' ' + moment().format('LT');

    if (dataList.length > 0) {
      cOtherCde = item.OtherCde;
      cDescript = item.Descript;
    }

    // check if item exist on listed array
    const nIndex = countDtl.findIndex(count =>
      count.OtherCde.includes(cOtherCde),
    );

    // if exist, do not add new record, find and increment quantity
    if (nIndex > -1) {
      nQuantity = countDtl[nIndex].Quantity += 1;
      cRecordId = countDtl[nIndex].RecordId;
      dDate____ = countDtl[nIndex].Date____;

      array_move(countDtl, nIndex, 0); //Move item to 1st line
    }

    let newCount = {
      RecordId: cRecordId,
      OtherCde: cOtherCde,
      Descript: cDescript,
      Quantity: nQuantity,
      Date____: dDate____,
      Location: cLocation,
      UserName: cUserName,
      DeviceId: deviceId,
      Is_Saved: true,
    };

    saveCount(newCount); //RetailAPI
    if (nIndex < 0) {
      countDtl.unshift(newCount);
      // let newData = countDtl.unshift(newCount);
      // setCountDtl(prevCount => {
      //   return [...prevCount, newCount];
      // });
    }

    setTotalQty(totalQty + 1);
    setShowProdList(0);
    setShowCounList(winHeight);
    setOtherCde('');
    setTxtSearch(cDescript); //HiLite barcode
    if (!cDescript.includes('masterfile')) {
      flatcount.current.scrollToIndex({animated: true, index: 0});
    }
  };

  const delCountData = item => {
    deleteCount(item.RecordId); //RetailAPI
    setCountDtl(prevCount => {
      return prevCount.filter(data => data.RecordId != item.RecordId);
    });
  };

  const saveCountHandler = async data => {
    Alert.alert('Save', 'Save count data to CSV?', [
      {
        text: 'No',
        onPress: () => null,
        style: 'cancel',
      },
      {
        text: 'YES',
        onPress: () => {
          countToCSV(data, clearData);
          if (clearData) {
            setCountDtl([]);
            setTotalQty(0);
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

      if (res.name.includes('Count')) {
        readSavedFile(res.name);
        return null;
      } else {
        alert('Wrong CSV file for count.');
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
    setLoading(true);

    const newData = [];
    let ntotalCount = 0;
    await data.map(aCount => {
      let key = 'COUNT' + aCount.RecordId;
      let RecordId = aCount.RecordId;
      let Date____ = aCount.Date____;
      let OtherCde = aCount.OtherCde;
      let Descript = aCount.Descript;
      let Quantity = Number(aCount.Quantity);
      let Location = aCount.Location;
      let UserName = aCount.UserName;
      let DeviceId = aCount.DeviceId;

      if (!countDtl.some(d => d.RecordId === RecordId)) {
        ntotalCount += Quantity;
        const count = {
          RecordId,
          Date____,
          OtherCde,
          Descript,
          Quantity,
          Location,
          UserName,
          DeviceId,
        };
        newData.push(count);
      }

      let dataToSave = JSON.stringify({
        RecordId: RecordId,
        OtherCde: OtherCde,
        Descript: Descript,
        Quantity: Quantity,
        Date____: Date____,
        Location: Location,
        UserName: UserName,
        DeviceId: DeviceId,
      });
      // cannot set await on AsyncStorage here
      // call and check if item is stored, if not set it
      checkStoredData(key, dataToSave);
    });

    setCountDtl(countDtl.concat(newData));
    setTotalQty(totalQty + ntotalCount);
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

  // function array_move(arr, old_index, new_index) {
  //   while (old_index < 0) {
  //     old_index += arr.length;
  //   }
  //   while (new_index < 0) {
  //     new_index += arr.length;
  //   }
  //   if (new_index >= arr.length) {
  //     var k = new_index - arr.length + 1;
  //     while (k--) {
  //       arr.push(undefined);
  //     }
  //   }
  //   arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
  // }

  function ItemList({item, index}) {
    let nIndex = index + 1;

    useEffect(() => {
      //console.log('Rendering ' + nIndex + ' ' + item.OtherCde);
      if (nIndex <= 50 && nIndex != countDtl.length) {
        setLoading(true);
      } else {
        setLoading(false);
      }
    }, [totalQty]);

    const swipeEdit = [
      {
        text: 'Edit',
        backgroundColor: 'rgb(0,64,128)',
        width: 10,
        onPress: () => {
          setCountItem(item);
          setModalQtyOpen(true);
        },
      },
    ];
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
          left={swipeEdit}
          right={swipeDelete}
          backgroundColor={'rgba(0,0,0,.3)'}
          sensitivity={70}
          buttonWidth={100}
          autoClose={true}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{flex: 1}}>
              <View style={styles.textCodeView}>
                <Highlighter
                  highlightStyle={{fontWeight: 'bold', color: 'orange'}}
                  searchWords={[txtSearch]}
                  textToHighlight={nIndex.toString() + '. # ' + item.OtherCde}
                  style={styles.textOtherCde}
                />
                <Text style={styles.textDescript}>{item.Date____}</Text>
              </View>
              <Highlighter
                highlightStyle={{fontWeight: 'bold', color: 'orange'}}
                searchWords={[txtSearch]}
                textToHighlight={item.Descript.substr(0, 50)}
                style={styles.textDescript}
              />
            </View>

            {/* Right Panel + - buttons */}
            <TouchableOpacity
              onPress={() => {
                setCountItem(item);
                setModalQtyOpen(true);
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    width: 46,
                    height: 40,
                    borderWidth: 0.5,
                    color: 'white',
                    fontSize: 14,
                    marginLeft: 4,
                    //padding: 10,
                    borderColor: 'rgba(255,255,255,.7)',
                    textAlign: 'center',
                    //alignSelf: 'center',
                    //alignContent: 'center',
                    //textAlign: 'center',
                    //justifyContent: 'center',
                    textAlignVertical: 'center',
                    backgroundColor: 'rgba(0,0,0,.6)',
                  }}>
                  {item.Quantity}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </Swipeout>
      </View>
    );
  }

  return (
    <>
      <Header navigation={navigation} title={'Count'} iconName={'settings'} />
      <ModalQuantity
        key={countItem.RecordId}
        countItem={countItem}
        countDtl={countDtl}
        setCountDtl={setCountDtl}
        modalQtyOpen={modalQtyOpen}
        setModalQtyOpen={setModalQtyOpen}
        totalQty={totalQty}
        setTotalQty={setTotalQty}
      />

      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require('../images/abstract_dark_red2.png')}
          style={styles.imgBackground}
          imageStyle={styles.imgStyle}
        />
        <DateInfo storName={storName} />

        <CountBarcodeInput
          handlerShowProdList={handlerShowProdList}
          setShowProdList={setShowProdList}
          setShowCounList={setShowCounList}
          handlerSearchOtherCde={handlerSearchOtherCde}
          valOtherCde={valOtherCde}
        />

        <Text //Line
          style={styles.line}>
          {' '}
        </Text>
        <ActivityIndicator
          size="large"
          color="orange"
          animating={isLoading}
          hidesWhenStopped={true}
          style={{height: 0}}
        />

        {/* FlatLists views */}
        <View style={{flex: 1, marginBottom: 0}}>
          {/* Product View List */}
          <View style={{height: showProdList}}>
            <ProductPickList
              dataList={dataList}
              prodSearch={prodSearch}
              addCountData={addCountData}
            />
          </View>

          {/* Count List */}
          <View style={{height: showCounList}}>
            <FlatList
              ref={flatcount}
              data={countDtl}
              renderItem={({item, index}) => (
                <ItemList item={item} index={index} />
              )}
              keyExtractor={item => item.RecordId}
              // removeClippedSubviews={true}
              initialNumToRender={20}
              maxToRenderPerBatch={50}
              // legacyImplementation={true} // this is a conversion to old listview
              getItemLayout={(countDtl, index) => ({
                length: ITEM_HEIGHT,
                offset: ITEM_HEIGHT * index,
                index,
              })}
              ListFooterComponent={() => {
                if (countDtl.length) {
                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        paddingRight: 5,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      {/* <ActivityIndicator
                        size="small"
                        color="blue"
                        animating={isLoading}
                        hidesWhenStopped={true}
                        style={{height: 0}}
                      /> */}

                      <Text
                        style={{
                          color: 'white',
                          fontSize: 12,
                          alignSelf: 'center',
                        }}>
                        {isLoading ? 'Loading...' : 'End of list.'}
                      </Text>
                    </View>
                  );
                }
                return null;
              }}
            />
          </View>
        </View>

        <CountData
          data1={countDtl.length}
          label2={'Total Qty.= '}
          data2={totalQty}
        />

        <View style={styles.bottomMenu}>
          <TouchableOpacity
            onPress={() => {
              if (countDtl.length) {
                setCountDtl([]);
                setTotalQty(0);
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
                        fetchCount();
                      },
                    },
                  ],
                );
              }
            }}>
            <Fontisto.Button
              style={{color: 'white'}}
              size={20}
              backgroundColor="#00000000"
              name={countDtl.length ? 'close' : 'list-1'}>
              <Text style={{color: 'white', fontFamily: 'Arial', fontSize: 12}}>
                {countDtl.length ? 'Clear' : 'List'}
              </Text>
            </Fontisto.Button>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              if (countDtl.length) {
                alert('Need to clear data before import.');
              } else {
                SingleFilePicker();
              }
            }}>
            <Fontisto.Button
              type="Fontisto"
              style={{color: 'white'}}
              size={20}
              backgroundColor="#00000000"
              name={Platform.OS === 'android' ? 'import' : 'import'}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Arial',
                  fontSize: 12,
                }}>
                Import
              </Text>
            </Fontisto.Button>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => saveCountHandler(countDtl)}>
            <Fontisto.Button
              type="Fontisto"
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
                    backgroundColor: clearData ? 'red' : 'rgba(0,200,0,.5)',
                  }}>
                  {''}
                </Text>
                <Text
                  style={{
                    color: 'white',
                    fontFamily: 'Arial',
                    fontSize: 12,
                  }}>
                  Export
                </Text>
              </View>
            </Fontisto.Button>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setTxtSearch(valOtherCde);
              Keyboard.dismiss();
            }}>
            <FontAwe.Button
              style={{color: 'orange'}}
              size={20}
              backgroundColor="#00000000"
              name={Platform.OS === 'android' ? 'highlighter' : 'highlighter'}>
              <Text
                style={{
                  color: 'white',
                  fontFamily: 'Arial',
                  fontSize: 12,
                }}>
                HiLite
              </Text>
            </FontAwe.Button>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => handlerShowProdList()}>
            <Entypo.Button
              type="Entypo"
              style={{color: 'white'}}
              size={20}
              backgroundColor="#00000000"
              name={Platform.OS === 'android' ? 'add-to-list' : 'add-to-list'}>
              <Text style={{color: 'white', fontFamily: 'Arial', fontSize: 12}}>
                Add
              </Text>
            </Entypo.Button>
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
    borderBottomColor: 'rgba(250,250,250,0.4)',
    padding: 3,
    marginVertical: 2,
    marginHorizontal: 10,
    backgroundColor: 'rgba(100,0,0,.3)',
  },
  textCodeView: {
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingRight: 5,
  },

  bottomMenu: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 0.8,
    borderColor: 'white',
    // backgroundColor: '#00000000',
    backgroundColor: 'rgba(0,0,0,.8)',
  },
});

export default React.memo(Count);
