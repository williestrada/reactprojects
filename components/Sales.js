import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';

import Header from './Header';
import DateInfo from './DateInfo';
import UserContext from './UserContext';
import ModalSales from './ModalSales';
import ModalEditSales from './ModalEditSales';
import {deleteSales} from '../src/RetailAPI';

import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Fontisto';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Swipeout from 'react-native-swipeout';

function Sales({navigation}) {
  const [currentItem, setCurrentItem] = useState({});
  const {
    setModalOpen,
    salesDtl,
    setSalesDtl,
    isLoading,
    salesDataToEdit,
    setSalesDataToEdit,
    setModalEditOpen,
  } = useContext(UserContext);

  useEffect(() => {
    console.log('Rendering Sales component');
    fetchSales();
  }, []);

  async function fetchSales() {
    await AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, sales) => {
        const newData = [];
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

            if (!salesDtl.some(d => d.RecordId === key)) {
              const sale = {
                RecordId,
                Date____,
                OtherCde,
                Descript,
                Quantity,
                ItemPrce,
              };
              newData.push(sale);
            }
          }
        });
        setSalesDtl(salesDtl.concat(newData));
      });
    });
  }

  const editItem = item => {
    //setSalesDataToEdit(item);
    setCurrentItem(item);
    setModalEditOpen(true);
  };

  const deleteItem = item => {
    deleteSales(item.RecordId); //RetailAPI
    setSalesDtl(prevSales => {
      return prevSales.filter(val => val.RecordId != item.RecordId);
    });
  };

  function ItemList({item, index}) {
    let nIndex = index + 1;
    let nItemPrce = item.ItemPrce.toFixed(2).replace(
      /\d(?=(\d{3})+\.)/g,
      '$&,',
    );

    var swipeEdit = [
      {
        text: 'Edit',
        backgroundColor: 'rgb(0,64,128)',
        onPress: () => editItem(item),
      },
    ];
    var swipeDelete = [
      {
        text: 'Delete',
        backgroundColor: 'red',
        onPress: () => deleteItem(item),
      },
    ];

    return (
      <View style={styles.itemContainer}>
        <Swipeout
          left={swipeEdit}
          right={swipeDelete}
          backgroundColor={'#00000000'}
          sensitivity={70}
          autoClose={true}>
          <View style={styles.textCodeView}>
            <Text style={styles.textOtherCde}>
              {nIndex.toString().trim()}- Code: {item.OtherCde}
            </Text>
            <Text style={styles.textItem}>Price: {nItemPrce}</Text>
          </View>
          <View style={styles.textCodeView}>
            <Text style={styles.textDate____}>{item.Date____}</Text>
            <Text style={styles.textItem}>Qty.: {item.Quantity}</Text>
          </View>
          <Text style={styles.textDescript}>{item.Descript.substr(0, 50)}</Text>
        </Swipeout>
      </View>
    );
  }

  return (
    <>
      <Header navigation={navigation} title={'Sales'} iconName={'home'} />
      <ModalSales />
      <ModalEditSales currentItem={setCurrentItem} />
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require('../images/abstract_blue.png')}
          style={styles.imgBackground}
          imageStyle={styles.imgStyle}
        />
        <DateInfo />
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

        <View style={styles.bottomMenu}>
          <TouchableOpacity>
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

          <TouchableOpacity>
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

          <TouchableOpacity onPress={() => setModalOpen(true)}>
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
