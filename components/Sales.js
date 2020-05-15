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

export default function Sales({navigation}) {
  const {product, setProduct} = useContext(UserContext);

  //alert(product);
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
        {/* <Text style={{color: 'white'}}>{product[0].OtherCde}</Text>
        <Text style={{color: 'white'}}>{product[0].Descript}</Text> */}
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
