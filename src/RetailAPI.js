//import React, {useContext} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
//import UserContext from '../components/UserContext';

// export async function fetchSales() {
//   const {salesDtl} = useContext(UserContext);

//   await AsyncStorage.getAllKeys((err, keys) => {
//     AsyncStorage.multiGet(keys, (err, sales) => {
//       const newData = [];
//       sales.map(result => {
//         // get at each key/value so you can work with it

//         if (result[0].includes('SALES')) {
//           let key = result[0];
//           let aSales = JSON.parse(result[1]);
//           let RecordId = aSales.RecordId;
//           let Date____ = aSales.Date____;
//           let OtherCde = aSales.OtherCde;
//           let Descript = aSales.Descript;
//           let Quantity = aSales.Quantity;
//           let ItemPrce = aSales.ItemPrce;

//           const sale = {
//             RecordId,
//             Date____,
//             OtherCde,
//             Descript,
//             Quantity,
//             ItemPrce,
//           };
//           newData.push(sale);
//           //console.log(newData);
//         }
//       });
//       //      setSalesDtl(saleData.concat(newData));
//       return newData;
//     });
//   });
// }

export async function deleteSales(item) {
  await AsyncStorage.removeItem('SALES' + item);
}

export async function saveSales(aSales) {
  let RecordId = aSales.RecordId;
  await AsyncStorage.setItem('SALES' + RecordId, JSON.stringify(aSales));
}
