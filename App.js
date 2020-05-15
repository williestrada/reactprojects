import React, {useEffect, useState} from 'react';

import {
  Button,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Platform,
  Alert,
} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import RNFS from 'react-native-fs';

import Sales from './components/Sales';
import Products from './components/Products';
import Settings from './components/Settings';
import CustomDrawer from './components/CustomDrawer';
import UserContext from './components/UserContext';

const Drawer = createDrawerNavigator();

export default function App() {
  const [product, setProduct] = useState([]);

  useEffect(() => {
    staticData();
    //productFile(); //Jethro papanu ko matatawag productFile() from here
    //para ma load ko ung DB_JUICES.json file
  }, []);

  function staticData() {
    let data = [
      {OtherCde: '123456', Descript: 'San Mig Lights', ItemPrce: 45},
      {OtherCde: '987654', Descript: 'Johnnie Walker Black', ItemPrce: 1100},
    ];
    setProduct(data);
  }

  async function getDataFile(jsonData) {
    const newData = [];
    JSON.parse(jsonData).map(mFile => {
      let OtherCde = mFile.OtherCde;
      let Descript = mFile.Descript;
      let ItemPrce = mFile.ItemPrce;
      const dataProduct = {OtherCde, Descript, ItemPrce};
      newData.push(dataProduct);
    });
    console.log(newData);
    setProduct(newData);
  }

  async function productFile() {
    let RNFS = require('react-native-fs');
    let storedFileName = 'DB_JUICES.json';
    let path = RNFS.DownloadDirectoryPath + '/' + storedFileName;
    let ext = /[.]/.exec(storedFileName)
      ? /[^.]+$/.exec(storedFileName)
      : undefined;

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
            console.log(contents);
            getDataFile(contents);
          })
          .catch(err => {
            return alert(err);
          });
      } else {
        alert('Permission denied');
      }
    } catch (err) {
      Alert.alert('Error!', err);
    }
  }

  return (
    <UserContext.Provider value={{product, staticData, setProduct}}>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Settings" // dapat initial screen ko ay Sales pero nag eeror sa rendering
          drawerContent={props => <CustomDrawer {...props} />}
          drawerStyle={{
            //backgroundColor: '#c6cbef',
            width: 250,
          }}>
          <Drawer.Screen
            name="Sales"
            component={Sales}
            options={{
              drawerIcon: config => (
                <Icon
                  size={23}
                  name={Platform.OS === 'android' ? 'home' : 'home'}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Products"
            component={Products}
            options={{
              drawerIcon: config => (
                <Icon
                  size={23}
                  name={
                    Platform.OS === 'android'
                      ? 'shopping-cart'
                      : 'shopping-cart'
                  }
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Settings"
            component={Settings}
            options={{
              drawerIcon: config => (
                <Icon
                  size={23}
                  name={Platform.OS === 'android' ? 'settings' : 'settings'}
                />
              ),
            }}
          />
        </Drawer.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
}

const styles = StyleSheet.create({
  salesContainer: {
    //    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
