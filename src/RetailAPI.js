import React from 'react';
import {Alert, PermissionsAndroid} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import moment from 'moment';

import UserContext from '../components/UserContext';

export function cleanString(input) {
  var output = '';
  for (var i = 0; i < input.length; i++) {
    if (input.charCodeAt(i) <= 127) {
      output += input.charAt(i);
    }
  }
  return output;
}

export function array_move(arr, old_index, new_index) {
  while (old_index < 0) {
    old_index += arr.length;
  }
  while (new_index < 0) {
    new_index += arr.length;
  }
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1;
    while (k--) {
      arr.push(undefined);
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
}

export function delay(ms) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}

export async function deleteSales(item) {
  await AsyncStorage.removeItem('SALES' + item);
}

export async function deleteCount(item) {
  await AsyncStorage.removeItem('COUNT' + item);
}

export async function saveSales(aSales) {
  let RecordId = aSales.RecordId;
  await AsyncStorage.setItem('SALES' + RecordId, JSON.stringify(aSales));
}
export async function saveCount(aCount) {
  let RecordId = aCount.RecordId;
  await AsyncStorage.setItem('COUNT' + RecordId, JSON.stringify(aCount));
}

export async function csvToJSON(csv) {
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

export const getSettings = async prop => {
  const aSettings = await AsyncStorage.getItem('SETUP');
  if (aSettings != null) {
    await JSON.parse(aSettings).map(setup => {
      switch (prop) {
        case 'Location':
          return setup.Location;
          break;
        case 'UserName':
          return setup.UserName;
          break;
        case 'MastFile':
          return setup.MastFile;
          break;
      }
    });
  } else {
    return '';
  }
};

export async function countToCSV(aCount = null, clearData) {
  if (aCount === null || !aCount.length) {
    alert('There are no items to export.');
    return null;
  }

  let csvHeader =
    'RecordId,Date____,OtherCde,Descript,Quantity,ItemCode,Location,UserName,DeviceId' +
    '\r\n';
  let csvStr = '';
  let csvData = '';

  aCount.map(count => {
    let RecordId = count.RecordId;
    let Date____ = count.Date____;
    let OtherCde = count.OtherCde;
    let Descript = count.Descript.replace(/,|_/g, ';'); //remove commas in text field
    let Quantity = count.Quantity;
    let ItemCode = count.ItemCode;
    let Location = count.Location;
    let UserName = count.UserName;
    let DeviceId = count.DeviceId;
    let Is_Saved = count.Is_Saved;
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
      ItemCode +
      ',' +
      Location +
      ',' +
      UserName +
      ',' +
      DeviceId +
      ',' +
      '\r\n';
    if (clearData) {
      AsyncStorage.removeItem('COUNT' + RecordId);
    }
  });
  csvData = csvHeader + csvStr;
  await exportToCSV(csvData, 'CNT');
}

export async function salesToCSV(aSales = null, clearData) {
  if (aSales === null || !aSales.length) {
    alert('There are no items to export.');
    return null;
  }

  let csvHeader =
    'RecordId,Date____,OtherCde,Descript,Quantity,ItemCode,ItemPrce,Location,DeviceId' +
    '\r\n';
  let csvStr = '';
  let csvData = '';

  aSales.map(sales => {
    let RecordId = sales.RecordId;
    let Date____ = sales.Date____;
    let OtherCde = sales.OtherCde;
    let Descript = sales.Descript.replace(/,|_/g, ';'); //remove commas in text field
    let Quantity = sales.Quantity;
    let ItemCode = sales.ItemCode;
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
      ItemCode +
      ',' +
      ItemPrce +
      ',' +
      Location +
      ',' +
      DeviceId +
      ',' +
      '\r\n';
    if (clearData) {
      AsyncStorage.removeItem('SALES' + RecordId);
    }
  });
  csvData = csvHeader + csvStr;
  await exportToCSV(csvData, 'SAL');
}

async function exportToCSV(csvData, cTitle) {
  let objSetup = await AsyncStorage.getItem('SETUP');
  if (objSetup == null) return;
  let cLocation = '';
  let cUserName = '';
  JSON.parse(objSetup).map(setup => {
    cLocation = setup.Location.trim()
      .substr(0, 5)
      .replace(/\ /g, '');
    cUserName = setup.UserName.trim()
      .substr(0, 5)
      .replace(/\ /g, '');
  });

  let RNFS = require('react-native-fs');
  let csvFileName =
    cLocation +
    '_' +
    cTitle +
    '_' +
    cUserName +
    '_' +
    moment()
      .format('L')
      .replace(/\//g, '')
      .substr(0, 4) +
    moment()
      .format('LT')
      .substr(0, 5)
      .replace(/\:/g, '') +
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

      //alert('Success', csvFileName + ' file saved to your download folder');
      Alert.alert(
        'Success',
        csvFileName + ' file is saved to your download folder',
        [{text: 'Ok', onPress: () => null}],
      );
    } else {
      alert('Permission denied');
    }
  } catch (err) {
    Alert.alert('Error!', err);
  }
}

// export async function fetchRetailDb() {
//   await fetch('http://192.168.68.106:5000/findInven')
//     .then(response => response.json())
//     .then(data => {
//       console.log('Inventory data fetched', data);
//       return data;
//     })
//     .catch(error => {
//       console.log(error);
//     });
// }

export async function addCountDb(count) {
  await fetch('http://192.168.68.106:5000/count', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(count),
  })
    .then(response => response.json())
    .then(data => {
      //console.log('Count data added', data);
    })
    .catch(error => {
      console.log(error);
    });
}

export async function editCountDb(count, cRecordId) {
  await fetch('http://192.168.68.106:5000/count/' + cRecordId, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(count),
  })
    .then(response => response.json())
    .then(data => {
      //console.log('Count data edited', data);
    })
    .catch(error => {
      console.log(error);
    });
}

export async function deleteCountDb(cRecordId) {
  await fetch('http://192.168.68.106:5000/count/' + cRecordId, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
  })
    .then(response => response.json())
    .catch(error => {
      console.log(error);
    });
}

export async function addSalesDb(sales) {
  await fetch('http://192.168.68.106:5000/sales', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(sales),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Sales data added', data);
    })
    .catch(error => {
      console.log(error);
    });
}

export async function editSalesDb(sales, cRecordId) {
  await fetch('http://192.168.68.106:5000/sales/' + cRecordId, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(sales),
  })
    .then(response => response.json())
    .then(data => {
      console.log('Sales data edited', data);
    })
    .catch(error => {
      console.log(error);
    });
}

export async function deleteSalesDb(cRecordId) {
  await fetch('http://192.168.68.106:5000/sales/' + cRecordId, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'},
  })
    .then(response => response.json())
    .catch(error => {
      console.log(error);
    });
}
