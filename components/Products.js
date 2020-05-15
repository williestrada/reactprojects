import React, {useContext} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import Header from './Header';
import DateInfo from './DateInfo';
import CountData from './CountData';
import UserContext from './UserContext';

export default function Products({navigation}) {
  const {product, setProduct} = useContext(UserContext);

  // useEffect(() => {
  //   //productFile();
  // }, []); //passing empty array here wil make sure useeffect runs only once

  function ItemList({item, index}) {
    return (
      <View
        style={{
          ...styles.itemContainer,
          backgroundColor: index % 2 == 0 ? 'lightgrey' : '#FFFFFF',
        }}>
        <TouchableOpacity>
          <View style={styles.textCodeView}>
            <Text style={styles.textOtherCde}>Bar Code: {item.OtherCde}</Text>
            <Text style={styles.textItem}>Price: {item.ItemPrce}</Text>
          </View>
          <Text style={styles.textDescript}>{item.Descript}</Text>
        </TouchableOpacity>
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
        <FlatList
          data={product}
          renderItem={({item, index}) => <ItemList item={item} index={index} />}
          keyExtractor={item => item.OtherCde}
          ListFooterComponent={() => {
            if (!product.length) {
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
        <CountData data={product} />
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
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 10,
    padding: 3,
    paddingLeft: 5,
    paddingRight: 5,
    marginVertical: 2,
    marginHorizontal: 10,
    backgroundColor: 'rgba(250,250,250,0.6)',
    //    alignItems: 'center', //centers the delete button
  },
  textCodeView: {
    flexDirection: 'row',
  },
  textOtherCde: {
    flex: 2,
    fontSize: 12,
    fontWeight: 'bold',
  },
  textItem: {
    fontSize: 12,
  },
  textDescript: {
    fontStyle: 'italic',
    fontSize: 12,
  },
});
