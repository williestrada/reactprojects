import React, {useEffect, useState} from 'react';

import {
  Platform,
  Alert,
  PermissionsAndroid,
  ActivityIndicator,
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
  const [isLoading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [salesDtl, setSalesDtl] = useState([
    {
      Date____: Date(),
      Quantity: 1,
      OtherCde: '123456',
      Descript: 'San Miguel Pale Pilsen',
      ItemPrce: 1200.55,
    },
  ]);

  useEffect(() => {
    console.log('Fetching masterfile');
    getMasterFile();
  }, []);

  async function getMasterFile() {
    const RNFS = require('react-native-fs');
    const downloadPath = `${RNFS.DownloadDirectoryPath}/masterfile.json`;

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          message: 'InfoPlus needs access to your storage to read a file.',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        const newData = [];
        const masterData = await RNFS.readFile(downloadPath, 'utf8');
        const updatedMasterData = JSON.parse(masterData).map(mFile => {
          if (true) {
            let OtherCde = mFile.OtherCde;
            let Descript = mFile.Descript;
            let ItemPrce = mFile.ItemPrce;
            const dataProduct = {OtherCde, Descript, ItemPrce};
            newData.push(dataProduct);
          }
        });
        await setProduct(newData);
        setLoading(false);
      }
    } catch (err) {
      alert(err);
    }
  }

  return (
    <UserContext.Provider
      value={{
        product,
        setProduct,
        salesDtl,
        setSalesDtl,
        isLoading,
        setLoading,
        modalOpen,
        setModalOpen,
      }}>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Sales"
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
