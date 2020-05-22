//import React, {useContext} from 'react';
import {Alert, PermissionsAndroid} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import RNFS from 'react-native-fs';

export async function deleteSales(item) {
  await AsyncStorage.removeItem('SALES' + item);
}

export async function saveSales(aSales) {
  let RecordId = aSales.RecordId;
  await AsyncStorage.setItem('SALES' + RecordId, JSON.stringify(aSales));
}

export async function salesToCSV(aSales = null) {
  if (aSales === null || !aSales.length) {
    alert('There are no items to export.');
    return null;
  }

  let csvHeader =
    'RecordId,Date____,OtherCde,Descript,Quantity,ItemPrce,Location,DeviceId' +
    '\r\n';
  let csvStr = '';
  let csvData = '';

  aSales.map(sales => {
    let RecordId = sales.RecordId;
    let Date____ = sales.Date____;
    let OtherCde = sales.OtherCde;
    let Descript = sales.Descript.replace(/,|_/g, ';'); //remove commas in text field
    let Quantity = sales.Quantity;
    let ItemPrce = sales.ItemPrce;
    let Location = sales.Location;
    let DeviceId = sales.DeviceId;
    csvStr +=
      RecordId +
      ',' +
      Date____ +
      ',' +
      OtherCde +
      ',' +
      Descript +
      ',' +
      Quantity +
      ',' +
      ItemPrce +
      ',' +
      Location +
      ',' +
      DeviceId +
      ',' +
      '\r\n';
  });
  csvData = csvHeader + csvStr;
  await exportToCSV(csvData, 'Sales');
}

async function exportToCSV(csvData, cTitle) {
  let RNFS = require('react-native-fs');
  let csvFileName =
    'Retail_' +
    cTitle +
    '_' +
    Date()
      .substring(19, 24)
      .replace(':', '') +
    '.csv';
  let path = RNFS.DownloadDirectoryPath + '/' + csvFileName;
  // write the file
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        message: 'InfoPlus needs access to your storage to allow export.',
        buttonPositive: 'OK',
      },
    );

    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      await RNFS.writeFile(path, csvData, 'utf8');

      alert(csvFileName + ' file saved to your download folder');
    } else {
      alert('Permission denied');
    }
  } catch (err) {
    Alert.alert('Error!', err);
  }
}
