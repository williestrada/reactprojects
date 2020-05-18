import React, {useContext} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import Header from './Header';
import DateInfo from './DateInfo';
import CountData from './CountData';
import UserContext from './UserContext';
import Icon from 'react-native-vector-icons/Fontisto';
import {TouchableOpacity} from 'react-native-gesture-handler';

function Products({navigation}) {
  const {product, isLoading, setLoading} = useContext(UserContext);
  let txtSearch = 'GARMIN';
  const dataList = product.filter(
    mFile =>
      mFile.Descript.includes(txtSearch) || mFile.OtherCde.includes(txtSearch),
  );

  console.log('Rendering Product component');
  function ItemList({item, index}) {
    let nIndex = index + 1;
    let nItemPrce = item.ItemPrce.toFixed(2).replace(
      /\d(?=(\d{3})+\.)/g,
      '$&,',
    );
    return (
      <View style={styles.itemContainer}>
        <View style={styles.textCodeView}>
          <Text style={styles.textOtherCde}>
            {nIndex.toString().trim()}- Code: {item.OtherCde}
          </Text>
          <Text style={styles.textItem}>Price: {nItemPrce}</Text>
        </View>
        <Text style={styles.textDescript}>{item.Descript.substr(0, 50)}</Text>
      </View>
    );
  }

  return (
    <>
      <Header
        navigation={navigation}
        title={'Product'}
        iconName={'shopping-cart'}
      />

      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require('../images/abstract_dark_red.png')}
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
          data={dataList}
          renderItem={({item, index}) => <ItemList item={item} index={index} />}
          keyExtractor={item => item.OtherCde}
          ListFooterComponent={() => {
            if (!dataList.length) {
              return (
                <View>
                  <Text
                    style={{
                      color: 'red',
                      alignSelf: 'center',
                    }}>
                    No items found.
                  </Text>
                  <Text
                    style={{
                      color: 'red',
                      alignSelf: 'center',
                    }}>
                    on products.
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
        <CountData data={dataList} master={product} />
        <View style={styles.bottomMenu}>
          <TouchableOpacity>
            <Icon.Button
              style={{color: 'white'}}
              size={20}
              backgroundColor="#00000000"
              name={Platform.OS === 'android' ? 'search' : 'search'}>
              <Text style={{color: 'white', fontFamily: 'Arial', fontSize: 12}}>
                Search
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

export default React.memo(Products);
