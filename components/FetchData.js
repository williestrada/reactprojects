async function getDataFile(jsonData) {
  const newData = [];
  JSON.parse(jsonData).map(mFile => {
    let OtherCde = mFile.OtherCde;
    let Descript = mFile.Descript;
    let ItemPrce = mFile.ItemPrce;
    const dataProduct = {OtherCde, Descript, ItemPrce};
    newData.push(dataProduct);
  });
  //console.log(newData);
  setProduct(newData);
}

async function productFile() {
  let RNFS = require('react-native-fs');
  let storedFileName = 'DB_JUICES.json';
  let path = RNFS.DownloadDirectoryPath + '/' + storedFileName;
  let ext = /[.]/.exec(storedFileName)
    ? /[^.]+$/.exec(storedFileName)
    : undefined;

  const newData = [];
  // read the file
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
          //console.log(contents);
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
