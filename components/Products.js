import React, {useContext, useState, useEffect} from 'react';
import {
  View,
  Text,
  ImageBackground,
  StyleSheet,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  TextInput,
  Keyboard,
} from 'react-native';
import Header from './Header';
import DateInfo from './DateInfo';
import CountData from './CountData';
import UserContext from './UserContext';
import Icon from 'react-native-vector-icons/Fontisto';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Highlighter from 'react-native-highlight-words';
import AsyncStorage from '@react-native-community/async-storage';
//import AsyncStorage from '@react-native-community/async-storage';

function Products({navigation}) {
  const {product, isLoading, setLoading} = useContext(UserContext);
  const [txtSearch, setTxtSearch] = useState('WPE');
  const [iconSearch, setIconSearch] = useState('search');
  const [labelSearch, setLabelSearch] = useState('Search');
  const [mfName, setMfName] = useState(''); //display at DateInfo
  const ITEM_HEIGHT = 40;

  txtSearch ? '' : setTxtSearch('WPE'); //clear search when txtSearch =''
  const dataList = product.filter(
    mFile =>
      mFile.Descript.toLowerCase().includes(txtSearch.toLowerCase()) ||
      mFile.OtherCde.toLowerCase().includes(txtSearch.toLowerCase()),
  );

  useEffect(() => {
    console.log('Rendering Product component');
    masterFile(); //get masterfile name
  }, []);
  const txtsearch = React.createRef();

  const masterFile = async () => {
    let objSetUp = await AsyncStorage.getItem('SETUP');
    if (objSetUp == null) return;
    let cMastFile = '';
    await JSON.parse(objSetUp).map(setup => {
      cMastFile = setup.MastFile.trim();
    });
    setMfName(cMastFile);
  };

  function ItemList({item, index}) {
    let nIndex = index + 1;
    let nItemPrce = item.ItemPrce.toFixed(2).replace(
      /\d(?=(\d{3})+\.)/g,
      '$&,',
    );

    if (nIndex != dataList.length) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    return (
      <View style={styles.itemContainer}>
        <View style={styles.textCodeView}>
          <Highlighter
            highlightStyle={{fontWeight: 'bold', color: 'orange'}}
            searchWords={[txtSearch]}
            textToHighlight={nIndex.toString() + '. # ' + item.OtherCde}
            style={styles.textOtherCde}
            //numberOfLines={1}
          />
          <Text style={styles.textItem}>Price: {nItemPrce}</Text>
        </View>
        <Highlighter
          highlightStyle={{fontWeight: 'bold', color: 'orange'}}
          searchWords={[txtSearch]}
          textToHighlight={item.Descript.substr(0, 50)}
          style={styles.textDescript}
        />
      </View>
    );
  }

  const listProduct = async cSearch => {
    !cSearch ? setIconSearch('search') : setIconSearch('close');
    !cSearch ? setLabelSearch('Search') : setLabelSearch('Clear');
    setTxtSearch(cSearch);
  };

  const clearSearch = () => {
    if (txtSearch.length > 0) {
      setIconSearch('search');
      setLabelSearch('Search');
      txtsearch.current.clear(); //tsk, clear TextInput
      Keyboard.dismiss();
    } else {
      setLabelSearch('Clear');
    }
  };
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
        <DateInfo storName={mfName} />
        <ActivityIndicator
          size="large"
          color="orange"
          animating={isLoading}
          hidesWhenStopped={true}
          style={{height: 0}}
        />

        <FlatList
          data={dataList}
          renderItem={({item, index}) => <ItemList item={item} index={index} />}
          keyExtractor={item => item.OtherCde}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          ListFooterComponent={() => {
            if (!dataList.length) {
              return (
                <View>
                  <Text
                    style={{
                      color: 'red',
                      alignSelf: 'center',
                    }}>
                    {' '}
                  </Text>
                  <Text
                    style={{
                      color: 'white',
                      alignSelf: 'center',
                    }}>
                    Search item to list
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
        <CountData data1={dataList.length} data2={product.length} />
        <View style={styles.bottomMenu}>
          <TextInput
            ref={txtsearch}
            style={styles.textInput}
            placeholder="Enter search ..."
            selectTextOnFocus={true}
            val={txtSearch}
            placeholderTextColor="grey"
            // autoCapitalize="characters"
            onChangeText={val => listProduct(val)}
          />

          <Icon.Button
            style={{color: 'white'}}
            size={20}
            backgroundColor="#00000000"
            onPress={() => clearSearch()}
            name={Platform.OS === 'android' ? iconSearch : iconSearch}>
            <Text style={{color: 'white', fontFamily: 'Arial', fontSize: 12}}>
              {labelSearch}
            </Text>
          </Icon.Button>
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
    backgroundColor: 'rgba(0,0,0,.3)',
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
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 2,
    margin: 5,
    borderWidth: 0.8,
    borderColor: 'white',
    //backgroundColor: '#333',
  },
  textInput: {
    backgroundColor: '#00000000',
    color: 'white',
    paddingLeft: 10,
    fontSize: 14,
    width: '70%',
    height: 40, //TextBox height
  },
  headingText: {
    fontWeight: 'bold',
    fontSize: 12,
    color: 'white',
    // marginBottom: 4
  },
});

export default React.memo(Products);
