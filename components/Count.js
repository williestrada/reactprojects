import React, {useState, useEffect} from 'react';
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

import Icon from 'react-native-vector-icons/Fontisto';
import Entypo from 'react-native-vector-icons/Entypo';
import Material from 'react-native-vector-icons/MaterialCommunityIcons';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';
import Highlighter from 'react-native-highlight-words';

export default function Count({navigation}) {
  const [valOtherCde, setOtherCde] = useState('');
  const [txtSearch, setTxtSearch] = useState('WPE');
  const [countDtl, setCountDtl] = useState([
    {
      OtherCde: '0123456',
      Descript: 'Mojitos Gold Agabe',
      ItemPrce: 1230,
      Quantity: 2,
    },
    {
      OtherCde: '4561321789',
      Descript: 'Johnnie Walker Double Black 1 liter',
      ItemPrce: 245200,
      Quantity: 1,
    },
  ]);
  const [storName, setStorName] = useState('');

  const deviceId = DeviceInfo.getDeviceId();

  useEffect(() => {
    console.log('Rendering Count component');
    storeName(); //show store name on top <DateInfo />
  }, []);

  function ItemList({item, index}) {
    let nIndex = index + 1;
    let nItemPrce = item.ItemPrce.toFixed(2).replace(
      /\d(?=(\d{3})+\.)/g,
      '$&,',
    );
    const [valQuantity, setQuantity] = useState(Number(item.Quantity) || 0);

    return (
      <View style={styles.itemContainer}>
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
            <TouchableOpacity
              onPress={() => {
                const newQuantity = valQuantity - 1;
                setQuantity(newQuantity);
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
                fontSize: 12,
                textAlign: 'center',
                alignItems: 'center',
                borderColor: 'rgba(255,255,255,.7)',
              }}
              keyboardType="numeric"
              maxLength={6}
              value={valQuantity}
              onChangeText={val => setQuantity(val)}
            />

            <TouchableOpacity
              onPress={() => {
                const newQuantity = valQuantity + 1;
                setQuantity(newQuantity);
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
            style={{...styles.textInput, ...styles.textBarCode}}
            placeholder="barcode ..."
            autoCapitalize="characters"
            maxLength={20}
            value={valOtherCde}
            onChangeText={val => setOtherCde(val)}
          />
        </View>
        <Text //Line
          style={styles.line}>
          {' '}
        </Text>
        <FlatList
          data={countDtl}
          renderItem={({item, index}) => <ItemList item={item} index={index} />}
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
            onPress={() => ''}
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
