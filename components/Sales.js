import React, {useContext} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ImageBackground,
  StyleSheet,
} from 'react-native';

import Header from './Header';
import DateInfo from './DateInfo';
import UserContext from './UserContext';

async function getProduct(product, item) {
  return await product.filter(data => data.OtherCde.includes(item));
}

export default function Sales({navigation}) {
  const {product, setProduct} = useContext(UserContext);
  // const item = getProduct(product, '987654');
  // alert(item);
  return (
    <>
      <Header navigation={navigation} title={'Sales'} iconName={'home'} />
      <SafeAreaView style={styles.container}>
        <ImageBackground
          source={require('../images/abstract_blue.png')}
          style={styles.imgBackground}
          imageStyle={styles.imgStyle}
        />
        <DateInfo />
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
});
