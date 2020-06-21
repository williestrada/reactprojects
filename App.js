import React, {useEffect, useState} from 'react';

import {Platform, PermissionsAndroid} from 'react-native';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {NavigationContainer} from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import MaterialComIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-community/async-storage';

import Sales from './components/Sales';
import Count from './components/Count';
import Products from './components/Products';
import Settings from './components/Settings';
import CustomDrawer from './components/CustomDrawer';
import UserContext from './components/UserContext';
//import {insertData} from './components/ConnectDB';

const Drawer = createDrawerNavigator();

export default function App() {
  const [salesDtl, setSalesDtl] = useState([]);
  const [salesItem, setSalesItem] = useState([]);
  const [product, setProduct] = useState([]);

  const [isLoading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditOpen, setModalEditOpen] = useState(false);
  const [totalSales, setTotalSales] = useState(0); //Just for CountData
  const [clearData, setClearData] = useState(false);
  // const [settings, setSettings] = useState(['', '', '', true]);

  useEffect(() => {
    console.log('Fetching masterfile');
    getMasterFile();
  }, []);

  // async function getSettings() {
  //   let cLocation = '';
  //   let cUserName = '';
  //   let cMastFile = '';
  //   let lClearDta = true;
  //   let objSetup = await AsyncStorage.getItem('SETUP');
  //   if (objSetup == null) return;
  //   JSON.parse(objSetup).map(setup => {
  //     cLocation = setup.Location.trim();
  //     cUserName = setup.UserName.trim();
  //     cMastFile = setup.MastFile.trim();
  //     lClearDta = setup.ClearDta == 'true' ? true : false;
  //   });
  //   setSettings(cLocation, cUserName, cMastFile, lClearDta);
  // }

  function cleanString(input) {
    var output = '';
    for (var i = 0; i < input.length; i++) {
      if (input.charCodeAt(i) <= 127) {
        output += input.charAt(i);
      }
    }
    return output;
  }

  async function getMasterFile() {
    let lClearData = true;
    let cMastFile = '';
    let objSetup = await AsyncStorage.getItem('SETUP');
    if (objSetup == null) return;
    JSON.parse(objSetup).map(setup => {
      cMastFile = setup.MastFile.trim();
      lClearData = setup.ClearDta == 'true' ? true : false;
    });
    setClearData(lClearData); // I include to pick up clearData state here
    if (!cMastFile) return; //allow EVEN without masterfile

    let cFileExt = /[.]/.exec(cMastFile) ? /[^.]+$/.exec(cMastFile) : undefined;

    const RNFS = require('react-native-fs');
    const downloadPath = RNFS.DownloadDirectoryPath + '/' + cMastFile;

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
        let masterData = await RNFS.readFile(downloadPath, 'utf8');

        if (cFileExt == 'csv') {
          masterData = await csvJSON(masterData);
          masterData.map(mFile => {
            if (true) {
              let cDescript = cleanString(mFile.Descript);
              let Descript = cDescript;
              let OtherCde = mFile.OtherCde;
              let ItemPrce = Number(mFile.ItemPrce);
              let ItemCode = mFile.ItemCode;
              const dataProduct = {OtherCde, Descript, ItemPrce, ItemCode};
              newData.push(dataProduct);
            }
          });
        } else {
          JSON.parse(masterData).map(mFile => {
            if (true) {
              let cDescript = cleanString(mFile.Descript);
              let Descript = cDescript;
              let OtherCde = mFile.OtherCde;
              let ItemPrce = mFile.ItemPrce;
              let ItemCode = mFile.ItemCode;
              const dataProduct = {OtherCde, Descript, ItemPrce, ItemCode};
              newData.push(dataProduct);
            }
          });
        }

        await setProduct(newData);
        setLoading(false);
      }
    } catch (err) {
      alert(err);
    }
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
        salesItem,
        setSalesItem,
        modalEditOpen,
        setModalEditOpen,
        totalSales,
        setTotalSales,
        clearData,
        setClearData,
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
                <MaterialComIcon
                  size={23}
                  name={
                    Platform.OS === 'android'
                      ? 'cash-register'
                      : 'cash-register'
                  }
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Count"
            component={Count}
            options={{
              drawerIcon: config => (
                <MaterialComIcon
                  size={23}
                  name={Platform.OS === 'android' ? 'numeric' : 'numeric'}
                />
              ),
            }}
          />
          <Drawer.Screen
            name="Products"
            component={Products}
            options={{
              drawerIcon: config => (
                <FeatherIcon
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
                <FeatherIcon
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
