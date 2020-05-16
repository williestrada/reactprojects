import React from 'react';
import RNFS from 'react-native-fs';
import UserContext from './UserContext';

export default async function GetMasterFile() {
  const {product, setProduct} = React.useContext(UserContext);
  const RNFS = require('react-native-fs');
  const downloadPath = `${RNFS.DownloadDirectoryPath}/DB_JUICES.json`;

  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        message: 'InfoPlus needs access to your storage to read a file.',
        buttonPositive: 'OK',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      const masterData = await RNFS.readFile(downloadPath, 'utf8');
      const updatedMasterData = JSON.parse(masterData).map(mFile => {
        let OtherCde = mFile.OtherCde;
        let Descript = mFile.Descript;
        let ItemPrce = mFile.ItemPrce;
        const dataProduct = {OtherCde, Descript, ItemPrce};
        newData.push(dataProduct);
      });
      await setProduct(updatedMasterData);
    }
  } catch (err) {
    alert(err);
  }
}
